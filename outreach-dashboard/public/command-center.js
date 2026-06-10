(function initializeCommandCenter() {
  'use strict';

  const engine = window.OutreachEngine;
  const analytics = window.OutreachAnalytics;
  const data = window.AUTONOMOUS_OUTREACH_DATA || { tasks: [], audit: [], settings: {} };
  if (!engine || !analytics) return;

  const views = [
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
      account_followed: '已关注', approval_pending: 'Codex 审批中', approved: '已批准',
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
      identityConfidence: task.targetUrl ? 100 : 0,
      keywordIntent: task.keyword ? 80 : 0,
      trend: task.trend,
      history: { replied: Boolean(task.repliedAt), templateRate: 0 },
    });
  }
  function currentTask() {
    const active = tasks.filter(task => !['outcome_pending', 'auto_skipped'].includes(task.state));
    return active.sort((left, right) => scoreTask(right).total - scoreTask(left).total)[0]
      || tasks.slice().sort((left, right) => scoreTask(right).total - scoreTask(left).total)[0]
      || null;
  }
  function nav() {
    return `<aside class="cc-sidebar"><div class="cc-brand"><b>Customer Development</b><span>Codex Decision · QClaw Execution</span></div>
      <nav class="cc-nav">${views.map(([key, label]) => `<a class="${view === key ? 'active' : ''}" href="${urlFor(key)}">${label}</a>`).join('')}</nav>
      <div class="cc-agent">主脑：Codex<br>执行器：QClaw<br>唯一状态源：客户开发系统</div></aside>`;
  }
  function pageHead(title, subtitle) {
    return `<div class="cc-page-head"><div><h1>${title}</h1><p>${subtitle}</p></div><span class="cc-status">自动决策运行中</span></div>`;
  }
  function stageRoute(task) {
    const route = [
      ['profile_scored', '画像'], ['target_verified', '核验'], ['post_liked', '点赞'],
      ['account_followed', '关注'], ['approval_pending', '等待'], ['approved', '审批'],
      ['sent_confirmed', '发送'],
    ];
    const index = route.findIndex(item => item[0] === task.state);
    return `<div class="cc-route">${route.map((item, i) => `<div class="cc-stage ${i < index ? 'done' : i === index ? 'active' : ''}"><b>${item[1]}</b>${i < index ? '已完成' : i === index ? '当前阶段' : '待执行'}</div>`).join('')}</div>`;
  }
  function workspace() {
    const task = currentTask();
    const confirmed = tasks.filter(item => item.sendStatus === 'sent_confirmed').length;
    const skipped = tasks.filter(item => item.state === 'auto_skipped').length;
    if (!task) return pageHead('开发工作台', '暂无已验证任务') + '<div class="cc-empty">请先生成精确账号任务。</div>';
    const score = scoreTask(task);
    return `${pageHead('开发工作台', 'Codex 自动审批，QClaw 按精确账号执行')}
      <div class="cc-kpis"><div class="cc-kpi"><span>今日队列</span><b>${tasks.length}</b></div><div class="cc-kpi"><span>已确认发送</span><b>${confirmed}</b></div><div class="cc-kpi"><span>自动跳过</span><b>${skipped}</b></div><div class="cc-kpi"><span>等待回复</span><b>${tasks.filter(item => item.state === 'outcome_pending').length}</b></div></div>
      <section class="cc-panel"><div class="cc-panel-head"><h2>当前客户</h2><span class="cc-chip green">${stateLabel(task.state)}</span></div><div class="cc-panel-body">
        <div class="cc-current"><div><h3><a href="${urlFor('customer', { contact: task.taskId })}" target="_blank" rel="noopener">${esc(task.company)}</a></h3><div class="cc-sub">${esc(task.role || '采购/合作负责人')} · ${esc(task.country || '区域待补全')} · ${esc(task.keyword)}</div></div><div class="cc-score"><strong>${score.total}</strong><span>综合开发分 / 100</span></div></div>
        ${stageRoute(task)}
        <div class="cc-message">${esc(task.approvedMessage || 'Codex 将在账号证据和客户画像完整后生成批准版本。')}</div>
      </div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>接下来</h2><a href="${urlFor('queue')}">查看全部</a></div><div class="cc-table-wrap">${taskTable(tasks.slice().sort((left, right) => scoreTask(right).total - scoreTask(left).total).slice(0, 8))}</div></section>`;
  }
  function taskTable(list) {
    return `<table class="cc-table"><thead><tr><th>客户</th><th>国家</th><th>关键词</th><th>状态</th><th>分数</th></tr></thead><tbody>${list.map(task => `<tr><td><a href="${urlFor('customer', { contact: task.taskId })}" target="_blank" rel="noopener">${esc(task.company)}</a></td><td>${esc(task.country)}</td><td>${esc(task.keyword)}</td><td><span class="cc-chip">${stateLabel(task.state)}</span></td><td>${scoreTask(task).total}</td></tr>`).join('')}</tbody></table>`;
  }
  function queue() {
    return pageHead('今日队列', '每个任务最终进入发送、排期、换渠道或自动跳过') + `<div class="cc-table-wrap">${taskTable(tasks)}</div>`;
  }
  function customers() {
    const rows = legacyRecords.slice(0, 1000);
    return `${pageHead('客户附表', `完整客户资料与筛选，当前载入 ${legacyRecords.length} 条`)}
      <div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>姓名</th><th>公司</th><th>职位</th><th>国家</th><th>平台</th><th>状态</th><th>ICP</th></tr></thead><tbody>${rows.map((record, index) => {
        const key = encodeURIComponent([record.platform, record.name, record.company, index].join('|'));
        return `<tr><td><a href="${urlFor('customer', { contact: key })}" target="_blank" rel="noopener">${esc(record.name)}</a></td><td>${esc(record.company)}</td><td>${esc(record.role)}</td><td>${esc(record.country)}</td><td>${esc(record.platform)}</td><td>${esc(record.status)}</td><td>${esc(record.fitScore || '')}</td></tr>`;
      }).join('')}</tbody></table></div>`;
  }
  function seo() {
    const metrics = analytics.buildKeywordMetrics(tasks);
    return `${pageHead('SEO 趋势', '搜索词转化率与区域趋势；无来源数据时明确显示不可用')}
      <section class="cc-panel"><div class="cc-panel-head"><h2>关键词漏斗</h2></div><div class="cc-panel-body">${metrics.length ? metrics.map(item => `<div class="cc-bar-row"><span>${esc(item.keyword)} · n=${item.sampleSize}</span><div class="cc-bar"><i style="width:${Math.round(item.rates.replyRate * 100)}%"></i></div><b>${Math.round(item.rates.replyRate * 100)}%</b></div>`).join('') : '<div class="cc-empty">暂无关键词数据</div>'}</div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>Google Trends 对比</h2></div><div class="cc-panel-body"><div class="cc-empty">data_unavailable · 未取得带地区、周期和时间戳的趋势数据，不显示猜测值。</div></div></section>`;
  }
  function experiments() {
    const metrics = analytics.buildTemplateMetrics(tasks);
    return `${pageHead('模板实验', '只以发送确认记录计算回复率和联系方式获取率')}
      <div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>模板</th><th>样本</th><th>确认发送</th><th>回复</th><th>回复率</th><th>联系方式率</th></tr></thead><tbody>${metrics.map(item => `<tr><td>${esc(item.templateId)}</td><td>${item.sampleSize}</td><td>${item.confirmedSends}</td><td>${item.replies}</td><td>${Math.round(item.replyRate * 100)}%</td><td>${Math.round(item.contactCaptureRate * 100)}%</td></tr>`).join('')}</tbody></table></div>`;
  }
  function audit() {
    return `${pageHead('自动化审计', 'Codex 决策与 QClaw 执行证据不可变留档')}
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
      <section class="cc-panel"><div class="cc-panel-head"><h2>开发信与执行证据</h2></div><div class="cc-panel-body"><div class="cc-message">${esc(record.approvedMessage || record.message || '暂无批准开发信')}</div><div class="cc-sub" style="margin-top:12px">精确目标：${esc(record.targetUrl || record.linkedin_url || '')}</div></div></section>`;
  }
  function rail() {
    const task = currentTask();
    if (!task) return '<aside class="cc-rail"><h2>Codex 决策</h2><div class="cc-empty">暂无任务</div></aside>';
    const score = scoreTask(task);
    return `<aside class="cc-rail"><div class="cc-rail-section"><h2>Codex 决策</h2>${Object.entries(score.components).map(([key, value]) => `<div class="cc-score-row"><span>${esc(key)}</span><b>${value}</b></div>`).join('')}</div>
      <div class="cc-rail-section"><h2>安全门</h2><div class="cc-evidence">精确主页：${task.targetUrl ? '通过' : '未通过'}<br>重复触达：系统校验<br>冷却期：系统校验<br>独代冲突：系统校验<br>优化尝试：${task.approvalAttempts || 0} / 2</div></div>
      <div class="cc-rail-section"><h2>QClaw 证据</h2><div class="cc-evidence">账号：${esc(task.targetUrl || '待核验')}<br>趋势：${esc(task.trend && task.trend.status || 'data_unavailable')}<br>发送：${esc(task.sendStatus || '待执行')}</div></div></aside>`;
  }

  const renderers = { workspace, queue, customers, seo, experiments, audit, settings, customer };
  document.body.classList.add('command-center-active');
  const shell = document.createElement('div');
  shell.className = 'cc-shell';
  shell.id = 'command-center-shell';
  shell.innerHTML = `${nav()}<main class="cc-main">${(renderers[view] || workspace)()}</main>${rail()}`;
  document.body.appendChild(shell);
}());
