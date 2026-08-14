const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('node:vm');

const { leadMessages, parseJsonContent, professionalSalesDraft, requestGlm } = require('../outreach-dashboard/glm-service');
const { buildDiscoveryRun, buildLeads } = require('../outreach-dashboard/google-lead-discovery-runner');
const {
  buildAutoGlmTask,
  isBlockedFacebookTarget,
  isUnavailableProfilePage,
  normalizeTarget,
  validateLeadForExecution,
} = require('../outreach-dashboard/autoglm-bridge');
const dailyRunner = require('../outreach-dashboard/daily-automation-runner');
const { identityCheckExpression } = require('../outreach-dashboard/codex-chrome-driver');

const mainSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'main.js'), 'utf8');
const chromeDriverSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'codex-chrome-driver.js'), 'utf8');
const discoverySource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'google-lead-discovery-runner.js'), 'utf8');
const enrichmentSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'enrich-first-party-channels.js'), 'utf8');
const dailyRunnerSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'daily-automation-runner.js'), 'utf8');
const intelligenceGeneratorSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'generate-outreach-intelligence.js'), 'utf8');
const glmSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'glm-service.js'), 'utf8');
const templateSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'api', 'templates.js'), 'utf8');
const marketProtectionSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'country-market-protection.js'), 'utf8');
const alibabaWebmailSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'alibaba-webmail-automation.js'), 'utf8');
const outreachPolicySource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', '.agent', 'policies', 'outreach-policy.md'), 'utf8');
const optimizedPromptSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'docs', 'daily-google-lead-outreach-optimized-prompt.md'), 'utf8');
const dailyConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'daily-automation-config.json'), 'utf8'));

function emptyClassificationContext(now = Date.parse('2026-07-14T08:00:00.000Z')) {
  return {
    now,
    profiles: {},
    resultsByTask: new Map(),
    sameDayByCompany: new Map(),
    priorDevelopmentByCompany: new Map(),
  };
}

test('legacy pending sequence statuses do not mark a customer as previously developed', () => {
  assert.equal(dailyRunner.legacyStatusIndicatesTouch('Pending'), false);
  assert.equal(dailyRunner.legacyStatusIndicatesTouch('0 out of 6'), false);
  assert.equal(dailyRunner.legacyStatusIndicatesTouch('2 out of 6'), true);
  assert.equal(dailyRunner.legacyStatusIndicatesTouch('Sent'), true);
  assert.equal(dailyRunner.legacyStatusIndicatesTouch('Accepted'), true);
});

test('daily automation default run date follows Shanghai business day', () => {
  assert.equal(
    dailyRunner.automationRunDate(Date.parse('2026-07-14T22:01:00.000Z')),
    '2026-07-15',
  );
});

test('daily queue prioritizes verified Email, website forms, LinkedIn, Facebook and Instagram in that order', () => {
  assert.ok(dailyRunner.channelPriorityScore({ platform: 'email' })
    > dailyRunner.channelPriorityScore({ platform: 'website_form', reason: 'official_website_contact_channel' }));
  assert.ok(dailyRunner.channelPriorityScore({ platform: 'website_form', reason: 'official_website_contact_channel' })
    > dailyRunner.channelPriorityScore({ platform: 'linkedin' }));
  assert.ok(dailyRunner.channelPriorityScore({ platform: 'linkedin' })
    > dailyRunner.channelPriorityScore({ platform: 'facebook' }));
  assert.ok(dailyRunner.channelPriorityScore({ platform: 'facebook' })
    > dailyRunner.channelPriorityScore({ platform: 'instagram' }));
  assert.ok(dailyRunner.channelPriorityScore({ platform: 'facebook' })
    > dailyRunner.channelPriorityScore({ platform: 'instagram' }));
});

test('brand official representative-directory emails become email tasks instead of shared website forms', () => {
  const lead = buildLeads(650).find(item => item.company === 'Our Habit Sales');
  assert.ok(lead, 'official brand representative must remain discoverable');
  assert.equal(lead.platform, 'email');
  assert.equal(lead.contactEmail, 'ourhabit.sales@gmail.com');
  assert.equal(lead.emailVerificationStatus, 'official_brand_rep_directory_email');
  assert.equal(lead.externalVerificationStatus, 'official_supplier_email_verified');
});

test('live first-party enrichment promotes a discovered company-domain email to Email execution', () => {
  assert.ok(enrichmentSource.includes('function promoteVerifiedEmailRow'));
  assert.ok(enrichmentSource.includes("row.platform = 'email'"));
  assert.ok(enrichmentSource.includes("row.action = 'email_priority'"));
  assert.ok(enrichmentSource.includes("row.reason = 'official_public_business_email_verified'"));
});

test('email queue keeps distinct agencies listed on the same first-party directory page', () => {
  const rows = dailyRunner.dedupeQueueItems([
    { company: 'Agency One', platform: 'email', contactEmail: 'one@example.com', contactUrl: 'https://brand.example/reps' },
    { company: 'Agency Two', platform: 'email', contactEmail: 'two@example.com', contactUrl: 'https://brand.example/reps' },
  ]);
  assert.equal(rows.length, 2);
});

test('execution dedupe separates verified email recipients from shared evidence-page URLs', () => {
  assert.ok(mainSource.includes("if (/email/.test(explicit)) return 'email'"));
  assert.ok(mainSource.includes("if (automationPlatformFor(value) === 'email' && recipient)"));
  assert.ok(mainSource.includes('`email:${recipient}`'));
  assert.ok(mainSource.includes("if (String(item.platform || item.channel || '').toLowerCase() === 'email') return false"));
  assert.ok(mainSource.includes("return ['linkedin', 'facebook', 'instagram'].includes("));
});

test('website contact can execute without a configured attachment', () => {
  assert.ok(mainSource.includes('const websiteFallback = executableQueueCandidates'));
  assert.ok(mainSource.includes('{ allowWebsiteContact: true })'));
  assert.ok(mainSource.includes("'verify_target'"));
  assert.ok(mainSource.includes('item.url || item.contactUrl || item.website'));
  assert.ok(mainSource.includes('homepage_only_contact_path_requires_verification'));
  assert.ok(mainSource.includes("const blocking = new Set(['sent_confirmed', 'bounced', 'failed_open', 'send_unconfirmed', 'website_contact_ready', 'website_contact_unreachable_skip'])"));
  assert.ok(!mainSource.includes("'approval_pending', 'draft_prepared', 'prepared_not_sent'"));
  assert.ok(mainSource.includes('function socialFallbackFromInspection'));
  assert.ok(mainSource.includes('official_website_social_fallback'));
  assert.ok(mainSource.includes('socialLinks'));
  assert.ok(mainSource.includes('verifiedByOfficialWebsite'));
  assert.ok(mainSource.includes('socialProfileEvidenceUrl: verifiedByOfficialWebsite'));
  assert.ok(mainSource.includes('identity_check_pending_empty_page'));
  assert.ok(!mainSource.includes('website_contact_preflight_blocked'));
  assert.ok(mainSource.includes('website_contact_form_no_file_input'));
  assert.ok(mainSource.includes('optional_attachment_omitted'));
  assert.ok(mainSource.includes('required_attachment_missing'));
  assert.ok(mainSource.includes('website_contact_public_email_sender_required') || mainSource.includes('email_sender_not_configured'));
  assert.ok(mainSource.includes('public_email_fallback_available'));
  assert.ok(mainSource.includes('Attachment requirements can only be known after the'));
  assert.doesNotMatch(mainSource, /reason:\s*!attachmentReady\s*&&\s*isWebsiteContactQueueItem/);
});

test('a pre-send Alibaba authentication failure falls back to verified website or social routes', () => {
  assert.ok(mainSource.includes('function canFallbackAfterEmailPreflight'));
  assert.ok(mainSource.includes("'alibaba_webmail_login_required'"));
  assert.ok(mainSource.includes("'alibaba_webmail_session_unavailable'"));
  assert.ok(mainSource.includes('if (!canFallbackAfterEmailPreflight(emailPreflight) || !targets.length) return emailPreflight'));
  assert.ok(mainSource.includes("result.sendStatus === 'send_unconfirmed'"));
  assert.ok(mainSource.includes('if (isVerifiedEmail && !isWebsiteContact)'));
  assert.ok(mainSource.includes('alibaba_webmail_login_required|alibaba_webmail_session_unavailable'));
  assert.ok(mainSource.includes('async function probeAlibabaWebmailSession'));
  assert.ok(mainSource.includes('automationOwned: true, reuseTab: true'));
  assert.ok(mainSource.includes('consecutiveLoginObservations >= 6'));
  assert.ok(mainSource.includes('alibaba_webmail_authenticated_compose_visible'));
  assert.ok(mainSource.includes('liveAlibabaWebmailSessionReady = Boolean(alibabaSessionProbe && alibabaSessionProbe.ok)'));
  assert.ok(mainSource.includes('filled && filled.ok && !filled.recipientCommittedMatch'));
  assert.ok(mainSource.includes('function isFixedAlibabaRecipientVerifierFailure'));
  assert.ok(mainSource.includes("evidence.includes('alibaba_webmail_draft_verification_failed')"));
  assert.ok(mainSource.includes("evidence.includes('ant-select-selection-search-input')"));
  assert.ok(mainSource.includes('.filter(result => !isFixedAlibabaRecipientVerifierFailure(result))'));
  assert.ok(mainSource.includes('composer_preserved_for_technical_evidence:${preserveTabForEvidence}'));
  assert.ok(mainSource.includes('async function executeVerifiedSocialFallbackAfterEmail'));
  assert.ok(mainSource.includes('await executeVerifiedSocialFallbackAfterEmail(lead, emailResult, options)'));
  assert.ok(mainSource.includes("platform === 'email' && !isWebsiteContact && !isVerifiedEmail"));
  assert.ok(mainSource.includes("fallbackPlatform: fallbackLead.platform"));
  assert.match(mainSource, /physical_send\|send_physical_click\|composer_preserved\|customer_interaction/);
  assert.ok(alibabaWebmailSource.includes('recipientValueMatch'));
  assert.ok(alibabaWebmailSource.includes("setValue(recipientInput, recipient)"));
});

test('email execution enforces a per-domain daily safety gate', () => {
  assert.ok(mainSource.includes("require('./email-operations')"));
  assert.ok(mainSource.includes('email_domain_safety_gate'));
  assert.ok(mainSource.includes('email_domain_daily_limit_reached'));
});

test('daily execution ranks verified email then Email, LinkedIn, Facebook and Instagram', () => {
  assert.ok(mainSource.includes('function socialPriorityRank'));
  assert.ok(mainSource.includes('function developmentPriorityCompare'));
  assert.ok(mainSource.includes("if (/\\blinkedin\\b|linkedin\\.com/.test(text)) return 340"));
  assert.ok(mainSource.includes("if (/\\bfacebook\\b|facebook\\.com/.test(text)) return 330"));
  assert.ok(mainSource.includes("if (/\\binstagram\\b|instagram\\.com/.test(text)) return 320"));
  assert.ok(mainSource.includes('return verifiedEmailDelta'));
  assert.ok(mainSource.includes('|| socialPriorityRank(right) - socialPriorityRank(left)'));
  assert.ok(mainSource.includes('...socialPool'));
  assert.ok(mainSource.includes('...websiteFallback.filter'));
  assert.ok(mainSource.includes('.sort(developmentPriorityCompare)'));
});

