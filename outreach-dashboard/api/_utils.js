const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

function send(res, status, payload) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.status(status).json(payload);
}

function requireMethod(req, res, methods) {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (!methods.includes(req.method)) {
    send(res, 405, { ok: false, error: 'Method not allowed' });
    return false;
  }
  return true;
}

async function supabase(path, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    const error = new Error('Supabase is not configured');
    error.status = 503;
    throw error;
  }
  const response = await fetch(`${SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data && data.message ? data.message : `Supabase ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

module.exports = { send, requireMethod, supabase };
