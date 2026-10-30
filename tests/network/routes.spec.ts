import { test, expect } from '@playwright/test';

async function app(page: import('@playwright/test').Page) {
  await page.route('https://portfolio.local/', route => route.fulfill({ contentType: 'text/html', body: '<button>Load</button><p aria-live="polite"></p><ul></ul>' }));
  await page.goto('https://portfolio.local/');
}
test('@network NET-01 fulfills a deterministic API response', async ({ page }) => {
  await app(page); await page.route('**/catalog', route => route.fulfill({ contentType: 'application/json', body: '[{"name":"Mocked Backpack"}]' }));
  await page.evaluate(() => fetch('/catalog').then(r => r.json()).then(items => document.querySelector('ul')!.textContent = items[0].name));
  await expect(page.getByText('Mocked Backpack')).toBeVisible();
});
test('@network NET-02 makes a request mutation observable', async ({ page }) => {
  await app(page); let header = '';
  await page.route('**/catalog', route => { header = route.request().headers()['x-test-scenario'] || ''; return route.fulfill({ body: '[]', contentType: 'application/json' }); });
  await page.evaluate(() => fetch('/catalog', { headers: { 'x-test-scenario': 'portfolio' } }));
  expect(header).toBe('portfolio');
});
test('@network NET-03 handles a controlled backend failure', async ({ page }) => {
  await app(page); await page.route('**/catalog', route => route.fulfill({ status: 503, body: 'unavailable' }));
  await page.evaluate(() => fetch('/catalog').then(r => document.querySelector('p')!.textContent = r.ok ? 'Loaded' : 'Catalogue unavailable. Try again.'));
  await expect(page.getByText('Catalogue unavailable. Try again.')).toBeVisible();
});

test('@network NET-04 modifies an upstream response before it reaches the UI', async ({ page }) => {
  await app(page);
  await page.route('**/catalog', async route => {
    const upstream = { items: [{ name: 'Original product' }] };
    upstream.items[0].name = 'Modified by Playwright';
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(upstream) });
  });
  await page.evaluate(() => fetch('/catalog').then(r => r.json()).then(body => document.querySelector('ul')!.textContent = body.items[0].name));
  await expect(page.getByText('Modified by Playwright')).toBeVisible();
});

test('@network NET-05 aborts an unnecessary resource', async ({ page }) => {
  await app(page);
  let failedRequest = '';
  page.on('requestfailed', request => { failedRequest = request.url(); });
  await page.route('**/analytics.js', route => route.abort('blockedbyclient'));
  await page.evaluate(() => new Promise<void>(resolve => {
    const script = document.createElement('script');
    script.src = '/analytics.js';
    script.onerror = () => resolve();
    document.body.appendChild(script);
  }));
  expect(failedRequest).toContain('/analytics.js');
});
