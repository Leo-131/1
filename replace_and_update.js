const fs = require('fs');

// Read old v0.3.0 (UTF-16LE encoded)
const oldBuf = fs.readFileSync('old_v030.html');
const oldHtml = oldBuf.toString('utf16le');

// Remove BOM if present
const noBom = oldHtml.charCodeAt(0) === 0xFEFF ? oldHtml.slice(1) : oldHtml;

console.log('Old v0.3.0 size:', noBom.length);

// Replace the static data values in the old HTML with current data
// These are hardcoded in the old HTML:
// - 已发送: 0 -> 3
// - 本周: 0 -> 17  
// - LinkedIn: 0/60 -> 3/60
// - Instagram: 0/25 -> 1/25
// - Facebook: 0/15 -> 1/15
// - Whitney: Pending -> 7天未回复
// - Lealand Blum: Pending -> 待联系
// - Peter Whitcomb: Pending -> 待联系

let updated = noBom
  .replace(/已发送 \d+/g, '已发送 3')
  .replace(/本周 \d+/g, '本周 17')
  .replace(/今日 \d+/g, '今日 3')
  .replace(/0\/60/g, '3/60')
  .replace(/0\/25/g, '1/25')
  .replace(/0\/15/g, '1/15')
  .replace(/还需发送 \d+ 条/g, '还需发送 97 条')
  .replace(/超期未回复客户 \d+ 个/g, '超期未回复客户 1 个')
  .replace(/KA\/连锁客户 \d+ 个/g, 'KA/连锁客户 11 个')
  .replace(/待处理 \d+ 个/g, '待处理 37 个')
  .replace(/本周进度 \d+\/500/g, '本周进度 17/500');

console.log('Updated size:', updated.length);
console.log('今日 3:', updated.includes('今日 3'));
console.log('本周 17:', updated.includes('本周 17'));
console.log('3/60:', updated.includes('3/60'));
console.log('7天未回复:', updated.includes('7天未回复'));
console.log('待联系:', updated.includes('待联系'));

// Write as UTF-8 (no BOM) to the new format
// Actually, the old HTML was UTF-16. We need to convert to UTF-8.
const { Buffer } = require('buffer');
const utf8Buf = Buffer.from(updated, 'utf16le');
// Write as UTF-8 (standard)
fs.writeFileSync('outreach-dashboard/public/index.html', updated, 'utf8');
console.log('Written! Size:', fs.readFileSync('outreach-dashboard/public/index.html').length);
