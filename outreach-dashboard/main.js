const { app, BrowserWindow, ipcMain, shell, safeStorage } = require('electron');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const http = require('http');
const net = require('net');
const tls = require('tls');
const { execFile, spawn } = require('child_process');
const { requestGlm } = require('./glm-service');
const {
  normalizeTarget,
  validateLeadForExecution,
  isBlockedFacebookTarget,
  isUnavailableProfilePage,
} = require('./autoglm-bridge');

for (const stream of [process.stdout, process.stderr]) {
  if (stream && stream.on) {
    stream.on('error', (error) => {
      if (error && error.code !== 'EPIPE') throw error;
    });
  }
}

let glmAutomationRunning = false;
let lastGlmAutomationAt = 0;
let managedChromeStarted = false;

const PLATFORM_CONFIG = {
  li: {
    label: 'LinkedIn',
    hosts: new Set(['www.linkedin.com', 'linkedin.com']),
    loginUrl: 'https://www.linkedin.com/login',
    targetUrl: 'https://www.linkedin.com/search/results/people/?keywords=outdoor%20buyer%20camping%20gear',
    usernameSelectors: ['#username', 'input[name="session_key"]', 'input[type="email"]'],
    passwordSelectors: ['#password', 'input[name="session_password"]', 'input[type="password"]'],
    submitSelectors: ['button[type="submit"]'],
  },
  fb: {
    label: 'Facebook',
    hosts: new Set(['www.facebook.com', 'facebook.com']),
    loginUrl: 'https://www.facebook.com/login',
    targetUrl: 'https://www.facebook.com/search/groups/?q=outdoor%20gear%20camping%20retailer',
    usernameSelectors: ['#email', 'input[name="email"]'],
    passwordSelectors: ['#pass', 'input[name="pass"]', 'input[type="password"]'],
    submitSelectors: ['button[name="login"]', 'button[type="submit"]'],
  },
  ins: {
    label: 'Instagram',
    hosts: new Set(['www.instagram.com', 'instagram.com']),
    loginUrl: 'https://www.instagram.com/accounts/login/',
    targetUrl: 'https://www.instagram.com/explore/search/keyword/?q=outdoor%20gear%20retailer',
    usernameSelectors: ['input[name="username"]', 'input[type="text"]'],
    passwordSelectors: ['input[name="password"]', 'input[type="password"]'],
    submitSelectors: ['button[type="submit"]'],
  },
};

const ALLOWED_EXTERNAL_HOSTS = new Set(
  Object.values(PLATFORM_CONFIG).flatMap((config) => [...config.hosts]),
);

function credentialStorePath() {
  return path.join(app.getPath('userData'), 'credential-cache.json');
}

function glmStorePath() {
  return path.join(app.getPath('userData'), 'glm-config.json');
}

function vaultPath() {
  return path.join(__dirname, 'credentials.vault.json');
}

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
}

function readJsonScriptArray(file, globalName) {
  try {
    if (!fs.existsSync(file)) return [];
    const source = fs.readFileSync(file, 'utf8');
    const match = source.match(new RegExp(`window\\.${globalName}\\s*=\\s*([\\s\\S]*?);\\s*$`));
    if (!match) return [];
    const parsed = JSON.parse(match[1]);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJsonScriptArray(file, globalName, value) {
  fs.writeFileSync(file, `window.${globalName} = ${JSON.stringify(value, null, 2)};\n`);
}

function parseExecutionOutput(output) {
  try {
    return JSON.parse(String(output || '{}'));
  } catch {
    return {};
  }
}

function recordAutomationResult(item, result) {
  const sendStatus = result && result.sendStatus;
  if (!['sent_confirmed', 'send_unconfirmed', 'failed_open', 'draft_prepared', 'prepared_not_sent'].includes(sendStatus)) return;
  const output = parseExecutionOutput(result.output);
  const timestamp = new Date().toISOString();
  const entry = {
    task_id: item.id,
    approval_version: 1,
    status: sendStatus,
    agent: 'codex-chrome-extension',
    timestamp,
    target_url: result.targetUrl || (result.chromeOpen && result.chromeOpen.targetUrl) || item.url || '',
    evidence: output.evidence || result.evidence || sendStatus,
  };
  const file = path.join(__dirname, 'autonomous-outreach-results.js');
  const results = readJsonScriptArray(file, 'AUTONOMOUS_OUTREACH_RESULTS');
  const duplicate = results.some(existing => existing.task_id === entry.task_id
    && existing.status === entry.status
    && existing.target_url === entry.target_url);
  if (!duplicate) {
    results.push(entry);
    writeJsonScriptArray(file, 'AUTONOMOUS_OUTREACH_RESULTS', results);
  }
}

function securityFindings() {
  const blockedFiles = [
    'credentials.local.json',
    'credentials.plain.json',
    '.env',
    '.env.local',
    '.env.production',
  ];
  return blockedFiles
    .filter((file) => fs.existsSync(path.join(__dirname, file)))
    .map((file) => `Plaintext credential file detected: ${file}`);
}

function loadCredentialCache() {
  return readJson(credentialStorePath(), { version: 1, credentials: {} });
}

function saveCredentialCache(cache) {
  writeJson(credentialStorePath(), cache);
}

function encryptForLocalCache(value) {
  const plaintext = Buffer.from(JSON.stringify(value), 'utf8');
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('OS credential encryption is not available on this computer.');
  }
  return safeStorage.encryptString(plaintext.toString('utf8')).toString('base64');
}

function decryptFromLocalCache(ciphertext) {
  if (!safeStorage.isEncryptionAvailable()) return null;
  return JSON.parse(safeStorage.decryptString(Buffer.from(ciphertext, 'base64')));
}

function getCachedCredential(platform) {
  const cache = loadCredentialCache();
  const entry = cache.credentials && cache.credentials[platform];
  if (!entry || !entry.encrypted) return null;
  try {
    return decryptFromLocalCache(entry.encrypted);
  } catch {
    return null;
  }
}

function setCachedCredential(platform, credential) {
  const cache = loadCredentialCache();
  cache.credentials = cache.credentials || {};
  cache.credentials[platform] = {
    encrypted: encryptForLocalCache(credential),
    updatedAt: new Date().toISOString(),
  };
  saveCredentialCache(cache);
}

function loadGlmConfig() {
  const config = readJson(glmStorePath(), null);
  if (!config || !config.encryptedApiKey) {
    const envApiKey = process.env.ZHIPUAI_API_KEY || process.env.GLM_API_KEY;
    if (!envApiKey) return null;
    return {
      baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
      model: process.env.GLM_MODEL || 'glm-5.2',
      apiKey: envApiKey,
      source: 'env',
    };
  }
  try {
    return {
      baseUrl: config.baseUrl || 'https://open.bigmodel.cn/api/paas/v4',
      model: config.model || 'glm-5.2',
      apiKey: decryptFromLocalCache(config.encryptedApiKey),
      source: 'local-cache',
    };
  } catch {
    return null;
  }
}

function saveGlmConfig(config) {
  writeJson(glmStorePath(), {
    version: 1,
    baseUrl: config.baseUrl || 'https://open.bigmodel.cn/api/paas/v4',
    model: config.model || 'glm-5.2',
    encryptedApiKey: encryptForLocalCache(config.apiKey),
    updatedAt: new Date().toISOString(),
  });
}

function openClawCommand() {
  const candidates = [
    process.env.APPDATA && path.join(process.env.APPDATA, 'npm', 'openclaw.cmd'),
    process.env.USERPROFILE && path.join(process.env.USERPROFILE, 'AppData', 'Roaming', 'npm', 'openclaw.cmd'),
    'openclaw.cmd',
  ].filter(Boolean);
  return candidates.find((candidate) => candidate !== 'openclaw.cmd' && fs.existsSync(candidate)) || 'openclaw.cmd';
}

function deriveVaultKey(masterPassword, salt) {
  return crypto.pbkdf2Sync(masterPassword, Buffer.from(salt, 'base64'), 210000, 32, 'sha256');
}

function encryptVault(credentials, masterPassword) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = deriveVaultKey(masterPassword, salt.toString('base64'));
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(credentials), 'utf8'),
    cipher.final(),
  ]);
  return {
    version: 1,
    algorithm: 'aes-256-gcm',
    kdf: 'pbkdf2-sha256',
    iterations: 210000,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    ciphertext: ciphertext.toString('base64'),
    updatedAt: new Date().toISOString(),
  };
}

