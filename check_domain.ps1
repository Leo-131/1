[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$urls = @(
    "https://outreach-dashboard-woad-three.vercel.app/",
    "https://outreach-dashboard-pxmtotzql-leos-projects-41ffeae7.vercel.app/",
    "https://outreach-dashboard-3f76xtfju-leos-projects-41ffeae7.vercel.app/"
)
foreach ($url in $urls) {
    try {
        $r = Invoke-WebRequest -Uri $url -TimeoutSec 10 -UseBasicParsing
        Write-Host "$url => Status: $($r.StatusCode), Size: $($r.Content.Length)"
        if ($r.Content.Length -gt 1000) {
            Write-Host "  -> Has content"
        }
    } catch {
        Write-Host "$url => ERROR: $($_.Exception.Message)"
    }
}
