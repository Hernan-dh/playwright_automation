import { test as setup, expect } from '@playwright/test';
import fs from 'node:fs/promises';

setup('SETUP-01 authenticate the standard demo user', async ({ page }) => {
  await fs.mkdir('storage-state', { recursive: true });
  await page.goto(process.env.UI_BASE_URL || 'https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory/);
  await page.context().storageState({ path: 'storage-state/saucedemo.json' });
});
