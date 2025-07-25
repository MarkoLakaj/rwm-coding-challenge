import {test, expect} from "../../support/fixtures/token-fixture"
import { getAllArticles, getArticleBySlugID, deleteArticle } from '../../support/helpers/api-helper'
import { randomSlug, createArticleAndReturnSlug } from '../../support/helpers/data-helper'



test.describe('Positive and negative scenarios for fetching articles via GET', () => {

    test('GET the list of all articles should result in 200', async({request}) => {

        const articlesResponse = await getAllArticles(request)
        expect(articlesResponse.status()).toEqual(200)
        const body = await articlesResponse.json();
        expect(body).toHaveProperty('articles');
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBeGreaterThan(0);
    })

    test('GET a single article should result in 200', async({request, token}) => {

        // Create article to fetch
        const { slug } = await createArticleAndReturnSlug(request, token)
        
        try {

            const articlesResponse = await getArticleBySlugID(request, slug)
            expect(articlesResponse.status()).toEqual(200)
            const body = await articlesResponse.json();
            expect(body).toHaveProperty('article');
            expect(body.article.title).toBeTruthy();
            expect(body.article.body).toBeTruthy();

        } finally {

            // Clean-up created article
            await deleteArticle(request, token, slug)
        }
        
    })

    test('GET non-existing article should result in 404', async({request}) => {

        const articlesResponse = await getArticleBySlugID(request, randomSlug)
        expect(articlesResponse.status()).toEqual(404)
        const body = await articlesResponse.json();
        expect(body).toHaveProperty('errors');
        expect(body.errors.article).toEqual(["not found"]);
    })
})