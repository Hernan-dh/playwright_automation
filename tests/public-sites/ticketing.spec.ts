import { expect, test } from '@playwright/test';

const baseUrl = 'https://ticketing-hdh.duckdns.org';

async function openCatalog(page: import('@playwright/test').Page) {
  await page.goto(`${baseUrl}/`);
}

test('@quick PUBLIC-TICKET-01 loads the public event catalog', async ({ page }) => {
  await openCatalog(page);
  await expect(page).toHaveTitle(/Ticketing/i);
  await expect(page.locator('#event-list')).toBeVisible();
  await expect(page.locator('.event-card').first()).toBeVisible();
});

test('@quick PUBLIC-TICKET-02 exposes the service health contract', async ({ request }) => {
  const response = await request.get(`${baseUrl}/api/health`);
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ status: 'ok', payments: 'demo' });
});

test('PUBLIC-TICKET-03 publishes demo payment methods', async ({ request }) => {
  const response = await request.get(`${baseUrl}/api/payment-methods`);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.provider).toBe('demo');
  expect(body.methods.length).toBeGreaterThan(0);
});

test('PUBLIC-TICKET-04 searches the catalog by a published event name', async ({ page, request }) => {
  await openCatalog(page);
  const catalog = await (await request.get(`${baseUrl}/api/events`)).json();
  const event = catalog.events[0];
  expect(event?.name).toBeTruthy();
  await page.getByLabel(/Search events|Buscar eventos/i).fill(event.name);
  await expect(page.locator('.event-card')).toHaveCount(1);
  await expect(page.locator('.event-card h3')).toHaveText(event.name);
});

test('PUBLIC-TICKET-05 filters the catalog by brand', async ({ page }) => {
  await openCatalog(page);
  const filter = page.getByLabel(/Filter by brand|Filtrar por marca/i);
  const value = await filter.locator('option').nth(1).getAttribute('value');
  expect(value).toBeTruthy();
  await filter.selectOption(value!);
  await expect(page.locator('.event-card').first()).toBeVisible();
  const labels = await page.locator('.event-card .brand-label').allTextContents();
  expect(new Set(labels.map(label => label.trim())).size).toBe(1);
});

test('PUBLIC-TICKET-06 opens an event and returns to the catalog', async ({ page }) => {
  await openCatalog(page);
  const eventName = (await page.locator('.event-card h3').first().textContent())!.trim();
  await page.locator('.event-card').first().getByRole('button').first().click();
  await expect(page.getByRole('heading', { level: 1, name: eventName })).toBeVisible();
  await page.getByRole('button', { name: /Back to events|Volver a eventos/i }).click();
  await expect(page.locator('#event-list')).toBeVisible();
});

test('PUBLIC-TICKET-07 selects and clears an available seat without creating a hold', async ({ page }) => {
  await openCatalog(page);
  await page.locator('.event-card').first().getByRole('button').first().click();
  await page.getByText(/Accessible seat selection|Selecci[oó]n accesible de asientos/i).click();
  const seat = page.locator('.seat-buttons button:not(:disabled)').first();
  await seat.click();
  await expect(seat).toHaveAttribute('aria-pressed', 'true');
  await seat.click();
  await expect(seat).toHaveAttribute('aria-pressed', 'false');
});

test('PUBLIC-TICKET-08 rejects an invalid operator credential', async ({ page }) => {
  await openCatalog(page);
  await page.getByRole('button', { name: /Sales|Ventas/i }).click();
  await page.getByLabel(/Operator key|Clave de operador/i).fill('invalid-public-practice-key');
  await page.getByRole('button', { name: /Log in|Ingresar/i }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByText(/verified session|Sesi[oó]n verificada/i)).toHaveCount(0);
});
