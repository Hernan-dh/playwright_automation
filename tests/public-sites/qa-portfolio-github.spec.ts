import { expect, test } from '@playwright/test';

const baseUrl = 'https://hernan-dh.github.io/playwright_automation/';

async function openHome(page: import('@playwright/test').Page) {
  await page.goto(baseUrl);
}

test('@quick QAPORT-01 loads the QA engineering portfolio', async ({ page }) => {
  await openHome(page);
  await expect(page).toHaveTitle(/Playwright QA Engineering Portfolio/i);
  await expect(page.getByRole('heading', { name: /Evidence-first testing/i })).toBeVisible();
});

test('@quick QAPORT-02 exposes the QA portfolio navigation', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('link', { name: 'Coverage' })).toHaveAttribute('href', '#coverage');
  await expect(page.getByRole('link', { name: 'Pipeline' })).toHaveAttribute('href', '#pipeline');
  await expect(page.getByRole('link', { name: 'Evidence', exact: true })).toHaveAttribute('href', '#evidence');
});

test('QAPORT-03 links to the published HTML report', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('link', { name: /Explore the HTML report/i })).toHaveAttribute('href', 'report/index.html');
});

test('QAPORT-04 links to its GitHub source repository', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('link', { name: /View source on GitHub/i })).toHaveAttribute('href', 'https://github.com/Hernan-dh/playwright_automation');
});

test('QAPORT-05 presents risk-based coverage', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('heading', { name: /Multiple test layers/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Critical E2E' })).toBeVisible();
});

test('QAPORT-06 changes the visible interface language locally', async ({ page }) => {
  await openHome(page);
  await page.locator('#language-selector').selectOption('es');
  await expect(page.getByRole('link', { name: 'Cobertura' })).toBeVisible();
});

test('QAPORT-07 presents controlled public execution', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('heading', { name: /Choose a live practice site/i })).toBeVisible();
  await expect(page.locator('#runner-site')).toBeVisible();
});

test('QAPORT-08 links back to the main portfolio', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('link', { name: 'Main portfolio' }).first()).toHaveAttribute('href', 'https://hernan-dh.github.io/portfolio/');
});

// Traceability: QAPORT-09, QAPORT-10, QAPORT-11, QAPORT-12, QAPORT-13, QAPORT-14, QAPORT-15.
for (const [id, heading] of [['09', 'API & contracts'], ['10', 'Browser behavior'], ['11', 'Quality attributes'], ['12', 'From change to inspectable evidence.'], ['13', 'Claims backed by executable artifacts.'], ['14', 'Public evidence'], ['15', 'Playwright HTML report']] as const) {
  test(`QAPORT-${id} exposes ${heading} evidence`, async ({ page }) => { await openHome(page); await expect(page.getByText(heading, { exact: true }).first()).toBeVisible(); });
}
