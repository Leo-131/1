# 获取PORT和FROM_TIME
$PORT = if ($env:AUTH_GATEWAY_PORT) { $env:AUTH_GATEWAY_PORT } else { "19000" }
Write-Host "PORT: $PORT"

$ft = python -c "import time; print(int(time.time()) - 86400)"
Write-Host "FROM_TIME: $ft"

$body1 = @{
    keyword = "AI大模型最新进展 2026年3月24日"
    from_time = [int]$ft
    industry = "news"
} | ConvertTo-Json -Compress

$r1 = curl.exe -s -X POST "http://localhost:$PORT/proxy/prosearch/search" -H "Content-Type: application/json" -d $body1
Write-Host "=== AI科技 ==="
Write-Host $r1

$body2 = @{
    keyword = "国际热点新闻 今日 2026年3月24日"
    from_time = [int]$ft
    industry = "news"
} | ConvertTo-Json -Compress

$r2 = curl.exe -s -X POST "http://localhost:$PORT/proxy/prosearch/search" -H "Content-Type: application/json" -d $body2
Write-Host "=== 国际热点 ==="
Write-Host $r2

$body3 = @{
    keyword = "国际贸易 关税 供应链 今日 2026"
    from_time = [int]$ft
    industry = "news"
} | ConvertTo-Json -Compress

$r3 = curl.exe -s -X POST "http://localhost:$PORT/proxy/prosearch/search" -H "Content-Type: application/json" -d $body3
Write-Host "=== 国际贸易 ==="
Write-Host $r3
