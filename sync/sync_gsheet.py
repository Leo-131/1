#!/usr/bin/env python3
"""
Vercel 看板与 Google Sheet 双向同步脚本

功能：
- 读取 Google Sheet 数据
- 更新 GitHub outreach_data.json

使用方法：
1. 本地运行: python sync_gsheet.py
2. GitHub Actions 自动运行

环境变量：
- GITHUB_TOKEN: GitHub Personal Access Token
- GITHUB_OWNER: GitHub 用户名 (默认: Leo-131)
- GITHUB_REPO: GitHub 仓库名 (默认: 1)
- GITHUB_FILE_PATH: 文件路径 (默认: outreach_data.json)
- GOOGLE_CREDENTIALS: Google Service Account JSON (Base64 编码)
- SPREADSHEET_ID: Google Sheet ID
"""

import os
import json
import base64
import requests
from datetime import datetime
from typing import List, Dict, Optional

# ============ 配置 ============
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN', '')  # 从环境变量获取，或留空
GITHUB_OWNER = os.environ.get('GITHUB_OWNER', 'Leo-131')
GITHUB_REPO = os.environ.get('GITHUB_REPO', '1')
GITHUB_FILE_PATH = os.environ.get('GITHUB_FILE_PATH', 'outreach_data.json')
SPREADSHEET_ID = os.environ.get('SPREADSHEET_ID', '16p8XtvsdI_yesMVjhKfDWOp95JdAtEEvelOw5_NOQ64')

# Sheet 配置
SHEET_NAME = 'outreach_data'
DATA_START_ROW = 2

# 列映射
COLUMNS = {
    'id': 1,
    'name': 2,
    'company': 3,
    'role': 4,
    'category': 5,
    'ka_flag': 6,
    'priority': 7,
    'status': 8,
    'keyword_used': 9,
    'message': 10
}


# ============ GitHub API ============

