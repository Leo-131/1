#!/usr/bin/env python3
"""
Flextail & Vollyc 客户开发看板 - 在线发布脚本
自动启动 HTTP 服务器 + Cloudflare Tunnel 穿透，
生成公网可访问 URL，复制给队友即可查看。
"""
import http.server
import socketserver
import threading
import time
import subprocess
import sys
import re
import os

PORT = 8765
HTML_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "outreach_dashboard.html")

def start_server():
    with open(HTML_FILE, encoding="utf-8") as f:
        pass
    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()

def get_tunnel_url():
    """尝试获取 Cloudflare Tunnel 公网 URL"""
    try:
        result = subprocess.run(
            ["C:\\Users\\23889\\.qclaw\\node\\cloudflared.exe",
             "tunnel", "--url", f"http://localhost:{PORT}",
             "--no-autoupdate", "--metrics", "localhost:53121"],
            capture_output=True, text=True, timeout=30,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform=="win32" else 0
        )
        output = result.stdout + result.stderr
        print("[Tunnel output]", output[:2000])
        # 提取 cloudflared分配的 URL
        match = re.search(r'https://[a-z0-9-]+\.trycloudflare\.com', output)
        if match:
            return match.group(0)
        match2 = re.search(r'https://[^\s"]+\.trycloudflare\.com', output)
        if match2:
            return match2.group(0)
        return None
    except FileNotFoundError:
        return None
    except Exception as e:
        print(f"[Tunnel error] {e}")
        return None

def try_cloudflared_ngrok():
    """依次尝试 cloudflared、ngrok"""
    tools = [
        ["C:\\Users\\23889\\.qclaw\\node\\cloudflared.exe", "--version"],
        ["ngrok", "version"],
    ]
    available = []
    for tool_cmd in tools:
        try:
            r = subprocess.run(tool_cmd, capture_output=True, timeout=5,
                             creationflags=subprocess.CREATE_NO_WINDOW if sys.platform=="win32" else 0)
            available.append(tool_cmd[0])
        except Exception:
            pass
    print(f"[INFO] Available tunnel tools: {available}")
    
    # 试 cloudflared
    try:
        result = subprocess.run(
            ["C:\\Users\\23889\\.qclaw\\node\\cloudflared.exe",
             "tunnel", "--url", f"http://localhost:{PORT}"],
            capture_output=True, text=True, timeout=25,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform=="win32" else 0
        )
        output = result.stdout + result.stderr
        match = re.search(r'https://[a-z0-9-]+\.trycloudflare\.com', output)
        if match:
            return match.group(0)
    except Exception as e:
        print(f"[cloudflared failed] {e}")
    
    return None

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Flextail & Vollyc 看板发布器")
    print("=" * 60)
    
    # 启动本地 HTTP 服务器
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    print(f"✅ 本地服务器已启动: http://localhost:{PORT}")
    
    # 尝试穿透
    public_url = try_cloudflared_ngrok()
    
    if public_url:
        print(f"\n🌐 公网地址（可复制到任意设备打开）:")
        print(f"   👉  {public_url}  👈")
        print(f"\n⏱️  URL 有效期约 6 小时，关闭本窗口后失效")
        print("    如需长期使用，建议部署到 Vercel / Netlify\n")
    else:
        print("\n⚠️  未检测到内网穿透工具（cloudflared / ngrok）")
        print(f"   本地访问: http://localhost:{PORT}")
        print("\n💡 解决方案：安装 cloudflared:")
        print("   winget install Cloudflare.cloudflared")
        print("   或访问 https://github.com/cloudflare/cloudflared/releases\n")
        print("   安装后重新运行本脚本即可获得公网 URL\n")
    
    print("按 Ctrl+C 停止服务器")
    try:
        while True:
            time.sleep(10)
    except KeyboardInterrupt:
        print("\n👋 已停止")
