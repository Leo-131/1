const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const intelligence = require('../outreach-dashboard/outreach-intelligence');

test('company truth suppresses only confirmed or evidence-chained irreversible customer interaction', () => {
  const companies = intelligence.buildCompanyTruth({ leads: [{ company: 'Acme Outdoor', website: 'https://acme.example', platform: 'facebook' }], results: [{ company: 'Acme Outdoor', status: 'send_unconfirmed', evidence: 'send_clicked_but_confirmation_missing;verified_draft_present_before_irreversible_action', timestamp: '2026-08-04T01:00:00Z' }] });
  assert.equal(companies.length, 1);
  const ledger = intelligence.buildSuppressionLedger(companies);
  assert.equal(ledger.length, 1);
  assert.equal(ledger[0].permanent, true);
  assert.equal(ledger[0].crossChannel, true);
});

test('bare click markers, preserved drafts, and technical failures never suppress a whole company', () => {
  const companies = intelligence.buildCompanyTruth({
    leads: [{ company: 'Retry Outdoor', website: 'https://retry.example', platform: 'facebook' }],
    results: [
      { company: 'Retry Outdoor', status: 'send_unconfirmed', evidence: 'facebook_send_clicked_but_confirmation_missing' },
      { company: 'Retry Outdoor', status: 'failed_open', evidence: 'composer_preserved_for_technical_evidence:true;alibaba_webmail_content_inserted' },
      { company: 'Retry Outdoor', status: 'failed_open', evidence: 'chrome_target_not_found' },
    ],
  });
  assert.equal(intelligence.buildSuppressionLedger(companies).length, 0);
});

test('owner-confirmed prior customer development permanently suppresses the company without requiring legacy click-chain evidence', () => {
  const companies = intelligence.buildCompanyTruth({
    leads: [{ company: 'CMS Distribution', website: 'https://cmsdistribution.com' }],
    results: [{
      company: 'CMS Distribution',
      status: 'send_unconfirmed',
      evidence: 'owner_confirmed_prior_customer_development;historical_contact_no_repeat',
      timestamp: '2026-07-14T08:07:55.732Z',
    }],
  });
  const ledger = intelligence.buildSuppressionLedger(companies);
  assert.equal(ledger.length, 1);
  assert.equal(ledger[0].permanent, true);
  assert.equal(ledger[0].crossChannel, true);
});

test('evidence scoring rejects guesses and accepts first-party cross verified routes', () => {
  assert.equal(intelligence.evidenceScore({ platform: 'facebook', url: 'https://facebook.com/acme' }).score, 0);
  assert.equal(intelligence.evidenceScore({ platform: 'facebook', website: 'https://acme.example', officialSocialProfileVerified: true, socialProfileEvidenceUrl: 'https://acme.example' }).score, 95);
  assert.equal(intelligence.evidenceScore({ platform: 'website_form', website: 'https://acme.example', evidenceUrl: 'https://google.com/search?q=acme', externalVerificationStatus: 'official_supplier_form_verified' }).score, 0);
});

test('portfolio selects one verified action per unsuppressed company and respects quota', () => {
  const companies = [{ companyId: 'a', company: 'A', evidence: [{ channel: 'email', verified: true, score: 100, evidenceUrl: 'https://a.example' }], history: [] }, { companyId: 'b', company: 'B', evidence: [{ channel: 'email', verified: true, score: 100, evidenceUrl: 'https://b.example' }], history: [] }];
  const plan = intelligence.planPortfolio(companies, [], { channelQuota: { email: 1, website_form: 0, linkedin: 0, facebook: 0, instagram: 0 } });
  assert.equal(plan.actions.length, 1);
  assert.equal(plan.used.email, 1);
});

test('send transaction permits only one concurrent owner', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'outreach-lock-'));
  const first = intelligence.acquireSendTransaction(root, { company: 'Acme' });
  const second = intelligence.acquireSendTransaction(root, { company: 'Acme' });
  assert.equal(first.ok, true);
  assert.equal(second.ok, false);
  intelligence.releaseSendTransaction(first);
  assert.equal(intelligence.acquireSendTransaction(root, { company: 'Acme' }).ok, true);
});

test('learning reports only observed rates and confidence', () => {
  const learning = intelligence.buildLearning([{ history: [{ channel: 'email', status: 'sent_confirmed' }, { channel: 'email', status: 'replied' }] }]);
  assert.equal(learning.channels[0].replyRate, 1);
  assert.equal(learning.channels[0].confidence, 'low');
});
