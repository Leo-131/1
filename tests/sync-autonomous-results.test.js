const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { mergeResults, readResultsScript, writeResultsScript } = require('../tools/qclaw/sync_autonomous_results.js');

test('result synchronization is idempotent and preserves unconfirmed evidence', () => {
  const confirmed = { task_id: 'one', approval_version: 1, status: 'sent_confirmed', timestamp: '2026-06-10T01:00:00Z' };
  const unconfirmed = { task_id: 'two', approval_version: 1, status: 'send_unconfirmed', timestamp: '2026-06-10T02:00:00Z' };
  const merged = mergeResults([confirmed], [confirmed, unconfirmed]);
  assert.equal(merged.length, 2);
  assert.equal(merged[1].status, 'send_unconfirmed');
});

test('results script round trips through an atomic writer', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'autonomous-results-'));
  const file = path.join(directory, 'results.js');
  const results = [{ task_id: 'one', approval_version: 2, status: 'auto_skipped' }];
  writeResultsScript(file, results);
  assert.deepEqual(readResultsScript(file), results);
});
