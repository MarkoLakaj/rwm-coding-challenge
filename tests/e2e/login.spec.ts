import { test, expect } from "../../support/fixtures/setup-fixtures";


test.describe('Tests regarding the Login functionality', () => {

    test.beforeEach('User navigates to login page', async({goToLoginPage}) => {
        await goToLoginPage()
    })

    
    test('User should be able to log in with valid credentials', async({pageManager}) => {
        
        // Successful login and profile name verification
        await pageManager.onLoginPage().loginUser(process.env.LOGIN_EMAIL as string, process.env.LOGIN_PASSWORD as string)
        await expect(pageManager.onHeaderMenu().profileName).toContainText(process.env.USER_PROFILE as string)
    
    })

    test('User should not be able to login with invalid or non-registered email', async({pageManager}) => {
    
        // Attempt login with invalid email format
        await pageManager.onLoginPage().loginUser('invalid@', process.env.LOGIN_PASSWORD as string)
        await expect(pageManager.onLoginPage().errorMessage).toContainText('email or password is invalid')

        // Attempt login with unregistered email
        await pageManager.onLoginPage().email.clear()
        await pageManager.onLoginPage().loginUser('non-registered@gmail.com', process.env.LOGIN_PASSWORD as string)
        await expect(pageManager.onLoginPage().errorMessage).toContainText('email or password is invalid')
    
    })

    test('User should not be able to login with invalid password', async({pageManager}) => {
        
        // Login attempt with wrong password triggers error
        await pageManager.onLoginPage().loginUser(process.env.LOGIN_EMAIL as string, 'invalidPassword')
        await expect(pageManager.onLoginPage().errorMessage).toContainText('email or password is invalid')
    
    })

    test('User should not be able to login with blank credentials', async({pageManager}) => {
    
        // Submit button disabled if no credentials entered
        await expect(pageManager.onLoginPage().submitButton).toBeDisabled()
    
    })

    test('User should not be able to login with blank email', async({pageManager}) => {
    
        // Submit disabled if email is blank but password entered
        await pageManager.onLoginPage().enterPassword(process.env.LOGIN_PASSWORD as string)
        await expect(pageManager.onLoginPage().submitButton).toBeDisabled()
    
    })

    test('User should not be able to login with blank password', async({pageManager}) => {

        // Submit disabled if password is blank but email entered
        await pageManager.onLoginPage().enterEmail(process.env.LOGIN_EMAIL as string)
        await expect(pageManager.onLoginPage().submitButton).toBeDisabled()
    
    })

    test('User\'s password is masked when entering it in the password field', async({pageManager}) => {
    
        // Verify password input type is 'password' for masking
        await pageManager.onLoginPage().enterPassword(process.env.LOGIN_PASSWORD as string)
        await expect(pageManager.onLoginPage().password).toHaveAttribute('type', 'password')

    })


})