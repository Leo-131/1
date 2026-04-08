#!/usr/bin/env python3
"""
社媒自动化工具 - LinkedIn/Facebook/Instagram 自动发消息
配合 AutoGLM browser-agent 使用
"""

import os
import json
import time
import csv
from datetime import datetime
from pathlib import Path

# 配置
CONFIG = {
    "linkedin": {
        "email": "252958044@qq.com",
        "password": "xd62961011",
        "login_url": "https://www.linkedin.com/login",
        "search_url": "https://www.linkedin.com/search/results/people/",
        "daily_limit": 100,
        "message_template": """Hi {name},

I noticed your work at {company} and wanted to connect. We at Flextail specialize in portable power solutions and outdoor gear.

Would love to discuss potential collaboration opportunities.

Best regards,
Flextail Team"""
    },
    "facebook": {
        "email": "252958044@qq.com",
        "password": "xd62961011",
        "login_url": "https://www.facebook.com/login",
        "daily_limit": 100,
        "message_template": """Hi {name}! 👋

I came across your profile and thought we might have some synergies. We're Flextail, a portable power brand looking to expand our network.

Would love to connect!"""
    },
    "instagram": {
        "email": "252958044@qq.com",
        "password": "xd62961011",
        "login_url": "https://www.instagram.com/accounts/login/",
        "daily_limit": 100,
        "message_template": """Hi {name}! 👋

Love your content! We're Flextail - a portable power brand for outdoor enthusiasts. Would love to explore collaboration opportunities!"""
    }
}

# 数据文件
DATA_DIR = Path(__file__).parent / "data"
CONTACTS_FILE = DATA_DIR / "contacts.csv"
SENT_LOG_FILE = DATA_DIR / "sent_log.json"

def ensure_data_dir():
    """确保数据目录存在"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

def load_contacts():
    """从 Google Sheet 或本地 CSV 加载联系人"""
    if CONTACTS_FILE.exists():
        with open(CONTACTS_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            return list(reader)
    return []

def load_sent_log():
    """加载已发送日志"""
    if SENT_LOG_FILE.exists():
        with open(SENT_LOG_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"linkedin": [], "facebook": [], "instagram": []}

def save_sent_log(log):
    """保存发送日志"""
    with open(SENT_LOG_FILE, 'w', encoding='utf-8') as f:
        json.dump(log, f, ensure_ascii=False, indent=2)

def get_pending_contacts(platform, contacts, sent_log):
    """获取待发送的联系人"""
    sent_ids = set(sent_log.get(platform, []))
    pending = []
    for c in contacts:
        contact_id = c.get('id') or c.get('name', '')
        if contact_id not in sent_ids:
            pending.append(c)
    return pending

def get_daily_count(platform, sent_log):
    """获取今日已发送数量"""
    today = datetime.now().strftime('%Y-%m-%d')
    count = 0
    for entry in sent_log.get(platform, []):
        if isinstance(entry, dict) and entry.get('date') == today:
            count += 1
    return count

def generate_browser_task(platform, contacts, batch_size=10):
    """
    生成浏览器自动化任务描述
    这个函数生成给 AutoGLM 的任务指令
    """
    config = CONFIG[platform]
    
    if platform == "linkedin":
        task = f"""
LinkedIn 自动发消息任务:

1. 打开 {config['login_url']}
2. 使用账号登录:
   - 邮箱: {config['email']}
   - 密码: {config['password']}
3. 登录后，搜索以下关键词的联系人并发送好友请求:
   - outdoor distributor
   - camping gear buyer
   - electronics distributor
4. 找到联系人后，发送个性化消息
5. 每次操作 {batch_size} 个联系人
6. 遇到验证码或需要人工确认时暂停

注意: 
- 每个联系人发送间隔 30-60 秒
- 遇到"每周邀请限制"提示时停止
- 记录已发送的联系人
"""
    elif platform == "facebook":
        task = f"""
Facebook 自动发消息任务:

1. 打开 {config['login_url']}
2. 使用账号登录:
   - 邮箱: {config['email']}
   - 密码: {config['password']}
3. 登录后，搜索户外/电子产品相关的群组
4. 加入群组后，向成员发送好友请求
5. 每次操作 {batch_size} 个联系人

注意:
- 避免被标记为垃圾信息
- 发送间隔 60-120 秒
"""
    elif platform == "instagram":
        task = f"""
Instagram 自动发消息任务:

1. 打开 {config['login_url']}
2. 使用账号登录:
   - 邮箱: {config['email']}
   - 密码: {config['password']}
3. 登录后，搜索户外/电子产品相关的话题标签
4. 关注相关用户并发送私信
5. 每次操作 {batch_size} 个联系人

注意:
- Instagram 有更严格的消息限制
- 发送间隔 90-180 秒
"""
    
    return task.strip()

def create_daily_report(platform, sent_count, failed_count=0):
    """生成每日报告"""
    report = {
        "platform": platform,
        "date": datetime.now().strftime('%Y-%m-%d'),
        "sent_count": sent_count,
        "failed_count": failed_count,
        "total_contacts": len(load_contacts()),
        "timestamp": datetime.now().isoformat()
    }
    
    report_file = DATA_DIR / f"report_{platform}_{report['date']}.json"
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    return report

def main():
    """主函数 - 打印配置信息"""
    ensure_data_dir()
    
    print("=" * 60)
    print("社媒自动化工具 - Flextail & Vollyc")
    print("=" * 60)
    print(f"\n配置信息:")
    for platform, cfg in CONFIG.items():
        print(f"\n{platform.upper()}:")
        print(f"  账号: {cfg['email']}")
        print(f"  每日限制: {cfg['daily_limit']} 条")
        print(f"  登录地址: {cfg['login_url']}")
    
    print("\n" + "=" * 60)
    print("使用方法:")
    print("1. 运行 python social_automation.py --task linkedin")
    print("2. 任务描述会输出到控制台")
    print("3. 将任务描述复制给 AutoGLM browser-agent 执行")
    print("=" * 60)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--task":
        platform = sys.argv[2] if len(sys.argv) > 2 else "linkedin"
        task = generate_browser_task(platform, [])
        print(task)
    else:
        main()
