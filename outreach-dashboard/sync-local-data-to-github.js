const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'github-sync');
const WATCH = process.argv.includes('--watch');
const PUSH = !process.argv.includes('--no-push');
const DEBOUNCE_MS = 30000;

function retryTransientFileOperation(operation, attempts = 8) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return operation();
    } catch (error) {
      lastError = error;
      const transient = error && ['EBUSY', 'EACCES', 'EPERM', 'UNKNOWN'].includes(error.code);
      if (!transient || attempt === attempts - 1) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 75 * (attempt + 1));
    }
  }
  throw lastError;
}

function atomicWriteFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  retryTransientFileOperation(() => fs.writeFileSync(temp, content));
  retryTransientFileOperation(() => fs.renameSync(temp, file));
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (!value || typeof value !== 'object') return value;
  const blocked = /password|passwd|secret|token|api[_-]?key|credential|cookie|session/i;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [
    key,
    blocked.test(key) ? '[REDACTED]' : redact(item),
  ]));
}

function copyIfExists(from, to) {
  if (!fs.existsSync(from)) return false;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  retryTransientFileOperation(() => fs.copyFileSync(from, to));
  return true;
}

function writeJsonScript(file, globalName, value) {
  atomicWriteFile(file, `window.${globalName} = ${JSON.stringify(value, null, 2)};\n`);
}

function writeSyncStatus(status) {
  const output = {
    updatedAt: new Date().toISOString(),
    ...status,
  };
  fs.mkdirSync(OUT, { recursive: true });
  atomicWriteFile(path.join(OUT, 'latest-status.json'), JSON.stringify(output, null, 2));
  writeJsonScript(path.join(OUT, 'latest-status.js'), 'GITHUB_SYNC_LATEST', output);
  const publicOut = path.join(ROOT, 'public', 'github-sync');
  fs.mkdirSync(publicOut, { recursive: true });
  atomicWriteFile(path.join(publicOut, 'latest-status.json'), JSON.stringify(output, null, 2));
  writeJsonScript(path.join(publicOut, 'latest-status.js'), 'GITHUB_SYNC_LATEST', output);
  writeSystemVisibilityArtifact('sync-local-data-to-github-writeSyncStatus');
  return output;
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
  const latest = readJson(path.join(ROOT, 'daily-automation-latest.json'), {});
  const latestExecution = readJson(path.join(ROOT, 'daily-automation-execution-latest.json'), {});
  const githubSync = readJson(path.join(OUT, 'latest-status.json'), {});
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
  atomicWriteFile(path.join(ROOT, 'system-visibility-latest.json'), JSON.stringify(visibility, null, 2));
  writeJsonScript(path.join(ROOT, 'system-visibility-latest.js'), 'SYSTEM_VISIBILITY_LATEST', visibility);
  copyIfExists(path.join(ROOT, 'system-visibility-latest.json'), path.join(ROOT, 'public', 'system-visibility-latest.json'));
  copyIfExists(path.join(ROOT, 'system-visibility-latest.js'), path.join(ROOT, 'public', 'system-visibility-latest.js'));
  copyIfExists(path.join(ROOT, 'system-visibility-latest.json'), path.join(OUT, 'system-visibility-latest.json'));
  copyIfExists(path.join(ROOT, 'system-visibility-latest.js'), path.join(OUT, 'system-visibility-latest.js'));
  return visibility;
}

function git(args, options = {}) {
  // Avoid an implicit auto-GC turning an otherwise valid bounded sync into a
  // repository-wide repack. Object-store repair is a separate operator action.
  const output = execFileSync('git', ['-c', 'gc.auto=0', ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: options.stdio || 'pipe',
  });
  return typeof output === 'string' ? output.trim() : '';
}

function hasChanges(paths) {
  const output = git(['status', '--short', '--', ...paths]);
  return output.length > 0;
}

function commitAndPushStatus(branch, latestDate) {
  const statusPaths = [
    'github-sync/latest-status.json',
    'github-sync/latest-status.js',
    'github-sync/system-visibility-latest.json',
    'github-sync/system-visibility-latest.js',
    'public/github-sync/latest-status.json',
    'public/github-sync/latest-status.js',
    'public/system-visibility-latest.json',
    'public/system-visibility-latest.js',
    'system-visibility-latest.json',
    'system-visibility-latest.js',
  ];
  git(['add', '--', ...statusPaths], { stdio: 'pipe' });
  if (!hasChanges(statusPaths)) return '';
  git(['commit', '-m', `sync: github status ${latestDate}`], { stdio: 'inherit' });
  const statusCommit = git(['rev-parse', 'HEAD']);
  git(['push', 'origin', branch], { stdio: 'inherit' });
  return statusCommit;
}

function remoteHead(branch) {
  return git(['ls-remote', 'origin', `refs/heads/${branch}`]).split(/\s+/)[0] || '';
}

function localContains(ref) {
  try {
    git(['merge-base', '--is-ancestor', ref, 'HEAD']);
    return true;
  } catch {
    return false;
  }
}

