import json
import re

with open(r'C:\Users\23889\.qclaw\workspace\outreach_data.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix corrupted priority field values
content = content.replace('"priority": "最?"', '"priority": "最高"')
content = content.replace('priority": "最"', 'priority": "最高"')

# Find where the truncated message ends and add closure
# The message ends with "We're expanding into the European market
# We need to: 1) close the message string, 2) close the contact object, 3) close array, 4) close root

# Add proper closure to the incomplete message/contact
truncated_ending = '"message": "Hi Hans, Flextail is Top 1 on Amazon in ultralight outdoor electronics. We\'re expanding into the European market'
proper_ending = '''"message": "Hi Hans, Flextail is Top 1 on Amazon in ultralight outdoor electronics. We're expanding into the European market. Looking for partners across EU. Open to a call?"
    }
  ]}'''

content = content.replace(truncated_ending, proper_ending)

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
    # Try with json5 or more lenient parsing
    print('Trying alternative approach...')
    
    # Alternative: manually fix
    # Find last contact and complete it properly
    lines = content.split('\n')
    
    # Look for the last contact starting with "id": 37
    for i in range(len(lines)-1, -1, -1):
        if '"id": 37' in lines[i]:
            print('Found id 37 at line', i+1)
            # This is the start of contact 37, we need to rebuild it
            break