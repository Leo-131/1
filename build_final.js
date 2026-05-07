const fs = require('fs');

// Read the CLEAN skeleton (with __DATA_PLACEHOLDER__)
const skeleton = fs.readFileSync('C:/Users/23889/.qclaw/workspace/dashboard_skeleton.html', 'utf8');
console.log('Skeleton size:', Math.round(skeleton.length / 1024), 'KB');
console.log('Has placeholder:', skeleton.includes('__DATA_PLACEHOLDER__'));

// Read JSON data
const jsonData = fs.readFileSync('C:/Users/23889/.qclaw/workspace/outreach_data.json', 'utf8');
const parsed = JSON.parse(jsonData);
console.log('JSON contacts:', parsed.contacts.length);

// Replace placeholder with actual data
const output = skeleton.replace('__DATA_PLACEHOLDER__', jsonData);

// Write output
const outFile = 'C:/Users/23889/.qclaw/workspace/outreach_dashboard_v16.html';
fs.writeFileSync(outFile, output, 'utf8');

// Verify
const result = fs.readFileSync(outFile, 'utf8');
const re = /"id":\s*\d+/g;
let m;
let count = 0;
let lastId = '';
while ((m = re.exec(result)) !== null) { count++; lastId = m[0]; }
console.log('\nOutput:', Math.round(result.length / 1024), 'KB');
console.log('Contact IDs:', count);
console.log('Last ID:', lastId);
console.log('Ends </html>:', result.trimEnd().endsWith('</html>'));
console.log('Has EMBEDDED_DATA:', result.includes('const EMBEDDED_DATA'));
