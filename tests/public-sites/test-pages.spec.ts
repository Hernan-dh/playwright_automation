import { expect, test } from '@playwright/test';

test('PUBLIC-PAGES-01 handles a JavaScript alert intentionally', async ({ page }) => {
  await page.goto('https://testpages.eviltester.com/pages/basics/alerts-javascript/');
  const dialogMessage = new Promise<string>(resolve => page.once('dialog', async dialog => {
    resolve(dialog.message());
    await dialog.accept();
  }));
  await page.getByRole('button', { name: 'Show alert box' }).click();
  await expect(await dialogMessage).toBeTruthy();
});

test('PUBLIC-PAGES-02 interacts with a standard text input', async ({ page }) => {
  await page.goto('https://testpages.eviltester.com/pages/input-elements/text-inputs/');
  const input = page.getByRole('textbox').first();
  await input.fill('Playwright portfolio');
  await expect(input).toHaveValue('Playwright portfolio');
});