test('official public business email outranks unverifiable email rows without requiring Hunter or ZeroBounce', () => {
  assert.ok(mainSource.includes('const verifiedEmailDelta = Number(verifiedBusinessEmailTarget(right).ok)'));
  assert.ok(mainSource.includes('|| (recipientEmail(item) && configuredProvider().id)'));
  assert.ok(mainSource.includes('result = await runAlibabaWebmailEmailLead(lead, subject, draft)'));
  assert.ok(mainSource.includes('verifiedBusinessEmailTarget(item).ok'));
  assert.ok(mainSource.includes('const isVerifiedEmail = verifiedBusinessEmailTarget(lead).ok'));
  assert.doesNotMatch(mainSource, /platform === 'email' && verifiedBusinessEmailTarget\(lead\)\.ok/);
  assert.ok(mainSource.includes("'Input.dispatchMouseEvent'"));
  assert.ok(mainSource.includes('alibaba_webmail_send_physical_click_dispatched'));
  assert.ok(mainSource.includes('preserveAutomationChromeTab(chromeOpen)'));
  assert.match(mainSource, /'Input\.insertText', \{\s*text: target\.recipient/);
  assert.ok(mainSource.includes("&& ['website_contact_ready', 'website_contact_unreachable_skip'].includes(result.status)"));
});

test('live first-party machine verification token passes the business email gate', () => {
  const { verifiedBusinessEmailTarget } = require('../outreach-dashboard/alibaba-email-delivery');
  const result = verifiedBusinessEmailTarget({
    publicEmail: 'buyer@example-retailer.com',
    emailVerificationStatus: 'official_public_business_email',
    emailEvidence: 'first_party_live_page',
  });
  assert.equal(result.ok, true);
  assert.equal(result.recipient, 'buyer@example-retailer.com');
});

test('official brand representative directory token passes only for a company-domain email', () => {
  const { verifiedBusinessEmailTarget } = require('../outreach-dashboard/alibaba-email-delivery');
  assert.equal(verifiedBusinessEmailTarget({
    publicEmail: 'mike@allweathersales.ca',
    externalVerificationStatus: 'official_supplier_email_verified',
    emailVerificationStatus: 'official_brand_rep_directory_email',
  }).ok, true);
  assert.equal(verifiedBusinessEmailTarget({
    publicEmail: 'agency@gmail.com',
    externalVerificationStatus: 'official_supplier_email_verified',
    emailVerificationStatus: 'official_brand_rep_directory_email',
  }).ok, false);
});

test('LinkedIn platform engagement follows and likes before sending the approved DM without a public comment', () => {
  assert.match(chromeDriverSource, /platform === 'linkedin'/);
  assert.match(chromeDriverSource, /Follow first and like when a safe visible Like control is available/);
  assert.match(chromeDriverSource, /let follow = await clickOptionalAction\(tab, 'follow', platform\)/);
  const linkedinBranch = chromeDriverSource.match(/else if \(platform === 'linkedin'\) \{([\s\S]*?)\n    \} else \{/);
  assert.ok(linkedinBranch, 'LinkedIn must have a dedicated engagement branch');
  assert.match(linkedinBranch[1], /clickOptionalAction\(tab, 'like'/);
  assert.doesNotMatch(linkedinBranch[1], /submitOptionalComment/);
});

test('cold social outreach performs follow and like but never publishes a public comment', () => {
  const instagramBlock = mainSource.slice(
    mainSource.indexOf('async function prepareInstagramDraft'),
    mainSource.indexOf('function validateLeadTargetForPreparation')
  );
  assert.match(instagramBlock, /autoEngage:\s*true/);
  assert.doesNotMatch(instagramBlock, /autoEngage:\s*false/);
  assert.match(chromeDriverSource, /const allowPublicEngagement = true/);
  assert.match(chromeDriverSource, /if \(allowPublicEngagement && payload\.autoEngage\)/);
  assert.match(chromeDriverSource, /submitInstagramPostEngagement\(tab, ''\)/);
  assert.ok(chromeDriverSource.indexOf('if (!identity || identity.ok !== true)') < chromeDriverSource.indexOf('const allowPublicEngagement = true'));
});

test('engagement-only command follows and likes without opening or sending a message', () => {
  assert.ok(chromeDriverSource.includes("command === 'engage-social-profile'"));
  assert.ok(chromeDriverSource.includes('engagement_only;no_message_action'));
  assert.match(chromeDriverSource, /async function engageSocialProfile[\s\S]*clickOptionalAction\(tab, 'follow'[\s\S]*submitInstagramPostEngagement\(tab, ''\)/);
});

test('external visible-message confirmation is durable and cannot be downgraded by a stale artifact', () => {
  assert.ok(mainSource.includes('function reconcileExternalEvidenceConfirmations'));
  assert.ok(mainSource.includes('external_evidence_confirmation_applied;no_resend_performed'));
  assert.ok(mainSource.includes('strongerConfirmedResultExists'));
  assert.match(mainSource, /strongerConfirmedResultExists && !\['sent_confirmed', 'submitted_confirmed', 'bounced'\]\.includes\(entry\.status\)/);
  const repairBlock = mainSource.slice(mainSource.indexOf('function repairPreSendUnconfirmedResults'), mainSource.indexOf('async function reconcileAlibabaBounceResults'));
  assert.doesNotMatch(repairBlock, /automationCompanyKeys\(entry\)|entry\.status/);
});

test('dashboard executable capacity uses the actual history index fields', () => {
  const readinessBlock = dailyRunnerSource.slice(
    dailyRunnerSource.indexOf('function channelReadinessSummary'),
    dailyRunnerSource.indexOf('function bestVisibleChannel')
  );
  assert.match(readinessBlock, /history\.sameDayDeveloped/);
  assert.match(readinessBlock, /history\.priorDeveloped/);
  assert.match(readinessBlock, /history\.activeCooldown/);
  assert.match(readinessBlock, /companyLeadKeys\(item\)/);
  assert.doesNotMatch(readinessBlock, /sameDayAttempted|permanentlyDeveloped/);
});

test('no-message social profiles are blocked from automatic execution', () => {
  const result = {
    task_id: 'verified-Instagram-triedandtrout',
    target_url: 'https://www.instagram.com/triedandtroutsupply/',
    status: 'failed_open',
    evidence: 'profile_valid_no_message_button',
    timestamp: '2026-07-13T13:10:32.166Z',
  };
  const classified = dailyRunner.classifyTask({
    platform: 'Instagram',
    name: 'triedandtrout',
    company: 'Tried & Trout Supply Co',
    fitScore: 90,
    url: 'https://www.instagram.com/triedandtroutsupply/',
  }, {
    now: Date.parse('2026-07-13T14:00:00.000Z'),
    profiles: {},
    resultsByTask: new Map([
      ['verifiedinstagramtriedandtrout', result],
      ['httpswwwinstagramcomtriedandtroutsupply', result],
      ['profiletriedandtroutsupply', result],
    ]),
    sameDayByCompany: new Map(),
  });
  assert.equal(classified.action, 'blocked_no_message_button');
  assert.equal(classified.reason, 'profile_valid_no_message_button');
  assert.equal(dailyRunner.isActivePotentialCandidate(classified), false);
  assert.ok(mainSource.includes('function hasNoSafeMessageButton'));
  assert.ok(mainSource.includes('.filter(item => !hasNoSafeMessageButton(item) || hasVerifiedInstagramFallback(item))'));
});

test('unsubmitted website preparation does not block a verified social fallback', () => {
  const now = Date.parse('2026-07-09T04:00:00.000Z');
  const websiteAttempt = {
    task_id: 'google-customer-kathmandu-website-contact',
    company: 'Kathmandu',
    status: 'website_contact_ready',
    timestamp: '2026-07-09T03:00:00.000Z',
    target_url: 'https://www.kathmandu.co.nz/contact-us',
    evidence: 'contact_entry_verified;website_contact_form_fields_prepared',
  };
  const index = dailyRunner.knownTouchIndex([websiteAttempt], [], now);
  assert.equal(index.sameDayDeveloped.size, 0);
  assert.equal(index.activeCooldown.size, 0);
  assert.equal(index.priorDeveloped.has('kathmandu'), false);
  assert.equal(index.priorDevelopedDetails.has('kathmandu'), false);
});

test('unsubmitted website preparation allows Summit social development across days', () => {
  const now = Date.parse('2026-07-14T02:00:00.000Z');
  const websiteAttempt = {
    task_id: 'google-customer-summit-international-website-contact',
    status: 'website_contact_ready',
    timestamp: '2026-07-13T12:14:13.609Z',
    target_url: 'https://www.summitint.co/contact/',
    evidence: 'website_contact_entry_not_verified;no_contact_entry_control;public_email_fallback_available:info@summitint.co',
  };
  const history = dailyRunner.knownTouchIndex([websiteAttempt], [], now);
  const classified = dailyRunner.classifyTask({
    platform: 'Instagram',
    name: 'Summit International',
    company: 'Summit International',
    fitScore: 91,
    url: 'https://www.instagram.com/summitint/',
  }, {
    now,
    profiles: {},
    resultsByTask: new Map(),
    sameDayByCompany: history.sameDayDetails,
    priorDevelopmentByCompany: history.priorDevelopedDetails,
  });

  assert.equal(history.priorDeveloped.has('summitinternational'), false);
  assert.equal(classified.action, 'develop');
  assert.equal(classified.reason, 'high_icp_verified_ready');
  assert.equal(classified.lastStatus, '');
});

test('historical development lock distinguishes user interaction from transient browser failure', () => {
  assert.ok(mainSource.includes('facebook\\s*$'));
  assert.equal(dailyRunner.isHistoricalDevelopmentResult({
    status: 'send_unconfirmed',
    evidence: 'linkedin_draft_not_inserted_before_send',
  }), false);
  assert.equal(dailyRunner.isHistoricalDevelopmentResult({
    status: 'send_unconfirmed',
    evidence: 'send_clicked_but_confirmation_missing',
  }), false);
  assert.equal(dailyRunner.isHistoricalDevelopmentResult({
    status: 'send_unconfirmed',
    evidence: 'send_clicked_but_confirmation_missing;verified_draft_present_before_irreversible_action',
  }), true);
  assert.equal(dailyRunner.isHistoricalDevelopmentResult({
    status: 'failed_open',
    evidence: 'chrome_target_not_found',
  }), false);
  assert.equal(dailyRunner.isHistoricalDevelopmentResult({
    status: 'failed_open',
    evidence: 'facebook_message_button_clicked_composer_not_found',
  }), false);
  assert.equal(dailyRunner.isHistoricalDevelopmentResult({
    status: 'failed_open',
    evidence: 'facebook_send_clicked_but_confirmation_missing',
  }), false);
  assert.equal(dailyRunner.isHistoricalDevelopmentResult({
    status: 'failed_open',
    evidence: 'facebook_send_clicked_but_confirmation_missing;verified_draft_present_before_irreversible_action',
  }), true);
});

test('daily potential pool excludes previously touched candidates', () => {
  assert.equal(dailyRunner.isActivePotentialCandidate({
    company: 'Bass Pro Shops',
    action: 'cooldown',
    lastTouch: '2026-07-13T01:00:00.000Z',
    lastStatus: 'sent_confirmed',
  }), false);
  assert.equal(dailyRunner.isActivePotentialCandidate({
    company: 'New Outdoor Retailer',
    action: 'develop',
    platform: 'instagram',
    url: 'https://www.instagram.com/newoutdoorretailer/',
  }), true);
});

test('GLM response parser accepts fenced JSON', () => {
  assert.deepEqual(parseJsonContent('```json\n{"fitScore":88,"verdict":"develop"}\n```'), {
    fitScore: 88,
    verdict: 'develop',
  });
});

test('GLM service returns normalized decision data', async () => {
  const result = await requestGlm({
    apiKey: 'test-key',
    lead: { company: 'Campmor', keyword: 'camping gear wholesale', role: 'camping accessories buyer' },
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({
        model: 'glm-test',
        choices: [{ message: { content: '{"fitScore":90,"verdict":"develop","draft":"Hello Campmor team"}' } }],
      }),
    }),
  });
  assert.equal(result.model, 'glm-test');
  assert.equal(result.result.fitScore, 90);
  assert.match(result.result.draft, /FLEXTAIL/);
  assert.match(result.result.draft, /Campmor/);
  assert.match(result.result.draft, /buyer|category|vendor/i);
});

test('GLM prompt and fallback enforce professional sales copy', () => {
  const messages = leadMessages({ company: 'Bass Pro Shops', keyword: 'camping accessories' });
  assert.match(messages[0].content, /senior global channel sales operator/);
  assert.match(messages[0].content, /55-90 English words/);
  assert.match(messages[0].content, /Flextail and Vollyc/);
  assert.match(messages[0].content, /36\+ new SKUs/);
  assert.match(messages[0].content, /customized to the exact customer persona/);
  assert.match(messages[0].content, /highest chance of a reply and a booked phone\/video meeting/);
  const draft = professionalSalesDraft({
    company: 'Bass Pro Shops',
    keyword: 'camping accessories',
    role: 'category merchant',
  }, 'Happy to share details at your convenience.');
  assert.match(draft, /FLEXTAIL/);
  assert.match(draft, /camping accessories/);
  assert.match(draft, /36\+ new SKUs/);
  assert.match(draft, /intro video meeting|vendor\/category review/);
  assert.doesNotMatch(draft, /Happy to share details at your convenience/i);
});

test('GLM messages include lead-specific persona and conversion objective', () => {
  const messages = leadMessages({
    company: 'Outdoor Import Group',
    keyword: 'camping gear distributor',
    role: 'regional importer',
    background: 'Distributor for outdoor retail channels',
  });
  const payload = JSON.parse(messages[1].content);
  assert.equal(payload.inferredPersona.type, 'distributor/importer');
  assert.match(payload.inferredPersona.angle, /regional sell-through/);
  assert.match(payload.conversionObjective, /maximize reply rate/);
  assert.match(payload.schema.draft, /customer-persona-specific/);
});

test('message template API retains the approved FLEXTAIL brand references', () => {
  assert.ok(templateSource.includes('Flextail & Vollyc'));
  assert.ok(templateSource.includes('36+ new SKUs'));
  assert.ok(templateSource.includes('https://www.flextail.com/'));
  assert.ok(templateSource.includes('Leo@flextailgear.com'));
});

test('Google discovery preserves LinkedIn information while creating executable social and website channels', () => {
  const leads = buildLeads(60);
  const cabela = leads.filter(item => item.company === "Cabela's");
  assert.ok(cabela.some(item => item.platform === 'instagram' && /instagram\.com\/cabelas/i.test(item.url)));
  assert.ok(cabela.some(item => item.platform === 'facebook' && /facebook\.com\/Cabelas/i.test(item.url)));
  const websiteLead = cabela.find(item => item.platform === 'website_form');
  assert.equal(websiteLead.action, 'email_priority');
  assert.equal(websiteLead.emailFrom, 'leo@flextailgear.com');
  assert.equal(websiteLead.websiteContactSubject, 'FLEXTAIL retail partnership | 2026 assortment');
  assert.match(websiteLead.websiteContactMessage, /Dear Cabela's Team/);
  assert.match(websiteLead.websiteContactMessage, /category buyer or vendor-onboarding team/);
  assert.match(websiteLead.websiteContactMessage, /https:\/\/www\.flextail\.com\//);
  assert.doesNotMatch(websiteLead.websiteContactMessage, /Attached|attachment/i);
  const wordCount = websiteLead.websiteContactMessage.trim().split(/\s+/).length;
  assert.ok(wordCount >= 90 && wordCount <= 140, `expected 90-140 words, received ${wordCount}`);
  assert.equal(websiteLead.publicEmail, 'vendorrelations@basspro.com');
  assert.match(websiteLead.linkedinUrl, /linkedin\.com/);
  assert.match(websiteLead.vendorPortal, /cabelas|basspro/i);
  assert.match(websiteLead.companyScale, /employee|retail|locations/i);
  assert.match(websiteLead.contactSearchUrl, /contact|buyer|wholesale|vendor/i);
  assert.ok(websiteLead.alternateChannels.instagram);
  assert.ok(websiteLead.alternateChannels.facebook);
  assert.ok(websiteLead.alternateChannels.linkedin);
});

test('Google discovery reroutes known broken Instagram links to alternate channels', () => {
  const leads = buildLeads(100);
  assert.equal(leads.some(item => item.id === 'google-customer-sail-outdoors-instagram'), false);
  const sailContact = leads.find(item => item.id === 'google-customer-sail-outdoors-website-contact');
  assert.ok(sailContact);
  assert.equal(sailContact.alternateChannels.instagram, '');
  assert.equal(sailContact.invalidChannels.instagram.status, 'broken_profile_url');
});

test('Google discovery blocks known personal or mismatched Instagram handles', () => {
  const leads = buildLeads(120);
  assert.equal(leads.some(item => item.id === 'google-customer-summit-international-instagram'), false);
  const summitContact = leads.find(item => item.id === 'google-customer-summit-international-website-contact');
  assert.ok(summitContact);
  assert.equal(summitContact.contactUrl, 'https://www.summitint.co/contact/');
  assert.equal(summitContact.publicEmail, 'info@summitint.co');
  assert.equal(summitContact.invalidChannels.instagram.status, 'broken_profile_url');
});

test('Google discovery accepts a social handle cross-verified by the official company website', () => {
  assert.ok(discoverySource.includes('officialSocialProfileVerified: true'));
  assert.ok(discoverySource.includes('if (!item.officialSocialProfileVerified'));
  assert.ok(discoverySource.includes('officialSocialProfileVerified: item.officialSocialProfileVerified === true'));
  assert.ok(mainSource.includes('officialProfileVerified: Boolean(lead && lead.officialSocialProfileVerified)'));
  assert.ok(chromeDriverSource.includes('identityCheckExpression(payload.expectedCompany, payload.targetUrl, payload.officialProfileVerified)'));
});

test('Google discovery blocks known unavailable Facebook pages before queue generation', () => {
  const leads = buildLeads(120);
  assert.equal(leads.some(item => item.id === 'google-customer-sail-outdoors-facebook'), false);
  assert.equal(leads.some(item => item.id === 'google-customer-summit-international-facebook'), false);
  const sailContact = leads.find(item => item.id === 'google-customer-sail-outdoors-website-contact');
  const summitContact = leads.find(item => item.id === 'google-customer-summit-international-website-contact');
  assert.equal(sailContact.alternateChannels.facebook, '');
  assert.equal(summitContact.alternateChannels.facebook, '');
  assert.equal(sailContact.invalidChannels.facebook.status, 'broken_profile_url');
  assert.equal(summitContact.invalidChannels.facebook.status, 'broken_profile_url');
});

test('Google discovery autonomously refills verified agency and key-account candidates above ICP 70', () => {
  const leads = buildLeads(120);
  const refillLeads = leads.filter(item => item.discoveryMode === 'autonomous_refill');
  assert.ok(refillLeads.some(item => item.customerType === 'agency'));
  assert.ok(refillLeads.some(item => item.customerType === 'key_account'));
  assert.ok(refillLeads.every(item => Number(item.fitScore) > 70));
  assert.ok(refillLeads.every(item => /^https:\/\//.test(item.website || '')));
  assert.ok(refillLeads.every(item => /^https:\/\//.test(item.contactUrl || item.url || '')));
});

test('Google discovery loads auditable external supplier routes without treating homepages as contact evidence', () => {
  const leads = buildLeads(650);
  const outdoorNature = leads.find(item => item.id === 'google-customer-outdoor-nature-website-contact');
  const leftPoint = leads.find(item => item.id === 'google-customer-left-point-distribution-website-contact');
  const flameOutdoors = leads.find(item => item.id === 'google-customer-flameoutdoors-website-contact');
  const obelink = leads.find(item => item.id === 'google-customer-obelink-website-contact');

  assert.ok(outdoorNature);
  assert.equal(outdoorNature.platform, 'website_form');
  assert.equal(outdoorNature.action, 'email_priority');
  assert.equal(outdoorNature.contactUrl, 'https://www.outdoornature.com.au/become-a-supplier/');
  assert.equal(outdoorNature.sourceEvidenceUrl, outdoorNature.contactUrl);
  assert.equal(outdoorNature.discoveryMode, 'autonomous_refill');

  assert.ok(leftPoint);
  assert.equal(leftPoint.customerType, 'agency');
  assert.equal(leftPoint.sourceEvidenceUrl, 'https://www.leftpointdistribution.com/en-eu/aboutus.php');

  assert.ok(flameOutdoors);
  assert.equal(flameOutdoors.publicEmail, 'sales@flameoutdoors.com');
  assert.equal(flameOutdoors.sourceEvidenceUrl, 'https://flameoutdoors.com/pages/authorized-dealer');

  assert.ok(obelink);
  assert.equal(obelink.action, 'email_priority');
  assert.equal(obelink.contactUrl, 'https://www.obelink.nl/obelink-partnerprogramma');
  assert.equal(obelink.sourceEvidenceUrl, obelink.contactUrl);
});

test('daily queue preserves official email provenance needed by the Alibaba execution gate', () => {
  assert.ok(dailyRunnerSource.includes("contactEmail: task.contactEmail || task.publicEmail || ''"));
  assert.ok(dailyRunnerSource.includes("emailVerificationStatus: task.emailVerificationStatus || ''"));
  assert.ok(dailyRunnerSource.includes("emailEvidence: task.emailEvidence || ''"));
  assert.ok(dailyRunnerSource.includes("evidenceUrl: task.evidenceUrl || ''"));
});

test('Google discovery promotes a first-party general-business email above a failed website or social route', () => {
  const leads = buildLeads(650);
  const tiso = leads.find(item => item.company === 'Tiso' && item.platform === 'website_form');

  assert.ok(tiso);
  assert.equal(tiso.contactEmail, 'mail@tiso.co.uk');
  assert.equal(tiso.emailVerificationStatus, 'official_public_business_email');
  assert.equal(tiso.emailEvidence, 'official_contact_page');
  assert.equal(tiso.emailEvidenceUrl, 'https://www.tiso.com/pages/contact');
  assert.equal(tiso.action, 'email_priority');
});

test('Google discovery preserves newly verified independent-retailer routing emails and evidence', () => {
  const leads = buildLeads(650);
  const expected = new Map([
    ['Bentgate Mountaineering', ['bentgate@bentgate.com', 'https://www.bentgate.com/service/']],
    ['Valhalla Pure Outfitters', ['vancouver@vpo.ca', 'https://vpo.ca/stores/vpo-vancouver']],
    ['The Mountaineer', ['mountaineer@mountaineer.com', 'https://mountaineer.com/privacy-policy/']],
    ['La Cordee', ['info@lacordee.com', 'https://www.lacordee.com/en/pages/contact-us']],
    ['AvidMax Outfitters', ['customerservice@avidmax.com', 'https://www.avidmax.com/contact-us/']],
    ['Neptune Mountaineering', ['info@neptunemountaineering.com', 'https://www.neptunemountaineering.com/pages/customer-support']],
    ["Bill & Paul’s Sporthaus", ['customerservice@billandpauls.com', 'https://billandpauls.com/pages/hours-and-location']],
    ['Kenco Outfitters', ['Support@kencooutfitters.com', 'https://kencooutfitters.com/pages/rewards']],
    ['Great Outdoor Provision Co.', ['shop@greatoutdoorprovision.com', 'https://www.greatoutdoorprovision.com/pages/faqs-policies']],
    ['Alpine Shop', ['customercare@alpineshop.com', 'https://dev.alpineshop.com/images/contrail/File/packslip_page1.pdf']],
    ["Jesse Brown's Outdoors", ['jesse@jessebrowns.com', 'https://shop.jessebrowns.com/pages/contact']],
    ['Travel Country Outfitters', ['info@TravelCountry.com', 'https://www.travelcountry.com/shop/Action/Info_Show/Id/42']],
    ['The Benchmark Outdoor Outfitters', ['info@benchmarkoutfitter.com', 'https://www.benchmarkoutfitter.com/service/']],
    ['Appalachian Outfitters', ['cs@appalachianoutfitters.com', 'https://www.appalachianoutfitters.com/policies/contact-information']],
    ['Roads Rivers and Trails', ['rrt@roadsriversandtrails.com', 'https://roadsriversandtrails.com/trip-planning/']],
    ["Bill Jackson's Shop for Adventure", ['camping@billjacksons.com', 'https://www.billjacksons.com/class/thru-hike-clinic-2025/']],
    ['Pack and Paddle', ['info@packpaddle.com', 'https://packpaddle.com/contact-us/']],
    ['Outdoor World Direct', ['info@outdoorworlddirect.co.uk', 'https://www.outdoorworlddirect.co.uk/contact']],
    ['Survive & Thrive', ['info@survive-thrive.com', 'https://www.survive-thrive.com/']],
    ['Exploration Wild', ['info@explorationwild.com', 'https://explorationwild.com/pages/about-us']],
    ['Lost Wave', ['info@lost-wave.com', 'https://www.lost-wave.com/about']],
    ['Camping Travel Store', ['info@campingtravelstore.co.uk', 'https://www.campingtravelstore.co.uk/contact-us']],
    ['Newquay Camping & Leisure', ['info@newquaycampingshop.co.uk', 'https://newquaycampingshop.com/pages/contact-us']],
    ['Old School Outdoor', ['info@oldschooloutdoor.com', 'https://oldschooloutdoor.com/pages/contact']],
    ['Kermode Overland', ['info@kermodeoverland.com', 'https://kermodeoverland.com/contact-us/']],
    ['Outcamping', ['info@outcamping.co.uk', 'https://outcamping.co.uk/pages/about-us']],
    ['Equipment Outdoors', ['info@equipmentoutdoors.co.uk', 'https://www.equipmentoutdoors.co.uk/']],
    ['Action Outdoors', ['info@actionoutdoors.co.uk', 'https://www.actionoutdoors.co.uk/about/']],
    ['Outdoors Plus', ['info@outdoorsplus.ca', 'https://outdoorsplus.ca/services/camping/']],
    ['Canada Outdoors', ['info@canadaoutdoors.com', 'https://www.canadaoutdoors.com/pages/customer-service']],
    ['Backcountry Sportsman', ['info@backcountrysportsman.com', 'https://backcountrysportsmanoutfitters.com/']],
    ['Purely Outdoors', ['info@purelyoutdoors.co.uk', 'https://www.purelyoutdoors.co.uk/showroom.htm']],
    ['Grasshopper Leisure', ['info@grasshopperleisure.co.uk', 'https://www.grasshopperleisure.co.uk/']],
    ['The Outdoor Shop Lewes', ['info@outdoorshoplewes.co.uk', 'https://www.outdoorshoplewes.co.uk/']],
    ['Westside Stores', ['info@westsidestores.ca', 'https://westsidestores.ca/pages/about-us.html']],
    ['Switching Gear', ['info@switchinggear.ca', 'https://www.switchinggear.ca/About.html']],
    ["Mawson's Sports", ['info@mawsons.ca', 'https://mawsons.ca/']],
    ['Spry', ['info@spryactive.ca', 'https://spryactive.ca/pages/about']],
    ['Pack Gear Go', ['sales@packgeargo.co.nz', 'https://www.packgeargo.co.nz/contact/']],
    ['Gearshop', ['sales@gearshop.co.nz', 'https://www.gearshop.co.nz/pages/contact']],
    ['Lifestyle Gear', ['info@lifestylegear.co.nz', 'https://lifestylegear.co.nz/pages/contact']],
    ['Tight Lines', ['service@tightlines.co.nz', 'https://tightlines.co.nz/pages/about-us']],
    ['Outdoor Shop NZ', ['info@outdoorshop.nz', 'https://outdoorshop.nz/pages/contact-us']],
    ['Dwights Outdoors', ['online@dwights.co.nz', 'https://dwights.co.nz/pages/contact-us']],
    ['Outdoor eStore', ['service@outdoorestore.co.nz', 'https://www.outdoorestore.co.nz/pages/contact-us']],
    ['Camping Country Superstore', ['sales@campingcountry.com.au', 'https://campingcountry.com.au/about-us/']],
    ['West End Outdoors', ['support@westendoutdoors.co.uk', 'https://www.westendoutdoors.co.uk/policies/contact-information']],
    ['Vamos Outdoors', ['info@vamosoutdoors.ca', 'https://vamosoutdoors.ca/']],
    ['WeyFarm Outdoors', ['info@weyfarm-outdoors.co.uk', 'https://weyfarm-outdoors.co.uk/']],
    ['Great Western Camping', ['sales@greatwesterncamping.co.uk', 'https://www.greatwesterncamping.co.uk/contact']],
    ['Camping World UK', ['sales@campingworld.co.uk', 'https://www.campingworld.co.uk/us/Visit-and-Contact-Us/cc-339.aspx']],
    ['Outdoors Ramsey', ['sales@outdoorsramsey.co.uk', 'https://www.outdoorsramsey.co.uk/outdoor-shop-in-ramsey-isle-of-man/']],
    ['Castleberg Outdoors', ['enquiries@castlebergoutdoors.co.uk', 'https://www.castlebergoutdoors.co.uk/about-castleberg-outdoors']],
    ['WM Camping', ['customerservices@wmcamping.co.uk', 'https://wmcamping.co.uk/pages/contact-us']],
    ["MD Outdoors", ["info@mdoutdoors.co.nz", "https://www.mdoutdoors.co.nz/pages/contact-us"]],
    ["Mc's Outdoor Store", ["info@mcsoutdoorstore.ie", "https://www.mcsoutdoorstore.ie/contact-us/"]],
    ["Sportsden", ["info@sportsden.ie", "https://www.sportsden.ie/pages/contact-us"]],
    ["MacEoin General Merchants", ["info@maceoinltd.com", "https://www.maceoinltd.com/"]],
    ["Outdoor Adventure Store", ["online@oas.ie", "https://outdooradventurestore.ie/pages/about-us"]],
    ["S.K Camping & Leisure", ["info@skcamping.com", "https://www.skcamping.com/"]],
    ["Black & White Outdoors", ["sales@blackandwhiteoutdoors.com", "https://blackandwhiteoutdoors.com/contact-us/"]],
    ["NZ Outdoors", ["info@nz-outdoors.co.nz", "https://www.nz-outdoors.co.nz/pages/support"]],
    ["Craze Outdoors", ["support@crazeoutdoors.com", "https://crazeoutdoors.com/pages/contact-us"]],
    ["Charles Camping", ["info@charlescamping.ie", "https://www.charlescamping.ie/contact-us"]],
    ["Portwest The Outdoor Shop", ["sales@theoutdoorshop.ie", "https://www.theoutdoorshop.ie/pages/contact-us"]],
    ["Basecamp Dublin", ["info@basecamp.ie", "https://basecamp.ie/pages/privacy-policy"]],
    ["JSJ Camping & Garden", ["info@jsj-bv.com", "https://jsj-bv.com/"]],
    ["Veneboer Camping & Outdoor", ["info@veneboercamping.nl", "https://www.veneboercamping.nl/contact"]],
    ["GetCamping", ["info@getcamping.se", "https://www.getcamping.eu/en/info/about-us/"]],
    ["Outdoordump", ["info@outdoordump.nl", "https://outdoordump.nl/contact/"]],
    ["OutdoorHaven", ["info@outdoorhaven.nl", "https://outdoorhaven.nl/"]],
    ["Huna Outdoor", ["info@hunaoutdoor.nl", "https://hunaoutdoor.nl/"]],
    ["Expedition Store Sweden", ["info@expeditionstore.se", "https://expeditionstore.se/pages/contact-us"]],
    ["Van Os Imports", ["info@vanosimports.nl", "https://www.vanosimports.com/en/grid/outdoor"]],
    ["De Campingwinkel", ["info@decampingwinkel.be", "https://decampingwinkel.be/contact/"]],
    ["Camps Store Diest", ["info@campsstore.be", "https://www.campsstore.be/contact"]],
    ["Klima Outdoor", ["schwarte@drshop24.de", "https://klima-outdoor.de/pages/contact"]],
    ["CanvasCamp", ["info@canvascamp.com", "https://www.canvascamp.com/en/contact-us"]],
    ["High Peak Outdoor", ["service@simexoutdoor.com", "https://www.highpeak-outdoor.com/kontakt.html"]],
    ["Der Freistaat Mega Store", ["webshop@derfreistaat.de", "https://shop.derfreistaat.de/de/kontakt/"]],
    ["Van Dijk Outdoor & Recreatie", ["webshop@autodaktenten.be", "https://autodaktenten-webshop.be/pages/contact"]],
    ["MK Outdoor", ["service@mkoutdoor.de", "https://www.mkoutdoor.de/Impressum/"]],
    ["Kampersport", ["info@kampersport.com", "https://kampersport.com/nous-contacter/"]],
    ["Shopping4Camping", ["info@shopping4.be", "https://www.shopping4camping.be/pages/contact-bereikbaarheid"]],
    ["De Kampeerder", ["info@dekampeerder.be", "https://dekampeerder.be/"]],
    ["Campingudstyr.dk", ["info@campingudstyr.dk", "https://www.campingudstyr.dk/contact"]],
    ["Naturligvis Outdoor", ["mail@naturligvis.com", "https://www.naturligvis.com/side/kontakt"]],
    ['Kittery Trading Post', ['info@ktp.com', 'https://www.kitterytradingpost.com/customer-service/cookie-policy/']],
    ['Spejder Sport', ['kundeservice@spejdersport.dk', 'https://www.spejdersport.dk/handelsbetingelser/']],
    ['Hardloop', ['hello@hardloop.fr', 'https://www.hardloop.fr/article/671-acupression-tout-savoir']],
    ['Trekitt', ['support@trekitt.co.uk', 'https://www.trekitt.co.uk/pages/contact/']],
    ['Barrabes', ['customerservice@barrabes.com', 'https://www.barrabes.com/en/help/contact']],
    ['Snowleader', ['contact@snowleader.com', 'https://images.snowleader.com/media/wysiwyg/Global-Blue-fr.pdf']],
    ['SportPursuit', ['team@sportpursuit.com', 'https://www.sportpursuit.com/terms-conditions']],
    ['Tahoe Sports Hub', ['tahoesportshub@gmail.com', 'https://www.tahoesportshub.com/contact']],
    ['J&H Outdoors', ['web@jhoutdoors.com', 'https://jhoutdoors.com/pages/faq']],
    ['The Trail Head', ['info@trailheadmontana.net', 'https://trailheadmontana.net/']],
    ["Hilton's Tent City", ['support@hiltonstentcity.com', 'https://www.hiltonstentcity.com/pages/returns-exchanges']],
  ]);

  for (const [company, [email, evidenceUrl]] of expected) {
    const lead = leads.find(item => item.company === company && item.platform === 'website_form');
    assert.ok(lead, company);
    assert.equal(lead.contactEmail, email);
    assert.equal(lead.emailVerificationStatus, 'official_public_business_email');
    assert.equal(lead.emailEvidenceUrl, evidenceUrl);
    assert.equal(lead.action, 'email_priority');
  }
});

test('Google discovery keeps a refill pool for new prospects after current customers are developed', () => {
  const run = buildDiscoveryRun(320);
  assert.ok(run.candidatePoolCount >= 23);
  assert.ok(run.qualifiedNonPartnerCompanyCount >= 8);
  assert.ok(run.activeCustomerExcludedCount >= 3);
  for (const company of ['Backcountry', 'evo', 'Mountain Warehouse', 'Snowys Outdoors']) {
    const companyLeads = run.leads.filter(item => item.company === company);
    assert.ok(companyLeads.length > 0, company);
    assert.ok(companyLeads.every(item => item.discoveryMode === 'autonomous_refill'));
    assert.ok(companyLeads.every(item => !item.doNotOutreach));
    assert.ok(companyLeads.some(item => item.platform === 'instagram' || item.platform === 'facebook'));
  }
});

test('Google discovery preserves first-seen and profile timestamps across refreshes', () => {
  const initial = buildDiscoveryRun(120);
  const target = initial.leads.find(item => item.company === 'Backcountry');
  const firstSeen = '2026-07-01T01:02:03.000Z';
  const firstProfiled = '2026-07-02T01:02:03.000Z';
  const refreshed = buildDiscoveryRun(120, {
    generatedAt: '2026-07-03T01:02:03.000Z',
    leads: [{ ...target, discoveredAt: firstSeen, profiledAt: firstProfiled }],
  });
  const refreshedTarget = refreshed.leads.find(item => item.id === target.id);

  assert.equal(refreshedTarget.discoveredAt, firstSeen);
  assert.equal(refreshedTarget.profiledAt, firstProfiled);
  assert.ok(refreshed.leads.every(item => Number.isFinite(Date.parse(item.discoveredAt))));
});

test('online directory refill adds Flextail and Vollyc matched outdoor retailers with evidence', () => {
  const run = buildDiscoveryRun(200);
  assert.ok(run.refillCandidateCount >= 50);
  assert.ok(run.leads.some(item => item.company === 'Garage Grown Gear'));
  assert.ok(run.leads.some(item => item.company === 'Obelink'));
  const garage = run.leads.find(item => item.company === 'Garage Grown Gear');
  assert.match(garage.sourceEvidenceUrl, /^https:\/\/(www\.)?garagegrowngear\.com\//);
  assert.doesNotMatch(garage.sourceEvidenceUrl, /google\.com|outdoorretailer\.com/);
  assert.match(garage.discoverySourceUrl, /outdoorretailer\.com\/retailers-of-interest/);
});

test('homepage-only directory prospects require contact-path verification before execution', () => {
  const run = buildDiscoveryRun(200);
  const website = run.leads.find(item => item.company === 'Garage Grown Gear' && item.platform === 'website_form');
  assert.equal(website.action, 'verify_target');
  assert.equal(website.reason, 'homepage_only_contact_path_requires_verification');
});

test('Google discovery gives autonomous refill customers social channels before website contact', () => {
  const leads = buildLeads(150);
  for (const company of ['Liberty Mountain', 'Sportsman\'s Warehouse', 'Camping World']) {
    const companyLeads = leads.filter(item => item.company === company);
    assert.ok(companyLeads.some(item => item.platform === 'instagram'));
    assert.ok(companyLeads.some(item => item.platform === 'facebook'));
    assert.ok(companyLeads.findIndex(item => item.platform === 'instagram')
      < companyLeads.findIndex(item => item.platform === 'website_form'));
    assert.ok(companyLeads.findIndex(item => item.platform === 'facebook')
      < companyLeads.findIndex(item => item.platform === 'website_form'));
  }
  const summitLeads = leads.filter(item => item.company === 'Summit International');
  assert.ok(!summitLeads.some(item => item.platform === 'facebook'));
  assert.ok(!summitLeads.some(item => item.platform === 'instagram'));
  assert.ok(summitLeads.some(item => item.platform === 'website_form'));
});

test('daily queue preserves multi-channel outreach and ranks email before social channels', () => {
  const filtered = dailyRunner.preferSocialChannels([
    {
      id: 'google-customer-sail-outdoors-website-contact',
      company: 'Sail Outdoors',
      platform: 'website_form',
      url: 'https://www.sail.ca/en/contact-us',
      reason: 'official_website_contact_channel',
    },
    {
      id: 'google-customer-sail-outdoors-instagram',
      company: 'Sail Outdoors',
      platform: 'instagram',
      url: 'https://www.instagram.com/sailoutdoors/',
    },
    {
      id: 'google-customer-sail-outdoors-facebook',
      company: 'Sail Outdoors',
      platform: 'facebook',
      url: 'https://www.facebook.com/SAILoutdoors',
    },
    {
      id: 'google-customer-liberty-mountain-website-contact',
      company: 'Liberty Mountain',
      platform: 'website_form',
      url: 'https://libertymountain.com/find-a-rep',
      reason: 'official_website_contact_channel',
    },
  ]);
  assert.ok(filtered.some(item => item.id === 'google-customer-sail-outdoors-facebook'));
  assert.ok(filtered.some(item => item.id === 'google-customer-sail-outdoors-instagram'));
  assert.ok(filtered.some(item => item.id === 'google-customer-sail-outdoors-website-contact'));
  assert.ok(filtered.some(item => item.id === 'google-customer-liberty-mountain-website-contact'));
  assert.deepEqual(filtered.slice(0, 2).map(item => item.platform), ['website_form', 'website_form']);
  assert.ok(filtered.findIndex(item => item.id === 'google-customer-sail-outdoors-website-contact')
    < filtered.findIndex(item => item.id === 'google-customer-sail-outdoors-facebook'));
  assert.ok(filtered.findIndex(item => item.id === 'google-customer-sail-outdoors-facebook')
    < filtered.findIndex(item => item.id === 'google-customer-sail-outdoors-instagram'));
});

test('Google discovery marks active customers as partner accounts only', () => {
  const leads = buildLeads(120);
  for (const company of ['REI Co-op', 'Academy Sports + Outdoors', 'SCHEELS']) {
    const customerLeads = leads.filter(item => item.company === company);
    assert.ok(customerLeads.length > 0);
    assert.ok(customerLeads.every(item => item.doNotOutreach));
    assert.ok(customerLeads.every(item => item.action === 'partner_account'));
    assert.ok(customerLeads.every(item => item.sendStatus === 'partner_account'));
    assert.ok(customerLeads.every(item => item.partnershipStatus === 'active_partner'));
  }
});

test('daily queue partner guard recognizes existing customer aliases', () => {
  assert.equal(dailyRunner.isKnownPartnerCompany({
    id: 'google-customer-academy-sports-outdoors-website-contact',
    company: 'Academy Sports + Outdoors',
    website: 'https://www.academy.com/',
  }), true);
  assert.equal(dailyRunner.isKnownPartnerCompany({
    id: 'google-customer-acadamy-sports-outdoors-website-contact',
    company: 'Acadamy Sports Outdoors',
    website: 'https://www.academy.com/',
  }), true);
  assert.equal(dailyRunner.isKnownPartnerCompany({
    id: 'google-customer-scheels-website-contact',
    company: 'SCHEELS',
    website: 'https://www.scheels.com/',
  }), true);
  assert.equal(dailyRunner.isKnownPartnerCompany({
    id: 'google-customer-rei-website-contact',
    company: 'REI',
    website: 'https://www.rei.com/',
  }), true);
  assert.equal(dailyRunner.isKnownPartnerCompany({
    id: 'google-customer-innpro-robert-bledowski-sp-z-o-o-linkedin',
    company: 'INNPRO Robert Błędowski Sp. z o.o.',
    website: 'https://innpro.eu/',
  }), true);
});

test('INNPRO exclusive markets are blocked even when source data says open', () => {
  for (const country of ['Switzerland', 'Romania', 'Greece', 'Hungary']) {
    const classified = dailyRunner.classifyTask({
      id: `protected-${country.toLowerCase()}`,
      company: 'Prospective Distributor',
      platform: 'linkedin',
      country,
      marketStatus: 'open',
      agencyState: 'open',
      fitScore: 99,
      url: 'https://www.linkedin.com/company/prospective-distributor/',
    }, emptyClassificationContext());
    assert.equal(classified.action, 'skip_exclusive_agency');
    assert.equal(classified.agencyState, 'exclusive');
  }
});

test('European large distributor candidates are high ICP and social first', () => {
  const leads = buildLeads(200);
  for (const company of ['Aqipa', 'Esprinet Group', 'CMS Distribution', 'EET Group', 'KOMSA']) {
    const companyLeads = leads.filter(item => item.company === company);
    assert.ok(companyLeads.length > 0, `${company} should be in the discovery pool`);
    assert.ok(companyLeads.every(item => item.fitScore > 70));
    assert.ok(companyLeads.every(item => item.customerType === 'agency'));
    assert.ok(companyLeads.every(item => /Switzerland/.test(item.excludedMarkets)));
  }
  assert.ok(leads.some(item => item.company === 'Esprinet Group' && item.platform === 'linkedin'));
  assert.ok(leads.some(item => item.company === 'CMS Distribution' && item.platform === 'linkedin'));
  assert.ok(leads.some(item => item.company === 'EET Group' && item.platform === 'website_form' && /become-a-supplier/.test(item.contactUrl)));
  assert.ok(leads.some(item => item.company === 'KOMSA' && item.platform === 'linkedin'));
  assert.ok(leads.some(item => item.company === 'Aqipa' && item.platform === 'website_form' && /support\.aqipa\.com/.test(item.contactUrl)));
});

test('Aqipa carries verified analyst-grade research into every channel lead', () => {
  const discovery = buildDiscoveryRun(400);
  const aqipa = discovery.leads.find(item => item.company === 'Aqipa');
  assert.ok(aqipa);
  assert.equal(aqipa.fitScore, 98);
  assert.equal(aqipa.founded, '1990');
  assert.match(aqipa.headquarters, /Kundl.*Austria/);
  assert.match(aqipa.businessModel, /Value-Added Distributor/);
  assert.match(aqipa.executiveConclusion, /not an Entry \/ Niche prospect/);
  assert.ok(Array.isArray(aqipa.dataSources));
  assert.ok(aqipa.dataSources.length >= 4);
});

test('Email-first sorting keeps LinkedIn company profiles as distinct queue targets', () => {
  const sorted = dailyRunner.preferSocialChannels([
    { id: 'esprinet', company: 'Esprinet Group', platform: 'linkedin', url: 'https://www.linkedin.com/company/esprinet-group/', dealProbabilityScore: 250 },
    { id: 'cms', company: 'CMS Distribution', platform: 'linkedin', url: 'https://www.linkedin.com/company/cms-distribution', dealProbabilityScore: 248 },
    { id: 'cms-email', company: 'CMS Distribution', platform: 'website_form', url: 'https://www.cmsdistribution.com/contact-us', dealProbabilityScore: 248 },
  ]);
  assert.deepEqual(sorted.map(item => item.id), ['cms-email', 'esprinet', 'cms']);
  assert.ok(dailyRunnerSource.includes("const rank = { email: 0, linkedin: 1, facebook: 2, instagram: 3 }"));
  assert.ok(dailyRunnerSource.includes("const regionRank = { europe: 0, oceania: 1, americas: 2 }"));
});

test('dashboard protection overlay keeps all four INNPRO markets exclusive', () => {
  assert.ok(marketProtectionSource.includes("'瑞士'"));
  assert.ok(marketProtectionSource.includes("'罗马尼亚'"));
  assert.ok(marketProtectionSource.includes("'希腊'"));
  assert.ok(marketProtectionSource.includes("'匈牙利'"));
  assert.ok(marketProtectionSource.includes('INNPRO Robert Błędowski Sp. z o.o.'));
});

test('Google discovery run reports autonomous refill coverage and strict ICP threshold', () => {
  const run = buildDiscoveryRun(120);
  assert.equal(run.qualifiedThreshold, 70);
  assert.equal(run.discoveryRefillAttempted, true);
  assert.ok(run.refillCandidateCount >= 4);
  assert.ok(run.refillByCustomerType.agency >= 1);
  assert.ok(run.refillByCustomerType.key_account >= 1);
  assert.ok(run.leads
    .filter(item => item.discoveryMode === 'autonomous_refill')
    .every(item => item.fitScore > run.qualifiedThreshold));
});

test('daily queue artifacts expose autonomous discovery refill metadata', () => {
  assert.ok(dailyRunnerSource.includes('discoveryRefill'));
  assert.ok(dailyRunnerSource.includes('discoveryRefillAttempted'));
  assert.ok(dailyRunnerSource.includes('refillCandidateCount'));
});

test('daily automation targets one hundred high-ICP prospects by default', () => {
  assert.ok(dailyRunnerSource.includes('const DEFAULT_DAILY_LIMIT = 100'));
  assert.ok(dailyRunnerSource.includes('buildVisibleTodayQueue(discoveryRun, context, DEFAULT_DAILY_LIMIT)'));
  assert.ok(dailyRunnerSource.includes('discoveryQueue(DEFAULT_DAILY_LIMIT, context)'));
  assert.ok(dailyRunnerSource.includes("['develop', Math.max(DEFAULT_DAILY_LIMIT"));
});

test('daily execution treats an already reached hard cap as a successful safe stop', () => {
  assert.ok(mainSource.includes("executionPhase: 'daily_cap_reached'"));
  assert.ok(mainSource.includes("reportingVerdict: 'daily_target_already_reached'"));
  assert.ok(mainSource.includes('Daily target already reached at ${confirmedToday}/${DAILY_CONFIRMED_COMPANY_TARGET}'));
  assert.ok(mainSource.includes('const dailyTargetReached = Number(confirmedToday || 0) >= target'));
});

test('potential pool capacity counts distinct companies instead of channel rows', () => {
  const poolStart = dailyRunnerSource.indexOf('function buildDailyPotentialPool');
  const poolEnd = dailyRunnerSource.indexOf('function channelReadinessSummary', poolStart);
  const poolSource = dailyRunnerSource.slice(poolStart, poolEnd);
  assert.match(poolSource, /const companyRows = new Map\(\)/);
  assert.match(poolSource, /slugKey\(item\.company \|\| item\.name \|\| item\.id\)/);
  assert.match(poolSource, /const distinctCompanies = \[\.\.\.companyRows\.values\(\)\]/);
  assert.match(outreachPolicySource, /measured in distinct companies, never channel rows/);
  assert.match(optimizedPromptSource, /by distinct normalized companies, not channel rows/);
  assert.match(outreachPolicySource, /replenish it with net-new ICP-qualified companies/);
  assert.match(optimizedPromptSource, /Treat capacity as a replenishable supply/);
  assert.match(optimizedPromptSource, /Never manufacture "unlimited capacity" by deleting history/);
});

test('daily discovery emits the full verified channel pool and reports executable capacity', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'package.json'), 'utf8'));
  assert.match(packageJson.scripts['discover:daily'], /--limit=650/);
  assert.ok(dailyRunnerSource.includes('function channelReadinessSummary'));
  assert.ok(dailyRunnerSource.includes('executableReserveTarget: 130'));
  assert.ok(dailyRunnerSource.includes('executableReserveNeeded: readiness.reserveNeededFor100'));
  assert.ok(dailyRunnerSource.includes('executableByChannel: readiness.byChannel'));
  assert.ok(dailyRunnerSource.includes('verifiedSocialCompanies: readiness.verifiedSocialCompanies'));
  assert.ok(dailyRunnerSource.includes('verifiedSocialReserveNeeded'));
  assert.ok(dailyRunnerSource.includes('const reservedSocial = verifiedSocial.slice(0, socialReserveTarget)'));
});

test('daily execution requires first-party verified social profiles and reports unverified social rows truthfully', () => {
  assert.ok(mainSource.includes("!isSocialQueueItem(item) || item.officialSocialProfileVerified === true"));
  assert.ok(mainSource.includes("'social_profile_not_first_party_verified'"));
  assert.ok(discoverySource.includes("company === 'Wild Earth'"));
  assert.ok(discoverySource.includes("'https://www.wildearth.com.au/'"));
});

test('daily execution accepts verified social targets stored in targetUrl or platformUrl', () => {
  assert.ok(mainSource.includes('item.url || item.targetUrl || item.platformUrl || item.verifiedTargetUrl || item.contactUrl || item.website'));
  assert.ok(mainSource.includes("['email', 'linkedin', 'facebook', 'instagram'].includes"));
});

test('daily artifact public mirrors retry transient Windows copy locks', () => {
  assert.ok(dailyRunnerSource.includes('function copyFileWithRetry'));
  assert.ok(dailyRunnerSource.includes('copyFileWithRetry(from, to)'));
  assert.ok(intelligenceGeneratorSource.includes('function retryFileOperation'));
  assert.ok(intelligenceGeneratorSource.includes('retryFileOperation(() => fs.writeFileSync'));
  assert.ok(intelligenceGeneratorSource.includes('retryFileOperation(() => fs.copyFileSync'));
});

test('AutoGLM only accepts exact supported platform URLs and blocks repeat contact', () => {
  assert.equal(validateLeadForExecution({
    verifiedTargetUrl: 'https://www.instagram.com/campmor/',
  }).ok, true);
  assert.equal(validateLeadForExecution({
    verifiedTargetUrl: 'https://example.com/campmor',
  }).ok, false);
  assert.equal(validateLeadForExecution({
    verifiedTargetUrl: 'https://www.instagram.com/campmor/',
    sendStatus: 'sent_confirmed',
  }).ok, false);
  assert.equal(validateLeadForExecution({
    verifiedTargetUrl: 'https://www.instagram.com/campmor/',
    originalStatus: 'Replied',
  }).ok, false);
  assert.equal(validateLeadForExecution({
    verifiedTargetUrl: 'https://www.facebook.com/profile.php?id=123',
  }).ok, false);
  assert.equal(validateLeadForExecution({
    verifiedTargetUrl: 'https://www.facebook.com/bassproshops',
  }).ok, true);
});

test('Facebook execution rejects generic destinations before outreach', () => {
  assert.equal(isBlockedFacebookTarget(new URL('https://www.facebook.com/profile.php?id=123')), true);
  assert.equal(isBlockedFacebookTarget(new URL('https://www.facebook.com/search/top?q=camping')), true);
  assert.equal(isBlockedFacebookTarget(new URL('https://www.facebook.com/watch?v=123')), true);
  assert.equal(isBlockedFacebookTarget(new URL('https://www.facebook.com/bassproshops')), false);
});

test('Facebook execution rejects personal profiles even when the URL matches', () => {
  assert.ok(chromeDriverSource.includes('personalProfileSignal'));
  assert.ok(chromeDriverSource.includes('facebookBusinessPageOk'));
  assert.ok(chromeDriverSource.includes('facebookExactHandlePageOk'));
  assert.ok(chromeDriverSource.includes('unavailableProfileSignal'));
  assert.match(chromeDriverSource, /facebookProfileUrl/);
  assert.match(chromeDriverSource, /!facebookProfileUrl[\s\S]*!personalProfileSignal[\s\S]*!strictPersonalProfileSignal[\s\S]*!unavailableProfileSignal/);
  assert.match(chromeDriverSource, /friends are family|i'm a .*\\b\(chameleon\|person\|guy\|girl\)/);
});

test('Facebook identity validation rejects personal profiles and requires outgoing-bubble proof', () => {
  assert.ok(chromeDriverSource.includes('strictPersonalProfileSignal'));
  assert.ok(chromeDriverSource.includes('businessSignal && socialCompanyOk'));
  assert.ok(chromeDriverSource.includes("confirmed: Boolean(outgoingBubble && !hasDraftInComposer)"));
  assert.ok(chromeDriverSource.includes("Page.reload"));
  assert.ok(chromeDriverSource.includes("confirmPersistedSentMessage"));
  assert.ok(chromeDriverSource.includes("matchedMessageText"));
  assert.ok(chromeDriverSource.includes("persisted_after_reload"));
  assert.ok(chromeDriverSource.includes('const allowPublicEngagement = false'));
  assert.equal(isBlockedFacebookTarget(new URL('https://www.facebook.com/doorout')), true);
  assert.equal(isBlockedFacebookTarget(new URL('https://www.facebook.com/dooroutcom')), false);
});

test('source-backed social refill targets use exact official handles and quarantine ambiguous legacy URLs', () => {
  assert.ok(discoverySource.includes("'https://www.facebook.com/dooroutcom'"));
  assert.ok(discoverySource.includes("'https://www.instagram.com/doorout_com/'"));
  assert.ok(!discoverySource.includes("'https://www.facebook.com/8a.pl'"));
  assert.ok(!discoverySource.includes("'https://www.instagram.com/8a.pl/'"));
  assert.ok(discoverySource.includes("'https://www.facebook.com/sklep8apl'"));
  assert.ok(discoverySource.includes("'https://www.instagram.com/8apl/'"));
  assert.match(discoverySource, /\['Outdoor Specialist', 'Netherlands', 'https:\/\/www\.outdoorspecialist\.nl\/', '', '', 85\]/);
  assert.ok(discoverySource.includes("officialSocialProfileVerified: company === 'Doorout' || company === '8a.pl'"));
  assert.ok(discoverySource.includes('polityka_prywatno%C5%9Bci_FB_8a.pdf'));
});

test('official directory contacts preserve company-domain emails and first-party evidence URLs', () => {
  assert.ok(discoverySource.includes("'Scandinavian Outdoor': ['info@scandinavianoutdoor.com'"));
  assert.ok(discoverySource.includes("'Tentworld': ['contact@tentworld.com.au'"));
  assert.ok(discoverySource.includes("'Wildfire Sports': ['enquiries@wildfiresports.com.au'"));
  assert.ok(discoverySource.includes('candidate.contactUrl = enrichment[2] || candidate.contactUrl'));
  assert.ok(discoverySource.includes("'Varuste': ['info@varuste.net'"));
  assert.ok(discoverySource.includes("'Fjellsport': ['kundeservice@fjellsport.no'"));
  assert.ok(discoverySource.includes("'Outnorth': ['info@outnorth.com'"));
  assert.ok(discoverySource.includes('candidate.emailEvidenceUrl = enrichment[2] || candidate.url'));
});

test('identity failures preserve the underlying CDP runtime diagnostic', () => {
  assert.ok(chromeDriverSource.includes('identity_check_runtime_error:${identity.error}'));
  assert.ok(chromeDriverSource.includes('identityDiagnostic: identity || null'));
  assert.ok(chromeDriverSource.includes('result.exceptionDetails.exception.description'));
});

test('generated identity expression compiles before CDP injection', () => {
  const expression = identityCheckExpression(
    'Camp Studio Thailand',
    'https://www.instagram.com/campstudio.chiangmai/',
    true,
  );
  assert.doesNotThrow(() => new vm.Script(expression));
});

test('Facebook identity accepts an exact company handle after the page is ready but keeps personal and unavailable pages blocked', () => {
  const expression = identityCheckExpression(
    'LD Mountain Centre',
    'https://www.facebook.com/LDMountainCentre',
    false,
  );
  const evaluate = (bodyText) => JSON.parse(vm.runInNewContext(expression, {
    location: {
      href: 'https://www.facebook.com/LDMountainCentre',
      pathname: '/LDMountainCentre',
    },
    document: {
      title: 'Facebook',
      body: { innerText: bodyText },
      querySelectorAll: () => [],
    },
    URL,
  }));
  assert.equal(evaluate('Outdoor retail company page with camping equipment, website details, and business information.').ok, true);
  assert.equal(evaluate('Add friend. Lives in London. 250 friends. Personal details and family updates.').ok, false);
  assert.equal(evaluate("This content isn't available right now. The page may have been removed.").ok, false);
});

test('fixed identity verifier failures can be retried only for source-backed official profiles', () => {
  assert.ok(mainSource.includes('function isFixedIdentityVerifierFailure'));
  assert.ok(mainSource.includes('function exactSocialHandleMatchesCompany'));
  assert.ok(mainSource.includes('identity_check_runtime_error:SyntaxError: Invalid regular expression flags'));
  assert.match(mainSource, /\(\?:\^\|;\).*personal_profile_without_company_match/);
  assert.match(mainSource, /item\.officialSocialProfileVerified \|\| exactSocialHandleMatchesCompany\(item\)[\s\S]*isFixedIdentityVerifierFailure\(result\)/);
  assert.match(mainSource, /item\.officialSocialProfileVerified \|\| exactSocialHandleMatchesCompany\(item\)[\s\S]*isFixedIdentityVerifierFailure\(checkpointResult\)/);
  assert.match(mainSource, /personal_profile_without_company_match\|identity_mismatch/);
});

test('social execution explicitly fails closed for CAPTCHA, login loss, and platform rate limits', () => {
  assert.ok(chromeDriverSource.includes('function platformSafetyBlockerExpression'));
  assert.ok(chromeDriverSource.includes('captcha_or_human_verification'));
  assert.ok(chromeDriverSource.includes('platform_rate_limit_or_action_block'));
  assert.ok(chromeDriverSource.includes('dedicated_browser_login_required'));
  assert.ok(chromeDriverSource.includes('Skip this target without retrying'));
});

test('daily execution opens a platform-only circuit after repeated same-day safety failures', () => {
  assert.ok(mainSource.includes('function platformSafetyCircuitState'));
  assert.ok(mainSource.includes('platform_safety_circuit_open'));
  assert.ok(mainSource.includes('failures >= 3'));
  assert.ok(mainSource.includes('const platformCircuitState = platformSafetyCircuitState(previousResults)'));
  assert.ok(mainSource.includes('platformCircuitState[itemPlatform].open'));
  const queueStart = mainSource.indexOf('async function runDailyAutomationQueue');
  const queueEnd = mainSource.indexOf("ipcMain.handle('run-daily-automation-queue'", queueStart);
  assert.ok(mainSource.slice(queueStart, queueEnd).includes('const platformCircuitState = platformSafetyCircuitState(previousResults)'));
});

test('temporary platform safety failures become re-verifiable after a three-hour cooldown', () => {
  const block = mainSource.slice(
    mainSource.indexOf('function failedOpenResultShouldBlockRetry'),
    mainSource.indexOf('function checkpointResultIsTerminal')
  );
  assert.ok(block.includes('temporarySafetyFailure'));
  assert.ok(block.includes('3 * 60 * 60 * 1000'));
  assert.ok(block.includes('Date.now() - failedAt < retryAfterMs'));
  assert.ok(block.includes('profile_no_message_button'));
  assert.ok(mainSource.includes('timestamp: new Date().toISOString()'));
});

test('Facebook composer failure closes stale Messenger UI without reopening the same dead end', () => {
  assert.match(chromeDriverSource, /facebook_composer_unavailable_closed_no_retry/);
  assert.match(chromeDriverSource, /closeFacebookMessengerInbox\(tab\);[\s\S]*closeFacebookChatWindows\(tab\);[\s\S]*return \{\n      messageUnavailable: true/);
});

test('a draft insertion failure is not mislabeled as an uncertain send', () => {
  assert.match(chromeDriverSource, /!insertResult\.ok[\s\S]*sendStatus: 'failed_open'[\s\S]*draft was not detected/i);
  assert.ok(mainSource.includes('function repairPreSendUnconfirmedResults'));
  assert.ok(mainSource.includes('pre_send_failure_status_repaired'));
});

test('customer execution truthfully labels CDP unless a valid extension receipt exists', () => {
  assert.ok(mainSource.includes("executionLayer: browserTransportForResult(execution) === 'codex-extension'"));
  assert.ok(mainSource.includes("? 'Codex Chrome Extension'"));
  assert.ok(mainSource.includes(": 'Chrome CDP fallback'"));
  assert.ok(mainSource.includes("reason: 'local_codex_extension_template'"));
  assert.ok(mainSource.includes("execution = await runCodexChromeLead(lead, decision, 'codex_chrome_cdp'"));
  assert.doesNotMatch(mainSource, /executionLayer: 'Codex Chrome Extension only'/);
});

test('Chrome recovery isolates automation from the operator primary browser', () => {
  assert.ok(mainSource.includes('for (const port of [9224])'));
  assert.equal(mainSource.includes('for (const port of [9222'), false);
  assert.ok(mainSource.includes("'http://127.0.0.1:4174/outreach-dashboard.html?view=workspace'"));
  assert.doesNotMatch(mainSource, /'--new-window',\s*'about:blank'/);
  assert.doesNotMatch(mainSource, /engine: 'codex-chrome-extension-cdp'/);
  assert.ok(mainSource.includes('windowsHide: false'));
  assert.ok(!mainSource.includes("'--start-minimized'"));
  assert.ok(mainSource.includes("`--user-data-dir=${profile}`"));
});

test('Facebook composer writes React contenteditable state before send', () => {
  assert.ok(chromeDriverSource.includes('el.replaceChildren()'));
  assert.ok(chromeDriverSource.includes("new Event('change'"));
  assert.ok(chromeDriverSource.includes("new KeyboardEvent('keyup'"));
  assert.ok(chromeDriverSource.includes('facebook_draft_not_inserted_after_composer_refocus'));
  assert.match(chromeDriverSource, /messageLike = .*\^aa\$/);
});

test('daily queue requires explicit official Facebook page classification', () => {
  assert.ok(dailyRunnerSource.includes("task.facebookStatus === 'verified_official_page_candidate'"));
  assert.ok(dailyRunnerSource.includes('Legacy/ambiguous profiles'));
});

test('automation detects broken Instagram profile pages before execution', () => {
  assert.equal(isUnavailableProfilePage({
    url: 'https://www.instagram.com/missing-brand/',
    title: 'Instagram',
    text: '很抱歉，无法访问此页面 你点击的链接可能已损坏，或页面已被移除。',
  }), true);
  assert.equal(isUnavailableProfilePage({
    url: 'https://www.instagram.com/campmor/',
    title: 'Campmor (@campmor) • Instagram photos and videos',
    text: 'Campmor Outdoor gear and camping equipment.',
  }), false);
});

test('AutoGLM task preserves exact target and approved draft', () => {
  const lead = { targetUrl: 'https://www.instagram.com/campmor/' };
  const task = buildAutoGlmTask(lead, { draft: 'Hello Campmor team' });
  assert.equal(normalizeTarget(lead), 'https://www.instagram.com/campmor/');
  assert.match(task, /https:\/\/www\.instagram\.com\/campmor\//);
  assert.match(task, /Hello Campmor team/);
  assert.match(task, /Stop for login, CAPTCHA/);
});

test('desktop automation can use GLM env key and OpenClaw follow-up preparation', () => {
  assert.ok(mainSource.includes('process.env.ZHIPUAI_API_KEY'));
  assert.ok(mainSource.includes('runOpenClawLead'));
  assert.ok(mainSource.includes('function openClawCommand'));
  assert.ok(mainSource.includes('followup_prepare_no_duplicate_send'));
  assert.ok(mainSource.includes("model: String((payload && payload.model) || 'glm-5.2')"));
  assert.ok(mainSource.includes("sendStatus: 'prepared_not_sent'"));
  assert.ok(mainSource.includes('daily-automation-execution-latest.json'));
  assert.ok(mainSource.includes('function refreshDailyAutomationArtifacts'));
  assert.ok(mainSource.includes("daily-automation-runner.js'), '--fix'"));
  assert.ok(mainSource.includes('result.systemRefresh = await refreshDailyAutomationArtifacts()'));
  assert.ok(mainSource.includes('const systemRefresh = await refreshDailyAutomationArtifacts()'));
  assert.ok(mainSource.includes('app.quit()'));
});

test('website contact automation must verify contact entry before ready status', () => {
  assert.ok(mainSource.includes('function inspectWebsiteContactFlow'));
  assert.ok(mainSource.includes('function websiteUnavailablePageEvidence'));
  assert.ok(mainSource.includes('function websiteContactTargetCandidates'));
  assert.ok(mainSource.includes('function websiteContactInspectionExpression'));
  assert.ok(mainSource.includes('function websiteContactClickExpression'));
  assert.ok(mainSource.includes('function websiteContactRequiredDropdownExpression'));
  assert.ok(mainSource.includes('function prepareWebsiteContactForm'));
  assert.ok(mainSource.includes('async function setChromeFileInput'));
  assert.ok(mainSource.includes("const WEBSITE_CONTACT_VERIFIED_EVIDENCE = 'contact_entry_verified'"));
  assert.ok(mainSource.includes('const ready = mailtos.length > 0 || hasContactForm;'));
  assert.ok(mainSource.includes("const DEFAULT_WEBSITE_CONTACT_FIRST_NAME = 'Leo'"));
  assert.ok(mainSource.includes("const DEFAULT_WEBSITE_CONTACT_LAST_NAME = 'Liu'"));
  assert.ok(mainSource.includes('FLEXTAIL retail partnership | 2026 assortment'));
  assert.ok(mainSource.includes('category buyer or vendor-onboarding team'));
  assert.ok(mainSource.includes('hiddenRequiredDropdowns'));
  assert.ok(mainSource.includes('required_fields_missing'));
  assert.ok(mainSource.includes('process.env.WEBSITE_MARKETING_FILE'));
  assert.ok(mainSource.includes('process.env.WEBSITE_CONTACT_AUTO_SUBMIT'));
  assert.ok(mainSource.includes('website_contact_entry_not_verified'));
  assert.ok(mainSource.includes('website_page_unavailable_403'));
  assert.ok(mainSource.includes('website_page_unavailable_404'));
  assert.ok(mainSource.includes('website_contact_target_attempts'));
  assert.ok(mainSource.includes('website_contact_all_targets_failed'));
  assert.ok(mainSource.includes('website_contact_unreachable_skip'));
  assert.ok(mainSource.includes('Skip this website route'));
  assert.ok(mainSource.includes('Facebook, Instagram, or another verified official channel'));
  assert.ok(mainSource.includes('Social platform URL is not a website contact form'));
  assert.ok(mainSource.includes('marketing_attachment_missing'));
  assert.ok(mainSource.includes('website_contact_submission_confirmed'));
  assert.ok(mainSource.includes('website_contact_submission_confirmation_missing'));
  assert.ok(mainSource.includes('website_contact_form_submit_clicked'));
  assert.ok(mainSource.includes('function formatExecutionBlockerStatus'));
  assert.ok(mainSource.includes('function executionRecoveryHint'));
  assert.ok(mainSource.includes("reason: 'daily_queue_goal_not_reached'"));
  assert.ok(mainSource.includes("action: 'Refill high-ICP customer pool'"));
  assert.ok(mainSource.includes('Add or unblock ${queueGoalStatus.refillNeeded || 0} verified high-ICP leads'));
  assert.ok(mainSource.includes('Configure WEBSITE_MARKETING_FILE or MARKETING_ATTACHMENT_PATH'));
  assert.ok(mainSource.includes("requiredEnv: ['WEBSITE_MARKETING_FILE', 'MARKETING_ATTACHMENT_PATH']"));
  assert.ok(mainSource.includes('Complete Google social channel verification'));
  assert.ok(mainSource.includes('Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach.'));
  assert.ok(mainSource.includes('Customer development was not performed. Blockers:'));
  assert.ok(mainSource.includes('submit_paused_by_env'));
  assert.ok(!mainSource.includes('required_fields_auto_bypassed'));
  assert.ok(mainSource.includes("el.tagName === 'TEXTAREA' && /description|message|details|request|demande|nachricht|mensaje|messaggio/.test(key)"));
  assert.ok(mainSource.includes('.ck-editor__editable,.ql-editor,[role="textbox"]'));
  assert.ok(mainSource.includes("sendStatus: 'approval_pending'"));
  assert.ok(mainSource.includes("evidence: contactFlow.evidence"));
  assert.ok(mainSource.includes("sendStatus: 'website_contact_ready'"));
  assert.ok(dailyRunnerSource.includes('function isVerifiedWebsiteContactResult'));
  assert.ok(dailyRunnerSource.includes('isTouchResult(result)'));
  assert.ok(mainSource.includes("sendStatus: confirmed ? 'submitted_confirmed' : 'send_unconfirmed'"));
});

test('website discovery probes common same-origin contact paths without product-link false positives', () => {
  assert.ok(mainSource.includes("'/pages/contact-us'"));
  assert.ok(mainSource.includes("'/contact-us'"));
  assert.ok(mainSource.includes('negativeHref'));
  assert.ok(mainSource.includes('positiveHref'));
  assert.ok(mainSource.includes('const negativeHref = /\\\\/collections'));
  assert.ok(mainSource.includes("String(item.text || '').length <= 120"));
  assert.ok(mainSource.includes('skip to (?:main )?content'));
  assert.ok(mainSource.includes('cookie (?:settings|preferences|policy)'));
  assert.ok(mainSource.includes('manage (?:consent|preferences)'));
  assert.ok(mainSource.includes('markWebsiteContactStrategyResult(await runWebsiteContactLead(lead, options))'));
  const start = mainSource.indexOf('function websiteContactClickExpression()');
  const end = mainSource.indexOf('async function inspectWebsiteContactFlow', start);
  const clickExpressionFactory = vm.runInNewContext(`(${mainSource.slice(start, end).trim()})`);
  const clickExpression = clickExpressionFactory();
  assert.doesNotThrow(() => new vm.Script(clickExpression));
  const cookieControl = {
    innerText: 'Accept',
    textContent: 'Accept',
    href: 'https://example.com/contact',
    getAttribute(name) { return name === 'href' ? this.href : ''; },
    getBoundingClientRect() { return { width: 80, height: 30, left: 10, top: 10 }; },
    scrollIntoView() {},
  };
  const cookieResult = JSON.parse(vm.runInNewContext(clickExpression, {
    URL,
    location: { hostname: 'example.com' },
    window: { getComputedStyle: () => ({ visibility: 'visible', display: 'block' }) },
    document: { querySelectorAll: () => [cookieControl] },
  }));
  assert.equal(cookieResult.clicked, false);
  assert.equal(cookieResult.evidence, 'no_contact_entry_control');
  assert.match(outreachPolicySource, /Website contact navigation must reject cookie and consent controls/);
  assert.match(optimizedPromptSource, /Contact-entry discovery must reject cookie\/consent controls/);
  assert.ok(mainSource.includes('mailtos: mailtos.slice(0, 8)'));
  assert.ok(mainSource.includes('officialMailtoLead(lead, contactFlow.inspection'));
  assert.ok(mainSource.includes('runVerifiedAlibabaEmailLead'));
  assert.ok(mainSource.includes('runAlibabaWebmailEmailLead'));
  assert.ok(mainSource.includes('alibaba-enterprise-mail-web-session'));
  assert.ok(mainSource.includes("const autoSendAuthorization = 'verified_email_auto_send_no_manual_review'"));
  assert.ok(mainSource.includes("reason: 'alibaba_webmail_draft_verification_failed'"));
  assert.ok(mainSource.includes('composer_preserved_for_technical_evidence'));
  assert.ok(mainSource.includes('manualApprovalRequired: false'));
  assert.ok(mainSource.includes('autoSendAuthorized: true'));
  assert.ok(mainSource.includes('sendAndConfirmAlibabaEmail'));
  assert.ok(mainSource.includes('verifyEmailAddress(recipientEmail(lead))'));
});

test('Google discovery uses a live Bever contact details URL instead of the retired 404 page', () => {
  const leads = buildLeads(650);
  const beverContact = leads.find(item => item.id === 'google-customer-bever-website-contact');
  assert.ok(beverContact);
  assert.equal(beverContact.contactUrl, 'https://www.bever.nl/klantenservice/contactgegevens.html');
  assert.notEqual(beverContact.contactUrl, 'https://www.bever.nl/klantenservice/contact.html');
  assert.equal(beverContact.vendorPortal, 'https://www.bever.nl/klantenservice/contactgegevens.html');
});

test('Codex Chrome execution can auto-send approved social outreach with confirmation', () => {
  assert.ok(mainSource.includes('async function prepareInstagramDraft'));
  assert.ok(mainSource.includes('dom_click_fallback_succeeded'));
  assert.ok(mainSource.includes('await clickChromeTabAt(opened, button.x, button.y)'));
  assert.ok(mainSource.includes('recipientReady:${Boolean(inspected.recipientReady)}'));
  assert.doesNotMatch(mainSource, /windowsVirtualKeyCode: 13/);
  assert.ok(mainSource.includes("'Input.insertText'"));
  assert.ok(mainSource.includes('prior_send_unconfirmed_no_resend'));
  assert.ok(mainSource.includes('async function prepareSocialDraft'));
  assert.ok(mainSource.includes('codex-chrome-driver.js'));
  assert.ok(mainSource.includes("runCodexChromeDriver('prepare-instagram-draft'"));
  assert.ok(mainSource.includes('facebookNeedsInstagram'));
  assert.ok(mainSource.includes('lead && lead.facebookMessageUnavailable === true'));
  assert.ok(mainSource.includes('skipInstagramFallback'));
  assert.ok(mainSource.includes('instagramFallbackTarget'));
  assert.ok(mainSource.includes('hasVerifiedInstagramFallback'));
  assert.ok(mainSource.includes("runCodexChromeDriver('prepare-social-draft'"));
  assert.ok(mainSource.includes('autoSend: true'));
  assert.ok(mainSource.includes('replaceExistingDraft: true'));
  assert.ok(mainSource.includes('function recordAutomationResult'));
  assert.ok(mainSource.includes('recordAutomationResult(item, result)'));
  assert.ok(mainSource.includes('inspect-social-context'));
  assert.ok(mainSource.includes('optimizeDraftWithContext'));
  assert.ok(mainSource.includes('contextAwareFallbackDraft'));
  assert.ok(mainSource.includes('local_codex_extension_template'));
  assert.ok(mainSource.includes('professionalSalesDraft(lead || {},'));
  assert.ok(mainSource.includes('Email or WhatsApp works well'));
  assert.ok(mainSource.includes('Flextail and Vollyc'));
  assert.ok(mainSource.includes('36+ new SKUs are planned for 2026'));
  assert.ok(mainSource.includes('highest chance of a real reply and a booked phone/video meeting'));
  assert.ok(mainSource.includes('Tailor the angle to the exact customer persona'));
  assert.ok(mainSource.includes('Reply-rate strategy'));
  assert.ok(mainSource.includes('ask exactly one easy question'));
  assert.ok(chromeDriverSource.includes("'Input.insertText'"));
  assert.ok(chromeDriverSource.includes('sendButtonExpression'));
  assert.ok(chromeDriverSource.includes('sendConfirmationExpression'));
  assert.ok(chromeDriverSource.includes('nearExplicitSend'));
  assert.ok(chromeDriverSource.includes('outgoingBubble'));
  assert.ok(chromeDriverSource.includes('document.elementFromPoint'));
  assert.ok(chromeDriverSource.includes('profileMessageButtonExpression'));
  assert.ok(chromeDriverSource.includes('[role="dialog"] [role="textbox"]'));
  assert.ok(chromeDriverSource.includes("el.getAttribute('role') === 'textbox'"));
  assert.ok(chromeDriverSource.includes('identity_check_pending_empty_page'));
  assert.ok(chromeDriverSource.includes('identity_check_pending_generic_social_title'));
  assert.ok(chromeDriverSource.includes('identity_match_exact_social_url'));
  assert.ok(chromeDriverSource.includes('item => item && !item.pending'));
  assert.ok(chromeDriverSource.includes("closest('nav,[role=\"navigation\"]')"));
  assert.ok(chromeDriverSource.includes('floatingMessengerComposer'));
  assert.ok(chromeDriverSource.includes('window.innerWidth * 0.55'));
  assert.ok(chromeDriverSource.includes('closeBlockingOverlayExpression'));
  assert.ok(chromeDriverSource.includes('closeFacebookChatWindowsExpression'));
  assert.ok(chromeDriverSource.includes('facebook_stale_chat_windows_closed'));
  assert.ok(chromeDriverSource.includes('facebookMessengerInboxOpenExpression'));
  assert.ok(chromeDriverSource.includes('facebook_messenger_inbox_popover_open'));
  assert.ok(chromeDriverSource.includes('pressEscape'));
  assert.ok(chromeDriverSource.includes("!item.label.includes('comment')"));
  assert.ok(chromeDriverSource.includes("return JSON.stringify(null);"));
  assert.ok(chromeDriverSource.includes('facebook_profile_no_message_button'));
  assert.ok(chromeDriverSource.includes("querySelectorAll('button,a,[role=\"button\"]')"));
  assert.ok(chromeDriverSource.includes('handleMatchesExpected'));
  assert.ok(mainSource.includes("!handle.includes(expected) && !expected.includes(handle)"));
  assert.ok(discoverySource.includes("status: 'identity_mismatch'"));
  assert.ok(mainSource.includes('moosejawmadness'));
  assert.ok(chromeDriverSource.includes('known_instagram_identity_mismatch_moosejawmadness'));
  assert.ok(chromeDriverSource.includes('retryPost'));
  assert.ok(chromeDriverSource.includes("a[href*=\"/p/\"],a[href*=\"/reel/\"],a[href*=\"/tv/\"]"));
  assert.ok(chromeDriverSource.includes('messageUnavailable: true'));
  assert.ok(chromeDriverSource.includes("platform === 'facebook' && !profileZone.length"));
  assert.ok(chromeDriverSource.includes('follow_already_active'));
  assert.ok(chromeDriverSource.includes('${platform}_engagement_completed_message_unavailable'));
  assert.ok(chromeDriverSource.includes('submitInstagramPostEngagement'));
  assert.match(chromeDriverSource, /platform === 'instagram'[\s\S]*clickOptionalAction\(tab, 'follow', platform\)[\s\S]*submitInstagramPostEngagement\(tab/);
  assert.ok(chromeDriverSource.includes('submitFacebookPostEngagement'));
  assert.ok(chromeDriverSource.includes('facebookPostLikeButtonExpression'));
  assert.ok(chromeDriverSource.includes('facebookStartButtonExpression'));
  assert.match(chromeDriverSource, /platform === 'facebook'[\s\S]*facebookProfileCandidates/);
  assert.match(chromeDriverSource, /!item\.inDialog && !item\.inNav/);
  assert.ok(chromeDriverSource.includes('insertDraftAndVerify'));
  assert.ok(chromeDriverSource.includes('setComposerTextExpression'));
  assert.match(chromeDriverSource, /platform === 'instagram' \|\| platform === 'facebook'[\s\S]*profileMessageButtonExpression\(platform, keywords\)/);
  assert.ok(chromeDriverSource.includes('pointTarget'));
  assert.ok(chromeDriverSource.includes("new MouseEvent(type"));
  assert.ok(chromeDriverSource.includes('composed: true'));
  assert.ok(chromeDriverSource.includes("document.execCommand('insertText'"));
  assert.ok(chromeDriverSource.includes('composer_dom_text_set'));
  assert.ok(chromeDriverSource.includes('draft_inserted_dom_fallback'));
  assert.ok(chromeDriverSource.includes('facebook_draft_inserted_after_composer_refocus'));
  assert.ok(chromeDriverSource.includes('facebook_draft_inserted_dom_fallback_after_refocus'));
  assert.ok(chromeDriverSource.includes('Marketing draft was not detected in the message composer'));
  assert.match(chromeDriverSource, /platform === 'facebook'[\s\S]*clickOptionalAction\(tab, 'follow', platform\)[\s\S]*submitFacebookPostEngagement\(tab/);
  assert.ok(chromeDriverSource.includes('instagramPostTileExpression'));
  assert.ok(chromeDriverSource.includes('instagramCommentActionExpression'));
  assert.ok(chromeDriverSource.includes('instagram_post_opened'));
  assert.ok(chromeDriverSource.includes('post_liked'));
  assert.ok(chromeDriverSource.includes('facebook_post_like_clicked'));
  assert.ok(chromeDriverSource.includes('post_like_double_tap_attempted'));
  assert.ok(chromeDriverSource.includes('comment_submitted'));
  assert.ok(chromeDriverSource.includes("return `${kind}_already_active`"));
  assert.ok(chromeDriverSource.includes('followers|following|mutualonly'));
  assert.ok(chromeDriverSource.includes('conversationContextExpression'));
  assert.ok(chromeDriverSource.includes('unavailableProfileExpression'));
  assert.ok(chromeDriverSource.includes('personal_profile_without_company_match'));
  assert.ok(chromeDriverSource.includes('employeeSignal'));
  assert.ok(chromeDriverSource.includes('businessSignal'));
  assert.ok(chromeDriverSource.includes("sendStatus: 'failed_open'"));
  assert.ok(chromeDriverSource.includes('switch to a verified alternate channel'));
  assert.ok(chromeDriverSource.includes("command === 'inspect-social-context'"));
  assert.ok(chromeDriverSource.includes("sendStatus: 'sent_confirmed'"));
  assert.ok(chromeDriverSource.includes('message_sent_confirmed_after_send_click'));
  assert.ok(chromeDriverSource.includes("command === 'prepare-social-draft'"));
  assert.ok(chromeDriverSource.includes("facebook: ['message'"));
  assert.match(chromeDriverSource, /platform === 'instagram'[\s\S]*profileMessageButtonExpression\(platform, keywords\)[\s\S]*composerExpression\(platform\)/);
  assert.ok(chromeDriverSource.includes('${platform}_message_composer_opened_and_draft_inserted_no_send'));
  assert.ok(mainSource.includes("sendStatus: 'draft_prepared'"));
  assert.ok(mainSource.includes('message_composer_opened_and_draft_inserted_no_send'));
  assert.ok(mainSource.includes("'account_followed', 'post_liked'"));
  assert.ok(!mainSource.includes("byText(['send', '发送'])"));
});

test('Instagram driver returns structured results before the parent timeout and rejects non-message inputs', () => {
  assert.ok(mainSource.includes('timeout: 80000'));
  assert.ok(chromeDriverSource.includes('for (let attempt = 0; attempt < 3; attempt += 1)'));
  assert.ok(chromeDriverSource.includes('search|comment|caption|filter|find'));
  assert.ok(chromeDriverSource.includes('sort((a, b) => b.y - a.y)[0]'));
  assert.ok(chromeDriverSource.includes("Page.bringToFront', {}, 2000).catch(() => null)"));
});

test('driver child process has an independent hard timeout', () => {
  assert.ok(mainSource.includes('Child process hard timeout after'));
  assert.ok(mainSource.includes("child.kill('SIGKILL')"));
  assert.ok(mainSource.includes("error.code = 'ETIMEDOUT'"));
});

test('each customer has a bounded watchdog and the queue continues after timeout', () => {
  assert.ok(mainSource.includes('DEFAULT_CUSTOMER_EXECUTION_TIMEOUT_MS = 90000'));
  assert.ok(mainSource.includes('DAILY_CUSTOMER_TIMEOUT_MS'));
  assert.ok(mainSource.includes('executeLeadWithCustomerWatchdog'));
  assert.ok(mainSource.includes('customer_execution_timeout'));
  assert.ok(mainSource.includes('queue_continued_to_next_customer'));
  assert.ok(mainSource.includes('controller.abort()'));
  assert.ok(mainSource.includes('await closeAutomationTabsOpenedAfter(ownedTabsAtStart)'));
  assert.ok(mainSource.includes("enterCriticalSection('verified_email_send_confirmation')"));
  assert.ok(mainSource.includes('if (!watchdogState.criticalSection) resolve(null)'));
  assert.match(mainSource, /executeLeadWithCustomerWatchdog\(item,[\s\S]*recordAutomationResult\(item, result\)/);
});

test('website social fallback preserves prior dedicated Chrome evidence', () => {
  assert.ok(mainSource.includes('chromeOpen: socialResult && socialResult.chromeOpen || chromeOpen'));
  assert.ok(mainSource.includes('signal: options.signal'));
  assert.ok(mainSource.includes('customerTimeoutMs: options.customerTimeoutMs'));
});

test('recoverable social composer failures fall back across verified channels without blind retries', () => {
  assert.ok(mainSource.includes('function alternateChannelFallbackLead'));
  assert.ok(mainSource.includes('composer_not_found|message_button_clicked_composer_not_found'));
  assert.ok(mainSource.includes("['facebook', channels.facebook]"));
  assert.ok(mainSource.includes("['email', cameFromWebsiteSocialFallback ? '' : (channels.websiteContact || lead.contactUrl || lead.website)]"));
  assert.ok(mainSource.includes('cameFromWebsiteSocialFallback'));
  assert.ok(mainSource.includes('if (!blockingAutomationResultFor(fallback)) return fallback'));
  assert.ok(mainSource.includes('fallbackPlatform: alternateFallback.platform'));
  assert.ok(mainSource.includes('driver_timeout_bounded:80000'));
  assert.ok(mainSource.includes('fallbackDepth < 3'));
  assert.ok(mainSource.includes("attemptedTargets.has(String(targetUrl || '').toLowerCase())"));
  const sameDayStatusesStart = mainSource.indexOf('const SAME_DAY_DEVELOPMENT_STATUSES');
  const sameDayStatusesEnd = mainSource.indexOf('function automationLocalDay', sameDayStatusesStart);
  assert.ok(sameDayStatusesStart >= 0 && sameDayStatusesEnd > sameDayStatusesStart);
  assert.doesNotMatch(mainSource.slice(sameDayStatusesStart, sameDayStatusesEnd), /website_contact_unreachable_skip/);
});

test('verified Instagram fallback continues after a Facebook personal-profile mismatch', () => {
  assert.match(mainSource, /personal_profile_without_company_match\|identity_mismatch_expected/);
  assert.ok(mainSource.includes("['facebook', channels.facebook]"));
  assert.ok(mainSource.includes("['instagram', channels.instagram]"));
  assert.ok(mainSource.includes('fallbackDepth: fallbackDepth + 1'));
});

test('same-day failed targets open a bounded retry circuit instead of consuming every batch', () => {
  assert.ok(mainSource.includes('const sameDayFailedAttempts = results'));
  assert.ok(mainSource.includes('sameDayFailedAttempts.length >= 1'));
  assert.ok(mainSource.includes('same_day_retry_circuit_open;failed_attempts:'));
  assert.ok(mainSource.includes('verifiedSupplierRoute'));
  assert.ok(mainSource.includes('resultTargetKey === itemTargetKey'));
  assert.ok(mainSource.includes("evidence.includes('personal_profile_without_company_match')"));
});

test('daily execution is serial and can process a priority batch per run', () => {
  assert.ok(mainSource.includes("mode: 'serial-single-target'"));
  assert.ok(mainSource.includes('const parallelLimit = 1'));
  assert.ok(mainSource.includes('const limit = Math.min(requestedLimit, remainingDailyGap)'));
  assert.ok(mainSource.includes("app.disableHardwareAcceleration()"));
  assert.ok(mainSource.includes("app.commandLine.appendSwitch('disable-gpu')"));
  assert.ok(mainSource.includes('DAILY_CONFIRMED_COMPANY_TARGET = effectiveDailyConfirmedCompanyTarget()'));
  assert.ok(mainSource.includes('DEFAULT_DAILY_SOCIAL_EXECUTION_LIMIT = 25'));
  assert.ok(mainSource.includes('MAXIMUM_DAILY_SOCIAL_EXECUTION_LIMIT = 50'));
  assert.ok(mainSource.includes('const remainingDailyGap = Math.max(0, DAILY_CONFIRMED_COMPANY_TARGET - confirmedToday)'));
  assert.ok(mainSource.includes('const limit = Math.min(requestedLimit, remainingDailyGap)'));
  assert.ok(mainSource.includes('KEEP_AUTOMATION_TABS_VISIBLE'));
  assert.ok(mainSource.includes('automationReusableChromeTab'));
  assert.ok(mainSource.includes('reuseTab: false'));
  assert.ok(mainSource.includes('isFollowupLead(lead)'));
  assert.ok(mainSource.includes('process.env.DAILY_EXECUTE_LIMIT || DEFAULT_DAILY_SOCIAL_EXECUTION_LIMIT'));
  assert.ok(mainSource.includes('process.env.DAILY_EXECUTE_TIMEOUT_MS || 2700000'));
  assert.ok(mainSource.includes("['sent_confirmed', 'submitted_confirmed'].includes(item.sendStatus)"));
  assert.ok(mainSource.includes('executableQueueCandidates(latest.dailyQueue, { allowWebsiteContact: false })'));
  assert.ok(mainSource.includes('item.executionReadiness && item.executionReadiness.ready === true'));
  assert.ok(mainSource.includes('const websiteFallback = executableQueueCandidates'));
  assert.ok(mainSource.includes('const isAutoRunDaily = process.argv.includes'));
  assert.ok(mainSource.includes('async function runAutoDailyAndWriteArtifact'));
  assert.ok(mainSource.includes('timeout: 80000'));
});

test('discovery and execution share evidence-backed channel readiness and expose enrichment backlog', () => {
  assert.ok(dailyRunnerSource.includes('function channelExecutionReadiness'));
  assert.ok(dailyRunnerSource.includes("gate: 'official_supplier_route'"));
  assert.ok(dailyRunnerSource.includes('liveFirstPartyEvidence || item.sourceEvidenceUrl'));
  assert.ok(dailyRunnerSource.includes("reason: 'website_contact_capability_not_verified'"));
  assert.ok(dailyRunnerSource.includes('enrichmentBacklogCount: enrichmentBacklog.length'));
  assert.ok(dailyRunnerSource.includes('enrichmentBacklog,'));
  assert.match(outreachPolicySource, /A URL alone is not an executable channel/);
  assert.match(optimizedPromptSource, /Treat `executionReadiness` as the single source of truth/);
});

test('live verified rows replace stale primary company rows before queue selection', () => {
  const stale = { id: 'stale-acme', company: 'Acme Outdoor', platform: 'website_form', action: 'verify_target', reason: 'homepage_only_contact_path_requires_verification', fitScore: 90 };
  const verified = { id: 'verified-acme', company: 'Acme Outdoor', platform: 'website_form', action: 'develop', reason: 'official_website_contact_channel', fitScore: 90, executionReadiness: { ready: true, gate: 'official_supplier_route' } };
  assert.deepEqual(dailyRunner.promoteExecutionReadyQueueRows([stale], [verified]), [verified]);
  assert.deepEqual(dailyRunner.dedupeQueueItems([stale, { ...verified, id: stale.id }])[0].executionReadiness, verified.executionReadiness);
  assert.ok(dailyRunnerSource.includes('const primaryQueue = promoteExecutionReadyQueueRows'));
  assert.ok(dailyRunnerSource.includes("normalized.action = 'email_priority'"));
  assert.ok(dailyRunnerSource.includes("normalized.action = 'develop'"));
  assert.ok(mainSource.includes('candidateSelectionAudit: readyRowsForAudit.map'));
});

test('real customer development excludes likes and follows', () => {
  const start = mainSource.indexOf('const REAL_CUSTOMER_DEVELOPMENT_STATUSES');
  const end = mainSource.indexOf('function buildExecutionTruth', start);
  const block = mainSource.slice(start, end);
  assert.match(block, /sent_confirmed/);
  assert.match(block, /submitted_confirmed/);
  assert.doesNotMatch(block, /account_followed|post_liked/);
});

test('historical likes and follows do not block a later real customer message', () => {
  assert.doesNotMatch(
    mainSource.slice(
      mainSource.indexOf('const COMPANY_HISTORY_BLOCKING_STATUSES'),
      mainSource.indexOf('const DAILY_CONFIRMED_COMPANY_TARGET'),
    ),
    /account_followed|post_liked/,
  );
  assert.ok(mainSource.includes("const companyBlocking = new Set(['sent_confirmed', 'send_unconfirmed'])"));
});

test('Alibaba bounce reconciliation downgrades confirmed email without deleting evidence', () => {
  assert.ok(mainSource.includes('async function reconcileAlibabaBounceResults'));
  assert.ok(mainSource.includes("result.status === 'sent_confirmed'"));
  assert.ok(mainSource.includes("match.status = senderIdentityFailure ? 'send_unconfirmed' : 'bounced'"));
  assert.ok(mainSource.includes('bounceReconciliation'));
  assert.ok(mainSource.includes("const blocking = new Set(['sent_confirmed', 'bounced'"));
  const companyStatusesStart = mainSource.indexOf('const COMPANY_HISTORY_BLOCKING_STATUSES');
  const companyStatusesEnd = mainSource.indexOf(']);', companyStatusesStart) + 3;
  assert.doesNotMatch(mainSource.slice(companyStatusesStart, companyStatusesEnd), /bounced/);
  assert.ok(mainSource.includes("if (result.status === 'bounced') return false"));
  assert.ok(mainSource.includes("sender_identity_rejected_delivery_unconfirmed;automatic_resend_forbidden"));
  assert.ok(mainSource.includes("senderIdentityFailure ? 'send_unconfirmed' : 'bounced'"));
  assert.ok(mainSource.includes("if (/sender_identity_rejected_delivery_unconfirmed/i.test(text)) return true"));
  assert.ok(dailyRunnerSource.includes("if (/sender_identity_rejected_delivery_unconfirmed/i.test(evidence)) return true"));
});

test('Alibaba recipient fallback clears stale text and commits the exact address physically', () => {
  assert.ok(mainSource.includes("type: 'keyDown', key: 'a', code: 'KeyA', modifiers: 2"));
  assert.ok(mainSource.includes("type: 'keyDown', key: 'Backspace', code: 'Backspace'"));
  assert.ok(mainSource.includes("type: 'keyDown', key: 'Enter', code: 'Enter'"));
  assert.ok(mainSource.includes('recipient_control_focused_for_physical_fill'));
  assert.ok(alibabaWebmailSource.includes('recipientControlExactMatch'));
});

test('Alibaba subject fallback physically fills the verified subject and safely retries the fixed pre-send verifier failure', () => {
  assert.ok(mainSource.includes('composeSubjectFocusExpression'));
  assert.ok(alibabaWebmailSource.includes('alibaba_webmail_subject_control_focused_for_physical_fill'));
  assert.ok(mainSource.includes("text: subject"));
  assert.ok(mainSource.includes('function isFixedAlibabaSubjectVerifierFailure'));
  assert.ok(mainSource.includes("evidence.includes('subjectready:false')"));
  assert.ok(mainSource.includes('isFixedAlibabaRecipientVerifierFailure(result) || isFixedAlibabaSubjectVerifierFailure(result)'));
});

test('daily execution checkpoints completed tasks and resumes without duplicate processing', () => {
  assert.ok(mainSource.includes("const DAILY_EXECUTION_CHECKPOINT_FILE = 'daily-automation-execution-checkpoint.json'"));
  assert.ok(mainSource.includes('function readDailyExecutionCheckpoint'));
  assert.ok(mainSource.includes('function writeDailyExecutionCheckpoint'));
  assert.ok(mainSource.includes('function checkpointResultIsTerminal'));
  assert.ok(mainSource.includes('.filter(checkpointResultIsTerminal)'));
  assert.ok(mainSource.includes("reason: 'completed_in_execution_checkpoint'"));
  assert.ok(mainSource.includes('completedTaskIds: [...completedTaskIds]'));
  assert.ok(mainSource.includes('checkpointResultIsTerminal(item)'));
  assert.ok(mainSource.includes('prior_send_unconfirmed_no_resend|sent_folder_record_missing'));
  assert.ok(mainSource.includes('checkpoint: readJson(dailyExecutionCheckpointPath(), null)'));
  assert.ok(mainSource.includes("rule: 'completed checkpoints are ignored; only terminal results from an active interrupted checkpoint suppress their exact task id'"));
  assert.ok(mainSource.includes('snapshotCompleted: Boolean(checkpointSnapshot && checkpointSnapshot.completed === true)'));
  assert.ok(mainSource.includes('activeResume: Boolean(checkpoint)'));
});

test('latest completed execution is reconciled into the same-day ledger before selecting another batch', () => {
  assert.ok(mainSource.includes('function reconcileLatestExecutionResultsToLedger'));
  assert.ok(mainSource.includes('const ledgerReconciliationCount = reconcileLatestExecutionResultsToLedger()'));
  assert.ok(mainSource.includes('automationLocalDay(existing.timestamp) === automationLocalDay(entry.timestamp)'));
  assert.ok(mainSource.includes("company: item.company || result.company || ''"));
});

test('known personal-profile identity mismatches cannot be reconciled as confirmed development', () => {
  assert.ok(mainSource.includes('function knownInvalidIdentityResult'));
  assert.ok(mainSource.includes("company === 'doorout'"));
  assert.ok(mainSource.includes("parsed.pathname.replace(/\\/+$/, '').toLowerCase() === '/doorout'"));
  assert.ok(!mainSource.includes("evidence.includes('official_social_fallback:facebook')"));
  assert.ok(mainSource.includes('if (knownInvalidIdentityResult(entry)) return'));
});

test('daily execution deduplicates merged website candidates and exits after artifact completion', () => {
  assert.ok(mainSource.includes("list.findIndex(other => other.id === item.id) === index"));
  assert.ok(mainSource.includes('setTimeout(() => process.exit(0), 1500)'));
});

test('email recovery cards expose sender and verifier configuration without secrets', () => {
  assert.ok(mainSource.includes("reason: 'email_sender_not_configured'"));
  assert.ok(mainSource.includes("requiredEnv: ['OUTREACH_EMAIL_FROM', 'ALIBABA_SMTP_USER', 'ALIBABA_SMTP_SECURITY_PASSWORD']"));
  assert.ok(mainSource.includes("requiredEnv: ['HUNTER_API_KEY', 'ZEROBOUNCE_API_KEY', 'NEVERBOUNCE_API_KEY']"));
});

test('Google discovery exposes normalized source metadata while retaining the legacy source', () => {
  assert.ok(discoverySource.includes("source: 'google_customer_discovery'"));
  assert.ok(discoverySource.includes("sourceType: 'google'"));
  assert.ok(discoverySource.includes("discoveryProvider: 'google'"));
  assert.ok(discoverySource.includes("channel: String(item.platform || '').toLowerCase()"));
  assert.ok(dailyRunnerSource.includes("item.sourceType === 'google'"));
});

test('Google discovery includes first-party-backed North America distributor reserve candidates', () => {
  const leads = buildLeads(650);
  const byCompany = new Map(leads.map((lead) => [lead.company, lead]));
  const expected = [
    ['Continental Sports Inc', 'Canada', 'info@csisports.net'],
    ['Outdoor Equipment Distributors', 'United States', 'info@oedinc.com'],
    ['Canadawide Sports', 'Canada', 'info@canadawidesports.com'],
    ['Outdoor Gear Canada', 'Canada', ''],
    ['C&G Distribution', 'United States', ''],
    ['Terra Outdoor Gear Distribution', 'Canada', ''],
    ['JAMSCA Solutions', 'Canada', 'info@jamsca.com'],
    ['GMD Wholesale', 'Canada', ''],
    ['Classic Products International', 'Canada', 'sales@classicproductsinc.com'],
    ['CWR Wholesale Distribution', 'United States', ''],
    ['Northern Exposure Sporting Group', 'Canada', ''],
    ['ROI Recreation Outfitters', 'Canada', 'info@roirecreation.com'],
    ['Hicks Inc', 'United States', 'info@hicks.com'],
    ['Interex Industries', 'Canada', ''],
    ['D.M.A. Distributing', 'Canada', ''],
    ['NordCore Group', 'Canada', ''],
    ['Sturm Mil-Tec USA', 'United States', ''],
    ['ICO Distributors', 'Canada', 'support@bridensolutions.ca'],
    ['Wilcor International', 'United States', ''],
    ['Premium Living Products', 'Canada', ''],
    ['Tin Shack Ltd', 'Canada', ''],
    ['Young & MacKenzie Distribution', 'Canada', ''],
    ['Hendrix Outdoors', 'United States', ''],
    ['Garibaldi Supply Co.', 'Canada', ''],
    ['Yates Outdoor Sales', 'United States', ''],
    ['REVASSA', 'Mexico', ''],
    ['Blue Ridge Knives', 'United States', 'onestop@brk.com'],
    ['Round The Wheel Collective', 'United States', 'patrick@roundthewheelcollective.com'],
    ['1889 Sales', 'United States', ''],
    ['NOHRTH', 'United States', ''],
    ['Can-Am Sales Group', 'United States', 'info@canamsalesgroup.com'],
    ['Zia Works Distribution', 'United States', ''],
    ['The Bunker Agency', 'United States', ''],
    ['Parallel 33 Sales Group', 'United States', ''],
    ['Caraway & Co.', 'United States', ''],
    ['RTIC Mexico', 'Mexico', ''],
    ['Coonhound Sales & Marketing', 'Canada', ''],
    ['Escala Sales & Marketing', 'Canada', ''],
    ['Sportco Marketing', 'United States', ''],
    ['Waypoint Outdoor', 'United States', ''],
    ['Vigos Group', 'United States', ''],
    ['Henry Sports Group', 'Canada', ''],
    ['Urban Outdoor Sales', 'United States', ''],
    ['Howe Sound Sales', 'Canada', ''],
    ['Outdoor Market Alliance', 'United States', ''],
    ['Tandem West Sales', 'Canada', ''],
    ['360 Adventure Collective', 'United States', ''],
    ['OnwardUP', 'Canada', ''],
    ['OUTTECH', 'United States', 'sales@outtech-online.com'],
    ['Covey Sales & Marketing', 'United States', ''],
    ['4 Point Sales', 'United States', ''],
    ['Rep First', 'United States', 'orders@repfirst.com'],
    ['Venture Out, Inc.', 'United States', 'connect@ventureoutinc.com'],
    ['Adventure Marketing Group', 'United States', ''],
    ['Sharp End Sales', 'United States', ''],
    ['Ground Up Sales', 'United States', ''],
    ['Adventure Labworks', 'United States', ''],
    ['End2End Outdoor', 'United States', ''],
    ['Ascension Sales Group', 'United States', ''],
    ['The Alpine Cowboy', 'United States', ''],
    ['KNS Reps', 'United States', 'service@knsreps.com'],
    ['Midwest Outdoor Sales', 'United States', ''],
    ['Parallel 45 Sales Group', 'United States', ''],
    ['Powers Pedersen Sales Group', 'United States', ''],
    ['Pacific Crest Trading', 'United States', ''],
    ['Sierra Outdoor Collective', 'United States', ''],
    ['Green River Sales Group', 'United States', ''],
    ['Cordillera Sales', 'United States', ''],
    ['Granite Marketing', 'United States', ''],
    ['Hi Altitude Sales & Consulting', 'United States', ''],
    ['Summit Sales NW', 'United States', ''],
    ['West Bay Trading Company', 'United States', 'office@westbay.co'],
    ['North Branch Traders', 'United States', 'info@northbranchtraders.com'],
    ['Babbling Brook Sales', 'United States', ''],
    ['Sanitas Sales Group', 'United States', ''],
    ['Mountain Source', 'United States', ''],
    ['Black Dog Sales Group', 'United States', 'info@blackdogsalesgroup.com'],
    ['Freestone Sales Group', 'United States', ''],
    ['Pinnacle Outdoor Group', 'United States', ''],
    ['Roam Sales Agency', 'United States', ''],
    ['Heron Outdoors', 'United States', ''],
    ['Elevated Outdoor Sales', 'United States', ''],
    ['Mindful Outdoor Sales', 'United States', ''],
    ['Stoner Andrews', 'United States', 'office@stonerandrews.com'],
    ['Action Sports Agency', 'United States', ''],
    ['VERT Outdoors', 'United States', ''],
    ['Evergreen Outdoor Group', 'United States', ''],
    ['Skyline Sales & Consulting', 'United States', ''],
    ['Specialty Sports Reps', 'United States', ''],
    ['Brandywine River Reps', 'United States', ''],
    ['Professional Marketing Inc', 'United States', ''],
    ['Elite Outdoor Sports Marketing', 'United States', ''],
    ['Pacific Coast Sports Marketing', 'United States', ''],
    ['7 Summits Sports', 'United States', ''],
    ['Level 8 Outdoor', 'United States', ''],
    ['Sespe Group', 'United States', ''],
    ['Edgeline Collective', 'United States', ''],
    ['Suggs-Nicholas-Shea', 'United States', ''],
    ["O'Brien Sales", 'United States', ''],
    ['Mountain Exposure', 'Canada', ''],
    ['High Gear Sales', 'Canada', ''],
    ['Owens Outdoor Sales', 'United States', ''],
    ['MTNSTUFF', 'United States', ''],
    ['Perspective Outdoor', 'United States', ''],
  ];

  for (const [company, country, email] of expected) {
    const lead = byCompany.get(company);
    assert.ok(lead, `${company} should be present`);
    assert.equal(lead.country, country);
    assert.ok(lead.fitScore >= 70);
    assert.match(lead.url, /^https:\/\//);
    if (email) {
      assert.equal(lead.publicEmail, email);
      assert.match(lead.emailEvidenceUrl, /^https:\/\//);
    }
  }

  for (const company of [
    'Adventure Labworks', 'Summit Sales NW', 'Stoner Andrews', 'OUTTECH', 'OnwardUP',
    'CWR Wholesale Distribution', 'Outdoor Gear Canada', 'JAMSCA Solutions',
    'Action Sports Agency', 'Mountain Exposure', 'Perspective Outdoor',
  ]) {
    const lead = byCompany.get(company);
    assert.equal(lead.customerType, 'sales_agency');
    assert.match(lead.sourceEvidenceUrl, /^https:\/\//);
    assert.doesNotMatch(lead.sourceEvidenceUrl, /google\.com|outdoorretailer\.com/);
  }
});

test('North America refill includes current first-party Mexican and US key accounts with exact official social profiles', () => {
  for (const company of ['Rabbit Mountain Mexico', 'Nomadic Supply Company', 'Punto Vertical Mexico']) {
    assert.ok(discoverySource.includes(`'${company}'`));
  }
  assert.ok(discoverySource.includes('https://www.instagram.com/rabbitmountainmex/'));
  assert.ok(discoverySource.includes('https://www.instagram.com/nomadic.supply/'));
  assert.ok(discoverySource.includes('https://www.instagram.com/puntoverticalmx/'));
});

test('North America refill includes current first-party outdoor sales agencies', () => {
  for (const company of [
    'Endless Adventure Sales', 'The Curtis Group Sales', 'Denne Sport Sales',
    'Aim Outside LLC', 'Activ Agency Denver', 'Air Fresh Marketing',
    'Boardwalk Sales Agency', 'Tandem West Sales', 'Nicolas Rochon Agency',
    'Out There Social Outdoor Agency',
  ]) {
    assert.ok(discoverySource.includes(`'${company}'`));
  }
  assert.ok(discoverySource.includes('https://www.linkedin.com/company/aim-outside-llc'));
  assert.ok(discoverySource.includes('https://www.instagram.com/activagency'));
});

test('daily execution owns and closes each automation-created Chrome tab', () => {
  assert.ok(mainSource.includes('automationOwnedChromeTabs'));
  assert.ok(mainSource.includes('closeAutomationTabsOpenedAfter'));
  assert.ok(mainSource.includes('{ automationOwned: true }'));
  assert.ok(mainSource.includes('await closeAutomationTabsOpenedAfter(ownedTabsAtStart)'));
  assert.ok(mainSource.includes('await closeAutomationChromeTab(chromeOpen)'));
  assert.match(mainSource, /recordAutomationResult\(item, result\);[\s\S]*closeAutomationChromeTab\(result && result\.chromeOpen\)/);
  assert.match(mainSource, /allowParallel:\s*true,[\s\S]{0,120}reuseTab:\s*false/);
  assert.ok(mainSource.includes('const parallelLimit = 1'));
});

test('automation-owned Chrome work is visible in the dedicated 9224 window', () => {
  assert.ok(mainSource.includes("'Target.createTarget'"));
  assert.ok(mainSource.includes('background: false'));
  assert.ok(mainSource.includes("process.env.SHOW_AUTOMATION_CHROME || 'true'"));
  assert.ok(mainSource.includes('if (!options.automationOwned || showAutomationChrome) await activateChromeTarget(port, opened)'));
  assert.ok(!mainSource.includes("'--start-minimized'"));
  assert.ok(mainSource.includes('for (const port of [9224])'));
});

test('browser activation cannot target the operator main Chrome', () => {
  const activationStart = mainSource.indexOf('async function activateChromeTarget');
  const activationEnd = mainSource.indexOf('function cdpCommand', activationStart);
  const activationSource = mainSource.slice(activationStart, activationEnd);
  assert.match(activationSource, /Number\(port\) !== 9224/);
  assert.match(activationSource, /only dedicated CDP 9224 may be activated/);
  assert.match(outreachPolicySource, /Never enumerate, focus, activate, inspect, attach to, or reuse an operator Chrome window/);
  assert.match(optimizedPromptSource, /Never enumerate, focus, inspect, attach to, or reuse the operator's main Chrome/);
});

test('Windows automation runs every three hours in bounded batches', () => {
  const installer = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'install-daily-automation-task.ps1'), 'utf8');
  const runner = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'run-daily-customer-development.ps1'), 'utf8');
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'daily-automation-config.json'), 'utf8'));
  assert.equal(config.checkEveryMinutes, 180);
  assert.equal(config.executionBatchTarget, 13);
  assert.ok(installer.includes('RepetitionInterval (New-TimeSpan -Minutes $EveryMinutes)'));
  assert.ok(installer.includes('Get-Content $ConfigPath -Raw -Encoding UTF8'));
  assert.ok(installer.includes('-MultipleInstances IgnoreNew'));
  assert.ok(runner.includes('$env:DAILY_EXECUTE_LIMIT'));
  assert.ok(runner.includes('Get-Content $ConfigPath -Raw -Encoding UTF8'));
  assert.ok(runner.includes('[Math]::Min([Math]::Max($BatchTarget, 1), 100)'));
});

test('sales copy selects verified FLEXTAIL collateral and keeps social DMs concise', () => {
  const collateralSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'sales-collateral.js'), 'utf8');
  assert.ok(collateralSource.includes('https://www.flextail.com/collections/all-products'));
  assert.ok(collateralSource.includes('https://www.flextail.com/collections/camping-appliances'));
  assert.ok(collateralSource.includes('https://www.flextail.com/products/tiny-pump-2x'));
  assert.ok(glmSource.includes("const isSocial = /facebook|instagram|linkedin/.test(channel)"));
  assert.ok(glmSource.includes("if (!isSocial) {"));
  assert.ok(glmSource.includes("/follow.?up.?2|day.?7|day.?10|close/"));
  assert.ok(glmSource.includes("/follow|day.?3|day.?5/"));
  const socialDraft = professionalSalesDraft({ company: 'Trail Shop', platform: 'Facebook', category: 'camping' }, '');
  const emailDraft = professionalSalesDraft({ company: 'Trail Shop', platform: 'Email', category: 'camping' }, '');
  assert.doesNotMatch(socialDraft, /https?:\/\//);
  assert.match(emailDraft, /https:\/\/www\.flextail\.com\//);
  assert.match(emailDraft, /Best regards,/);
  assert.match(emailDraft, /vendor\/category review/);
  assert.doesNotMatch(emailDraft, /nice to e-meet you/i);
});

test('daily execution duplicate blocking is channel-aware', () => {
  assert.ok(mainSource.includes('function canonicalExactAutomationKey'));
  assert.ok(mainSource.includes('SAME_DAY_DEVELOPMENT_STATUSES'));
  assert.ok(mainSource.includes('sameDayAutomationCompanyKeys'));
  assert.ok(mainSource.includes('same_day_customer_already_developed'));
  assert.ok(mainSource.includes('const selectedCompanyKeys = new Set(sameDayCompanyKeys)'));
  assert.ok(mainSource.includes('automationCompanyKeys(item).forEach(key => selectedCompanyKeys.add(key))'));
  assert.ok(mainSource.includes('itemBlockedBySameDayCompany(item, sameDayCompanyKeys)'));
  assert.ok(mainSource.includes('function failedOpenResultShouldBlockRetry'));
  assert.ok(mainSource.includes("evidence.includes('profile_no_message_button')"));
  assert.ok(mainSource.includes('message_button_clicked_composer_not_found'));
  assert.ok(mainSource.includes("result.status !== 'failed_open' || failedOpenResultShouldBlockRetry(result)"));
  assert.ok(mainSource.includes("['website_contact_ready', 'website_contact_unreachable_skip'].includes(result.status)"));
  assert.ok(mainSource.includes('isSameAutomationDay(result.timestamp)'));
  assert.ok(mainSource.includes('WEBSITE_CONTACT_STRATEGY_MARKER'));
  assert.ok(mainSource.includes("status: 'website_failure_circuit_open'"));
  assert.ok(mainSource.includes('failedDays.size >= 3'));
  assert.ok(mainSource.includes('function automationPlatformFor'));
  assert.ok(mainSource.includes('const exactKeys = automationExactKeys(item)'));
  assert.ok(mainSource.includes('const itemPlatform = automationPlatformFor(item)'));
  assert.ok(mainSource.includes('const companyBlocking = new Set'));
  assert.ok(mainSource.includes('COMPANY_HISTORY_BLOCKING_STATUSES'));
  assert.ok(mainSource.includes('historicalAutomationResultBlocksCompany(result) && setsIntersect(companyKeys, automationCompanyKeys(result))'));
  assert.ok(mainSource.includes("'approval_pending'"));
  assert.ok(mainSource.includes("'website_contact_ready'"));
  assert.ok(mainSource.includes("'website_contact_unreachable_skip'"));
  assert.ok(mainSource.includes('email_sender_not_configured'));
  assert.ok(mainSource.includes('companyBlocking.has(result.status)'));
  assert.ok(mainSource.includes('sendStatusHasCustomerInteraction(result.status, result.evidence)'));
  assert.ok(mainSource.includes('if (!itemPlatform || !resultPlatform || itemPlatform !== resultPlatform) return false'));
  assert.ok(mainSource.includes("'website_contact_unreachable_skip'"));
  assert.ok(!mainSource.includes("'sent_confirmed', 'failed_open', 'send_unconfirmed', 'skipped'"));
});

test('same-day failed customer advances without cross-run replay and closes its automation tab', () => {
  assert.match(mainSource, /const latestExecutionResults = Array\.isArray\(latestExecution\.executed\)/);
  assert.match(mainSource, /const results = \[\.\.\.ledgerResults, \.\.\.latestExecutionResults\]/);
  assert.match(mainSource, /sameDayFailedAttempts\.length >= 1/);
  assert.match(mainSource, /setsIntersect\(companyKeys, automationCompanyKeys\(result\)\)/);
  assert.match(mainSource, /block\.status === 'same_day_retry_circuit_open'\) return false/);
  assert.match(mainSource, /reuseTab: false/);
  assert.match(mainSource, /await closeAutomationChromeTab\(result && result\.chromeOpen\)/);
  assert.match(outreachPolicySource, /Once that execution records `failed_open`, retire the entire company/);
  assert.match(optimizedPromptSource, /Distinguish in-task fallback from cross-run replay/);
  assert.match(optimizedPromptSource, /A single blocked company must never terminate or monopolize the batch/);
  assert.match(optimizedPromptSource, /temporary Shanghai-day failure circuit/);
  assert.match(outreachPolicySource, /Email is a preferred route, never a batch-wide dependency/);
  assert.match(outreachPolicySource, /executable code, a regression test/);
  assert.match(optimizedPromptSource, /Email authentication is route-specific, never batch-wide/);
  assert.match(optimizedPromptSource, /executable code, regression tests, Policy/);
  assert.match(outreachPolicySource, /bounded retry for transient Windows/);
  assert.match(optimizedPromptSource, /bounded transient Windows file-lock retry/);
});

test('email performs a final company-wide permanent dedupe check immediately before sending', () => {
  const companyStatusesStart = mainSource.indexOf('const COMPANY_HISTORY_BLOCKING_STATUSES');
  const companyStatusesEnd = mainSource.indexOf(']);', companyStatusesStart) + 3;
  const companyStatuses = mainSource.slice(companyStatusesStart, companyStatusesEnd);
  assert.match(companyStatuses, /sent_confirmed/);
  assert.match(companyStatuses, /submitted_confirmed/);
  assert.match(companyStatuses, /send_unconfirmed/);
  const sendGateStart = mainSource.indexOf('async function runVerifiedAlibabaEmailLead');
  const sendGateEnd = mainSource.indexOf('function canFallbackAfterEmailPreflight', sendGateStart);
  const sendGate = mainSource.slice(sendGateStart, sendGateEnd);
  assert.match(sendGate, /const sendTimeResults = readJsonScriptArray/);
  assert.match(sendGate, /historicalAutomationResultBlocksCompany\(item\)/);
  assert.match(sendGate, /setsIntersect\(leadCompanyKeys, automationCompanyKeys\(item\)\)/);
  assert.match(sendGate, /reason: 'previous_customer_development_no_repeat'/);
  assert.match(sendGate, /mode: 'irreversible_send_company_dedupe_gate'/);
  assert.match(sendGate, /no_send_performed/);
  assert.ok(sendGate.indexOf('priorCompanyContact') < sendGate.indexOf('sendAndConfirmAlibabaEmail'));
});

test('a preserved populated email composer stays route-specific and never suppresses the whole company', () => {
  const blockerStart = mainSource.indexOf('function historicalAutomationResultBlocksCompany');
  const blockerEnd = mainSource.indexOf('function exactSocialHandleMatchesCompany', blockerStart);
  const blocker = mainSource.slice(blockerStart, blockerEnd);
  assert.match(blocker, /result\.status !== 'failed_open'/);
  assert.doesNotMatch(blocker, /composer_preserved_for_technical_evidence/);
  assert.doesNotMatch(blocker, /alibaba_webmail_content_inserted/);
  const discoveryBlockerStart = dailyRunnerSource.indexOf('function isHistoricalDevelopmentResult');
  const discoveryBlockerEnd = dailyRunnerSource.indexOf('function noSafeMessageButtonEvidence', discoveryBlockerStart);
  const discoveryBlocker = dailyRunnerSource.slice(discoveryBlockerStart, discoveryBlockerEnd);
  assert.doesNotMatch(discoveryBlocker, /composer_preserved_for_technical_evidence/);
  assert.doesNotMatch(discoveryBlocker, /alibaba_webmail_content_inserted/);
  assert.ok(mainSource.includes('composer_preserved_for_technical_evidence'));
  const sendGateStart = mainSource.indexOf('async function runVerifiedAlibabaEmailLead');
  const sendGateEnd = mainSource.indexOf('function canFallbackAfterEmailPreflight', sendGateStart);
  const sendGate = mainSource.slice(sendGateStart, sendGateEnd);
  assert.ok(sendGate.includes("reason: 'email_route_preserved_draft_no_reopen'"));
  assert.ok(sendGate.includes("mode: 'email_route_level_duplicate_gate'"));
  assert.ok(sendGate.includes('no_email_composer_opened;no_send_performed'));
  assert.ok(sendGate.indexOf('const preservedRoute') < sendGate.indexOf('const sendTimeResults'));
  assert.ok(mainSource.includes("'email_route_preserved_draft_no_reopen'"));
});

test('dedicated website and Instagram execution report truthful transport and confirm Enter fallback', () => {
  assert.ok(mainSource.includes("engine: 'dedicated-chrome-cdp-website-contact'"));
  assert.doesNotMatch(mainSource, /engine: 'codex-chrome-extension-website-contact'/);
  assert.ok(chromeDriverSource.includes("platform === 'instagram'"));
  assert.ok(chromeDriverSource.includes('${platform}_message_sent_confirmed_after_enter'));
  assert.ok(chromeDriverSource.includes('${platform}_enter_send_attempted_but_confirmation_missing'));
  assert.ok(chromeDriverSource.includes("windowsVirtualKeyCode: 13"));
});

test('social send never clicks an unlabeled nearby control and interaction evidence requires a verified draft chain', () => {
  const sendButtonStart = chromeDriverSource.indexOf('function sendButtonExpression');
  const sendButtonEnd = chromeDriverSource.indexOf('function composerTextExpression', sendButtonStart);
  const sendButtonSource = chromeDriverSource.slice(sendButtonStart, sendButtonEnd);
  assert.ok(sendButtonSource.includes('explicitSendControl: true'));
  assert.doesNotMatch(sendButtonSource, /const nearComposer|const rightMost/);
  assert.ok(chromeDriverSource.includes('verified_draft_present_before_irreversible_action'));
  assert.ok(chromeDriverSource.includes("platform === 'instagram' || platform === 'facebook'"));
  assert.match(mainSource, /send_clicked_but_confirmation_missing\|enter_send_attempted_but_confirmation_missing\|submit_clicked[\s\S]*verified_draft_present_before_irreversible_action/);
  assert.match(dailyRunnerSource, /send_clicked_but_confirmation_missing\|enter_send_attempted_but_confirmation_missing\|submit_clicked[\s\S]*verified_draft_present_before_irreversible_action/);
});

test('uninserted social draft does not block same-company website fallback', () => {
  assert.ok(mainSource.includes('function sendStatusHasCustomerInteraction'));
  assert.ok(mainSource.includes('sendStatusHasCustomerInteraction(sendStatus, output.evidence || result.evidence ||'));
  assert.match(mainSource, /result\.status !== 'send_unconfirmed'[\s\S]*sendStatusHasCustomerInteraction\(result\.status, result\.evidence\)/);
});

test('explicit uncertain delivery blocks automatic resend across the queue and final executor gates', () => {
  const result = {
    company: 'Uncertain Outdoor',
    status: 'send_unconfirmed',
    evidence: 'browser_control_timeout;delivery_state_uncertain;automatic_resend_forbidden',
    timestamp: '2026-08-10T11:07:30.000Z',
  };
  assert.equal(dailyRunner.isHistoricalDevelopmentResult(result), true);
  assert.match(mainSource, /delivery_state_uncertain[\s\S]*automatic_resend_forbidden/);
  assert.match(dailyRunnerSource, /delivery_state_uncertain[\s\S]*automatic_resend_forbidden/);
});

test('ledger reconciliation deduplicates one delivery across mailto and website target variants', () => {
  assert.match(mainSource, /const sameMessageId = entry\.messageId/);
  assert.match(mainSource, /const sameLogicalDelivery = existing\.task_id === entry\.task_id/);
  assert.match(mainSource, /existing\.recipientEmail[\s\S]*entry\.recipientEmail/);
  assert.match(mainSource, /return sameMessageId \|\| sameLogicalDelivery/);
});

test('website pre-send failures continue to first-party verified social instead of stranding the company', () => {
  assert.ok(mainSource.includes('const websitePreSendFailure'));
  assert.ok(mainSource.includes('const verifiedSocialFallback = websitePreSendFailure && !websiteInteractionUncertain'));
  assert.ok(mainSource.includes('website_presend_social_fallback'));
  assert.match(mainSource, /websiteInteractionUncertain = \/send_unconfirmed\|submit_unconfirmed\|send_physical_click\|submit_physical_click\|customer_interaction\//);
  assert.ok(mainSource.includes('verifiedSocialFallback.officialSocialProfileVerified === true'));
  assert.ok(mainSource.includes('function websiteCanReinspectForFirstPartySocial'));
  assert.ok(mainSource.includes("if (block.status === 'same_day_retry_circuit_open') return false"));
  assert.ok(mainSource.includes('A technical failure retires the company for the rest of the Shanghai'));
  assert.ok(mainSource.includes('return websiteCanReinspectForFirstPartySocial(item)'));
});

test('daily queue generator blocks same-day repeat development by company', () => {
  assert.ok(dailyRunnerSource.includes('SAME_DAY_DEVELOPMENT_STATUSES'));
  assert.ok(dailyRunnerSource.includes('function companyLeadKeys'));
  assert.ok(dailyRunnerSource.includes('sameDayDeveloped'));
  assert.ok(dailyRunnerSource.includes('same_day_customer_already_developed'));
  assert.ok(dailyRunnerSource.includes('context.sameDayByCompany'));
});

test('queue touch truth excludes likes, follows, and unreachable website attempts', () => {
  for (const constantName of ['TOUCH_STATUSES', 'SAME_DAY_DEVELOPMENT_STATUSES', 'HISTORICAL_DEVELOPMENT_STATUSES']) {
    const start = dailyRunnerSource.indexOf(`const ${constantName}`);
    const end = dailyRunnerSource.indexOf(']);', start) + 3;
    const block = dailyRunnerSource.slice(start, end);
    assert.match(block, /sent_confirmed/);
    assert.match(block, /submitted_confirmed/);
    assert.doesNotMatch(block, /bounced|post_liked|account_followed|website_contact_unreachable_skip/);
  }
});

test('daily queue generator blocks cross-channel repeats for already developed companies', () => {
  const now = Date.parse('2026-07-08T02:00:00.000Z');
  const history = dailyRunner.knownTouchIndex([
    {
      task_id: 'google-customer-bever-facebook',
      status: 'sent_confirmed',
      timestamp: '2026-06-26T10:00:00.000Z',
      target_url: 'https://www.facebook.com/BeverNL',
      evidence: 'facebook_message_sent_confirmed_composer_cleared',
    },
    {
      task_id: 'google-customer-go-outdoors-website-contact',
      status: 'approval_pending',
      timestamp: '2026-07-08T01:48:13.857Z',
      target_url: 'https://www.gooutdoors.co.uk/contact-us',
      evidence: 'contact_entry_verified;marketing_attachment_missing',
    },
    {
      task_id: 'google-customer-sail-outdoors-website-contact',
      company: 'Sail Outdoors',
      status: 'sent_confirmed',
      timestamp: '2026-07-08T01:55:00.000Z',
      target_url: 'https://www.sail.ca/en/contact-us',
      evidence: 'user_confirmed_official_website_email_sent;contact_entry_verified;mailto_detected',
    },
  ], [], now);

  const beverWebsite = {
    id: 'google-customer-bever-website-contact',
    company: 'Bever',
    name: 'Bever',
    platform: 'website_form',
    contactUrl: 'https://www.bever.nl/klantenservice/contactgegevens.html',
  };
  const goOutdoorsFacebook = {
    id: 'google-customer-go-outdoors-facebook',
    company: 'GO Outdoors',
    name: 'GO Outdoors',
    platform: 'facebook',
    url: 'https://www.facebook.com/GOOutdoors',
  };
  const sailWebsite = {
    id: 'google-customer-sail-outdoors-website-contact',
    company: 'Sail Outdoors',
    name: 'Sail Outdoors',
    platform: 'website_form',
    website: 'https://www.sail.ca/',
    contactUrl: 'https://www.sail.ca/en/contact-us',
  };
  const sailInstagram = {
    id: 'google-customer-sail-outdoors-instagram',
    company: 'Sail Outdoors',
    name: 'Sail Outdoors',
    platform: 'instagram',
    url: 'https://www.instagram.com/sailoutdoors/',
  };

  assert.ok(dailyRunner.companyLeadKeys(beverWebsite).some(key => history.touched.has(key)));
  assert.ok(dailyRunner.companyLeadKeys(goOutdoorsFacebook).some(key => history.touched.has(key)));
  assert.ok(dailyRunner.companyLeadKeys(sailWebsite).some(key => history.sentConfirmed.has(key)));
  assert.ok(dailyRunner.companyLeadKeys(sailInstagram).some(key => history.sentConfirmed.has(key)));
});

test('discovery ignores likes and follows while preserving confirmed DM protection', () => {
  const now = Date.parse('2026-07-09T00:00:00.000Z');
  const history = dailyRunner.knownTouchIndex([
    {
      task_id: 'google-customer-bass-pro-shops-facebook',
      status: 'post_liked',
      timestamp: '2026-07-01T06:28:33.983Z',
      target_url: 'https://www.facebook.com/bassproshops',
    },
    {
      task_id: 'google-customer-mec-instagram',
      status: 'account_followed',
      timestamp: '2026-07-05T01:05:27.767Z',
      target_url: 'https://www.instagram.com/mec',
    },
    {
      task_id: 'google-customer-bever-facebook',
      status: 'sent_confirmed',
      timestamp: '2026-06-26T10:00:00.000Z',
      target_url: 'https://www.facebook.com/BeverNL',
    },
  ], [], now);

  assert.ok(!history.activeCooldown.has('bassproshops'));
  assert.ok(!history.activeCooldown.has('mec'));
  assert.ok(history.sentConfirmed.has('bever'));
});

test('North America receives only the configured safe-priority bonus', () => {
  assert.equal(dailyRunner.preferredCountryScore({ country: 'United States' }), 30);
  assert.equal(dailyRunner.preferredCountryScore({ countryEn: 'Canada' }), 30);
  assert.equal(dailyRunner.preferredCountryScore({ country: 'Mexico' }), 30);
  assert.equal(dailyRunner.preferredCountryScore({ country: 'United Kingdom' }), 0);
});

test('North America campaign scope includes large key accounts and brand agencies but excludes other markets', () => {
  assert.deepEqual(dailyConfig.campaignScope.requiredCountries, ['united states', 'canada', 'mexico']);
  assert.deepEqual(dailyConfig.campaignScope.requiredCustomerTypes, ['sales_agency', 'key_account']);
  assert.ok(dailyRunnerSource.includes('function campaignScopeMatches'));
  assert.match(dailyRunnerSource, /\.filter\(campaignScopeMatches\)/);
  assert.ok(!dailyRunnerSource.includes("filter(item => !/^united states$/i"));
  assert.ok(dailyRunnerSource.includes("['agency', 'sales_agency']"));
});

test('current owner target is exactly 100 confirmed North American agencies', () => {
  const override = dailyConfig.campaignScope.oneDayAdditionalConfirmedTarget;
  assert.equal(override.shanghaiDate, '2026-08-13');
  assert.equal(override.baseDailyTarget, 100);
  assert.equal(override.additionalTarget, 0);
  assert.equal(override.effectiveDailyTarget, 100);
  assert.equal(override.authorizedByOwner, true);
  assert.ok(mainSource.includes('function effectiveDailyConfirmedCompanyTarget'));
  assert.ok(mainSource.includes('Math.min(200'));
});

test('confirmed email immediately continues to a first-party verified official social channel', () => {
  assert.equal(dailyConfig.cadence.multiChannelSameCustomer, true);
  assert.ok(mainSource.includes('executeVerifiedSocialTouchAfterConfirmedEmail'));
  assert.ok(mainSource.includes('parallel_multichannel:'));
  assert.ok(mainSource.includes('recordAutomationResult(fallbackLead, socialResult)'));
  assert.ok(enrichmentSource.includes("reason: 'official_website_social_channel_verified'"));
  assert.ok(enrichmentSource.includes('rows.push({'));
  assert.ok(mainSource.includes("const isExplicitSocial = ['linkedin', 'facebook', 'instagram'].includes(platform)"));
  assert.ok(mainSource.includes('const isWebsiteContact = !isExplicitSocial'));
});

test('daily execution watchdog recomputes confirmed count inside its own scope', () => {
  const watchdogStart = mainSource.indexOf('const watchdog = setTimeout(async () =>');
  const watchdogEnd = mainSource.indexOf('}, timeoutMs);', watchdogStart);
  const watchdogSource = mainSource.slice(watchdogStart, watchdogEnd);
  assert.ok(watchdogStart >= 0 && watchdogEnd > watchdogStart);
  assert.match(watchdogSource, /const confirmedToday = sameDayConfirmedCompanyCount\(/);
  assert.match(watchdogSource, /executionQueueGoalStatus\(latest\.summary \|\| \{\}, confirmedToday\)/);
});
