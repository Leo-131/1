const fs = require('fs');
const path = 'C:/Users/23889/.qclaw/workspace/outreach-dashboard/index.html';
let html = fs.readFileSync(path, 'utf8');

console.log('Before update:');
const oldMatch = html.match(/<title>.*?<\/title>/);
console.log(oldMatch ? oldMatch[0] : 'no title found');
const verMatch = html.match(/version[:\s"']+([\d.]+)/i);
console.log('Version strings:', verMatch ? verMatch[0] : 'none');

// Update all v16.x references to v16.5
const old = html.replace(/v16\.\d+/g, 'v16.5');
const changes = (old.match(/v16\.5/g) || []).length;
console.log('\nReplaced v16.x with v16.5:', changes, 'times');

// Also update title specifically
html = html.replace(/<title>.*?<\/title>/, '<title>Outreach Dashboard v16.5 — 844 Contacts Embedded</title>');

fs.writeFileSync(path, html);
console.log('Done. New title:', html.match(/<title>(.*?)<\/title>/)[1]);
console.log('File size:', Math.round(fs.statSync(path).size / 1024), 'KB');
