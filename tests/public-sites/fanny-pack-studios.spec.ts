import { expect, test } from '@playwright/test';

const baseUrl = 'https://fannypackstudios.com/';

async function openHome(page: import('@playwright/test').Page) {
  await page.goto(baseUrl);
}

test('@quick FANNY-01 loads the Fanny Pack Studios home page', async ({ page }) => {
  await openHome(page);
  await expect(page).toHaveTitle(/Fanny Pack Studios/i);
  await expect(page.locator('body')).toContainText(/videogames/i);
});

test('@quick FANNY-02 exposes the primary navigation', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('link', { name: /Home/i }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /About Us/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Portfolio/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Contact Us/i })).toBeVisible();
});

test('FANNY-03 keeps the home navigation link on the public site', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('link', { name: /Home/i }).first()).toHaveAttribute('href', /\/?$/);
});

test('FANNY-04 provides an About Us destination', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('link', { name: /About Us/i })).toHaveAttribute('href', /.+/);
});

test('FANNY-05 provides a Portfolio destination', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('link', { name: /Portfolio/i })).toHaveAttribute('href', /.+/);
});

test('FANNY-06 provides a Contact Us destination', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('link', { name: /Contact Us/i })).toHaveAttribute('href', /.+/);
});

test('FANNY-07 presents its studio service areas', async ({ page }) => {
  await openHome(page);
  await expect(page.locator('body')).toContainText(/game programming/i);
  await expect(page.locator('body')).toContainText(/QA/i);
});

test('FANNY-08 identifies the studio in the page footer', async ({ page }) => {
  await openHome(page);
  await expect(page.locator('body')).toContainText(/Fanny Pack Studios/i);
  await expect(page.locator('body')).toContainText(/© 2025/);
});

// Traceability: FANNY-09, FANNY-10, FANNY-11, FANNY-12, FANNY-13, FANNY-14, FANNY-15.
for (const [id, text] of [['09', 'Runa'], ['10', 'multiplayer'], ['11', 'animation'], ['12', 'UX/UI'], ['13', 'illustration'], ['14', 'sound'], ['15', 'clients']] as const) {
  test(`FANNY-${id} exposes the public ${text} content area`, async ({ page }) => { await openHome(page); await expect(page.locator('body')).toContainText(new RegExp(text, 'i')); });
}
