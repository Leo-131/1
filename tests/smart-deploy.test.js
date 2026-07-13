const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'outreach-dashboard', 'smart-deploy.js'),
  'utf8',
);
const localServerSource = fs.readFileSync(
  path.join(__dirname, '..', 'outreach-dashboard', 'dashboard-local-server.js'),
  'utf8',
);

test('deploy digest includes command-center reporting assets', () => {
  for (const file of [
    'outreach-analytics.js',
    'autonomous-outreach-data.js',
    'command-center.css',
    'command-center.js',
  ]) {
    assert.ok(source.includes(`"${file}"`), file);
  }
});

test('production deploy uses bounded compressed upload and records the attempt first', () => {
  assert.ok(source.includes('"--archive=tgz"'));
  assert.match(source, /timeout:\s*DEPLOY_TIMEOUT_MS/);
  assert.match(source, /state\.deployments\[day\]\s*=\s*todaysCount \+ 1[\s\S]*saveState\(state\)[\s\S]*run\("vercel"/);
});

test('local dashboard server uses bounded static caching with freshness validators', () => {
  assert.ok(localServerSource.includes('STATIC_CACHE_LIMIT'));
  assert.ok(localServerSource.includes('STATIC_CACHE_MAX_BYTES'));
  assert.ok(localServerSource.includes('staticFileCache'));
  assert.ok(localServerSource.includes('headers.ETag'));
  assert.ok(localServerSource.includes('Last-Modified'));
  assert.ok(localServerSource.includes('notModified(req'));
  assert.ok(localServerSource.includes("'Clear-Site-Data'"));
});
