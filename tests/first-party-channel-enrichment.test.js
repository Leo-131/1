const test = require('node:test');
const assert = require('node:assert/strict');
const { inspectOfficialPage, safeOfficialUrl, sameSocialProfile } = require('../outreach-dashboard/enrich-first-party-channels');

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
  assert.match(source, /\(start \+ results\.length\) % allGroups\.length/);
  assert.match(source, /allGroups\.slice\(start\).*allGroups\.slice\(0, start\)/s);
});
