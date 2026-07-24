const crypto = require('crypto');

const EXTENSION_RECEIPT_VERSION = 1;
const EXTENSION_TRANSPORT = 'codex-extension';
const CDP_TRANSPORT = 'cdp';
const NO_TRANSPORT = 'none';

function unwrapResult(value = {}) {
  return value && value.result && typeof value.result === 'object'
    ? value.result
    : value || {};
}

function stableActionHash(action = {}) {
  const payload = [
    action.taskId || action.id || '',
    action.company || '',
    action.targetUrl || action.url || '',
    action.actionType || action.action || '',
    action.subject || '',
    action.draft || action.text || '',
  ].join('\n');
  return crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
}

function validateExtensionReceipt(receipt, expected = {}) {
  const errors = [];
  if (!receipt || typeof receipt !== 'object') {
    return { ok: false, errors: ['extension_receipt_missing'] };
  }
  if (receipt.receiptVersion !== EXTENSION_RECEIPT_VERSION) errors.push('extension_receipt_version_invalid');
  if (receipt.transport !== EXTENSION_TRANSPORT) errors.push('extension_receipt_transport_invalid');
  if (!receipt.taskId) errors.push('extension_receipt_task_id_missing');
  if (!receipt.tabId) errors.push('extension_receipt_tab_id_missing');
  if (!/^https?:\/\//i.test(String(receipt.targetUrl || ''))) errors.push('extension_receipt_target_url_invalid');
  if (!Number.isFinite(Date.parse(receipt.occurredAt || ''))) errors.push('extension_receipt_time_invalid');
  if (!/^[a-f0-9]{64}$/i.test(String(receipt.actionHash || ''))) errors.push('extension_receipt_action_hash_invalid');
  if (expected.taskId && receipt.taskId !== expected.taskId) errors.push('extension_receipt_task_id_mismatch');
  if (expected.targetUrl && receipt.targetUrl !== expected.targetUrl) errors.push('extension_receipt_target_url_mismatch');
  if (expected.actionHash && receipt.actionHash !== expected.actionHash) errors.push('extension_receipt_action_hash_mismatch');
  return { ok: errors.length === 0, errors };
}

function browserTransportForResult(value = {}) {
  const result = unwrapResult(value);
  const receiptValidation = validateExtensionReceipt(result.extensionReceipt);
  if (receiptValidation.ok) return EXTENSION_TRANSPORT;
  const engine = String(
    result.browserEngine
    || (result.chromeOpen && result.chromeOpen.engine)
    || result.engine
    || '',
  ).toLowerCase();
  if (engine.includes('cdp')
    || engine.includes('website-contact')
    || engine.includes('alibaba-enterprise-mail-web-session')) {
    return CDP_TRANSPORT;
  }
  return NO_TRANSPORT;
}

function browserAgentForResult(value = {}) {
  const result = unwrapResult(value);
  if (String(result.engine || '').includes('smtp-imap')) return 'alibaba-enterprise-mail';
  const transport = browserTransportForResult(result);
  if (transport === EXTENSION_TRANSPORT) return 'codex-chrome-extension';
  if (transport === CDP_TRANSPORT) return 'codex-chrome-cdp';
  return 'non-browser-automation';
}

function executionTransportSummary(rows = []) {
  const transports = [...new Set((Array.isArray(rows) ? rows : [])
    .map(browserTransportForResult)
    .filter(transport => transport !== NO_TRANSPORT))];
  const used = transports.length === 0
    ? NO_TRANSPORT
    : transports.length === 1
      ? transports[0]
      : 'mixed';
  return {
    browserTransportRequested: 'codex-extension-first',
    browserTransportUsed: used,
    browserTransportFallbackReason: used === CDP_TRANSPORT || used === 'mixed'
      ? 'extension_bridge_not_available_process_local_cdp'
      : '',
    extensionReceiptCount: (Array.isArray(rows) ? rows : [])
      .filter(row => browserTransportForResult(row) === EXTENSION_TRANSPORT).length,
  };
}

module.exports = {
  CDP_TRANSPORT,
  EXTENSION_RECEIPT_VERSION,
  EXTENSION_TRANSPORT,
  NO_TRANSPORT,
  browserAgentForResult,
  browserTransportForResult,
  executionTransportSummary,
  stableActionHash,
  validateExtensionReceipt,
};
