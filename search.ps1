$PORT = if ($env:AUTH_GATEWAY_PORT) { $env:AUTH_GATEWAY_PORT } else { "19000" }
$base = "http://localhost:$PORT/proxy/prosearch/search"

$queries = @(
  '{"keyword":"AI大模型 最新进展 2026年4月","cnt":5}',
  '{"keyword":"OpenAI Anthropic Google AI news April 2026","cnt":5}',
  '{"keyword":"国际新闻 今日 2026年4月","from_time":1743530400,"industry":"news"}',
  '{"keyword":"international news today April 2026","from_time":1743530400,"industry":"news"}',
  '{"keyword":"关税 贸易政策 最新 2026年4月","from_time":1743530400,"industry":"news"}',
  '{"keyword":"trade war tariff supply chain news April 2026","from_time":1743530400,"industry":"news"}'
)

foreach ($q in $queries) {
  Write-Host "=== QUERY ==="
  Write-Host $q
  Write-Host "=== RESULT ==="
  curl.exe -s -X POST $base -H "Content-Type: application/json" -d $q
  Write-Host ""
  Write-Host ""
}
