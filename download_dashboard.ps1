[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$url = "https://outreach-dashboard-woad-three.vercel.app/"
$out = "C:\Users\23889\.qclaw\workspace\temp_dashboard.html"
try {
    $content = (Invoke-WebRequest -Uri $url -TimeoutSec 15 -UseBasicParsing).Content
    [IO.File]::WriteAllText($out, $content)
    Write-Host "OK: $out, size=$($content.Length)"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
