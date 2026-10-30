import { test, expect } from '@playwright/test';

test('@mobile MOBILE-01 exposes an accessible navigation menu on narrow viewports', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes('Mobile'), 'This scenario targets a mobile project.');
  await page.setContent(`
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      nav { display: flex; gap: 1rem; }
      button { display: none; }
      @media (max-width: 600px) { nav { display: none; } button { display: block; min-width: 44px; min-height: 44px; } nav[data-open="true"] { display: flex; flex-direction: column; } }
    </style>
    <button aria-expanded="false" aria-controls="main-nav">Menu</button>
    <nav id="main-nav"><a href="#catalog">Catalog</a><a href="#cart">Cart</a></nav>
    <script>document.querySelector('button').onclick = event => { const open = event.target.getAttribute('aria-expanded') !== 'true'; event.target.setAttribute('aria-expanded', String(open)); document.querySelector('nav').dataset.open = String(open); };</script>`);
  const menu = page.getByRole('button', { name: 'Menu' });
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Cart' })).toBeVisible();
});

test('@mobile MOBILE-02 prevents horizontal overflow', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes('Mobile'), 'This scenario targets a mobile project.');
  await page.setContent('<meta name="viewport" content="width=device-width"><main style="max-width:100%;overflow-wrap:anywhere"><h1>Responsive catalog</h1><p>Content remains inside the viewport.</p></main>');
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});
