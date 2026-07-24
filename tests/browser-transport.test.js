const test = require('node:test');
const assert = require('node:assert/strict');

const {
  browserAgentForResult,
  browserTransportForResult,
  executionTransportSummary,
  stableActionHash,
  validateExtensionReceipt,
} = require('../outreach-dashboard/browser-transport');

test('CDP execution is never labeled as Codex Chrome Extension', () => {
  const result = {
    engine: 'codex-chrome-extension-cdp',
    chromeOpen: { ok: true, engine: 'codex-chrome-extension-cdp' },
  };
  assert.equal(browserTransportForResult(result), 'cdp');
  assert.equal(browserAgentForResult(result), 'codex-chrome-cdp');
});

test('only a valid extension receipt proves extension execution', () => {
  const action = {
    taskId: 'lead-1',
    company: 'Example Outdoor',
    targetUrl: 'https://example.com/contact',
    actionType: 'send_message',
    draft: 'Hello',
  };
  const receipt = {
    receiptVersion: 1,
    transport: 'codex-extension',
    taskId: action.taskId,
    targetUrl: action.targetUrl,
    tabId: 'chrome-tab-42',
    occurredAt: '2026-07-24T05:00:00.000Z',
    actionHash: stableActionHash(action),
  };
  assert.deepEqual(validateExtensionReceipt(receipt, {
    taskId: action.taskId,
    targetUrl: action.targetUrl,
    actionHash: stableActionHash(action),
  }), { ok: true, errors: [] });
  assert.equal(browserTransportForResult({ extensionReceipt: receipt }), 'codex-extension');
  assert.equal(browserAgentForResult({ extensionReceipt: receipt }), 'codex-chrome-extension');
  assert.equal(validateExtensionReceipt({ ...receipt, actionHash: '0'.repeat(64) }, {
    taskId: action.taskId,
    targetUrl: action.targetUrl,
    actionHash: stableActionHash(action),
  }).ok, false);
});

test('execution summary reports truthful CDP fallback', () => {
  assert.deepEqual(executionTransportSummary([{
    result: { engine: 'codex-chrome-extension-website-contact' },
  }]), {
    browserTransportRequested: 'codex-extension-first',
    browserTransportUsed: 'cdp',
    browserTransportFallbackReason: 'extension_bridge_not_available_process_local_cdp',
    extensionReceiptCount: 0,
  });
});