def get_github_file() -> Optional[Dict]:
    """获取 GitHub 文件内容和 SHA"""
    url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{GITHUB_FILE_PATH}"
    headers = {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json'
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        # 解码 base64 内容
        content = base64.b64decode(data['content']).decode('utf-8')
        return {
            'content': json.loads(content),
            'sha': data['sha']
        }
    elif response.status_code == 404:
        print(f"文件不存在: {GITHUB_FILE_PATH}")
        return None
    else:
        print(f"获取 GitHub 文件失败: {response.status_code} - {response.text}")
        return None


def push_to_github(data: List[Dict], sha: Optional[str] = None) -> bool:
    """推送数据到 GitHub"""
    url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{GITHUB_FILE_PATH}"
    headers = {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    }
    
    # 编码内容
    content = json.dumps(data, ensure_ascii=False, indent=2)
    encoded_content = base64.b64encode(content.encode('utf-8')).decode('ascii')
    
    # 构建请求体
    body = {
        'message': f'Sync from Google Sheet - {datetime.now().isoformat()}',
        'content': encoded_content,
        'branch': 'main'
    }
    
    if sha:
        body['sha'] = sha
    
    response = requests.put(url, headers=headers, json=body)
    
    if response.status_code in [200, 201]:
        result = response.json()
        print(f"✓ GitHub 推送成功: {result['commit']['sha'][:7]}")
        return True
    else:
        print(f"✗ GitHub 推送失败: {response.status_code} - {response.text}")
        return False


# ============ Google Sheets API ============

def get_google_sheet_service():
    """获取 Google Sheets 服务（支持两种认证方式）"""
    # 方式1: Service Account (GitHub Actions)
    credentials_json = os.environ.get('GOOGLE_CREDENTIALS')
    if credentials_json:
        import google.auth
        from google.oauth2 import service_account
        
        credentials_b64 = base64.b64decode(credentials_json).decode('utf-8')
        credentials_dict = json.loads(credentials_b64)
        
        credentials = service_account.Credentials.from_service_account_info(
            credentials_dict,
            scopes=['https://www.googleapis.com/auth/spreadsheets']
        )
        
        from googleapiclient.discovery import build
        service = build('sheets', 'v4', credentials=credentials)
        return service.spreadsheets()
    
    # 方式2: 本地开发 - 使用 gspread
    try:
        import gspread
        from google.oauth2.service_account import Credentials
        
        scopes = ['https://www.googleapis.com/auth/spreadsheets']
        credentials = Credentials.from_service_account_info(
            json.loads(os.environ.get('GOOGLE_APPLICATION_CREDENTIALS', '{}')),
            scopes=scopes
        )
        gc = gspread.authorize(credentials)
        return gc
    except Exception as e:
        print(f"警告: 无法初始化 Google Sheets API: {e}")
        return None


def read_google_sheet_gspread(gc) -> List[Dict]:
    """使用 gspread 读取 Google Sheet"""
    try:
        spreadsheet = gc.open_by_key(SPREADSHEET_ID)
        sheet = spreadsheet.worksheet(SHEET_NAME)
        
        # 获取所有值
        values = sheet.get_all_values()
        
        if len(values) <= 1:
            print("Sheet 中没有数据")
            return []
        
        # 跳过表头，转换数据
        data = []
        for row in values[1:]:  # 跳过表头
            if len(row) >= 10 and (row[1] or row[2]):  # name 或 company 不为空
                item = {
                    'id': str(row[0]) if row[0] else '',
                    'name': str(row[1]) if row[1] else '',
                    'company': str(row[2]) if row[2] else '',
                    'role': str(row[3]) if row[3] else '',
                    'category': str(row[4]) if row[4] else '',
                    'ka_flag': row[5].lower() == 'true' if row[5] else False,
                    'priority': str(row[6]) if row[6] else '',
                    'status': str(row[7]) if row[7] else '',
                    'keyword_used': str(row[8]) if row[8] else '',
                    'message': str(row[9]) if row[9] else ''
                }
                data.append(item)
        
        return data
    except Exception as e:
        print(f"读取 Google Sheet 失败: {e}")
        return []


def read_google_sheet_api(service) -> List[Dict]:
    """使用 Google Sheets API 读取数据"""
    try:
        range_name = f'{SHEET_NAME}!A:J'
        result = service.values().get(
            spreadsheetId=SPREADSHEET_ID,
            range=range_name
        ).execute()
        
        values = result.get('values', [])
        
        if len(values) <= 1:
            print("Sheet 中没有数据")
            return []
        
        data = []
        for row in values[1:]:  # 跳过表头
            if len(row) >= 2 and (row[1] or row[2]):  # name 或 company 不为空
                item = {
                    'id': str(row[0]) if len(row) > 0 and row[0] else '',
                    'name': str(row[1]) if len(row) > 1 and row[1] else '',
                    'company': str(row[2]) if len(row) > 2 and row[2] else '',
                    'role': str(row[3]) if len(row) > 3 and row[3] else '',
                    'category': str(row[4]) if len(row) > 4 and row[4] else '',
                    'ka_flag': row[5].lower() == 'true' if len(row) > 5 and row[5] else False,
                    'priority': str(row[6]) if len(row) > 6 and row[6] else '',
                    'status': str(row[7]) if len(row) > 7 and row[7] else '',
                    'keyword_used': str(row[8]) if len(row) > 8 and row[8] else '',
                    'message': str(row[9]) if len(row) > 9 and row[9] else ''
                }
                data.append(item)
        
        return data
    except Exception as e:
        print(f"读取 Google Sheet 失败: {e}")
        return []


# ============ 同步逻辑 ============

def sync_sheet_to_github():
    """从 Google Sheet 同步到 GitHub"""
    print("=" * 50)
    print("开始同步: Google Sheet → GitHub")
    print("=" * 50)
    
    # 1. 获取 GitHub 当前数据
    github_file = get_github_file()
    github_data = github_file['content'] if github_file else []
    sha = github_file['sha'] if github_file else None
    
    print(f"GitHub 当前数据: {len(github_data)} 条")
    
    # 2. 读取 Google Sheet 数据
    gc = get_google_sheet_service()
    
    if gc:
        if hasattr(gc, 'values'):  # Google API Service
            sheet_data = read_google_sheet_api(gc)
        else:  # gspread
            sheet_data = read_google_sheet_gspread(gc)
    else:
        print("无法连接 Google Sheet，保留 GitHub 数据")
        return False
    
    print(f"Google Sheet 数据: {len(sheet_data)} 条")
    
    if len(sheet_data) == 0:
        print("Sheet 中没有新数据需要同步")
        return False
    
    # 3. 合并数据（Sheet 数据优先）
    merged_data = merge_data(github_data, sheet_data)
    print(f"合并后数据: {len(merged_data)} 条")
    
    # 4. 推送到 GitHub
    success = push_to_github(merged_data, sha)
    
    if success:
        print("\n✓ 同步完成!")
    
    return success


def merge_data(github_data: List[Dict], sheet_data: List[Dict]) -> List[Dict]:
    """合并 GitHub 和 Sheet 数据，Sheet 数据优先"""
    # 创建索引
    github_by_id = {item['id']: item for item in github_data if 'id' in item}
    sheet_by_id = {item['id']: item for item in sheet_data if 'id' in item and item['id']}
    
    # 合并
    all_ids = set(list(github_by_id.keys()) + list(sheet_by_id.keys()))
    merged = []
    
    for id in all_ids:
        sheet_item = sheet_by_id.get(id)
        github_item = github_by_id.get(id)
        
        if sheet_item:
            # Sheet 存在，使用 Sheet 数据
            merged.append(sheet_item)
        elif github_item:
            # 仅 GitHub 存在，保留
            merged.append(github_item)
    
    return merged


def sync_github_to_sheet():
    """从 GitHub 同步到 Google Sheet（如果需要）"""
    print("=" * 50)
    print("开始同步: GitHub → Google Sheet")
    print("=" * 50)
    
    # 1. 获取 GitHub 数据
    github_file = get_github_file()
    
    if not github_file:
        print("无法获取 GitHub 数据")
        return False
    
    github_data = github_file['content']
    print(f"GitHub 数据: {len(github_data)} 条")
    
    # 2. TODO: 实现写入 Google Sheet
    # 这需要 Google Cloud Service Account，请参考 README
    print("\n⚠️ GitHub → Sheet 同步需要 Google Cloud Service Account")
    print("   请使用 Apps Script 方案或配置 GOOGLE_CREDENTIALS")
    
    return False


# ============ 主程序 ============

def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description='同步 Google Sheet 和 GitHub 数据')
    parser.add_argument('--direction', '-d', choices=['to-github', 'to-sheet', 'bidirectional'],
                       default='to-github', help='同步方向')
    args = parser.parse_args()
    
    if args.direction == 'to-github':
        sync_sheet_to_github()
    elif args.direction == 'to-sheet':
        sync_github_to_sheet()
    else:
        # 双向同步
        sync_sheet_to_github()


if __name__ == '__main__':
    main()
