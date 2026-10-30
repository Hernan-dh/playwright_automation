import { test, expect } from '@playwright/test';
import http from 'node:http';

test('@performance PERF-01 enforces navigation and API timing budgets', async ({ page }) => {
  const server = http.createServer((request, response) => {
    if (request.url === '/api/catalog') {
      setTimeout(() => response.writeHead(200, { 'content-type': 'application/json' }).end('[{"name":"Backpack"}]'), 40);
      return;
    }
    response.writeHead(200, { 'content-type': 'text/html' }).end('<main><h1>Catalog</h1><script>fetch("/api/catalog").then(r=>r.json()).then(() => document.body.dataset.ready="true")</script></main>');
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Performance server did not start');
  try {
    await page.goto(`http://127.0.0.1:${address.port}`);
    await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const api = performance.getEntriesByName('/api/catalog')[0] || performance.getEntriesByType('resource').find(entry => entry.name.includes('/api/catalog'));
      return { navigationMs: navigation.duration, apiMs: api?.duration ?? Number.POSITIVE_INFINITY };
    });
    expect(metrics.navigationMs).toBeLessThan(1_500);
    expect(metrics.apiMs).toBeLessThan(500);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
