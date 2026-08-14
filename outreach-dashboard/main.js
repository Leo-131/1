const { app, BrowserWindow, ipcMain, shell, safeStorage } = require('electron');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const http = require('http');
const net = require('net');
const tls = require('tls');
const { execFile, spawn } = require('child_process');
const { professionalSalesDraft, requestGlm } = require('./glm-service');
const { emailSenderReadiness } = require('./email-channel');
const { emailDomainSafety } = require('./email-operations');
const {
  recipientEmail,
  verifiedBusinessEmailTarget,
  verifyBusinessEmailDomain,
  validateFirstTouchEmail,
  sendAndConfirmAlibabaEmail,
  scanAlibabaBounces,
} = require('./alibaba-email-delivery');
const { configuredProvider, verifyEmailAddress } = require('./email-verification');
const {
  ALIBABA_WEBMAIL_SENT_URL,
  composeStartExpression,
  composeFillExpression,
  composeRecipientFocusExpression,
  composeRecipientChipExpression,
  composeRecipientTooltipInspectionExpression,
  composeSubjectFocusExpression,
  composeInspectionExpression,
  composeSendExpression,
  postSendStateExpression,
  sendToastExpression,
  sentFolderConfirmationExpression,
} = require('./alibaba-webmail-automation');
const {
  normalizeTarget,
  validateLeadForExecution,
  isBlockedFacebookTarget,
  isUnavailableProfilePage,
} = require('./autoglm-bridge');
const {
  browserAgentForResult,
  browserTransportForResult,
  executionTransportSummary,
  stableActionHash,
  validateExtensionReceipt,
} = require('./browser-transport');
const { refreshRuntime, validatePolicies } = require('./outreach-runtime');
const { acquireSendTransaction, releaseSendTransaction } = require('./outreach-intelligence');

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
if (isAutoRunDaily) {
  // The daily executor does not render customer pages itself; all outreach is
  // performed in the dedicated Chrome process on port 9224. Keep Electron on
  // software rendering so a Windows GPU reset cannot blank or terminate the
  // orchestration window while a checkpointed batch is running.
  app.disableHardwareAcceleration();
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('disable-gpu-compositing');
}
const WEBSITE_CONTACT_VERIFIED_EVIDENCE = 'contact_entry_verified';
const DEFAULT_WEBSITE_CONTACT_EMAIL = 'leo@flextailgear.com';
const DEFAULT_WEBSITE_CONTACT_FIRST_NAME = 'Leo';
const DEFAULT_WEBSITE_CONTACT_LAST_NAME = 'Liu';
const DEFAULT_WEBSITE_CONTACT_PHONE = '+86 17321028184';
const DEFAULT_WEBSITE_CONTACT_SUBJECT = 'FLEXTAIL retail partnership | 2026 assortment';

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

function retryTransientFileOperation(operation, attempts = 10) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return operation();
    } catch (error) {
      lastError = error;
      const transient = error && ['EBUSY', 'EACCES', 'EPERM', 'UNKNOWN'].includes(error.code);
      if (!transient || attempt === attempts - 1) throw error;
      // Windows can briefly hold generated dashboard artifacts while Chrome,
      // the local server, or an indexer reads them. Keep the retry bounded,
      // but long enough that a safe terminal result is not replaced by an
      // execution-failed-before-transport artifact.
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100 * (attempt + 1));
    }
  }
  throw lastError;
}

function writeJson(file, value) {
  retryTransientFileOperation(() => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 }));
}

function writeJsonScript(file, globalName, value) {
  retryTransientFileOperation(() => fs.writeFileSync(file, `window.${globalName} = ${JSON.stringify(value, null, 2)};\n`));
}

function writeDailyExecutionArtifact(output) {
  writeJson(path.join(__dirname, 'daily-automation-execution-latest.json'), output);
  writeJsonScript(path.join(__dirname, 'daily-automation-execution-latest.js'), 'DAILY_AUTOMATION_EXECUTION_LATEST', output);
  copyPublicArtifact('daily-automation-execution-latest.json');
  copyPublicArtifact('daily-automation-execution-latest.js');
  writeSystemVisibilityArtifact('main-writeDailyExecutionArtifact');
}

const DAILY_EXECUTION_CHECKPOINT_FILE = 'daily-automation-execution-checkpoint.json';

function dailyExecutionCheckpointPath() {
  return path.join(__dirname, DAILY_EXECUTION_CHECKPOINT_FILE);
}

function readDailyExecutionCheckpoint(queueDate) {
  const checkpoint = readJson(dailyExecutionCheckpointPath(), null);
  if (!checkpoint || checkpoint.queueDate !== queueDate || checkpoint.completed === true) return null;
  return checkpoint;
}

function writeDailyExecutionCheckpoint(value) {
  writeJson(dailyExecutionCheckpointPath(), {
    version: 1,
    updatedAt: new Date().toISOString(),
    ...value,
  });
  copyPublicArtifact(DAILY_EXECUTION_CHECKPOINT_FILE);
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
  retryTransientFileOperation(() => fs.writeFileSync(file, `window.${globalName} = ${JSON.stringify(value, null, 2)};\n`));
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
    .replace(/-(linkedin|instagram|facebook|website-contact)$/i, '')
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
    if (/linkedin|\bli\b/.test(explicit)) return 'linkedin';
    if (/instagram|ins/.test(explicit)) return 'instagram';
    if (/facebook|fb/.test(explicit)) return 'facebook';
    if (/email/.test(explicit)) return 'email';
    if (/website|contact/.test(explicit)) return 'website';
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
  if (/linkedin|linkedin\.com/.test(text)) return 'linkedin';
  if (/instagram|instagram\.com/.test(text)) return 'instagram';
  if (/facebook|facebook\.com|fb\.com/.test(text)) return 'facebook';
  if (/mailto|email_channel|smtp_accepted|sent_folder_message_confirmed/.test(text)) return 'email';
  if (/website-contact|official_website_contact_channel|website_contact|contact_entry/.test(text)) return 'website';
  return '';
}

function automationExactKeys(value = {}) {
  const recipient = String(value.contactEmail || value.publicEmail || value.recipient || value.recipientEmail || '')
    .trim()
    .toLowerCase();
  if (automationPlatformFor(value) === 'email' && recipient) {
    return new Set([
      value.id,
      value.taskId,
      value.task_id,
      `email:${recipient}`,
    ].map(canonicalExactAutomationKey).filter(Boolean));
  }
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
  'submitted_confirmed',
  'send_unconfirmed',
]);
function shanghaiAutomationDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

function effectiveDailyConfirmedCompanyTarget(now = new Date()) {
  try {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'daily-automation-config.json'), 'utf8'));
    const override = config.campaignScope && config.campaignScope.oneDayAdditionalConfirmedTarget || {};
    if (override.authorizedByOwner === true && override.shanghaiDate === shanghaiAutomationDate(now)) {
      return Math.max(100, Math.min(200, Number(override.effectiveDailyTarget || 100)));
    }
  } catch { /* fail closed to the standard production target */ }
  return 100;
}
const DAILY_CONFIRMED_COMPANY_TARGET = effectiveDailyConfirmedCompanyTarget();
const DEFAULT_DAILY_SOCIAL_EXECUTION_LIMIT = 25;
const MAXIMUM_DAILY_SOCIAL_EXECUTION_LIMIT = 50;
const DEFAULT_CUSTOMER_EXECUTION_TIMEOUT_MS = 90000;
const MIN_CUSTOMER_EXECUTION_TIMEOUT_MS = 30000;
const MAX_CUSTOMER_EXECUTION_TIMEOUT_MS = 180000;

function historicalAutomationResultBlocksCompany(result = {}) {
  // A bounce suppresses the exact email route, not every verified channel for
  // the company. Social remains safe because no customer interaction occurred.
  if (result.status === 'bounced') return false;
  if (COMPANY_HISTORY_BLOCKING_STATUSES.has(result.status)) {
    return sendStatusHasCustomerInteraction(result.status, result.evidence);
  }
  if (result.status !== 'failed_open') return false;
  const evidence = String(result.evidence || '');
  return /message_sent|persisted_after_reload/i.test(evidence)
    || (/send_clicked_but_confirmation_missing|enter_send_attempted_but_confirmation_missing/i.test(evidence)
      && /verified_draft_present_before_irreversible_action/i.test(evidence));
}

