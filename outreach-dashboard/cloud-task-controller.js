const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { buildContext, writeJsonAtomic } = require('./outreach-runtime');

const ROOT = __dirname;
const STATE_PATH = path.join(ROOT, 'cloud-task-state.json');
const PUBLIC_STATE_PATH = path.join(ROOT, 'public', 'cloud-task-state.json');
const TASK_ID = 'daily-google-lead-outreach-automation';
const LEASE_MINUTES = 50;

function readJson(file, fallback = null) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}

function gitValue(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function isLeaseActive(lease, now = new Date()) {
  if (!lease || !lease.deviceId || !lease.expiresAt) return false;
  const expiresAt = new Date(lease.expiresAt);
  return !Number.isNaN(expiresAt.getTime()) && expiresAt > now;
}

function buildCloudTaskState({ now = new Date(), previous = readJson(STATE_PATH, {}) } = {}) {
  const { context } = buildContext({ phase: 'cloud-task-refresh', now });
  const execution = readJson(path.join(ROOT, 'daily-automation-execution-latest.json'), {});
  const keepLease = previous.shanghaiDate === context.shanghaiDate && isLeaseActive(previous.lease, now);
  const lease = keepLease ? previous.lease : null;
  return {
    schemaVersion: 1,
    taskId: TASK_ID,
    mode: 'cloud_control_plane_local_browser_executor',
    shanghaiDate: context.shanghaiDate,
    status: context.remainingToday === 0 ? 'complete' : 'active',
    revision: Math.max(0, Number(previous.revision || 0)) + 1,
    updatedAt: now.toISOString(),
    objective: {
      dailyTarget: context.limits.dailyTarget,
      countries: ['United States', 'United Kingdom', 'South Africa'],
      customerTypes: ['sales_agency', 'key_account'],
      multiChannelSameCustomer: true,
    },
    progress: {
      confirmedToday: context.confirmedToday,
      remainingToday: context.remainingToday,
      potentialPool: context.queue.potentialPool,
      executableCompanies: context.queue.executableCompanies,
      latestExecutionPhase: context.latestExecution.phase,
      latestRealDevelopmentCount: context.latestExecution.realDevelopmentCount,
      latestReportingVerdict: context.latestExecution.reportingVerdict,
    },
    lease,
    handoff: {
      claimable: !lease && context.remainingToday > 0,
      instructions: 'Pull the shared branch on a clean checkout, claim with a device alias, then run npm run cloud:run -- --device=<alias>.',
    },
    executorContract: {
      browser: 'local dedicated visible Chrome/CDP 9224 only',
      prohibitedBrowserPort: 9222,
      emailSurface: 'Alibaba Mail web UI only',
      credentialsStoredInCloud: false,
      requiredOrder: ['npm run discover:daily', 'npm run daily:execute', 'npm run sync:github'],
    },
    policy: {
      status: context.policyStatus,
      activeBlocks: context.activeBlocks,
    },
    git: {
      branch: context.git.branch,
      localHead: context.git.localHead,
      upstreamHead: context.git.upstreamHead,
      remoteHead: gitValue(['ls-remote', 'origin', `refs/heads/${context.git.branch}`]).split(/\s+/)[0] || '',
    },
    latestExecution: {
      completedAt: execution.completedAt || null,
      browserTransportUsed: execution.browserTransportUsed || 'none',
      chromeOpened: execution.chromeOpened === true,
      realDevelopmentCount: Number(execution.realDevelopmentCount || 0),
    },
  };
}

function claimCloudTask(state, deviceId, now = new Date()) {
  const cleanDeviceId = String(deviceId || '').trim().replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 64);
  if (!cleanDeviceId) throw new Error('A non-secret device alias is required: --device=<alias>');
  if (state.status === 'complete') return state;
  if (isLeaseActive(state.lease, now) && state.lease.deviceId !== cleanDeviceId) {
    throw new Error(`Cloud task is already leased by ${state.lease.deviceId} until ${state.lease.expiresAt}`);
  }
  return {
    ...state,
    revision: Number(state.revision || 0) + 1,
    updatedAt: now.toISOString(),
    lease: {
      deviceId: cleanDeviceId,
      claimedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + LEASE_MINUTES * 60 * 1000).toISOString(),
    },
    handoff: { ...state.handoff, claimable: false },
  };
}

function releaseCloudTask(state, deviceId, now = new Date()) {
  const cleanDeviceId = String(deviceId || '').trim().replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 64);
  if (state.lease && state.lease.deviceId && state.lease.deviceId !== cleanDeviceId) {
    throw new Error(`Only lease owner ${state.lease.deviceId} can release this cloud task`);
  }
  return {
    ...state,
    revision: Number(state.revision || 0) + 1,
    updatedAt: now.toISOString(),
    lease: null,
    handoff: { ...state.handoff, claimable: state.status !== 'complete' },
  };
}

function writeState(state) {
  writeJsonAtomic(STATE_PATH, state);
  writeJsonAtomic(PUBLIC_STATE_PATH, state);
  return state;
}

function argument(name) {
  const prefix = `--${name}=`;
  const value = process.argv.find(item => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : '';
}

function main() {
  const action = String(process.argv[2] || 'status').toLowerCase();
  const deviceId = argument('device') || process.env.OUTREACH_DEVICE_ID || '';
  let state = readJson(STATE_PATH, null) || buildCloudTaskState();
  if (action === 'refresh') state = buildCloudTaskState({ previous: state });
  else if (action === 'claim') state = claimCloudTask(buildCloudTaskState({ previous: state }), deviceId);
  else if (action === 'release') state = releaseCloudTask(buildCloudTaskState({ previous: state }), deviceId);
  else if (action !== 'status') throw new Error(`Unsupported cloud task action: ${action}`);
  if (action !== 'status') writeState(state);
  process.stdout.write(`${JSON.stringify(state, null, 2)}\n`);
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message || String(error)); process.exit(1); }
}

module.exports = {
  LEASE_MINUTES,
  buildCloudTaskState,
  claimCloudTask,
  isLeaseActive,
  releaseCloudTask,
  writeState,
};
