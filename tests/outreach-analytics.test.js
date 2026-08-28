const assert = require('node:assert/strict');
const test = require('node:test');

const {
  normalizeTrendRecord,
  buildKeywordMetrics,
  buildKeywordOpportunities,
  buildTemplateMetrics,
  getNaturalPeriod,
  buildPeriodReport,
} = require('../outreach-dashboard/outreach-analytics.js');

test('keyword opportunities prioritize transactional ICP phrases without inventing conversion data', () => {
  const result = buildKeywordOpportunities([
    {
      keyword: 'outdoor retail partnership',
      country: 'US',
      state: 'sent_confirmed',
      repliedAt: 'x',
    },
  ]);

  assert.ok(result.length >= 12);
  assert.equal(result[0].keyword, 'outdoor retail partnership');
  assert.equal(result[0].source, 'observed');
  assert.equal(result[0].sampleSize, 1);
  assert.ok(result.some(item => item.keyword === 'camping gear wholesale'));
  assert.ok(result.some(item => item.keyword === 'portable air pump distributor'));
  assert.ok(result.every(item => ['transactional', 'commercial'].includes(item.intent)));
  assert.ok(result.every(item => item.trendsUrl.includes('trends.google.com/trends/explore')));
});

test('keyword opportunities keep recommendations clearly separated from observed rates', () => {
  const result = buildKeywordOpportunities([]);
  const recommended = result.find(item => item.keyword === 'private label camping equipment');

  assert.equal(recommended.source, 'recommended');
  assert.equal(recommended.sampleSize, 0);
  assert.equal(recommended.replyRate, null);
  assert.ok(recommended.priorityScore > 0);
});

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
      discoveryToSendRate: 0.5,
      discoveryToReplyRate: 0.5,
      replyRate: 1,
      contactCaptureRate: 1,
      opportunityRate: 1,
      replyToContactRate: 1,
      replyToOpportunityRate: 1,
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

test('natural weekly periods use Monday through Sunday in Asia/Shanghai', () => {
  assert.deepEqual(getNaturalPeriod('weekly', '2026-06-11T12:00:00+08:00'), {
    type: 'weekly',
    key: '2026-06-08',
    label: '2026-06-08 - 2026-06-14',
    start: '2026-06-07T16:00:00.000Z',
    endExclusive: '2026-06-14T16:00:00.000Z',
    anchor: '2026-06-11',
  });
});

test('natural monthly periods use calendar month boundaries in Asia/Shanghai', () => {
  assert.deepEqual(getNaturalPeriod('monthly', '2026-06-11'), {
    type: 'monthly',
    key: '2026-06',
    label: '2026-06',
    start: '2026-05-31T16:00:00.000Z',
    endExclusive: '2026-06-30T16:00:00.000Z',
    anchor: '2026-06-11',
  });
});

test('period reports count events by their timestamps and only confirmed sends convert', () => {
  const report = buildPeriodReport([
    {
      platform: 'Facebook',
      country: 'US',
      keyword: 'camping buyer',
      templateId: 'buyer-v1',
      icpTier: 'T1',
      discoveredAt: '2026-06-08T00:00:00+08:00',
      profiledAt: '2026-06-08T01:00:00+08:00',
      approvedAt: '2026-06-09T01:00:00+08:00',
      state: 'sent_confirmed',
      sentAt: '2026-06-10T01:00:00+08:00',
      repliedAt: '2026-06-11T01:00:00+08:00',
      contactCapturedAt: '2026-06-11T02:00:00+08:00',
      opportunityAt: '2026-06-12T01:00:00+08:00',
    },
    {
      platform: 'Instagram',
      country: 'CA',
      keyword: 'camping buyer',
      templateId: 'buyer-v1',
      icpTier: 'T2',
      discoveredAt: '2026-06-08T00:00:00+08:00',
      state: 'send_unconfirmed',
      sentAt: '2026-06-10T01:00:00+08:00',
      repliedAt: '2026-06-11T01:00:00+08:00',
    },
    {
      platform: 'Facebook',
      country: 'US',
      state: 'auto_skipped',
      autoSkippedAt: '2026-06-13T01:00:00+08:00',
    },
  ], { type: 'weekly', anchor: '2026-06-11' });

  assert.deepEqual(report.metrics, {
    discovered: 2,
    profiled: 1,
    approved: 1,
    sent: 1,
    replied: 1,
    contactCaptured: 1,
    opportunity: 1,
    autoSkipped: 1,
  });
  assert.deepEqual(report.rates, {
    profileRate: 0.5,
    approvalRate: 1,
    sendRate: 1,
    discoveryToSendRate: 0.5,
    discoveryToReplyRate: 0.5,
    replyRate: 1,
    contactCaptureRate: 1,
    opportunityRate: 1,
    replyToContactRate: 1,
    replyToOpportunityRate: 1,
  });
  assert.equal(report.breakdowns.platform[0].label, 'facebook');
  assert.equal(report.breakdowns.platform[0].metrics.sent, 1);
  assert.equal(report.conversion.topReplySegments[0].label, 'buyer-v1');
  assert.equal(report.hasData, true);
});

test('period reports exclude invalid timestamps and expose data-quality counts', () => {
  const report = buildPeriodReport([
    {
      state: 'sent_confirmed',
      sentAt: 'not-a-date',
      repliedAt: '',
      discoveredAt: '2026-06-08T00:00:00+08:00',
    },
  ], { type: 'weekly', anchor: '2026-06-11' });

  assert.equal(report.metrics.discovered, 1);
  assert.equal(report.metrics.sent, 0);
  assert.equal(report.dataQuality.invalidTimestamps, 1);
  assert.ok(report.dataQuality.missingTimestamps >= 1);
});

