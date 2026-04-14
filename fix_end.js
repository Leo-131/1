// Fix the truncated HTML file - append the missing closing tags
const fs = require('fs');
const path = 'C:\\Users\\23889\\.qclaw\\workspace\\index.html';

let content = fs.readFileSync(path, 'utf8');

// Remove any trailing garbage after the last complete statement
// Find the position where </div>';var existing=document.querySelector starts
const marker = "</div>';var existing=document.querySelector";
const pos = content.lastIndexOf(marker);

// Check if we already have proper closing tags
if (content.trim().endsWith('</body>\n</html>')) {
    // Already has closing tags - check if script is closed
    const lastScriptOpen = content.lastIndexOf('<script>');
    const lastScriptClose = content.lastIndexOf('</script>');
    
    if (lastScriptClose < lastScriptOpen || lastScriptClose === -1) {
        // Script not closed - need to close it
        if (content.trim().endsWith('</body>\n</html>')) {
            // Extract content before </body> and add </script></body></html>
            const bodyEnd = content.lastIndexOf('</body>');
            const beforeBody = content.substring(0, bodyEnd);
            fs.writeFileSync(path, beforeBody + '</script>\n</body>\n</html>', 'utf8');
            const fixed = fs.readFileSync(path, 'utf8');
            console.log('Fixed! Size:', fixed.length, 'Last 100:', fixed.substring(fixed.length - 100));
        }
    } else {
        console.log('File already has </script></body></html>. Size:', content.length);
    }
} else {
    // No closing tags - append them
    fs.appendFileSync(path, "';</script>\n</body>\n</html>", 'utf8');
    const fixed = fs.readFileSync(path, 'utf8');
    console.log('Appended! Size:', fixed.length, 'Last 200:', fixed.substring(fixed.length - 200));
}
