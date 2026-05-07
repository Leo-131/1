[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$url = "https://outreach-dashboard-pxmtotzql-leos-projects-41ffeae7.vercel.app/"
try {
    $r = Invoke-WebRequest -Uri $url -TimeoutSec 10 -UseBasicParsing
    Write-Host "Status: $($r.StatusCode), Size: $($r.Content.Length)"
    if ($r.Content -match 'async function loadData') {
        Write-Host "-> Has loadData function (GOOD)"
    }
    if ($r.Content -match 'renderContacts') {
        Write-Host "-> Has renderContacts (GOOD)"
    }
    if ($r.Content -match 'Total clients') {
        Write-Host "-> Has stats rendering"
    }
    if ($r.Content -match 'v0\.3\.0') {
        Write-Host "-> Has v0.3.0 label (OLD)"
    }
    if ($r.Content -match 'v0\.4\.0' -or $r.Content -match 'v15\.0') {
        Write-Host "-> Has newer version label"
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
