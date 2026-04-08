import urllib.request
import urllib.parse
import json
import os
import sys

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

PORT = os.environ.get("AUTH_GATEWAY_PORT", "19000")
base = f"http://localhost:{PORT}/proxy/prosearch/search"

queries = [
    {"keyword": "AI大模型 最新进展 2026年4月", "cnt": 5},
    {"keyword": "国际新闻 今日 2026年4月", "from_time": 1743530400, "industry": "news"},
    {"keyword": "关税 贸易政策 最新 2026年4月", "from_time": 1743530400, "industry": "news"},
]

headers_req = {"Content-Type": "application/json; charset=utf-8"}

for q in queries:
    print(f"\n{'='*60}")
    print(f"QUERY: {q['keyword']}")
    print('='*60)
    data = json.dumps(q).encode("utf-8")
    req = urllib.request.Request(base, data=data, headers=headers_req, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            # Save to file instead of printing to avoid encoding issues
            print("SUCCESS - see result file")
    except Exception as e:
        print(f"ERROR: {e}")
