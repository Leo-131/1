const fs = require('fs');
const path = require('path');

const root = __dirname;
const out = path.join(root, 'public');
const files = [
  'outreach-dashboard.html',
  'country-market-data.js',
  'daily-outreach-tasks.js',
  'outreach-engine.js',
  'outreach-analytics.js',
  'autonomous-outreach-results.js',
  'autonomous-outreach-data.js',
  'command-center.css',
  'command-center.js',
  'service-worker.js',
  'manifest.webmanifest',
  'icon.svg',
];

fs.mkdirSync(out, { recursive: true });
for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(out, file));
}
fs.copyFileSync(path.join(root, 'outreach-dashboard.html'), path.join(out, 'index.html'));
fs.writeFileSync(path.join(out, 'deploy-stamp.txt'), new Date().toISOString() + '\n');
console.log('Vercel public output ready:', out);
