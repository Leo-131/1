const fs = require('fs');

const html = fs.readFileSync('outreach-dashboard.html', 'utf8');
const scripts = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1]);
const handleKpiCard = html.match(/function handleKpiCard\(key\)\{([\s\S]*?)\n\}/);

for (const script of scripts) {
  new Function(script);
}

if (!html.includes('function openKpiDetailPage(key)')) {
  throw new Error('KPI cards must open their details in a new page');
}

const preload = fs.readFileSync('preload.js', 'utf8');
const main = fs.readFileSync('main.js', 'utf8');
const commandCenter = fs.readFileSync('command-center.js', 'utf8');
if (!preload.includes('runDailyAutomationQueue') || !main.includes("run-daily-automation-queue")) {
  throw new Error('Codex Chrome daily queue bridge is missing');
}
if (!main.includes('scheduledExecutable') || !main.includes('queueSource')) {
  throw new Error('Codex Chrome daily queue must fallback to scheduledLater executable tasks');
}
if (!main.includes('parallelLimit') || !main.includes('parallel-batches') || !commandCenter.includes('并行队列')) {
  throw new Error('Codex Chrome daily queue must use controlled parallel batches');
}

if (!html.includes("new URLSearchParams(window.location.search).get('kpi')")) {
  throw new Error('KPI detail pages must restore the selected card from the URL');
}

if (!handleKpiCard || !handleKpiCard[1].includes('openKpiDetailPage(key)')) {
  throw new Error('KPI card click is not routed to the new-page handler');
}

if (handleKpiCard[1].includes('startAutomation(') || handleKpiCard[1].includes('openActionPanel(')) {
  throw new Error('KPI card click still replaces the current dashboard with an in-page panel');
}

global.window = global;
require('./country-market-data.js');
require('./daily-outreach-tasks.js');
const dailyAutomation = require('./daily-automation-runner.js');

if (COUNTRY_ALIASES.usa !== '美国') {
  throw new Error('country aliases failed');
}

if (!DAILY_OUTREACH_TASKS || DAILY_OUTREACH_TASKS.total < 10) {
  throw new Error('daily outreach tasks failed');
}

if ((DAILY_OUTREACH_TASKS.tasks || []).some(task => task.platform === 'Facebook' && task.facebookStatus === 'not_verified_do_not_use')) {
  throw new Error('unverified facebook task leaked');
}

const sampleContext = {
  now: Date.now(),
  profiles: {},
  resultsByTask: new Map(),
};
const lowIcp = dailyAutomation.classifyTask({ platform: 'Instagram', name: 'low', fitScore: 70 }, sampleContext);
if (lowIcp.action !== 'retain_low_icp') {
  throw new Error('daily automation must retain ICP <= 70 instead of developing it');
}

const openMarket = dailyAutomation.classifyTask({
  platform: 'Instagram',
  name: 'open-market',
  fitScore: 90,
  marketScore: 4,
  marketStatus: '可开拓',
  verifiedTargetUrl: 'https://www.instagram.com/openmarket/',
}, sampleContext);
const exclusiveMarket = dailyAutomation.classifyTask({
  platform: 'Instagram',
  name: 'exclusive-market',
  fitScore: 90,
  marketScore: 4,
  marketStatus: '独代占用',
  verifiedTargetUrl: 'https://www.instagram.com/exclusivemarket/',
}, sampleContext);
if (openMarket.action !== 'develop' || exclusiveMarket.action !== 'skip_exclusive_agency') {
  throw new Error('daily automation must prioritize open agency markets and skip exclusive agency regions');
}
if (openMarket.priorityScore <= exclusiveMarket.priorityScore) {
  throw new Error('open agency markets must outrank exclusive agency regions');
}

if (!main.includes('openWithCodexChrome') || !main.includes('codex-chrome-cdp')) {
  throw new Error('Codex Chrome CDP bridge is missing');
}

if (!main.includes('const chromeOpen = await openWithCodexChrome(item.url)')) {
  throw new Error('Daily automation queue must open exact targets through Codex Chrome');
}

if (!main.includes("executionPhase: 'no_executable_tasks'")
  || !main.includes('customerDevelopmentPerformed: false')
  || !main.includes('chromeOpened: false')) {
  throw new Error('No-executable daily runs must be recorded as no browser/customer development');
}

if (!main.includes("executionPhase: browserUsed ? 'browser_execution' : 'no_browser_execution'")
  || !main.includes('customerDevelopmentPerformed: realDevelopmentCount > 0')
  || !main.includes("transport.browserTransportUsed === 'cdp'")) {
  throw new Error('Browser-open daily runs must still require real customer development before reporting development');
}

if (!commandCenter.includes('No Chrome/browser development was performed')
  || !commandCenter.includes('No customer development was performed')) {
  throw new Error('Dashboard must not report skipped/no-browser runs as customer development');
}

if (!main.includes('function executionRecoveryHint(')
  || !main.includes('function executionRecoveryActions(')
  || !main.includes('function executionBlockerCounts(')
  || !main.includes('function executionQueueGoalStatus(')
  || !main.includes('recoveryActions')
  || !main.includes('blockerCounts')
  || !main.includes('queueGoalStatus')
  || !main.includes('dailyQueueGoalVisibility')
  || !main.includes("reason: 'daily_queue_goal_not_reached'")
  || !main.includes("action: 'Refill high-ICP customer pool'")
  || !main.includes("requiredEnv: ['WEBSITE_MARKETING_FILE', 'MARKETING_ATTACHMENT_PATH']")
  || !main.includes("action: 'Verify official social profile URL'")
  || !main.includes("description: 'Add a verified Facebook or Instagram profile URL before retrying social outreach.'")
  || !main.includes("action: 'Complete Google social channel verification'")
  || !main.includes("description: 'Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach.'")
  || !main.includes("action: 'Verify profile accessibility'")
  || !main.includes("description: 'Open the official profile manually or switch to another verified channel before retrying.'")
  || !main.includes("reason: 'browser_execution_timeout'")
  || !main.includes("action: 'Reduce browser execution batch'")
  || !main.includes("description: 'Retry with a smaller DAILY_EXECUTE_LIMIT or inspect the current social page that timed out.'")
  || !main.includes('formatExecutionBlockerStatus(blockerSummary)')
  || !commandCenter.includes('function executionRecoveryCards(')
  || !commandCenter.includes('function executionBlockerBucketRows(')
  || !commandCenter.includes('latestExecution.blockerCounts')
  || !commandCenter.includes('latestExecution.queueGoalStatus')
  || !commandCenter.includes('latestSystemVisibility.dailyQueueGoal')
  || !commandCenter.includes('queueGoal.potentialPool')
  || !commandCenter.includes('queueGoal')
  || !commandCenter.includes('daily_queue_goal')
  || !commandCenter.includes("action.requiredEnv.join(' / ')")
  || !commandCenter.includes('cc-recovery-actions')
  || !commandCenter.includes('latestExecution.recoveryHint')) {
  throw new Error('Dashboard checks must cover execution recovery hints for no-browser blocker runs');
}

console.log('checks ok');
