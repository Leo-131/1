const assert = require('node:assert/strict');
const test = require('node:test');
const readiness = require('../outreach-dashboard/system-readiness');

test('readiness reports only missing configuration names and never secret values', () => {
  const result = readiness.assess({
    HUBSPOT_ACCESS_TOKEN: 'top-secret-value',
    OUTREACH_EMAIL_FROM: 'Leo@flextailgear.com',
    ALIBABA_SMTP_USER: 'Leo@flextailgear.com',
    ALIBABA_SMTP_SECURITY_PASSWORD: 'another-secret',
  });
  assert.equal(result.connectors.find(item => item.id === 'crm').ready, true);
  assert.equal(result.connectors.find(item => item.id === 'alibaba_mail').ready, true);
  assert.equal(JSON.stringify(result).includes('top-secret-value'), false);
  assert.equal(JSON.stringify(result).includes('another-secret'), false);
});

test('readiness requires a complete provider option instead of mixing credentials', () => {
  const result = readiness.assess({
    SALESFORCE_CLIENT_ID: 'id',
    HUBSPOT_ACCESS_TOKEN: '',
    CLAY_API_KEY: 'clay',
  });
  assert.equal(result.connectors.find(item => item.id === 'crm').ready, false);
  assert.equal(result.connectors.find(item => item.id === 'enrichment').ready, true);
  assert.deepEqual(result.connectors.find(item => item.id === 'crm').missing, ['HUBSPOT_ACCESS_TOKEN']);
});

test('external connectors are advisory rather than hard production gates', () => {
  const result = readiness.assess({
    HUBSPOT_ACCESS_TOKEN: 'crm',
    APOLLO_API_KEY: 'enrichment',
    OUTREACH_EMAIL_FROM: 'Leo@flextailgear.com',
    ALIBABA_SMTP_USER: 'Leo@flextailgear.com',
    ALIBABA_SMTP_SECURITY_PASSWORD: 'mail-password',
  });
  assert.equal(result.connectors.find(item => item.id === 'email_verification').ready, false);
  assert.equal(result.productionReady, true);
  assert.equal(result.coreReady, true);
  assert.equal(result.coreReadyCount, 4);
  assert.equal(result.coreTotalCount, 4);
  assert.deepEqual(result.requiredConnectorIds, []);
  assert.deepEqual(result.advisoryConnectorIds, [
    'crm',
    'enrichment',
    'email_verification',
    'alibaba_mail',
    'approval_alerts',
    'meeting_routing',
  ]);
});

test('missing optional connector credentials do not report the core sales system as blocked', () => {
  const result = readiness.assess({});
  assert.equal(result.readyCount, 0);
  assert.equal(result.connectorCoverageScore, 0);
  assert.equal(result.coreScore, 100);
  assert.equal(result.productionReady, true);
  assert.ok(result.connectors.every(item => item.status === 'not_configured'));
});

test('fresh connected-session proofs enable only explicitly supported connectors', () => {
  const now = new Date('2026-07-27T05:20:00.000Z');
  const result = readiness.assess({}, {
    alibaba_mail: {
      status: 'verified',
      mode: 'codex_chrome_extension_session',
      verifiedAt: '2026-07-27T05:15:00.000Z',
      expiresAt: '2026-07-28T05:15:00.000Z',
    },
    meeting_routing: {
      status: 'verified',
      mode: 'connected_google_calendar',
      verifiedAt: '2026-07-27T05:18:00.000Z',
      expiresAt: '2026-07-28T05:18:00.000Z',
    },
    crm: {
      status: 'verified',
      mode: 'unapproved_local_claim',
      verifiedAt: '2026-07-27T05:18:00.000Z',
      expiresAt: '2026-07-28T05:18:00.000Z',
    },
  }, { now });
  assert.equal(result.readyCount, 2);
  assert.equal(result.connectors.find(item => item.id === 'alibaba_mail').status, 'ready_connected_session');
  assert.equal(result.connectors.find(item => item.id === 'meeting_routing').providerSource, 'connected_google_calendar');
  assert.equal(result.connectors.find(item => item.id === 'crm').ready, false);
});

test('expired connected-session proofs fail closed', () => {
  const result = readiness.assess({}, {
    alibaba_mail: {
      status: 'verified',
      mode: 'codex_chrome_extension_session',
      verifiedAt: '2026-07-26T05:15:00.000Z',
      expiresAt: '2026-07-27T05:15:00.000Z',
    },
  }, { now: new Date('2026-07-27T05:20:00.000Z') });
  assert.equal(result.connectors.find(item => item.id === 'alibaba_mail').ready, false);
});

test('conversion snapshot uses unique companies and confirmed customer events', () => {
  const events = [
    { customerKey: 'acme', type: 'sent_confirmed' },
    { customerKey: 'acme', type: 'sent_confirmed' },
    { customerKey: 'acme', type: 'replied' },
    { customerKey: 'acme', type: 'meeting_booked' },
    { customerKey: 'beta', type: 'sent_confirmed' },
  ];
  assert.deepEqual(readiness.conversionSnapshot(events), {
    sent: 2,
    replied: 1,
    qualified: 0,
    meetings: 1,
    opportunities: 0,
    qualifiedMeetingsPer100: 50,
    replyRate: 0.5,
    meetingRate: 0.5,
  });
});
