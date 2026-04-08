import json, time, urllib.request, os, sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

PORT = os.environ.get("AUTH_GATEWAY_PORT", "19000")
FROM_TIME = str(int(time.time()) - 86400)
BASE_URL = f"http://localhost:{PORT}/proxy/prosearch/search"

def search(keyword):
    payload = json.dumps({"keyword": keyword, "from_time": int(FROM_TIME)}).encode()
    req = urllib.request.Request(BASE_URL, data=payload,
        headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read())

# 今日2026年3月25日最新
queries = [
    ("AI科技", "今日AI最新新闻 2026年3月"),
    ("国际", "今日国际要闻 2026年3月25日"),
    ("关税贸易", "中美关税最新 2026年3月"),
    ("供应链", "全球供应链 芯片 能源 最新"),
]

for cat, kw in queries:
    r = search(kw)
    msg = r.get("message", "")
    print(f"\n=== {cat} ===")
    print(msg[:1500])