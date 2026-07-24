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
