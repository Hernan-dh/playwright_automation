import { test, expect } from '@playwright/test';

test('UX-01 handles a browser dialog intentionally', async ({ page }) => {
  await page.setContent('<button onclick="alert(\'Saved\')">Save</button>');
  page.once('dialog', async dialog => { expect(dialog.message()).toBe('Saved'); await dialog.accept(); });
  await page.getByRole('button', { name: 'Save' }).click();
});
test('UX-02 accesses an iframe by its content', async ({ page }) => {
  await page.setContent('<iframe title="editor" srcdoc="<button>Publish</button>"></iframe>');
  await expect(page.frameLocator('iframe[title="editor"]').getByRole('button', { name: 'Publish' })).toBeVisible();
});
test('UX-03 waits for a new tab without race conditions', async ({ page, context }) => {
  await page.setContent('<a target="_blank" href="about:blank">Docs</a>');
  const [tab] = await Promise.all([context.waitForEvent('page'), page.getByRole('link', { name: 'Docs' }).click()]);
  await tab.setContent('<h1>Documentation</h1>');
  await expect(tab.getByRole('heading', { name: 'Documentation' })).toBeVisible();
});