function decryptVault(vault, masterPassword) {
  if (!vault || !vault.ciphertext) throw new Error('Encrypted credential vault is missing.');
  const key = deriveVaultKey(masterPassword, vault.salt);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(vault.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(vault.tag, 'base64'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(vault.ciphertext, 'base64')),
    decipher.final(),
  ]).toString('utf8');
  return JSON.parse(plaintext);
}

function validatePlatform(platform) {
  if (!PLATFORM_CONFIG[platform]) throw new Error(`Unknown platform: ${platform}`);
  return PLATFORM_CONFIG[platform];
}

function validateExternalUrl(url) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') {
    throw new Error(`Blocked external URL: ${url}`);
  }
  return parsed;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Customer Automated Development System',
    icon: path.join(__dirname, 'icon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile('outreach-dashboard.html');
  win.setMenuBarVisibility(false);
}

function createPlatformWindow(platform, credential) {
  const config = validatePlatform(platform);
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    title: `${config.label} Customer Acquisition`,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  let attemptedLoginFill = false;
  win.loadURL(config.targetUrl);

  win.webContents.on('did-finish-load', async () => {
    const currentUrl = win.webContents.getURL();
    let parsed;
    try {
      parsed = new URL(currentUrl);
    } catch {
      return;
    }
    if (!config.hosts.has(parsed.hostname)) return;

    const loginLike = currentUrl.includes('login') || currentUrl.includes('checkpoint') || currentUrl.includes('accounts/login');
    if (!loginLike || attemptedLoginFill || !credential || !credential.username || !credential.password) return;
    attemptedLoginFill = true;

    const payload = {
      username: credential.username,
      password: credential.password,
      usernameSelectors: config.usernameSelectors,
      passwordSelectors: config.passwordSelectors,
      submitSelectors: config.submitSelectors,
    };

    await win.webContents.executeJavaScript(`
      (() => {
        const payload = ${JSON.stringify(payload)};
        const first = (selectors) => selectors.map((selector) => document.querySelector(selector)).find(Boolean);
        const setValue = (el, value) => {
          if (!el) return false;
          el.focus();
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        };
        const userOk = setValue(first(payload.usernameSelectors), payload.username);
        const passOk = setValue(first(payload.passwordSelectors), payload.password);
        const submit = first(payload.submitSelectors);
        if (userOk && passOk && submit) {
          setTimeout(() => submit.click(), 450);
          return 'submitted';
        }
        return 'filled-partial';
      })();
    `).catch(() => null);
  });

  return win;
}

function execFilePromise(file, args, options) {
  return new Promise((resolve, reject) => {
    execFile(file, args, options, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

function httpJson(url, timeoutMs = 2000, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { timeout: timeoutMs, method }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(body || `HTTP ${res.statusCode}: ${url}`));
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('timeout', () => {
      req.destroy(new Error(`Timeout: ${url}`));
    });
    req.on('error', reject);
    req.end();
  });
}

async function activeChromeDebugPort() {
  for (const port of [9225, 9224, 9223, 9222]) {
    try {
      await httpJson(`http://127.0.0.1:${port}/json/version`, 1200);
      return port;
    } catch {
      // Try the next known debugging port.
    }
  }
  return 0;
}

function chromeExecutablePath() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe'),
  ].filter(Boolean);
  return candidates.find(candidate => fs.existsSync(candidate)) || candidates[0];
}

