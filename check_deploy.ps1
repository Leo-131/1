[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
try {
    $r = Invoke-WebRequest -Uri "https://outreach-dashboard-pxmtotzql-leos-projects-41ffeae7.vercel.app/api/contacts" -TimeoutSec 15 -UseBasicParsing
    Write-Host "Status: $($r.StatusCode)"
    $c = $r.Content | ConvertFrom-Json
    Write-Host "Success: $($c.success)"
    Write-Host "Source: $($c.source)"
    Write-Host "Contacts count: $($c.contacts.Count)"
    Write-Host "Stats total: $($c.stats.total)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
