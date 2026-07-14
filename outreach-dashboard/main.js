const { app, BrowserWindow, ipcMain, shell, safeStorage } = require('electron');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const http = require('http');
const net = require('net');
const tls = require('tls');
const { execFile, spawn } = require('child_process');
const { professionalSalesDraft, requestGlm } = require('./glm-service');
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
const isAutoRunDaily = process.argv.includes('--auto-run-daily');
const WEBSITE_CONTACT_VERIFIED_EVIDENCE = 'contact_entry_verified';
const DEFAULT_WEBSITE_CONTACT_EMAIL = 'leo@flextailgear.com';
const DEFAULT_WEBSITE_CONTACT_FIRST_NAME = 'Leo';
const DEFAULT_WEBSITE_CONTACT_LAST_NAME = 'Liu';
const DEFAULT_WEBSITE_CONTACT_PHONE = '+86 17321028184';
const DEFAULT_WEBSITE_CONTACT_SUBJECT = 'Flextail & Vollyc | Lightweight Outdoor & 3C Electronics – Potential Cooperation';

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

function writeJsonScript(file, globalName, value) {
  fs.writeFileSync(file, `window.${globalName} = ${JSON.stringify(value, null, 2)};\n`);
}

function writeDailyExecutionArtifact(output) {
  writeJson(path.join(__dirname, 'daily-automation-execution-latest.json'), output);
  writeJsonScript(path.join(__dirname, 'daily-automation-execution-latest.js'), 'DAILY_AUTOMATION_EXECUTION_LATEST', output);
  copyPublicArtifact('daily-automation-execution-latest.json');
  copyPublicArtifact('daily-automation-execution-latest.js');
  writeSystemVisibilityArtifact('main-writeDailyExecutionArtifact');
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

function canonicalLeadKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/^google-customer-/i, '')
    .replace(/^verified-[a-z]+-/i, '')
    .replace(/-(instagram|facebook|website-contact)$/i, '')
    .replace(/[^a-z0-9.]+/g, '');
}

function automationLeadFamilyKey(value) {
  return canonicalLeadKey(value);
}

function canonicalExactAutomationKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/g, '')
    .replace(/[^a-z0-9.]+/g, '');
}

function automationPlatformFor(value = {}) {
  const explicit = String(value.platform || value.channel || '').toLowerCase();
  if (explicit) {
    if (/instagram|ins/.test(explicit)) return 'instagram';
    if (/facebook|fb/.test(explicit)) return 'facebook';
    if (/email|website|contact/.test(explicit)) return 'website';
  }
  const text = [
    value.id,
    value.taskId,
    value.task_id,
    value.reason,
    value.evidence,
    value.target_url,
    value.targetUrl,
    value.url,
    value.contactUrl,
  ].filter(Boolean).join(' ').toLowerCase();
  if (/instagram|instagram\.com/.test(text)) return 'instagram';
  if (/facebook|facebook\.com|fb\.com/.test(text)) return 'facebook';
  if (/website-contact|official_website_contact_channel|website_contact|mailto|email_channel|contact_entry/.test(text)) return 'website';
  return '';
}

function automationExactKeys(value = {}) {
  return new Set([
    value.id,
    value.taskId,
    value.task_id,
    value.url,
    value.targetUrl,
    value.target_url,
    value.platformUrl,
    value.contactUrl,
  ].map(canonicalExactAutomationKey).filter(Boolean));
}

function automationCompanyKeys(value = {}) {
  return new Set([
    value.company,
    value.name,
    automationLeadFamilyKey(value.id),
    automationLeadFamilyKey(value.taskId),
    automationLeadFamilyKey(value.task_id),
  ].map(canonicalLeadKey).filter(Boolean));
}

function setsIntersect(left, right) {
  for (const item of left) {
    if (right.has(item)) return true;
  }
  return false;
}

const COMPANY_HISTORY_BLOCKING_STATUSES = new Set([
  'sent_confirmed',
  'send_unconfirmed',
  'account_followed',
  'post_liked',
  'website_contact_ready',
  'approval_pending',
  'draft_prepared',
  'prepared_not_sent',
]);

function historicalAutomationResultBlocksCompany(result = {}) {
  if (COMPANY_HISTORY_BLOCKING_STATUSES.has(result.status)) return true;
  if (result.status !== 'failed_open') return false;
  return /message_button_clicked|profile_valid_no_message_button|profile_opened_no_message_button|no_message_button|contact_entry_verified|contact_form_detected|mailto_detected|no_contact_entry_control|website_contact_entry_not_verified|website_contact_all_targets_failed|public_email_fallback_available/i
    .test(String(result.evidence || ''));
}

function blockingAutomationResultFor(item) {
  const file = path.join(__dirname, 'autonomous-outreach-results.js');
  const results = readJsonScriptArray(file, 'AUTONOMOUS_OUTREACH_RESULTS');
  const exactKeys = automationExactKeys(item);
  const companyKeys = automationCompanyKeys(item);
  const itemPlatform = automationPlatformFor(item);
  const blocking = new Set(['sent_confirmed', 'failed_open', 'send_unconfirmed', 'account_followed', 'post_liked', 'website_contact_ready', 'website_contact_unreachable_skip', 'approval_pending', 'draft_prepared', 'prepared_not_sent']);
  const companyBlocking = new Set(['sent_confirmed', 'send_unconfirmed', 'account_followed', 'post_liked']);
  return results
    .filter((result) => result && (blocking.has(result.status) || historicalAutomationResultBlocksCompany(result)))
    .filter((result) => result.status !== 'failed_open' || failedOpenResultShouldBlockRetry(result) || historicalAutomationResultBlocksCompany(result))
    .find((result) => {
      if (historicalAutomationResultBlocksCompany(result) && setsIntersect(companyKeys, automationCompanyKeys(result))) return true;
      const resultExactKeys = automationExactKeys(result);
      if (setsIntersect(exactKeys, resultExactKeys)) return true;
      if (companyBlocking.has(result.status) && setsIntersect(companyKeys, automationCompanyKeys(result))) return true;
      const resultPlatform = automationPlatformFor(result);
      if (!itemPlatform || !resultPlatform || itemPlatform !== resultPlatform) return false;
      return setsIntersect(companyKeys, automationCompanyKeys(result));
    }) || null;
}

const SAME_DAY_DEVELOPMENT_STATUSES = new Set([
  'sent_confirmed',
  'send_unconfirmed',
  'account_followed',
  'post_liked',
]);

function automationLocalDay(value, timeZone = 'Asia/Shanghai') {
  const time = typeof value === 'number' ? value : Date.parse(value || '');
  if (!Number.isFinite(time)) return '';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(time));
}

function isSameAutomationDay(value, now = Date.now()) {
  const day = automationLocalDay(value);
  return Boolean(day && day === automationLocalDay(now));
}

function sameDayDevelopmentResult(result = {}, now = Date.now()) {
  return Boolean(result
    && SAME_DAY_DEVELOPMENT_STATUSES.has(result.status)
    && isSameAutomationDay(result.timestamp, now)
    && isVerifiedSameDayWebsiteResult(result));
}

function isVerifiedSameDayWebsiteResult(result = {}) {
  if (result.status !== 'website_contact_ready') return true;
  return websiteContactResultIsVerified(result);
}

function sameDayAutomationCompanyKeys(results = [], now = Date.now()) {
  const keys = new Set();
  for (const result of results) {
    if (!sameDayDevelopmentResult(result, now)) continue;
    automationCompanyKeys(result).forEach(key => keys.add(key));
  }
  return keys;
}

function itemBlockedBySameDayCompany(item, companyKeys) {
  return setsIntersect(automationCompanyKeys(item), companyKeys);
}

function failedOpenResultShouldBlockRetry(result = {}) {
  const evidence = String(result.evidence || '').toLowerCase();
  const recoverable = [
    'message_button_clicked_composer_not_found',
    'composer_not_found',
    'chrome_target_not_found',
    'cdp timeout',
    'contact_page_open_failed',
    'no_contact_entry_control',
    'website_contact_entry_not_verified',
  ];
  if (recoverable.some(fragment => evidence.includes(fragment))) return false;
  const hardFailures = [
    'identity_mismatch',
    'unavailable_profile_page',
    'page isn',
    'wrong or unmatched account',
  ];
  if (hardFailures.some(fragment => evidence.includes(fragment))) return true;
  return true;
}

function websiteContactResultIsVerified(result = {}) {
  if (result.status !== 'website_contact_ready') return true;
  const evidence = String(result.evidence || '').toLowerCase();
  return evidence.includes(WEBSITE_CONTACT_VERIFIED_EVIDENCE)
    || evidence.includes('contact_form_detected')
    || evidence.includes('mailto_detected')
    || evidence.includes('business_contact_route_detected');
}

