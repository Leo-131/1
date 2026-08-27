const fs = require('fs');
const path = require('path');
const { verifiedBusinessEmailTarget } = require('./alibaba-email-delivery');

const ROOT = __dirname;
const RUN_DIR = path.join(ROOT, 'daily-runs');
const CONFIG_PATH = path.join(ROOT, 'daily-automation-config.json');
const TRANSIENT_FILE_ERROR_CODES = new Set(['EBUSY', 'EACCES', 'EPERM', 'UNKNOWN']);

function writeFileWithRetry(file, data, attempts = 10) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return fs.writeFileSync(file, data);
    } catch (error) {
      lastError = error;
      if (!TRANSIENT_FILE_ERROR_CODES.has(error && error.code) || attempt === attempts - 1) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }
  }
  throw lastError;
}

function copyFileWithRetry(from, to, attempts = 10) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return fs.copyFileSync(from, to);
    } catch (error) {
      lastError = error;
      if (!TRANSIENT_FILE_ERROR_CODES.has(error && error.code) || attempt === attempts - 1) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }
  }
  throw lastError;
}
const DEFAULT_CONFIG = {
  limits: { total: 100, develop: 70, emailPriority: 15, retryOrAlternate: 10, verifyTarget: 5 },
  cadence: {
    icpThreshold: 70,
    cooldownDays: 7,
    singleBrowserPage: true,
    parallelTasks: false,
    parallelLimit: 1,
    noDuplicateDm: true,
    manualDeployOnly: true,
    preferOpenAgencyMarkets: true,
    skipExclusiveAgencyMarkets: true,
  },
  marketPriority: {
    openAgencyBonus: 18,
    exclusiveAgencyPenalty: 60,
    preferredCountryBonus: 30,
    preferredCountries: ['united kingdom', 'uk'],
    exclusiveStatuses: ['独代占用', '独家代理', '独家', 'exclusive', 'reserved', 'blocked'],
    openStatuses: ['可开拓', '开放', 'open', 'available'],
  },
  workingHours: {
    workdays: [1, 2, 3, 4, 5],
    windows: [
      { name: 'morning', start: '09:00', end: '11:30', weight: 1 },
      { name: 'afternoon', start: '14:00', end: '16:30', weight: 0.9 },
    ],
    timeZones: {},
  },
};
const CONFIG = loadConfig();
const ICP_THRESHOLD = Number(CONFIG.cadence.icpThreshold || 70);
const COOLDOWN_DAYS = Number(CONFIG.cadence.cooldownDays || 7);
const DEFAULT_DAILY_LIMIT = 100;
const DEFAULT_POTENTIAL_POOL_TARGET = 100;
const TOUCH_STATUSES = new Set([
  'sent_confirmed',
  'submitted_confirmed',
  'send_unconfirmed',
]);
const SAME_DAY_DEVELOPMENT_STATUSES = new Set([
  'sent_confirmed',
  'submitted_confirmed',
  'send_unconfirmed',
  'failed_open',
]);
const HISTORICAL_DEVELOPMENT_STATUSES = new Set([
  'sent_confirmed',
  'submitted_confirmed',
  'send_unconfirmed',
]);
const WEBSITE_CONTACT_VERIFIED_EVIDENCE = 'contact_entry_verified';
const PROTECTED_AGENCY_MARKETS = new Map([
  ['switzerland', 'INNPRO Robert Błędowski Sp. z o.o.'],
  ['romania', 'INNPRO Robert Błędowski Sp. z o.o.'],
  ['greece', 'INNPRO Robert Błędowski Sp. z o.o.'],
  ['hungary', 'INNPRO Robert Błędowski Sp. z o.o.'],
]);
const PARTNER_COMPANIES = new Set([
  'rei',
  'rei co-op',
  'rei coop',
  'academy',
  'acadamy',
  'academy sports outdoors',
  'acadamy sports outdoors',
  'scheels',
  'innpro',
  'innpro robert błędowski sp. z o.o.',
  'innpro robert bledowski sp. z o.o.',
]);

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return DEFAULT_CONFIG;
  const parsed = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  return {
    ...DEFAULT_CONFIG,
    ...parsed,
    limits: { ...DEFAULT_CONFIG.limits, ...parsed.limits },
    cadence: { ...DEFAULT_CONFIG.cadence, ...parsed.cadence },
    marketPriority: { ...DEFAULT_CONFIG.marketPriority, ...parsed.marketPriority },
    workingHours: {
      ...DEFAULT_CONFIG.workingHours,
      ...parsed.workingHours,
      timeZones: { ...DEFAULT_CONFIG.workingHours.timeZones, ...(parsed.workingHours && parsed.workingHours.timeZones) },
    },
  };
}

function readJsonScript(file, globalName) {
  const raw = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const match = raw.match(new RegExp(`window\\.${globalName}\\s*=\\s*([\\s\\S]*?);\\s*$`));
  if (!match) throw new Error(`Cannot parse ${globalName} from ${file}`);
  return JSON.parse(match[1]);
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
  } catch {
    return fallback;
  }
}

function readEmbeddedCustomerRecords() {
  try {
    const html = fs.readFileSync(path.join(ROOT, 'outreach-dashboard.html'), 'utf8');
    const match = html.match(/const embeddedData = (\{[\s\S]*?\});\s*const liContacts/);
    if (!match) return [];
    const parsed = JSON.parse(match[1]);
    return Array.isArray(parsed.contacts) ? parsed.contacts : [];
  } catch {
    return [];
  }
}

function csvCell(value) {
  return `"${String(value == null ? '' : value).replace(/"/g, '""')}"`;
}

function taskId(task) {
  return `verified-${task.platform || 'social'}-${task.accountHandle || task.name}`;
}

