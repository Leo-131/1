import json

with open(r'C:\Users\23889\.qclaw\workspace\outreach_data.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Find id 36
id_36_start = content.find('"id": 36')
id_37_start = content.find('"id": 37')

# Get everything up to id 36's closing brace (which should include id 36 properly)
# Find the } that closes id 36 - it's after "Best Buy placement?"
# Let's find the pattern after contact 36 ends
contact_36_end = content.find('"id": 37')
prefix = content[:contact_36_end]

# Make sure prefix ends properly (remove trailing comma if any)
if prefix.rstrip().endswith(','):
    prefix = prefix.rstrip()[:-1]

# Now create proper contact 37
contact_37 = '''{
      "id": 37, "name": "Hans Mueller", "platform": "LinkedIn", "company": "Intersport", "role": "Head of Purchasing - Outdoor", "location": "Vienna, Austria", "status": "Pending", "date": "2026-04-02", "priority": "最高", "ka_flag": true, "category": "international", "keyword_used": "site:linkedin.com \\"Intersport\\" \\"head of purchasing\\" OR \\"buyer\\" outdoor Europe", "url": "https://www.linkedin.com/in/hansmueller-intersport/", "message": "Hi Hans, Flextail is Top 1 on Amazon in ultralight outdoor electronics. We're expanding into the European market. Looking for partners across EU. Open to a call?"
    }'''

# Reconstruct - add proper comma and closing
fixed = prefix.rstrip().rstrip(',') + '\n    ,' + contact_37 + '\n  ]\n}'

try:
    data = json.loads(fixed)
    print('JSON 修复成功!')
    print('Contacts:', len(data['contacts']))
    print('Stats:', data['stats'])
    
    with open(r'C:\Users\23889\.qclaw\workspace\outreach_data.json', 'w', encoding='utf-8') as f:
        f.write(fixed)
    print('已保存')
except json.JSONDecodeError as e:
    print('Error:', e)
    # Debug: show what we built
    print('---')
    print('Last 100 chars:', fixed[-100:])