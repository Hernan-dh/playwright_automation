import { test, expect } from '../../src/fixtures/test';

test('@visual VIS-01 inventory matches its approved visual baseline', async ({ page, login, inventory, standardUser }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Visual baseline is reviewed only for desktop Chromium.');
  await login.goto(); await login.login(standardUser.username, standardUser.password); await inventory.expectLoaded();
  await expect(page).toHaveScreenshot('inventory.png', { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.02 });
});
