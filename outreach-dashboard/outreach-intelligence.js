const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BLOCKING_STATUSES = new Set(['sent_confirmed', 'submitted_confirmed', 'send_unconfirmed']);
const OUTCOME_STATUSES = new Set(['replied', 'positive_reply', 'qualified', 'opportunity_created', 'meeting_booked', 'won']);
const SOCIAL = new Set(['linkedin', 'facebook', 'instagram']);

function clean(value) {
  return String(value || '').trim().toLowerCase();
}

function slug(value) {
  return clean(value).replace(/^google-customer-/, '').replace(/-(?:website-contact|facebook|instagram|linkedin)$/, '').replace(/[^a-z0-9]+/g, '');
}

function domain(value) {
  try {
    const host = new URL(String(value || '')).hostname.replace(/^www\./, '').toLowerCase();
    return host && !/(facebook|instagram|linkedin)\.com$/.test(host) ? host : '';
  } catch {
    const email = clean(value).match(/@([a-z0-9.-]+)$/);
    return email ? email[1] : '';
  }
}

function sameOrganizationDomain(left, right) {
  const a = domain(left); const b = domain(right);
  return Boolean(a && b && (a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`)));
}

function companyKeys(item = {}) {
  const values = [item.company, item.name, item.task_id, item.taskId, item.id, domain(item.website), domain(item.target_url), domain(item.url), domain(item.publicEmail), domain(item.contactEmail)];
  return [...new Set(values.map(slug).filter(Boolean))];
}

function companyId(item = {}) {
  const key = companyKeys(item)[0] || 'unknown';
  return `company_${crypto.createHash('sha256').update(key).digest('hex').slice(0, 16)}`;
}

function channelOf(item = {}) {
  const text = clean([item.channel, item.platform, item.target_url, item.url, item.contactUrl, item.publicEmail, item.contactEmail, item.task_id].join(' '));
  if (text.includes('linkedin')) return 'linkedin';
  if (text.includes('facebook')) return 'facebook';
  if (text.includes('instagram')) return 'instagram';
  if (text.includes('mailto') || text.includes('email')) return 'email';
  if (text.includes('website') || text.includes('contact')) return 'website_form';
  return 'research';
}

function evidenceScore(item = {}) {
  const platform = channelOf(item);
  const status = clean([item.emailVerificationStatus, item.externalVerificationStatus, item.publicEmailStatus, item.identityStatus].join(' '));
  const evidenceUrl = item.socialProfileEvidenceUrl || item.sourceEvidenceUrl || item.emailEvidenceUrl || item.evidenceUrl || '';
  const organizationReferences = [item.website, item.contactUrl, item.url, item.publicEmail, item.contactEmail].filter(Boolean);
  const firstParty = Boolean(evidenceUrl
    && organizationReferences.some(reference => sameOrganizationDomain(evidenceUrl, reference))
    && !/(?:google|bing|yahoo)\./i.test(domain(evidenceUrl))
    && (!SOCIAL.has(platform) || item.officialSocialProfileVerified === true));
  let score = 0;
  const reasons = [];
  if (/official_(?:public_business_email|supplier_form_verified|supplier_route_verified)/.test(status) && firstParty) { score = 100; reasons.push('official_business_route'); }
  else if (item.officialSocialProfileVerified === true && firstParty) { score = 95; reasons.push('official_site_cross_verified_social'); }
  else if (/deliverable/.test(status) && firstParty) { score = 90; reasons.push('deliverable_with_first_party_evidence'); }
  else if (firstParty) { score = 80; reasons.push('first_party_evidence'); }
  else if (evidenceUrl) { score = 0; reasons.push('unverified_external_evidence_rejected'); }
  if (/identity_mismatch|personal_profile|unavailable/.test(clean(item.evidence || item.reason))) { score = 0; reasons.push('identity_or_availability_failure'); }
  return { score, verified: score >= 90, reasons, evidenceUrl, checkedAt: item.socialProfileVerifiedAt || item.verifiedAt || '' };
}

function isCustomerInteraction(result = {}) {
  const status = clean(result.status || result.sendStatus);
  if (BLOCKING_STATUSES.has(status)) {
    if (status !== 'send_unconfirmed') return true;
    const evidence = String(result.evidence || '');
    if (/owner_confirmed_prior_customer_development/i.test(evidence)) return true;
    if (/delivery_state_uncertain/i.test(evidence) && /automatic_resend_forbidden/i.test(evidence)) return true;
    if (/message_sent|persisted_after_reload|sent_folder_record_missing/i.test(evidence)) return true;
    return /send_clicked|enter_send_attempted|submit_clicked/i.test(evidence)
      && /verified_draft_present_before_irreversible_action|alibaba_webmail_send_physical_click_dispatched|website_contact_form_submit_clicked/i.test(evidence);
  }
  if (status !== 'failed_open') return false;
  const evidence = String(result.evidence || '');
  return /message_sent|persisted_after_reload/i.test(evidence)
    || (/send_clicked|enter_send_attempted/i.test(evidence)
      && /verified_draft_present_before_irreversible_action/i.test(evidence));
}

function buildCompanyTruth({ leads = [], results = [], records = [] } = {}) {
  const companies = new Map();
  const all = [...leads, ...results, ...records];
  for (const item of all) {
    const keys = companyKeys(item);
    if (!keys.length) continue;
    let existing = [...companies.values()].find(row => row.keys.some(key => keys.includes(key)));
    if (!existing) {
      existing = { companyId: companyId(item), company: item.company || item.name || keys[0], keys: [], domains: [], channels: [], evidence: [], history: [] };
      companies.set(existing.companyId, existing);
    }
    existing.keys = [...new Set([...existing.keys, ...keys])];
    existing.domains = [...new Set([...existing.domains, domain(item.website), domain(item.url), domain(item.target_url), domain(item.publicEmail), domain(item.contactEmail)].filter(Boolean))];
    const channel = channelOf(item);
    if (channel !== 'research') existing.channels = [...new Set([...existing.channels, channel])];
    const proof = evidenceScore(item);
    if (proof.evidenceUrl) existing.evidence.push({ channel, ...proof });
    if (item.status || item.sendStatus) existing.history.push({
      status: item.status || item.sendStatus,
      timestamp: item.timestamp || item.lastTouch || '',
      channel,
      evidence: item.evidence || '',
      repliedAt: item.repliedAt || item.replyAt || '',
      replyType: item.replyType || '',
      replyOutcome: item.replyOutcome || '',
    });
  }
  return [...companies.values()].map(row => ({ ...row, evidence: row.evidence.sort((a, b) => b.score - a.score), history: row.history.sort((a, b) => Date.parse(a.timestamp || 0) - Date.parse(b.timestamp || 0)) }));
}

function buildSuppressionLedger(companies = []) {
  return companies.flatMap(company => {
    const blocking = company.history.filter(isCustomerInteraction);
    if (!blocking.length) return [];
    const latest = blocking[blocking.length - 1];
    return [{ companyId: company.companyId, company: company.company, permanent: true, crossChannel: true, reason: 'previous_customer_development_no_repeat', sourceStatus: latest.status, sourceTimestamp: latest.timestamp, evidence: latest.evidence }];
  });
}

function planPortfolio(companies = [], suppressions = [], options = {}) {
  const suppressed = new Set(suppressions.map(item => item.companyId));
  const channelQuota = { email: 10, website_form: 5, linkedin: 4, facebook: 3, instagram: 3, ...(options.channelQuota || {}) };
  const used = Object.fromEntries(Object.keys(channelQuota).map(key => [key, 0]));
  const actions = [];
  for (const company of companies) {
    if (suppressed.has(company.companyId)) continue;
    const proofs = company.evidence.filter(item => item.verified).sort((a, b) => b.score - a.score);
    const candidates = ['email', 'website_form', 'linkedin', 'facebook', 'instagram']
      .map(channel => ({ channel, proof: proofs.find(item => item.channel === channel) }))
      .filter(item => item.proof && used[item.channel] < (channelQuota[item.channel] || 0));
    if (!candidates.length) continue;
    const selected = candidates[0];
    used[selected.channel] += 1;
    actions.push({ companyId: company.companyId, company: company.company, action: 'first_touch', channel: selected.channel, evidenceScore: selected.proof.score, evidenceUrl: selected.proof.evidenceUrl, alternatives: candidates.slice(1).map(item => item.channel), reason: 'highest_priority_verified_channel' });
  }
  return { actions, quota: channelQuota, used, gaps: Object.fromEntries(Object.keys(channelQuota).map(key => [key, Math.max(0, channelQuota[key] - used[key])])) };
}

function buildLearning(companies = []) {
  const buckets = new Map();
  for (const company of companies) {
    for (const event of company.history) {
      const channel = event.channel || 'unknown';
      const bucket = buckets.get(channel) || { channel, confirmed: 0, replies: 0, opportunities: 0 };
      const status = clean(event.status);
      if (status === 'sent_confirmed' || status === 'submitted_confirmed') bucket.confirmed += 1;
      const replyEvidence = /recipient_(?:auto_)?reply_received|recipient_replied|inbound_reply_(?:received|visible)|reply_bubble_visible/i.test(String(event.evidence || ''));
      if (status.includes('repl') || event.repliedAt || replyEvidence) {
        bucket.replies += 1;
        if (event.replyType === 'human') bucket.humanReplies = (bucket.humanReplies || 0) + 1;
        else if (event.replyType === 'automated') bucket.automatedReplies = (bucket.automatedReplies || 0) + 1;
        else bucket.unclassifiedReplies = (bucket.unclassifiedReplies || 0) + 1;
      }
      if (OUTCOME_STATUSES.has(status) && !status.includes('repl')) bucket.opportunities += 1;
      buckets.set(channel, bucket);
    }
  }
  const channels = [...buckets.values()].map(row => ({ ...row, replyRate: row.confirmed ? row.replies / row.confirmed : null, opportunityRate: row.confirmed ? row.opportunities / row.confirmed : null, confidence: row.confirmed >= 20 ? 'high' : row.confirmed >= 5 ? 'medium' : 'low' }));
  return { channels, experiments: channels.filter(row => row.confirmed >= 5).map(row => ({ dimension: 'channel', variant: row.channel, sampleSize: row.confirmed, observedReplyRate: row.replyRate, recommendation: row.confidence === 'low' ? 'collect_more_confirmed_samples' : 'use_as_bounded_allocation_signal' })) };
}

function buildOwnerSummary({ companies, suppressions, portfolio, learning, generatedAt = new Date().toISOString() }) {
  return { generatedAt, phase: 'autonomous_sales_operating_system_v1', kpis: { companies: companies.length, permanentlySuppressed: suppressions.length, plannedActions: portfolio.actions.length, verifiedEvidenceRoutes: companies.reduce((n, row) => n + row.evidence.filter(item => item.verified).length, 0) }, decisions: portfolio.actions.slice(0, 10), exceptions: [{ code: 'verified_channel_capacity_gap', severity: portfolio.actions.length ? 'warning' : 'blocking', detail: portfolio.gaps }], learning };
}

function transactionPath(root, companyIdValue) { return path.join(root, '.agent', 'runtime', 'send-transactions', `${companyIdValue}.lock`); }
function acquireSendTransaction(root, item, ttlMs = 45 * 60 * 1000) {
  const id = companyId(item); const file = transactionPath(root, id); fs.mkdirSync(path.dirname(file), { recursive: true });
  try {
    const existing = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (Date.now() - Date.parse(existing.acquiredAt || 0) < ttlMs) return { ok: false, reason: 'company_send_transaction_locked', companyId: id, file };
    fs.unlinkSync(file);
  } catch {}
  try { const fd = fs.openSync(file, 'wx'); fs.writeFileSync(fd, JSON.stringify({ companyId: id, acquiredAt: new Date().toISOString(), pid: process.pid }, null, 2)); fs.closeSync(fd); return { ok: true, companyId: id, file }; }
  catch (error) { if (error.code === 'EEXIST') return { ok: false, reason: 'company_send_transaction_locked', companyId: id, file }; throw error; }
}
function releaseSendTransaction(lock) { if (lock && lock.ok && lock.file) { try { fs.unlinkSync(lock.file); } catch {} } }

module.exports = { companyKeys, companyId, evidenceScore, isCustomerInteraction, buildCompanyTruth, buildSuppressionLedger, planPortfolio, buildLearning, buildOwnerSummary, acquireSendTransaction, releaseSendTransaction };
