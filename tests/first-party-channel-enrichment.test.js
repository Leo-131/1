const test = require('node:test');
const assert = require('node:assert/strict');
const { inspectOfficialPage, safeOfficialUrl, sameSocialProfile, applyCachedVerification, cachedEvidenceMatchesRows, campaignScopeMatches } = require('../outreach-dashboard/enrich-first-party-channels');

test('first-party enrichment artifacts use bounded transient retry and atomic replacement', () => {
  const source = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', 'outreach-dashboard', 'enrich-first-party-channels.js'), 'utf8');
  assert.match(source, /TRANSIENT_FILE_CODES/);
  assert.match(source, /function retryTransientFileOperation/);
  assert.match(source, /function atomicWriteFile/);
  assert.doesNotMatch(source, /fs\.writeFileSync\(JSON_PATH/);
  assert.doesNotMatch(source, /fs\.writeFileSync\(STATE_PATH/);
});

test('first-party page inspection recognizes executable controls and exact official social links', () => {
  const html = '<h1>Become a supplier</h1><form><input name="email"><textarea></textarea></form><a href="https://instagram.com/acme/">Instagram</a>';
  const result = inspectOfficialPage(html, 'https://acme.example/suppliers');
  assert.equal(result.hasForm, true);
  assert.equal(result.supplierIntent, true);
  assert.deepEqual(result.signals, ['form_control', 'supplier_invitation']);
  assert.equal(sameSocialProfile(result.socialLinks[0], 'https://www.instagram.com/acme'), true);
});

test('first-party page inspection rejects a URL-only page as executable evidence', () => {
  const result = inspectOfficialPage('<h1>Products</h1><a href="/shop">Shop</a>', 'https://acme.example/');
  assert.equal(result.hasForm, false);
  assert.deepEqual(result.signals, []);
  assert.equal(safeOfficialUrl('https://facebook.com/acme'), '');
});

test('enrichment source keeps third-party research evidence out of the first-party fetch set', () => {
  const source = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', 'outreach-dashboard', 'enrich-first-party-channels.js'), 'utf8');
  const candidateBlock = source.slice(source.indexOf('const candidates ='), source.indexOf('let best ='));
  assert.doesNotMatch(candidateBlock, /sourceEvidenceUrl/);
  assert.match(candidateBlock, /row\.contactUrl, row\.vendorPortal, row\.website/);
});

test('enrichment persists a rotating cursor so later runs research the next companies', () => {
  const source = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', 'outreach-dashboard', 'enrich-first-party-channels.js'), 'utf8');
  assert.match(source, /first-party-enrichment-state\.json/);
  assert.match(source, /\(start \+ results\.length\) % activeGroups\.length/);
  assert.match(source, /activeGroups\.slice\(start\).*activeGroups\.slice\(0, start\)/s);
  assert.match(source, /rows\.some\(row => row\.firstPartyChannelVerification\)/);
});

test('first-party enrichment prioritizes the active North America sales-agency campaign', () => {
  const config = { campaignScope: { enabled: true, requiredCountries: ['united states', 'canada', 'mexico'], requiredCustomerTypes: ['sales_agency'] } };
  assert.equal(campaignScopeMatches({ country: 'United States', customerType: 'sales_agency' }, config), true);
  assert.equal(campaignScopeMatches({ country: 'United Kingdom', customerType: 'sales_agency' }, config), false);
  assert.equal(campaignScopeMatches({ country: 'Canada', customerType: 'key_account' }, config), false);
  const source = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', 'outreach-dashboard', 'enrich-first-party-channels.js'), 'utf8');
  assert.ok(source.includes('const DEFAULT_LIMIT = 50'));
  assert.ok(source.includes("const cursorField = activeGroups === scopedGroups ? 'campaignCursor' : 'cursor'"));
});

test('cached first-party evidence is replayed after the discovery artifact is rebuilt', () => {
  const rows = [{ company: 'Acme', platform: 'website_form', url: 'https://acme.example/contact' }, { company: 'Acme', platform: 'instagram', url: 'https://instagram.com/acme' }];
  applyCachedVerification(rows, {
    firstPartyChannelVerification: { status: 'checked', evidenceUrl: 'https://acme.example/contact', verifiedAt: '2026-08-05T00:00:00.000Z' },
    contactCapabilityVerified: true,
    externalVerificationStatus: 'official_contact_form_verified',
    publicEmail: 'buyer@acme.example',
    emailVerificationStatus: 'official_public_business_email',
    socialProfiles: ['https://www.instagram.com/acme/'],
  });
  assert.equal(rows[0].contactCapabilityVerified, true);
  assert.equal(rows[0].publicEmail, 'buyer@acme.example');
  assert.equal(rows[1].officialSocialProfileVerified, true);
});

test('changed official contact path invalidates stale cached evidence', () => {
  const cached = { firstPartyChannelVerification: { evidenceUrl: 'https://acme.example/' } };
  assert.equal(cachedEvidenceMatchesRows([{ contactUrl: 'https://acme.example/' }], cached), true);
  assert.equal(cachedEvidenceMatchesRows([{ contactUrl: 'https://acme.example/contact-us' }], cached), false);
});
