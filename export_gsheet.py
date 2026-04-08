import json

# 读取 JSON 数据
with open('outreach_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 导出 contacts 为 CSV
contacts = data.get('contacts', [])
if contacts:
    headers = list(contacts[0].keys())
    csv_lines = [','.join(headers)]
    for c in contacts:
        row = [str(c.get(h, '')).replace(',', ';') for h in headers]
        csv_lines.append(','.join(row))
    
    with open('contacts_export.csv', 'w', encoding='utf-8') as f:
        f.write('\n'.join(csv_lines))
    print('Contacts exported: contacts_export.csv')

# 导出 stats 为单独 CSV
stats = data.get('stats', {})
if stats:
    stats_lines = ['key,value']
    for k, v in stats.items():
        stats_lines.append(f'{k},{v}'.replace(',', ';'))
    
    with open('stats_export.csv', 'w', encoding='utf-8') as f:
        f.write('\n'.join(stats_lines))
    print('Stats exported: stats_export.csv')

# 导出 keyword_performance
kw_data = data.get('keyword_performance', {})
if kw_data:
    kw_lines = ['keyword,score,sent,label,platform']
    for k, v in kw_data.items():
        kw_lines.append(f'{k},{v.get("score","")},{v.get("sent","")},{v.get("label","")},{v.get("platform","")}'.replace(',', ';'))
    
    with open('keyword_export.csv', 'w', encoding='utf-8') as f:
        f.write('\n'.join(kw_lines))
    print('Keywords exported: keyword_export.csv')

# 导出 optimization_log
logs = data.get('optimization_log', [])
if logs:
    log_lines = ['version,date,change']
    for l in logs:
        log_lines.append(f'{l.get("version","")},{l.get("date","")},{l.get("change","")}'.replace(',', ';'))
    
    with open('log_export.csv', 'w', encoding='utf-8') as f:
        f.write('\n'.join(log_lines))
    print('Logs exported: log_export.csv')

print('\n✅ All data exported!')