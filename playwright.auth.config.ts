import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results/auth-project',
  reporter: [['html', { outputFolder: 'playwright-report/auth-project', open: 'never' }]],
  projects: [
    {
      name: 'authentication-setup',
      testMatch: '**/setup/auth.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'authenticated-chromium',
      dependencies: ['authentication-setup'],
      testMatch: '**/auth/preauthenticated.spec.ts',
      use: { ...devices['Desktop Chrome'], storageState: 'storage-state/saucedemo.json' },
    },
  ],
});
