const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// Fix sidebar progress bar width
c = c.replace('li-bar" style="width:5%', 'li-bar" style="width:5%');

// Update Facebook stats: 0/15 -> 1/15
c = c.replace('id="fb-nums">0/15', 'id="fb-nums">1/15');
c = c.replace('Facebook 15条/天 0/15', 'Facebook 15条/天 1/15');

// Update Instagram to reflect IG outreach
// Add camp4wheels note in customer list if possible, or just update stats
c = c.replace('id="ig-nums">0/25', 'id="ig-nums">1/25');

// Fix "超期未回复客户" - Whitney has been 7 days without reply
// Find and update the "跟进超期未回复客户 0 个" section
c = c.replace('跟进超期未回复客户 0 个', '跟进超期未回复客户 1 个');
c = c.replace('跟进超期未回复客户 1 个 ✅ 完成', '跟进超期未回复客户 1 个 ⚠️ 待优化');

// Update "还需发送" for LinkedIn (was showing 97 but stat says 3/60 so need 57 more)
c = c.replace('LinkedIn 今日还需发送 97 条', 'LinkedIn 今日还需发送 57 条');

// Add notes about today's outreach in the notes field
// Find the Lealand Blum note section and add info
c = c.replace('Lealand Blum\n        ', 'Lealand Blum\n        ');

fs.writeFileSync('index.html', c);
console.log('Updated!');
console.log('fb-nums:', c.includes('id="fb-nums">1/15'));
console.log('超期:', c.includes('超期未回复客户 1 个'));
console.log('LinkedIn还需:', c.includes('还需发送 57 条'));
