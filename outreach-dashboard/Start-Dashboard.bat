@echo off
title Outreach Dashboard Launcher
echo ========================================
echo   Flextail Outreach Dashboard v17.6
echo ========================================
echo.

:: Find Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

:: Start the server with Node.js
start /b node "%~dp0server.js"

:: Wait for server
timeout /t 2 /nobreak >nul

:: Try Chrome app mode first
where chrome >nul 2>&1
if %errorlevel% equ 0 (
    start "" "chrome.exe" --app=http://localhost:8080/index.html --window-size=1400,900
) else (
    :: Fall back to default browser
    start http://localhost:8080/index.html
)

echo Dashboard is running at http://localhost:8080
echo Close this window to stop the server.
echo.
:loop
timeout /t 60 /nobreak >nul
goto loop
