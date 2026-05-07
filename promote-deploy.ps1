# Try to redeploy using vercel CLI - redeploy latest production
# First, get the deployment ID of the latest successful deployment
# Then promote it to production

# Try using vercel CLI to promote/redeploy
Set-Location "C:\Users\23889\.qclaw\workspace\outreach-dashboard"

# List recent deployments and get the latest one
$deployments = & vercel ls 2>&1
$firstLine = ($deployments | Select-String "outreach-dashboard-.*-leos-projects").Line
if ($firstLine) {
    $url = ($firstLine -split '\s+')[4]
    Write-Output "Latest deployment URL: $url"
    
    # Try to promote it
    Write-Output "Attempting to promote..."
    & vercel promote $url 2>&1
}
