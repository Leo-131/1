# -*- coding: utf-8 -*-
"""
搜索各品牌关键人物社媒联系方式
策略：Google搜索 + 品牌官网 + LinkedIn公开页面
"""
import urllib.request, ssl, re, json, time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

proxy = urllib.request.ProxyHandler({'http': 'http://127.0.0.1:7897', 'https': 'http://127.0.0.1:7897'})
opener = urllib.request.build_opener(proxy, urllib.request.HTTPSHandler(context=ctx))
opener.addheaders = [
    ('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'),
    ('Accept-Language', 'en-US,en;q=0.9'),
]

def fetch(url, timeout=15):
    try:
        r = opener.open(url, timeout=timeout)
        return r.read().decode('utf-8', errors='ignore')
    except Exception as e:
        return f"ERROR: {e}"

def google_search(query):
    url = f"https://www.google.com/search?q={urllib.request.quote(query)}&num=10"
    html = fetch(url)
    # 提取搜索结果标题和链接
    results = []
    # 提取可见文本片段
    text = re.sub(r'<[^>]+>', ' ', html)
    text = re.sub(r'\s+', ' ', text)
    # 找LinkedIn链接
    li_links = re.findall(r'linkedin\.com/in/[a-zA-Z0-9\-]+', html)
    li_links = list(set(li_links))[:10]
    return text[:3000], li_links

results = {}

# ── 1. Fanttik 关键人物 ──
print("=" * 60)
print("搜索 Fanttik 关键人物...")
text, links = google_search('Fanttik site:linkedin.com "Business Development" OR "Sales" OR "Marketing Manager"')
results['Fanttik_LinkedIn'] = {'text': text[:1500], 'links': links}
print(f"  LinkedIn链接: {links}")
time.sleep(2)

text2, links2 = google_search('Fanttik 范泰克 "负责人" OR "总监" OR "经理" site:linkedin.com OR site:weibo.com')
results['Fanttik_CN'] = {'text': text2[:1500], 'links': links2}
print(f"  中文社媒链接: {links2}")
time.sleep(2)

# ── 2. JISULIFE 关键人物 ──
print("搜索 JISULIFE 关键人物...")
text3, links3 = google_search('JISULIFE site:linkedin.com "Business Development" OR "Sales" OR "Marketing"')
results['JISULIFE_LinkedIn'] = {'text': text3[:1500], 'links': links3}
print(f"  LinkedIn链接: {links3}")
time.sleep(2)

# ── 3. Dreame 关键人物 ──
print("搜索 Dreame 追觅关键人物...")
text4, links4 = google_search('Dreame Technology site:linkedin.com "Business Development" OR "Sales Director" OR "Marketing Director"')
results['Dreame_LinkedIn'] = {'text': text4[:1500], 'links': links4}
print(f"  LinkedIn链接: {links4}")
time.sleep(2)

# ── 4. EcoFlow 关键人物 ──
print("搜索 EcoFlow 关键人物...")
text5, links5 = google_search('EcoFlow site:linkedin.com "Business Development" OR "Sales Director" OR "Channel Manager"')
results['EcoFlow_LinkedIn'] = {'text': text5[:1500], 'links': links5}
print(f"  LinkedIn链接: {links5}")
time.sleep(2)

# ── 5. Anker 关键人物 ──
print("搜索 Anker 关键人物...")
text6, links6 = google_search('Anker Innovations site:linkedin.com "Business Development" OR "Channel Sales" OR "Distributor"')
results['Anker_LinkedIn'] = {'text': text6[:1500], 'links': links6}
print(f"  LinkedIn链接: {links6}")
time.sleep(2)

# ── 6. Flextail 关键人物 ──
print("搜索 Flextail 关键人物...")
text7, links7 = google_search('Flextail Gear site:linkedin.com OR "flextail" "Business Development" OR "Sales"')
results['Flextail_LinkedIn'] = {'text': text7[:1500], 'links': links7}
print(f"  LinkedIn链接: {links7}")
time.sleep(2)

# 保存结果
with open(r'C:\Users\23889\.qclaw\workspace\key_people_raw.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("\n✅ 搜索完成，结果已保存")
print(json.dumps({k: v['links'] for k, v in results.items()}, ensure_ascii=False, indent=2))
