import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.STRAPI_URL || 'http://localhost:1337',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // webServer desabilitado - rode o Strapi manualmente com: pnpm dev
  // Descomente as linhas abaixo se quiser que o Playwright inicie o Strapi automaticamente
  // webServer: {
  //   command: 'pnpm dev',
  //   url: 'http://localhost:1337/admin',
  //   reuseExistingServer: true,
  //   timeout: 180 * 1000,
  //   stdout: 'ignore',
  //   stderr: 'pipe',
  // },
});