import { Page, Locator } from '@playwright/test'
import expect from '@playwright/test'

export class LoginPage {

    private readonly page: Page
    private readonly _email: Locator
    private readonly _password: Locator
    private readonly _submitButton: Locator
    private readonly _errorMessage: Locator

    constructor(page:Page) {
        this.page = page
        // Placeholder-based selectors — stable for this app’s implementation
        this._email = page.getByPlaceholder('email')
        this._password = page.getByPlaceholder('Password')
        // Role + name targeting ensures accessibility-safe selection
        this._submitButton = page.getByRole('button', {name: 'Sign in'} )
        this._errorMessage = page.locator('.error-messages')
    }

    // Exposing locators for direct assertions in tests
    get errorMessage(): Locator {
        return this._errorMessage
    }

    get submitButton(): Locator {
        return this._submitButton
    }

    get email(): Locator {
        return this._email
    }

    get password(): Locator {
        return this._password
    }

    async enterEmail(emailValue: string): Promise<void> {
        await this.email.waitFor({ state: 'visible' }); // Defensive wait to reduce test flakiness
        await this.email.fill(emailValue)
    }

    async enterPassword(passwordValue: string): Promise<void> {
        await this.password.waitFor({ state: 'visible' });
        await this.password.fill(passwordValue)
    }

    async loginUser(emailValue: string, passwordValue: string): Promise<void>  {
        
        // High-level helper to reduce duplication in test flows
        await this.enterEmail(emailValue)
        await this.enterPassword(passwordValue)
        await this.submitButton.waitFor({ state: 'visible' });
        await this.submitButton.click()
    }

}