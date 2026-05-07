$urls = @(
    'https://outreach-dashboard-git-main-leos-projects-41ffeae7.vercel.app',
    'https://outreach-dashboard-leos-projects-41ffeae7.vercel.app',
    'https://outreach-dashboard-woad-three.vercel.app'
)
foreach ($url in $urls) {
    try {
        $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15
        $title = if ($r.Content -match '<title>(.*?)</title>') { $Matches[1] } else { 'no title' }
        Write-Output "$url => SIZE: $($r.Content.Length), TITLE: $title"
    } catch {
        Write-Output "$url => ERROR: $($_.Exception.Message.Substring(0, [Math]::Min(80, $_.Exception.Message.Length)))"
    }
}