function exactSocialHandleMatchesCompany(item = {}) {
  const candidate = item.url || item.platformUrl || item.verifiedTargetUrl || item.targetUrl || '';
  try {
    const url = new URL(String(candidate));
    if (!/^(?:www\.)?(?:facebook|instagram)\.com$/i.test(url.hostname)) return false;
    const handle = String(url.pathname.replace(/^\/+/, '').split('/')[0] || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');
    const company = String(item.company || item.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');
    return handle.length >= 4
      && company.length >= 4
      && (handle.includes(company) || company.includes(handle));
  } catch {
    return false;
  }
}

function blockingAutomationResultFor(item) {
  const file = path.join(__dirname, 'autonomous-outreach-results.js');
  const ledgerResults = readJsonScriptArray(file, 'AUTONOMOUS_OUTREACH_RESULTS');
  const latestExecution = readJson(path.join(__dirname, 'daily-automation-execution-latest.json'), {});
  const latestExecutionResults = Array.isArray(latestExecution.executed)
    ? latestExecution.executed.map(result => ({
      ...result,
      task_id: result.task_id || result.id,
      status: result.status || result.sendStatus,
      target_url: result.target_url || result.targetUrl,
      timestamp: result.timestamp || latestExecution.completedAt || latestExecution.generatedAt,
    }))
    : [];
  const results = [...ledgerResults, ...latestExecutionResults];
  const exactKeys = automationExactKeys(item);
  const companyKeys = automationCompanyKeys(item);
  const itemPlatform = automationPlatformFor(item);
  const blocking = new Set(['sent_confirmed', 'bounced', 'failed_open', 'send_unconfirmed', 'website_contact_ready', 'website_contact_unreachable_skip']);
  const companyBlocking = new Set(['sent_confirmed', 'send_unconfirmed']);
  if (isWebsiteContactQueueItem(item) && !verifiedBusinessEmailTarget(item).ok) {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const verifiedSupplierRoute = /^official_supplier_(?:form|route)_verified$/.test(String(item.externalVerificationStatus || ''));
    const itemTargetKey = canonicalExactAutomationKey(item.contactUrl || item.url || item.website);
    const failedDays = new Set(results
      .filter(result => result && result.status === 'website_contact_unreachable_skip')
      .filter(result => String(result.evidence || '').includes(WEBSITE_CONTACT_STRATEGY_MARKER))
      .filter(result => Date.parse(result.timestamp || '') >= cutoff)
      .filter(result => {
        if (verifiedSupplierRoute) {
          const resultTargetKey = canonicalExactAutomationKey(result.target_url || result.targetUrl || result.url);
          return Boolean(itemTargetKey && resultTargetKey === itemTargetKey);
        }
        return setsIntersect(exactKeys, automationExactKeys(result))
          || setsIntersect(companyKeys, automationCompanyKeys(result));
      })
      .map(result => automationLocalDay(result.timestamp))
      .filter(Boolean));
    if (failedDays.size >= 3) {
      return {
        status: 'website_failure_circuit_open',
        evidence: `website_failure_circuit_open;failed_days:${failedDays.size};window_days:30`,
      };
    }
  }
  const sameDayFailedAttempts = results
    .filter(result => result && result.status === 'failed_open' && isSameAutomationDay(result.timestamp))
    // A technical failure retires the company for the rest of the Shanghai
    // day, regardless of which official channel the browser fell back to.
    // Code repairs may improve future companies, but must never reopen this
    // company on the same day or switch channels around the circuit.
    .filter(result => setsIntersect(exactKeys, automationExactKeys(result))
      || setsIntersect(companyKeys, automationCompanyKeys(result)));
  if (sameDayFailedAttempts.length >= 1) {
    return {
      status: 'same_day_retry_circuit_open',
      evidence: `same_day_retry_circuit_open;failed_attempts:${sameDayFailedAttempts.length}`,
    };
  }
  return results
    .filter((result) => result && (blocking.has(result.status) || historicalAutomationResultBlocksCompany(result)))
    // A page/form failure is channel-specific. If discovery later supplies a
    // verified official business email, that stronger alternate channel must
    // remain executable on the same day. Once that email path has also been
    // attempted and blocked before send by authentication, do not replay the
    // same company again that day; advance to the next safe customer.
    .filter((result) => !(verifiedBusinessEmailTarget(item).ok
      && ['website_contact_ready', 'website_contact_unreachable_skip'].includes(result.status)
      && !/email_sender_delivery_disabled/i.test(String(result.evidence || ''))
      && (!/alibaba_webmail_login_required|alibaba_webmail_session_unavailable/i.test(String(result.evidence || ''))
        || liveAlibabaWebmailSessionReady)))
    // A prepared/unreachable website path is a bounded attempt, not a
    // permanent suppression. Keep the same Shanghai-day lock to prevent
    // duplicate submissions, then allow the official path to be inspected
    // again on a later business day.
    .filter((result) => !['website_contact_ready', 'website_contact_unreachable_skip'].includes(result.status)
      || (isSameAutomationDay(result.timestamp)
        && String(result.evidence || '').includes(WEBSITE_CONTACT_STRATEGY_MARKER)))
    .filter((result) => result.status !== 'send_unconfirmed'
      || sendStatusHasCustomerInteraction(result.status, result.evidence)
      || /prior_send_unconfirmed_no_resend|sent_folder_record_missing/i.test(String(result.evidence || '')))
    .filter((result) => result.status !== 'failed_open'
      || !(/email_sender_delivery_disabled/i.test(String(result.evidence || ''))
        && /official_social_fallback/i.test(String(result.evidence || ''))
        && !/draft_inserted|send_clicked|physical_send|customer_interaction/i.test(String(result.evidence || '')))
      && (failedOpenResultShouldBlockRetry(result) || historicalAutomationResultBlocksCompany(result)))
    // A source-backed official-profile flag can recover exactly one prior
    // generic identity-string false negative after the verifier is fixed.
    .filter((result) => !((item.officialSocialProfileVerified || exactSocialHandleMatchesCompany(item))
      && result.status === 'failed_open'
      && isFixedIdentityVerifierFailure(result)))
    .find((result) => {
      if (historicalAutomationResultBlocksCompany(result) && setsIntersect(companyKeys, automationCompanyKeys(result))) return true;
      const resultExactKeys = automationExactKeys(result);
      if (setsIntersect(exactKeys, resultExactKeys)) return true;
      if (companyBlocking.has(result.status)
        && sendStatusHasCustomerInteraction(result.status, result.evidence)
        && setsIntersect(companyKeys, automationCompanyKeys(result))) return true;
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
const WEBSITE_CONTACT_STRATEGY_MARKER = 'contact_path_strategy_v2';
let liveAlibabaWebmailSessionReady = false;
let liveEmailSenderDeliveryReady = true;

function configuredEmailSenderRestoredAt() {
  try {
    const config = readJson(path.join(__dirname, 'daily-automation-config.json'), {});
    const health = config && config.emailSenderHealth || {};
    const restoredAt = Date.parse(health.restoredAt || '');
    if (health.status !== 'restored'
      || String(health.sender || '').toLowerCase() !== 'leo@flextailgear.com'
      || health.confirmedBy !== 'owner'
      || !Number.isFinite(restoredAt)) return 0;
    return restoredAt;
  } catch {
    return 0;
  }
}

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

function markWebsiteContactStrategyResult(result = {}) {
  const appendMarker = value => {
    const text = String(value || '');
    return text.includes(WEBSITE_CONTACT_STRATEGY_MARKER)
      ? text
      : `${text}${text ? ';' : ''}${WEBSITE_CONTACT_STRATEGY_MARKER}`;
  };
  let output = result.output;
  try {
    const parsed = JSON.parse(String(output || '{}'));
    output = JSON.stringify({ ...parsed, evidence: appendMarker(parsed.evidence || result.evidence) });
  } catch {
    // Preserve non-JSON diagnostic output while marking the top-level result.
  }
  return { ...result, evidence: appendMarker(result.evidence), output };
}

function sameDayDevelopmentResult(result = {}, now = Date.now()) {
  return Boolean(result
    && SAME_DAY_DEVELOPMENT_STATUSES.has(result.status)
    && isSameAutomationDay(result.timestamp, now)
    && isVerifiedSameDayWebsiteResult(result)
    && sendStatusHasCustomerInteraction(result.status, result.evidence));
}

function sendStatusHasCustomerInteraction(status, evidence = '') {
  if (status !== 'send_unconfirmed') return true;
  const text = String(evidence || '');
  if (/sender_identity_rejected_delivery_unconfirmed/i.test(text)) return true;
  if (/owner_confirmed_prior_customer_development/i.test(text)) return true;
  if (/delivery_state_uncertain/i.test(text) && /automatic_resend_forbidden/i.test(text)) return true;
  if (/message_sent|submitted_confirmed|persisted_after_reload/i.test(text)) return true;
  return /send_clicked_but_confirmation_missing|enter_send_attempted_but_confirmation_missing|submit_clicked/i.test(text)
    && /verified_draft_present_before_irreversible_action/i.test(text);
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

function sameDayConfirmedCompanyCount(results = [], now = Date.now()) {
  const companies = [];
  for (const result of results) {
    if (!result
      || !['sent_confirmed', 'submitted_confirmed'].includes(result.status)
      || !isSameAutomationDay(result.timestamp, now)
      || knownInvalidIdentityResult(result)) continue;
    const keys = automationCompanyKeys(result);
    if (!keys.size || companies.some(existing => setsIntersect(existing, keys))) continue;
    companies.push(keys);
  }
  return companies.length;
}

function platformSafetyCircuitState(results = [], now = Date.now()) {
  const safetyPattern = /captcha_or_human_verification|platform_rate_limit_or_action_block|dedicated_browser_login_required|account_checkpoint|temporarily_blocked/i;
  const counts = new Map();
  for (const result of Array.isArray(results) ? results : []) {
    if (!result || !isSameAutomationDay(result.timestamp, now)) continue;
    if (!safetyPattern.test(String(result.evidence || ''))) continue;
    const platform = automationPlatformFor(result);
    if (!platform) continue;
    counts.set(platform, (counts.get(platform) || 0) + 1);
  }
  return [...counts.entries()].reduce((state, [platform, failures]) => {
    state[platform] = {
      failures,
      threshold: 3,
      open: failures >= 3,
      reason: failures >= 3 ? 'platform_safety_circuit_open' : 'platform_safety_circuit_closed',
    };
    return state;
  }, {});
}

function knownInvalidIdentityResult(result = {}) {
  const company = String(result.company || '').trim().toLowerCase();
  const target = String(result.target_url || result.targetUrl || '').toLowerCase();
  const evidence = String(result.evidence || '').toLowerCase();
  let legacyDooroutFacebookTarget = false;
  try {
    const parsed = new URL(target);
    legacyDooroutFacebookTarget = /^(?:www\.)?facebook\.com$/i.test(parsed.hostname)
      && parsed.pathname.replace(/\/+$/, '').toLowerCase() === '/doorout';
  } catch {}
  return company === 'doorout'
    && (legacyDooroutFacebookTarget
      || evidence.includes('recipient_personal_profile:masaaki_hayashi'));
}

function itemBlockedBySameDayCompany(item, companyKeys) {
  return setsIntersect(automationCompanyKeys(item), companyKeys);
}

function failedOpenResultShouldBlockRetry(result = {}) {
  const evidence = String(result.evidence || '').toLowerCase();
  if (isFixedAlibabaRecipientVerifierFailure(result) || isFixedAlibabaSubjectVerifierFailure(result)) return false;
  const temporarySafetyFailure = /captcha_or_human_verification|platform_rate_limit_or_action_block|dedicated_browser_login_required|identity_not_verified_fail_closed/.test(evidence);
  if (temporarySafetyFailure) {
    const failedAt = Date.parse(result.timestamp || result.resultCheckedAt || '');
    const retryAfterMs = 3 * 60 * 60 * 1000;
    return !Number.isFinite(failedAt) || Date.now() - failedAt < retryAfterMs;
  }
  if (evidence.includes('profile_no_message_button')
    || evidence.includes('message_control_not_available')) return true;
  if (evidence.includes('personal_profile_without_company_match')) return true;
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
  if (/identity_mismatch_expected_[\s\S]*_title_(?:\(\d+\)\s*)?facebook\s*$/i.test(String(result.evidence || ''))
    || /identity_mismatch_expected_[\s\S]*_title_\s*$/i.test(String(result.evidence || ''))
    || evidence.includes('identity_check_pending_empty_page')) return false;
  const hardFailures = [
    'identity_mismatch',
    'unavailable_profile_page',
    'page isn',
    'wrong or unmatched account',
  ];
  if (hardFailures.some(fragment => evidence.includes(fragment))) return true;
  return true;
}

function isFixedAlibabaRecipientVerifierFailure(result = {}) {
  const evidence = String(result.evidence || '').toLowerCase();
  if (/message_sent|send_clicked_but_confirmation_missing|submit_clicked/i.test(evidence)) return false;
  return evidence.includes('alibaba_webmail_draft_verification_failed')
    && evidence.includes('recipientready:false')
    && evidence.includes('subjectready:true')
    && evidence.includes('bodyready:true')
    && evidence.includes('ant-select-selection-search-input');
}

function isFixedAlibabaSubjectVerifierFailure(result = {}) {
  const evidence = String(result.evidence || '').toLowerCase();
  if (/message_sent|send_clicked_but_confirmation_missing|submit_clicked/i.test(evidence)) return false;
  return evidence.includes('alibaba_webmail_draft_verification_failed')
    && evidence.includes('recipientready:true')
    && evidence.includes('subjectready:false')
    && evidence.includes('bodyready:true');
}

function isFixedIdentityVerifierFailure(result = {}) {
  const evidence = String(result.evidence || '');
  return /^(?:facebook|instagram)_identity_not_verified_fail_closed$/i.test(evidence)
    || /^identity_check_runtime_error:SyntaxError: Invalid regular expression flags$/i.test(evidence)
    || /(?:^|;)(?:personal_profile_without_company_match|identity_mismatch)_expected_[^;]+_title_(?:\(\d+\)\s*)?facebook(?:;|$)/i.test(evidence);
}

function checkpointResultIsTerminal(result = {}) {
  const status = String(result.sendStatus || result.status || '');
  if (['sent_confirmed', 'submitted_confirmed', 'account_followed', 'post_liked', 'website_contact_ready', 'website_contact_unreachable_skip'].includes(status)) {
    return true;
  }
  if (status === 'send_unconfirmed') {
    return sendStatusHasCustomerInteraction(status, result.evidence)
      || /prior_send_unconfirmed_no_resend|sent_folder_record_missing/i.test(String(result.evidence || ''));
  }
  if (status === 'failed_open') {
    return failedOpenResultShouldBlockRetry({
      status,
      evidence: result.evidence,
    });
  }
  return false;
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
  const rawEvidence = String(result && result.evidence || '');
  const sendStatus = result && result.sendStatus === 'send_unconfirmed'
    && /draft_not_inserted_before_send/i.test(rawEvidence)
    ? 'failed_open'
    : result && result.sendStatus;
  if (!['sent_confirmed', 'submitted_confirmed', 'bounced', 'send_unconfirmed', 'failed_open', 'draft_prepared', 'prepared_not_sent', 'account_followed', 'post_liked', 'website_contact_ready', 'website_contact_unreachable_skip', 'approval_pending'].includes(sendStatus)) return;
  const output = parseExecutionOutput(result.output);
  const timestamp = new Date().toISOString();
  const entry = {
    task_id: item.id,
    company: item.company || result.company || '',
    approval_version: 1,
    status: sendStatus,
    agent: browserAgentForResult(result),
    browserTransportUsed: browserTransportForResult(result),
    timestamp,
    target_url: result.targetUrl || (result.chromeOpen && result.chromeOpen.targetUrl) || item.url || '',
    evidence: output.evidence || result.evidence || sendStatus,
    draft: output.draft || result.draft || '',
    subject: output.subject || result.subject || '',
    recipientEmail: output.recipientEmail || result.recipientEmail || '',
    messageId: output.messageId || result.messageId || '',
    sentFolder: result.sentFolder || '',
    sentUid: result.sentUid || null,
  };
  if (knownInvalidIdentityResult(entry)) return;
  const receiptValidation = validateExtensionReceipt(result.extensionReceipt, {
    taskId: item.id,
    targetUrl: entry.target_url,
    actionHash: stableActionHash({
      taskId: item.id,
      company: item.company || result.company || '',
      targetUrl: entry.target_url,
      actionType: item.action || result.mode || '',
      subject: entry.subject,
      draft: entry.draft,
    }),
  });
  if (receiptValidation.ok) entry.extensionReceipt = result.extensionReceipt;
  const file = path.join(__dirname, 'autonomous-outreach-results.js');
  const results = readJsonScriptArray(file, 'AUTONOMOUS_OUTREACH_RESULTS');
  const companyKeys = automationCompanyKeys(entry);
  const strongerConfirmedResultExists = results.some(existing => existing
    && ['sent_confirmed', 'submitted_confirmed'].includes(existing.status)
    && setsIntersect(companyKeys, automationCompanyKeys(existing)));
  // Delivery truth is monotonic. A stale execution artifact may be replayed
  // during reconciliation, but it must never downgrade a company that already
  // has stronger confirmed evidence.
  if (strongerConfirmedResultExists && !['sent_confirmed', 'submitted_confirmed', 'bounced'].includes(entry.status)) return;
  const duplicate = results.some(existing => {
    const sameMessageId = entry.messageId && existing.messageId
      && String(existing.messageId).trim().toLowerCase() === String(entry.messageId).trim().toLowerCase();
    const sameLogicalDelivery = existing.task_id === entry.task_id
      && existing.status === entry.status
      && existing.evidence === entry.evidence
      && String(existing.recipientEmail || '').trim().toLowerCase() === String(entry.recipientEmail || '').trim().toLowerCase()
      && automationLocalDay(existing.timestamp) === automationLocalDay(entry.timestamp);
    return sameMessageId || sameLogicalDelivery;
  });
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
  retryTransientFileOperation(() => fs.copyFileSync(from, to));
  return true;
}

function repairPreSendUnconfirmedResults() {
  const file = path.join(__dirname, 'autonomous-outreach-results.js');
  const results = readJsonScriptArray(file, 'AUTONOMOUS_OUTREACH_RESULTS');
  let repaired = 0;
  for (const result of results) {
    if (!result
      || result.status !== 'send_unconfirmed'
      || !/draft_not_inserted_before_send/i.test(String(result.evidence || ''))) continue;
    result.status = 'failed_open';
    result.evidence = `${result.evidence};pre_send_failure_status_repaired`;
    repaired += 1;
  }
  if (repaired) {
    writeJsonScriptArray(file, 'AUTONOMOUS_OUTREACH_RESULTS', results);
    copyPublicArtifact('autonomous-outreach-results.js');
  }
  return repaired;
}

function reconcileExternalEvidenceConfirmations() {
  const confirmationFile = path.join(__dirname, 'external-evidence-confirmations.json');
  const confirmations = readJson(confirmationFile, []);
  if (!Array.isArray(confirmations) || !confirmations.length) return 0;
  const file = path.join(__dirname, 'autonomous-outreach-results.js');
  const results = readJsonScriptArray(file, 'AUTONOMOUS_OUTREACH_RESULTS');
  let updated = 0;
  for (const confirmation of confirmations) {
    if (!confirmation || confirmation.status !== 'sent_confirmed') continue;
    const confirmationKeys = automationCompanyKeys(confirmation);
    const candidates = results.filter(result => result
      && result.status === 'send_unconfirmed'
      && setsIntersect(confirmationKeys, automationCompanyKeys(result))
      && (!confirmation.target_url
        || canonicalExactAutomationKey(result.target_url) === canonicalExactAutomationKey(confirmation.target_url)
        || String(result.evidence || '').includes(`official_social_fallback:${automationPlatformFor(confirmation)}`)));
    const match = candidates.sort((a, b) => Date.parse(b.timestamp || 0) - Date.parse(a.timestamp || 0))[0];
    if (!match) continue;
    match.status = 'sent_confirmed';
    match.evidence = `${match.evidence || 'send_unconfirmed'};${confirmation.evidence || 'external_visible_outgoing_message_confirmed'};external_evidence_confirmation_applied;no_resend_performed`;
    updated += 1;
  }
  if (updated) {
    writeJsonScriptArray(file, 'AUTONOMOUS_OUTREACH_RESULTS', results);
    copyPublicArtifact('autonomous-outreach-results.js');
  }
  return updated;
}

async function reconcileAlibabaBounceResults() {
  const scan = await scanAlibabaBounces();
  if (!scan.ok) return { ok: false, reason: scan.reason, updated: 0, requiredEnv: scan.requiredEnv || [] };
  const file = path.join(__dirname, 'autonomous-outreach-results.js');
  const results = readJsonScriptArray(file, 'AUTONOMOUS_OUTREACH_RESULTS');
  let updated = 0;
  let senderIdentityFailures = 0;
  let historicalSenderIdentityFailures = 0;
  const senderRestoredAt = configuredEmailSenderRestoredAt();
  for (const bounce of scan.bounces || []) {
    const senderIdentityFailure = /account\s+leo@flextailgear\.com\s+is\s+disabled|sender.*disabled|mailbox.*sender.*disabled/i
      .test(String(bounce.diagnostic || ''));
    const bounceReceivedAt = Date.parse(bounce.receivedAt || '');
    const predatesRestoration = senderIdentityFailure
      && senderRestoredAt > 0
      && Number.isFinite(bounceReceivedAt)
      && bounceReceivedAt < senderRestoredAt;
    if (senderIdentityFailure && predatesRestoration) historicalSenderIdentityFailures += 1;
    else if (senderIdentityFailure) senderIdentityFailures += 1;
    const match = results.find(result => result
      && (result.status === 'sent_confirmed' || (senderIdentityFailure && result.status === 'bounced'))
      && ((bounce.messageId && result.messageId === bounce.messageId)
        || (bounce.recipient && String(result.recipientEmail || '').toLowerCase() === bounce.recipient)));
    if (!match) continue;
    match.status = senderIdentityFailure ? 'send_unconfirmed' : 'bounced';
    match.bouncedAt = bounce.receivedAt || new Date().toISOString();
    match.evidence = `${match.evidence || 'sent_confirmed'};${senderIdentityFailure ? 'sender_identity_rejected_delivery_unconfirmed;automatic_resend_forbidden' : 'bounce_confirmed'}:${bounce.diagnostic || bounce.uid || 'dsn'}`;
    updated += 1;
  }
  if (updated) {
    writeJsonScriptArray(file, 'AUTONOMOUS_OUTREACH_RESULTS', results);
    copyPublicArtifact('autonomous-outreach-results.js');
  }
  liveEmailSenderDeliveryReady = senderIdentityFailures === 0;
  return {
    ok: true,
    reason: scan.reason,
    scanned: (scan.bounces || []).length,
    updated,
    senderIdentityFailures,
    historicalSenderIdentityFailures,
    senderRestoredAt: senderRestoredAt ? new Date(senderRestoredAt).toISOString() : '',
  };
}

function dailyQueueGoalVisibility(summary = {}) {
  const target = Number(summary.potentialPoolTarget || 100);
  const potentialPool = Number(summary.potentialPool || 0);
  const refillNeeded = Math.max(0, target - potentialPool);
  return {
    target,
    potentialPool,
    refillNeeded,
    reached: refillNeeded === 0,
  };
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
    dailyQueueGoal: dailyQueueGoalVisibility(latest.summary || {}),
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
    let settled = false;
    const child = execFile(file, args, options, (error, stdout, stderr) => {
      if (settled) return;
      settled = true;
      clearTimeout(hardTimeout);
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
    const timeoutMs = Math.max(0, Number(options && options.timeout || 0));
    const hardTimeout = timeoutMs
      ? setTimeout(() => {
        if (settled) return;
        settled = true;
        try { child.kill('SIGKILL'); } catch {}
        const error = new Error(`Child process hard timeout after ${timeoutMs}ms`);
        error.code = 'ETIMEDOUT';
        error.killed = true;
        reject(error);
      }, timeoutMs + 1000)
      : null;
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
  // Customer-development automation must never attach to the operator's
  // primary Chrome (9222). Only the dedicated automation profile is eligible.
  for (const port of [9224]) {
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
      '--new-window',
      'http://127.0.0.1:4174/outreach-dashboard.html?view=workspace',
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

const automationOwnedChromeTabs = new Map();
let automationReusableChromeTab = null;

async function closeChromeTarget(port, tabId) {
  if (!port || !tabId) return false;
  const closed = await httpJson(`http://127.0.0.1:${port}/json/close/${tabId}`, 2500).catch(() => null);
  return Boolean(closed);
}

async function closeAutomationTabsOpenedAfter(existingTabIds = new Set()) {
  if (/^(1|true|yes)$/i.test(String(process.env.KEEP_AUTOMATION_TABS_VISIBLE || ''))) return 0;
  if (automationReusableChromeTab) {
    await closeChromeTarget(automationReusableChromeTab.port, automationReusableChromeTab.tabId);
    automationReusableChromeTab = null;
  }
  const owned = Array.from(automationOwnedChromeTabs.entries())
    .filter(([tabId]) => !existingTabIds.has(tabId));
  for (const [tabId, port] of owned) {
    await closeChromeTarget(port, tabId);
    automationOwnedChromeTabs.delete(tabId);
  }
  return owned.length;
}

async function closeAutomationChromeTab(chromeOpen) {
  if (!chromeOpen || !chromeOpen.tabId) return false;
  if (chromeOpen.preservedForManualReview) return false;
  if (automationReusableChromeTab && automationReusableChromeTab.tabId === chromeOpen.tabId) return false;
  const port = Number(chromeOpen.port || automationOwnedChromeTabs.get(chromeOpen.tabId) || 0);
  const closed = await closeChromeTarget(port, chromeOpen.tabId);
  automationOwnedChromeTabs.delete(chromeOpen.tabId);
  return closed;
}

function preserveAutomationChromeTab(chromeOpen) {
  if (!chromeOpen || !chromeOpen.tabId) return false;
  automationOwnedChromeTabs.delete(chromeOpen.tabId);
  chromeOpen.preservedForManualReview = true;
  return true;
}

async function openChromeTargetWithRecovery(port, targetUrl) {
  const version = await httpJson(`http://127.0.0.1:${port}/json/version`, 2500).catch(() => null);
  if (version && version.webSocketDebuggerUrl) {
    const created = await cdpCommand(version.webSocketDebuggerUrl, 'Target.createTarget', {
      url: targetUrl,
      background: false,
    }, 5000).catch(() => null);
    if (created && created.targetId) {
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const tabs = await httpJson(`http://127.0.0.1:${port}/json/list`, 2500).catch(() => []);
        const opened = Array.isArray(tabs) ? tabs.find(item => item && item.id === created.targetId) : null;
        if (opened && opened.webSocketDebuggerUrl) return opened;
        await sleep(250);
      }
    }
  }
  const endpoint = `http://127.0.0.1:${port}/json/new?${encodeURIComponent(targetUrl)}`;
  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const opened = await httpJson(endpoint, 3500, 'PUT');
      if (opened && opened.id && opened.webSocketDebuggerUrl) return opened;
      lastError = new Error(`Chrome returned an invalid target for ${targetUrl}`);
    } catch (error) {
      lastError = error;
      await sleep(400 * (attempt + 1));
    }
  }

  // Some Chrome builds intermittently hang on /json/new while an existing
  // blank tab is still usable. Reuse only an actually blank/new-tab target.
  const tabs = await httpJson(`http://127.0.0.1:${port}/json/list`, 2500).catch(() => []);
  const blank = Array.isArray(tabs) && tabs.find(item => item && item.id && item.webSocketDebuggerUrl && (
    item.url === 'about:blank' || /^chrome:\/\/newtab\/?$/i.test(item.url || '')
  ));
  if (blank) {
    try {
      await cdpCommand(blank.webSocketDebuggerUrl, 'Page.navigate', { url: targetUrl }, 5000);
      await sleep(900);
      return { ...blank, url: targetUrl };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error(`Unable to open Chrome target: ${targetUrl}`);
}

async function openWithCodexChrome(url, options = {}) {
  const parsed = validateExternalUrl(url);
  const port = await ensureCodexChromePort();
  if (!port) {
    await shell.openExternal(parsed.toString());
    return { ok: true, engine: 'shell-fallback', targetUrl: parsed.toString() };
  }
  let opened = null;
  if (options.reuseTab && automationReusableChromeTab && automationReusableChromeTab.port === port) {
    const tabs = await httpJson(`http://127.0.0.1:${port}/json/list`, 2500).catch(() => []);
    opened = Array.isArray(tabs)
      ? tabs.find(item => item && item.id === automationReusableChromeTab.tabId)
      : null;
    if (opened && opened.webSocketDebuggerUrl) {
      await cdpCommand(opened.webSocketDebuggerUrl, 'Page.navigate', { url: parsed.toString() }, 5000);
      await sleep(1200);
    } else {
      automationReusableChromeTab = null;
    }
  }
  if (!opened) {
    try {
      opened = await openChromeTargetWithRecovery(port, parsed.toString());
    } catch (error) {
      automationReusableChromeTab = null;
      return {
        ok: false,
        engine: 'codex-chrome-cdp',
        port,
        targetUrl: parsed.toString(),
        status: 'failed_open',
        error: error.message || String(error),
        evidence: 'chrome_target_open_timeout_recovered_or_exhausted',
      };
    }
  }
  if (options.automationOwned && opened && opened.id) automationOwnedChromeTabs.set(opened.id, port);
  if (options.reuseTab && opened && opened.id) automationReusableChromeTab = { port, tabId: opened.id };
  // Production runs are observable by default: only the dedicated 9224
  // window is restored and its current customer tab is activated. The
  // operator's primary Chrome/9222 is never inspected or focused.
  const showAutomationChrome = !/^(0|false|no)$/i.test(String(process.env.SHOW_AUTOMATION_CHROME || 'true'));
  if (!options.automationOwned || showAutomationChrome) await activateChromeTarget(port, opened);
  const inspected = await inspectOpenedChromeTab(opened, parsed.toString());
  if (inspected.unavailable) {
    return {
      ok: false,
      engine: 'codex-chrome-cdp',
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
    engine: 'codex-chrome-cdp',
    port,
    targetUrl: parsed.toString(),
    tabId: opened.id || '',
    webSocketDebuggerUrl: opened.webSocketDebuggerUrl || '',
    title: inspected.title || opened.title || '',
  };
}

async function activateChromeTarget(port, opened) {
  if (Number(port) !== 9224) {
    throw new Error('automation_chrome_port_mismatch: only dedicated CDP 9224 may be activated');
  }
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
  try {
    await cdpCommand(opened.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'none' }, 2000);
    await cdpCommand(opened.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 }, 2000);
    await cdpCommand(opened.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 }, 2000);
  } catch (error) {
    const domClicked = await evaluateChromeTabJson(opened, `(() => {
      const element = document.elementFromPoint(${Math.round(x)}, ${Math.round(y)});
      const target = element && (element.closest('button,a,[role="button"]') || element);
      if (!target) return JSON.stringify({ ok: false, evidence: 'dom_click_target_missing' });
      target.click();
      return JSON.stringify({ ok: true, evidence: 'dom_click_fallback_succeeded' });
    })()`, 5000).catch(() => null);
    if (!domClicked || !domClicked.ok) throw error;
  }
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
      // The driver has bounded profile, message-button and composer waits.
      // Give those waits time to return a structured safe failure instead of
      // killing the child halfway through and misreporting approval_pending.
      timeout: 80000,
      maxBuffer: 2 * 1024 * 1024,
    });
    return parseDriverJson(result.stdout);
  } catch (error) {
    const parsed = parseDriverJson(error && error.stdout);
    if (parsed) return parsed;
    const timedOut = Boolean(error && (error.killed || error.signal === 'SIGTERM' || /timed out|timeout/i.test(String(error.message || ''))));
    return {
      ok: false,
      sendStatus: timedOut ? 'failed_open' : 'approval_pending',
      evidence: timedOut
        ? 'driver_timeout_bounded:80000'
        : `driver_error: ${error && error.message || 'unknown'}`,
      nextAction: timedOut
        ? 'The bounded driver window expired without a send confirmation; continue through another verified channel.'
        : 'Major Codex Chrome driver failure; pause and notify operator before retry.',
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
  // Process-local automation uses CDP. A result may only be called Codex
  // Chrome Extension execution when it carries a validated extension receipt.
  // Rewriting stays local so GLM availability cannot block browser work.
  return fallback;
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
    officialProfileVerified: Boolean(lead && lead.officialSocialProfileVerified),
    draft: safeDraft,
    autoSend: true,
    // Owner-authorized social sequence: follow + like + private message.
    // The driver never publishes an automatic public comment.
    autoEngage: true,
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
  await clickChromeTabAt(opened, button.x, button.y);
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
    officialProfileVerified: Boolean(lead && lead.officialSocialProfileVerified),
    draft: safeDraft,
    autoSend: true,
    // Owner-authorized social sequence: follow + like + private message.
    // The driver never publishes an automatic public comment.
    autoEngage: true,
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

function legacyMarketingEmailSignature() {
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

function legacyWebsiteContactMessage(lead = {}) {
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

${legacyMarketingEmailSignature()}
`;
}

function websiteContactMessage(lead = {}) {
  if (lead.websiteContactMessage) return String(lead.websiteContactMessage).trim();
  const rawName = String(lead.company || lead.name || 'Your')
    .replace(/\s+(Inc|Ltd|Limited|LLC|Group)$/i, '')
    .trim() || 'Your';
  const relevance = String(
    lead.productCategory
    || lead.keyword
    || 'outdoor, camping and travel retail'
  ).replace(/\s+/g, ' ').trim();
  return `Dear ${rawName} Team,

I’m Leo from FLEXTAIL. Your focus on ${relevance} looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.

FLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.

Would you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?

Product overview: https://www.flextail.com/

Best regards,
Leo Liu
Sales & Operations Director
Leo@flextailgear.com`;
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

async function navigateChromeTab(opened, targetUrl) {
  if (!opened || !opened.webSocketDebuggerUrl || !/^https?:\/\//i.test(String(targetUrl || ''))) return false;
  await cdpCommand(opened.webSocketDebuggerUrl, 'Page.navigate', { url: targetUrl }, 5000);
  await sleep(1600);
  return true;
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
  const expandedCandidates = [];
  for (const value of rawCandidates) {
    expandedCandidates.push(value);
    try {
      const parsed = new URL(String(value || ''));
      if (parsed.protocol !== 'https:' || parsed.pathname.replace(/\/+$/, '') !== '') continue;
      [
        '/pages/contact-us',
        '/pages/contact',
        '/contact-us',
        '/contact',
        '/help/contact-us',
      ].forEach(contactPath => expandedCandidates.push(new URL(contactPath, parsed.origin).href));
    } catch {
      // Invalid candidates are rejected by validateWebsiteContactTarget below.
    }
  }
  const seen = new Set();
  const candidates = [];
  for (const value of expandedCandidates) {
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
    const socialLinks = Array.from(document.querySelectorAll('a[href]'))
      .map((el) => String(el.href || el.getAttribute('href') || '').trim())
      .filter((href) => /^https?:\/\//i.test(href))
      .filter((href) => /linkedin\.com|instagram\.com|facebook\.com|fb\.com/i.test(href))
      .filter((href) => !/\/share|\/sharer|\/intent|\/login|\/privacy|\/terms/i.test(href))
      .filter((href, index, list) => list.indexOf(href) === index)
      .slice(0, 8);
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
    const businessWords = ['business enquiry', 'business inquiry', 'trade enquiry', 'trade inquiry', 'vendor', 'supplier', 'wholesale', 'partnership', 'corporate sales', 'become a supplier', 'sales enquiry', 'customer service enquiry', 'submit a request', 'send us a message', 'contact form', 'email us', 'contactez-nous', 'nous contacter', 'kontakt', 'contáctanos', 'contactanos', 'contattaci', 'contato'];
    const hasBusinessCue = businessWords.some((word) => lowerText.includes(word));
    const actionableControls = controls.filter((item) => {
      const text = (String(item.text || '') + ' ' + String(item.href || '')).toLowerCase();
      return businessWords.some((word) => text.includes(word))
        || /contact us|get in touch|enquir|inquir|support request|request form|customer care|help request|contactez-nous|nous contacter|kontakt|cont[aá]ctanos|contattaci|contato/.test(text);
    });
    const hasContactForm = messageFields.length >= 2 || fields.some((field) => field.tag === 'TEXTAREA') || fields.some((field) => /email/.test(String(field.type || '') + ' ' + String(field.label || '')));
    const ready = mailtos.length > 0 || hasContactForm;
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
      mailtos: mailtos.slice(0, 8),
      fieldCount: fields.length,
      messageFieldCount: messageFields.length,
      actionCount: actionableControls.length,
      actions: actionableControls.slice(0, 6),
      socialLinks
    });
  })()`;
}

function socialFallbackFromInspection(lead = {}, inspection = {}) {
  const alternateChannels = lead.alternateChannels && typeof lead.alternateChannels === 'object'
    ? lead.alternateChannels
    : {};
  const officialWebsiteLinks = Array.isArray(inspection && inspection.socialLinks) ? inspection.socialLinks : [];
  const links = [
    ...officialWebsiteLinks,
    lead.linkedinUrl,
    lead.linkedin_url,
    lead.facebookUrl,
    lead.facebook_url,
    lead.instagramUrl,
    lead.instagram_url,
    alternateChannels.linkedin,
    alternateChannels.facebook,
    alternateChannels.instagram,
  ].filter((url, index, list) => /^https?:\/\//i.test(String(url || '')) && list.indexOf(url) === index);
  const ranked = links
    .map((url) => {
      const text = String(url || '').toLowerCase();
      const platform = text.includes('linkedin.com') ? 'linkedin'
        : text.includes('facebook.com') || text.includes('fb.com') ? 'facebook'
          : text.includes('instagram.com') ? 'instagram'
            : '';
      const rank = platform === 'linkedin' ? 3 : platform === 'facebook' ? 2 : platform === 'instagram' ? 1 : 0;
      return { url, platform, rank };
    })
    .filter(item => item.platform && item.rank > 0)
    .sort((a, b) => b.rank - a.rank);
  const best = ranked[0];
  if (!best) return null;
  const verifiedByOfficialWebsite = officialWebsiteLinks.some(url => String(url || '').toLowerCase() === String(best.url || '').toLowerCase());
  return {
    ...lead,
    taskId: `${lead.taskId || lead.id || lead.company || lead.name}-${best.platform}-fallback`,
    id: `${lead.id || lead.taskId || lead.company || lead.name}-${best.platform}-fallback`,
    platform: best.platform,
    platformUrl: best.url,
    targetUrl: best.url,
    verifiedTargetUrl: best.url,
    url: best.url,
    action: 'develop',
    reason: 'official_website_social_fallback',
    officialSocialProfileVerified: verifiedByOfficialWebsite || lead.officialSocialProfileVerified === true,
    socialProfileEvidenceUrl: verifiedByOfficialWebsite
      ? (inspection.url || lead.contactUrl || lead.website || lead.url || '')
      : (lead.socialProfileEvidenceUrl || ''),
  };
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
    const positive = /contact us|get in touch|send us a message|submit a request|business enquiry|business inquiry|trade enquiry|trade inquiry|sales enquiry|enquir|inquir|vendor|supplier|wholesale|partnership|corporate sales|become a supplier|email us|customer service enquiry|support request|request form|contactez-nous|nous contacter|kontakt|cont[aá]ctanos|contattaci|contato/i;
    const negative = /skip to (?:main )?content|continue shopping|search|sign in|login|cart|wishlist|store locator|track order|return policy|privacy|terms|newsletter|language|translate|accessibility|live chat|(?:accept|allow|reject|decline)(?: all)?(?: cookies?)?|cookie (?:settings|preferences|policy)|manage (?:consent|preferences)|consent preferences/i;
    const negativeHref = /\\/collections?\\/|\\/products?\\/|\\/categories?\\/|\\/catalog(?:ue)?\\/|\\/search(?:[/?#]|$)|(?:[?&#]|\\/)filter[:=/]|(?:[?&#]|\\/)vendor[:=/]|\\/sale(?:[/?#]|$)/i;
    const positiveHref = /\\/(?:contact(?:-us)?|customer-service|support|help\\/contact-us|vendor|supplier|wholesale|partnership)(?:[/?#]|$)/i;
    const registrableHost = (host) => {
      const parts = String(host || '').toLowerCase().replace(/^www\./, '').split('.').filter(Boolean);
      const publicSuffix = parts.slice(-2).join('.');
      const needsThree = /^(co\.uk|com\.au|co\.nz|co\.jp|com\.br|com\.mx)$/.test(publicSuffix);
      return parts.slice(needsThree ? -3 : -2).join('.');
    };
    const currentHost = registrableHost(location.hostname);
    const candidates = Array.from(document.querySelectorAll('a,button,[role="button"]'))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const href = el.href || el.getAttribute('href') || '';
        const text = textOf(el);
        const haystack = String(text || '') + ' ' + String(href || '');
        let sameHost = true;
        try {
          if (/^https?:/i.test(href)) sameHost = registrableHost(new URL(href).hostname) === currentHost;
        } catch {
          sameHost = true;
        }
        return { el, text, href, haystack, sameHost, x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
      })
      .filter((item) => {
        const conciseText = String(item.text || '').length <= 120 && positive.test(item.text);
        return (conciseText || positiveHref.test(item.href))
          && !negative.test(item.haystack)
          && !negativeHref.test(item.href)
          && item.sameHost;
      });
    const ranked = candidates.sort((left, right) => {
      const exactLeft = /^(contact us|get in touch|submit a request|send us a message|contactez-nous|nous contacter|kontakt|cont[aá]ctanos|contattaci|contato)$/i.test(left.text) ? 1 : 0;
      const exactRight = /^(contact us|get in touch|submit a request|send us a message|contactez-nous|nous contacter|kontakt|cont[aá]ctanos|contattaci|contato)$/i.test(right.text) ? 1 : 0;
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
    const navigated = /^https?:\/\//i.test(String(clicked.href || ''))
      ? await navigateChromeTab(chromeOpen, clicked.href)
      : false;
    if (!navigated) await clickChromeTabAt(chromeOpen, clicked.x, clicked.y);
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
      if (/email|e-mail|requester|courriel/.test(key)) value = payload.email;
      else if (/first|pr[eé]nom|vorname|nombre|nome/.test(key)) value = payload.firstName;
      else if (/last|surname|nom de famille|nachname|apellido|cognome/.test(key)) value = payload.lastName;
      else if (/phone|contact number|tel|t[eé]l[eé]phone|telefon|tel[eé]fono/.test(key)) value = payload.phone;
      else if (/subject|objet|betreff|asunto|oggetto/.test(key)) value = payload.subject;
      else if (el.tagName === 'TEXTAREA' && /description|message|details|request|demande|nachricht|mensaje|messaggio/.test(key)) value = payload.message;
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
    const fileInputElements = Array.from(document.querySelectorAll('input[type=file]'));
    const fileInputs = fileInputElements.length;
    const requiredFileInputs = fileInputElements.filter((el) => el.required || el.getAttribute('aria-required') === 'true').length;
    const submit = Array.from(document.querySelectorAll('button,input[type=submit]')).find((el) => visible(el) && (/submit|send|envoyer|senden|enviar|invia|versturen/i.test(String(el.innerText || el.textContent || el.value || '')) || String(el.type || '').toLowerCase() === 'submit'));
    return JSON.stringify({
      ok: filled.length > 0,
      evidence: 'website_contact_form_fields_prepared',
      filled,
      skipped: skipped.slice(0, 8),
      requiredEmpty,
      fileInputs,
      requiredFileInputs,
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
      .find((el) => visible(el) && (/submit|send|envoyer|senden|enviar|invia|versturen/i.test(String(el.innerText || el.textContent || el.value || '')) || String(el.type || '').toLowerCase() === 'submit'));
    if (!button) return JSON.stringify({ submitted: false, evidence: 'submit_button_not_found' });
    const form = button.closest('form');
    if (form) form.setAttribute('data-codex-contact-submit', 'pending');
    const beforeUrl = location.href;
    const bodyText = String(document.body && document.body.innerText || '').replace(/\s+/g, ' ').toLowerCase();
    const beforeSuccess = /thank you|thanks for contacting|message (has been )?sent|request (has been )?(received|submitted)|successfully submitted|we have received|merci de nous avoir contact|message envoy[ée]|vielen dank|nachricht gesendet|gracias por contactarnos|mensaje enviado|grazie per averci contattato|messaggio inviato/.test(bodyText);
    button.click();
    return JSON.stringify({ submitted: true, evidence: 'website_contact_form_submit_clicked', beforeUrl, beforeSuccess, trackedForm: Boolean(form) });
  })()`;
}

function websiteContactSubmitConfirmationExpression(beforeUrl = '', trackedForm = false, beforeSuccess = false) {
  return `(() => {
    const bodyText = String(document.body && document.body.innerText || '').replace(/\\s+/g, ' ').toLowerCase();
    const success = /thank you|thanks for contacting|message (has been )?sent|request (has been )?(received|submitted)|successfully submitted|we have received|merci de nous avoir contact|message envoy[ée]|vielen dank|nachricht gesendet|gracias por contactarnos|mensaje enviado|grazie per averci contattato|messaggio inviato/.test(bodyText);
    const urlSuccess = /thank|success|confirmation|submitted|merci/i.test(location.href) && location.href !== ${JSON.stringify(beforeUrl)};
    const trackedFormPresent = Boolean(document.querySelector('form[data-codex-contact-submit="pending"]'));
    const visibleError = /please complete|required field|captcha|verification failed|there was an error|une erreur|erreur|fehler|errore|error al enviar/.test(bodyText);
    const confirmed = !visibleError && ((success && !${Boolean(beforeSuccess)}) || urlSuccess || (${Boolean(trackedForm)} && !trackedFormPresent));
    return JSON.stringify({ confirmed, success, urlSuccess, trackedFormPresent, visibleError, url: location.href, evidence: confirmed ? 'website_contact_submission_confirmed' : (visibleError ? 'website_contact_submission_validation_error' : 'website_contact_submission_confirmation_missing') });
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
  const requiredEmpty = filled && Array.isArray(filled.requiredEmpty) ? filled.requiredEmpty : [];
  const fileInputs = Number(filled && filled.fileInputs || 0);
  const requiredFileInputs = Number(filled && filled.requiredFileInputs || 0);
  const attachment = fileInputs === 0
    ? { ok: true, filePath: '', evidence: 'website_contact_form_no_file_input' }
    : attachmentStatus.ok
      ? await setChromeFileInput(chromeOpen, attachmentStatus.filePath)
      : { ok: false, filePath: attachmentStatus.filePath, evidence: attachmentStatus.evidence };
  const autoSubmitSetting = process.env.WEBSITE_CONTACT_AUTO_SUBMIT;
  const allowSubmit = !/^(0|false|no)$/i.test(String(autoSubmitSetting == null ? '1' : autoSubmitSetting));
  if (!attachment.ok && requiredFileInputs > 0) {
    return {
      ok: Boolean(filled && filled.ok),
      sendStatus: 'approval_pending',
      evidence: `${filled && filled.evidence || 'website_contact_form_fields_prepare_attempted'};${attachment.evidence};required_attachment_missing`,
      filled,
      attachment,
      nextAction: 'Configure WEBSITE_MARKETING_FILE or MARKETING_ATTACHMENT_PATH with the required approved marketing file, then rerun. The form was not submitted.',
    };
  }
  if (requiredEmpty.length) {
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
  if (!filled || !filled.ok || !filled.hasSubmit) {
    return {
      ok: false,
      sendStatus: 'approval_pending',
      evidence: `${filled && filled.evidence || 'website_contact_form_fields_prepare_failed'};contact_form_not_ready_for_submit`,
      filled,
      attachment,
      nextAction: 'A verified Contact Us page opened, but the required message fields or submit control were not ready. Continue with another social channel.',
    };
  }
  const submitted = await evaluateChromeTabJson(chromeOpen, websiteContactSubmitExpression(), 8000);
  let confirmation = null;
  if (submitted && submitted.submitted) {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      await sleep(1000);
      confirmation = await evaluateChromeTabJson(chromeOpen, websiteContactSubmitConfirmationExpression(submitted.beforeUrl, submitted.trackedForm, submitted.beforeSuccess), 5000).catch(() => null);
      if (confirmation && confirmation.confirmed) break;
    }
  }
  const confirmed = Boolean(submitted && submitted.submitted && confirmation && confirmation.confirmed);
  const attachmentEvidence = attachment.ok ? attachment.evidence : `${attachment.evidence};optional_attachment_omitted`;
  return {
    ok: confirmed,
    sendStatus: confirmed ? 'submitted_confirmed' : 'send_unconfirmed',
    evidence: `${filled && filled.evidence || 'website_contact_form_fields_prepared'};${attachmentEvidence};${submitted && submitted.evidence || 'submit_result_missing'};${confirmation && confirmation.evidence || 'website_contact_submission_confirmation_missing'}`,
    filled,
    attachment,
    submitted,
    confirmation,
    nextAction: confirmed ? 'Website contact form submission was confirmed by the destination page.' : 'Submit was attempted but no success receipt was detected; do not count this as completed development or retry blindly.',
  };
}

function officialMailtoLead(lead = {}, inspection = {}, evidenceUrl = '') {
  const values = Array.isArray(inspection && inspection.mailtos) ? inspection.mailtos : [];
  const recipient = values
    .map(value => String(value || '').replace(/^mailto:/i, '').split('?')[0].trim())
    .find(value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  if (!recipient) return null;
  return {
    ...lead,
    publicEmail: recipient,
    contactEmail: recipient,
    emailVerificationStatus: 'official_website_mailto',
    publicEmailStatus: 'Official public business email from verified website mailto',
    emailEvidence: `official_website_mailto:${evidenceUrl || inspection.url || ''}`,
  };
}

async function probeAlibabaWebmailSession() {
  const chromeOpen = await openWithCodexChrome(ALIBABA_WEBMAIL_SENT_URL, { automationOwned: true, reuseTab: true });
  if (!chromeOpen || !chromeOpen.ok || !chromeOpen.webSocketDebuggerUrl) {
    return { ok: false, evidence: 'alibaba_webmail_session_unavailable' };
  }
  try {
    let inspection = null;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      inspection = await evaluateChromeTabJson(chromeOpen, `(() => {
      const visible = (element) => Boolean(element && element.getClientRects && element.getClientRects().length);
      const textOf = (element) => String(element?.innerText || element?.textContent || element?.getAttribute?.('aria-label') || element?.getAttribute?.('title') || '').trim();
      const roots = [document];
      for (let index = 0; index < roots.length; index += 1) {
        const root = roots[index];
        for (const element of root.querySelectorAll('*')) {
          if (element.shadowRoot && !roots.includes(element.shadowRoot)) roots.push(element.shadowRoot);
          if (element.tagName === 'IFRAME') {
            try {
              if (element.contentDocument && !roots.includes(element.contentDocument)) roots.push(element.contentDocument);
            } catch {}
          }
        }
      }
      const loginControl = roots.flatMap(root => Array.from(root.querySelectorAll('input[type="password"],form[action*="login" i]'))).find(visible);
      const composePattern = /\\b(compose|new message|write mail|new mail)\\b|写邮件|撰写|新建邮件/i;
      const compose = roots.flatMap(root => Array.from(root.querySelectorAll('button,[role="button"],a,div[tabindex],[data-testid],[class]')))
        .find(element => visible(element) && composePattern.test([textOf(element), element.getAttribute?.('aria-label'), element.getAttribute?.('data-testid'), element.getAttribute?.('class')].filter(Boolean).join(' ')));
      return JSON.stringify({
        ok: Boolean(compose && !loginControl),
        evidence: compose && !loginControl ? 'alibaba_webmail_authenticated_compose_visible' : (loginControl ? 'alibaba_webmail_login_required' : 'alibaba_webmail_compose_button_missing'),
        url: location.href,
        title: document.title,
      });
      })()`, 8000).catch(() => null);
      if (inspection && inspection.ok) break;
      // Alibaba Mail briefly renders its login shell while restoring an
      // already-authenticated session. Require a stable login state before
      // failing the route instead of repeatedly starting credential flows.
      if (attempt < 5) await sleep(700);
    }
    return inspection && inspection.ok
      ? inspection
      : { ok: false, evidence: inspection && inspection.evidence || 'alibaba_webmail_session_probe_failed' };
  } finally {
    await closeAutomationChromeTab(chromeOpen);
  }
}

async function runAlibabaWebmailEmailLead(lead = {}, subject = '', draft = '') {
  const target = verifiedBusinessEmailTarget(lead);
  if (!target.ok) return { ok: false, skipped: true, sendStatus: 'skipped', reason: target.reason, evidence: target.reason };
  const contentValidation = validateFirstTouchEmail({
    from: 'Leo@flextailgear.com',
    to: target.recipient,
    subject,
    text: draft,
    attachments: [],
  });
  if (!contentValidation.ok) {
    return {
      ok: false,
      skipped: true,
      sendStatus: 'skipped',
      reason: 'first_touch_email_policy_failed',
      evidence: `first_touch_email_policy_failed:${contentValidation.errors.join('|')}`,
      contentValidation,
    };
  }
  const chromeOpen = await openWithCodexChrome(ALIBABA_WEBMAIL_SENT_URL, { automationOwned: true, reuseTab: true });
  if (!chromeOpen || !chromeOpen.ok || !chromeOpen.webSocketDebuggerUrl) {
    return {
      ok: false,
      skipped: true,
      sendStatus: 'skipped',
      reason: 'alibaba_webmail_session_unavailable',
      evidence: chromeOpen && (chromeOpen.evidence || chromeOpen.error) || 'alibaba_webmail_session_unavailable',
    };
  }
  const autoSendAuthorization = 'verified_email_auto_send_no_manual_review';
  let preserveTabForEvidence = false;
  try {
    let compose = null;
    let consecutiveLoginObservations = 0;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      compose = await evaluateChromeTabJson(chromeOpen, composeStartExpression(), 8000).catch(() => null);
      if (compose && compose.ok) break;
      if (compose && compose.evidence === 'alibaba_webmail_login_required') {
        consecutiveLoginObservations += 1;
        if (consecutiveLoginObservations >= 6) break;
      } else {
        consecutiveLoginObservations = 0;
      }
      await sleep(700);
    }
    if (!compose || !compose.ok) return {
      ok: false,
      sendStatus: 'failed_open',
      reason: 'alibaba_webmail_compose_unavailable',
      evidence: `${autoSendAuthorization};${compose && compose.evidence || 'alibaba_webmail_compose_unavailable'}`,
      manualApprovalRequired: false,
      autoSendAuthorized: true,
    };
    await sleep(700);
    const payload = { recipient: target.recipient, subject, text: draft };
    let filled = null;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      filled = await evaluateChromeTabJson(chromeOpen, composeFillExpression(payload), 8000).catch(() => null);
      if (filled && filled.ok) break;
      await sleep(500);
    }
    let recipientStage = null;
    if (filled && filled.ok && !filled.recipientCommittedMatch) {
      const recipientControl = filled.recipientControl || {};
      const recipientX = Number(recipientControl.x || 0) + Number(recipientControl.width || 0) / 2;
      const recipientY = Number(recipientControl.y || 0) + Number(recipientControl.height || 0) / 2;
      if (Number(recipientControl.width || 0) > 0 && Number(recipientControl.height || 0) > 0) {
        await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', {
          type: 'mouseMoved',
          x: recipientX,
          y: recipientY,
        }, 3000);
        await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', {
          type: 'mousePressed',
          x: recipientX,
          y: recipientY,
          button: 'left',
          clickCount: 1,
        }, 3000);
        await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', {
          type: 'mouseReleased',
          x: recipientX,
          y: recipientY,
          button: 'left',
          clickCount: 1,
        }, 3000);
      }
      const recipientFocused = await evaluateChromeTabJson(chromeOpen, composeRecipientFocusExpression(), 5000).catch(() => null);
      if (recipientFocused && recipientFocused.ok) {
      await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
        type: 'keyDown', key: 'a', code: 'KeyA', modifiers: 2,
      }, 3000);
      await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
        type: 'keyUp', key: 'a', code: 'KeyA', modifiers: 2,
      }, 3000);
      await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
        type: 'keyDown', key: 'Backspace', code: 'Backspace',
      }, 3000);
      await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
        type: 'keyUp', key: 'Backspace', code: 'Backspace',
      }, 3000);
      await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.insertText', {
        text: target.recipient,
      }, 3000);
      await sleep(900);
      await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
        type: 'keyDown', key: 'Enter', code: 'Enter',
      }, 3000);
      await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
        type: 'keyUp', key: 'Enter', code: 'Enter',
      }, 3000);
      await sleep(500);
      // Ant Design's searchable recipient control may use the first Enter to
      // accept an autocomplete suggestion while leaving the exact address in
      // the search input. A second Enter commits that selection as a chip.
      // Never accept a different suggestion: retry only on an exact match.
      const recipientNeedsSecondCommit = await evaluateChromeTabJson(chromeOpen, `(() => {
        const active = document.activeElement;
        return JSON.stringify({
          exactExpectedAddress: String(active?.value || '').trim().toLowerCase() === ${JSON.stringify(target.recipient.toLowerCase())},
          role: active?.getAttribute?.('role') || '',
        });
      })()`, 5000).catch(() => null);
      if (recipientNeedsSecondCommit && recipientNeedsSecondCommit.exactExpectedAddress) {
        await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
          type: 'keyDown', key: 'Enter', code: 'Enter',
        }, 3000);
        await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
          type: 'keyUp', key: 'Enter', code: 'Enter',
        }, 3000);
        await sleep(500);
      }
      }
      recipientStage = await evaluateChromeTabJson(chromeOpen, `(() => {
        const active = document.activeElement;
        const rect = active?.getBoundingClientRect?.();
        return JSON.stringify({
          valueMatch: String(active?.value || '').toLowerCase() === ${JSON.stringify(target.recipient.toLowerCase())},
          type: active?.getAttribute?.('type') || '',
          role: active?.getAttribute?.('role') || '',
          className: String(active?.className || '').slice(0, 120),
          x: Math.round(rect?.x || 0),
          y: Math.round(rect?.y || 0),
        });
      })()`, 5000).catch(() => null);
    }
    const subjectFocused = await evaluateChromeTabJson(chromeOpen, composeSubjectFocusExpression(), 5000).catch(() => null);
    if (subjectFocused && subjectFocused.ok) {
      await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
        type: 'keyDown', key: 'a', code: 'KeyA', modifiers: 2,
      }, 3000);
      await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchKeyEvent', {
        type: 'keyUp', key: 'a', code: 'KeyA', modifiers: 2,
      }, 3000);
      await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.insertText', {
        text: subject,
      }, 3000);
      await sleep(350);
    }
    await sleep(500);
    let inspected = await evaluateChromeTabJson(chromeOpen, composeInspectionExpression(payload), 8000);
    let recipientTooltipEvidence = 'recipient_tooltip_verification_not_needed';
    if (inspected && !inspected.recipientReady && inspected.subjectReady && inspected.bodyReady) {
      const chip = await evaluateChromeTabJson(chromeOpen, composeRecipientChipExpression(), 5000).catch(() => null);
      recipientTooltipEvidence = chip && chip.evidence || 'alibaba_webmail_scoped_recipient_chip_missing';
      if (chip && chip.ok && Number.isFinite(chip.x) && Number.isFinite(chip.y)) {
        for (let clickAttempt = 0; clickAttempt < 2; clickAttempt += 1) {
          await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x: chip.x, y: chip.y }, 3000);
          await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mousePressed', x: chip.x, y: chip.y, button: 'left', clickCount: 1 }, 3000);
          await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mouseReleased', x: chip.x, y: chip.y, button: 'left', clickCount: 1 }, 3000);
          await sleep(350);
          const tooltip = await evaluateChromeTabJson(chromeOpen, composeRecipientTooltipInspectionExpression({ recipient: target.recipient }), 5000).catch(() => null);
          recipientTooltipEvidence = `${recipientTooltipEvidence};recipientChipClick:${clickAttempt + 1};${tooltip && tooltip.evidence || 'recipient_tooltip_inspection_missing'}`;
          if (tooltip && tooltip.exactRecipient) {
            inspected = { ...inspected, ok: true, recipientReady: true, recipientTooltipExactMatch: true, evidence: 'alibaba_webmail_draft_verified_by_recipient_tooltip' };
            break;
          }
        }
      }
    }
    if (!filled || !filled.ok || !inspected || !inspected.ok) {
      preserveTabForEvidence = preserveAutomationChromeTab(chromeOpen);
      const inspectionFlags = inspected
        ? `recipientReady:${Boolean(inspected.recipientReady)};subjectReady:${Boolean(inspected.subjectReady)};bodyReady:${Boolean(inspected.bodyReady)}`
        : 'inspection_flags_missing';
      const recipientStageEvidence = recipientStage
        ? `recipientStageValueMatch:${Boolean(recipientStage.valueMatch)};recipientStageType:${recipientStage.type || 'none'};recipientStageRole:${recipientStage.role || 'none'};recipientStageClass:${recipientStage.className || 'none'};recipientStageXY:${recipientStage.x || 0},${recipientStage.y || 0}`
        : 'recipient_stage_missing';
      const control = filled && filled.recipientControl;
      const recipientControlEvidence = control
        ? `recipientControl:${control.tag || 'none'},${control.type || 'none'},${control.role || 'none'},${control.className || 'none'};recipientControlXY:${control.x || 0},${control.y || 0};recipientControlShadow:${Boolean(control.shadowRoot)}`
        : 'recipient_control_missing';
      return {
        ok: false,
        sendStatus: 'failed_open',
        reason: 'alibaba_webmail_draft_verification_failed',
        evidence: `${autoSendAuthorization};${filled && filled.evidence || 'fill_missing'};${inspected && inspected.evidence || 'inspection_missing'};${inspectionFlags};${recipientStageEvidence};${recipientControlEvidence};${recipientTooltipEvidence};composer_preserved_for_technical_evidence:${preserveTabForEvidence}`,
        manualApprovalRequired: false,
        autoSendAuthorized: true,
      };
    }
    const sendControl = await evaluateChromeTabJson(chromeOpen, composeSendExpression(payload), 8000);
    if (!sendControl || !sendControl.sendReady) return {
      ok: false,
      sendStatus: 'failed_open',
      reason: 'alibaba_webmail_send_control_not_verified',
      evidence: `${autoSendAuthorization};${sendControl && sendControl.evidence || 'alibaba_webmail_send_control_not_verified'}`,
      manualApprovalRequired: false,
      autoSendAuthorized: true,
    };
    await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: sendControl.x,
      y: sendControl.y,
    }, 3000);
    await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: sendControl.x,
      y: sendControl.y,
      button: 'left',
      clickCount: 1,
    }, 3000);
    await cdpCommand(chromeOpen.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: sendControl.x,
      y: sendControl.y,
      button: 'left',
      clickCount: 1,
    }, 3000);
    const physicalClickEvidence = 'alibaba_webmail_send_physical_click_dispatched';
    let postSend = null;
    let toast = null;
    for (let attempt = 0; attempt < 20; attempt += 1) {
      await sleep(500);
      postSend = await evaluateChromeTabJson(chromeOpen, postSendStateExpression(payload), 5000).catch(() => null);
      toast = await evaluateChromeTabJson(chromeOpen, sendToastExpression(), 5000).catch(() => null);
      if (toast && toast.confirmed || postSend && postSend.ok) break;
    }
    if (!postSend || !postSend.ok) {
      preserveTabForEvidence = preserveAutomationChromeTab(chromeOpen);
      return {
        ok: false,
        sendStatus: 'send_unconfirmed',
        reason: 'alibaba_webmail_physical_send_not_accepted',
        evidence: `official_public_business_email;${autoSendAuthorization};alibaba_webmail_session_reused;${sendControl.evidence};${physicalClickEvidence};${postSend && postSend.evidence || 'post_send_state_missing'};composer_preserved_for_delivery_evidence:${preserveTabForEvidence}`,
        recipientEmail: target.recipient,
        targetUrl: `mailto:${target.recipient}`,
        subject,
        draft,
        chromeOpen,
        engine: 'alibaba-enterprise-mail-web-session',
        mode: 'alibaba_webmail_send_not_accepted',
        manualApprovalRequired: false,
        autoSendAuthorized: true,
      };
    }
    await navigateChromeTab(chromeOpen, ALIBABA_WEBMAIL_SENT_URL);
    let sentFolder = null;
    for (let attempt = 0; attempt < 40; attempt += 1) {
      await sleep(750);
      sentFolder = await evaluateChromeTabJson(chromeOpen, sentFolderConfirmationExpression(payload), 5000).catch(() => null);
      if (sentFolder && sentFolder.confirmed) break;
    }
    const confirmed = Boolean(sentFolder && sentFolder.confirmed);
    return {
      ok: confirmed,
      sendStatus: confirmed ? 'sent_confirmed' : 'send_unconfirmed',
      reason: confirmed ? 'sent_folder_message_confirmed' : 'sent_folder_confirmation_missing',
      evidence: `official_public_business_email;${autoSendAuthorization};alibaba_webmail_session_reused;${sendControl.evidence};${physicalClickEvidence};${postSend.evidence};${toast && toast.evidence || 'send_toast_not_observed'};${sentFolder && sentFolder.evidence || 'sent_folder_record_missing'}`,
      recipientEmail: target.recipient,
      targetUrl: `mailto:${target.recipient}`,
      subject,
      draft,
      engine: 'alibaba-enterprise-mail-web-session',
      mode: confirmed ? 'alibaba_webmail_sent_folder_confirmed' : 'alibaba_webmail_delivery_unconfirmed',
      manualApprovalRequired: false,
      autoSendAuthorized: true,
      contentValidation,
      output: JSON.stringify({
        verdict: confirmed ? 'sent_confirmed' : 'send_unconfirmed',
        sendStatus: confirmed ? 'sent_confirmed' : 'send_unconfirmed',
        evidence: `${sendControl.evidence};${physicalClickEvidence};${postSend.evidence};${toast && toast.evidence || 'send_toast_not_observed'};${sentFolder && sentFolder.evidence || 'sent_folder_record_missing'}`,
        nextAction: confirmed ? 'Alibaba Mail web session sent the message and the exact subject is visible in Sent.' : 'Do not resend automatically; inspect the webmail Sent folder evidence.',
        recipientEmail: target.recipient,
      }),
    };
  } finally {
    if (!preserveTabForEvidence) await closeAutomationChromeTab(chromeOpen);
  }
}

