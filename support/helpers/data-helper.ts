import { faker } from '@faker-js/faker';
import { APIRequestContext } from '@playwright/test';
import { createNewArticle } from './api-helper';

// Generates a random invalid token for negative test scenarios (e.g., auth failure)
export const invalidToken = faker.string.alphanumeric(32);


// Generates a random slug (lowercase) suitable for URL/path usage in tests
export const randomSlug = faker.string.alphanumeric(12).toLowerCase();


// Generates a realistic article payload for API calls, with optional overrides
// Overrides allow customizing specific fields for edge or targeted test cases
export function generateArticlePayload(overrides = {}) {
  return {
    article: {
      title: faker.lorem.words(3), 
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(1),
      tagList: [],
      ...overrides, // Allow partial overrides for custom scenarios
    },
  };
}


// Creates an article via API and returns the resulting slug and payload used
// Throws an error if article creation fails — ensures test integrity
export async function createArticleAndReturnSlug(request: APIRequestContext, token: string) {
    const payload = generateArticlePayload();
    const response = await createNewArticle(request, token, payload);
    if (response.status() !== 201) {
        throw new Error(`Article creation failed with status ${response.status()}`);
    }
    const body = await response.json();
    const slug = body.article.slug;

    return { slug, payload };
}

// Extracts the article slug from a full article URL string, returns undefined if no match
export const getSlugFromUrl = (url: string): string | undefined => {
  const match = url.match(/\/article\/(.+)$/);
  return match?.[1];
};