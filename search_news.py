import subprocess
import json
import time
import os

PORT = os.environ.get("AUTH_GATEWAY_PORT", "19000")
FROM_TIME = int(time.time()) - 86400

print(f"[QClaw] PORT: {PORT}")
print(f"[QClaw] FROM_TIME: {FROM_TIME}")

def search(keyword, label):
    body = json.dumps({"keyword": keyword, "from_time": FROM_TIME, "industry": "news"})
    cmd = ["curl", "-s", "-X", "POST",
           f"http://localhost:{PORT}/proxy/prosearch/search",
           "-H", "Content-Type: application/json",
           "-d", body]
    print(f"\n=== {label} ===")
    result = subprocess.run(cmd, capture_output=True)
    try:
        data = json.loads(result.stdout)
        msg = data.get("message", "")
        if msg:
            print(msg)
        else:
            print(json.dumps(data, ensure_ascii=False, indent=2))
    except Exception as e:
        print(f"Error: {e}")
        print(result.stdout[:2000])

search("AI大模型最新进展", "AI科技热点")
search("国际热点新闻今日", "国际实时热点")
search("国际贸易关税供应链", "国际贸易要闻")