function integrateRemoteBranch(branch) {
  const remoteCommit = remoteHead(branch);
  if (!remoteCommit) return '';
  git(['fetch', 'origin', branch], { stdio: 'inherit' });
  const remoteRef = `refs/remotes/origin/${branch}`;
  if (localContains(remoteRef)) return remoteCommit;
  try {
    git(['merge', '--no-edit', '--no-ff', remoteRef], { stdio: 'inherit' });
    return remoteCommit;
  } catch (error) {
    const localCommit = git(['rev-parse', 'HEAD']);
    writeSyncStatus({
      ok: false,
      pushed: false,
      branch,
      localCommit,
      remoteCommit,
      message: 'Remote branch must be merged before push',
      error: error.message || String(error),
    });
    throw error;
  }
}

function syncOnce() {
  fs.mkdirSync(OUT, { recursive: true });
  const branch = git(['branch', '--show-current']);
  const remoteCommit = PUSH ? integrateRemoteBranch(branch) : remoteHead(branch);
  const latest = redact(readJson(path.join(ROOT, 'daily-automation-latest.json'), {}));
  const latestDate = latest.date || new Date().toISOString().slice(0, 10);
  const latestRun = path.join(ROOT, 'daily-runs', `${latestDate}-daily-automation.json`);
  const latestCsv = path.join(ROOT, 'daily-runs', `${latestDate}-daily-queue.csv`);

  atomicWriteFile(path.join(OUT, 'latest-daily-automation.json'), JSON.stringify(latest, null, 2));
  const googleDiscovery = redact(readJson(path.join(ROOT, 'google-lead-discovery-latest.json'), {}));
  atomicWriteFile(path.join(OUT, 'latest-google-discovery.json'), JSON.stringify(googleDiscovery, null, 2));
  atomicWriteFile(path.join(OUT, 'README.md'), [
    '# Local Outreach Sync',
    '',
    `Updated: ${new Date().toISOString()}`,
    '',
    'This folder is generated from local Codex automation data.',
    'Sensitive keys, passwords, tokens, cookies, and credentials are redacted or excluded.',
    '',
    'Use this folder on another computer after `git pull` to inspect the latest local queue and execution summary.',
    '',
  ].join('\n'));
  copyIfExists(latestRun, path.join(OUT, 'daily-run.json'));
  copyIfExists(latestRun, path.join(ROOT, 'public', 'daily-runs', `${latestDate}-daily-automation.json`));
  copyIfExists(latestRun, path.join(ROOT, 'public', 'github-sync', 'daily-run.json'));
  copyIfExists(latestCsv, path.join(OUT, 'daily-queue.csv'));
  copyIfExists(path.join(ROOT, 'google-lead-discovery-latest.csv'), path.join(OUT, 'google-discovery.csv'));
  copyIfExists(path.join(ROOT, 'system-visibility-latest.json'), path.join(OUT, 'system-visibility-latest.json'));
  copyIfExists(path.join(ROOT, 'system-visibility-latest.js'), path.join(OUT, 'system-visibility-latest.js'));
  copyIfExists(path.join(ROOT, 'autonomous-outreach-results.js'), path.join(OUT, 'autonomous-outreach-results.js'));
  copyIfExists(path.join(ROOT, 'external-evidence-confirmations.json'), path.join(OUT, 'external-evidence-confirmations.json'));
  copyIfExists(path.join(ROOT, 'external-evidence-confirmations.json'), path.join(ROOT, 'public', 'external-evidence-confirmations.json'));
  copyIfExists(path.join(ROOT, 'autonomous-outreach-results.js'), path.join(ROOT, 'public', 'autonomous-outreach-results.js'));
  copyIfExists(path.join(ROOT, 'cloud-task-state.json'), path.join(ROOT, 'public', 'cloud-task-state.json'));
  copyIfExists(path.join(ROOT, 'outreach-intelligence-latest.json'), path.join(OUT, 'outreach-intelligence-latest.json'));
  copyIfExists(path.join(ROOT, 'outreach-intelligence-latest.js'), path.join(OUT, 'outreach-intelligence-latest.js'));
  copyIfExists(
    path.join(ROOT, 'customer-attachment-email-audit-latest.json'),
    path.join(ROOT, 'public', 'customer-attachment-email-audit-latest.json'),
  );

  [
    'daily-automation-latest.js',
    'daily-automation-execution-latest.js',
    'daily-automation-execution-latest.json',
    'google-lead-discovery-latest.js',
    'google-lead-discovery-latest.json',
    'system-visibility-latest.js',
    'cloud-task-state.json',
    'public/cloud-task-state.json',
    'cloud-task-controller.js',
    'run-cloud-outreach-task.js',
    'system-visibility-latest.json',
  ].forEach((name) => {
    copyIfExists(path.join(ROOT, name), path.join(ROOT, 'public', name));
  });

  const paths = [
    'github-sync',
    'public/github-sync',
    '.agent/policies',
    '.agent/runtime',
    'command-center.js',
    'daily-automation-runner.js',
    'main.js',
    'codex-chrome-driver.js',
    'command-center.html',
    'outreach-dashboard.html',
    'service-worker.js',
    'public/command-center.js',
    'public/command-center.html',
    'public/outreach-dashboard.html',
    'public/service-worker.js',
    'public/daily-automation-latest.js',
    'public/daily-automation-latest.json',
    'public/google-lead-discovery-latest.js',
    'public/google-lead-discovery-latest.json',
    'public/daily-automation-execution-latest.js',
    'public/daily-automation-execution-latest.json',
    'public/system-visibility-latest.js',
    'public/system-visibility-latest.json',
    'public/autonomous-outreach-results.js',
    'public/outreach-intelligence-latest.json',
    'public/outreach-intelligence-latest.js',
    'public/customer-attachment-email-audit-latest.json',
    'daily-automation-latest.js',
    'daily-automation-latest.json',
    'google-lead-discovery-latest.js',
    'google-lead-discovery-latest.json',
    'google-lead-discovery-latest.csv',
    'daily-automation-execution-latest.js',
    'daily-automation-execution-latest.json',
    'autonomous-outreach-results.js',
    'outreach-intelligence.js',
    'generate-outreach-intelligence.js',
    'outreach-intelligence-latest.json',
    'outreach-intelligence-latest.js',
    'customer-attachment-email-audit-latest.json',
    'system-visibility-latest.json',
    'system-visibility-latest.js',
    'sync-local-data-to-github.js',
    'check-dashboard.js',
    'email-channel.js',
    'secure-credential-store.js',
    'email-operations.js',
    'alibaba-email-delivery.js',
    'alibaba-webmail-automation.js',
    'email-verification.js',
    'google-lead-discovery-runner.js',
    'enrich-first-party-channels.js',
    'first-party-enrichment-state.json',
    'generate-outreach-runtime.js',
    'outreach-runtime.js',
    'verified-external-candidates.json',
    'generate-system-readiness.js',
    'system-readiness.js',
    'public/system-readiness.js',
    '../tests/alibaba-webmail-automation.test.js',
    '../tests/email-channel.test.js',
    '../tests/outreach-runtime.test.js',
    '../tests/glm-automation.test.js',
    '../tests/first-party-channel-enrichment.test.js',
    '../tests/outreach-intelligence.test.js',
    '../tests/system-readiness.test.js',
    '../tests/cloud-task-controller.test.js',
    'package.json',
    'package-lock.json',
    'docs/plans/2026-07-21-nonzero-daily-execution-design.md',
    'docs/plans/2026-08-04-autonomous-sales-intelligence-design.md',
    'docs/daily-google-lead-outreach-optimized-prompt.md',
    'docs/cloud-task-handoff.md',
  ];
  const publicDailyRun = `public/daily-runs/${latestDate}-daily-automation.json`;
  if (fs.existsSync(path.join(ROOT, publicDailyRun))) {
    git(['add', '-f', '--', publicDailyRun], { stdio: 'pipe' });
  }
  git(['add', '--', ...paths], { stdio: 'pipe' });
  if (!hasChanges([...paths, publicDailyRun])) {
    writeSyncStatus({
      ok: true,
      pushed: false,
      branch,
      localCommit: git(['rev-parse', 'HEAD']),
      remoteCommit,
      message: 'No local data changes to sync',
    });
    console.log('github sync: no local data changes');
    return false;
  }
  const message = `sync: local outreach data ${latestDate}`;
  git(['commit', '-m', message], { stdio: 'inherit' });
  const localCommit = git(['rev-parse', 'HEAD']);
  if (PUSH) {
    try {
      git(['push', 'origin', branch], { stdio: 'inherit' });
      writeSyncStatus({ ok: true, pushed: true, branch, localCommit, remoteCommit: localCommit, message });
      commitAndPushStatus(branch, latestDate);
    } catch (error) {
      writeSyncStatus({
        ok: false,
        pushed: false,
        branch,
        localCommit,
        remoteCommit,
        message,
        error: error.message || String(error),
      });
      throw error;
    }
  } else {
    writeSyncStatus({ ok: true, pushed: false, branch, localCommit, remoteCommit, message: `${message} (no push)` });
  }
  console.log(`github sync: ${message}`);
  return true;
}

let timer = null;
function scheduleSync() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      syncOnce();
    } catch (error) {
      console.error(`github sync failed: ${error.message || error}`);
    }
  }, DEBOUNCE_MS);
}

if (WATCH) {
  syncOnce();
  [
    'daily-automation-latest.json',
    'autonomous-outreach-results.js',
    'verified-external-candidates.json',
    'daily-runs',
  ].forEach((name) => {
    const target = path.join(ROOT, name);
    if (fs.existsSync(target)) fs.watch(target, { recursive: fs.statSync(target).isDirectory() }, scheduleSync);
  });
  console.log('github sync: watching local outreach data');
} else {
  syncOnce();
}
