$PORT = if ($env:AUTH_GATEWAY_PORT) { $env:AUTH_GATEWAY_PORT } else { "19000" }
$base = "http://localhost:$PORT/proxy/prosearch/search"

function Search-ProSearch($keyword, $from_time) {
    $body = @{}
    $body["keyword"] = $keyword
    if ($cnt) { $body["cnt"] = 5 }
    if ($from_time) { $body["from_time"] = $from_time; $body["industry"] = "news" }
    $json = [System.Text.Json.JsonSerializer]::Serialize($body)
    Write-Host "keyword=$keyword"
    try {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
        $ms = New-Object System.IO.MemoryStream(,$bytes)
        $resp = Invoke-RestMethod -Uri $base -Method Post -ContentType "application/json" -Body $ms -TimeoutSec 15
        $resp | ConvertTo-Json -Depth 5
    } catch {
        Write-Host "ERROR: $($_.Exception.Message)"
    }
    Write-Host ""
}

# 1. AI大模型
Search-ProSearch "AI大模型 最新进展 2026年4月"
# 2. OpenAI/Google AI
Search-ProSearch "OpenAI Anthropic Google AI news April 2026"
# 3. 国际新闻
Search-ProSearch "国际新闻 今日 2026年4月" 1743530400
# 4. International news
Search-ProSearch "international news today April 2026" 1743530400
# 5. 关税贸易
Search-ProSearch "关税 贸易政策 最新 2026年4月" 1743530400
# 6. Trade war
Search-ProSearch "trade war tariff supply chain news April 2026" 1743530400
