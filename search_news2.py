import subprocess, json, time, os

PORT = os.environ.get('AUTH_GATEWAY_PORT', '19000')
FROM_TIME = int(time.time()) - 86400

keywords = [
    ("AI大模型最新进展", "ai"),
    ("国际热点新闻今日", "intl"),
    ("国际贸易关税供应链", "trade"),
]

results = {}

for kw, tag in keywords:
    body = json.dumps({"keyword": kw, "from_time": FROM_TIME, "industry": "news"})
    cmd = ["curl", "-s", "-X", "POST",
           f"http://localhost:{PORT}/proxy/prosearch/search",
           "-H", "Content-Type: application/json",
           "-d", body]
    r = subprocess.run(cmd, capture_output=True)
    try:
        data = json.loads(r.stdout)
        results[tag] = data.get("message", "")
    except:
        results[tag] = ""

# Print just the messages, prefixed by tag
for tag, msg in results.items():
    print(f"\n===== {tag} =====")
    print(msg)
