const fs = require('fs');
const h = fs.readFileSync('C:/Users/23889/.qclaw/workspace/outreach_dashboard_v16.html', 'utf8');

// Extract just the JSON part (between "const EMBEDDED_DATA = " and the first ";")
const startMarker = 'const EMBEDDED_DATA = ';
const s = h.indexOf(startMarker) + startMarker.length;
// Find the closing }; of the JSON object
let depth = 0;
let e = s;
for (let i = s; i < h.length; i++) {
  if (h[i] === '{') depth++;
  if (h[i] === '}') { depth--; if (depth === 0) { e = i + 1; break; } }
}
const jsonStr = h.substring(s, e);
console.log('JSON length:', Math.round(jsonStr.length / 1024), 'KB');

try {
  const data = JSON.parse(jsonStr);
  console.log('VALID JSON: YES');
  console.log('Total contacts:', data.contacts.length);
  console.log('Stats:', JSON.stringify(data.stats));
  console.log('First:', data.contacts[0].name, '-', data.contacts[0].company);
  console.log('#25:', data.contacts[24].name, '-', data.contacts[24].company);
  console.log('#26:', data.contacts[25].name, '-', data.contacts[25].company);
  console.log('#844 (last):', data.contacts[843].name, '-', data.contacts[843].company);
  
  // Count statuses
  const acc = data.contacts.filter(c => c.status === 'Accepted').length;
  const pen = data.contacts.filter(c => c.status === 'Pending').length;
  console.log('\nAccepted:', acc, '| Pending:', pen, '| Other:', data.contacts.length - acc - pen);
  
  // Count sources
  const sources = {};
  data.contacts.forEach(c => { sources[c.source] = (sources[c.source] || 0) + 1; });
  console.log('Sources:', JSON.stringify(sources));
  
} catch(err) {
  console.log('PARSE ERROR:', err.message);
}

console.log('\nFile size:', Math.round(h.length / 1024), 'KB');
console.log('Ends </html>:', h.trimEnd().endsWith('</html>'));
