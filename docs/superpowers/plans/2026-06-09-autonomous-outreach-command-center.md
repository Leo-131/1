# Autonomous Outreach Command Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-blocking customer-development workflow where Codex scores and automatically approves tasks, QClaw performs verified like-follow-send actions, and the app presents a focused command center with separate customer, SEO, experiment, and audit views.

**Architecture:** Add pure CommonJS/browser-compatible domain modules for scoring, approval, state transitions, and attribution. Keep the existing embedded contact payload readable, but move new behavior and UI into external modules loaded by the current HTML. Add a separate QClaw runner that consumes only approved task contracts and emits append-only evidence results; do not weaken the existing verified sender.

**Tech Stack:** Node.js built-in test runner, browser JavaScript and CSS, existing static/Electron/Vercel delivery, Python `unittest`, Chrome CDP on port 28999.

---

## File Structure

- Create `outreach-dashboard/outreach-engine.js`: scoring, hard gates, state transitions, recovery decisions, and task normalization.
- Create `outreach-dashboard/outreach-analytics.js`: keyword funnel metrics, template metrics, and timestamped trend normalization.
- Create `outreach-dashboard/autonomous-outreach-data.js`: browser-ready task, audit, keyword, trend, and experiment seed data.
- Create `outreach-dashboard/command-center.css`: command-center shell, navigation, workspace, tables, charts, audit, and responsive styles.
- Create `outreach-dashboard/command-center.js`: view routing, rendering, customer detail navigation, and workflow simulation.
- Modify `outreach-dashboard/outreach-dashboard.html`: load the new modules and replace the single-page content stack with the app shell.
- Modify `outreach-dashboard/prepare-vercel-output.js`: copy the new browser assets to `public`.
- Modify `outreach-dashboard/service-worker.js`: cache and version the new assets.
- Modify `outreach-dashboard/package.json`: include new syntax and unit tests in `npm run check`.
- Create `tests/outreach-engine.test.js`: domain engine tests.
- Create `tests/outreach-analytics.test.js`: funnel and trend tests.
- Create `tests/command-center.test.js`: static application contract tests.
- Create `tools/qclaw/autonomous_instagram_runner.py`: exact-profile like-follow-wait-send executor.
- Create `tools/qclaw/autonomous_outreach_contract.py`: task and evidence validation shared by QClaw.
- Create `tools/qclaw/test_autonomous_outreach.py`: executor contract and pure helper tests.
- Create `tools/qclaw/sync_autonomous_results.js`: append-only evidence synchronization into dashboard data.
- Create `tests/fixtures/autonomous-results.json`: deterministic synchronization fixture.
- Create `tests/sync-autonomous-results.test.js`: append-only synchronization tests.
- Modify `tools/qclaw/README.md`: document dry run, canary, batch, and synchronization commands.
- Modify `AGENT_HANDOFF.json`: record ownership, checkpoints, verification, and next action.
- Append `../CODEX_OUTREACH_ARCHIVE.md`: record implementation and handoff history in the shared `New project` workspace.

### Task 1: Domain State Machine And European Scoring

**Files:**
- Create: `outreach-dashboard/outreach-engine.js`
- Create: `tests/outreach-engine.test.js`
- Modify: `outreach-dashboard/package.json`

- [ ] **Step 1: Write failing scoring and hard-gate tests**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  STATES,
  calculateDevelopmentScore,
  evaluateApproval,
  nextRecoveryDecision,
  transitionTask,
} = require('../outreach-dashboard/outreach-engine.js');

test('European open-market buyer receives weighted score components', () => {
  const result = calculateDevelopmentScore({
    region: 'Europe',
    marketStatus: '开放',
    role: 'Senior Buyer Outdoor',
    industry: 'Outdoor',
    identityConfidence: 100,
    keywordIntent: 80,
    trend: { status: 'available', index: 70, direction: 'rising' },
    history: { replied: true, templateRate: 0.12 },
  });
  assert.equal(result.total, 94);
  assert.deepEqual(Object.keys(result.components), [
    'market', 'icp', 'identity', 'intent', 'trend', 'history',
  ]);
});

