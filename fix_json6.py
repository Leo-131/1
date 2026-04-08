import json

with open(r'C:\Users\23889\.qclaw\workspace\outreach_data.json', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix corrupted priorities and complete the JSON
fixed_lines = []

for i, line in enumerate(lines):
    # Fix corrupted priority field values - they show as "最?" or ""
    # Original values should be "最高", "高", "中", "低"
    line = line.replace('"priority": "最?"', '"priority": "最高"')
    line = line.replace('"priority": ""', '"priority": "高"')
    line = line.replace('priority": "?"', 'priority": "高"')
    line = line.replace('priority": "', 'priority": "高"')
    fixed_lines.append(line)

content = ''.join(fixed_lines)

# Now fix the truncated last contact
# Find where contact 37 starts and complete it
id_37_idx = content.find('"id": 37')

# The last line (165) ends with message field but no closing brace/curly
# Find the incomplete message and complete it
old_msg_ending = '"message": "Hi Hans, Flextail is Top 1 on Amazon in ultralight outdoor electronics. We\'re expanding into the European market"'
new_msg_ending = '"message": "Hi Hans, Flextail is Top 1 on Amazon in ultralight outdoor electronics. We\'re expanding into the European market. Looking for partners across EU. Open to a call?"'

content = content.replace(old_msg_ending, new_msg_ending)

# Now we need to add the closing braces for the contact, array, and object
# Find where we need to add them - after the message field closes
if not content.strip().endswith('}'):
    # The file ends with the message but no closing
    # Add proper closure
    content = content.rstrip().rstrip(',')
    if not content.endswith('"}'):
        # Need to add the closing quote and brace
        content = content + '"\n    }\n  ]\n}'

# Try parsing
try:
    data = json.loads(content)
    print('JSON 修复成功!')
    print('Contacts:', len(data['contacts']))
    print('Stats:', data['stats'])
    
    with open(r'C:\Users\23889\.qclaw\workspace\outreach_data.json', 'w', encoding='utf-8') as f:
        f.write(content)
    print('已保存')
except json.JSONDecodeError as e:
    print('Error:', e)
    # Show last 200 chars for debugging
    print('Last 200 chars:')
    print(repr(content[-200:]))