import { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";


export class HomePage {

    private readonly page: Page
    private readonly _firstArticleTitle: Locator
    private readonly _firstArticleSubject: Locator
    private readonly _firstArticleAuthor: Locator

    constructor(page: Page) {
        this.page = page
        // Assumes that the first visible article is the most recent or relevant one
        this._firstArticleTitle = page.locator('.preview-link h1').first()
        this._firstArticleSubject = page.locator('.preview-link p').first()
        this._firstArticleAuthor = page.locator('.author').first()
    }

    // Exposing locators via getters to allow assertions in tests without duplicating selector logic
    get firstArticleTitle(): Locator {
        return this._firstArticleTitle
    }

    get firstArticleSubject(): Locator {
        return this._firstArticleSubject
    }

    get firstArticleAuthor(): Locator {
        return this._firstArticleAuthor
    }

    async clickOnFirstArticle(): Promise<void> {
        await this._firstArticleTitle.waitFor({ state: 'visible' });
        await this._firstArticleTitle.click()
        // Basic expectation to confirm navigation to article detail page
        await expect(this.page).toHaveURL(/\/article\//, {timeout: 5000})
    }

    async clickOnArticleWithTitle(title: string): Promise<void> {
        // Dynamic article click based on title — useful for test data targeting specific articles
        await this.page.locator(`h1:has-text("${title}")`).first().click()
        await this.page.waitForURL(/\/article\//)
        await this.page.waitForLoadState('networkidle');
    }


   

    



}