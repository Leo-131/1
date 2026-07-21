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
      providers: ['HubSpot', 'Salesforce'],
      any: [['HUBSPOT_ACCESS_TOKEN'], ['SALESFORCE_CLIENT_ID', 'SALESFORCE_CLIENT_SECRET']],
      impact: '统一企业、联系人、触达、回复与商机，作为去重事实源',
      priority: 100,
    },
    {
      id: 'enrichment',
      label: '联系人与企业补全',
      capability: 'LEAD_ENRICHMENT',
      providers: ['Apollo', 'Clay'],
      any: [['APOLLO_API_KEY'], ['CLAY_API_KEY']],
      impact: '补全采购负责人、职位和已验证业务联系方式',
      priority: 98,
    },
    {
      id: 'email_verification',
      label: '邮箱验证',
      capability: 'EMAIL_VERIFICATION',
      providers: ['Hunter', 'ZeroBounce', 'NeverBounce'],
      any: [['HUNTER_API_KEY'], ['ZEROBOUNCE_API_KEY'], ['NEVERBOUNCE_API_KEY']],
      impact: '在发送前拦截无效地址，降低退信和域名风险',
      priority: 96,
    },
    {
      id: 'alibaba_mail',
      label: '阿里企业邮箱闭环',
      capability: 'ALIBABA_MAIL',
      providers: ['Alibaba Mail'],
      all: ['OUTREACH_EMAIL_FROM', 'ALIBABA_SMTP_USER', 'ALIBABA_SMTP_SECURITY_PASSWORD'],
      impact: '发送、已发送文件夹确认、退信和回复回收',
      priority: 95,
    },
    {
      id: 'approval_alerts',
      label: '异常审批通知',
      capability: 'APPROVAL_ALERTS',
      providers: ['Slack', 'Teams'],
      any: [['SLACK_BOT_TOKEN', 'SLACK_ALERT_CHANNEL'], ['TEAMS_WEBHOOK_URL']],
      impact: '验证码、身份冲突和积极回复及时转人工',
      priority: 78,
    },
    {
      id: 'meeting_routing',
      label: '会议预约与路由',
      capability: 'MEETING_ROUTING',
      providers: ['Google Calendar', 'Calendly'],
      any: [['GOOGLE_CALENDAR_ID'], ['CALENDLY_ACCESS_TOKEN']],
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

  function assessConnector(definition, env) {
    const allReady = !definition.all || groupReady(env, definition.all);
    const anyReady = !definition.any || definition.any.some(group => groupReady(env, group));
    const ready = allReady && anyReady;
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
      providers: definition.providers,
      ready,
      status: ready ? 'ready' : 'configuration_required',
      missing,
      impact: definition.impact,
      priority: definition.priority,
    });
  }

  function assess(env = {}) {
    const connectors = CONNECTORS
      .map(definition => assessConnector(definition, env))
      .sort((left, right) => right.priority - left.priority);
    const readyCount = connectors.filter(item => item.ready).length;
    return Object.freeze({
      generatedAt: new Date().toISOString(),
      security: 'configuration_presence_only_no_secret_values',
      readyCount,
      totalCount: connectors.length,
      score: Math.round((readyCount / connectors.length) * 100),
      productionReady: connectors
        .filter(item => ['crm', 'enrichment', 'alibaba_mail'].includes(item.id))
        .every(item => item.ready),
      advisoryConnectorIds: Object.freeze(['email_verification']),
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
