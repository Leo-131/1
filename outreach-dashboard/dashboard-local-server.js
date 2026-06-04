const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const root = __dirname;
const port = Number(process.env.PORT || 4174);
const host = '127.0.0.1';
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

function chromeCandidates() {
  const candidates = [];
  if (process.env.ProgramFiles) candidates.push(path.join(process.env.ProgramFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'));
  if (process.env['ProgramFiles(x86)']) candidates.push(path.join(process.env['ProgramFiles(x86)'], 'Google', 'Chrome', 'Application', 'chrome.exe'));
  if (process.env.LOCALAPPDATA) candidates.push(path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe'));
  candidates.push('chrome.exe');
  return candidates;
}

function openChrome(url) {
  const args = ['--new-tab', url];
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

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url, `http://${host}:${port}`);
  if (parsed.pathname === '/launch-chrome') {
    const url = parsed.searchParams.get('url');
    if (!url || !/^https:\/\/(www\.)?(linkedin|facebook|instagram)\.com\//i.test(url)) {
      return sendJson(res, 400, { ok: false, error: 'Unsupported URL' });
    }
    return sendJson(res, openChrome(url) ? 200 : 500, { ok: true, url });
  }

  let pathname = decodeURIComponent(parsed.pathname);
  if (pathname === '/' || pathname === '') pathname = '/outreach-dashboard.html';
  const file = path.resolve(root, pathname.replace(/^\/+/, ''));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(port, host, () => {
  console.log(`http://${host}:${port}/outreach-dashboard.html`);
});
