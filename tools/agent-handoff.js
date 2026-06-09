#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');
const statePath = process.env.HANDOFF_STATE_PATH || path.join(repoRoot, 'AGENT_HANDOFF.json');
const validAgents = new Set(['codex', 'qclaw']);

function now() {
  return new Date().toISOString();
}

function emptyState() {
  return {
    schemaVersion: 1,
    task: null,
    status: 'idle',
    activeAgent: null,
    lastAgent: null,
    updatedAt: now(),
    summary: '',
    nextSteps: [],
    verification: [],
    git: null
  };
}

function readState() {
  if (!fs.existsSync(statePath)) {
    const state = emptyState();
    writeState(state);
    return state;
  }

  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  if (state.schemaVersion !== 1 || typeof state.status !== 'string') {
    throw new Error(`Unsupported handoff state in ${statePath}`);
  }
  return state;
}

function gitOutput(args) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore']
  });
}

function gitValue(args) {
  return gitOutput(args).trim();
}

function parseChangedFiles(output) {
  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => line.slice(3));
}

function captureGitState() {
  if (process.env.HANDOFF_DISABLE_GIT === '1') return null;

  try {
    const changedFiles = parseChangedFiles(gitOutput(['status', '--porcelain']));
    return {
      branch: gitValue(['branch', '--show-current']) || null,
      commit: gitValue(['rev-parse', 'HEAD']),
      changedFiles
    };
  } catch {
    return null;
  }
}

function writeState(state) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  const temporaryPath = `${statePath}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  fs.renameSync(temporaryPath, statePath);
}

function requireAgent(agent) {
  if (!validAgents.has(agent)) {
    throw new Error('Agent must be "codex" or "qclaw"');
  }
}

function requireText(value, label) {
  if (!value || !value.trim()) throw new Error(`${label} is required`);
  return value.trim();
}

function save(state) {
  state.updatedAt = now();
  state.git = captureGitState();
  writeState(state);
  return state;
}

function claim(agent, task, force) {
  requireAgent(agent);
  task = requireText(task, 'Task');
  const state = readState();
  const previousAgent = state.activeAgent;

  if (state.status === 'in_progress' && previousAgent && previousAgent !== agent && !force) {
    const error = new Error(
      `Task is already claimed by ${previousAgent}. Pull the latest changes and coordinate, or use --force only for stale-owner recovery.`
    );
    error.exitCode = 2;
    throw error;
  }

  state.task = task;
  state.status = 'in_progress';
  state.activeAgent = agent;
  if (previousAgent && previousAgent !== agent) state.lastAgent = previousAgent;
  state.summary = force && previousAgent && previousAgent !== agent
    ? `Forced takeover from ${previousAgent} after stale-owner recovery.`
    : '';
  state.nextSteps = [];
  state.verification = [];
  return save(state);
}

function requireOwnership(state, agent) {
  requireAgent(agent);
  if (state.status !== 'in_progress' || state.activeAgent !== agent) {
    const owner = state.activeAgent || 'no active agent';
    const error = new Error(`Cannot update handoff as ${agent}; current owner is ${owner}.`);
    error.exitCode = 2;
    throw error;
  }
}

function checkpoint(agent, summary, nextStep, verification) {
  const state = readState();
  requireOwnership(state, agent);
  state.status = 'ready_for_handoff';
  state.activeAgent = null;
  state.lastAgent = agent;
  state.summary = requireText(summary, 'Summary');
  state.nextSteps = [requireText(nextStep, 'Next step')];
  state.verification = verification ? [verification.trim()] : [];
  return save(state);
}

function complete(agent, summary, verification) {
  const state = readState();
  requireOwnership(state, agent);
  state.status = 'completed';
  state.activeAgent = null;
  state.lastAgent = agent;
  state.summary = requireText(summary, 'Summary');
  state.nextSteps = [];
  state.verification = verification ? [verification.trim()] : [];
  return save(state);
}

function printState(state, json) {
  if (json) {
    process.stdout.write(`${JSON.stringify(state, null, 2)}\n`);
    return;
  }

  const owner = state.activeAgent || 'none';
  const next = state.nextSteps.length ? state.nextSteps.join('; ') : 'none';
  process.stdout.write(
    `Task: ${state.task || 'none'}\nStatus: ${state.status}\nActive agent: ${owner}\n` +
    `Last agent: ${state.lastAgent || 'none'}\nSummary: ${state.summary || 'none'}\nNext: ${next}\n` +
    `Updated: ${state.updatedAt}\n`
  );
}

function usage() {
  return [
    'Usage:',
    '  node tools/agent-handoff.js status [--json]',
    '  node tools/agent-handoff.js claim <codex|qclaw> "<task>" [--force]',
    '  node tools/agent-handoff.js checkpoint <codex|qclaw> "<summary>" "<next step>" ["verification"]',
    '  node tools/agent-handoff.js complete <codex|qclaw> "<summary>" ["verification"]'
  ].join('\n');
}

function main(argv) {
  const [command, ...args] = argv;
  let state;

  if (command === 'status') {
    state = readState();
    printState(state, args.includes('--json'));
    return;
  }
  if (command === 'claim') {
    state = claim(args[0], args[1], args.includes('--force'));
  } else if (command === 'checkpoint') {
    state = checkpoint(args[0], args[1], args[2], args[3]);
  } else if (command === 'complete') {
    state = complete(args[0], args[1], args[2]);
  } else {
    throw new Error(usage());
  }

  printState(state, false);
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = error.exitCode || 1;
  }
}

module.exports = { parseChangedFiles };
