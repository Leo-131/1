(function initializeCommandCenter() {
  'use strict';

  const engine = window.OutreachEngine;
  const analytics = window.OutreachAnalytics;
  const data = window.AUTONOMOUS_OUTREACH_DATA || { tasks: [], audit: [], settings: {} };
  if (!engine || !analytics) return;

  const views = [
    ['reports', '汇报中心'],
    ['workspace', '开发工作台'],
    ['queue', '今日队列'],
    ['customers', '客户附表'],
    ['seo', 'SEO 趋势'],
    ['experiments', '模板实验'],
    ['audit', '自动化审计'],
    ['settings', '系统设置'],
  ];
  const query = new URLSearchParams(location.search);
  const requestedView = query.get('view');
  const view = requestedView === 'customer' || views.some(item => item[0] === requestedView) ? requestedView : 'workspace';
  const legacyRecords = typeof allRecords !== 'undefined' && Array.isArray(allRecords) ? allRecords : [];
  const tasks = data.tasks || [];
  const latestRun = window.DAILY_AUTOMATION_LATEST || null;
  const taskIndex = buildTaskIndex(tasks);
  const COOLDOWN_DAYS = Number(data.settings && data.settings.cooldownDays || 7);
  const ICP_MIN_SCORE = Number(data.settings && data.settings.minimumScore || 70);
  const EXECUTION_COMPATIBILITY_LABELS = 'AutoClaw Execution · AutoClaw 执行证据 · AutoClaw 自动开发 · OpenClaw Followup · Execution layer is connected';
  let currentReport = null;

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function urlFor(nextView, values = {}) {
    const url = new URL(location.href);
    url.search = '';
    url.searchParams.set('view', nextView);
    Object.entries(values).forEach(([key, value]) => url.searchParams.set(key, value));
    return url.href;
  }
  function stateLabel(state) {
    const labels = {
      profile_scored: '画像已评分', target_verified: '账号已核验', post_liked: '已点赞',
      account_followed: '已关注', approval_pending: 'Codex 决策中', approved: '已批准',
      sent_confirmed: '发送已确认', outcome_pending: '等待回复', scheduled: '已排期',
      rerouted: '已换渠道', auto_skipped: '自动跳过', send_unconfirmed: '发送未确认',
    };
    return labels[state] || state || '待建档';
  }
  function scoreTask(task) {
    return engine.calculateDevelopmentScore({
      region: task.country || '',
      marketStatus: task.marketStatus || '开放',
      role: task.role || '',
      industry: 'Outdoor retail',
      identityConfidence: task.identityVerified ? 100 : 0,
      keywordIntent: task.keyword ? 80 : 0,
      trend: task.trend,
      history: { replied: Boolean(task.repliedAt), templateRate: 0 },
    });
  }
  function icpScore(entity) {
    if (!entity) return 0;
    const direct = Number(entity.fitScore || 0);
    if (direct > 0) return Math.round(direct);
    if (entity.taskId) return scoreTask(entity).total;
    return engine.calculateDevelopmentScore({
      region: entity.country || '',
      marketStatus: entity.marketStatus || '',
      role: entity.role || '',
      industry: entity.industry || '',
      identityConfidence: entity.linkedin_url || entity.instagram_url || entity.targetUrl ? 100 : 0,
      keywordIntent: entity.keyword_used || entity.keyword ? 70 : 0,
    }).total;
  }
  function isIcpQualified(entity) {
    return icpScore(entity) > ICP_MIN_SCORE;
  }
  function icpExplanation(entity) {
    const score = icpScore(entity);
    const status = score > ICP_MIN_SCORE ? 'active' : 'retained_only';
    return `ICP ${score}/100 (${status}). Algorithm: market potential 25, ICP industry/role fit 25, verified identity 15, buyer intent 15, SEO/trend relevance 10, contactability/history 10. Only scores above ${ICP_MIN_SCORE} enter daily outreach; lower scores keep links for review.`;
  }
  function currentTask() {
    return todayDevelopTasks().sort((left, right) => icpScore(right) - icpScore(left))[0] || null;
  }
  function latestQueueRows(source) {
    if (!latestRun) return [];
    const rows = source === 'scheduledLater'
      ? (latestRun.scheduledLater || [])
      : source === 'all'
        ? [...(latestRun.dailyQueue || []), ...(latestRun.scheduledLater || [])]
        : (latestRun.dailyQueue || []);
    return rows.map((item, index) => {
      const base = taskIndex.get(normalizeKey(item.id))
        || taskIndex.get(normalizeKey(item.name))
        || taskIndex.get(normalizeKey(item.company))
        || {};
      return {
        ...base,
        taskId: item.id || base.taskId || `daily-${index}`,
        name: item.name || base.name || item.company,
        company: item.company || item.name || base.company,
        country: item.countryEn || item.country || base.country || '',
        keyword: base.keyword || 'outdoor retail partnership',
        platform: item.platform || base.platform || 'instagram',
        targetUrl: item.platformUrl || item.website || item.url || base.targetUrl || base.verifiedTargetUrl || '',
        verifiedTargetUrl: item.platformUrl || item.website || item.url || base.verifiedTargetUrl || '',
        website: item.website || base.website || '',
        evidenceUrl: item.evidenceUrl || item.query || '',
        background: item.background || base.background || '',
        buyerPersona: item.buyerPersona || item.role || base.role || '',
        fitScore: Number(item.fitScore || base.fitScore || 0),
        marketScore: item.marketScore || base.marketScore,
        marketStatus: item.marketStatus || base.marketStatus,
        action: item.action,
        reason: item.reason,
        workingTime: item.workingTime,
        state: item.action === 'develop' ? 'target_verified'
          : item.action === 'retry_or_alternate_channel' ? 'outcome_pending'
            : item.action === 'email_priority' ? 'rerouted'
              : item.action === 'verify_target' ? 'profile_scored'
                : 'auto_skipped',
        sendStatus: item.lastStatus || base.sendStatus || '',
        identityStatus: base.identityStatus || (item.url ? 'verified' : 'pending'),
        identityVerified: Boolean(item.url || base.identityVerified),
        previouslyContacted: Boolean(base.previouslyContacted || item.action === 'retry_or_alternate_channel'),
      };
    });
  }
  function findTaskById(taskId) {
    return latestQueueRows('all').find(item => item.taskId === taskId)
      || tasks.find(item => item.taskId === taskId);
  }
  function todayDevelopTasks() {
    return latestRun ? latestQueueRows('dailyQueue') : untouchedTasks();
  }
  function todayFollowupTasks() {
    return latestRun ? latestQueueRows('scheduledLater') : followupTasks();
  }
  function platformUrl(record) {
    const candidates = [
      record && record.targetUrl,
      record && record.verifiedTargetUrl,
      record && record.instagram_url,
      record && record.facebook_url,
      record && record.linkedin_url,
      record && record.website,
      record && record.url,
    ];
    return candidates.find(value => /^https?:\/\//i.test(String(value || ''))
      && !/^https:\/\/www\.google\.com\/search/i.test(String(value || ''))) || '';
  }
  function normalizeKey(value) {
    return String(value || '').trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9.]+/g, '');
  }
  function urlHandle(value) {
    const match = String(value || '').match(/instagram\.com\/([^/?#]+)/i);
    return match ? match[1] : '';
  }
  function taskKeys(task) {
    return [
      task.taskId,
      task.accountHandle,
      task.name,
      task.company,
      task.sourceCompany,
      urlHandle(platformUrl(task)),
    ].map(normalizeKey).filter(Boolean);
  }
  function buildTaskIndex(list) {
    const index = new Map();
    list.forEach(task => taskKeys(task).forEach(key => index.set(key, task)));
    return index;
  }
  function taskForRecord(record) {
    const keys = [
      record.name,
      record.company,
      record.accountHandle,
      urlHandle(platformUrl(record)),
    ].map(normalizeKey).filter(Boolean);
    return keys.map(key => taskIndex.get(key)).find(Boolean) || null;
  }
  function validTimestamp(value) {
    return typeof value === 'string' && value && Number.isFinite(Date.parse(value));
  }
  function newerTimestamp(left, right) {
    const leftTime = Date.parse(left || '');
    const rightTime = Date.parse(right || '');
    if (!Number.isFinite(leftTime)) return right || '';
    if (!Number.isFinite(rightTime)) return left || '';
    return rightTime > leftTime ? right : left;
  }
  function lastActualTouch(task) {
    return [task.lastTouch, task.sentAt, task.lastAutomationAt]
      .find(value => validTimestamp(value)) || '';
  }
  function isInCooldown(task) {
    const value = lastActualTouch(task);
    if (!value) return false;
    return Date.now() - Date.parse(value) < COOLDOWN_DAYS * 86400000;
  }
  function automationStatusLabel(status, evidence, duplicateRisk) {
    if (status === 'sent_confirmed') return duplicateRisk || /duplicate/i.test(String(evidence || '')) ? '重复风险' : 'Sent';
    if (status === 'skipped') return /email_channel_found/i.test(String(evidence || '')) ? '邮件优先' : '7日内跳过';
    if (status === 'failed_open') return /no_message_button|no_direct/i.test(String(evidence || '')) ? '可重试' : '待核验';
    if (status === 'prepared_not_sent') return '已准备';
    return status || '';
  }
  function customerRecords() {
    return legacyRecords.map(record => {
      const task = taskForRecord(record);
      if (!task) return record;
      const enriched = { ...record };
      if (task.lastTouch) enriched.lastTouch = newerTimestamp(enriched.lastTouch || enriched.date, task.lastTouch);
      if (task.sendStatus) enriched.status = automationStatusLabel(task.sendStatus, task.evidence, task.duplicateRisk) || enriched.status;
      if (task.targetUrl) enriched.instagram_url = task.targetUrl;
      enriched.automationTaskId = task.taskId;
      enriched.automationEvidence = task.evidence || task.sendStatus || '';
      enriched.resultCheckedAt = task.resultCheckedAt || '';
      return enriched;
    });
  }
  function autoClawConnected() {
    return Boolean(window.customerDev && window.customerDev.runGlmDirectAutomation);
  }
  function autoClawAvailability(task) {
    if (!task || !platformUrl(task)) return { ready: false, label: 'Missing URL', reason: 'No verified platform homepage' };
    if (!isIcpQualified(task)) return { ready: false, label: 'ICP <= 70', reason: icpExplanation(task) };
    if (task.identityStatus !== 'verified') return { ready: false, label: 'Identity mismatch', reason: task.identityNote || 'Lead identity is not verified' };
    const followup = task.previouslyContacted
      || task.sendStatus === 'sent_confirmed'
      || task.automationStatus === 'sent_confirmed'
      || task.state === 'outcome_pending';
    if (isInCooldown(task)) {
      return { ready: false, label: '7-day cooldown', reason: `Touched within ${COOLDOWN_DAYS} days. Open only; do not send another DM.` };
    }
    if (!followup && localStorage.getItem(`glm-direct-completed:${task.taskId}`) === '1') {
      return { ready: false, label: 'Done', reason: 'This lead was already completed on this device' };
    }
    if (!autoClawConnected()) return { ready: false, label: 'Desktop app', reason: 'Use the desktop app to connect Codex Chrome Extension / AutoClaw compatible execution' };
    if (followup) return { ready: true, label: 'Chrome Followup', reason: 'Prepare follow-up only; 7-day cooldown has passed, verify before any send.' };
    return { ready: true, label: 'Codex Chrome', reason: 'Codex Chrome Extension execution layer is connected; AutoClaw compatible' };
  }
  function canRunGlm(task) {
    return autoClawAvailability(task).ready
      && Boolean(platformUrl(task))
      && task.identityStatus === 'verified'
      && localStorage.getItem(`glm-direct-completed:${task.taskId}`) !== '1';
  }
  function untouchedTasks() {
    return tasks.filter(task => task.identityVerified
      && isIcpQualified(task)
      && !task.previouslyContacted
      && task.sendStatus !== 'sent_confirmed'
      && task.automationStatus !== 'sent_confirmed'
      && !['outcome_pending', 'auto_skipped'].includes(task.state))
      .sort((left, right) => icpScore(right) - icpScore(left));
  }
  function followupTasks() {
    return tasks.filter(task => task.previouslyContacted
      || task.sendStatus === 'sent_confirmed'
      || task.automationStatus === 'sent_confirmed'
      || task.state === 'outcome_pending')
      .filter(isIcpQualified)
      .sort((left, right) => icpScore(right) - icpScore(left));
  }
  function uniqueValues(records, key) {
    return [...new Set(records.map(record => String(record[key] || '').trim()).filter(Boolean))]
      .sort((left, right) => left.localeCompare(right));
  }
  function optionList(values, selected, allLabel) {
    return `<option value="">${allLabel}</option>${values.map(value => `<option value="${esc(value)}" ${selected === value ? 'selected' : ''}>${esc(value)}</option>`).join('')}`;
  }
  function recordTouched(record) {
    return Boolean(record.lastTouch || record.contact || record.followUpAt)
      || /sent|replied|accepted|done|rejected|failed|已触达|已获取联系方式/i.test(String(record.status || ''));
  }
  function recordKey(record, index) {
    return encodeURIComponent([record.platform, record.name, record.company, index].join('|'));
  }
  function nav() {
    return `<aside class="cc-sidebar"><div class="cc-brand"><b>Customer Development</b><span>Codex Decision - Codex Chrome Extension</span></div>
      <nav class="cc-nav">${views.map(([key, label]) => `<a class="${view === key ? 'active' : ''}" href="${urlFor(key)}">${label}</a>`).join('')}</nav>
      <div class="cc-agent">Brain: Codex<br>Executor: Codex Chrome Extension<br>Fallback: AutoClaw compatible<br>Mode: ICP&gt;70 - parallel batches</div></aside>`;
  }
  function pageHead(title, subtitle) {
    return `<div class="cc-page-head"><div><h1>${title}</h1><p>${subtitle}</p></div><span class="cc-status">自动决策运行中</span></div>`;
  }
  function reportHref(type, anchor) {
    return urlFor('reports', { report: type, period: anchor });
  }
  function shiftReportAnchor(type, anchor, direction) {
    const parts = String(anchor).split('-').map(Number);
    const date = new Date(Date.UTC(parts[0], (parts[1] || 1) - 1, parts[2] || 1));
    if (type === 'monthly') date.setUTCMonth(date.getUTCMonth() + direction);
    else date.setUTCDate(date.getUTCDate() + (direction * 7));
    return date.toISOString().slice(0, 10);
  }
  function rate(value) {
    return `${Math.round(Number(value || 0) * 100)}%`;
  }
  function reportBreakdown(title, rows) {
    if (!rows.length) return `<section class="cc-panel"><div class="cc-panel-head"><h2>${title}</h2></div><div class="cc-empty">本周期暂无可统计数据</div></section>`;
    return `<section class="cc-panel"><div class="cc-panel-head"><h2>${title}</h2></div><div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>分类</th><th>发现</th><th>确认发送</th><th>回复</th><th>联系方式</th><th>机会</th><th>回复率</th></tr></thead><tbody>${rows.map(item => `<tr><td>${esc(item.label)}</td><td>${item.metrics.discovered}</td><td>${item.metrics.sent}</td><td>${item.metrics.replied}</td><td>${item.metrics.contactCaptured}</td><td>${item.metrics.opportunity}</td><td>${rate(item.rates.replyRate)}</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function reports() {
    const type = query.get('report') === 'monthly' ? 'monthly' : 'weekly';
    const report = analytics.buildPeriodReport(tasks, { type, anchor: query.get('period') || undefined });
    currentReport = report;
    const metricLabels = [
      ['discovered', '发现客户'], ['profiled', '画像评分'], ['approved', '已批准'],
      ['sent', '确认发送'], ['replied', '收到回复'], ['contactCaptured', '获得联系方式'],
      ['opportunity', '成交机会'], ['autoSkipped', '自动跳过'],
    ];
    const funnelMetrics = metricLabels.slice(0, 7);
    const previous = shiftReportAnchor(type, report.period.anchor, -1);
    const next = shiftReportAnchor(type, report.period.anchor, 1);
    const qualityTotal = report.dataQuality.missingTimestamps + report.dataQuality.invalidTimestamps;

    return `${pageHead('汇报中心', '按自然周和自然月复盘客户开发结果，仅统计有时间证据的真实事件')}
      <div class="cc-report-toolbar">
        <div class="cc-report-tabs"><a data-report-type="weekly" class="${type === 'weekly' ? 'active' : ''}" href="${reportHref('weekly', report.period.anchor)}">周报</a><a data-report-type="monthly" class="${type === 'monthly' ? 'active' : ''}" href="${reportHref('monthly', report.period.anchor)}">月报</a></div>
        <div class="cc-period-controls"><a class="cc-icon-button" href="${reportHref(type, previous)}" title="上一周期">‹</a><input id="report-period" type="date" value="${report.period.anchor}" aria-label="报告日期"><a class="cc-icon-button" href="${reportHref(type, next)}" title="下一周期">›</a></div>
        <div class="cc-report-actions"><button type="button" onclick="exportCurrentReportCsv()" ${report.hasData ? '' : 'disabled'}>导出 CSV</button><button type="button" onclick="window.print()">打印/PDF</button></div>
      </div>
      <div class="cc-report-period"><b>${report.period.label}</b><span>Asia/Shanghai</span></div>
      <div class="cc-kpis cc-report-kpis">${metricLabels.map(([key, label]) => `<div class="cc-kpi"><span>${label}</span><b>${report.metrics[key]}</b></div>`).join('')}</div>
      <section class="cc-panel"><div class="cc-panel-head"><h2>转化漏斗</h2><span class="cc-sub">回复率 ${rate(report.rates.replyRate)} · 联系方式率 ${rate(report.rates.contactCaptureRate)} · 机会率 ${rate(report.rates.opportunityRate)}</span></div><div class="cc-panel-body"><div class="cc-funnel">${funnelMetrics.map(([key, label]) => `<div><span>${label}</span><b>${report.metrics[key]}</b></div>`).join('')}</div></div></section>
      ${qualityTotal ? `<div class="cc-quality">数据质量：${report.dataQuality.missingTimestamps} 个应有时间缺失，${report.dataQuality.invalidTimestamps} 个时间无效；这些事件未计入周期结果。</div>` : ''}
      ${report.hasData ? `<div class="cc-report-grid">${reportBreakdown('平台', report.breakdowns.platform)}${reportBreakdown('国家 / 市场', report.breakdowns.countryMarket)}${reportBreakdown('关键词', report.breakdowns.keyword)}${reportBreakdown('消息模板', report.breakdowns.template)}${reportBreakdown('ICP 层级', report.breakdowns.icpTier)}</div>` : '<div class="cc-empty cc-report-empty">本周期暂无带有效时间证据的开发记录</div>'}`;
  }
  function stageRoute(task) {
    const route = [
      ['profile_scored', '画像'], ['target_verified', '核验'], ['post_liked', '点赞'],
      ['account_followed', '关注'], ['approval_pending', '等待'], ['approved', '审批'],
      ['sent_confirmed', '发送'], ['outcome_pending', '等待回复'],
    ];
    const effectiveState = task.sendStatus === 'sent_confirmed' ? 'outcome_pending' : task.state;
    const index = route.findIndex(item => item[0] === effectiveState);
    return `<div class="cc-route">${route.map((item, i) => `<div class="cc-stage ${i < index ? 'done' : i === index ? 'active' : ''}"><b>${item[1]}</b>${i < index ? '已完成' : i === index ? '当前阶段' : '待执行'}</div>`).join('')}</div>`;
  }
  function workspace() {
    const task = currentTask();
    const untouched = todayDevelopTasks();
    const followups = todayFollowupTasks();
    const confirmed = tasks.filter(item => item.sendStatus === 'sent_confirmed').length;
    const eligibleCount = (latestRun ? latestQueueRows('all') : tasks).filter(canRunGlm).length;
    const executionConnected = autoClawConnected();
    const metrics = `<div class="cc-kpis">
      <a class="cc-kpi cc-kpi-link" href="${urlFor('queue', { queue: 'untouched' })}"><span>今日待开发</span><b>${untouched.length}</b></a>
      <a class="cc-kpi cc-kpi-link" href="${urlFor('queue', { queue: 'followup' })}"><span>跟进中</span><b>${followups.length}</b></a>
      <a class="cc-kpi cc-kpi-link" href="${urlFor('customers', { touch: 'untouched' })}"><span>候选客户池</span><b>${customerRecords().filter(record => !recordTouched(record)).length}</b></a>
      <a class="cc-kpi cc-kpi-link" href="${urlFor('queue', { queue: 'all' })}"><span>已确认发送</span><b>${confirmed}</b></a>
    </div>`;
    const connection = `<div class="cc-quality">${executionConnected ? 'Codex Chrome Extension 已连接：AutoClaw 兼容执行层可用' : 'Codex Chrome Extension 未连接：当前是网页预览，请使用桌面 APP 执行；历史客户仍会因防重复规则保持禁用'}</div>`;
    const icpRule = `<div class="cc-icp-rule"><b>ICP 分值算法</b><span>市场潜力 25 + 行业/角色匹配 25 + 身份核验 15 + 采购意图 15 + SEO/趋势 10 + 可联系历史 10。仅 ICP &gt; ${ICP_MIN_SCORE} 进入每日新客户开发，≤${ICP_MIN_SCORE} 保留链接但划线，不自动触达。</span></div>`;
    if (!task) {
      return `${pageHead('开发工作台', 'Codex 负责决策与审批，Codex Chrome Extension 执行，AutoClaw 兼容兜底')}
        ${metrics}${connection}${icpRule}
        <section class="cc-panel"><div class="cc-panel-head"><h2>今日新开发</h2><a href="${urlFor('customers', { touch: 'untouched' })}">筛选候选客户</a></div>
        <div class="cc-empty">当前没有符合“未触达 + 身份已核验”的新任务。历史客户已移入“跟进中”，不会重复发送。</div></section>
        <section class="cc-panel"><div class="cc-panel-head"><h2>跟进优先</h2><a href="${urlFor('queue', { queue: 'followup' })}">查看 ${followups.length} 条</a></div>
        <div class="cc-table-wrap">${taskTable(followups.slice(0, 8))}</div></section>`;
    }
    const score = scoreTask(task);
    const activeIcp = icpScore(task);
    return `${pageHead('开发工作台', 'Codex 负责决策与审批，Codex Chrome Extension 按精确账号多任务并行执行，GLM 辅助画像与文案')}
      ${metrics}${connection}${icpRule}
      <section class="cc-panel"><div class="cc-panel-head"><h2>当前客户</h2><div class="cc-row-actions"><button class="primary" type="button" onclick="runGlmQueue()" ${eligibleCount ? '' : 'disabled'}>${eligibleCount ? '开始 Codex Chrome 并行队列' : '暂无待开发客户'}</button><span class="cc-chip green">${stateLabel(task.state)}</span></div></div><div class="cc-panel-body">
        <div class="cc-current"><div><h3>${platformUrl(task) ? `<a href="${esc(platformUrl(task))}" target="_blank" rel="noopener">${esc(task.company)}</a>` : esc(task.company)}</h3><div class="cc-sub">${esc(task.role || '采购/合作负责人')} · ${esc(task.country || '区域待补全')} · ${esc(task.keyword)}</div><div class="cc-actions"><button type="button" onclick="openVerifiedCustomer('${esc(task.taskId)}')" ${platformUrl(task) ? '' : 'disabled'}>打开客户主页</button><button class="primary" type="button" title="${esc(autoClawAvailability(task).reason)}" onclick="runGlmDirect('${esc(task.taskId)}')" ${canRunGlm(task) ? '' : 'disabled'}>${esc(autoClawAvailability(task).label)}</button><a href="${urlFor('customer', { contact: task.taskId })}">查看系统档案</a></div></div><div class="cc-score"><strong>${score.total}</strong><span>综合开发分 / 100</span></div></div>
        <div class="cc-sub">ICP：${activeIcp}/100 · ${esc(icpExplanation(task))}</div>
        ${stageRoute(task)}
        ${task.identityStatus === 'identity_mismatch' ? `<div class="cc-quality">身份不匹配：${esc(task.identityNote || '该账号与目标客户画像不一致，已禁止自动执行。')}</div>` : ''}
        <div class="cc-message">${esc(task.approvedMessage || 'Codex 将依据账号证据和客户画像审批，GLM 可辅助生成文案。')}</div>
      </div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>接下来</h2><a href="${urlFor('queue', { queue: 'untouched' })}">查看全部</a></div><div class="cc-table-wrap">${taskTable(untouched.slice().sort((left, right) => icpScore(right) - icpScore(left)).slice(0, 8))}</div></section>`;
  }
  function taskTable(list) {
    if (!list.length) return '<div class="cc-empty">当前筛选下没有客户</div>';
    return `<table class="cc-table"><thead><tr><th>客户</th><th>国家</th><th>关键词</th><th>状态</th><th>ICP</th><th>操作</th></tr></thead><tbody>${list.map(task => {
      const qualified = isIcpQualified(task);
      const rowClass = qualified ? '' : ' class="cc-low-icp"';
      const linkClass = qualified ? '' : ' class="cc-strike-link"';
      const target = platformUrl(task);
      const customerHref = target || urlFor('customer', { contact: task.taskId });
      const customerLinkAttrs = target ? ` href="${esc(customerHref)}" target="_blank" rel="noopener"` : ` href="${customerHref}"`;
      const archiveLink = target ? `<br><a class="cc-sub-link" href="${urlFor('customer', { contact: task.taskId })}">System profile</a>` : '';
      return `<tr${rowClass}><td><a${linkClass}${customerLinkAttrs} title="Open verified customer platform; ${esc(icpExplanation(task))}">${esc(task.company)}</a>${archiveLink}${task.identityStatus === 'identity_mismatch' ? '<br><span class="cc-chip red">Identity mismatch</span>' : ''}${qualified ? '' : '<br><span class="cc-chip amber">Low ICP retained</span>'}</td><td>${esc(task.country)}</td><td>${esc(task.keyword)}</td><td><span class="cc-chip">${stateLabel(task.state)}</span></td><td title="Open verified customer platform; ${esc(icpExplanation(task))}">${icpScore(task)}</td><td><div class="cc-row-actions"><button type="button" onclick="openVerifiedCustomer('${esc(task.taskId)}')" ${target ? '' : 'disabled'}>Open profile</button><button type="button" title="${esc(autoClawAvailability(task).reason)}" onclick="runGlmDirect('${esc(task.taskId)}')" ${canRunGlm(task) ? '' : 'disabled'}>${esc(autoClawAvailability(task).label)}</button></div></td></tr>`;
    }).join('')}</tbody></table>`;
  }
  function queue() {
    const mode = query.get('queue') || 'untouched';
    const list = latestRun
      ? (mode === 'followup' ? todayFollowupTasks() : mode === 'all' ? latestQueueRows('all') : todayDevelopTasks())
      : (mode === 'followup' ? followupTasks() : mode === 'all' ? tasks : untouchedTasks());
    const tabs = [
      ['untouched', '今日待开发', todayDevelopTasks().length],
      ['followup', '跟进中', todayFollowupTasks().length],
      ['all', '全部任务', latestRun ? latestQueueRows('all').length : tasks.length],
    ];
    return `${pageHead('今日队列', '默认只显示未触达且身份核验通过的新客户，历史客户单独跟进')}
      <div class="cc-view-tabs">${tabs.map(([key, label, count]) => `<a class="${mode === key ? 'active' : ''}" href="${urlFor('queue', { queue: key })}">${label} <b>${count}</b></a>`).join('')}</div>
      <div class="cc-table-wrap">${taskTable(list)}</div>`;
  }
  function customers() {
    const search = String(query.get('search') || '').trim().toLowerCase();
    const platform = query.get('platform') || '';
    const status = query.get('status') || '';
    const country = query.get('country') || '';
    const industry = query.get('industry') || '';
    const source = query.get('source') || '';
    const touch = query.get('touch') || '';
    const touchTime = query.get('touchTime') || '';
    const touchFrom = query.get('touchFrom') || '';
    const touchTo = query.get('touchTo') || '';
    const sort = query.get('sort') || 'fitScore';
    const direction = query.get('direction') === 'asc' ? 'asc' : 'desc';
    const records = customerRecords();
    const indexed = records.map((record, index) => ({ record, index }));
    const filtered = indexed.filter(({ record }) => {
      const haystack = [record.name, record.company, record.role, record.country, record.industry, record.source].join(' ').toLowerCase();
      if (search && !haystack.includes(search)) return false;
      if (platform && String(record.platform || '') !== platform) return false;
      if (status && String(record.status || '') !== status) return false;
      if (country && String(record.country || '') !== country) return false;
      if (industry && String(record.industry || '') !== industry) return false;
      if (source && String(record.source || '') !== source) return false;
      if (touch === 'untouched' && recordTouched(record)) return false;
      if (touch === 'touched' && !recordTouched(record)) return false;
      if (touch === 'contact' && !record.contact) return false;
      if (touch === 'followup' && !record.followUpAt && !/follow|跟进/i.test(String(record.status || ''))) return false;
      const touchValue = record.lastTouch || record.date || '';
      const touchTimestamp = Date.parse(touchValue);
      if (touchTime === 'none' && Number.isFinite(touchTimestamp)) return false;
      if (['7', '30', '90'].includes(touchTime)) {
        const cutoff = Date.now() - (Number(touchTime) * 86400000);
        if (!Number.isFinite(touchTimestamp) || touchTimestamp < cutoff) return false;
      }
      if (touchTime === 'custom') {
        const fromTimestamp = touchFrom ? Date.parse(`${touchFrom}T00:00:00`) : Number.NEGATIVE_INFINITY;
        const toTimestamp = touchTo ? Date.parse(`${touchTo}T23:59:59`) : Number.POSITIVE_INFINITY;
        if (!Number.isFinite(touchTimestamp) || touchTimestamp < fromTimestamp || touchTimestamp > toTimestamp) return false;
      }
      return true;
    });
    const sortableValue = record => {
      if (sort === 'fitScore' || sort === 'marketScore') return Number(record[sort] || 0);
      if (sort === 'lastTouch') return Date.parse(record.lastTouch || record.date || '') || 0;
      return String(record[sort] || '').toLowerCase();
    };
    filtered.sort((left, right) => {
      if (sort === 'lastTouch') {
        const leftTouch = Date.parse(left.record.lastTouch || left.record.date || '');
        const rightTouch = Date.parse(right.record.lastTouch || right.record.date || '');
        const missingTouch = !Number.isFinite(leftTouch) || !Number.isFinite(rightTouch);
        if (missingTouch) {
          if (!Number.isFinite(leftTouch) && !Number.isFinite(rightTouch)) return 0;
          return !Number.isFinite(leftTouch) ? 1 : -1;
        }
        return direction === 'asc' ? leftTouch - rightTouch : rightTouch - leftTouch;
      }
      const a = sortableValue(left.record);
      const b = sortableValue(right.record);
      const result = typeof a === 'number' ? a - b : a.localeCompare(b);
      return direction === 'asc' ? result : -result;
    });
    const rows = filtered.slice(0, 1000);
    const sortHref = key => urlFor('customers', {
      search: query.get('search') || '', platform, status, country, industry, source, touch,
      touchTime, touchFrom, touchTo,
      sort: key, direction: sort === key && direction === 'desc' ? 'asc' : 'desc',
    });
    const head = (key, label) => `<th class="cc-sortable"><a href="${sortHref(key)}">${label}${sort === key ? (direction === 'asc' ? ' ↑' : ' ↓') : ''}</a></th>`;
    const highIcpCount = records.filter(isIcpQualified).length;
    const icpRule = `<div class="cc-icp-rule"><b>ICP 分值算法</b><span>市场潜力 25 + 行业/角色匹配 25 + 身份核验 15 + 采购意图 15 + SEO/趋势 10 + 可联系历史 10。当前 ${highIcpCount} 条 ICP &gt; ${ICP_MIN_SCORE} 可进入开发；≤${ICP_MIN_SCORE} 保留链接但划线。</span></div>`;
    return `${pageHead('客户附表', `18.4 筛选模式 · ${filtered.length} / ${records.length} 条`)}
      ${icpRule}
      <form class="cc-filter-bar" onsubmit="applyCustomerFilters(event)">
        <input type="hidden" name="view" value="customers">
        <input id="customer-search" name="search" value="${esc(query.get('search') || '')}" placeholder="搜索姓名、公司、职位...">
        <select id="customer-platform" name="platform">${optionList(uniqueValues(records, 'platform'), platform, '全部平台')}</select>
        <select id="customer-status" name="status">${optionList(uniqueValues(records, 'status'), status, '全部状态')}</select>
        <select id="customer-country" name="country">${optionList(uniqueValues(records, 'country'), country, '全部国家')}</select>
        <select id="customer-industry" name="industry">${optionList(uniqueValues(records, 'industry'), industry, '全部行业')}</select>
        <select id="customer-source" name="source">${optionList(uniqueValues(records, 'source'), source, '全部来源')}</select>
        <select id="customer-touch" name="touch"><option value="">全部触达状态</option><option value="untouched" ${touch === 'untouched' ? 'selected' : ''}>未触达</option><option value="touched" ${touch === 'touched' ? 'selected' : ''}>已触达</option><option value="contact" ${touch === 'contact' ? 'selected' : ''}>已获取联系方式</option><option value="followup" ${touch === 'followup' ? 'selected' : ''}>需跟进</option></select>
        <select id="customer-touch-time" name="touchTime"><option value="">全部触达时间</option><option value="none" ${touchTime === 'none' ? 'selected' : ''}>无触达时间</option><option value="7" ${touchTime === '7' ? 'selected' : ''}>最近 7 天</option><option value="30" ${touchTime === '30' ? 'selected' : ''}>最近 30 天</option><option value="90" ${touchTime === '90' ? 'selected' : ''}>最近 90 天</option><option value="custom" ${touchTime === 'custom' ? 'selected' : ''}>自定义日期</option></select>
        <input id="customer-touch-from" name="touchFrom" type="date" value="${esc(touchFrom)}" title="最近触达开始日期">
        <input id="customer-touch-to" name="touchTo" type="date" value="${esc(touchTo)}" title="最近触达结束日期">
        <select id="customer-sort" name="sort"><option value="fitScore" ${sort === 'fitScore' ? 'selected' : ''}>ICP 分数</option><option value="marketScore" ${sort === 'marketScore' ? 'selected' : ''}>市场分数</option><option value="lastTouch" ${sort === 'lastTouch' ? 'selected' : ''}>最近触达</option><option value="company" ${sort === 'company' ? 'selected' : ''}>公司</option></select>
        <input type="hidden" name="direction" value="${direction}">
        <button class="primary" type="submit">筛选</button><a class="cc-reset" href="${urlFor('customers')}">重置筛选</a>
      </form>
      <div class="cc-table-wrap"><table class="cc-table"><thead><tr>${head('name', '姓名')}${head('company', '公司')}<th>职位</th>${head('country', '国家')}<th>平台</th>${head('status', '状态')}${head('fitScore', 'ICP')}${head('lastTouch', '最近触达')}</tr></thead><tbody>${rows.map(({ record, index }) => {
        const key = recordKey(record, index);
        const qualified = isIcpQualified(record);
        const linkClass = qualified ? '' : ' class="cc-strike-link"';
        const target = platformUrl(record);
        const customerHref = target || urlFor('customer', { contact: key });
        const customerLinkAttrs = target ? ` href="${esc(customerHref)}" target="_blank" rel="noopener"` : ` href="${customerHref}"`;
        const archiveLink = target ? `<br><a class="cc-sub-link" href="${urlFor('customer', { contact: key })}">System profile</a>` : '';
        return `<tr class="${qualified ? '' : 'cc-low-icp'}"><td><a${linkClass}${customerLinkAttrs} title="Open verified customer platform; ${esc(icpExplanation(record))}">${esc(record.name)}</a>${archiveLink}</td><td>${esc(record.company)}${qualified ? '' : '<br><span class="cc-chip amber">Low ICP retained</span>'}</td><td>${esc(record.role)}</td><td>${esc(record.country)}</td><td>${esc(record.platform)}</td><td><span class="cc-chip">${esc(record.status)}</span></td><td title="Open verified customer platform; ${esc(icpExplanation(record))}">${icpScore(record)}</td><td>${esc(record.lastTouch || record.date || '')}</td></tr>`;
      }).join('')}</tbody></table>${rows.length ? '' : '<div class="cc-empty">没有匹配客户，请重置或调整筛选条件</div>'}</div>`;
  }
  function seo() {
    const metrics = analytics.buildKeywordMetrics(tasks);
    const opportunities = analytics.buildKeywordOpportunities(tasks).slice(0, 18);
    return `${pageHead('SEO 趋势', '用真实转化数据排序关键词，并扩展高商业意图的客户搜索词')}
      <section class="cc-panel"><div class="cc-panel-head"><h2>真实关键词漏斗</h2><span class="cc-sub">仅统计已确认发送后的回复，不用预测值冒充结果</span></div><div class="cc-panel-body">${metrics.length ? metrics.map(item => `<div class="cc-bar-row"><span>${esc(item.keyword)} · n=${item.sampleSize}</span><div class="cc-bar"><i style="width:${Math.round(item.rates.replyRate * 100)}%"></i></div><b>${Math.round(item.rates.replyRate * 100)}%</b></div>`).join('') : '<div class="cc-empty">暂无已验证关键词数据</div>'}</div></section>
      <section class="cc-panel keyword-opportunity"><div class="cc-panel-head"><h2>高转化关键词机会池</h2><span class="cc-sub">已实测词优先；推荐词需经过实际触达验证</span></div><div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>关键词</th><th>意图</th><th>目标客户</th><th>证据</th><th>优先级</th><th>趋势核验</th></tr></thead><tbody>${opportunities.map(item => `<tr><td><b>${esc(item.keyword)}</b></td><td>${item.intent === 'transactional' ? '交易型' : '商业型'}</td><td>${esc(item.audience)}</td><td>${item.source === 'observed' ? `实测 n=${item.sampleSize} · 回复 ${Math.round(item.replyRate * 100)}%` : '推荐 · 待验证'}</td><td><span class="cc-chip ${item.priorityScore >= 90 ? 'green' : ''}">${item.priorityScore}</span></td><td><a href="${esc(item.trendsUrl)}" target="_blank" rel="noopener">Google Trends</a></td></tr>`).join('')}</tbody></table></div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>趋势数据状态</h2></div><div class="cc-panel-body"><div class="cc-empty">data_unavailable · 当前没有带地区、周期和采集时间戳的自动趋势数据。已提供逐词 Google Trends 核验入口，不显示猜测值。</div></div></section>`;
  }
  function experiments() {
    const metrics = analytics.buildTemplateMetrics(tasks);
    return `${pageHead('模板实验', '只以发送确认记录计算回复率和联系方式获取率')}
      <div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>模板</th><th>样本</th><th>确认发送</th><th>回复</th><th>回复率</th><th>联系方式率</th></tr></thead><tbody>${metrics.map(item => `<tr><td>${esc(item.templateId)}</td><td>${item.sampleSize}</td><td>${item.confirmedSends}</td><td>${item.replies}</td><td>${Math.round(item.replyRate * 100)}%</td><td>${Math.round(item.contactCaptureRate * 100)}%</td></tr>`).join('')}</tbody></table></div>`;
  }
  function audit() {
    return `${pageHead('自动化审计', 'Codex 决策与 Codex Chrome 执行证据留档，AutoClaw 兼容，GLM 仅作为辅助模型')}
      <div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>时间</th><th>任务</th><th>阶段</th><th>代理</th><th>结果</th><th>证据</th></tr></thead><tbody>${(data.audit || []).map(item => `<tr><td>${esc(item.timestamp)}</td><td>${esc(item.taskId)}</td><td>${esc(item.stage)}</td><td>${esc(item.agent)}</td><td>${esc(item.result)}</td><td>${esc(item.evidence)}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function settings() {
    const settings = data.settings || {};
    return `${pageHead('系统设置', '安全门为只读，不允许自动优化降低标准')}
      <section class="cc-panel"><div class="cc-panel-body">
        <div class="cc-setting"><b>最低综合分</b><span>${settings.minimumScore || 70}</span></div>
        <div class="cc-setting"><b>点赞关注后等待</b><span>${settings.delayMinSeconds || 30}–${settings.delayMaxSeconds || 120} 秒</span></div>
        <div class="cc-setting"><b>客户开发节奏</b><span>${settings.cooldownDays || 7} 天内不重复触达；超过后进入跟进队列</span></div>
        <div class="cc-setting"><b>自动优化上限</b><span>${settings.maximumOptimizationAttempts || 2} 次</span></div>
        <div class="cc-setting"><b>精确主页与去重</b><span>强制</span></div>
        <div class="cc-setting"><b>独代冲突与冷却期</b><span>自动跳过 / 排期</span></div>
      </div></section>`;
  }
  function resultEventsFor(record) {
    const keySet = new Set(taskKeys(record));
    return (window.AUTONOMOUS_OUTREACH_RESULTS || [])
      .filter(item => {
        const keys = [
          item.task_id,
          item.target_url,
          urlHandle(item.target_url),
        ].map(normalizeKey).filter(Boolean);
        return keys.some(key => keySet.has(key));
      })
      .map(item => ({
        time: item.timestamp || '',
        title: item.status || 'automation_event',
        detail: item.evidence || item.agent || '',
        agent: item.agent || '',
      }));
  }
  function timelineFor(record) {
    const events = [
      ...resultEventsFor(record),
      record.lastTouch ? { time: record.lastTouch, title: '最近触达', detail: record.status || '' } : null,
      record.sentAt ? { time: record.sentAt, title: '已发送', detail: record.sendStatus || '' } : null,
      record.sentTime ? { time: record.sentTime, title: '已发送', detail: record.status || '' } : null,
      record.followUpAt ? { time: record.followUpAt, title: '跟进排期', detail: record.followUpStatus || '' } : null,
      record.scheduledTime ? { time: record.scheduledTime, title: '已排期', detail: record.status || '' } : null,
    ].filter(Boolean)
      .filter(item => item.time || item.detail)
      .sort((a, b) => (Date.parse(b.time || '') || 0) - (Date.parse(a.time || '') || 0));
    const seen = new Set();
    return events.filter(item => {
      const key = `${item.time}|${item.title}|${item.detail}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  function backgroundRows(record) {
    return [
      ['客户/公司', record.company || record.name],
      ['国家/区域', record.country || record.countryEn || record.location],
      ['平台主页', platformUrl(record)],
      ['官网', record.website || record.companyWebsite || ''],
      ['背调证据', record.evidenceUrl || record.query || record.automationEvidence || ''],
      ['客户画像', record.background || record.notes || record.fitReasons || ''],
      ['采购角色', record.buyerPersona || record.role || ''],
      ['渠道状态', record.marketStatus || record.agencyState || ''],
      ['身份状态', record.identityStatus || (record.identityVerified ? 'verified' : '')],
      ['核验来源', record.identitySource || ''],
    ].filter(([, value]) => value);
  }
  function customer() {
    const key = query.get('contact') || '';
    const task = findTaskById(key) || tasks.find(item => item.taskId === key);
    const records = customerRecords();
    const record = task || records.find((item, index) => encodeURIComponent([item.platform, item.name, item.company, index].join('|')) === key);
    if (!record) return pageHead('客户详情', '未找到对应客户') + '<div class="cc-empty">该记录可能已更新，请返回客户附表。</div>';
    const score = task && tasks.some(item => item.taskId === task.taskId) ? scoreTask(task) : engine.calculateDevelopmentScore({
      region: record.country, marketStatus: record.marketStatus, role: record.role,
      industry: record.industry, identityConfidence: record.linkedin_url || record.targetUrl ? 100 : 0,
      keywordIntent: record.keyword_used ? 70 : 0,
    });
    const background = backgroundRows(record);
    const timeline = timelineFor(record);
    return `${pageHead(esc(record.company || record.name), '独立客户详情页，不覆盖原工作台')}
      <section class="cc-panel"><div class="cc-panel-body"><div class="cc-current"><div><h3>${esc(record.name)}</h3><div class="cc-sub">${esc(record.role)} · ${esc(record.country)} · ${esc(record.platform)}</div></div><div class="cc-score"><strong>${score.total}</strong><span>综合开发分</span></div></div></div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>ICP 评分解释</h2></div><div class="cc-panel-body"><div class="cc-sub">${esc(icpExplanation(record))}</div></div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>客户背调明细</h2></div><div class="cc-panel-body"><table class="cc-table"><tbody>${background.map(([label, value]) => {
        const text = String(value || '');
        const rendered = /^https?:\/\//i.test(text) ? `<a href="${esc(text)}" target="_blank" rel="noopener">${esc(text)}</a>` : esc(text);
        return `<tr><th>${esc(label)}</th><td>${rendered}</td></tr>`;
      }).join('')}</tbody></table></div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>触达时间线</h2></div><div class="cc-panel-body">${timeline.length ? `<div class="cc-timeline">${timeline.map(item => `<div class="cc-timeline-item"><b>${esc(item.time || '时间待补')}</b><span>${esc(item.title)}</span><p>${esc(item.detail || item.agent || '')}</p></div>`).join('')}</div>` : '<div class="cc-empty">暂无触达记录，可作为新客户候选；若已合作或已触达，请在客户状态中标记，系统会自动排除今日新开发。</div>'}</div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>开发信与 Codex Chrome 执行证据</h2></div><div class="cc-panel-body"><div class="cc-message">${esc(record.approvedMessage || record.message || '暂无批准开发信')}</div><div class="cc-sub" style="margin-top:12px">精确目标：${esc(record.targetUrl || record.instagram_url || record.linkedin_url || '')}<br>最近触达：${esc(record.lastTouch || record.date || '暂无')}<br>执行证据：${esc(record.automationEvidence || record.sendStatus || '暂无')}<br>身份状态：${esc(record.identityStatus || '待核验')}<br>核验来源：${esc(record.identitySource || '暂无')}</div></div></section>`;
  }
  function rail() {
    const task = currentTask();
    if (!task) return '<aside class="cc-rail"><h2>Codex 决策</h2><div class="cc-empty">暂无任务</div></aside>';
    const score = scoreTask(task);
    return `<aside class="cc-rail"><div class="cc-rail-section"><h2>Codex 决策</h2>${Object.entries(score.components).map(([key, value]) => `<div class="cc-score-row"><span>${esc(key)}</span><b>${value}</b></div>`).join('')}</div>
      <div class="cc-rail-section"><h2>安全门</h2><div class="cc-evidence">精确主页：${task.identityVerified ? '通过' : '未通过'}<br>身份状态：${esc(task.identityStatus || '待核验')}<br>重复触达：系统校验<br>冷却期：系统校验<br>独代冲突：系统校验<br>优化尝试：${task.approvalAttempts || 0} / 2</div></div>
      <div class="cc-rail-section"><h2>Codex Chrome 执行证据</h2><div class="cc-evidence">账号：${esc(task.targetUrl || '待核验')}<br>来源：${esc(task.identitySource || '暂无')}<br>核验：${esc(task.identityVerifiedAt || '暂无')}<br>ICP：${icpScore(task)} / 100<br>趋势：${esc(task.trend && task.trend.status || 'data_unavailable')}<br>发送：${esc(task.sendStatus || '待执行')}</div></div></aside>`;
  }

  function csvCell(value) {
    return `"${String(value == null ? '' : value).replace(/"/g, '""')}"`;
  }

  function applyCustomerFilters(event) {
    event.preventDefault();
    const values = {};
    [
      ['search', 'customer-search'],
      ['platform', 'customer-platform'],
      ['status', 'customer-status'],
      ['country', 'customer-country'],
      ['industry', 'customer-industry'],
      ['source', 'customer-source'],
      ['touch', 'customer-touch'],
      ['touchTime', 'customer-touch-time'],
      ['touchFrom', 'customer-touch-from'],
      ['touchTo', 'customer-touch-to'],
      ['sort', 'customer-sort'],
    ].forEach(([key, id]) => {
      const value = document.getElementById(id)?.value || '';
      if (value) values[key] = value;
    });
    values.direction = document.querySelector('.cc-filter-bar input[name="direction"]')?.value || 'desc';
    location.href = urlFor('customers', values);
  }
  function exportCurrentReportCsv() {
    if (!currentReport || !currentReport.hasData) return;
    const rows = [
      ['report_type', currentReport.period.type],
      ['period', currentReport.period.label],
      [],
      ['metric', 'value'],
      ...Object.entries(currentReport.metrics),
      [],
      ['dimension', 'label', 'discovered', 'sent', 'replied', 'contacts', 'opportunities', 'reply_rate'],
    ];
    Object.entries(currentReport.breakdowns).forEach(([dimension, items]) => {
      items.forEach(item => rows.push([
        dimension,
        item.label,
        item.metrics.discovered,
        item.metrics.sent,
        item.metrics.replied,
        item.metrics.contactCaptured,
        item.metrics.opportunity,
        rate(item.rates.replyRate),
      ]));
    });
    const csv = rows.map(row => row.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `outreach-${currentReport.period.type}-${currentReport.period.key}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function openVerifiedCustomer(taskId) {
    const task = findTaskById(taskId);
    const target = platformUrl(task);
    if (!target) return;
    if (window.customerDev && window.customerDev.openExternalUrl) {
      window.customerDev.openExternalUrl(target);
      return;
    }
    window.open(target, '_blank', 'noopener');
  }

  async function runGlmDirect(taskId) {
    const task = findTaskById(taskId);
    if (!task || !canRunGlm(task)) {
      window.alert('该客户缺少精确主页，或已经触达，系统不会重复发送。');
      return;
    }
    if (!window.customerDev || !window.customerDev.runGlmDirectAutomation) {
      window.alert('Codex Chrome 自动开发需要桌面 APP 和浏览器执行组件；AutoClaw 可作为兼容执行层。网页版只能生成画像与文案，不能控制本机浏览器。');
      return;
    }
    const button = document.activeElement;
    if (button && button.tagName === 'BUTTON') {
      button.disabled = true;
      button.textContent = '运行中...';
    }
    try {
      const result = await window.customerDev.runGlmDirectAutomation({ lead: task });
      if (!result.ok) {
        if (result.needsConfig) window.alert('请先在桌面 APP 中保存 GLM API Key。');
        else window.alert(result.error || 'Codex Chrome 自动开发未执行。');
        return;
      }
      if (result.sendStatus === 'prepared_not_sent' || result.mode === 'followup_prepare_no_duplicate_send') {
        localStorage.setItem(`glm-direct-prepared:${task.taskId}`, new Date().toISOString());
      } else {
        localStorage.setItem(`glm-direct-completed:${task.taskId}`, '1');
      }
      window.alert('当前客户自动开发已完成，执行证据已返回。');
    } catch (error) {
      window.alert(`自动开发失败：${error.message || error}`);
    } finally {
      if (button && button.tagName === 'BUTTON') {
        button.disabled = false;
        button.textContent = 'Codex Chrome';
      }
    }
  }

  async function runGlmQueue() {
    if (window.customerDev && window.customerDev.runDailyAutomationQueue) {
      const button = document.activeElement;
      if (button && button.tagName === 'BUTTON') {
        button.disabled = true;
        button.textContent = 'Daily queue running...';
      }
      try {
        const result = await window.customerDev.runDailyAutomationQueue({ limit: 6, parallelLimit: 3 });
        if (!result.ok) {
          window.alert(`${result.error || 'Daily queue did not execute.'}\nSkipped: ${(result.skipped || []).length}`);
          return;
        }
        window.alert(`Codex Chrome daily queue finished. Mode: ${result.mode || 'parallel-batches'}. Source: ${result.queueSource || 'dailyQueue'}. Executed: ${(result.executed || []).filter(item => item.ok).length}`);
        location.reload();
        return;
      } catch (error) {
        window.alert(`Daily queue failed: ${error.message || error}`);
        return;
      } finally {
        if (button && button.tagName === 'BUTTON') {
          button.disabled = false;
          button.textContent = 'Codex Chrome Queue';
        }
      }
    }
    const eligible = tasks
      .filter(canRunGlm)
      .sort((left, right) => icpScore(right) - icpScore(left))
      .slice(0, 8);
    if (!eligible.length) {
      window.alert('当前没有未触达且已核验精确主页的客户。');
      return;
    }
    if (!window.customerDev || !window.customerDev.runGlmDirectAutomation) {
      window.alert('请使用桌面 APP 启动 Codex Chrome / AutoClaw 兼容串行队列。');
      return;
    }
    for (let index = 0; index < eligible.length; index += 1) {
      const task = eligible[index];
      const result = await window.customerDev.runGlmDirectAutomation({ lead: task });
      if (result.ok) {
        if (result.sendStatus === 'prepared_not_sent' || result.mode === 'followup_prepare_no_duplicate_send') {
          localStorage.setItem(`glm-direct-prepared:${task.taskId}`, new Date().toISOString());
        } else {
          localStorage.setItem(`glm-direct-completed:${task.taskId}`, '1');
        }
      }
      if (result.needsConfig || result.busy || result.cooldown || result.needsInstall) {
        window.alert(result.error || '串行队列已暂停。');
        return;
      }
      if (index < eligible.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 91000));
      }
    }
    window.alert('本轮 Codex Chrome 串行队列已完成。');
    location.reload();
  }

  window.exportCurrentReportCsv = exportCurrentReportCsv;
  window.applyCustomerFilters = applyCustomerFilters;
  window.openVerifiedCustomer = openVerifiedCustomer;
  window.runGlmDirect = runGlmDirect;
  window.runGlmQueue = runGlmQueue;
  const renderers = { workspace, queue, customers, seo, experiments, reports, audit, settings, customer };
  document.body.classList.add('command-center-active');
  const shell = document.createElement('div');
  shell.className = 'cc-shell';
  shell.id = 'command-center-shell';
  shell.innerHTML = `${nav()}<main class="cc-main">${(renderers[view] || workspace)()}</main>${rail()}`;
  document.body.appendChild(shell);
  const reportPeriod = document.getElementById('report-period');
  if (reportPeriod) {
    reportPeriod.addEventListener('change', event => {
      const type = query.get('report') === 'monthly' ? 'monthly' : 'weekly';
      location.href = reportHref(type, event.target.value);
    });
  }
}());
