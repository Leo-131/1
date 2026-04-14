import json

with open(r'C:\Users\23889\.qclaw\workspace\outreach_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

data['stats']['version'] = '12.0'
data['stats']['last_run'] = '2026-04-09 16:08:00'
data['stats']['today_sent'] = 0

changelog = {
    'version': '12.0',
    'date': '2026-04-09 16:08',
    'change': ('16:08定时更新(v12.0): today_sent=0. 画像:Tier1=3人(CEO/Owner/MD), Tier2=7人(VP/Director), '
              'Tier3=14人(含4现有客户), 非目标=1人(Ashley Morgan-RVDA协会). 接受率2.56%. today_sent=0需立即启动.')
}
data['changelog'].insert(0, changelog)

with open(r'C:\Users\23889\.qclaw\workspace\outreach_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Updated to v12.0')
