const fs = require('fs');
const buf = fs.readFileSync('old_v030.html');
const old = buf.toString('utf16le');

// Extract all script content
const scriptMatches = old.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
if (scriptMatches) {
  console.log('Found', scriptMatches.length, 'script blocks');
  scriptMatches.forEach((m, i) => {
    console.log(`\n=== SCRIPT ${i} (${m.length} chars) ===`);
    console.log(m.substring(0, 500));
  });
}

// Also look for inline handlers
const inlineMatches = old.match(/onclick="[^"]+"/g);
if (inlineMatches) {
  console.log('\nAll onclick:', inlineMatches);
}
