const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { leadMessages, parseJsonContent, professionalSalesDraft, requestGlm } = require('../outreach-dashboard/glm-service');
const {
  buildAutoGlmTask,
  isBlockedFacebookTarget,
  isUnavailableProfilePage,
  normalizeTarget,
  validateLeadForExecution,
} = require('../outreach-dashboard/autoglm-bridge');

const mainSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'main.js'), 'utf8');
const chromeDriverSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'codex-chrome-driver.js'), 'utf8');
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
  assert.ok(templateSource.includes('Tel/WhatsApp: +86 17321028184'));
  assert.ok(templateSource.includes('Email: Leo@flextailgear.com'));
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
  assert.ok(mainSource.includes('app.quit()'));
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
  assert.ok(chromeDriverSource.includes('conversationContextExpression'));
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
});
