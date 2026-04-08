import json, time, urllib.request, urllib.parse, os, sys

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

PORT = os.environ.get("AUTH_GATEWAY_PORT", "19000")
FROM_TIME = str(int(time.time()) - 86400)
BASE_URL = f"http://localhost:{PORT}/proxy/prosearch/search"

def search(keyword):
    payload = json.dumps({"keyword": keyword, "from_time": int(FROM_TIME), "industry": "news"}).encode()
    req = urllib.request.Request(
        BASE_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read())

queries = [
    ("🤖 AI科技热点", "AI大模型最新进展 2026年3月24日"),
    ("🌍 国际实时热点", "国际热点新闻 今日 2026年3月24日"),
    ("📦 国际贸易要闻", "国际贸易 关税 供应链 今日 2026"),
]

results = {}
for tag, kw in queries:
    print(f"\n{'='*50}\n搜索中: {kw}\n{'='*50}")
    r = search(kw)
    results[tag] = r
    print(json.dumps(r, ensure_ascii=False)[:3000])

print("\n\n=== 完整原始结果 ===")
print(json.dumps(results, ensure_ascii=False, indent=2))
