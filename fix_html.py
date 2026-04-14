# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8', errors='replace') as f:
    main = f.read()
with open('index_tail.html', 'r', encoding='utf-8', errors='replace') as f:
    tail = f.read()

# main ends with: overlay.innerHTML='<div class="modal-box
# tail starts with the continuation that fills the modal-box

# Find the bad ending in main
bad_marker = 'modal-box'
idx = main.rfind(bad_marker)
print('Found at index:', idx)
print('Ending context:', repr(main[idx-20:idx+50]))

# Build correct ending
# Replace the incomplete 'modal-box' at end of main with proper continuation
# The main file ends with: overlay.innerHTML='<div class="modal-box
# The tail starts with: </div><div style=...rest of modal content
correct_ending = main[:idx] + 'modal-box">' + tail

# Now add proper closing tags
# The tail ends with the JS function that was cut off
# We need to find where it properly ends and add </div></body></html>
# Actually let's check what the tail contains at the end

# Simple approach: main + '">' + tail + closing tags
result = main[:main.rfind("modal-box")+len("modal-box")] + '">' + tail

# Add proper closing if missing
if '</html>' not in result:
    result += '\n</body>\n</html>'

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(result)

print(f'Fixed size: {len(result)} bytes')
print('Has closing html:', '</html>' in result)
print('Has closing body:', '</body>' in result)
print('Last 100:', repr(result[-100:]))
