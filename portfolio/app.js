const ui = {
  commit: document.querySelector('#commit-link'), generated: document.querySelector('#generated-at'), run: document.querySelector('#run-link'),
  button: document.querySelector('#run-showcase'), state: document.querySelector('#runner-state'), id: document.querySelector('#runner-id'),
  result: document.querySelector('#runner-result'), updated: document.querySelector('#runner-updated'), latest: document.querySelector('#latest-run-link'),
};
let runnerApi = '';
let pollTimer;

function displayRunner(run) {
  if (!run) return;
  ui.id.textContent = run.id;
  ui.result.textContent = run.status;
  ui.updated.textContent = new Date(run.updatedAt).toLocaleString();
  ui.state.textContent = run.message || `Showcase ${run.status}.`;
  if (run.reportUrl) { ui.latest.href = new URL(run.reportUrl, runnerApi).href; ui.latest.textContent = 'Open generated report'; }
  const active = run.status === 'queued' || run.status === 'running';
  ui.button.disabled = active;
  ui.button.textContent = active ? 'Showcase running…' : 'Run public showcase';
  clearTimeout(pollTimer);
  if (active) pollTimer = setTimeout(() => loadRun(run.id), 2500);
}

async function loadRun(id) {
  try { displayRunner(await fetch(`${runnerApi}/runs/${id}`).then(response => response.ok ? response.json() : Promise.reject())); }
  catch { ui.state.textContent = 'Runner status is temporarily unavailable.'; ui.button.disabled = false; }
}

async function requestRun() {
  ui.button.disabled = true;
  ui.state.textContent = 'Requesting a controlled showcase run…';
  try {
    const response = await fetch(`${runnerApi}/runs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Run request rejected.');
    displayRunner(body);
  } catch (error) { ui.state.textContent = error.message; ui.button.disabled = false; }
}

fetch('status.json').then(response => response.ok ? response.json() : Promise.reject()).then(status => {
  const commit = status.commit || 'local';
  ui.commit.textContent = commit.slice(0, 7);
  ui.commit.href = `https://github.com/Hernan-dh/playwright_automation/commit/${commit}`;
  ui.generated.textContent = new Date(status.generatedAt).toLocaleString();
  if (status.runUrl) ui.run.href = status.runUrl;
  runnerApi = String(status.runnerApiUrl || '').replace(/\/$/, '');
  if (runnerApi) {
    ui.button.disabled = false;
    ui.button.textContent = 'Run public showcase';
    ui.state.textContent = 'Runner ready. Requests are rate-limited and may reuse a recent result.';
    ui.button.addEventListener('click', requestRun);
    fetch(`${runnerApi}/runs/latest`).then(response => response.ok ? response.json() : null).then(displayRunner).catch(() => {});
  }
}).catch(() => { ui.commit.textContent = 'local preview'; ui.generated.textContent = 'not published'; });
