const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace('id="ig-nums">0/25', 'id="ig-nums">1/25');
fs.writeFileSync('index.html', c);
console.log('IG updated');
