import { test, expect } from '@playwright/test';

/**
 * Testes de Autenticação
 * 
 * Este arquivo testa o login no painel administrativo do Strapi.
 * É importante porque todos os outros testes precisam estar logados.
 */

test.describe('Autenticação', () => {
  test('deve fazer login com sucesso', async ({ page }) => {
    // 1. Navegar para a página de login
    await page.goto('/admin');
    
    // 2. Preencher o email
    await page.fill('input[name="email"]', 'admin@satc.edu.br');
    
    // 3. Preencher a senha
    await page.fill('input[name="password"]', 'welcomeToStrapi123');
    
    // 4. Clicar no botão de login
    await page.click('button[type="submit"]');
    
    // 5. Aguardar o redirecionamento para o dashboard
    await page.waitForURL('**/admin', { timeout: 10000 });
    
    // 6. Verificar se estamos logados (procura por texto que só aparece quando logado)
    await expect(page.locator('text=Hello Super')).toBeVisible();
  });
});


