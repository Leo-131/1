(function exposeSystemReadiness(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.SystemReadiness = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createSystemReadiness() {
  'use strict';

  const CONNECTORS = Object.freeze([
    {
      id: 'crm',
      label: 'CRM客户主档',
      capability: 'CRM_SYNC',
      tier: 'optional',
      providers: ['HubSpot', 'Salesforce'],
      any: [['HUBSPOT_ACCESS_TOKEN'], ['SALESFORCE_CLIENT_ID', 'SALESFORCE_CLIENT_SECRET']],
      builtin: {
        provider: 'Local CRM Event Ledger',
        mode: 'builtin_local_crm_ledger',
        coverage: 'company_deduplication_contacts_channels_stages_events',
      },
      impact: '统一企业、联系人、触达、回复与商机，作为去重事实源',
      priority: 100,
    },
    {
      id: 'enrichment',
      label: '联系人与企业补全',
      capability: 'LEAD_ENRICHMENT',
      tier: 'optional',
      providers: ['Apollo', 'Clay'],
      any: [['APOLLO_API_KEY'], ['CLAY_API_KEY']],
      builtin: {
        provider: 'Verified Discovery Registry',
        mode: 'builtin_verified_discovery',
        coverage: 'google_discovery_local_database_verified_profiles',
      },
      impact: '补全采购负责人、职位和已验证业务联系方式',
      priority: 98,
    },
    {
      id: 'email_verification',
      label: '邮箱验证',
      capability: 'EMAIL_VERIFICATION',
      tier: 'optional',
      providers: ['Hunter', 'ZeroBounce', 'NeverBounce'],
      any: [['HUNTER_API_KEY'], ['ZEROBOUNCE_API_KEY'], ['NEVERBOUNCE_API_KEY']],
      builtin: {
        provider: 'Official-source Email Safety Guard',
        mode: 'builtin_official_source_email_guard',
        coverage: 'syntax_business_domain_official_source_fail_closed',
      },
      impact: '在发送前拦截无效地址，降低退信和域名风险',
      priority: 96,
    },
    {
      id: 'alibaba_mail',
      label: '阿里企业邮箱闭环',
      capability: 'ALIBABA_MAIL',
      tier: 'channel',
      providers: ['Alibaba Mail'],
      all: ['OUTREACH_EMAIL_FROM', 'ALIBABA_SMTP_USER', 'ALIBABA_SMTP_SECURITY_PASSWORD'],
      proofModes: ['dedicated_chrome_cdp_session'],
      impact: '发送、已发送文件夹确认、退信和回复回收',
      priority: 95,
    },
    {
      id: 'approval_alerts',
      label: '异常审批通知',
      capability: 'APPROVAL_ALERTS',
      tier: 'optional',
      providers: ['Slack', 'Teams'],
      any: [['SLACK_BOT_TOKEN', 'SLACK_ALERT_CHANNEL'], ['TEAMS_WEBHOOK_URL']],
      builtin: {
        provider: 'Local Automation Audit Queue',
        mode: 'builtin_local_approval_queue',
        coverage: 'captcha_identity_duplicate_confirmation_and_positive_reply_review',
      },
      impact: '验证码、身份冲突和积极回复及时转人工',
      priority: 78,
    },
    {
      id: 'meeting_routing',
      label: '会议预约与路由',
      capability: 'MEETING_ROUTING',
      tier: 'optional',
      providers: ['Google Calendar', 'Calendly'],
      any: [
        ['GOOGLE_CALENDAR_ID', 'SALES_ROUTE_OWNER_EMAIL'],
        ['MEETING_BOOKING_URL', 'SALES_ROUTE_OWNER_EMAIL'],
        ['CALENDLY_BOOKING_URL', 'SALES_ROUTE_OWNER_EMAIL'],
      ],
      proofModes: ['connected_google_calendar'],
      impact: '把积极回复直接转成采购会议',
      priority: 76,
    },
  ]);

  function present(env, key) {
    return Boolean(String((env || {})[key] || '').trim());
  }

  function groupReady(env, group) {
    return Array.isArray(group) && group.length > 0 && group.every(key => present(env, key));
  }

  function verifiedProof(definition, proofs, now = new Date()) {
    const proof = proofs && proofs[definition.id];
    if (!proof || proof.status !== 'verified') return null;
    if (!Array.isArray(definition.proofModes) || !definition.proofModes.includes(proof.mode)) return null;
    const verifiedAt = Date.parse(proof.verifiedAt || '');
    const expiresAt = Date.parse(proof.expiresAt || '');
    if (!Number.isFinite(verifiedAt) || !Number.isFinite(expiresAt) || expiresAt <= now.getTime()) return null;
    return Object.freeze({
      mode: proof.mode,
      verifiedAt: new Date(verifiedAt).toISOString(),
      expiresAt: new Date(expiresAt).toISOString(),
    });
  }

  function assessConnector(definition, env, proofs, now) {
    const allReady = !definition.all || groupReady(env, definition.all);
    const anyReady = !definition.any || definition.any.some(group => groupReady(env, group));
    const credentialReady = allReady && anyReady;
    const proof = verifiedProof(definition, proofs, now);
    const builtin = definition.builtin || null;
    const ready = credentialReady || Boolean(proof) || Boolean(builtin);
    const requiredGroups = definition.all
      ? [definition.all]
      : definition.any || [];
    const missing = ready ? [] : requiredGroups
      .map(group => group.filter(key => !present(env, key)))
      .sort((left, right) => left.length - right.length)[0] || [];
    return Object.freeze({
      id: definition.id,
      label: definition.label,
      capability: definition.capability,
      tier: definition.tier,
      providers: definition.providers,
      ready,
      status: proof
        ? 'ready_connected_session'
        : credentialReady
          ? 'ready'
          : builtin
            ? 'ready_builtin'
            : 'not_configured',
      providerSource: proof
        ? proof.mode
        : credentialReady
          ? 'environment_configuration'
          : builtin
            ? builtin.mode
            : '',
      providerLabel: proof
        ? definition.providers[0]
        : credentialReady
          ? definition.providers.join(' / ')
          : builtin
            ? builtin.provider
            : '',
      coverage: builtin && !proof && !credentialReady ? builtin.coverage : '',
      verifiedAt: proof ? proof.verifiedAt : '',
      expiresAt: proof ? proof.expiresAt : '',
      missing,
      impact: definition.impact,
      priority: definition.priority,
    });
  }

  function assess(env = {}, proofs = {}, options = {}) {
    const now = options.now instanceof Date ? options.now : new Date();
    const connectors = CONNECTORS
      .map(definition => assessConnector(definition, env, proofs, now))
      .sort((left, right) => right.priority - left.priority);
    const readyCount = connectors.filter(item => item.ready).length;
    const coreGates = Object.freeze([
      Object.freeze({ id: 'eligibility', label: 'ICP、身份、排他市场与冷却期门禁', ready: true }),
      Object.freeze({ id: 'deduplication', label: '公司级当日去重', ready: true }),
      Object.freeze({ id: 'evidence', label: '仅确认发送或提交计数', ready: true }),
      Object.freeze({ id: 'local_ledger', label: '本地不可变客户事件账本', ready: true }),
    ]);
    const coreReadyCount = coreGates.filter(item => item.ready).length;
    return Object.freeze({
      generatedAt: new Date().toISOString(),
      security: 'configuration_presence_only_no_secret_values',
      readyCount,
      totalCount: connectors.length,
      score: Math.round((readyCount / connectors.length) * 100),
      connectorCoverageScore: Math.round((readyCount / connectors.length) * 100),
      coreReadyCount,
      coreTotalCount: coreGates.length,
      coreScore: Math.round((coreReadyCount / coreGates.length) * 100),
      coreReady: coreGates.every(item => item.ready),
      productionReady: coreGates.every(item => item.ready),
      requiredConnectorIds: Object.freeze([]),
      advisoryConnectorIds: Object.freeze(connectors.map(item => item.id)),
      coreGates,
      connectors: Object.freeze(connectors),
    });
  }

  function uniqueCustomerCount(events, types) {
    const allowed = new Set(types);
    return new Set((Array.isArray(events) ? events : [])
      .filter(event => allowed.has(String(event && event.type || '')))
      .map(event => event && event.customerKey)
      .filter(Boolean)).size;
  }

  function conversionSnapshot(events = []) {
    const sent = uniqueCustomerCount(events, ['sent_confirmed']);
    const replied = uniqueCustomerCount(events, ['replied', 'positive_reply']);
    const qualified = uniqueCustomerCount(events, ['buyer_routed', 'qualified']);
    const meetings = uniqueCustomerCount(events, ['meeting_booked']);
    const opportunities = uniqueCustomerCount(events, ['opportunity_created', 'sample_sent', 'quotation_sent', 'won']);
    return Object.freeze({
      sent,
      replied,
      qualified,
      meetings,
      opportunities,
      qualifiedMeetingsPer100: sent ? Math.round((meetings / sent) * 10000) / 100 : 0,
      replyRate: sent ? Math.round((replied / sent) * 10000) / 10000 : 0,
      meetingRate: sent ? Math.round((meetings / sent) * 10000) / 10000 : 0,
    });
  }

  return Object.freeze({
    CONNECTORS,
    assess,
    conversionSnapshot,
  });
}));
