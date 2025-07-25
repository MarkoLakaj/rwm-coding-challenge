import { test as tokenTest } from './token-fixture'; 
import { expect } from '@playwright/test';
import PageManager from '../../pages/PageManager';

// Define custom fixtures to enhance test readability and avoid repetitive boilerplate
type Fixtures = {
  pageManager: PageManager;
  goToLoginPage: () => Promise<void>;
  login: () => Promise<void>;
};

// Extend tokenTest instead of base to reuse any pre-auth or token-level setup
export const test = tokenTest.extend<Fixtures>({

  // Initialize PageManager once per test — shared access to all POMs
  pageManager: async ({ page }, use) => {
    const pageManager = new PageManager(page);
    await use(pageManager);
  },

  // Composable utility: navigate to login screen via top nav
  goToLoginPage: async ({ pageManager, page }, use) => {
    await use(async () => {
      await pageManager.page.goto('/');
      await pageManager.page.waitForLoadState('domcontentloaded');
      await pageManager.onHeaderMenu().clickSignInLink();
      await expect(page).toHaveURL('/login');
    });
  },

  // Encapsulated login flow using env credentials — reusable for any auth-required spec
  login: async ({ pageManager, goToLoginPage }, use) => {
    await use(async () => {
      await goToLoginPage();
      await pageManager.onLoginPage().loginUser(
        process.env.LOGIN_EMAIL as string,
        process.env.LOGIN_PASSWORD as string
      );
    });
  },
});

export { expect } 