const fs = require('fs');

// Read old v0.3.0 (UTF-16LE encoded) and convert to UTF-8
const oldBuf = fs.readFileSync('old_v030.html');
let old = oldBuf.toString('utf16le');
if (old.charCodeAt(0) === 0xFEFF) old = old.slice(1);

// All the updates we need
let updated = old
  // Stats - stat card numbers: <div class="num">0</div> -> 3 where needed
  // The first stat-card (green) has 已发送 0, update the number to 3
  .replace(
    /(<div class="stat-card green"[\s\S]{0,500}?<div class="num">)(\d+)(<\/div>[\s\S]{0,200}?本周 <)(\d+)(<\/div>)/,
    '$13$3 17$5'
  )
  // LinkedIn daily target: first 0/60 -> 3/60  
  .replace(/(\d+)\/60<\/div>\s*<\/div>\s*<div class="plat-card"><div[^>]*>📷 Instagram/, 
    '3/60<\/div> <div class="sub">3<\/div> <span class="dt-pct">5%<\/span><\/div><div class="plat-card"><div class="plat-icon">📷 Instagram')
  // Instagram: 0/25 -> 1/25
  .replace(/📷 Instagram[^<]*<span class="dt-nums">(\d+)\/25<\/span>/, 
    '📷 Instagram<\/div><div class="dt-nums">1\/25<\/span>')
  // Facebook: 0/15 -> 1/15  
  .replace(/📘 Facebook[^<]*<span class="dt-nums">(\d+)\/15<\/span>/,
    '📘 Facebook<\/div><div class="dt-nums">1\/15<\/span>')
  // Customer: Whitney La Ruffa -> 7天未回复
  // Find the specific div with Whitney's status
  .replace(
    /Whitney La Ruffa<\/div><div class="meta">Black Dog Outdoors · Founder<\/div><\/div>[\s\S]{0,300}?<div class="status pending">⏳ Pending<\/div>/,
    'Whitney La Ruffa<\/div><div class="meta">Black Dog Outdoors · Founder<\/div><\/div>___PLACEHOLDER_7TIAN___'
  )
  // Customer: Lealand Blum -> 待联系
  .replace(
    /Lealand Blum<span class="tag">KA<\/span><\/div><div class="meta">Amazon · Vendor Manager<\/div><\/div>[\s\S]{0,300}?<div class="status pending">⏳ Pending<\/div>/,
    'Lealand Blum<span class="tag">KA<\/span><\/div><div class="meta">Amazon · Vendor Manager<\/div><\/div>___PLACEHOLDER_DAILLIANXI___'
  )
  // Peter Whitcomb -> 待联系
  .replace(
    /Peter Whitcomb<span class="tag">KA<\/span><\/div><div class="meta">TERSUS Solutions · CEO<\/div><\/div>[\s\S]{0,300}?<div class="status pending">⏳ Pending<\/div>/,
    'Peter Whitcomb<span class="tag">KA<\/span><\/div><div class="meta">TERSUS Solutions · CEO<\/div><\/div>___PLACEHOLDER_DAILLIANXI___'
  )
  // Fix placeholders
  .replace('___PLACEHOLDER_7TIAN___', '<div class="status warn">⏳7天未回复<\/div>')
  .replace('___PLACEHOLDER_DAILLIANXI___', '<div class="status warn">⏳待联系<\/div>')
  // 跟进超期: 0 -> 1
  .replace(/跟进超期未回复客户 (\d+) 个<\/div>/, '跟进超期未回复客户 1 个<\/div>')
  // LinkedIn 今日还需: 60 -> 57
  .replace(/LinkedIn · 今日还需发送 (\d+) 条<\/div>/, 'LinkedIn · 今日还需发送 57 条<\/div>')
  // Instagram还需: 25 -> 24
  .replace(/Instagram · 今日还需发送 (\d+) 条<\/div>/, 'Instagram · 今日还需发送 24 条<\/div>')
  // Facebook还需: 15 -> 14
  .replace(/Facebook · 今日还需发送 (\d+) 条<\/div>/, 'Facebook · 今日还需发送 14 条<\/div>')
  // 进度条: 0% -> 3%
  .replace(/id="todayPercent">(\d+)%<\/div>/, 'id="todayPercent">3%<\/div>')
  // 还差: 100 -> 97
  .replace(/还差 (\d+) 条<\/div>/, '还差 97 条<\/div>')
  // 本周进度: 0/500 -> 17/500
  .replace(/本周进度 (\d+)\/500/, '本周进度 17/500')
  // 转化率: 0% -> already correct
  // KA待处理: 11 -> already correct
  // 待处理总数: 37 -> already correct
  // Platform count first LinkedIn: 0 -> 3
  .replace(/(今日还需发送)(\d+)/, function(m, prefix, n) {
    return prefix + (60 - 3);
  });

// Update the LinkedIn remaining count specifically
updated = updated.replace(/LinkedIn · 今日还需发送 60 条/, 'LinkedIn · 今日还需发送 57 条');

// Write as UTF-8
fs.writeFileSync('outreach-dashboard/public/index.html', updated, 'utf8');
console.log('Written! Size:', fs.readFileSync('outreach-dashboard/public/index.html').length);

// Verify key changes
const check = fs.readFileSync('outreach-dashboard/public/index.html').toString('utf8');
console.log('✅ 已发送 3:', check.includes('已发送 3'));
console.log('✅ 本周 17:', check.includes('本周 17'));
console.log('✅ 7天未回复:', check.includes('7天未回复'));
console.log('✅ 待联系:', check.includes('待联系'));
console.log('✅ LinkedIn 3/60:', check.includes('3/60'));
console.log('✅ Instagram 1/25:', check.includes('1/25'));
console.log('✅ Facebook 1/15:', check.includes('1/15'));
console.log('✅ draggable:', check.includes('draggable'));
console.log('✅ resize:', check.includes('resize'));
console.log('✅ collapsePanel:', check.includes('collapsePanel'));
console.log('✅ resetPanel:', check.includes('resetPanel'));
console.log('✅ mousedown:', check.includes('mousedown'));
console.log('✅ updateTimezones:', check.includes('updateTimezones'));
console.log('✅ toast:', check.includes('showToast'));
console.log('✅ clock:', check.includes('updateClock'));
