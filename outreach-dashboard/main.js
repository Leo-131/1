const { app, BrowserWindow, ipcMain, shell, safeStorage } = require('electron');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
  validatePlatform(platform);
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

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
