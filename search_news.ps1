$PORT = if ($env:AUTH_GATEWAY_PORT) { $env:AUTH_GATEWAY_PORT } else { "19000" }
Write-Host "[QClaw] PORT: $PORT"

$ts = python -c "import time; print(int(time.time()))"
$FROM_TIME = [int]$ts - 86400
Write-Host "[QClaw] FROM_TIME: $FROM_TIME"

$body1 = @{"keyword"="AI大模型最新进展"; "from_time"=$FROM_TIME; "industry"="news"} | ConvertTo-Json -Compress
$r1 = curl.exe -s -X POST "http://localhost:$PORT/proxy/prosearch/search" -H "Content-Type: application/json" -d $body1
Write-Host "=== AI科技 ==="
Write-Host $r1

$body2 = @{"keyword"="国际热点新闻今日"; "from_time"=$FROM_TIME; "industry"="news"} | ConvertTo-Json -Compress
$r2 = curl.exe -s -X POST "http://localhost:$PORT/proxy/prosearch/search" -H "Content-Type: application/json" -d $body2
Write-Host "=== 国际热点 ==="
Write-Host $r2

$body3 = @{"keyword"="国际贸易关税供应链"; "from_time"=$FROM_TIME; "industry"="news"} | ConvertTo-Json -Compress
$r3 = curl.exe -s -X POST "http://localhost:$PORT/proxy/prosearch/search" -H "Content-Type: application/json" -d $body3
Write-Host "=== 国际贸易 ==="
Write-Host $r3
