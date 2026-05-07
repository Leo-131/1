const fs = require('fs');
const h = fs.readFileSync('C:/Users/23889/.qclaw/workspace/outreach_dashboard_v16.html', 'utf8');

// Count ALL "id": occurrences (both numeric and string)
const re = /"id":/g;
let c = 0;
while (re.exec(h)) c++;
console.log('Total id fields:', c);

// Check for first, middle, last contacts
console.log('Has James Chen (first):', h.includes('"name":"James Chen"'));
console.log('Has Rachel Green (#25):', h.includes('"name":"Rachel Green"'));
console.log('Has John Mclauchlan (#26):', h.includes('"name":"John Mclauchlan"'));
console.log('Has Diana Muller (#100):', h.includes('"name":"Diana Muller"'));
console.log('Has Sheena Denmead (last #844):', h.includes('"name":"Sheena Denmead"'));

// Check JSON is valid
const dataStart = h.indexOf('const EMBEDDED_DATA = ');
const jsonStart = dataStart + 'const EMBEDDED_DATA = '.length;
// Find the end of the JSON object (matching braces would be complex, just check it ends properly)
const jsonEnd = h.indexOf('\n\n//', jsonStart);
const jsonStr = h.substring(jsonStart, jsonEnd);
try {
  const parsed = JSON.parse(jsonStr);
  console.log('\nJSON VALID: YES');
  console.log('Contacts in embedded data:', parsed.contacts.length);
  console.log('Last contact:', parsed.contacts[parsed.contacts.length - 1].name);
} catch(e) {
  console.log('\nJSON VALID: NO -', e.message.substring(0, 100));
}

console.log('\nFile size:', Math.round(h.length / 1024), 'KB');
console.log('Ends </html>:', h.trimEnd().endsWith('</html>'));
