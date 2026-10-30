import { test, expect } from '@playwright/test';

test('UI-01 uses semantic locators for input, checkbox, radio and select', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/angularpractice/');
  await page.getByLabel('Check me out if you Love IceCreams!').check();
  await page.getByLabel('Employed').check();
  await page.getByLabel('Gender').selectOption('Female');
  await page.getByPlaceholder('Password').fill('abc123');
  await expect(page.getByLabel('Check me out if you Love IceCreams!')).toBeChecked();
});
