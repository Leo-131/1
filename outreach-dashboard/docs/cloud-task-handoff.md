# 云端任务与跨电脑接续

本系统采用“GitHub 云端控制面 + 本地安全执行器”。队列、Runtime、执行证据、Dashboard、策略和任务租约通过 `vercel-main-sync` 分支共享；阿里邮箱、LinkedIn Sales Navigator 登录态和副 Chrome/CDP 9224 永不上传云端。

## 在另一台电脑接续

1. 打开 GitHub 仓库的 **Actions → FLEXTAIL Cloud Outreach Control → Run workflow**，选择 `claim`，填写不含秘密的设备别名，例如 `home-desktop`。GitHub 会串行登记 50 分钟租约。
2. 在目标电脑从 GitHub 克隆或更新 `vercel-main-sync`，必须使用干净工作区；不要在 dirty worktree 上 rebase。
3. 安装依赖，并使用独立 user-data-dir 启动可见 Chrome/CDP 9224。不要启动或连接 9222。
4. 使用同一个设备别名执行：`npm run cloud:run -- --device=home-desktop`。执行器只有确认云端租约属于本机后才会打开客户开发流程。
5. 命令严格执行 `discover:daily` → `daily:execute` → `sync:github`，完成后自动释放租约并把结果推回云端。
6. 最终状态位于 `cloud-task-state.json`，Dashboard 镜像位于 `public/cloud-task-state.json`。另一台电脑更新分支后即可看到最新累计、缺口、执行证据和租约。

如果某台电脑异常退出，租约会在 50 分钟后自动失效。也可在同一 GitHub Workflow 中选择 `release` 并填写原设备别名；系统不会允许其他设备释放仍有效的租约。

## 安全边界

- 云端不保存邮箱密码、LinkedIn cookie、浏览器 profile、API 密钥或会话数据。
- 同一时间只允许一个设备租约，避免两台电脑重复发送。
- GitHub Workflow 使用串行并发组和普通非强制推送；发生并发更新时安全失败，不覆盖新状态。
- 租约异常中断后 50 分钟自动失效；不删除或覆盖不属于本机的活跃租约。
- 只有 `sent_confirmed` / `submitted_confirmed` 计入进度。
- 云端可准备和同步任务，但实际发送必须在持有阿里邮箱和 Navigator 登录态的本地副浏览器完成。

## 云端与本地的职责

- GitHub 云端：保存任务真值、累计进度、租约、策略与证据镜像；工作日上海时间 08:30 自动刷新任务状态，也支持手动领取和释放。
- 本地副浏览器执行器：完成阿里邮箱、LinkedIn、Facebook、Instagram 的可见操作与发送确认。
- 任何电脑都能接续，但每台电脑需独立登录对应账号；登录 cookie、密码和 Chrome profile 不会通过 GitHub 同步。
