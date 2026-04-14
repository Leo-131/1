const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

console.log('Before - linkedIn 0/60:', c.includes('0 / 60'));
console.log('Before - 今日 0:', c.includes('>0 今日<'));

// The HTML structure: <span>数字</span> for each stat
// 已发送: the first stat card shows "0" 
// 今日: the third stat card shows "0"

// Find and replace specific stat values
// The stats are in spans, format: <span>数字</span>

// Replace the first occurrence of <span>0</span> with <span>1</span> (已发送)
// This is the "已发送" stat
c = c.replace(/<span>0<\/span>(\s*<span[^>]*>\s*已发送\s*<)/, '<span>1</span>$1');

// For the daily target cards: "今日 0 / 100" etc
// LinkedIn: 0/60 -> 1/60
c = c.replace(/<span>\s*0\s*<\/span>\s*\/\s*60/, '<span>1</span> / 60');

// Update customer statuses in the HTML
// Whitney La Ruffa - 7 days no reply
c = c.replace(
  /(Whitney La Ruffa[^<]*⏳)\s*Pending(.*?camping)/,
  '$1⏳7天未回复$2'
);

// Michael Hartridge - replied (not in the 37 clients)
// Check if Michael Hartridge is in the list... he's not in the 37

// Update Abigail Vollkommer - 1 day no reply  
c = c.replace(
  /(Abigail Vollkommer[^<]*⏳)\s*Pending(.*?camping)/,
  '$1⏳1天未回复$2'
);

// Update Naturkompaniet
c = c.replace(
  /(Naturkompaniet[^<]*⏳)\s*Pending/,
  '$1⏳8天未回复'
);

// Update the "本周" stat
c = c.replace(/>\s*0\s*本周</, '>14 本周<');

// For the sidebar progress section
// "发送进度 0 / 100" 
c = c.replace(/>\s*发送进度\s*0\s*\/\s*100</, '>发送进度 1 \/ 100<');

// Update "还差 100 条" 
c = c.replace(/还差\s*100\s*条/, '还差 99 条');

// Update "本周进度 0/500"
c = c.replace(/0\/500/, '14\/500');

fs.writeFileSync('index.html', c, 'utf8');

// Verify
let updated = fs.readFileSync('index.html', 'utf8');
console.log('\nAfter updates:');
console.log('Has 1/60:', updated.includes('1 / 60'));
console.log('Has "今日 1":', updated.includes('今日 1') || updated.includes('>1 今日<') || updated.includes('>1<span> 今日'));
console.log('Has 14 本周:', updated.includes('14 本周'));
console.log('Has Whitney 7天:', updated.includes('7天未回复'));
console.log('Has Abigail 1天:', updated.includes('1天未回复'));
console.log('File size:', updated.length);