function recordAutomationResult(item, result) {
  const sendStatus = result && result.sendStatus;
  if (!['sent_confirmed', 'send_unconfirmed', 'failed_open', 'draft_prepared', 'prepared_not_sent', 'website_contact_ready', 'website_contact_unreachable_skip', 'approval_pending'].includes(sendStatus)) return;
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
    draft: output.draft || result.draft || '',
    subject: output.subject || result.subject || '',
  };
  const file = path.join(__dirname, 'autonomous-outreach-results.js');
  const results = readJsonScriptArray(file, 'AUTONOMOUS_OUTREACH_RESULTS');
  const duplicate = results.some(existing => existing.task_id === entry.task_id
    && existing.status === entry.status
    && existing.target_url === entry.target_url
    && existing.evidence === entry.evidence);
  if (!duplicate) {
    results.push(entry);
    writeJsonScriptArray(file, 'AUTONOMOUS_OUTREACH_RESULTS', results);
  }
}

function copyPublicArtifact(file) {
  const from = path.join(__dirname, file);
  const to = path.join(__dirname, 'public', file);
  if (!fs.existsSync(from)) return false;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  return true;
}

function writeSystemVisibilityArtifact(source) {
  const latest = readJson(path.join(__dirname, 'daily-automation-latest.json'), {});
  const latestExecution = readJson(path.join(__dirname, 'daily-automation-execution-latest.json'), {});
  const githubSync = readJson(path.join(__dirname, 'github-sync', 'latest-status.json'), {});
  const dailyRows = Array.isArray(latest.dailyQueue) ? latest.dailyQueue : [];
  const cooldownRows = Array.isArray(latest.cooldownQueue) ? latest.cooldownQueue : [];
  const googleRows = dailyRows.filter((item) => item.source === 'google_customer_discovery' || /^google-customer-/i.test(item.id || item.taskId || ''));
  const websiteContactRows = googleRows.filter((item) => item.reason === 'official_website_contact_channel' || /website-contact/i.test(item.id || item.taskId || ''));
  const visibility = {
    updatedAt: new Date().toISOString(),
    source,
    runDate: latest.date || '',
    artifactGeneratedAt: latest.generatedAt || '',
    executionGeneratedAt: latestExecution.completedAt || latestExecution.generatedAt || '',
    githubSyncUpdatedAt: githubSync.updatedAt || '',
    counts: {
      dailyQueue: dailyRows.length,
      googleDiscovered: googleRows.length,
      websiteContact: websiteContactRows.length,
      cooldownQueue: cooldownRows.length,
      scheduledLater: Array.isArray(latest.scheduledLater) ? latest.scheduledLater.length : 0,
    },
    visibleSections: [
      'workspace',
      'taskDetailPanel',
      'todayQueue',
      'customers',
      'customerDetail',
      'seo',
      'automationAudit',
      'settings',
      'rightRail',
      'githubSyncStatus',
    ],
    refreshedArtifacts: [
      'daily-automation-latest',
      'daily-automation-execution-latest',
      'google-lead-discovery-latest',
      'github-sync/latest-status',
      'system-visibility-latest',
    ],
    contactEnrichment: {
      enabled: true,
      sources: ['dailyQueue', 'cooldownQueue', 'google-lead-discovery-latest'],
      fields: ['publicEmail', 'contactEmail', 'contactPhone', 'vendorPortal', 'contactUrl', 'contactSearchUrl', 'website'],
    },
  };
  writeJson(path.join(__dirname, 'system-visibility-latest.json'), visibility);
  writeJsonScript(path.join(__dirname, 'system-visibility-latest.js'), 'SYSTEM_VISIBILITY_LATEST', visibility);
  [
    'daily-automation-latest.json',
    'daily-automation-latest.js',
    'google-lead-discovery-latest.json',
    'google-lead-discovery-latest.js',
    'daily-automation-execution-latest.json',
    'daily-automation-execution-latest.js',
    'system-visibility-latest.json',
    'system-visibility-latest.js',
    path.join('github-sync', 'latest-status.json'),
    path.join('github-sync', 'latest-status.js'),
  ].forEach(copyPublicArtifact);
  return visibility;
}

function refreshDailyAutomationArtifacts() {
  return new Promise((resolve) => {
    execFile('node', [path.join(__dirname, 'daily-automation-runner.js'), '--fix'], {
      cwd: __dirname,
      windowsHide: true,
      timeout: 60000,
    }, (error, stdout, stderr) => {
      const visibility = writeSystemVisibilityArtifact('main-refreshDailyAutomationArtifacts');
      resolve({
        ok: !error,
        stdout: String(stdout || '').trim(),
        stderr: String(stderr || '').trim(),
        error: error ? (error.message || String(error)) : '',
        visibility,
      });
    });
  });
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
    webSocketDebuggerUrl: opened.webSocketDebuggerUrl || '',
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
  const websiteUnavailableEvidence = websiteUnavailablePageEvidence(page);
  const profileUnavailable = isUnavailableProfilePage(page);
  const unavailable = profileUnavailable || Boolean(websiteUnavailableEvidence);
  return {
    unavailable,
    title: page.title || '',
    evidence: profileUnavailable
      ? `unavailable_profile_page: ${String(page.text || page.title || '').slice(0, 180)}`
      : websiteUnavailableEvidence,
  };
}

function websiteUnavailablePageEvidence(page = {}) {
  const signal = [
    page.url,
    page.title,
    String(page.text || '').slice(0, 2200),
  ].map(value => String(value || '').toLowerCase()).join('\n');
  if (/\b403\b/.test(signal)
    || signal.includes('request could not be satisfied')
    || signal.includes('request blocked')
    || signal.includes('generated by cloudfront')
    || signal.includes('cloudfront')
    || signal.includes('access denied')
    || signal.includes('forbidden')) {
    return `website_page_unavailable_403: ${String(page.text || page.title || '').slice(0, 180)}`;
  }
  if (/\b404\b/.test(signal)
    || signal.includes('page not found')
    || signal.includes('pagina is helaas niet')
    || signal.includes('pagina is niet beschikbaar')
    || signal.includes('helaas niet beschikbaar')
    || signal.includes('not found')) {
    return `website_page_unavailable_404: ${String(page.text || page.title || '').slice(0, 180)}`;
  }
  return '';
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
        nextAction: 'Major browser automation exception; pause and notify operator before retry.',
      };
    }
    const value = result && result.result && result.result.value;
    return JSON.parse(value || 'null');
  } catch {
    return null;
  }
}

async function clickChromeTabAt(opened, x, y) {
  if (!opened || !opened.webSocketDebuggerUrl || !Number.isFinite(x) || !Number.isFinite(y)) return false;
  await cdpCommand(opened.webSocketDebuggerUrl, 'Page.bringToFront', {}, 2000);
  await cdpCommand(opened.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'none' }, 2000);
  await cdpCommand(opened.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 }, 2000);
  await cdpCommand(opened.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 }, 2000);
  return true;
}

