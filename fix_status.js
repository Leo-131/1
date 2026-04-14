const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// Update status for specific contacts
// Each contact has: <div class="contact-name">Name</div>...<span class="status-tag status-pending">⏳ Pending</span>

function updateStatus(name, newStatus) {
  // Find the contact by name, then find the next status-pending span
  const nameIdx = c.indexOf('contact-name">' + name);
  if (nameIdx < 0) { console.log('NOT FOUND:', name); return; }
  
  // Find the next status-pending after this name
  const afterName = c.substring(nameIdx);
  const statusIdx = afterName.indexOf('status-tag status-pending">⏳ Pending</span>');
  if (statusIdx < 0) { console.log('STATUS NOT FOUND for:', name); return; }
  
  const absIdx = nameIdx + statusIdx;
  const old = 'status-tag status-pending">⏳ Pending</span>';
  const replacement = 'status-tag status-pending">' + newStatus + '</span>';
  
  c = c.substring(0, absIdx) + replacement + c.substring(absIdx + old.length);
  console.log('Updated:', name, '->', newStatus);
}

// Contacts that have been contacted
updateStatus('Whitney La Ruffa', '⏳7天未回复');
updateStatus('Abigail Vollkommer', '⏳1天未回复');
updateStatus('Naturkompaniet', '⏳8天未回复');
updateStatus('Raizy Weiss', '⏳2天未回复');
updateStatus('Jane Wallace-Bradley', '⏳8天未回复');
updateStatus('Travis Reill', '⏳9天未回复(话不对)');
updateStatus('Lealand Blum', '⏳待联系');

// Also add new contacts that we've reached out to
// (These aren't in the 37 but we should track them)
// Michael Hartridge - 回复中!
// Candace Gallagher - 已发DM
// Eric Oberg - 已识别

// Update Whitney's status in the pipeline filter
// Find Whitney's card and update
const wIdx = c.indexOf('Whitney La Ruffa');
if (wIdx > 0) {
  const oldWhitney = 'Whitney La Ruffa Black Dog Outdoors · Founder ⏳ Pending camping';
  const newWhitney = 'Whitney La Ruffa Black Dog Outdoors · Founder ⏳7天未回复 camping';
  c = c.replace(oldWhitney, newWhitney);
  console.log('Whitney pipeline updated');
}

// Update Abigail
const aIdx = c.indexOf('Abigail Vollkommer');
if (aIdx > 0) {
  const oldAbigail = 'Abigail Vollkommer Cabela\'s · Senior Buyer ⏳ Pending camping';
  const newAbigail = 'Abigail Vollkommer Cabela\'s · Senior Buyer ⏳1天未回复 camping';
  c = c.replace(oldAbigail, newAbigail);
  console.log('Abigail pipeline updated');
}

fs.writeFileSync('index.html', c, 'utf8');

// Quick verify
let updated = fs.readFileSync('index.html', 'utf8');
console.log('\nVerify:');
console.log('Whitney 7天:', updated.includes('7天未回复'));
console.log('Abigail 1天:', updated.includes('1天未回复'));
console.log('Naturkompaniet 8天:', updated.includes('8天未回复'));
console.log('File size:', updated.length);
