const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

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

const mainSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'main.js'), 'utf8');
const chromeDriverSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'codex-chrome-driver.js'), 'utf8');
const dailyRunnerSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'daily-automation-runner.js'), 'utf8');
const templateSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'api', 'templates.js'), 'utf8');

test('legacy pending sequence statuses do not mark a customer as previously developed', () => {
  assert.equal(dailyRunner.legacyStatusIndicatesTouch('Pending'), false);
  assert.equal(dailyRunner.legacyStatusIndicatesTouch('0 out of 6'), false);
  assert.equal(dailyRunner.legacyStatusIndicatesTouch('2 out of 6'), true);
  assert.equal(dailyRunner.legacyStatusIndicatesTouch('Sent'), true);
  assert.equal(dailyRunner.legacyStatusIndicatesTouch('Accepted'), true);
});

test('daily queue prioritizes Facebook and Instagram over website contact', () => {
  assert.ok(dailyRunner.channelPriorityScore({ platform: 'facebook' })
    > dailyRunner.channelPriorityScore({ platform: 'instagram' }));
  assert.ok(dailyRunner.channelPriorityScore({ platform: 'instagram' })
    > dailyRunner.channelPriorityScore({ platform: 'email', reason: 'official_website_contact_channel' }));
  assert.ok(dailyRunner.channelPriorityScore({ platform: 'facebook' })
    > dailyRunner.channelPriorityScore({ platform: 'email', reason: 'official_website_contact_channel' }));
});

test('website contact can execute without a configured attachment', () => {
  assert.ok(mainSource.includes("executableQueueCandidates(latest.dailyQueue, { allowWebsiteContact: true })"));
  assert.ok(!mainSource.includes('website_contact_preflight_blocked'));
  assert.ok(mainSource.includes('text_only_manual_submit_required'));
  assert.ok(mainSource.includes("sendStatus: filled && filled.ok ? 'website_contact_ready' : 'approval_pending'"));
  assert.ok(mainSource.includes('website_contact_public_email_ready'));
  assert.ok(mainSource.includes('public_email_fallback_available'));
});

test('daily execution ranks Facebook and Instagram before website contact fallback', () => {
  assert.ok(mainSource.includes('function socialPriorityRank'));
  assert.ok(mainSource.includes('function developmentPriorityCompare'));
  assert.ok(mainSource.includes("if (/\\bfacebook\\b|facebook\\.com/.test(text)) return 300"));
  assert.ok(mainSource.includes("if (/\\binstagram\\b|instagram\\.com/.test(text)) return 290"));
  assert.ok(mainSource.includes('return socialPriorityRank(right) - socialPriorityRank(left)'));
  assert.ok(mainSource.includes('[...dueCandidates, ...scheduledExecutable, ...potentialFallback]'));
  assert.ok(mainSource.includes('.sort(developmentPriorityCompare)'));
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
  assert.ok(mainSource.includes('.filter(item => !hasNoSafeMessageButton(item))'));
});

test('unsubmitted website preparation creates a durable company history lock without claiming a sent touch', () => {
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
  assert.ok(index.priorDeveloped.has('kathmandu'));
  assert.equal(index.priorDevelopedDetails.get('kathmandu'), websiteAttempt);
});

test('previous customer development blocks Summit across days and channels', () => {
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

  assert.ok(history.priorDeveloped.has('summitinternational'));
  assert.equal(classified.action, 'cooldown');
  assert.equal(classified.reason, 'previous_customer_development_no_repeat');
  assert.equal(classified.lastStatus, 'website_contact_ready');
});

