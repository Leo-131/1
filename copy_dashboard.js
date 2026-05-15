const fs = require('fs');
const src = 'C:/Users/23889/.qclaw/workspace/outreach_dashboard_v16.html';
const dst = 'C:/Users/23889/.qclaw/workspace/outreach-dashboard/index.html';
const content = fs.readFileSync(src);
fs.writeFileSync(dst, content);
const srcSize = Math.round(fs.statSync(src).size / 1024);
const dstSize = Math.round(fs.statSync(dst).size / 1024);
console.log('Copied:', srcSize, 'KB ->', dstSize, 'KB');
