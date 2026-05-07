@echo off
cd /d "%~dp0"
echo Starting Outreach Dashboard...
echo.
echo If Python is available:
python -m http.server 8080
goto :end

:python_fallback
echo Trying Node.js http-server...
node -e "const http=require('http'),fs=require('fs'),p=8080; http.createServer((req,res)=>{const f='.'+req.url.split('?')[0];try{const c=fs.readFileSync(f);const t=f.endsWith('.json')?'application/json':'text/html';res.writeHead(200,{'Content-Type':t});res.end(c);}catch(e){res.writeHead(404);res.end('Not Found');}}).listen(p,()=>console.log('Dashboard: http://localhost:'+p));"
goto :end

:end
pause