function reconcileLatestExecutionResultsToLedger() {
  const latest = readJson(path.join(__dirname, 'daily-automation-execution-latest.json'), null);
  if (!latest || !isSameAutomationDay(latest.completedAt) || !Array.isArray(latest.results)) return 0;
  let reconciled = 0;
  for (const row of latest.results) {
    if (!row || !row.id || !row.sendStatus || row.sendStatus === 'skipped') continue;
    const result = {
      ...(row.result || {}),
      sendStatus: row.sendStatus,
      evidence: row.evidence || row.result && row.result.evidence || '',
      targetUrl: row.targetUrl || row.result && row.result.targetUrl || '',
      chromeOpen: row.chromeOpen || row.result && row.result.chromeOpen || null,
    };
    recordAutomationResult({
      id: row.id,
      company: row.company || '',
      action: row.action || '',
      url: row.targetUrl || '',
    }, result);
    reconciled += 1;
  }
  return reconciled;
}

async function verifyPriorAlibabaWebmailSend(lead = {}, subject = '') {
  const target = verifiedBusinessEmailTarget(lead);
  if (!target.ok) return null;
  const chromeOpen = await openWithCodexChrome(ALIBABA_WEBMAIL_SENT_URL, { automationOwned: true });
  if (!chromeOpen || !chromeOpen.ok || !chromeOpen.webSocketDebuggerUrl) {
    return {
      ok: false,
      sendStatus: 'send_unconfirmed',
      reason: 'prior_unconfirmed_sent_folder_unavailable',
      evidence: chromeOpen && (chromeOpen.evidence || chromeOpen.error) || 'prior_unconfirmed_sent_folder_unavailable',
    };
  }
  try {
    let sentFolder = null;
    for (let attempt = 0; attempt < 40; attempt += 1) {
      await sleep(750);
      sentFolder = await evaluateChromeTabJson(chromeOpen, sentFolderConfirmationExpression({ subject }), 5000).catch(() => null);
      if (sentFolder && sentFolder.confirmed) break;
    }
    const confirmed = Boolean(sentFolder && sentFolder.confirmed);
    return {
      ok: confirmed,
      sendStatus: confirmed ? 'sent_confirmed' : 'send_unconfirmed',
      reason: confirmed ? 'prior_unconfirmed_sent_folder_recovered' : 'prior_unconfirmed_sent_folder_still_missing',
      evidence: `prior_send_unconfirmed_no_resend;${sentFolder && sentFolder.evidence || 'sent_folder_record_missing'}`,
      recipientEmail: target.recipient,
      targetUrl: `mailto:${target.recipient}`,
      subject,
      engine: 'alibaba-enterprise-mail-web-session',
      mode: confirmed ? 'alibaba_webmail_sent_folder_recovered' : 'alibaba_webmail_delivery_unconfirmed',
    };
  } finally {
    await closeAutomationChromeTab(chromeOpen);
  }
}

