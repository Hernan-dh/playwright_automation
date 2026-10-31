import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { access, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';

const port = Number(process.env.RUNNER_PORT || 3000);
const dataRoot = resolve(process.env.RUNNER_DATA_ROOT || '/data/runs');
const publicRunsBase = (process.env.PUBLIC_RUNS_BASE || '/qa-runs').replace(/\/$/, '');
const allowedOrigins = new Set((process.env.ALLOWED_ORIGINS || 'https://hernan-dh.github.io').split(',').map(value => value.trim()).filter(Boolean));
const defaultOrigin = [...allowedOrigins][0];
const cooldownMs = Number(process.env.RUNNER_COOLDOWN_MS || 300_000);
const timeoutMs = Number(process.env.RUNNER_TIMEOUT_MS || 180_000);
const fullTimeoutMs = Number(process.env.RUNNER_FULL_TIMEOUT_MS || 600_000);
const retentionMs = Number(process.env.RUNNER_RETENTION_MS || 86_400_000);
const maxRuns = Number(process.env.RUNNER_MAX_RUNS || 20);
const rateWindowMs = 3_600_000;
const maxRequestsPerWindow = 10;
const sites = Object.freeze({
  saucedemo: { label: 'SauceDemo', targetUrl: 'https://www.saucedemo.com/', quickTests: 2, fullTests: 8 },
  'the-internet': { label: 'The Internet', targetUrl: 'https://the-internet.herokuapp.com/', quickTests: 2, fullTests: 8 },
  'test-pages': { label: 'Test Pages', targetUrl: 'https://testpages.eviltester.com/', quickTests: 2, fullTests: 8 },
  'expand-testing': { label: 'Expand Testing', targetUrl: 'https://practice.expandtesting.com/', quickTests: 2, fullTests: 8 },
  'automation-exercise': { label: 'Automation Exercise', targetUrl: 'https://automationexercise.com/', quickTests: 2, fullTests: 8 },
});
const rateByIp = new Map();
const latestBySelection = new Map();
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
  latestBySelection.set(`${run.site}:${run.suite}`, run);
}

function publicRun(run, { reused = false } = {}) {
  return { ...run, reused, logPath: undefined };
}

function publicSites() {
  return Object.entries(sites).map(([id, site]) => ({ id, label: site.label, targetUrl: site.targetUrl, quickTests: site.quickTests, fullTests: site.fullTests }));
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
  const retained = candidates.filter(item => Date.now() - Date.parse(item.createdAt) <= retentionMs).slice(0, maxRuns);
  const retainedIds = new Set(retained.map(item => item.id));
  for (const stale of candidates.filter(item => !retainedIds.has(item.id))) await rm(runPath(stale.id), { recursive: true, force: true });
  latestRun = retained[0];
  for (const run of retained) if (run.site && run.suite && !latestBySelection.has(`${run.site}:${run.suite}`)) latestBySelection.set(`${run.site}:${run.suite}`, run);
}

