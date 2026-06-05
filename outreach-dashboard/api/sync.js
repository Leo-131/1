const { send, requireMethod, supabase } = require('./_utils');

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, ['GET', 'POST'])) return;
  try {
    if (req.method === 'GET') {
      const key = encodeURIComponent(req.query.key || 'dashboard-state');
      const rows = await supabase(`app_state?select=key,value,updated_at&key=eq.${key}&limit=1`);
      return send(res, 200, { ok: true, state: rows && rows[0] ? rows[0].value : null });
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const key = body.key || 'dashboard-state';
    const value = body.value || {};
    await supabase('app_state?on_conflict=key', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify([{ key, value, updated_at: new Date().toISOString() }]),
    });
    send(res, 200, { ok: true });
  } catch (error) {
    send(res, error.status || 500, { ok: false, error: error.message });
  }
};
