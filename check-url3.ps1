try {
    $headers = @{
        'Cache-Control' = 'no-cache'
        'Pragma' = 'no-cache'
    }
    $r = Invoke-WebRequest -Uri 'https://outreach-dashboard-woad-three.vercel.app' -UseBasicParsing -TimeoutSec 15 -Headers $headers
    $size = $r.Content.Length
    $preview = $r.Content.Substring(0, [Math]::Min(500, $size))
    Write-Output "SIZE: $size"
    Write-Output "PREVIEW:"
    Write-Output $preview
} catch {
    Write-Output "ERROR: $($_.Exception.Message)"
}
