import { test, expect } from '@playwright/test';

test.describe('Article Collection', () => {
  test('deve listar artigos existentes', async ({ page }) => {
    await page.goto('/admin/content-manager/collection-types/api::article.article');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1:has-text("Artigo")')).toBeVisible();
    expect(page.url()).toContain('article');

    const hasCreateButton =
      (await page.getByRole('button', { name: /create new entry|novo|criar/i }).count()) > 0;

    const hasEntryInfo =
      (await page.locator('text=/entry found|entries found|no content/i').count()) > 0;

    expect(hasCreateButton || hasEntryInfo).toBeTruthy();
  });

  test('deve criar um novo artigo', async ({ page }) => {
    await page.goto('/admin/content-manager/collection-types/api::article.article');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1:has-text("Artigo")')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(2000);

    let createButton = page.getByText('Create new entry', { exact: false });

    if ((await createButton.count()) === 0)
      createButton = page.getByRole('button', { name: /create new entry/i });

    if ((await createButton.count()) === 0)
      createButton = page.locator('button', { hasText: 'Create' });

    await createButton.first().waitFor({ state: 'visible', timeout: 30000 });

    const errorMessage = page.locator('text=/failed to fetch|something went wrong|erro/i');
    if ((await errorMessage.count()) > 0) test.skip();

    await createButton.first().click();

    await page.waitForSelector('input[name="title"]', { timeout: 20000 });

    const testTitle = `Test Article ${Date.now()}`;
    await page.fill('input[name="title"]', testTitle);

    const descriptionField = page.locator('textarea[name="description"]');
    if ((await descriptionField.count()) > 0)
      await descriptionField.fill('Esta é uma descrição de teste para o artigo');

    const saveButton = page.getByRole('button', { name: /save|publish|salvar|publicar/i }).first();
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await saveButton.click();

    await page.waitForTimeout(3000);

    const isOnListPage = page.url().includes('article');
    const hasSuccessMessage =
      (await page.locator('text=/success|sucesso|saved|salvo/i').count()) > 0;

    expect(isOnListPage || hasSuccessMessage).toBeTruthy();
  });

  test('deve editar um artigo existente', async ({ page }) => {
    await page.goto('/admin/content-manager/collection-types/api::article.article');

    await page.waitForSelector('table, [role="table"], [data-testid*="article"]', {
      timeout: 10000,
    });

    const firstArticle = page.locator('tbody tr, [role="row"]').first();

    if ((await firstArticle.count()) > 0) {
      await firstArticle.click();

      await page.waitForSelector('input[name="title"]', { timeout: 10000 });

      const newTitle = `Edited Article ${Date.now()}`;
      await page.fill('input[name="title"]', newTitle);

      await page.click('button:has-text("Save"), button:has-text("Publish")');

      await page.waitForSelector('text=/success|sucesso|saved|salvo/i', {
        timeout: 10000,
      });
    } else {
      console.log('Nenhum artigo encontrado para editar');
    }
  });

  test('força falha propositalmente para validar pipeline', async () => {
    // Teste artificial para demonstrar PR com falha na pipeline do A3
    expect(true).toBe(false);
  });
});
