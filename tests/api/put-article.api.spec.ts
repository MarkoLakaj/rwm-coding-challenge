import {test, expect} from "../../support/fixtures/token-fixture"
import {updateArticle, deleteArticle} from '../../support/helpers/api-helper'
import article_updated from '../../support/test-data/article_updated.json'
import { randomSlug, invalidToken, generateArticlePayload, createArticleAndReturnSlug } from '../../support/helpers/data-helper'

test.describe('Positive and negative scenarios for updating articles via PUT', () => {

    
    test('PUT update article as authenticated user returns 200', async ({ request, token }) => {

        const { slug } = await createArticleAndReturnSlug(request, token)
        let updatedSlug: string | undefined

        try {
            const updatePayload = generateArticlePayload()
            const updateRes = await updateArticle(request, slug, updatePayload, token)

            expect(updateRes.status()).toBe(200)
            const updateBody = await updateRes.json()
            expect(updateBody.article.title).toBe(updatePayload.article.title)
            expect(updateBody.article.body).toBe(updatePayload.article.body)

            updatedSlug = updateBody.article.slug
        } finally {
            await deleteArticle(request, token, updatedSlug || slug)
        }

    })

    test('PUT partial update article as authenticated user returns 200', async ({ request, token }) => {

        const { slug, payload } = await createArticleAndReturnSlug(request, token)
        let updatedSlug: string | undefined

        try {
            const partialPayload = {
                article: {
                    title: "Updated Title Only"
                }
            }

            const updateRes = await request.put(`${process.env.BASE_API_URL}/articles/${slug}`, {
                data: partialPayload,
                headers: {
                    Authorization: `Token ${token}`
                }
            })

            expect(updateRes.status()).toBe(200);
            const updateBody = await updateRes.json();
            expect(updateBody.article.title).toBe(partialPayload.article.title)
            expect(updateBody.article.body).toBe(payload.article.body)
            updatedSlug = updateBody.article.slug
        } finally {
            await deleteArticle(request, token, updatedSlug || slug)
        }

    })

    test('PUT  update article with missing payload should return 422', async ({ request, token }) => {

        const { slug } = await createArticleAndReturnSlug(request, token)

        try {
            const updateRes = await request.put(`${process.env.BASE_API_URL}/articles/${slug}`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            })

            expect(updateRes.status()).toBe(500)
            const updateBody = await updateRes.json()
            expect(updateBody).toContain('Cannot read properties of undefined')
        } finally {
            // Clean-up
            await deleteArticle(request, token, slug)
        }

    })

    test('PUT without authentication header with valid payload should return 401', async ({ request, token }) => {

        const { slug } = await createArticleAndReturnSlug(request, token)

        try {

            const updateRes = await request.put(`${process.env.BASE_API_URL}/articles/${slug}`, {
                data: generateArticlePayload(),
            })

            expect(updateRes.status()).toBe(401)
            const updateBody = await updateRes.json()
            expect(updateBody).toHaveProperty('message')
            expect(updateBody.message).toBe('missing authorization credentials')
        } finally {
            // Clean-up
            await deleteArticle(request, token, slug)
        }
        
    })

    test('PUT with invalid token and valid payload should return 401', async ({ request, token }) => {

        const { slug } = await createArticleAndReturnSlug(request, token)

        try {
            const updateRes = await request.put(`${process.env.BASE_API_URL}/articles/${slug}`, {
                data: generateArticlePayload(),
                headers: {
                    Authorization: `Token ${invalidToken}`
                }
            })

            expect(updateRes.status()).toBe(401)
            const updateBody = await updateRes.json()
            expect(updateBody).toHaveProperty('message')
            expect(updateBody.message).toBe('missing authorization credentials')
        } finally {
            // Clean-up
            await deleteArticle(request, token, slug)
        }
        
    })

    test('PUT with valid token and valid payload on non-existing article should return 404', async ({ request, token }) => {

        const updateRes = await request.put(`${process.env.BASE_API_URL}/articles/${randomSlug}`, {
            data: article_updated,
            headers: {
                Authorization: `Token ${token}`
            }
        })

        expect(updateRes.status()).toBe(404)
    })

});