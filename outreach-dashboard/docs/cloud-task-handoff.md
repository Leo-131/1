# 云端任务与跨电脑接续

本系统采用“GitHub 云端控制面 + 本地安全执行器”。队列、Runtime、执行证据、Dashboard、策略和任务租约通过 `vercel-main-sync` 分支共享；阿里邮箱、LinkedIn Sales Navigator 登录态和副 Chrome/CDP 9224 永不上传云端。

## 在另一台电脑接续

1. 从 GitHub 克隆或更新 `vercel-main-sync`，必须使用干净工作区；不要在 dirty worktree 上 rebase。
2. 安装依赖，并使用独立 user-data-dir 启动可见 Chrome/CDP 9224。不要启动或连接 9222。
3. 使用不含秘密的设备别名执行：`npm run cloud:run -- --device=office-laptop`。
4. 该命令先取得 50 分钟任务租约，再严格执行 `discover:daily` → `daily:execute` → `sync:github`。
5. 最终状态位于 `cloud-task-state.json`，Dashboard 镜像位于 `public/cloud-task-state.json`。另一台电脑更新分支后即可看到最新累计、缺口、执行证据和租约。

## 安全边界

- 云端不保存邮箱密码、LinkedIn cookie、浏览器 profile、API 密钥或会话数据。
- 同一时间只允许一个设备租约，避免两台电脑重复发送。
- 租约异常中断后 50 分钟自动失效；不删除或覆盖不属于本机的活跃租约。
- 只有 `sent_confirmed` / `submitted_confirmed` 计入进度。
- 云端可准备和同步任务，但实际发送必须在持有阿里邮箱和 Navigator 登录态的本地副浏览器完成。
