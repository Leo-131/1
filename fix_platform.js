const fs = require('fs');
let c = fs.readFileSync('outreach-dashboard/public/index.html').toString('utf8');

// Find platform stats format
const li60 = c.indexOf('60条/天');
if (li60 >= 0) console.log('LinkedIn stat:', JSON.stringify(c.substring(li60-50, li60+50)));
const li25 = c.indexOf('25条/天');
if (li25 >= 0) console.log('Instagram stat:', JSON.stringify(c.substring(li25-50, li25+50)));
const li15 = c.indexOf('15条/天');
if (li15 >= 0) console.log('Facebook stat:', JSON.stringify(c.substring(li15-50, li15+50)));

// Now fix
c = c.replace('LinkedIn 60条/天 0/60', 'LinkedIn 60条/天 3/60');
c = c.replace('Instagram 25条/天 0/25', 'Instagram 25条/天 1/25');
c = c.replace('Facebook 15条/天 0/15', 'Facebook 15条/天 1/15');

// Fix 下一步行动 counts
c = c.replace(/LinkedIn · 今日还需发送 \d+ 条/g, 'LinkedIn · 今日还需发送 57 条');
c = c.replace(/Instagram · 今日还需发送 \d+ 条/g, 'Instagram · 今日还需发送 24 条');
c = c.replace(/Facebook · 今日还需发送 \d+ 条/g, 'Facebook · 今日还需发送 14 条');

// Fix progress ring
c = c.replace(/id="todayPercent">\d+%/g, 'id="todayPercent">3%');
c = c.replace(/还差 \d+ 条<\/div>/g, '还差 97 条<\/div>');
c = c.replace(/本周进度 \d+\/500/g, '本周进度 17/500');
c = c.replace(/跟进超期未回复客户 \d+ 个/g, '跟进超期未回复客户 1 个');

// Fix stat card numbers - the first num div (37 is total, second is 已发送, third is 本周)
const numMatches = c.match(/<div class="num">(\d+)<\/div>/g);
if (numMatches) {
  console.log('\nAll num values:', numMatches);
}

// The second num should be 已发送, update to 3
// The third num should be 本周, update to 17
let numCount = 0;
c = c.replace(/<div class="num">(\d+)<\/div>/g, function(m, val) {
  numCount++;
  if (numCount === 2) return '<div class="num">3</div>';
  if (numCount === 3) return '<div class="num">17</div>';
  return m;
});

// Verify
console.log('\n=== Verification ===');
console.log('✅ LinkedIn 3/60:', c.includes('LinkedIn 60条/天 3/60'));
console.log('✅ Instagram 1/25:', c.includes('Instagram 25条/天 1/25'));
console.log('✅ Facebook 1/15:', c.includes('Facebook 15条/天 1/15'));
console.log('✅ LinkedIn 57:', c.includes('还需发送 57 条'));
console.log('✅ 今日还需发送 57:', c.includes('今日还需发送 57 条'));
console.log('✅ Instagram 24:', c.includes('今日还需发送 24 条'));
console.log('✅ Facebook 14:', c.includes('今日还需发送 14 条'));
console.log('✅ 已发送 3:', c.includes('已发送 3'));
console.log('✅ 本周 17:', c.includes('本周 17'));
console.log('✅ 7天未回复:', c.includes('7天未回复'));
console.log('✅ 待联系:', c.includes('待联系'));
console.log('✅ 3%:', c.includes('3%'));
console.log('✅ 97:', c.includes('还差 97 条'));
console.log('✅ 本周进度 17/500:', c.includes('本周进度 17/500'));
console.log('✅ collapsePanel:', c.includes('collapsePanel'));
console.log('✅ resetPanel:', c.includes('resetPanel'));
console.log('✅ mousedown:', c.includes('mousedown'));
console.log('✅ resize:', c.includes('resize'));
console.log('✅ updateTimezones:', c.includes('updateTimezones'));
console.log('✅ toast:', c.includes('showToast'));
console.log('✅ drag:', c.includes('dragging'));
console.log('\nTotal size:', c.length);

fs.writeFileSync('outreach-dashboard/public/index.html', c, 'utf8');