async function runVerifiedAlibabaEmailLead(lead = {}, subject = '', draft = '') {
  if (!liveEmailSenderDeliveryReady) {
    return {
      ok: false,
      skipped: true,
      sendStatus: 'failed_open',
      reason: 'email_sender_delivery_disabled',
      evidence: 'email_sender_delivery_disabled;sender_identity_dsn_observed;no_send_performed',
      nextAction: 'Continue through a first-party-verified official social channel; do not retry email until sender delivery is restored.',
    };
  }
  const previousResults = readJsonScriptArray(path.join(__dirname, 'autonomous-outreach-results.js'), 'AUTONOMOUS_OUTREACH_RESULTS');
  const domainSafety = emailDomainSafety(previousResults, lead);
  if (!domainSafety.ok) {
    return {
      ok: false,
      skipped: true,
      sendStatus: 'skipped',
      reason: domainSafety.reason,
      mode: 'email_domain_safety_gate',
      evidence: `${domainSafety.reason};domain:${domainSafety.domain || 'unknown'};sentToday:${domainSafety.sentToday || 0};limit:${domainSafety.limit || 0}`,
      nextAction: domainSafety.reason === 'email_domain_daily_limit_reached'
        ? 'Pause this domain until the next Asia/Shanghai business day; use another verified company or channel.'
        : 'Verify an official public buyer, vendor-relations, or business email before email outreach.',
    };
  }
  const mailDomain = await verifyBusinessEmailDomain(lead);
  if (!mailDomain.ok) {
    return {
      ok: false,
      skipped: true,
      sendStatus: 'skipped',
      reason: mailDomain.reason,
      mode: 'email_domain_mx_gate',
      evidence: `${mailDomain.reason};domain:${mailDomain.domain || 'unknown'};no_send_performed`,
      recipientEmail: mailDomain.recipient || recipientEmail(lead),
      nextAction: 'Do not send to this address; continue with a first-party-verified official social channel for the same company.',
    };
  }
  const normalizedRecipient = String(domainSafety.recipient || '').trim().toLowerCase();
  const preservedRoute = previousResults
    .filter(item => item && item.status === 'failed_open')
    .filter(item => /composer_preserved_for_technical_evidence:true/i.test(String(item.evidence || '')))
    .filter(item => /alibaba_webmail_content_inserted/i.test(String(item.evidence || '')))
    .filter(item => setsIntersect(automationCompanyKeys(lead), automationCompanyKeys(item)))
    .filter(item => String(item.recipientEmail || '').trim().toLowerCase() === normalizedRecipient)
    .filter(item => !subject || !item.subject || String(item.subject) === String(subject))
    .sort((left, right) => Date.parse(right.timestamp || '') - Date.parse(left.timestamp || ''))[0] || null;
  if (preservedRoute) {
    return {
      ok: false,
      skipped: true,
      sendStatus: 'failed_open',
      reason: 'email_route_preserved_draft_no_reopen',
      mode: 'email_route_level_duplicate_gate',
      evidence: `email_route_preserved_draft_no_reopen;no_email_composer_opened;no_send_performed;recipient:${normalizedRecipient}`,
      recipientEmail: normalizedRecipient,
      subject,
      draft,
      nextAction: 'Do not reopen or refill this email route. Continue with another first-party-verified channel for the same company.',
    };
  }
  // Re-read and enforce the irreversible-action guard at send time. Queue and
  // checkpoint data can be older than a previous run, so selection-time
  // dedupe alone is not sufficient. Any confirmed or uncertain customer
  // interaction permanently blocks every channel for the same company.
  const sendTimeResults = readJsonScriptArray(path.join(__dirname, 'autonomous-outreach-results.js'), 'AUTONOMOUS_OUTREACH_RESULTS');
  const leadCompanyKeys = automationCompanyKeys(lead);
  const priorCompanyContact = sendTimeResults
    .filter(item => historicalAutomationResultBlocksCompany(item))
    .filter(item => setsIntersect(leadCompanyKeys, automationCompanyKeys(item)))
    .sort((left, right) => Date.parse(right.timestamp || '') - Date.parse(left.timestamp || ''))[0] || null;
  const priorUnconfirmed = sendTimeResults.find(item => item
    && item.status === 'send_unconfirmed'
    && String(item.recipientEmail || '').toLowerCase() === String(domainSafety.recipient || '').toLowerCase()
    && String(item.subject || '') === String(subject || ''));
  if (priorUnconfirmed) {
    const recovered = await verifyPriorAlibabaWebmailSend(lead, subject);
    return {
      ...recovered,
      draft,
      output: JSON.stringify({
        verdict: recovered.sendStatus,
        sendStatus: recovered.sendStatus,
        evidence: recovered.evidence,
        nextAction: recovered.sendStatus === 'sent_confirmed'
          ? 'The prior unconfirmed send is now visible in Sent; no resend occurred.'
          : 'The prior send remains unconfirmed; do not resend automatically.',
        recipientEmail: recovered.recipientEmail || domainSafety.recipient,
      }),
    };
  }
  if (priorCompanyContact) {
    return {
      ok: false,
      skipped: true,
      sendStatus: 'skipped',
      reason: 'previous_customer_development_no_repeat',
      mode: 'irreversible_send_company_dedupe_gate',
      evidence: `previous_customer_development_no_repeat;prior_status:${priorCompanyContact.status};prior_timestamp:${priorCompanyContact.timestamp || 'unknown'};no_send_performed`,
      recipientEmail: domainSafety.recipient,
      targetUrl: domainSafety.recipient ? `mailto:${domainSafety.recipient}` : '',
      subject,
      draft,
      output: JSON.stringify({
        verdict: 'skipped',
        sendStatus: 'skipped',
        evidence: `previous_customer_development_no_repeat;prior_status:${priorCompanyContact.status};no_send_performed`,
        nextAction: 'This company has already been contacted. Do not contact it again through email, website forms, or social channels.',
        recipientEmail: domainSafety.recipient,
      }),
    };
  }
  const transaction = acquireSendTransaction(__dirname, lead);
  if (!transaction.ok) {
    return {
      ok: false,
      skipped: true,
      sendStatus: 'skipped',
      reason: transaction.reason,
      mode: 'irreversible_send_transaction_gate',
      evidence: `${transaction.reason};companyId:${transaction.companyId};no_send_performed`,
    };
  }
  let result;
  try {
    result = await sendAndConfirmAlibabaEmail({ lead, subject, text: draft });
    if (result.reason === 'email_sender_not_configured') {
      result = await runAlibabaWebmailEmailLead(lead, subject, draft);
    }
  } finally {
    releaseSendTransaction(transaction);
  }
  return {
    ...result,
    engine: result.engine || 'alibaba-enterprise-mail-smtp-imap',
    mode: result.mode || (result.sendStatus === 'sent_confirmed' ? 'alibaba_email_sent_folder_confirmed' : 'alibaba_email_delivery_unconfirmed'),
    targetUrl: domainSafety.recipient ? `mailto:${domainSafety.recipient}` : '',
    subject,
    draft,
    output: JSON.stringify({
      verdict: result.sendStatus || 'approval_pending',
      sendStatus: result.sendStatus || 'approval_pending',
      evidence: result.evidence || result.reason || '',
      nextAction: result.sendStatus === 'sent_confirmed'
        ? 'Alibaba Mail accepted the message and the matching record exists in Sent.'
        : result.reason === 'email_sender_not_configured'
          ? 'Configure the Alibaba Mail environment variables before rerunning verified email outreach.'
          : 'Do not resend automatically; inspect the Alibaba Mail delivery and Sent-folder evidence.',
      recipientEmail: result.recipientEmail || domainSafety.recipient,
      messageId: result.messageId || '',
    }),
  };
}

