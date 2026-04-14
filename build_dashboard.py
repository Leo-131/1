import json, re, sys

# Read the reference HTML from browser evaluation output stored in a temp file
with open(sys.argv[1], 'r', encoding='utf-8') as f:
    content = f.read()

# Write to index.html
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Written {len(content)} bytes")
