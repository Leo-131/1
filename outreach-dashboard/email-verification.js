'use strict';

const { isEmail } = require('./email-channel');

function clean(value) {
  return String(value || '').trim();
}

function configuredProvider(env = process.env) {
  if (clean(env.HUNTER_API_KEY)) return { id: 'hunter', key: clean(env.HUNTER_API_KEY) };
  if (clean(env.ZEROBOUNCE_API_KEY)) return { id: 'zerobounce', key: clean(env.ZEROBOUNCE_API_KEY) };
  return { id: '', key: '' };
}

function normalizeVerification(provider, payload = {}) {
  if (provider === 'hunter') {
    const data = payload.data || {};
    const status = clean(data.status).toLowerCase();
    return {
      provider,
      status,
      deliverable: status === 'valid',
      score: Number(data.score || 0),
      disposable: Boolean(data.disposable),
      webmail: Boolean(data.webmail),
      acceptAll: Boolean(data.accept_all) || status === 'accept_all',
    };
  }
  if (provider === 'zerobounce') {
    const status = clean(payload.status).toLowerCase();
    return {
      provider,
      status,
      deliverable: status === 'valid',
      subStatus: clean(payload.sub_status),
      freeEmail: Boolean(payload.free_email),
      roleBased: Boolean(payload.do_not_mail === false && payload.account && /^(info|sales|vendor|purchasing|procurement|buyer)$/i.test(payload.account)),
      acceptAll: /catch.?all/i.test(clean(payload.sub_status)),
    };
  }
  return { provider, status: 'unsupported_provider', deliverable: false };
}

async function verifyEmailAddress(email, options = {}) {
  const address = clean(email).toLowerCase();
  if (!isEmail(address)) return { ok: false, deliverable: false, reason: 'email_invalid', email: address };
  const provider = configuredProvider(options.env || process.env);
  if (!provider.id) return { ok: false, deliverable: false, reason: 'email_verifier_not_configured', email: address, requiredEnv: ['HUNTER_API_KEY', 'ZEROBOUNCE_API_KEY'] };
  const fetchImpl = options.fetch || fetch;
  const url = provider.id === 'hunter'
    ? `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(address)}&api_key=${encodeURIComponent(provider.key)}`
    : `https://api.zerobounce.net/v2/validate?api_key=${encodeURIComponent(provider.key)}&email=${encodeURIComponent(address)}`;
  let response;
  try {
    response = await fetchImpl(url, { signal: options.signal || AbortSignal.timeout(Number(options.timeoutMs || 30000)) });
  } catch (error) {
    return { ok: false, deliverable: false, reason: 'email_verification_request_failed', provider: provider.id, email: address, error: error.message || String(error) };
  }
  if (!response.ok) return { ok: false, deliverable: false, reason: 'email_verification_http_error', provider: provider.id, email: address, statusCode: response.status };
  const payload = await response.json();
  const normalized = normalizeVerification(provider.id, payload);
  const safe = normalized.deliverable && !normalized.disposable && !normalized.webmail && !normalized.freeEmail && !normalized.acceptAll;
  return {
    ...normalized,
    ok: safe,
    deliverable: safe,
    reason: safe ? 'email_verified_deliverable' : `email_verification_${normalized.status || 'unsafe'}`,
    email: address,
    verifiedAt: new Date().toISOString(),
  };
}

module.exports = {
  configuredProvider,
  normalizeVerification,
  verifyEmailAddress,
};
