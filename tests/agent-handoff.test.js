const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const cliPath = path.join(repoRoot, 'tools', 'agent-handoff.js');

function createHarness() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-handoff-'));
  const statePath = path.join(directory, 'AGENT_HANDOFF.json');

  function run(args, expectedStatus = 0) {
    const result = spawnSync(process.execPath, [cliPath, ...args], {
      cwd: repoRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        HANDOFF_STATE_PATH: statePath,
        HANDOFF_DISABLE_GIT: '1'
      }
    });

    assert.equal(result.status, expectedStatus, result.stderr || result.stdout);
    return result;
  }

  return { directory, statePath, run };
}

test('status creates a valid idle state when no handoff exists', () => {
  const harness = createHarness();
  const result = harness.run(['status', '--json']);
  const state = JSON.parse(result.stdout);

  assert.equal(state.schemaVersion, 1);
  assert.equal(state.status, 'idle');
  assert.equal(state.activeAgent, null);
  assert.ok(fs.existsSync(harness.statePath));
});

test('git porcelain parsing preserves the first character of changed paths', () => {
  const { parseChangedFiles } = require(cliPath);

  assert.deepEqual(
    parseChangedFiles(' M AGENTS.md\n?? CONTINUITY.md\nM  outreach-dashboard/package.json\n'),
    ['AGENTS.md', 'CONTINUITY.md', 'outreach-dashboard/package.json']
  );
});

test('an active task cannot be silently claimed by the other agent', () => {
  const harness = createHarness();
  harness.run(['claim', 'codex', 'Fix dashboard continuity']);
  const rejected = harness.run(['claim', 'qclaw', 'Replace current work'], 2);
  const state = JSON.parse(fs.readFileSync(harness.statePath, 'utf8'));

  assert.match(rejected.stderr, /already claimed by codex/i);
  assert.equal(state.activeAgent, 'codex');
  assert.equal(state.task, 'Fix dashboard continuity');
});

test('checkpoint preserves task identity and records the next action', () => {
  const harness = createHarness();
  harness.run(['claim', 'codex', 'Fix dashboard continuity']);
  harness.run([
    'checkpoint',
    'codex',
    'Added shared handoff state',
    'Run the complete dashboard checks',
    'handoff tests passed'
  ]);
  const state = JSON.parse(fs.readFileSync(harness.statePath, 'utf8'));

  assert.equal(state.status, 'ready_for_handoff');
  assert.equal(state.activeAgent, null);
  assert.equal(state.lastAgent, 'codex');
  assert.equal(state.task, 'Fix dashboard continuity');
  assert.deepEqual(state.nextSteps, ['Run the complete dashboard checks']);
  assert.deepEqual(state.verification, ['handoff tests passed']);
});

test('complete closes the task while retaining its audit summary', () => {
  const harness = createHarness();
  harness.run(['claim', 'qclaw', 'Publish customer update']);
  harness.run(['complete', 'qclaw', 'Published and verified', 'all checks passed']);
  const state = JSON.parse(fs.readFileSync(harness.statePath, 'utf8'));

  assert.equal(state.status, 'completed');
  assert.equal(state.activeAgent, null);
  assert.equal(state.lastAgent, 'qclaw');
  assert.equal(state.summary, 'Published and verified');
  assert.deepEqual(state.verification, ['all checks passed']);
});

test('forced claim provides an explicit stale-owner recovery path', () => {
  const harness = createHarness();
  harness.run(['claim', 'qclaw', 'Old task']);
  harness.run(['claim', 'codex', 'Recovered task', '--force']);
  const state = JSON.parse(fs.readFileSync(harness.statePath, 'utf8'));

  assert.equal(state.status, 'in_progress');
  assert.equal(state.activeAgent, 'codex');
  assert.equal(state.lastAgent, 'qclaw');
  assert.equal(state.task, 'Recovered task');
  assert.match(state.summary, /forced takeover/i);
});