function canFallbackAfterEmailPreflight(result = {}) {
  if (!result || result.ok || result.sendStatus === 'sent_confirmed' || result.sendStatus === 'send_unconfirmed') return false;
  const evidence = `${result.reason || ''};${result.evidence || ''}`.toLowerCase();
  if (/physical_send|send_physical_click|composer_preserved|customer_interaction/.test(evidence)) return false;
  return [
    'email_sender_not_configured',
    'alibaba_webmail_session_unavailable',
    'alibaba_webmail_login_required',
    'alibaba_webmail_compose_unavailable',
    'email_route_preserved_draft_no_reopen',
    'email_target_verification_required',
    'public_business_email_requires_verification',
    'verified_public_email_missing',
    'recipient_domain_has_no_mail_exchange',
    'recipient_domain_mail_exchange_unverified',
    'email_sender_delivery_disabled',
  ].some(marker => evidence.includes(marker));
}

async function executeVerifiedSocialTouchAfterConfirmedEmail(lead = {}, emailResult = {}, options = {}) {
  if (!emailResult || emailResult.sendStatus !== 'sent_confirmed') return emailResult;
  let fallbackLead = socialFallbackFromInspection(lead, {});
  let inspection = null;
  let websiteProbe = null;
  if (!fallbackLead || fallbackLead.officialSocialProfileVerified !== true) {
    const officialWebsite = lead.website || lead.contactUrl || lead.sourceEvidenceUrl || '';
    if (/^https:\/\//i.test(String(officialWebsite || '')) && !/(?:linkedin|facebook|instagram)\.com/i.test(String(officialWebsite))) {
      websiteProbe = await openWithCodexChrome(officialWebsite, { automationOwned: true });
      if (websiteProbe && websiteProbe.ok) {
        const flow = await inspectWebsiteContactFlow(websiteProbe);
        inspection = flow && flow.inspection || null;
        fallbackLead = socialFallbackFromInspection(lead, inspection || {});
      }
      await closeAutomationChromeTab(websiteProbe);
    }
  }
  if (!fallbackLead || fallbackLead.officialSocialProfileVerified !== true) {
    return {
      ...emailResult,
      secondaryChannelStatus: 'official_social_channel_not_verified',
      evidence: `${emailResult.evidence || 'sent_confirmed'};official_social_channel_not_verified`,
    };
  }
  const socialResult = await executeLeadAutomation(fallbackLead, {
    ...options,
    ignoreCooldown: true,
    allowParallel: true,
    attemptedChannels: ['email'],
    fallbackDepth: Number(options.fallbackDepth || 0) + 1,
  });
  recordAutomationResult(fallbackLead, socialResult);
  const socialOutput = parseExecutionOutput(socialResult && socialResult.output);
  return {
    ...emailResult,
    secondaryChannelStatus: socialOutput.sendStatus || socialResult.sendStatus || 'failed_open',
    secondaryChannelPlatform: fallbackLead.platform,
    secondaryChannelTarget: fallbackLead.url,
    evidence: `${emailResult.evidence || 'sent_confirmed'};parallel_multichannel:${fallbackLead.platform};${socialOutput.evidence || socialResult.evidence || 'social_result_missing'}`,
  };
}

async function executeVerifiedSocialFallbackAfterEmail(lead = {}, emailResult = {}, options = {}) {
  if (!canFallbackAfterEmailPreflight(emailResult)) return emailResult;
  const fallbackLead = socialFallbackFromInspection(lead, {});
  if (!fallbackLead || fallbackLead.officialSocialProfileVerified !== true) return emailResult;
  const fallbackResult = await executeLeadAutomation(fallbackLead, {
    ...options,
    ignoreCooldown: true,
    allowParallel: true,
    attemptedChannels: [
      ...(Array.isArray(options.attemptedChannels) ? options.attemptedChannels : []),
      'email',
    ],
    fallbackDepth: Number(options.fallbackDepth || 0) + 1,
  });
  return {
    ...fallbackResult,
    fallbackFrom: `mailto:${recipientEmail(lead)}`,
    fallbackPlatform: fallbackLead.platform,
    emailPreflightStatus: emailResult.sendStatus || emailResult.reason || 'failed_open',
    output: JSON.stringify({
      ...parseExecutionOutput(fallbackResult.output),
      fallbackFrom: `mailto:${recipientEmail(lead)}`,
      fallbackPlatform: fallbackLead.platform,
      fallbackReason: emailResult.reason || emailResult.evidence || 'email_preflight_failed',
    }),
  };
}

