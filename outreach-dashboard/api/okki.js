const { send, requireMethod } = require('./_utils');

const MODULES = new Set(['customers', 'leads', 'inquiries', 'emails', 'tasks', 'followups', 'orders', 'products']);

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, ['GET', 'POST'])) return;
  try {
    const baseUrl = (process.env.OKKI_BASE_URL || '').replace(/\/+$/, '');
    const apiKey = process.env.OKKI_API_KEY || '';
    if (!baseUrl || !apiKey) return send(res, 503, { ok: false, error: 'OKKI_BASE_URL/OKKI_API_KEY is not configured' });
    const moduleName = String(req.query.module || '').toLowerCase();
    if (!MODULES.has(moduleName)) return send(res, 400, { ok: false, error: 'Unsupported OKKI module' });
    const path = process.env[`OKKI_${moduleName.toUpperCase()}_PATH`] || `/api/${moduleName}`;
    const response = await fetch(`${baseUrl}${path}`, {
      method: req.method,
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: req.method === 'POST' ? JSON.stringify(req.body || {}) : undefined,
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    send(res, response.ok ? 200 : response.status, { ok: response.ok, module: moduleName, data });
  } catch (error) {
    send(res, 500, { ok: false, error: error.message });
  }
};
