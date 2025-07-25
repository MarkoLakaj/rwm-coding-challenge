import {test, expect} from "../../support/fixtures/token-fixture"
import { deleteArticle } from "../../support/helpers/api-helper";
import { generateArticlePayload, invalidToken } from '../../support/helpers/data-helper'



test.describe('Positive and negative scenarios for creating articles via POST', () => {


    test('POST authenticated user and valid payload should return 201', async({ request, token }) => {

        const validPayload = generateArticlePayload()

        let slug: string | undefined;

        try {

            const articleResponse = await request.post(`${process.env.BASE_API_URL}/articles/`, {
                data: validPayload,
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            expect(articleResponse.status()).toBe(201);
            const body = await articleResponse.json();
            slug = body.article.slug;

            expect(body.article.title).toBe(validPayload.article.title);
            expect(body.article.description).toBe(validPayload.article.description);

        } finally {

            if (slug) {
                await deleteArticle(request, token, slug);
            }
        }
    });

    test('POST authenticated user and invalid payload should return 422', async({request, token}) => {

        const invalidPayload = {    
            article: {
                // missing title
                description: "New Description",
                body: "New Body",
                tagList: [],
            }
        }

        const articleResponse = await request.post(`${process.env.BASE_API_URL}/articles/`, {
            data: invalidPayload,
            headers: {
                Authorization: `Token ${token}`
            }
        })

        expect(articleResponse.status()).toBe(422);
        const body = await articleResponse.json()  
        expect(body).toHaveProperty('errors');
        expect(body.errors).toHaveProperty('title')
        expect(body.errors.title).toContain('can\'t be blank')

    })

    test('POST missing authorization header and valid payload should return 401', async({request}) => {

        const validPayload = generateArticlePayload()

        const articleResponse = await request.post(`${process.env.BASE_API_URL}/articles/`, {
            data: validPayload,
        })

        expect(articleResponse.status()).toBe(401);
        const body = await articleResponse.json()  
        expect(body).toHaveProperty('message');
        expect(body.message).toBe('missing authorization credentials')

    })

    test('POST invalid token and valid payload should return 401', async({request}) => {

        const validPayload = generateArticlePayload()

        const articleResponse = await request.post(`${process.env.BASE_API_URL}/articles/`, {
            data: validPayload,
            headers: {
                Authorization: `Token ${invalidToken}`
            }
        })

        expect(articleResponse.status()).toBe(401);
        const body = await articleResponse.json()  
        expect(body).toHaveProperty('message');
        expect(body.message).toBe('missing authorization credentials')

    })

})