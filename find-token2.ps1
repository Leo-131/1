$tokenPaths = @(
    "$env:USERPROFILE\.vercel\auth.json",
    "$env:LOCALAPPDATA\vercel\auth.json",
    "$env:APPDATA\vercel\auth.json",
    "$env:USERPROFILE\.vercel\token"
)

foreach ($p in $tokenPaths) {
    if (Test-Path $p) {
        Write-Output "Found: $p"
    }
}

# Check npm global config for vercel
$npmPrefix = & npm config get prefix 2>$null
Write-Output "NPM prefix: $npmPrefix"

# Check .vercel in the project
$projectVercel = "C:\Users\23889\.qclaw\workspace\outreach-dashboard\.vercel"
if (Test-Path $projectVercel) {
    Get-ChildItem $projectVercel -Recurse -Name | ForEach-Object { Write-Output "  $_" }
}
