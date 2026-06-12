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
  const view = views.some(item => item[0] === query.get('view')) ? query.get('view') : 'workspace';
  const legacyRecords = typeof allRecords !== 'undefined' && Array.isArray(allRecords) ? allRecords : [];
  const tasks = data.tasks || [];
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
  function currentTask() {
    const active = tasks.filter(task => task.identityVerified && !['outcome_pending', 'auto_skipped'].includes(task.state));
    return active.sort((left, right) => scoreTask(right).total - scoreTask(left).total)[0]
      || tasks.filter(task => task.identityVerified).sort((left, right) => scoreTask(right).total - scoreTask(left).total)[0]
      || tasks.slice().sort((left, right) => scoreTask(right).total - scoreTask(left).total)[0]
      || null;
  }
  function platformUrl(record) {
    const candidates = [
      record && record.targetUrl,
      record && record.verifiedTargetUrl,
      record && record.instagram_url,
      record && record.facebook_url,
      record && record.linkedin_url,
      record && record.url,
    ];
    return candidates.find(value => /^https:\/\/(www\.)?(instagram|facebook|linkedin)\.com\//i.test(String(value || ''))) || '';
  }
  function autoClawConnected() {
    return Boolean(window.customerDev && window.customerDev.runGlmDirectAutomation);
  }
  function autoClawAvailability(task) {
    if (!task || !platformUrl(task)) return { ready: false, label: '缺少主页', reason: '没有已核验的平台主页' };
    if (task.identityStatus !== 'verified') return { ready: false, label: '身份不匹配', reason: task.identityNote || '客户身份未通过核验' };
    if (task.sendStatus === 'sent_confirmed'
      || task.automationStatus === 'sent_confirmed'
      || task.state === 'outcome_pending'
      || task.previouslyContacted) {
      return { ready: false, label: '已触达', reason: '该客户已触达，正在等待回复，禁止重复发送' };
    }
    if (localStorage.getItem(`glm-direct-completed:${task.taskId}`) === '1') {
      return { ready: false, label: '已完成', reason: '本机已记录该客户完成自动开发' };
    }
    if (!autoClawConnected()) return { ready: false, label: '需桌面 APP', reason: '当前为网页预览，未连接 AutoClaw 桌面执行层' };
    return { ready: true, label: 'AutoClaw', reason: 'AutoClaw 已连接，可以执行' };
  }
  function canRunGlm(task) {
    return autoClawAvailability(task).ready
      && Boolean(platformUrl(task))
      && task.identityStatus === 'verified'
      && task.sendStatus !== 'sent_confirmed'
      && task.automationStatus !== 'sent_confirmed'
      && task.state !== 'outcome_pending'
      && !task.previouslyContacted
      && localStorage.getItem(`glm-direct-completed:${task.taskId}`) !== '1';
  }
  function nav() {
    return `<aside class="cc-sidebar"><div class="cc-brand"><b>Customer Development</b><span>Codex Decision · AutoClaw Execution</span></div>
      <nav class="cc-nav">${views.map(([key, label]) => `<a class="${view === key ? 'active' : ''}" href="${urlFor(key)}">${label}</a>`).join('')}</nav>
      <div class="cc-agent">主脑：Codex<br>执行：AutoClaw<br>GLM：画像与文案助手<br>模式：精确主页 · 单任务串行</div></aside>`;
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
    const confirmed = tasks.filter(item => item.sendStatus === 'sent_confirmed').length;
    const skipped = tasks.filter(item => item.state === 'auto_skipped').length;
    const eligibleCount = tasks.filter(canRunGlm).length;
    const executionConnected = autoClawConnected();
    if (!task) return pageHead('开发工作台', '暂无已验证任务') + '<div class="cc-empty">请先生成精确账号任务。</div>';
    const score = scoreTask(task);
    return `${pageHead('开发工作台', 'Codex 负责决策与审批，AutoClaw 按精确账号串行执行，GLM 辅助画像与文案')}
      <div class="cc-kpis"><div class="cc-kpi"><span>今日队列</span><b>${tasks.length}</b></div><div class="cc-kpi"><span>已确认发送</span><b>${confirmed}</b></div><div class="cc-kpi"><span>可自动执行</span><b>${eligibleCount}</b></div><div class="cc-kpi"><span>等待回复</span><b>${tasks.filter(item => item.state === 'outcome_pending').length}</b></div></div>
      <div class="cc-quality">${executionConnected ? 'AutoClaw 已连接：桌面执行层可用' : 'AutoClaw 未连接：当前是网页预览，请使用桌面 APP 执行；历史客户仍会因防重复规则保持禁用'}</div>
      <section class="cc-panel"><div class="cc-panel-head"><h2>当前客户</h2><div class="cc-row-actions"><button class="primary" type="button" onclick="runGlmQueue()" ${eligibleCount ? '' : 'disabled'}>${eligibleCount ? '开始 AutoClaw 串行队列' : '暂无待开发客户'}</button><span class="cc-chip green">${stateLabel(task.state)}</span></div></div><div class="cc-panel-body">
        <div class="cc-current"><div><h3>${platformUrl(task) ? `<a href="${esc(platformUrl(task))}" target="_blank" rel="noopener">${esc(task.company)}</a>` : esc(task.company)}</h3><div class="cc-sub">${esc(task.role || '采购/合作负责人')} · ${esc(task.country || '区域待补全')} · ${esc(task.keyword)}</div><div class="cc-actions"><button type="button" onclick="openVerifiedCustomer('${esc(task.taskId)}')" ${platformUrl(task) ? '' : 'disabled'}>打开客户主页</button><button class="primary" type="button" title="${esc(autoClawAvailability(task).reason)}" onclick="runGlmDirect('${esc(task.taskId)}')" ${canRunGlm(task) ? '' : 'disabled'}>${esc(autoClawAvailability(task).label)}</button><a href="${urlFor('customer', { contact: task.taskId })}">查看系统档案</a></div></div><div class="cc-score"><strong>${score.total}</strong><span>综合开发分 / 100</span></div></div>
        ${stageRoute(task)}
        ${task.identityStatus === 'identity_mismatch' ? `<div class="cc-quality">身份不匹配：${esc(task.identityNote || '该账号与目标客户画像不一致，已禁止自动执行。')}</div>` : ''}
        <div class="cc-message">${esc(task.approvedMessage || 'Codex 将依据账号证据和客户画像审批，GLM 可辅助生成文案。')}</div>
      </div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>接下来</h2><a href="${urlFor('queue')}">查看全部</a></div><div class="cc-table-wrap">${taskTable(tasks.slice().sort((left, right) => scoreTask(right).total - scoreTask(left).total).slice(0, 8))}</div></section>`;
  }
  function taskTable(list) {
    return `<table class="cc-table"><thead><tr><th>客户</th><th>国家</th><th>关键词</th><th>状态</th><th>分数</th><th>操作</th></tr></thead><tbody>${list.map(task => `<tr><td>${platformUrl(task) ? `<a href="${esc(platformUrl(task))}" target="_blank" rel="noopener">${esc(task.company)}</a>` : esc(task.company)}${task.identityStatus === 'identity_mismatch' ? '<br><span class="cc-chip">身份不匹配</span>' : ''}</td><td>${esc(task.country)}</td><td>${esc(task.keyword)}</td><td><span class="cc-chip">${stateLabel(task.state)}</span></td><td>${scoreTask(task).total}</td><td><div class="cc-row-actions"><button type="button" onclick="openVerifiedCustomer('${esc(task.taskId)}')" ${platformUrl(task) ? '' : 'disabled'}>打开</button><button type="button" title="${esc(autoClawAvailability(task).reason)}" onclick="runGlmDirect('${esc(task.taskId)}')" ${canRunGlm(task) ? '' : 'disabled'}>${esc(autoClawAvailability(task).label)}</button></div></td></tr>`).join('')}</tbody></table>`;
  }
  function queue() {
    return pageHead('今日队列', '每个任务最终进入发送、排期、换渠道或自动跳过') + `<div class="cc-table-wrap">${taskTable(tasks)}</div>`;
  }
  function customers() {
    const rows = legacyRecords.slice(0, 1000);
    return `${pageHead('客户附表', `完整客户资料与筛选，当前载入 ${legacyRecords.length} 条`)}
      <div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>姓名</th><th>公司</th><th>职位</th><th>国家</th><th>平台</th><th>状态</th><th>ICP</th></tr></thead><tbody>${rows.map((record, index) => {
        const key = encodeURIComponent([record.platform, record.name, record.company, index].join('|'));
        const directUrl = platformUrl(record);
        return `<tr><td>${directUrl ? `<a href="${esc(directUrl)}" target="_blank" rel="noopener">${esc(record.name)}</a>` : `<a href="${urlFor('customer', { contact: key })}">${esc(record.name)}</a>`}</td><td>${esc(record.company)}</td><td>${esc(record.role)}</td><td>${esc(record.country)}</td><td>${esc(record.platform)}</td><td>${esc(record.status)}</td><td>${esc(record.fitScore || '')}</td></tr>`;
      }).join('')}</tbody></table></div>`;
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
    return `${pageHead('自动化审计', 'Codex 决策与 AutoClaw 执行证据留档，GLM 仅作为辅助模型')}
      <div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>时间</th><th>任务</th><th>阶段</th><th>代理</th><th>结果</th><th>证据</th></tr></thead><tbody>${(data.audit || []).map(item => `<tr><td>${esc(item.timestamp)}</td><td>${esc(item.taskId)}</td><td>${esc(item.stage)}</td><td>${esc(item.agent)}</td><td>${esc(item.result)}</td><td>${esc(item.evidence)}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function settings() {
    const settings = data.settings || {};
    return `${pageHead('系统设置', '安全门为只读，不允许自动优化降低标准')}
      <section class="cc-panel"><div class="cc-panel-body">
        <div class="cc-setting"><b>最低综合分</b><span>${settings.minimumScore || 70}</span></div>
        <div class="cc-setting"><b>点赞关注后等待</b><span>${settings.delayMinSeconds || 30}–${settings.delayMaxSeconds || 120} 秒</span></div>
        <div class="cc-setting"><b>自动优化上限</b><span>${settings.maximumOptimizationAttempts || 2} 次</span></div>
        <div class="cc-setting"><b>精确主页与去重</b><span>强制</span></div>
        <div class="cc-setting"><b>独代冲突与冷却期</b><span>自动跳过 / 排期</span></div>
      </div></section>`;
  }
  function customer() {
    const key = query.get('contact') || '';
    const task = tasks.find(item => item.taskId === key);
    const record = task || legacyRecords.find((item, index) => encodeURIComponent([item.platform, item.name, item.company, index].join('|')) === key);
    if (!record) return pageHead('客户详情', '未找到对应客户') + '<div class="cc-empty">该记录可能已更新，请返回客户附表。</div>';
    const score = task ? scoreTask(task) : engine.calculateDevelopmentScore({
      region: record.country, marketStatus: record.marketStatus, role: record.role,
      industry: record.industry, identityConfidence: record.linkedin_url || record.targetUrl ? 100 : 0,
      keywordIntent: record.keyword_used ? 70 : 0,
    });
    return `${pageHead(esc(record.company || record.name), '独立客户详情页，不覆盖原工作台')}
      <section class="cc-panel"><div class="cc-panel-body"><div class="cc-current"><div><h3>${esc(record.name)}</h3><div class="cc-sub">${esc(record.role)} · ${esc(record.country)} · ${esc(record.platform)}</div></div><div class="cc-score"><strong>${score.total}</strong><span>综合开发分</span></div></div></div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>开发信与 AutoClaw 执行证据</h2></div><div class="cc-panel-body"><div class="cc-message">${esc(record.approvedMessage || record.message || '暂无批准开发信')}</div><div class="cc-sub" style="margin-top:12px">精确目标：${esc(record.targetUrl || record.linkedin_url || '')}<br>身份状态：${esc(record.identityStatus || '待核验')}<br>核验来源：${esc(record.identitySource || '暂无')}</div></div></section>`;
  }
  function rail() {
    const task = currentTask();
    if (!task) return '<aside class="cc-rail"><h2>Codex 决策</h2><div class="cc-empty">暂无任务</div></aside>';
    const score = scoreTask(task);
    return `<aside class="cc-rail"><div class="cc-rail-section"><h2>Codex 决策</h2>${Object.entries(score.components).map(([key, value]) => `<div class="cc-score-row"><span>${esc(key)}</span><b>${value}</b></div>`).join('')}</div>
      <div class="cc-rail-section"><h2>安全门</h2><div class="cc-evidence">精确主页：${task.identityVerified ? '通过' : '未通过'}<br>身份状态：${esc(task.identityStatus || '待核验')}<br>重复触达：系统校验<br>冷却期：系统校验<br>独代冲突：系统校验<br>优化尝试：${task.approvalAttempts || 0} / 2</div></div>
      <div class="cc-rail-section"><h2>AutoClaw 执行证据</h2><div class="cc-evidence">账号：${esc(task.targetUrl || '待核验')}<br>来源：${esc(task.identitySource || '暂无')}<br>核验：${esc(task.identityVerifiedAt || '暂无')}<br>趋势：${esc(task.trend && task.trend.status || 'data_unavailable')}<br>发送：${esc(task.sendStatus || '待执行')}</div></div></aside>`;
  }

  function csvCell(value) {
    return `"${String(value == null ? '' : value).replace(/"/g, '""')}"`;
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
    const task = tasks.find(item => item.taskId === taskId);
    const target = platformUrl(task);
    if (!target) return;
    if (window.customerDev && window.customerDev.openExternalUrl) {
      window.customerDev.openExternalUrl(target);
      return;
    }
    window.open(target, '_blank', 'noopener');
  }

  async function runGlmDirect(taskId) {
    const task = tasks.find(item => item.taskId === taskId);
    if (!task || !canRunGlm(task)) {
      window.alert('该客户缺少精确主页，或已经触达，系统不会重复发送。');
      return;
    }
    if (!window.customerDev || !window.customerDev.runGlmDirectAutomation) {
      window.alert('AutoClaw 自动开发需要桌面 APP 和浏览器执行组件。网页版可使用 GLM 辅助生成画像与文案，但不能控制本机浏览器。');
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
        else window.alert(result.error || 'AutoClaw 自动开发未执行。');
        return;
      }
      localStorage.setItem(`glm-direct-completed:${task.taskId}`, '1');
      window.alert('当前客户自动开发已完成，执行证据已返回。');
    } catch (error) {
      window.alert(`自动开发失败：${error.message || error}`);
    } finally {
      if (button && button.tagName === 'BUTTON') {
        button.disabled = false;
        button.textContent = 'AutoClaw 自动开发';
      }
    }
  }

  async function runGlmQueue() {
    const eligible = tasks
      .filter(canRunGlm)
      .sort((left, right) => scoreTask(right).total - scoreTask(left).total)
      .slice(0, 8);
    if (!eligible.length) {
      window.alert('当前没有未触达且已核验精确主页的客户。');
      return;
    }
    if (!window.customerDev || !window.customerDev.runGlmDirectAutomation) {
      window.alert('请使用桌面 APP 启动 AutoClaw 串行队列。');
      return;
    }
    for (let index = 0; index < eligible.length; index += 1) {
      const task = eligible[index];
      const result = await window.customerDev.runGlmDirectAutomation({ lead: task });
      if (result.ok) localStorage.setItem(`glm-direct-completed:${task.taskId}`, '1');
      if (result.needsConfig || result.busy || result.cooldown || result.needsInstall) {
        window.alert(result.error || '串行队列已暂停。');
        return;
      }
      if (index < eligible.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 91000));
      }
    }
    window.alert('本轮 AutoClaw 串行队列已完成。');
    location.reload();
  }

  window.exportCurrentReportCsv = exportCurrentReportCsv;
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
