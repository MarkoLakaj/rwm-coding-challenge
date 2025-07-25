import { test, expect } from "../../support/fixtures/setup-fixtures"
import { deleteArticle } from "../../support/helpers/api-helper"
import { createArticleAndReturnSlug, getSlugFromUrl } from "../../support/helpers/data-helper"


test('Create new article', async ({ pageManager, login, request, token }) => {
    const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const ARTICLE_TITLE = `New Article ${id}`;
    const ARTICLE_SUBJECT = 'Create a new article';
    const ARTICLE_TEXT = 'This is a test about creating a new article';

    await login();

    await pageManager.onHeaderMenu().clickAddNewArticleLink();
    await pageManager.onArticleForm().fillOutArticleForm(ARTICLE_TITLE, ARTICLE_SUBJECT, ARTICLE_TEXT);
    await pageManager.onArticleForm().clickPublishArticleButton();

    await pageManager.onHeaderMenu().clickHomeLink();
    await pageManager.page.reload();

    await expect(pageManager.onHomePage().firstArticleAuthor).toHaveText(process.env.USER_PROFILE as string);
    await expect(pageManager.onHomePage().firstArticleTitle).toHaveText(ARTICLE_TITLE);
    await expect(pageManager.onHomePage().firstArticleSubject).toHaveText(ARTICLE_SUBJECT);

    await pageManager.onHomePage().clickOnFirstArticle();
    const url = pageManager.page.url();
    const slug = getSlugFromUrl(url);

    if (slug) {
        await deleteArticle(request, token, slug);
    } else {
        throw new Error('Article slug not found in URL');
    }
});


// There is some unexpected flakiness when running on 4+ workers, therefore the following tests are running in serial mode
// to ensure better defence
test.describe.configure({ mode: 'serial' });
test.describe('Update & Delete Article (serial only)', () => {

    const ARTICLE_TITLE_UPDATED = 'Updated Article';
    const ARTICLE_SUBJECT_UPDATED = 'Updated article subject';
    const ARTICLE_TEXT_UPDATED = 'Updated text of an article';

    test('Update created article', async ({ pageManager, token, login, request }) => {
        let { slug, payload } = await createArticleAndReturnSlug(request, token);
        const title = payload.article.title;

        try {
            await login();

            await pageManager.onHomePage().clickOnArticleWithTitle(title);
            await pageManager.onArticlePage().clickEditArticleLink();
            await pageManager.onArticleForm().clearArticleForm();
            await pageManager.onArticleForm().fillOutArticleForm(ARTICLE_TITLE_UPDATED, ARTICLE_SUBJECT_UPDATED, ARTICLE_TEXT_UPDATED);
            await pageManager.onArticleForm().clickPublishArticleButton();
            await pageManager.onHeaderMenu().clickOnConduitLogo();

            await expect(pageManager.onHomePage().firstArticleAuthor).toHaveText(process.env.USER_PROFILE as string);
            await expect(pageManager.onHomePage().firstArticleTitle).toHaveText(ARTICLE_TITLE_UPDATED);
            await expect(pageManager.onHomePage().firstArticleSubject).toHaveText(ARTICLE_SUBJECT_UPDATED);

            await pageManager.onHomePage().clickOnArticleWithTitle(ARTICLE_TITLE_UPDATED);
            const url = pageManager.page.url();
            slug = getSlugFromUrl(url);

        } finally {
            if (slug) {
                await deleteArticle(request, token, slug);
            } else {
                throw new Error('Article slug not found in URL');
            }
        }
    });

    test('Delete the article', async ({ pageManager, login, token, request }) => {
        let { slug, payload } = await createArticleAndReturnSlug(request, token);
        const title = payload.article.title;

        try {
            await login();
            await pageManager.onHomePage().clickOnArticleWithTitle(title);
            const url = pageManager.page.url();
            slug = getSlugFromUrl(url);

            await pageManager.onArticlePage().clickDeleteArticleButton();

            await expect(pageManager.onHomePage().firstArticleTitle).not.toHaveText(ARTICLE_TITLE_UPDATED);
            await expect(pageManager.onHomePage().firstArticleSubject).not.toHaveText(ARTICLE_SUBJECT_UPDATED);

        } finally {
            if (slug) {
                await deleteArticle(request, token, slug);
            } else {
                throw new Error('Article slug not found in URL');
            }
        }
    });

});