function slugKey(value) {
  return String(value || '').trim().toLowerCase().replace(/&/g, 'and').replace(/\+/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function validDate(value) {
  const time = Date.parse(value || '');
  return Number.isFinite(time) ? time : 0;
}

function daysSince(value, now = Date.now()) {
  const time = validDate(value);
  return time ? (now - time) / 86400000 : Infinity;
}

function normalizedMarketStatus(task) {
  return String(task.marketStatus || task.agencyStatus || '').trim().toLowerCase();
}

function statusIncludes(status, words) {
  return (words || []).some(word => status.includes(String(word).trim().toLowerCase()));
}

function marketAgencyState(task) {
  if (PROTECTED_AGENCY_MARKETS.has(normalizedCountry(task))) return 'exclusive';
  const status = normalizedMarketStatus(task);
  if (statusIncludes(status, CONFIG.marketPriority.exclusiveStatuses)) return 'exclusive';
  if (statusIncludes(status, CONFIG.marketPriority.openStatuses)) return 'open';
  return 'unknown';
}

function marketAgencyScore(task) {
  const state = marketAgencyState(task);
  if (state === 'open' && CONFIG.cadence.preferOpenAgencyMarkets !== false) {
    return Number(CONFIG.marketPriority.openAgencyBonus || 0);
  }
  if (state === 'exclusive') {
    return -Number(CONFIG.marketPriority.exclusiveAgencyPenalty || 0);
  }
  return 0;
}

const REGION_PRIORITY = {
  southeast_asia: {
    weight: 35,
    countries: ['brunei', 'cambodia', 'indonesia', 'laos', 'malaysia', 'myanmar', 'philippines', 'singapore', 'thailand', 'timor-leste', 'vietnam'],
  },
  europe: {
    weight: 45,
    countries: ['austria', 'belgium', 'czech republic', 'denmark', 'finland', 'france', 'germany', 'greece', 'hungary', 'ireland', 'italy', 'netherlands', 'norway', 'poland', 'portugal', 'romania', 'spain', 'sweden', 'switzerland', 'united kingdom', 'uk'],
  },
  americas: {
    weight: 30,
    countries: ['argentina', 'brazil', 'canada', 'chile', 'colombia', 'mexico', 'peru', 'united states', 'usa'],
  },
};

function normalizedCountry(task) {
  return String(task.countryEn || task.country || task.headquarters || '').trim().toLowerCase();
}

function targetRegion(task) {
  const country = normalizedCountry(task);
  for (const [region, config] of Object.entries(REGION_PRIORITY)) {
    if (config.countries.some(item => country === item || country.includes(item))) return region;
  }
  if (/australia|new zealand/.test(country)) return 'oceania';
  return 'other';
}

function targetRegionScore(task) {
  const region = targetRegion(task);
  return REGION_PRIORITY[region] ? REGION_PRIORITY[region].weight : 0;
}

function contactChannelScore(task) {
  let score = 0;
  if (task.contactEmail || task.publicEmail) score += 12;
  if (task.vendorPortal || task.contactUrl) score += 8;
  if (task.website || task.platformUrl || task.url) score += 5;
  if (task.alternateChannels && (task.alternateChannels.linkedin || task.alternateChannels.instagram || task.alternateChannels.facebook)) score += 4;
  return score;
}

function preferredCountryScore(task) {
  const country = normalizedCountry(task);
  const preferred = (CONFIG.marketPriority.preferredCountries || [])
    .map(item => String(item || '').trim().toLowerCase())
    .filter(Boolean);
  return preferred.some(item => country === item)
    ? Number(CONFIG.marketPriority.preferredCountryBonus || 0)
    : 0;
}

function customerTypePriorityScore(task) {
  return ['agency', 'sales_agency'].includes(String(task.customerType || '').trim().toLowerCase()) ? 25 : 0;
}

function campaignScopeMatches(task) {
  const scope = CONFIG.campaignScope || {};
  if (scope.enabled !== true) return true;
  const country = normalizedCountry(task);
  const customerType = String(task.customerType || '').trim().toLowerCase();
  const requiredCountries = (scope.requiredCountries || []).map(item => String(item || '').trim().toLowerCase()).filter(Boolean);
  const requiredCustomerTypes = (scope.requiredCustomerTypes || []).map(item => String(item || '').trim().toLowerCase()).filter(Boolean);
  return (!requiredCountries.length || requiredCountries.includes(country))
    && (!requiredCustomerTypes.length || requiredCustomerTypes.includes(customerType));
}

function dealProbabilityScore(task) {
  return Number(task.fitScore || 0)
    + Math.round(Number(task.marketScore || 0) * 12)
    + marketAgencyScore(task)
    + targetRegionScore(task)
    + preferredCountryScore(task)
    + contactChannelScore(task)
    + customerTypePriorityScore(task);
}

function channelPriorityScore(task) {
  const platform = String(task.platform || task.channel || '').trim().toLowerCase();
  const identity = `${task.id || ''} ${task.reason || ''} ${task.url || ''}`.toLowerCase();
  if (platform === 'email') return 500;
  if (platform === 'linkedin' || /linkedin/.test(identity)) return 450;
  if (platform === 'facebook' || /facebook/.test(identity)) return 440;
  if (platform === 'instagram' || /instagram/.test(identity)) return 430;
  // Website forms remain a safe fallback, but a first-party verified social
  // target has a more deterministic visible send/confirmation surface.
  if (platform === 'website_form' || /website-contact|official_website_contact_channel/.test(identity)) return 300;
  return 100;
}

function priorityCompare(left, right) {
  const dueDelta = Number(Boolean(right.workingTime && right.workingTime.dueNow)) - Number(Boolean(left.workingTime && left.workingTime.dueNow));
  if (dueDelta) return dueDelta;
  return channelPriorityScore(right) - channelPriorityScore(left)
    || Number(right.dealProbabilityScore || 0) - Number(left.dealProbabilityScore || 0)
    || Number(right.priorityScore || 0) - Number(left.priorityScore || 0)
    || String(left.company || left.name || '').localeCompare(String(right.company || right.name || ''));
}

function queueDedupeKey(item) {
  const platform = cleanKey(item.platform || 'unknown');
  const recipient = String(item.contactEmail || item.publicEmail || '').trim().toLowerCase();
  // A first-party brand directory can legitimately list several independent
  // agencies on one evidence page. Email identity is the verified recipient,
  // not the directory host; host-level dedupe would silently collapse those
  // distinct companies into one queue row.
  if (platform === 'email' && recipient) return `email:recipient:${cleanKey(recipient)}`;
  const channelUrl = item.contactUrl || item.platformUrl || item.url || item.website || item.id;
  const handle = profileHandle(channelUrl);
  const host = hostnameKey(channelUrl);
  if (handle) return `${platform}:profile:${cleanKey(handle)}`;
  if (/linkedin\.com\/in\//i.test(String(channelUrl || ''))) return `${platform}:profile:${cleanKey(channelUrl)}`;
  if (host) return `${platform}:host:${cleanKey(host)}`;
  return `${platform}:${cleanKey(channelUrl || item.company || item.name)}`;
}

function dedupeQueueItems(items) {
  const sorted = items.slice().sort((left, right) => {
    const readinessDelta = Number(Boolean(right && right.executionReadiness && right.executionReadiness.ready === true))
      - Number(Boolean(left && left.executionReadiness && left.executionReadiness.ready === true));
    return readinessDelta || priorityCompare(left, right);
  });
  const seen = new Set();
  return sorted.filter((item) => {
    const key = queueDedupeKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function promoteExecutionReadyQueueRows(primaryRows = [], potentialRows = []) {
  const verifiedByCompany = new Map();
  for (const item of potentialRows) {
    if (!(item && item.executionReadiness && item.executionReadiness.ready === true)) continue;
    const key = slugKey(item.company || item.name || item.id);
    if (!key) continue;
    const current = verifiedByCompany.get(key);
    if (!current || priorityCompare(item, current) < 0) verifiedByCompany.set(key, item);
  }
  return primaryRows.map(item => verifiedByCompany.get(slugKey(item.company || item.name || item.id)) || item);
}

function preferSocialChannels(items) {
  return (items || []).slice().sort((left, right) => {
    const leftRank = socialChannelRank(left);
    const rightRank = socialChannelRank(right);
    return rightRank - leftRank || priorityCompare(left, right);
  });
}

function socialChannelRank(item = {}) {
  const text = [item.platform, item.id, item.url, item.platformUrl, item.contactUrl].filter(Boolean).join(' ').toLowerCase();
  if (String(item.platform || '').toLowerCase() === 'email' || /mailto:/.test(text)) return 400;
  if (String(item.platform || '').toLowerCase() === 'website_form' || /website-contact|official_website_contact_channel/.test(text)) return 390;
  if (/\blinkedin\b|linkedin\.com/.test(text)) return 330;
  if (/\bfacebook\b|facebook\.com/.test(text)) return 320;
  if (/\binstagram\b|instagram\.com/.test(text)) return 310;
  return 0;
}

function minutesOfDay(value) {
  const match = String(value || '').match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}

function localTimeParts(timeZone, now) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(now)).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});
  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    weekday: weekdayMap[parts.weekday] ?? 0,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    label: `${parts.weekday} ${parts.hour}:${parts.minute}`,
  };
}

function timeZoneForTask(task) {
  const zones = CONFIG.workingHours.timeZones || {};
  const candidates = [
    task.countryEn,
    task.country,
    String(task.country || '').replace(/[^\p{L}\p{N}\s]/gu, '').trim(),
  ].filter(Boolean);
  return candidates.map(candidate => zones[candidate]).find(Boolean) || zones.Unknown || 'Asia/Shanghai';
}

function nextWindowLabel(timeZone, windowName) {
  return `${timeZone} ${windowName || 'next_work_window'}`;
}

function workingTimeForTask(task, now) {
  if (CONFIG.cadence.respectTargetWorkingHours === false) {
    return { dueNow: true, timeZone: 'ignored', localTime: 'ignored', window: 'always', nextBest: 'now' };
  }
  const timeZone = timeZoneForTask(task);
  const local = localTimeParts(timeZone, now);
  const workdays = new Set(CONFIG.workingHours.workdays || [1, 2, 3, 4, 5]);
  const windows = (CONFIG.workingHours.windows || []).map(item => ({
    ...item,
    startMinute: minutesOfDay(item.start),
    endMinute: minutesOfDay(item.end),
  }));
  if (!workdays.has(local.weekday)) {
    return { dueNow: false, timeZone, localTime: local.label, window: 'off_workday', nextBest: nextWindowLabel(timeZone, windows[0] && windows[0].name) };
  }
  const active = windows.find(item => local.minutes >= item.startMinute && local.minutes <= item.endMinute);
  if (active) {
    return { dueNow: true, timeZone, localTime: local.label, window: active.name, nextBest: 'now', weight: Number(active.weight || 1) };
  }
  const next = windows.find(item => local.minutes < item.startMinute) || windows[0];
  return { dueNow: false, timeZone, localTime: local.label, window: 'outside_work_hours', nextBest: nextWindowLabel(timeZone, next && next.name), weight: 0 };
}

function targetUrl(task, profiles) {
  const profile = profiles[String(task.name || '').toLowerCase()];
  if (String(task.platform || '').toLowerCase() === 'email') {
    return task.contactUrl || task.vendorPortal || task.verifiedTargetUrl || task.url || task.website || (profile && profile.url) || '';
  }
  return task.verifiedTargetUrl || task.url || (profile && profile.url) || '';
}

function normalizeResultIndex(results) {
  const index = new Map();
  for (const result of results) {
    const resultHandle = profileHandle(result.target_url);
    const resultPlatform = String(result.platform || '').toLowerCase();
    const keys = [
      result.task_id,
      result.target_url,
      resultHandle ? `profile:${resultHandle}` : '',
      hostKey(result.target_url),
      resultPlatform && resultHandle ? `${resultPlatform}:${resultHandle}` : '',
    ].map(cleanKey).filter(Boolean);
    for (const key of keys) {
      const current = index.get(key);
      if (!current || validDate(result.timestamp) >= validDate(current.timestamp)) {
        index.set(key, result);
      }
    }
  }
  return index;
}

function cleanKey(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/ł/gi, 'l')
    .trim()
    .toLowerCase()
    .replace(/^@/, '')
    .replace(/[^a-z0-9]+/g, '');
}

function partnerCompanyKeys(value) {
  const raw = String(value || '');
  return [
    raw,
    raw.replace(/&/g, 'and'),
    raw.replace(/\+/g, ' '),
    raw.replace(/\bsports\s*outdoors\b/i, ''),
    raw.replace(/\bsports\s*\+\s*outdoors\b/i, ''),
  ].map(cleanKey).filter(Boolean);
}

function isKnownPartnerCompany(item = {}) {
  const keys = [
    item.company,
    item.name,
    leadFamilyKey(item.id || item.task_id),
    hostnameKey(item.website || item.url || item.contactUrl || item.target_url),
  ].flatMap(partnerCompanyKeys);
  return keys.some(key => PARTNER_COMPANIES.has(key));
}

