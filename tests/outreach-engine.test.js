const assert = require('node:assert/strict');
const test = require('node:test');

const {
  STATES,
  calculateDevelopmentScore,
  evaluateApproval,
  nextRecoveryDecision,
  transitionTask,
} = require('../outreach-dashboard/outreach-engine.js');

test('exports the complete outreach state vocabulary', () => {
  assert.deepEqual(Object.values(STATES), [
    'profile_scored',
    'target_verified',
    'post_liked',
    'account_followed',
    'approval_pending',
    'approved',
    'sent_confirmed',
    'outcome_pending',
    'rerouted',
    'scheduled',
    'auto_skipped',
    'send_unconfirmed',
  ]);
});

test('scores a European open-market buyer with capped components', () => {
  const result = calculateDevelopmentScore({
    region: 'Europe',
    marketStatus: 'open',
    role: 'Senior Buyer Outdoor',
    industry: 'Outdoor retail',
    identityConfidence: 100,
    keywordIntent: 80,
    trend: {
      status: 'available',
      region: 'DE',
      period: '2026-05',
      collectedAt: '2026-06-01T00:00:00Z',
      index: 70,
      direction: 'rising',
    },
    history: { replied: true, templateRate: 0.12 },
  });

  assert.equal(result.total, 94);
  assert.deepEqual(result.components, {
    market: 25,
    icp: 25,
    identity: 15,
    intent: 12,
    trend: 8,
    history: 9,
  });
});

test('component scores cannot exceed 25/25/15/15/10/10', () => {
  const result = calculateDevelopmentScore({
    region: 'Europe',
    marketStatus: 'open',
    role: 'Global Head Buyer Distributor Partnership Category Outdoor',
    industry: 'Outdoor retailer distributor',
    identityConfidence: 500,
    keywordIntent: 500,
    trend: {
      status: 'available',
      region: 'EU',
      period: '2026',
      collectedAt: '2026-06-01T00:00:00Z',
      index: 500,
      direction: 'rising',
    },
    history: { replied: true, templateRate: 20 },
  });

  assert.deepEqual(result.components, {
    market: 25,
    icp: 25,
    identity: 15,
    intent: 15,
    trend: 10,
    history: 10,
  });
  assert.equal(result.total, 100);
});

test('missing trend receives zero points and preserves data_unavailable', () => {
  const result = calculateDevelopmentScore({
    region: 'Europe',
    marketStatus: 'open',
    trend: { status: 'data_unavailable', region: 'FR' },
  });

  assert.equal(result.components.trend, 0);
  assert.equal(result.trend.status, 'data_unavailable');
  assert.equal(result.trend.index, null);
  assert.equal(result.trend.region, 'FR');
});

test('null and empty trend indexes never become available zero values', () => {
  for (const index of [null, '']) {
    const result = calculateDevelopmentScore({
      trend: {
        status: 'available',
        region: 'DE',
        period: '2026-05',
        collectedAt: '2026-06-01T00:00:00Z',
        index,
        direction: 'stable',
      },
    });

    assert.equal(result.components.trend, 0);
    assert.equal(result.trend.status, 'data_unavailable');
    assert.equal(result.trend.index, null);
  }
});

test('open European countries receive the full market component', () => {
  for (const region of ['Germany', 'Estonia', 'Iceland', 'DEU', 'EST', 'ISL']) {
    const result = calculateDevelopmentScore({
      region,
      marketStatus: 'open',
    });
    assert.equal(result.components.market, 25, region);
  }
});

test('legacy scoring input has conservative safe defaults', () => {
  assert.deepEqual(calculateDevelopmentScore(), {
    total: 0,
    components: {
      market: 0,
      icp: 0,
      identity: 0,
      intent: 0,
      trend: 0,
      history: 0,
    },
    trend: {
      status: 'data_unavailable',
      region: '',
      period: '',
      collectedAt: '',
      index: null,
      direction: 'unknown',
    },
  });
});

test('hard approval conflicts auto-skip with explicit reasons', () => {
  const cases = [
    [{ exactTargetVerified: false }, 'exact_target_unverified'],
    [{ exactTargetVerified: true, targetUrl: '' }, 'prohibited_url'],
    [{ exactTargetVerified: true, targetUrl: 'https://instagram.com/explore/search/keyword/' }, 'prohibited_url'],
    [{ exactTargetVerified: true, targetUrl: 'https://facebook.com/profile.php?id=123' }, 'prohibited_url'],
    [{ exactTargetVerified: true, targetUrl: 'https://facebook.com/reel/123' }, 'prohibited_url'],
    [{ exactTargetVerified: true, targetUrl: 'https://facebook.com/watch/?v=123' }, 'prohibited_url'],
    [{ exactTargetVerified: true, targetUrl: 'https://facebook.com/search/top?q=camping' }, 'prohibited_url'],
    [{ exactTargetVerified: true, duplicateCampaign: true }, 'duplicate_campaign'],
    [{ exactTargetVerified: true, cooldownActive: true }, 'cooldown_active'],
    [{ exactTargetVerified: true, marketStatus: 'exclusive_distributor' }, 'exclusive_distributor'],
  ];

  for (const [prospect, reason] of cases) {
    const decision = evaluateApproval({
      prospect,
      score: { total: 100 },
      message: { text: 'Matched factual message', factual: true, matched: true },
    });
    assert.equal(decision.approved, false);
    assert.equal(decision.terminalAction, 'auto_skipped');
    assert.ok(decision.reasons.includes(reason));
  }
});

