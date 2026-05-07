$r = Invoke-WebRequest -Uri 'https://outreach-dashboard-woad-three.vercel.app' -UseBasicParsing -TimeoutSec 15
$size = $r.Content.Length
$title = if ($r.Content -match '<title>(.*?)</title>') { $Matches[1] } else { 'no title' }
Write-Output "SIZE: $size, TITLE: $title"