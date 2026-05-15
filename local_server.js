const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = 'C:/Users/23889/.qclaw/workspace';

const server = http.createServer((req, res) => {
  let filePath = path.join(ROOT, req.url === '/' ? 'outreach_dashboard_v16.html' : req.url);
  const ext = path.extname(filePath);
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.css': 'text/css' };
  res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log('Dashboard server running at http://localhost:' + PORT);
});
