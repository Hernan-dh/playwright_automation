import { test, expect } from '@playwright/test';

test('AUTH-05 starts from the setup project authenticated state', async ({ page }) => {
  await page.goto(`${process.env.UI_BASE_URL || 'https://www.saucedemo.com'}/inventory.html`);
  await expect(page.getByText('Products')).toBeVisible();
});