test('historical development lock distinguishes user interaction from transient browser failure', () => {
  assert.equal(dailyRunner.isHistoricalDevelopmentResult({
    status: 'failed_open',
    evidence: 'chrome_target_not_found',
  }), false);
  assert.equal(dailyRunner.isHistoricalDevelopmentResult({
    status: 'failed_open',
    evidence: 'facebook_message_button_clicked_composer_not_found',
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

test('email templates follow Flextail and Vollyc reference copy', () => {
  assert.ok(templateSource.includes('Flextail & Vollyc'));
  assert.ok(templateSource.includes('Top 1 on Amazon'));
  assert.ok(templateSource.includes('over 36 new SKUs in 2026'));
  assert.ok(templateSource.includes('short introductory video meeting'));
  assert.ok(templateSource.includes('[Flextail.com](https://www.flextail.com/)'));
  assert.ok(templateSource.includes('[Tel/whatsapp:  +86 17321028184](https://wa.me/8617321028184)'));
  assert.ok(templateSource.includes('[Email:  Leo@flextailgear.com](https://wa.me/8617321028184)'));
});

test('Google discovery creates Instagram, Facebook and website contact channels', () => {
  const leads = buildLeads(60);
  const cabela = leads.filter(item => item.company === "Cabela's");
  assert.ok(cabela.some(item => item.platform === 'instagram' && /instagram\.com\/cabelas/i.test(item.url)));
  assert.ok(cabela.some(item => item.platform === 'facebook' && /facebook\.com\/Cabelas/i.test(item.url)));
  const emailLead = cabela.find(item => item.platform === 'email');
  assert.equal(emailLead.action, 'email_priority');
  assert.equal(emailLead.emailFrom, 'leo@flextailgear.com');
  assert.equal(emailLead.websiteContactSubject, 'Flextail & Vollyc | Lightweight Outdoor & 3C Electronics – Potential Cooperation');
  assert.match(emailLead.websiteContactMessage, /Dear Cabela's Team/);
  assert.match(emailLead.websiteContactMessage, /Flextail’s product philosophy/);
  assert.match(emailLead.websiteContactMessage, /\[Flextail\.com\]\(https:\/\/www\.flextail\.com\/\)/);
  assert.match(emailLead.websiteContactMessage, /\[Leo Liu\]\(https:\/\/wa\.me\/8617321028184\)/);
  assert.match(emailLead.websiteContactMessage, /\[Brand & ODM Department\]\(https:\/\/wa\.me\/8617321028184\)/);
  assert.equal(emailLead.publicEmail, 'vendorrelations@basspro.com');
  assert.match(emailLead.linkedinUrl, /linkedin\.com/);
  assert.match(emailLead.vendorPortal, /cabelas|basspro/i);
  assert.match(emailLead.companyScale, /employee|retail|locations/i);
  assert.match(emailLead.contactSearchUrl, /contact|buyer|wholesale|vendor/i);
  assert.ok(emailLead.alternateChannels.instagram);
  assert.ok(emailLead.alternateChannels.facebook);
});

test('Google discovery reroutes known broken Instagram links to alternate channels', () => {
  const leads = buildLeads(60);
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

test('Google discovery keeps a refill pool for new prospects after current customers are developed', () => {
  const run = buildDiscoveryRun(120);
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

test('Google discovery gives autonomous refill customers social channels before website contact', () => {
  const leads = buildLeads(120);
  for (const company of ['Liberty Mountain', 'Sportsman\'s Warehouse', 'Camping World']) {
    const companyLeads = leads.filter(item => item.company === company);
    assert.ok(companyLeads.some(item => item.platform === 'instagram'));
    assert.ok(companyLeads.some(item => item.platform === 'facebook'));
    assert.ok(companyLeads.findIndex(item => item.platform === 'instagram')
      < companyLeads.findIndex(item => item.platform === 'email'));
    assert.ok(companyLeads.findIndex(item => item.platform === 'facebook')
      < companyLeads.findIndex(item => item.platform === 'email'));
  }
  const summitLeads = leads.filter(item => item.company === 'Summit International');
  assert.ok(!summitLeads.some(item => item.platform === 'facebook'));
  assert.ok(!summitLeads.some(item => item.platform === 'instagram'));
  assert.ok(summitLeads.some(item => item.platform === 'email'));
});

test('daily queue preserves multi-channel outreach but ranks social before website contact', () => {
  const filtered = dailyRunner.preferSocialChannels([
    {
      id: 'google-customer-sail-outdoors-website-contact',
      company: 'Sail Outdoors',
      platform: 'email',
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
      platform: 'email',
      url: 'https://libertymountain.com/find-a-rep',
      reason: 'official_website_contact_channel',
    },
  ]);
  assert.ok(filtered.some(item => item.id === 'google-customer-sail-outdoors-facebook'));
  assert.ok(filtered.some(item => item.id === 'google-customer-sail-outdoors-instagram'));
  assert.ok(filtered.some(item => item.id === 'google-customer-sail-outdoors-website-contact'));
  assert.ok(filtered.some(item => item.id === 'google-customer-liberty-mountain-website-contact'));
  assert.equal(filtered[0].id, 'google-customer-sail-outdoors-facebook');
  assert.equal(filtered[1].id, 'google-customer-sail-outdoors-instagram');
  assert.ok(filtered.findIndex(item => item.id === 'google-customer-sail-outdoors-website-contact')
    > filtered.findIndex(item => item.id === 'google-customer-sail-outdoors-facebook'));
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
  assert.ok(mainSource.includes("const DEFAULT_WEBSITE_CONTACT_FIRST_NAME = 'Leo'"));
  assert.ok(mainSource.includes("const DEFAULT_WEBSITE_CONTACT_LAST_NAME = 'Liu'"));
  assert.ok(mainSource.includes('Flextail & Vollyc | Lightweight Outdoor & 3C Electronics – Potential Cooperation'));
  assert.ok(mainSource.includes('Flextail’s product philosophy'));
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
  assert.ok(mainSource.includes('function formatExecutionBlockerStatus'));
  assert.ok(mainSource.includes('function executionRecoveryHint'));
  assert.ok(mainSource.includes('Configure WEBSITE_MARKETING_FILE or MARKETING_ATTACHMENT_PATH'));
  assert.ok(mainSource.includes('Customer development was not performed. Blockers:'));
  assert.ok(mainSource.includes('submit_paused_by_env'));
  assert.ok(mainSource.includes('required_fields_auto_bypassed'));
  assert.ok(mainSource.includes("el.tagName === 'TEXTAREA' && /description|message|details|request/.test(key)"));
  assert.ok(mainSource.includes('.ck-editor__editable,.ql-editor,[role="textbox"]'));
  assert.ok(mainSource.includes("sendStatus: 'approval_pending'"));
  assert.ok(mainSource.includes("evidence: contactFlow.evidence"));
  assert.ok(mainSource.includes("sendStatus: 'website_contact_ready'"));
  assert.ok(dailyRunnerSource.includes('function isVerifiedWebsiteContactResult'));
  assert.ok(dailyRunnerSource.includes('isTouchResult(result)'));
});

test('Google discovery uses a live Bever contact details URL instead of the retired 404 page', () => {
  const leads = buildLeads(120);
  const beverContact = leads.find(item => item.id === 'google-customer-bever-website-contact');
  assert.ok(beverContact);
  assert.equal(beverContact.contactUrl, 'https://www.bever.nl/klantenservice/contactgegevens.html');
  assert.notEqual(beverContact.contactUrl, 'https://www.bever.nl/klantenservice/contact.html');
  assert.equal(beverContact.vendorPortal, 'https://www.bever.nl/klantenservice/contactgegevens.html');
});

test('Codex Chrome execution can auto-send approved social outreach with confirmation', () => {
  assert.ok(mainSource.includes('async function prepareInstagramDraft'));
  assert.ok(mainSource.includes('async function prepareSocialDraft'));
  assert.ok(mainSource.includes('codex-chrome-driver.js'));
  assert.ok(mainSource.includes("runCodexChromeDriver('prepare-instagram-draft'"));
  assert.ok(mainSource.includes("runCodexChromeDriver('prepare-social-draft'"));
  assert.ok(mainSource.includes('autoSend: true'));
  assert.ok(mainSource.includes('replaceExistingDraft: true'));
  assert.ok(mainSource.includes('function recordAutomationResult'));
  assert.ok(mainSource.includes('recordAutomationResult(item, result)'));
  assert.ok(mainSource.includes('inspect-social-context'));
  assert.ok(mainSource.includes('optimizeDraftWithContext'));
  assert.ok(mainSource.includes('contextAwareFallbackDraft'));
  assert.ok(mainSource.includes('local-professional-template-fallback'));
  assert.ok(mainSource.includes('local_template_fallback_after_glm_error'));
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
  assert.ok(chromeDriverSource.includes('document.elementFromPoint'));
  assert.ok(chromeDriverSource.includes('profileMessageButtonExpression'));
  assert.ok(chromeDriverSource.includes("closest('nav,[role=\"navigation\"]')"));
  assert.ok(chromeDriverSource.includes('closeBlockingOverlayExpression'));
  assert.ok(chromeDriverSource.includes('submitInstagramPostEngagement'));
  assert.match(chromeDriverSource, /platform === 'instagram'[\s\S]*clickOptionalAction\(tab, 'follow', platform\)[\s\S]*submitInstagramPostEngagement\(tab/);
  assert.ok(chromeDriverSource.includes('submitFacebookPostEngagement'));
  assert.ok(chromeDriverSource.includes('facebookPostLikeButtonExpression'));
  assert.ok(chromeDriverSource.includes('facebookStartButtonExpression'));
  assert.ok(chromeDriverSource.includes('insertDraftAndVerify'));
  assert.ok(chromeDriverSource.includes('facebook_draft_inserted_after_composer_refocus'));
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
  assert.ok(chromeDriverSource.includes("command === 'prepare-social-draft'"));
  assert.ok(chromeDriverSource.includes("facebook: ['message'"));
  assert.ok(chromeDriverSource.includes('${platform}_message_composer_opened_and_draft_inserted_no_send'));
  assert.ok(mainSource.includes("sendStatus: 'draft_prepared'"));
  assert.ok(mainSource.includes('message_composer_opened_and_draft_inserted_no_send'));
  assert.ok(!mainSource.includes("byText(['send', '发送'])"));
});

test('daily execution is serial and can process a priority batch per run', () => {
  assert.ok(mainSource.includes("mode: 'serial-single-target'"));
  assert.ok(mainSource.includes('const parallelLimit = 1'));
  assert.ok(mainSource.includes('const limit = requestedLimit'));
  assert.ok(mainSource.includes('process.env.DAILY_EXECUTE_LIMIT || 10'));
  assert.ok(mainSource.includes('const isAutoRunDaily = process.argv.includes'));
  assert.ok(mainSource.includes('async function runAutoDailyAndWriteArtifact'));
  assert.ok(mainSource.includes('timeout: 120000'));
});

test('daily execution duplicate blocking is channel-aware', () => {
  assert.ok(mainSource.includes('function canonicalExactAutomationKey'));
  assert.ok(mainSource.includes('SAME_DAY_DEVELOPMENT_STATUSES'));
  assert.ok(mainSource.includes('sameDayAutomationCompanyKeys'));
  assert.ok(mainSource.includes('same_day_customer_already_developed'));
  assert.ok(mainSource.includes('const selectedCompanyKeys = new Set(sameDayCompanyKeys)'));
  assert.ok(mainSource.includes('itemBlockedBySameDayCompany(item, sameDayCompanyKeys)'));
  assert.ok(mainSource.includes('function failedOpenResultShouldBlockRetry'));
  assert.ok(mainSource.includes('message_button_clicked_composer_not_found'));
  assert.ok(mainSource.includes("result.status !== 'failed_open' || failedOpenResultShouldBlockRetry(result)"));
  assert.ok(mainSource.includes('function automationPlatformFor'));
  assert.ok(mainSource.includes('const exactKeys = automationExactKeys(item)'));
  assert.ok(mainSource.includes('const itemPlatform = automationPlatformFor(item)'));
  assert.ok(mainSource.includes('const companyBlocking = new Set'));
  assert.ok(mainSource.includes('COMPANY_HISTORY_BLOCKING_STATUSES'));
  assert.ok(mainSource.includes('historicalAutomationResultBlocksCompany(result) && setsIntersect(companyKeys, automationCompanyKeys(result))'));
  assert.ok(mainSource.includes("'approval_pending'"));
  assert.ok(mainSource.includes("'website_contact_ready'"));
  assert.ok(mainSource.includes('companyBlocking.has(result.status) && setsIntersect(companyKeys, automationCompanyKeys(result))'));
  assert.ok(mainSource.includes('if (!itemPlatform || !resultPlatform || itemPlatform !== resultPlatform) return false'));
  assert.ok(mainSource.includes("'website_contact_unreachable_skip'"));
  assert.ok(!mainSource.includes("'sent_confirmed', 'failed_open', 'send_unconfirmed', 'skipped'"));
});

test('daily queue generator blocks same-day repeat development by company', () => {
  assert.ok(dailyRunnerSource.includes('SAME_DAY_DEVELOPMENT_STATUSES'));
  assert.ok(dailyRunnerSource.includes('function companyLeadKeys'));
  assert.ok(dailyRunnerSource.includes('sameDayDeveloped'));
  assert.ok(dailyRunnerSource.includes('same_day_customer_already_developed'));
  assert.ok(dailyRunnerSource.includes('context.sameDayByCompany'));
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
    platform: 'email',
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
    platform: 'email',
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

test('discovery cooldown expires ordinary touches but preserves confirmed DM protection', () => {
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
  assert.ok(history.activeCooldown.has('mec'));
  assert.ok(history.sentConfirmed.has('bever'));
});
