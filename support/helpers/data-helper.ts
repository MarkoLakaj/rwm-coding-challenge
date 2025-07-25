import { faker } from '@faker-js/faker';
import { APIRequestContext } from '@playwright/test';
import { createNewArticle } from './api-helper';

export const invalidToken = faker.string.alphanumeric(32);

export const randomSlug = faker.string.alphanumeric(12).toLowerCase();

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

export const getSlugFromUrl = (url: string): string | undefined => {
  const match = url.match(/\/article\/(.+)$/);
  return match?.[1];
};