async function runWebsiteContactLead(lead = {}, options = {}) {
  const subject = websiteContactSubject(lead);
  const draft = websiteContactMessage(lead);
  const targets = websiteContactTargetCandidates(lead);
  let emailLead = lead;
  let directEmail = verifiedBusinessEmailTarget(emailLead);
  let emailVerification = null;
  if (!directEmail.ok && recipientEmail(lead)) {
    emailVerification = await verifyEmailAddress(recipientEmail(lead));
    if (emailVerification.deliverable) {
      emailLead = {
        ...lead,
        emailVerificationStatus: 'deliverable',
        publicEmailStatus: `Verified deliverable business email via ${emailVerification.provider}`,
        emailEvidence: `${emailVerification.provider}:${emailVerification.verifiedAt}`,
      };
      directEmail = verifiedBusinessEmailTarget(emailLead);
    }
  }
  let emailPreflight = null;
  if (directEmail.ok) {
    emailPreflight = await runVerifiedAlibabaEmailLead(emailLead, subject, draft);
    if (emailPreflight.sendStatus === 'sent_confirmed') {
      return executeVerifiedSocialTouchAfterConfirmedEmail(emailLead, emailPreflight, options);
    }
    if (!canFallbackAfterEmailPreflight(emailPreflight) || !targets.length) return emailPreflight;
  }
  if (!targets.length) {
    if (lead.publicEmail || lead.contactEmail || lead.email) {
      return {
        ok: false,
        skipped: true,
        sendStatus: 'skipped',
        reason: emailVerification && emailVerification.reason || directEmail.reason,
        evidence: emailVerification && emailVerification.reason || directEmail.reason,
        mode: 'email_target_verification_gate',
      };
    }
    const target = validateWebsiteContactTarget(lead);
    if (!target.ok) return target;
  }
  const attempts = [];
  let lastResult = null;
  for (const target of targets) {
    if (options.signal && options.signal.aborted) {
      return customerExecutionTimeoutResult(lead, options.customerTimeoutMs);
    }
    const chromeOpen = await openWithCodexChrome(target.targetUrl, { automationOwned: true });
    if (options.signal && options.signal.aborted) {
      await closeAutomationChromeTab(chromeOpen);
      return customerExecutionTimeoutResult(lead, options.customerTimeoutMs);
    }
    const contactFlow = await inspectWebsiteContactFlow(chromeOpen);
    if (options.signal && options.signal.aborted) {
      await closeAutomationChromeTab(chromeOpen);
      return customerExecutionTimeoutResult(lead, options.customerTimeoutMs, chromeOpen);
    }
    attempts.push({
      targetUrl: target.targetUrl,
      sendStatus: contactFlow.sendStatus || 'approval_pending',
      evidence: contactFlow.evidence,
    });
    if (!contactFlow.ok) {
      const socialFallback = socialFallbackFromInspection(lead, contactFlow.inspection);
      const attemptedTargets = new Set((options.attemptedTargets || []).map(value => String(value || '').toLowerCase()));
      const socialFallbackTarget = String(socialFallback && (socialFallback.targetUrl || socialFallback.url) || '').toLowerCase();
      if (socialFallback
        && Number(options.fallbackDepth || 0) < 3
        && !attemptedTargets.has(socialFallbackTarget)) {
        await closeAutomationChromeTab(chromeOpen);
        if (options.signal && options.signal.aborted) {
          return customerExecutionTimeoutResult(lead, options.customerTimeoutMs, chromeOpen);
        }
        const socialResult = await executeLeadAutomation(socialFallback, {
          ignoreCooldown: true,
          allowParallel: true,
          fallbackDepth: Number(options.fallbackDepth || 0) + 1,
          attemptedTargets: [...attemptedTargets, String(target.targetUrl || '').toLowerCase()],
          signal: options.signal,
          customerTimeoutMs: options.customerTimeoutMs,
        });
        const socialOutput = parseExecutionOutput(socialResult && socialResult.output);
        return {
          ...socialResult,
          chromeOpen: socialResult && socialResult.chromeOpen || chromeOpen,
          mode: socialResult && socialResult.mode || 'official_website_social_fallback',
          evidence: `${contactFlow.evidence};official_social_fallback:${socialFallback.platform};${socialOutput.evidence || socialResult.evidence || socialResult.error || 'social_driver_result_missing'}`,
          socialFallbackEvidence: socialOutput.evidence || socialResult.evidence || socialResult.error || 'social_driver_result_missing',
          output: JSON.stringify({
            ...socialOutput,
            verdict: socialOutput.verdict || socialResult.sendStatus || 'approval_pending',
            evidence: `${contactFlow.evidence};official_social_fallback:${socialFallback.platform};${socialOutput.evidence || socialResult.evidence || socialResult.error || 'social_driver_result_missing'}`,
            nextAction: socialOutput.nextAction || `Official website exposed ${socialFallback.platform}; Codex Chrome tried that social channel before website fallback.`,
            sendStatus: socialOutput.sendStatus || socialResult.sendStatus || 'approval_pending',
          }),
        };
      }
      if (lead.publicEmail || lead.contactEmail) {
        const publicEmail = lead.publicEmail || lead.contactEmail;
        contactFlow.evidence = `${contactFlow.evidence};public_email_fallback_available:${publicEmail};email_sender_not_configured`;
        contactFlow.nextAction = `Email delivery to ${publicEmail} requires a configured sender; continue with another verified contact path or LinkedIn, Facebook, or Instagram instead of claiming a send.`;
      }
      lastResult = {
        ok: false,
        engine: 'dedicated-chrome-cdp-website-contact',
        browserEngine: chromeOpen && chromeOpen.engine,
        mode: 'website_contact_prepare_manual_submit',
        targetUrl: target.targetUrl,
        chromeOpen,
        sendStatus: contactFlow.sendStatus || 'approval_pending',
        subject,
        draft,
        evidence: `${contactFlow.evidence}${emailPreflight ? `;${emailPreflight.evidence || emailPreflight.reason || ''}` : ''}`,
        output: JSON.stringify({
          verdict: contactFlow.sendStatus || 'approval_pending',
          evidence: `${contactFlow.evidence}${emailPreflight ? `;${emailPreflight.evidence || emailPreflight.reason || ''}` : ''};website_contact_target_attempts:${attempts.length}`,
          nextAction: contactFlow.nextAction,
          subject,
          draft,
          sendStatus: contactFlow.sendStatus || 'approval_pending',
          attempts,
        }),
      };
      await closeAutomationChromeTab(chromeOpen);
      continue;
    }
    const officialMailto = officialMailtoLead(lead, contactFlow.inspection, target.targetUrl);
    if (officialMailto) {
      if (typeof options.enterCriticalSection === 'function') options.enterCriticalSection('verified_email_send_confirmation');
      const emailResult = await runVerifiedAlibabaEmailLead(officialMailto, subject, draft);
      if (emailResult.sendStatus === 'sent_confirmed') {
        await closeAutomationChromeTab(chromeOpen);
        return executeVerifiedSocialTouchAfterConfirmedEmail(lead, emailResult, options);
      }
      if (emailResult.reason !== 'email_sender_not_configured') {
        await closeAutomationChromeTab(chromeOpen);
        return emailResult;
      }
      emailPreflight = emailResult;
    }
    const formPreparation = await prepareWebsiteContactForm(chromeOpen, lead, subject, draft);
    if (emailPreflight) {
      formPreparation.evidence = `${emailPreflight.evidence || emailPreflight.reason || 'email_preflight_blocked'};${formPreparation.evidence || ''}`;
    }
    attempts[attempts.length - 1] = {
      ...attempts[attempts.length - 1],
      sendStatus: formPreparation.sendStatus || contactFlow.sendStatus || 'approval_pending',
      evidence: `${contactFlow.evidence};${formPreparation.evidence}`,
    };
    // A verified website route must not strand the company when the form is
    // unusable before submission. The inspection is first-party evidence for
    // any social links it exposed, so continue immediately on that verified
    // route. Never cross over after an irreversible click or uncertain submit.
    const websitePreSendFailure = ['approval_pending', 'failed_open', 'skipped', 'website_contact_unreachable_skip']
      .includes(String(formPreparation.sendStatus || '').toLowerCase());
    const websiteFailureEvidence = String(formPreparation.evidence || '').toLowerCase();
    const websiteInteractionUncertain = /send_unconfirmed|submit_unconfirmed|send_physical_click|submit_physical_click|customer_interaction/.test(websiteFailureEvidence);
    const verifiedSocialFallback = websitePreSendFailure && !websiteInteractionUncertain
      ? socialFallbackFromInspection(lead, contactFlow.inspection)
      : null;
    if (verifiedSocialFallback
      && verifiedSocialFallback.officialSocialProfileVerified === true
      && Number(options.fallbackDepth || 0) < 3) {
      await closeAutomationChromeTab(chromeOpen);
      const socialResult = await executeLeadAutomation(verifiedSocialFallback, {
        ...options,
        ignoreCooldown: true,
        allowParallel: true,
        fallbackDepth: Number(options.fallbackDepth || 0) + 1,
        attemptedTargets: [
          ...(Array.isArray(options.attemptedTargets) ? options.attemptedTargets : []),
          String(target.targetUrl || '').toLowerCase(),
        ],
      });
      const socialOutput = parseExecutionOutput(socialResult && socialResult.output);
      return {
        ...socialResult,
        fallbackFrom: target.targetUrl,
        fallbackPlatform: verifiedSocialFallback.platform,
        evidence: `${contactFlow.evidence};${formPreparation.evidence};website_presend_social_fallback:${verifiedSocialFallback.platform};${socialOutput.evidence || socialResult.evidence || ''}`,
        output: JSON.stringify({
          ...socialOutput,
          fallbackFrom: target.targetUrl,
          fallbackPlatform: verifiedSocialFallback.platform,
          fallbackReason: formPreparation.evidence || formPreparation.sendStatus || 'website_presend_failure',
        }),
      };
    }
    if (formPreparation.sendStatus === 'approval_pending') {
      lastResult = {
        ok: false,
        engine: 'dedicated-chrome-cdp-website-contact',
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
      await closeAutomationChromeTab(chromeOpen);
      continue;
    }
    const output = {
      verdict: formPreparation.sendStatus,
      evidence: `${contactFlow.evidence};${formPreparation.evidence};website_contact_target_attempts:${attempts.length}`,
      nextAction: formPreparation.nextAction || 'Review the prepared website contact form before final submission.',
      subject,
      draft,
      sendStatus: formPreparation.sendStatus,
      attempts,
    };
    return {
      ok: formPreparation.sendStatus === 'submitted_confirmed',
      engine: 'dedicated-chrome-cdp-website-contact',
      browserEngine: chromeOpen.engine,
      mode: formPreparation.sendStatus === 'submitted_confirmed' ? 'website_contact_submitted_confirmed' : 'website_contact_submit_unconfirmed',
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
        nextAction: output.nextAction || 'Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.',
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
  const chromeOpen = await openWithCodexChrome(target.targetUrl, { automationOwned: true, reuseTab: Boolean(options.reuseTab) });
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

function instagramFallbackTarget(lead = {}) {
  const invalidInstagram = lead.invalidChannels && lead.invalidChannels.instagram;
  if (invalidInstagram) return '';
  const channels = lead.alternateChannels || {};
  const candidate = channels.instagram || lead.instagramUrl || lead.instagram || '';
  if (!candidate) return '';
  try {
    const url = new URL(String(candidate));
    if (url.protocol !== 'https:' || !/instagram\.com$/i.test(url.hostname)) return '';
    if (url.href.toLowerCase() === 'https://www.instagram.com/moosejawmadness/') return '';
    if (/instagram\.com\/(?:accounts\/login|explore|direct|about|developer|web|p|reel)\b/i.test(url.pathname)) return '';
    const expected = String(lead.company || lead.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    const handle = String(url.pathname.replace(/^\/+/, '').split('/')[0] || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    if (expected && handle && !handle.includes(expected) && !expected.includes(handle)) return '';
    return url.href;
  } catch {
    return '';
  }
}

function alternateChannelFallbackLead(lead = {}, draftResult = {}, options = {}) {
  const evidence = String(draftResult.evidence || '').toLowerCase();
  const recoverable = /composer_not_found|message_button_clicked_composer_not_found|profile_no_message_button|personal_profile_without_company_match|identity_mismatch_expected|cdp websocket error|chrome_target_not_found|driver_timeout_bounded/.test(evidence);
  if (!recoverable || draftResult.sendStatus === 'send_unconfirmed') return null;
  const cameFromWebsiteSocialFallback = String(lead.reason || '').toLowerCase() === 'official_website_social_fallback';
  const attempted = new Set([
    ...(Array.isArray(options.attemptedChannels) ? options.attemptedChannels : []),
    String(lead.platform || '').toLowerCase(),
  ].filter(Boolean));
  const attemptedTargets = new Set((options.attemptedTargets || []).map(value => String(value || '').toLowerCase()));
  const channels = lead.alternateChannels || {};
  const candidates = [
    ['linkedin', channels.linkedin],
    ['facebook', channels.facebook],
    ['instagram', channels.instagram],
    ['email', cameFromWebsiteSocialFallback ? '' : (channels.websiteContact || lead.contactUrl || lead.website)],
  ];
  for (const [platform, targetUrl] of candidates) {
    if (attempted.has(platform)
      || attemptedTargets.has(String(targetUrl || '').toLowerCase())
      || !/^https:\/\//i.test(String(targetUrl || ''))) continue;
    const fallback = {
      ...lead,
      id: `${automationLeadFamilyKey(lead.id || lead.taskId) || canonicalLeadKey(lead.company || lead.name)}-${platform}`,
      taskId: `${automationLeadFamilyKey(lead.id || lead.taskId) || canonicalLeadKey(lead.company || lead.name)}-${platform}`,
      platform,
      action: platform === 'email' ? 'email_priority' : 'develop',
      reason: platform === 'email' ? 'official_website_contact_channel' : `verified_${platform}_fallback`,
      platformUrl: targetUrl,
      targetUrl,
      verifiedTargetUrl: targetUrl,
      url: targetUrl,
    };
    if (!blockingAutomationResultFor(fallback)) return fallback;
  }
  return null;
}

async function runCodexChromeLead(lead, decision, mode = 'codex_chrome_prepare', options = {}) {
  const target = validateLeadTargetForPreparation(lead);
  if (!target.ok) return target;
  const chromeOpen = await openWithCodexChrome(target.targetUrl, { automationOwned: true });
  if (!chromeOpen.ok) return { ...chromeOpen, sendStatus: 'failed_open' };
  const finalDraft = isFollowupLead(lead)
    ? await optimizeDraftWithContext(lead, decision, chromeOpen)
    : String(decision && decision.draft || '').trim();
  const draftResult = await prepareSocialDraft(chromeOpen, finalDraft, lead);
  const fallbackDepth = Number(options.fallbackDepth || 0);
  const alternateFallback = fallbackDepth < 3
    ? alternateChannelFallbackLead(lead, draftResult, options)
    : null;
  if (alternateFallback) {
    await closeAutomationChromeTab(chromeOpen);
    const fallbackResult = await executeLeadAutomation(alternateFallback, {
      ignoreCooldown: true,
      allowParallel: true,
      attemptedChannels: [
        ...(Array.isArray(options.attemptedChannels) ? options.attemptedChannels : []),
        String(lead.platform || '').toLowerCase(),
      ],
      attemptedTargets: [
        ...(Array.isArray(options.attemptedTargets) ? options.attemptedTargets : []),
        String(target.targetUrl || '').toLowerCase(),
      ],
      fallbackDepth: fallbackDepth + 1,
    });
    return {
      ...fallbackResult,
      fallbackFrom: target.targetUrl,
      fallbackPlatform: alternateFallback.platform,
      output: JSON.stringify({
        ...parseExecutionOutput(fallbackResult.output),
        fallbackFrom: target.targetUrl,
        fallbackPlatform: alternateFallback.platform,
        fallbackReason: draftResult.evidence,
      }),
    };
  }
  const facebookNeedsInstagram = !options.skipInstagramFallback
    && lead && lead.facebookMessageUnavailable === true
    && /facebook_profile_no_message_button/.test(String(draftResult && draftResult.evidence || ''));
  const instagramUrl = instagramFallbackTarget(lead);
  const attemptedTargets = new Set((options.attemptedTargets || []).map(value => String(value || '').toLowerCase()));
  if (facebookNeedsInstagram
    && fallbackDepth < 3
    && instagramUrl
    && !attemptedTargets.has(String(instagramUrl).toLowerCase())) {
    const fallbackLead = {
      ...lead,
      platform: 'instagram',
      platformUrl: instagramUrl,
      targetUrl: instagramUrl,
      verifiedTargetUrl: instagramUrl,
      url: instagramUrl,
    };
    const fallbackResult = await runCodexChromeLead(
      fallbackLead,
      decision,
      `${mode}_instagram_fallback`,
      {
        skipInstagramFallback: true,
        reuseTab: Boolean(options.reuseTab),
        fallbackDepth: fallbackDepth + 1,
        attemptedTargets: [...attemptedTargets, String(target.targetUrl || '').toLowerCase()],
      },
    );
    return {
      ...fallbackResult,
      targetUrl: instagramUrl,
      fallbackFrom: target.targetUrl,
      fallbackPlatform: 'instagram',
      output: JSON.stringify({
        ...parseExecutionOutput(fallbackResult.output),
        fallbackFrom: target.targetUrl,
        fallbackReason: draftResult.evidence,
      }),
    };
  }
  return {
    ok: Boolean(draftResult.ok),
    engine: 'codex-chrome-cdp',
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
  const ownedTabsAtStart = new Set(automationOwnedChromeTabs.keys());
  try {
  if (options.signal && options.signal.aborted) {
    return customerExecutionTimeoutResult(lead, options.customerTimeoutMs);
  }
  if (!options.allowParallel && glmAutomationRunning) return { ok: false, busy: true, error: 'Another customer is running' };
  if (!options.ignoreCooldown && Date.now() - lastGlmAutomationAt < 90000) {
    return { ok: false, cooldown: true, error: 'Serial cooldown is active' };
  }
  const platform = String(lead && lead.platform || '').toLowerCase();
  const isExplicitSocial = ['linkedin', 'facebook', 'instagram'].includes(platform);
  // Discovery can preserve the originating website-form label even after an
  // official supplier email is verified. Channel truth outranks that legacy
  // label: a verified business email must enter the Alibaba Mail confirmation
  // path before any lower-priority website or social fallback. Website-derived
  // leads stay in runWebsiteContactLead so a pre-send authentication failure
  // can continue to verified website/social routes.
  const isWebsiteContact = !isExplicitSocial && (platform === 'website_form'
    || lead && lead.action === 'email_priority'
    || /^official_website_contact_channel$|^website_contact/i.test(String(lead && lead.reason || '')));
  const isVerifiedEmail = verifiedBusinessEmailTarget(lead).ok;
  // A social fallback intentionally retains the customer's verified email as
  // dossier context. The explicit platform is authoritative: do not route the
  // Instagram/LinkedIn/Facebook task back into email merely because the
  // inherited company record also contains a verified mailbox.
  if (isVerifiedEmail && !isWebsiteContact && !isExplicitSocial) {
    if (typeof options.enterCriticalSection === 'function') options.enterCriticalSection('verified_email_send_confirmation');
    const subject = websiteContactSubject(lead);
    const draft = websiteContactMessage(lead);
    const emailResult = await runVerifiedAlibabaEmailLead(lead, subject, draft);
    const result = emailResult.sendStatus === 'sent_confirmed'
      ? await executeVerifiedSocialTouchAfterConfirmedEmail(lead, emailResult, options)
      : await executeVerifiedSocialFallbackAfterEmail(lead, emailResult, options);
    lastGlmAutomationAt = Date.now();
    return result;
  }
  if (platform === 'email' && !isWebsiteContact && !isVerifiedEmail) {
    const emailGate = {
      ok: false,
      skipped: true,
      sendStatus: 'skipped',
      reason: 'email_target_verification_required',
      evidence: 'email_target_verification_required;no_email_send_performed',
    };
    const result = await executeVerifiedSocialFallbackAfterEmail(lead, emailGate, options);
    lastGlmAutomationAt = Date.now();
    return result;
  }
  if (isWebsiteContact) {
    const result = markWebsiteContactStrategyResult(await runWebsiteContactLead(lead, options));
    lastGlmAutomationAt = Date.now();
    return result;
  }
  const followup = isFollowupLead(lead);
  const target = followup ? validateLeadTargetForPreparation(lead) : validateLeadForExecution(lead);
  if (!target.ok) return target;
  if (!options.allowParallel) glmAutomationRunning = true;
  try {
    const decision = {
      verdict: followup ? 'recheck' : 'develop',
      fitScore: Math.max(Number(lead && lead.fitScore || 0), followup ? 50 : 70),
      reason: 'local_codex_extension_template',
      draft: professionalSalesDraft(lead || {}, ''),
    };
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
    if (options.signal && options.signal.aborted) {
      return customerExecutionTimeoutResult(lead, options.customerTimeoutMs);
    }
    execution = await runCodexChromeLead(lead, decision, 'codex_chrome_cdp', options);
    lastGlmAutomationAt = Date.now();
    return {
      ...execution,
      decision,
      executionLayer: browserTransportForResult(execution) === 'codex-extension'
        ? 'Codex Chrome Extension'
        : 'Chrome CDP fallback',
      glmModel: 'not_used',
      followup,
    };
  } finally {
    if (!options.allowParallel) glmAutomationRunning = false;
  }
  } finally {
    await closeAutomationTabsOpenedAfter(ownedTabsAtStart);
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
    targetUrl: item.url || item.contactUrl || item.website,
    verifiedTargetUrl: item.url || item.contactUrl || item.website,
    fitScore: item.fitScore,
    originalStatus: item.lastStatus || '',
  };
}

function isWebsiteContactQueueItem(item = {}) {
  // The platform selected after first-party enrichment is authoritative.
  // Legacy discovery IDs retain the `website-contact` suffix for stable
  // history keys even when the official page yields a verified email.
  if (['email', 'linkedin', 'facebook', 'instagram'].includes(
    String(item.platform || item.channel || '').toLowerCase(),
  )) return false;
  const text = [
    item.platform,
    item.action,
    item.reason,
    item.id,
    item.url,
    item.contactUrl,
    item.website,
  ].filter(Boolean).join(' ').toLowerCase();
  return /website_form|verify_target|website-contact|official_website_contact_channel|website_contact|homepage_only_contact_path_requires_verification/.test(text);
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

function hasVerifiedInstagramFallback(item = {}) {
  const candidate = item.alternateChannels && item.alternateChannels.instagram;
  if (!candidate) return false;
  try {
    const url = new URL(String(candidate));
    return url.protocol === 'https:' && /instagram\.com$/i.test(url.hostname);
  } catch {
    return false;
  }
}

function socialPriorityRank(item = {}) {
  const text = [item.platform, item.id, item.url, item.targetUrl, item.verifiedTargetUrl].filter(Boolean).join(' ').toLowerCase();
  if (String(item.platform || '').toLowerCase() === 'email' && verifiedBusinessEmailTarget(item).ok) return 400;
  if (isWebsiteContactQueueItem(item)) return 380;
  if (/\blinkedin\b|linkedin\.com/.test(text)) return 340;
  if (/\bfacebook\b|facebook\.com/.test(text)) return 330;
  if (/\binstagram\b|instagram\.com/.test(text)) return 320;
  return 100;
}

function isSocialQueueItem(item = {}) {
  return ['linkedin', 'facebook', 'instagram'].includes(
    String(item.platform || item.channel || '').toLowerCase(),
  );
}

function websiteCanReinspectForFirstPartySocial(item = {}) {
  if (!isWebsiteContactQueueItem(item) || item.officialSocialProfileVerified === true) return false;
  const channels = item.alternateChannels && typeof item.alternateChannels === 'object'
    ? item.alternateChannels
    : {};
  return [channels.linkedin, channels.facebook, channels.instagram]
    .some(url => /^https:\/\//i.test(String(url || '')));
}

function developmentPriorityCompare(left, right) {
  // Once a provider DSN proves that the configured sender identity is disabled,
  // email is not an executable channel for the rest of this process. Prefer
  // first-party verified social rows immediately instead of selecting email
  // rows merely to discover the same global provider failure again.
  if (!liveEmailSenderDeliveryReady) {
    const socialDelta = Number(isSocialQueueItem(right) && right.officialSocialProfileVerified === true)
      - Number(isSocialQueueItem(left) && left.officialSocialProfileVerified === true);
    if (socialDelta) return socialDelta;
  }
  const verifiedEmailDelta = Number(verifiedBusinessEmailTarget(right).ok) - Number(verifiedBusinessEmailTarget(left).ok);
  return verifiedEmailDelta
    || socialPriorityRank(right) - socialPriorityRank(left)
    || Number(right.fitScore || right.dealProbabilityScore || 0) - Number(left.fitScore || left.dealProbabilityScore || 0)
    || String(left.company || left.name || '').localeCompare(String(right.company || right.name || ''));
}

function executableQueueCandidates(items = [], options = {}) {
  const executableActions = new Set(['develop', 'retry_or_alternate_channel', 'discover_and_develop', 'email_priority', 'verify_target']);
  const allowWebsiteContact = options.allowWebsiteContact !== false;
  return (Array.isArray(items) ? items : [])
    .filter(item => executableActions.has(item.action))
    .filter(item => item.executionReadiness && item.executionReadiness.ready === true)
    .filter(item => item.url || item.targetUrl || item.platformUrl || item.verifiedTargetUrl || item.contactUrl || item.website
      || verifiedBusinessEmailTarget(item).ok
      || (recipientEmail(item) && configuredProvider().id))
    .filter(item => !hasNoSafeMessageButton(item) || hasVerifiedInstagramFallback(item))
    .filter(item => !isSocialQueueItem(item) || item.officialSocialProfileVerified === true)
    .filter(item => allowWebsiteContact || !isWebsiteContactQueueItem(item))
    // A prior pre-send website/browser failure may retire that exact form
    // attempt, but it must not prevent reopening the first-party website to
    // validate and execute an advertised official social route. Send-time
    // company and uncertainty gates still prevent any duplicate interaction.
    .filter(item => {
      const block = blockingAutomationResultFor(item);
      if (!block) return true;
      if (block.status === 'same_day_retry_circuit_open') return false;
      return websiteCanReinspectForFirstPartySocial(item);
    })
    .sort(developmentPriorityCompare);
}

function customerExecutionTimeoutMs(payload = {}) {
  const configured = Number(payload.customerTimeoutMs
    || process.env.DAILY_CUSTOMER_TIMEOUT_MS
    || DEFAULT_CUSTOMER_EXECUTION_TIMEOUT_MS);
  if (!Number.isFinite(configured)) return DEFAULT_CUSTOMER_EXECUTION_TIMEOUT_MS;
  return Math.max(MIN_CUSTOMER_EXECUTION_TIMEOUT_MS, Math.min(configured, MAX_CUSTOMER_EXECUTION_TIMEOUT_MS));
}

function customerExecutionTimeoutResult(item = {}, timeoutMs = DEFAULT_CUSTOMER_EXECUTION_TIMEOUT_MS, chromeOpen = null) {
  const boundedTimeoutMs = Number(timeoutMs) || DEFAULT_CUSTOMER_EXECUTION_TIMEOUT_MS;
  return {
    ok: false,
    timedOut: true,
    sendStatus: 'failed_open',
    reason: 'customer_execution_timeout',
    evidence: `customer_execution_timeout:${boundedTimeoutMs};queue_continued_to_next_customer`,
    chromeOpen,
    output: JSON.stringify({
      verdict: 'failed_open',
      sendStatus: 'failed_open',
      evidence: `customer_execution_timeout:${boundedTimeoutMs};queue_continued_to_next_customer`,
      nextAction: 'The customer exceeded its bounded execution window. Its automation tabs were closed and the queue continued without retrying or claiming a send.',
      company: item.company || item.name || '',
    }),
  };
}

async function executeLeadWithCustomerWatchdog(item, options = {}) {
  const timeoutMs = customerExecutionTimeoutMs(options);
  const controller = new AbortController();
  const ownedTabsAtStart = new Set(automationOwnedChromeTabs.keys());
  const watchdogState = { criticalSection: '' };
  let timeoutId;
  const executionPromise = executeLeadAutomation(queueItemToLead(item), {
    ...options,
    signal: controller.signal,
    customerTimeoutMs: timeoutMs,
    enterCriticalSection(reason) {
      watchdogState.criticalSection = String(reason || 'send_confirmation');
      clearTimeout(timeoutId);
    },
  });
  const timeoutPromise = new Promise(resolve => {
    timeoutId = setTimeout(() => {
      if (!watchdogState.criticalSection) resolve(null);
    }, timeoutMs);
  });
  const result = await Promise.race([executionPromise, timeoutPromise]);
  clearTimeout(timeoutId);
  if (result) return result;

  controller.abort();
  await closeAutomationTabsOpenedAfter(ownedTabsAtStart);
  executionPromise.catch(() => null);
  return customerExecutionTimeoutResult(item, timeoutMs);
}

let currentDailyExecutionProgress = null;

const REAL_CUSTOMER_DEVELOPMENT_STATUSES = new Set([
  'sent_confirmed',
  'submitted_confirmed',
]);

function buildExecutionTruth(results = []) {
  const rows = Array.isArray(results) ? results : [];
  const transport = executionTransportSummary(rows);
  const explicitChromeOpenedCount = rows.filter(item => item && item.chromeOpen && item.chromeOpen.ok).length;
  const browserResultCount = rows.filter(item => {
    const result = item && item.result && typeof item.result === 'object' ? item.result : {};
    return /web-session|browser|cdp/i.test([result.engine, result.mode, item && item.evidence].filter(Boolean).join(' '));
  }).length;
  const chromeOpenedCount = Math.max(explicitChromeOpenedCount, browserResultCount);
  const browserUsed = chromeOpenedCount > 0 || transport.browserTransportUsed === 'cdp';
  const customerMessageSent = rows.some(item => item && ['sent_confirmed', 'submitted_confirmed'].includes(item.sendStatus));
  const realDevelopmentCount = rows.filter(item => item && REAL_CUSTOMER_DEVELOPMENT_STATUSES.has(item.sendStatus)).length;
  return {
    ...transport,
    executionPhase: browserUsed ? 'browser_execution' : 'no_browser_execution',
    chromeStage: browserUsed ? 'opened' : 'not_started',
    chromeOpened: browserUsed,
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

function executionRecoveryActions(blockerSummary = [], queueGoalStatus = null) {
  const reasons = new Set((Array.isArray(blockerSummary) ? blockerSummary : []).map(item => item && item.reason));
  const actions = [];
  if (queueGoalStatus && queueGoalStatus.reached === false) {
    actions.push({
      reason: 'daily_queue_goal_not_reached',
      action: 'Refill high-ICP customer pool',
      description: `Add or unblock ${queueGoalStatus.refillNeeded || 0} verified high-ICP leads to reach the daily ${DAILY_CONFIRMED_COMPANY_TARGET} target.`,
      hint: `Refill the high-ICP pool with ${queueGoalStatus.refillNeeded || 0} verified leads or unblock existing website/social leads before the next run.`,
      target: queueGoalStatus.target,
      potentialPool: queueGoalStatus.potentialPool,
      refillNeeded: queueGoalStatus.refillNeeded,
    });
  }
  if (reasons.has('marketing_attachment_missing')) {
    actions.push({
      reason: 'marketing_attachment_missing',
      action: 'Add approved website outreach attachment',
      description: 'Set WEBSITE_MARKETING_FILE or MARKETING_ATTACHMENT_PATH before rerunning website-contact outreach.',
      hint: 'Configure WEBSITE_MARKETING_FILE or MARKETING_ATTACHMENT_PATH with an approved marketing attachment before rerunning website-contact outreach.',
      requiredEnv: ['WEBSITE_MARKETING_FILE', 'MARKETING_ATTACHMENT_PATH'],
    });
  }
  if (reasons.has('email_sender_not_configured')) {
    actions.push({
      reason: 'email_sender_not_configured',
      action: 'Configure Alibaba Mail delivery confirmation',
      description: 'Set the FLEXTAIL sender, Alibaba SMTP user, and Alibaba third-party security password.',
      hint: 'Configure Alibaba Mail SMTP/IMAP credentials so verified business emails can be sent and confirmed in Sent.',
      requiredEnv: ['OUTREACH_EMAIL_FROM', 'ALIBABA_SMTP_USER', 'ALIBABA_SMTP_SECURITY_PASSWORD'],
    });
  }
  if (reasons.has('public_business_email_requires_verification') || reasons.has('verified_public_email_missing')) {
    actions.push({
      reason: 'email_target_verification_required',
      action: 'Verify public business email evidence',
      description: 'Use an official website mailto address or a deliverable result from the configured email verifier.',
      hint: 'Verify the recipient as an official public business email before enabling email outreach.',
      requiredEnv: ['HUNTER_API_KEY', 'ZEROBOUNCE_API_KEY', 'NEVERBOUNCE_API_KEY'],
    });
  }
  if (reasons.has('website_contact_unreachable_skip')) {
    actions.push({
      reason: 'website_contact_unreachable_skip',
      action: 'Use verified alternate channel',
      description: 'The official website route was exhausted; continue with verified Email, LinkedIn, Facebook, or Instagram evidence.',
      hint: 'Use a verified alternate channel instead of repeatedly probing the failed website route.',
    });
  }
  if (reasons.has('missing_verified_profile_url')) {
    actions.push({
      reason: 'missing_verified_profile_url',
      action: 'Verify official social profile URL',
      description: 'Add a verified Facebook or Instagram profile URL before retrying social outreach.',
      hint: 'Add a verified Facebook or Instagram profile URL before retrying social outreach.',
    });
  }
  if (reasons.has('concrete_google_discovered_major_customer_instagram')
    || reasons.has('concrete_google_discovered_major_customer_facebook')) {
    actions.push({
      reason: 'google_social_profile_not_executable',
      action: 'Complete Google social channel verification',
      description: 'Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach.',
      hint: 'Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach.',
    });
  }
  if (reasons.has('profile_valid_no_message_button')) {
    actions.push({
      reason: 'profile_valid_no_message_button',
      action: 'Use alternate verified channel',
      description: 'The current social profile has no safe message button, so use another verified channel.',
      hint: 'Use a verified alternate channel because the current social profile has no safe message button.',
    });
  }
  if (reasons.has('failed_open')) {
    actions.push({
      reason: 'failed_open',
      action: 'Verify profile accessibility',
      description: 'Open the official profile manually or switch to another verified channel before retrying.',
      hint: 'Verify the official profile opens and exposes a safe message composer, or switch to another verified channel.',
    });
  }
  if (reasons.has('browser_execution_timeout')) {
    actions.push({
      reason: 'browser_execution_timeout',
      action: 'Reduce browser execution batch',
      description: 'Retry with a smaller DAILY_EXECUTE_LIMIT or inspect the current social page that timed out.',
      hint: 'Retry with a smaller DAILY_EXECUTE_LIMIT or inspect the current browser page before rerunning social outreach.',
    });
  }
  if (reasons.has('website_contact_unreachable_skip')) {
    actions.push({
      reason: 'website_contact_unreachable_skip',
      action: 'Skip unreachable website route',
      description: 'Continue through Facebook, Instagram, or another verified official contact path.',
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

function executionQueueGoalStatus(summary = {}, confirmedToday = 0) {
  const target = Number(summary.potentialPoolTarget || 100);
  const potentialPool = Number(summary.potentialPool || 0);
  const queueCount = Number(summary.dueNow || summary.dailyQueue || summary.queueCount || 0);
  const googleDiscovered = Number(summary.googleDiscovered || 0);
  const dailyTargetReached = Number(confirmedToday || 0) >= target;
  const refillNeeded = dailyTargetReached ? 0 : Math.max(0, Number.isFinite(target) ? target - potentialPool : 0);
  return {
    target,
    potentialPool,
    queueCount,
    googleDiscovered,
    refillNeeded,
    confirmedToday: Number(confirmedToday || 0),
    reached: dailyTargetReached || refillNeeded === 0,
    action: refillNeeded > 0
      ? 'Add more verified high-ICP sources or unblock existing website/social leads.'
      : dailyTargetReached
        ? 'Daily confirmed-company target reached; preserve the hard cap and do not send more first touches.'
        : 'Daily high-ICP queue target reached.',
  };
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
  const alibabaSessionProbe = await probeAlibabaWebmailSession();
  liveAlibabaWebmailSessionReady = Boolean(alibabaSessionProbe && alibabaSessionProbe.ok);
  const ledgerReconciliationCount = reconcileLatestExecutionResultsToLedger();
  const externalEvidenceReconciliationCount = reconcileExternalEvidenceConfirmations();
  // Reconcile delayed DSNs before computing today's confirmed-company count
  // or selecting another channel. A Sent-folder receipt proves submission to
  // the mail system, not eventual recipient delivery.
  const bounceReconciliation = await reconcileAlibabaBounceResults();
  const requestedLimit = Math.max(1, Math.min(Number(payload && payload.limit || process.env.DAILY_EXECUTE_LIMIT || DEFAULT_DAILY_SOCIAL_EXECUTION_LIMIT), MAXIMUM_DAILY_SOCIAL_EXECUTION_LIMIT));
  const parallelLimit = 1;
  const preSendStatusRepairCount = repairPreSendUnconfirmedResults();
  const previousResults = readJsonScriptArray(path.join(__dirname, 'autonomous-outreach-results.js'), 'AUTONOMOUS_OUTREACH_RESULTS');
  const platformCircuitState = platformSafetyCircuitState(previousResults);
  const confirmedToday = sameDayConfirmedCompanyCount(previousResults);
  const remainingDailyGap = Math.max(0, DAILY_CONFIRMED_COMPANY_TARGET - confirmedToday);
  const limit = Math.min(requestedLimit, remainingDailyGap);
  const sameDayCompanyKeys = sameDayAutomationCompanyKeys(previousResults);
  const visibleExecutable = executableQueueCandidates(latest.visibleTodayQueue || [], { allowWebsiteContact: false });
  const dueCandidates = executableQueueCandidates(latest.dailyQueue, { allowWebsiteContact: false });
  const scheduledExecutable = executableQueueCandidates(latest.scheduledLater || [], { allowWebsiteContact: false });
  const potentialFallback = executableQueueCandidates(latest.dailyPotentialPool || [], { allowWebsiteContact: false })
    .filter(item => !['cooldown', 'blocked_partner', 'retain_low_icp', 'skip_exclusive_agency'].includes(String(item.action || '').toLowerCase()))
    .filter(item => !item.lastTouch && !item.previouslyContacted);
  const websiteFallback = executableQueueCandidates([
    ...latest.dailyQueue,
    ...(latest.scheduledLater || []),
    ...(latest.dailyPotentialPool || []),
  ], { allowWebsiteContact: true })
    .filter(item => !isSocialQueueItem(item));
  const queueSource = dueCandidates.length
    ? 'dailyQueue'
    : scheduledExecutable.length
      ? 'scheduledLater'
      : 'dailyPotentialPool';
  // visibleTodayQueue contains the discovery runner's already identity-checked
  // social shortlist. Route it through the same execution, history and
  // confirmation gates instead of leaving the dashboard's "executable" rows
  // disconnected from the browser runner.
  const socialPool = [...visibleExecutable, ...dueCandidates, ...scheduledExecutable, ...potentialFallback]
    .filter((item, index, list) => list.findIndex(other => other.id === item.id) === index)
    .sort(developmentPriorityCompare);
  const candidatePool = [
    ...socialPool,
    ...websiteFallback.filter(item => !socialPool.some(social => social.id === item.id)),
  ]
    .filter((item, index, list) => list.findIndex(other => other.id === item.id) === index)
    .sort(developmentPriorityCompare);
  const readyRowsForAudit = [
    ...latest.dailyQueue,
    ...(latest.scheduledLater || []),
    ...(latest.dailyPotentialPool || []),
  ].filter((item, index, list) => item && item.executionReadiness && item.executionReadiness.ready === true
    && list.findIndex(other => other.id === item.id) === index);
  const executable = [];
  const skipped = [];
  const checkpointSnapshot = readJson(dailyExecutionCheckpointPath(), null);
  const checkpoint = readDailyExecutionCheckpoint(latest.date);
  const checkpointResults = Array.isArray(checkpoint && checkpoint.completedResults)
    ? checkpoint.completedResults
    : [];
  const checkpointCompletedIds = new Set(
    checkpointResults
      .filter(checkpointResultIsTerminal)
      .map(item => item && item.id)
      .filter(Boolean),
  );
  const checkpointResultsById = new Map(
    checkpointResults.filter(Boolean).map(item => [item.id, item]),
  );
  const checkpointAudit = {
    snapshotPresent: Boolean(checkpointSnapshot),
    snapshotCompleted: Boolean(checkpointSnapshot && checkpointSnapshot.completed === true),
    activeResume: Boolean(checkpoint),
    terminalTaskCount: checkpointCompletedIds.size,
    rule: 'completed checkpoints are ignored; only terminal results from an active interrupted checkpoint suppress their exact task id',
  };
  const selectedCompanyKeys = new Set(sameDayCompanyKeys);
  for (const item of candidatePool) {
    if (executable.length >= limit) break;
    const itemPlatform = automationPlatformFor(item);
    if (itemPlatform && platformCircuitState[itemPlatform] && platformCircuitState[itemPlatform].open) {
      skipped.push({
        id: item.id,
        company: item.company,
        action: item.action,
        reason: 'platform_safety_circuit_open',
        platform: itemPlatform,
        evidence: `same_day_safety_failures:${platformCircuitState[itemPlatform].failures}`,
      });
      continue;
    }
    const checkpointResult = checkpointResultsById.get(item.id);
    const verifiedProfileIdentityRetry = Boolean((item.officialSocialProfileVerified || exactSocialHandleMatchesCompany(item))
      && checkpointResult
      && isFixedIdentityVerifierFailure(checkpointResult));
    if (checkpointCompletedIds.has(item.id) && !verifiedProfileIdentityRetry) {
      skipped.push({
        id: item.id,
        company: item.company,
        action: item.action,
        reason: 'completed_in_execution_checkpoint',
      });
      continue;
    }
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
    automationCompanyKeys(item).forEach(key => selectedCompanyKeys.add(key));
  }
  [...latest.dailyQueue, ...(latest.scheduledLater || []), ...(latest.dailyPotentialPool || [])]
    .filter(item => !executable.some(run => run.id === item.id))
    .filter(item => !skipped.some(run => run.id === item.id))
    .forEach(item => skipped.push({
      id: item.id,
      company: item.company,
      action: item.action,
      platform: item.platform || '',
      // An unattempted website/email candidate is not blocked by a missing
      // attachment. Attachment requirements can only be known after the
      // verified form is inspected; prepareWebsiteContactForm records the
      // blocker when a required file input actually exists.
      reason: item.executionReadiness && item.executionReadiness.ready !== true
        ? item.executionReadiness.reason || 'verified_executable_channel_missing'
        : isSocialQueueItem(item) && item.officialSocialProfileVerified !== true
          ? 'social_profile_not_first_party_verified'
          : item.reason,
    }));

  if (!executable.length) {
    const skippedRows = uniqueSkippedRows(skipped);
    const blockerSummary = buildExecutionBlockerSummary([], skippedRows);
    const userVisibleStatus = formatExecutionBlockerStatus(blockerSummary)
      || 'No Chrome/browser development was performed because safety gates left no executable tasks.';
    const blockerCounts = executionBlockerCounts(blockerSummary);
    const confirmedToday = sameDayConfirmedCompanyCount(
      readJsonScriptArray(path.join(__dirname, 'autonomous-outreach-results.js'), 'AUTONOMOUS_OUTREACH_RESULTS'),
    );
    const queueGoalStatus = executionQueueGoalStatus(latest.summary || {}, confirmedToday);
    if (remainingDailyGap === 0) {
      return {
        ok: true,
        skippedOnly: true,
        browserTransportRequested: 'codex-extension-first',
        browserTransportUsed: 'none',
        browserTransportFallbackReason: '',
        extensionReceiptCount: 0,
        executionPhase: 'daily_cap_reached',
        chromeStage: 'not_started',
        chromeOpened: false,
        chromeOpenedCount: 0,
        customerDevelopmentPerformed: false,
        customerMessageSent: false,
        realDevelopmentCount: 0,
        reportingVerdict: 'daily_target_already_reached',
        userVisibleStatus: `Daily target already reached at ${confirmedToday}/${DAILY_CONFIRMED_COMPANY_TARGET}; no additional first touch was attempted.`,
        recoveryActions: [],
        skipped: skippedRows,
        blockerSummary: [],
        blockerCounts: {},
        queueGoalStatus,
        checkpointAudit,
        candidateSelectionAudit: [],
        bounceReconciliation,
      };
    }
    const recoveryActions = executionRecoveryActions(blockerSummary, queueGoalStatus);
    const recoveryHint = recoveryActions.length ? recoveryActions.map(item => item.hint).join(' ') : undefined;
    return {
      ok: false,
      skippedOnly: true,
      browserTransportRequested: 'codex-extension-first',
      browserTransportUsed: 'none',
      browserTransportFallbackReason: '',
      extensionReceiptCount: 0,
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
      queueGoalStatus,
      checkpointAudit,
      candidateSelectionAudit: readyRowsForAudit.map(item => {
        const block = blockingAutomationResultFor(item);
        return {
          id: item.id,
          company: item.company,
          action: item.action,
          platform: item.platform,
          readiness: item.executionReadiness,
          hasTarget: Boolean(item.url || item.targetUrl || item.platformUrl || item.verifiedTargetUrl || item.contactUrl || item.website || verifiedBusinessEmailTarget(item).ok),
          inCandidatePool: candidatePool.some(candidate => candidate.id === item.id),
          sameDayCompanyBlocked: itemBlockedBySameDayCompany(item, selectedCompanyKeys),
          blockingStatus: block && block.status || '',
          blockingEvidence: block && block.evidence || '',
        };
      }),
      summary: latest.summary || {},
      bounceReconciliation,
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
    confirmedToday,
    remainingDailyGap,
    preSendStatusRepairCount,
    currentIndex: 0,
    currentItem: null,
    completedCount: 0,
    confirmedSendCount: 0,
    preparedWebsiteCount: 0,
    resumedFromCheckpoint: checkpointCompletedIds.size > 0,
    checkpointCompletedCount: checkpointCompletedIds.size,
    lastResult: null,
  };

  const results = [];
  const completedTaskIds = new Set(checkpointCompletedIds);
  writeDailyExecutionCheckpoint({
    queueDate: latest.date,
    completed: false,
    currentItem: null,
    completedTaskIds: [...completedTaskIds],
    completedResults: [],
  });
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
      writeDailyExecutionCheckpoint({
        queueDate: latest.date,
        completed: false,
        currentItem: currentDailyExecutionProgress.currentItem,
        completedTaskIds: [...completedTaskIds],
        completedResults: results,
      });
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
      const result = await executeLeadWithCustomerWatchdog(item, {
        ignoreCooldown: true,
        allowParallel: true,
        reuseTab: false,
        customerTimeoutMs: payload && payload.customerTimeoutMs,
      });
      recordAutomationResult(item, result);
      // Keep one customer per automation tab. Close it immediately after the
      // result is recorded so long runs cannot accumulate Facebook/Instagram
      // tabs and overload Chrome. User-owned tabs are never in this map.
      await closeAutomationChromeTab(result && result.chromeOpen);
      const output = parseExecutionOutput(result && result.output);
      const sendStatus = output.sendStatus || result.sendStatus || '';
      if (SAME_DAY_DEVELOPMENT_STATUSES.has(sendStatus)
        && sendStatusHasCustomerInteraction(sendStatus, output.evidence || result.evidence || '')) {
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
        timestamp: new Date().toISOString(),
        chromeOpen: result && result.chromeOpen || null,
        result,
      };
    }));
    results.push(...batchResults);
    batchResults.forEach(item => {
      if (item && item.id && checkpointResultIsTerminal(item)) completedTaskIds.add(item.id);
    });
    currentDailyExecutionProgress = {
      ...currentDailyExecutionProgress,
      completedCount: results.length,
      confirmedSendCount: results.filter(item => ['sent_confirmed', 'submitted_confirmed'].includes(item.sendStatus)).length,
      preparedWebsiteCount: results.filter(item => item.sendStatus === 'website_contact_ready').length,
      skippedCount: skipped.length,
      lastResult: batchResults[batchResults.length - 1] ? {
        id: batchResults[batchResults.length - 1].id,
        company: batchResults[batchResults.length - 1].company,
        sendStatus: batchResults[batchResults.length - 1].sendStatus,
        evidence: batchResults[batchResults.length - 1].evidence,
      } : null,
    };
    writeDailyExecutionCheckpoint({
      queueDate: latest.date,
      completed: false,
      currentItem: null,
      completedTaskIds: [...completedTaskIds],
      completedResults: results,
      progress: currentDailyExecutionProgress,
    });
    if (batchResults.some(item => item.result && (item.result.needsConfig || item.result.needsInstall))) break;
    if (index + parallelLimit < executable.length) await sleep(Number(payload && payload.delayMs || 91000));
  }
  const systemRefresh = await refreshDailyAutomationArtifacts();
  const blockerSummary = buildExecutionBlockerSummary(results, skipped);
  const userVisibleStatus = formatExecutionBlockerStatus(blockerSummary);
  const blockerCounts = executionBlockerCounts(blockerSummary);
  const queueGoalStatus = executionQueueGoalStatus(latest.summary || {}, confirmedToday);
  const recoveryActions = executionRecoveryActions(blockerSummary, queueGoalStatus);
  const recoveryHint = recoveryActions.length ? recoveryActions.map(item => item.hint).join(' ') : undefined;
  writeDailyExecutionCheckpoint({
    queueDate: latest.date,
    completed: true,
    currentItem: null,
    completedTaskIds: [...completedTaskIds],
    completedResults: results,
    progress: currentDailyExecutionProgress,
  });

  return {
    ok: results.some(item => item.ok),
    ...buildExecutionTruth(results),
    engine: 'Browser transport queue bridge',
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
    queueGoalStatus,
    checkpointAudit,
    platformCircuitState,
    userVisibleStatus,
    recoveryHint,
    recoveryActions,
    systemRefresh,
    alibabaSessionProbe,
    bounceReconciliation,
    ledgerReconciliationCount,
    externalEvidenceReconciliationCount,
  };
}

ipcMain.handle('run-daily-automation-queue', async (_event, payload) => runDailyAutomationQueue(payload));

async function runAutoDailyAndWriteArtifact() {
  let completed = false;
  const policyPreflight = validatePolicies();
  if (!policyPreflight.ok) {
    const output = {
      ok: false,
      error: 'CONFIG_MISSING',
      completedAt: new Date().toISOString(),
      browserTransportRequested: 'dedicated Chrome/CDP',
      browserTransportUsed: 'none',
      executionPhase: 'no_browser_execution',
      chromeOpened: false,
      customerDevelopmentPerformed: false,
      customerMessageSent: false,
      realDevelopmentCount: 0,
      reportingVerdict: 'configuration_missing_fail_closed',
      blockerSummary: policyPreflight.issues.map(reason => ({ reason, status: 'blocked', count: 1 })),
      userVisibleStatus: `Customer sending was blocked by policy preflight: ${policyPreflight.issues.join('; ')}`,
      recoveryHint: 'Restore the required versioned policy files and regenerate runtime context.',
    };
    writeDailyExecutionArtifact(output);
    refreshRuntime({ phase: 'config-missing' });
    app.exit(0);
    return;
  }
  const timeoutMs = Math.max(60000, Number(process.env.DAILY_EXECUTE_TIMEOUT_MS || 2700000));
  const watchdog = setTimeout(async () => {
    if (completed) return;
    const confirmedSendCount = Number(currentDailyExecutionProgress && currentDailyExecutionProgress.confirmedSendCount || 0);
    const latest = readJson(path.join(__dirname, 'daily-automation-latest.json'), {});
    const blockerSummary = [{
      reason: 'browser_execution_timeout',
      count: 1,
      examples: [currentDailyExecutionProgress && currentDailyExecutionProgress.currentItem].filter(Boolean),
    }];
    const confirmedToday = sameDayConfirmedCompanyCount(
      readJsonScriptArray(path.join(__dirname, 'autonomous-outreach-results.js'), 'AUTONOMOUS_OUTREACH_RESULTS'),
    );
    const queueGoalStatus = executionQueueGoalStatus(latest.summary || {}, confirmedToday);
    const recoveryActions = executionRecoveryActions(blockerSummary, queueGoalStatus);
    const recoveryHint = recoveryActions.length ? recoveryActions.map(item => item.hint).join(' ') : undefined;
    writeDailyExecutionArtifact({
      ok: false,
      error: `auto-run-daily timed out after ${timeoutMs}ms`,
      completedAt: new Date().toISOString(),
      browserTransportRequested: 'codex-extension-first',
      browserTransportUsed: 'cdp',
      browserTransportFallbackReason: 'extension_bridge_not_available_process_local_cdp',
      extensionReceiptCount: 0,
      executionPhase: 'browser_execution_timeout',
      chromeOpened: true,
      customerDevelopmentPerformed: confirmedSendCount > 0,
      customerMessageSent: confirmedSendCount > 0,
      realDevelopmentCount: confirmedSendCount,
      reportingVerdict: confirmedSendCount > 0 ? 'partial_customer_development_before_timeout' : 'no_customer_development_performed',
      progress: currentDailyExecutionProgress,
      checkpoint: readJson(dailyExecutionCheckpointPath(), null),
      blockerSummary,
      blockerCounts: executionBlockerCounts(blockerSummary),
      queueGoalStatus,
      recoveryHint,
      recoveryActions,
    });
    await closeAutomationTabsOpenedAfter(new Set());
    app.exit(1);
  }, timeoutMs);
  if (watchdog.unref) watchdog.unref();

  try {
    const autoLimit = Math.max(1, Math.min(Number(process.env.DAILY_EXECUTE_LIMIT || DEFAULT_DAILY_SOCIAL_EXECUTION_LIMIT), MAXIMUM_DAILY_SOCIAL_EXECUTION_LIMIT));
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
      browserTransportRequested: 'codex-extension-first',
      browserTransportUsed: 'none',
      browserTransportFallbackReason: 'execution_failed_before_transport_confirmation',
      extensionReceiptCount: 0,
    };
    writeDailyExecutionArtifact(output);
  } finally {
    completed = true;
    clearTimeout(watchdog);
    app.exit(0);
    // Electron can retain a Chromium utility process after the artifact is
    // complete. Bound CLI lifetime without affecting the normal desktop app.
    setTimeout(() => process.exit(0), 1500);
  }
}

app.whenReady().then(() => {
  if (isAutoRunDaily) {
    runAutoDailyAndWriteArtifact();
    return;
  }
  createWindow();
});

ipcMain.handle('email-channel-status', async () => emailSenderReadiness());

app.on('window-all-closed', () => {
  if (!isAutoRunDaily) app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