test('empty period reports return stable zero metrics and breakdowns', () => {
  const report = buildPeriodReport([], { type: 'monthly', anchor: '2026-06-11' });

  assert.equal(report.hasData, false);
  assert.deepEqual(report.metrics, {
    discovered: 0,
    profiled: 0,
    approved: 0,
    sent: 0,
    replied: 0,
    contactCaptured: 0,
    opportunity: 0,
    autoSkipped: 0,
  });
  assert.deepEqual(report.breakdowns.platform, []);
});

test('period headline counts unique discovered customers and only explicit profile events', () => {
  const report = buildPeriodReport([
    { company: 'Example Outdoor', platform: 'instagram', discoveredAt: '2026-07-14T01:00:00+08:00' },
    { company: 'Example Outdoor', platform: 'email', discoveredAt: '2026-07-14T01:00:00+08:00' },
    { company: 'Profiled Retailer', discoveredAt: '2026-07-14T01:00:00+08:00', profiledAt: '2026-07-14T02:00:00+08:00' },
  ], { type: 'monthly', anchor: '2026-07-14' });
  assert.equal(report.metrics.discovered, 2);
  assert.equal(report.metrics.profiled, 1);
});

test('period funnel never fabricates explicit profile scoring from downstream evidence', () => {
  const report = buildPeriodReport([
    {
      company: 'Legacy Outdoor',
      discoveredAt: '2026-05-20T01:00:00+08:00',
      state: 'sent_confirmed',
      sentAt: '2026-06-04T01:00:00+08:00',
    },
    {
      company: 'June Retailer',
      discoveredAt: '2026-06-03T01:00:00+08:00',
      state: 'sent_confirmed',
      sentAt: '2026-06-05T01:00:00+08:00',
    },
    {
      company: 'Reply Buyer',
      state: 'sent_confirmed',
      repliedAt: '2026-06-06T01:00:00+08:00',
    },
  ], { type: 'monthly', anchor: '2026-06-14' });

  assert.deepEqual(report.metrics, {
    discovered: 3,
    profiled: 0,
    approved: 3,
    sent: 3,
    replied: 1,
    contactCaptured: 0,
    opportunity: 0,
    autoSkipped: 0,
  });
  assert.equal(report.rates.discoveryToSendRate, 1);
  assert.equal(report.eventRecords.filter(entry => entry.events.discovered).length, 3);
  assert.equal(report.consistency.funnelMonotonic, true);
  assert.deepEqual(report.consistency.violations, []);
  assert.equal(report.eventRecords[0].eventEvidence.discovered, 'inferred_from_sent');
  assert.equal(report.eventRecords.filter(entry => entry.events.profiled).length, 0);
  assert.ok(report.metrics.approved >= report.metrics.sent);
});

test('period reports calculate customer-deduplicated ICP average without treating missing scores as zero', () => {
  const report = buildPeriodReport([
    { company: 'A', discoveredAt: '2026-07-14T01:00:00+08:00', fitScore: 80 },
    { company: 'A', discoveredAt: '2026-07-14T02:00:00+08:00', fitScore: 84 },
    { company: 'B', discoveredAt: '2026-07-14T01:00:00+08:00', icpScore: 76 },
    { company: 'C', discoveredAt: '2026-07-14T01:00:00+08:00' },
    { company: 'Invalid', discoveredAt: '2026-07-14T01:00:00+08:00', fitScore: 120 },
  ], { type: 'monthly', anchor: '2026-07-14' });
  assert.deepEqual(report.icpScoring, {
    average: 80,
    scoredCustomers: 2,
    discoveredCustomers: 4,
    coverage: 0.5,
    minimum: 76,
    maximum: 84,
  });
});

test('period breakdowns deduplicate the same customer and metric within each segment', () => {
  const report = buildPeriodReport([
    { company: 'Same Buyer', platform: 'facebook', state: 'sent_confirmed', sentAt: '2026-06-04T01:00:00+08:00' },
    { company: 'Same Buyer', platform: 'facebook', state: 'sent_confirmed', sentAt: '2026-06-04T01:00:00+08:00' },
  ], { type: 'monthly', anchor: '2026-06-14' });
  assert.equal(report.metrics.sent, 1);
  assert.equal(report.breakdowns.platform[0].metrics.sent, 1);
});

test('period reports separate human, automated, and unclassified replies', () => {
  const report = buildPeriodReport([
    { company: 'Human', sendStatus: 'sent_confirmed', sentAt: '2026-07-01T01:00:00+08:00', repliedAt: '2026-07-02T01:00:00+08:00', replyType: 'human' },
    { company: 'Bot', sendStatus: 'sent_confirmed', sentAt: '2026-07-01T02:00:00+08:00', repliedAt: '2026-07-02T02:00:00+08:00', replyType: 'automated' },
    { company: 'Legacy', sendStatus: 'sent_confirmed', sentAt: '2026-07-01T03:00:00+08:00', repliedAt: '2026-07-02T03:00:00+08:00' },
  ], { type: 'monthly', anchor: '2026-07-15' });
  assert.deepEqual(report.replyDiagnostics, { human: 1, automated: 1, unclassified: 1 });
});
