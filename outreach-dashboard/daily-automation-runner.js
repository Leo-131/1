const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const RUN_DIR = path.join(ROOT, 'daily-runs');
const CONFIG_PATH = path.join(ROOT, 'daily-automation-config.json');
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
const DEFAULT_DAILY_LIMIT = 12;
const TOUCH_STATUSES = new Set([
  'sent_confirmed',
  'post_liked',
  'account_followed',
  'send_unconfirmed',
]);
const SAME_DAY_DEVELOPMENT_STATUSES = new Set([
  'sent_confirmed',
  'send_unconfirmed',
  'account_followed',
  'post_liked',
]);
const WEBSITE_CONTACT_VERIFIED_EVIDENCE = 'contact_entry_verified';
const PARTNER_COMPANIES = new Set([
  'rei',
  'rei co-op',
  'rei coop',
  'academy',
  'acadamy',
  'academy sports outdoors',
  'acadamy sports outdoors',
  'scheels',
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

function csvCell(value) {
  return `"${String(value == null ? '' : value).replace(/"/g, '""')}"`;
}

function taskId(task) {
  return `verified-${task.platform || 'social'}-${task.accountHandle || task.name}`;
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
    weight: 32,
    countries: ['austria', 'belgium', 'czech republic', 'denmark', 'finland', 'france', 'germany', 'ireland', 'italy', 'netherlands', 'norway', 'poland', 'portugal', 'spain', 'sweden', 'switzerland', 'united kingdom', 'uk'],
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
  if (task.alternateChannels && (task.alternateChannels.instagram || task.alternateChannels.facebook)) score += 4;
  return score;
}

function dealProbabilityScore(task) {
  return Number(task.fitScore || 0)
    + Math.round(Number(task.marketScore || 0) * 12)
    + marketAgencyScore(task)
    + targetRegionScore(task)
    + contactChannelScore(task);
}

function channelPriorityScore(task) {
  const platform = String(task.platform || task.channel || '').trim().toLowerCase();
  const identity = `${task.id || ''} ${task.reason || ''} ${task.url || ''}`.toLowerCase();
  if (platform === 'instagram' || /instagram/.test(identity)) return 300;
  if (platform === 'facebook' || /facebook/.test(identity)) return 290;
  if (platform === 'email' || /website-contact|official_website_contact_channel/.test(identity)) return 0;
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
  const channelUrl = item.contactUrl || item.platformUrl || item.url || item.website || item.id;
  const handle = profileHandle(channelUrl);
  const host = hostnameKey(channelUrl);
  if (handle) return `${platform}:profile:${cleanKey(handle)}`;
  if (host) return `${platform}:host:${cleanKey(host)}`;
  return `${platform}:${cleanKey(channelUrl || item.company || item.name)}`;
}

function dedupeQueueItems(items) {
  const sorted = items.slice().sort(priorityCompare);
  const seen = new Set();
  return sorted.filter((item) => {
    const key = queueDedupeKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function preferSocialChannels(items) {
  const socialCompanyKeys = new Set();
  for (const item of items || []) {
    const platform = String(item.platform || '').toLowerCase();
    if (platform !== 'instagram' && platform !== 'facebook') continue;
    companyLeadKeys(item).forEach(key => socialCompanyKeys.add(key));
  }
  return (items || []).filter(item => {
    const platform = String(item.platform || '').toLowerCase();
    const isWebsiteContact = platform === 'email' || /website-contact|official_website_contact_channel/i.test(`${item.id || ''} ${item.reason || ''}`);
    if (!isWebsiteContact) return true;
    return !companyLeadKeys(item).some(key => socialCompanyKeys.has(key));
  });
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
  return String(value || '').trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9]+/g, '');
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
    .replace(/-(instagram|facebook|website-contact)$/i, ''));
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

function profileHandle(value) {
  const match = String(value || '').match(/(?:instagram|facebook)\.com\/([^/?#]+)/i);
  return match ? match[1] : '';
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
  return Boolean(result && TOUCH_STATUSES.has(result.status) && isVerifiedWebsiteContactResult(result));
}

function isSameDayDevelopmentResult(result = {}, now = Date.now()) {
  return Boolean(result
    && SAME_DAY_DEVELOPMENT_STATUSES.has(result.status)
    && sameAutomationDay(result.timestamp, now)
    && isVerifiedWebsiteContactResult(result));
}

function channelLeadKeys(item) {
  const platform = cleanKey(item.platform || 'unknown');
  const handle = profileHandle(item.platformUrl || item.url);
  const isWebsiteContact = platform === 'email' || /website-contact/i.test(String(item.id || item.url || item.contactUrl || ''));
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
  return [
    item.id,
    item.task_id,
    leadFamilyKey(item.id || item.task_id),
    item.name,
    item.company,
    hostnameKey(item.website || item.url || item.target_url),
  ].map(cleanKey).filter(Boolean);
}

function knownTouchIndex(results, contacts, now = Date.now()) {
  const touched = new Set();
  const touchedDetails = new Map();
  const activeCooldown = new Set();
  const activeCooldownDetails = new Map();
  const sentConfirmed = new Set();
  const sameDayDeveloped = new Set();
  const sameDayDetails = new Map();
  const partners = new Set([...PARTNER_COMPANIES].flatMap(partnerCompanyKeys));
  for (const result of results || []) {
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
    sameDayDeveloped,
    sameDayDetails,
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
  const sameDayByCompany = context.sameDayByCompany || new Map();
  const sameDayResult = companyLeadKeys(task)
    .map(key => sameDayByCompany.get(key))
    .filter(Boolean)
    .sort((left, right) => validDate(right.timestamp) - validDate(left.timestamp))[0] || null;
  const isFacebook = String(task.platform || '').toLowerCase() === 'facebook';
  const isEmail = String(task.platform || '').toLowerCase() === 'email';
  const verified = Boolean(url) && !(isFacebook && String(task.facebookStatus || '').includes('not_verified_do_not_use'));
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
    publicEmailStatus: task.publicEmailStatus || '',
    contactPhone: task.contactPhone || '',
    vendorPortal: task.vendorPortal || '',
    linkedinUrl: task.linkedinUrl || task.linkedin_url || '',
    headquarters: task.headquarters || '',
    founded: task.founded || '',
    companyScale: task.companyScale || task.scale || '',
    dataSources: task.dataSources || null,
    alternateChannels: task.alternateChannels || null,
    lastStatus: sameDayResult && sameDayResult.status || result && result.status || '',
    lastEvidence: sameDayResult && sameDayResult.evidence || result && result.evidence || '',
    lastTouch: sameDayResult && sameDayResult.timestamp || lastTouch,
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
  fs.writeFileSync(jsonPath, JSON.stringify(run, null, 2));
  const columns = ['rank', 'id', 'name', 'company', 'platform', 'country', 'targetRegion', 'marketStatus', 'agencyState', 'fitScore', 'marketScore', 'dealProbabilityScore', 'priorityScore', 'contactChannelScore', 'targetRegionScore', 'action', 'dueNow', 'localTime', 'nextBest', 'reason', 'url', 'contactUrl', 'contactSearchUrl', 'emailFrom', 'publicEmail', 'websiteContactSubject', 'websiteContactMessage', 'contactPhone', 'vendorPortal', 'linkedinUrl', 'headquarters', 'founded', 'companyScale'];
  const rows = run.dailyQueue.map((item, index) => ({
    rank: index + 1,
    ...item,
    dueNow: Boolean(item.workingTime && item.workingTime.dueNow),
    localTime: item.workingTime && item.workingTime.localTime || '',
    nextBest: item.workingTime && item.workingTime.nextBest || '',
  }));
  fs.writeFileSync(csvPath, [columns.join(','), ...rows.map(row => columns.map(column => csvCell(row[column])).join(','))].join('\n'));
  fs.writeFileSync(path.join(ROOT, 'daily-automation-latest.json'), JSON.stringify(run, null, 2));
  fs.writeFileSync(path.join(ROOT, 'daily-automation-latest.js'), `window.DAILY_AUTOMATION_LATEST = ${JSON.stringify(run, null, 2)};\n`);
  writeSystemVisibilityArtifact(run);
  return { jsonPath, csvPath };
}

function copyPublicArtifact(file) {
  const from = path.join(ROOT, file);
  const to = path.join(ROOT, 'public', file);
  if (!fs.existsSync(from)) return false;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  return true;
}

function writeSystemVisibilityArtifact(run) {
  const dailyRows = Array.isArray(run.dailyQueue) ? run.dailyQueue : [];
  const cooldownRows = Array.isArray(run.cooldownQueue) ? run.cooldownQueue : [];
  const googleRows = dailyRows.filter(item => item.source === 'google_customer_discovery' || /^google-customer-/i.test(item.id || item.taskId || ''));
  const websiteContactRows = googleRows.filter(item => item.reason === 'official_website_contact_channel' || /website-contact/i.test(item.id || item.taskId || ''));
  const visibility = {
    updatedAt: new Date().toISOString(),
    source: 'daily-automation-runner',
    runDate: run.date,
    artifactGeneratedAt: run.generatedAt,
    counts: {
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
  };
  fs.writeFileSync(path.join(ROOT, 'system-visibility-latest.json'), JSON.stringify(visibility, null, 2));
  fs.writeFileSync(path.join(ROOT, 'system-visibility-latest.js'), `window.SYSTEM_VISIBILITY_LATEST = ${JSON.stringify(visibility, null, 2)};\n`);
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
  const totalLimit = Number.isFinite(cliLimit) && cliLimit > 0 ? cliLimit : Number(limits.total || DEFAULT_DAILY_LIMIT);
  const buckets = [
    ['develop', Number(limits.develop || 0)],
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
      workingTime: item.workingTime || { dueNow: true },
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
        || companyLeadKeys(item).some(key => history.sentConfirmed.has(key))
        || companyLeadKeys(item).some(key => history.activeCooldown.has(key))
        || channelLeadKeys(item).some(key => history.activeCooldown.has(key));
    })
    .map(item => {
      const sameDay = companyLeadKeys(item)
        .map(key => history.sameDayDetails.get(key))
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
        reason: sameDay
          ? 'same_day_customer_already_developed'
          : touch && touch.status === 'website_contact_ready'
          ? 'website_contact_ready_no_repeat'
          : `${COOLDOWN_DAYS}_day_no_repeat_touch`,
        agencyState: item.agencyState || 'open',
        lastStatus: sameDay && sameDay.status || touch && touch.status || '',
        lastEvidence: sameDay && sameDay.evidence || touch && touch.evidence || '',
        lastTouch: sameDay && sameDay.timestamp || touch && touch.timestamp || '',
        workingTime: item.workingTime || { dueNow: false, reason: 'channel_already_touched' },
      };
    })
    .sort(priorityCompare)
    .slice(0, limit);
}

function main() {
  const args = new Set(process.argv.slice(2));
  const now = Date.now();
  const dateArg = process.argv.find(arg => /^--date=/.test(arg));
  const date = dateArg ? dateArg.split('=')[1] : new Date(now).toISOString().slice(0, 10);
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
  const classified = (plan.tasks || [])
    .map(task => classifyTask(task, context))
    .sort(priorityCompare);

  const actionable = classified.filter(item => ['develop', 'retry_or_alternate_channel', 'verify_target', 'email_priority'].includes(item.action));
  const dueClassified = CONFIG.cadence.respectTargetWorkingHours === false
    ? actionable
    : actionable.filter(item => item.workingTime && item.workingTime.dueNow);
  const picked = quotaPick(dueClassified, limit);
  const discoveryRun = readJson('google-lead-discovery-latest.json', { leads: [] });
  const newDiscovery = discoveryQueue(Number(CONFIG.limits.develop || 10), context);
  const touchedDiscovery = discoveryCooldownQueue(20, context);
  const remainingLimit = Math.max(0, picked.quota.total.target - newDiscovery.length);
  const dailyQueue = preferSocialChannels(dedupeQueueItems([...newDiscovery, ...picked.queue.slice(0, remainingLimit)])).sort(priorityCompare);
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
  const run = {
    generatedAt: new Date(now).toISOString(),
    date,
    mode: 'daily-icp-first-automation-loop',
    executionLayer: 'Codex Chrome Extension primary; AutoClaw compatible',
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
      googleDiscovered: dailyQueue.filter(item => item.source === 'google_customer_discovery' || /^google-customer-/i.test(item.id || '')).length,
      facebookDiscovered: dailyQueue.filter(item => item.platform === 'facebook' && (item.source === 'google_customer_discovery' || /^google-customer-/i.test(item.id || ''))).length,
      websiteContactDiscovered: dailyQueue.filter(item => item.platform === 'email' && (item.source === 'google_customer_discovery' || /^google-customer-/i.test(item.id || ''))).length,
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
    dailyQueue,
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
  channelPriorityScore,
  companyLeadKeys,
  isKnownPartnerCompany,
  knownTouchIndex,
  preferSocialChannels,
};
