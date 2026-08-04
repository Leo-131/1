const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');
const runtime = require('../outreach-dashboard/outreach-runtime');

function policyFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'outreach-policy-'));
  const policyRoot = path.join(root, '.agent', 'policies');
  fs.mkdirSync(policyRoot, { recursive: true });
  fs.writeFileSync(path.join(policyRoot, 'manifest.json'), JSON.stringify({
    schemaVersion: 1,
    policyVersion: 'test',
    dailyTarget: 100,
    defaultRunLimit: 25,
    maximumRunLimit: 50,
    runMaximumMinutes: 45,
    confirmedStatuses: ['sent_confirmed', 'submitted_confirmed'],
    requiredFiles: ['outreach-policy.md', 'browser-policy.md', 'git-policy.md'],
  }));
  for (const file of ['outreach-policy.md', 'browser-policy.md', 'git-policy.md']) {
    fs.writeFileSync(path.join(policyRoot, file), '# policy\n');
  }
  return root;
}

test('policy validation accepts the production 100/25/50/45 contract', () => {
  const root = policyFixture();
  assert.equal(runtime.validatePolicies(root).ok, true);
});

test('policy validation fails closed when a required policy is missing', () => {
  const root = policyFixture();
  fs.unlinkSync(path.join(root, '.agent', 'policies', 'browser-policy.md'));
  const result = runtime.validatePolicies(root);
  assert.equal(result.ok, false);
  assert.equal(result.code, 'CONFIG_MISSING');
  assert.ok(result.issues.includes('required_policy_missing:browser-policy.md'));
});

test('policy validation rejects unsafe throughput expansion', () => {
  const root = policyFixture();
  const manifestPath = path.join(root, '.agent', 'policies', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.dailyTarget = 800;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest));
  assert.ok(runtime.validatePolicies(root).issues.includes('daily_target_must_equal_100'));
});

test('policy validation rejects a run maximum above fifty', () => {
  const root = policyFixture();
  const manifestPath = path.join(root, '.agent', 'policies', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.maximumRunLimit = 51;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest));
  assert.ok(runtime.validatePolicies(root).issues.includes('maximum_run_limit_must_equal_50'));
});

test('Shanghai result dates are derived from timestamps rather than UTC string prefixes', () => {
  assert.equal(runtime.resultDate({ timestamp: '2026-07-29T16:30:00.000Z' }), '2026-07-30');
});

test('runtime retries bounded transient Windows file-operation failures', () => {
  let calls = 0;
  const result = runtime.retryTransientFileOperation(() => {
    calls += 1;
    if (calls < 3) throw Object.assign(new Error('locked'), { code: 'EPERM' });
    return 'written';
  }, 3, 0);
  assert.equal(result, 'written');
  assert.equal(calls, 3);
});

test('daily artifact writer uses the bounded transient write helper', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'daily-automation-runner.js'), 'utf8');
  for (const artifact of ['daily-automation-latest.json', 'daily-automation-latest.js']) {
    assert.match(source, new RegExp(`writeFileWithRetry\\(path\\.join\\(ROOT, '${artifact.replace('.', '\\.')}'`));
  }
});
