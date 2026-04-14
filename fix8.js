const fs = require('fs');
const path = 'C:\\Users\\23889\\.qclaw\\workspace\index.html';
let content = fs.readFileSync(path, 'utf8');

// The ending is: ...modal-box\r\n');</script>\r\n</body>\r\n</html>
// We need:   ...modal-box</div>');</script>\r\n</body>\r\n</html>

// Pattern: \r\n');</script>\r\n</body>
const oldPattern = '\r\n\');</script>\r\n</body>';
const newPattern = '</div>\');</script>\r\n</body>';

if (content.includes(oldPattern)) {
    content = content.replace(oldPattern, newPattern);
    fs.writeFileSync(path, content, 'utf8');
    const fixed = fs.readFileSync(path, 'utf8');
    console.log('Fixed! Size:', fixed.length);
    console.log('Last 300:', fixed.slice(-300));
    if (fixed.includes('</script>') && fixed.trim().endsWith('</html>')) {
        console.log('✅ File is now valid HTML!');
    }
} else {
    console.log('Not found. Showing last 200:');
    console.log(JSON.stringify(content.slice(-200)));
}
