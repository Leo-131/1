// Update dashboard HTML with latest data v26052101
const fs = require('fs');
const data = require('./outreach_data.json');

const htmlPath = './outreach_dashboard_v16.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace the embedded data section
const lines = html.split('\n');
const startLine = lines.findIndex(l => l.includes('// ========== EMBEDDED DATA'));
const endLine = lines.findIndex(l => l.includes('// ========== CONFIG & STATE'));
if (startLine === -1 || endLine === -1) {
  console.log('ERROR: Could not find embedded data markers, start:', startLine, 'end:', endLine);
  process.exit(1);
}

const newDataLines = [
  `// ========== EMBEDDED DATA (${data.contacts.length} contacts) ==========`,
  'const EMBEDDED_DATA = ' + JSON.stringify(data) + ';'
];

lines.splice(startLine, endLine - startLine, ...newDataLines);
html = lines.join('\n');

// Update version in title
html = html.replace(/v16\.\d+ - Data Embedded/, 'v17.1 - Data Embedded');
html = html.replace(/v16\.\d+/, 'v17.1');

fs.writeFileSync(htmlPath, html);
console.log('✅ Dashboard updated with', data.contacts.length, 'contacts');
console.log('Version: v17.1 (26052101)');
