import urllib.request
import urllib.parse
import json
import os

PORT = os.environ.get("AUTH_GATEWAY_PORT", "19000")
base = f"http://localhost:{PORT}/proxy/prosearch/search"

queries = [
    {"keyword": "AI大模型 最新进展 2026年4月", "cnt": 5},
    {"keyword": "国际新闻 今日 2026年4月", "from_time": 1743530400, "industry": "news"},
    {"keyword": "关税 贸易政策 最新 2026年4月", "from_time": 1743530400, "industry": "news"},
]

headers = {"Content-Type": "application/json; charset=utf-8"}

for q in queries:
    print(f"\n{'='*60}")
    print(f"QUERY: {q['keyword']}")
    print('='*60)
    data = json.dumps(q).encode("utf-8")
    req = urllib.request.Request(base, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            print(json.dumps(result, ensure_ascii=False, indent=2))
    except Exception as e:
        print(f"ERROR: {e}")
