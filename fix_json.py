import json

with open(r'C:\Users\23889\.qclaw\workspace\outreach_data.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the truncated message by completing it
old_msg = '"message": "Hi Hans, Flextail is Top 1 on Amazon in ultralight outdoor electronics. We\'re expanding into the European market"'
new_msg = '"message": "Hi Hans, Flextail is Top 1 on Amazon in ultralight outdoor electronics. We\'re expanding into the European market. Looking for partners across EU. Open to a call?"'

fixed = content.replace(old_msg, new_msg)

# Add the closing braces if missing
if not fixed.strip().endswith('}'):
    fixed = fixed.rstrip().rstrip(',') + '\n  }\n]}'

# Parse to verify
try:
    data = json.loads(fixed)
    print('JSON 修复成功!')
    print(f'Contacts: {len(data["contacts"])}')
    print(f'Stats: {data["stats"]}')
    
    # Write the fixed file
    with open(r'C:\Users\23889\.qclaw\workspace\outreach_data.json', 'w', encoding='utf-8') as f:
        f.write(fixed)
    print('已写入修复后的文件')
except json.JSONDecodeError as e:
    print(f'Error: {e}')