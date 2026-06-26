'use strict';

const fs = require('fs');
const path = require('path');
const { execFile, spawn } = require('child_process');

const ALLOWED_HOSTS = new Set([
  'instagram.com', 'www.instagram.com',
  'facebook.com', 'www.facebook.com',
  'linkedin.com', 'www.linkedin.com',
]);

function resolveAutoGlmHome(env = process.env) {
  return env.AUTOGLM_HOME
    || path.join(env.USERPROFILE || env.HOME || '', '.agents', 'skills', 'autoglm-browser-agent');
}

function normalizeTarget(lead) {
  return String(lead?.targetUrl || lead?.verifiedTargetUrl || lead?.url || '').trim();
}

function isBlockedFacebookTarget(parsed) {
  if (!parsed || !/^(www\.)?facebook\.com$/i.test(parsed.hostname)) return false;
  const pathname = String(parsed.pathname || '').toLowerCase();
  return pathname === '/profile.php'
    || pathname.startsWith('/search')
    || pathname.startsWith('/reel')
    || pathname.startsWith('/reels')
    || pathname.startsWith('/watch')
    || pathname.startsWith('/groups')
    || pathname.startsWith('/events')
    || pathname.startsWith('/marketplace');
}

function validateLeadForExecution(lead) {
  const targetUrl = normalizeTarget(lead);
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return { ok: false, error: 'Exact verified platform URL is required' };
  }
  if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.has(parsed.hostname.toLowerCase())) {
    return { ok: false, error: 'Unsupported platform URL' };
  }
  if (isBlockedFacebookTarget(parsed)) {
    return { ok: false, error: 'Facebook outreach requires an exact verified page/profile URL' };
  }
  if (lead?.sendStatus === 'sent_confirmed'
    || lead?.automationStatus === 'sent_confirmed'
    || lead?.previouslyContacted
    || /sent|replied|accepted/i.test(String(lead?.originalStatus || ''))) {
    return { ok: false, error: 'Lead was already contacted' };
  }
  return { ok: true, targetUrl: parsed.href };
}

function isUnavailableProfilePage(page = {}) {
  const text = [
    page.url,
    page.title,
    page.text,
  ].map(value => String(value || '').toLowerCase()).join('\n');
  return [
    'sorry, this page isn',
    'the link you followed may be broken',
    'page may have been removed',
    'this page isn',
    'page not found',
    '无法访问此页面',
    '你点击的链接可能已损坏',
    '页面已被移除',
  ].some(marker => text.includes(marker));
}

function buildAutoGlmTask(lead, decision) {
  const checked = validateLeadForExecution(lead);
  if (!checked.ok) throw new Error(checked.error);
  const draft = String(decision?.draft || '').trim();
  if (!draft) throw new Error('GLM did not produce an approved message');
  return [
    `Open the exact customer profile ${checked.targetUrl}.`,
    'Verify the visible account identity matches the requested company or handle.',
    'If it does not match, stop without interacting.',
    'If matched, inspect one recent relevant business post, like it when appropriate, follow only if not already followed, then send this message exactly once:',
    draft,
    'Do not repeat a prior message. Stop for login, CAPTCHA, two-factor authentication, platform warning, or send uncertainty.',
    'Return the final URL and visible evidence for each completed action.',
  ].join(' ');
}

function execFilePromise(file, args, options) {
  return new Promise((resolve, reject) => {
    execFile(file, args, options, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

async function runAutoGlmLead(lead, decision, options = {}) {
  const home = options.home || resolveAutoGlmHome(options.env);
  const mcporter = path.join(home, 'dependency', 'mcporter.exe');
  const relay = path.join(home, 'dist', 'relay.exe');
  const server = path.join(home, 'dist', 'mcp_server.exe');
  if (!fs.existsSync(mcporter) || !fs.existsSync(relay) || !fs.existsSync(server)) {
    return { ok: false, needsInstall: true, error: 'AutoGLM browser agent is not installed' };
  }
  const task = buildAutoGlmTask(lead, decision);
  try {
    const relayProcess = spawn(relay, [], { detached: true, stdio: 'ignore', windowsHide: true });
    relayProcess.unref();
  } catch {
    // The relay may already be running.
  }
  try {
    await execFilePromise(mcporter, ['list', 'autoglm-browser-agent', '--schema'], {
      windowsHide: true,
      timeout: 15000,
    });
  } catch {
    await execFilePromise(mcporter, [
      'config', 'add', 'autoglm-browser-agent',
      '--command', server,
      '--arg', '--start_url', '--arg', 'https://www.bing.com',
      '--arg', '--window_width', '--arg', '1456',
      '--arg', '--window_height', '--arg', '819',
      '--arg', '--resize_width', '--arg', '1456',
      '--arg', '--resize_height', '--arg', '819',
      '--arg', '--max_steps', '--arg', '100',
      '--arg', '--log_dir', '--arg', path.join(home, 'mcp_output'),
      '--arg', '--if_subagent',
    ], { windowsHide: true, timeout: 30000 });
  }
  const result = await execFilePromise(mcporter, [
    'call',
    'autoglm-browser-agent.browser_subagent',
    `task=${task}`,
    `start_url=${normalizeTarget(lead)}`,
    'auto_approve=true',
    '--timeout',
    '7200000',
  ], {
    windowsHide: true,
    timeout: options.timeoutMs || 7200000,
    maxBuffer: 8 * 1024 * 1024,
  });
  return { ok: true, output: result.stdout.trim(), targetUrl: normalizeTarget(lead) };
}

module.exports = {
  buildAutoGlmTask,
  isBlockedFacebookTarget,
  isUnavailableProfilePage,
  normalizeTarget,
  resolveAutoGlmHome,
  runAutoGlmLead,
  validateLeadForExecution,
};
