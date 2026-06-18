const { app, BrowserWindow, ipcMain, shell, safeStorage } = require('electron');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFile } = require('child_process');
const { requestGlm } = require('./glm-service');
const { runAutoGlmLead, normalizeTarget, validateLeadForExecution } = require('./autoglm-bridge');

let glmAutomationRunning = false;
let lastGlmAutomationAt = 0;

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
  if (!['https:', 'http:'].includes(parsed.protocol) || !ALLOWED_EXTERNAL_HOSTS.has(parsed.hostname)) {
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
  await shell.openExternal(target.targetUrl);
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
  const result = await execFilePromise('openclaw.cmd', args, {
    env,
    windowsHide: true,
    timeout: (options.timeoutSeconds || 180) * 1000,
    maxBuffer: 8 * 1024 * 1024,
  });
  return {
    ok: true,
    engine: 'openclaw',
    mode,
    targetUrl: target.targetUrl,
    externalBrowserOpened: true,
    sendStatus: 'prepared_not_sent',
    output: result.stdout.trim(),
  };
}

ipcMain.handle('open-external-url', async (_event, url) => {
  const parsed = validateExternalUrl(url);
  await shell.openExternal(parsed.toString());
  return true;
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
    await shell.openExternal(config.targetUrl);
    return { ok: true, externalBrowser: true };
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
    model: String((payload && payload.model) || 'glm-4-flash'),
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

ipcMain.handle('run-glm-direct-automation', async (_event, payload) => {
  if (glmAutomationRunning) return { ok: false, busy: true, error: 'Another customer is running' };
  if (Date.now() - lastGlmAutomationAt < 90000) {
    return { ok: false, cooldown: true, error: 'Serial cooldown is active' };
  }
  const lead = payload && payload.lead;
  const followup = isFollowupLead(lead);
  const target = followup ? validateLeadTargetForPreparation(lead) : validateLeadForExecution(lead);
  if (!target.ok) return target;
  const config = loadGlmConfig();
  if (!config || !config.apiKey) return { ok: false, needsConfig: true };

  glmAutomationRunning = true;
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
      execution = await runOpenClawLead(lead, decision);
    } else {
      execution = await runAutoGlmLead(lead, decision);
      if (execution && execution.needsInstall) {
        execution = await runOpenClawLead(lead, decision);
      }
    }
    lastGlmAutomationAt = Date.now();
    return { ...execution, decision, glmModel: glm.model, followup };
  } finally {
    glmAutomationRunning = false;
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
