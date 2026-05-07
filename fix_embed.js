const fs = require('fs');
const html = fs.readFileSync('C:/Users/23889/.qclaw/workspace/outreach_dashboard_v16.html', 'utf8');
const json = fs.readFileSync('C:/Users/23889/.qclaw/workspace/outreach_data.json', 'utf8');

// 1. Replace fetch-based loadData with embedded version
let out = html.replace(
  /async function loadData\(\)\{[\s\S]*?renderDashboard\(\)\s*\}/,
  `function loadData(){
  if(typeof EMBEDDED_DATA !== 'undefined' && EMBEDDED_DATA.contacts && EMBEDDED_DATA.contacts.length > 0){
    contactsData = EMBEDDED_DATA;
    document.getElementById('error-banner').style.display='none';
  }else{
    contactsData={stats:{version:'15.2',last_run:'2026-04-22',total_contacts:844},contacts:[]};
    document.getElementById('error-banner').textContent='EMBEDDED DATA ERROR';
    document.getElementById('error-banner').style.display='block'
  }
  renderDashboard()
}`
);

// 2. Replace EMBEDDED_DATA placeholder with actual JSON
out = out.replace('const EMBEDDED_DATA = ', 'const EMBEDDED_DATA = ' + json + ';\n\n// CONFIG & STATE\n// ===');

// 3. Update version
out = out.replace(/v16\.[0-9]+/g, 'v16.4');

fs.writeFileSync('C:/Users/23889/.qclaw/workspace/outreach_dashboard_v16.html', out, 'utf8');

// Verify
const result = fs.readFileSync('C:/Users/23889/.qclaw/workspace/outreach_dashboard_v16.html', 'utf8');
const idRegex = /"id": \d+/g;
let match;
let count = 0;
let lastId = '';
while ((match = idRegex.exec(result)) !== null) {
  count++;
  lastId = match[0];
}
console.log('File size:', Math.round(result.length / 1024), 'KB');
console.log('Contact IDs found:', count);
console.log('Last ID:', lastId);
console.log('Ends with </html>:', result.trimEnd().endsWith('</html>'));
console.log('Has EMBEDDED_DATA:', result.includes('const EMBEDDED_DATA'));
console.log('Has contactsData=EMBEDDED:', result.includes('contactsData = EMBEDDED_DATA'));
