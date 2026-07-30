const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const AGENT_ROOT = path.join(ROOT, '.agent');
const POLICY_ROOT = path.join(AGENT_ROOT, 'policies');
const RUNTIME_ROOT = path.join(AGENT_ROOT, 'runtime');
const MANIFEST_PATH = path.join(POLICY_ROOT, 'manifest.json');
const TODAY_CONTEXT_PATH = path.join(RUNTIME_ROOT, 'today-context.json');
const PREVIOUS_RUN_PATH = path.join(RUNTIME_ROOT, 'previous-run.json');
const EXPECTED_SCHEMA_VERSION = 1;
const CONFIRMED_STATUSES = new Set(['sent_confirmed', 'submitted_confirmed']);

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function readJsonScriptArray(file, globalName) {
  try {
    const source = fs.readFileSync(file, 'utf8');
    const match = source.match(new RegExp(`window\\.${globalName}\\s*=\\s*([\\s\\S]*?);\\s*$`));
    const parsed = match ? JSON.parse(match[1]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temp, file);
}

function shanghaiDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

function resultDate(value) {
  const timestamp = value && (value.timestamp || value.sentAt || value.completedAt);
  if (!timestamp) return '';
  const parsed = new Date(timestamp);
  return Number.isNaN(parsed.getTime()) ? '' : shanghaiDate(parsed);
}

function companyKey(value) {
  return String(value && (value.companyId || value.company || value.companyName || value.recipientEmail || value.target_url) || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function validatePolicies(root = ROOT) {
  const policyRoot = path.join(root, '.agent', 'policies');
  const manifestPath = path.join(policyRoot, 'manifest.json');
  const manifest = readJson(manifestPath, null);
  const issues = [];
  if (!manifest) {
    issues.push('manifest_missing_or_invalid');
  } else {
    if (manifest.schemaVersion !== EXPECTED_SCHEMA_VERSION) issues.push('policy_schema_version_mismatch');
    if (manifest.dailyTarget !== 100) issues.push('daily_target_must_equal_100');
    if (manifest.defaultRunLimit !== 25) issues.push('default_run_limit_must_equal_25');
    if (manifest.maximumRunLimit !== 50) issues.push('maximum_run_limit_must_equal_50');
    if (manifest.runMaximumMinutes !== 45) issues.push('run_maximum_minutes_must_equal_45');
    const statuses = Array.isArray(manifest.confirmedStatuses) ? manifest.confirmedStatuses : [];
    if (statuses.join(',') !== 'sent_confirmed,submitted_confirmed') issues.push('confirmed_status_contract_mismatch');
    for (const file of manifest.requiredFiles || []) {
      if (!fs.existsSync(path.join(policyRoot, file))) issues.push(`required_policy_missing:${file}`);
    }
  }
  return {
    ok: issues.length === 0,
    code: issues.length ? 'CONFIG_MISSING' : 'READY',
    issues,
    manifest,
  };
}

function gitValue(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function buildContext({ phase = 'manual', now = new Date() } = {}) {
  const policy = validatePolicies();
  const date = shanghaiDate(now);
  const run = readJson(path.join(ROOT, 'daily-automation-latest.json'), {});
  const execution = readJson(path.join(ROOT, 'daily-automation-execution-latest.json'), {});
  const results = readJsonScriptArray(
    path.join(ROOT, 'autonomous-outreach-results.js'),
    'AUTONOMOUS_OUTREACH_RESULTS',
  );
  const confirmed = results.filter(item => (
    resultDate(item) === date
    && CONFIRMED_STATUSES.has(item.status || item.sendStatus)
  ));
  const confirmedCompanies = [...new Set(confirmed.map(companyKey).filter(Boolean))];
  const summary = run.summary || {};
  const context = {
    schemaVersion: EXPECTED_SCHEMA_VERSION,
    generatedAt: now.toISOString(),
    phase,
    shanghaiDate: date,
    policyVersion: policy.manifest && policy.manifest.policyVersion || null,
    policyStatus: policy.code,
    sendingAllowed: policy.ok,
    activeBlocks: policy.issues,
    limits: {
      dailyTarget: 100,
      defaultRunLimit: policy.manifest && policy.manifest.defaultRunLimit || 25,
      maximumRunLimit: policy.manifest && policy.manifest.maximumRunLimit || 50,
      runMaximumMinutes: 45,
    },
    confirmedToday: confirmedCompanies.length,
    remainingToday: Math.max(0, 100 - confirmedCompanies.length),
    queue: {
      potentialPool: Number(summary.potentialPool || 0),
      refillNeeded: Number(summary.refillNeeded || 0),
      executableCompanies: Number(summary.executableCompanies || 0),
      executableReserveNeeded: Number(summary.executableReserveNeeded || 0),
    },
    latestExecution: {
      completedAt: execution.completedAt || null,
      phase: execution.executionPhase || null,
      realDevelopmentCount: Number(execution.realDevelopmentCount || 0),
      reportingVerdict: execution.reportingVerdict || null,
    },
    browser: {
      requiredTransport: 'dedicated Chrome/CDP',
      cdpPort: 9224,
      primaryChromePortProhibited: 9222,
    },
    git: {
      branch: gitValue(['branch', '--show-current']),
      localHead: gitValue(['rev-parse', 'HEAD']),
      upstreamHead: gitValue(['rev-parse', 'HEAD@{u}']),
    },
  };
  return { policy, context };
}

function refreshRuntime(options = {}) {
  const built = buildContext(options);
  writeJsonAtomic(TODAY_CONTEXT_PATH, built.context);
  const execution = readJson(path.join(ROOT, 'daily-automation-execution-latest.json'), {});
  const previous = {
    schemaVersion: EXPECTED_SCHEMA_VERSION,
    generatedAt: built.context.generatedAt,
    automationId: 'daily-google-lead-outreach-automation',
    phase: built.context.phase,
    runState: execution.completedAt ? 'completed' : 'not_completed',
    verdict: execution.ok === true && built.context.confirmedToday === 100 ? 'PASS' : 'FAIL',
    confirmedThisRun: Number(execution.realDevelopmentCount || 0),
    confirmedToday: built.context.confirmedToday,
    remainingToday: built.context.remainingToday,
    policyStatus: built.context.policyStatus,
    blocks: built.context.activeBlocks,
    localHead: built.context.git.localHead,
    upstreamHead: built.context.git.upstreamHead,
    nextAction: built.context.sendingAllowed
      ? 'Continue the required bounded automation sequence'
      : 'Restore the required policy files before customer sending',
  };
  writeJsonAtomic(PREVIOUS_RUN_PATH, previous);
  return { ...built, previous };
}

module.exports = {
  EXPECTED_SCHEMA_VERSION,
  buildContext,
  companyKey,
  readJsonScriptArray,
  refreshRuntime,
  resultDate,
  shanghaiDate,
  validatePolicies,
  writeJsonAtomic,
};
