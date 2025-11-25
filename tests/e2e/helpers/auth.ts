import { Page } from '@playwright/test';

/**
 * Helper de Autenticação
 * 
 * Esta função faz login no Strapi e pode ser reutilizada em todos os testes.
 * Isso evita repetir código e facilita a manutenção.
 */

export async function login(page: Page) {
  await page.goto('/admin');
  await page.fill('input[name="email"]', 'admin@satc.edu.br');
  await page.fill('input[name="password"]', 'welcomeToStrapi123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 10000 });
  // Aguarda o dashboard carregar completamente
  await page.waitForSelector('text=Hello Super', { timeout: 10000 });
}


