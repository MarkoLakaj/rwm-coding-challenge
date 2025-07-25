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
        // Role-based selectors are stable and accessible — preferred over CSS where possible
        this.homeLink = page.getByRole('link', {name: 'Home'})
        this.addNewArticleLink = page.getByRole('link', {name: 'New Article'})
        this.signInLink = page.getByRole('link', {name: 'Sign in'})
        // Profile name link is dynamic (based on username); using prefix match to make it selector-agnostic
        this._profileName = page.locator('a.nav-link[href^="/profile/"]')
        this.conduitLogo = page.locator('.navbar-brand')
    }

    async clickHomeLink(): Promise<void> {
        await this.homeLink.click()
    }

    async clickOnConduitLogo(): Promise<void> {
        await this.conduitLogo.click()
        // Home page is expected when clicking logo — verify to catch regressions
        await expect(this.page).toHaveURL('/')
        await this.page.waitForLoadState('networkidle');
    }

     async clickSignInLink(): Promise<void> {
        await this.signInLink.click()
    }

    async clickAddNewArticleLink(): Promise<void> {
        // Ensures visibility before interaction — defensive wait in case of slower UI hydration
        await this.addNewArticleLink.waitFor({ state: 'visible', timeout: 5000 });
        await this.addNewArticleLink.click()
        await expect(this.page).toHaveURL('/editor', {timeout: 5000})
    }

    // Exposed as a getter to allow tests/assertions on current user's profile name
    get profileName(): Locator {
        return this._profileName
    }


}