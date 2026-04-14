# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8', errors='replace') as f:
    html = f.read()

print(f'Current size: {len(html)} bytes')

# Find the cut point
cut_idx = html.rfind('modal-box')
print(f'modal-box at: {cut_idx}')
print(f'Around cut: {repr(html[cut_idx-30:cut_idx+80])}')

# The file ends with: overlay.innerHTML='<div class="modal-box\n</body>\n</html>'
# We need to properly close the JS and add the missing closing
# Check what's at the very end
print(f'Last 300: {repr(html[-300:])}')

# Check for closing tags
print(f'</script> count: {html.count("</script>")}')
print(f'</body> count: {html.count("</body>")}')
print(f'</html> count: {html.count("</html>")}')

# Find quickAddAll function
qai_idx = html.find('quickAddAll')
print(f'quickAddAll at: {qai_idx}')
if qai_idx > 0:
    print(f'Context: {repr(html[qai_idx:qai_idx+200])}')
