import json
import re

with open(r'C:\Users\23889\.qclaw\workspace\outreach_data.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the last complete contact (ends with }, but not the last one)
# Look for pattern: { ... "id": XX },\n    {
# The last incomplete contact starts with { "id": 37

# Find position after last complete contact object
# A complete contact ends with "}," or "}\n
last_brace = content.rfind('},')
print(f'Last }, position: {last_brace}')

# Let's reconstruct properly by finding where id 37 starts and removing it
# Then add a properly closed contact 37
id_37_start = content.find('"id": 37')
print(f'ID 37 starts at: {id_37_start}')

# Get everything up to but not including id 37
prefix = content[:id_37_start].rstrip().rstrip(',')
print(f'Prefix ends with: ...{prefix[-30:]}')

# Create proper contact 37
contact_37 = '''{
      "id": 37, "name": "Hans Mueller", "platform": "LinkedIn", "company": "Intersport", "role": "Head of Purchasing - Outdoor", "location": "Vienna, Austria", "status": "Pending", "date": "2026-04-02", "priority": "最高", "ka_flag": true, "category": "international", "keyword_used": "site:linkedin.com \"Intersport\" \"head of purchasing\" OR \"buyer\" outdoor Europe", "url": "https://www.linkedin.com/in/hansmueller-intersport/", "message": "Hi Hans, Flextail is Top 1 on Amazon in ultralight outdoor electronics. We're expanding into the European market. Looking for partners across EU. Open to a call?"
    }'''

# Reconstruct
fixed = prefix + '\n    ' + contact_37 + '\n  ]\n}'

# Verify
try:
    data = json.loads(fixed)
    print('✅ JSON 修复成功!')
    print(f'Contacts: {len(data["contacts"])}')
    print(f'Stats: {data["stats"]}')
    
    with open(r'C:\Users\23889\.qclaw\workspace\outreach_data.json', 'w', encoding='utf-8') as f:
        f.write(fixed)
    print('✅ 已保存')
except json.JSONDecodeError as e:
    print(f'Error: {e}')