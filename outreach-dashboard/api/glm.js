const { send, requireMethod } = require('./_utils');
const { requestGlm } = require('../glm-service');

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, ['POST'])) return;
  try {
    const apiKey = process.env.GLM_API_KEY;
    if (!apiKey) return send(res, 503, { ok: false, error: 'GLM_API_KEY is not configured' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const result = await requestGlm({
      apiKey,
      baseUrl: process.env.GLM_BASE_URL,
      model: body.model || process.env.GLM_MODEL,
      lead: body.lead || body,
      messages: body.messages,
    });
    send(res, 200, result);
  } catch (error) {
    send(res, 500, { ok: false, error: error.message });
  }
};
