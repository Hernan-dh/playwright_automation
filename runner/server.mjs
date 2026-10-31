import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';

const port = Number(process.env.RUNNER_PORT || 3000);
const dataRoot = resolve(process.env.RUNNER_DATA_ROOT || '/data/runs');
const publicRunsBase = (process.env.PUBLIC_RUNS_BASE || '/qa-runs').replace(/\/$/, '');
const allowedOrigins = new Set((process.env.ALLOWED_ORIGINS || 'https://hernan-dh.github.io').split(',').map(value => value.trim()).filter(Boolean));
const defaultOrigin = [...allowedOrigins][0];
const cooldownMs = Number(process.env.RUNNER_COOLDOWN_MS || 300_000);
const timeoutMs = Number(process.env.RUNNER_TIMEOUT_MS || 120_000);
const retentionMs = Number(process.env.RUNNER_RETENTION_MS || 86_400_000);
const maxRuns = Number(process.env.RUNNER_MAX_RUNS || 20);
const expectedTests = 11;
const rateWindowMs = 3_600_000;
const maxRequestsPerWindow = 3;
const rateByIp = new Map();
let activeRun;
let latestRun;

await mkdir(dataRoot, { recursive: true });

function runPath(id) {
  const target = resolve(dataRoot, id);
  if (!target.startsWith(`${dataRoot}${sep}`)) throw new Error('Invalid run path');
  return target;
}

async function save(run) {
  run.updatedAt = new Date().toISOString();
  await mkdir(runPath(run.id), { recursive: true });
  await writeFile(join(runPath(run.id), 'metadata.json'), JSON.stringify(run, null, 2), 'utf8');
  latestRun = run;
}

function publicRun(run, { reused = false } = {}) {
  return { ...run, reused, logPath: undefined };
}

function json(response, status, body, origin) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': origin, 'Vary': 'Origin', 'X-Content-Type-Options': 'nosniff',
  });
  response.end(JSON.stringify(body));
}

function requestOrigin(request) {
  const origin = request.headers.origin;
  return !origin || allowedOrigins.has(origin) ? (origin || defaultOrigin) : '';
}

function clientIp(request) {
  return String(request.headers['x-real-ip'] || request.socket.remoteAddress || 'unknown').slice(0, 80);
}

function rateAllowed(ip) {
  const now = Date.now();
  const recent = (rateByIp.get(ip) || []).filter(time => now - time < rateWindowMs);
  if (recent.length >= maxRequestsPerWindow) return false;
  recent.push(now); rateByIp.set(ip, recent); return true;
}

async function loadRuns() {
  const candidates = [];
  for (const entry of await readdir(dataRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    try { candidates.push(JSON.parse(await readFile(join(dataRoot, entry.name, 'metadata.json'), 'utf8'))); } catch { /* Ignore incomplete directories. */ }
  }
  candidates.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  latestRun = candidates[0];
  for (const stale of candidates.slice(maxRuns)) await rm(runPath(stale.id), { recursive: true, force: true });
  for (const stale of candidates.filter(item => Date.now() - Date.parse(item.createdAt) > retentionMs)) await rm(runPath(stale.id), { recursive: true, force: true });
}

async function execute(run) {
  activeRun = run;
  run.status = 'running'; run.message = 'Eleven deterministic Chromium scenarios are running.'; await save(run);
  const outputRoot = runPath(run.id);
  const child = spawn('npm', ['run', 'showcase'], {
    cwd: '/work', shell: false, detached: process.platform !== 'win32',
    env: { ...process.env, CI: '1', FORCE_COLOR: '0', SHOWCASE_OUTPUT_ROOT: outputRoot },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const logFile = join(outputRoot, 'runner.log');
  const chunks = [];
  const collect = chunk => { if (chunks.reduce((sum, item) => sum + item.length, 0) < 512_000) chunks.push(chunk); };
  child.stdout.on('data', collect); child.stderr.on('data', collect);
  const timer = setTimeout(() => {
    if (process.platform === 'win32') child.kill('SIGKILL'); else process.kill(-child.pid, 'SIGKILL');
  }, timeoutMs);
  const exitCode = await new Promise(resolveExit => child.on('close', resolveExit));
  clearTimeout(timer);
  await writeFile(logFile, Buffer.concat(chunks).toString('utf8'), 'utf8');
  run.status = exitCode === 0 ? 'passed' : 'failed';
  run.tests = exitCode === 0 ? expectedTests : undefined;
  run.reportUrl = exitCode === 0 ? `${publicRunsBase}/${run.id}/html-report/index.html` : undefined;
  run.message = exitCode === 0 ? `${expectedTests}/${expectedTests} controlled scenarios passed.` : 'The controlled showcase failed or timed out.';
  await save(run);
  activeRun = undefined;
}

async function createRun() {
  if (activeRun) return { run: activeRun, reused: true };
  if (latestRun && Date.now() - Date.parse(latestRun.createdAt) < cooldownMs) return { run: latestRun, reused: true };
  const run = { id: `${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}-${randomBytes(3).toString('hex')}`, status: 'queued', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), message: 'Showcase queued.' };
  await save(run);
  execute(run).catch(async error => { run.status = 'failed'; run.message = 'Runner orchestration failed.'; run.error = error.name; await save(run); activeRun = undefined; });
  return { run, reused: false };
}

await loadRuns();
const server = createServer(async (request, response) => {
  const origin = requestOrigin(request);
  if (!origin) return json(response, 403, { message: 'Origin not allowed.' }, defaultOrigin);
  if (request.method === 'OPTIONS') { response.writeHead(204, { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' }); return response.end(); }
  const url = new URL(request.url, 'http://runner.local');
  if (request.method === 'GET' && url.pathname === '/qa-api/health') return json(response, 200, { status: 'ok', active: Boolean(activeRun) }, origin);
  if (request.method === 'GET' && url.pathname === '/qa-api/runs/latest') return latestRun ? json(response, 200, publicRun(latestRun), origin) : json(response, 404, { message: 'No public run yet.' }, origin);
  const match = url.pathname.match(/^\/qa-api\/runs\/([0-9]{14}-[a-f0-9]{6})$/);
  if (request.method === 'GET' && match) {
    try { return json(response, 200, publicRun(JSON.parse(await readFile(join(runPath(match[1]), 'metadata.json'), 'utf8'))), origin); }
    catch { return json(response, 404, { message: 'Run not found.' }, origin); }
  }
  if (request.method === 'POST' && url.pathname === '/qa-api/runs') {
    if (Number(request.headers['content-length'] || 0) > 32) return json(response, 413, { message: 'Request body is not accepted.' }, origin);
    if (!rateAllowed(clientIp(request))) return json(response, 429, { message: 'Rate limit reached. Try again later.' }, origin);
    const created = await createRun();
    return json(response, created.reused ? 200 : 202, publicRun(created.run, created), origin);
  }
  json(response, 404, { message: 'Not found.' }, origin);
});
server.listen(port, '0.0.0.0', () => console.log(`Public showcase runner listening on ${port}`));
