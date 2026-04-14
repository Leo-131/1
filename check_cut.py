# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8', errors='replace') as f:
    main = f.read()
with open('index_tail.html', 'r', encoding='utf-8', errors='replace') as f:
    tail = f.read()

print(f'Main: {len(main)} bytes')
print(f'Tail: {len(tail)} bytes')

# Tail starts with remaining customers + JS + closing
# Main ends mid-string at "modal-box"
# Need to find where to splice

# The main file ends with: overlay.innerHTML='<div class="modal-box
# We need to replace that with: overlay.innerHTML='<div class="modal-box">' + tail
cut = "modal-box"
idx = main.rfind(cut)
print(f'modal-box at: {idx}')
print(f'Main ending: {repr(main[idx-30:idx+30])}')

# Build result
result = main[:idx] + "modal-box'>" + tail
result += '\n</body>\n</html>'

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(result)

print(f'Result: {len(result)} bytes')
print(f'Closing tags: </body> in result = {"</body>" in result}')
print(f'Last 100: {repr(result[-100:])}')
