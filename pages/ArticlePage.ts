import { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class ArticlePage {

    private readonly page: Page
    private readonly editArticleLink: Locator
    private readonly deleteArticleButton: Locator 

    constructor(page: Page) {
        this.page = page
        // Locators scoped within the banner area to avoid accidental matches elsewhere
        // Filter with text to disambiguate from other anchors/buttons
        this.editArticleLink = page.locator('.banner span a').filter({hasText: 'Edit Article'})
        this.deleteArticleButton = page.locator('.banner span button').filter({hasText: 'Delete Article'})

    }

    async clickEditArticleLink(): Promise<void> {
        await this.editArticleLink.click()
        // Expectation added to guard against silent failures or flakiness
        await expect(this.page).toHaveURL(/\/editor\//, {timeout: 5000})
    }

    async clickDeleteArticleButton(): Promise<void> {
        await this.deleteArticleButton.click()
        await this.page.waitForLoadState('networkidle');
    }

}