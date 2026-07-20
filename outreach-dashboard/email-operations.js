'use strict';

const DEFAULT_DOMAIN_DAILY_LIMIT = 3;

function normalizedEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}

function emailDomain(value) {
  const email = normalizedEmail(value);
  return email ? email.split('@')[1] : '';
}

function shanghaiDay(value = Date.now()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(value));
}

function recordRecipient(record = {}) {
  const direct = record.recipientEmail || record.publicEmail || record.contactEmail || record.email;
  if (normalizedEmail(direct)) return normalizedEmail(direct);
  const target = String(record.target_url || record.targetUrl || record.url || '');
  return /^mailto:/i.test(target) ? normalizedEmail(target.replace(/^mailto:/i, '').split('?')[0]) : '';
}

function isConfirmedEmailRecord(record = {}) {
  const status = String(record.status || record.sendStatus || '').toLowerCase();
  return ['sent_confirmed', 'submitted_confirmed'].includes(status) && Boolean(recordRecipient(record));
}

function emailDomainSafety(records = [], lead = {}, options = {}) {
  const recipient = normalizedEmail(lead.publicEmail || lead.contactEmail || lead.email);
  if (!recipient) return { ok: false, reason: 'verified_public_email_missing', recipient: '', domain: '' };
  const domain = emailDomain(recipient);
  const day = shanghaiDay(options.now || Date.now());
  const limit = Math.max(1, Number(options.limit || process.env.EMAIL_DOMAIN_DAILY_LIMIT || DEFAULT_DOMAIN_DAILY_LIMIT));
  const sentToday = (Array.isArray(records) ? records : []).filter(record => (
    isConfirmedEmailRecord(record)
    && emailDomain(recordRecipient(record)) === domain
    && shanghaiDay(record.timestamp || record.sentAt || record.completedAt) === day
  )).length;
  return {
    ok: sentToday < limit,
    reason: sentToday < limit ? 'email_domain_capacity_available' : 'email_domain_daily_limit_reached',
    recipient,
    domain,
    sentToday,
    limit,
    remaining: Math.max(0, limit - sentToday),
  };
}

function addBusinessDays(value, days) {
  const date = new Date(value);
  let remaining = Math.max(0, Number(days || 0));
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    const weekday = date.getUTCDay();
    if (weekday !== 0 && weekday !== 6) remaining -= 1;
  }
  return date;
}

function emailFollowupStatus(record = {}, now = Date.now()) {
  const sentAt = record.sentAt || record.timestamp || record.completedAt;
  if (!sentAt || !isConfirmedEmailRecord(record)) return { due: false, stage: 'not_sent', dueAt: '' };
  if (record.repliedAt) return { due: false, stage: 'replied', dueAt: '' };
  if (record.bouncedAt || String(record.status || record.sendStatus || '').toLowerCase() === 'bounced') {
    return { due: false, stage: 'bounced', dueAt: '' };
  }
  const followupCount = Math.max(0, Number(record.followupCount || 0));
  if (followupCount >= 2) return { due: false, stage: 'followup_complete', dueAt: '' };
  const dueDate = addBusinessDays(sentAt, followupCount === 0 ? 3 : 5);
  return {
    due: new Date(now).getTime() >= dueDate.getTime(),
    stage: followupCount === 0 ? 'followup_1' : 'followup_2',
    dueAt: dueDate.toISOString(),
  };
}

function summarizeEmailFunnel(records = []) {
  const rows = (Array.isArray(records) ? records : []).filter(record => recordRecipient(record));
  return rows.reduce((summary, record) => {
    const status = String(record.status || record.sendStatus || '').toLowerCase();
    if (['sent_confirmed', 'submitted_confirmed'].includes(status)) summary.sent += 1;
    if (status === 'bounced' || record.bouncedAt) summary.bounced += 1;
    if (record.repliedAt) summary.replied += 1;
    if (record.buyerRoutedAt || status === 'buyer_routed') summary.buyerRouted += 1;
    if (record.meetingBookedAt || status === 'meeting_booked') summary.meetings += 1;
    return summary;
  }, { sent: 0, bounced: 0, replied: 0, buyerRouted: 0, meetings: 0 });
}

module.exports = {
  DEFAULT_DOMAIN_DAILY_LIMIT,
  normalizedEmail,
  emailDomain,
  recordRecipient,
  emailDomainSafety,
  emailFollowupStatus,
  summarizeEmailFunnel,
};
