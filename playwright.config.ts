import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/bdd/**', '**/mocha/**', '**/setup/**', '**/auth/preauthenticated.spec.ts'],
  globalSetup: './src/global-setup.ts',
  globalTeardown: './src/global-teardown.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL: process.env.UI_BASE_URL || 'https://www.saucedemo.com',
    actionTimeout: 10_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
});
