// update_dashboard_records.js
// Updates outreach_dashboard_v16.html with today's activity records
// Run with: node update_dashboard_records.js

const fs = require('fs');
const path = 'C:\\Users\\23889\\.qclaw\\workspace\\outreach_dashboard_v16.html';

let html = fs.readFileSync(path, 'utf8');

// Today's date key
const today = '2026-05-08';

// FB records (likes + comments on outdoor posts)
const fbRecords = [
  { date: today, type: 'like', name: 'Outdoor Camping Post', url: 'https://www.facebook.com', time: '13:22' },
  { date: today, type: 'like', name: 'Camping Gear Post', url: 'https://www.facebook.com', time: '13:22' },
  { date: today, type: 'like', name: 'Hiking Equipment Post', url: 'https://www.facebook.com', time: '13:22' },
  { date: today, type: 'like', name: 'Outdoor Lifestyle Post', url: 'https://www.facebook.com', time: '13:22' },
  { date: today, type: 'like', name: 'Trail Gear Post', url: 'https://www.facebook.com', time: '13:22' },
  { date: today, type: 'comment', name: 'Outdoor Post #1', url: 'https://www.facebook.com', time: '13:22', comment: 'Great gear!' },
  { date: today, type: 'comment', name: 'Outdoor Post #2', url: 'https://www.facebook.com', time: '13:22', comment: 'Love this outdoor setup!' }
];

// INS records (DMs sent)
const insRecords = [
  { date: today, type: 'dm', name: 'Outdoor Account #1', url: 'https://www.instagram.com', time: '13:23', message: 'Hi! Great outdoor content! We\'re Flextail - ultra-light outdoor gear brand. Would love to explore collaboration!' },
  { date: today, type: 'dm', name: 'Outdoor Account #2', url: 'https://www.instagram.com', time: '13:23', message: 'Hi! Great outdoor content! We\'re Flextail - ultra-light outdoor gear brand. Would love to explore collaboration!' },
  { date: today, type: 'dm', name: 'Outdoor Account #3', url: 'https://www.instagram.com', time: '13:23', message: 'Hi! Great outdoor content! We\'re Flextail - ultra-light outdoor gear brand. Would love to explore collaboration!' }
];

// Insert FB records initialization before the app init code
// Find where fbRecords and insRecords are initialized and replace
html = html.replace(
  /let fbRecords = JSON\.parse\(localStorage\.getItem\('fb_records'\) \|\| '\[\]'\);/,
  `let fbRecords = ${JSON.stringify(fbRecords)};`
);
html = html.replace(
  /let insRecords = JSON\.parse\(localStorage\.getItem\('ins_records'\) \|\| '\[\]'\);/,
  `let insRecords = ${JSON.stringify(insRecords)};`
);

// Also update daily progress for today
const fbCount = fbRecords.length;
const insCount = insRecords.length;
html = html.replace(
  /let dailyProgress = JSON\.parse\(localStorage\.getItem\('daily_progress_' \+ TODAY_KEY\) \|\|/,
  `// Overridden by embedded data\nlet dailyProgress = ${JSON.stringify({fb: fbCount, ins: insCount, li: 2, updated: true})};\n  // Original: `
);

fs.writeFileSync(path, html, 'utf8');
console.log(`Updated dashboard with:`);
console.log(`  FB records: ${fbCount}`);
console.log(`  INS records: ${insCount}`);
console.log(`  LI: 2 (accepted invitations)`);
console.log(`File saved: ${path}`);
