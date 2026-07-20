'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  emailDomainSafety,
  emailFollowupStatus,
  summarizeEmailFunnel,
} = require('../outreach-dashboard/email-operations');

test('email domain safety caps confirmed sends per Shanghai day', () => {
  const records = [1, 2, 3].map(index => ({
    status: 'sent_confirmed',
    timestamp: `2026-07-20T0${index}:00:00.000Z`,
    target_url: `mailto:buyer${index}@example.com`,
  }));
  const result = emailDomainSafety(records, { publicEmail: 'vendor@example.com' }, {
    now: '2026-07-20T09:00:00.000Z',
    limit: 3,
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'email_domain_daily_limit_reached');
  assert.equal(result.remaining, 0);
});

test('email follow-up becomes due after three business days', () => {
  const result = emailFollowupStatus({
    status: 'sent_confirmed',
    timestamp: '2026-07-17T09:00:00.000Z',
    target_url: 'mailto:buyer@example.com',
  }, '2026-07-22T10:00:00.000Z');
  assert.equal(result.due, true);
  assert.equal(result.stage, 'followup_1');
});

test('email funnel separates delivery risk and downstream outcomes', () => {
  const result = summarizeEmailFunnel([
    { status: 'sent_confirmed', target_url: 'mailto:a@example.com', repliedAt: '2026-07-20T01:00:00Z', buyerRoutedAt: '2026-07-20T02:00:00Z' },
    { status: 'bounced', target_url: 'mailto:b@example.com', bouncedAt: '2026-07-20T03:00:00Z' },
    { status: 'meeting_booked', target_url: 'mailto:c@example.com', meetingBookedAt: '2026-07-21T03:00:00Z' },
  ]);
  assert.deepEqual(result, { sent: 1, bounced: 1, replied: 1, buyerRouted: 1, meetings: 1 });
});
