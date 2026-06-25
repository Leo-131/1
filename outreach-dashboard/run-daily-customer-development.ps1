param(
  [string]$ProjectRoot = (Split-Path -Parent $MyInvocation.MyCommand.Path)
)

$ErrorActionPreference = "Stop"
$LogDir = Join-Path $ProjectRoot "daily-runs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
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
Run-Step "Codex Chrome execution" "npm run daily:execute"
Run-Step "GitHub safe data sync" "npm run sync:github"

Add-Content $LogPath "[$(Get-Date -Format o)] DAILY CUSTOMER DEVELOPMENT COMPLETE"
Write-Host "Daily customer development complete. Log: $LogPath"
