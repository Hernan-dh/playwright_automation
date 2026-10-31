import { expect, test } from '@playwright/test';

test('@quick PUBLIC-EXPAND-01 authenticates with documented practice credentials', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');
  await page.getByLabel('Username').fill('practice');
  await page.getByLabel('Password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/secure/);
  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
});

test('@quick PUBLIC-EXPAND-02 reports an invalid username safely', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');
  await page.getByLabel('Username').fill('portfolio-invalid-user');
  await page.getByLabel('Password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#flash')).toContainText('Your username is invalid!');
});

test('PUBLIC-EXPAND-03 edits web inputs', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/inputs');
  await page.locator('#input-text').fill('Playwright');
  await page.locator('#input-number').fill('42');
  await expect(page.locator('#input-text')).toHaveValue('Playwright');
});

test('PUBLIC-EXPAND-04 toggles checkboxes', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/checkboxes');
  const boxes = page.locator('input[type="checkbox"]'); await boxes.first().check();
  await expect(boxes.first()).toBeChecked();
});

test('PUBLIC-EXPAND-05 selects a dropdown value', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/dropdown');
  await page.locator('#dropdown').selectOption('2'); await expect(page.locator('#dropdown')).toHaveValue('2');
});

test('PUBLIC-EXPAND-06 validates a dynamic table', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/dynamic-table');
  await expect(page.locator('table')).toBeVisible(); await expect(page.locator('tbody tr')).not.toHaveCount(0);
});

test('PUBLIC-EXPAND-07 completes the documented OTP flow', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/otp-login');
  await page.getByLabel('Email Address').fill('practice@expandtesting.com');
  await page.getByRole('button', { name: /send otp/i }).click();
  await page.getByRole('spinbutton', { name: 'Enter OTP code' }).fill('214365');
  await page.getByRole('button', { name: 'Verify OTP Code' }).click();
  await expect(page).toHaveURL(/secure/);
});

test('PUBLIC-EXPAND-08 exposes browser information', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/my-browser');
  await expect(page.getByRole('heading', { name: /browser/i })).toBeVisible();
});
