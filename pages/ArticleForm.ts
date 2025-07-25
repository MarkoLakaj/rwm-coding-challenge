import { Page, Locator, expect } from "@playwright/test";

export class ArticleForm {

    private readonly page: Page
    private readonly articleTitle: Locator
    private readonly articleSubject: Locator
    private readonly articleText: Locator
    private readonly articleTags: Locator
    private readonly publishArticleButton: Locator

    constructor(page: Page) {
        this.page = page
        this.articleTitle = page.getByPlaceholder('Article Title')
        this.articleSubject = page.getByPlaceholder('What\'s this article about?')
        this.articleText = page.getByPlaceholder('Write your article (in markdown)')
        this.articleTags = page.getByPlaceholder('Enter tags')
        this.publishArticleButton = page.getByRole('button', {name: 'Publish Article'})
    }


    async enterArticleTitle(title: string): Promise<void> {
        await this.articleTitle.fill(title)
    }

    async enterArticleSubject(subject: string): Promise<void> {
        await this.articleSubject.fill(subject)
    }

    async enterArticleText(text: string): Promise<void> {
        await this.articleText.fill(text)
    }

    async enterArticleTags(...tags: string[]): Promise<void> {
        for (const tag of tags) {
            await this.articleTags.fill(tag)
            await this.articleTags.press('Enter')
        }
    }

    async fillOutArticleForm(title: string, subject: string, text: string): Promise<void> {
        await this.articleTitle.fill(title)
        await this.articleSubject.fill(subject)
        await this.articleText.fill(text)
    }

    async clickPublishArticleButton(): Promise<void> {
        await this.publishArticleButton.click()
        await expect(this.page).toHaveURL(/\/article\//, {timeout: 5000})
    }

    private async clearField(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' })
        await expect(locator).toBeEnabled()
        await locator.click()
        await locator.fill('')
        await expect(locator).toHaveValue('', { timeout: 1000 })
    }

    async clearArticleForm(): Promise<void> {

        await this.clearField(this.articleTitle);
        await this.clearField(this.articleSubject);
        await this.clearField(this.articleText);

    }

}