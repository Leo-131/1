import json, time, urllib.request, os, sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

PORT = os.environ.get("AUTH_GATEWAY_PORT", "19000")
FROM_TIME = str(int(time.time()) - 86400)
BASE_URL = f"http://localhost:{PORT}/proxy/prosearch/search"

def search(keyword):
    payload = json.dumps({"keyword": keyword, "from_time": int(FROM_TIME), "industry": "news"}).encode()
    req = urllib.request.Request(BASE_URL, data=payload,
        headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read())

# 今日最新：AI科技
r1 = search("OpenAI Google Anthropic AI 2026年3月24日 最新")
print("=== AI今日 ===")
print(json.dumps(r1.get("message",""), ensure_ascii=False)[:2000])

# 今日最新：国际
r2 = search("国际 头条 2026年3月24日 最新动态")
print("\n=== 国际今日 ===")
print(json.dumps(r2.get("message",""), ensure_ascii=False)[:2000])

# 今日最新：贸易战/供应链
r3 = search("中美 关税 贸易战 2026年3月 最新")
print("\n=== 贸易今日 ===")
print(json.dumps(r3.get("message",""), ensure_ascii=False)[:2000])

# 氦气/能源/大宗商品
r4 = search("霍尔木兹 能源 供应链 2026年3月")
print("\n=== 能源供应链 ===")
print(json.dumps(r4.get("message",""), ensure_ascii=False)[:2000])
