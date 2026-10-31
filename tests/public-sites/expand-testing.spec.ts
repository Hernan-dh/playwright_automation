import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => { await page.goto('https://practice.expandtesting.com/login'); });

test('PUBLIC-EXPAND-01 authenticates with documented practice credentials', async ({ page }) => {
  await page.getByLabel('Username').fill('practice');
  await page.getByLabel('Password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/secure/);
  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
});

test('PUBLIC-EXPAND-02 reports an invalid username safely', async ({ page }) => {
  await page.getByLabel('Username').fill('portfolio-invalid-user');
  await page.getByLabel('Password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#flash')).toContainText('Your username is invalid!');
});
