const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'outreach-dashboard');
const html = fs.readFileSync(path.join(root, 'outreach-dashboard.html'), 'utf8');
const publicIndexHtml = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'command-center.js'), 'utf8');
const analyticsJs = fs.readFileSync(path.join(root, 'outreach-analytics.js'), 'utf8');
const serviceWorkerJs = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');
const portableBuilder = fs.readFileSync(path.join(root, 'build-portable-app.js'), 'utf8');

test('dashboard loads autonomous command center assets', () => {
  for (const asset of [
    'outreach-engine.js',
    'outreach-analytics.js',
    'autonomous-outreach-results.js',
    'verified-profile-registry.js',
    'autonomous-outreach-data.js',
    'command-center.css',
    'command-center.js',
  ]) {
    assert.match(html, new RegExp(asset.replace('.', '\\.')));
  }
});

test('command center uses an atomic boot gate so the legacy dashboard never flashes', () => {
  assert.ok(html.includes('<body class="command-center-booting">'));
  assert.ok(html.includes('body.command-center-booting>.header'));
  assert.ok(html.includes('body>.header,body>.container,body>.footer'));
  assert.ok(html.includes('正在加载客户开发系统'));
  assert.ok(js.includes("document.body.classList.remove('command-center-booting')"));
  assert.match(js, /document\.body\.appendChild\(shell\);\s*document\.body\.classList\.remove\('command-center-booting'\)/);
  assert.ok(js.includes("document.body.classList.remove('command-center-active')"));
  assert.ok(js.includes('Command center startup failed'));
  assert.doesNotMatch(js, /\bstatusLabel\(/);
});

test('command center waits for engine dependencies instead of falling back to legacy dashboard', () => {
  assert.ok(js.includes('__commandCenterDependencyRetries'));
  assert.ok(js.includes('window.setTimeout(initializeCommandCenter, 100)'));
  assert.ok(js.includes('已阻止回退到旧模块'));
});

test('command center exposes weekly and monthly reporting controls', () => {
  assert.ok(js.includes("['reports'"));
  assert.ok(js.includes('analytics.buildPeriodReport'));
  assert.ok(js.includes('data-report-type="weekly"'));
  assert.ok(js.includes('data-report-type="monthly"'));
  assert.ok(js.includes('report-period'));
});

test('reporting center supports CSV export and browser print', () => {
  assert.ok(js.includes('exportCurrentReportCsv'));
  assert.ok(js.includes('text/csv;charset=utf-8'));
  assert.ok(js.includes('window.print()'));
});

test('silent daily-plan bootstrap never opens Instagram or another platform', () => {
  assert.ok(html.includes('loadDailyOutreachPlan({auto:true})'));
  assert.match(html, /function loadDailyOutreachPlan\(options\)[\s\S]*?if\(!opts\.auto\) openCurrentAutomationTask\(\);[\s\S]*?return true;/);
  assert.match(html, /function launchCustomerAcquisition\(platform,tasks\)\{\s*openCurrentAutomationTask\(\);/);
});

test('portable desktop app inherits the package version', () => {
  assert.ok(portableBuilder.includes('sourcePackage.version'));
  assert.ok(!portableBuilder.includes('version: "18.4.0"'));
});

test('command center contains separated operational views', () => {
  for (const viewId of ['reports', 'workspace', 'queue', 'customers', 'analysis', 'seo', 'experiments', 'audit', 'settings']) {
    assert.ok(js.includes(`['${viewId}'`), viewId);
  }
  assert.ok(publicIndexHtml.includes('<body class="command-center-booting">'));
  assert.ok(publicIndexHtml.includes('command-center.js?v=20260713-okki-restore'));
});

test('customer detail opens in a new tab without replacing the shell', () => {
  assert.match(js, /target="_blank"/);
  assert.match(js, /urlFor\('customer'/);
  assert.ok(js.includes("requestedView === 'customer'"));
  assert.ok(js.includes('command-center-shell'));
});

test('customer detail includes global channel analysis template', () => {
  for (const token of [
    'Global Customer Analysis Dashboard V3.0',
    'Annual Potential',
    'CRM Pipeline',
    'Dashboard KPI',
    'New Leads / Week',
    'Development Cycle',
    'Sales Strategy',
  ]) assert.ok(js.includes(token), token);
});

test('customer detail exposes sales dossier and verified channel matrix', () => {
  for (const token of [
    'Sales Intelligence Dossier',
    'Verified Channel Matrix',
    'Broken social links are marked for reroute',
    'Buyer Persona',
    'Likely Product Fit',
    'Google Contact Search',
    'Public Email',
    'Vendor / Contact Portal',
    'Data Sources',
    'mailto:',
  ]) assert.ok(js.includes(token), token);
});

test('SEO view exposes conversion evidence and high-intent keyword opportunities', () => {
  assert.ok(js.includes('analytics.buildKeywordOpportunities'));
  assert.ok(js.includes('keyword-opportunity'));
  assert.ok(analyticsJs.includes('trends.google.com'));
  assert.ok(js.includes('sampleSize'));
});

test('command center opens verified platform URLs and exposes assisted automation', () => {
  assert.ok(js.includes('verifiedTargetUrl'));
  assert.ok(js.includes('openVerifiedCustomer'));
  assert.ok(js.includes('runGlmDirect'));
  assert.ok(js.includes('EXECUTION_COMPATIBILITY_LABELS'));
  assert.ok(html.includes('Codex Chrome'));
});

test('command center uses Codex decisions and AutoClaw execution on verified URLs', () => {
  assert.ok(js.includes('Codex Decision'));
  assert.ok(js.includes('AutoClaw Execution'));
  assert.ok(js.includes("task.identityStatus === 'verified'"));
  assert.ok(html.includes('Codex Chrome'));
});

test('sent tasks render a completed route ending in outcome pending', () => {
  assert.ok(js.includes("['outcome_pending'"));
  assert.ok(js.includes("task.sendStatus === 'sent_confirmed'"));
  assert.ok(js.includes('stageRoute(task)'));
});

test('AutoClaw buttons explain desktop connection and duplicate-contact blocks', () => {
  assert.ok(js.includes('function autoClawAvailability'));
  assert.ok(js.includes('isInCooldown(task)'));
  assert.ok(js.includes('Desktop app'));
  assert.ok(js.includes('Execution layer is connected'));
});

test('historical follow-up tasks can trigger safe OpenClaw preparation', () => {
  assert.ok(js.includes('OpenClaw Followup'));
  assert.ok(js.includes('Prepare follow-up only'));
  assert.ok(js.includes('glm-direct-prepared'));
  const canRunBlock = js.slice(js.indexOf('function canRunGlm'), js.indexOf('function untouchedTasks'));
  assert.ok(!canRunBlock.includes('&& !task.previouslyContacted'));
  const availabilityBlock = js.slice(js.indexOf('function autoClawAvailability'), js.indexOf('function canRunGlm'));
  assert.ok(availabilityBlock.includes('!followup && localStorage.getItem'));
});

test('today queue separates untouched work from historical follow-ups', () => {
  assert.ok(js.includes('function untouchedTasks'));
  assert.ok(js.includes('function followupTasks'));
  assert.ok(js.includes('function executableDevelopmentTasks'));
  assert.ok(js.includes('function isAutoDevelopmentTask'));
  const executableBlock = js.slice(js.indexOf('function executableDevelopmentTasks'), js.indexOf('function currentTask'));
  assert.ok(executableBlock.includes("latestQueueRows('visibleTodayQueue')"));
  assert.ok(!executableBlock.includes('todayDevelopTasks()'));
  assert.ok(js.includes("query.get('queue') || 'potential'"));
  assert.ok(js.includes("latestQueueRows('visibleTodayQueue')"));
  assert.ok(js.includes("latestQueueRows('dailyPotentialPool')"));
  assert.ok(js.includes("queue: 'untouched'"));
  assert.ok(js.includes("queue: 'followup'"));
});

test('command center customer list restores 18.4 filtering and sorting controls', () => {
  for (const token of [
    'customer-search',
    'customer-platform',
    'customer-status',
    'customer-country',
    'customer-industry',
    'customer-source',
    'customer-touch',
    'customer-sort',
    'applyCustomerFilters',
    'cc-reset',
  ]) assert.ok(js.includes(token), token);
});

test('workspace metric cards navigate to matching filtered content', () => {
  assert.ok(js.includes('cc-kpi-link'));
  assert.ok(js.includes("urlFor('queue', { queue: 'untouched' })"));
  assert.ok(js.includes("urlFor('queue', { queue: 'followup' })"));
  assert.ok(js.includes("urlFor('customers', { touch: 'untouched' })"));
});

test('customer enrichment builds one index instead of rebuilding live queues per contact', () => {
  assert.ok(js.includes('function buildContactEnrichmentIndex'));
  const customerRecordsBlock = js.slice(js.indexOf('function computeCustomerRecords'), js.indexOf('function autoClawConnected'));
  assert.ok(customerRecordsBlock.includes('const enrichmentIndex = buildContactEnrichmentIndex'));
  assert.ok(!customerRecordsBlock.includes('enrichmentForRecord(record)'));
});

test('artifact-derived collections are memoized for responsive module navigation', () => {
  assert.ok(js.includes('const derivedCache = new Map();'));
  assert.ok(js.includes("memoized('latestQueueRows:"));
  assert.ok(js.includes("memoized('liveOperationalRecords'"));
  assert.ok(js.includes("memoized('customerRecords'"));
});

test('recent-touch supports range filtering and ascending or descending sorting', () => {
  for (const token of [
    'customer-touch-time',
    'customer-touch-from',
    'customer-touch-to',
    'touchTime',
    'touchFrom',
    'touchTo',
    "sort === 'lastTouch'",
    'customer-touch-from',
    'customer-touch-to',
  ]) assert.ok(js.includes(token), token);
  assert.ok(js.includes("sort === 'lastTouch'"));
  assert.ok(js.includes('missingTouch'));
});

test('trend unavailability is visible and not presented as a guessed number', () => {
  assert.ok(js.includes('data_unavailable'));
  assert.ok(js.includes('DASHBOARD_COMPATIBILITY_LABELS'));
});

test('all reporting sections use live automation artifacts', () => {
  assert.ok(js.includes('function liveOperationalRecords'));
  assert.ok(js.includes('function liveAuditEvents'));
  assert.ok(js.includes('const reportRecords = liveOperationalRecords();'));
  assert.ok(js.includes('analytics.buildTemplateMetrics(liveOperationalRecords())'));
  assert.ok(js.includes('const events = liveAuditEvents();'));
  assert.ok(js.includes('...liveOperationalRecords()'));
  assert.ok(html.includes('20260714-report-detail-fix'));
  assert.ok(html.includes('ensureCommandCenterModule'));
  assert.ok(html.includes('正在加载客户开发系统'));
  assert.ok(!html.includes('ensureVisibleCommandCenterFallback'));
  assert.ok(!html.includes('System display recovered in fallback mode'));
  assert.ok(!html.includes('Display repair mode'));
  assert.ok(html.includes('commandCenterRecovery'));
  assert.ok(serviceWorkerJs.includes('customer-development-system-v18-7-24-20260714-report-detail-fix'));
});

test('reporting center exposes reply conversion diagnostics and CSV rates', () => {
  assert.ok(js.includes('function replyConversionPanel'));
  assert.ok(js.includes('replyConversionPanel(report)'));
  assert.ok(js.includes('discoveryToReplyRate'));
  assert.ok(js.includes('replyToContactRate'));
  assert.ok(js.includes('topReplySegments'));
  assert.ok(js.includes('underperformingSegments'));
  assert.ok(js.includes('reply_conversion_segments'));
});

test('weekly and monthly reports include log attribution and next-stage actions', () => {
  assert.ok(js.includes('reportExecutiveSummary'));
  assert.ok(js.includes('周期总结与数据归因'));
  assert.ok(js.includes('下一阶段系统操作'));
  assert.ok(js.includes('liveAuditEvents()'));
});

test('report metrics open customer-level evidence details', () => {
  assert.ok(js.includes('reportMetricDetail'));
  assert.ok(js.includes("detail: key"));
  assert.ok(js.includes('事件时间'));
  assert.ok(js.includes('证据/原因'));
});

test('report discovery does not fabricate profile completion timestamps', () => {
  assert.ok(js.includes("profiledAt: timestampOrEmpty(item.profiledAt),"));
  assert.ok(!js.includes("profiledAt: timestampOrEmpty(item.profiledAt) || runTimestamp"));
});

test('dashboard loading screen does not show the legacy Chinese OKKI label', () => {
  assert.ok(!html.includes('正在加载中文 OKKI'));
  assert.ok(html.includes('正在加载客户开发系统'));
});

test('deal priority includes observed reply conversion lift', () => {
  assert.ok(js.includes('function replyConversionBenchmarks'));
  assert.ok(js.includes('function replyConversionLift'));
  assert.ok(js.includes('conversionMetricLift'));
  assert.ok(js.includes('direct + replyConversionLift(entity)'));
});
