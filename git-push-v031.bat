@echo off
chcp 65001 >nul
cd /d C:\Users\23889\.qclaw\workspace
echo ===================================
echo  Git Push 脚本 - 推送本地v0.3.1到GitHub
echo ===================================
echo.
echo 本地版本领先GitHub 3个commit:
echo   - v0.3.1: 强制推送修复
echo   - v0.3.0: 完整37人客户数据+10维统计
echo   - v0.2.1: 版本日志缩小可拖拽
echo.
echo GitHub线上当前版本: v0.2.0
echo.
echo 推送后Vercel将自动部署更新
echo ===================================
echo.

echo 检查Git状态...
git status --short

echo.
echo 准备推送... (如遇网络错误请重试)
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================
    echo  ✅ 推送成功！
    echo ===================================
    echo  Vercel将在30秒内自动重新部署
    echo  部署完成后访问: https://1-rnz9.vercel.app
    echo.
    timeout /t 30
) else (
    echo.
    echo ===================================
    echo  ❌ 推送失败
    echo ===================================
    echo  可能原因:
    echo   1. 网络连接问题
    echo   2. GitHub认证过期
    echo.
    echo  解决方案:
    echo   - 检查网络连接
    echo   - 在浏览器中登录GitHub
    echo   - 重新配置Git凭证: git config --global credential.helper manager
    echo.
    pause
)
