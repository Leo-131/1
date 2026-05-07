[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
try {
    $r = Invoke-WebRequest -Uri "https://outreach-dashboard-woad-three.vercel.app/api/contacts" -TimeoutSec 15 -UseBasicParsing
    Write-Host "Status: $($r.StatusCode)"
    $content = $r.Content
    if ($content.Length -gt 200) {
        Write-Host "Size: $($content.Length)"
        Write-Host "First 500 chars:"
        Write-Host ($content.Substring(0, [Math]::Min(500, $content.Length)))
    } else {
        Write-Host "Content: $content"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
