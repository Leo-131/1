const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// Fix sidebar stats
c = c.replace(/发送进度\s*0\s*\/\s*100/g, '发送进度 3 / 100');
c = c.replace(/还需发送\s*97\s*条/g, '还需发送 97 条');
// Already 97 is correct

fs.writeFileSync('index.html', c);
console.log('Fixed sidebar');
console.log('Check:', c.includes('发送进度 3 / 100'));
