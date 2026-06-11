'use strict';

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
        lead,
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

async function requestGlm(options) {
  const config = options || {};
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
          messages: config.messages || leadMessages(config.lead),
        }),
      },
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = data.error && (data.error.message || data.error);
      throw new Error(`GLM request failed: ${response.status}${detail ? ` ${detail}` : ''}`);
    }
    const text = data?.choices?.[0]?.message?.content || '';
    return {
      ok: true,
      model: data.model || config.model || 'glm-4-flash',
      text,
      result: parseJsonContent(text),
    };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { leadMessages, parseJsonContent, requestGlm };
