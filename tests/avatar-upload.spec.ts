import { test, expect } from '@playwright/test';

test.describe('Profile Avatar Upload Flow against Real Backend', () => {
  let testUser: any = null;

  test.beforeEach(async ({ request, page }) => {
    // 1. Create a real test user in the backend
    const randomSuffix = Math.floor(Math.random() * 100000);
    const registerResponse = await request.post('http://localhost:8080/api/auth/register', {
      data: {
        name: `Playwright User ${randomSuffix}`,
        email: `pw_${randomSuffix}@test.com`,
        password: 'password123'
      }
    });
    
    // We expect it to succeed. If not, the backend might be down.
    expect(registerResponse.ok()).toBeTruthy();
    
    // 2. Log in to get the JWT token
    const loginResponse = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: `pw_${randomSuffix}@test.com`,
        password: 'password123'
      }
    });
    expect(loginResponse.ok()).toBeTruthy();
    testUser = await loginResponse.json();

    // 3. Inject the real user and token into Zustand's persisted storage
    const realState = {
      state: {
        user: {
          id: testUser.userId,
          email: testUser.email,
          name: testUser.name,
          roles: testUser.roles || [],
          avatarFileId: testUser.avatarFileId || null
        },
        token: testUser.token,
        isAuthenticated: true
      },
      version: 0
    };
    
    // Navigate to root to set localStorage on the correct domain
    await page.goto('/');
    await page.evaluate((state) => {
      window.localStorage.setItem('identity-storage', JSON.stringify(state));
    }, realState);
  });

  test('successfully uploads and updates avatar on real server', async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err));
    page.on('requestfailed', request =>
      console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText)
    );
    page.on('response', response => {
      if (response.url().includes('/avatar/')) {
        console.log('AVATAR RESPONSE:', response.status(), response.url());
      }
    });

    // Navigate directly to profile page (will use the injected auth state)
    await page.goto('/profile');

    // Wait for the profile page to load
    await expect(page.locator('h1').filter({ hasText: 'Profile' }).or(page.locator('h1').filter({ hasText: 'Perfil' }))).toBeVisible();

    // Prepare a mock image file using a real 1x1 PNG so it doesn't trigger onError
    const mockFileContent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'base64');
    
    // Find the file input and set the file
    // In ProfilePage.tsx the input has id="avatar-input"
    await page.setInputFiles('input#avatar-input', {
      name: 'avatar.png',
      mimeType: 'image/png',
      buffer: mockFileContent,
    });

    // Wait for the upload request to complete and preview to update
    // The image should point to the real backend URL, meaning it's no longer a blob
    await expect(page.locator('img[alt="Avatar Preview"]')).toHaveAttribute('src', /\/api\/storage\/files\/.+/);

    // Submit the form to save the profile
    // The submit button is typically a button with type="submit"
    await page.locator('button[type="submit"]').click();

    // Wait for success message (from i18n, could be 'Profile updated successfully')
    // We can just wait for the network request to complete and the success message to be visible
    await expect(page.getByText('success').or(page.getByText('éxito')).or(page.locator('.text-green-500'))).toBeVisible();
  });
});
