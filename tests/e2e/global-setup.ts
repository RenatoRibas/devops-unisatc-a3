import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const baseURL = process.env.STRAPI_URL || 'http://localhost:1337';
  const adminUrl = `${baseURL.replace(/\/$/, '')}/admin`;

  await page.goto(adminUrl);

  await page.fill('input[name="email"]', 'admin@satc.edu.br');
  await page.fill('input[name="password"]', 'welcomeToStrapi123');
  await page.click('button[type="submit"]');

  await page.waitForURL(url => {
    const { pathname } = new URL(url);
    return pathname.startsWith('/admin') && !pathname.includes('/auth/login');
  });

  await context.storageState({ path: 'storageState.json' });

  await browser.close();
}

export default globalSetup;
