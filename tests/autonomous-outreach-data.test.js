const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'outreach-dashboard', 'autonomous-outreach-data.js'),
  'utf8',
);
const registrySource = fs.readFileSync(
  path.join(__dirname, '..', 'outreach-dashboard', 'verified-profile-registry.js'),
  'utf8',
);

function loadAutonomousData(context) {
  vm.runInNewContext(registrySource, context);
  vm.runInNewContext(source, context);
}

test('legacy task dates become reportable Shanghai timestamps', () => {
  const context = {
    DAILY_OUTREACH_TASKS: {
      generatedAt: '2026-06-09T14:31:50.488Z',
      tasks: [
        {
          name: 'Legacy Buyer',
          date: '2026-06-03',
          automationStatus: 'sent_confirmed',
        },
        {
          name: 'Generated Buyer',
          generatedAt: '2026-06-05T01:02:03.000Z',
        },
      ],
    },
    AUTONOMOUS_OUTREACH_RESULTS: [],
  };

  loadAutonomousData(context);

  assert.equal(context.AUTONOMOUS_OUTREACH_DATA.tasks[0].discoveredAt, '2026-06-03T09:00:00+08:00');
  assert.equal(context.AUTONOMOUS_OUTREACH_DATA.tasks[0].sentAt, '2026-06-03T09:00:00+08:00');
  assert.equal(context.AUTONOMOUS_OUTREACH_DATA.tasks[1].discoveredAt, '2026-06-05T01:02:03.000Z');
});

test('verified Instagram handles become exact profile URLs and prior contacts stay pending', () => {
  const context = {
    DAILY_OUTREACH_TASKS: {
      generatedAt: '2026-06-09T14:31:50.488Z',
      tasks: [{
        platform: 'Instagram',
        verifiedPlatform: 'instagram',
        name: 'anacondastores',
        originalStatus: 'Sent',
        lastKnownTouch: 'Sent partnership proposal',
      }],
    },
    AUTONOMOUS_OUTREACH_RESULTS: [],
  };
  loadAutonomousData(context);
  const task = context.AUTONOMOUS_OUTREACH_DATA.tasks[0];
  assert.equal(task.targetUrl, 'https://www.instagram.com/anacondastores/');
  assert.equal(task.identityStatus, 'verified');
  assert.equal(task.previouslyContacted, true);
  assert.equal(task.state, 'outcome_pending');
});

test('verified registry corrects handles and blocks identity mismatches', () => {
  const context = {
    DAILY_OUTREACH_TASKS: {
      tasks: [
        { platform: 'Instagram', name: 'triedandtrout', company: 'Tried & Trout' },
        { platform: 'Instagram', name: 'camp4wheels', company: 'Poland rooftop tent importer' },
      ],
    },
    AUTONOMOUS_OUTREACH_RESULTS: [],
  };

  loadAutonomousData(context);
  const [corrected, mismatch] = context.AUTONOMOUS_OUTREACH_DATA.tasks;

  assert.equal(corrected.accountHandle, 'triedandtroutsupply');
  assert.equal(corrected.targetUrl, 'https://www.instagram.com/triedandtroutsupply/');
  assert.equal(corrected.identityStatus, 'verified');
  assert.equal(mismatch.company, 'Camp4Wheels travel account');
  assert.equal(mismatch.identityStatus, 'identity_mismatch');
  assert.equal(mismatch.identityVerified, false);
});
