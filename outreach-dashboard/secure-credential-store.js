'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function alibabaCredentialPath(env = process.env) {
  const appData = String(env.APPDATA || '').trim();
  return appData ? path.join(appData, 'FLEXTAIL', 'alibaba-mail.dpapi') : '';
}

function protectedAlibabaPassword(env = process.env) {
  const file = alibabaCredentialPath(env);
  if (!file || !fs.existsSync(file)) return '';
  try {
    const literalPath = file.replace(/'/g, "''");
    return String(execFileSync('powershell.exe', [
      '-NoProfile',
      '-NonInteractive',
      '-Command',
      `$value = Get-Content -LiteralPath '${literalPath}' -Raw; $secure = ConvertTo-SecureString $value; $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure); try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }`,
    ], { encoding: 'utf8', windowsHide: true, timeout: 5000, stdio: ['ignore', 'pipe', 'ignore'] })).trim();
  } catch {
    return '';
  }
}

module.exports = { alibabaCredentialPath, protectedAlibabaPassword };
