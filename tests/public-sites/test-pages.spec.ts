import { expect, test } from '@playwright/test';

test('@quick PUBLIC-PAGES-01 handles a JavaScript alert intentionally', async ({ page }) => {
  await page.goto('https://testpages.eviltester.com/pages/basics/alerts-javascript/');
  const dialogMessage = new Promise<string>(resolve => page.once('dialog', async dialog => {
    resolve(dialog.message());
    await dialog.accept();
  }));
  await page.getByRole('button', { name: 'Show alert box' }).click();
  await expect(await dialogMessage).toBeTruthy();
});

test('@quick PUBLIC-PAGES-02 interacts with a standard text input', async ({ page }) => {
  await page.goto('https://testpages.eviltester.com/pages/input-elements/text-inputs/');
  const input = page.getByRole('textbox').first();
  await input.fill('Playwright portfolio');
  await expect(input).toHaveValue('Playwright portfolio');
});

// Traceability: PAGES-03, PAGES-04, PAGES-05, PAGES-06, PAGES-07, PAGES-08.
for (const [id, path, heading] of [
  ['03', 'basics', 'Basics'], ['04', 'input-elements', 'Input Elements'], ['05', 'forms', 'Forms'],
  ['06', 'navigation', 'Navigation'], ['07', 'storage', 'Storage'], ['08', 'web-components', 'Web Components'],
] as const) {
  test(`PUBLIC-PAGES-${id} exposes the ${heading} practice collection`, async ({ page }) => {
    await page.goto(`https://testpages.eviltester.com/pages/${path}/`);
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  });
}