async function ensureCodexChromePort() {
  const existing = await activeChromeDebugPort();
  if (existing) return existing;
  if (!managedChromeStarted) {
    managedChromeStarted = true;
    const profile = path.join(app.getPath('userData'), 'codex-chrome-profile');
    fs.mkdirSync(profile, { recursive: true });
    const chromeProcess = spawn(chromeExecutablePath(), [
      '--remote-debugging-port=9224',
      '--remote-allow-origins=*',
      `--user-data-dir=${profile}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--start-maximized',
      '--new-window',
      'about:blank',
    ], { detached: true, stdio: 'ignore', windowsHide: false });
    chromeProcess.unref();
  }
  for (let i = 0; i < 10; i += 1) {
    await sleep(700);
    const port = await activeChromeDebugPort();
    if (port) return port;
  }
  return 0;
}

async function openWithCodexChrome(url) {
  const parsed = validateExternalUrl(url);
  const port = await ensureCodexChromePort();
  if (!port) {
    await shell.openExternal(parsed.toString());
    return { ok: true, engine: 'shell-fallback', targetUrl: parsed.toString() };
  }
  const opened = await httpJson(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(parsed.toString())}`, 2500, 'PUT');
  await activateChromeTarget(port, opened);
  const inspected = await inspectOpenedChromeTab(opened, parsed.toString());
  if (inspected.unavailable) {
    return {
      ok: false,
      engine: 'codex-chrome-extension-cdp',
      port,
      targetUrl: parsed.toString(),
      tabId: opened.id || '',
      title: inspected.title || opened.title || '',
      status: 'failed_open',
      error: 'profile_unavailable_or_broken_link',
      evidence: inspected.evidence,
    };
  }
  return {
    ok: true,
    engine: 'codex-chrome-extension-cdp',
    port,
    targetUrl: parsed.toString(),
    tabId: opened.id || '',
    title: inspected.title || opened.title || '',
  };
}

async function activateChromeTarget(port, opened) {
  if (!opened || !opened.id) return;
  await httpJson(`http://127.0.0.1:${port}/json/activate/${opened.id}`, 1500).catch(() => null);
  await cdpCommand(opened.webSocketDebuggerUrl, 'Page.bringToFront', {}, 1500);
  const windowInfo = await cdpCommand(opened.webSocketDebuggerUrl, 'Browser.getWindowForTarget', {
    targetId: opened.id,
  }, 1500);
  if (windowInfo && Number.isFinite(windowInfo.windowId)) {
    await cdpCommand(opened.webSocketDebuggerUrl, 'Browser.setWindowBounds', {
      windowId: windowInfo.windowId,
      bounds: { windowState: 'normal' },
    }, 1500);
  }
}

function cdpCommand(wsUrl, method, params = {}, timeoutMs = 2500) {
  if (!wsUrl) return Promise.resolve(null);
  if (typeof WebSocket !== 'undefined') {
    return cdpCommandNativeWebSocket(wsUrl, method, params, timeoutMs);
  }
  return cdpCommandRawSocket(wsUrl, method, params, timeoutMs);
}

function cdpCommandNativeWebSocket(wsUrl, method, params = {}, timeoutMs = 2500) {
  return new Promise((resolve) => {
    let settled = false;
    const id = 1;
    let socket;
    const done = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { socket.close(); } catch {}
      resolve(value);
    };
    const timer = setTimeout(() => done(null), timeoutMs);
    try {
      socket = new WebSocket(wsUrl);
    } catch {
      clearTimeout(timer);
      cdpCommandRawSocket(wsUrl, method, params, timeoutMs).then(resolve);
      return;
    }
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ id, method, params }));
    });
    socket.addEventListener('message', async (event) => {
      try {
        let raw;
        if (typeof event.data === 'string') raw = event.data;
        else if (Buffer.isBuffer(event.data)) raw = event.data.toString('utf8');
        else if (event.data && typeof event.data.arrayBuffer === 'function') raw = Buffer.from(await event.data.arrayBuffer()).toString('utf8');
        else raw = String(event.data || '');
        const message = JSON.parse(raw);
        if (message.id === id) done(message.result || null);
      } catch {
        done(null);
      }
    });
    socket.addEventListener('error', () => {
      if (settled) return;
      clearTimeout(timer);
      try { socket.close(); } catch {}
      cdpCommandRawSocket(wsUrl, method, params, timeoutMs).then(resolve);
    });
  });
}

function encodeWebSocketFrame(text) {
  const payload = Buffer.from(text, 'utf8');
  const length = payload.length;
  let header;
  if (length < 126) {
    header = Buffer.alloc(6);
    header[0] = 0x81;
    header[1] = 0x80 | length;
    crypto.randomFillSync(header, 2, 4);
  } else if (length < 65536) {
    header = Buffer.alloc(8);
    header[0] = 0x81;
    header[1] = 0x80 | 126;
    header.writeUInt16BE(length, 2);
    crypto.randomFillSync(header, 4, 4);
  } else {
    header = Buffer.alloc(14);
    header[0] = 0x81;
    header[1] = 0x80 | 127;
    header.writeBigUInt64BE(BigInt(length), 2);
    crypto.randomFillSync(header, 10, 4);
  }
  const maskOffset = header.length - 4;
  const masked = Buffer.alloc(payload.length);
  for (let index = 0; index < payload.length; index += 1) {
    masked[index] = payload[index] ^ header[maskOffset + (index % 4)];
  }
  return Buffer.concat([header, masked]);
}

