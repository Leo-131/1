const fs = require('fs');

// Read old v0.3.0 as UTF-16LE (with BOM stripped)
const oldBuf = fs.readFileSync('old_v030.html');
let old = oldBuf.toString('utf16le');
if (old.charCodeAt(0) === 0xFEFF) old = old.slice(1);

console.log('Old v0.3.0 size:', old.length, 'chars');

// The old HTML has these specific structures we need to update:
// 1. Stats numbers
// 2. Platform counts  
// 3. Customer status tags

let updated = old
  // Stats: hardcoded "0" -> actual values
  // "已发送 0</div>" -> "已发送 3</div>"  
  // Note: old uses CRLF line endings
  .replace(/已发送 0<\/div>/g, '已发送 3<\/div>')
  .replace(/已发送 <span[^>]*>0<\/span><\/div>/g, '已发送 <span>3<\/span><\/div>')
  
  // 本周: "本周 0</div>" -> "本周 17</div>"  
  .replace(/本周 0<\/div>/g, '本周 17<\/div>')
  
  // Stat card numbers: <div class="num">0</div>
  .replace(/(<div class="num">)0(<\/div>)/g, '$13$2')
  
  // Platform stats
  .replace(/(\d+)\/60<\/div>/g, (m, n) => {
    if (n === '0') return m;
    return m; // LinkedIn - skip, keep as-is unless it's the actual sent count
  })
  
  // LinkedIn: first 0/60 is daily target progress
  // The HTML has multiple 0/60 patterns, update specific ones
  // Leave platform counts as they are in old version (different layout)
  
  // Customer statuses: Whitney La Ruffa -> 7天未回复
  // In old HTML: <div class="status pending">⏳ Pending</div>
  .replace(
    /Whitney La Ruffa<\/div><div class="meta">Black Dog Outdoors · Founder<\/div><\/div><div class="item-body"><div class="right"><div class="status pending">⏳ Pending<\/div>/,
    'Whitney La Ruffa<\/div><div class="meta">Black Dog Outdoors · Founder<\/div><\/div><div class="item-body"><div class="right"><div class="status warn">⏳7天未回复<\/div>'
  )
  
  // Lealand Blum -> 待联系
  .replace(
    /Lealand Blum<span class="tag">KA<\/span><\/div><div class="meta">Amazon · Vendor Manager<\/div><\/div><div class="item-body"><div class="right"><div class="status pending">⏳ Pending<\/div>/,
    'Lealand Blum<span class="tag">KA<\/span><\/div><div class="meta">Amazon · Vendor Manager<\/div><\/div><div class="item-body"><div class="right"><div class="status warn">⏳待联系<\/div>'
  )
  
  // Peter Whitcomb -> 待联系
  .replace(
    /Peter Whitcomb<span class="tag">KA<\/span><\/div><div class="meta">TERSUS Solutions · CEO<\/div><\/div><div class="item-body"><div class="right"><div class="status pending">⏳ Pending<\/div>/,
    'Peter Whitcomb<span class="tag">KA<\/span><\/div><div class="meta">TERSUS Solutions · CEO<\/div><\/div><div class="item-body"><div class="right"><div class="status warn">⏳待联系<\/div>'
  );

// Check what changed
console.log('Whitney 7天:', updated.includes('7天未回复'));
console.log('Lealand 待联系:', updated.includes('待联系'));
console.log('已发送 3:', updated.includes('已发送 3'));
console.log('本周 17:', updated.includes('本周 17'));

// Read current new version to compare
const newBuf = fs.readFileSync('outreach-dashboard/public/index.html');
const newHtml = newBuf.toString('utf8');
console.log('\nNew version size:', newHtml.length);

// Find the key sections in new version to compare
const s1 = newHtml.indexOf('已发送 0');
const s2 = newHtml.indexOf('已发送 3');
console.log('New: 已发送 0 at:', s1, '已发送 3 at:', s2);

if (s1 >= 0) console.log('Stats area:', JSON.stringify(newHtml.substring(s1, s1+100)));
if (s2 >= 0) console.log('Updated stats:', JSON.stringify(newHtml.substring(s2, s2+100)));

// The new version has been already modified. Let's just verify
// and write the properly-encoded old version with updated data
fs.writeFileSync('outreach-dashboard/public/index.html', updated, 'utf8');
console.log('\nWritten! New file size:', fs.readFileSync('outreach-dashboard/public/index.html').length);

// Verify the written file
const check = fs.readFileSync('outreach-dashboard/public/index.html').toString('utf8');
console.log('Verify 7天未回复:', check.includes('7天未回复'));
console.log('Verify 待联系:', check.includes('待联系'));
console.log('Verify 已发送 3:', check.includes('已发送 3'));
console.log('Verify 本周 17:', check.includes('本周 17'));
