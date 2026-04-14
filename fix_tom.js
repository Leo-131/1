const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// Fix Tom Connell - should be Pending, not 7天未回复
// Find Tom Connell contact and fix his status
const tomIdx = c.indexOf('Tom Connell</div>');
if (tomIdx > 0) {
  const afterTom = c.substring(tomIdx);
  const statusIdx = afterTom.indexOf('status-tag status-pending">⏳7天未回复</span>');
  if (statusIdx > 0) {
    const absIdx = tomIdx + statusIdx;
    c = c.substring(0, absIdx) + 'status-tag status-pending">⏳ Pending</span>' + c.substring(absIdx + 'status-tag status-pending">⏳7天未回复</span>'.length);
    console.log('Fixed Tom Connell status');
  } else {
    console.log('Tom Connell status not found or not 7天');
    // Find what's actually there
    const actual = afterTom.indexOf('status-tag');
    console.log('Actual:', JSON.stringify(afterTom.substring(actual, actual+80)));
  }
}

// Fix sidebar: 发送进度 0 / 100 -> 1 / 100
c = c.replace('发送进度 0 / 100', '发送进度 1 / 100');

// Fix sidebar: 还差 99 条 already correct from fix_stats2

fs.writeFileSync('index.html', c, 'utf8');
console.log('File size:', c.length);

// Verify Tom
let updated = fs.readFileSync('index.html', 'utf8');
const tomCheck = updated.indexOf('Tom Connell</div>');
const tomSection = updated.substring(tomCheck, tomCheck+200);
console.log('Tom Connell section:', JSON.stringify(tomSection));
