import { test, expect } from '@playwright/test';

const origin = 'https://portfolio.local';

test('@context CTX-01 supplies an approved geolocation to the application', async ({ context, page }) => {
  await context.grantPermissions(['geolocation'], { origin });
  await context.setGeolocation({ latitude: -34.6037, longitude: -58.3816 });
  await page.route(`${origin}/`, route => route.fulfill({
    contentType: 'text/html',
    body: '<output aria-label="location">Waiting</output>',
  }));

  await page.goto(origin);
  await page.evaluate(() => navigator.geolocation.getCurrentPosition(position => {
    document.querySelector('output')!.textContent =
      `${position.coords.latitude.toFixed(4)},${position.coords.longitude.toFixed(4)}`;
  }));

  await expect(page.getByLabel('location')).toHaveText('-34.6037,-58.3816');
});

test('@context CTX-02 exposes a controlled offline state to the application', async ({ context, page }) => {
  await page.route(`${origin}/`, route => route.fulfill({
    contentType: 'text/html',
    body: '<output aria-live="polite">Online</output>',
  }));
  await page.goto(origin);
  await context.setOffline(true);

  await page.evaluate(() => fetch('/health').catch(() => {
    document.querySelector('output')!.textContent = 'Offline: retry later';
  }));

  await expect(page.getByText('Offline: retry later')).toBeVisible();
});

test('@context TIME-01 advances application timers without a real wait', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-01-15T12:00:00Z') });
  await page.setContent('<output aria-live="polite">Pending</output>');
  await page.evaluate(() => setTimeout(() => {
    document.querySelector('output')!.textContent = `Ready at ${new Date().toISOString()}`;
  }, 5_000));

  await page.clock.fastForward(5_000);

  await expect(page.getByRole('status')).toHaveText(/^Ready at 2026-01-15T12:00:05\.\d{3}Z$/);
});
