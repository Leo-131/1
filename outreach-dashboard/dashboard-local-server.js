const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const root = __dirname;
const port = Number(process.env.PORT || 4174);
const host = process.env.HOST || '0.0.0.0';
const stateFile = path.join(os.tmpdir(), 'outreach-dashboard-local-state.json');
const STATIC_CACHE_LIMIT = 64;
const STATIC_CACHE_MAX_BYTES = 2 * 1024 * 1024;
const staticFileCache = new Map();
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

function cacheHeaders(file, stat) {
  const ext = path.extname(file);
  const etag = stat ? `"${stat.size.toString(16)}-${Math.trunc(stat.mtimeMs).toString(16)}"` : '';
  const headers = {
    'Content-Type': types[ext] || 'application/octet-stream',
  };
  if (etag) headers.ETag = etag;
  if (stat) headers['Last-Modified'] = stat.mtime.toUTCString();
  if (['.html', '.js', '.json', '.webmanifest'].includes(ext)) {
    headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate';
    headers.Pragma = 'no-cache';
    headers.Expires = '0';
  }
  if (path.basename(file) === 'service-worker.js') {
    headers['Service-Worker-Allowed'] = '/';
    headers['Clear-Site-Data'] = '"cache"';
  }
  return headers;
}

function rememberStaticFile(file, stat, data, headers) {
  if (data.length > STATIC_CACHE_MAX_BYTES) return;
  if (staticFileCache.size >= STATIC_CACHE_LIMIT) {
    const oldest = staticFileCache.keys().next().value;
    if (oldest) staticFileCache.delete(oldest);
  }
  staticFileCache.set(file, {
    size: stat.size,
    mtimeMs: stat.mtimeMs,
    data,
    headers,
  });
}

function cachedStaticFile(file, stat) {
  const cached = staticFileCache.get(file);
  if (!cached || cached.size !== stat.size || cached.mtimeMs !== stat.mtimeMs) return null;
  staticFileCache.delete(file);
  staticFileCache.set(file, cached);
  return cached;
}

function notModified(req, headers) {
  const etag = headers.ETag;
  const modifiedSince = headers['Last-Modified'];
  return Boolean(
    (etag && req.headers['if-none-match'] === etag)
    || (modifiedSince && req.headers['if-modified-since'] === modifiedSince)
  );
}

function chromeCandidates() {
  const candidates = [];
  if (process.env.ProgramFiles) candidates.push(path.join(process.env.ProgramFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'));
  if (process.env['ProgramFiles(x86)']) candidates.push(path.join(process.env['ProgramFiles(x86)'], 'Google', 'Chrome', 'Application', 'chrome.exe'));
  if (process.env.LOCALAPPDATA) candidates.push(path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe'));
  candidates.push('chrome.exe');
  return candidates;
}

function openChrome(url) {
  const args = ['--new-window', url];
  for (const candidate of chromeCandidates()) {
    try {
      const child = spawn(candidate, args, { detached: true, stdio: 'ignore' });
      child.unref();
      return true;
    } catch {
      // Try next candidate.
    }
  }
  return false;
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function readLocalState() {
  try {
    return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  } catch {
    return {};
  }
}

function writeLocalState(value) {
  fs.writeFileSync(stateFile, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function isLocalRequest(req) {
  const address = req.socket.remoteAddress || '';
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1';
}

function lanAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => item && item.family === 'IPv4' && !item.internal)
    .map((item) => item.address)
    .filter((address) => !address.startsWith('169.254.') && !address.startsWith('198.18.'));
}

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url, `http://localhost:${port}`);
  if (parsed.pathname === '/api/health') {
    return sendJson(res, 200, {
      ok: true,
      mode: 'local',
      supabase: false,
      glm: Boolean(process.env.GLM_API_KEY || process.env.ZHIPUAI_API_KEY),
      glmModel: process.env.GLM_MODEL || '',
      okki: false,
      message: 'Local dashboard API is available; cloud integrations are optional.',
    });
  }
  if (parsed.pathname === '/api/sync') {
    if (!isLocalRequest(req)) {
      return sendJson(res, 403, { ok: false, error: 'Local state sync is restricted to this computer' });
    }
    if (req.method === 'GET') {
      const key = parsed.searchParams.get('key') || 'dashboard-state';
      const localState = readLocalState();
      return sendJson(res, 200, { ok: Boolean(localState[key]), state: localState[key] || null, local: true });
    }
    if (req.method === 'POST') {
      return readJsonBody(req)
        .then((payload) => {
          const key = payload.key || 'dashboard-state';
          const localState = readLocalState();
          localState[key] = payload.value;
          writeLocalState(localState);
          sendJson(res, 200, { ok: true, local: true, key });
        })
        .catch((error) => sendJson(res, 400, { ok: false, error: error.message || 'Invalid JSON body' }));
    }
    return sendJson(res, 405, { ok: false, error: 'Method not allowed' });
  }
  if (parsed.pathname === '/api/glm') {
    return sendJson(res, 200, {
      ok: false,
      configured: false,
      error: 'Cloud GLM is not configured in the local dashboard server.',
    });
  }
  if (parsed.pathname === '/api/okki') {
    return sendJson(res, 200, {
      ok: false,
      configured: false,
      module: parsed.searchParams.get('module') || '',
      error: 'OKKI integration is not configured in the local dashboard server.',
    });
  }
  if (parsed.pathname === '/launch-chrome') {
    if (!isLocalRequest(req)) {
      return sendJson(res, 403, { ok: false, error: 'Chrome launch is restricted to this computer' });
    }
    const url = parsed.searchParams.get('url');
    if (!url || !/^https:\/\/(www\.)?(linkedin|facebook|instagram)\.com\//i.test(url)) {
      return sendJson(res, 400, { ok: false, error: 'Unsupported URL' });
    }
    const opened = openChrome(url);
    return sendJson(res, opened ? 200 : 500, { ok: opened, url });
  }

  let pathname = decodeURIComponent(parsed.pathname);
  if (pathname === '/' || pathname === '') pathname = '/outreach-dashboard.html';
  const file = path.resolve(root, pathname.replace(/^\/+/, ''));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.stat(file, (statError, stat) => {
    if (statError || !stat.isFile()) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const cached = cachedStaticFile(file, stat);
    if (cached) {
      if (notModified(req, cached.headers)) {
        res.writeHead(304, cached.headers);
        return res.end();
      }
      res.writeHead(200, cached.headers);
      return res.end(cached.data);
    }
    fs.readFile(file, (error, data) => {
      if (error) {
        res.writeHead(404);
        return res.end('Not found');
      }
      const headers = cacheHeaders(file, stat);
      rememberStaticFile(file, stat, data, headers);
      if (notModified(req, headers)) {
        res.writeHead(304, headers);
        return res.end();
      }
      res.writeHead(200, headers);
      return res.end(data);
    });
  });
});

server.listen(port, host, () => {
  console.log(`Local: http://127.0.0.1:${port}/outreach-dashboard.html`);
  for (const address of lanAddresses()) {
    console.log(`LAN:   http://${address}:${port}/outreach-dashboard.html`);
  }
});