test('exclusive distributor and duplicate campaign are hard exclusions', () => {
  for (const prospect of [
    { marketStatus: '独代占用', exactTargetVerified: true },
    { marketStatus: '开放', exactTargetVerified: true, duplicateCampaign: true },
  ]) {
    const decision = evaluateApproval({ prospect, score: { total: 100 }, message: 'Valid message' });
    assert.equal(decision.approved, false);
    assert.equal(decision.terminalAction, 'auto_skipped');
  }
});

test('two optimization attempts lead to automatic reroute or skip', () => {
  assert.deepEqual(nextRecoveryDecision({ attempts: 0, failures: ['missing_profile'] }), {
    action: 'enrich_profile', attempts: 1,
  });
  assert.deepEqual(nextRecoveryDecision({ attempts: 1, failures: ['message_mismatch'] }), {
    action: 'rewrite_message', attempts: 2,
  });
  assert.equal(nextRecoveryDecision({ attempts: 2, verifiedAlternateChannel: true }).action, 'reroute');
  assert.equal(nextRecoveryDecision({ attempts: 2, verifiedAlternateChannel: false }).action, 'auto_skipped');
});

test('state transitions reject stale or invalid writes', () => {
  assert.throws(() => transitionTask(
    { state: STATES.PROFILE_SCORED, version: 2 },
    { state: STATES.SENT_CONFIRMED, expectedVersion: 1 },
  ), /stale/i);
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```powershell
node --test tests/outreach-engine.test.js
```

Expected: `MODULE_NOT_FOUND` for `outreach-engine.js`.

- [ ] **Step 3: Implement the pure domain engine**

Export:

```js
const STATES = Object.freeze({
  PROFILE_SCORED: 'profile_scored',
  TARGET_VERIFIED: 'target_verified',
  POST_LIKED: 'post_liked',
  ACCOUNT_FOLLOWED: 'account_followed',
  APPROVAL_PENDING: 'approval_pending',
  APPROVED: 'approved',
  SENT_CONFIRMED: 'sent_confirmed',
  OUTCOME_PENDING: 'outcome_pending',
  REROUTED: 'rerouted',
  SCHEDULED: 'scheduled',
  AUTO_SKIPPED: 'auto_skipped',
  SEND_UNCONFIRMED: 'send_unconfirmed',
});
```

Implement component caps of `25/25/15/15/10/10`, hard exclusions for exact identity, prohibited URLs, duplicate campaign, cooldown, and exclusive distribution, plus versioned transition validation. Treat unavailable trend data as zero trend points with status preserved, never as an inferred value.

- [ ] **Step 4: Run engine tests**

Run:

```powershell
node --test tests/outreach-engine.test.js
```

Expected: all tests pass.

- [ ] **Step 5: Add the test to the project check**

Add to `package.json`:

```json
"check:domain": "node --test ../tests/outreach-engine.test.js"
```

Invoke `check:domain` before the existing syntax checks.

- [ ] **Step 6: Commit**

```powershell
git add outreach-dashboard/outreach-engine.js tests/outreach-engine.test.js outreach-dashboard/package.json
git commit -m "Add autonomous outreach decision engine"
```

### Task 2: SEO, Google Trends, And Conversion Attribution

**Files:**
- Create: `outreach-dashboard/outreach-analytics.js`
- Create: `tests/outreach-analytics.test.js`

- [ ] **Step 1: Write failing analytics tests**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  normalizeTrendRecord,
  buildKeywordMetrics,
  buildTemplateMetrics,
} = require('../outreach-dashboard/outreach-analytics.js');

test('missing trend data remains unavailable', () => {
  assert.deepEqual(normalizeTrendRecord(null), {
    status: 'data_unavailable',
    region: '',
    period: '',
    collectedAt: '',
    index: null,
    direction: 'unknown',
  });
});

test('keyword metrics preserve sample size and funnel rates', () => {
  const result = buildKeywordMetrics([
    { keyword: 'ultralight camping gear', approvedAt: 'x', sentAt: 'x', repliedAt: 'x' },
    { keyword: 'ultralight camping gear', approvedAt: 'x', sentAt: 'x' },
  ]);
  assert.equal(result[0].sampleSize, 2);
  assert.equal(result[0].replyRate, 0.5);
});

test('template metrics count only confirmed sends', () => {
  const result = buildTemplateMetrics([
    { templateId: 'margin-v1', sendStatus: 'sent_confirmed', repliedAt: 'x' },
    { templateId: 'margin-v1', sendStatus: 'send_unconfirmed', repliedAt: 'x' },
  ]);
  assert.equal(result[0].confirmedSends, 1);
  assert.equal(result[0].replies, 1);
});
```

- [ ] **Step 2: Run and verify failure**

```powershell
node --test tests/outreach-analytics.test.js
```

Expected: module missing.

- [ ] **Step 3: Implement analytics functions**

Use explicit funnel fields:

```js
const FUNNEL_FIELDS = [
  'discoveredAt',
  'profiledAt',
  'approvedAt',
  'sentAt',
  'repliedAt',
  'contactCapturedAt',
  'opportunityAt',
];
```

Group by normalized keyword and template ID, return raw counts, sample size, and rates. Trend records require `region`, `period`, `collectedAt`, numeric `index` from 0 to 100, and `direction` in `rising|stable|falling|unknown`.

- [ ] **Step 4: Run analytics and combined domain tests**

```powershell
node --test tests/outreach-engine.test.js tests/outreach-analytics.test.js
```

Expected: all pass.

- [ ] **Step 5: Expand the project domain check**

Change `check:domain` to:

```json
"check:domain": "node --test ../tests/outreach-engine.test.js ../tests/outreach-analytics.test.js"
```

- [ ] **Step 6: Commit**

```powershell
git add outreach-dashboard/outreach-analytics.js tests/outreach-analytics.test.js
git commit -m "Add outreach keyword and trend attribution"
```

### Task 3: Canonical Task And QClaw Evidence Contract

**Files:**
- Create: `tools/qclaw/autonomous_outreach_contract.py`
- Create: `tools/qclaw/test_autonomous_outreach.py`
- Create: `outreach-dashboard/autonomous-outreach-data.js`

- [ ] **Step 1: Write failing Python contract tests**

```python
import unittest
from autonomous_outreach_contract import (
    approved_task,
    validate_evidence,
    random_delay_seconds,
)

class AutonomousOutreachContractTests(unittest.TestCase):
    def test_only_approved_exact_targets_are_executable(self):
        task = approved_task({
            "task_id": "ig-campmor-1",
            "state": "approved",
            "platform": "instagram",
            "target_url": "https://www.instagram.com/campmor/",
            "account_handle": "campmor",
            "approved_message": "Hello Campmor team",
            "approval_version": 3,
        })
        self.assertEqual(task["account_handle"], "campmor")

    def test_delay_is_bounded(self):
        for _ in range(100):
            self.assertIn(random_delay_seconds(), range(30, 121))

    def test_unconfirmed_message_is_not_sent(self):
        result = validate_evidence({
            "targetMatched": True,
            "messageVisible": False,
            "inputCleared": True,
        })
        self.assertEqual(result["status"], "send_unconfirmed")
```

- [ ] **Step 2: Run and verify failure**

```powershell
E:\Python\python.exe -m unittest -v test_autonomous_outreach.py
```

Working directory: `tools/qclaw`.

Expected: import failure.

- [ ] **Step 3: Implement strict task and evidence validation**

The approved task contract must include:

```python
REQUIRED_APPROVED_FIELDS = {
    "task_id", "state", "platform", "target_url", "account_handle",
    "approved_message", "approval_version",
}
```

Reject non-Instagram tasks in the Instagram runner, mismatched handle URLs, missing approved messages, and any state other than `approved`. Evidence validation returns `sent_confirmed` only when target, message visibility, and cleared input all pass.

- [ ] **Step 4: Add browser seed data**

Define `window.AUTONOMOUS_OUTREACH_DATA` with:

```js
{
  schemaVersion: 1,
  tasks: [],
  audit: [],
  keywordTrends: [],
  experiments: [],
}
```

Populate it from the seven confirmed June 9 results and current verified plan without inventing trend indexes. Missing trends use `status: "data_unavailable"`.

- [ ] **Step 5: Run tests**

```powershell
E:\Python\python.exe -m unittest -v test_autonomous_outreach.py test_outreach_safety.py
```

Expected: all pass.

- [ ] **Step 6: Commit**

```powershell
git add tools/qclaw/autonomous_outreach_contract.py tools/qclaw/test_autonomous_outreach.py outreach-dashboard/autonomous-outreach-data.js
git commit -m "Define autonomous outreach task contract"
```

### Task 4: QClaw Like-Follow-Wait-Send Runner

**Files:**
- Create: `tools/qclaw/autonomous_instagram_runner.py`
- Modify: `tools/qclaw/test_autonomous_outreach.py`
- Modify: `tools/qclaw/README.md`

- [ ] **Step 1: Add failing pure-helper tests**

Test that:

- Only a post link belonging to the exact verified account is selectable.
- A post must contain a relevant outdoor/product signal when multiple recent posts exist.
- `already_following` is accepted as evidence.
- The runner preserves the exact `approved_message` byte-for-byte.
- Any like, follow, target, or send ambiguity stops that task without marking sent.
- Batch mode continues after `auto_skipped` but stops after `send_unconfirmed`.

- [ ] **Step 2: Run and verify failure**

```powershell
E:\Python\python.exe -m unittest -v test_autonomous_outreach.py
```

Expected: missing helper or assertion failures.

- [ ] **Step 3: Implement dry-run-first executor**

Implement CLI:

```text
autonomous_instagram_runner.py TASKS_JSON
  --dry-run
  --task-id ID
  --all-approved
  --confirm-live-actions
  --results RESULTS_JSON
```

Execution order:

1. Validate approved contract.
2. Navigate to exact target URL and verify handle in URL and page.
3. Open a recent relevant post belonging to that profile.
4. Like only if currently unliked; record `already_liked` otherwise.
5. Return to exact profile and follow only if not already following.
6. Wait `random_delay_seconds()` from 30 to 120.
7. Revalidate exact profile and approval version.
8. Open message composer and insert the approved message without rewriting.
9. Send and require visible message plus cleared input.
10. Append evidence after every stage.

Do not use platform search or first-result selection. Do not fall back to a different profile.

- [ ] **Step 4: Run unit and dry-run tests**

```powershell
E:\Python\python.exe -m unittest -v test_autonomous_outreach.py test_outreach_safety.py
E:\Python\python.exe autonomous_instagram_runner.py output\approved_tasks_fixture.json --dry-run --all-approved
```

Expected: tests pass; dry run emits no external actions.

- [ ] **Step 5: Document controlled live execution**

Add exact commands for:

```powershell
E:\Python\python.exe autonomous_instagram_runner.py approved_tasks.json --task-id TASK_ID --confirm-live-actions
E:\Python\python.exe autonomous_instagram_runner.py approved_tasks.json --all-approved --confirm-live-actions
```

Require one canary before batch and a clean results file.

- [ ] **Step 6: Commit**

```powershell
git add tools/qclaw/autonomous_instagram_runner.py tools/qclaw/test_autonomous_outreach.py tools/qclaw/README.md
git commit -m "Add verified Qclaw engagement runner"
```

### Task 5: Result Synchronization And Immutable Audit

**Files:**
- Create: `tools/qclaw/sync_autonomous_results.js`
- Create: `tests/sync-autonomous-results.test.js`
- Create: `tests/fixtures/autonomous-results.json`
- Modify: `outreach-dashboard/autonomous-outreach-data.js`

- [ ] **Step 1: Write failing synchronization tests**

Use a temporary fixture and assert:

- Existing audit entries are retained.
- The same `task_id + approval_version + stage` is idempotent.
- `sent_confirmed` updates the task; `send_unconfirmed` never becomes sent.
- Stale approval versions are recorded as rejected audit events.
- Keyword and template funnel timestamps update only from confirmed evidence.

- [ ] **Step 2: Run and verify failure**

```powershell
node --test tests/sync-autonomous-results.test.js
```

- [ ] **Step 3: Implement append-only synchronization**

CLI:

```powershell
node tools/qclaw/sync_autonomous_results.js RESULTS_JSON outreach-dashboard/autonomous-outreach-data.js
```

Write through a temporary file and rename only after parsing and validation succeed. Preserve schema version and deterministic ordering.

- [ ] **Step 4: Run tests and fixture sync**

```powershell
node --test tests/sync-autonomous-results.test.js
node tools/qclaw/sync_autonomous_results.js tests/fixtures/autonomous-results.json outreach-dashboard/autonomous-outreach-data.js --dry-run
```

- [ ] **Step 5: Commit**

```powershell
git add tools/qclaw/sync_autonomous_results.js tests/sync-autonomous-results.test.js outreach-dashboard/autonomous-outreach-data.js
git commit -m "Sync Qclaw evidence into outreach audit"
```

### Task 6: Command-Center App Shell

**Files:**
- Create: `outreach-dashboard/command-center.css`
- Create: `outreach-dashboard/command-center.js`
- Create: `tests/command-center.test.js`
- Modify: `outreach-dashboard/outreach-dashboard.html`

- [ ] **Step 1: Write failing static UI contract tests**

Assert the HTML loads:

```js
[
  'outreach-engine.js',
  'outreach-analytics.js',
  'autonomous-outreach-data.js',
  'command-center.css',
  'command-center.js',
]
```

Assert navigation labels exist, the legacy contact table is hosted under `Customer Appendix`, and customer links use `?view=customer&contact=...` or `target="_blank"` instead of replacing the shell.

- [ ] **Step 2: Run and verify failure**

```powershell
node --test tests/command-center.test.js
```

- [ ] **Step 3: Build the application shell**

Create:

```html
<div class="app-shell">
  <aside class="app-sidebar" id="app-sidebar"></aside>
  <main class="app-main" id="app-view"></main>
  <aside class="decision-rail" id="decision-rail"></aside>
</div>
```

Use URL routing:

```text
?view=workspace
?view=queue
?view=customers
?view=seo
?view=experiments
?view=audit
?view=settings
?view=customer&contact=ENCODED_KEY
```

The default view is `workspace`. Keep a hint of the queue visible without scrolling. Use quiet white/gray surfaces, restrained blue and green accents, radii no larger than 8px, and no nested cards.

- [ ] **Step 4: Implement complete views**

- Workspace: queue counters, current prospect, seven-stage route, approved message, next action, compact upcoming queue.
- Decision rail: six score components, hard-gate result, attempts, exact profile and execution evidence.
- Customer Appendix: move the existing full table and filters into this view.
- SEO Trends: keyword funnel table plus comparative bars; unavailable trends explicitly display unavailable.
- Template Experiments: sample size, confirmed sends, replies, contact captures, and rates.
- Automation Audit: immutable event table with task, stage, agent, timestamp, evidence, and result.
- Settings: thresholds, delay range fixed to 30–120 seconds, maximum optimization attempts fixed to two, and read-only safety gates.

Use Lucide only if introduced as a local dependency; otherwise retain text navigation for this static first release rather than drawing custom icons.

- [ ] **Step 5: Make customer navigation non-destructive**

Customer rows and current-customer links call:

```js
window.open(buildViewUrl('customer', { contact: recordKey(record) }), '_blank', 'noopener');
```

The detail page reuses the shell and shows profile, timeline, scoring, approved message, and evidence.

- [ ] **Step 6: Run UI contract and existing checks**

```powershell
node --test tests/command-center.test.js
npm.cmd run check
```

Expected: all pass.

- [ ] **Step 7: Expand the project domain check**

Change `check:domain` to:

```json
"check:domain": "node --test ../tests/outreach-engine.test.js ../tests/outreach-analytics.test.js ../tests/command-center.test.js ../tests/sync-autonomous-results.test.js"
```

- [ ] **Step 8: Commit**

```powershell
git add outreach-dashboard/command-center.css outreach-dashboard/command-center.js outreach-dashboard/outreach-dashboard.html tests/command-center.test.js
git commit -m "Build outreach command center interface"
```

### Task 7: Delivery, Caching, And Cross-Computer Compatibility

**Files:**
- Modify: `outreach-dashboard/prepare-vercel-output.js`
- Modify: `outreach-dashboard/service-worker.js`
- Modify: `outreach-dashboard/package.json`
- Modify: `outreach-dashboard/build-portable-app.js`

- [ ] **Step 1: Add assets to build and cache lists**

Include:

```text
outreach-engine.js
outreach-analytics.js
autonomous-outreach-data.js
command-center.css
command-center.js
```

Increment the service-worker cache name.

- [ ] **Step 2: Run syntax, build, and diff checks**

```powershell
npm.cmd run check
npm.cmd run vercel-build
git diff --check
```

- [ ] **Step 3: Start the LAN server**

```powershell
$env:HOST='0.0.0.0'
$env:PORT='4174'
npm.cmd run serve
```

Verify:

```powershell
curl.exe -I http://127.0.0.1:4174/outreach-dashboard.html
curl.exe -I http://192.168.3.170:4174/outreach-dashboard.html
```

Expected: HTTP 200 for both when that LAN address is assigned to this computer.

- [ ] **Step 4: Commit**

```powershell
git add outreach-dashboard/prepare-vercel-output.js outreach-dashboard/service-worker.js outreach-dashboard/package.json outreach-dashboard/build-portable-app.js outreach-dashboard/public
git commit -m "Ship command center assets across app targets"
```

### Task 8: Browser Verification And Controlled Canary

**Files:**
- Modify: `AGENT_HANDOFF.json`
- Append: `../CODEX_OUTREACH_ARCHIVE.md`

- [ ] **Step 1: Verify desktop views in the in-app browser**

Open:

```text
http://127.0.0.1:4174/outreach-dashboard.html?view=workspace
```

Check:

- Sidebar stays visible.
- Current task and upcoming queue fit without overlap.
- Decision rail shows six components.
- Every navigation item opens its own view.
- A customer opens a new tab and the original workspace remains.
- Unavailable trend data is not shown as a numeric estimate.

- [ ] **Step 2: Verify mobile behavior**

At approximately `390x844`, confirm:

- Sidebar becomes a compact navigation control.
- Decision rail moves below the active task.
- Tables scroll horizontally without clipping buttons.
- Text does not overlap or resize layout controls.

- [ ] **Step 3: Run complete automated verification**

```powershell
npm.cmd run check
npm.cmd run vercel-build
E:\Python\python.exe -m unittest -v test_outreach_safety.py test_autonomous_outreach.py
git diff --check
```

- [ ] **Step 4: Run one dry-run task**

Use a verified approved fixture and confirm the exact profile, selected post, follow state, delay, approval version, and approved message without external actions.

- [ ] **Step 5: Request action-time confirmation for one live canary**

Immediately before live like/follow/send, state the exact Instagram account, exact message, and external actions. Run only after confirmation. Require `sent_confirmed` evidence before enabling a batch.

- [ ] **Step 6: Update handoff and archive**

Record:

- Current commit.
- Tests and browser checks.
- Canary status.
- QClaw results path.
- Whether batch mode is enabled.
- Any automatic skips and reasons.

- [ ] **Step 7: Rebase, push, and verify remote**

Because QClaw may push concurrently:

```powershell
git fetch origin
git rebase origin/main
npm.cmd run check
git push origin main
git ls-remote origin refs/heads/main
```

Do not force push. If QClaw changes the same generated data, preserve its newest data and reapply validated audit entries.

## Final Verification Checklist

- [ ] All Node tests pass.
- [ ] All Python QClaw tests pass.
- [ ] `npm.cmd run check` passes.
- [ ] `npm.cmd run vercel-build` passes.
- [ ] Local and LAN URLs return 200.
- [ ] Workspace, customer appendix, SEO, experiments, audit, settings, and customer detail render.
- [ ] Customer detail opens without erasing the workspace.
- [ ] QClaw cannot execute an unapproved or mismatched task.
- [ ] Delay is always 30 to 120 seconds.
- [ ] Two failed optimization attempts produce reroute, schedule, or automatic skip.
- [ ] Unconfirmed sends never count as sent.
- [ ] Trend data is timestamped or explicitly unavailable.
- [ ] Remote Git SHA matches the pushed local commit.
