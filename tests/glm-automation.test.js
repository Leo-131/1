const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { leadMessages, parseJsonContent, professionalSalesDraft, requestGlm } = require('../outreach-dashboard/glm-service');
const { buildLeads } = require('../outreach-dashboard/google-lead-discovery-runner');
const {
  buildAutoGlmTask,
  isBlockedFacebookTarget,
  isUnavailableProfilePage,
  normalizeTarget,
  validateLeadForExecution,
} = require('../outreach-dashboard/autoglm-bridge');

const mainSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'main.js'), 'utf8');
const chromeDriverSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'codex-chrome-driver.js'), 'utf8');
const dailyRunnerSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'daily-automation-runner.js'), 'utf8');
const templateSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'api', 'templates.js'), 'utf8');

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
  const sailFacebook = leads.find(item => item.id === 'google-customer-sail-outdoors-facebook');
  assert.ok(sailFacebook);
  assert.equal(sailFacebook.invalidChannels.instagram.status, 'broken_profile_url');
  const sailContact = leads.find(item => item.id === 'google-customer-sail-outdoors-website-contact');
  assert.ok(sailContact);
  assert.equal(sailContact.alternateChannels.instagram, '');
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
  assert.ok(mainSource.includes('marketing_attachment_missing'));
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
  assert.ok(mainSource.includes('Email or WhatsApp works well'));
  assert.ok(mainSource.includes('Flextail and Vollyc'));
  assert.ok(mainSource.includes('36+ new SKUs are planned for 2026'));
  assert.ok(mainSource.includes('highest chance of a real reply and a booked phone/video meeting'));
  assert.ok(mainSource.includes('Tailor the angle to the exact customer persona'));
  assert.ok(chromeDriverSource.includes("'Input.insertText'"));
  assert.ok(chromeDriverSource.includes('sendButtonExpression'));
  assert.ok(chromeDriverSource.includes('document.elementFromPoint'));
  assert.ok(chromeDriverSource.includes('profileMessageButtonExpression'));
  assert.ok(chromeDriverSource.includes("closest('nav,[role=\"navigation\"]')"));
  assert.ok(chromeDriverSource.includes('closeBlockingOverlayExpression'));
  assert.ok(chromeDriverSource.includes('submitInstagramPostEngagement'));
  assert.ok(chromeDriverSource.includes('instagramPostTileExpression'));
  assert.ok(chromeDriverSource.includes('instagramCommentActionExpression'));
  assert.ok(chromeDriverSource.includes('instagram_post_opened'));
  assert.ok(chromeDriverSource.includes('post_liked'));
  assert.ok(chromeDriverSource.includes('post_like_double_tap_attempted'));
  assert.ok(chromeDriverSource.includes('comment_submitted'));
  assert.ok(chromeDriverSource.includes("return `${kind}_already_active`"));
  assert.ok(chromeDriverSource.includes('followers|following|mutualonly'));
  assert.ok(chromeDriverSource.includes('conversationContextExpression'));
  assert.ok(chromeDriverSource.includes('unavailableProfileExpression'));
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
  assert.ok(mainSource.includes('function failedOpenResultShouldBlockRetry'));
  assert.ok(mainSource.includes('message_button_clicked_composer_not_found'));
  assert.ok(mainSource.includes("result.status !== 'failed_open' || failedOpenResultShouldBlockRetry(result)"));
  assert.ok(mainSource.includes('function automationPlatformFor'));
  assert.ok(mainSource.includes('const exactKeys = automationExactKeys(item)'));
  assert.ok(mainSource.includes('const itemPlatform = automationPlatformFor(item)'));
  assert.ok(mainSource.includes('if (!itemPlatform || !resultPlatform || itemPlatform !== resultPlatform) return false'));
  assert.ok(mainSource.includes("const blocking = new Set(['sent_confirmed', 'failed_open', 'send_unconfirmed', 'account_followed', 'post_liked', 'website_contact_ready'])"));
  assert.ok(!mainSource.includes("'sent_confirmed', 'failed_open', 'send_unconfirmed', 'skipped'"));
});
