import {test, expect} from "../../support/fixtures/token-fixture"
import { deleteArticle, getArticleBySlugID } from '../../support/helpers/api-helper'
import { randomSlug, invalidToken } from '../../support/helpers/data-helper'
import { createArticleAndReturnSlug } from '../../support/helpers/data-helper'

test.describe('Positive and negative scenarios for deleting the article via DELETE', () => {


    test('DELETE an article as an owner should return 204', async({request, token}) => {

        // Create article to delete
        const { slug } = await createArticleAndReturnSlug(request, token)

        // Delete article and verify status
        const deleteResponse = await deleteArticle(request, token, slug)
        expect(deleteResponse.status()).toEqual(204)
        // Verify article no longer exists
        const articleDeletedResponse = await getArticleBySlugID(request, slug) 
        expect(articleDeletedResponse.status()).toEqual(404)

    })

    test('DELETE an article without authorization header should return 401', async({request, token}) => {

        const { slug } = await createArticleAndReturnSlug(request, token)

        try {
            // Attempt delete without token
            const deleteResponse = await request.delete(`${process.env.BASE_API_URL}/articles/${slug}`)
            expect(deleteResponse.status()).toEqual(401)
            const deleteResponseBody = await deleteResponse.json()
            expect(deleteResponseBody).toHaveProperty('message');
            expect(deleteResponseBody.message).toBe('missing authorization credentials')

        } finally {
            // Clean-up to avoid leaving test data behind
            await deleteArticle(request, token, slug)
        }

    })

    test('DELETE an article with invalid token should return 401', async({request, token}) => {

        const { slug } = await createArticleAndReturnSlug(request, token)

        try {

            const deleteResponse = await deleteArticle(request, invalidToken, slug)
            expect(deleteResponse.status()).toEqual(401)
            const deleteResponseBody = await deleteResponse.json()
            expect(deleteResponseBody).toHaveProperty('message');
            expect(deleteResponseBody.message).toBe('missing authorization credentials')

        } finally {

            // Clean-up valid article
            await deleteArticle(request, token, slug)

        }

    })

    test('DELETE non-existing article should return 404', async({request, token}) => {

        const deleteResponse = await deleteArticle(request, token, randomSlug)
        expect(deleteResponse.status()).toEqual(404)
        
    })
})