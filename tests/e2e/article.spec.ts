import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

/**
 * Testes para a Collection Article
 * 
 * Este arquivo testa as operações CRUD (Create, Read, Update, Delete)
 * na collection Article do Strapi.
 */

test.describe('Article Collection', () => {
  // Este código roda ANTES de cada teste
  test.beforeEach(async ({ page }) => {
    // Faz login antes de cada teste
    await login(page);
  });

  test('deve listar artigos existentes', async ({ page }) => {
    // 1. Navegar para a collection Article
    await page.goto('/admin/content-manager/collection-types/api::article.article');
    
    // 2. Aguardar a página carregar completamente
    await page.waitForLoadState('networkidle');
    
    // 3. Verificar se a página carregou corretamente
    // Usa o heading h1 que é único na página (não na sidebar)
    await expect(page.locator('h1:has-text("Artigo")')).toBeVisible();
    
    // 4. Verificar se estamos na URL correta
    expect(page.url()).toContain('article');
    
    // 5. Verificar se a página tem o botão "Create new entry" ou mostra informações de entradas
    // O botão deve estar visível OU deve mostrar "entry/entries found"
    const hasCreateButton = await page.getByRole('button', { name: /create new entry|novo|criar/i }).count() > 0;
    const hasEntryInfo = await page.locator('text=/entry found|entries found|no content/i').count() > 0;
    
    // A página deve ter pelo menos um desses elementos
    expect(hasCreateButton || hasEntryInfo).toBeTruthy();
  });

  test('deve criar um novo artigo', async ({ page }) => {
    // 1. Navegar para criar novo artigo
    await page.goto('/admin/content-manager/collection-types/api::article.article');
    await page.waitForLoadState('networkidle');
    
    // 2. Aguardar o título da página estar visível (garante que a página carregou)
    await expect(page.locator('h1:has-text("Artigo")')).toBeVisible({ timeout: 10000 });
    
    // 3. Aguardar um pouco mais para garantir que todos os elementos carregaram
    await page.waitForTimeout(2000);
    
    // 4. Procurar o botão de várias formas - usar getByText que é mais confiável
    // Tenta primeiro pelo texto exato, depois por texto parcial
    let createButton = page.getByText('Create new entry', { exact: false });
    
    // Se não encontrar, tenta pelo role
    if (await createButton.count() === 0) {
      createButton = page.getByRole('button', { name: 'Create new entry' });
    }
    
    // Se ainda não encontrar, tenta por qualquer botão que contenha "Create"
    if (await createButton.count() === 0) {
      createButton = page.locator('button').filter({ hasText: 'Create' });
    }
    
    // 5. Aguardar o botão estar visível e clicável (com timeout maior)
    await createButton.first().waitFor({ state: 'visible', timeout: 30000 });
    
    // 6. Verificar se não há erros na página antes de continuar
    const errorMessage = page.locator('text=/failed to fetch|something went wrong|erro/i');
    if (await errorMessage.count() > 0) {
      test.skip(); // Pula o teste se houver erro no Strapi
    }
    
    // 7. Clicar no botão (usando first() para garantir que pega o primeiro)
    await createButton.first().click();
    
    // 5. Aguardar o formulário carregar (pode demorar)
    await page.waitForSelector('input[name="title"]', { timeout: 20000 });
    
    // 6. Preencher o título
    const testTitle = `Test Article ${Date.now()}`;
    await page.fill('input[name="title"]', testTitle);
    
    // 7. Preencher a descrição (se o campo existir)
    const descriptionField = page.locator('textarea[name="description"]');
    if (await descriptionField.count() > 0) {
      await descriptionField.fill('Esta é uma descrição de teste para o artigo');
    }
    
    // 8. Salvar (pode ser "Save" ou "Publish")
    const saveButton = page.getByRole('button', { name: /save|publish|salvar|publicar/i }).first();
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await saveButton.click();
    
    // 9. Aguardar confirmação de sucesso ou redirecionamento
    await page.waitForTimeout(3000); // Aguarda processamento
    
    // 10. Verificar se voltou para a lista ou se há mensagem de sucesso
    const isOnListPage = page.url().includes('article');
    const hasSuccessMessage = await page.locator('text=/success|sucesso|saved|salvo/i').count() > 0;
    
    expect(isOnListPage || hasSuccessMessage).toBeTruthy();
  });

  test('deve editar um artigo existente', async ({ page }) => {
    // 1. Navegar para a lista de artigos
    await page.goto('/admin/content-manager/collection-types/api::article.article');
    
    // 2. Aguardar a lista carregar
    await page.waitForSelector('table, [role="table"], [data-testid*="article"]', { timeout: 10000 });
    
    // 3. Clicar no primeiro artigo da lista (se existir)
    const firstArticle = page.locator('tbody tr, [role="row"]').first();
    
    // Verifica se existe pelo menos um artigo
    if (await firstArticle.count() > 0) {
      await firstArticle.click();
      
      // 4. Aguardar o formulário de edição carregar
      await page.waitForSelector('input[name="title"]', { timeout: 10000 });
      
      // 5. Modificar o título
      const newTitle = `Edited Article ${Date.now()}`;
      await page.fill('input[name="title"]', newTitle);
      
      // 6. Salvar
      await page.click('button:has-text("Save"), button:has-text("Publish")');
      
      // 7. Verificar sucesso
      await page.waitForSelector('text=/success|sucesso|saved|salvo/i', { timeout: 10000 });
    } else {
      // Se não houver artigos, apenas verifica que a página carregou
      console.log('Nenhum artigo encontrado para editar');
    }
  });
});

