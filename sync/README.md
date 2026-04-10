# Vercel 看板与 Google Sheet 双向同步方案

## 📋 概述

本方案实现 GitHub 仓库 `Leo-131/1` 中的 `outreach_data.json` 与 Google Sheet 的双向同步。

### 数据结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| name | string | 客户姓名 |
| company | string | 公司名称 |
| role | string | 职位 |
| category | string | 分类 |
| ka_flag | boolean | KA客户标记 |
| priority | string | 优先级 |
| status | string | 状态 |
| keyword_used | string | 使用关键词 |
| message | string | 备注信息 |

---

## 🚀 快速开始

### 方案一：Apps Script（推荐，无需额外配置）

**优点**：在 Google Sheet 内直接运行，无需服务器

#### 步骤 1：打开 Apps Script 编辑器

1. 打开你的 Google Sheet
2. 点击 **扩展程序** → **Apps Script**
3. 将 `sync/google_apps_script.js` 的内容复制粘贴到编辑器中

#### 步骤 2：初始化表头

1. 在 Apps Script 编辑器中，点击函数下拉框
2. 选择 `setupSheetHeaders`
3. 点击 **运行**

#### 步骤 3：同步数据

1. 刷新 Google Sheet 页面
2. 会看到顶部出现 **🔄 同步设置** 菜单

| 功能 | 说明 |
|------|------|
| 📥 从 GitHub 同步到 Sheet | 将 GitHub 数据拉取到 Sheet |
| 📤 从 Sheet 同步到 GitHub | 将 Sheet 数据推送到 GitHub |
| 🔄 双向同步（推荐） | 智能合并，Sheet 优先 |
| ⚙️ 初始化表头 | 重新设置表头格式 |
| ⏰ 创建自动同步触发器 | 设置每10分钟自动同步 |
| 🗑️ 删除所有触发器 | 停止自动同步 |

#### 步骤 4：设置自动同步（可选）

1. 点击 **🔄 同步设置** → **⏰ 创建自动同步触发器**
2. 系统会自动每10分钟执行一次双向同步

---

### 方案二：GitHub Actions（自动化）

**优点**：无需手动操作，完全自动化

#### 步骤 1：配置 GitHub Secrets

在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加：

| Secret 名称 | 值 |
|------------|-----|
| `SPREADSHEET_ID` | `16p8XtvsdI_yesMVjhKfDWOp95JdAtEEvelOw5_NOQ64` |
| `GOOGLE_CREDENTIALS` | Google Service Account JSON（Base64编码）|

#### 步骤 2：启用 GitHub Actions

推送 `.github/workflows/sync_gsheet.yml` 到仓库后，Actions 会自动每10分钟运行。

#### 手动触发

1. 进入仓库 **Actions** 页面
2. 选择 **Sync Google Sheet ↔ GitHub**
3. 点击 **Run workflow**

---

### 方案三：Python 脚本（本地/服务器）

**适用场景**：本地开发测试或自有服务器

```bash
# 安装依赖
pip install requests google-api-python-client google-auth gspread

# 从 Sheet 同步到 GitHub
python sync/sync_gsheet.py --direction to-github

# 从 GitHub 同步到 Sheet
python sync/sync_gsheet.py --direction to-sheet
```

#### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `GITHUB_TOKEN` | （内置） | GitHub Personal Access Token |
| `GITHUB_OWNER` | `Leo-131` | GitHub 用户名 |
| `GITHUB_REPO` | `1` | 仓库名 |
| `GITHUB_FILE_PATH` | `outreach_data.json` | 文件路径 |
| `SPREADSHEET_ID` | （内置） | Google Sheet ID |
| `GOOGLE_CREDENTIALS` | - | Service Account JSON（Base64）|

---

## 🔧 高级配置

### 获取 Google Service Account（可选）

如需在 GitHub Actions 中使用 Python 脚本写入 Google Sheet：

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 **Google Sheets API**
4. 创建 **Service Account**
5. 下载 JSON 密钥文件
6. 与 Google Sheet 共享（添加 Service Account 邮箱为编辑者）
7. 将 JSON 内容 Base64 编码后存为 `GOOGLE_CREDENTIALS` Secret

```bash
# Base64 编码
base64 -i your-service-account.json | tr -d '\n'
```

### 自定义同步频率

修改 `.github/workflows/sync_gsheet.yml` 中的 cron 表达式：

```yaml
schedule:
  - cron: '*/10 * * * *'  # 每10分钟
  # - cron: '*/30 * * * *'  # 每30分钟
  # - cron: '0 */1 * * *'   # 每小时
```

### 自定义 GitHub Token

如果使用自己的 Token，替换 `sync_gsheet.py` 和 `google_apps_script.js` 中的默认 Token。

---

## ⚠️ 注意事项

1. **Apps Script 限制**：Google Apps Script 有每日调用配额限制
2. **GitHub Token 权限**：确保 Token 有 `repo` 权限
3. **Sheet 共享**：如果使用 Service Account，需与 Sheet 共享编辑权限
4. **数据冲突**：双向同步时，Sheet 数据会覆盖 GitHub 数据

---

## 📁 文件结构

```
Leo-131/1
├── sync/
│   ├── google_apps_script.js  # Apps Script 代码
│   ├── sync_gsheet.py         # Python 同步脚本
│   └── README.md              # 使用说明
├── .github/
│   └── workflows/
│       └── sync_gsheet.yml    # GitHub Actions 配置
└── outreach_data.json         # 数据文件
```

---

## 🔄 同步流程图

```
┌─────────────────┐
│   Google Sheet  │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Apps    │ ←─── 手动/定时触发
    │ Script  │
    └────┬────┘
         │ PUT /contents
         ▼
┌─────────────────┐
│   GitHub API    │
└────────┬────────┘
         │
    ┌────┴────┐
    │ GitHub  │ ←─── 每10分钟自动
    │ Actions │
    └────┬────┘
         │ Python Script
         ▼
┌─────────────────┐
│   Google Sheet  │ (需要 Service Account)
└─────────────────┘
```

---

## ❓ 常见问题

**Q: 同步失败怎么办？**
A: 检查 GitHub Token 是否有效，GitHub API 是否有访问权限

**Q: Sheet 中有数据但 GitHub 没有更新？**
A: 确认 Apps Script 已正确复制，且 GitHub Token 有写入权限

**Q: 如何停止自动同步？**
A: Apps Script：点击 🗑️ 删除所有触发器
   GitHub Actions：在 Actions 页面禁用 workflow

---

## 📞 支持

如有问题，请检查：
1. GitHub Token 是否有效
2. GitHub 仓库 `Leo-131/1` 是否可访问
3. Google Sheet 是否已分享