function leadFamilyKey(value) {
  return cleanKey(String(value || '')
    .replace(/^google-customer-/i, '')
    .replace(/^verified-[a-z]+-/i, '')
    .replace(/-(linkedin|instagram|facebook|website-contact)$/i, ''));
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

function sameAutomationDay(value, now = Date.now()) {
  const day = automationLocalDay(value);
  return Boolean(day && day === automationLocalDay(now));
}

function automationRunDate(now = Date.now()) {
  return automationLocalDay(now);
}

function profileHandle(value) {
  const raw = String(value || '');
  const socialMatch = raw.match(/(?:instagram|facebook)\.com\/([^/?#]+)/i);
  if (socialMatch) return socialMatch[1];
  const linkedinMatch = raw.match(/linkedin\.com\/(?:in|company)\/([^/?#]+)/i);
  return linkedinMatch ? linkedinMatch[1] : '';
}

function profileKey(value) {
  const handle = profileHandle(value);
  return handle ? `profile:${handle}` : '';
}

function hostnameKey(value) {
  try {
    const hostname = new URL(String(value || '')).hostname.toLowerCase();
    const parts = hostname.replace(/^www\./, '').split('.');
    return parts.length ? parts[0] : '';
  } catch {
    return '';
  }
}

function hostKey(value) {
  const host = hostnameKey(value);
  return host ? `host:${host}` : '';
}

function isVerifiedWebsiteContactResult(result = {}) {
  if (result.status !== 'website_contact_ready') return true;
  const evidence = String(result.evidence || '').toLowerCase();
  return evidence.includes(WEBSITE_CONTACT_VERIFIED_EVIDENCE)
    || evidence.includes('contact_form_detected')
    || evidence.includes('mailto_detected')
    || evidence.includes('business_contact_route_detected');
}

function isTouchResult(result = {}) {
  if (!result || !TOUCH_STATUSES.has(result.status) || !isVerifiedWebsiteContactResult(result)) return false;
  if (result.status !== 'send_unconfirmed') return true;
  const evidence = String(result.evidence || '');
  if (/sender_identity_rejected_delivery_unconfirmed/i.test(evidence)) return true;
  if (/owner_confirmed_prior_customer_development/i.test(evidence)) return true;
  if (/delivery_state_uncertain/i.test(evidence) && /automatic_resend_forbidden/i.test(evidence)) return true;
  if (/message_sent|submitted_confirmed|persisted_after_reload/i.test(evidence)) return true;
  return /send_clicked_but_confirmation_missing|enter_send_attempted_but_confirmation_missing|submit_clicked/i.test(evidence)
    && /verified_draft_present_before_irreversible_action/i.test(evidence);
}

function isHistoricalDevelopmentResult(result = {}) {
  if (HISTORICAL_DEVELOPMENT_STATUSES.has(result.status)) return isTouchResult(result);
  if (result.status !== 'failed_open') return false;
  const evidence = String(result.evidence || '');
  return /message_sent|persisted_after_reload/i.test(evidence)
    || (/send_clicked_but_confirmation_missing|enter_send_attempted_but_confirmation_missing/i.test(evidence)
      && /verified_draft_present_before_irreversible_action/i.test(evidence));
}

function noSafeMessageButtonEvidence(value = '') {
  return /profile_valid_no_message_button|profile_opened_no_message_button|no_message_button|no safe message button/i.test(String(value || ''));
}

function isSameDayDevelopmentResult(result = {}, now = Date.now()) {
  if (!result || !SAME_DAY_DEVELOPMENT_STATUSES.has(result.status) || !sameAutomationDay(result.timestamp, now)) return false;
  // A failure proven to have happened before any irreversible action is safe
  // to retry after a code/UI repair. Uncertain clicks remain hard same-day locks.
  if (result.status === 'failed_open') {
    const evidence = String(result.evidence || '');
    const provenPreSendTransportFailure = /smtp_send_failed:estream|alibaba_webmail_compose_unavailable/i.test(evidence);
    return (!/no_send_performed/i.test(evidence) && !provenPreSendTransportFailure)
      || /send_clicked|enter_send_attempted|submit_clicked/i.test(evidence);
  }
  return isTouchResult(result);
}

function channelLeadKeys(item) {
  const platform = cleanKey(item.platform || 'unknown');
  const handle = profileHandle(item.platformUrl || item.url);
  const isWebsiteContact = platform === 'websiteform' || /website-contact/i.test(String(item.id || item.url || item.contactUrl || ''));
  const base = [
    item.id,
    item.platformUrl,
    item.url,
    item.contactUrl,
    profileKey(item.platformUrl),
    profileKey(item.url),
    platform && handle ? `${platform}:${handle}` : '',
  ];
  if (isWebsiteContact) {
    base.push(item.website, hostKey(item.website), hostKey(item.url), hostKey(item.contactUrl));
  }
  return base.map(cleanKey).filter(Boolean);
}

function leadKeys(item) {
  return [
    item.id,
    leadFamilyKey(item.id || item.task_id),
    item.name,
    item.company,
    item.handle,
    item.accountHandle,
    item.platformUrl,
    item.url,
    item.website,
    profileHandle(item.platformUrl),
    profileHandle(item.url),
  ].map(cleanKey).filter(Boolean);
}

function companyLeadKeys(item) {
  const mailtoTarget = String(item.target_url || item.targetUrl || item.url || '').match(/^mailto:([^?]+)/i);
  return [
    item.id,
    item.task_id,
    leadFamilyKey(item.id || item.task_id),
    item.name,
    item.company,
    item.recipientEmail,
    item.contactEmail,
    item.publicEmail,
    mailtoTarget && mailtoTarget[1],
    hostnameKey(item.website || item.url || item.target_url),
  ].map(cleanKey).filter(Boolean);
}

function routeLeadKeys(item = {}) {
  const keys = [];
  const emailValues = [item.recipientEmail, item.contactEmail, item.publicEmail];
  const target = String(item.target_url || item.targetUrl || item.url || item.contactUrl || item.platformUrl || '').trim();
  const mailto = target.match(/^mailto:([^?]+)/i);
  if (mailto) emailValues.push(mailto[1]);
  for (const value of emailValues) {
    const email = String(value || '').trim().toLowerCase();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) keys.push(`email:recipient:${email}`);
  }
  try {
    const parsed = new URL(target);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    if (/^(linkedin|facebook|instagram)\.com$/.test(host)) {
      const path = parsed.pathname.replace(/\/+$/, '').toLowerCase();
      if (path) keys.push(`social:${host}:${path}`);
    } else if (host) {
      keys.push(`website:${host}`);
    }
  } catch {}
  return [...new Set(keys.map(cleanKey).filter(Boolean))];
}

function knownTouchIndex(results, contacts, now = Date.now()) {
  const touched = new Set();
  const touchedDetails = new Map();
  const activeCooldown = new Set();
  const activeCooldownDetails = new Map();
  const sentConfirmed = new Set();
  const priorDeveloped = new Set();
  const priorDevelopedDetails = new Map();
  const sameDayDeveloped = new Set();
  const sameDayDetails = new Map();
  const routeBlocked = new Set();
  const partners = new Set([...PARTNER_COMPANIES].flatMap(partnerCompanyKeys));
  for (const result of results || []) {
    const recoverablePreSendFailure = result.status === 'failed_open'
      && /no_send_performed|smtp_send_failed:estream|alibaba_webmail_compose_unavailable/i.test(String(result.evidence || ''))
      && !/send_clicked|enter_send_attempted|submit_clicked/i.test(String(result.evidence || ''));
    if (!recoverablePreSendFailure && ['sent_confirmed', 'submitted_confirmed', 'send_unconfirmed', 'bounced', 'failed_open', 'website_contact_ready', 'website_contact_unreachable_skip'].includes(String(result.status || ''))) {
      routeLeadKeys(result).forEach(key => routeBlocked.add(key));
    }
    if (isHistoricalDevelopmentResult(result)) {
      for (const key of companyLeadKeys(result)) {
        priorDeveloped.add(key);
        const current = priorDevelopedDetails.get(key);
        if (!current || validDate(result.timestamp) >= validDate(current.timestamp)) {
          priorDevelopedDetails.set(key, result);
        }
      }
    }
    if (isSameDayDevelopmentResult(result, now)) {
      for (const key of companyLeadKeys(result)) {
        sameDayDeveloped.add(key);
        const current = sameDayDetails.get(key);
        if (!current || validDate(result.timestamp) >= validDate(current.timestamp)) {
          sameDayDetails.set(key, result);
        }
      }
    }
    if (!isTouchResult(result)) continue;
    const cooldownActive = daysSince(result.timestamp, now) < COOLDOWN_DAYS;
    const confirmedDm = result.status === 'sent_confirmed';
    const keys = [
      result.task_id,
      result.target_url,
      profileKey(result.target_url),
      hostKey(result.target_url),
    ].map(cleanKey).filter(Boolean);
    for (const key of companyLeadKeys(result)) {
      touched.add(key);
      const current = touchedDetails.get(key);
      if (!current || validDate(result.timestamp) >= validDate(current.timestamp)) {
        touchedDetails.set(key, result);
      }
      if (cooldownActive) {
        activeCooldown.add(key);
        const activeCurrent = activeCooldownDetails.get(key);
        if (!activeCurrent || validDate(result.timestamp) >= validDate(activeCurrent.timestamp)) {
          activeCooldownDetails.set(key, result);
        }
      }
      if (confirmedDm) sentConfirmed.add(key);
    }
    for (const key of keys) {
      touched.add(key);
      const current = touchedDetails.get(key);
      if (!current || validDate(result.timestamp) >= validDate(current.timestamp)) {
        touchedDetails.set(key, result);
      }
      if (cooldownActive) {
        activeCooldown.add(key);
        const activeCurrent = activeCooldownDetails.get(key);
        if (!activeCurrent || validDate(result.timestamp) >= validDate(activeCurrent.timestamp)) {
          activeCooldownDetails.set(key, result);
        }
      }
      if (confirmedDm) sentConfirmed.add(key);
    }
  }
  for (const item of contacts || []) {
    const status = String(item.status || '').toLowerCase();
    const hasTouch = item.sentTime || item.lastTouch || item.scheduledTime || /sent|replied|accepted|scheduled|合作|partner/.test(status);
    const isPartner = /partner|合作/.test(status) || isKnownPartnerCompany(item);
    if (isPartner) leadKeys(item).forEach(key => partners.add(key));
    if (hasTouch || isPartner) {
      leadKeys(item).forEach(key => {
        touched.add(key);
        activeCooldown.add(key);
      });
    }
  }
  return {
    touched,
    touchedDetails,
    activeCooldown,
    activeCooldownDetails,
    sentConfirmed,
    priorDeveloped,
    priorDevelopedDetails,
    sameDayDeveloped,
    sameDayDetails,
    routeBlocked,
    partners,
  };
}

function classifyTask(task, context) {
  const id = taskId(task);
  const target = targetUrl(task, context.profiles);
  const result = [id, target, profileKey(target)]
    .map(cleanKey)
    .filter(Boolean)
    .map(key => context.resultsByTask.get(key))
    .filter(Boolean)
    .sort((left, right) => validDate(right.timestamp) - validDate(left.timestamp))[0] || null;
  const score = Number(task.fitScore || 0);
  const url = target;
  const lastTouch = isTouchResult(result) ? result.timestamp : '';
  const cooldownActive = lastTouch && daysSince(lastTouch, context.now) < COOLDOWN_DAYS;
  const emailPriority = result && result.status === 'skipped' && /email_channel_found/i.test(String(result.evidence || ''));
  const noSafeMessageButton = result
    && result.status === 'failed_open'
    && noSafeMessageButtonEvidence(result.evidence);
  const sameDayByCompany = context.sameDayByCompany || new Map();
  const priorDevelopmentByCompany = context.priorDevelopmentByCompany || new Map();
  const priorDevelopment = companyLeadKeys(task)
    .map(key => priorDevelopmentByCompany.get(key))
    .filter(Boolean)
    .sort((left, right) => validDate(right.timestamp) - validDate(left.timestamp))[0] || null;
  const sameDayResult = companyLeadKeys(task)
    .map(key => sameDayByCompany.get(key))
    .filter(Boolean)
    .sort((left, right) => validDate(right.timestamp) - validDate(left.timestamp))[0] || null;
  const isFacebook = String(task.platform || '').toLowerCase() === 'facebook';
  const isEmail = String(task.platform || '').toLowerCase() === 'email';
  const verified = Boolean(url)
    && !(isFacebook && String(task.facebookStatus || '').includes('not_verified_do_not_use'))
    // Facebook is executable only when discovery explicitly classified the
    // destination as an official company page. Legacy/ambiguous profiles
    // stay in verification instead of leaking personal accounts into DM.
    && (!isFacebook || task.facebookStatus === 'verified_official_page_candidate');
  const agencyState = marketAgencyState(task);

  let action = 'review';
  let reason = 'needs_model_review';
  if (score <= ICP_THRESHOLD) {
    action = 'retain_low_icp';
    reason = `ICP ${score} <= ${ICP_THRESHOLD}`;
  } else if (agencyState === 'exclusive' && CONFIG.cadence.skipExclusiveAgencyMarkets !== false) {
    action = 'skip_exclusive_agency';
    reason = 'exclusive_agency_region';
  } else if (!verified) {
    action = 'verify_target';
    reason = 'missing_verified_profile_url';
  } else if (priorDevelopment) {
    action = 'cooldown';
    reason = 'previous_customer_development_no_repeat';
  } else if (sameDayResult && CONFIG.cadence.noDuplicateSameDayCustomer !== false) {
    action = 'cooldown';
    reason = 'same_day_customer_already_developed';
  } else if (result && result.status === 'sent_confirmed' && CONFIG.cadence.noDuplicateDm !== false) {
    action = 'cooldown';
    reason = 'previous_sent_confirmed_no_duplicate_dm';
  } else if (cooldownActive) {
    action = 'cooldown';
    reason = `${COOLDOWN_DAYS}_day_no_repeat_touch`;
  } else if (isEmail || emailPriority) {
    action = 'email_priority';
    reason = task.reason || 'email_channel_found';
  } else if (noSafeMessageButton) {
    action = 'blocked_no_message_button';
    reason = 'profile_valid_no_message_button';
  } else if (result && result.status === 'failed_open') {
    action = 'retry_or_alternate_channel';
    reason = result.evidence || 'previous_open_failed';
  } else {
    action = 'develop';
    reason = 'high_icp_verified_ready';
  }

  return {
    id,
    name: task.name,
    company: task.company,
    platform: String(task.platform || '').toLowerCase(),
    country: task.country,
    countryEn: task.countryEn || '',
    fitScore: score,
    fitTier: task.fitTier || '',
    marketScore: Number(task.marketScore || 0),
    marketStatus: task.marketStatus || '',
    agencyState,
    url,
    website: task.website || '',
    platformUrl: task.platformUrl || url,
    invalidChannels: task.invalidChannels || null,
    facebookStatus: task.facebookStatus || '',
    instagramStatus: task.instagramStatus || '',
    contactUrl: task.contactUrl || '',
    contactSearchUrl: task.contactSearchUrl || '',
    emailFrom: task.emailFrom || '',
    websiteContactSubject: task.websiteContactSubject || '',
    websiteContactMessage: task.websiteContactMessage || '',
    websiteContactFlow: task.websiteContactFlow || '',
    publicEmail: task.publicEmail || task.contactEmail || '',
    contactEmail: task.contactEmail || task.publicEmail || '',
    publicEmailStatus: task.publicEmailStatus || '',
    emailVerificationStatus: task.emailVerificationStatus || '',
    emailEvidence: task.emailEvidence || '',
    evidenceUrl: task.evidenceUrl || '',
    contactPhone: task.contactPhone || '',
    vendorPortal: task.vendorPortal || '',
    linkedinUrl: task.linkedinUrl || task.linkedin_url || '',
    headquarters: task.headquarters || '',
    founded: task.founded || '',
    companyScale: task.companyScale || task.scale || '',
    dataSources: task.dataSources || null,
    alternateChannels: task.alternateChannels || null,
    lastStatus: priorDevelopment && priorDevelopment.status || sameDayResult && sameDayResult.status || result && result.status || '',
    lastEvidence: priorDevelopment && priorDevelopment.evidence || sameDayResult && sameDayResult.evidence || result && result.evidence || '',
    lastTouch: priorDevelopment && priorDevelopment.timestamp || sameDayResult && sameDayResult.timestamp || lastTouch,
    action,
    reason,
    workingTime: workingTimeForTask(task, context.now),
    targetRegion: targetRegion(task),
    targetRegionScore: targetRegionScore(task),
    contactChannelScore: contactChannelScore(task),
    dealProbabilityScore: dealProbabilityScore({ ...task, fitScore: score }),
    priorityScore: dealProbabilityScore({ ...task, fitScore: score }) + (emailPriority ? 6 : 0),
  };
}

function buildBugChecks(plan, classified, results) {
  const findings = [];
  const ids = new Set();
  for (const task of plan.tasks || []) {
    const id = taskId(task);
    if (ids.has(id)) findings.push({ level: 'error', code: 'duplicate_task_id', detail: id });
    ids.add(id);
    if (Number(task.fitScore || 0) <= ICP_THRESHOLD && task.automationStatus === 'sent_confirmed') {
      findings.push({ level: 'warn', code: 'low_icp_marked_sent', detail: id });
    }
    if (task.platform === 'Facebook' && task.facebookStatus === 'not_verified_do_not_use') {
      findings.push({ level: 'error', code: 'unverified_facebook_leaked', detail: id });
    }
    if (marketAgencyState(task) === 'exclusive' && task.automationStatus === 'sent_confirmed') {
      findings.push({ level: 'warn', code: 'historical_exclusive_agency_touch', detail: id });
    }
  }

  const sentByTask = new Map();
  for (const result of results) {
    if (result.status !== 'sent_confirmed') continue;
    const list = sentByTask.get(result.task_id) || [];
    list.push(result);
    sentByTask.set(result.task_id, list);
  }
  for (const [id, list] of sentByTask) {
    const ordered = list.slice().sort((a, b) => validDate(a.timestamp) - validDate(b.timestamp));
    for (let i = 1; i < ordered.length; i += 1) {
      if (daysSince(ordered[i - 1].timestamp, validDate(ordered[i].timestamp)) < COOLDOWN_DAYS) {
        findings.push({ level: 'error', code: 'duplicate_touch_within_cooldown', detail: id });
      }
    }
  }

  const readyWithoutUrl = classified.filter(item => item.action === 'develop' && !item.url);
  for (const item of readyWithoutUrl) {
    findings.push({ level: 'error', code: 'ready_task_missing_url', detail: item.id });
  }

  return findings;
}

function buildModelOptimizations(classified, analytics) {
  const brokenChannels = classified
    .filter(item => /failed_open|unavailable|broken|not available|无法访问|损坏|移除/i.test(`${item.lastStatus} ${item.lastEvidence}`))
    .map(item => ({
      id: item.id,
      company: item.company,
      platform: item.platform,
      url: item.platformUrl || item.url || '',
      action: 'reroute_to_verified_alternate_channel',
    }));
  const highIntent = analytics.buildKeywordOpportunities(classified.map(item => ({
    keyword: 'outdoor retail partnership',
    country: item.country,
    fitScore: item.fitScore,
    sendStatus: item.lastStatus,
  }))).slice(0, 10);

  const byAction = classified.reduce((acc, item) => {
    acc[item.action] = (acc[item.action] || 0) + 1;
    return acc;
  }, {});

  return {
    objective: 'maximize qualified replies and contact capture without duplicate outreach',
    rules: [
      `Only ICP > ${ICP_THRESHOLD} can enter daily development.`,
      `${COOLDOWN_DAYS}-day cooldown blocks repeat DMs and repeat follow-ups.`,
      'Email-priority leads are routed to email/contact research instead of another social DM.',
      'Google-discovered customers can carry Instagram, Facebook, and official website contact channels; each channel is deduped separately unless the company is already a partner.',
      'Missing verified profile URLs become verification tasks, not outreach tasks.',
      'Exclusive-agency or reserved regions are skipped; open/no-exclusive markets receive a priority bonus.',
      'Highest deal probability comes first: ICP, market strength, open agency market, verified contact channel, and target-region priority are combined.',
      'Target-region priority favors Southeast Asia first, then Europe, then the Americas; other regions remain eligible but lower priority.',
    ],
    byAction,
    keywordOpportunities: highIntent,
    nextModelIteration: [
      'Auto-reroute broken social profile URLs to Facebook, official website contact, or Google buyer/contact research before the next send attempt.',
      'Expand every customer detail page into a sales research dossier: company facts, channel map, buyer persona, buying potential, risks, and next action.',
      'Boost leads with verified buyer/contact channel and real outdoor retail/distribution evidence.',
      'Downgrade generic community, government, HR, design-only, or no-contact profiles.',
      'Prefer decision-maker/channel terms: distributor, wholesale, retail buyer, importer, RV accessories, camping gear supplier.',
    ],
    systemIteration: {
      targetBenchmark: 'Build toward OKKI-level CRM coverage plus local AI automation: richer customer dossiers, safer execution, automatic bad-link routing, and measurable reply/contact-capture outcomes.',
      completedThisRun: [
        'Queue is regenerated from verified high-ICP sources.',
        'Bug checks run before execution artifacts are written.',
        'Model optimization recommendations are persisted with each daily run.',
      ],
      recommendedNextBuild: [
        'Add supplier/customer import templates and dedupe review UI.',
        'Add reply classification and next-step playbook per pipeline stage.',
        'Add contact-person enrichment fields for buyer, category manager, vendor portal, email, WhatsApp, and LinkedIn.',
      ],
      brokenChannels,
    },
  };
}

function writeRunArtifacts(run) {
  fs.mkdirSync(RUN_DIR, { recursive: true });
  const jsonPath = path.join(RUN_DIR, `${run.date}-daily-automation.json`);
  const csvPath = path.join(RUN_DIR, `${run.date}-daily-queue.csv`);
  writeFileWithRetry(jsonPath, JSON.stringify(run, null, 2));
  const columns = ['rank', 'id', 'name', 'company', 'platform', 'country', 'targetRegion', 'marketStatus', 'agencyState', 'fitScore', 'marketScore', 'dealProbabilityScore', 'priorityScore', 'contactChannelScore', 'targetRegionScore', 'action', 'dueNow', 'localTime', 'nextBest', 'reason', 'url', 'contactUrl', 'contactSearchUrl', 'emailFrom', 'publicEmail', 'websiteContactSubject', 'websiteContactMessage', 'contactPhone', 'vendorPortal', 'linkedinUrl', 'headquarters', 'founded', 'companyScale'];
  const rows = run.dailyQueue.map((item, index) => ({
    rank: index + 1,
    ...item,
    dueNow: Boolean(item.workingTime && item.workingTime.dueNow),
    localTime: item.workingTime && item.workingTime.localTime || '',
    nextBest: item.workingTime && item.workingTime.nextBest || '',
  }));
  writeFileWithRetry(csvPath, [columns.join(','), ...rows.map(row => columns.map(column => csvCell(row[column])).join(','))].join('\n'));
  writeFileWithRetry(path.join(ROOT, 'daily-automation-latest.json'), JSON.stringify(run, null, 2));
  writeFileWithRetry(path.join(ROOT, 'daily-automation-latest.js'), `window.DAILY_AUTOMATION_LATEST = ${JSON.stringify(run, null, 2)};\n`);
  writeSystemVisibilityArtifact(run);
  return { jsonPath, csvPath };
}

function copyPublicArtifact(file) {
  const from = path.join(ROOT, file);
  const to = path.join(ROOT, 'public', file);
  if (!fs.existsSync(from)) return false;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  copyFileWithRetry(from, to);
  return true;
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

function writeSystemVisibilityArtifact(run) {
  const dailyRows = Array.isArray(run.dailyQueue) ? run.dailyQueue : [];
  const visibleRows = Array.isArray(run.visibleTodayQueue) ? run.visibleTodayQueue : dailyRows;
  const cooldownRows = Array.isArray(run.cooldownQueue) ? run.cooldownQueue : [];
  const googleRows = visibleRows.filter(item => item.source === 'google_customer_discovery' || /^google-customer-/i.test(item.id || item.taskId || ''));
  const websiteContactRows = googleRows.filter(item => item.reason === 'official_website_contact_channel' || /website-contact/i.test(item.id || item.taskId || ''));
  const visibility = {
    updatedAt: new Date().toISOString(),
    source: 'daily-automation-runner',
    runDate: run.date,
    artifactGeneratedAt: run.generatedAt,
    counts: {
      visibleTodayQueue: visibleRows.length,
      dailyQueue: dailyRows.length,
      googleDiscovered: googleRows.length,
      websiteContact: websiteContactRows.length,
      cooldownQueue: cooldownRows.length,
      scheduledLater: Array.isArray(run.scheduledLater) ? run.scheduledLater.length : 0,
    },
    visibleSections: [
      'workspace',
      'taskDetailPanel',
      'todayQueue',
      'customers',
      'customerDetail',
      'seo',
      'automationAudit',
      'rightRail',
      'githubSyncStatus',
    ],
    contactEnrichment: {
      enabled: true,
      sources: ['dailyQueue', 'cooldownQueue', 'google-lead-discovery-latest'],
      fields: ['publicEmail', 'contactEmail', 'contactPhone', 'vendorPortal', 'contactUrl', 'contactSearchUrl', 'website'],
    },
    dailyQueueGoal: dailyQueueGoalVisibility(run.summary || {}),
  };
  writeFileWithRetry(path.join(ROOT, 'system-visibility-latest.json'), JSON.stringify(visibility, null, 2));
  writeFileWithRetry(path.join(ROOT, 'system-visibility-latest.js'), `window.SYSTEM_VISIBILITY_LATEST = ${JSON.stringify(visibility, null, 2)};\n`);
  [
    'daily-automation-latest.json',
    'daily-automation-latest.js',
    'google-lead-discovery-latest.json',
    'google-lead-discovery-latest.js',
    'daily-automation-execution-latest.json',
    'daily-automation-execution-latest.js',
    'system-visibility-latest.json',
    'system-visibility-latest.js',
  ].forEach(copyPublicArtifact);
}

function quotaPick(classified, cliLimit) {
  const limits = CONFIG.limits || DEFAULT_CONFIG.limits;
  const totalLimit = Number.isFinite(cliLimit) && cliLimit > 0
    ? Math.min(Number(cliLimit), DEFAULT_DAILY_LIMIT)
    : Math.max(DEFAULT_DAILY_LIMIT, Number(limits.total || 0));
  const buckets = [
    ['develop', Math.max(DEFAULT_DAILY_LIMIT, Number(limits.develop || 0))],
    ['email_priority', Number(limits.emailPriority || 0)],
    ['retry_or_alternate_channel', Number(limits.retryOrAlternate || 0)],
    ['verify_target', Number(limits.verifyTarget || 0)],
  ];
  const selected = [];
  const quota = {};
  const prioritized = classified.slice().sort(priorityCompare);
  for (const [action, target] of buckets) {
    const rows = prioritized.filter(item => item.action === action).slice(0, Math.max(0, target));
    selected.push(...rows);
    quota[action] = {
      target,
      planned: rows.length,
      gap: Math.max(0, target - rows.length),
    };
  }
  const deduped = [];
  const seen = new Set();
  for (const item of selected.sort(priorityCompare)) {
    if (seen.has(item.id) || deduped.length >= totalLimit) continue;
    seen.add(item.id);
    deduped.push(item);
  }
  return {
    queue: deduped,
    quota: {
      total: {
        target: totalLimit,
        planned: deduped.length,
        gap: Math.max(0, totalLimit - deduped.length),
      },
      ...quota,
    },
  };
}

function discoveryQueue(limit, context = {}) {
  const discovery = readJson('google-lead-discovery-latest.json', { leads: [] });
  const contactsRaw = readJson('contacts.json', []);
  const contacts = Array.isArray(contactsRaw) ? contactsRaw : (contactsRaw.contacts || []);
  const history = knownTouchIndex(context.results || [], contacts, context.now || Date.now());
  return (discovery.leads || [])
    .filter(item => Number(item.fitScore || 0) > ICP_THRESHOLD)
    .filter(item => !item.doNotOutreach && item.action !== 'partner_account' && item.sendStatus !== 'partner_account')
    .filter(item => !isKnownPartnerCompany(item))
    .filter(item => {
      const partnerKeys = leadKeys(item);
      const channelKeys = channelLeadKeys(item);
      return !partnerKeys.some(key => history.partners.has(key))
        && !companyLeadKeys(item).some(key => history.priorDeveloped.has(key))
        && !companyLeadKeys(item).some(key => history.sameDayDeveloped.has(key))
        && !companyLeadKeys(item).some(key => history.sentConfirmed.has(key))
        && !companyLeadKeys(item).some(key => history.activeCooldown.has(key))
        && !channelKeys.some(key => history.activeCooldown.has(key));
    })
    .map(item => ({
      ...item,
      targetRegion: targetRegion(item),
      targetRegionScore: targetRegionScore(item),
      contactChannelScore: contactChannelScore(item),
      dealProbabilityScore: dealProbabilityScore(item),
      priorityScore: dealProbabilityScore(item) - (String(item.platform || '').toLowerCase() === 'email' ? 2 : 0),
      action: item.action || 'develop',
      agencyState: item.agencyState || 'open',
      workingTime: workingTimeForTask(item, context.now || Date.now()),
    }))
    .sort(priorityCompare)
    .slice(0, limit);
}

function discoveryCooldownQueue(limit, context = {}) {
  const discovery = readJson('google-lead-discovery-latest.json', { leads: [] });
  const contactsRaw = readJson('contacts.json', []);
  const contacts = Array.isArray(contactsRaw) ? contactsRaw : (contactsRaw.contacts || []);
  const history = knownTouchIndex(context.results || [], contacts, context.now || Date.now());
  return (discovery.leads || [])
    .filter(item => Number(item.fitScore || 0) > ICP_THRESHOLD)
    .filter(item => !item.doNotOutreach && item.action !== 'partner_account' && item.sendStatus !== 'partner_account')
    .filter(item => !isKnownPartnerCompany(item))
    .filter(item => {
      const partnerKeys = leadKeys(item);
      if (partnerKeys.some(key => history.partners.has(key))) return false;
      return companyLeadKeys(item).some(key => history.sameDayDeveloped.has(key))
        || companyLeadKeys(item).some(key => history.priorDeveloped.has(key))
        || companyLeadKeys(item).some(key => history.sentConfirmed.has(key))
        || companyLeadKeys(item).some(key => history.activeCooldown.has(key))
        || channelLeadKeys(item).some(key => history.activeCooldown.has(key));
    })
    .map(item => {
      const sameDay = companyLeadKeys(item)
        .map(key => history.sameDayDetails.get(key))
        .filter(Boolean)
        .sort((left, right) => validDate(right.timestamp) - validDate(left.timestamp))[0] || null;
      const priorDevelopment = companyLeadKeys(item)
        .map(key => history.priorDevelopedDetails.get(key))
        .filter(Boolean)
        .sort((left, right) => validDate(right.timestamp) - validDate(left.timestamp))[0] || null;
      const touch = channelLeadKeys(item)
        .concat(companyLeadKeys(item))
        .map(key => history.activeCooldownDetails.get(key) || history.touchedDetails.get(key))
        .filter(Boolean)
        .sort((left, right) => validDate(right.timestamp) - validDate(left.timestamp))[0] || null;
      return {
        ...item,
        targetRegion: targetRegion(item),
        targetRegionScore: targetRegionScore(item),
        contactChannelScore: contactChannelScore(item),
        dealProbabilityScore: dealProbabilityScore(item),
        priorityScore: dealProbabilityScore(item),
        action: 'cooldown',
        reason: priorDevelopment
          ? 'previous_customer_development_no_repeat'
          : sameDay
          ? 'same_day_customer_already_developed'
          : touch && touch.status === 'website_contact_ready'
          ? 'website_contact_ready_no_repeat'
          : `${COOLDOWN_DAYS}_day_no_repeat_touch`,
        agencyState: item.agencyState || 'open',
        lastStatus: priorDevelopment && priorDevelopment.status || sameDay && sameDay.status || touch && touch.status || '',
        lastEvidence: priorDevelopment && priorDevelopment.evidence || sameDay && sameDay.evidence || touch && touch.evidence || '',
        lastTouch: priorDevelopment && priorDevelopment.timestamp || sameDay && sameDay.timestamp || touch && touch.timestamp || '',
        workingTime: workingTimeForTask(item, context.now || Date.now()),
      };
    })
    .sort(priorityCompare)
    .slice(0, limit);
}

function legacyCustomerFitScore(record) {
  const text = [record.company, record.role, record.category, record.keyword_used, record.source].join(' ').toLowerCase();
  let score = 55;
  if (/buyer|buying|category|merchandising|sourcing|procurement|commercial/.test(text)) score += 22;
  if (/director|head|vp|chief|founder|owner|manager|lead|ceo|president/.test(text)) score += 14;
  if (/outdoor|camp|rv|sport|retail|distributor|wholesale|dealer|gear|electronics|power|ka/.test(text)) score += 18;
  if (/linkedin|salesrobot|okki|outreach_data/i.test(String(record.source || ''))) score += 4;
  if (/accepted|replied/i.test(String(record.status || ''))) score += 8;
  if (/excluded|designer|student|foundation|government|school|nonprofit|501/i.test(text)) score -= 35;
  if (/failed|rejected|excluded/i.test(String(record.status || ''))) score -= 10;
  return Math.max(0, Math.min(100, score));
}

function legacyCustomerPlatform(record) {
  const source = String(record.source || '').toLowerCase();
  const url = String(record.linkedin_url || record.id || '');
  if (/linkedin|salesrobot/.test(source) || /linkedin\.com/i.test(url)) return 'linkedin';
  if (/okki|email/.test(source) || record.email) return 'email';
  return 'research';
}

function googleSearchUrl(company) {
  const query = `${company || ''} outdoor buyer partnership contact`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function linkedinSearchUrl(record) {
  const direct = record.linkedinUrl || record.linkedin_url || record.linkedinCompany || (/linkedin\.com/i.test(String(record.id || '')) ? record.id : '');
  if (/^https?:\/\//i.test(String(direct || ''))) return direct;
  const query = `${record.company || record.name || ''} buyer outdoor LinkedIn`;
  return `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(query)}`;
}

function potentialStatusFor(item, history) {
  const companyKeys = companyLeadKeys(item);
  const channelKeys = channelLeadKeys(item);
  const touch = [...companyKeys, ...channelKeys]
    .map(key => history.activeCooldownDetails.get(key) || history.touchedDetails.get(key))
    .filter(Boolean)
    .sort((left, right) => validDate(right.timestamp) - validDate(left.timestamp))[0] || null;
  if (companyKeys.some(key => history.partners.has(key))) return { action: 'blocked_partner', reason: 'known_partner_no_duplicate_outreach', touch };
  if (companyKeys.some(key => history.priorDeveloped.has(key))) {
    const prior = companyKeys
      .map(key => history.priorDevelopedDetails.get(key))
      .filter(Boolean)
      .sort((left, right) => validDate(right.timestamp) - validDate(left.timestamp))[0] || touch;
    return { action: 'cooldown', reason: 'previous_customer_development_no_repeat', touch: prior };
  }
  if (companyKeys.some(key => history.sameDayDeveloped.has(key))) return { action: 'cooldown', reason: 'same_day_customer_already_developed', touch };
  if (companyKeys.some(key => history.sentConfirmed.has(key)) || channelKeys.some(key => history.activeCooldown.has(key))) {
    return { action: 'cooldown', reason: touch && touch.status === 'website_contact_ready' ? 'website_contact_ready_no_repeat' : `${COOLDOWN_DAYS}_day_no_repeat_touch`, touch };
  }
  if (String(item.platform || '').toLowerCase() === 'email') return { action: 'email_priority', reason: item.reason || 'official_website_contact_channel', touch };
  if (String(item.platform || '').toLowerCase() === 'linkedin') {
    return { action: item.action || 'develop', reason: item.reason || 'official_linkedin_channel_ready', touch };
  }
  if (!targetUrl(item, {})) return { action: 'verify_target', reason: 'missing_verified_profile_url', touch };
  return { action: item.action || 'develop', reason: item.reason || 'high_icp_potential_ready', touch };
}

function isActivePotentialCandidate(item) {
  const action = String(item && item.action || '').toLowerCase();
  if (['cooldown', 'blocked_partner', 'blocked_no_message_button', 'retain_low_icp', 'skip_exclusive_agency'].includes(action)) return false;
  if (item && (item.lastTouch || item.lastStatus || item.lastEvidence)) return false;
  if (item && item.previouslyContacted) return false;
  return ['develop', 'retry_or_alternate_channel', 'verify_target', 'email_priority'].includes(action);
}

function legacyStatusIndicatesTouch(value) {
  const status = String(value || '').trim().toLowerCase();
  if (!status || status === 'pending' || status === 'new' || status === 'not contacted') return false;
  const sequence = status.match(/^(\d+)\s+out\s+of\s+\d+$/i);
  if (sequence) return Number(sequence[1]) > 0;
  return /sent|accepted|replied|responded|contacted|follow.?up|opened|clicked|meeting|qualified|converted|已发送|已回复|已联系|已接受/.test(status);
}

function normalizePotentialItem(item, sourceType, history, index = 0) {
  const normalizedSource = item.source || sourceType;
  const normalizedSourceType = item.sourceType
    || (normalizedSource === 'google_customer_discovery' || /^google-customer-/i.test(item.id || '') ? 'google' : sourceType);
  // Discovery rows frequently carry an official social URL and an independently
  // verified first-party business email on the same record. Email is the
  // preferred execution route; retaining the social platform here previously
  // hid the verified recipient from the Alibaba queue. Preserve the social URL
  // as alternate evidence, but promote the executable route to email.
  const preferredPlatform = verifiedBusinessEmailTarget(item).ok
    ? 'email'
    : String(item.platform || legacyCustomerPlatform(item) || 'research').toLowerCase();
  const base = {
    ...item,
    id: item.id || `potential-${sourceType}-${slugKey(item.company || item.name || index)}`,
    name: item.name || item.company || '',
    company: item.company || item.name || '',
    country: item.countryEn || item.country || item.headquarters || '',
    countryEn: item.countryEn || item.country || item.headquarters || '',
    platform: preferredPlatform,
    fitScore: Number(item.fitScore || legacyCustomerFitScore(item)),
    fitTier: item.fitTier || (Number(item.fitScore || legacyCustomerFitScore(item)) >= 90 ? 'A' : 'B'),
    source: normalizedSource,
    sourceType: normalizedSourceType,
    website: item.website || item.url || '',
    url: item.url || item.targetUrl || item.linkedin_url || item.linkedinUrl || (/^https?:\/\//i.test(String(item.id || '')) ? item.id : '') || item.website || '',
    platformUrl: item.platformUrl || item.url || item.linkedin_url || item.linkedinUrl || (/^https?:\/\//i.test(String(item.id || '')) ? item.id : '') || item.website || '',
    linkedinUrl: item.linkedinUrl || item.linkedin_url || item.linkedinCompany || '',
    linkedinSearchUrl: linkedinSearchUrl(item),
    googleSearchUrl: item.contactSearchUrl || googleSearchUrl(item.company || item.name),
    contactSearchUrl: item.contactSearchUrl || googleSearchUrl(item.company || item.name),
    dataSources: item.dataSources || [sourceType],
    background: item.background || item.message || item.contactNote || '',
    buyerPersona: item.buyerPersona || item.role || item.decisionMaker || '',
    marketStatus: item.marketStatus || item.agencyState || '',
  };
  const status = potentialStatusFor(base, history);
  const legacyTouched = legacyStatusIndicatesTouch(base.lastStatus || base.status);
  const normalized = {
    ...base,
    taskId: base.id,
    action: status.action,
    reason: status.reason,
    lastStatus: status.touch && status.touch.status || (legacyTouched ? (base.lastStatus || base.status) : ''),
    lastEvidence: status.touch && status.touch.evidence || base.lastEvidence || '',
    lastTouch: status.touch && status.touch.timestamp || (legacyTouched ? base.lastTouch : '') || '',
    previouslyContacted: Boolean(base.previouslyContacted || legacyTouched),
    targetRegion: targetRegion(base),
    targetRegionScore: targetRegionScore(base),
    contactChannelScore: contactChannelScore(base),
    dealProbabilityScore: dealProbabilityScore(base),
    priorityScore: dealProbabilityScore(base) + contactChannelScore(base),
    potentialSource: sourceType,
    nextAction: status.action === 'cooldown'
      ? 'no_repeat_review'
      : status.action === 'verify_target'
        ? 'background_check_then_verify_channel'
        : status.action === 'email_priority'
          ? 'official_website_or_email_contact'
          : 'develop_after_identity_check',
  };
  normalized.executionReadiness = channelExecutionReadiness(normalized);
  if (normalized.executionReadiness.ready === true && normalized.action === 'verify_target') {
    if (normalized.executionReadiness.gate === 'official_business_email') {
      normalized.action = 'email_priority';
      normalized.reason = 'official_public_business_email_verified';
      normalized.nextAction = 'official_business_email_contact';
    } else if (normalized.executionReadiness.gate === 'official_supplier_route') {
      normalized.action = 'develop';
      normalized.reason = 'official_website_contact_channel';
      normalized.nextAction = 'official_supplier_route_contact';
    }
  }
  return normalized;
}

function channelExecutionReadiness(item = {}) {
  const platform = String(item.platform || item.channel || '').toLowerCase();
  const target = item.url || item.contactUrl || item.platformUrl || item.website || '';
  const officialStatus = String(item.externalVerificationStatus || '').toLowerCase();
  const liveFirstPartyEvidence = item.firstPartyChannelVerification && item.firstPartyChannelVerification.evidenceUrl || '';
  const verifiedEmail = /^official_supplier_email_verified$/.test(officialStatus)
    || /^official_public_business_email$/i.test(String(item.emailVerificationStatus || ''));
  if (platform === 'email' || item.publicEmail || item.contactEmail) {
    const executableEmail = verifiedBusinessEmailTarget(item);
    return verifiedEmail && executableEmail.ok
      ? { ready: true, gate: 'official_business_email', evidenceUrl: liveFirstPartyEvidence || item.sourceEvidenceUrl || item.evidenceUrl || '' }
      : { ready: false, gate: 'enrichment_required', reason: executableEmail.reason || 'public_business_email_requires_verification' };
  }
  const social = ['facebook', 'instagram', 'linkedin'].includes(platform);
  if (social) {
    return item.officialSocialProfileVerified === true && /^https:\/\//i.test(String(target))
      ? { ready: true, gate: 'first_party_verified_social', evidenceUrl: item.socialProfileEvidenceUrl || liveFirstPartyEvidence || item.sourceEvidenceUrl || item.website || '' }
      : { ready: false, gate: 'enrichment_required', reason: 'social_profile_not_first_party_verified' };
  }
  const verifiedWebsiteRoute = /^official_(?:supplier_(?:form|route)|contact_form)_verified$/.test(officialStatus)
    || item.contactCapabilityVerified === true;
  if (platform === 'website_form' || /website|contact|supplier|vendor/i.test([item.channelType, item.reason, item.action].join(' '))) {
    return verifiedWebsiteRoute && /^https:\/\//i.test(String(target))
      ? { ready: true, gate: 'official_supplier_route', evidenceUrl: liveFirstPartyEvidence || item.sourceEvidenceUrl || item.contactUrl || item.evidenceUrl || '' }
      : { ready: false, gate: 'enrichment_required', reason: 'website_contact_capability_not_verified' };
  }
  return { ready: false, gate: 'enrichment_required', reason: 'verified_executable_channel_missing' };
}

function buildDailyPotentialPool(classified, discoveryRun, context, targetSize) {
  const history = knownTouchIndex(context.results || [], [], context.now || Date.now());
  const embedded = readEmbeddedCustomerRecords()
    .filter(item => !item.excluded)
    .filter(campaignScopeMatches)
    .map((item, index) => normalizePotentialItem(item, 'customer_table', history, index))
    .filter(item => item.fitScore > ICP_THRESHOLD)
    .filter(item => !/excluded|designer|student|foundation|government|school|nonprofit|501/i.test([item.category, item.role, item.company].join(' ')));
  const currentPlan = classified
    .filter(item => item.fitScore > ICP_THRESHOLD)
    .filter(campaignScopeMatches)
    .map((item, index) => normalizePotentialItem(item, 'daily_plan', history, index));
  const discovered = (discoveryRun.leads || [])
    .filter(item => Number(item.fitScore || 0) > ICP_THRESHOLD)
    .filter(item => !item.doNotOutreach && item.action !== 'partner_account' && item.sendStatus !== 'partner_account')
    .filter(item => !isKnownPartnerCompany(item))
    .filter(campaignScopeMatches)
    .map((item, index) => normalizePotentialItem(item, 'google_linkedin_social_refill', history, index));
  const seen = new Set();
  const deduped = [...currentPlan, ...embedded, ...discovered]
    .filter(isActivePotentialCandidate)
    // Keep discovery capacity aligned with the executor. A terminal result
    // retires only its exact email recipient / official website / social
    // profile route; another independently verified channel remains eligible.
    .filter(item => !routeLeadKeys(item).some(key => history.routeBlocked.has(key)))
    // When the same official host is present in a stale plan/table row and a
    // freshly enriched discovery row, preserve the live first-party verified
    // route. Otherwise the earlier unverified row masks a usable email/form.
    .sort((left, right) => {
      const readinessDelta = Number(channelExecutionReadiness(right).ready === true)
        - Number(channelExecutionReadiness(left).ready === true);
      return readinessDelta || priorityCompare(left, right);
    })
    .filter(item => {
      const key = queueDedupeKey(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  // Preserve a verified social reserve before the channel-priority sort fills
  // the whole pool with website/email rows. This changes only cross-company
  // coverage: the execution layer still picks one highest-priority channel per
  // company and keeps all identity, duplicate and confirmation gates.
  // Capacity is a company contract, not a channel-row contract. Previously a
  // company with email + Facebook + Instagram consumed three of the 100 pool
  // slots, silently truncating later evidence-ready companies. Collapse to
  // one best executable row per company before applying the company limit;
  // normalizePotentialItem already carries verified alternateChannels for
  // same-task fallback.
  const companyRows = new Map();
  for (const item of deduped) {
    const companyKey = slugKey(item.company || item.name || item.id);
    if (!companyKey) continue;
    const current = companyRows.get(companyKey);
    if (!current) {
      companyRows.set(companyKey, item);
      continue;
    }
    const itemReady = Number((item.executionReadiness || channelExecutionReadiness(item)).ready === true);
    const currentReady = Number((current.executionReadiness || channelExecutionReadiness(current)).ready === true);
    if (itemReady > currentReady || (itemReady === currentReady && priorityCompare(item, current) < 0)) {
      companyRows.set(companyKey, item);
    }
  }
  const distinctCompanies = [...companyRows.values()].sort(priorityCompare);
  const verifiedSocial = distinctCompanies.filter(item => ['facebook', 'instagram', 'linkedin'].includes(String(item.platform || '').toLowerCase())
    && item.officialSocialProfileVerified === true);
  const socialReserveTarget = Math.min(25, Math.max(1, Math.ceil(targetSize * 0.2)));
  const reservedSocial = verifiedSocial.slice(0, socialReserveTarget);
  const reservedIds = new Set(reservedSocial.map(item => item.id));
  return [...reservedSocial, ...distinctCompanies.filter(item => !reservedIds.has(item.id))].slice(0, targetSize);
}

function channelReadinessSummary(items = [], history = null) {
  const companies = new Map();
  for (const item of Array.isArray(items) ? items : []) {
    const companyKey = slugKey(item.company || item.name || item.id);
    if (!companyKey) continue;
    const row = companies.get(companyKey) || {
      company: item.company || item.name || companyKey,
      channels: new Set(),
      ready: false,
    };
    const platform = String(item.platform || item.channel || '').toLowerCase();
    const readiness = item.executionReadiness || channelExecutionReadiness(item);
    const historyKeys = companyLeadKeys(item);
    const historySetHasCompany = set => historyKeys.some(key => set && set.has(key));
    const historicallyBlocked = Boolean(history && (
      historySetHasCompany(history.sameDayDeveloped)
      || historySetHasCompany(history.priorDeveloped)
      || historySetHasCompany(history.activeCooldown)
      || routeLeadKeys(item).some(key => history.routeBlocked && history.routeBlocked.has(key))
    ));
    if (readiness.ready === true && !historicallyBlocked) {
      row.ready = true;
      row.channels.add(platform || 'website');
    }
    companies.set(companyKey, row);
  }
  const rows = [...companies.values()];
  const ready = rows.filter(item => item.ready);
  return {
    totalCompanies: rows.length,
    executableCompanies: ready.length,
    reserveNeededFor100: Math.max(0, 130 - ready.length),
    byChannel: ready.reduce((counts, item) => {
      item.channels.forEach(channel => { counts[channel] = (counts[channel] || 0) + 1; });
      return counts;
    }, {}),
    verifiedSocialCompanies: ready.filter(item => [...item.channels].some(channel => ['facebook', 'instagram', 'linkedin'].includes(channel))).length,
    enrichmentRequiredCompanies: rows.length - ready.length,
  };
}

function bestVisibleChannel(items = []) {
  const rank = { email: 0, linkedin: 1, facebook: 2, instagram: 3 };
  return items.slice().sort((left, right) => {
    const leftRank = rank[String(left.platform || '').toLowerCase()] ?? 9;
    const rightRank = rank[String(right.platform || '').toLowerCase()] ?? 9;
    return leftRank - rightRank || priorityCompare(left, right);
  })[0] || items[0];
}

function buildVisibleTodayQueue(discoveryRun, context, targetSize = 3) {
  const history = knownTouchIndex(context.results || [], [], context.now || Date.now());
  const byCompany = new Map();
  (discoveryRun.leads || [])
    .filter(item => Number(item.fitScore || 0) > ICP_THRESHOLD)
    .filter(item => !item.doNotOutreach && item.action !== 'partner_account' && item.sendStatus !== 'partner_account')
    .filter(item => !isKnownPartnerCompany(item))
    .filter(campaignScopeMatches)
    .forEach((item) => {
      const key = slugKey(item.company || item.name || item.id);
      if (!key) return;
      if (!byCompany.has(key)) byCompany.set(key, []);
      byCompany.get(key).push(item);
    });

  return Array.from(byCompany.values())
    .map(items => {
      const item = bestVisibleChannel(items);
      const companyKeys = companyLeadKeys(item);
      const channelKeys = channelLeadKeys(item);
      const keys = [...companyKeys, ...channelKeys];
      const touch = keys
        .map(key => history.activeCooldownDetails.get(key) || history.touchedDetails.get(key))
        .filter(Boolean)
        .sort((left, right) => validDate(right.timestamp) - validDate(left.timestamp))[0] || null;
      const sentConfirmed = keys.some(key => history.sentConfirmed.has(key));
      const activeCooldown = keys.some(key => history.activeCooldown.has(key));
      const sameDay = keys.some(key => history.sameDayDeveloped.has(key));
      const priorDeveloped = companyKeys.some(key => history.priorDeveloped.has(key));
      if (priorDeveloped) return null;
      const untouched = !sentConfirmed && !activeCooldown && !sameDay;
      if (!untouched) return null;
      return {
        ...item,
        id: item.id || `visible-${slugKey(item.company || item.name)}`,
        taskId: item.id || `visible-${slugKey(item.company || item.name)}`,
        targetRegion: targetRegion(item),
        targetRegionScore: targetRegionScore(item),
        contactChannelScore: contactChannelScore(item),
        dealProbabilityScore: dealProbabilityScore(item),
        priorityScore: dealProbabilityScore(item),
        action: item.action || 'develop',
        reason: item.reason || 'high_icp_visible_today',
        agencyState: item.agencyState || 'open',
        lastStatus: touch && touch.status || '',
        lastEvidence: touch && touch.evidence || '',
        lastTouch: touch && touch.timestamp || '',
        visibleOnly: false,
        workingTime: workingTimeForTask(item, context.now || Date.now()),
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const regionRank = { europe: 0, oceania: 1, americas: 2 };
      const leftRegion = regionRank[targetRegion(left)] ?? 9;
      const rightRegion = regionRank[targetRegion(right)] ?? 9;
      return leftRegion - rightRegion
        || Number(right.fitScore || 0) - Number(left.fitScore || 0)
        || priorityCompare(left, right);
    })
    .slice(0, targetSize);
}

function main() {
  const args = new Set(process.argv.slice(2));
  const now = Date.now();
  const dateArg = process.argv.find(arg => /^--date=/.test(arg));
  const date = dateArg ? dateArg.split('=')[1] : automationRunDate(now);
  const limitArg = process.argv.find(arg => /^--limit=/.test(arg));
  const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined;

  global.window = global;
  const plan = readJsonScript('daily-outreach-tasks.js', 'DAILY_OUTREACH_TASKS');
  const results = readJsonScript('autonomous-outreach-results.js', 'AUTONOMOUS_OUTREACH_RESULTS');
  require('./verified-profile-registry.js');
  const profiles = global.VERIFIED_PROFILE_REGISTRY || {};
  const analytics = require('./outreach-analytics.js');

  const context = {
    now,
    profiles,
    resultsByTask: normalizeResultIndex(results),
    results,
  };
  const history = knownTouchIndex(results, [], now);
  context.sameDayByCompany = history.sameDayDetails;
  context.priorDevelopmentByCompany = history.priorDevelopedDetails;
  const classified = (plan.tasks || [])
    .map(task => classifyTask(task, context))
    .sort(priorityCompare);

  const actionable = classified.filter(item => ['develop', 'retry_or_alternate_channel', 'verify_target', 'email_priority'].includes(item.action));
  const dueClassified = CONFIG.cadence.respectTargetWorkingHours === false
    ? actionable
    : actionable.filter(item => item.workingTime && item.workingTime.dueNow);
  const picked = quotaPick(dueClassified, limit);
  const discoveryRun = readJson('google-lead-discovery-latest.json', { leads: [] });
  const potentialPoolTarget = Math.max(DEFAULT_POTENTIAL_POOL_TARGET, Number(CONFIG.limits.total || 0));
  const dailyPotentialPool = buildDailyPotentialPool(classified, discoveryRun, context, potentialPoolTarget);
  const visibleTodayQueue = buildVisibleTodayQueue(discoveryRun, context, DEFAULT_DAILY_LIMIT);
  const newDiscovery = discoveryQueue(DEFAULT_DAILY_LIMIT, context);
  const touchedDiscovery = discoveryCooldownQueue(20, context);
  const remainingLimit = Math.max(0, picked.quota.total.target - newDiscovery.length);
  const primaryQueue = promoteExecutionReadyQueueRows(
    [...newDiscovery, ...picked.queue.slice(0, remainingLimit)],
    dailyPotentialPool,
  );
  const primaryCompanies = new Set(primaryQueue.map(item => slugKey(item.company || item.name)).filter(Boolean));
  const refillQueue = dailyPotentialPool
    .filter(item => !primaryCompanies.has(slugKey(item.company || item.name)))
    .filter(item => ['develop', 'retry_or_alternate_channel', 'verify_target', 'email_priority'].includes(item.action))
    .slice(0, Math.max(0, picked.quota.total.target - primaryQueue.length));
  const dailyQueue = preferSocialChannels(dedupeQueueItems([...primaryQueue, ...refillQueue])).sort(priorityCompare).slice(0, picked.quota.total.target);
  const cooldownQueue = [...classified
    .filter(item => item.action === 'cooldown')
    .sort(priorityCompare), ...touchedDiscovery]
    .filter((item, index, list) => list.findIndex(other => other.id === item.id) === index)
    .slice(0, 30);
  const scheduledLater = actionable
    .filter(item => !dailyQueue.some(queued => queued.id === item.id))
    .filter(item => CONFIG.cadence.respectTargetWorkingHours !== false && !(item.workingTime && item.workingTime.dueNow))
    .sort(priorityCompare)
    .slice(0, 20);
  // Dashboard capacity must describe companies the executor can still touch,
  // not channel rows already locked by a confirmed, uncertain, or technical
  // interaction. This keeps reserve truth aligned with browser selection.
  const readiness = channelReadinessSummary(dailyPotentialPool, history);
  const enrichmentBacklog = dailyPotentialPool
    .filter(item => !(item.executionReadiness || channelExecutionReadiness(item)).ready)
    .map(item => ({
      id: item.id,
      company: item.company,
      platform: item.platform,
      reason: (item.executionReadiness || channelExecutionReadiness(item)).reason,
      officialWebsite: item.website || '',
      evidenceUrl: item.sourceEvidenceUrl || item.evidenceUrl || '',
      requiredEvidence: 'first_party_official_channel_and_executable_control',
    }));
  const run = {
    generatedAt: new Date(now).toISOString(),
    date,
    mode: 'daily-icp-first-automation-loop',
    executionLayer: 'Dedicated Chrome automation profile only; primary Chrome attachment forbidden',
    limits: {
      dailyLimit: picked.quota.total.target,
      quota: picked.quota,
      icpThreshold: ICP_THRESHOLD,
      cooldownDays: COOLDOWN_DAYS,
      singleBrowserPage: Boolean(CONFIG.cadence.singleBrowserPage),
      parallelTasks: Boolean(CONFIG.cadence.parallelTasks),
      parallelLimit: Number(CONFIG.cadence.parallelLimit || 1),
      noDuplicateDm: Boolean(CONFIG.cadence.noDuplicateDm),
      preferOpenAgencyMarkets: Boolean(CONFIG.cadence.preferOpenAgencyMarkets),
      skipExclusiveAgencyMarkets: Boolean(CONFIG.cadence.skipExclusiveAgencyMarkets),
      targetRegionPriority: ['southeast_asia', 'europe', 'americas'],
      deploy: CONFIG.cadence.manualDeployOnly === false ? 'allowed_by_config' : 'manual_only',
    },
    summary: {
      totalLeads: classified.length,
      highIcp: classified.filter(item => item.fitScore > ICP_THRESHOLD).length,
      readyToDevelop: dailyQueue.filter(item => ['develop', 'discover_and_develop'].includes(item.action)).length,
      dueNow: dailyQueue.length,
      visibleTodayQueue: visibleTodayQueue.length,
      potentialPool: dailyPotentialPool.length,
      potentialPoolTarget,
      customerTableHighIcp: dailyPotentialPool.filter(item => item.potentialSource === 'customer_table').length,
      refillNeeded: Math.max(0, potentialPoolTarget - dailyPotentialPool.length),
      executableCompanies: readiness.executableCompanies,
      executableReserveTarget: 130,
      executableReserveNeeded: readiness.reserveNeededFor100,
      executableByChannel: readiness.byChannel,
      verifiedSocialCompanies: readiness.verifiedSocialCompanies,
      verifiedSocialReserveTarget: 20,
      verifiedSocialReserveNeeded: Math.max(0, 20 - readiness.verifiedSocialCompanies),
      enrichmentBacklogCount: enrichmentBacklog.length,
      googleDiscovered: dailyQueue.filter(item => item.sourceType === 'google' || item.source === 'google_customer_discovery' || /^google-customer-/i.test(item.id || '')).length,
      facebookDiscovered: dailyQueue.filter(item => item.platform === 'facebook' && (item.sourceType === 'google' || item.source === 'google_customer_discovery' || /^google-customer-/i.test(item.id || ''))).length,
      websiteContactDiscovered: dailyQueue.filter(item => item.platform === 'email' && (item.sourceType === 'google' || item.source === 'google_customer_discovery' || /^google-customer-/i.test(item.id || ''))).length,
      scheduledLater: scheduledLater.length,
      cooldown: cooldownQueue.length,
      emailPriority: classified.filter(item => item.action === 'email_priority').length,
      openAgencyMarket: classified.filter(item => item.agencyState === 'open').length,
      exclusiveAgencySkipped: classified.filter(item => item.action === 'skip_exclusive_agency').length,
      needsVerification: classified.filter(item => item.action === 'verify_target').length,
      retainedLowIcp: classified.filter(item => item.action === 'retain_low_icp').length,
    },
    discoveryRefill: {
      discoveryRefillAttempted: Boolean(discoveryRun.discoveryRefillAttempted),
      qualifiedThreshold: Number(discoveryRun.qualifiedThreshold || ICP_THRESHOLD),
      refillCandidateCount: Number(discoveryRun.refillCandidateCount || 0),
      refillByCustomerType: discoveryRun.refillByCustomerType || { agency: 0, key_account: 0 },
      qualifiedQueueCount: newDiscovery.filter(item => Number(item.fitScore || 0) > ICP_THRESHOLD).length,
    },
    visibleTodayQueue,
    dailyPotentialPool,
    dailyQueue,
    enrichmentBacklog,
    cooldownQueue,
    scheduledLater,
    bugChecks: buildBugChecks(plan, classified, results),
    modelOptimization: buildModelOptimizations(classified, analytics),
  };

  const paths = writeRunArtifacts(run);
  if (args.has('--fix')) {
    fs.writeFileSync(path.join(ROOT, 'daily-automation-state.json'), JSON.stringify({
      updatedAt: run.generatedAt,
      lastRun: path.relative(ROOT, paths.jsonPath).replace(/\\/g, '/'),
      nextRecommendedCommand: 'npm run daily',
      bugStatus: run.bugChecks.some(item => item.level === 'error') ? 'needs_attention' : 'ok',
    }, null, 2));
  }

  console.log(JSON.stringify({
    date: run.date,
    summary: run.summary,
    bugErrors: run.bugChecks.filter(item => item.level === 'error').length,
    queueFile: paths.jsonPath,
    csvFile: paths.csvPath,
  }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  classifyTask,
  buildBugChecks,
  buildModelOptimizations,
  automationRunDate,
  channelPriorityScore,
  companyLeadKeys,
  routeLeadKeys,
  isActivePotentialCandidate,
  isKnownPartnerCompany,
  isHistoricalDevelopmentResult,
  legacyStatusIndicatesTouch,
  knownTouchIndex,
  potentialStatusFor,
  writeFileWithRetry,
  preferSocialChannels,
  channelExecutionReadiness,
  normalizePotentialItem,
  buildDailyPotentialPool,
  dedupeQueueItems,
  promoteExecutionReadyQueueRows,
  preferredCountryScore,
};
