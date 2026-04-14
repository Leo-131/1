const fs = require('fs');
const buf = fs.readFileSync('old_v030.html');
const old = buf.toString('utf16le');
// Find the full script
const s = old.indexOf('<script>');
const e = old.lastIndexOf('</script>');
if (s >= 0 && e > s) {
  const script = old.substring(s + 8, e);
  fs.writeFileSync('old_script.js', script);
  console.log('Script size:', script.length);
  console.log('Script:\n' + script);
}
