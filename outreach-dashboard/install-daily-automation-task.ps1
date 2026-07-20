param(
  [string]$TaskName = "CustomerDevelopmentDailyAutomation",
  [string]$At = "",
  [int]$EveryMinutes = 0
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ConfigPath = Join-Path $ProjectRoot "daily-automation-config.json"
if (-not $At -and (Test-Path $ConfigPath)) {
  $Config = Get-Content $ConfigPath -Raw -Encoding UTF8 | ConvertFrom-Json
  $At = [string]$Config.dailyStartTime
  if ($EveryMinutes -le 0) { $EveryMinutes = [int]$Config.checkEveryMinutes }
}
if (-not $At) { $At = "08:30" }
if ($EveryMinutes -le 0) { $EveryMinutes = 180 }
if ($EveryMinutes -lt 60) { throw "EveryMinutes must be at least 60 to protect platform accounts." }
$Runner = Join-Path $ProjectRoot "run-daily-customer-development.ps1"
$PowerShell = "powershell.exe"
$Argument = "-NoProfile -ExecutionPolicy Bypass -File `"$Runner`" -ProjectRoot `"$ProjectRoot`""

$Action = New-ScheduledTaskAction -Execute $PowerShell -Argument $Argument -WorkingDirectory $ProjectRoot
$StartTime = [DateTime]::Today.Add([TimeSpan]::Parse($At))
if ($StartTime -lt (Get-Date)) { $StartTime = $StartTime.AddDays(1) }
$Trigger = New-ScheduledTaskTrigger `
  -Once `
  -At $StartTime `
  -RepetitionInterval (New-TimeSpan -Minutes $EveryMinutes) `
  -RepetitionDuration (New-TimeSpan -Days 3650)
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
  -Description "Every-$EveryMinutes-minute Google discovery, ICP queue generation, dedicated Chrome execution, and GitHub data sync." `
  -Force | Out-Null

Write-Host "Installed scheduled task '$TaskName' every $EveryMinutes minutes starting at $At for $ProjectRoot"
