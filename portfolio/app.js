const es = {
  'Skip to content':'Saltar al contenido','Coverage':'Cobertura','Pipeline':'Pipeline','Evidence':'Evidencia','Live report':'Reporte en vivo','Main portfolio':'Portfolio principal','Language':'Idioma','Public automation laboratory':'Laboratorio público de automatización','Evidence-first testing across UI, API, browsers, and CI.':'Testing orientado a evidencia en UI, API, navegadores y CI.','A production-shaped Playwright portfolio built around risk, deterministic execution, traceability, and artifacts that reviewers can inspect.':'Un portfolio de Playwright con enfoque de producción, basado en riesgo, ejecución determinística, trazabilidad y artefactos inspeccionables.','Explore the HTML report':'Explorar el reporte HTML','View source on GitHub':'Ver código en GitHub','Latest published build':'Última compilación publicada','Published evidence':'Evidencia publicada','Generated':'Generado','CI run':'Ejecución CI','traceable case IDs':'casos trazables','live regression cases':'casos de regresión activos','test destinations':'destinos de prueba','known npm vulnerabilities':'vulnerabilidades npm conocidas','Public execution':'Ejecución pública','Choose a live practice site.':'Elegí un sitio de práctica activo.','Test destination':'Destino de prueba','Quick — 2 tests':'Rápida — 2 pruebas','Full regression — 8 tests':'Regresión completa — 8 pruebas','View published report':'Ver reporte publicado','Site':'Sitio','Run':'Ejecución','Status':'Estado','Updated':'Actualizado','Risk-based coverage':'Cobertura basada en riesgo','Multiple test layers.':'Múltiples capas de prueba.','Critical E2E':'E2E críticos','API & contracts':'API y contratos','Browser behavior':'Comportamiento del navegador','Quality attributes':'Atributos de calidad','Delivery pipeline':'Pipeline de entrega','From change to inspectable evidence.':'Del cambio a evidencia inspeccionable.','Verify':'Verificar','Exercise':'Ejecutar','Parallelize':'Paralelizar','Publish':'Publicar','Public evidence':'Evidencia pública','Claims backed by executable artifacts.':'Afirmaciones respaldadas por artefactos ejecutables.','Interactive':'Interactivo','External':'Externo','Governance':'Gobernanza','Agent workflow':'Flujo de agentes','Playwright HTML report':'Reporte HTML de Playwright','Shards and report merge':'Shards y fusión de reportes','Test traceability matrix':'Matriz de trazabilidad','Only controlled, synthetic scenarios are published. Credentials, storage state, private endpoints, and unreviewed traces are excluded.':'Sólo se publican escenarios controlados y sintéticos. Se excluyen credenciales, estado de almacenamiento, endpoints privados y traces no revisados.','Built as a public, reproducible QA engineering portfolio.':'Construido como un portfolio público y reproducible de ingeniería QA.','Repository':'Repositorio'
};
const languageSelector = document.querySelector('#language-selector');
const fullRegressionOption = document.querySelector('#runner-suite option[value="full"]');
if (fullRegressionOption) fullRegressionOption.textContent = 'Full regression — 15 tests';
document.querySelector('.runner-copy > p:not(.eyebrow)')?.replaceChildren(
  'Run a two-test smoke check or the complete fifteen-test safe regression against one of ten approved online systems, including AI Operations Desk, Ticketing, Fanny Pack Studios, Hernán de Haro Portfolio, and the QA Portfolio. The runner accepts only these fixed destinations and suites—never arbitrary URLs, commands, branches, credentials, or test names.'
);
const originalText = new WeakMap();
let language;
try { language = localStorage.getItem('playwright-portfolio-language') || (navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'); } catch { language = navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'; }
function applyLanguage() {
  document.documentElement.lang = language;
  document.title = language === 'es' ? 'Portfolio de Ingeniería QA con Playwright' : 'Playwright QA Engineering Portfolio';
  document.querySelector('meta[name="description"]').content = language === 'es' ? 'Portfolio público de automatización QA con Playwright, evidencia ejecutable, traces, CI y cobertura cross-browser.' : 'Public Playwright QA automation portfolio with executable evidence, traces, CI, and cross-browser coverage.';
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => { if (!originalText.has(node)) originalText.set(node, node.nodeValue); const source = originalText.get(node), key = source.trim(), value = language === 'es' ? (es[key] || key) : key; node.nodeValue = source.replace(key, value); });
  languageSelector.value = language;
}
applyLanguage();
languageSelector.addEventListener('change', event => { language = event.target.value; try { localStorage.setItem('playwright-portfolio-language', language); } catch {} applyLanguage(); });

