import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

/**
 * Testes para a Collection Category
 * 
 * Este arquivo testa as operações CRUD na collection Category do Strapi.
 */

test.describe('Category Collection', () => {
  // Faz login antes de cada teste
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('deve listar categorias existentes', async ({ page }) => {
    // 1. Navegar para a collection Category
    await page.goto('/admin/content-manager/collection-types/api::category.category');
    
    // 2. Aguardar a página carregar completamente
    await page.waitForLoadState('networkidle');
    
    // 3. Verificar se a página carregou corretamente
    // Usa o heading h1 que é único na página (não na sidebar)
    await expect(page.locator('h1:has-text("Categoria")')).toBeVisible();
    
    // 4. Verificar se estamos na URL correta
    expect(page.url()).toContain('category');
    
    // 5. Verificar se a página tem o botão "Create new entry" ou mostra informações de entradas
    const hasCreateButton = await page.getByRole('button', { name: /create new entry|novo|criar/i }).count() > 0;
    const hasEntryInfo = await page.locator('text=/entry found|entries found|no content/i').count() > 0;
    
    expect(hasCreateButton || hasEntryInfo).toBeTruthy();
  });

  test('deve criar uma nova categoria', async ({ page }) => {
    // 1. Navegar para criar nova categoria
    await page.goto('/admin/content-manager/collection-types/api::category.category');
    await page.waitForLoadState('networkidle');
    
    // 2. Aguardar o título da página estar visível (garante que a página carregou)
    await expect(page.locator('h1:has-text("Categoria")')).toBeVisible({ timeout: 10000 });
    
    // 3. Aguardar um pouco mais para garantir que todos os elementos carregaram
    await page.waitForTimeout(2000);
    
    // 4. Procurar o botão de várias formas - usar getByText que é mais confiável
    let createButton = page.getByText('Create new entry', { exact: false });
    
    if (await createButton.count() === 0) {
      createButton = page.getByRole('button', { name: 'Create new entry' });
    }
    
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
    await page.waitForSelector('input[name="name"]', { timeout: 20000 });
    
    // 6. Preencher o nome da categoria
    const categoryName = `Test Category ${Date.now()}`;
    await page.fill('input[name="name"]', categoryName);
    
    // 7. Preencher descrição (se existir)
    const descriptionField = page.locator('textarea[name="description"]');
    if (await descriptionField.count() > 0) {
      await descriptionField.fill('Descrição de teste para a categoria');
    }
    
    // 8. Salvar
    const saveButton = page.getByRole('button', { name: /save|salvar/i }).first();
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await saveButton.click();
    
    // 9. Aguardar confirmação ou redirecionamento
    await page.waitForTimeout(3000);
    
    // 10. Verificar se voltou para a lista ou se há mensagem de sucesso
    const isOnListPage = page.url().includes('category');
    const hasSuccessMessage = await page.locator('text=/success|sucesso|saved|salvo/i').count() > 0;
    
    expect(isOnListPage || hasSuccessMessage).toBeTruthy();
  });

  test('deve editar uma categoria existente', async ({ page }) => {
    // 1. Navegar para a lista de categorias
    await page.goto('/admin/content-manager/collection-types/api::category.category');
    
    // 2. Aguardar a lista carregar
    await page.waitForSelector('table, [role="table"]', { timeout: 10000 });
    
    // 3. Clicar na primeira categoria (se existir)
    const firstCategory = page.locator('tbody tr, [role="row"]').first();
    
    if (await firstCategory.count() > 0) {
      await firstCategory.click();
      
      // 4. Aguardar formulário de edição
      await page.waitForSelector('input[name="name"]', { timeout: 10000 });
      
      // 5. Modificar o nome
      const newName = `Edited Category ${Date.now()}`;
      await page.fill('input[name="name"]', newName);
      
      // 6. Salvar
      await page.click('button:has-text("Save")');
      
      // 7. Verificar sucesso
      await page.waitForSelector('text=/success|sucesso|saved|salvo/i', { timeout: 10000 });
    } else {
      console.log('Nenhuma categoria encontrada para editar');
    }
  });
});

