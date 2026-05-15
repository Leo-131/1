@echo off
REM Auto Outreach - Daily 100 Target
REM LinkedIn: 0/60 (limit full) -> FB: 15 + INS: 25

SET RELAY="C:\Users\23889\.agents\skills\autoglm-browser-agent\dist\relay.exe"
SET MCP="C:\Users\23889\.agents\skills\autoglm-browser-agent\dependency\mcporter.exe"
SET OUT="C:\Users\23889\.openclaw-autoclaw\mcp_output\last_screenshot.jpg"
SET SESSION="C:\Users\23889\.openclaw-autoclaw\session_pool.json"
SET LOG="C:\Users\23889\.qclaw\workspace\memory\2026-05-08.md"

echo [%date% %time%] === AUTO OUTREACH START === >> %LOG%

REM Step 1: FB - like & comment outdoor posts
echo [%date% %time%] Running FB task... >> %LOG%
%MCP% call autoglm-browser-agent.browser_subagent task="Like 5 outdoor/camping gear posts on Facebook. Comment on 2 of them: 'Great gear!' or 'Love this outdoor setup!'. Report what was liked and commented." start_url="https://www.facebook.com" auto_approve=true >> %LOG% 2>&1
echo [%date% %time%] FB done. >> %LOG%

REM Step 2: INS - send DMs
echo [%date% %time%] Running INS DM task... >> %LOG%
%MCP% call autoglm-browser-agent.browser_subagent task="Go to Instagram and send a DM introducing Flextail ultra-light outdoor gear to 3 outdoor/camping related accounts. Message: 'Hi! Great outdoor content! We're Flextail - ultra-light gear brand. Interested in collaboration?'" start_url="https://www.instagram.com/" auto_approve=true >> %LOG% 2>&1
echo [%date% %time%] INS done. >> %LOG%

echo [%date% %time%] === CYCLE COMPLETE === >> %LOG%
