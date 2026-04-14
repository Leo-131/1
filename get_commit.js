const { execSync } = require('child_process');
const fs = require('fs');

// Get the full HTML from git commit 4986de8
try {
  const d = execSync('git show 4986de8:outreach-dashboard/public/index.html', {
    maxBuffer: 10 * 1024 * 1024,
    encoding: 'utf8',
    windowsHide: true
  });
  console.log('Got data, length:', d.length);
  console.log('Has connectServer:', d.includes('connectServer'));
  console.log('Has section-automation:', d.includes('section-automation'));
  console.log('Has task-list:', d.includes('task-list'));
  console.log('Has bot-log:', d.includes('bot-log'));
  fs.writeFileSync('outreach-dashboard/public/index.html', d, 'utf8');
  console.log('Written! Size:', fs.readFileSync('outreach-dashboard/public/index.html').length);
} catch(e) {
  console.error('Error:', e.message);
}
