const fs = require('fs');
let c = fs.readFileSync('vercel.json', 'utf8');
const obj = JSON.parse(c);
delete obj.buildCache;
fs.writeFileSync('vercel.json', JSON.stringify(obj, null, 2));
console.log('Fixed vercel.json:', JSON.stringify(obj));
