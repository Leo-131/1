# Get the token from vercel config
$configDir = Join-Path $env:LOCALAPPDATA "vercel"
if (-not (Test-Path $configDir)) {
    $configDir = Join-Path $env:APPDATA "vercel"
}

# Try to find token
$tokenPaths = @(
    (Join-Path $env:USERPROFILE ".vercel" "auth.json"),
    (Join-Path $env:LOCALAPPDATA "vercel" "auth.json"),
    (Join-Path $env:APPDATA "vercel" "auth.json")
)

foreach ($p in $tokenPaths) {
    if (Test-Path $p) {
        Write-Output "Found: $p"
        $content = Get-Content $p -Raw
        Write-Output $content
    }
}

# Also check environment variables
if ($env:VERCEL_TOKEN) { Write-Output "ENV VERCEL_TOKEN: found" }
if ($env:VERCEL_API_TOKEN) { Write-Output "ENV VERCEL_API_TOKEN: found" }
