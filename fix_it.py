# -*- coding: utf-8 -*-
import re
with open('index.html', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Find applyQuickAdd
idx = content.find('function applyQuickAdd')
print(f'applyQuickAdd at: {idx}')
if idx > 0:
    print('Context:', repr(content[idx:idx+800]))

# Check what's at the very end
print('\nLast 500 chars:', repr(content[-500:]))

# Check if there's a </script> anywhere
print('\n</script> count:', content.count('</script>'))
print('\n</script> at:', content.rfind('</script>'))
