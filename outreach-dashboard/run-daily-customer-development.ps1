param(
  [string]$ProjectRoot = (Split-Path -Parent $MyInvocation.MyCommand.Path)
)

$ErrorActionPreference = "Stop"
$LogDir = Join-Path $ProjectRoot "daily-runs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
$ConfigPath = Join-Path $ProjectRoot "daily-automation-config.json"
$BatchTarget = 13
$TimeoutMinutes = 45
if (Test-Path $ConfigPath) {
  $Config = Get-Content $ConfigPath -Raw -Encoding UTF8 | ConvertFrom-Json
  if ([int]$Config.executionBatchTarget -gt 0) { $BatchTarget = [int]$Config.executionBatchTarget }
  if ([int]$Config.executionTimeoutMinutes -gt 0) { $TimeoutMinutes = [int]$Config.executionTimeoutMinutes }
}
$env:DAILY_EXECUTE_LIMIT = [string][Math]::Min([Math]::Max($BatchTarget, 1), 13)
$env:DAILY_EXECUTE_TIMEOUT_MS = [string]($TimeoutMinutes * 60 * 1000)
$Stamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
$LogPath = Join-Path $LogDir "$Stamp-windows-daily-automation.log"

function Run-Step {
  param([string]$Name, [string]$Command)
  Add-Content $LogPath "[$(Get-Date -Format o)] START $Name"
  cmd.exe /c "cd /d `"$ProjectRoot`" && $Command" 2>&1 | Tee-Object -FilePath $LogPath -Append
  if ($LASTEXITCODE -ne 0) {
    Add-Content $LogPath "[$(Get-Date -Format o)] FAILED $Name exit=$LASTEXITCODE"
    throw "$Name failed with exit code $LASTEXITCODE"
  }
  Add-Content $LogPath "[$(Get-Date -Format o)] DONE $Name"
}

Run-Step "Google discovery + daily queue" "npm run discover:daily"
Run-Step "Codex Chrome execution (batch target $env:DAILY_EXECUTE_LIMIT)" "npm run daily:execute"
Run-Step "GitHub safe data sync" "npm run sync:github"

Add-Content $LogPath "[$(Get-Date -Format o)] DAILY CUSTOMER DEVELOPMENT COMPLETE"
Write-Host "Daily customer development complete. Log: $LogPath"
