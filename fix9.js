const fs = require('fs');
const path = "C:\\Users\\23889\\.qclaw\\workspace\\index.html";
let content = fs.readFileSync(path, 'utf8');

// The ending is: ...modal-box\r\n');</script>\r\n</body>\r\n</html>
// We need:   ...modal-box</div>');</script>\r\n</body>\r\n</html>

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
    // Try other variants
    const patterns = [
        '\n\');</script>\n</body>',
        '\r\n\');</script>\n</body>',
        '\n\');</script>\r\n</body>',
        "modal-box\\r\\n');</script>",
    ];
    for (const p of patterns) {
        if (content.includes(p)) {
            console.log('Found pattern:', JSON.stringify(p));
            const newP = p.replace('modal-box', 'modal-box</div>');
            content = content.replace(p, newP);
            fs.writeFileSync(path, content, 'utf8');
            const fixed = fs.readFileSync(path, 'utf8');
            console.log('Fixed! Size:', fixed.length);
            console.log('Last 300:', fixed.slice(-300));
            break;
        }
    }
    console.log('None of the patterns matched. Last 200:');
    console.log(JSON.stringify(content.slice(-200)));
}
