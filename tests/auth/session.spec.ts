import { test, expect } from '@playwright/test';
import path from 'node:path';

test('@session AUTH-03 reuses an authenticated browser state', async ({ browser }, testInfo) => {
  const statePath = path.join(testInfo.outputDir, 'authenticated-state.json');
  const setupContext = await browser.newContext();
  const setupPage = await setupContext.newPage();
  await setupPage.goto(process.env.UI_BASE_URL || 'https://www.saucedemo.com');
  await setupPage.getByPlaceholder('Username').fill('standard_user');
  await setupPage.getByPlaceholder('Password').fill('secret_sauce');
  await setupPage.getByRole('button', { name: 'Login' }).click();
  await expect(setupPage).toHaveURL(/inventory/);
  await setupContext.storageState({ path: statePath });
  await setupContext.close();

  const authenticatedContext = await browser.newContext({ storageState: statePath });
  const authenticatedPage = await authenticatedContext.newPage();
  await authenticatedPage.goto(`${process.env.UI_BASE_URL || 'https://www.saucedemo.com'}/inventory.html`);
  await expect(authenticatedPage.getByText('Products')).toBeVisible();
  await authenticatedContext.close();
});
