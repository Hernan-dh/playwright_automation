const ui = {
  commit: document.querySelector('#commit-link'), generated: document.querySelector('#generated-at'), run: document.querySelector('#run-link'),
  button: document.querySelector('#run-showcase'), state: document.querySelector('#runner-state'), id: document.querySelector('#runner-id'),
  result: document.querySelector('#runner-result'), updated: document.querySelector('#runner-updated'), latest: document.querySelector('#latest-run-link'),
  site: document.querySelector('#runner-site'), siteResult: document.querySelector('#runner-site-result'), target: document.querySelector('#runner-target'),
};
let runnerApi = '';
let pollTimer;

function displayRunner(run) {
  if (!run) return;
  ui.id.textContent = run.id;
  ui.siteResult.textContent = run.siteLabel || run.site || '—';
  ui.result.textContent = run.status;
  ui.updated.textContent = new Date(run.updatedAt).toLocaleString();
  ui.state.textContent = run.message || `Showcase ${run.status}.`;
  if (run.reportUrl) { ui.latest.href = new URL(run.reportUrl, runnerApi).href; ui.latest.textContent = 'Open generated report'; }
  const active = run.status === 'queued' || run.status === 'running';
  ui.button.disabled = active;
  ui.button.textContent = active ? 'Selected site running…' : 'Run selected site';
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
    const response = await fetch(`${runnerApi}/runs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ site: ui.site.value }) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Run request rejected.');
    displayRunner(body);
  } catch (error) { ui.state.textContent = error.message; ui.button.disabled = false; }
}

async function loadLatestSite() {
  const option = ui.site.selectedOptions[0];
  ui.target.href = option.dataset.url;
  ui.target.textContent = `Open ${option.textContent}`;
  ui.state.textContent = `Ready to run two scenarios against ${option.textContent}.`;
  ui.id.textContent = '—'; ui.siteResult.textContent = option.textContent; ui.result.textContent = 'Not run'; ui.updated.textContent = '—';
  ui.latest.href = 'report/index.html'; ui.latest.textContent = 'View published report';
  try {
    const response = await fetch(`${runnerApi}/runs/latest?site=${encodeURIComponent(ui.site.value)}`);
    if (response.ok) displayRunner(await response.json());
  } catch { /* The selected site can still be requested. */ }
}

async function configureSites() {
  const response = await fetch(`${runnerApi}/sites`);
  if (!response.ok) throw new Error('Approved sites are temporarily unavailable.');
  const body = await response.json();
  ui.site.replaceChildren(...body.sites.map(site => {
    const option = document.createElement('option'); option.value = site.id; option.textContent = `${site.label} (${site.tests} tests)`; option.dataset.url = site.targetUrl; return option;
  }));
  ui.site.disabled = false; ui.button.disabled = false; ui.button.textContent = 'Run selected site';
  ui.site.addEventListener('change', loadLatestSite);
  await loadLatestSite();
}

fetch('status.json').then(response => response.ok ? response.json() : Promise.reject()).then(status => {
  const commit = status.commit || 'local';
  ui.commit.textContent = commit.slice(0, 7);
  ui.commit.href = `https://github.com/Hernan-dh/playwright_automation/commit/${commit}`;
  ui.generated.textContent = new Date(status.generatedAt).toLocaleString();
  if (status.runUrl) ui.run.href = status.runUrl;
  runnerApi = String(status.runnerApiUrl || '').replace(/\/$/, '');
  if (runnerApi) {
    ui.button.addEventListener('click', requestRun);
    configureSites().catch(error => { ui.state.textContent = error.message; });
  }
}).catch(() => { ui.commit.textContent = 'local preview'; ui.generated.textContent = 'not published'; });
