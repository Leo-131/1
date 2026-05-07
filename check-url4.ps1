try {
    $r = Invoke-WebRequest -Uri 'https://outreach-dashboard-pmecxqh7m-leos-projects-41ffeae7.vercel.app' -UseBasicParsing -TimeoutSec 15
    $size = $r.Content.Length
    $preview = $r.Content.Substring(0, [Math]::Min(500, $size))
    Write-Output "SIZE: $size"
    Write-Output "PREVIEW:"
    Write-Output $preview
} catch {
    Write-Output "ERROR: $($_.Exception.Message)"
}
