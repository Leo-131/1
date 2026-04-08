import json

with open(r'C:\Users\23889\.qclaw\workspace\outreach_data.json', 'r', encoding='utf-8') as f:
    content = f.read()

# The last complete contact ends at position where we have "},\n    {\n      \"id\": 37"
# Position 26016 is the } before the last {
# So we want everything up to position 26017 (the comma after })
prefix = content[:26017]

# Now add properly formatted contact 37
contact_37 = '''{
      "id": 37, "name": "Hans Mueller", "platform": "LinkedIn", "company": "Intersport", "role": "Head of Purchasing - Outdoor", "location": "Vienna, Austria", "status": "Pending", "date": "2026-04-02", "priority": "最高", "ka_flag": true, "category": "international", "keyword_used": "site:linkedin.com \\"Intersport\\" \\"head of purchasing\\" OR \\"buyer\\" outdoor Europe", "url": "https://www.linkedin.com/in/hansmueller-intersport/", "message": "Hi Hans, Flextail is Top 1 on Amazon in ultralight outdoor electronics. We're expanding into the European market. Looking for partners across EU. Open to a call?"
    }'''

# Reconstruct - remove the trailing }, and add our new contact
prefix = prefix.rstrip().rstrip(',').rstrip('}').rstrip(',')

fixed = prefix + '\n    ,' + contact_37 + '\n  ]\n}'

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