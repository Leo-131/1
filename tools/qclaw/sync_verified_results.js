const fs = require('fs');
const path = require('path');

const resultsPath = process.argv[2];
const dashboardDir = process.argv[3] || path.resolve(__dirname, '..', '..', 'outreach-dashboard');
const runDate = process.argv[4] || new Date().toISOString().slice(0, 10);

if (!resultsPath) {
  throw new Error('Usage: node sync_verified_results.js <results.json> [dashboard-dir] [YYYY-MM-DD]');
}

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'))
  .filter(item => item.status === 'sent_confirmed');
const resultsByHandle = new Map(results.map(item => [String(item.account_handle).toLowerCase(), item]));
const planPath = path.join(dashboardDir, 'daily-outreach-fb-ins-2026-06-03.json');
const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));

let updated = 0;
for (const task of plan.tasks) {
  const result = resultsByHandle.get(String(task.name || '').toLowerCase());
  if (!result) continue;
  task.state = '已跟进';
  task.action = 'Qclaw verified-profile follow-up sent and confirmed; wait for reply before another touch.';
  task.lastKnownTouch = `Confirmed Instagram follow-up sent ${result.timestamp}`;
  task.lastAutomationAt = result.timestamp;
  task.automationStatus = 'sent_confirmed';
  task.verifiedTargetUrl = result.target_url;
  updated += 1;
}

plan.generatedAt = new Date().toISOString();
plan.strategy = 'Verified-profile-only outreach. Exact Instagram URL and post-send confirmation are required.';
fs.writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`);
fs.writeFileSync(
  path.join(dashboardDir, 'daily-outreach-tasks.js'),
  `window.DAILY_OUTREACH_TASKS = ${JSON.stringify(plan, null, 2)};\n`
);

const run = {
  generatedAt: new Date().toISOString(),
  date: runDate,
  agent: 'qclaw',
  mode: 'verified-profile-followup',
  total: results.length,
  confirmed: results.length,
  rows: results.map((item, index) => ({
    rank: index + 1,
    platform: 'ins',
    name: item.account_handle,
    company: item.company,
    url: item.target_url,
    state: 'sent_confirmed',
    timestamp: item.timestamp,
    messageVisible: Boolean(item.confirmation && item.confirmation.messageVisible),
    inputCleared: Boolean(item.confirmation && item.confirmation.inputCleared),
    message: item.message
  }))
};

const runJson = path.join(dashboardDir, `today-automation-run-${runDate}.json`);
const runCsv = path.join(dashboardDir, `today-automation-run-${runDate}.csv`);
fs.writeFileSync(runJson, `${JSON.stringify(run, null, 2)}\n`);

const columns = [
  'rank', 'platform', 'name', 'company', 'url', 'state', 'timestamp',
  'messageVisible', 'inputCleared', 'message'
];
const csvEscape = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
fs.writeFileSync(
  runCsv,
  [
    columns.join(','),
    ...run.rows.map(row => columns.map(column => csvEscape(row[column])).join(','))
  ].join('\n') + '\n'
);

console.log(JSON.stringify({ updated, runJson, runCsv }, null, 2));
