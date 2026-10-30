import { test, expect } from '@playwright/test';

test('@cross-browser COMPAT-01 supports standards-based form interaction', async ({ page, browserName }) => {
  await page.setContent(`
    <form><label>Email <input type="email" required></label><button>Submit</button></form><p role="status"></p>
    <script>document.querySelector('form').onsubmit = event => { event.preventDefault(); document.querySelector('[role=status]').textContent = 'Submitted'; };</script>`);
  await page.getByLabel('Email').fill(`qa-${browserName}@example.com`);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('status')).toHaveText('Submitted');
});

test('@cross-browser COMPAT-02 persists browser storage consistently', async ({ page }) => {
  await page.route('https://portfolio.local/', route => route.fulfill({ contentType: 'text/html', body: '<h1>Storage</h1>' }));
  await page.goto('https://portfolio.local/');
  await page.evaluate(() => localStorage.setItem('preference', 'compact'));
  await page.reload();
  expect(await page.evaluate(() => localStorage.getItem('preference'))).toBe('compact');
});
