const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { parseJsonContent, requestGlm } = require('../outreach-dashboard/glm-service');
const {
  buildAutoGlmTask,
  normalizeTarget,
  validateLeadForExecution,
} = require('../outreach-dashboard/autoglm-bridge');

const mainSource = fs.readFileSync(path.join(__dirname, '..', 'outreach-dashboard', 'main.js'), 'utf8');

test('GLM response parser accepts fenced JSON', () => {
  assert.deepEqual(parseJsonContent('```json\n{"fitScore":88,"verdict":"develop"}\n```'), {
    fitScore: 88,
    verdict: 'develop',
  });
});

test('GLM service returns normalized decision data', async () => {
  const result = await requestGlm({
    apiKey: 'test-key',
    lead: { company: 'Campmor' },
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
  assert.equal(result.result.draft, 'Hello Campmor team');
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
  assert.ok(mainSource.includes('followup_prepare_no_duplicate_send'));
  assert.ok(mainSource.includes("sendStatus: 'prepared_not_sent'"));
});
