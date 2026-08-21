const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const JSON_PATH = path.join(ROOT, 'google-lead-discovery-latest.json');
const JS_PATH = path.join(ROOT, 'google-lead-discovery-latest.js');
const STATE_PATH = path.join(ROOT, 'first-party-enrichment-state.json');
const CONFIG_PATH = path.join(ROOT, 'daily-automation-config.json');
const DEFAULT_LIMIT = 50;
const FETCH_TIMEOUT_MS = 10000;
const TRANSIENT_FILE_CODES = new Set(['UNKNOWN', 'EBUSY', 'EPERM', 'EACCES']);

function sleepSync(ms) {
  const signal = new Int32Array(new SharedArrayBuffer(4));
  Atomics.wait(signal, 0, 0, ms);
}

function retryTransientFileOperation(operation, attempts = 10) {
  let lastError = null;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return operation();
    } catch (error) {
      lastError = error;
      if (!TRANSIENT_FILE_CODES.has(String(error && error.code || '')) || attempt === attempts - 1) throw error;
      sleepSync(100 * (attempt + 1));
    }
  }
  throw lastError;
}

function atomicWriteFile(file, content) {
  const temp = `${file}.${process.pid}.${Date.now()}.tmp`;
  try {
    retryTransientFileOperation(() => fs.writeFileSync(temp, content));
    retryTransientFileOperation(() => fs.renameSync(temp, file));
  } finally {
    if (fs.existsSync(temp)) {
      try { fs.unlinkSync(temp); } catch { /* best-effort cleanup only */ }
    }
  }
}

function normalizedCompany(value) {
  return String(value || '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function campaignScopeMatches(row, config = {}) {
  const scope = config.campaignScope || {};
  if (scope.enabled !== true) return true;
  const country = String(row.countryEn || row.country || '').trim().toLowerCase();
  const customerType = String(row.customerType || '').trim().toLowerCase();
  const countries = (scope.requiredCountries || []).map(item => String(item || '').trim().toLowerCase()).filter(Boolean);
  const customerTypes = (scope.requiredCustomerTypes || []).map(item => String(item || '').trim().toLowerCase()).filter(Boolean);
  return (!countries.length || countries.includes(country)) && (!customerTypes.length || customerTypes.includes(customerType));
}

function safeOfficialUrl(value) {
  try {
    const url = new URL(String(value || ''));
    return /^https?:$/.test(url.protocol) && !/google\.|linkedin\.|facebook\.|instagram\./i.test(url.hostname) ? url.href : '';
  } catch {
    return '';
  }
}

function absoluteLinks(html, pageUrl) {
  const links = [];
  const pattern = /href\s*=\s*["']([^"'#]+)["']/gi;
  for (const match of String(html || '').matchAll(pattern)) {
    try { links.push(new URL(match[1], pageUrl).href); } catch { /* ignore malformed links */ }
  }
  return [...new Set(links)];
}

// Some WordPress/demo themes leave the theme vendor's social accounts in the
// footer. Those links are first-party page content, but they are not owned by
// the customer and must never become outreach targets.
function isTemplateVendorSocialUrl(value) {
  const normalized = String(value || '').toLowerCase();
  return /(?:facebook\.com\/(?:themefusion|avada)|instagram\.com\/(?:themefusion|avada)|linkedin\.com\/(?:company|in)\/(?:themefusion|avada))(?:[-/?#]|$)/i.test(normalized);
}

function inspectOfficialPage(html, pageUrl) {
  const text = String(html || '').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const links = absoluteLinks(html, pageUrl);
  const hasForm = /<form\b/i.test(html) && /<(?:input|textarea|select)\b/i.test(html);
  const businessEmails = links.filter(link => /^mailto:/i.test(link)).map(link => decodeURIComponent(link.replace(/^mailto:/i, '').split('?')[0])).filter(email => /@/.test(email) && !/no-?reply/i.test(email));
  const supplierIntent = /become\s+(?:a\s+)?supplier|supplier\s+(?:application|enquir|inquiry|partnership)|vendor\s+(?:application|registration|onboarding)|brands?\s+(?:apply|partner|contact)|wholesale\s+(?:application|enquir|inquiry)/i.test(text);
  const contactIntent = /contact\s+us|get\s+in\s+touch|send\s+us\s+(?:a\s+)?message|enquir(?:y|ies)|business\s+(?:inquiry|enquiry)/i.test(text);
  const socialLinks = links.filter(link => /https?:\/\/(?:www\.)?(?:linkedin\.com\/(?:company|in)\/|facebook\.com\/|instagram\.com\/)/i.test(link) && !isTemplateVendorSocialUrl(link));
  const signals = [hasForm && 'form_control', businessEmails.length && 'public_business_email', supplierIntent && 'supplier_invitation', contactIntent && 'contact_invitation'].filter(Boolean);
  return { hasForm, businessEmails, supplierIntent, contactIntent, socialLinks, signals };
}

async function fetchOfficialPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { redirect: 'follow', signal: controller.signal, headers: { 'user-agent': 'FLEXTAIL-First-Party-Channel-Verifier/1.0' } });
    const html = response.ok ? await response.text() : '';
    return { ok: response.ok, status: response.status, finalUrl: response.url || url, html };
  } catch (error) {
    return { ok: false, status: 0, finalUrl: url, html: '', error: error.name === 'AbortError' ? 'timeout' : error.message };
  } finally {
    clearTimeout(timer);
  }
}

