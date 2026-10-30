import { test, expect } from '@playwright/test';

test.describe('SauceDemo authenticated seed', () => {
  test('open the product inventory', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products')).toBeVisible();
  });
});
