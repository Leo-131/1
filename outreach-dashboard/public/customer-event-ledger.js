(function exposeCustomerEventLedger(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.CustomerEventLedger = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createCustomerEventLedger() {
  const buildIndexes = new WeakMap();
  const RECORD_EVENT_FIELDS = Object.freeze({
    sentAt: 'sent_confirmed',
    repliedAt: 'replied',
    bouncedAt: 'bounced',
    contactCapturedAt: 'contact_captured',
    buyerRoutedAt: 'buyer_routed',
    meetingBookedAt: 'meeting_booked',
    positiveReplyAt: 'positive_reply',
    qualifiedAt: 'qualified',
    opportunityAt: 'opportunity_created',
    sampleSentAt: 'sample_sent',
    quotationSentAt: 'quotation_sent',
    wonAt: 'won',
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
    positive_reply: 'positive_reply',
    qualified: 'qualified',
    opportunity_created: 'opportunity_created',
    sample_sent: 'sample_sent',
    quotation_sent: 'quotation_sent',
    won: 'won',
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
    return (Array.isArray(results) ? results : []).flatMap(item => {
      const status = String(item && item.status || '').toLowerCase();
      const type = STATUS_EVENT_TYPES[status];
      const events = [];
      if (type) events.push(makeEvent({
          customerKeys: customerKeys(item),
          type,
          channel: inferChannel(item),
          timestamp: item.timestamp,
          evidence: item.evidence || item.target_url || '',
          source: 'automation_result',
          taskId: item.task_id || '',
          status,
        }));
      const evidence = String(item && item.evidence || '');
      if (status === 'sent_confirmed'
        && /recipient_(?:auto_)?reply_received|recipient_replied|inbound_reply_(?:received|visible)|reply_bubble_visible/i.test(evidence)) {
        events.push(makeEvent({
          customerKeys: customerKeys(item),
          type: 'replied',
          channel: inferChannel(item),
          timestamp: item.replyAt || item.positiveReplyAt || item.timestamp,
          evidence,
          source: 'automation_reply_evidence',
          taskId: item.task_id || '',
          status: /recipient_auto_reply_received|automated_reply/i.test(evidence) ? 'auto_replied' : 'replied',
        }));
      }
      return events.filter(Boolean);
    });
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
    const events = Object.freeze([...byId.values()]
      .sort((left, right) => Date.parse(left.timestamp) - Date.parse(right.timestamp)));
    const byCustomerKey = new Map();
    events.forEach(event => event.customerKeys.forEach(key => {
      const bucket = byCustomerKey.get(key) || [];
      bucket.push(event);
      byCustomerKey.set(key, bucket);
    }));
    buildIndexes.set(events, byCustomerKey);
    return events;
  }
  function forCustomer(events, record, types) {
    const keys = new Set(customerKeys(record));
    const allowed = Array.isArray(types) && types.length ? new Set(types) : null;
    const index = buildIndexes.get(events);
    const candidates = index
      ? [...new Map([...keys].flatMap(key => index.get(key) || []).map(event => [event.id, event])).values()]
      : (Array.isArray(events) ? events : []).filter(event => event.customerKeys.some(key => keys.has(key)));
    return candidates
      .filter(event => !allowed || allowed.has(event.type));
  }
  function latest(events, record, types) {
    const index = buildIndexes.get(events);
    if (index) {
      const allowed = Array.isArray(types) && types.length ? new Set(types) : null;
      let newest = null;
      customerKeys(record).forEach(key => {
        const bucket = index.get(key) || [];
        for (let position = bucket.length - 1; position >= 0; position -= 1) {
          const event = bucket[position];
          if (allowed && !allowed.has(event.type)) continue;
          if (!newest || Date.parse(event.timestamp) > Date.parse(newest.timestamp)) newest = event;
          break;
        }
      });
      return newest;
    }
    const matches = forCustomer(events, record, types);
    let newest = null;
    for (const event of matches) {
      if (!newest || Date.parse(event.timestamp) > Date.parse(newest.timestamp)) newest = event;
    }
    return newest;
  }

  return Object.freeze({
    build,
    latest,
    forCustomer,
    validTimestamp,
    canonical,
  });
}));
