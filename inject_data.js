const fs = require('fs');

// Step 1: Read the HTML skeleton (without data)
const skeleton = fs.readFileSync('C:/Users/23889/.qclaw/workspace/outreach_dashboard_v16.html', 'utf8');

// Step 2: Read the JSON data
const jsonData = fs.readFileSync('C:/Users/23889/.qclaw/workspace/outreach_data.json', 'utf8');
console.log('JSON size:', Math.round(jsonData.length / 1024), 'KB, contacts:', JSON.parse(jsonData).contacts.length);

// Step 3: Replace placeholder with actual data
// The skeleton should have: const EMBEDDED_DATA = __DATA_PLACEHOLDER__;
const output = skeleton.replace('__DATA_PLACEHOLDER__', jsonData);

// Also fix loadData to use embedded data (if not already fixed)
const finalOutput = output.replace(
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

// Update version
const versioned = finalOutput.replace(/v16\.[0-9]+/g, 'v16.4');

fs.writeFileSync('C:/Users/23889/.qclaw/workspace/outreach_dashboard_v16.html', versioned, 'utf8');

// Verify
const result = fs.readFileSync('C:/Users/23889/.qclaw/workspace/outreach_dashboard_v16.html', 'utf8');
const re = /"id":\s*\d+/g;
let cnt = 0;
let last = '';
while ((m = re.exec(result)) !== null) { cnt++; last = m[0]; }
console.log('\nOutput file:', Math.round(result.length / 1024), 'KB');
console.log('Contact IDs:', cnt);
console.log('Last ID:', last);
console.log('Ends </html>:', result.trimEnd().endsWith('</html>'));
