const fs = require('fs');
const h = fs.readFileSync('C:/Users/23889/.qclaw/workspace/outreach_dashboard_v16.html', 'utf8');

// Find the EMBEDDED_DATA section
const dataStart = h.indexOf('const EMBEDDED_DATA = ');
console.log('Data starts at:', dataStart);

// Show what's around position 383673 (where JSON parse failed)
const jsonPart = h.substring(dataStart + 'const EMBEDDED_DATA = '.length, dataStart + 'const EMBEDDED_DATA = '.length + 383700);
console.log('\nJSON end area (pos 383660-383700):');
console.log(JSON.stringify(jsonPart.substring(383660 - 20, 383700)));

// Show what comes right after the JSON
const afterJson = h.substring(dataStart + 'const EMBEDDED_DATA = '.length + 383670, dataStart + 'const EMBEDDED_DATA = '.length + 383710);
console.log('\nAfter JSON pos 383670-383710:');
console.log(JSON.stringify(afterJson));