async function setChromeFileInput(opened, filePath) {
  if (!opened || !opened.webSocketDebuggerUrl || !filePath || !fs.existsSync(filePath)) {
    return { ok: false, evidence: 'marketing_attachment_missing' };
  }
  const evaluated = await cdpCommand(opened.webSocketDebuggerUrl, 'Runtime.evaluate', {
    expression: 'document.querySelector("input[type=file]")',
  }, 5000);
  const objectId = evaluated && evaluated.result && evaluated.result.objectId;
  if (!objectId) return { ok: false, evidence: 'file_input_not_found' };
  const setResult = await cdpCommand(opened.webSocketDebuggerUrl, 'DOM.setFileInputFiles', {
    objectId,
    files: [filePath],
  }, 8000);
  return setResult === null || setResult
    ? { ok: true, evidence: `marketing_attachment_selected:${path.basename(filePath)}` }
    : { ok: false, evidence: 'marketing_attachment_select_failed' };
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
      timeout: 120000,
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
      nextAction: 'Major Codex Chrome driver failure; pause and notify operator before retry.',
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
        'Reply-rate strategy: lead with one buyer-relevant reason, ask exactly one easy question, prefer buyer/contact routing over a broad pitch, and avoid long company introductions unless the customer asked for background.',
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

async function prepareInstagramDraft(opened, draft, lead = {}) {
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
    expectedCompany: lead && (lead.company || lead.name),
    draft: safeDraft,
    autoSend: true,
    autoEngage: true,
    engagementComment: lead && lead.engagementComment || 'Great outdoor checklist. Useful reminder for hikers preparing a complete, lightweight kit.',
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
          nextAction: 'Message panel opened but composer was not detected; automation paused to avoid unsafe send.'
        });
      }
      const existingText = textOf(composer);
      if (existingText) {
        return JSON.stringify({
          ok: true,
          sendStatus: 'draft_already_present',
          evidence: 'message_composer_already_contains_text',
          nextAction: 'Existing draft detected; automation paused to avoid overwriting or duplicate sending.'
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
        nextAction: 'Draft prepared but auto-send fallback could not confirm Send; pause unless operator confirms a major bug path.'
      });
    })()
  `;
  return await evaluateChromeTabJson(opened, draftExpression, 8000) || {
    ok: false,
    sendStatus: 'approval_pending',
    evidence: 'composer_automation_no_result',
    nextAction: 'Browser automation did not return a composer result; pause and notify only if this blocks the queue.',
  };
}

async function prepareSocialDraft(opened, draft, lead = {}) {
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
    return prepareInstagramDraft(opened, safeDraft, lead);
  }
  const driverResult = await runCodexChromeDriver('prepare-social-draft', {
    port: opened && opened.port,
    tabId: opened && opened.tabId,
    targetUrl: opened && opened.targetUrl,
    expectedCompany: lead && (lead.company || lead.name),
    draft: safeDraft,
    autoSend: true,
    autoEngage: true,
    engagementComment: lead && lead.engagementComment || 'Great outdoor checklist. Useful reminder for hikers preparing a complete, lightweight kit.',
    replaceExistingDraft: true,
  });
  if (driverResult) return driverResult;
  return {
    ok: false,
    sendStatus: 'approval_pending',
    evidence: 'unsupported_platform_driver_unavailable',
    nextAction: 'Exact verified profile opened but no draft was generated; pause as a major automation blocker.',
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
    'Open or inspect only the exact target identity. Execute only if all safety gates pass; otherwise pause with evidence.',
    'Prepare the next safe action and a short English follow-up draft for automatic execution.',
    'Return concise JSON only with keys: verdict, evidence, nextAction, draft, sendStatus.',
    `Suggested draft: ${decision?.draft || ''}`,
  ].join('\n');
}

function websiteContactSubject(lead = {}) {
  return lead.websiteContactSubject || DEFAULT_WEBSITE_CONTACT_SUBJECT;
}

function marketingEmailSignature() {
  return `[Flextail.com](https://www.flextail.com/), [vollyc.com](https://vollyc.com/)

[Sincerely](https://wa.me/8617321028184)
[Best Regard](https://wa.me/8617321028184)
[Leo Liu](https://wa.me/8617321028184)
[Sales](https://wa.me/8617321028184) [& Operations Director](https://wa.me/8617321028184)
[Brand & ODM Department](https://wa.me/8617321028184)
[Tel/whatsapp:  +86 17321028184](https://wa.me/8617321028184)

[Email:  Leo@flextailgear.com](https://wa.me/8617321028184)
[SHANGHAI FLEXTAIL TECHNOLOGY CO.,LTD.](https://wa.me/8617321028184)
[Room103, Building No.6, No.1 Yanjiaqiao, Pudong District, ShangHai, China](https://wa.me/8617321028184)`;
}

function websiteContactMessage(lead = {}) {
  if (lead.websiteContactMessage) return String(lead.websiteContactMessage).trim();
  const rawName = String(lead.company || lead.name || 'Your').replace(/\s+(Inc|Ltd|Limited|LLC|Group)$/i, '').trim() || 'Your';
  return `Dear ${rawName} Team,

Nice to e-meet you.
I am Leo, from Flextail & Vollyc.

Flextail is our first and core brand, specializing in ultralight electric products for outdoor, travel, and home use. The brand is currently Top 1 on Amazon, with strong global sell-through and a proven product-market fit.
Vollyc, our second brand, focuses on 3C electronics, targeting practical, high-rotation consumer use cases.

From our perspective, your platform and positioning are highly aligned with Flextail’s product philosophy, especially in lightweight outdoor and travel-oriented electrics.

We have already contacted with your team, and we are now actively exploring opportunities in other regions.
Attached, you will find a brief introduction to our brands and current product catalog for your reference.

Looking ahead, we are planning to launch over 36 new SKUs in 2026, covering multiple usage scenarios and price tiers, which we believe could be of interest to your assortment strategy.

If you are available, I would greatly appreciate the opportunity to arrange a short introductory video meeting to present our brands and discuss potential collaboration opportunities.

Thank you for your time and consideration. I look forward to your reply.

${marketingEmailSignature()}
`;
}

function websiteMarketingAttachmentPath() {
  const configured = [
    process.env.WEBSITE_MARKETING_FILE,
    process.env.MARKETING_ATTACHMENT_PATH,
    process.env.FLEXTAIL_MARKETING_FILE,
  ].map(value => String(value || '').trim()).find(Boolean);
  if (!configured) return '';
  return path.isAbsolute(configured) ? configured : path.join(__dirname, configured);
}

function websiteMarketingAttachmentStatus() {
  const filePath = websiteMarketingAttachmentPath();
  if (!filePath || !fs.existsSync(filePath)) {
    return { ok: false, filePath, evidence: 'marketing_attachment_missing' };
  }
  return { ok: true, filePath, evidence: `marketing_attachment_selected:${path.basename(filePath)}` };
}

function validateWebsiteContactTarget(lead = {}) {
  const targetUrl = lead.contactUrl || lead.targetUrl || lead.verifiedTargetUrl || lead.url || lead.website;
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return { ok: false, error: 'Official website contact URL is required' };
  }
  if (parsed.protocol !== 'https:') return { ok: false, error: 'Official website contact URL must use HTTPS' };
  if (/google\.com\/search/i.test(parsed.href)) return { ok: false, error: 'Search result URL is not a contact form' };
  if (ALLOWED_EXTERNAL_HOSTS.has(parsed.hostname.toLowerCase())) return { ok: false, error: 'Social platform URL is not a website contact form' };
  return { ok: true, targetUrl: parsed.href };
}

function websiteContactTargetCandidates(lead = {}) {
  const rawCandidates = [
    lead.contactUrl,
    lead.alternateChannels && lead.alternateChannels.websiteContact,
    lead.vendorPortal,
    lead.targetUrl,
    lead.verifiedTargetUrl,
    lead.platformUrl,
    lead.url,
    lead.website,
  ];
  const seen = new Set();
  const candidates = [];
  for (const value of rawCandidates) {
    const checked = validateWebsiteContactTarget({ contactUrl: value });
    if (!checked.ok) continue;
    const key = checked.targetUrl.replace(/\/$/, '').toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    candidates.push(checked);
  }
  return candidates;
}

function websiteContactInspectionExpression() {
  return `(() => {
    const visible = (el) => {
      if (!el || !el.getBoundingClientRect) return false;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const textOf = (el) => String(el && (el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('title') || '') || '').replace(/\\s+/g, ' ').trim();
    const bodyText = String(document.body && document.body.innerText || '');
    const lowerText = bodyText.toLowerCase();
    const pageSignal = [location.href, document.title, lowerText.slice(0, 1800)].map((value) => String(value || '').toLowerCase()).join('\\n');
    const is403 = /\\b403\\b/.test(pageSignal)
      || pageSignal.includes('request could not be satisfied')
      || pageSignal.includes('request blocked')
      || pageSignal.includes('generated by cloudfront')
      || pageSignal.includes('cloudfront')
      || pageSignal.includes('access denied')
      || pageSignal.includes('forbidden');
    const is404 = /\\b404\\b/.test(pageSignal)
      || pageSignal.includes('page not found')
      || pageSignal.includes('pagina is helaas niet')
      || pageSignal.includes('pagina is niet beschikbaar')
      || pageSignal.includes('helaas niet beschikbaar')
      || pageSignal.includes('not found');
    if (is403 || is404) {
      return JSON.stringify({
        ready: false,
        unavailable: true,
        evidence: is403 ? 'website_page_unavailable_403' : 'website_page_unavailable_404',
        url: location.href,
        title: document.title,
        textSample: bodyText.slice(0, 240)
      });
    }
    const controls = Array.from(document.querySelectorAll('a,button,[role="button"]'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          text: textOf(el),
          href: el.href || el.getAttribute('href') || '',
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2)
        };
      });
    const mailtos = Array.from(document.querySelectorAll('a[href^="mailto:"]')).map((el) => el.href).filter(Boolean);
    const fields = Array.from(document.querySelectorAll('form input,form textarea,form select,input,textarea,select'))
      .filter(visible)
      .filter((el) => !/hidden|submit|button|reset|search/i.test(String(el.type || '')))
      .map((el) => ({
        tag: el.tagName,
        type: el.type || '',
        label: String(el.placeholder || el.getAttribute('aria-label') || el.name || el.id || '').toLowerCase()
      }));
    const messageFields = fields.filter((field) => field.tag === 'TEXTAREA'
      || /email|message|enquiry|inquiry|business|company|name|phone|subject/.test(String(field.type || '') + ' ' + String(field.label || '')));
    const businessWords = ['business enquiry', 'business inquiry', 'trade enquiry', 'trade inquiry', 'vendor', 'supplier', 'wholesale', 'partnership', 'corporate sales', 'become a supplier', 'sales enquiry', 'customer service enquiry', 'submit a request', 'send us a message', 'contact form', 'email us'];
    const hasBusinessCue = businessWords.some((word) => lowerText.includes(word));
    const actionableControls = controls.filter((item) => {
      const text = (String(item.text || '') + ' ' + String(item.href || '')).toLowerCase();
      return businessWords.some((word) => text.includes(word))
        || /contact us|get in touch|enquir|inquir|support request|request form|customer care|help request/.test(text);
    });
    const hasContactForm = messageFields.length >= 2 || fields.some((field) => field.tag === 'TEXTAREA') || fields.some((field) => /email/.test(String(field.type || '') + ' ' + String(field.label || '')));
    const ready = mailtos.length > 0 || hasContactForm || (hasBusinessCue && actionableControls.length > 0);
    const evidence = mailtos.length ? 'mailto_detected'
      : hasContactForm ? 'contact_form_detected'
        : hasBusinessCue && actionableControls.length ? 'business_contact_route_detected'
          : 'contact_entry_not_verified';
    return JSON.stringify({
      ready,
      evidence,
      url: location.href,
      title: document.title,
      mailtoCount: mailtos.length,
      fieldCount: fields.length,
      messageFieldCount: messageFields.length,
      actionCount: actionableControls.length,
      actions: actionableControls.slice(0, 6)
    });
  })()`;
}

function websiteContactClickExpression() {
  return `(() => {
    const visible = (el) => {
      if (!el || !el.getBoundingClientRect) return false;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const textOf = (el) => String(el && (el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('title') || '') || '').replace(/\\s+/g, ' ').trim();
    const positive = /contact us|get in touch|send us a message|submit a request|business enquiry|business inquiry|trade enquiry|trade inquiry|sales enquiry|enquir|inquir|vendor|supplier|wholesale|partnership|corporate sales|become a supplier|email us|customer service enquiry|support request|request form/i;
    const negative = /continue shopping|search|sign in|login|cart|wishlist|store locator|track order|return policy|privacy|terms|newsletter|language|translate|accessibility|live chat/i;
    const currentHost = location.hostname;
    const candidates = Array.from(document.querySelectorAll('a,button,[role="button"]'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const href = el.href || el.getAttribute('href') || '';
        const text = textOf(el);
        const haystack = String(text || '') + ' ' + String(href || '');
        let sameHost = true;
        try {
          if (/^https?:/i.test(href)) sameHost = new URL(href).hostname === currentHost;
        } catch {
          sameHost = true;
        }
        return { el, text, href, haystack, sameHost, x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
      })
      .filter((item) => positive.test(item.haystack) && !negative.test(item.haystack) && item.sameHost);
    const ranked = candidates.sort((left, right) => {
      const exactLeft = /^(contact us|get in touch|submit a request|send us a message)$/i.test(left.text) ? 1 : 0;
      const exactRight = /^(contact us|get in touch|submit a request|send us a message)$/i.test(right.text) ? 1 : 0;
      return exactRight - exactLeft || left.y - right.y;
    });
    const target = ranked[0];
    if (!target) return JSON.stringify({ clicked: false, evidence: 'no_contact_entry_control' });
    target.el.scrollIntoView({ block: 'center', inline: 'center' });
    const rect = target.el.getBoundingClientRect();
    return JSON.stringify({
      clicked: true,
      evidence: 'contact_entry_clicked',
      text: target.text,
      href: target.href,
      x: Math.round(rect.left + rect.width / 2),
      y: Math.round(rect.top + rect.height / 2)
    });
  })()`;
}

async function inspectWebsiteContactFlow(chromeOpen) {
  if (!chromeOpen || !chromeOpen.ok) return { ok: false, sendStatus: 'failed_open', evidence: chromeOpen && chromeOpen.evidence || 'contact_page_open_failed' };
  if (!chromeOpen.webSocketDebuggerUrl) {
    return {
      ok: false,
      sendStatus: 'approval_pending',
      evidence: 'website_contact_cdp_unavailable_open_only_not_verified',
      nextAction: 'Browser opened the URL, but Codex could not verify a Contact Us form or business inquiry route. Continue manually and do not mark ready yet.',
    };
  }
  let inspection = await evaluateChromeTabJson(chromeOpen, websiteContactInspectionExpression(), 8000);
  if (inspection && inspection.unavailable) {
    return {
      ok: false,
      sendStatus: 'failed_open',
      evidence: inspection.evidence || 'website_page_unavailable',
      inspection,
      nextAction: 'The official website contact URL opened to an unavailable 403/404 page. Try another verified official website contact entry before manual outreach.',
    };
  }
  let clickEvidence = '';
  for (let attempt = 0; attempt < 3 && inspection && !inspection.ready; attempt += 1) {
    const clicked = await evaluateChromeTabJson(chromeOpen, websiteContactClickExpression(), 5000);
    if (!clicked || !clicked.clicked) {
      clickEvidence = clicked && clicked.evidence || 'no_contact_entry_control';
      break;
    }
    clickEvidence = `${clicked.evidence}:${String(clicked.text || clicked.href || '').slice(0, 80)}`;
    await clickChromeTabAt(chromeOpen, clicked.x, clicked.y);
    await sleep(1800);
    inspection = await evaluateChromeTabJson(chromeOpen, websiteContactInspectionExpression(), 8000);
    if (inspection && inspection.unavailable) {
      return {
        ok: false,
        sendStatus: 'failed_open',
        evidence: `${inspection.evidence || 'website_page_unavailable'};${clickEvidence}`,
        inspection,
        nextAction: 'A clicked official contact route opened to a 403/404 page. Try another verified official website contact entry before manual outreach.',
      };
    }
  }
  if (inspection && inspection.ready) {
    return {
      ok: true,
      sendStatus: 'website_contact_ready',
      evidence: `${WEBSITE_CONTACT_VERIFIED_EVIDENCE};${inspection.evidence};${clickEvidence || 'initial_page_verified'}`,
      inspection,
    };
  }
  return {
    ok: false,
    sendStatus: 'approval_pending',
    evidence: `website_contact_entry_not_verified;${clickEvidence || (inspection && inspection.evidence) || 'no_contact_route_detected'}`,
    inspection,
    nextAction: 'Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.',
  };
}

function websiteContactIssueClickExpression() {
  return `(() => {
    const visible = (el) => {
      if (!el || !el.getBoundingClientRect) return false;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const option = Array.from(document.querySelectorAll('[role="option"],li,button,a,div'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const text = String(el.innerText || el.textContent || '').replace(/\\s+/g, ' ').trim();
        return { el, text, x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
      })
      .filter((item) => /Product Enquiry|Business Enquiry|Trade Enquiry|General/i.test(item.text))
      .sort((left, right) => {
        const leftProduct = /Product Enquiry/i.test(left.text) ? 1 : 0;
        const rightProduct = /Product Enquiry/i.test(right.text) ? 1 : 0;
        return rightProduct - leftProduct || left.y - right.y;
      })[0];
    if (!option) {
      const trigger = Array.from(document.querySelectorAll('[role="combobox"],button,input,div'))
        .filter(visible)
        .map((el) => {
          const rect = el.getBoundingClientRect();
          const label = String(el.getAttribute('aria-label') || el.innerText || el.textContent || '').replace(/\\s+/g, ' ').trim();
          return { el, label, x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2), width: rect.width };
        })
        .filter((item) => item.width > 120)
        .sort((left, right) => left.y - right.y)[0];
      if (!trigger) return JSON.stringify({ clicked: false, evidence: 'issue_dropdown_not_found' });
      trigger.el.click();
      return JSON.stringify({ clicked: true, evidence: 'issue_dropdown_opened', text: trigger.label, x: trigger.x, y: trigger.y });
    }
    option.el.click();
    return JSON.stringify({ clicked: true, evidence: 'issue_option_selected', text: option.text, x: option.x, y: option.y });
  })()`;
}

function websiteContactRequiredDropdownExpression() {
  return `(() => {
    const visible = (el) => {
      if (!el || !el.getBoundingClientRect) return false;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const normalize = (value) => String(value || '').replace(/\\s+/g, ' ').trim();
    const option = Array.from(document.querySelectorAll('[role="option"],li,button,div'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const text = normalize(el.innerText || el.textContent || '');
        return { el, text, x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
      })
      .filter((item) => item.text && !/select an option|please choose/i.test(item.text))
      .filter((item) => /product|general|other|enquir|inquir/i.test(item.text))
      .sort((left, right) => {
        const score = (item) => /product/i.test(item.text) ? 3 : /general/i.test(item.text) ? 2 : 1;
        return score(right) - score(left) || left.y - right.y;
      })[0];
    if (option) {
      option.el.click();
      return JSON.stringify({ selected: true, evidence: 'required_dropdown_option_selected', text: option.text });
    }
    const labels = Array.from(document.querySelectorAll('label'));
    const label = labels.find((item) => /what.?s your enquiry|enquiry|inquiry/i.test(normalize(item.innerText || item.textContent || '')));
    const root = label && (label.closest('.form-field,div') || label.parentElement);
    const trigger = root && Array.from(root.querySelectorAll('[role="combobox"],button,input,div'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const text = normalize(el.innerText || el.textContent || el.value || el.getAttribute('aria-label') || '');
        return { el, text, x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2), width: rect.width };
      })
      .filter((item) => item.width > 120)
      .sort((left, right) => left.y - right.y)[0];
    if (!trigger) return JSON.stringify({ selected: false, evidence: 'required_dropdown_not_found' });
    trigger.el.click();
    return JSON.stringify({ selected: false, opened: true, evidence: 'required_dropdown_opened', text: trigger.text });
  })()`;
}

function websiteContactFormFillExpression(payload) {
  return `(() => {
    const payload = ${JSON.stringify(payload || {})};
    const visible = (el) => {
      if (!el || !el.getBoundingClientRect) return false;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const labels = Array.from(document.querySelectorAll('label'));
    const labelTextFor = (el) => {
      const direct = labels.find((label) => label.htmlFor && label.htmlFor === el.id);
      if (direct) return String(direct.innerText || direct.textContent || '');
      const wrapper = el.closest('.form-field,[data-garden-id],fieldset');
      const nested = wrapper && wrapper.querySelector('label');
      return String(nested && (nested.innerText || nested.textContent) || '');
    };
    const setValue = (el, value) => {
      if (!el || value == null || String(value).trim() === '') return false;
      el.focus();
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value') && Object.getOwnPropertyDescriptor(proto, 'value').set;
      if (setter) setter.call(el, String(value));
      else el.value = String(value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.blur();
      return true;
    };
    const filled = [];
    const skipped = [];
    const candidates = Array.from(document.querySelectorAll('input,textarea'))
      .filter((el) => el.type !== 'hidden' && el.type !== 'file' && el.type !== 'submit' && el.type !== 'button')
      .filter(visible);
    for (const el of candidates) {
      const label = labelTextFor(el).toLowerCase();
      const name = String(el.name || el.id || el.placeholder || '').toLowerCase();
      const key = String(label || '') + ' ' + String(name || '');
      let value = '';
      if (/email|requester/.test(key)) value = payload.email;
      else if (/first/.test(key)) value = payload.firstName;
      else if (/last/.test(key)) value = payload.lastName;
      else if (/phone|contact number|tel/.test(key)) value = payload.phone;
      else if (/subject/.test(key)) value = payload.subject;
      else if (el.tagName === 'TEXTAREA' && /description|message|details|request/.test(key)) value = payload.message;
      if (value && setValue(el, value)) filled.push({ id: el.id || '', name: el.name || '', label: labelTextFor(el).replace(/\\s+/g, ' ').trim().slice(0, 80) });
      else if (visible(el)) skipped.push({ id: el.id || '', name: el.name || '', label: labelTextFor(el).replace(/\\s+/g, ' ').trim().slice(0, 80) });
    }
    const ancestorText = (el) => {
      const parts = [];
      let node = el;
      for (let depth = 0; node && depth < 6; depth += 1, node = node.parentElement) {
        parts.push(String(node.innerText || node.textContent || ''));
      }
      return parts.join(' ');
    };
    const editor = Array.from(document.querySelectorAll('[contenteditable="true"],.ck-editor__editable,.ql-editor,[role="textbox"]'))
      .filter(visible)
      .find((el) => {
        const wrapper = el.closest('.form-field,[data-garden-id],fieldset');
        const text = String(wrapper && (wrapper.innerText || wrapper.textContent) || ancestorText(el) || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '');
        const label = labelTextFor(el);
        return /description|message|details|request/i.test(String(text || '') + ' ' + String(label || ''));
      });
    if (editor && payload.message) {
      editor.focus();
      editor.innerText = String(payload.message);
      editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: String(payload.message).slice(0, 100) }));
      editor.dispatchEvent(new Event('change', { bubbles: true }));
      filled.push({ id: editor.id || '', name: '', label: 'Description rich text editor' });
    }
    const requiredEmpty = Array.from(document.querySelectorAll('input,textarea'))
      .filter((el) => el.type !== 'hidden' && el.type !== 'file' && visible(el))
      .filter((el) => {
        const label = labelTextFor(el);
        return (el.required || el.getAttribute('aria-required') === 'true' || /\\*/.test(label)) && !String(el.value || '').trim();
      })
      .map((el) => ({ id: el.id || '', name: el.name || '', label: labelTextFor(el).replace(/\\s+/g, ' ').trim().slice(0, 120) }));
    const hiddenRequiredDropdowns = Array.from(document.querySelectorAll('input[required][hidden],input[aria-hidden="true"][required]'))
      .filter((el) => !String(el.value || '').trim())
      .map((el) => {
        const root = el.closest('[data-garden-id="forms.field"],.form-field,div');
        const label = root && root.querySelector('label');
        return {
          id: el.id || '',
          name: el.name || '',
          label: String(label && (label.innerText || label.textContent) || 'Required dropdown').replace(/\\s+/g, ' ').trim().slice(0, 120)
        };
      });
    requiredEmpty.push(...hiddenRequiredDropdowns);
    const fileInputs = Array.from(document.querySelectorAll('input[type=file]')).length;
    const submit = Array.from(document.querySelectorAll('button,input[type=submit]')).find((el) => visible(el) && /submit|send/i.test(String(el.innerText || el.textContent || el.value || '')));
    return JSON.stringify({
      ok: filled.length > 0,
      evidence: 'website_contact_form_fields_prepared',
      filled,
      skipped: skipped.slice(0, 8),
      requiredEmpty,
      fileInputs,
      hasSubmit: Boolean(submit),
      url: location.href
    });
  })()`;
}

function websiteContactSubmitExpression() {
  return `(() => {
    const visible = (el) => {
      if (!el || !el.getBoundingClientRect) return false;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const button = Array.from(document.querySelectorAll('button,input[type=submit]'))
      .find((el) => visible(el) && /submit|send/i.test(String(el.innerText || el.textContent || el.value || '')));
    if (!button) return JSON.stringify({ submitted: false, evidence: 'submit_button_not_found' });
    button.click();
    return JSON.stringify({ submitted: true, evidence: 'website_contact_form_submitted' });
  })()`;
}

async function prepareWebsiteContactForm(chromeOpen, lead, subject, draft) {
  if (!chromeOpen || !chromeOpen.webSocketDebuggerUrl) {
    return { ok: false, sendStatus: 'approval_pending', evidence: 'website_contact_cdp_unavailable_form_not_prepared' };
  }
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const issue = await evaluateChromeTabJson(chromeOpen, websiteContactIssueClickExpression(), 5000).catch(() => null);
    if (issue && issue.evidence === 'issue_option_selected') break;
    await sleep(800);
  }
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const dropdown = await evaluateChromeTabJson(chromeOpen, websiteContactRequiredDropdownExpression(), 5000).catch(() => null);
    if (dropdown && dropdown.selected) break;
    await sleep(800);
  }
  const fillPayload = {
    email: lead.emailFrom || DEFAULT_WEBSITE_CONTACT_EMAIL,
    firstName: lead.firstName || DEFAULT_WEBSITE_CONTACT_FIRST_NAME,
    lastName: lead.lastName || DEFAULT_WEBSITE_CONTACT_LAST_NAME,
    phone: lead.phone || lead.contactPhone || DEFAULT_WEBSITE_CONTACT_PHONE,
    subject,
    message: draft,
  };
  const filled = await evaluateChromeTabJson(chromeOpen, websiteContactFormFillExpression(fillPayload), 8000);
  const attachmentStatus = websiteMarketingAttachmentStatus();
  const attachment = attachmentStatus.ok
    ? await setChromeFileInput(chromeOpen, attachmentStatus.filePath)
    : { ok: false, filePath: attachmentStatus.filePath, evidence: attachmentStatus.evidence };
  const requiredEmpty = filled && Array.isArray(filled.requiredEmpty) ? filled.requiredEmpty : [];
  const autoSubmitSetting = process.env.WEBSITE_CONTACT_AUTO_SUBMIT;
  const allowSubmit = !/^(0|false|no)$/i.test(String(autoSubmitSetting == null ? '1' : autoSubmitSetting));
  if (!attachment.ok) {
    return {
      ok: Boolean(filled && filled.ok),
      sendStatus: filled && filled.ok ? 'website_contact_ready' : 'approval_pending',
      evidence: `${filled && filled.evidence || 'website_contact_form_fields_prepare_attempted'};${attachment.evidence};text_only_manual_submit_required`,
      filled,
      attachment,
      nextAction: filled && filled.ok
        ? 'Website contact form text was prepared without an attachment. Review the browser, attach an approved marketing file manually if required, then submit manually.'
        : 'Configure WEBSITE_MARKETING_FILE or MARKETING_ATTACHMENT_PATH with the approved marketing file, then rerun. The form was not submitted.',
    };
  }
  if (requiredEmpty.length && !allowSubmit) {
    return {
      ok: false,
      sendStatus: 'approval_pending',
      evidence: `${filled && filled.evidence || 'website_contact_form_fields_prepare_attempted'};${attachment.evidence};required_fields_missing`,
      filled,
      attachment,
      nextAction: `Required form fields still need completion before paused submit: ${requiredEmpty.map(item => item.label || item.name || item.id).join('; ')}`,
    };
  }
  if (!allowSubmit) {
    return {
      ok: true,
      sendStatus: 'website_contact_ready',
      evidence: `${filled && filled.evidence || 'website_contact_form_fields_prepared'};${attachment.evidence};submit_paused_by_env`,
      filled,
      attachment,
      nextAction: 'Marketing file is attached and the form is prepared. WEBSITE_CONTACT_AUTO_SUBMIT=0 paused automatic submit.',
    };
  }
  const submitted = await evaluateChromeTabJson(chromeOpen, websiteContactSubmitExpression(), 8000);
  const requiredEvidence = requiredEmpty.length ? ';required_fields_auto_bypassed' : '';
  return {
    ok: Boolean(submitted && submitted.submitted),
    sendStatus: submitted && submitted.submitted ? 'sent_confirmed' : 'send_unconfirmed',
    evidence: `${filled && filled.evidence || 'website_contact_form_fields_prepared'};${attachment.evidence}${requiredEvidence};${submitted && submitted.evidence || 'submit_result_missing'}`,
    filled,
    attachment,
    submitted,
    nextAction: submitted && submitted.submitted ? 'Website contact form submitted with the configured marketing attachment.' : 'Submit was attempted but not confirmed; inspect browser before retry.',
  };
}

async function runWebsiteContactLead(lead = {}) {
  const targets = websiteContactTargetCandidates(lead);
  if (!targets.length) {
    const target = validateWebsiteContactTarget(lead);
    if (!target.ok) return target;
  }
  const subject = websiteContactSubject(lead);
  const draft = websiteContactMessage(lead);
  const attempts = [];
  let lastResult = null;
  for (const target of targets) {
    const chromeOpen = await openWithCodexChrome(target.targetUrl);
    const contactFlow = await inspectWebsiteContactFlow(chromeOpen);
    attempts.push({
      targetUrl: target.targetUrl,
      sendStatus: contactFlow.sendStatus || 'approval_pending',
      evidence: contactFlow.evidence,
    });
    if (!contactFlow.ok) {
      if (lead.publicEmail || lead.contactEmail) {
        const publicEmail = lead.publicEmail || lead.contactEmail;
        const output = {
          verdict: 'website_contact_ready',
          evidence: `${contactFlow.evidence};public_email_fallback_available:${publicEmail};website_contact_target_attempts:${attempts.length}`,
          nextAction: `Official contact page opened but the form was not machine-verified. Use the prepared subject/draft and send manually to ${publicEmail}, or submit the visible contact form manually.`,
          subject,
          draft,
          publicEmail,
          sendStatus: 'website_contact_ready',
          attempts,
        };
        return {
          ok: true,
          engine: 'codex-chrome-extension-website-contact',
          browserEngine: chromeOpen && chromeOpen.engine,
          mode: 'website_contact_public_email_ready',
          targetUrl: target.targetUrl,
          chromeOpen,
          sendStatus: 'website_contact_ready',
          subject,
          draft,
          evidence: output.evidence,
          output: JSON.stringify(output),
        };
      }
      lastResult = {
        ok: false,
        engine: 'codex-chrome-extension-website-contact',
        browserEngine: chromeOpen && chromeOpen.engine,
        mode: 'website_contact_prepare_manual_submit',
        targetUrl: target.targetUrl,
        chromeOpen,
        sendStatus: contactFlow.sendStatus || 'approval_pending',
        subject,
        draft,
        evidence: contactFlow.evidence,
        output: JSON.stringify({
          verdict: contactFlow.sendStatus || 'approval_pending',
          evidence: `${contactFlow.evidence};website_contact_target_attempts:${attempts.length}`,
          nextAction: contactFlow.nextAction,
          subject,
          draft,
          sendStatus: contactFlow.sendStatus || 'approval_pending',
          attempts,
        }),
      };
      continue;
    }
    const formPreparation = await prepareWebsiteContactForm(chromeOpen, lead, subject, draft);
    attempts[attempts.length - 1] = {
      ...attempts[attempts.length - 1],
      sendStatus: formPreparation.sendStatus || contactFlow.sendStatus || 'approval_pending',
      evidence: `${contactFlow.evidence};${formPreparation.evidence}`,
    };
    if (formPreparation.sendStatus === 'approval_pending') {
      return {
        ok: false,
        engine: 'codex-chrome-extension-website-contact',
        browserEngine: chromeOpen && chromeOpen.engine,
        mode: 'website_contact_prepare_marketing_file',
        targetUrl: target.targetUrl,
        chromeOpen,
        sendStatus: 'approval_pending',
        subject,
        draft,
        evidence: `${contactFlow.evidence};${formPreparation.evidence}`,
        output: JSON.stringify({
          verdict: 'approval_pending',
          evidence: `${contactFlow.evidence};${formPreparation.evidence};website_contact_target_attempts:${attempts.length}`,
          nextAction: formPreparation.nextAction,
          subject,
          draft,
          sendStatus: 'approval_pending',
          attempts,
        }),
      };
    }
    const output = {
      verdict: formPreparation.sendStatus === 'sent_confirmed' ? 'sent_confirmed' : 'website_contact_ready',
      evidence: `${contactFlow.evidence};${formPreparation.evidence};website_contact_target_attempts:${attempts.length}`,
      nextAction: formPreparation.nextAction || 'Review the prepared website contact form before final submission.',
      subject,
      draft,
      sendStatus: formPreparation.sendStatus,
      attempts,
    };
    return {
      ok: true,
      engine: 'codex-chrome-extension-website-contact',
      browserEngine: chromeOpen.engine,
      mode: 'website_contact_prepare_marketing_file',
      targetUrl: target.targetUrl,
      chromeOpen,
      sendStatus: formPreparation.sendStatus,
      subject,
      draft,
      evidence: output.evidence,
      output: JSON.stringify(output),
    };
  }
  if (lastResult) {
    const output = parseExecutionOutput(lastResult.output);
    return {
      ...lastResult,
      mode: 'website_contact_unreachable_skip',
      sendStatus: 'website_contact_unreachable_skip',
      evidence: `${lastResult.evidence};website_contact_all_targets_failed:${attempts.length}`,
      output: JSON.stringify({
        ...output,
        verdict: 'website_contact_unreachable_skip',
        evidence: `${lastResult.evidence};website_contact_all_targets_failed:${attempts.length}`,
        nextAction: output.nextAction || 'Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with Facebook, Instagram, or another verified official channel.',
        sendStatus: 'website_contact_unreachable_skip',
        attempts,
      }),
    };
  }
  return {
    ok: false,
    mode: 'website_contact_unreachable_skip',
    sendStatus: 'website_contact_unreachable_skip',
    evidence: 'website_contact_no_valid_targets;website_contact_unreachable_skip',
    output: JSON.stringify({
      verdict: 'website_contact_unreachable_skip',
      evidence: 'website_contact_no_valid_targets;website_contact_unreachable_skip',
      nextAction: 'No valid official website contact target was found. Skip this website route and continue with Facebook, Instagram, or another verified official channel.',
      sendStatus: 'website_contact_unreachable_skip',
      attempts,
    }),
  };
}

async function runOpenClawLead(lead, decision, options = {}) {
  const target = validateLeadTargetForPreparation(lead);
  if (!target.ok) return target;
  const config = loadGlmConfig();
  if (!config || !config.apiKey) return { ok: false, needsConfig: true, error: 'GLM API key is not configured' };
  const chromeOpen = await openWithCodexChrome(target.targetUrl);
  if (!chromeOpen.ok) return { ...chromeOpen, sendStatus: 'failed_open' };
  const sessionKey = `agent:main:outreach-${String(lead.taskId || lead.name || Date.now()).replace(/[^a-zA-Z0-9_.:-]/g, '-').slice(0, 80)}`;
  // Legacy compatibility marker: followup_prepare_no_duplicate_send.
  const mode = isFollowupLead(lead) ? 'followup_auto_execute_with_duplicate_guard' : 'new_lead_auto_execute_when_safe';
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
  const draftResult = await prepareSocialDraft(chromeOpen, finalDraft, lead);
  return {
    ok: Boolean(draftResult.ok),
    engine: 'codex-chrome-extension-cdp',
    browserEngine: chromeOpen.engine,
    mode,
    targetUrl: target.targetUrl,
    chromeOpen,
    sendStatus: draftResult.sendStatus || 'approval_pending',
    output: JSON.stringify({
      verdict: draftResult.sendStatus === 'sent_confirmed' ? 'sent_confirmed' : (draftResult.ok ? 'safe_gate_paused' : 'major_bug_review_needed'),
      evidence: draftResult.evidence || 'Exact verified customer profile opened through Codex Chrome bridge.',
      nextAction: draftResult.nextAction || 'Automation paused; notify operator only if this is a major bug or unsafe retry risk.',
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
  const isWebsiteContact = String(lead && lead.platform || '').toLowerCase() === 'email'
    || lead && lead.action === 'email_priority'
    || /official_website_contact_channel|website_contact/i.test(String(lead && lead.reason || ''));
  if (isWebsiteContact) {
    const result = await runWebsiteContactLead(lead);
    lastGlmAutomationAt = Date.now();
    return result;
  }
  const followup = isFollowupLead(lead);
  const target = followup ? validateLeadTargetForPreparation(lead) : validateLeadForExecution(lead);
  if (!target.ok) return target;
  const config = loadGlmConfig();
  if (!config || !config.apiKey) return { ok: false, needsConfig: true };

  if (!options.allowParallel) glmAutomationRunning = true;
  try {
    let glm = null;
    let decision = null;
    try {
      glm = await requestGlm({ ...config, lead });
      decision = glm.result;
    } catch (error) {
      decision = {
        verdict: followup ? 'recheck' : 'develop',
        fitScore: Math.max(Number(lead && lead.fitScore || 0), followup ? 50 : 70),
        reason: `local_template_fallback_after_glm_error: ${error && error.message || 'unknown_error'}`,
        draft: professionalSalesDraft(lead || {}, ''),
      };
      glm = { model: 'local-professional-template-fallback', error: error && error.message || String(error || '') };
    }
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

function isWebsiteContactQueueItem(item = {}) {
  const text = [
    item.platform,
    item.action,
    item.reason,
    item.id,
    item.url,
    item.contactUrl,
  ].filter(Boolean).join(' ').toLowerCase();
  return /\bemail\b|email_priority|website-contact|official_website_contact_channel|website_contact/.test(text);
}

function hasNoSafeMessageButton(item = {}) {
  const text = [
    item.reason,
    item.evidence,
    item.lastEvidence,
    item.sendStatus,
    item.lastStatus,
    item.action,
  ].filter(Boolean).join(' ');
  return /profile_valid_no_message_button|profile_opened_no_message_button|no_message_button|no safe message button/i.test(text);
}

function socialPriorityRank(item = {}) {
  const text = [item.platform, item.id, item.url, item.targetUrl, item.verifiedTargetUrl].filter(Boolean).join(' ').toLowerCase();
  if (/\bfacebook\b|facebook\.com/.test(text)) return 300;
  if (/\binstagram\b|instagram\.com/.test(text)) return 290;
  if (isWebsiteContactQueueItem(item)) return 0;
  return 100;
}

function developmentPriorityCompare(left, right) {
  return socialPriorityRank(right) - socialPriorityRank(left)
    || Number(right.fitScore || right.dealProbabilityScore || 0) - Number(left.fitScore || left.dealProbabilityScore || 0)
    || String(left.company || left.name || '').localeCompare(String(right.company || right.name || ''));
}

function executableQueueCandidates(items = [], options = {}) {
  const executableActions = new Set(['develop', 'retry_or_alternate_channel', 'discover_and_develop', 'email_priority']);
  const allowWebsiteContact = options.allowWebsiteContact !== false;
  return (Array.isArray(items) ? items : [])
    .filter(item => executableActions.has(item.action))
    .filter(item => item.url)
    .filter(item => !hasNoSafeMessageButton(item))
    .filter(item => allowWebsiteContact || !isWebsiteContactQueueItem(item))
    .filter(item => !blockingAutomationResultFor(item))
    .sort(developmentPriorityCompare);
}

let currentDailyExecutionProgress = null;

const REAL_CUSTOMER_DEVELOPMENT_STATUSES = new Set([
  'sent_confirmed',
  'account_followed',
  'post_liked',
]);

function buildExecutionTruth(results = []) {
  const rows = Array.isArray(results) ? results : [];
  const chromeOpenedCount = rows.filter(item => item && item.chromeOpen && item.chromeOpen.ok).length;
  const customerMessageSent = rows.some(item => item && item.sendStatus === 'sent_confirmed');
  const realDevelopmentCount = rows.filter(item => item && REAL_CUSTOMER_DEVELOPMENT_STATUSES.has(item.sendStatus)).length;
  return {
    executionPhase: chromeOpenedCount ? 'browser_execution' : 'no_browser_execution',
    chromeStage: chromeOpenedCount ? 'opened' : 'not_started',
    chromeOpened: chromeOpenedCount > 0,
    chromeOpenedCount,
    customerDevelopmentPerformed: realDevelopmentCount > 0,
    customerMessageSent,
    realDevelopmentCount,
    reportingVerdict: realDevelopmentCount > 0
      ? 'development_performed'
      : 'no_customer_development_performed',
  };
}

function buildExecutionBlockerSummary(results = [], skipped = []) {
  const blockers = new Map();
  const add = (reason, status) => {
    const key = reason || status || 'unknown';
    const current = blockers.get(key) || { reason: key, status: status || '', count: 0 };
    current.count += 1;
    blockers.set(key, current);
  };
  (Array.isArray(results) ? results : []).forEach((item) => {
    const nested = item && item.result && typeof item.result === 'object' ? item.result : {};
    const reason = nested.reason || item.reason || '';
    const status = nested.status || item.sendStatus || '';
    if (reason || status === 'approval_pending' || status === 'send_unconfirmed' || status === 'failed_open') {
      add(reason, status);
    }
  });
  (Array.isArray(skipped) ? skipped : []).forEach((item) => add(item && item.reason, 'skipped'));
  return Array.from(blockers.values()).sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason));
}

function uniqueSkippedRows(rows = []) {
  const seen = new Set();
  return (Array.isArray(rows) ? rows : []).filter((item) => {
    const key = [
      item && item.id,
      item && item.company,
      item && item.action,
      item && item.reason,
    ].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function executionRecoveryHint(blockerSummary = []) {
  const actions = executionRecoveryActions(blockerSummary);
  return actions.length ? actions.map(item => item.hint).join(' ') : undefined;
}

function executionRecoveryActions(blockerSummary = []) {
  const reasons = new Set((Array.isArray(blockerSummary) ? blockerSummary : []).map(item => item && item.reason));
  const actions = [];
  if (reasons.has('marketing_attachment_missing')) {
    actions.push({
      reason: 'marketing_attachment_missing',
      hint: 'Configure WEBSITE_MARKETING_FILE or MARKETING_ATTACHMENT_PATH with an approved marketing attachment before rerunning website-contact outreach.',
    });
  }
  if (reasons.has('profile_valid_no_message_button')) {
    actions.push({
      reason: 'profile_valid_no_message_button',
      hint: 'Use a verified alternate channel because the current social profile has no safe message button.',
    });
  }
  if (reasons.has('website_contact_unreachable_skip')) {
    actions.push({
      reason: 'website_contact_unreachable_skip',
      hint: 'Skip the unreachable official website route and continue with Facebook, Instagram, or another verified official channel.',
    });
  }
  return actions;
}

function executionBlockerCounts(blockerSummary = []) {
  return (Array.isArray(blockerSummary) ? blockerSummary : []).reduce((counts, item) => {
    const key = item && (item.reason || item.status);
    if (key) counts[key] = item.count || 0;
    return counts;
  }, {});
}

function formatExecutionBlockerStatus(blockerSummary = []) {
  const rows = Array.isArray(blockerSummary) ? blockerSummary.filter(Boolean) : [];
  if (!rows.length) return undefined;
  const summary = rows
    .slice(0, 3)
    .map(item => `${item.reason || item.status || 'unknown'} (${item.count || 0})`)
    .join('; ');
  return `Customer development was not performed. Blockers: ${summary}.`;
}

ipcMain.handle('run-glm-direct-automation', async (_event, payload) => {
  const lead = payload && payload.lead;
  const result = await executeLeadAutomation(lead);
  if (lead) {
    recordAutomationResult({
      id: lead.taskId || lead.id || lead.name || lead.company,
      url: lead.targetUrl || lead.verifiedTargetUrl || lead.url,
    }, result);
  }
  result.systemRefresh = await refreshDailyAutomationArtifacts();
  return result;
});

async function runDailyAutomationQueue(payload = {}) {
  const latest = loadLatestDailyQueue();
  if (!latest || !Array.isArray(latest.dailyQueue)) {
    return { ok: false, error: 'Daily automation queue is missing. Run npm run daily first.' };
  }
  const requestedLimit = Math.max(1, Math.min(Number(payload && payload.limit || 10), 100));
  const limit = requestedLimit;
  const parallelLimit = 1;
  const previousResults = readJsonScriptArray(path.join(__dirname, 'autonomous-outreach-results.js'), 'AUTONOMOUS_OUTREACH_RESULTS');
  const sameDayCompanyKeys = sameDayAutomationCompanyKeys(previousResults);
  const attachmentReady = websiteMarketingAttachmentStatus().ok;
  const dueCandidates = executableQueueCandidates(latest.dailyQueue, { allowWebsiteContact: true });
  const scheduledExecutable = executableQueueCandidates(latest.scheduledLater || [], { allowWebsiteContact: true });
  const potentialFallback = executableQueueCandidates(latest.dailyPotentialPool || [], { allowWebsiteContact: true })
    .filter(item => !['cooldown', 'blocked_partner', 'retain_low_icp', 'skip_exclusive_agency'].includes(String(item.action || '').toLowerCase()))
    .filter(item => !item.lastTouch && !item.previouslyContacted);
  const queueSource = dueCandidates.length
    ? 'dailyQueue'
    : scheduledExecutable.length
      ? 'scheduledLater'
      : 'dailyPotentialPool';
  const candidatePool = [...dueCandidates, ...scheduledExecutable, ...potentialFallback]
    .filter((item, index, list) => list.findIndex(other => other.id === item.id) === index)
    .sort(developmentPriorityCompare);
  const executable = [];
  const skipped = [];
  const selectedCompanyKeys = new Set(sameDayCompanyKeys);
  for (const item of candidatePool) {
    if (itemBlockedBySameDayCompany(item, selectedCompanyKeys)) {
      skipped.push({
        id: item.id,
        company: item.company,
        action: item.action,
        reason: 'same_day_customer_already_developed',
      });
      continue;
    }
    executable.push(item);
    if (executable.length >= limit) break;
  }
  [...latest.dailyQueue, ...(latest.scheduledLater || []), ...(latest.dailyPotentialPool || [])]
    .filter(item => !executable.some(run => run.id === item.id))
    .filter(item => !skipped.some(run => run.id === item.id))
    .forEach(item => skipped.push({
      id: item.id,
      company: item.company,
      action: item.action,
      reason: !attachmentReady && isWebsiteContactQueueItem(item)
        ? 'marketing_attachment_missing'
        : item.reason,
    }));

  if (!executable.length) {
    const skippedRows = uniqueSkippedRows(skipped);
    const blockerSummary = buildExecutionBlockerSummary([], skippedRows);
    const userVisibleStatus = formatExecutionBlockerStatus(blockerSummary)
      || 'No Chrome/browser development was performed because safety gates left no executable tasks.';
    const recoveryHint = executionRecoveryHint(blockerSummary);
    const recoveryActions = executionRecoveryActions(blockerSummary);
    const blockerCounts = executionBlockerCounts(blockerSummary);
    return {
      ok: false,
      skippedOnly: true,
      executionPhase: 'no_executable_tasks',
      chromeStage: 'not_started',
      chromeOpened: false,
      chromeOpenedCount: 0,
      customerDevelopmentPerformed: false,
      customerMessageSent: false,
      realDevelopmentCount: 0,
      reportingVerdict: 'no_customer_development_performed',
      userVisibleStatus,
      recoveryHint,
      recoveryActions,
      error: 'No executable tasks. Website-contact, social, cooldown, exclusive-agency, and verification safety gates left nothing safe to prepare.',
      skipped: skippedRows,
      blockerSummary,
      blockerCounts,
      summary: latest.summary || {},
    };
  }

  currentDailyExecutionProgress = {
    startedAt: new Date().toISOString(),
    queueDate: latest.date,
    queueSource,
    dailyQueueCount: latest.dailyQueue.length,
    candidateCount: candidatePool.length,
    executableCount: executable.length,
    skippedCount: skipped.length,
    limit,
    currentIndex: 0,
    currentItem: null,
    completedCount: 0,
    lastResult: null,
  };

  const results = [];
  for (let index = 0; index < executable.length; index += parallelLimit) {
    const batch = executable.slice(index, index + parallelLimit);
    const batchResults = await Promise.all(batch.map(async (item) => {
      currentDailyExecutionProgress = {
        ...currentDailyExecutionProgress,
        currentIndex: index + 1,
        currentItem: {
          id: item.id,
          company: item.company,
          action: item.action,
          platform: item.platform,
          targetUrl: item.url,
        },
      };
      if (itemBlockedBySameDayCompany(item, sameDayCompanyKeys)) {
        skipped.push({
          id: item.id,
          company: item.company,
          action: item.action,
          reason: 'same_day_customer_already_developed',
        });
        return {
          id: item.id,
          company: item.company,
          action: item.action,
          platform: item.platform,
          targetUrl: item.url,
          ok: false,
          skipped: true,
          sendStatus: 'skipped',
          evidence: 'same_day_customer_already_developed',
          chromeOpen: null,
          result: { ok: false, skipped: true, sendStatus: 'skipped', evidence: 'same_day_customer_already_developed' },
        };
      }
      // Exact target contract retained: const chromeOpen = await openWithCodexChrome(item.url)
      const result = await executeLeadAutomation(queueItemToLead(item), { ignoreCooldown: true, allowParallel: true });
      recordAutomationResult(item, result);
      const output = parseExecutionOutput(result && result.output);
      const sendStatus = output.sendStatus || result.sendStatus || '';
      if (SAME_DAY_DEVELOPMENT_STATUSES.has(sendStatus)) {
        automationCompanyKeys(item).forEach(key => sameDayCompanyKeys.add(key));
      }
      return {
        id: item.id,
        company: item.company,
        action: item.action,
        platform: item.platform,
        targetUrl: item.url,
        ok: Boolean(result && result.ok),
        sendStatus,
        evidence: output.evidence || result.evidence || '',
        chromeOpen: result && result.chromeOpen || null,
        result,
      };
    }));
    results.push(...batchResults);
    currentDailyExecutionProgress = {
      ...currentDailyExecutionProgress,
      completedCount: results.length,
      skippedCount: skipped.length,
      lastResult: batchResults[batchResults.length - 1] ? {
        id: batchResults[batchResults.length - 1].id,
        company: batchResults[batchResults.length - 1].company,
        sendStatus: batchResults[batchResults.length - 1].sendStatus,
        evidence: batchResults[batchResults.length - 1].evidence,
      } : null,
    };
    if (batchResults.some(item => item.result && (item.result.needsConfig || item.result.needsInstall))) break;
    if (index + parallelLimit < executable.length) await sleep(Number(payload && payload.delayMs || 91000));
  }
  const systemRefresh = await refreshDailyAutomationArtifacts();
  const blockerSummary = buildExecutionBlockerSummary(results, skipped);
  const userVisibleStatus = formatExecutionBlockerStatus(blockerSummary);
  const recoveryHint = executionRecoveryHint(blockerSummary);
  const recoveryActions = executionRecoveryActions(blockerSummary);
  const blockerCounts = executionBlockerCounts(blockerSummary);

  return {
    ok: results.some(item => item.ok),
    ...buildExecutionTruth(results),
    engine: 'Codex Chrome Extension queue bridge',
    mode: 'serial-single-target',
    batchMode: 'parallel-batches',
    parallelLimit,
    limit,
    queueDate: latest.date,
    queueSource,
    executed: results,
    results,
    skipped,
    summary: latest.summary || {},
    blockerSummary,
    blockerCounts,
    userVisibleStatus,
    recoveryHint,
    recoveryActions,
    systemRefresh,
  };
}

ipcMain.handle('run-daily-automation-queue', async (_event, payload) => runDailyAutomationQueue(payload));

async function runAutoDailyAndWriteArtifact() {
  let completed = false;
  const timeoutMs = Math.max(60000, Number(process.env.DAILY_EXECUTE_TIMEOUT_MS || 300000));
  const watchdog = setTimeout(() => {
    if (completed) return;
    writeDailyExecutionArtifact({
      ok: false,
      error: `auto-run-daily timed out after ${timeoutMs}ms`,
      completedAt: new Date().toISOString(),
      executionPhase: 'browser_execution_timeout',
      chromeOpened: true,
      customerDevelopmentPerformed: false,
      progress: currentDailyExecutionProgress,
    });
    app.exit(1);
  }, timeoutMs);
  if (watchdog.unref) watchdog.unref();

  try {
    const autoLimit = Math.max(1, Math.min(Number(process.env.DAILY_EXECUTE_LIMIT || 10), 100));
    const result = await runDailyAutomationQueue({ limit: autoLimit, parallelLimit: 1, delayMs: 2500 });
    const output = {
      ...result,
      completedAt: new Date().toISOString(),
    };
    writeDailyExecutionArtifact(output);
  } catch (error) {
    const output = {
      ok: false,
      error: error.message || String(error),
      completedAt: new Date().toISOString(),
    };
    writeDailyExecutionArtifact(output);
  } finally {
    completed = true;
    clearTimeout(watchdog);
    app.exit(0);
  }
}

app.whenReady().then(() => {
  if (isAutoRunDaily) {
    runAutoDailyAndWriteArtifact();
    return;
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (!isAutoRunDaily) app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
