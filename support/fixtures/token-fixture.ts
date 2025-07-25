import { test as base } from '@playwright/test';
import { getUserToken } from '../helpers/api-helper';

type ArticleFixture = {
  token: string; // Exposes the user token to any test that needs authenticated API interaction
};

// Base fixture to retrieve a valid user token before tests run
export const test = base.extend<ArticleFixture>({

    token: async ({ request }, use) => {
        const token = await getUserToken(request)
        // Defensive check: fail fast if test environment isn’t set up correctly
        if (!token) {
          throw new Error('Failed to retrieve user token');
        }
        await use(token) // Makes the token available in the test scope
    },
})

export { expect } from '@playwright/test';