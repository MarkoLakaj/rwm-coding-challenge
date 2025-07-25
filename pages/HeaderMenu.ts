import { Page, Locator} from "@playwright/test"
import { expect } from "@playwright/test"

export class HeaderMenu {

    private readonly page: Page
    private readonly homeLink: Locator
    private readonly addNewArticleLink: Locator
    private readonly signInLink: Locator
    private readonly _profileName: Locator
    private readonly conduitLogo: Locator
    
    
    constructor(page: Page) {
        this.page = page
        this.homeLink = page.getByRole('link', {name: 'Home'})
        this.addNewArticleLink = page.getByRole('link', {name: 'New Article'})
        this.signInLink = page.getByRole('link', {name: 'Sign in'})
        this._profileName = page.locator('a.nav-link[href^="/profile/"]')
        this.conduitLogo = page.locator('.navbar-brand')
    }

    async clickHomeLink(): Promise<void> {
        await this.homeLink.click()
    }

    async clickOnConduitLogo(): Promise<void> {
        await this.conduitLogo.click()
        await expect(this.page).toHaveURL('/')
    }

     async clickSignInLink(): Promise<void> {
        await this.signInLink.click()
    }

    async clickAddNewArticleLink(): Promise<void> {
        await this.addNewArticleLink.waitFor({ state: 'visible', timeout: 5000 });
        await this.addNewArticleLink.click()
        await expect(this.page).toHaveURL('/editor', {timeout: 5000})
    }

    get profileName(): Locator {
        return this._profileName
    }


}