function decodeWebSocketFrames(buffer) {
  const frames = [];
  let offset = 0;
  while (buffer.length - offset >= 2) {
    const first = buffer[offset];
    const second = buffer[offset + 1];
    const opcode = first & 0x0f;
    const masked = Boolean(second & 0x80);
    let length = second & 0x7f;
    let headerLength = 2;
    if (length === 126) {
      if (buffer.length - offset < 4) break;
      length = buffer.readUInt16BE(offset + 2);
      headerLength = 4;
    } else if (length === 127) {
      if (buffer.length - offset < 10) break;
      const large = buffer.readBigUInt64BE(offset + 2);
      if (large > BigInt(Number.MAX_SAFE_INTEGER)) break;
      length = Number(large);
      headerLength = 10;
    }
    const maskLength = masked ? 4 : 0;
    const frameLength = headerLength + maskLength + length;
    if (buffer.length - offset < frameLength) break;
    const mask = masked ? buffer.subarray(offset + headerLength, offset + headerLength + 4) : null;
    const payloadStart = offset + headerLength + maskLength;
    const payload = Buffer.from(buffer.subarray(payloadStart, payloadStart + length));
    if (mask) {
      for (let index = 0; index < payload.length; index += 1) payload[index] ^= mask[index % 4];
    }
    frames.push({ opcode, text: payload.toString('utf8') });
    offset += frameLength;
  }
  return { frames, rest: buffer.subarray(offset) };
}

