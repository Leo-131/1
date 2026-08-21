const http = require('http');
const { spawnSync } = require('child_process');
const {
  assertLeaseOwner,
  claimCloudTask,
  buildCloudTaskState,
  releaseCloudTask,
  writeState,
} = require('./cloud-task-controller');

function argument(name) {
  const prefix = `--${name}=`;
  const value = process.argv.find(item => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : '';
}

function assertDedicatedChrome() {
  return new Promise((resolve, reject) => {
    const request = http.get({ hostname: '127.0.0.1', port: 9224, path: '/json/version', timeout: 2500 }, response => {
      let body = '';
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (!parsed.webSocketDebuggerUrl) throw new Error('CDP endpoint missing');
          resolve();
        } catch (error) { reject(error); }
      });
    });
    request.on('timeout', () => request.destroy(new Error('Dedicated Chrome/CDP 9224 timeout')));
    request.on('error', reject);
  });
}

function runNpm(script, env = {}) {
  const npmCli = process.env.npm_execpath;
  const command = npmCli ? process.execPath : (process.platform === 'win32' ? 'npm.cmd' : 'npm');
  const args = npmCli ? [npmCli, 'run', script] : ['run', script];
  const result = spawnSync(command, args, {
    cwd: __dirname,
    env: { ...process.env, ...env },
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${script} failed with exit code ${result.status}`);
}

async function main() {
  const deviceId = argument('device') || process.env.OUTREACH_DEVICE_ID || '';
  const requireRemoteLease = process.env.OUTREACH_REQUIRE_REMOTE_LEASE !== '0';
  const initialState = buildCloudTaskState();
  if (requireRemoteLease) assertLeaseOwner(initialState, deviceId);
  await assertDedicatedChrome();
  writeState(claimCloudTask(initialState, deviceId));
  const sharedEnv = { OUTREACH_DEVICE_ID: deviceId, OUTREACH_RUN_LIMIT: '50' };
  runNpm('discover:daily', sharedEnv);
  runNpm('daily:execute', { ...sharedEnv, OUTREACH_EMAIL_UI_PROVIDER: 'alibaba_webmail' });
  writeState(releaseCloudTask(buildCloudTaskState(), deviceId));
  runNpm('sync:github', sharedEnv);
}

main().catch(error => {
  console.error(error.message || String(error));
  process.exit(1);
});
