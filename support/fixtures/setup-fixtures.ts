// import { test as base, expect } from "@playwright/test";
// import PageManager from "../../pages/PageManager";

// type Fixtures = {

//     pageManager: PageManager
//     goToLoginPage: () => Promise<void>
//     login: () => Promise<void>
// }

// export const test = base.extend<Fixtures> ({

//     pageManager: async ({page}, use) => {
//         const pageManager = new PageManager(page)
//         await use(pageManager)
//     },

//     goToLoginPage: async ({ pageManager, page }, use) => {
//         await use(async () => {
//             await pageManager.page.goto('/')
//             await pageManager.page.waitForLoadState('domcontentloaded');
//             await pageManager.onHeaderMenu().clickSignInLink()
//             await expect(page).toHaveURL('/login')
//         })
//     },

//     login: async ({pageManager, goToLoginPage}, use) => {
//         await use(async () => {
//             await goToLoginPage()
//             await pageManager.onLoginPage().loginUser(process.env.LOGIN_EMAIL as string, process.env.LOGIN_PASSWORD as string)
//         })
//     }

// })

// export {expect} from "@playwright/test"



import { test as tokenTest } from './token-fixture'; 
import { expect } from '@playwright/test';
import PageManager from '../../pages/PageManager';

type Fixtures = {
  pageManager: PageManager;
  goToLoginPage: () => Promise<void>;
  login: () => Promise<void>;
};

// Extend tokenTest instead of base
export const test = tokenTest.extend<Fixtures>({
  pageManager: async ({ page }, use) => {
    const pageManager = new PageManager(page);
    await use(pageManager);
  },

  goToLoginPage: async ({ pageManager, page }, use) => {
    await use(async () => {
      await pageManager.page.goto('/');
      await pageManager.page.waitForLoadState('domcontentloaded');
      await pageManager.onHeaderMenu().clickSignInLink();
      await expect(page).toHaveURL('/login');
    });
  },

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