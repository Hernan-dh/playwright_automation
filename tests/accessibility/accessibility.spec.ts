import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@accessibility A11Y-01 has no serious or critical accessibility violations', async ({ page }) => {
  await page.setContent(`
    <main>
      <h1>Accessible checkout</h1>
      <label for="email">Email</label><input id="email" type="email">
      <button type="button">Continue</button>
    </main>`);
  await page.evaluate(() => {
    document.documentElement.lang = 'en';
    document.title = 'Accessible checkout';
  });
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter(violation => ['serious', 'critical'].includes(violation.impact || ''));
  expect(blocking, blocking.map(v => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
});
