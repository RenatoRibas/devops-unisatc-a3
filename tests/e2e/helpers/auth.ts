import { Page } from '@playwright/test';

/**
 * Helper de Autenticação
 * 
 * Esta função faz login no Strapi e pode ser reutilizada em todos os testes.
 * Isso evita repetir código e facilita a manutenção.
 */

export async function login(page: Page) {
  await page.goto('/admin');
  
  // Aguarda o campo de email aparecer
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  
  // Verifica se já está logado (se não estiver na página de login)
  const currentUrl = page.url();
  if (!currentUrl.includes('/auth/login')) {
    // Já está logado, só aguarda o dashboard carregar
    await page.waitForLoadState('networkidle');
    return;
  }
  
  await page.fill('input[name="email"]', 'admin@satc.edu.br');
  await page.fill('input[name="password"]', 'welcomeToStrapi123');
  await page.click('button[type="submit"]');
  
  // Aguarda sair da página de login (redirecionamento)
  await page.waitForURL(
    (url) => !url.pathname.includes('/auth/login'),
    { timeout: 30000 }
  );
  
  // Aguarda o dashboard carregar completamente
  // Tenta vários seletores que indicam que está logado
  await Promise.race([
    page.waitForSelector('text=Hello', { timeout: 10000 }).catch(() => null),
    page.waitForSelector('text=Welcome', { timeout: 10000 }).catch(() => null),
    page.waitForSelector('[data-testid="main-nav"]', { timeout: 10000 }).catch(() => null),
    page.waitForSelector('nav', { timeout: 10000 }).catch(() => null),
  ]);
  
  // Aguarda a página estar completamente carregada
  await page.waitForLoadState('networkidle');
}


