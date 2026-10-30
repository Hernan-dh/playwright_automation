import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: [
    '**/context/browser-context.spec.ts',
    '**/network/routes.spec.ts',
    '**/ui/browser-primitives.spec.ts',
  ],
  fullyParallel: true,
  retries: 0,
  reporter: [
    ['line'],
    ['html', { outputFolder: 'portfolio-artifacts/html-report', open: 'never' }],
  ],
  outputDir: 'portfolio-artifacts/test-results',
  use: {
    actionTimeout: 10_000,
    screenshot: 'on',
    trace: 'on',
    video: 'off',
  },
  projects: [{ name: 'chromium-showcase', use: { ...devices['Desktop Chrome'] } }],
});
