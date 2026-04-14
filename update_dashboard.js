const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// Find all stat card numbers and update them
// The HTML has hardcoded zeros in stats. We need to update the JavaScript data.
// Also update the customer status display.

console.log('Current dashboard state:');

// Find LinkedIn stats
const liMatch = c.match(/LinkedIn[^<]{0,200}/);
if(liMatch) console.log('LinkedIn section:', liMatch[0].substring(0,150));

// Find the JavaScript data section
const jsMatch = c.match(/const\s+stats\s*=\s*\{[^}]+\}/);
if(jsMatch) console.log('Stats:', jsMatch[0].substring(0,200));

// Find platform counts
const countMatch = c.match(/0\s*\/\s*60/);
console.log('LinkedIn 0/60 found:', !!countMatch);

// Today's outreach results (April 10):
// LinkedIn DMs sent today: 8 (Michael Hartridge + others)
// LinkedIn connections sent yesterday: 14
// Michael Hartridge conversation: updated
// 21 searches appeared Leo's profile this week

// Strategy: Update the HTML hardcoded values to reflect actual outreach
// LinkedIn sent: 14 (yesterday) + 8 (today DMs) = need to note separately
// Actually the dashboard shows "今日" which is April 10
// Today we only sent DMs to Michael Hartridge = 1 DM
// Yesterday (April 9) we sent ~14 DMs

// The dashboard resets daily, so only count today's:
// Today (Apr 10): 1 DM sent (Michael Hartridge)

// But wait - the dashboard shows all 37 clients with status "Pending"
// Some clients have been contacted via LinkedIn DM
// These contacts were made but status not updated

// The dashboard tracks "sent" as messages sent through the platform
// Since we sent manually, we need to record:
// Apr 9: ~14 LinkedIn DMs sent
// Apr 10: 1 LinkedIn DM sent

// For now, let's update the customer statuses where we have contacts:
// - Whitney La Ruffa: ⏳ Pending → contacted Apr 3, no reply (超期)
// - Naturkompaniet: ⏳ Pending → contacted Apr 2, no reply (超期)
// - Jane Wallace-Bradley: ⏳ Pending → contacted Apr 2, no reply (超期)
// - Travis Reill: ⏳ Pending → contacted Apr 1, wrong message (超期)
// - Abigail Vollkommer: ⏳ Pending → contacted Apr 9, no reply
// - Raizy Weiss: ⏳ Pending → contacted Apr 8, no reply
// - Michael Hartridge: ⏳ Pending → replied Apr 9-10 (回复中!)
// - Daniele Bllo: ⏳ Pending → reached out via WeChat Mar 25
// - GO Outdoors LTD: ⏳ Pending → contacted Mar 25, sent attachments

// For the daily stats on April 10:
// LinkedIn: 1 DM sent (Michael Hartridge follow-up)
// Instagram: 0
// Facebook: 0
// Total today: 1

// Update the HTML - change "今日 0" to "今日 1"
// Also update "LinkedIn 0/60" to "LinkedIn 1/60"
// Change "已发送 0" to "已发送 1"

c = c.replace(/"今日\s+(\d+)/g, (m, n) => `"今日 ${Math.max(n, 1)}`);
c = c.replace(/>\s*0\s*\/ 60</g, '>1 / 60<');
c = c.replace(/>\s*0\s*已发送</g, '>1 已发送<');

// Also update some customer statuses
// Whitney La Ruffa - 超期未回复
c = c.replace(
  /Whitney La Ruffa Black Dog Outdoors[^<]*⏳ Pending/g,
  'Whitney La Ruffa Black Dog Outdoors ⏳ 7天未回复'
);
// Naturkompaniet - 超期
c = c.replace(
  /Naturkompaniet[^<]*⏳ Pending/g,
  'Naturkompaniet ⏳ 8天未回复'
);
// Abigail Vollkommer
c = c.replace(
  /Abigail Vollkommer[^<]*⏳ Pending/g,
  'Abigail Vollkommer ⏳ 1天未回复'
);
// Raizy Weiss
c = c.replace(
  /Raizy Weiss[^<]*⏳ Pending/g,
  'Raizy Weiss ⏳ 2天未回复'
);
// Michael Hartridge - 回复中!
c = c.replace(
  /Michael Hartridge[^<]*⏳ Pending/g,
  'Michael Hartridge 💬 回复中'
);

fs.writeFileSync('index.html', c, 'utf8');
console.log('Dashboard updated!');
console.log('Last 200 chars:', c.slice(-200));
