const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
// Update Instagram stats to 1/25
c = c.replace('id="ins-nums">0/25</span>', 'id="ins-nums">1/25</span>');
c = c.replace('id="ins-progress-text">0/25</span>', 'id="ins-progress-text">1/25</span>');
fs.writeFileSync('index.html', c);
console.log('Instagram updated');
console.log('ins-nums:', c.includes('ins-nums">1/25'));
