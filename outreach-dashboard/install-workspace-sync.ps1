param([string]$SourceDirectory = $PSScriptRoot)
$ErrorActionPreference = 'Stop'
$nodePath = (Get-Command node -ErrorAction Stop).Source
$bridge = Join-Path $SourceDirectory 'workspace-sync.js'
if (!(Test-Path $bridge)) { throw 'Please update the customer system before installing sync.' }
$privateDir = Join-Path $env:APPDATA 'FlextailWorkspace'
New-Item -ItemType Directory -Force $privateDir | Out-Null
$credential = Read-Host 'Paste the private workspace sync credential (hidden)' -AsSecureString
$credential | ConvertFrom-SecureString | Set-Content (Join-Path $privateDir 'sync-token.dpapi')
$runner = Join-Path $privateDir 'run-sync.ps1'
$nodeLiteral = $nodePath.Replace("'", "''")
$bridgeLiteral = $bridge.Replace("'", "''")
$sourceLiteral = $SourceDirectory.Replace("'", "''")
@"
& '$nodeLiteral' '$bridgeLiteral' '$sourceLiteral'
"@ | Set-Content $runner
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument ('-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "' + $runner + '"')
$trigger = New-ScheduledTaskTrigger -AtLogOn -User ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit ([TimeSpan]::Zero)
Register-ScheduledTask -TaskName 'Flextail Workspace Sync' -Action $action -Trigger $trigger -Settings $settings -Description 'Synchronize local customer progress with the private FLEXTAIL workspace.' -Force | Out-Null
Start-ScheduledTask -TaskName 'Flextail Workspace Sync'
Write-Output 'Sync installed for this Windows user. Progress will upload while the computer is awake and online.'
