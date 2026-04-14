@echo off
cd /d C:\Users\23889\.qclaw\workspace
echo 正在推送到GitHub...
git push origin main
if %ERRORLEVEL% EQU 0 (
    echo 推送成功！Vercel将自动部署
    timeout /t 30
) else (
    echo 推送失败，请检查GitHub认证
    pause
)
