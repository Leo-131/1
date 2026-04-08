@echo off
echo === Git Push to GitHub ===
echo.
echo Repository: https://github.com/Leo-131/1
echo.
echo Please enter your GitHub credentials when prompted:
echo - Username: Leo-131
echo - Password: Use Personal Access Token (not password)
echo.
echo To create token: GitHub Settings ^> Developer Settings ^> Personal Access Tokens
echo.
pause
cd /d C:\Users\23889\.qclaw\workspace
git push -u origin main --force
echo.
echo Done!
pause
