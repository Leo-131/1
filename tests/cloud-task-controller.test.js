const test = require('node:test');
const assert = require('node:assert/strict');
const {
  LEASE_MINUTES,
  claimCloudTask,
  isLeaseActive,
  releaseCloudTask,
} = require('../outreach-dashboard/cloud-task-controller');
const fs = require('node:fs');
const path = require('node:path');

function state() {
  return {
    status: 'active',
    revision: 1,
    lease: null,
    handoff: { claimable: true },
  };
}

test('cloud task lease prevents two computers from executing the same outreach task', () => {
  const now = new Date('2026-08-21T12:00:00.000Z');
  const claimed = claimCloudTask(state(), 'office-laptop', now);
  assert.equal(claimed.lease.deviceId, 'office-laptop');
  assert.equal(isLeaseActive(claimed.lease, new Date(now.getTime() + 1000)), true);
  assert.equal(new Date(claimed.lease.expiresAt).getTime(), now.getTime() + LEASE_MINUTES * 60 * 1000);
  assert.throws(() => claimCloudTask(claimed, 'home-desktop', now), /already leased/);
});

test('cloud task can be handed off after owner release or lease expiry', () => {
  const now = new Date('2026-08-21T12:00:00.000Z');
  const claimed = claimCloudTask(state(), 'office-laptop', now);
  assert.throws(() => releaseCloudTask(claimed, 'home-desktop', now), /Only lease owner/);
  const released = releaseCloudTask(claimed, 'office-laptop', now);
  assert.equal(released.lease, null);
  assert.equal(released.handoff.claimable, true);
  const afterExpiry = claimCloudTask(claimed, 'home-desktop', new Date(now.getTime() + (LEASE_MINUTES + 1) * 60 * 1000));
  assert.equal(afterExpiry.lease.deviceId, 'home-desktop');
});

test('cloud runner reuses the active npm CLI on Windows instead of relying on PATH lookup', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'run-cloud-outreach-task.js'), 'utf8');
  assert.match(source, /const npmCli = process\.env\.npm_execpath/);
  assert.match(source, /npmCli \? process\.execPath/);
  assert.match(source, /if \(result\.error\) throw result\.error/);
  assert.match(source, /writeState\(releaseCloudTask\(buildCloudTaskState\(\), deviceId\)\)/);
  assert.ok(source.indexOf('releaseCloudTask(buildCloudTaskState(), deviceId)') < source.indexOf("runNpm('sync:github'"));
});
