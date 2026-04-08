$ErrorActionPreference = "Continue"
$PORT = "19000"
$TS = [int]((Get-Date -UFormat %s) - 86400)
$OUT = "$env:TEMP\qclaw_search_results.txt"

$Body = @{
    keyword = "AI大模型最新进展"
    from_time = $TS
    industry = "news"
} | ConvertTo-Json -Compress

$Encoded = [System.Text.Encoding]::UTF8.GetBytes($Body)
$Resp = Invoke-WebRequest -Uri "http://localhost:$PORT/proxy/prosearch/search" -Method POST -ContentType "application/json" -Body $Encoded -TimeoutSec 15 -UseBasicParsing
$Resp.Content | Out-File -FilePath "$env:TEMP\qclaw_ai.txt" -Encoding UTF8

$Body2 = @{
    keyword = "国际热点新闻今日"
    from_time = $TS
    industry = "news"
} | ConvertTo-Json -Compress
$Encoded2 = [System.Text.Encoding]::UTF8.GetBytes($Body2)
$Resp2 = Invoke-WebRequest -Uri "http://localhost:$PORT/proxy/prosearch/search" -Method POST -ContentType "application/json" -Body $Encoded2 -TimeoutSec 15 -UseBasicParsing
$Resp2.Content | Out-File -FilePath "$env:TEMP\qclaw_intl.txt" -Encoding UTF8

$Body3 = @{
    keyword = "国际贸易关税供应链"
    from_time = $TS
    industry = "news"
} | ConvertTo-Json -Compress
$Encoded3 = [System.Text.Encoding]::UTF8.GetBytes($Body3)
$Resp3 = Invoke-WebRequest -Uri "http://localhost:$PORT/proxy/prosearch/search" -Method POST -ContentType "application/json" -Body $Encoded3 -TimeoutSec 15 -UseBasicParsing
$Resp3.Content | Out-File -FilePath "$env:TEMP\qclaw_trade.txt" -Encoding UTF8

Write-Host "AI:" (Get-Item "$env:TEMP\qclaw_ai.txt").Length
Write-Host "INTL:" (Get-Item "$env:TEMP\qclaw_intl.txt").Length
Write-Host "TRADE:" (Get-Item "$env:TEMP\qclaw_trade.txt").Length
