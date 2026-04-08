# -*- coding: utf-8 -*-
"""
搜索各品牌关键人物 - 使用ProSearch API + 直接抓取
"""
import urllib.request, ssl, re, json, time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# ProSearch API (本地)
def prosearch(query):
    try:
        data = json.dumps({"query": query, "count": 10}).encode()
        req = urllib.request.Request(
            'http://localhost:19000/proxy/prosearch/search',
            data=data,
            headers={'Content-Type': 'application/json'}
        )
        r = urllib.request.urlopen(req, timeout=20)
        return json.loads(r.read().decode('utf-8'))
    except Exception as e:
        return {"error": str(e)}

# 代理抓取
proxy = urllib.request.ProxyHandler({'http': 'http://127.0.0.1:7897', 'https': 'http://127.0.0.1:7897'})
opener = urllib.request.build_opener(proxy, urllib.request.HTTPSHandler(context=ctx))
opener.addheaders = [
    ('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'),
]

def fetch_proxy(url, timeout=15):
    try:
        r = opener.open(url, timeout=timeout)
        return r.read().decode('utf-8', errors='ignore')
    except Exception as e:
        return f"ERROR: {e}"

all_results = {}

brands = [
    ("Fanttik", "Fanttik tire inflator brand key people Business Development Sales Marketing"),
    ("JISULIFE", "JISULIFE fan brand key people Business Development Sales Marketing"),
    ("Dreame", "Dreame Technology robot vacuum brand Business Development Sales Director"),
    ("EcoFlow", "EcoFlow power station brand Business Development Channel Manager"),
    ("Anker", "Anker Innovations brand Business Development Channel Sales Distributor"),
    ("Flextail", "Flextail Gear outdoor brand Business Development Sales"),
    ("BLUETTI", "BLUETTI power station brand Business Development Sales"),
    ("Jackery", "Jackery power station brand Business Development Sales Director"),
]

for brand, query in brands:
    print(f"Searching {brand}...")
    res = prosearch(query)
    
    people = []
    if "results" in res:
        for item in res["results"]:
            title = item.get("title", "")
            url = item.get("url", "")
            snippet = item.get("description", item.get("snippet", ""))
            
            # 过滤LinkedIn个人页面
            if "linkedin.com/in/" in url:
                people.append({
                    "name": title.split(" - ")[0].strip(),
                    "title": title.split(" - ")[1].strip() if " - " in title else "",
                    "url": url,
                    "snippet": snippet[:200]
                })
            # 过滤其他社媒
            elif any(s in url for s in ["twitter.com", "x.com", "instagram.com", "facebook.com"]):
                people.append({
                    "name": title,
                    "platform": url.split("/")[2],
                    "url": url,
                    "snippet": snippet[:200]
                })
    
    all_results[brand] = {
        "query": query,
        "people": people,
        "raw_count": len(res.get("results", []))
    }
    print(f"  Found {len(people)} people profiles, {all_results[brand]['raw_count']} total results")
    time.sleep(1)

# 保存
with open(r'C:\Users\23889\.qclaw\workspace\key_people_prosearch.json', 'w', encoding='utf-8') as f:
    json.dump(all_results, f, ensure_ascii=False, indent=2)

# 打印摘要
print("\n=== SUMMARY ===")
for brand, data in all_results.items():
    print(f"\n{brand}: {len(data['people'])} profiles found")
    for p in data['people'][:5]:
        print(f"  - {p.get('name','')} | {p.get('title','')} | {p.get('url','')}")
