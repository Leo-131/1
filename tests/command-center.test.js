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
  assert.ok(js.includes("failedShell.dataset.startupFailure = '1'"));
  assert.ok(js.includes('Command center startup failed'));
  assert.doesNotMatch(js, /\bstatusLabel\(/);
});

test('command center waits for engine dependencies instead of falling back to legacy dashboard', () => {
  assert.ok(js.includes('__commandCenterDependencyRetries'));
  assert.ok(js.includes('window.setTimeout(initializeCommandCenter, 100)'));
  assert.ok(js.includes('已阻止回退到旧模块'));
});

test('dependency recovery reloads engine and analytics before command center', () => {
  assert.ok(js.includes("shell.dataset.dependencyFailure = '1'"));
  assert.ok(html.includes("loadRecoveryScript('./outreach-engine.js?v=' + token, 'engine')"));
  assert.ok(html.includes("loadRecoveryScript('./outreach-analytics.js?v=' + token, 'analytics')"));
  assert.ok(html.includes("loadRecoveryScript('./command-center.js?v=' + token, 'command-center')"));
  assert.ok(html.includes('!shell.dataset.dependencyFailure'));
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
  const rootCommandCenterAsset = html.match(/command-center\.js\?v=([^"']+)/);
  const publicCommandCenterAsset = publicIndexHtml.match(/command-center\.js\?v=([^"']+)/);
  assert.ok(rootCommandCenterAsset, 'root command-center asset version');
  assert.ok(publicCommandCenterAsset, 'public command-center asset version');
  assert.equal(publicCommandCenterAsset[1], rootCommandCenterAsset[1]);
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

test('every customer detail uses the Qwen-style due diligence template', () => {
  for (const token of [
    'qwenResearchDashboard(record, score)',
    '深度背调结论',
    '公司基本面（尽调快照）',
    '业务矩阵与 FLEXTAIL 匹配度',
    '实战攻坚 SOP',
    '风险预警与应对底线',
    '综合评级',
    '缺失事实明确标记待核验',
    'researchValue(record',
  ]) assert.ok(js.includes(token), token);
});

test('customer research enrichment overrides low-information historical records', () => {
  assert.ok(js.includes('if (sourceScore > targetScore) target.fitScore = sourceScore'));
  assert.ok(js.includes("'executiveConclusion'"));
  assert.ok(js.includes('const score = scoreForDisplay(task || record)'));
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

test('Contact Us falls back to verified social/contact links in browser mode', () => {
  assert.ok(js.includes('function bestContactUrl'));
  assert.ok(js.includes('task.instagram_url'));
  assert.ok(js.includes('task.facebook_url'));
  const runBlock = js.slice(js.indexOf('async function runGlmDirect'), js.indexOf('const button = document.activeElement'));
  assert.ok(runBlock.includes('const target = bestContactUrl(task)'));
  assert.ok(runBlock.includes("window.open(target, '_blank', 'noopener')"));
  const resultBlock = js.slice(js.indexOf('function autonomousResultRecords'), js.indexOf('function normalizeRecords'));
  assert.ok(resultBlock.includes('instagram_url: /instagram/i.test'));
  assert.ok(resultBlock.includes('facebook_url: /facebook|fb\\.com/i.test'));
});

test('command center uses Codex decisions and AutoClaw execution on verified URLs', () => {
  assert.ok(js.includes('Codex Decision'));
  assert.ok(js.includes('Codex Chrome Extension Execution'));
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
  assert.ok(js.includes('Codex Chrome Followup'));
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
  assert.ok(js.includes('enrichment backlog'));
  assert.ok(js.includes('enrichmentBacklogCount'));
  assert.ok(js.includes("queue: 'untouched'"));
  assert.ok(js.includes("queue: 'followup'"));
});

test('today queue hides companies already developed on the same Shanghai day', () => {
  const currentTaskBlock = js.slice(js.indexOf('function currentTask()'), js.indexOf('function executionResultKey'));
  const todayQueueBlock = js.slice(js.indexOf('function queue()'), js.indexOf('function customers()'));
  assert.ok(currentTaskBlock.includes('executableDevelopmentTasks()'));
  assert.ok(!currentTaskBlock.includes("latestQueueRows('visibleTodayQueue')"));
  assert.ok(todayQueueBlock.includes('const visibleRows = executableDevelopmentTasks()'));
});

test('today queue exposes verified developed customer records', () => {
  assert.ok(js.includes('function dailyDevelopedRows'));
  assert.ok(js.includes('function dailyDevelopedPanel'));
  assert.ok(js.includes('...autonomousResultRecords()'));
  assert.ok(js.includes("mode === 'developed'"));
  assert.ok(js.includes('interactionEvidence'));
  assert.ok(js.includes('developedAt'));
});

test('workspace shows confirmed customers and email-first channel priority', () => {
  assert.ok(js.includes('Email → LinkedIn → Facebook → Instagram'));
  assert.ok(js.includes("['sent_confirmed', 'submitted_confirmed']"));
  assert.ok(js.includes('今日真实开发'));
  assert.ok(js.includes('dailyDevelopedPanel()'));
  assert.ok(js.includes('Email运营漏斗'));
  assert.ok(js.includes('同域名每日最多3封'));
  assert.ok(js.includes('buyerRoutedAt'));
  assert.ok(js.includes('meetingBookedAt'));
});

test('North America reserve is visibly separated from confirmed development', () => {
  assert.ok(js.includes('function northAmericaAgencyReserveRows'));
  assert.ok(js.includes('function northAmericaMarketPanel'));
  assert.ok(js.includes("item.customerType === 'sales_agency'"));
  assert.ok(js.includes("['United States', 'Canada', 'Mexico']"));
  assert.ok(js.includes('候选储备与真实开发分开统计'));
  assert.ok(js.includes('储备不是已发送'));
  assert.ok(js.includes("['north-america', '\\u5317\\u7f8e\\u4ee3\\u7406\\u50a8\\u5907'"));
});

test('autonomous result company identity survives dated email task ids', () => {
  assert.ok(js.includes('name: item.company || task.name'));
  assert.ok(js.includes('company: item.company || task.company'));
  assert.ok(js.includes('const discovery = discoveryCompanyRecord(company) || {}'));
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

test('customer table displays bounded ICP scores instead of composite priority scores', () => {
  assert.ok(js.includes('function boundedIcpScore'));
  assert.ok(js.includes('Math.min(100'));
  const customerTableBlock = js.slice(js.indexOf('function customers()'), js.indexOf('function countryGeoCode'));
  assert.ok(customerTableBlock.includes('>${icpScore(record)}</td>'));
  assert.ok(!customerTableBlock.includes('>${dealProbabilityScore(record)}</td>'));
});

test('customer timeline uses real customer events instead of artifact refresh time', () => {
  assert.ok(js.includes('function customerEventLedger'));
  assert.ok(js.includes("latestCustomerEvent(record, ['sent_confirmed'])"));
  assert.ok(js.includes('function recordEventTime'));
  assert.ok(js.includes('最近真实触达'));
  assert.ok(js.includes('无真实触达时间'));
  assert.ok(!js.includes("resultCheckedAt: latestRun && latestRun.generatedAt || ''"));
  assert.ok(!js.includes("discoveredAt: latestRun && latestRun.generatedAt || ''"));
});

test('customer table exposes validated contact email and mailto reachability', () => {
  const customerTableBlock = js.slice(js.indexOf('function customers()'), js.indexOf('function countryGeoCode'));
  assert.ok(customerTableBlock.includes('可建联 Email'));
  assert.ok(js.includes('function contactEmailValue'));
  assert.ok(customerTableBlock.includes('mailto:${esc(email)}'));
  assert.ok(js.includes('未发现有效公开邮箱'));
});

test('customer email never falls back to FLEXTAIL sender identity', () => {
  assert.ok(js.includes('emailFrom is FLEXTAIL'));
  assert.ok(js.includes("/^leo@flextailgear\\.com$/i"));
  assert.ok(js.includes('source.publicEmail || source.contactEmail || source.email'));
  assert.ok(!js.includes('source.publicEmail || source.contactEmail || source.emailFrom || source.email'));
  assert.ok(js.includes("enriched.publicEmail = ''"));
});

test('today queue displays bounded ICP scores instead of composite deal scores', () => {
  const taskTableBlock = js.slice(js.indexOf('function taskTable'), js.indexOf('function queue()'));
  assert.ok(taskTableBlock.includes('<th>ICP分</th>'));
  assert.ok(taskTableBlock.includes('>${icpScore(task)}</td>'));
  assert.ok(taskTableBlock.includes('title="${esc(icpExplanation(task))}"'));
  assert.ok(!taskTableBlock.includes('>${dealProbabilityScore(task)}</td>'));
  assert.ok(!taskTableBlock.includes('market/contact/region priority'));
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

test('same-day result checks use one Shanghai date formatter and one indexed scan', () => {
  assert.ok(js.includes("const AUTOMATION_DAY_FORMATTER = new Intl.DateTimeFormat('en-CA'"));
  assert.ok(js.includes("memoized('sameDayDevelopmentIndex'"));
  assert.ok(js.includes('const item = index.get(key)'));
  assert.ok(!js.includes('const today = new Intl.DateTimeFormat'));
});

test('auditable inbound reply evidence populates reply conversion records', () => {
  assert.ok(js.includes('function replySignalFromEvidence'));
  assert.ok(js.includes('recipient_(?:auto_)?reply_received'));
  assert.ok(js.includes("replyTimestampSource: confirmed && reply ? 'automation_result_timestamp' : ''"));
  assert.ok(js.includes('function replyTypePanel'));
  assert.ok(js.includes('${replyTypePanel(report)}'));
});

test('live record deduplication preserves downstream reply and opportunity events', () => {
  assert.ok(js.includes('const merged = new Map()'));
  assert.ok(js.includes('...(data.tasks || [])'));
  assert.ok(js.includes('repliedAt: replyCandidate'));
  assert.ok(js.includes('contactCapturedAt: newerTimestamp(existing.contactCapturedAt, item.contactCapturedAt)'));
  assert.ok(js.includes('opportunityAt: newerTimestamp(existing.opportunityAt, item.opportunityAt)'));
});

test('current task sorting does not mutate the memoized visible queue', () => {
  const currentTaskBlock = js.slice(js.indexOf('function currentTask'), js.indexOf('function executionResultKey'));
  assert.ok(currentTaskBlock.includes('executableDevelopmentTasks().sort(dealPriorityCompare)[0]'));
  assert.ok(!currentTaskBlock.includes("latestQueueRows('visibleTodayQueue').sort(dealPriorityCompare)"));
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
  assert.ok(html.includes('20260727-smooth-startup'));
  assert.ok(html.includes('ensureCommandCenterModule'));
  assert.ok(html.includes('正在加载客户开发系统'));
  assert.ok(!html.includes('ensureVisibleCommandCenterFallback'));
  assert.ok(!html.includes('System display recovered in fallback mode'));
  assert.ok(!html.includes('Display repair mode'));
  assert.ok(html.includes('commandCenterRecovery'));
  assert.ok(serviceWorkerJs.includes('customer-development-system-v18-7-37-20260727-smooth-startup'));
});

test('local dashboard clears legacy caches without reload loops', () => {
  assert.ok(html.includes("localStorage.getItem(key)"));
  assert.ok(html.includes("!['127.0.0.1','localhost','::1'].includes(location.hostname)"));
  assert.ok(!html.includes("next.searchParams.set('cacheReset'"));
  assert.ok(!publicIndexHtml.includes("next.searchParams.set('cacheReset'"));
});

test('command center startup failures replace the spinner with a recovery screen', () => {
  assert.ok(js.includes("failedShell.dataset.startupFailure = '1'"));
  assert.ok(js.includes('\\u5ba2\\u6237\\u5f00\\u53d1\\u7cfb\\u7edf\\u542f\\u52a8\\u5931\\u8d25'));
  assert.ok(js.includes("document.body.classList.add('command-center-active')"));
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

test('reporting center shows a real ICP average and scored-customer coverage', () => {
  assert.ok(js.includes('平均 ICP 评分'));
  assert.ok(js.includes('report.icpScoring.average'));
  assert.ok(js.includes('已评分 ${report.icpScoring.scoredCustomers}/${report.icpScoring.discoveredCustomers} 家'));
  assert.ok(js.includes('缺失分数不按 0 计'));
});

test('reporting center keeps profile-event counts separate from the ICP average', () => {
  assert.ok(js.includes("['discovered', '发现客户'], ['profiled', '画像记录']"));
  assert.ok(js.includes('平均 ICP 评分'));
  assert.ok(analyticsJs.includes("if (upstream === 'profiled') continue"));
});

test('reporting center preserves one decimal when reply rate is above five percent', () => {
  assert.ok(js.includes('Math.round(Number(value || 0) * 1000) / 10'));
  assert.ok(js.includes("percent.toFixed(1)"));
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
  assert.ok(!js.includes("discoveredAt: timestampOrEmpty(item.discoveredAt) || runTimestamp"));
  assert.ok(!js.includes("profiledAt: timestamp || task.profiledAt || ''"));
  assert.ok(!js.includes("approvedAt: timestamp || task.approvedAt || ''"));
});

test('reporting center explains snapshot scope and displays funnel consistency', () => {
  assert.ok(js.includes('今日队列是当前待处理快照'));
  assert.ok(js.includes('report.consistency.funnelMonotonic'));
  assert.ok(js.includes('原始阶段时间证据'));
  assert.ok(js.includes('inferred_from_'));
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
