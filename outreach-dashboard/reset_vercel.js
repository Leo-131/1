const fs = require('fs');
const c = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
delete c.installCommand;
delete c.buildCommand;
fs.writeFileSync('vercel.json', JSON.stringify(c, null, 2));
console.log('Reset');