test('message mismatch and low score remain recoverable approval failures', () => {
  const decision = evaluateApproval({
    prospect: {
      exactTargetVerified: true,
      targetUrl: 'https://instagram.com/example-company/',
    },
    score: { total: 59 },
    message: { text: 'Draft', factual: false, matched: false },
    minScore: 60,
  });

  assert.equal(decision.approved, false);
  assert.equal(decision.terminalAction, null);
  assert.deepEqual(decision.reasons, [
    'message_not_factual',
    'message_not_matched',
    'score_below_minimum',
  ]);
});

test('valid approval passes all gates at the minimum score boundary', () => {
  const decision = evaluateApproval({
    prospect: {
      exactTargetVerified: true,
      targetUrl: 'https://instagram.com/example-company/',
      marketStatus: 'open',
    },
    score: { total: 60 },
    message: { text: 'Matched factual message', factual: true, matched: true },
    minScore: 60,
  });

  assert.deepEqual(decision, {
    approved: true,
    terminalAction: null,
    reasons: [],
  });
});

test('invalid minimum scores default to 60 without implicit conversion', () => {
  const invalidMinimumScores = [
    null,
    '',
    '60',
    false,
    true,
    [],
    {},
    -1,
    101,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ];

  for (const minScore of invalidMinimumScores) {
    const decision = evaluateApproval({
      prospect: {
        exactTargetVerified: true,
        targetUrl: 'https://instagram.com/example-company/',
      },
      score: { total: 59 },
      message: { text: 'Matched factual message', factual: true, matched: true },
      minScore,
    });

    assert.equal(decision.approved, false, String(minScore));
    assert.ok(decision.reasons.includes('score_below_minimum'), String(minScore));
  }
});

test('invalid total scores fail closed without implicit conversion', () => {
  const invalidTotals = [
    null,
    '',
    '60',
    false,
    true,
    [],
    {},
    -1,
    101,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ];

  for (const total of invalidTotals) {
    const decision = evaluateApproval({
      prospect: {
        exactTargetVerified: true,
        targetUrl: 'https://instagram.com/example-company/',
      },
      score: { total },
      message: { text: 'Matched factual message', factual: true, matched: true },
      minScore: 0,
    });

    assert.equal(decision.approved, false, String(total));
    assert.ok(decision.reasons.includes('score_below_minimum'), String(total));
  }
});

test('numeric approval score boundaries remain valid', () => {
  for (const [total, minScore, approved] of [
    [0, 0, true],
    [59, 60, false],
    [60, 60, true],
    [100, 100, true],
  ]) {
    const decision = evaluateApproval({
      prospect: {
        exactTargetVerified: true,
        targetUrl: 'https://instagram.com/example-company/',
      },
      score: { total },
      message: { text: 'Matched factual message', factual: true, matched: true },
      minScore,
    });

    assert.equal(decision.approved, approved, `${total}/${minScore}`);
  }
});

test('legacy approval data fails closed without throwing', () => {
  const decision = evaluateApproval({});
  assert.equal(decision.approved, false);
  assert.equal(decision.terminalAction, 'auto_skipped');
  assert.ok(decision.reasons.includes('exact_target_unverified'));
});

test('recovery uses enrich then rewrite before choosing a terminal route', () => {
  assert.deepEqual(nextRecoveryDecision({ attempts: 0 }), {
    action: 'enrich_profile',
    attempts: 1,
  });
  assert.deepEqual(nextRecoveryDecision({ attempts: 1 }), {
    action: 'rewrite_message',
    attempts: 2,
  });
  assert.deepEqual(nextRecoveryDecision({
    attempts: 2,
    verifiedAlternateChannel: true,
  }), {
    action: 'reroute',
    attempts: 2,
  });
  assert.deepEqual(nextRecoveryDecision({
    attempts: 2,
    retryDate: '2026-06-20',
  }), {
    action: 'scheduled',
    attempts: 2,
    retryDate: '2026-06-20',
  });
  assert.deepEqual(nextRecoveryDecision({ attempts: 2 }), {
    action: 'auto_skipped',
    attempts: 2,
  });
});

test('transitionTask advances valid states without mutating the source task', () => {
  const task = { id: 'task-1', state: STATES.PROFILE_SCORED, version: 3 };
  const updated = transitionTask(task, {
    state: STATES.TARGET_VERIFIED,
    expectedVersion: 3,
    evidence: { profile: 'https://instagram.com/example-company/' },
  });

  assert.deepEqual(updated, {
    id: 'task-1',
    state: STATES.TARGET_VERIFIED,
    version: 4,
    evidence: { profile: 'https://instagram.com/example-company/' },
  });
  assert.deepEqual(task, {
    id: 'task-1',
    state: STATES.PROFILE_SCORED,
    version: 3,
  });
});

test('transitionTask rejects stale, invalid, and unknown state writes', () => {
  assert.throws(() => transitionTask(
    { state: STATES.PROFILE_SCORED, version: 2 },
    { state: STATES.TARGET_VERIFIED, expectedVersion: 1 },
  ), /stale/i);

  assert.throws(() => transitionTask(
    { state: STATES.PROFILE_SCORED, version: 2 },
    { state: STATES.SENT_CONFIRMED, expectedVersion: 2 },
  ), /invalid transition/i);

  assert.throws(() => transitionTask(
    { state: STATES.PROFILE_SCORED, version: 2 },
    { state: 'invented_state', expectedVersion: 2 },
  ), /unknown state/i);
});
