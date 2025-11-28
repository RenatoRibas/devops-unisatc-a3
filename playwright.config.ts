import { defineConfig, devices } from '@playwright/test';

const DEFAULT_BASE_URL = 'http://localhost:1337';
const baseURL = process.env.STRAPI_URL || DEFAULT_BASE_URL;
const adminUrl = `${baseURL.replace(/\/$/, '')}/admin`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  timeout: 60_000,
  globalSetup: './tests/e2e/global-setup.ts',
  use: {
    baseURL,
    storageState: 'storageState.json',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.CI
    ? {
        command: 'pnpm start',
        url: adminUrl,
        reuseExistingServer: true,
        timeout: 180_000,
      }
    : undefined,
});
