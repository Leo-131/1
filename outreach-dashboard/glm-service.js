'use strict';
const { createHash } = require('node:crypto');
const cache = new Map();
const pending = new Map();
const MAX_CACHE = 128;
// Never send full queues, raw HTML, screenshots or credentials to a lead decision.
const LEAD_FIELDS = ['taskId','id','name','company','role','industry','country','region',
  'marketStatus','platform','targetUrl','verifiedTargetUrl','website','identityVerified',
  'identityConfidence','fitScore','keyword','keyword_used','sendStatus','originalStatus',
  'status','lastTouch','sentAt','repliedAt','followUpAt','duplicateRisk','existingCustomer',
  'exclusiveMarket','doNotContact','unsubscribed','evidence','sourceEvidenceUrl',
  'fitReasons','notes','draft','approvedDraft','history','trend'];
function compactLead(lead = {}) {
  const out = {};
  for (const key of LEAD_FIELDS) {
    const value = lead[key];
    if (value == null || value === '') continue;
    if (typeof value === 'string') out[key] = value.slice(0, ['notes','evidence','draft','approvedDraft'].includes(key) ? 1200 : 400);
    else if (typeof value === 'boolean' || typeof value === 'number') out[key] = value;
    else if (Array.isArray(value)) out[key] = value.filter(v => typeof v === 'string').slice(0, 8).map(v => v.slice(0, 200));
    else if (['history','trend'].includes(key) && typeof value === 'object') {
      out[key] = Object.fromEntries(Object.entries(value).filter(([k,v]) =>
        /^(sent|replied|lastTouch|sentAt|repliedAt|templateRate|score|source|verified|timestamp)$/.test(k)
        && ['string','number','boolean'].includes(typeof v)).map(([k,v]) => [k, typeof v === 'string' ? v.slice(0,300) : v]));
    }
  }
  return out;
}


function parseJsonContent(text) {
  const cleaned = String(text || '').trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function leadMessages(lead) {
  return [
    {
      role: 'system',
      content: 'You qualify B2B outdoor, camping and RV retail leads. Return concise JSON only. Never invent identity, contact or trend evidence.',
    },
    {
      role: 'user',
      content: JSON.stringify({
        task: 'Assess the exact lead and prepare one compliant English outreach message.',
        lead: compactLead(lead),
        schema: {
          fitScore: 'integer 0-100',
          verdict: 'develop|recheck|skip',
          reason: 'short factual reason',
          draft: 'short personalized English message, no false claims',
          nextStep: 'like_follow_dm|open_profile|skip',
        },
      }),
    },
  ];
}

async function performRequest(config, messages) {
  if (!config.apiKey) throw new Error('GLM API key is not configured');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs || 45000);
  try {
    const response = await (config.fetchImpl || fetch)(
      `${String(config.baseUrl || 'https://open.bigmodel.cn/api/paas/v4').replace(/\/+$/, '')}/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: config.model || 'glm-4-flash',
          temperature: 0.2,
          max_tokens: Math.max(128, Math.min(2048, Number(config.maxTokens) || 600)),
          messages,
        }),
      },
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = data.error && (data.error.message || data.error);
      throw new Error(`GLM request failed: ${response.status}${detail ? ` ${detail}` : ''}`);
    }
    if (data?.choices?.[0]?.finish_reason === 'length') throw new Error('GLM response truncated; decision was not accepted');
    const text = data?.choices?.[0]?.message?.content || '';
    if (!config.messages && !parseJsonContent(text)) throw new Error('GLM returned invalid decision JSON');
    return {
      ok: true,
      model: data.model || config.model || 'glm-4-flash',
      text,
      result: parseJsonContent(text),
      usage: data.usage || null,
      cached: false,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function requestGlm(options = {}) {
  if (!options.apiKey) throw new Error('GLM API key is not configured');
  const messages = options.messages || leadMessages(options.lead);
  // A decision is reusable, execution is never cached. Custom conversation calls opt out.
  if (options.messages || options.cache === false) return performRequest(options, messages);
  const key = createHash('sha256').update(JSON.stringify([
    options.apiKey, options.baseUrl || '', options.model || 'glm-4-flash',
    options.maxTokens || 600, messages
  ])).digest('hex');
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return { ...structuredClone(hit.value), cached: true, usage: null };
  cache.delete(key);
  if (pending.has(key)) return { ...structuredClone(await pending.get(key)), cached: true, usage: null };
  const request = performRequest(options, messages);
  pending.set(key, request);
  try {
    const value = await request;
    if (value.result && ['develop','recheck','skip'].includes(value.result.verdict)) {
      cache.set(key, {value: structuredClone(value), expiresAt: Date.now() + 5 * 60 * 1000});
      while (cache.size > MAX_CACHE) cache.delete(cache.keys().next().value);
    }
    return value;
  } finally { pending.delete(key); }
}
module.exports = { leadMessages, compactLead, parseJsonContent, requestGlm };
