const { send, requireMethod } = require('./_utils');

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, ['POST'])) return;
  try {
    const apiKey = process.env.GLM_API_KEY;
    if (!apiKey) return send(res, 503, { ok: false, error: 'GLM_API_KEY is not configured' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const response = await fetch(`${process.env.GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4'}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: body.model || process.env.GLM_MODEL || 'glm-4-flash',
        temperature: 0.25,
        messages: body.messages || [
          { role: 'system', content: 'Qualify B2B outdoor/camping/RV retail leads. Return concise JSON only.' },
          { role: 'user', content: JSON.stringify(body) },
        ],
      }),
    });
    const data = await response.json();
    send(res, response.ok ? 200 : response.status, response.ok ? { ok: true, data } : { ok: false, data });
  } catch (error) {
    send(res, 500, { ok: false, error: error.message });
  }
};