async function execute(run) {
  activeRun = run;
  const site = sites[run.site];
  const expectedTests = run.suite === 'full' ? site.fullTests : site.quickTests;
  run.status = 'running'; run.message = `${expectedTests} ${run.suite} Chromium scenarios are running against ${site.label}.`; await save(run);
  const outputRoot = runPath(run.id);
  const child = spawn('npm', ['run', 'public-site'], {
    cwd: '/work', shell: false, detached: process.platform !== 'win32',
    env: { ...process.env, CI: '1', FORCE_COLOR: '0', PUBLIC_SITE_ID: run.site, PUBLIC_SUITE: run.suite, SHOWCASE_OUTPUT_ROOT: outputRoot },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const logFile = join(outputRoot, 'runner.log');
  const chunks = [];
  const collect = chunk => { if (chunks.reduce((sum, item) => sum + item.length, 0) < 512_000) chunks.push(chunk); };
  child.stdout.on('data', collect); child.stderr.on('data', collect);
  const timer = setTimeout(() => {
    if (process.platform === 'win32') child.kill('SIGKILL'); else process.kill(-child.pid, 'SIGKILL');
  }, run.suite === 'full' ? fullTimeoutMs : timeoutMs);
  const exitCode = await new Promise(resolveExit => {
    let settled = false;
    const finish = code => { if (!settled) { settled = true; resolveExit(code ?? -1); } };
    child.once('error', () => finish(-1));
    child.once('close', finish);
  });
  clearTimeout(timer);
  await writeFile(logFile, Buffer.concat(chunks).toString('utf8'), 'utf8');
  let reportExists = true;
  try { await access(join(outputRoot, 'html-report', 'index.html')); } catch { reportExists = false; }
  run.status = exitCode === 0 ? 'passed' : 'failed';
  run.tests = exitCode === 0 ? expectedTests : undefined;
  run.reportUrl = reportExists ? `${publicRunsBase}/${run.id}/html-report/index.html` : undefined;
  run.message = exitCode === 0 ? `${expectedTests}/${expectedTests} ${run.suite} scenarios passed on ${site.label}.` : `${site.label} ${run.suite} suite failed or timed out${reportExists ? '; inspect the report.' : '.'}`;
  await save(run);
  activeRun = undefined;
}

async function createRun(siteId, suite) {
  if (activeRun) return activeRun.site === siteId && activeRun.suite === suite ? { run: activeRun, reused: true } : { conflict: true, run: activeRun };
  const recent = latestBySelection.get(`${siteId}:${suite}`);
  if (recent && Date.now() - Date.parse(recent.createdAt) < cooldownMs) return { run: recent, reused: true };
  const site = sites[siteId];
  const run = { id: `${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}-${randomBytes(3).toString('hex')}`, site: siteId, suite, siteLabel: site.label, targetUrl: site.targetUrl, status: 'queued', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), message: `${site.label} ${suite} suite queued.` };
  await save(run);
  execute(run).catch(async error => { run.status = 'failed'; run.message = 'Runner orchestration failed.'; run.error = error.name; await save(run); activeRun = undefined; });
  return { run, reused: false };
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 128) throw new Error('too-large');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

await loadRuns();
const server = createServer(async (request, response) => {
  const origin = requestOrigin(request);
  if (!origin) return json(response, 403, { message: 'Origin not allowed.' }, defaultOrigin);
  if (request.method === 'OPTIONS') { response.writeHead(204, { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' }); return response.end(); }
  const url = new URL(request.url, 'http://runner.local');
  if (request.method === 'GET' && url.pathname === '/qa-api/health') return json(response, 200, { status: 'ok', active: Boolean(activeRun) }, origin);
  if (request.method === 'GET' && url.pathname === '/qa-api/sites') return json(response, 200, { sites: publicSites() }, origin);
  if (request.method === 'GET' && url.pathname === '/qa-api/runs/latest') {
    const selected = url.searchParams.get('site');
    const suite = url.searchParams.get('suite') || 'quick';
    if (selected && !sites[selected]) return json(response, 400, { message: 'Unknown site selection.' }, origin);
    if (!['quick', 'full'].includes(suite)) return json(response, 400, { message: 'Unknown suite selection.' }, origin);
    const run = selected ? latestBySelection.get(`${selected}:${suite}`) : latestRun;
    return run ? json(response, 200, publicRun(run), origin) : json(response, 404, { message: 'No public run yet.' }, origin);
  }
  const match = url.pathname.match(/^\/qa-api\/runs\/([0-9]{14}-[a-f0-9]{6})$/);
  if (request.method === 'GET' && match) {
    try { return json(response, 200, publicRun(JSON.parse(await readFile(join(runPath(match[1]), 'metadata.json'), 'utf8'))), origin); }
    catch { return json(response, 404, { message: 'Run not found.' }, origin); }
  }
  if (request.method === 'POST' && url.pathname === '/qa-api/runs') {
    if (Number(request.headers['content-length'] || 0) > 128) return json(response, 413, { message: 'Request body is too large.' }, origin);
    if (!rateAllowed(clientIp(request))) return json(response, 429, { message: 'Rate limit reached. Try again later.' }, origin);
    let body;
    try { body = await readJson(request); } catch { return json(response, 400, { message: 'A small JSON request is required.' }, origin); }
    if (!body || typeof body.site !== 'string' || !sites[body.site] || !['quick', 'full'].includes(body.suite) || Object.keys(body).some(key => !['site', 'suite'].includes(key))) return json(response, 400, { message: 'Choose one approved site and suite.' }, origin);
    const created = await createRun(body.site, body.suite);
    if (created.conflict) return json(response, 409, { message: `${created.run.siteLabel} is already running. Try again shortly.`, activeRun: publicRun(created.run) }, origin);
    return json(response, created.reused ? 200 : 202, publicRun(created.run, created), origin);
  }
  json(response, 404, { message: 'Not found.' }, origin);
});
server.listen(port, '0.0.0.0', () => console.log(`Public showcase runner listening on ${port}`));
