const assert = require('node:assert/strict');
const test = require('node:test');

const {
  normalizeTrendRecord,
  buildKeywordMetrics,
  buildTemplateMetrics,
} = require('../outreach-dashboard/outreach-analytics.js');

test('normalizes missing and legacy trend records without guessing', () => {
  assert.deepEqual(normalizeTrendRecord(null), {
    status: 'data_unavailable',
    region: '',
    period: '',
    collectedAt: '',
    index: null,
    direction: 'unknown',
  });

  assert.deepEqual(normalizeTrendRecord({
    region: 'DE',
    period: '2026-05',
    collectedAt: '',
    index: 73,
    direction: 'rising',
  }), {
    status: 'data_unavailable',
    region: 'DE',
    period: '2026-05',
    collectedAt: '',
    index: null,
    direction: 'unknown',
  });
});

test('normalizes valid timestamped trend values and clamps their index', () => {
  assert.deepEqual(normalizeTrendRecord({
    status: 'available',
    region: 'DE',
    period: '2026-05',
    collectedAt: '2026-06-01T00:00:00Z',
    index: 140,
    direction: 'rising',
  }), {
    status: 'available',
    region: 'DE',
    period: '2026-05',
    collectedAt: '2026-06-01T00:00:00Z',
    index: 100,
    direction: 'rising',
  });
});

test('null and empty trend indexes remain unavailable', () => {
  for (const index of [null, '']) {
    assert.deepEqual(normalizeTrendRecord({
      status: 'available',
      region: 'DE',
      period: '2026-05',
      collectedAt: '2026-06-01T00:00:00Z',
      index,
      direction: 'stable',
    }), {
      status: 'data_unavailable',
      region: 'DE',
      period: '2026-05',
      collectedAt: '2026-06-01T00:00:00Z',
      index: null,
      direction: 'unknown',
    });
  }
});

test('keyword metrics include sample sizes, funnel counts, and rates', () => {
  const result = buildKeywordMetrics([
    {
      keyword: ' Ultralight Camping Gear ',
      discoveredAt: 'x',
      profiledAt: 'x',
      approvedAt: 'x',
      state: 'sent_confirmed',
      repliedAt: 'x',
      contactCapturedAt: 'x',
      opportunityAt: 'x',
    },
    {
      keyword: 'ultralight camping gear',
      discoveredAt: 'x',
      profiledAt: 'x',
      approvedAt: 'x',
      state: 'send_unconfirmed',
      repliedAt: 'x',
    },
  ]);

  assert.deepEqual(result, [{
    keyword: 'ultralight camping gear',
    sampleSize: 2,
    funnel: {
      discovered: 2,
      profiled: 2,
      approved: 2,
      sent: 1,
      replied: 1,
      contactCaptured: 1,
      opportunity: 1,
    },
    rates: {
      profileRate: 1,
      approvalRate: 1,
      sendRate: 0.5,
      replyRate: 1,
      contactCaptureRate: 1,
      opportunityRate: 1,
    },
  }]);
});

test('only sent_confirmed records count as sent or downstream conversions', () => {
  const result = buildKeywordMetrics([
    {
      keyword: 'rv distributor',
      state: 'send_unconfirmed',
      sentAt: 'legacy-would-have-counted',
      repliedAt: 'x',
      contactCapturedAt: 'x',
      opportunityAt: 'x',
    },
  ]);

  assert.deepEqual(result[0].funnel, {
    discovered: 0,
    profiled: 0,
    approved: 0,
    sent: 0,
    replied: 0,
    contactCaptured: 0,
    opportunity: 0,
  });
  assert.equal(result[0].rates.replyRate, 0);
});

test('legacy keyword records do not invent discovered events', () => {
  const result = buildKeywordMetrics([
    { keyword: 'legacy', profiledAt: 'x' },
  ]);

  assert.equal(result[0].sampleSize, 1);
  assert.equal(result[0].funnel.discovered, 0);
  assert.equal(result[0].funnel.profiled, 1);
  assert.equal(result[0].rates.profileRate, 0);
});

test('template metrics group legacy records safely and count confirmed sends', () => {
  const result = buildTemplateMetrics([
    {
      templateId: 'margin-v1',
      state: 'sent_confirmed',
      repliedAt: 'x',
      contactCapturedAt: 'x',
    },
    {
      templateId: 'margin-v1',
      sendStatus: 'send_unconfirmed',
      repliedAt: 'x',
    },
    {},
  ]);

  assert.deepEqual(result, [
    {
      templateId: 'margin-v1',
      sampleSize: 2,
      confirmedSends: 1,
      replies: 1,
      contactsCaptured: 1,
      opportunities: 0,
      replyRate: 1,
      contactCaptureRate: 1,
      opportunityRate: 0,
    },
    {
      templateId: 'unknown',
      sampleSize: 1,
      confirmedSends: 0,
      replies: 0,
      contactsCaptured: 0,
      opportunities: 0,
      replyRate: 0,
      contactCaptureRate: 0,
      opportunityRate: 0,
    },
  ]);
});

test('analytics functions accept non-array legacy inputs', () => {
  assert.deepEqual(buildKeywordMetrics(null), []);
  assert.deepEqual(buildTemplateMetrics({}), []);
});