function sameSocialProfile(left, right) {
  const clean = value => String(value || '').toLowerCase().replace(/[?#].*$/, '').replace(/\/$/, '').replace(/^https?:\/\/(?:www\.)?/, '');
  return clean(left) && clean(left) === clean(right);
}

function socialOwnershipMatches(row = {}) {
  const owner = normalizedCompany(row.socialProfileOwnerCompany || '');
  return !owner || owner === normalizedCompany(row.company || row.name || '');
}

function normalizedEvidenceUrl(value) {
  try {
    const parsed = new URL(String(value || ''));
    return `${parsed.origin.toLowerCase()}${parsed.pathname.replace(/\/$/, '') || '/'}`;
  } catch {
    return '';
  }
}

function cachedEvidenceMatchesRows(rows = [], cached = {}) {
  const cachedUrl = normalizedEvidenceUrl(cached.firstPartyChannelVerification && cached.firstPartyChannelVerification.evidenceUrl);
  if (!cachedUrl) return false;
  return rows.some(row => [row.contactUrl, row.vendorPortal, row.website]
    .map(safeOfficialUrl)
    .map(normalizedEvidenceUrl)
    .includes(cachedUrl));
}

function cachedVerificationFromRows(rows = []) {
  const verified = rows.find(row => row.firstPartyChannelVerification && row.firstPartyChannelVerification.status === 'checked') || rows[0] || {};
  return {
    firstPartyChannelVerification: verified.firstPartyChannelVerification || null,
    contactCapabilityVerified: rows.some(row => row.contactCapabilityVerified === true),
    externalVerificationStatus: rows.map(row => row.externalVerificationStatus).find(value => /^official_/.test(String(value || ''))) || '',
    publicEmail: rows.map(row => row.publicEmail || row.contactEmail).find(Boolean) || '',
    emailVerificationStatus: rows.map(row => row.emailVerificationStatus).find(Boolean) || '',
    socialProfiles: rows.filter(row => row.officialSocialProfileVerified === true && socialOwnershipMatches(row)).map(row => row.platformUrl || row.url).filter(url => url && !isTemplateVendorSocialUrl(url)),
  };
}

function promoteVerifiedEmailRow(row = {}) {
  if (!String(row.publicEmail || row.contactEmail || '').includes('@')) return row;
  const platform = String(row.platform || '').toLowerCase();
  if (['facebook', 'instagram', 'linkedin'].includes(platform)) return row;
  row.platform = 'email';
  row.channelType = 'email';
  row.action = 'email_priority';
  row.reason = 'official_public_business_email_verified';
  return row;
}

function applyCachedVerification(rows = [], cached = {}) {
  const baseRow = rows[0] || {};
  const cachedSocialProfiles = socialOwnershipMatches(baseRow) ? (cached.socialProfiles || []).filter(url => !isTemplateVendorSocialUrl(url)) : [];
  for (const socialUrl of cachedSocialProfiles) {
    if (rows.some(row => sameSocialProfile(row.platformUrl || row.url, socialUrl))) continue;
    const platform = /linkedin\.com/i.test(socialUrl) ? 'linkedin'
      : /facebook\.com|fb\.com/i.test(socialUrl) ? 'facebook'
        : /instagram\.com/i.test(socialUrl) ? 'instagram' : '';
    if (!platform) continue;
    const family = String(baseRow.id || baseRow.taskId || baseRow.company || 'customer')
      .replace(/-(?:website-contact|email|linkedin|facebook|instagram)(?:-fallback)?$/i, '');
    rows.push({
      ...baseRow,
      id: `${family}-${platform}`,
      taskId: `${family}-${platform}`,
      platform,
      channelType: platform,
      platformUrl: socialUrl,
      url: socialUrl,
      targetUrl: socialUrl,
      verifiedTargetUrl: socialUrl,
      action: 'develop',
      reason: 'official_website_social_channel_verified',
      officialSocialProfileVerified: true,
      socialProfileEvidenceUrl: cached.firstPartyChannelVerification && cached.firstPartyChannelVerification.evidenceUrl || '',
      socialProfileVerifiedAt: cached.firstPartyChannelVerification && cached.firstPartyChannelVerification.verifiedAt || '',
    });
  }
  for (const row of rows) {
    if (cached.firstPartyChannelVerification) row.firstPartyChannelVerification = cached.firstPartyChannelVerification;
    if (cached.contactCapabilityVerified) row.contactCapabilityVerified = true;
    if (cached.externalVerificationStatus) row.externalVerificationStatus = cached.externalVerificationStatus;
    if (cached.publicEmail) {
      row.publicEmail = cached.publicEmail;
      row.contactEmail = cached.publicEmail;
      row.emailVerificationStatus = cached.emailVerificationStatus || 'official_public_business_email';
      row.emailEvidence = 'first_party_live_page_cache';
      promoteVerifiedEmailRow(row);
    }
    if (cachedSocialProfiles.some(url => sameSocialProfile(url, row.platformUrl || row.url))) {
      row.officialSocialProfileVerified = true;
      row.socialProfileEvidenceUrl = cached.firstPartyChannelVerification && cached.firstPartyChannelVerification.evidenceUrl || '';
      row.socialProfileVerifiedAt = cached.firstPartyChannelVerification && cached.firstPartyChannelVerification.verifiedAt || '';
    }
  }
  return rows;
}

async function enrichCompany(rows) {
  const company = rows[0] && rows[0].company;
  // sourceEvidenceUrl may be a directory or research page. Only company-owned
  // routing fields are eligible for first-party verification.
  const candidates = [...new Set(rows.flatMap(row => [row.contactUrl, row.vendorPortal, row.website]).map(safeOfficialUrl).filter(Boolean))];
  let best = null;
  for (const url of candidates.slice(0, 3)) {
    const fetched = await fetchOfficialPage(url);
    if (!fetched.ok) { if (!best) best = { ...fetched, inspected: { signals: [], socialLinks: [], businessEmails: [] } }; continue; }
    const inspected = inspectOfficialPage(fetched.html, fetched.finalUrl);
    best = { ...fetched, inspected };
    if (inspected.hasForm || inspected.businessEmails.length || inspected.supplierIntent || inspected.socialLinks.length) break;
  }
  const verifiedAt = new Date().toISOString();
  const inspected = best && best.inspected || { signals: [], socialLinks: [], businessEmails: [] };
  // First-party website social links are execution evidence, not merely
  // annotations. Materialize missing channel siblings so one company can be
  // touched by email and its official social account in the same campaign.
  const baseRow = rows[0] || {};
  const ownedSocialLinks = socialOwnershipMatches(baseRow) ? (inspected.socialLinks || []) : [];
  for (const socialUrl of ownedSocialLinks) {
    const platform = /linkedin\.com/i.test(socialUrl) ? 'linkedin'
      : /facebook\.com|fb\.com/i.test(socialUrl) ? 'facebook'
        : /instagram\.com/i.test(socialUrl) ? 'instagram'
          : '';
    if (!platform || rows.some(row => sameSocialProfile(row.platformUrl || row.url, socialUrl))) continue;
    const family = String(baseRow.id || baseRow.taskId || company || 'customer')
      .replace(/-(?:website-contact|email|linkedin|facebook|instagram)(?:-fallback)?$/i, '');
    rows.push({
      ...baseRow,
      id: `${family}-${platform}`,
      taskId: `${family}-${platform}`,
      platform,
      channelType: platform,
      platformUrl: socialUrl,
      url: socialUrl,
      targetUrl: socialUrl,
      verifiedTargetUrl: socialUrl,
      action: 'develop',
      reason: 'official_website_social_channel_verified',
      officialSocialProfileVerified: true,
      socialProfileEvidenceUrl: best && best.finalUrl || candidates[0] || '',
      socialProfileVerifiedAt: verifiedAt,
    });
  }
  for (const row of rows) {
    row.firstPartyChannelVerification = {
      status: best && best.ok ? 'checked' : 'unreachable',
      verifiedAt,
      evidenceUrl: best && best.finalUrl || candidates[0] || '',
      httpStatus: best && best.status || 0,
      signals: inspected.signals,
      error: best && best.error || '',
    };
    if (best && best.ok && (inspected.hasForm || inspected.businessEmails.length) && (inspected.contactIntent || inspected.supplierIntent)) {
      row.contactCapabilityVerified = true;
      row.sourceEvidenceUrl = best.finalUrl;
      row.externalVerificationStatus = inspected.supplierIntent
        ? (inspected.hasForm ? 'official_supplier_form_verified' : 'official_supplier_route_verified')
        : 'official_contact_form_verified';
    }
    const rowSocialUrl = row.platformUrl || row.url;
    const socialEvidence = ownedSocialLinks.find(link => sameSocialProfile(link, rowSocialUrl));
    if (socialEvidence) {
      row.officialSocialProfileVerified = true;
      row.socialProfileEvidenceUrl = best.finalUrl;
      row.socialProfileVerifiedAt = verifiedAt;
    }
    if (!row.publicEmail && inspected.businessEmails.length) {
      row.publicEmail = inspected.businessEmails[0];
      row.contactEmail = inspected.businessEmails[0];
      row.emailVerificationStatus = 'official_public_business_email';
      row.emailEvidence = 'first_party_live_page';
    }
    promoteVerifiedEmailRow(row);
  }
  return { company, ok: Boolean(best && best.ok), evidenceUrl: best && best.finalUrl || '', signals: inspected.signals, cache: cachedVerificationFromRows(rows) };
}

async function main() {
  const artifact = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  artifact.leads = (artifact.leads || []).filter(row => !isTemplateVendorSocialUrl(row.platformUrl || row.targetUrl || row.url));
  const config = fs.existsSync(CONFIG_PATH) ? JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')) : {};
  const groups = new Map();
  for (const row of artifact.leads || []) {
    if (Number(row.fitScore || 0) < 70 || row.doNotOutreach) continue;
    const key = normalizedCompany(row.company);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  const limit = Math.max(1, Math.min(Number(process.env.FIRST_PARTY_ENRICH_LIMIT || DEFAULT_LIMIT), 50));
  const state = fs.existsSync(STATE_PATH) ? JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')) : { cursor: 0, verifications: {} };
  const verifications = state.verifications && typeof state.verifications === 'object' ? state.verifications : {};
  for (const [key, rows] of groups) {
    if (!verifications[key] && rows.some(row => row.firstPartyChannelVerification)) {
      verifications[key] = cachedVerificationFromRows(rows);
    }
  }
  for (const [key, rows] of groups) {
    if (cachedEvidenceMatchesRows(rows, verifications[key])) applyCachedVerification(rows, verifications[key]);
  }
  const allGroups = [...groups.values()];
  const scopedGroups = allGroups.filter(rows => rows.some(row => campaignScopeMatches(row, config)));
  const activeGroups = config.campaignScope && config.campaignScope.enabled === true ? scopedGroups : allGroups;
  const cursorField = activeGroups === scopedGroups ? 'campaignCursor' : 'cursor';
  const start = activeGroups.length ? Math.max(0, Number(state[cursorField] || 0)) % activeGroups.length : 0;
  const rotated = [...activeGroups.slice(start), ...activeGroups.slice(0, start)];
  const staleOrChanged = activeGroups.filter(rows => !cachedEvidenceMatchesRows(rows, verifications[normalizedCompany(rows[0] && rows[0].company)]));
  const staleKeys = new Set(staleOrChanged.map(rows => normalizedCompany(rows[0] && rows[0].company)));
  const pending = [...staleOrChanged, ...rotated.filter(rows => !staleKeys.has(normalizedCompany(rows[0] && rows[0].company)))].slice(0, limit);
  const results = [];
  for (let index = 0; index < pending.length; index += 4) {
    results.push(...await Promise.all(pending.slice(index, index + 4).map(enrichCompany)));
  }
  const persistedIds = new Set((artifact.leads || []).map(row => String(row.id || row.taskId || '')));
  for (const rows of groups.values()) {
    for (const row of rows) {
      const id = String(row.id || row.taskId || '');
      if (!id || persistedIds.has(id)) continue;
      artifact.leads.push(row);
      persistedIds.add(id);
    }
  }
  for (const result of results) verifications[normalizedCompany(result.company)] = result.cache;
  artifact.firstPartyEnrichment = { completedAt: new Date().toISOString(), attemptedCompanies: results.length, verifiedCompanies: results.filter(item => item.ok && item.signals.length).length, cachedCompanies: Object.keys(verifications).length, results: results.map(({ cache, ...result }) => result) };
  const nextState = { ...state, updatedAt: artifact.firstPartyEnrichment.completedAt, companyCount: allGroups.length, scopedCompanyCount: scopedGroups.length, verifications };
  nextState[cursorField] = activeGroups.length ? (start + results.length) % activeGroups.length : 0;
  atomicWriteFile(STATE_PATH, `${JSON.stringify(nextState, null, 2)}\n`);
  atomicWriteFile(JSON_PATH, `${JSON.stringify(artifact, null, 2)}\n`);
  atomicWriteFile(JS_PATH, `window.GOOGLE_LEAD_DISCOVERY_LATEST = ${JSON.stringify(artifact, null, 2)};\n`);
  console.log(JSON.stringify(artifact.firstPartyEnrichment, null, 2));
}

if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });

module.exports = { inspectOfficialPage, isTemplateVendorSocialUrl, safeOfficialUrl, sameSocialProfile, applyCachedVerification, cachedVerificationFromRows, cachedEvidenceMatchesRows, campaignScopeMatches, retryTransientFileOperation, atomicWriteFile };
