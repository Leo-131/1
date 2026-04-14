const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace('id="progress-detail">0 / 100</div>', 'id="progress-detail">3 / 100</div>');
c = c.replace('还需发送 99 条', '还需发送 97 条');
c = c.replace('还需发送 60 条', '还需发送 97 条');
fs.writeFileSync('index.html', c);
console.log('ok');
