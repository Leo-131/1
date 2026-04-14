const fs = require('fs');
// Read old v0.3.0 as UTF-16
const buf = fs.readFileSync('old_v030.html');
const old = buf.toString('utf16le');
console.log('Old size:', old.length);

// Check for drag/resize/panel
console.log('draggable:', old.includes('draggable'));
console.log('resizable:', old.includes('resizable'));
console.log('dragstart:', old.includes('dragstart'));
console.log('dragend:', old.includes('dragend'));
console.log('resize:', old.includes('resize'));
console.log('mousedown:', old.includes('mousedown'));
console.log('mouseup:', old.includes('mouseup'));
console.log('mousemove:', old.includes('mousemove'));
console.log('touchstart:', old.includes('touchstart'));
console.log('touchmove:', old.includes('touchmove'));

// Check for panel/modal
console.log('panel:', old.includes('panel'));
console.log('modal:', old.includes('modal'));
console.log('dialog:', old.includes('dialog'));

// Check for collapse
console.log('collapse:', old.includes('collapse'));

// Find onclick handlers
const onclickMatches = old.match(/onclick="[^"]{0,100}"/g);
if (onclickMatches) {
  console.log('\nOnclick handlers:', onclickMatches.length);
  onclickMatches.slice(0, 10).forEach(m => console.log(' ', m));
}

// Find all <script> sections
const scriptMatches = old.match(/<script[^>]*>[\s\S]{0,500}?<\/script>/gi);
if (scriptMatches) {
  console.log('\nScript sections:', scriptMatches.length);
  scriptMatches.slice(0, 3).forEach((m, i) => console.log(i, m.substring(0, 200)));
}

// Find section/cards structure
const cardMatches = old.match(/class="[^"]*card[^"]*"/gi);
if (cardMatches) {
  console.log('\nCard classes:', [...new Set(cardMatches)].join('\n'));
}

// Check for specific old features
console.log('\n--- Old v0.3.0 key features ---');
console.log('Timezone section:', old.includes('北美东部'));
console.log('Progress ring:', old.includes('进度'));
console.log('Pipeline:', old.includes('Pipeline'));
console.log('Export buttons:', old.includes('导出'));
console.log('Filter tabs:', old.includes('KA'));
