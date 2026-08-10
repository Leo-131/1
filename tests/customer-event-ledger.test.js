const test = require('node:test');
const assert = require('node:assert/strict');
const ledger = require('../outreach-dashboard/customer-event-ledger');

test('event ledger keeps only real customer event timestamps', () => {
  const events = ledger.build({
    records: [{
      company: 'REI Co-op',
      resultCheckedAt: '2026-07-20T09:13:19.494Z',
      discoveredAt: '2026-07-20T09:13:19.494Z',
      status: 'Accepted',
    }],
  });
  assert.equal(events.length, 0);
});

test('event ledger deduplicates equivalent confirmed sends and prefers result evidence', () => {
  const timestamp = '2026-07-20T03:35:13.708Z';
  const events = ledger.build({
    audit: [{
      taskId: 'google-customer-4camping-instagram',
      stage: 'sent_confirmed',
      timestamp,
      evidence: 'https://instagram.com/4camping',
    }],
    results: [{
      task_id: 'google-customer-4camping-instagram',
      status: 'sent_confirmed',
      timestamp,
      target_url: 'https://instagram.com/4camping',
      evidence: 'https://instagram.com/4camping',
    }],
  });
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'sent_confirmed');
  assert.equal(events[0].source, 'automation_result');
  assert.equal(Object.isFrozen(events[0]), true);
});

test('event ledger matches channel variants to the same customer timeline', () => {
  const events = ledger.build({
    results: [
      {
        task_id: 'google-customer-acme-facebook',
        status: 'sent_confirmed',
        timestamp: '2026-07-20T01:00:00.000Z',
      },
      {
        task_id: 'google-customer-acme-instagram',
        status: 'replied',
        timestamp: '2026-07-20T02:00:00.000Z',
      },
    ],
  });
  const latest = ledger.latest(events, { company: 'Acme' });
  assert.equal(latest.type, 'replied');
  assert.equal(ledger.forCustomer(events, { company: 'Acme' }).length, 2);
});

test('event ledger preserves closed-loop sales stages without inventing sends', () => {
  const events = ledger.build({
    records: [{
      company: 'Qualified Retailer',
      positiveReplyAt: '2026-07-20T03:00:00.000Z',
      qualifiedAt: '2026-07-20T04:00:00.000Z',
      meetingBookedAt: '2026-07-20T05:00:00.000Z',
      quotationSentAt: '2026-07-20T06:00:00.000Z',
    }],
  });
  assert.deepEqual(events.map(event => event.type), [
    'positive_reply',
    'qualified',
    'meeting_booked',
    'quotation_sent',
  ]);
  assert.equal(events.some(event => event.type === 'sent_confirmed'), false);
});

test('event ledger emits a separate reply event from auditable inbound evidence', () => {
  const events = ledger.build({
    results: [{
      task_id: 'google-customer-example-facebook',
      status: 'sent_confirmed',
      timestamp: '2026-07-20T05:42:00.000Z',
      target_url: 'https://www.facebook.com/example',
      evidence: 'message_sent_alert;recipient_auto_reply_received',
    }],
  });
  assert.equal(events.filter(event => event.type === 'sent_confirmed').length, 1);
  assert.equal(events.filter(event => event.type === 'replied').length, 1);
  assert.equal(events.find(event => event.type === 'replied').status, 'auto_replied');
});

test('reply evidence uses the independently observed reply time, not the original send time', () => {
  const events = ledger.build({
    results: [{
      task_id: 'google-customer-weyfarm-outdoors-website-contact',
      status: 'sent_confirmed',
      timestamp: '2026-08-10T11:12:59.414Z',
      replyAt: '2026-08-10T11:35:00.000Z',
      evidence: 'sent_folder_message_confirmed;recipient_replied;inbound_reply_received',
    }],
  });
  assert.equal(events.find(event => event.type === 'sent_confirmed').timestamp, '2026-08-10T11:12:59.414Z');
  assert.equal(events.find(event => event.type === 'replied').timestamp, '2026-08-10T11:35:00.000Z');
  assert.equal(events.find(event => event.type === 'replied').status, 'replied');
});
