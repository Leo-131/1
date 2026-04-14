const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// 1. Update stat-sent: 已发送 count
c = c.replace('id="stat-sent">0</div>', 'id="stat-sent">1</div>');

// 2. Update stat-sent-sub: 本周 count  
c = c.replace('本周 0</div>', '本周 14</div>');

// 3. Update LinkedIn daily target: 0/60 -> 1/60
c = c.replace('id="li-nums">0/60</span>', 'id="li-nums">1/60</span>');

// 4. Update LinkedIn progress bar width
c = c.replace('id="li-bar" style="width:0%"', 'id="li-bar" style="width:2%"');

// 5. Update sidebar: 发送进度 0/100
c = c.replace('发送进度 0 / 100', '发送进度 1 / 100');
c = c.replace('还差 100 条', '还差 99 条');

// 6. Update 本周进度 0/500
c = c.replace('0/500', '14/500');

// 7. Update Whitney La Ruffa status
c = c.replace('Whitney La Ruffa Black Dog Outdoors · Founder ⏳ Pending camping', 
              'Whitney La Ruffa Black Dog Outdoors · Founder ⏳7天未回复 camping');

// 8. Update Abigail Vollkommer  
c = c.replace('Abigail Vollkommer Cabela\'s · Senior Buyer ⏳ Pending camping',
              'Abigail Vollkommer Cabela\'s · Senior Buyer ⏳1天未回复 camping');

// 9. Update Naturkompaniet
c = c.replace('Naturkompaniet ⏳ Pending', 'Naturkompaniet ⏳8天未回复');

// Verify all changes
console.log('stat-sent updated:', c.includes('id="stat-sent">1</div>'));
console.log('li-nums updated:', c.includes('id="li-nums">1/60</span>'));
console.log('Whitney updated:', c.includes('7天未回复'));
console.log('Abigail updated:', c.includes('1天未回复'));
console.log('Naturkompaniet updated:', c.includes('8天未回复'));
console.log('本周 updated:', c.includes('本周 14</div>'));
console.log('File size:', c.length);

fs.writeFileSync('index.html', c, 'utf8');
console.log('Done!');
