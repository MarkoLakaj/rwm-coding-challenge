import { test as base } from '@playwright/test';
import { getUserToken } from '../helpers/api-helper';

type ArticleFixture = {
  token: string;
};

export const test = base.extend<ArticleFixture>({

    token: async ({ request }, use) => {
        const token = await getUserToken(request)
        if (!token) {
          throw new Error('Failed to retrieve user token');
        }
        await use(token)
    },
})

export { expect } from '@playwright/test';