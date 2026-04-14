const fs = require('fs');
const path = 'C:\\Users\\23889\\.qclaw\\workspace\\index.html';
let content = fs.readFileSync(path, 'utf8');

// The ending is: overlay.innerHTML='<div class="modal-box\r\n');</script>
// Fix: insert </div>'); before </script>
const oldEnding = '\r\n\');</script>';
const newEnding = '</div>\');</script>';

if (content.endsWith(oldEnding + '\r\n</html>')) {
    content = content.slice(0, -oldEnding.length) + newEnding + '\r\n</html>';
    fs.writeFileSync(path, content, 'utf8');
    const fixed = fs.readFileSync(path, 'utf8');
    console.log('Fixed! Size:', fixed.length);
    console.log('Last 200:', fixed.slice(-200));
    if (fixed.includes('</script>') && fixed.trim().endsWith('</html>')) {
        console.log('✅ File is now valid HTML!');
    }
} else {
    // Try without the \r
    const oldEnding2 = '\n\');</script>';
    const newEnding2 = '</div>\');</script>';
    if (content.includes(oldEnding2)) {
        content = content.replace(oldEnding2, newEnding2);
        fs.writeFileSync(path, content, 'utf8');
        const fixed = fs.readFileSync(path, 'utf8');
        console.log('Fixed (LF)! Size:', fixed.length);
        console.log('Last 200:', fixed.slice(-200));
    } else {
        console.log('Still not found. Last 80 repr:', JSON.stringify(content.slice(-80)));
    }
}
