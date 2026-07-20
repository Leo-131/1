(function exposeCustomerEventLedger(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.CustomerEventLedger = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createCustomerEventLedger() {
  const RECORD_EVENT_FIELDS = Object.freeze({
    sentAt: 'sent_confirmed',
    repliedAt: 'replied',
    bouncedAt: 'bounced',
    contactCapturedAt: 'contact_captured',
    buyerRoutedAt: 'buyer_routed',
    meetingBookedAt: 'meeting_booked',
    followUpAt: 'follow_up_due',
    sentTime: 'sent_confirmed',
  });
  const STATUS_EVENT_TYPES = Object.freeze({
    sent_confirmed: 'sent_confirmed',
    submitted_confirmed: 'sent_confirmed',
    replied: 'replied',
    bounced: 'bounced',
    buyer_routed: 'buyer_routed',
    meeting_booked: 'meeting_booked',
  });

  function validTimestamp(value) {
    return typeof value === 'string' && value && Number.isFinite(Date.parse(value)) ? value : '';
  }
  function canonical(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/^google-customer-/i, '')
      .replace(/^verified-[a-z]+-/i, '')
      .replace(/-(instagram|facebook|website-contact)$/i, '')
      .replace(/^@/, '')
      .replace(/[^a-z0-9.]+/g, '');
  }
  function inferChannel(item) {
    const text = [
      item && (item.channel || item.platform),
      item && (item.target_url || item.targetUrl || item.url),
      item && (item.task_id || item.taskId),
      item && item.evidence,
    ].join(' ').toLowerCase();
    if (/linkedin/.test(text)) return 'linkedin';
    if (/facebook|messenger|fb\.com/.test(text)) return 'facebook';
    if (/instagram/.test(text)) return 'instagram';
    if (/mailto|email|website-contact|contact_form|official_website/.test(text)) return 'email';
    return 'unknown';
  }
  function customerKeys(item) {
    return [
      item && (item.task_id || item.taskId || item.automationTaskId || item.id),
      item && item.company,
      item && item.name,
      item && item.sourceCompany,
    ].map(canonical).filter(Boolean);
  }
  function makeEvent(input) {
    const timestamp = validTimestamp(input.timestamp);
    const type = String(input.type || '').trim();
    const keys = [...new Set((input.customerKeys || []).map(canonical).filter(Boolean))];
    if (!timestamp || !type || !keys.length) return null;
    const channel = input.channel || 'unknown';
    const source = input.source || 'unknown';
    const evidence = String(input.evidence || '');
    const id = [keys[0], type, channel, timestamp, canonical(evidence)].join('|');
    return Object.freeze({
      id,
      customerKey: keys[0],
      customerKeys: Object.freeze(keys),
      type,
      channel,
      timestamp,
      evidence,
      source,
      taskId: input.taskId || '',
      status: input.status || type,
    });
  }
  function eventsFromResults(results) {
    return (Array.isArray(results) ? results : []).map(item => {
      const status = String(item && item.status || '').toLowerCase();
      const type = STATUS_EVENT_TYPES[status];
      if (!type) return null;
      return makeEvent({
        customerKeys: customerKeys(item),
        type,
        channel: inferChannel(item),
        timestamp: item.timestamp,
        evidence: item.evidence || item.target_url || '',
        source: 'automation_result',
        taskId: item.task_id || '',
        status,
      });
    }).filter(Boolean);
  }
  function eventsFromAudit(audit) {
    return (Array.isArray(audit) ? audit : []).map(item => {
      const status = String(item && (item.result || item.stage) || '').toLowerCase();
      const type = STATUS_EVENT_TYPES[status];
      if (!type) return null;
      return makeEvent({
        customerKeys: customerKeys(item),
        type,
        channel: inferChannel(item),
        timestamp: item.timestamp,
        evidence: item.evidence || '',
        source: 'automation_audit',
        taskId: item.taskId || '',
        status,
      });
    }).filter(Boolean);
  }
  function eventsFromRecords(records) {
    const events = [];
    (Array.isArray(records) ? records : []).forEach(record => {
      Object.entries(RECORD_EVENT_FIELDS).forEach(([field, type]) => {
        const timestamp = validTimestamp(record && record[field]);
        if (!timestamp) return;
        events.push(makeEvent({
          customerKeys: customerKeys(record),
          type,
          channel: inferChannel(record),
          timestamp,
          evidence: record.evidence || record.automationEvidence || field,
          source: 'customer_record',
          taskId: record.taskId || record.automationTaskId || '',
          status: record.sendStatus || record.status || type,
        }));
      });
    });
    return events.filter(Boolean);
  }
  function build({ results = [], audit = [], records = [] } = {}) {
    const byId = new Map();
    [...eventsFromRecords(records), ...eventsFromAudit(audit), ...eventsFromResults(results)]
      .forEach(event => {
        const existing = byId.get(event.id);
        if (!existing || event.source === 'automation_result') byId.set(event.id, event);
      });
    return Object.freeze([...byId.values()]
      .sort((left, right) => Date.parse(left.timestamp) - Date.parse(right.timestamp)));
  }
  function forCustomer(events, record, types) {
    const keys = new Set(customerKeys(record));
    const allowed = Array.isArray(types) && types.length ? new Set(types) : null;
    return (Array.isArray(events) ? events : [])
      .filter(event => event.customerKeys.some(key => keys.has(key)))
      .filter(event => !allowed || allowed.has(event.type));
  }
  function latest(events, record, types) {
    return forCustomer(events, record, types)
      .sort((left, right) => Date.parse(right.timestamp) - Date.parse(left.timestamp))[0] || null;
  }

  return Object.freeze({
    build,
    latest,
    forCustomer,
    validTimestamp,
    canonical,
  });
}));
