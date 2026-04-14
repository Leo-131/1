const fs = require('fs');
let c = fs.readFileSync('outreach-dashboard/public/index.html').toString('utf8');
console.log('Size:', c.length);

// Check what patterns exist
const green = c.indexOf('stat-card green');
const blue = c.indexOf('stat-card blue');
const sent = c.indexOf('已发送');
const week = c.indexOf('本周');
console.log('Green card at:', green);
console.log('Blue card at:', blue);
console.log('已发送 at:', sent);
console.log('本周 at:', week);

if (sent >= 0) console.log('已发送 area:', JSON.stringify(c.substring(sent, sent+100)));
if (week >= 0) console.log('本周 area:', JSON.stringify(c.substring(week, week+100)));

// The old HTML uses: 已发送 0</div> for the green card
// Find the actual pattern in the file
const m1 = c.match(/已发送.{0,30}/g);
console.log('已发送 matches:', m1 ? m1.slice(0,5) : 'none');

// Check num class
const nums = c.match(/<div class="num">.{0,10}/g);
console.log('Num elements:', nums ? nums.slice(0,10) : 'none');

// Direct replacements for the exact patterns found
c = c.replace(/已发送 0<\/div>/g, '已发送 3<\/div>');
c = c.replace(/本周 0<\/div>/g, '本周 17<\/div>');
// The number inside <div class="num"> - first one is green card 已发送
const numMatches = c.match(/<div class="num">\d+<\/div>/g);
console.log('Num matches after fix:', numMatches ? numMatches.slice(0,5) : 'none');

// Platform stats
c = c.replace(/(\d+)\/60<\/div>/g, function(m) {
  if (m.startsWith('3/60')) return m;
  return m; // keep as is - old version may not have multiple 0/60
});

// Fix specific platform counts by looking at the surrounding text
const igIdx = c.indexOf('Instagram');
const fbIdx = c.indexOf('Facebook');
const liIdx = c.indexOf('LinkedIn');
console.log('\nPlatform areas:');
if (liIdx >= 0) console.log('LinkedIn:', JSON.stringify(c.substring(liIdx, liIdx+60)));
if (igIdx >= 0) console.log('Instagram:', JSON.stringify(c.substring(igIdx, igIdx+60)));
if (fbIdx >= 0) console.log('Facebook:', JSON.stringify(c.substring(fbIdx, fbIdx+60)));

// LinkedIn: need to change first 0/60 to 3/60 (the daily progress in the first platform card)
// Instagram: 0/25 -> 1/25
// Facebook: 0/15 -> 1/15

// The LinkedIn daily target progress text says "60" after the count
// Find and replace the specific patterns
c = c.replace(/(LinkedIn[^>]*>)(\d+)(\/60<\/span>)/g, '$13$3');
c = c.replace(/(📷 Instagram[^>]*>)(\d+)(\/25<\/span>)/g, '$11$3');
c = c.replace(/(📘 Facebook[^>]*>)(\d+)(\/15<\/span>)/g, '$11$3');

// Fix the platform remaining counts  
c = c.replace(/LinkedIn · 今日还需发送 \d+ 条/g, 'LinkedIn · 今日还需发送 57 条');
c = c.replace(/Instagram · 今日还需发送 \d+ 条/g, 'Instagram · 今日还需发送 24 条');
c = c.replace(/Facebook · 今日还需发送 \d+ 条/g, 'Facebook · 今日还需发送 14 条');

// Fix progress ring: todayPercent
c = c.replace(/id="todayPercent">(\d+)%<\/div>/g, 'id="todayPercent">3%<\/div>');
c = c.replace(/还差 (\d+) 条<\/div>/g, '还差 97 条<\/div>');
c = c.replace(/本周进度 \d+\/500/g, '本周进度 17/500');

// Check after fix
console.log('\nAfter fixes:');
console.log('✅ 已发送 3:', c.includes('已发送 3'));
console.log('✅ 本周 17:', c.includes('本周 17'));
console.log('✅ LinkedIn 3/60:', c.includes('3/60'));
console.log('✅ Instagram 1/25:', c.includes('1/25'));
console.log('✅ Facebook 1/15:', c.includes('1/15'));
console.log('✅ 7天未回复:', c.includes('7天未回复'));
console.log('✅ 待联系:', c.includes('待联系'));
console.log('✅ resize:', c.includes('resize'));
console.log('✅ collapsePanel:', c.includes('collapsePanel'));
console.log('✅ mousedown:', c.includes('mousedown'));
console.log('✅ updateTimezones:', c.includes('updateTimezones'));
console.log('✅ toast:', c.includes('showToast'));

fs.writeFileSync('outreach-dashboard/public/index.html', c, 'utf8');
console.log('\nFinal size:', fs.readFileSync('outreach-dashboard/public/index.html').length);
