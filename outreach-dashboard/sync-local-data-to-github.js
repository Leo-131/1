const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'github-sync');
const WATCH = process.argv.includes('--watch');
const PUSH = !process.argv.includes('--no-push');
const DEBOUNCE_MS = 30000;

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
  fs.copyFileSync(from, to);
  return true;
}

function writeJsonScript(file, globalName, value) {
  fs.writeFileSync(file, `window.${globalName} = ${JSON.stringify(value, null, 2)};\n`);
}

function writeSyncStatus(status) {
  const output = {
    updatedAt: new Date().toISOString(),
    ...status,
  };
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'latest-status.json'), JSON.stringify(output, null, 2));
  writeJsonScript(path.join(OUT, 'latest-status.js'), 'GITHUB_SYNC_LATEST', output);
  return output;
}

function git(args, options = {}) {
  const output = execFileSync('git', args, {
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

  fs.writeFileSync(path.join(OUT, 'latest-daily-automation.json'), JSON.stringify(latest, null, 2));
  const googleDiscovery = redact(readJson(path.join(ROOT, 'google-lead-discovery-latest.json'), {}));
  fs.writeFileSync(path.join(OUT, 'latest-google-discovery.json'), JSON.stringify(googleDiscovery, null, 2));
  fs.writeFileSync(path.join(OUT, 'README.md'), [
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
  copyIfExists(latestCsv, path.join(OUT, 'daily-queue.csv'));
  copyIfExists(path.join(ROOT, 'google-lead-discovery-latest.csv'), path.join(OUT, 'google-discovery.csv'));
  copyIfExists(path.join(ROOT, 'system-visibility-latest.json'), path.join(OUT, 'system-visibility-latest.json'));
  copyIfExists(path.join(ROOT, 'system-visibility-latest.js'), path.join(OUT, 'system-visibility-latest.js'));
  copyIfExists(path.join(ROOT, 'autonomous-outreach-results.js'), path.join(OUT, 'autonomous-outreach-results.js'));

  const paths = [
    'github-sync',
    'public/github-sync',
    'command-center.js',
    'daily-automation-runner.js',
    'main.js',
    'outreach-dashboard.html',
    'service-worker.js',
    'public/command-center.js',
    'public/outreach-dashboard.html',
    'public/service-worker.js',
    'public/daily-automation-latest.js',
    'public/google-lead-discovery-latest.js',
    'public/google-lead-discovery-latest.json',
    'public/daily-automation-execution-latest.js',
    'public/daily-automation-execution-latest.json',
    'public/system-visibility-latest.js',
    'public/system-visibility-latest.json',
    'daily-automation-latest.js',
    'google-lead-discovery-latest.js',
    'google-lead-discovery-latest.json',
    'google-lead-discovery-latest.csv',
    'daily-automation-execution-latest.js',
    'daily-automation-execution-latest.json',
    'system-visibility-latest.json',
    'system-visibility-latest.js',
    'sync-local-data-to-github.js',
    'package.json',
  ];
  git(['add', '--', ...paths], { stdio: 'pipe' });
  if (!hasChanges(paths)) {
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
      writeSyncStatus({ ok: true, pushed: true, branch, localCommit, remoteCommit, message });
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
    'daily-runs',
  ].forEach((name) => {
    const target = path.join(ROOT, name);
    if (fs.existsSync(target)) fs.watch(target, { recursive: fs.statSync(target).isDirectory() }, scheduleSync);
  });
  console.log('github sync: watching local outreach data');
} else {
  syncOnce();
}
