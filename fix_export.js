const fs = require('fs');
let c = fs.readFileSync('outreach-dashboard/public/index.html', 'utf8');
// Fix buttons with empty onclick
c = c.replace(/<button onclick="">/g, '<button onclick="location.reload()">');
// Verify all buttons
const btns = c.match(/<button[^>]*>/g)||[];
console.log('Buttons:', btns);
fs.writeFileSync('outreach-dashboard/public/index.html', c, 'utf8');
console.log('Done');
