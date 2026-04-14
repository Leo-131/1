const fs = require('fs');
let c = fs.readFileSync('outreach-dashboard/public/index.html').toString('utf8');
// Fix Peter Whitcomb placeholder
c = c.replace('___PLACEHOLDER_DAILLIANXI___', '<div class="status warn">⏳待联系<\/div>');
// Fix progress ring percentage: todayPercent 0% -> 3%
c = c.replace('id="todayPercent">0%', 'id="todayPercent">3%');
// Fix circumference offset for 3% (should be ~94% of circumference remaining)
// The old code uses circumference = 2 * PI * 24
// For 3/100: offset = circumference * (1 - 3/100) = circumference * 0.97
c = c.replace('stroke-dashoffset: 150.8', 'stroke-dashoffset: 146.3');
// Fix progress ring bar-fill width for LinkedIn (3%)
c = c.replace('LinkedIn<\/div>', 'LinkedIn<\/div>');
// The LinkedIn bar-fill should be width:3%
const liBar = c.indexOf('bar-fill li" style="width:5%"');
if (liBar >= 0) {
  c = c.substring(0, liBar) + 'bar-fill li" style="width:3%"' + c.substring(liBar + 24);
}
// Also fix the LinkedIn bar-fill if width:0%
const liBar0 = c.indexOf('bar-fill li" style="width:0%"');
if (liBar0 >= 0) {
  c = c.substring(0, liBar0) + 'bar-fill li" style="width:3%"' + c.substring(liBar0 + 24);
}
// The Instagram bar-fill should be width:4% (1/25 = 4%)
const igBar = c.indexOf('bar-fill ig" style="width:7%"');
if (igBar >= 0) {
  c = c.substring(0, igBar) + 'bar-fill ig" style="width:4%"' + c.substring(igBar + 24);
}
// The Facebook bar-fill should be width:7% (1/15 ≈ 6.7%)
const fbBar = c.indexOf('bar-fill fb" style="width:7%"');
// already 7%, keep as is

// Fix 还差
c = c.replace('还差 97 条', '还差 97 条');

fs.writeFileSync('outreach-dashboard/public/index.html', c, 'utf8');
const check = c;
console.log('Peter:', check.includes('⏳待联系<\/div>'));
console.log('todayPercent 3%:', check.includes('todayPercent">3%'));
console.log('bar-fill li width:3%:', check.includes('bar-fill li" style="width:3%"'));
console.log('Size:', check.length);
