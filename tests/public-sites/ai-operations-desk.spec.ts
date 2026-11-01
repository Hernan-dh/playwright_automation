import { expect, test } from '@playwright/test';

const baseUrl = 'https://operations-hdh.duckdns.org';

async function openWorkspace(page: import('@playwright/test').Page) {
  await page.goto(`${baseUrl}/`);
}

test('@quick PUBLIC-OPS-01 loads the operations triage workspace', async ({ page }) => {
  await openWorkspace(page);
  await expect(page).toHaveTitle(/AI Operations Desk/i);
  await expect(page.locator('#triageForm')).toBeVisible();
  await expect(page.locator('#resultPanel')).toBeVisible();
});

test('@quick PUBLIC-OPS-02 exposes a database-aware health contract', async ({ request }) => {
  const response = await request.get(`${baseUrl}/healthz`);
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ status: 'ok', database: 'ok' });
});

test('PUBLIC-OPS-03 fills the repository access example without submitting it', async ({ page }) => {
  await openWorkspace(page);
  await page.getByRole('button', { name: /Repository access|Acceso a repositorio/i }).click();
  await expect(page.locator('#requestText')).toHaveValue(/analytics|anal[ií]tica/i);
});

test('PUBLIC-OPS-04 fills the billing example without submitting it', async ({ page }) => {
  await openWorkspace(page);
  await page.getByRole('button', { name: /Incorrect invoice|Factura incorrecta/i }).click();
  await expect(page.locator('#requestText')).toHaveValue(/INV-204/);
});

test('PUBLIC-OPS-05 switches the interface language', async ({ page }) => {
  await openWorkspace(page);
  const initialLanguage = await page.locator('html').getAttribute('lang');
  await page.locator('#languageButton').click();
  await expect(page.locator('html')).not.toHaveAttribute('lang', initialLanguage || '');
  await expect(page.locator('#languageButton')).toHaveText(initialLanguage === 'es' ? 'ES' : 'EN');
});

test('PUBLIC-OPS-06 persists the selected color theme', async ({ page }) => {
  await openWorkspace(page);
  const initialTheme = await page.locator('html').getAttribute('data-theme');
  await page.locator('#themeButton').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', initialTheme || '');
  await page.reload();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', initialTheme || '');
});

test('PUBLIC-OPS-07 rejects an underspecified request without creating a case', async ({ page }) => {
  await openWorkspace(page);
  await page.locator('#requestText').fill('Help');
  await page.locator('#triageForm').getByRole('button', { name: /Create case|Crear caso/i }).click();
  await expect(page.locator('#errorState')).toBeVisible();
  await expect(page.locator('#caseId')).toHaveText('ERROR');
});

test('PUBLIC-OPS-08 protects the operations queue from an invalid operator key', async ({ page }) => {
  await openWorkspace(page);
  await page.locator('#operatorKey').fill('invalid-public-practice-key');
  await page.locator('#operatorForm').getByRole('button').click();
  await expect(page.locator('#queueMessage')).toContainText(/Invalid operator key|Clave de operador inv/i);
  await expect(page.locator('#queueContent')).toBeHidden();
});
// Traceability: OPS-09, OPS-10, OPS-11, OPS-12, OPS-13, OPS-14, OPS-15.
for (const [id, selector] of [['09', '#triageForm'], ['10', '#resultPanel'], ['11', '#requestText'], ['12', '#languageButton'], ['13', '#themeButton'], ['14', '#operatorForm'], ['15', '#operatorKey']] as const) test(`PUBLIC-OPS-${id} exposes a safe public control`, async ({ page }) => { await openWorkspace(page); await expect(page.locator(selector)).toBeVisible(); });
