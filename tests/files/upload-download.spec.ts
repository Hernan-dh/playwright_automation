import { test, expect } from '@playwright/test';
import path from 'node:path';

test('FILE-01 uploads a generated fixture', async ({ page }) => {
  await page.setContent('<input type="file"><output></output>');
  await page.locator('input[type=file]').setInputFiles({ name: 'portfolio.txt', mimeType: 'text/plain', buffer: Buffer.from('Playwright portfolio') });
  await expect(page.locator('input[type=file]')).toHaveJSProperty('value', 'C:\\fakepath\\portfolio.txt');
});
test('FILE-02 waits for a download and saves it predictably', async ({ page }, testInfo) => {
  await page.setContent('<a download="evidence.txt" href="data:text/plain,evidence">Download</a>');
  const downloadPromise = page.waitForEvent('download'); await page.getByRole('link', { name: 'Download' }).click();
  const download = await downloadPromise; const target = path.join(testInfo.outputDir, await download.suggestedFilename());
  await download.saveAs(target); await expect.poll(async () => (await import('node:fs/promises')).stat(target).then(() => true, () => false)).toBe(true);
});
