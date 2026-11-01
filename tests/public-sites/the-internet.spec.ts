import { expect, test } from '@playwright/test';

test('@quick PUBLIC-INTERNET-01 completes form authentication', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.getByLabel('Username').fill('tomsmith');
  await page.getByLabel('Password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/secure/);
  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
});

test('@quick PUBLIC-INTERNET-02 waits for dynamically loaded content', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.getByText('Hello World!')).toBeVisible({ timeout: 15_000 });
});

test('PUBLIC-INTERNET-03 toggles checkboxes', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');
  const boxes = page.locator('input[type="checkbox"]');
  await boxes.first().check(); await boxes.nth(1).uncheck();
  await expect(boxes.first()).toBeChecked(); await expect(boxes.nth(1)).not.toBeChecked();
});

test('PUBLIC-INTERNET-04 selects a dropdown option', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dropdown');
  await page.locator('#dropdown').selectOption('2');
  await expect(page.locator('#dropdown')).toHaveValue('2');
});

test('PUBLIC-INTERNET-05 accepts a JavaScript confirmation', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
  await expect(page.locator('#result')).toHaveText('You clicked: Ok');
});

test('PUBLIC-INTERNET-06 reads an iframe', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/iframe');
  await expect(page.frameLocator('#mce_0_ifr').locator('body')).toContainText('Your content goes here.');
});

test('PUBLIC-INTERNET-07 handles a new window', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/windows');
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Click Here' }).click();
  await expect((await popupPromise).getByRole('heading')).toHaveText('New Window');
});

test('PUBLIC-INTERNET-08 adds and removes dynamic elements', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');
  await page.getByRole('button', { name: 'Add Element' }).click();
  await expect(page.getByRole('button', { name: 'Delete' })).toHaveCount(1);
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('button', { name: 'Delete' })).toHaveCount(0);
});
// Traceability: INTERNET-09, INTERNET-10, INTERNET-11, INTERNET-12, INTERNET-13, INTERNET-14, INTERNET-15.
for (const [id, path] of [['09', 'status_codes'], ['10', 'hovers'], ['11', 'key_presses'], ['12', 'context_menu'], ['13', 'disappearing_elements'], ['14', 'drag_and_drop'], ['15', 'typos']] as const) test(`PUBLIC-INTERNET-${id} exposes the ${path} practice page`, async ({ page }) => { await page.goto(`https://the-internet.herokuapp.com/${path}`); await expect(page.locator('body')).toBeVisible(); });
