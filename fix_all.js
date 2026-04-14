const fs = require('fs');
let c = fs.readFileSync('outreach-dashboard/public/index.html').toString('utf8');

c = c
  .replace('<div class="progress">0/60</div>', '<div class="progress">3/60</div>')
  .replace('<div class="progress">0/25</div>', '<div class="progress">1/25</div>')
  .replace('<div class="progress">0/15</div>', '<div class="progress">1/15</div>')
  .replace('width:0%"', 'width:5%"')
  .replace('width:0%"', 'width:4%"')
  .replace('width:0%"', 'width:7%"')
  .replace('今日还需发送 60', '今日还需发送 57')
  .replace('今日还需发送 25', '今日还需发送 24')
  .replace('今日还需发送 15', '今日还需发送 14')
  .replace('本周进度 0/500', '本周进度 17/500')
  .replace('跟进超期未回复客户 0 个', '跟进超期未回复客户 1 个');

fs.writeFileSync('outreach-dashboard/public/index.html', c, 'utf8');

const check = c;
console.log('✅ LinkedIn 3/60:', check.includes('>3/60<'));
console.log('✅ Instagram 1/25:', check.includes('>1/25<'));
console.log('✅ Facebook 1/15:', check.includes('>1/15<'));
console.log('✅ width:5%:', check.includes('width:5%'));
console.log('✅ 已发送 3:', check.includes('已发送 3'));
console.log('✅ 本周 17:', check.includes('本周 17'));
console.log('✅ 7天未回复:', check.includes('7天未回复'));
console.log('✅ 待联系:', check.includes('待联系'));
console.log('✅ collapsePanel:', check.includes('collapsePanel'));
console.log('✅ resetPanel:', check.includes('resetPanel'));
console.log('✅ mousedown:', check.includes('mousedown'));
console.log('✅ resize:', check.includes('resize'));
console.log('✅ updateTimezones:', check.includes('updateTimezones'));
console.log('✅ showToast:', check.includes('showToast'));
console.log('✅ drag:', check.includes('dragging'));
console.log('✅ dragstart:', check.includes('dragstart'));
console.log('✅ clock:', check.includes('updateClock'));
console.log('✅ plateheader:', check.includes('panel-header'));
console.log('\nSize:', check.length);
