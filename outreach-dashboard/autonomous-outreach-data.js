(function exposeAutonomousData(root) {
  const plan = typeof DAILY_OUTREACH_TASKS !== 'undefined'
    ? DAILY_OUTREACH_TASKS
    : root.DAILY_OUTREACH_TASKS;
  const daily = plan && Array.isArray(plan.tasks)
    ? plan.tasks
    : [];
  const tasks = daily.map((task, index) => ({
    taskId: `verified-${task.platform || 'social'}-${task.accountHandle || task.name || index}`,
    version: 1,
    state: task.automationStatus === 'sent_confirmed' ? 'outcome_pending' : 'profile_scored',
    name: task.name || task.accountHandle || 'Unknown',
    company: task.company || task.name || 'Unknown',
    role: task.role || '',
    platform: String(task.platform || '').toLowerCase(),
    country: task.country || '',
    targetUrl: task.targetUrl || task.target_url || task.url || '',
    accountHandle: task.accountHandle || task.account_handle || task.name || '',
    marketStatus: task.marketStatus || '开放',
    keyword: task.keyword || task.keyword_used || 'outdoor retail partnership',
    templateId: task.templateId || 'buyer-contact-v1',
    fitScore: Number(task.fitScore || 0),
    approvalAttempts: 0,
    approvedMessage: task.approvedMessage || task.message || '',
    approvalVersion: 1,
    discoveredAt: task.generatedAt || '',
    profiledAt: task.generatedAt || '',
    approvedAt: task.automationStatus === 'sent_confirmed' ? task.lastTouch || '' : '',
    sentAt: task.automationStatus === 'sent_confirmed' ? task.lastTouch || '' : '',
    sendStatus: task.automationStatus || '',
    repliedAt: task.originalStatus === 'Replied' ? task.lastKnownTouch || '' : '',
    contactCapturedAt: task.contact ? task.lastTouch || '' : '',
    trend: {
      status: 'data_unavailable',
      region: task.countryEn || task.country || '',
      period: '',
      collectedAt: '',
      index: null,
      direction: 'unknown',
    },
  }));
  const audit = tasks
    .filter(task => task.sendStatus === 'sent_confirmed')
    .map(task => ({
      id: `${task.taskId}-sent-${task.approvalVersion}`,
      taskId: task.taskId,
      stage: 'sent_confirmed',
      agent: 'qclaw',
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
      task.state = result.status === 'sent_confirmed' ? 'outcome_pending' : result.status;
      if (result.timestamp) task.sentAt = result.timestamp;
    }
    audit.push({
      id: [result.task_id, result.approval_version, result.status, result.timestamp || ''].join('-'),
      taskId: result.task_id,
      stage: result.status,
      agent: 'qclaw',
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
    },
    tasks,
    audit,
    keywordTrends: [],
    experiments: [],
  };
}(typeof globalThis !== 'undefined' ? globalThis : window));
