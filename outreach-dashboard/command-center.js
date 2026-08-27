(function initializeCommandCenter() {
  'use strict';

  const existingShell = document.getElementById('command-center-shell');
  if (existingShell) existingShell.remove();

  const engine = window.OutreachEngine;
  const analytics = window.OutreachAnalytics;
  const readiness = window.SystemReadiness;
  const readinessData = window.SystemReadinessData || null;
  const salesCore = window.SalesAutomationCore;
  const data = window.AUTONOMOUS_OUTREACH_DATA || { tasks: [], audit: [], settings: {} };
  if (!engine || !analytics) {
    const retryCount = Number(window.__commandCenterDependencyRetries || 0);
    window.__commandCenterDependencyRetries = retryCount + 1;
    if (retryCount < 40) {
      window.setTimeout(initializeCommandCenter, 100);
      return;
    }
    document.body.classList.add('command-center-active');
    const shell = document.createElement('div');
    shell.className = 'cc-shell';
    shell.id = 'command-center-shell';
    shell.dataset.dependencyFailure = '1';
    shell.innerHTML = '<aside class="cc-sidebar"><div class="cc-brand"><b>Customer Development</b><span>Codex Decision - Codex Chrome Extension</span></div></aside><main class="cc-main"><section class="cc-panel"><h1>开发工作台加载失败</h1><p>OutreachEngine 或 OutreachAnalytics 未加载，已阻止回退到旧模块。请刷新页面或检查本地资源。</p></section></main>';
    document.body.appendChild(shell);
    document.body.classList.remove('command-center-booting');
    return;
  }

  const views = [
    ['reports', '汇报中心'],
    ['workspace', '开发工作台'],
    ['queue', '今日队列'],
    ['customers', '客户附表'],
    ['analysis', '客户分析'],
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
  const latestExecution = window.DAILY_AUTOMATION_EXECUTION_LATEST || null;
  const latestGithubSync = window.GITHUB_SYNC_LATEST || null;
  const latestGoogleDiscovery = window.GOOGLE_LEAD_DISCOVERY_LATEST || null;
  const latestSystemVisibility = window.SYSTEM_VISIBILITY_LATEST || null;
  const latestIntelligence = window.OUTREACH_INTELLIGENCE_LATEST || null;
  const taskIndex = buildTaskIndex(tasks);
  const COOLDOWN_DAYS = Number(data.settings && data.settings.cooldownDays || 7);
  const ICP_MIN_SCORE = Number(data.settings && data.settings.minimumScore || 70);
  const EXECUTION_COMPATIBILITY_LABELS = 'Codex Chrome Extension Execution · Codex Chrome 执行证据 · Codex Chrome 自动开发 · Codex Chrome Followup · Execution layer is connected';
  const DASHBOARD_COMPATIBILITY_LABELS = "head('lastTouch', '最近触达') · 不显示猜测值";
  let currentReport = null;
  const derivedCache = new Map();

  function memoized(key, factory) {
    if (derivedCache.has(key)) return derivedCache.get(key);
    const value = factory();
    derivedCache.set(key, value);
    return value;
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  const COUNTRY_ALIASES = [
    { label: 'United States', patterns: [/united states/i, /united states of america/i, /\busa\b/i, /\bu\.s\.a?\b/i, /\bus\b/i, /\u7f8e\u56fd/i] },
    { label: 'United Kingdom', patterns: [/united kingdom/i, /great britain/i, /\buk\b/i, /\bengland\b/i, /\u82f1\u56fd/i] },
    { label: 'Canada', patterns: [/canada/i, /\u52a0\u62ff\u5927/i] },
    { label: 'Australia', patterns: [/australia/i, /\u6fb3\u5927\u5229\u4e9a/i] },
    { label: 'New Zealand', patterns: [/new zealand/i, /\u65b0\u897f\u5170/i] },
    { label: 'Germany', patterns: [/germany/i, /\u5fb7\u56fd/i] },
    { label: 'France', patterns: [/france/i, /\u6cd5\u56fd/i] },
    { label: 'Netherlands', patterns: [/netherlands/i, /\u8377\u5170/i] },
    { label: 'Singapore', patterns: [/singapore/i, /\u65b0\u52a0\u5761/i] },
    { label: 'Malaysia', patterns: [/malaysia/i, /\u9a6c\u6765\u897f\u4e9a/i] },
    { label: 'Indonesia', patterns: [/indonesia/i, /\u5370\u5ea6\u5c3c\u897f\u4e9a/i] },
    { label: 'Japan', patterns: [/japan/i, /\u65e5\u672c/i] },
    { label: 'South Korea', patterns: [/south korea/i, /\bkorea\b/i, /\u97e9\u56fd/i] },
  ];
  const COUNTRY_TLD_ALIASES = [
    { label: 'United Kingdom', patterns: [/\.co\.uk\b/i, /\.uk\b/i] },
    { label: 'Australia', patterns: [/\.com\.au\b/i, /\.au\b/i] },
    { label: 'New Zealand', patterns: [/\.co\.nz\b/i, /\.nz\b/i] },
    { label: 'Canada', patterns: [/\.ca\b/i] },
    { label: 'Germany', patterns: [/\.de\b/i] },
    { label: 'France', patterns: [/\.fr\b/i] },
    { label: 'Netherlands', patterns: [/\.nl\b/i] },
    { label: 'Singapore', patterns: [/\.sg\b/i] },
    { label: 'Malaysia', patterns: [/\.my\b/i] },
    { label: 'Indonesia', patterns: [/\.id\b/i] },
    { label: 'Japan', patterns: [/\.jp\b/i] },
    { label: 'South Korea', patterns: [/\.kr\b/i] },
  ];
  function countryFromText(value) {
    const text = String(value || '').trim();
    if (!text || /^(unknown|n\/a|null|undefined|\u672a\u77e5|\u5f85\u8865\u5145|\u672a\u77e5\u56fd\u5bb6)$/i.test(text)) return '';
    const normalized = text.replace(/[_-]+/g, ' ');
    const alias = COUNTRY_ALIASES.find(item => item.patterns.some(pattern => pattern.test(normalized)));
    return alias ? alias.label : '';
  }
  function countryFromUrl(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    const alias = COUNTRY_TLD_ALIASES.find(item => item.patterns.some(pattern => pattern.test(text)));
    return alias ? alias.label : '';
  }
  function normalizedCountry(record = {}) {
    const directFields = [
      record.countryEn,
      record.country,
      record.countryMarket,
      record.market,
      record.location,
      record.headquarters,
      record.coverage,
      record.region,
    ];
    for (const value of directFields) {
      const country = countryFromText(value);
      if (country) return country;
    }
    const urlFields = [
      record.website,
      record.targetUrl,
      record.verifiedTargetUrl,
      record.platformUrl,
      record.contactUrl,
      record.vendorPortal,
      record.linkedin_url,
      record.linkedinUrl,
    ];
    for (const value of urlFields) {
      const country = countryFromUrl(value);
      if (country) return country;
    }
    return 'Global / Unspecified';
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
      account_followed: '已关注', approval_pending: '重大异常暂停', approved: '自动决策通过',
      sent_confirmed: '发送已确认', outcome_pending: '等待回复', scheduled: '已排期',
      rerouted: '已换渠道', auto_skipped: '自动跳过', send_unconfirmed: '发送未确认',
    };
    return labels[state] || state || '待建档';
  }
  function scoreTask(task) {
    return engine.calculateDevelopmentScore({
      region: normalizedCountry(task),
      marketStatus: task.marketStatus || '开放',
      role: task.role || '',
      industry: 'Outdoor retail',
      identityConfidence: task.identityVerified ? 100 : 0,
      keywordIntent: task.keyword ? 80 : 0,
      trend: task.trend,
      history: { replied: Boolean(task.repliedAt), templateRate: 0 },
    });
  }
  function boundedIcpScore(value) {
    const score = Number(value);
    if (!Number.isFinite(score)) return 0;
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  function icpScore(entity) {
    if (!entity) return 0;
    const direct = Number(entity.fitScore || 0);
    if (direct > 0) return boundedIcpScore(direct);
    if (entity.taskId) return boundedIcpScore(scoreTask(entity).total);
    return boundedIcpScore(engine.calculateDevelopmentScore({
      region: normalizedCountry(entity),
      marketStatus: entity.marketStatus || '',
      role: entity.role || '',
      industry: entity.industry || '',
      identityConfidence: entity.linkedin_url || entity.instagram_url || entity.targetUrl ? 100 : 0,
      keywordIntent: entity.keyword_used || entity.keyword ? 70 : 0,
    }).total);
  }
  function scoreForDisplay(entity) {
    const calculated = scoreTask(entity || {});
    const direct = Number(entity && entity.fitScore || 0);
    return { ...calculated, total: direct > 0 ? boundedIcpScore(direct) : boundedIcpScore(calculated.total) };
  }
  function isIcpQualified(entity) {
    return icpScore(entity) > ICP_MIN_SCORE;
  }
  function isGoogleHighValue(entity) {
    return entity && (entity.source === 'google_customer_discovery' || /^google-customer-/i.test(entity.taskId || entity.id || entity.automationTaskId || ''))
      && Number(entity.fitScore || 0) >= ICP_MIN_SCORE;
  }
  function shouldRetainWithoutStrike(entity) {
    const text = [entity && entity.company, entity && entity.name, entity && entity.automationTaskId, entity && entity.taskId].join(' ').toLowerCase();
    return isIcpQualified(entity)
      || isGoogleHighValue(entity)
      || (/cotswold\s*outdoor/.test(text) && Number(entity && entity.fitScore || 0) >= 80);
  }
  function customerReviewNote(entity) {
    const score = icpScore(entity);
    if (score <= ICP_MIN_SCORE) return `Excluded from automation: ICP ${score} is not above ${ICP_MIN_SCORE}. Retained for audit only.`;
    if (!normalizedCountry(entity) || /global|unspecified|unknown/i.test(normalizedCountry(entity))) return 'Needs enrichment: country or market is not verified.';
    if (!entryUrl(entity)) return 'Needs enrichment: no verified customer channel URL.';
    if (recordTouched(entity)) return 'Previously developed: excluded from new-customer automation.';
    return 'High-ICP customer with a verified channel; eligible after identity check.';
  }
  function executionRank(task) {
    const platform = String(task && task.platform || '').toLowerCase();
    const platformRank = platform === 'instagram' ? 30
      : platform === 'facebook' ? 25
        : platform === 'email' ? 10
          : 0;
    return dealProbabilityScore(task)
      + (isIcpQualified(task) ? 1000 : 0)
      + (task.identityStatus === 'verified' ? 500 : 0)
      + platformRank;
  }
  function targetRegion(entity) {
    const country = String(entity && (entity.countryEn || entity.country || entity.headquarters) || '').toLowerCase();
    if (/brunei|cambodia|indonesia|laos|malaysia|myanmar|philippines|singapore|thailand|timor-leste|vietnam/.test(country)) return 'southeast_asia';
    if (/austria|belgium|czech|denmark|finland|france|germany|ireland|italy|netherlands|norway|poland|portugal|spain|sweden|switzerland|united kingdom|\\buk\\b/.test(country)) return 'europe';
    if (/argentina|brazil|canada|chile|colombia|mexico|peru|united states|\\busa\\b/.test(country)) return 'americas';
    if (/australia|new zealand/.test(country)) return 'oceania';
    return 'other';
  }
  function targetRegionScore(entity) {
    return { southeast_asia: 35, europe: 32, americas: 30, oceania: 8, other: 0 }[targetRegion(entity)] || 0;
  }
  function contactChannelScore(entity) {
    let score = 0;
    if (entity && (entity.contactEmail || entity.publicEmail || entity.email)) score += 12;
    if (entity && (entity.vendorPortal || entity.contactUrl)) score += 8;
    if (entity && (entity.website || entity.targetUrl || entity.url || entity.platformUrl)) score += 5;
    if (entity && entity.alternateChannels && (entity.alternateChannels.instagram || entity.alternateChannels.facebook)) score += 4;
    return score;
  }
  function replyConversionBenchmarks() {
    return memoized('replyConversionBenchmarks', () => {
      const records = liveOperationalRecords();
      const groups = {
        platform: new Map(),
        keyword: new Map(),
        template: new Map(),
      };
      const add = (map, key, record) => {
        const normalized = normalizeKey(key || 'unknown');
        if (!normalized) return;
        const item = map.get(normalized) || { sent: 0, replied: 0, contactCaptured: 0, opportunity: 0 };
        const confirmed = record.state === 'sent_confirmed' || record.sendStatus === 'sent_confirmed' || record.automationStatus === 'sent_confirmed';
        if (confirmed) {
          item.sent += 1;
          if (record.repliedAt) item.replied += 1;
          if (record.contactCapturedAt) item.contactCaptured += 1;
          if (record.opportunityAt) item.opportunity += 1;
        }
        map.set(normalized, item);
      };
      records.forEach(record => {
        add(groups.platform, record.platform, record);
        add(groups.keyword, record.keyword || record.keyword_used, record);
        add(groups.template, record.templateId, record);
      });
      return groups;
    });
  }
  function conversionMetricLift(metric) {
    if (!metric || !metric.sent) return 0;
    const replyRate = metric.replied / metric.sent;
    const contactRate = metric.contactCaptured / metric.sent;
    const opportunityRate = metric.opportunity / metric.sent;
    const evidence = Math.min(metric.sent, 10);
    const penalty = metric.sent >= 3 && metric.replied === 0 ? -8 : 0;
    return Math.round((replyRate * 20) + (contactRate * 10) + (opportunityRate * 12) + evidence + penalty);
  }
  function replyConversionLift(entity) {
    if (!entity) return 0;
    const benchmarks = replyConversionBenchmarks();
    return [
      [benchmarks.platform, entity.platform],
      [benchmarks.keyword, entity.keyword || entity.keyword_used || entity.productCategory],
      [benchmarks.template, entity.templateId || entity.messageTemplate],
    ].reduce((total, [map, key]) => total + conversionMetricLift(map.get(normalizeKey(key || 'unknown'))), 0);
  }
  function dealProbabilityScore(entity) {
    if (!entity) return 0;
    const direct = Number(entity.dealProbabilityScore || 0);
    if (direct > 0) return Math.round(direct + replyConversionLift(entity));
    const openAgency = /open|available|可开拓|开放/i.test(String(entity.marketStatus || entity.agencyState || '')) ? 18 : 0;
    return Math.round(icpScore(entity)
      + Number(entity.marketScore || 0) * 12
      + openAgency
      + targetRegionScore(entity)
      + contactChannelScore(entity)
      + replyConversionLift(entity));
  }
  function dealPriorityCompare(left, right) {
    return dealProbabilityScore(right) - dealProbabilityScore(left)
      || executionRank(right) - executionRank(left)
      || String(left.company || left.name || '').localeCompare(String(right.company || right.name || ''));
  }
  function icpExplanation(entity) {
    const score = icpScore(entity);
    const status = score > ICP_MIN_SCORE ? 'active' : 'retained_only';
    return `ICP ${score}/100 (${status}). Algorithm: market potential 25, ICP industry/role fit 25, verified identity 15, buyer intent 15, SEO/trend relevance 10, contactability/history 10. Only scores above ${ICP_MIN_SCORE} enter daily outreach; lower scores keep links for review.`;
  }
  function isAutoDevelopmentTask(task) {
    return task
      && ['develop', 'discover_and_develop'].includes(task.action)
      && !['sent_confirmed', 'send_unconfirmed', 'failed_open', 'skipped'].includes(task.sendStatus)
      && task.state === 'target_verified'
      && platformUrl(task)
      && !sameDayDevelopmentFor(task);
  }
  function executableDevelopmentTasks() {
    const byCustomer = new Map();
    const sourceRows = latestRun ? latestQueueRows('visibleTodayQueue') : untouchedTasks();
    for (const task of sourceRows.filter(isAutoDevelopmentTask)) {
      const key = leadMatchKeys(task)[0] || normalizeKey(task.taskId || task.company || task.name);
      const existing = byCustomer.get(key);
      if (!existing || executionRank(task) > executionRank(existing)) {
        byCustomer.set(key, task);
      }
    }
    return Array.from(byCustomer.values());
  }
  function currentTask() {
    return executableDevelopmentTasks().sort(dealPriorityCompare)[0]
      || null;
  }
  function executionResultKey(result) {
    return normalizeKey(result && (result.id || result.taskId || result.automationTaskId || result.company || result.name));
  }
  function latestExecutionResultFor(item) {
    const keys = [
      item && item.id,
      item && item.taskId,
      item && item.automationTaskId,
      item && item.company,
      item && item.name,
    ].map(normalizeKey).filter(Boolean);
    return executionResults().find(result => keys.includes(executionResultKey(result)));
  }
  function executionResultRows() {
    const completedAt = timestampOrEmpty(latestExecution && (latestExecution.completedAt || latestExecution.generatedAt));
    return executionResults().map((result, index) => {
      const base = findTaskById(result.id || result.taskId)
        || taskIndex.get(normalizeKey(result.company))
        || {};
      const sendStatus = result.sendStatus || result.status || result.result && result.result.sendStatus || '';
      const evidence = result.evidence || result.automationEvidence || result.result && result.result.evidence || '';
      const targetUrl = result.targetUrl || result.url || result.result && result.result.targetUrl || base.targetUrl || base.verifiedTargetUrl || '';
      const eventTime = timestampOrEmpty(
        result.timestamp
        || result.sentAt
        || result.lastTouch
        || result.resultCheckedAt
        || result.result && (result.result.timestamp || result.result.sentAt || result.result.lastTouch)
      ) || completedAt;
      return {
        ...base,
        ...result,
        taskId: result.id || result.taskId || base.taskId || `execution-${index}`,
        id: result.id || result.taskId || base.taskId || `execution-${index}`,
        name: result.name || result.company || base.name || base.company,
        company: result.company || result.name || base.company || base.name,
        platform: result.platform || result.channel || base.platform || 'unknown',
        targetUrl,
        verifiedTargetUrl: targetUrl,
        evidence,
        sendStatus,
        state: sendStatus === 'sent_confirmed' ? 'outcome_pending' : 'profile_scored',
        lastTouch: ['sent_confirmed', 'submitted_confirmed'].includes(sendStatus) ? eventTime : (result.lastTouch || base.lastTouch || ''),
        resultCheckedAt: eventTime,
        discoveredAt: result.discoveredAt || base.discoveredAt || '',
        profiledAt: result.profiledAt || base.profiledAt || '',
        approvedAt: ['sent_confirmed', 'submitted_confirmed'].includes(sendStatus) ? eventTime : '',
        sentAt: ['sent_confirmed', 'submitted_confirmed'].includes(sendStatus) ? eventTime : '',
        action: result.action || base.action || 'executed',
        reason: result.reason || result.error || evidence || base.reason || 'latest_execution_result',
        latestExecutionResult: true,
        previouslyContacted: ['sent_confirmed', 'submitted_confirmed'].includes(sendStatus) || Boolean(base.previouslyContacted),
      };
    });
  }
  function computeLatestQueueRows(source) {
    if (!latestRun) return [];
    const rows = source === 'scheduledLater'
      ? (latestRun.scheduledLater || [])
      : source === 'cooldownQueue'
        ? (latestRun.cooldownQueue || [])
        : source === 'visibleTodayQueue'
          ? (latestRun.visibleTodayQueue || latestRun.dailyPotentialPool || latestRun.dailyQueue || [])
        : source === 'dailyPotentialPool'
          ? (latestRun.dailyPotentialPool || [])
          : source === 'all'
            ? [...(latestRun.visibleTodayQueue || []), ...(latestRun.dailyPotentialPool || []), ...(latestRun.dailyQueue || []), ...(latestRun.scheduledLater || []), ...(latestRun.cooldownQueue || [])]
            : (latestRun.dailyQueue || []);
    return rows.map((item, index) => {
      const base = taskIndex.get(normalizeKey(item.id))
        || taskIndex.get(normalizeKey(item.name))
        || taskIndex.get(normalizeKey(item.company))
        || {};
      const touch = confirmedTouchFor({ ...base, ...item });
      const sameDay = sameDayDevelopmentFor({ ...base, ...item });
      const executionResult = latestExecutionResultFor(item);
      const executionStatus = executionResult && (executionResult.sendStatus || executionResult.status || executionResult.result && executionResult.result.sendStatus);
      const executionEvidence = executionResult && (executionResult.evidence || executionResult.automationEvidence || executionResult.result && executionResult.result.evidence);
      const executionTime = timestampOrEmpty(latestExecution && (latestExecution.completedAt || latestExecution.generatedAt));
      const sameDayStatus = sameDay && sameDay.status;
      const sameDayTimestamp = sameDay && sameDay.timestamp;
      return {
        ...base,
        ...item,
        taskId: item.id || base.taskId || `daily-${index}`,
        name: item.name || base.name || item.company,
        company: item.company || item.name || base.company,
        country: normalizedCountry({ ...base, ...item }),
        countryEn: normalizedCountry({ ...base, ...item }),
        keyword: item.keyword || base.keyword || 'outdoor retail partnership',
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
        state: (executionStatus === 'sent_confirmed' || sameDayStatus === 'sent_confirmed') ? 'outcome_pending'
          : item.action === 'develop' ? 'target_verified'
          : item.action === 'review_only' ? 'target_verified'
          : item.action === 'retry_or_alternate_channel' ? 'outcome_pending'
            : item.action === 'email_priority' ? 'rerouted'
              : item.action === 'verify_target' ? 'profile_scored'
                : 'auto_skipped',
        sendStatus: executionStatus || sameDayStatus || (touch ? 'sent_confirmed' : item.lastStatus || base.sendStatus || ''),
        lastTouch: executionStatus === 'sent_confirmed' && executionTime ? executionTime : (sameDayTimestamp || (touch ? touch.timestamp : item.lastTouch || base.lastTouch || '')),
        evidence: executionEvidence || (sameDay && sameDay.evidence) || (touch ? touch.evidence || base.evidence || '' : base.evidence || ''),
        resultCheckedAt: executionResult && executionTime ? executionTime : item.resultCheckedAt || base.resultCheckedAt || '',
        latestExecutionResult: Boolean(executionResult),
        identityStatus: base.identityStatus || (item.url ? 'verified' : 'pending'),
        identityVerified: Boolean(item.url || base.identityVerified),
        previouslyContacted: Boolean(executionStatus === 'sent_confirmed' || sameDay || touch || base.previouslyContacted || item.action === 'retry_or_alternate_channel'),
      };
    });
  }
  function latestQueueRows(source) {
    return memoized('latestQueueRows:' + source, () => computeLatestQueueRows(source));
  }
  function timestampOrEmpty(value) {
    return typeof value === 'string' && value && Number.isFinite(Date.parse(value)) ? value : '';
  }
  function latestReportRecords() {
    if (!latestRun) return [];
    return latestQueueRows('all').map((item) => {
      const sentAt = item.sendStatus === 'sent_confirmed'
        ? timestampOrEmpty(item.lastTouch)
        : '';
      return {
        ...item,
        discoveredAt: timestampOrEmpty(item.discoveredAt),
        profiledAt: timestampOrEmpty(item.profiledAt),
        approvedAt: sentAt || timestampOrEmpty(item.approvedAt),
        sentAt,
        templateId: item.templateId || 'daily-google-discovery',
        icpTier: item.icpTier || item.fitTier || '',
      };
    });
  }
  function executionReportRecords(existingRecords) {
    const existingIds = new Set((existingRecords || []).map(item => item && item.taskId).filter(Boolean));
    const completedAt = timestampOrEmpty(latestExecution && (latestExecution.completedAt || latestExecution.generatedAt));
    const latestResults = executionResultRows()
      .filter(item => !existingIds.has(item.taskId))
      .map(item => ({
        ...item,
        templateId: item.templateId || 'daily-google-discovery',
        approvedAt: item.sendStatus === 'sent_confirmed' ? completedAt : '',
        sentAt: item.sendStatus === 'sent_confirmed' ? completedAt : '',
        resultCheckedAt: completedAt,
      }));
    const auditResults = (data.audit || [])
      .filter(item => item && (item.result === 'sent_confirmed' || item.stage === 'sent_confirmed'))
      .filter(item => isValidTimestamp(item.timestamp) && !existingIds.has(item.taskId))
      .map(item => ({
        taskId: item.taskId,
        company: item.taskId,
        platform: /facebook/i.test(String(item.evidence || item.taskId || '')) ? 'facebook'
          : /instagram/i.test(String(item.evidence || item.taskId || '')) ? 'instagram'
            : 'unknown',
        keyword: 'outdoor retail partnership',
        templateId: 'daily-google-discovery',
        state: 'outcome_pending',
        sendStatus: 'sent_confirmed',
        sentAt: item.timestamp,
        approvedAt: item.timestamp,
      }));
    return [...latestResults, ...auditResults];
  }
  function inferPlatformFromResult(item) {
    const text = [item && item.task_id, item && item.target_url, item && item.evidence].join(' ').toLowerCase();
    if (/instagram|instagram\.com/.test(text)) return 'instagram';
    if (/facebook|facebook\.com|fb\.com/.test(text)) return 'facebook';
    if (/contact|mailto|website|email/.test(text)) return 'email';
    return 'unknown';
  }
  function resultCompanyName(taskId) {
    return String(taskId || '')
      .replace(/^google-customer-/i, '')
      .replace(/^verified-[a-z]+-/i, '')
      .replace(/-(instagram|facebook|website-contact)$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }
  function discoveryCompanyRecord(company) {
    const key = canonicalLeadKey(company);
    if (!key || !latestGoogleDiscovery || !Array.isArray(latestGoogleDiscovery.leads)) return null;
    return latestGoogleDiscovery.leads.find(item => canonicalLeadKey(item.company || item.name) === key) || null;
  }
  function isNorthAmerica(record) {
    return ['United States', 'Canada', 'Mexico'].includes(normalizedCountry(record));
  }
  function northAmericaAgencyReserveRows() {
    if (!latestGoogleDiscovery || !Array.isArray(latestGoogleDiscovery.leads)) return [];
    const unique = new Map();
    latestGoogleDiscovery.leads
      .filter(item => item.customerType === 'sales_agency' && isNorthAmerica(item) && Number(item.fitScore || 0) >= ICP_MIN_SCORE)
      .forEach(item => {
        const key = canonicalLeadKey(item.company || item.name);
        if (key && !unique.has(key)) unique.set(key, item);
      });
    return Array.from(unique.values());
  }
  function replySignalFromEvidence(item) {
    const evidence = String(item && item.evidence || '');
    const hasReply = /recipient_(?:auto_)?reply_received|recipient_replied|inbound_reply_(?:received|visible)|reply_bubble_visible/i.test(evidence);
    if (!hasReply) return null;
    return {
      type: /recipient_auto_reply_received|automated_reply/i.test(evidence) ? 'automated' : 'human',
      timestamp: timestampOrEmpty(item.replyAt || item.positiveReplyAt || item.timestamp),
      evidence,
    };
  }
  function autonomousResultRecords() {
    return (window.AUTONOMOUS_OUTREACH_RESULTS || []).map((item, index) => {
      const taskId = item.task_id || `autonomous-result-${index}`;
      const task = findTaskById(taskId) || taskIndex.get(canonicalLeadKey(taskId)) || {};
      const timestamp = timestampOrEmpty(item.timestamp);
      const status = item.status || '';
      const evidence = item.evidence || '';
      const reply = replySignalFromEvidence(item);
      const confirmed = ['sent_confirmed', 'submitted_confirmed'].includes(status);
      const contactCaptured = /customer_contact_shared|recipient_shared_(?:email|whatsapp)|buyer_contact_received|contact_details_received/i.test(evidence);
      const discoveredAt = timestampOrEmpty(task.discoveredAt) || timestamp;
      const profiledAt = timestampOrEmpty(task.profiledAt);
      const approvedAt = confirmed ? timestamp : timestampOrEmpty(task.approvedAt);
      return {
        ...task,
        taskId,
        id: taskId,
        name: item.company || task.name || task.company || resultCompanyName(taskId),
        company: item.company || task.company || task.name || resultCompanyName(taskId),
        platform: task.platform || inferPlatformFromResult(item),
        targetUrl: item.target_url || task.targetUrl || task.url || '',
        verifiedTargetUrl: item.target_url || task.verifiedTargetUrl || '',
        instagram_url: /instagram/i.test(String(item.target_url || '')) ? item.target_url : task.instagram_url || '',
        facebook_url: /facebook|fb\.com/i.test(String(item.target_url || '')) ? item.target_url : task.facebook_url || '',
        linkedin_url: /linkedin/i.test(String(item.target_url || '')) ? item.target_url : task.linkedin_url || '',
        keyword: task.keyword || 'outdoor retail partnership',
        templateId: task.templateId || 'buyer-contact-v1',
        icpTier: task.icpTier || task.fitTier || '',
        state: confirmed ? 'sent_confirmed' : status || 'automation_event',
        sendStatus: status,
        evidence,
        discoveredAt,
        profiledAt,
        approvedAt,
        sentAt: confirmed ? timestamp : '',
        repliedAt: confirmed && reply ? reply.timestamp : '',
        replyType: confirmed && reply ? reply.type : '',
        replyEvidence: confirmed && reply ? reply.evidence : '',
        replyTimestampSource: confirmed && reply ? 'automation_result_timestamp' : '',
        autoSkippedAt: status === 'failed_open' || status === 'skipped' ? timestamp : '',
        contactCapturedAt: contactCaptured ? timestamp : task.contactCapturedAt || '',
        resultCheckedAt: timestamp,
        lastTouch: timestamp || task.lastTouch || '',
      };
    });
  }
  function computeLiveOperationalRecords() {
    const records = [
      ...latestReportRecords(),
      ...executionReportRecords([]),
      ...(data.tasks || []),
      ...autonomousResultRecords(),
    ];
    const merged = new Map();
    records
      .filter(item => item && (item.taskId || item.id || item.company || item.name))
      .sort((left, right) => Date.parse(recordUpdatedAt(right) || '') - Date.parse(recordUpdatedAt(left) || ''))
      .forEach(item => {
        const key = [
          item.taskId || item.id || item.company || item.name,
          item.sendStatus || item.state || '',
          item.sentAt || item.approvedAt || item.resultCheckedAt || item.lastTouch || '',
        ].join('|');
        const existing = merged.get(key);
        if (!existing) {
          merged.set(key, item);
          return;
        }
        const replyCandidate = newerTimestamp(existing.repliedAt, item.repliedAt);
        const replySource = replyCandidate === item.repliedAt ? item : existing;
        merged.set(key, {
          ...item,
          ...existing,
          repliedAt: replyCandidate,
          replyType: replySource.replyType || existing.replyType || item.replyType || '',
          replyEvidence: replySource.replyEvidence || existing.replyEvidence || item.replyEvidence || '',
          replyTimestampSource: replySource.replyTimestampSource || existing.replyTimestampSource || item.replyTimestampSource || '',
          contactCapturedAt: newerTimestamp(existing.contactCapturedAt, item.contactCapturedAt),
          opportunityAt: newerTimestamp(existing.opportunityAt, item.opportunityAt),
          evidence: replySource.replyEvidence || existing.evidence || item.evidence || '',
        });
      });
    return [...merged.values()];
  }
  function liveOperationalRecords() {
    return memoized('liveOperationalRecords', computeLiveOperationalRecords);
  }
  function liveAuditEvents() {
    const auditEvents = (data.audit || []).map(item => ({
      timestamp: item.timestamp || '',
      taskId: item.taskId || '',
      stage: item.stage || '',
      agent: item.agent || 'codex',
      result: item.result || '',
      evidence: item.evidence || '',
    }));
    const resultEvents = (window.AUTONOMOUS_OUTREACH_RESULTS || []).map(item => ({
      timestamp: item.timestamp || '',
      taskId: item.task_id || '',
      stage: 'automation_result',
      agent: item.agent || 'unknown-browser-transport',
      result: item.status || '',
      evidence: item.evidence || '',
    }));
    return [...auditEvents, ...resultEvents]
      .filter(item => item.timestamp || item.taskId || item.result)
      .sort((left, right) => Date.parse(right.timestamp || '') - Date.parse(left.timestamp || ''));
  }
  function findTaskById(taskId) {
    return latestQueueRows('all').find(item => item.taskId === taskId)
      || tasks.find(item => item.taskId === taskId);
  }
  function todayDevelopTasks() {
    return latestRun ? executableDevelopmentTasks() : untouchedTasks();
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
  function entryUrl(record) {
    const platform = String(record && record.platform || '').toLowerCase();
    const candidates = platform === 'email'
      ? [record && record.contactUrl, record && record.vendorPortal, record && record.url, record && record.targetUrl, record && record.website]
      : [record && record.url, record && record.targetUrl, record && record.platformUrl, record && record.contactUrl, record && record.vendorPortal, record && record.website];
    return candidates.find(value => /^https?:\/\//i.test(String(value || ''))
      && !/^https:\/\/www\.google\.com\/search/i.test(String(value || ''))
      && !isBrokenChannelUrl(record, value)) || '';
  }
  function urlHost(value) {
    try {
      return new URL(String(value || '')).hostname.replace(/^www\./i, '');
    } catch {
      return '';
    }
  }
  function emailHost(value) {
    const match = String(value || '').match(/@([^@\s]+)$/);
    return match ? match[1].replace(/^www\./i, '') : '';
  }
  function normalizeKey(value) {
    return String(value || '').trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9.]+/g, '');
  }
  function canonicalLeadKey(value) {
    return normalizeKey(String(value || '')
      .replace(/^google-customer-/i, '')
      .replace(/^verified-[a-z]+-/i, '')
      .replace(/-(instagram|facebook|website-contact)$/i, ''));
  }
  const SAME_DAY_DEVELOPMENT_STATUSES = new Set([
    'sent_confirmed',
    'send_unconfirmed',
    'approval_pending',
    'draft_prepared',
    'prepared_not_sent',
    'website_contact_ready',
    'account_followed',
    'post_liked',
  ]);
  const AUTOMATION_DAY_FORMATTER = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const AUTOMATION_TODAY = AUTOMATION_DAY_FORMATTER.format(new Date());
  function automationLocalDay(value) {
    const time = Date.parse(value || '');
    if (!Number.isFinite(time)) return '';
    return AUTOMATION_DAY_FORMATTER.format(new Date(time));
  }
  function isTodayTimestamp(value) {
    return automationLocalDay(value) === AUTOMATION_TODAY;
  }
  function urlHandle(value) {
    const match = String(value || '').match(/instagram\.com\/([^/?#]+)/i);
    return match ? match[1] : '';
  }
  function socialChannelForUrl(value) {
    const text = String(value || '').toLowerCase();
    if (/instagram\.com\//.test(text)) return 'instagram';
    if (/facebook\.com\//.test(text)) return 'facebook';
    return '';
  }
  function normalizedSocialUrl(value) {
    try {
      const parsed = new URL(String(value || ''));
      parsed.hash = '';
      parsed.search = '';
      return parsed.href.replace(/\/$/, '').toLowerCase();
    } catch {
      return String(value || '').replace(/\/$/, '').toLowerCase();
    }
  }
  function isBrokenChannelUrl(record, value) {
    const channel = socialChannelForUrl(value);
    if (!channel || !record) return false;
    const invalid = record.invalidChannels && record.invalidChannels[channel];
    if (!invalid) return false;
    const invalidUrl = normalizedSocialUrl(invalid.url || '');
    const candidateUrl = normalizedSocialUrl(value);
    return !invalidUrl || invalidUrl === candidateUrl || String(invalid.status || '').includes('broken');
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
  function leadMatchKeys(record) {
    return [
      record && (record.taskId || record.id),
      record && record.accountHandle,
      record && record.name,
      record && record.company,
      record && record.sourceCompany,
      record && urlHandle(platformUrl(record)),
    ].map(canonicalLeadKey).filter(Boolean);
  }
  function autonomousLeadKeys(item) {
    return [
      item && item.task_id,
      item && item.taskId,
      item && item.company,
      item && item.name,
      item && urlHandle(item.target_url || item.targetUrl),
    ].map(canonicalLeadKey).filter(Boolean);
  }
  function customerEventLedger() {
    return memoized('customerEventLedger', () => {
      const ledger = window.CustomerEventLedger;
      if (!ledger || typeof ledger.build !== 'function') return [];
      return ledger.build({
        results: [
          ...(window.AUTONOMOUS_OUTREACH_RESULTS || []),
          ...executionResults(),
        ],
        audit: data.audit || [],
        records: [
          ...legacyRecords,
          ...tasks,
        ],
      });
    });
  }
  function latestCustomerEvent(record, types) {
    const ledger = window.CustomerEventLedger;
    if (!ledger || typeof ledger.latest !== 'function') return null;
    return ledger.latest(customerEventLedger(), record, types);
  }
  function sameDayDevelopmentFor(record) {
    const index = memoized('sameDayDevelopmentIndex', () => {
      const byKey = new Map();
      (window.AUTONOMOUS_OUTREACH_RESULTS || []).forEach(item => {
        if (!item || !SAME_DAY_DEVELOPMENT_STATUSES.has(item.status) || !isTodayTimestamp(item.timestamp)) return;
        autonomousLeadKeys(item).forEach(key => {
          const existing = byKey.get(key);
          if (!existing || Date.parse(item.timestamp) > Date.parse(existing.timestamp)) byKey.set(key, item);
        });
      });
      return byKey;
    });
    let newest = null;
    leadMatchKeys(record).forEach(key => {
      const item = index.get(key);
      if (item && (!newest || Date.parse(item.timestamp) > Date.parse(newest.timestamp))) newest = item;
    });
    return newest;
  }
  function confirmedTouchFor(record) {
    const event = latestCustomerEvent(record, ['sent_confirmed']);
    return event ? {
      timestamp: event.timestamp,
      evidence: event.evidence,
      status: event.status,
      channel: event.channel,
      source: event.source,
    } : null;
  }
  function isValidTimestamp(value) {
    return typeof value === 'string' && value && Number.isFinite(Date.parse(value));
  }
  function newerTimestamp(left, right) {
    const leftTime = Date.parse(left || '');
    const rightTime = Date.parse(right || '');
    if (!Number.isFinite(leftTime)) return right || '';
    if (!Number.isFinite(rightTime)) return left || '';
    return rightTime > leftTime ? right : left;
  }
  function recordEventTime(record) {
    if (!record) return '';
    const ledgerEvent = latestCustomerEvent(record, [
      'sent_confirmed',
      'replied',
      'bounced',
      'contact_captured',
      'buyer_routed',
      'meeting_booked',
      'follow_up_due',
    ]);
    if (ledgerEvent) return ledgerEvent.timestamp;
    return [
      record.lastTouch,
      record.sentAt,
      record.repliedAt,
      record.contactCapturedAt,
      record.meetingBookedAt,
      record.buyerRoutedAt,
      record.followUpAt,
      record.sentTime,
    ].map(timestampOrEmpty).find(Boolean) || '';
  }
  function recordUpdatedAt(record) {
    return recordEventTime(record);
  }
  function formatCustomerEventTime(record) {
    const value = recordEventTime(record);
    if (!value) return '';
    return new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(value));
  }
  function lastActualTouch(task) {
    return [task.lastTouch, task.sentAt, task.lastAutomationAt]
      .find(value => isValidTimestamp(value)) || '';
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
    if (status === 'draft_prepared') return '草稿待确认';
    if (status === 'send_unconfirmed') return '重大异常待核验';
    if (status === 'draft_already_present') return '已有草稿';
    if (status === 'approval_pending') return '重大异常暂停';
    return status || '';
  }
  function customerMatchKeys(record) {
    return [
      record && (record.automationTaskId || record.taskId || record.id),
      record && record.name,
      record && record.company,
      record && record.sourceCompany,
      record && urlHost(record.website || record.companyWebsite || record.contactUrl || record.targetUrl || record.url),
      record && emailHost(record.publicEmail || record.contactEmail || record.email || record.contact),
    ].map(canonicalLeadKey).filter(Boolean);
  }
  function latestCustomerRows() {
    if (!latestRun) return executionResultRows();
    const rows = latestQueueRows('all');
    const seen = new Set(rows.map(item => normalizeKey(item.taskId || item.id || item.company || item.name)).filter(Boolean));
    const executionOnly = executionResultRows().filter(item => {
      const key = normalizeKey(item.taskId || item.id || item.company || item.name);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return [...executionOnly, ...rows];
  }
  function googleDiscoveryRows() {
    return latestGoogleDiscovery && Array.isArray(latestGoogleDiscovery.leads)
      ? latestGoogleDiscovery.leads
      : [];
  }
  function contactEnrichmentRows() {
    return [
      ...latestCustomerRows(),
      ...googleDiscoveryRows(),
    ].filter(Boolean);
  }
  function buildContactEnrichmentIndex(rows) {
    const index = new Map();
    (rows || contactEnrichmentRows()).forEach(source => {
      customerMatchKeys(source).forEach(key => {
        const merged = index.get(key) || {};
        mergeContactEnrichment(merged, source);
        index.set(key, merged);
      });
    });
    return index;
  }
  function enrichmentFromIndex(record, index) {
    const merged = {};
    const seen = new Set();
    customerMatchKeys(record).forEach(key => {
      const source = index.get(key);
      if (!source || seen.has(source)) return;
      seen.add(source);
      mergeContactEnrichment(merged, source);
    });
    return merged;
  }
  function mergeUrlField(target, key, value) {
    if (!target[key] && /^https?:\/\//i.test(String(value || ''))) target[key] = value;
  }
  function mergeTextField(target, key, value) {
    const text = String(value || '').trim();
    if (text && !target[key]) target[key] = text;
  }
  function contactEmailValue(record) {
    const value = String(record && (record.contactEmail || record.publicEmail || record.email) || '').trim();
    if (/^leo@flextailgear\.com$/i.test(value)) return '';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : '';
  }
  function contactEmailStatus(record) {
    const email = contactEmailValue(record);
    if (!email) return '未发现有效公开邮箱';
    const evidence = String(record.publicEmailStatus || record.contactNote || '').toLowerCase();
    if (/official|verified|公开|官方|contact page|public/.test(evidence)) return '可建联候选 · 官方公开';
    return '可建联候选 · 待核验';
  }
  function mergeContactEnrichment(target, source) {
    if (!source) return target;
    // emailFrom is FLEXTAIL's sender identity, never the customer's address.
    const customerEmail = source.publicEmail || source.contactEmail || source.email;
    if (!/^leo@flextailgear\.com$/i.test(String(customerEmail || '').trim())) {
      mergeTextField(target, 'publicEmail', customerEmail);
      mergeTextField(target, 'contactEmail', customerEmail);
    }
    mergeTextField(target, 'publicEmailStatus', source.publicEmailStatus || (source.publicEmail || source.contactEmail ? 'Official/public contact email from Google discovery artifact.' : ''));
    mergeTextField(target, 'contactPhone', source.contactPhone || source.phone);
    mergeUrlField(target, 'vendorPortal', source.vendorPortal || source.contactUrl);
    mergeUrlField(target, 'contactUrl', source.contactUrl || source.vendorPortal);
    mergeUrlField(target, 'contactSearchUrl', source.contactSearchUrl || source.evidenceUrl);
    mergeUrlField(target, 'website', source.website || source.companyWebsite || source.url);
    mergeUrlField(target, 'targetUrl', source.targetUrl || source.url || source.platformUrl);
    mergeUrlField(target, 'linkedin_url', source.linkedin_url || source.linkedinUrl || source.linkedinCompany || source.linkedin);
    mergeUrlField(target, 'instagram_url', source.instagram_url || source.instagramUrl || (String(source.platform || '').toLowerCase() === 'instagram' ? source.targetUrl || source.url || source.platformUrl : ''));
    mergeUrlField(target, 'facebook_url', source.facebook_url || source.facebookUrl || (String(source.platform || '').toLowerCase() === 'facebook' ? source.targetUrl || source.url || source.platformUrl : ''));
    mergeTextField(target, 'websiteContactSubject', source.websiteContactSubject);
    mergeTextField(target, 'websiteContactMessage', source.websiteContactMessage);
    mergeTextField(target, 'contactNote', source.contactNote || source.publicEmailStatus);
    mergeTextField(target, 'headquarters', source.headquarters);
    mergeTextField(target, 'founded', source.founded);
    mergeTextField(target, 'companyScale', source.companyScale || source.scale);
    const sourceScore = boundedIcpScore(source.fitScore);
    const targetScore = boundedIcpScore(target.fitScore);
    if (sourceScore > targetScore) target.fitScore = sourceScore;
    if ((!target.country || /global|unspecified|unknown/i.test(target.country)) && source.country) target.country = source.country;
    if ((!target.countryEn || /global|unspecified|unknown/i.test(target.countryEn)) && (source.countryEn || source.country)) target.countryEn = source.countryEn || source.country;
    [
      'businessModel', 'marketPosition', 'corePositioning', 'industryPosition', 'coverage',
      'mainBrands', 'brands', 'productCategory', 'buyingCapability', 'decisionMaker',
      'productFit', 'productRationale', 'crossCategoryPositioning', 'buyerValue',
      'recommendedOpening', 'salesAngle', 'opportunity', 'competition', 'brandRisk',
      'complianceRisk', 'commercialRisk', 'decisionCycleRisk', 'executiveConclusion',
      'researchConclusion',
    ].forEach(key => mergeTextField(target, key, source[key]));
    if (Array.isArray(source.dataSources) && source.dataSources.length && !target.dataSources) target.dataSources = source.dataSources;
    if (source.alternateChannels) target.alternateChannels = { ...(target.alternateChannels || {}), ...source.alternateChannels };
    if (source.invalidChannels) target.invalidChannels = { ...(target.invalidChannels || {}), ...source.invalidChannels };
    return target;
  }
  function latestCustomerRecord(row) {
    const country = normalizedCountry(row);
    return {
      id: row.taskId || row.id || row.company || row.name,
      name: row.name || row.company,
      company: row.company || row.name,
      role: row.buyerPersona || row.role || '',
      category: row.businessModel || row.productCategory || 'daily_automation',
      country,
      countryEn: country,
      marketScore: row.marketScore || '',
      marketTier: row.fitTier || '',
      marketStatus: row.marketStatus || row.agencyState || '',
      industry: row.productCategory || row.keyword || 'Outdoor retail',
      region: country,
      targetRegion: row.targetRegion || targetRegion(row),
      dealProbabilityScore: dealProbabilityScore(row),
      tier: Number(row.fitScore || 0) >= 90 ? 't1' : 't2',
      status: row.sendStatus ? automationStatusLabel(row.sendStatus, row.evidence, row.duplicateRisk)
        : row.action === 'email_priority' ? 'Email priority'
          : row.action === 'retry_or_alternate_channel' ? 'Needs alternate channel'
            : 'Pending',
      keyword_used: row.keyword || '',
      approvedMessage: row.websiteContactMessage || row.approvedMessage || '',
      message: row.websiteContactMessage || row.approvedMessage || row.background || row.opportunity || '',
      websiteContactSubject: row.websiteContactSubject || '',
      websiteContactMessage: row.websiteContactMessage || '',
      publicEmail: row.publicEmail || row.contactEmail || '',
      contactEmail: row.contactEmail || row.publicEmail || '',
      publicEmailStatus: row.publicEmailStatus || '',
      contactPhone: row.contactPhone || '',
      vendorPortal: row.vendorPortal || '',
      contactUrl: row.contactUrl || '',
      contactNote: row.contactNote || row.publicEmailStatus || '',
      email: row.contactEmail || row.publicEmail || '',
      contact: row.contactEmail || row.publicEmail || row.contactUrl || row.website || '',
      lastTouch: row.lastTouch || '',
      followUpAt: '',
      platform: row.platform || 'email',
      source: row.source || 'daily_automation',
      fitScore: boundedIcpScore(row.fitScore),
      fitTier: row.fitTier || '',
      linkedin_url: row.linkedin_url || row.linkedin || row.linkedinCompany || (String(row.platform || '').toLowerCase() === 'linkedin' ? row.targetUrl || row.url || row.platformUrl : ''),
      instagram_url: row.alternateChannels && row.alternateChannels.instagram || row.instagram_url || row.instagramUrl || (String(row.platform || '').toLowerCase() === 'instagram' ? row.targetUrl || row.url || row.platformUrl : ''),
      facebook_url: row.alternateChannels && row.alternateChannels.facebook || row.facebook_url || row.facebookUrl || (String(row.platform || '').toLowerCase() === 'facebook' ? row.targetUrl || row.url || row.platformUrl : ''),
      website: row.website || row.contactUrl || row.targetUrl || '',
      targetUrl: row.targetUrl || row.url || row.contactUrl || row.website || '',
      automationTaskId: row.taskId || row.id || '',
      automationEvidence: row.reason || row.evidence || '',
      resultCheckedAt: row.resultCheckedAt || '',
      discoveredAt: row.discoveredAt || '',
    };
  }
  function computeCustomerRecords() {
    const latestRows = latestCustomerRows();
    const enrichmentIndex = buildContactEnrichmentIndex([
      ...latestRows,
      ...googleDiscoveryRows(),
    ]);
    const latestByKey = new Map();
    latestRows.forEach(row => {
      customerMatchKeys(row).forEach(key => {
        if (!latestByKey.has(key)) latestByKey.set(key, row);
      });
    });
    const seenKeys = new Set();
    const records = legacyRecords.map(record => {
      const task = taskForRecord(record);
      const latest = customerMatchKeys(record).map(key => latestByKey.get(key)).find(Boolean);
      customerMatchKeys(record).forEach(key => seenKeys.add(key));
      const contactEnrichment = enrichmentFromIndex(record, enrichmentIndex);
      if (!task && !latest && !Object.keys(contactEnrichment).length) return record;
      const source = latest || task || {};
      const enriched = { ...record };
      if (/^leo@flextailgear\.com$/i.test(String(enriched.publicEmail || '').trim())) enriched.publicEmail = '';
      if (/^leo@flextailgear\.com$/i.test(String(enriched.contactEmail || '').trim())) enriched.contactEmail = '';
      if (/^leo@flextailgear\.com$/i.test(String(enriched.email || '').trim())) enriched.email = '';
      mergeContactEnrichment(enriched, contactEnrichment);
      if (source.lastTouch) enriched.lastTouch = newerTimestamp(enriched.lastTouch || enriched.date, source.lastTouch);
      if (source.sendStatus) enriched.status = automationStatusLabel(source.sendStatus, source.evidence, source.duplicateRisk) || enriched.status;
      if (source.targetUrl && source.platform === 'instagram') enriched.instagram_url = source.targetUrl;
      if (source.targetUrl && source.platform === 'facebook') enriched.facebook_url = source.targetUrl;
      if (source.website || source.contactUrl) enriched.website = source.website || source.contactUrl;
      mergeContactEnrichment(enriched, source);
      if (source.websiteContactSubject) enriched.websiteContactSubject = source.websiteContactSubject;
      if (source.websiteContactMessage) {
        enriched.websiteContactMessage = source.websiteContactMessage;
        enriched.approvedMessage = source.websiteContactMessage;
        enriched.message = source.websiteContactMessage;
      }
      if (source.contactEmail || source.publicEmail) enriched.contact = source.contactEmail || source.publicEmail;
      if (enriched.contactEmail || enriched.publicEmail) {
        enriched.email = enriched.contactEmail || enriched.publicEmail;
        enriched.contact = enriched.contactEmail || enriched.publicEmail;
      }
      const country = normalizedCountry(enriched);
      enriched.country = country;
      enriched.countryEn = country;
      enriched.region = country;
      enriched.automationTaskId = source.taskId || source.id || enriched.automationTaskId;
      enriched.automationEvidence = source.reason || source.evidence || source.sendStatus || enriched.automationEvidence || '';
      enriched.resultCheckedAt = source.resultCheckedAt || enriched.resultCheckedAt || '';
      enriched.discoveredAt = source.discoveredAt || enriched.discoveredAt || '';
      const confirmedTouch = confirmedTouchFor({ ...enriched, ...source });
      if (confirmedTouch && confirmedTouch.timestamp) {
        enriched.lastTouch = newerTimestamp(enriched.lastTouch, confirmedTouch.timestamp);
        enriched.status = automationStatusLabel('sent_confirmed', confirmedTouch.evidence, false);
      }
      return enriched;
    });
    latestRows.forEach(row => {
      const keys = customerMatchKeys(row);
      if (keys.some(key => seenKeys.has(key))) return;
      keys.forEach(key => seenKeys.add(key));
      records.push(latestCustomerRecord(row));
    });
    return records.map(record => {
      const country = normalizedCountry(record);
      const directFitScore = Number(record.fitScore || 0);
      return {
        ...record,
        country,
        countryEn: country,
        region: country,
        fitScore: directFitScore > 0 ? boundedIcpScore(directFitScore) : record.fitScore,
      };
    });
  }
  function customerRecords() {
    return memoized('customerRecords', computeCustomerRecords);
  }
  function autoClawConnected() {
    return Boolean(window.customerDev && window.customerDev.runGlmDirectAutomation);
  }
  function bestContactUrl(task) {
    if (!task) return '';
    return task.instagram_url
      || task.facebook_url
      || task.linkedin_url
      || (task.alternateChannels && (task.alternateChannels.instagram || task.alternateChannels.facebook || task.alternateChannels.linkedin))
      || platformUrl(task)
      || task.contactUrl
      || task.website
      || '';
  }
  function autoClawAvailability(task) {
    if (!task || !platformUrl(task)) return { ready: false, label: 'Missing URL', reason: 'No verified platform homepage' };
    if (String(task.platform || '').toLowerCase() === 'email' || task.action === 'email_priority') {
      return { ready: true, label: 'Contact Us', reason: 'Open official website contact page, fill Leo website-contact message, attach the marketing file, and submit automatically.' };
    }
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
    if (!autoClawConnected()) return { ready: false, label: 'Desktop app', reason: 'Use the desktop app to connect Codex Chrome Extension execution' };
    if (followup) return { ready: true, label: 'Chrome Followup', reason: 'Prepare follow-up only; 7-day cooldown has passed, verify before any send.' };
    return { ready: true, label: 'Codex Chrome', reason: 'Codex Chrome Extension execution layer is connected' };
  }
  function canRunGlm(task) {
    if (task && (String(task.platform || '').toLowerCase() === 'email' || task.action === 'email_priority')) {
      return Boolean(platformUrl(task))
        && localStorage.getItem(`glm-direct-completed:${task.taskId}`) !== '1';
    }
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
      .sort(dealPriorityCompare);
  }
  function followupTasks() {
    return tasks.filter(task => task.previouslyContacted
      || task.sendStatus === 'sent_confirmed'
      || task.automationStatus === 'sent_confirmed'
      || task.state === 'outcome_pending')
      .filter(isIcpQualified)
      .sort(dealPriorityCompare);
  }
  function uniqueValues(records, key) {
    const getter = typeof key === 'function' ? key : record => record[key];
    return [...new Set(records.map(record => String(getter(record) || '').trim()).filter(Boolean))]
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
      <div class="cc-agent">Brain: Codex<br>Executor: verified browser transport<br>Browser control: Extension receipt required; CDP fallback is labeled separately<br>Mode: ICP&gt;70 - one target at a time</div></aside>`;
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
  function rateDetail(value, numerator, denominator) {
    return `${rate(value)} (${Number(numerator || 0)}/${Number(denominator || 0)})`;
  }
  function replyConversionPanel(report) {
    if (!report || !report.hasData) return '';
    const rates = report.rates || {};
    const topRows = ((report.conversion && report.conversion.topReplySegments) || []).slice(0, 6);
    const lowRows = ((report.conversion && report.conversion.underperformingSegments) || []).slice(0, 6);
    const row = item => `<tr><td>${esc(item.dimension)}</td><td>${esc(item.label)}</td><td>${item.sent}</td><td>${item.replied}</td><td>${rate(item.rates && item.rates.replyRate)}</td><td>${esc(item.confidence)}</td></tr>`;
    return `<section class="cc-panel"><div class="cc-panel-head"><h2>回复转化率诊断</h2><span class="cc-sub">发现→回复 ${rateDetail(rates.discoveryToReplyRate, report.metrics.replied, report.metrics.discovered)} · 发送→回复 ${rateDetail(rates.replyRate, report.metrics.replied, report.metrics.sent)} · 回复→联系方式 ${rateDetail(rates.replyToContactRate, report.metrics.contactCaptured, report.metrics.replied)}</span></div><div class="cc-panel-body"><div class="cc-funnel"><div><span>发现到发送</span><b>${rateDetail(rates.discoveryToSendRate, report.metrics.sent, report.metrics.discovered)}</b></div><div><span>发现到回复</span><b>${rateDetail(rates.discoveryToReplyRate, report.metrics.replied, report.metrics.discovered)}</b></div><div><span>发送到回复</span><b>${rateDetail(rates.replyRate, report.metrics.replied, report.metrics.sent)}</b></div><div><span>回复到联系方式</span><b>${rateDetail(rates.replyToContactRate, report.metrics.contactCaptured, report.metrics.replied)}</b></div></div><div class="cc-report-grid"><section class="cc-panel"><div class="cc-panel-head"><h2>高回复细分</h2></div><div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>维度</th><th>细分</th><th>发送</th><th>回复</th><th>回复率</th><th>置信度</th></tr></thead><tbody>${topRows.length ? topRows.map(row).join('') : '<tr><td colspan="6">暂无已确认发送样本</td></tr>'}</tbody></table></div></section><section class="cc-panel"><div class="cc-panel-head"><h2>低回复预警</h2></div><div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>维度</th><th>细分</th><th>发送</th><th>回复</th><th>回复率</th><th>置信度</th></tr></thead><tbody>${lowRows.length ? lowRows.map(row).join('') : '<tr><td colspan="6">暂无达到样本阈值的低回复项</td></tr>'}</tbody></table></div></section></div></div></section>`;
  }
  function replyTypePanel(report) {
    const diagnostics = report.replyDiagnostics || { human: 0, automated: 0, unclassified: 0 };
    return `<section class="cc-panel"><div class="cc-panel-head"><h2>\u56de\u590d\u8bc1\u636e\u5206\u7c7b</h2><span class="cc-sub">\u81ea\u52a8\u56de\u590d\u4f1a\u8fdb\u5165\u603b\u56de\u590d\u6570\uff0c\u4f46\u4e0d\u4f1a\u5192\u5145\u4eba\u5de5\u91c7\u8d2d\u610f\u5411</span></div><div class="cc-panel-body"><div class="cc-funnel"><div><span>\u4eba\u5de5\u56de\u590d</span><b>${diagnostics.human}</b></div><div><span>\u81ea\u52a8\u56de\u590d</span><b>${diagnostics.automated}</b></div><div><span>\u672a\u5206\u7c7b\u56de\u590d</span><b>${diagnostics.unclassified}</b></div><div><span>\u5168\u90e8\u53ef\u5ba1\u8ba1\u56de\u590d</span><b>${report.metrics.replied}</b></div></div></div></section>`;
  }
  function reportBreakdown(title, rows) {
    if (!rows.length) return `<section class="cc-panel"><div class="cc-panel-head"><h2>${title}</h2></div><div class="cc-empty">本周期暂无可统计数据</div></section>`;
    return `<section class="cc-panel"><div class="cc-panel-head"><h2>${title}</h2></div><div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>分类</th><th>发现</th><th>确认发送</th><th>回复</th><th>联系方式</th><th>机会</th><th>回复率</th></tr></thead><tbody>${rows.map(item => `<tr><td>${esc(item.label)}</td><td>${item.metrics.discovered}</td><td>${item.metrics.sent}</td><td>${item.metrics.replied}</td><td>${item.metrics.contactCaptured}</td><td>${item.metrics.opportunity}</td><td>${rate(item.rates.replyRate)}</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function reportExecutiveSummary(report) {
    const metrics = report.metrics || {};
    const rates = report.rates || {};
    const start = Date.parse(report.period.start);
    const end = Date.parse(report.period.endExclusive);
    const periodLogs = liveAuditEvents().filter(item => {
      const timestamp = Date.parse(item.timestamp || '');
      return Number.isFinite(timestamp) && timestamp >= start && timestamp < end;
    });
    const failures = periodLogs.filter(item => /fail|skip|block|timeout|unavailable|missing/i.test(`${item.stage} ${item.result} ${item.evidence}`));
    const blockerCounts = failures.reduce((counts, item) => {
      const text = `${item.result} ${item.evidence}`;
      const key = /duplicate|cooldown/i.test(text) ? 'duplicate/cooldown'
        : /timeout/i.test(text) ? 'browser timeout'
          : /attachment/i.test(text) ? 'marketing attachment missing'
            : /profile|target|identity|unavailable|404/i.test(text) ? 'target verification'
              : 'other execution blocker';
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    const primaryBlocker = Object.entries(blockerCounts).sort((a, b) => b[1] - a[1])[0];
    const summary = metrics.sent > 0
      ? `本周期发现 ${metrics.discovered} 个客户，确认发送 ${metrics.sent} 个，收到回复 ${metrics.replied} 个；发送回复率 ${rate(rates.replyRate)}。`
      : `本周期发现 ${metrics.discovered} 个客户，但没有形成已确认发送，当前漏斗停留在目标核验或执行安全门。`;
    const attribution = primaryBlocker
      ? `操作日志共 ${periodLogs.length} 条，其中失败或拦截 ${failures.length} 条；首要归因是 ${primaryBlocker[0]}（${primaryBlocker[1]} 条）。`
      : `操作日志共 ${periodLogs.length} 条，当前没有足够失败证据形成稳定归因。`;
    const actions = [];
    if (!metrics.sent) actions.push('优先补充带官方 Facebook、Instagram 或有效官网联系入口的新客户');
    if (primaryBlocker && /target verification/.test(primaryBlocker[0])) actions.push('在入队前完成官网、身份和消息入口核验');
    if (primaryBlocker && /attachment/.test(primaryBlocker[0])) actions.push('配置已批准营销附件或改用无需附件的社媒入口');
    if (metrics.sent >= 3 && !metrics.replied) actions.push('暂停低回复模板并对前10个高ICP客户使用买家角色个性化文案');
    if (!actions.length) actions.push('扩大当前最高回复渠道和模板，同时保持公司级防重复');
    const appliedActions = [
      '已启用公司级跨渠道防重复与单客户串行执行',
      '已优先处理核验通过的社媒入口',
      '已将只有首页、没有明确联系路径的官网客户降级为待核验',
      '已对高ICP客户使用买家角色和产品匹配信息生成个性化文案',
    ];
    return `<section class="cc-panel"><div class="cc-panel-head"><h2>周期总结与数据归因</h2><span class="cc-sub">由转化数据和操作日志自动生成</span></div><div class="cc-panel-body"><p>${esc(summary)}</p><p>${esc(attribution)}</p><h3>已采纳并生效</h3><ul>${appliedActions.map(item => `<li>${esc(item)}</li>`).join('')}</ul><h3>下一阶段系统操作</h3><ol>${actions.map(item => `<li>${esc(item)}</li>`).join('')}</ol></div></section>`;
  }
  function reportMetricDetail(report, metric, label) {
    if (!report.metrics || !Object.prototype.hasOwnProperty.call(report.metrics, metric)) return '';
    const seen = new Set();
    const rows = (report.eventRecords || []).filter(entry => {
      if (!entry || !entry.events || !entry.events[metric]) return false;
      const record = entry.record || {};
      const key = entry.customerKey || normalizeKey(record.company || record.name || record.taskId || record.id);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((left, right) => Date.parse(right.eventTimes[metric]) - Date.parse(left.eventTimes[metric]));
    const body = rows.length ? rows.slice(0, 100).map(entry => {
      const record = entry.record || {};
      const target = entryUrl(record);
      const customer = target ? `<a href="${esc(target)}" target="_blank" rel="noopener">${esc(record.company || record.name)}</a>` : esc(record.company || record.name);
      const stageLabels = { discovered: '发现', profiled: '画像评分', approved: '决策通过', sent: '确认发送', replied: '收到回复', contactCaptured: '获得联系方式', opportunity: '成交机会' };
      const inferredStage = String(entry.eventEvidence && entry.eventEvidence[metric] || '').replace('inferred_from_', '');
      const evidenceType = entry.eventEvidence && entry.eventEvidence[metric] === 'explicit'
        ? '原始阶段时间证据'
        : `由${stageLabels[inferredStage] || '下游'}阶段证据补齐`;
      return `<tr><td>${customer}</td><td>${esc(record.platform || record.source || 'unknown')}</td><td>${esc(record.sendStatus || record.state || record.action || '')}</td><td>${esc(entry.eventTimes[metric])}</td><td><span class="cc-chip">${esc(evidenceType)}</span><br>${esc(record.evidence || record.reason || record.background || '')}</td></tr>`;
    }).join('') : '<tr><td colspan="5">该周期没有符合此阶段定义的客户事件。</td></tr>';
    return `<section class="cc-panel cc-report-detail"><div class="cc-panel-head"><h2>${esc(label)}明细</h2><a href="${reportHref(report.period.type, report.period.anchor)}">关闭明细</a></div><div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>客户</th><th>渠道</th><th>状态</th><th>事件时间</th><th>证据/原因</th></tr></thead><tbody>${body}</tbody></table></div></section>`;
  }
  function reports() {
    const type = query.get('report') === 'monthly' ? 'monthly' : 'weekly';
    const reportRecords = liveOperationalRecords();
    const report = analytics.buildPeriodReport(reportRecords, { type, anchor: query.get('period') || undefined });
    currentReport = report;
    const metricLabels = [
      ['discovered', '发现客户'], ['profiled', '画像评分'], ['approved', '自动决策'],
      ['sent', '确认发送'], ['replied', '收到回复'], ['contactCaptured', '获得联系方式'],
      ['opportunity', '成交机会'], ['autoSkipped', '自动跳过'],
    ];
    const funnelMetrics = metricLabels.slice(0, 7);
    const previous = shiftReportAnchor(type, report.period.anchor, -1);
    const next = shiftReportAnchor(type, report.period.anchor, 1);
    const qualityTotal = report.dataQuality.missingTimestamps + report.dataQuality.invalidTimestamps;
    const queueSnapshotCount = latestRun ? latestQueueRows('visibleTodayQueue').length : 0;
    const selectedMetric = metricLabels.some(([key]) => key === query.get('detail')) ? query.get('detail') : '';
    const selectedMetricLabel = (metricLabels.find(([key]) => key === selectedMetric) || [null, ''])[1];

    return `${pageHead('汇报中心', '按自然周和自然月复盘客户开发结果，仅统计有时间证据的真实事件')}
      <div class="cc-report-toolbar">
        <div class="cc-report-tabs"><a data-report-type="weekly" class="${type === 'weekly' ? 'active' : ''}" href="${reportHref('weekly', report.period.anchor)}">周报</a><a data-report-type="monthly" class="${type === 'monthly' ? 'active' : ''}" href="${reportHref('monthly', report.period.anchor)}">月报</a></div>
        <div class="cc-period-controls"><a class="cc-icon-button" href="${reportHref(type, previous)}" title="上一周期">‹</a><input id="report-period" type="date" value="${report.period.anchor}" aria-label="报告日期"><a class="cc-icon-button" href="${reportHref(type, next)}" title="下一周期">›</a></div>
        <div class="cc-report-actions"><button type="button" onclick="exportCurrentReportCsv()" ${report.hasData ? '' : 'disabled'}>导出 CSV</button><button type="button" onclick="window.print()">打印/PDF</button></div>
      </div>
      <div class="cc-report-period"><b>${report.period.label}</b><span>Asia/Shanghai</span></div>
      <div class="cc-quality cc-report-scope">数据口径：汇报数字是本周期有时间证据的唯一客户累计；今日队列是当前待处理快照（${queueSnapshotCount} 个），两者不直接相加或要求相等。漏斗一致性：${report.consistency.funnelMonotonic ? '通过' : `异常（${report.consistency.violations.join(', ')}）`}。</div>
      ${reportExecutiveSummary(report)}
      <div class="cc-kpis cc-report-kpis">${metricLabels.map(([key, label]) => `<a class="cc-kpi cc-kpi-link ${selectedMetric === key ? 'active' : ''}" href="${urlFor('reports', { report: type, period: report.period.anchor, detail: key })}"><span>${label}</span><b>${report.metrics[key]}</b></a>`).join('')}</div>
      ${selectedMetric ? reportMetricDetail(report, selectedMetric, selectedMetricLabel) : ''}
      <section class="cc-panel"><div class="cc-panel-head"><h2>转化漏斗</h2><span class="cc-sub">回复率 ${rate(report.rates.replyRate)} · 联系方式率 ${rate(report.rates.contactCaptureRate)} · 机会率 ${rate(report.rates.opportunityRate)}</span></div><div class="cc-panel-body"><div class="cc-funnel">${funnelMetrics.map(([key, label]) => `<div><span>${label}</span><b>${report.metrics[key]}</b></div>`).join('')}</div></div></section>
      ${replyConversionPanel(report)}
      ${replyTypePanel(report)}
      ${qualityTotal ? `<div class="cc-quality">数据质量：${report.dataQuality.missingTimestamps} 个应有时间缺失，${report.dataQuality.invalidTimestamps} 个时间无效；这些事件未计入周期结果。</div>` : ''}
      ${report.hasData ? `<div class="cc-report-grid">${reportBreakdown('平台', report.breakdowns.platform)}${reportBreakdown('国家 / 市场', report.breakdowns.countryMarket)}${reportBreakdown('关键词', report.breakdowns.keyword)}${reportBreakdown('消息模板', report.breakdowns.template)}${reportBreakdown('ICP 层级', report.breakdowns.icpTier)}</div>` : '<div class="cc-empty cc-report-empty">本周期暂无带有效时间证据的开发记录</div>'}`;
  }
  function stageRoute(task) {
    const route = [
      { states: ['profile_scored'], label: '客户研究', note: '画像/采购假设' },
      { states: ['target_verified'], label: '目标核验', note: '官方主页/身份' },
      { states: ['rerouted'], label: '渠道匹配', note: '官网/社媒/供应商入口' },
      { states: ['approval_pending'], label: '重大异常', note: '暂停并通知介入' },
      { states: ['post_liked', 'account_followed'], label: '轻互动', note: '点赞/关注/铺垫' },
      { states: ['approved'], label: '自动决策', note: '文案/安全门' },
      { states: ['sent_confirmed'], label: '精准发送', note: '单客户单动作' },
      { states: ['outcome_pending'], label: '跟进', note: '回复/联系方式' },
      { states: ['contact_captured'], label: '机会推进', note: '样品/报价/会议' },
      { states: ['closed'], label: '复盘沉淀', note: '模板/SEO/审计' },
    ];
    const effectiveState = task.sendStatus === 'sent_confirmed' ? 'outcome_pending' : task.state;
    let index = route.findIndex(item => item.states.includes(effectiveState));
    if (index < 0 && task.identityStatus === 'verified') index = 2;
    if (index < 0) index = 0;
    return `<div class="cc-route">${route.map((item, i) => `<div class="cc-stage ${i < index ? 'done' : i === index ? 'active' : ''}"><b>${item.label}</b><span>${esc(item.note)}</span><em>${i < index ? '已完成' : i === index ? '当前阶段' : '待执行'}</em></div>`).join('')}</div>`;
  }
  function latestSystemSummary() {
    const dailyRows = latestRun ? latestQueueRows('visibleTodayQueue') : [];
    const potentialRows = latestRun ? latestQueueRows('dailyPotentialPool') : [];
    const cooldownRows = latestRun ? latestQueueRows('cooldownQueue') : [];
    const googleRows = dailyRows.filter(item => item.source === 'google_customer_discovery' || /^google-customer-/i.test(item.taskId || item.id || ''));
    const websiteContactRows = googleRows.filter(item => item.reason === 'official_website_contact_channel' || /website-contact/i.test(item.taskId || item.id || ''));
    const generatedAt = latestRun && latestRun.generatedAt
      ? new Date(latestRun.generatedAt).toLocaleString('zh-CN', { hour12: false })
      : '';
    return { dailyRows, potentialRows, cooldownRows, googleRows, websiteContactRows, generatedAt };
  }
  function systemFreshnessNotice(system) {
    if (!latestRun) return '<div class="cc-quality">系统尚未加载每日自动化 artifact；请先运行 npm run discover:daily。</div>';
    const sync = latestGithubSync
      ? ` · GitHub ${latestGithubSync.ok ? '已同步' : '同步失败'}${latestGithubSync.localCommit ? ` ${String(latestGithubSync.localCommit).slice(0, 10)}` : ''}`
      : '';
    const visibility = latestSystemVisibility
      ? ` · visibleSections ${(latestSystemVisibility.visibleSections || []).length} · visibility ${latestSystemVisibility.updatedAt || ''}`
      : '';
    const goal = latestSystemVisibility && latestSystemVisibility.dailyQueueGoal;
    const goalText = goal
      ? ` · queueGoal ${goal.reached ? 'reached' : `need ${goal.refillNeeded || 0}/${goal.target || 100}`}`
      : '';
    const executableCount = latestRun && latestRun.summary ? Number(latestRun.summary.executableCompanies || 0) : 0;
    const enrichmentCount = latestRun && latestRun.summary ? Number(latestRun.summary.enrichmentBacklogCount || 0) : 0;
    return `<div class="cc-quality">系统已更新：Latest artifact ${esc(system.generatedAt || latestRun.date || 'unknown')} · potentialPool ${(system.potentialRows || []).length} · executable ${executableCount} · enrichment backlog ${enrichmentCount} · dailyQueue ${system.dailyRows.length} · googleDiscovered ${system.googleRows.length} · websiteContact ${system.websiteContactRows.length}${esc(goalText)}${esc(visibility)}${esc(sync)}</div>`;
  }
  function actionLabel(action) {
    const labels = {
      develop: '可自动开发',
      discover_and_develop: '发现并开发',
      email_priority: '官网/邮件优先',
      retry_or_alternate_channel: '候补渠道',
      verify_target: '待核验',
      skip_exclusive_agency: '独代跳过',
      retain_low_icp: '低 ICP 保留',
    };
    return labels[action] || action || '待判断';
  }
  function reasonLabel(reason) {
    const labels = {
      official_website_contact_channel: '官方官网联系入口，需走网站/邮件安全门',
      email_channel_found: '已找到邮箱渠道，优先邮件或人工确认',
      no_social_executable_tasks: '没有安全可执行的社媒任务',
      cooldown_or_history: '冷却期或历史触达保护',
      concrete_google_discovered_major_customer: 'Google 发现的高 ICP 重点客户',
      website_contact_ready_no_repeat: '官网/邮件已触达，短期内不重复同渠道',
      channel_already_touched: '该渠道已触达，保留为冷却记录',
    };
    return labels[reason] || reason || '规则未给出原因';
  }
  function dailyDevelopedRows() {
    const resultRows = autonomousResultRecords();
    const ledgerRows = customerEventLedger()
      .filter(event => event.type === 'sent_confirmed' && isTodayTimestamp(event.timestamp))
      .map(event => {
        const result = resultRows.find(item => canonicalLeadKey(item.taskId) === canonicalLeadKey(event.taskId)) || {};
        const base = findTaskById(event.taskId)
          || taskIndex.get(canonicalLeadKey(event.customerKey))
          || {};
        const company = result.company || base.company || base.name || resultCompanyName(event.taskId || event.customerKey);
        const discovery = discoveryCompanyRecord(company) || {};
        return {
          ...discovery,
          ...base,
          ...result,
          taskId: event.taskId || base.taskId || event.customerKey,
          id: event.taskId || base.id || event.id,
          name: company,
          company,
          platform: event.channel || base.platform || 'unknown',
          targetUrl: base.targetUrl || base.url || event.evidence || '',
          sendStatus: 'sent_confirmed',
          status: 'sent_confirmed',
          timestamp: event.timestamp,
          resultCheckedAt: event.timestamp,
          lastTouch: event.timestamp,
          evidence: event.evidence,
          eventSource: event.source,
        };
      });
    const seen = new Set();
    return ledgerRows
      .filter(item => {
        const key = [
          canonicalLeadKey(item.taskId || item.id || item.company || item.name),
          developedChannel(item),
        ].join('|');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map(item => ({ ...item, developedAt: item.timestamp || item.resultCheckedAt || item.lastTouch || '', interactionEvidence: item.evidence || item.automationEvidence || '' }));
  }
  function developedChannel(item) {
    const text = `${item.platform || ''} ${item.targetUrl || item.url || item.taskId || ''}`.toLowerCase();
    if (/\bemail\b|mailto:|website-contact|official_website/.test(text)) return 'email';
    if (/linkedin/.test(text)) return 'linkedin';
    if (/facebook|messenger/.test(text)) return 'facebook';
    if (/instagram/.test(text)) return 'instagram';
    return 'other';
  }
  function dailyDevelopedSummary(rows = dailyDevelopedRows()) {
    const counts = { email: 0, linkedin: 0, facebook: 0, instagram: 0, other: 0 };
    rows.forEach(item => { counts[developedChannel(item)] += 1; });
    return counts;
  }
  function dailyDevelopedPanel() {
    const rows = dailyDevelopedRows();
    const counts = dailyDevelopedSummary(rows);
    const linkedinConnectionRun = window.LINKEDIN_CONNECTION_RESULTS_LATEST || {};
    const linkedinConnectionBanner = Number(linkedinConnectionRun.confirmedCount || 0) > 0
      ? `<div class="cc-quality">LinkedIn Navigator 精准采购负责人连接：<b>${esc(linkedinConnectionRun.confirmedCount)}</b> 个已确认 Pending；另有 ${esc(linkedinConnectionRun.uncertainCount || 0)} 个确认缺失并已锁定不重发。连接邀请独立记录，不计入 sent_confirmed / submitted_confirmed。</div>`
      : '';
    const channelCards = [
      ['email', 'Email', '采购邮箱 / 官网提交'],
      ['linkedin', 'LinkedIn', '公司主页建联'],
      ['facebook', 'Facebook', 'Messenger 建联'],
      ['instagram', 'Instagram', '企业账号 DM'],
    ].map(([key, label, note], index) => `<div class="cc-channel-card ${key}"><span>${index + 1}. ${label}</span><b>${counts[key]}</b><em>${note}</em></div>`).join('');
    const table = rows.length
      ? `<div class="cc-table-wrap cc-developed-table"><table class="cc-table"><thead><tr><th>客户</th><th>优先渠道</th><th>开发状态</th><th>发送证据</th><th>时间</th><th>入口</th></tr></thead><tbody>${rows.map(item => `<tr><td><b>${esc(item.company || item.name)}</b></td><td><span class="cc-channel-badge ${developedChannel(item)}">${esc(developedChannel(item).toUpperCase())}</span></td><td><span class="cc-chip green">${esc(automationStatusLabel(item.sendStatus || item.status, item.interactionEvidence, item.duplicateRisk))}</span></td><td class="cc-evidence-cell">${esc(item.interactionEvidence || '已记录')}</td><td>${esc(item.developedAt || '')}</td><td>${entryUrl(item) ? `<a href="${esc(entryUrl(item))}" target="_blank" rel="noopener">打开入口</a>` : ''}</td></tr>`).join('')}</tbody></table></div>`
      : '<div class="cc-empty">今天还没有带时间证据的已开发客户</div>';
    return `<section class="cc-panel cc-developed-panel"><div class="cc-panel-head"><div><h2>今日已开发客户</h2><span class="cc-sub">仅统计 sent_confirmed / submitted_confirmed，不把打开页面、点赞或草稿计为开发</span></div><div class="cc-developed-total"><span>今日真实开发</span><b>${rows.length}</b><em>/ 100</em></div></div>${linkedinConnectionBanner}<div class="cc-channel-priority"><div class="cc-priority-label"><b>执行优先级</b><span>Email → LinkedIn → Facebook → Instagram</span></div>${channelCards}</div>${table}</section>`;
  }
  function northAmericaMarketPanel() {
    const reserve = northAmericaAgencyReserveRows();
    const developed = dailyDevelopedRows().filter(isNorthAmerica);
    const byCountry = ['United States', 'Canada', 'Mexico']
      .map(country => `${country}: ${reserve.filter(item => normalizedCountry(item) === country).length}`)
      .join(' · ');
    const rows = reserve.map(item => `<tr><td><b>${esc(item.company || item.name)}</b></td><td>${esc(normalizedCountry(item))}</td><td>${esc(item.customerType)}</td><td>${esc(item.fitScore)}</td><td><span class="cc-chip amber">候选储备 · 尚未计入开发</span></td><td>${item.sourceEvidenceUrl ? `<a href="${esc(item.sourceEvidenceUrl)}" target="_blank" rel="noopener">第一方证据</a>` : ''}</td></tr>`).join('');
    return `<section class="cc-panel cc-na-market"><div class="cc-panel-head"><div><h2>北美代理市场</h2><span class="cc-sub">候选储备与真实开发分开统计；只有 sent_confirmed / submitted_confirmed 才算已开发</span></div><div class="cc-developed-total"><span>今日北美真实开发</span><b>${developed.length}</b><em> / 今日全部 ${dailyDevelopedRows().length}</em></div></div><div class="cc-quality">北美第一方验证代理/分销商储备：${reserve.length} 家（${esc(byCountry)}）。储备不是已发送，也不会出现在阿里邮箱“已发送”中。</div><div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>企业</th><th>国家</th><th>类型</th><th>ICP</th><th>状态</th><th>证据</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  }
  function emailLifecyclePanel() {
    const rows = executionResultRows()
      .filter(item => isTodayTimestamp(item.timestamp || item.resultCheckedAt || item.lastTouch))
      .filter(item => developedChannel(item) === 'email');
    const metrics = rows.reduce((acc, item) => {
      const status = String(item.sendStatus || item.status || '').toLowerCase();
      if (['sent_confirmed', 'submitted_confirmed'].includes(status)) acc.sent += 1;
      if (status === 'bounced' || item.bouncedAt) acc.bounced += 1;
      if (item.repliedAt) acc.replied += 1;
      if (item.buyerRoutedAt || status === 'buyer_routed') acc.buyerRouted += 1;
      if (item.meetingBookedAt || status === 'meeting_booked') acc.meetings += 1;
      return acc;
    }, { sent: 0, bounced: 0, replied: 0, buyerRouted: 0, meetings: 0 });
    const stages = [
      ['sent', '确认发送', '阿里邮箱已发送或官网回执'],
      ['bounced', '退信', '不计入完成，停止该地址'],
      ['replied', '收到回复', '进入人工意图判断'],
      ['buyerRouted', '转交采购', '已到品类/供应商负责人'],
      ['meetings', '预约会议', '进入销售机会'],
    ];
    return `<section class="cc-panel cc-email-ops"><div class="cc-panel-head"><div><h2>Email运营漏斗</h2><span class="cc-sub">同域名每日最多3封 · 首次跟进3个工作日 · 第二次跟进再等5个工作日</span></div><span class="cc-chip green">Sender: Leo@flextailgear.com</span></div><div class="cc-email-funnel">${stages.map(([key, label, note], index) => `<div class="${key === 'bounced' ? 'risk' : ''}"><span>${index + 1}. ${label}</span><b>${metrics[key]}</b><em>${note}</em></div>`).join('')}</div></section>`;
  }
  function salesSystemReadinessPanel() {
    if (!readiness || !readinessData) {
      return '<section class="cc-panel"><div class="cc-panel-head"><div><h2>销售系统就绪度</h2><span class="cc-sub">就绪度快照未生成；运行 npm run readiness:refresh</span></div><span class="cc-chip amber">未刷新</span></div></section>';
    }
    const conversion = readiness.conversionSnapshot(customerEventLedger());
    const cards = readinessData.connectors.map(item => `
      <div class="cc-channel-card ${item.ready ? 'email' : ''}">
        <span>${esc(item.label)}</span>
        <b>${item.ready ? 'READY' : '可选 · 未配置'}</b>
        <em>${esc(item.ready
          ? item.status === 'ready_connected_session'
            ? `${item.providerSource} · 有效至 ${item.expiresAt}`
            : item.status === 'ready_builtin'
              ? `${item.providerLabel} · built-in safety loop`
              : item.providers.join(' / ')
          : `缺少：${item.missing.join(' 或 ')}`)}</em>
      </div>`).join('');
    const coreReady = readinessData.coreReady === true;
    const statusClass = coreReady ? 'green' : 'amber';
    const coreReadyCount = Number(readinessData.coreReadyCount || 0);
    const coreTotalCount = Number(readinessData.coreTotalCount || 0);
    return `<section class="cc-panel cc-email-ops"><div class="cc-panel-head"><div><h2>销售系统就绪度</h2><span class="cc-sub">核心安全闭环与外部连接分开评估；未配置的可选连接不会伪装成故障，也不会显示密钥值</span></div><span class="cc-chip ${statusClass}">核心 ${coreReadyCount}/${coreTotalCount} · 连接 ${readinessData.readyCount}/${readinessData.totalCount}</span></div>
      <div class="cc-channel-priority">${cards}</div>
      <div class="cc-funnel"><div><span>确认开发企业</span><b>${conversion.sent}</b></div><div><span>收到回复</span><b>${conversion.replied}</b></div><div><span>采购资格确认</span><b>${conversion.qualified}</b></div><div><span>合格会议</span><b>${conversion.meetings}</b></div><div><span>每100家合格会议</span><b>${conversion.qualifiedMeetingsPer100}</b></div></div>
      <div class="cc-quality">北极星指标：每100家不同高ICP企业产生的合格采购会议数。发送量是容量指标，不替代回复、会议和Pipeline。</div>
    </section>`;
  }
  function crmOperationsPanel() {
    if (!salesCore) return '';
    const accounts = salesCore.buildCrmAccounts(customerRecords(), customerEventLedger());
    const counts = accounts.reduce((summary, account) => {
      summary[account.stage] = (summary[account.stage] || 0) + 1;
      return summary;
    }, {});
    const stages = [
      ['lead', '线索'], ['contacted', '已开发'], ['replied', '已回复'],
      ['qualified', '采购资格'], ['meeting', '会议'], ['opportunity', '商机'],
      ['sample', '样品'], ['quotation', '报价'], ['won', '成交'],
    ];
    const priority = accounts
      .filter(account => !account.existingCustomer && !account.exclusiveMarket)
      .sort((left, right) => {
        const stageGap = salesCore.STAGE_ORDER.indexOf(right.stage) - salesCore.STAGE_ORDER.indexOf(left.stage);
        return stageGap || right.icp - left.icp;
      })
      .slice(0, 6);
    return `<section class="cc-panel"><div class="cc-panel-head"><div><h2>统一CRM与转化行动队列</h2><span class="cc-sub">公司域名/名称归一去重；积极回复和商业判断必须人工复核，退订与退信允许自动抑制</span></div><span class="cc-chip green">${accounts.length} 家唯一企业</span></div>
      <div class="cc-funnel">${stages.map(([key, label]) => `<div><span>${label}</span><b>${counts[key] || 0}</b></div>`).join('')}</div>
      <div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>优先企业</th><th>ICP</th><th>CRM阶段</th><th>可用渠道</th><th>建议动作</th></tr></thead><tbody>${priority.map(account => {
        const action = account.stage === 'lead' ? '补全决策人并验证联系方式'
          : account.stage === 'contacted' ? '等待/分类回复，禁止重复首触'
            : account.stage === 'replied' ? '人工确认意向并提供会议时间'
              : account.stage === 'qualified' ? '安排采购会议并建立商机'
                : '推进下一商业阶段并记录证据';
        return `<tr><td><b>${esc(account.company || account.key)}</b></td><td>${account.icp}</td><td><span class="cc-chip">${esc(account.stage)}</span></td><td>${esc(account.channels.join(' / ') || '待补全')}</td><td>${esc(action)}</td></tr>`;
      }).join('') || '<tr><td colspan="5">暂无可行动企业</td></tr>'}</tbody></table></div>
    </section>`;
  }
  function googleQueueItem(item) {
    return item && (item.source === 'google_customer_discovery' || /^google-customer-/i.test(item.taskId || item.id || ''));
  }
  function executionResults() {
    return latestExecution ? (latestExecution.results || latestExecution.executed || []) : [];
  }
  function executionSkipped() {
    return Array.isArray(latestExecution && latestExecution.skipped) ? latestExecution.skipped : [];
  }
  function executionBlockerBucketRows(skipped) {
    const blockerCounts = latestExecution && latestExecution.blockerCounts;
    const buckets = blockerCounts && typeof blockerCounts === 'object'
      ? blockerCounts
      : skipped.reduce((acc, item) => {
        const key = item.reason || item.error || item.status || 'unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
    return Object.entries(buckets)
      .sort((a, b) => b[1] - a[1])
      .map(([reason, count]) => ({ reason, count, label: humanSkipLabel(reason) }));
  }
  function humanSkipLabel(reason) {
    const labels = {
      official_website_contact_channel: '官网/邮件入口，需要人工或专用邮件流程',
      email_channel_found: '已找到邮箱渠道，本轮不走 Chrome DM',
      concrete_google_discovered_major_customer_instagram: 'Instagram 线索已入队，但安全门未放行',
      concrete_google_discovered_major_customer_facebook: 'Facebook 线索已入队，但安全门未放行',
      no_social_executable_tasks: '没有安全可执行的社媒任务',
      cooldown_or_history: '冷却期或历史触达保护',
      website_contact_ready_no_repeat: '官网/邮件已触达，不重复同渠道',
      channel_already_touched: '该渠道已触达，防重复保护',
      profile_valid_no_message_button: '主页有效，但没有可用 Message 按钮',
    };
    return labels[reason] || reasonLabel(reason);
  }
  function executionVisibilitySummary() {
    const skipped = executionSkipped();
    const results = executionResults();
    const noBrowserExecution = latestExecution && (
      latestExecution.executionPhase === 'no_executable_tasks'
      || latestExecution.chromeStage === 'not_started'
      || latestExecution.chromeOpened === false
      || (latestExecution.customerDevelopmentPerformed === false && latestExecution.skippedOnly)
    );
    const bucketRows = executionBlockerBucketRows(skipped);
    const chromeEntered = (latestExecution && latestExecution.chromeOpened === true)
      || results.some(item => item && (item.chromeOpen && item.chromeOpen.ok || item.ok || item.status || item.evidence || item.automationEvidence));
    const transportUsed = latestExecution && latestExecution.browserTransportUsed || 'unknown';
    const transportLabel = transportUsed === 'codex-extension'
      ? 'Codex Chrome Extension'
      : transportUsed === 'cdp'
        ? 'Chrome CDP fallback'
        : transportUsed === 'mixed'
          ? 'Mixed browser transports'
          : transportUsed === 'none'
            ? 'No browser transport'
            : 'Unreported browser transport';
    const chromeStage = noBrowserExecution
      ? 'Chrome not opened - no development performed'
      : latestExecution && latestExecution.skippedOnly
      ? 'Chrome 未进入执行阶段'
      : chromeEntered
        ? 'Chrome 已执行'
        : latestExecution && latestExecution.pendingExecution
          ? '等待执行'
          : latestExecution
            ? '未记录 Chrome 动作'
            : '尚未加载执行结果';
    let headline = latestExecution
      ? latestExecution.pendingExecution
        ? '队列已刷新，等待 daily:execute'
        : latestExecution.skippedOnly
          ? '本轮没有触达客户：全部被安全门跳过'
          : latestExecution.ok
            ? `本轮已执行 ${results.length} 条`
            : `本轮执行失败：${latestExecution.error || '未知错误'}`
      : '尚未加载 daily:execute 结果';
    let nextAction = latestExecution && latestExecution.skippedOnly
      ? '优先处理官网/邮件入口；社媒项需先满足身份、冷却、防重复和可发消息按钮条件。'
      : latestExecution && latestExecution.ok
        ? '查看下方执行证据与客户触达记录。'
        : '等待下一次队列刷新或手动触发执行。';
    if (noBrowserExecution) {
      headline = 'No customer development was performed; safety gates left no executable task';
      nextAction = 'Wait for a new safe queue item or manually review the blocked/cooldown entries; do not report this run as development.';
    }
    return {
      skipped,
      results,
      bucketRows,
      chromeStage: `${chromeStage} · Actual transport: ${transportLabel}`,
      headline,
      nextAction,
      noBrowserExecution,
    };
  }
  function executionRecoveryCards() {
    const actions = Array.isArray(latestExecution && latestExecution.recoveryActions)
      ? latestExecution.recoveryActions
      : [];
    const queueGoal = latestExecution && latestExecution.queueGoalStatus;
    if (!actions.length && !queueGoal) return '';
    const recoveryCards = actions.map((action) => {
      const requiredEnv = Array.isArray(action.requiredEnv) && action.requiredEnv.length
        ? `<em>Env: ${esc(action.requiredEnv.join(' / '))}</em>`
        : '';
      return `<div class="cc-skip-card"><b>${esc(action.reason || 'recovery')}</b><span>${esc(action.action || '')}</span><em>${esc(action.description || '')}</em>${requiredEnv}</div>`;
    });
    if (queueGoal) {
      const poolText = Number.isFinite(Number(queueGoal.potentialPool))
        ? `Pool ${queueGoal.potentialPool}/${queueGoal.target || 100}`
        : `Target ${queueGoal.target || 100}`;
      const refillText = queueGoal.reached
        ? '100 target reached'
        : `Need ${queueGoal.refillNeeded || 0} more high-ICP leads`;
      recoveryCards.push(`<div class="cc-skip-card"><b>daily_queue_goal</b><span>${esc(`${poolText} - ${refillText}`)}</span><em>${esc(queueGoal.action || '')}</em></div>`);
    }
    return `<div class="cc-skip-grid cc-recovery-actions">${recoveryCards.join('')}</div>`;
  }
  function taskDetailPanel(system) {
    if (!latestRun) return '';
    const visibility = executionVisibilitySummary();
    const skipped = visibility.skipped;
    const skippedById = new Map(skipped.map(item => [String(item.id || item.taskId || ''), item]));
    const generatedAt = latestExecution && (latestExecution.completedAt || latestExecution.generatedAt)
      ? new Date(latestExecution.completedAt || latestExecution.generatedAt).toLocaleString('zh-CN', { hour12: false })
      : '尚未执行';
    let executionText = latestExecution
      ? latestExecution.pendingExecution
        ? `待执行：${latestExecution.message || latestExecution.error || '队列已刷新，尚未执行发送'}`
        : latestExecution.skippedOnly
        ? `未发送：${latestExecution.error || '安全门没有放行任何任务'}`
        : latestExecution.ok
          ? `已执行：${(latestExecution.results || latestExecution.executed || []).length} 条`
          : `执行失败：${latestExecution.error || '未知错误'}`
      : '尚未加载 daily:execute 结果';
    if (visibility.noBrowserExecution) {
      executionText = `No development performed: ${latestExecution.userVisibleStatus || latestExecution.error || 'Chrome was not opened because there were no executable tasks.'}`;
      if (latestExecution.recoveryHint) {
        executionText += ` Recovery: ${latestExecution.recoveryHint}`;
      }
    }
    const syncText = latestGithubSync
      ? latestGithubSync.ok
        ? `GitHub 已同步：${latestGithubSync.remoteCommit || latestGithubSync.localCommit || 'commit 已推送'}`
        : `GitHub 同步失败：${latestGithubSync.error || 'push 未完成'}`
      : 'GitHub 同步状态未加载';
    const resultIds = new Set();
    const latestResultRows = executionResultRows().map((item) => {
      resultIds.add(String(item.taskId || item.id || ''));
      return item;
    });
    const detailRows = [
      ...latestResultRows,
      ...system.dailyRows.filter(item => !resultIds.has(String(item.taskId || item.id || ''))),
    ];
    const rows = detailRows.slice(0, 12).map((item) => {
      const skippedItem = skippedById.get(String(item.taskId || item.id || ''));
      const isGoogle = googleQueueItem(item);
      const status = item.latestExecutionResult && item.sendStatus
        ? automationStatusLabel(item.sendStatus, item.evidence, item.duplicateRisk)
        : (skippedItem ? actionLabel(skippedItem.action) : actionLabel(item.action));
      const reason = skippedItem ? humanSkipLabel(skippedItem.reason) : humanSkipLabel(item.reason);
      const executionBadge = item.latestExecutionResult ? '<br><span class="cc-chip green">latest execution</span>' : '';
      return `<tr>
        <td><b>${esc(item.company || item.name)}</b>${isGoogle ? '<br><span class="cc-chip green">Google discovered</span>' : ''}${executionBadge}</td>
        <td>${esc(item.country || item.countryEn || '')}</td>
        <td><span class="cc-chip ${item.action === 'email_priority' ? 'amber' : ''}">${esc(status)}</span></td>
        <td>${esc(item.evidence || reason)}</td>
        <td>${entryUrl(item) ? `<a href="${esc(entryUrl(item))}" target="_blank" rel="noopener">打开入口</a>` : '<span class="cc-sub">无入口</span>'}</td>
      </tr>`;
    }).join('');
    const skipCards = visibility.bucketRows.length
      ? visibility.bucketRows.map(item => `<div class="cc-skip-card"><b>${item.count}</b><span>${esc(item.label)}</span><em>${esc(item.reason)}</em></div>`).join('')
      : '<div class="cc-skip-card"><b>0</b><span>没有跳过项</span><em>本轮可能已进入执行或仍待执行</em></div>';
    const chromeNoteClass = latestExecution && latestExecution.skippedOnly ? ' cc-task-note-red' : '';
    const chromeNote = `<div class="cc-task-note${chromeNoteClass}"><b>${esc(visibility.chromeStage)}</b><span>${esc(visibility.headline)}。${esc(visibility.nextAction)}</span></div>`;
    const cooldownRows = (system.cooldownRows || []).slice(0, 12).map(item => `<tr>
      <td><b>${esc(item.company || item.name)}</b>${item.lastStatus === 'website_contact_ready' ? '<br><span class="cc-chip amber">官网/邮件已触达</span>' : ''}</td>
      <td>${esc(item.country || item.countryEn || '')}</td>
      <td><span class="cc-chip">短期不重复</span></td>
      <td>${esc(item.lastTouch || '')}</td>
      <td>${esc(reasonLabel(item.reason))}</td>
    </tr>`).join('');
    return `<section class="cc-panel cc-task-details"><div class="cc-panel-head"><h2>任务明细</h2><span class="cc-sub">执行时间 ${esc(generatedAt)}</span></div>
      <div class="cc-panel-body">
        <div class="cc-detail-grid">
          <div><span>高 ICP 潜客池</span><b>${(system.potentialRows || []).length}</b><em>每日待开发清单</em></div>
          <div><span>Google 发现</span><b>${system.googleRows.length}</b><em>高 ICP 官网/渠道线索</em></div>
          <div><span>本次执行</span><b>${latestExecution && (latestExecution.skippedOnly || latestExecution.pendingExecution) ? '0' : ((latestExecution && (latestExecution.results || latestExecution.executed || []).length) || 0)}</b><em>${esc(executionText)}</em></div>
          <div class="${latestGithubSync && !latestGithubSync.ok ? 'blocked' : ''}"><span>系统同步</span><b>${latestGithubSync && latestGithubSync.ok ? 'OK' : 'BLOCKED'}</b><em>${esc(syncText)}</em></div>
        </div>
        ${chromeNote}
        <div class="cc-skip-grid">${skipCards}</div>
        ${executionRecoveryCards()}
        <div class="cc-task-note">${esc(executionText)}</div>
        <div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>客户</th><th>国家</th><th>当前任务</th><th>为什么没有自动发送</th><th>入口</th></tr></thead><tbody>${rows}</tbody></table></div>
        ${cooldownRows ? `<div class="cc-panel-head cc-subhead"><h2>短期不重复 / 冷却中</h2><a href="${urlFor('queue', { queue: 'cooldown' })}">查看 ${system.cooldownRows.length} 条</a></div><div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>客户</th><th>国家</th><th>状态</th><th>最近触达</th><th>规则</th></tr></thead><tbody>${cooldownRows}</tbody></table></div>` : ''}
      </div></section>`;
  }
  function workspace() {
    const task = currentTask();
    const untouched = executableDevelopmentTasks();
    const potentialRows = latestRun ? latestQueueRows('dailyPotentialPool') : untouchedTasks();
    const followups = todayFollowupTasks();
    const confirmed = tasks.filter(item => item.sendStatus === 'sent_confirmed').length;
    const eligibleCount = untouched.filter(canRunGlm).length;
    const executionConnected = autoClawConnected();
    const system = latestSystemSummary();
    const intelligencePanel = latestIntelligence && latestIntelligence.ownerSummary ? (() => {
      const owner = latestIntelligence.ownerSummary;
      const kpi = owner.kpis || {};
      const exceptions = owner.exceptions || [];
      const decisions = owner.decisions || [];
      return `<section class="cc-panel"><div class="cc-panel-head"><div><h2>Autonomous Sales Intelligence</h2><span class="cc-sub">企业真值 · 永久防重 · 证据规划 · 结果学习</span></div><span class="cc-chip green">${esc(owner.phase || 'intelligence')}</span></div><div class="cc-panel-body"><div class="cc-funnel"><div><span>统一企业</span><b>${kpi.companies || 0}</b></div><div><span>永久抑制</span><b>${kpi.permanentlySuppressed || 0}</b></div><div><span>已验证渠道</span><b>${kpi.verifiedEvidenceRoutes || 0}</b></div><div><span>安全计划</span><b>${kpi.plannedActions || 0}</b></div></div><div class="cc-quality">老板摘要：${decisions.length} 个安全行动 · ${exceptions.length} 个系统例外；所有行动仍受 ICP、身份、防重与确认门禁约束。</div></div></section>`;
    })() : '';
    const metrics = `<div class="cc-kpis">
      <a class="cc-kpi cc-kpi-link" href="#today-developed"><span>今日已开发</span><b>${dailyDevelopedRows().length}</b></a>
      <a class="cc-kpi cc-kpi-link" href="${urlFor('queue', { queue: 'potential' })}"><span>今日待开发</span><b>${potentialRows.length}</b></a>
      <a class="cc-kpi cc-kpi-link" href="${urlFor('queue', { queue: 'untouched' })}"><span>可自动触达</span><b>${untouched.length}</b></a>
      <a class="cc-kpi cc-kpi-link" href="${urlFor('customers', { touch: 'untouched' })}"><span>候选客户池</span><b>${customerRecords().filter(record => !recordTouched(record)).length}</b></a>
    </div>`;
    const connection = `<div class="cc-quality">${executionConnected ? 'Codex Chrome Extension 已连接：浏览器执行层可用' : 'Codex Chrome Extension 未连接：当前是网页预览，请使用桌面 APP 执行；历史客户仍会因防重复规则保持禁用'}</div>`;
    const icpRule = `<div class="cc-icp-rule"><b>ICP 分值算法</b><span>市场潜力 25 + 行业/角色匹配 25 + 身份核验 15 + 采购意图 15 + SEO/趋势 10 + 可联系历史 10。仅 ICP &gt; ${ICP_MIN_SCORE} 进入每日新客户开发，≤${ICP_MIN_SCORE} 保留链接但划线，不自动触达。</span></div>`;
    if (!task) {
      return `${pageHead('开发工作台', 'Codex 全自动接手开发，Codex Chrome Extension 执行；仅重大异常通知介入')}
        ${metrics}${intelligencePanel}<div id="today-developed">${dailyDevelopedPanel()}</div>${salesSystemReadinessPanel()}${crmOperationsPanel()}${emailLifecyclePanel()}${systemFreshnessNotice(system)}${connection}${icpRule}${taskDetailPanel(system)}
        <section class="cc-panel"><div class="cc-panel-head"><h2>今日新开发</h2><a href="${urlFor('customers', { touch: 'untouched' })}">筛选候选客户</a></div>
        <div class="cc-empty">本次没有可直接自动发送的社媒任务；队列里的 Google 线索主要是官网/邮件联系入口，已在上方任务明细中列出，需按官网联系安全门处理。</div></section>
        <section class="cc-panel"><div class="cc-panel-head"><h2>跟进优先</h2><a href="${urlFor('queue', { queue: 'followup' })}">查看 ${followups.length} 条</a></div>
        <div class="cc-table-wrap">${taskTable(followups.slice(0, 8))}</div></section>`;
    }
    const score = scoreForDisplay(task);
    const activeIcp = icpScore(task);
    return `${pageHead('开发工作台', 'Codex 全自动决策与执行，GLM 优化画像与文案；仅重大 bug 暂停通知')}
      ${metrics}${intelligencePanel}<div id="today-developed">${dailyDevelopedPanel()}</div>${salesSystemReadinessPanel()}${crmOperationsPanel()}${emailLifecyclePanel()}${systemFreshnessNotice(system)}${connection}${icpRule}${taskDetailPanel(system)}
      <section class="cc-panel"><div class="cc-panel-head"><h2>当前客户</h2><div class="cc-row-actions"><button class="primary" type="button" onclick="runGlmQueue()" ${eligibleCount ? '' : 'disabled'}>${eligibleCount ? '执行当前最高优先级客户' : '暂无待开发客户'}</button><span class="cc-chip green">${stateLabel(task.state)}</span></div></div><div class="cc-panel-body">
        <div class="cc-current"><div><h3>${platformUrl(task) ? `<a href="${esc(platformUrl(task))}" target="_blank" rel="noopener">${esc(task.company)}</a>` : esc(task.company)}</h3><div class="cc-sub">${esc(task.role || '采购/合作负责人')} · ${esc(normalizedCountry(task))} · ${esc(task.keyword)}</div><div class="cc-actions"><button type="button" onclick="openVerifiedCustomer('${esc(task.taskId)}')" ${platformUrl(task) ? '' : 'disabled'}>打开客户主页</button><button class="primary" type="button" title="${esc(autoClawAvailability(task).reason)}" onclick="runGlmDirect('${esc(task.taskId)}')" ${canRunGlm(task) ? '' : 'disabled'}>${esc(autoClawAvailability(task).label)}</button><a href="${urlFor('customer', { contact: task.taskId })}">查看系统档案</a></div></div><div class="cc-score"><strong>${score.total}</strong><span>综合开发分 / 100</span></div></div>
        <div class="cc-sub">ICP：${activeIcp}/100 · ${esc(icpExplanation(task))}</div>
        ${stageRoute(task)}
        ${task.identityStatus === 'identity_mismatch' ? `<div class="cc-quality">身份不匹配：${esc(task.identityNote || '该账号与目标客户画像不一致，已禁止自动执行。')}</div>` : ''}
        <div class="cc-message">${esc(task.approvedMessage || salesChampionNextStep(task))}</div>
      </div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>接下来</h2><a href="${urlFor('queue', { queue: 'untouched' })}">查看全部</a></div><div class="cc-table-wrap">${taskTable(untouched.slice().sort((left, right) => icpScore(right) - icpScore(left)).slice(0, 8))}</div></section>`;
  }
  function taskTable(list) {
    if (!list.length) return '<div class="cc-empty">当前筛选下没有客户</div>';
    return `<table class="cc-table"><thead><tr><th>客户</th><th>国家</th><th>关键词</th><th>状态</th><th>ICP分</th><th>区域</th><th>操作</th></tr></thead><tbody>${list.map(task => {
      const qualified = shouldRetainWithoutStrike(task);
      const rowClass = qualified ? '' : ' class="cc-low-icp"';
      const linkClass = qualified ? '' : ' class="cc-strike-link"';
      const target = entryUrl(task);
      const profileHref = urlFor('customer', { contact: task.taskId });
      const customerLinkAttrs = ` href="${profileHref}"`;
      const archiveLink = target ? `<br><a class="cc-sub-link" href="${esc(target)}" target="_blank" rel="noopener">Verified channel</a>` : '';
      return `<tr${rowClass}><td><a${linkClass}${customerLinkAttrs} title="Open verified customer platform; ${esc(icpExplanation(task))}">${esc(task.company)}</a>${archiveLink}${task.identityStatus === 'identity_mismatch' ? '<br><span class="cc-chip red">Identity mismatch</span>' : ''}${qualified ? '' : '<br><span class="cc-chip amber">Low ICP retained</span>'}</td><td>${esc(normalizedCountry(task))}</td><td>${esc(task.keyword)}</td><td><span class="cc-chip">${stateLabel(task.state)}</span></td><td title="${esc(icpExplanation(task))}">${icpScore(task)}</td><td><span class="cc-chip ${['southeast_asia', 'europe', 'americas'].includes(targetRegion(task)) ? 'green' : ''}">${esc(targetRegion(task))}</span></td><td><div class="cc-row-actions"><button type="button" onclick="openVerifiedCustomer('${esc(task.taskId)}')" ${target ? '' : 'disabled'}>Open profile</button><button type="button" title="${esc(autoClawAvailability(task).reason)}" onclick="runGlmDirect('${esc(task.taskId)}')" ${canRunGlm(task) ? '' : 'disabled'}>${esc(autoClawAvailability(task).label)}</button></div></td></tr>`;
    }).join('')}</tbody></table>`;
  }
  function queue() {
    const mode = query.get('queue') || 'potential';
    const visibleRows = executableDevelopmentTasks();
    const list = latestRun
      ? (mode === 'potential' ? visibleRows : mode === 'north-america' ? northAmericaAgencyReserveRows() : mode === 'followup' ? todayFollowupTasks() : mode === 'cooldown' ? latestQueueRows('cooldownQueue') : mode === 'all' ? latestQueueRows('all') : mode === 'developed' ? dailyDevelopedRows() : executableDevelopmentTasks())
      : (mode === 'followup' ? followupTasks() : mode === 'all' ? tasks : untouchedTasks());
    const tabs = [
      ['potential', '\u53ef\u81ea\u52a8\u5f00\u53d1', visibleRows.length],
      ['untouched', '\u6267\u884c\u5b50\u96c6', executableDevelopmentTasks().length],
      ['followup', '\u8ddf\u8fdb\u4e2d', todayFollowupTasks().length],
      ['cooldown', '\u77ed\u671f\u4e0d\u91cd\u590d', latestRun ? latestQueueRows('cooldownQueue').length : 0],
      ['all', '\u5168\u90e8\u4efb\u52a1', latestRun ? latestQueueRows('all').length : tasks.length],
      ['developed', '\u4eca\u65e5\u5df2\u5f00\u53d1', dailyDevelopedRows().length],
      ['north-america', '\u5317\u7f8e\u4ee3\u7406\u50a8\u5907', northAmericaAgencyReserveRows().length],
    ];
    return `${pageHead('\u4eca\u65e5\u961f\u5217', '\u9ed8\u8ba4\u53ea\u663e\u793a\u672a\u89e6\u8fbe\u4e14\u8eab\u4efd\u6821\u9a8c\u901a\u8fc7\u7684\u65b0\u5ba2\u6237\uff0c\u5386\u53f2\u5ba2\u6237\u5355\u72ec\u8ddf\u8fdb')}
      <div class="cc-view-tabs">${tabs.map(([key, label, count]) => `<a class="${mode === key ? 'active' : ''}" href="${urlFor('queue', { queue: key })}">${label} <b>${count}</b></a>`).join('')}</div>
      ${mode === 'developed' ? `${northAmericaMarketPanel()}${dailyDevelopedPanel()}` : mode === 'north-america' ? northAmericaMarketPanel() : `<div class="cc-table-wrap">${taskTable(list)}</div>`}`;
  }
  function customerProfileType(record) {
    const text = [record.customerType, record.category, record.keyword, record.keyword_used, record.role, record.company, record.industry].join(' ').toLowerCase();
    if (/agency|agent|distributor|wholesale|importer|exclusive/.test(text)) return '渠道/代理';
    if (/rv|camping world|airstream|winnebago/.test(text)) return '房车/露营';
    if (/retail|buyer|category|merchant|merchandising|sporting goods|chain|store|co-op|coop/.test(text)) return 'KA/零售';
    if (/brand|oem|odm|manufacturer|product development/.test(text)) return '品牌/OEM';
    if (/marketing|community|designer|student|foundation|government|school/.test(text)) return '低匹配/非采购';
    return '待判定';
  }
  function companyScaleTier(record) {
    const text = [record.companyScale, record.background, record.role, record.company].join(' ').toLowerCase();
    if (/10,?001\+|10000\+|national|hundreds of stores|large|global|fortune|major/.test(text)) return '超大型';
    if (/1,?001|5000|thousands|store network|chain|co-op/.test(text)) return '大型';
    if (/201|500|regional|distributor|importer|wholesale/.test(text)) return '中型';
    if (/founder|owner|independent|boutique|startup/.test(text)) return '小型/独立';
    return '未知体量';
  }
  function distribution(records, getter) {
    const total = Math.max(records.length, 1);
    const buckets = new Map();
    records.forEach(record => {
      const label = String(getter(record) || 'Unknown').trim() || 'Unknown';
      const current = buckets.get(label) || { label, count: 0, highIcp: 0, contactable: 0, touched: 0, scoreTotal: 0 };
      current.count += 1;
      current.highIcp += isIcpQualified(record) ? 1 : 0;
      current.contactable += record.contact || record.email || record.targetUrl || record.website ? 1 : 0;
      current.touched += recordTouched(record) ? 1 : 0;
      current.scoreTotal += dealProbabilityScore(record);
      buckets.set(label, current);
    });
    return Array.from(buckets.values()).map(item => ({
      ...item,
      percent: Math.round((item.count / total) * 100),
      avgScore: Math.round(item.scoreTotal / Math.max(item.count, 1)),
    })).sort((left, right) => right.count - left.count || right.avgScore - left.avgScore || left.label.localeCompare(right.label));
  }
  function analysisBarRows(items, linkFactory) {
    const max = Math.max(...items.map(item => item.count), 1);
    return items.slice(0, 10).map(item => {
      const width = Math.max(4, Math.round((item.count / max) * 100));
      const label = linkFactory ? `<a href="${esc(linkFactory(item))}">${esc(item.label)}</a>` : esc(item.label);
      return `<div class="cc-analysis-bar"><div><b>${label}</b><span>${item.count} 条 · ${item.percent}% · 均分 ${item.avgScore}</span></div><div class="cc-bar"><i style="width:${width}%"></i></div><em>${item.highIcp} 高 ICP</em></div>`;
    }).join('');
  }
  function customerAnalysis() {
    const records = customerRecords();
    const mode = query.get('analysis') || 'overview';
    const highIcp = records.filter(isIcpQualified);
    const contactable = records.filter(record => record.contact || record.email || record.targetUrl || record.website);
    const social = records.filter(record => /instagram|facebook|ins|fb/i.test(String(record.platform || record.source || record.targetUrl || '')));
    const countries = distribution(records, normalizedCountry);
    const platforms = distribution(records, record => record.platform || record.source || '未知平台');
    const profiles = distribution(records, customerProfileType);
    const scales = distribution(records, companyScaleTier);
    const statuses = distribution(records, record => record.status || record.sendStatus || 'Pending');
    const tabs = [['overview', '总览'], ['country', '国家'], ['profile', '画像'], ['scale', '体量'], ['channel', '渠道']];
    const topCustomers = records.slice().sort((left, right) => dealProbabilityScore(right) - dealProbabilityScore(left)).slice(0, 14);
    const segment = mode === 'country' ? countries : mode === 'profile' ? profiles : mode === 'scale' ? scales : mode === 'channel' ? platforms : statuses;
    const segmentTitle = { overview: '客户状态结构', country: '国家 / 区域分布', profile: '客户画像分层', scale: '客户体量拆解', channel: '触达渠道结构' }[mode] || '客户结构';
    const segmentLink = mode === 'country'
      ? item => urlFor('customers', { country: item.label })
      : mode === 'channel'
        ? item => urlFor('customers', { platform: item.label })
        : mode === 'overview'
          ? item => urlFor('customers', { status: item.label })
          : null;
    return `${pageHead('客户分析', `专业客户结构拆解 · ${records.length} 条客户 · ${highIcp.length} 条高 ICP`)}
      <div class="cc-view-tabs">${tabs.map(([key, label]) => `<a class="${mode === key ? 'active' : ''}" href="${urlFor('analysis', { analysis: key })}">${label}</a>`).join('')}</div>
      <div class="cc-kpis cc-analysis-kpis">
        <a class="cc-kpi cc-kpi-link" href="${urlFor('customers')}"><span>客户总量</span><b>${records.length}</b></a>
        <a class="cc-kpi cc-kpi-link" href="${urlFor('customers', { sort: 'dealProbabilityScore' })}"><span>高 ICP</span><b>${highIcp.length}</b></a>
        <a class="cc-kpi cc-kpi-link" href="${urlFor('customers', { touch: 'contact' })}"><span>可联系客户</span><b>${contactable.length}</b></a>
        <a class="cc-kpi cc-kpi-link" href="${urlFor('analysis', { analysis: 'channel' })}"><span>社媒客户</span><b>${social.length}</b></a>
      </div>
      <section class="cc-panel"><div class="cc-panel-head"><h2>${segmentTitle}</h2><span class="cc-sub">占比、均分、高 ICP 数量按当前客户池实时计算</span></div><div class="cc-panel-body cc-analysis-bars">${analysisBarRows(segment, segmentLink)}</div></section>
      <div class="cc-analysis-grid">
        <section class="cc-panel"><div class="cc-panel-head"><h2>客户画像</h2><a href="${urlFor('analysis', { analysis: 'profile' })}">展开</a></div><div class="cc-panel-body cc-analysis-bars">${analysisBarRows(profiles)}</div></section>
        <section class="cc-panel"><div class="cc-panel-head"><h2>国家占比</h2><a href="${urlFor('analysis', { analysis: 'country' })}">展开</a></div><div class="cc-panel-body cc-analysis-bars">${analysisBarRows(countries, item => urlFor('customers', { country: item.label }))}</div></section>
        <section class="cc-panel"><div class="cc-panel-head"><h2>客户体量</h2><a href="${urlFor('analysis', { analysis: 'scale' })}">展开</a></div><div class="cc-panel-body cc-analysis-bars">${analysisBarRows(scales)}</div></section>
        <section class="cc-panel"><div class="cc-panel-head"><h2>平台渠道</h2><a href="${urlFor('analysis', { analysis: 'channel' })}">展开</a></div><div class="cc-panel-body cc-analysis-bars">${analysisBarRows(platforms, item => urlFor('customers', { platform: item.label }))}</div></section>
      </div>
      <section class="cc-panel"><div class="cc-panel-head"><h2>高价值客户拆解</h2><span class="cc-sub">按成交概率、ICP、国家优先级与联系方式综合排序</span></div><div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>客户</th><th>画像</th><th>国家</th><th>体量</th><th>平台</th><th>状态</th><th>综合分</th><th>可联系性</th></tr></thead><tbody>${topCustomers.map((record, index) => {
        const key = recordKey(record, index);
        const contact = record.contact || record.email || record.targetUrl || record.website || '';
        return `<tr><td><a href="${urlFor('customer', { contact: key })}">${esc(record.company || record.name)}</a><br><span class="cc-sub">${esc(record.role || record.keyword || '')}</span></td><td>${esc(customerProfileType(record))}</td><td>${esc(normalizedCountry(record))}</td><td>${esc(companyScaleTier(record))}</td><td>${esc(record.platform || record.source || '')}</td><td><span class="cc-chip">${esc(record.status || '')}</span></td><td><b>${dealProbabilityScore(record)}</b></td><td>${contact ? '<span class="cc-chip green">可触达</span>' : '<span class="cc-chip amber">待补全</span>'}</td></tr>`;
      }).join('')}</tbody></table></div></section>`;
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
    const sort = query.get('sort') || 'latestUpdate';
    const direction = query.get('direction') === 'asc' ? 'asc' : 'desc';
    const records = customerRecords();
    const indexed = records.map((record, index) => ({ record, index }));
    const filtered = indexed.filter(({ record }) => {
      const recordCountry = normalizedCountry(record);
      const haystack = [record.name, record.company, record.role, recordCountry, record.industry, record.source].join(' ').toLowerCase();
      if (search && !haystack.includes(search)) return false;
      if (platform && String(record.platform || '') !== platform) return false;
      if (status && String(record.status || '') !== status) return false;
      if (country && recordCountry !== country) return false;
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
      if (sort === 'dealProbabilityScore') return dealProbabilityScore(record);
      if (sort === 'fitScore' || sort === 'marketScore') return Number(record[sort] || 0);
      if (sort === 'latestUpdate') return Date.parse(recordUpdatedAt(record)) || 0;
      if (sort === 'lastTouch') return Date.parse(record.lastTouch || record.date || '') || 0;
      return String(record[sort] || '').toLowerCase();
    };
    filtered.sort((left, right) => {
      if (sort === 'lastTouch' || sort === 'latestUpdate') {
        const leftTouch = Date.parse(sort === 'latestUpdate' ? recordUpdatedAt(left.record) : (left.record.lastTouch || left.record.date || ''));
        const rightTouch = Date.parse(sort === 'latestUpdate' ? recordUpdatedAt(right.record) : (right.record.lastTouch || right.record.date || ''));
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
        <select id="customer-country" name="country">${optionList(uniqueValues(records, normalizedCountry), country, '全部国家')}</select>
        <select id="customer-industry" name="industry">${optionList(uniqueValues(records, 'industry'), industry, '全部行业')}</select>
        <select id="customer-source" name="source">${optionList(uniqueValues(records, 'source'), source, '全部来源')}</select>
        <select id="customer-touch" name="touch"><option value="">全部触达状态</option><option value="untouched" ${touch === 'untouched' ? 'selected' : ''}>未触达</option><option value="touched" ${touch === 'touched' ? 'selected' : ''}>已触达</option><option value="contact" ${touch === 'contact' ? 'selected' : ''}>已获取联系方式</option><option value="followup" ${touch === 'followup' ? 'selected' : ''}>需跟进</option></select>
        <select id="customer-touch-time" name="touchTime"><option value="">全部触达时间</option><option value="none" ${touchTime === 'none' ? 'selected' : ''}>无触达时间</option><option value="7" ${touchTime === '7' ? 'selected' : ''}>最近 7 天</option><option value="30" ${touchTime === '30' ? 'selected' : ''}>最近 30 天</option><option value="90" ${touchTime === '90' ? 'selected' : ''}>最近 90 天</option><option value="custom" ${touchTime === 'custom' ? 'selected' : ''}>自定义日期</option></select>
        <input id="customer-touch-from" name="touchFrom" type="date" value="${esc(touchFrom)}" title="最近触达开始日期">
        <input id="customer-touch-to" name="touchTo" type="date" value="${esc(touchTo)}" title="最近触达结束日期">
        <select id="customer-sort" name="sort"><option value="latestUpdate" ${sort === 'latestUpdate' ? 'selected' : ''}>最近更新</option><option value="dealProbabilityScore" ${sort === 'dealProbabilityScore' ? 'selected' : ''}>成交概率</option><option value="fitScore" ${sort === 'fitScore' ? 'selected' : ''}>ICP 分数</option><option value="marketScore" ${sort === 'marketScore' ? 'selected' : ''}>市场分数</option><option value="lastTouch" ${sort === 'lastTouch' ? 'selected' : ''}>最近触达</option><option value="company" ${sort === 'company' ? 'selected' : ''}>公司</option></select>
        <input type="hidden" name="direction" value="${direction}">
        <button class="primary" type="submit">筛选</button><a class="cc-reset" href="${urlFor('customers')}">重置筛选</a>
      </form>
      <div class="cc-table-wrap"><table class="cc-table"><thead><tr>${head('name', '姓名')}${head('company', '公司')}<th>职位</th>${head('country', '国家')}<th>平台</th><th>可建联 Email</th>${head('status', '状态')}${head('fitScore', 'ICP')}${head('latestUpdate', '最近真实触达')}</tr></thead><tbody>${rows.map(({ record, index }) => {
        const key = recordKey(record, index);
        const qualified = shouldRetainWithoutStrike(record);
        const linkClass = qualified ? '' : ' class="cc-strike-link"';
        const target = entryUrl(record);
        const profileHref = urlFor('customer', { contact: key });
        const customerLinkAttrs = ` href="${profileHref}"`;
        const archiveLink = target ? `<br><a class="cc-sub-link" href="${esc(target)}" target="_blank" rel="noopener">Verified channel</a>` : '';
        const reviewNote = customerReviewNote(record);
        const email = contactEmailValue(record);
        const emailCell = email
          ? `<a class="cc-sub-link" href="mailto:${esc(email)}">${esc(email)}</a><br><span class="cc-chip green">${esc(contactEmailStatus(record))}</span>`
          : `<span class="cc-chip amber">${esc(contactEmailStatus(record))}</span>`;
        const eventTime = formatCustomerEventTime(record);
        const eventTimeCell = eventTime
          ? `<time datetime="${esc(recordEventTime(record))}" title="真实客户事件时间，按上海时区显示">${esc(eventTime)}</time>`
          : '<span class="cc-sub">无真实触达时间</span>';
        return `<tr class="${qualified ? '' : 'cc-low-icp'}"><td><a${linkClass}${customerLinkAttrs} title="${esc(reviewNote)}">${esc(record.name)}</a>${archiveLink}</td><td>${esc(record.company)}<br><span class="cc-chip ${qualified ? 'green' : 'amber'}" title="${esc(reviewNote)}">${esc(reviewNote)}</span></td><td>${esc(record.role)}</td><td>${esc(normalizedCountry(record))}</td><td>${esc(record.platform)}</td><td>${emailCell}</td><td><span class="cc-chip">${esc(record.status)}</span></td><td title="ICP score, bounded to 0-100">${icpScore(record)}</td><td>${eventTimeCell}</td></tr>`;
      }).join('')}</tbody></table>${rows.length ? '' : '<div class="cc-empty">没有匹配客户，请重置或调整筛选条件</div>'}</div>`;
  }
  function countryGeoCode(country) {
    const key = String(country || '').toLowerCase();
    const map = {
      'united states': 'US', usa: 'US', '美国': 'US',
      canada: 'CA', '加拿大': 'CA',
      'united kingdom': 'GB', uk: 'GB', '英国': 'GB',
      france: 'FR', '法国': 'FR',
      germany: 'DE', '德国': 'DE',
      netherlands: 'NL', '荷兰': 'NL',
      australia: 'AU', '澳大利亚': 'AU',
      'new zealand': 'NZ', '新西兰': 'NZ',
      indonesia: 'ID', '印度尼西亚': 'ID',
    };
    return map[key] || '';
  }
  function trendsUrl(keyword, country) {
    const geo = countryGeoCode(country);
    const params = new URLSearchParams({
      date: 'today 12-m',
      gprop: '',
      q: keyword,
    });
    if (geo) params.set('geo', geo);
    return `https://trends.google.com/trends/explore?${params.toString()}`;
  }
  function commercialSearchTerms(record) {
    const raw = String(record.keyword || record.keyword_used || record.productCategory || '').toLowerCase();
    if (/sporting goods/.test(raw)) return ['sporting goods distributor', 'sporting goods wholesale'];
    if (/retail chain|outdoor retail/.test(raw)) return ['outdoor retail partnership', 'camping gear wholesale', 'outdoor gear distributor'];
    if (/camping|outdoor/.test(raw)) return ['camping equipment importer', 'camping accessories wholesale'];
    return ['outdoor retail partnership'];
  }
  function seoCountryHeatRows() {
    const rows = [...latestQueueRows('all'), ...googleDiscoveryRows(), ...liveOperationalRecords()];
    const groups = new Map();
    rows.forEach(record => {
      const country = normalizedCountry(record);
      commercialSearchTerms(record).forEach(keyword => {
        const key = `${keyword}|${country}`;
        const item = groups.get(key) || {
          keyword,
          country,
          customers: new Set(),
          platforms: new Set(),
          fitTotal: 0,
          count: 0,
          contactable: 0,
        };
        item.customers.add(record.company || record.name || '');
        item.platforms.add(record.platform || 'unknown');
        item.fitTotal += Number(record.fitScore || 0);
        item.count += 1;
        if (record.publicEmail || record.contactEmail || record.contactUrl || record.vendorPortal || record.website) item.contactable += 1;
        groups.set(key, item);
      });
    });
    return Array.from(groups.values()).map(item => {
      const avgFit = item.count ? item.fitTotal / item.count : 0;
      const heat = Math.min(100, Math.round(item.customers.size * 18 + item.platforms.size * 8 + avgFit * 0.45 + item.contactable * 5));
      return {
        ...item,
        heat,
        customerList: Array.from(item.customers).filter(Boolean).slice(0, 4).join(' / '),
        trendsUrl: trendsUrl(item.keyword, item.country),
      };
    }).sort((left, right) => right.heat - left.heat
      || right.customers.size - left.customers.size
      || left.country.localeCompare(right.country)
      || left.keyword.localeCompare(right.keyword)).slice(0, 24);
  }
  function seo() {
    const reportRecords = liveOperationalRecords();
    const metrics = analytics.buildKeywordMetrics(reportRecords);
    const countryHeat = seoCountryHeatRows();
    const opportunities = analytics.buildKeywordOpportunities(reportRecords).slice(0, 18);
    return `${pageHead('SEO 趋势', '按最新 Google/队列客户生成关键词与国家热度，并提供逐国家 Google Trends 核验入口')}
      <section class="cc-panel"><div class="cc-panel-head"><h2>真实关键词漏斗</h2><span class="cc-sub">仅统计已确认发送后的回复，不用预测值冒充结果</span></div><div class="cc-panel-body">${metrics.length ? metrics.map(item => `<div class="cc-bar-row"><span>${esc(item.keyword)} · n=${item.sampleSize}</span><div class="cc-bar"><i style="width:${Math.round(item.rates.replyRate * 100)}%"></i></div><b>${Math.round(item.rates.replyRate * 100)}%</b></div>`).join('') : '<div class="cc-empty">暂无已验证关键词数据</div>'}</div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>全球国家热度矩阵</h2><span class="cc-sub">基于最新队列客户数、国家、ICP、渠道和联系方式；趋势链接按国家打开 Google Trends</span></div><div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>关键词</th><th>国家</th><th>本地开发热度</th><th>客户 / 渠道</th><th>代表客户</th><th>国家趋势核验</th></tr></thead><tbody>${countryHeat.map(item => `<tr><td><b>${esc(item.keyword)}</b></td><td>${esc(item.country)}</td><td><span class="cc-chip ${item.heat >= 85 ? 'green' : item.heat >= 70 ? 'amber' : ''}">${item.heat}</span></td><td>${item.customers.size} 客户 · ${Array.from(item.platforms).join(' / ')}</td><td>${esc(item.customerList)}</td><td><a href="${esc(item.trendsUrl)}" target="_blank" rel="noopener">Google Trends ${esc(countryGeoCode(item.country) || 'Global')}</a></td></tr>`).join('')}</tbody></table></div></section>
      <section class="cc-panel keyword-opportunity"><div class="cc-panel-head"><h2>高转化关键词机会池</h2><span class="cc-sub">实测词优先，推荐词必须落到国家/客户热度后再执行</span></div><div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>关键词</th><th>意图</th><th>目标客户</th><th>证据</th><th>优先级</th><th>趋势核验</th></tr></thead><tbody>${opportunities.map(item => `<tr><td><b>${esc(item.keyword)}</b></td><td>${item.intent === 'transactional' ? '交易型' : '商业型'}</td><td>${esc(item.audience)}</td><td>${item.source === 'observed' ? `实测 n=${item.sampleSize} · 回复 ${Math.round(item.replyRate * 100)}%` : '推荐 · 待国家热度验证'}</td><td><span class="cc-chip ${item.priorityScore >= 90 ? 'green' : ''}">${item.priorityScore}</span></td><td><a href="${esc(item.trendsUrl)}" target="_blank" rel="noopener">Global Trends</a></td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function experiments() {
    const metrics = analytics.buildTemplateMetrics(liveOperationalRecords());
    return `${pageHead('模板实验', '只以发送确认记录计算回复率和联系方式获取率')}
      <div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>模板</th><th>样本</th><th>确认发送</th><th>回复</th><th>回复率</th><th>联系方式率</th></tr></thead><tbody>${metrics.map(item => `<tr><td>${esc(item.templateId)}</td><td>${item.sampleSize}</td><td>${item.confirmedSends}</td><td>${item.replies}</td><td>${Math.round(item.replyRate * 100)}%</td><td>${Math.round(item.contactCaptureRate * 100)}%</td></tr>`).join('')}</tbody></table></div>`;
  }
  function audit() {
    const events = liveAuditEvents();
    return `${pageHead('自动化审计', 'Codex 决策与 Codex Chrome Extension 执行证据留档，GLM 仅作为辅助模型')}
      <div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>时间</th><th>任务</th><th>阶段</th><th>代理</th><th>结果</th><th>证据</th></tr></thead><tbody>${events.map(item => `<tr><td>${esc(item.timestamp)}</td><td>${esc(item.taskId)}</td><td>${esc(item.stage)}</td><td>${esc(item.agent)}</td><td>${esc(item.result)}</td><td>${esc(item.evidence)}</td></tr>`).join('')}</tbody></table></div>`;
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
      ['国家/区域', normalizedCountry(record)],
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
  function salesChampionNextStep(task) {
    const channel = String(task.platform || '').toLowerCase() === 'email' ? '官网/供应商入口'
      : String(task.platform || '').toLowerCase() === 'facebook' ? 'Facebook 官方主页'
        : String(task.platform || '').toLowerCase() === 'instagram' ? 'Instagram 官方主页'
          : '最佳可验证渠道';
    const persona = task.buyerPersona || task.role || 'category buyer / partnership contact';
    const reason = task.background || task.opportunity || task.reason || '户外零售品类匹配';
    return `全球销冠流程：先用客户画像确认 ${persona}，通过 ${channel} 核验目标，再围绕 ${reason} 形成采购假设；只做一个精准动作，发送后进入跟进、联系方式捕获和机会复盘。`;
  }
  function firstUrl(...values) {
    return values.flat().find(value => /^https?:\/\//i.test(String(value || ''))) || '';
  }
  function channelMatrixRows(record) {
    const alternates = record.alternateChannels || {};
    const invalid = record.invalidChannels || {};
    const rows = [
      ['Public Email', record.publicEmail || record.contactEmail || '', record.publicEmailStatus || 'Public email if verified; blank means no public buyer email found'],
      ['Official Website', firstUrl(record.website, record.companyWebsite), 'Primary company verification and vendor/contact research'],
      ['Website Contact', firstUrl(record.contactUrl, alternates.websiteContact), 'Preferred non-social route for buyer/vendor inquiry'],
      ['Vendor Portal', firstUrl(record.vendorPortal), record.contactNote || 'Supplier or vendor onboarding/contact route'],
      ['Instagram', invalid.instagram ? '' : firstUrl(record.instagram_url, record.platform === 'instagram' ? record.targetUrl : '', alternates.instagram), invalid.instagram ? invalid.instagram.status : 'Use only if profile opens and message composer is available'],
      ['Facebook', invalid.facebook ? '' : firstUrl(record.facebook_url, record.platform === 'facebook' ? record.targetUrl : '', alternates.facebook), invalid.facebook ? invalid.facebook.status : 'Use official page when Instagram is broken or unavailable'],
      ['LinkedIn', firstUrl(record.linkedin_url, record.linkedin), 'Use for company and buyer role validation'],
      ['Google Contact Search', firstUrl(record.contactSearchUrl, record.evidenceUrl, record.query), 'Find buyer, wholesale, vendor portal, or partnership contact'],
    ];
    return rows.filter(([, value, note]) => value || note);
  }
  function renderContactValue(value) {
    const text = String(value || '');
    if (/^https?:\/\//i.test(text)) return `<a href="${esc(text)}" target="_blank" rel="noopener">${esc(text)}</a>`;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return `<a href="mailto:${esc(text)}">${esc(text)}</a>`;
    return esc(text || 'Pending');
  }
  function priorityTier(entity, score) {
    const value = Math.round(Number(entity && entity.fitScore || score && score.total || 0));
    if (value >= 90) return 'S / 战略客户';
    if (value >= 80) return 'A / 重点开发';
    if (value >= 70) return 'B / 持续跟进';
    if (value >= 60) return 'C / 机会客户';
    return 'D / 低优先级';
  }
  function businessModel(record) {
    const text = [record.businessModel, record.keyword, record.background, record.company, record.role].join(' ').toLowerCase();
    if (/distributor|dealer|importer|wholesale|分销|代理|进口/.test(text)) return 'Distributor / Importer';
    if (/retail|store|chain|shop|buyer|merchant|零售|连锁/.test(text)) return 'Retail Chain';
    if (/brand|manufacturer|official|品牌|制造/.test(text)) return 'Brand';
    if (/e-?commerce|marketplace|online|电商/.test(text)) return 'E-commerce';
    return '待补充';
  }
  function marketPosition(record, scoreValue) {
    const text = [record.marketPosition, record.background, record.keyword].join(' ').toLowerCase();
    if (/premium|leader|largest|major|verified|高端|头部|领先/.test(text) || scoreValue >= 90) return 'Premium / Market Leader';
    if (scoreValue >= 75) return 'Mid-Market / Growth';
    return 'Entry / Niche';
  }
  function coverage(record) {
    const text = [record.coverage, record.background, record.countryEn, record.country].join(' ').toLowerCase();
    if (/global|worldwide|international/.test(text)) return 'Global';
    if (/sea|europe|north america|asia-pacific|regional/.test(text)) return 'Regional';
    if (/chain|stores|national|largest|major/.test(text)) return 'National';
    return normalizedCountry(record) !== 'Global / Unspecified' ? 'Local / National' : '待补充';
  }
  function entryBarrier(record, scoreValue) {
    const status = String(record.marketStatus || record.agencyState || '').toLowerCase();
    if (/exclusive|reserved|blocked|独代/.test(status)) return 'High';
    if (scoreValue >= 90) return 'Medium';
    return 'Low / Medium';
  }
  function currentStatus(record) {
    const status = String(record.status || record.sendStatus || record.action || '').trim();
    if (/sent_confirmed|sent|contacted|已发送|已触达/i.test(status)) return 'Contacted';
    if (/sample/i.test(status)) return 'Sample';
    if (/quotation|quote/i.test(status)) return 'Quotation';
    if (/negotiation/i.test(status)) return 'Negotiation';
    if (/order|po/i.test(status)) return 'Order';
    if (/email_priority|rerouted/i.test(status)) return 'Lead / Email Priority';
    return status || 'Lead';
  }
  function addDaysLabel(value, days) {
    const base = Date.parse(value || '') || Date.now();
    return new Date(base + days * 86400000).toISOString().slice(0, 10);
  }
  function potentialByScore(scoreValue) {
    if (scoreValue >= 90) return { first: 'USD30K+', annual: 'USD300K+', cycle: '30-60 Days' };
    if (scoreValue >= 80) return { first: 'USD15K-30K', annual: 'USD150K+', cycle: '45-90 Days' };
    if (scoreValue >= 70) return { first: 'USD8K-15K', annual: 'USD80K+', cycle: '60-120 Days' };
    return { first: '待验证', annual: '待验证', cycle: '90+ Days' };
  }
  function salesResearchRows(record, score) {
    const scoreValue = Math.round(Number(record.fitScore || score.total || 0));
    const potential = potentialByScore(scoreValue);
    return [
      ['Customer Type', businessModel(record)],
      ['Market Coverage', coverage(record)],
      ['Priority Tier', priorityTier(record, score)],
      ['Buyer Persona', record.buyerPersona || record.role || 'Buyer / Category Manager / Vendor Review Contact'],
      ['Likely Product Fit', record.productFit || 'FLEXTAIL portable pumps, outdoor power, camping lighting, and 2026 new SKU line'],
      ['Recommended Opening', record.salesAngle || record.background || 'Lead with compact outdoor power and pump solutions for camping/accessory category expansion.'],
      ['Estimated First Order', record.firstOrder || potential.first],
      ['Annual Potential', record.annualPotential || potential.annual],
      ['Entry Risk', entryBarrier(record, scoreValue)],
      ['Next Action', record.nextAction || record.reason || 'Verify best buyer/contact channel, then send persona-specific outreach.'],
    ];
  }
  function globalCustomerDashboardRows(record, score) {
    const scoreValue = Math.round(Number(record.fitScore || score.total || 0));
    const potential = potentialByScore(scoreValue);
    const nextAction = record.nextAction || record.reason || record.followUpStatus || 'Open verified profile, prepare outreach draft, then confirm next channel';
    return [
      ['Basic Info', 'Priority', priorityTier(record, score), '客户等级：S/A/B/C/D'],
      ['Basic Info', 'Company', record.company || record.name || '待补充', '公司名称'],
      ['Basic Info', 'Country', normalizedCountry(record), '国家/地区'],
      ['Basic Info', 'Website', record.website || record.companyWebsite || '待补充', '官网'],
      ['Basic Info', 'LinkedIn', record.linkedin_url || record.linkedin || '待补充', '公司主页'],
      ['Basic Info', 'Founded', record.founded || '待补充', '成立时间'],
      ['Basic Info', 'Headquarters', record.headquarters || '待补充', '总部'],
      ['Contact', 'Public Email', record.publicEmail || record.contactEmail || '未公开 / 待核验', record.publicEmailStatus || '公开邮箱；若未公开，不自动猜测个人邮箱'],
      ['Contact', 'Phone', record.contactPhone || '未公开 / 待核验', '公开电话或客服入口'],
      ['Contact', 'Vendor / Contact Portal', record.vendorPortal || record.contactUrl || record.website || '待补充', '供应商/客服/联系人入口'],
      ['Contact', 'Contact Note', record.contactNote || '优先请求 buyer/category manager/vendor review contact', '销售使用说明'],
      ['Business', 'Business Model', record.businessModel || businessModel(record), 'Distributor / Retail / Brand / Importer / E-commerce'],
      ['Business', 'Company Scale', record.companyScale || record.scale || '待补充：Revenue / Employees / Stores', '收入 / 员工 / 门店'],
      ['Business', 'Market Position', marketPosition(record, scoreValue), 'Premium / Mid / Entry'],
      ['Business', 'Coverage', coverage(record), 'Local / National / Regional / Global'],
      ['Channel', 'Main Brands', record.mainBrands || record.brands || '待补充', '已代理品牌'],
      ['Channel', 'Product Category', record.productCategory || record.category || record.keyword || 'Outdoor / Camping Accessories', '主要经营品类'],
      ['Channel', 'Sales Channel', record.salesChannel || 'Omni / Online + Social', 'Offline / Online / Omni'],
      ['Channel', 'Buying Capability', record.buyingCapability || '待验证：Import Experience / Purchase Cycle', '采购能力'],
      ['Sales Analysis', 'Product Fit', record.productFit || 'Tiny Pump / Max Pump / outdoor electronics accessories', '推荐 SKU'],
      ['Sales Analysis', 'Decision Maker', record.decisionMaker || record.buyerPersona || record.role || 'Buyer / Category Manager', '采购决策人'],
      ['Sales Analysis', 'Opportunity', record.opportunity || record.background || nextAction, '切入机会'],
      ['Sales Analysis', 'Competition', record.competition || '待补充：Thermacell / Outin / local alternatives', '当前竞品'],
      ['Sales Analysis', 'Entry Barrier', entryBarrier(record, scoreValue), '进入难度'],
      ['Business Potential', 'First Order', record.firstOrder || potential.first, '预计首单'],
      ['Business Potential', 'Annual Potential', record.annualPotential || potential.annual, '年销售潜力'],
      ['Business Potential', 'Margin Model', record.marginModel || 'Distributor 20% / Retail 35%', '利润模型'],
      ['Execution', 'Sales Strategy', record.salesStrategy || 'Instagram / LinkedIn -> Email -> Meeting -> Sample -> Quote', '开发路径'],
      ['Execution', 'Data Sources', Array.isArray(record.dataSources) ? record.dataSources.join(' / ') : (record.dataSources || '待补充'), '联网核验来源摘要'],
      ['Execution', 'Current Status', currentStatus(record), 'Pipeline 阶段'],
      ['Execution', 'Next Action', nextAction, '下一步动作'],
      ['Execution', 'Owner', record.owner || 'Leo Liu', '负责人'],
      ['Execution', 'Last Contact', record.lastTouch || record.sentAt || record.date || '暂无', '最后联系时间'],
      ['Execution', 'Follow-up Date', record.followUpAt || addDaysLabel(record.lastTouch || record.date, 7), '下次跟进'],
      ['Management', 'Overall Score', `${scoreValue}/100`, '综合评分'],
      ['Management', 'Development Cycle', record.developmentCycle || potential.cycle, '预计成交周期'],
    ];
  }
  function researchValue(record, keys, fallback) {
    for (const key of keys) {
      const value = record && record[key];
      if (Array.isArray(value) && value.length) return value.join(' / ');
      if (String(value || '').trim()) return value;
    }
    return fallback || '待核验';
  }
  function qwenResearchModel(record, score) {
    const scoreValue = Math.round(Number(record.fitScore || score.total || 0));
    const company = record.company || record.name || '该客户';
    const model = record.businessModel || businessModel(record);
    const position = marketPosition(record, scoreValue);
    const fit = researchValue(record, ['productFit'], 'FLEXTAIL 便携泵、户外电源、露营照明及驱蚊产品');
    const decisionMaker = researchValue(record, ['decisionMaker', 'buyerPersona', 'role'], 'Category Manager / Head of Purchasing / Vendor Review Contact');
    const opportunity = researchValue(record, ['opportunity', 'salesAngle', 'background'], `以 ${fit} 补充其现有品类与高毛利配件组合`);
    const sources = researchValue(record, ['dataSources', 'evidenceUrl', 'query'], '待补充公开来源并交叉核验');
    const tier = priorityTier(record, score);
    const conclusion = researchValue(record, ['executiveConclusion', 'researchConclusion'], `${company} 属于 ${position} 的 ${model}，当前 ICP ${scoreValue}/100（${tier}）。建议围绕“${opportunity}”切入，并先核验采购决策人与官方建联入口。`);
    return {
      conclusion,
      snapshot: [
        ['法律实体', researchValue(record, ['legalEntity', 'company', 'name'], company), '公司主体与注册名称'],
        ['成立时间', researchValue(record, ['founded']), '公开公司资料'],
        ['总部', researchValue(record, ['headquarters']), '总部及主要运营区域'],
        ['公司规模', researchValue(record, ['companyScale', 'scale']), '员工、营收、门店或仓储网络'],
        ['核心定位', researchValue(record, ['corePositioning', 'marketPosition'], `${position} / ${model}`), '市场角色与价值定位'],
        ['行业地位', researchValue(record, ['industryPosition', 'mainBrands', 'brands']), '代理品牌、渠道能力或行业影响力'],
        ['证据来源', sources, '所有关键事实应保留可追溯公开来源'],
      ],
      fitRows: [
        ['推荐产品组合', fit, researchValue(record, ['productRationale'], '依据客户品类、渠道和终端用户场景匹配')],
        ['跨界定位', researchValue(record, ['crossCategoryPositioning'], 'Premium Outdoor & Lifestyle Tech Accessories'), '避免仅以低价露营装备定位'],
        ['采购价值', researchValue(record, ['buyerValue'], '差异化设计、高毛利加购、完整合规资料与稳定供应'), '面向采购方的商业价值'],
        ['首轮话术', researchValue(record, ['recommendedOpening', 'salesAngle'], opportunity), '必须针对该客户业务而非通用群发'],
      ],
      decisionRows: [
        ['目标决策人', decisionMaker],
        ['首选渠道', researchValue(record, ['preferredChannel'], record.instagram_url ? 'Instagram 官方账号' : record.facebook_url ? 'Facebook 官方主页' : record.linkedin_url ? 'LinkedIn 公司主页' : '官网 Vendor / Contact 入口')],
        ['首触动作', researchValue(record, ['firstTouchAction'], '核验官方账号与身份，发送一条客户定制化短消息，请求对接品类采购负责人')],
        ['跟进路径', researchValue(record, ['followUpStrategy', 'salesStrategy'], 'Social DM -> Buyer Email -> Meeting -> Sample -> Quote')],
        ['下一步', researchValue(record, ['nextAction', 'reason'], '补齐决策人姓名与公开联系方式后执行首触')],
      ],
      risks: [
        ['品牌/品类适配', researchValue(record, ['brandRisk'], scoreValue >= 80 ? '中：需要突出设计、奖项与高毛利定位' : '中高：需先验证终端用户与品类重合'), '使用客户现有品牌和渠道语言重新包装产品价值'],
        ['合规与准入', researchValue(record, ['complianceRisk'], '待核验 CE / RoHS / REACH / WEEE / UN38.3 及当地准入要求'), '首轮沟通主动说明可提供的认证与测试文件'],
        ['商务条款', researchValue(record, ['commercialRisk'], '待核验 MOQ、账期、返利、独家与库存要求'), '报价前核算账期资金成本并设置首单风险边界'],
        ['决策周期', researchValue(record, ['decisionCycleRisk', 'developmentCycle'], scoreValue >= 85 ? '预计 3-6 个月，多层采购与测试审批' : '待核验采购周期与上新窗口'), '以样品、市场证据和阶段性跟进推进，避免高频催单'],
      ],
      ratings: [
        ['公司实力', Math.min(5, Math.max(1, Math.round(scoreValue / 20))), researchValue(record, ['companyStrengthReason'], `${model}；${researchValue(record, ['companyScale', 'scale'], '规模待核验')}`)],
        ['渠道价值', Math.min(5, Math.max(1, Math.round((score.market || scoreValue) / 20))), researchValue(record, ['channelValueReason'], `${coverage(record)} coverage；${researchValue(record, ['mainBrands', 'brands'], '代理品牌待核验')}`)],
        ['产品匹配', Math.min(5, Math.max(1, Math.round((score.icp || scoreValue) / 20))), researchValue(record, ['productFitReason'], fit)],
        ['合作门槛', entryBarrier(record, scoreValue) === 'High' ? 5 : scoreValue >= 80 ? 4 : 3, researchValue(record, ['entryBarrierReason'], `${entryBarrier(record, scoreValue)}；需验证合规、采购流程与商务条件`)],
      ],
    };
  }
  function qwenResearchDashboard(record, score) {
    const research = qwenResearchModel(record, score);
    const table = (headers, rows) => `<div class="cc-table-wrap"><table class="cc-table"><thead><tr>${headers.map(item => `<th>${esc(item)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(value => `<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    return `<section class="cc-panel"><div class="cc-panel-head"><h2>深度背调结论</h2><span class="cc-sub">按专业分析师尽调模板生成，缺失事实明确标记待核验</span></div><div class="cc-panel-body"><p>${esc(research.conclusion)}</p></div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>一、公司基本面（尽调快照）</h2></div>${table(['维度', '核心信息', '验证状态 / 分析师备注'], research.snapshot)}</section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>二、业务矩阵与 FLEXTAIL 匹配度</h2></div>${table(['分析项', '客户适配结论', '采购价值 / 依据'], research.fitRows)}</section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>三、实战攻坚 SOP</h2></div>${table(['步骤', '执行内容'], research.decisionRows)}</section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>四、风险预警与应对底线</h2></div>${table(['风险点', '实际情况', '应对策略'], research.risks)}</section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>五、综合评级</h2><span class="cc-sub">评级辅助决策，不替代 ICP 评分</span></div>${table(['评估维度', '评分（5分）', '说明'], research.ratings)}</section>`;
  }
  function globalCustomerDashboard(record, score) {
    const rows = globalCustomerDashboardRows(record, score);
    const scoreRows = [
      ['Market Size', 20], ['Channel Strength', 20], ['Brand Match', 15], ['Product Fit', 15],
      ['Purchasing Power', 10], ['Competition Risk', 5], ['Entry Difficulty', 5], ['Annual Potential', 10],
    ];
    const pipeline = [
      ['Lead', '已识别目标客户', '建立客户档案'],
      ['Connected', '已建立联系', 'LinkedIn / Email / DM 回复'],
      ['Qualified', '确认采购意向', '完成需求分析'],
      ['Meeting', '已完成会议', '获取项目机会'],
      ['Sample', '样品测试', '样品反馈通过'],
      ['Quotation', '已报价', '商务谈判'],
      ['Negotiation', '条款确认', 'MOQ / 价格 / 付款'],
      ['PO', '收到订单', '首单成交'],
      ['Repeat Order', '复购', '年度增长'],
    ];
    const kpis = [
      ['New Leads / Week', '100'],
      ['Qualified Customers / Month', '40'],
      ['Meetings / Month', '20'],
      ['Samples Sent / Month', '15'],
      ['Quotations / Month', '10'],
      ['New Orders / Month', '3-5'],
      ['Repeat Orders / Quarter', '>=60%'],
      ['Annual Revenue per Customer', 'USD100K+'],
    ];
    return `<section class="cc-panel"><div class="cc-panel-head"><h2>Global Customer Analysis Dashboard V3.0</h2><span class="cc-sub">回答：是否值得开发 / 怎么开发 / 潜力多大 / 下一步动作</span></div><div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>模块</th><th>字段</th><th>当前值</th><th>说明</th></tr></thead><tbody>${rows.map(([module, field, value, note]) => `<tr><td>${esc(module)}</td><td><b>${esc(field)}</b></td><td>${/^https?:\/\//i.test(String(value || '')) ? `<a href="${esc(value)}" target="_blank" rel="noopener">${esc(value)}</a>` : esc(value)}</td><td>${esc(note)}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>客户评分模型</h2><span class="cc-sub">100 分制，90+ 为战略客户</span></div><div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>维度</th><th>权重</th></tr></thead><tbody>${scoreRows.map(([label, weight]) => `<tr><td>${esc(label)}</td><td>${weight}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>CRM Pipeline</h2><span class="cc-sub">销售推进阶段与 KPI</span></div><div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>Stage</th><th>Definition</th><th>KPI</th></tr></thead><tbody>${pipeline.map(([stage, definition, kpi]) => `<tr><td><b>${esc(stage)}</b></td><td>${esc(definition)}</td><td>${esc(kpi)}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>Dashboard KPI</h2><span class="cc-sub">销售总监视角的目标看板</span></div><div class="cc-table-wrap"><table class="cc-table"><thead><tr><th>KPI</th><th>Target</th></tr></thead><tbody>${kpis.map(([label, target]) => `<tr><td>${esc(label)}</td><td>${esc(target)}</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function customer() {
    const key = query.get('contact') || '';
    const task = findTaskById(key) || tasks.find(item => item.taskId === key);
    const records = customerRecords();
    const record = task || records.find((item, index) => encodeURIComponent([item.platform, item.name, item.company, index].join('|')) === key);
    if (!record) return pageHead('客户详情', '未找到对应客户') + '<div class="cc-empty">该记录可能已更新，请返回客户附表。</div>';
    const score = scoreForDisplay(task || record);
    const background = backgroundRows(record);
    const timeline = timelineFor(record);
    return `${pageHead(esc(record.company || record.name), '独立客户详情页，不覆盖原工作台')}
      <section class="cc-panel"><div class="cc-panel-body"><div class="cc-current"><div><h3>${esc(record.name)}</h3><div class="cc-sub">${esc(record.role)} · ${esc(normalizedCountry(record))} · ${esc(record.platform)}</div></div><div class="cc-score"><strong>${score.total}</strong><span>综合开发分</span></div></div></div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>ICP 评分解释</h2></div><div class="cc-panel-body"><div class="cc-sub">${esc(icpExplanation(record))}</div></div></section>
      ${qwenResearchDashboard(record, score)}
      ${globalCustomerDashboard(record, score)}
      <section class="cc-panel"><div class="cc-panel-head"><h2>Sales Intelligence Dossier</h2><span class="cc-sub">Sales-ready customer facts, opportunity, risk, and next action</span></div><div class="cc-panel-body"><table class="cc-table"><tbody>${salesResearchRows(record, score).map(([label, value]) => `<tr><th>${esc(label)}</th><td>${esc(value)}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>Verified Channel Matrix</h2><span class="cc-sub">Broken social links are marked for reroute instead of blind retry</span></div><div class="cc-panel-body"><table class="cc-table"><thead><tr><th>Channel</th><th>URL / Contact</th><th>Sales Use</th></tr></thead><tbody>${channelMatrixRows(record).map(([channel, url, note]) => `<tr><td>${esc(channel)}</td><td>${renderContactValue(url)}</td><td>${esc(note)}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>客户背调明细</h2></div><div class="cc-panel-body"><table class="cc-table"><tbody>${background.map(([label, value]) => {
        const text = String(value || '');
        const rendered = /^https?:\/\//i.test(text) ? `<a href="${esc(text)}" target="_blank" rel="noopener">${esc(text)}</a>` : esc(text);
        return `<tr><th>${esc(label)}</th><td>${rendered}</td></tr>`;
      }).join('')}</tbody></table></div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>触达时间线</h2></div><div class="cc-panel-body">${timeline.length ? `<div class="cc-timeline">${timeline.map(item => `<div class="cc-timeline-item"><b>${esc(item.time || '时间待补')}</b><span>${esc(item.title)}</span><p>${esc(item.detail || item.agent || '')}</p></div>`).join('')}</div>` : '<div class="cc-empty">暂无触达记录，可作为新客户候选；若已合作或已触达，请在客户状态中标记，系统会自动排除今日新开发。</div>'}</div></section>
      <section class="cc-panel"><div class="cc-panel-head"><h2>开发信与 Codex Chrome 执行证据</h2></div><div class="cc-panel-body"><div class="cc-message">${esc(record.approvedMessage || record.message || '暂无自动开发信')}</div><div class="cc-sub" style="margin-top:12px">精确目标：${esc(record.targetUrl || record.instagram_url || record.linkedin_url || '')}<br>最近触达：${esc(record.lastTouch || record.date || '暂无')}<br>执行证据：${esc(record.automationEvidence || record.sendStatus || '暂无')}<br>身份状态：${esc(record.identityStatus || '待核验')}<br>核验来源：${esc(record.identitySource || '暂无')}</div></div></section>`;
  }
  function rail() {
    const task = currentTask();
    if (!task) {
      const system = latestSystemSummary();
      const executionText = latestExecution
        ? latestExecution.pendingExecution
          ? '多点触达队列已刷新，尚未执行发送。'
          : latestExecution.skippedOnly
          ? '本次执行没有发送，全部被安全门拦截。'
          : latestExecution.ok
            ? '本次执行已完成。'
            : `本次执行失败：${latestExecution.error || '未知错误'}`
        : '尚未加载执行结果。';
      return `<aside class="cc-rail"><h2>Codex 决策</h2>
        <div class="cc-rail-section"><h2>本次运行</h2><div class="cc-evidence">potentialPool：${(system.potentialRows || []).length}<br>executable：${latestRun && latestRun.summary ? Number(latestRun.summary.executableCompanies || 0) : 0}<br>enrichment backlog：${latestRun && latestRun.summary ? Number(latestRun.summary.enrichmentBacklogCount || 0) : 0}<br>dailyQueue：${system.dailyRows.length}<br>Google discovered：${system.googleRows.length}<br>websiteContact：${system.websiteContactRows.length}<br>${esc(executionText)}</div></div>
        <div class="cc-rail-section"><h2>下一步</h2><div class="cc-evidence">优先处理上方“任务明细”里的官网/邮件入口；当前没有符合自动社媒发送条件的客户。</div></div>
      </aside>`;
    }
    const score = scoreForDisplay(task);
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
      ...Object.entries(currentReport.rates || {}).map(([key, value]) => [key, rate(value)]),
      [],
      ['dimension', 'label', 'discovered', 'sent', 'replied', 'contacts', 'opportunities', 'discovery_to_reply_rate', 'reply_rate', 'reply_to_contact_rate', 'confidence'],
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
        rate(item.rates.discoveryToReplyRate),
        rate(item.rates.replyRate),
        rate(item.rates.replyToContactRate),
        item.metrics.sent >= 10 ? 'strong' : item.metrics.sent >= 3 ? 'directional' : 'low_sample',
      ]));
    });
    rows.push([]);
    rows.push(['reply_conversion_segments', 'dimension', 'label', 'sent', 'replied', 'reply_rate', 'confidence']);
    ((currentReport.conversion && currentReport.conversion.topReplySegments) || []).forEach(item => rows.push([
      'top',
      item.dimension,
      item.label,
      item.sent,
      item.replied,
      rate(item.rates.replyRate),
      item.confidence,
    ]));
    ((currentReport.conversion && currentReport.conversion.underperformingSegments) || []).forEach(item => rows.push([
      'underperforming',
      item.dimension,
      item.label,
      item.sent,
      item.replied,
      rate(item.rates.replyRate),
      item.confidence,
    ]));
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
    const target = bestContactUrl(task);
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
      const target = bestContactUrl(task);
      if (target) {
        window.open(target, '_blank', 'noopener');
        return;
      }
      window.alert('Codex Chrome 自动开发需要桌面 APP 和 Codex Chrome Extension 浏览器执行组件。网页版只能生成画像与文案，不能控制本机浏览器。');
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
      if (['prepared_not_sent', 'draft_prepared', 'draft_already_present', 'approval_pending', 'send_unconfirmed', 'website_contact_ready'].includes(result.sendStatus)
        || result.mode === 'followup_prepare_no_duplicate_send') {
        localStorage.setItem(`glm-direct-prepared:${task.taskId}`, new Date().toISOString());
      } else if (result.sendStatus === 'sent_confirmed') {
        localStorage.setItem(`glm-direct-completed:${task.taskId}`, '1');
      } else {
        localStorage.setItem(`glm-direct-completed:${task.taskId}`, '1');
      }
      window.alert(result.sendStatus === 'draft_prepared'
        ? '开发草稿已准备；系统将优先自动发送，若未发送说明触发了安全门。'
        : result.sendStatus === 'sent_confirmed'
          ? '开发消息已自动发送并确认，系统将进入等待回复。'
        : '自动开发未完成：系统已暂停以避免错误发送，仅重大异常需要介入。');
      location.reload();
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
        button.textContent = '并行队列执行中...';
      }
      try {
        const result = await window.customerDev.runDailyAutomationQueue({ limit: Math.max(1, executableDevelopmentTasks().length), parallelLimit: 1, delayMs: 2500 });
        if (!result.ok) {
          if (result.executionPhase === 'no_executable_tasks' || result.chromeOpened === false || result.customerDevelopmentPerformed === false) {
            window.alert(`No Chrome/browser development was performed.\nReason: ${result.error || result.userVisibleStatus || 'Safety gates left no executable tasks.'}\nSkipped: ${(result.skipped || []).length}`);
            return;
          }
          window.alert(`${result.error || 'Daily queue did not execute.'}\nSkipped: ${(result.skipped || []).length}`);
          return;
        }
        const drafted = (result.executed || []).filter(item => item.result && item.result.sendStatus === 'draft_prepared').length;
        const sent = (result.executed || []).filter(item => item.result && item.result.sendStatus === 'sent_confirmed').length;
        window.alert(`Codex Chrome current target finished. Mode: ${result.mode || 'serial-single-target'}. Source: ${result.queueSource || 'dailyQueue'}. Sent confirmed: ${sent}. Drafts prepared: ${drafted}. Executed: ${(result.executed || []).filter(item => item.ok).length}`);
        location.reload();
        return;
      } catch (error) {
        window.alert(`Daily queue failed: ${error.message || error}`);
        return;
      } finally {
        if (button && button.tagName === 'BUTTON') {
          button.disabled = false;
          button.textContent = '执行当前最高优先级客户';
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
      window.alert('请使用桌面 APP 启动 Codex Chrome Extension 串行队列。');
      return;
    }
    for (let index = 0; index < eligible.length; index += 1) {
      const task = eligible[index];
      const result = await window.customerDev.runGlmDirectAutomation({ lead: task });
      if (result.ok) {
        if (['prepared_not_sent', 'draft_prepared', 'draft_already_present', 'approval_pending', 'send_unconfirmed', 'website_contact_ready'].includes(result.sendStatus)
          || result.mode === 'followup_prepare_no_duplicate_send') {
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
  const renderers = { workspace, queue, customers, analysis: customerAnalysis, seo, experiments, reports, audit, settings, customer };
  try {
    document.body.classList.add('command-center-active');
    const shell = document.createElement('div');
    shell.className = 'cc-shell';
    shell.id = 'command-center-shell';
    shell.innerHTML = `${nav()}<main class="cc-main">${(renderers[view] || workspace)()}</main>${rail()}`;
    document.body.appendChild(shell);
    document.body.classList.remove('command-center-booting');
  } catch (error) {
    console.error('Command center startup failed', error);
    document.body.classList.add('command-center-active');
    const failedShell = document.createElement('div');
    failedShell.className = 'cc-shell';
    failedShell.id = 'command-center-shell';
    failedShell.dataset.startupFailure = '1';
    failedShell.innerHTML = '<main class="cc-main"><section class="cc-panel"><h1>\u5ba2\u6237\u5f00\u53d1\u7cfb\u7edf\u542f\u52a8\u5931\u8d25</h1><p>\u7cfb\u7edf\u5df2\u505c\u6b62\u65e0\u9650\u52a0\u8f7d\u3002\u8bf7\u5237\u65b0\u9875\u9762\uff1b\u82e5\u95ee\u9898\u6301\u7eed\uff0c\u8bf7\u68c0\u67e5\u6700\u65b0\u7684\u672c\u5730\u6570\u636e\u8d44\u6e90\u3002</p><button type="button" onclick="location.reload()">\u91cd\u65b0\u52a0\u8f7d</button></section></main>';
    document.body.appendChild(failedShell);
    document.body.classList.remove('command-center-booting');
  }
  const reportPeriod = document.getElementById('report-period');
  if (reportPeriod) {
    reportPeriod.addEventListener('change', event => {
      const type = query.get('report') === 'monthly' ? 'monthly' : 'weekly';
      location.href = reportHref(type, event.target.value);
    });
  }
}());

