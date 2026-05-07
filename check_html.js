const fs = require('fs');
const h = fs.readFileSync('C:/Users/23889/.qclaw/workspace/outreach_dashboard_v16.html', 'utf8');
// Search for id patterns
const re = /"id":\s*\d+/g;
let m;
let count = 0;
let ids = [];
while ((m = re.exec(h)) !== null) {
  count++;
  if (count <= 5) ids.push(m[0]);
  if (count === 25) ids.push('...[' + count + ']...' + m[0]);
  if (count >= 840) ids.push('[' + count + ']' + m[0]);
}
console.log('Total ID matches:', count);
console.log('Sample IDs:', ids.join(', '));

// Check file structure - find where contacts array ends
const contactsEnd = h.indexOf('"source": "salesrobot"', h.indexOf('"contacts": ['));
// Find the last occurrence of source:salesrobot
let lastSalesrobot = -1;
let searchFrom = 0;
while (true) {
  const idx = h.indexOf('"source": "salesrobot"', searchFrom);
  if (idx === -1) break;
  lastSalesrobot = idx;
  searchFrom = idx + 1;
}
console.log('\nLast salesrobot at:', lastSalesrobot);
if (lastSalesrobot > 0) {
  console.log('Context:', h.substring(lastSalesrobot, lastSalesrobot + 200));
}

// Check what's after the embedded data
const configIdx = h.indexOf('// CONFIG');
console.log('\n// CONFIG at:', configIdx);
if (configIdx > 0) {
  console.log('Before CONFIG:', h.substring(configIdx - 50, configIdx + 20));
}