const ui = {
  commit: document.querySelector('#commit-link'), generated: document.querySelector('#generated-at'), run: document.querySelector('#run-link'),
  button: document.querySelector('#run-showcase'), state: document.querySelector('#runner-state'), id: document.querySelector('#runner-id'),
  result: document.querySelector('#runner-result'), updated: document.querySelector('#runner-updated'), latest: document.querySelector('#latest-run-link'),
  site: document.querySelector('#runner-site'), suite: document.querySelector('#runner-suite'), siteResult: document.querySelector('#runner-site-result'), suiteResult: document.querySelector('#runner-suite-result'), target: document.querySelector('#runner-target'),
};
let runnerApi = '';
let pollTimer;

function displayRunner(run) {
  if (!run) return;
  ui.id.textContent = run.id;
  ui.siteResult.textContent = run.siteLabel || run.site || '—';
  ui.suiteResult.textContent = run.suite || '—';
  ui.result.textContent = run.status;
  ui.updated.textContent = new Date(run.updatedAt).toLocaleString(language);
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
    const response = await fetch(`${runnerApi}/runs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ site: ui.site.value, suite: ui.suite.value }) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || 'Run request rejected.');
    displayRunner(body);
  } catch (error) { ui.state.textContent = error.message; ui.button.disabled = false; }
}

async function loadLatestSite() {
  const option = ui.site.selectedOptions[0];
  ui.target.href = option.dataset.url;
  ui.target.textContent = `Open ${option.textContent}`;
  const count = ui.suite.value === 'full' ? option.dataset.fullTests : option.dataset.quickTests;
  ui.state.textContent = `Ready to run ${count} ${ui.suite.value} scenarios against ${option.textContent}.`;
  ui.id.textContent = '—'; ui.siteResult.textContent = option.textContent; ui.suiteResult.textContent = ui.suite.value; ui.result.textContent = 'Not run'; ui.updated.textContent = '—';
  ui.latest.href = 'report/index.html'; ui.latest.textContent = 'View published report';
  try {
    const response = await fetch(`${runnerApi}/runs/latest?site=${encodeURIComponent(ui.site.value)}&suite=${encodeURIComponent(ui.suite.value)}`);
    if (response.ok) displayRunner(await response.json());
  } catch { /* The selected site can still be requested. */ }
}

async function configureSites() {
  const response = await fetch(`${runnerApi}/sites`);
  if (!response.ok) throw new Error('Approved sites are temporarily unavailable.');
  const body = await response.json();
  ui.site.replaceChildren(...body.sites.map(site => {
    const option = document.createElement('option'); option.value = site.id; option.textContent = site.label; option.dataset.url = site.targetUrl; option.dataset.quickTests = site.quickTests; option.dataset.fullTests = site.fullTests; return option;
  }));
  ui.site.disabled = false; ui.button.disabled = false; ui.button.textContent = 'Run selected site';
  ui.site.addEventListener('change', loadLatestSite);
  ui.suite.addEventListener('change', loadLatestSite);
  await loadLatestSite();
}

fetch('status.json').then(response => response.ok ? response.json() : Promise.reject()).then(status => {
  const commit = status.commit || 'local';
  ui.commit.textContent = commit.slice(0, 7);
  ui.commit.href = `https://github.com/Hernan-dh/playwright_automation/commit/${commit}`;
  ui.generated.textContent = new Date(status.generatedAt).toLocaleString(language);
  if (status.runUrl) ui.run.href = status.runUrl;
  runnerApi = String(status.runnerApiUrl || '').replace(/\/$/, '');
  if (runnerApi) {
    ui.button.addEventListener('click', requestRun);
    configureSites().catch(error => { ui.state.textContent = error.message; });
  }
}).catch(() => { ui.commit.textContent = 'local preview'; ui.generated.textContent = 'not published'; });
