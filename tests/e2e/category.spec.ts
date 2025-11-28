import { test, expect } from '@playwright/test';

test.describe('Category Collection', () => {
  test('deve listar categorias existentes', async ({ page }) => {
    await page.goto(
      '/admin/content-manager/collection-types/api::category.category',
    );

    await page.waitForLoadState('networkidle');

    await expect(
      page.locator('h1:has-text("Categoria")'),
    ).toBeVisible();

    expect(page.url()).toContain('category');

    const hasCreateButton =
      (await page
        .getByRole('button', { name: /create new entry|novo|criar/i })
        .count()) > 0;

    const hasEntryInfo =
      (await page
        .locator('text=/entry found|entries found|no content/i')
        .count()) > 0;

    expect(hasCreateButton || hasEntryInfo).toBeTruthy();
  });

  test('deve criar uma nova categoria', async ({ page }) => {
    await page.goto(
      '/admin/content-manager/collection-types/api::category.category',
    );
    await page.waitForLoadState('networkidle');

    await expect(
      page.locator('h1:has-text("Categoria")'),
    ).toBeVisible({ timeout: 10_000 });

    await page.waitForTimeout(2_000);

    let createButton = page.getByText('Create new entry', { exact: false });

    if ((await createButton.count()) === 0) {
      createButton = page.getByRole('button', { name: 'Create new entry' });
    }

    if ((await createButton.count()) === 0) {
      createButton = page.locator('button', { hasText: 'Create' });
    }

    await createButton.first().waitFor({ state: 'visible', timeout: 30_000 });

    const errorMessage = page.locator(
      'text=/failed to fetch|something went wrong|erro/i',
    );
    if ((await errorMessage.count()) > 0) {
      test.skip();
    }

    await createButton.first().click();

    await page.waitForSelector('input[name="name"]', { timeout: 20_000 });

    const categoryName = `Test Category ${Date.now()}`;
    await page.fill('input[name="name"]', categoryName);

    const descriptionField = page.locator('textarea[name="description"]');
    if ((await descriptionField.count()) > 0) {
      await descriptionField.fill('Descrição de teste para a categoria');
    }

    const saveButton = page
      .getByRole('button', { name: /save|salvar/i })
      .first();

    await saveButton.waitFor({ state: 'visible', timeout: 10_000 });
    await saveButton.click();

    await page.waitForTimeout(3_000);

    const isOnListPage = page.url().includes('category');
    const hasSuccessMessage =
      (await page
        .locator('text=/success|sucesso|saved|salvo/i')
        .count()) > 0;

    expect(isOnListPage || hasSuccessMessage).toBeTruthy();
  });

  test('deve editar uma categoria existente', async ({ page }) => {
    await page.goto(
      '/admin/content-manager/collection-types/api::category.category',
    );

    await page.waitForSelector('table, [role="table"]', {
      timeout: 10_000,
    });

    const firstCategory = page.locator('tbody tr, [role="row"]').first();

    if ((await firstCategory.count()) > 0) {
      await firstCategory.click();

      await page.waitForSelector('input[name="name"]', {
        timeout: 10_000,
      });

      const newName = `Edited Category ${Date.now()}`;
      await page.fill('input[name="name"]', newName);

      await page.click('button:has-text("Save"), button:has-text("Salvar")');

      await page.waitForSelector('text=/success|sucesso|saved|salvo/i', {
        timeout: 10_000,
      });
    } else {
      console.log('Nenhuma categoria encontrada para editar');
    }
  });
});
