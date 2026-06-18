(function exposeAutonomousData(root) {
  const plan = typeof DAILY_OUTREACH_TASKS !== 'undefined'
    ? DAILY_OUTREACH_TASKS
    : root.DAILY_OUTREACH_TASKS;
  const daily = plan && Array.isArray(plan.tasks)
    ? plan.tasks
    : [];
  const profiles = root.VERIFIED_PROFILE_REGISTRY || {};
  function validTimestamp(value) {
    return typeof value === 'string' && value && Number.isFinite(Date.parse(value)) ? value : '';
  }
  function stateForResult(result) {
    if (result.status === 'sent_confirmed') return 'outcome_pending';
    if (result.status === 'failed_open') return 'target_verified';
    if (result.status === 'skipped') return /email_channel_found/i.test(String(result.evidence || '')) ? 'rerouted' : 'scheduled';
    return result.status || 'target_verified';
  }
  function taskTimestamp(task) {
    if (validTimestamp(task.generatedAt)) return task.generatedAt;
    if (typeof task.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(task.date)) {
      return `${task.date}T09:00:00+08:00`;
    }
    return validTimestamp(plan && plan.generatedAt);
  }
  function profileFor(task) {
    const keys = [task.accountHandle, task.account_handle, task.name]
      .map(value => String(value || '').trim().replace(/^@/, '').toLowerCase())
      .filter(Boolean);
    return keys.map(key => profiles[key]).find(Boolean) || null;
  }
  const tasks = daily.map((task, index) => {
    const profile = profileFor(task);
    const eventTimestamp = taskTimestamp(task);
    const sentTimestamp = validTimestamp(task.lastTouch) || eventTimestamp;
    const previouslyContacted = /sent|replied|accepted/i.test(String(task.originalStatus || ''))
      || Boolean(task.lastKnownTouch);
    return ({
    taskId: `verified-${task.platform || 'social'}-${task.accountHandle || task.name || index}`,
    version: 1,
    state: task.automationStatus === 'sent_confirmed' || previouslyContacted ? 'outcome_pending' : 'profile_scored',
    name: profile ? profile.handle : (task.name || task.accountHandle || 'Unknown'),
    company: profile ? profile.company : (task.company || task.name || 'Unknown'),
    sourceCompany: task.company || task.name || '',
    role: task.role || '',
    platform: String(task.platform || '').toLowerCase(),
    country: profile && profile.country ? profile.country : (task.country || ''),
    targetUrl: profile ? profile.url : (task.verifiedTargetUrl || ''),
    accountHandle: profile ? profile.handle : (task.accountHandle || task.account_handle || task.name || ''),
    identityStatus: profile ? profile.status : 'unverified',
    identityVerified: Boolean(profile && profile.status === 'verified'),
    identityNote: profile && profile.note ? profile.note : '',
    identitySource: profile && profile.source ? profile.source : '',
    identityVerifiedAt: profile && profile.verifiedAt ? profile.verifiedAt : '',
    marketStatus: task.marketStatus || '开放',
    keyword: task.keyword || task.keyword_used || 'outdoor retail partnership',
    templateId: task.templateId || 'buyer-contact-v1',
    icpTier: task.icpTier || task.tier || task.fitTier || '',
    fitScore: Number(task.fitScore || 0),
    approvalAttempts: 0,
    approvedMessage: task.approvedMessage || task.message || '',
    approvalVersion: 1,
    discoveredAt: eventTimestamp,
    profiledAt: eventTimestamp,
    approvedAt: task.automationStatus === 'sent_confirmed' ? sentTimestamp : '',
    sentAt: task.automationStatus === 'sent_confirmed' ? sentTimestamp : '',
    sendStatus: task.automationStatus || '',
    originalStatus: task.originalStatus || '',
    previouslyContacted,
    repliedAt: task.originalStatus === 'Replied' ? validTimestamp(task.lastKnownTouch) : '',
    contactCapturedAt: task.contact ? sentTimestamp : '',
    autoSkippedAt: task.automationStatus === 'auto_skipped' ? eventTimestamp : '',
    trend: {
      status: 'data_unavailable',
      region: task.countryEn || task.country || '',
      period: '',
      collectedAt: '',
      index: null,
      direction: 'unknown',
    },
    });
  });
  const audit = tasks
    .filter(task => task.sendStatus === 'sent_confirmed')
    .map(task => ({
      id: `${task.taskId}-sent-${task.approvalVersion}`,
      taskId: task.taskId,
      stage: 'sent_confirmed',
      agent: 'autoclaw',
      timestamp: task.sentAt,
      result: 'sent_confirmed',
      evidence: task.targetUrl,
    }));
  const executionResults = Array.isArray(root.AUTONOMOUS_OUTREACH_RESULTS)
    ? root.AUTONOMOUS_OUTREACH_RESULTS
    : [];
  executionResults.forEach(result => {
    const task = tasks.find(item => item.taskId === result.task_id);
    if (task && result.approval_version >= task.approvalVersion) {
      task.sendStatus = result.status;
      task.state = stateForResult(result);
      task.evidence = result.evidence || '';
      task.duplicateRisk = Boolean(result.duplicateRisk);
      if (result.timestamp) {
        task.resultCheckedAt = result.timestamp;
        if (result.status === 'sent_confirmed') task.sentAt = result.timestamp;
        if (result.status === 'sent_confirmed' || result.status === 'post_liked' || result.status === 'account_followed') {
          task.lastTouch = result.timestamp;
        }
      }
    }
    audit.push({
      id: [result.task_id, result.approval_version, result.status, result.timestamp || ''].join('-'),
      taskId: result.task_id,
      stage: result.status,
      agent: result.agent || 'autoglm',
      timestamp: result.timestamp || '',
      result: result.status,
      evidence: result.target_url || '',
    });
  });

  root.AUTONOMOUS_OUTREACH_DATA = {
    schemaVersion: 1,
    settings: {
      minimumScore: 70,
      delayMinSeconds: 30,
      delayMaxSeconds: 120,
      maximumOptimizationAttempts: 2,
      cooldownDays: 7,
    },
    tasks,
    audit,
    keywordTrends: [],
    experiments: [],
  };
}(typeof globalThis !== 'undefined' ? globalThis : window));
