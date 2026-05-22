# 2026-05-18 15:55 - 修复 setup_records.html 同步BUG

## 问题
- `setup_records.html` 点击"Sync Records to Dashboard"无实际效果
- 原因：旧版通过 `window.open()` 打开看板文件，再打印 localStorage 代码让用户手动粘贴到控制台——file:// 协议下跨页面无法访问 localStorage（同源策略）

## 修复
- 重写 `setup_records.html` 为真正的同步工具
- 核心逻辑：使用 Node.js `fs` 模块直接修改 `outreach_dashboard_v16.html` 中的 `STATIC_FB_RECORDS` 和 `STATIC_INS_RECORDS` 数组
- 新功能：
  1. 可视化表单添加 FB/IG 记录
  2. 一键 sync 直接写入 v16 HTML 文件
  3. 自动备份 v16（首次同步时）
  4. 同账号+同日期去重
  5. 未同步数据 localStorage 暂存（关闭不丢失）
  6. 顶部实时统计条
- 文件路径：`C:\Users\23889\.qclaw\workspace\setup_records.html`
