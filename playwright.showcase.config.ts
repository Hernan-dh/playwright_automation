import { defineConfig, devices } from '@playwright/test';

const outputRoot = process.env.SHOWCASE_OUTPUT_ROOT || 'portfolio-artifacts';
const workers = process.env.SHOWCASE_WORKERS
  ? Number.parseInt(process.env.SHOWCASE_WORKERS, 10)
  : undefined;

export default defineConfig({
  testDir: './tests',
  testMatch: [
    '**/context/browser-context.spec.ts',
    '**/network/routes.spec.ts',
    '**/ui/browser-primitives.spec.ts',
  ],
  fullyParallel: true,
  workers,
  retries: 0,
  reporter: [
    ['line'],
    ['html', { outputFolder: `${outputRoot}/html-report`, open: 'never' }],
  ],
  outputDir: `${outputRoot}/test-results`,
  use: {
    actionTimeout: 10_000,
    screenshot: 'on',
    trace: 'on',
    video: 'off',
  },
  projects: [{ name: 'chromium-showcase', use: { ...devices['Desktop Chrome'] } }],
});
