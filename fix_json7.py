import json

with open(r'C:\Users\23889\.qclaw\workspace\outreach_data.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix corrupted priority field values
content = content.replace('"priority": "最?"', '"priority": "最高"')
content = content.replace('"priority": ""', '"priority": "高"')

# Fix the truncated message for Hans Mueller
# The current text ends without proper closure
old_text = '''"message": "Hi Hans, Flextail is Top 1 on Amazon in ultralight outdoor electronics. We're expanding into the European market"
    }
  ]'''
new_text = '''"message": "Hi Hans, Flextail is Top 1 on Amazon in ultralight outdoor electronics. We're expanding into the European market. Looking for partners across EU. Open to a call?"
    }
  ]'''

content = content.replace(old_text, new_text)

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