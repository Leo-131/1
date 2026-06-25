const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const RUN_DIR = path.join(ROOT, 'daily-runs');
const CONFIG_PATH = path.join(ROOT, 'daily-automation-config.json');
const DEFAULT_CONFIG = {
  limits: { total: 20, develop: 10, emailPriority: 5, retryOrAlternate: 3, verifyTarget: 2 },
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
const TOUCH_STATUSES = new Set(['sent_confirmed', 'post_liked', 'account_followed']);

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
  return task.verifiedTargetUrl || (profile && profile.url) || '';
}

function normalizeResultIndex(results) {
  const index = new Map();
  for (const result of results) {
    const current = index.get(result.task_id);
    if (!current || validDate(result.timestamp) >= validDate(current.timestamp)) {
      index.set(result.task_id, result);
    }
  }
  return index;
}

function classifyTask(task, context) {
  const id = taskId(task);
  const result = context.resultsByTask.get(id);
  const score = Number(task.fitScore || 0);
  const url = targetUrl(task, context.profiles);
  const lastTouch = result && TOUCH_STATUSES.has(result.status) ? result.timestamp : '';
  const cooldownActive = lastTouch && daysSince(lastTouch, context.now) < COOLDOWN_DAYS;
  const emailPriority = result && result.status === 'skipped' && /email_channel_found/i.test(String(result.evidence || ''));
  const isFacebook = String(task.platform || '').toLowerCase() === 'facebook';
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
  } else if (cooldownActive) {
    action = 'cooldown';
    reason = `${COOLDOWN_DAYS}_day_no_repeat_touch`;
  } else if (emailPriority) {
    action = 'email_priority';
    reason = 'email_channel_found';
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
    lastStatus: result && result.status || '',
    lastEvidence: result && result.evidence || '',
    lastTouch,
    action,
    reason,
    workingTime: workingTimeForTask(task, context.now),
    priorityScore: score + Math.round(Number(task.marketScore || 0) * 10) + marketAgencyScore(task) + (emailPriority ? 8 : 0),
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
      'Missing verified profile URLs become verification tasks, not outreach tasks.',
      'Exclusive-agency or reserved regions are skipped; open/no-exclusive markets receive a priority bonus.',
    ],
    byAction,
    keywordOpportunities: highIntent,
    nextModelIteration: [
      'Boost leads with verified buyer/contact channel and real outdoor retail/distribution evidence.',
      'Downgrade generic community, government, HR, design-only, or no-contact profiles.',
      'Prefer decision-maker/channel terms: distributor, wholesale, retail buyer, importer, RV accessories, camping gear supplier.',
    ],
  };
}

function writeRunArtifacts(run) {
  fs.mkdirSync(RUN_DIR, { recursive: true });
  const jsonPath = path.join(RUN_DIR, `${run.date}-daily-automation.json`);
  const csvPath = path.join(RUN_DIR, `${run.date}-daily-queue.csv`);
  fs.writeFileSync(jsonPath, JSON.stringify(run, null, 2));
  const columns = ['rank', 'id', 'name', 'company', 'platform', 'country', 'marketStatus', 'agencyState', 'fitScore', 'priorityScore', 'action', 'dueNow', 'localTime', 'nextBest', 'reason', 'url'];
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
  return { jsonPath, csvPath };
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
  const prioritized = classified.slice().sort((left, right) => {
    const dueDelta = Number(Boolean(right.workingTime && right.workingTime.dueNow)) - Number(Boolean(left.workingTime && left.workingTime.dueNow));
    if (dueDelta) return dueDelta;
    return right.priorityScore - left.priorityScore || String(left.company).localeCompare(String(right.company));
  });
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
  for (const item of selected.sort((left, right) => {
    const dueDelta = Number(Boolean(right.workingTime && right.workingTime.dueNow)) - Number(Boolean(left.workingTime && left.workingTime.dueNow));
    if (dueDelta) return dueDelta;
    return right.priorityScore - left.priorityScore;
  })) {
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

function discoveryQueue(limit) {
  const discovery = readJson('google-lead-discovery-latest.json', { leads: [] });
  return (discovery.leads || [])
    .filter(item => Number(item.fitScore || 0) > ICP_THRESHOLD)
    .map(item => ({
      ...item,
      priorityScore: Number(item.fitScore || 0) + 30,
      action: 'discover_and_develop',
      agencyState: item.agencyState || 'open',
      workingTime: item.workingTime || { dueNow: true },
    }))
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
  };
  const classified = (plan.tasks || [])
    .map(task => classifyTask(task, context))
    .sort((left, right) => right.priorityScore - left.priorityScore || String(left.company).localeCompare(String(right.company)));

  const actionable = classified.filter(item => ['develop', 'retry_or_alternate_channel', 'verify_target', 'email_priority'].includes(item.action));
  const dueClassified = CONFIG.cadence.respectTargetWorkingHours === false
    ? actionable
    : actionable.filter(item => item.workingTime && item.workingTime.dueNow);
  const picked = quotaPick(dueClassified, limit);
  const newDiscovery = discoveryQueue(Number(CONFIG.limits.develop || 10));
  const remainingLimit = Math.max(0, picked.quota.total.target - newDiscovery.length);
  const dailyQueue = [...newDiscovery, ...picked.queue.slice(0, remainingLimit)];
  const scheduledLater = actionable
    .filter(item => !dailyQueue.some(queued => queued.id === item.id))
    .filter(item => CONFIG.cadence.respectTargetWorkingHours !== false && !(item.workingTime && item.workingTime.dueNow))
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
      deploy: CONFIG.cadence.manualDeployOnly === false ? 'allowed_by_config' : 'manual_only',
    },
    summary: {
      totalLeads: classified.length,
      highIcp: classified.filter(item => item.fitScore > ICP_THRESHOLD).length,
      readyToDevelop: newDiscovery.length + classified.filter(item => item.action === 'develop').length,
      dueNow: newDiscovery.length + dueClassified.length,
      googleDiscovered: newDiscovery.length,
      scheduledLater: scheduledLater.length,
      cooldown: classified.filter(item => item.action === 'cooldown').length,
      emailPriority: classified.filter(item => item.action === 'email_priority').length,
      openAgencyMarket: classified.filter(item => item.agencyState === 'open').length,
      exclusiveAgencySkipped: classified.filter(item => item.action === 'skip_exclusive_agency').length,
      needsVerification: classified.filter(item => item.action === 'verify_target').length,
      retainedLowIcp: classified.filter(item => item.action === 'retain_low_icp').length,
    },
    dailyQueue,
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
};
