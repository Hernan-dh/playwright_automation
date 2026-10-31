import { defineConfig, devices } from '@playwright/test';

const site = process.env.PUBLIC_SITE_ID;
const suite = process.env.PUBLIC_SUITE || 'full';
const outputRoot = process.env.SHOWCASE_OUTPUT_ROOT || 'public-site-artifacts';
const allowedSites = new Set(['saucedemo', 'the-internet', 'test-pages', 'expand-testing', 'automation-exercise']);

if (!site || !allowedSites.has(site)) throw new Error('PUBLIC_SITE_ID must identify an approved public test site.');
if (!['quick', 'full'].includes(suite)) throw new Error('PUBLIC_SUITE must be quick or full.');

export default defineConfig({
  testDir: './tests/public-sites',
  testMatch: `**/${site}.spec.ts`,
  grep: suite === 'quick' ? /@quick/ : undefined,
  fullyParallel: false,
  workers: 1,
  retries: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['line'],
    ['html', { outputFolder: `${outputRoot}/html-report`, open: 'never' }],
  ],
  outputDir: `${outputRoot}/test-results`,
  use: {
    ...devices['Desktop Chrome'],
    actionTimeout: 12_000,
    navigationTimeout: 20_000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'off',
  },
  projects: [{ name: `chromium-${site}`, use: { ...devices['Desktop Chrome'] } }],
});
