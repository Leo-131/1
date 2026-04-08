$PORT = if ($env:AUTH_GATEWAY_PORT) { $env:AUTH_GATEWAY_PORT } else { "19000" }
$base = "http://localhost:$PORT/proxy/prosearch/search"
$headers = @{"Content-Type" = "application/json; charset=utf-8"}

function Do-Search($j) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($j)
    $mem = New-Object System.IO.MemoryStream(,$bytes)
    Invoke-RestMethod -Uri $base -Method Post -ContentType "application/json; charset=utf-8" -Body $mem -TimeoutSec 15
}

Write-Host "--- 1. AI大模型 ---"
$r1 = Do-Search '{"keyword":"AI大模型 最新进展 2026年4月","cnt":5}'
$r1 | ConvertTo-Json -Depth 5

Write-Host "--- 2. OpenAI/Google AI ---"
$r2 = Do-Search '{"keyword":"OpenAI Anthropic Google AI news April 2026","cnt":5}'
$r2 | ConvertTo-Json -Depth 5

Write-Host "--- 3. 国际新闻 ---"
$r3 = Do-Search '{"keyword":"国际新闻 今日 2026年4月","from_time":1743530400,"industry":"news"}'
$r3 | ConvertTo-Json -Depth 5

Write-Host "--- 4. International news ---"
$r4 = Do-Search '{"keyword":"international news today April 2026","from_time":1743530400,"industry":"news"}'
$r4 | ConvertTo-Json -Depth 5

Write-Host "--- 5. 关税贸易 ---"
$r5 = Do-Search '{"keyword":"关税 贸易政策 最新 2026年4月","from_time":1743530400,"industry":"news"}'
$r5 | ConvertTo-Json -Depth 5

Write-Host "--- 6. Trade war ---"
$r6 = Do-Search '{"keyword":"trade war tariff supply chain news April 2026","from_time":1743530400,"industry":"news"}'
$r6 | ConvertTo-Json -Depth 5
