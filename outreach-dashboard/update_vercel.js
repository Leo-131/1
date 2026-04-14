const fs = require('fs');
const c = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
c.installCommand = 'echo skip';
c.buildCommand = 'echo skip';
fs.writeFileSync('vercel.json', JSON.stringify(c, null, 2));
console.log('Updated:', JSON.stringify(c));
