import { test, expect } from '@playwright/test';

test.describe('Catalog and Product Management E2E Flow', () => {

  test('Anonymous user can view the catalog', async ({ page }) => {
    // Navigate to catalog
    await page.goto('/catalog');
    
    // Check that we see the catalog title
    await expect(page.locator('h2').filter({ hasText: 'Catálogo de Productos' }).or(page.locator('h2').filter({ hasText: 'Product Catalog' }))).toBeVisible();

    // Check that we see at least one product card (the backend bootstrap seeds products)
    const productCards = page.locator('.product-card');
    await expect(productCards.first()).toBeVisible();
  });

  test('Vendor user can manage products (CRUD)', async ({ request, page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err));
    page.on('requestfailed', request =>
      console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText)
    );
    // 1. Log in as Vendor
    const loginResponse = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: 'vendor@cartai.com',
        password: 'vendor'
      }
    });
    
    expect(loginResponse.ok()).toBeTruthy();
    const vendorUser = await loginResponse.json();

    // 2. Inject auth state
    const vendorState = {
      state: {
        user: {
          id: vendorUser.userId,
          email: vendorUser.email,
          name: vendorUser.name,
          roles: vendorUser.roles || [],
          avatarFileId: vendorUser.avatarFileId || null
        },
        token: vendorUser.token,
        isAuthenticated: true
      },
      version: 0
    };
    
    await page.goto('/');
    await page.evaluate((state) => {
      window.localStorage.setItem('identity-storage', JSON.stringify(state));
    }, vendorState);

    // 3. Navigate to Product Management
    await page.goto('/admin/products');
    await expect(page.locator('h2').filter({ hasText: 'Administración' }).or(page.locator('h2').filter({ hasText: 'Administration' }))).toBeVisible();

    // 4. Create a new product
    const uniqueName = `E2E Test Product ${Math.floor(Math.random() * 100000)}`;
    
    await page.getByRole('button', { name: /añadir producto|add product/i }).click();
    
    // Fill the form
    await page.getByLabel(/nombre del producto|product name/i).fill(uniqueName);
    await page.getByLabel(/descripción|description/i, { exact: true }).fill('A great product for E2E testing');
    await page.getByLabel(/precio|price/i).fill('99.99');
    await page.getByLabel(/stock/i).fill('50');

    // Add image
    const mockFileContent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'base64');
    await page.locator('input[type="file"]').setInputFiles({
      name: 'product.png',
      mimeType: 'image/png',
      buffer: mockFileContent,
    });

    // Save product
    await page.getByRole('button', { name: /guardar|save/i }).click();

    // Verify it appears in the table
    await expect(page.getByText(uniqueName)).toBeVisible();

    // 5. Edit the product
    // Click edit on the row containing the unique name
    const row = page.locator('tr').filter({ hasText: uniqueName });
    await row.locator('button[title*="Editar"], button[title*="Edit"]').click();

    const updatedName = `${uniqueName} - UPDATED`;
    await page.getByLabel(/nombre del producto|product name/i).fill(updatedName);
    await page.getByLabel(/precio|price/i).fill('149.99');
    
    await page.getByRole('button', { name: /guardar|save/i }).click();

    // Verify updated product appears in the table
    await expect(page.getByText(updatedName)).toBeVisible();

    // 6. Delete the product
    // Mock the confirm dialog so it returns true automatically
    page.once('dialog', dialog => dialog.accept());
    
    const updatedRow = page.locator('tr').filter({ hasText: updatedName });
    await updatedRow.locator('button[title*="Eliminar"], button[title*="Delete"]').click();

    // Verify it was deleted (wait for it to disappear from the DOM)
    await expect(page.getByText(updatedName)).toHaveCount(0);
  });
});
