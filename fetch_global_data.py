# -*- coding: utf-8 -*-
import urllib.request, ssl, json, sys, re
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
proxy = urllib.request.ProxyHandler({'https': 'http://127.0.0.1:7897'})
opener = urllib.request.build_opener(urllib.request.HTTPSHandler(context=ctx), proxy)

def fetch(url):
    r = opener.open(url, timeout=25)
    return r.read().decode('utf-8', errors='ignore')

# 抓取 Dreame 全球官网
print('=== Dreame 追觅官网 ===')
html = fetch('https://www.dreame.tech/')
products = re.findall(r'(Robot Vacuum|Cordless Vacuum|Hair Dryer|Hair Styler|Steam Mop)', html, re.I)
print('产品线:', list(set(products))[:5])
sites = re.findall(r'https?://[a-z]+\.dreame\.com', html)
print('全球站点:', list(set(sites))[:5])

print()
print('=== JISULIFE 几素官网 ===')
html = fetch('https://www.jisulife.com/')
products = re.findall(r'(Handheld Fan|Desk Fan|Neck Fan|Humidifier|Hand Warmer)', html, re.I)
print('产品线:', list(set(products))[:5])

print()
print('=== EcoFlow 正浩官网 ===')
html = fetch('https://www.ecoflow.com/')
products = re.findall(r'(DELTA|RIVER|POWER KIT|WAVE|GLACIER)', html)
print('产品线:', list(set(products))[:5])

print()
print('=== BLUETTI 铂陆帝官网 ===')
html = fetch('https://www.bluetti.com/')
products = re.findall(r'(AC|EB|EP|BLUETTI)[\s\-]?[0-9]+', html)
print('产品线:', list(set(products))[:5])

print()
print('=== 抓取 Best Buy 数据 ===')
html = fetch('https://www.bestbuy.com/site/searchpage.jsp?st=Fanttik')
prices = re.findall(r'\$([0-9]+\.?[0-9]*)', html)
if prices:
    prices_float = [float(p) for p in prices if float(p) > 10]
    if prices_float:
        print(f'Best Buy Fanttik 价格: ${min(prices_float):.0f} - ${max(prices_float):.0f}')