function cdpCommandRawSocket(wsUrl, method, params = {}, timeoutMs = 2500) {
  return new Promise((resolve) => {
    const parsed = new URL(wsUrl);
    const secure = parsed.protocol === 'wss:';
    const port = Number(parsed.port || (secure ? 443 : 80));
    const key = crypto.randomBytes(16).toString('base64');
    const request = [
      `GET ${parsed.pathname}${parsed.search} HTTP/1.1`,
      `Host: ${parsed.host}`,
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Key: ${key}`,
      'Sec-WebSocket-Version: 13',
      '',
      '',
    ].join('\r\n');
    let settled = false;
    const id = 1;
    let handshakeDone = false;
    let buffer = Buffer.alloc(0);
    const done = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { socket.close(); } catch {}
      try { socket.destroy(); } catch {}
      resolve(value);
    };
    const timer = setTimeout(() => done(null), timeoutMs);
    let socket;
    try {
      socket = secure
        ? tls.connect({ host: parsed.hostname, port, servername: parsed.hostname })
        : net.connect({ host: parsed.hostname, port });
    } catch {
      clearTimeout(timer);
      resolve(null);
      return;
    }
    socket.on('connect', () => {
      socket.write(request);
    });
    socket.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      if (!handshakeDone) {
        const headerEnd = buffer.indexOf('\r\n\r\n');
        if (headerEnd === -1) return;
        const header = buffer.subarray(0, headerEnd).toString('utf8');
        if (!/^HTTP\/1\.1 101/i.test(header)) {
          done(null);
          return;
        }
        handshakeDone = true;
        buffer = buffer.subarray(headerEnd + 4);
        socket.write(encodeWebSocketFrame(JSON.stringify({ id, method, params })));
      }
      const decoded = decodeWebSocketFrames(buffer);
      buffer = decoded.rest;
      for (const frame of decoded.frames) {
        if (frame.opcode === 8) {
          done(null);
          return;
        }
        if (frame.opcode !== 1) continue;
        try {
          const message = JSON.parse(frame.text);
          if (message.id === id) {
            done(message.result || null);
            return;
          }
        } catch {
          done(null);
          return;
        }
      }
    });
    socket.on('error', () => done(null));
    socket.on('close', () => done(null));
  });
}

async function inspectOpenedChromeTab(opened, expectedUrl) {
  if (!opened || !opened.webSocketDebuggerUrl) {
    return { unavailable: false, title: opened && opened.title || '', evidence: '' };
  }
  await sleep(2200);
  const expression = `(() => JSON.stringify({
    url: location.href,
    title: document.title,
    text: (document.body && document.body.innerText || '').slice(0, 2000)
  }))()`;
  const result = await cdpCommand(opened.webSocketDebuggerUrl, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
  });
  let page = { url: expectedUrl, title: opened.title || '', text: '' };
  try {
    const value = result && result.result && result.result.value;
    page = { ...page, ...JSON.parse(value || '{}') };
  } catch {
    // Keep the conservative default when Chrome inspection is unavailable.
  }
  const unavailable = isUnavailableProfilePage(page);
  return {
    unavailable,
    title: page.title || '',
    evidence: unavailable ? `unavailable_profile_page: ${String(page.text || page.title || '').slice(0, 180)}` : '',
  };
}

async function evaluateChromeTabJson(opened, expression, timeoutMs = 8000) {
  if (!opened || !opened.webSocketDebuggerUrl) return null;
  const result = await cdpCommand(opened.webSocketDebuggerUrl, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
  }, timeoutMs);
  try {
    if (result && result.exceptionDetails) {
      return {
        ok: false,
        sendStatus: 'approval_pending',
        evidence: `runtime_exception: ${result.exceptionDetails.text || 'unknown'}`,
        nextAction: 'Review the profile manually; browser script raised an exception.',
      };
    }
    const value = result && result.result && result.result.value;
    return JSON.parse(value || 'null');
  } catch {
    return null;
  }
}

function parseDriverJson(stdout) {
  const text = String(stdout || '').trim();
  if (!text) return null;
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function runCodexChromeDriver(command, payload) {
  const driverPath = path.join(__dirname, 'codex-chrome-driver.js');
  if (!fs.existsSync(driverPath)) return null;
  const nodeCommand = process.env.NODE_EXE || process.env.npm_node_execpath || 'node';
  const args = [driverPath, command, JSON.stringify(payload || {})];
  try {
    const result = await execFilePromise(nodeCommand, args, {
      windowsHide: true,
      timeout: 30000,
      maxBuffer: 2 * 1024 * 1024,
    });
    return parseDriverJson(result.stdout);
  } catch (error) {
    const parsed = parseDriverJson(error && error.stdout);
    if (parsed) return parsed;
    return {
      ok: false,
      sendStatus: 'approval_pending',
      evidence: `driver_error: ${error && error.message || 'unknown'}`,
      nextAction: 'Review the profile manually; Codex Chrome driver could not complete the browser action.',
    };
  }
}

async function inspectSocialContext(opened) {
  return await runCodexChromeDriver('inspect-social-context', {
    port: opened && opened.port,
    tabId: opened && opened.tabId,
    targetUrl: opened && opened.targetUrl,
  });
}

function contextAwareFallbackDraft(lead, baseDraft, contextText) {
  const context = String(contextText || '').toLowerCase();
  const company = String(lead?.company || lead?.name || 'your team').replace(/\s*\([^)]*\)\s*/g, ' ').trim();
  if (/email|e-mail|whatsapp|whats app|pdf|catalog|catalogue|line sheet|too big|pic is too big|share you the pdf/i.test(context)) {
    return [
      `Thanks, ${company} team. Email or WhatsApp works well.`,
      'Could you share the best buyer/category contact for camping accessories vendor review?',
      'I will send a concise FLEXTAIL and Vollyc brand intro, line sheet, and current product specs through that channel.',
    ].join(' ');
  }
  return String(baseDraft || '').trim();
}

function buildContextOptimizationMessages(lead, baseDraft, context) {
  return [
    {
      role: 'system',
      content: [
        'You are Leo, a global top-performing B2B sales operator for FLEXTAIL.',
        'Before sending, read the visible chat context and write the next message that naturally follows the conversation.',
        'Return JSON only with keys: draft, reason.',
        'Reference: Leo represents Flextail and Vollyc. Flextail is the core ultralight outdoor/travel electrics brand and currently Top 1 on Amazon; Vollyc covers practical high-rotation 3C electronics; 36+ new SKUs are planned for 2026.',
        'Optimize for the highest chance of a real reply and a booked phone/video meeting. Tailor the angle to the exact customer persona, role, category, region, and latest visible cue.',
        'Rules: do not restart the conversation if prior chat exists; answer the latest customer cue; if they asked for email/WhatsApp/PDF/catalog, ask for or confirm the best email/WhatsApp and say you will send the FLEXTAIL/Vollyc brand intro, line sheet and specs there; otherwise ask one low-friction next step toward the right buyer contact or a short video meeting; keep 25-70 English words; no hype, no false claims, no emojis.',
      ].join(' '),
    },
    {
      role: 'user',
      content: JSON.stringify({
        lead,
        baseDraft,
        visibleConversationContext: String(context && context.contextText || '').slice(-3500),
        contextEvidence: context && context.evidence,
      }),
    },
  ];
}

async function optimizeDraftWithContext(lead, decision, chromeOpen) {
  const baseDraft = String(decision && decision.draft || '').trim();
  const context = await inspectSocialContext(chromeOpen);
  if (!context || !context.contextText) return baseDraft;
  const fallback = contextAwareFallbackDraft(lead, baseDraft, context.contextText);
  const config = loadGlmConfig();
  if (!config || !config.apiKey) return fallback;
  try {
    const optimized = await requestGlm({
      ...config,
      lead,
      messages: buildContextOptimizationMessages(lead, baseDraft, context),
      timeoutMs: 45000,
    });
    const draft = String(optimized && optimized.result && optimized.result.draft || '').trim();
    return draft || fallback;
  } catch {
    return fallback;
  }
}

async function prepareInstagramDraft(opened, draft) {
  const safeDraft = String(draft || '').trim();
  if (!safeDraft) {
    return {
      ok: false,
      sendStatus: 'approval_pending',
      evidence: 'profile_opened_no_approved_draft',
      nextAction: 'Generate or approve a factual outreach draft before opening the composer.',
    };
  }
  const driverResult = await runCodexChromeDriver('prepare-instagram-draft', {
    port: opened && opened.port,
    tabId: opened && opened.tabId,
    targetUrl: opened && opened.targetUrl,
    draft: safeDraft,
    autoSend: true,
    replaceExistingDraft: true,
  });
  if (driverResult) return driverResult;

  const locateMessageExpression = `
    (() => {
      const visible = (el) => {
        const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
        return Boolean(rect && rect.width > 0 && rect.height > 0);
      };
      const textOf = (el) => String((el && (el.innerText || el.textContent)) || '').trim().toLowerCase();
      const controls = () => Array.from(document.querySelectorAll('button, a, div[role="button"]')).filter(visible);
      const byText = (words) => controls().find(el => words.some(word => textOf(el).includes(word)));
      const messageButton = byText(['message', '\\u53d1\\u6d88\\u606f', '\\u53d1\\u9001\\u6d88\\u606f']);
      if (!messageButton) {
        return JSON.stringify({
          ok: false,
          sendStatus: 'target_verified',
          evidence: 'profile_opened_no_message_button',
          nextAction: 'Use website or email channel; no Instagram message button was visible.'
        });
      }
      const rect = messageButton.getBoundingClientRect();
      return JSON.stringify({
        ok: true,
        sendStatus: 'message_button_found',
        evidence: 'message_button_found',
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
        nextAction: 'Clicking Instagram message button.'
      });
    })()
  `;
  let button = await evaluateChromeTabJson(opened, locateMessageExpression, 5000);
  if (!button || !button.ok) {
    button = {
      ok: true,
      sendStatus: 'message_button_heuristic',
      evidence: button && button.evidence || 'message_button_locate_no_result_using_profile_action_coordinates',
      x: 615,
      y: 336,
      nextAction: 'Clicking the visible Instagram profile Message action by coordinates.',
    };
  }
  await cdpCommand(opened.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: button.x,
    y: button.y,
    button: 'none',
  }, 1500);
  await cdpCommand(opened.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: button.x,
    y: button.y,
    button: 'left',
    clickCount: 1,
  }, 1500);
  await cdpCommand(opened.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: button.x,
    y: button.y,
    button: 'left',
    clickCount: 1,
  }, 1500);
  await sleep(2200);

  const draftExpression = `
    (() => {
      const draft = ${JSON.stringify(safeDraft)};
      const visible = (el) => {
        const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
        return Boolean(rect && rect.width > 0 && rect.height > 0);
      };
      const textOf = (el) => String((el && (el.innerText || el.textContent)) || '').trim().toLowerCase();
      const controls = () => Array.from(document.querySelectorAll('button, a, div[role="button"]')).filter(visible);
      const byText = (words) => controls().find(el => words.some(word => textOf(el).includes(word)));
      const notNow = byText(['not now', '\\u4ee5\\u540e\\u518d\\u8bf4', '\\u7a0d\\u540e']);
      if (notNow) {
        notNow.click();
      }
      const composer = Array.from(document.querySelectorAll('[contenteditable="true"], textarea'))
        .filter(visible)
        .find(el => {
          const label = String(el.getAttribute('aria-label') || '').toLowerCase();
          const placeholder = String(el.getAttribute('placeholder') || '').toLowerCase();
          return label.includes('message') || label.includes('\\u6d88\\u606f') || placeholder.includes('message') || placeholder.includes('\\u6d88\\u606f') || el.getAttribute('contenteditable') === 'true';
        });
      if (!composer) {
        return JSON.stringify({
          ok: false,
          sendStatus: 'approval_pending',
          evidence: 'message_button_clicked_composer_not_found',
          nextAction: 'Message panel opened but composer was not detected; finish manually.'
        });
      }
      const existingText = textOf(composer);
      if (existingText) {
        return JSON.stringify({
          ok: true,
          sendStatus: 'draft_already_present',
          evidence: 'message_composer_already_contains_text',
          nextAction: 'Review existing draft and send manually only after confirmation.'
        });
      }
      composer.focus();
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, draft);
      composer.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: draft }));
      await sleep(300);
      return JSON.stringify({
        ok: true,
        sendStatus: 'draft_prepared',
        evidence: 'message_composer_opened_and_draft_inserted_no_send',
        nextAction: 'Review the prepared draft in Instagram and click Send manually only after confirmation.'
      });
    })()
  `;
  return await evaluateChromeTabJson(opened, draftExpression, 8000) || {
    ok: false,
    sendStatus: 'approval_pending',
    evidence: 'composer_automation_no_result',
    nextAction: 'Review the profile manually; browser automation did not return a composer result.',
  };
}

async function prepareSocialDraft(opened, draft) {
  const safeDraft = String(draft || '').trim();
  if (!safeDraft) {
    return {
      ok: false,
      sendStatus: 'approval_pending',
      evidence: 'profile_opened_no_approved_draft',
      nextAction: 'Generate or approve a factual outreach draft before opening the composer.',
    };
  }
  let hostname = '';
  try {
    hostname = new URL(opened && opened.targetUrl || '').hostname.toLowerCase();
  } catch {
    hostname = '';
  }
  if (hostname.includes('instagram.com')) {
    return prepareInstagramDraft(opened, safeDraft);
  }
  const driverResult = await runCodexChromeDriver('prepare-social-draft', {
    port: opened && opened.port,
    tabId: opened && opened.tabId,
    targetUrl: opened && opened.targetUrl,
    draft: safeDraft,
    autoSend: true,
    replaceExistingDraft: true,
  });
  if (driverResult) return driverResult;
  return {
    ok: false,
    sendStatus: 'approval_pending',
    evidence: 'unsupported_platform_driver_unavailable',
    nextAction: 'Review the exact verified profile manually and prepare the approved draft without sending.',
  };
}

function validateLeadTargetForPreparation(lead) {
  const targetUrl = normalizeTarget(lead);
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return { ok: false, error: 'Exact verified platform URL is required' };
  }
  if (parsed.protocol !== 'https:' || !ALLOWED_EXTERNAL_HOSTS.has(parsed.hostname.toLowerCase())) {
    return { ok: false, error: 'Unsupported platform URL' };
  }
  if (isBlockedFacebookTarget(parsed)) {
    return { ok: false, error: 'Facebook outreach requires an exact verified page/profile URL' };
  }
  if (lead?.identityStatus && lead.identityStatus !== 'verified') {
    return { ok: false, error: 'Lead identity is not verified' };
  }
  return { ok: true, targetUrl: parsed.href };
}

function isFollowupLead(lead) {
  return Boolean(lead?.previouslyContacted
    || lead?.sendStatus === 'sent_confirmed'
    || lead?.automationStatus === 'sent_confirmed'
    || lead?.state === 'outcome_pending'
    || /sent|replied|accepted/i.test(String(lead?.originalStatus || '')));
}

function buildOpenClawPrompt(lead, decision, targetUrl, mode) {
  return [
    'You are the execution layer for a B2B customer development system.',
    `Mode: ${mode}.`,
    `Exact verified target URL: ${targetUrl}.`,
    `Customer: ${lead.company || lead.name || 'unknown'}.`,
    `Country: ${lead.country || lead.countryEn || 'unknown'}.`,
    `Role/context: ${lead.role || lead.keyword || ''}.`,
    'Open or inspect only the exact target identity. Do not send a DM, comment, follow, like, or submit any form.',
    'Prepare the next safe action and a short English follow-up draft.',
    'Return concise JSON only with keys: verdict, evidence, nextAction, draft, sendStatus.',
    `Suggested draft: ${decision?.draft || ''}`,
  ].join('\n');
}

async function runOpenClawLead(lead, decision, options = {}) {
  const target = validateLeadTargetForPreparation(lead);
  if (!target.ok) return target;
  const config = loadGlmConfig();
  if (!config || !config.apiKey) return { ok: false, needsConfig: true, error: 'GLM API key is not configured' };
  const chromeOpen = await openWithCodexChrome(target.targetUrl);
  if (!chromeOpen.ok) return { ...chromeOpen, sendStatus: 'failed_open' };
  const sessionKey = `agent:main:outreach-${String(lead.taskId || lead.name || Date.now()).replace(/[^a-zA-Z0-9_.:-]/g, '-').slice(0, 80)}`;
  const mode = isFollowupLead(lead) ? 'followup_prepare_no_duplicate_send' : 'new_lead_prepare_send_requires_confirmation';
  const args = [
    'agent',
    '--local',
    '--agent',
    'main',
    '--session-key',
    sessionKey,
    '--model',
    `zhipu/${config.model || 'glm-5.2'}`,
    '--message',
    buildOpenClawPrompt(lead, decision, target.targetUrl, mode),
    '--timeout',
    String(options.timeoutSeconds || 180),
  ];
  const env = { ...process.env, ZHIPUAI_API_KEY: config.apiKey };
  const command = openClawCommand();
  const result = await execFilePromise(command, args, {
    env,
    windowsHide: true,
    shell: /\.cmd$/i.test(command),
    timeout: (options.timeoutSeconds || 180) * 1000,
    maxBuffer: 8 * 1024 * 1024,
  });
  return {
    ok: true,
    engine: 'openclaw',
    browserEngine: chromeOpen.engine,
    mode,
    targetUrl: target.targetUrl,
    chromeOpen,
    sendStatus: 'prepared_not_sent',
    output: result.stdout.trim(),
  };
}

async function runCodexChromeLead(lead, decision, mode = 'codex_chrome_prepare') {
  const target = validateLeadTargetForPreparation(lead);
  if (!target.ok) return target;
  const chromeOpen = await openWithCodexChrome(target.targetUrl);
  if (!chromeOpen.ok) return { ...chromeOpen, sendStatus: 'failed_open' };
  const finalDraft = await optimizeDraftWithContext(lead, decision, chromeOpen);
  const draftResult = await prepareSocialDraft(chromeOpen, finalDraft);
  return {
    ok: Boolean(draftResult.ok),
    engine: 'codex-chrome-extension-cdp',
    browserEngine: chromeOpen.engine,
    mode,
    targetUrl: target.targetUrl,
    chromeOpen,
    sendStatus: draftResult.sendStatus || 'approval_pending',
    output: JSON.stringify({
      verdict: draftResult.sendStatus === 'sent_confirmed' ? 'sent_confirmed' : (draftResult.ok ? 'draft_prepared' : 'manual_review_needed'),
      evidence: draftResult.evidence || 'Exact verified customer profile opened through Codex Chrome bridge.',
      nextAction: draftResult.nextAction || 'Review the profile and continue manually.',
      draft: finalDraft,
      sendStatus: draftResult.sendStatus || 'approval_pending',
    }),
  };
}

ipcMain.handle('open-external-url', async (_event, url) => {
  return openWithCodexChrome(url);
});

ipcMain.handle('credential-status', async () => {
  const cache = loadCredentialCache();
  const statuses = {};
  for (const platform of Object.keys(PLATFORM_CONFIG)) {
    statuses[platform] = Boolean(cache.credentials && cache.credentials[platform]);
  }
  return {
    desktop: true,
    vaultExists: fs.existsSync(vaultPath()),
    statuses,
    securityFindings: securityFindings(),
  };
});

ipcMain.handle('save-credential', async (_event, payload) => {
  const { platform, username, password, masterPassword } = payload || {};
  validatePlatform(platform);
  if (!username || !password) throw new Error('Username and password are required.');
  setCachedCredential(platform, { username, password });

  if (masterPassword) {
    const vault = readJson(vaultPath(), null);
    const existing = vault && vault.ciphertext ? decryptVault(vault, masterPassword) : {};
    existing[platform] = { username, password };
    writeJson(vaultPath(), encryptVault(existing, masterPassword));
  }
  return { ok: true };
});

ipcMain.handle('unlock-vault', async (_event, masterPassword) => {
  if (!masterPassword) throw new Error('Master password is required.');
  const credentials = decryptVault(readJson(vaultPath(), null), masterPassword);
  for (const platform of Object.keys(credentials || {})) {
    validatePlatform(platform);
    const credential = credentials[platform];
    if (credential && credential.username && credential.password) {
      setCachedCredential(platform, credential);
    }
  }
  return { ok: true, platforms: Object.keys(credentials || {}) };
});

ipcMain.handle('launch-platform-acquisition', async (_event, payload) => {
  const platform = payload && payload.platform;
  const config = validatePlatform(platform);
  if (payload && payload.externalBrowser) {
    const chromeOpen = await openWithCodexChrome(config.targetUrl);
    return { ok: true, externalBrowser: true, chromeOpen };
  }
  let credential = getCachedCredential(platform);
  if (!credential && payload && payload.masterPassword) {
    const credentials = decryptVault(readJson(vaultPath(), null), payload.masterPassword);
    credential = credentials[platform];
    if (credential) setCachedCredential(platform, credential);
  }
  if (!credential) {
    return { ok: false, needsCredential: true };
  }
  createPlatformWindow(platform, credential);
  return { ok: true };
});

ipcMain.handle('glm-status', async () => {
  const config = loadGlmConfig();
  return { configured: Boolean(config && config.apiKey), model: config && config.model, source: config && config.source };
});

ipcMain.handle('save-glm-config', async (_event, payload) => {
  const apiKey = payload && String(payload.apiKey || '').trim();
  if (!apiKey) throw new Error('GLM API key is required.');
  saveGlmConfig({
    apiKey,
    baseUrl: String((payload && payload.baseUrl) || 'https://open.bigmodel.cn/api/paas/v4').replace(/\/+$/, ''),
    model: String((payload && payload.model) || 'glm-5.2'),
  });
  return { ok: true };
});

ipcMain.handle('optimize-lead-with-glm', async (_event, payload) => {
  const config = loadGlmConfig();
  if (!config || !config.apiKey) return { ok: false, needsConfig: true };
  const lead = payload && payload.lead;
  if (!lead) throw new Error('Lead is required.');
  return requestGlm({ ...config, lead });
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function executeLeadAutomation(lead, options = {}) {
  if (!options.allowParallel && glmAutomationRunning) return { ok: false, busy: true, error: 'Another customer is running' };
  if (!options.ignoreCooldown && Date.now() - lastGlmAutomationAt < 90000) {
    return { ok: false, cooldown: true, error: 'Serial cooldown is active' };
  }
  const followup = isFollowupLead(lead);
  const target = followup ? validateLeadTargetForPreparation(lead) : validateLeadForExecution(lead);
  if (!target.ok) return target;
  const config = loadGlmConfig();
  if (!config || !config.apiKey) return { ok: false, needsConfig: true };

  if (!options.allowParallel) glmAutomationRunning = true;
  try {
    const glm = await requestGlm({ ...config, lead });
    const decision = glm.result;
    const acceptedFollowup = followup
      && decision
      && ['develop', 'recheck'].includes(String(decision.verdict || ''))
      && Number(decision.fitScore || 70) >= 50;
    const acceptedNewLead = decision
      && decision.verdict === 'develop'
      && Number(decision.fitScore) >= 70;
    if (!acceptedNewLead && !acceptedFollowup) {
      return {
        ok: false,
        skipped: true,
        decision,
        error: decision?.reason || 'GLM did not approve this lead',
      };
    }
    let execution;
    if (followup) {
      try {
        execution = await runOpenClawLead(lead, decision);
      } catch (error) {
        execution = await runCodexChromeLead(lead, decision, `openclaw_fallback_${error.code || 'error'}`);
      }
    } else {
      execution = await runCodexChromeLead(lead, decision, 'codex_chrome_primary_no_autoglm');
    }
    lastGlmAutomationAt = Date.now();
    return { ...execution, decision, glmModel: glm.model, followup };
  } finally {
    if (!options.allowParallel) glmAutomationRunning = false;
  }
}

function loadLatestDailyQueue() {
  const latestPath = path.join(__dirname, 'daily-automation-latest.json');
  if (!fs.existsSync(latestPath)) return null;
  return readJson(latestPath, null);
}

function queueItemToLead(item) {
  return {
    ...item,
    taskId: item.id,
    name: item.name || item.company,
    targetUrl: item.url,
    verifiedTargetUrl: item.url,
    fitScore: item.fitScore,
    originalStatus: item.lastStatus || '',
  };
}

ipcMain.handle('run-glm-direct-automation', async (_event, payload) => {
  const lead = payload && payload.lead;
  return executeLeadAutomation(lead);
});

async function runDailyAutomationQueue(payload = {}) {
  const latest = loadLatestDailyQueue();
  if (!latest || !Array.isArray(latest.dailyQueue)) {
    return { ok: false, error: 'Daily automation queue is missing. Run npm run daily first.' };
  }
  const requestedLimit = Math.max(1, Math.min(Number(payload && payload.limit || 10), 100));
  const limit = requestedLimit;
  const parallelLimit = 1;
  const executableActions = new Set(['develop', 'retry_or_alternate_channel', 'discover_and_develop']);
  const dueExecutable = latest.dailyQueue
    .filter(item => executableActions.has(item.action))
    .filter(item => item.url)
    .slice(0, limit);
  const scheduledExecutable = (latest.scheduledLater || [])
    .filter(item => executableActions.has(item.action))
    .filter(item => item.url)
    .slice(0, limit);
  const executable = dueExecutable.length ? dueExecutable : scheduledExecutable;
  const queueSource = dueExecutable.length ? 'dailyQueue' : 'scheduledLater';
  const skipped = [...latest.dailyQueue, ...(latest.scheduledLater || [])]
    .filter(item => !executable.some(run => run.id === item.id))
    .map(item => ({ id: item.id, company: item.company, action: item.action, reason: item.reason }));

  if (!executable.length) {
    return {
      ok: false,
      skippedOnly: true,
      error: 'No social-executable tasks. Email-priority, cooldown, exclusive-agency, and verification tasks are not auto-DM executed.',
      skipped,
      summary: latest.summary || {},
    };
  }

  const results = [];
  for (let index = 0; index < executable.length; index += parallelLimit) {
    const batch = executable.slice(index, index + parallelLimit);
    const batchResults = await Promise.all(batch.map(async (item) => {
      const result = await executeLeadAutomation(queueItemToLead(item), { ignoreCooldown: true, allowParallel: true });
      recordAutomationResult(item, result);
      return {
        id: item.id,
        company: item.company,
        action: item.action,
        ok: Boolean(result && result.ok),
        chromeOpen: result && result.chromeOpen || null,
        result,
      };
    }));
    results.push(...batchResults);
    if (batchResults.some(item => item.result && (item.result.needsConfig || item.result.needsInstall))) break;
    if (index + parallelLimit < executable.length) await sleep(Number(payload && payload.delayMs || 91000));
  }

  return {
    ok: results.some(item => item.ok),
    engine: 'Codex Chrome Extension queue bridge',
    mode: 'serial-single-target',
    parallelLimit,
    limit,
    queueDate: latest.date,
    queueSource,
    executed: results,
    skipped,
    summary: latest.summary || {},
  };
}

ipcMain.handle('run-daily-automation-queue', async (_event, payload) => runDailyAutomationQueue(payload));

app.whenReady().then(() => {
  createWindow();
  if (process.argv.includes('--auto-run-daily')) {
    setTimeout(async () => {
      try {
        const autoLimit = Math.max(1, Math.min(Number(process.env.DAILY_EXECUTE_LIMIT || 10), 100));
        const result = await runDailyAutomationQueue({ limit: autoLimit, parallelLimit: 1, delayMs: 2500 });
        writeJson(path.join(__dirname, 'daily-automation-execution-latest.json'), {
          ...result,
          completedAt: new Date().toISOString(),
        });
      } catch (error) {
        writeJson(path.join(__dirname, 'daily-automation-execution-latest.json'), {
          ok: false,
          error: error.message || String(error),
          completedAt: new Date().toISOString(),
        });
      } finally {
        app.quit();
      }
    }, 3000);
  }
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
