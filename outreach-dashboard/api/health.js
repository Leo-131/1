const { send, requireMethod } = require('./_utils');

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, ['GET'])) return;
  send(res, 200, {
    ok: true,
    app: 'outreach-dashboard',
    supabase: Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)),
    glm: Boolean(process.env.GLM_API_KEY),
    okki: Boolean(process.env.OKKI_API_KEY && process.env.OKKI_BASE_URL),
  });
};
