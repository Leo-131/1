import urllib.request
import json
import os

PORT = os.environ.get("AUTH_GATEWAY_PORT", "19000")
base = f"http://localhost:{PORT}/proxy/prosearch/search"

queries = [
    {"keyword": "AI大模型 最新进展 2026年4月", "cnt": 5},
    {"keyword": "国际新闻 今日 2026年4月", "from_time": 1743530400, "industry": "news"},
    {"keyword": "关税 贸易政策 最新 2026年4月", "from_time": 1743530400, "industry": "news"},
]

headers_req = {"Content-Type": "application/json; charset=utf-8"}
results = []

for q in queries:
    data = json.dumps(q).encode("utf-8")
    req = urllib.request.Request(base, data=data, headers=headers_req, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            results.append({"query": q["keyword"], "success": True, "data": result})
    except Exception as e:
        results.append({"query": q["keyword"], "success": False, "error": str(e)})

out_path = r"C:\Users\23889\.qclaw\workspace\cn_search_results.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print(f"Done. Written to {out_path}")
