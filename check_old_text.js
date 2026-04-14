const fs = require('fs');
const oldBuf = fs.readFileSync('old_v030.html');
// Try UTF-16LE (with BOM stripped)
let old = oldBuf.toString('utf16le');
if (old.charCodeAt(0) === 0xFEFF) old = old.slice(1);

// Check the actual text around the stats
const s1 = old.indexOf('Whitney');
const s2 = old.indexOf('Lealand');
const s3 = old.indexOf('Pending');
console.log('Whitney pos:', s1);
console.log('Around Whitney:', JSON.stringify(old.substring(s1, s1+80)));
console.log('Lealand pos:', s2);
console.log('Around Lealand:', JSON.stringify(old.substring(s2, s2+80)));
console.log('Pending pos:', s3);
console.log('First Pending:', JSON.stringify(old.substring(s3, s3+40)));

// Check the stats text
const s4 = old.indexOf('已发送');
console.log('已发送 pos:', s4);
if (s4 >= 0) console.log('Stats area:', JSON.stringify(old.substring(s4, s4+100)));

// Check what "Lealand Blum" status looks like
const lb = old.indexOf('Lealand Blum');
if (lb >= 0) console.log('Lealand status:', JSON.stringify(old.substring(lb, lb+100)));

// Check if 7天 or 7天未回复 exists
console.log('7天未回复:', old.includes('7天未回复'));
console.log('7天:', old.includes('7天'));

// Search for Lealand's actual status text
const pendingIdx = old.indexOf('Pending');
if (pendingIdx >= 0) {
  console.log('First Pending area:', JSON.stringify(old.substring(pendingIdx-50, pendingIdx+50)));
}

// Search for 待联系
console.log('待联系:', old.includes('待联系'));
