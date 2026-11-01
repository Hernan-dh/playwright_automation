import { expect, test } from '@playwright/test';

const baseUrl = 'https://hernan-dh.github.io/portfolio/';

async function openHome(page: import('@playwright/test').Page) {
  await page.goto(baseUrl);
}

test('@quick PORTFOLIO-01 loads the professional portfolio', async ({ page }) => {
  await openHome(page);
  await expect(page).toHaveTitle(/Hern.n de Haro.*Portfolio/i);
  await expect(page.getByRole('heading', { name: /Hern.n de Haro/i })).toBeVisible();
});

test('@quick PORTFOLIO-02 exposes the primary sections', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('link', { name: /Projects/i })).toHaveAttribute('href', '#projects');
  await expect(page.getByRole('link', { name: /Profile/i })).toHaveAttribute('href', '#profile');
  await expect(page.getByRole('link', { name: /Contact/i })).toHaveAttribute('href', '#contact');
});

test('PORTFOLIO-03 presents selected technical work', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('heading', { name: /Selected work/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI Operations Desk' })).toBeVisible();
});

test('PORTFOLIO-04 links to the public QA engineering evidence', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('heading', { name: /Playwright QA Engineering/i })).toBeVisible();
  await expect(page.locator('a[href="https://hernan-dh.github.io/playwright_automation/"]')).toBeVisible();
});

test('PORTFOLIO-05 changes the interface language locally', async ({ page }) => {
  await openHome(page);
  await page.locator('#language-selector').selectOption('es');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('link', { name: 'Proyectos' })).toBeVisible();
});

test('PORTFOLIO-06 changes the interface theme locally', async ({ page }) => {
  await openHome(page);
  const initialTheme = await page.locator('html').getAttribute('data-theme');
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', initialTheme || '');
});

test('PORTFOLIO-07 exposes professional contact links', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('heading', { name: /Contact/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /github\.com\/Hernan-dh/i })).toHaveAttribute('href', 'https://github.com/Hernan-dh');
});

test('PORTFOLIO-08 identifies the portfolio source in the footer', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('link', { name: /Portfolio source/i })).toHaveAttribute('href', 'https://github.com/Hernan-dh/portfolio');
});

// Traceability: PORTFOLIO-09, PORTFOLIO-10, PORTFOLIO-11, PORTFOLIO-12, PORTFOLIO-13, PORTFOLIO-14, PORTFOLIO-15.
for (const [id, heading] of [['09', 'Coder'], ['10', 'Engineering Team'], ['11', 'Agentic Twin'], ['12', 'Deep Research'], ['13', 'AI Debate'], ['14', 'Financial Researcher'], ['15', 'Stock Picker']] as const) {
  test(`PORTFOLIO-${id} presents ${heading} as public work`, async ({ page }) => { await openHome(page); await expect(page.getByRole('heading', { name: heading })).toBeVisible(); });
}
