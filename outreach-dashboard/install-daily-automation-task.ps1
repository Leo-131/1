param(
  [string]$TaskName = "CustomerDevelopmentDailyAutomation",
  [string]$At = ""
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ConfigPath = Join-Path $ProjectRoot "daily-automation-config.json"
if (-not $At -and (Test-Path $ConfigPath)) {
  $Config = Get-Content $ConfigPath -Raw | ConvertFrom-Json
  $At = [string]$Config.dailyStartTime
  $EveryMinutes = [int]$Config.checkEveryMinutes
}
if (-not $At) { $At = "08:30" }
$Runner = Join-Path $ProjectRoot "run-daily-customer-development.ps1"
$PowerShell = "powershell.exe"
$Argument = "-NoProfile -ExecutionPolicy Bypass -File `"$Runner`" -ProjectRoot `"$ProjectRoot`""

$Action = New-ScheduledTaskAction -Execute $PowerShell -Argument $Argument -WorkingDirectory $ProjectRoot
$StartTime = [DateTime]::Today.Add([TimeSpan]::Parse($At))
if ($StartTime -lt (Get-Date)) { $StartTime = $StartTime.AddDays(1) }
$Trigger = New-ScheduledTaskTrigger -Daily -At $StartTime
$Settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -MultipleInstances IgnoreNew

Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $Action `
  -Trigger $Trigger `
  -Settings $Settings `
  -Description "Daily Google discovery, ICP queue generation, Codex Chrome execution, and GitHub data sync." `
  -Force | Out-Null

Write-Host "Installed scheduled task '$TaskName' daily at $At for $ProjectRoot"
