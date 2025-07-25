import { test , expect } from '@playwright/test'
import { loginUser } from '../../support/helpers/api-helper';

test.describe('Testing the login feature via API', () => {

    test('User should be able to login with valid credentials', async({request}) => {

        const response = await loginUser(request, process.env.LOGIN_EMAIL as string, process.env.LOGIN_PASSWORD as string)

        // Check response status
        expect(response.status()).toBe(200);

        const body = await response.json();

        // Validate user object and token presence
        expect(body.user).toBeDefined();
        expect(body.user.email).toBe(process.env.LOGIN_EMAIL);
        expect(body.user.token).toBeTruthy();

        // crude JWT check
        expect(typeof body.user.token).toBe('string');
        expect(body.user.token.split('.').length).toBe(3); 
    })

    test('User should not be able to login with invalid email', async({request}) => {

        const response = await loginUser(request, "invalid@", process.env.LOGIN_PASSWORD as string)

        // Check response status
        expect(response.status()).toBe(403);

        const  body = await response.json();

        // Validate error message for invalid email or password
        expect(body).toHaveProperty('errors');
        expect(body.errors).toHaveProperty('email or password');
        expect(body.errors['email or password']).toEqual(['is invalid']);

    })

    test('User should not be able to login with invalid password', async({request}) => {

        const response = await loginUser(request, process.env.LOGIN_EMAIL as string, 'invalidPassword')

        // Check response status
        expect(response.status()).toBe(403);

        const  body = await response.json();

        // Validate error message for invalid email or password
        expect(body).toHaveProperty('errors');
        expect(body.errors).toHaveProperty('email or password');
        expect(body.errors['email or password']).toEqual(['is invalid']);

    })

     test('User should not be able to login with blank email', async({request}) => {

        const response = await loginUser(request, '', process.env.LOGIN_PASSWORD as string)

        // Check response status
        expect(response.status()).toBe(422);

        const  body = await response.json();

        // Validate error message for blank email
        expect(body).toHaveProperty('errors');
        expect(body.errors).toHaveProperty('email');
        expect(body.errors['email']).toEqual(['can\'t be blank']);

    })

    test('User should not be able to login with blank password', async({request}) => {

        const response = await loginUser(request, process.env.LOGIN_EMAIL as string, '')

        // Check response status
        expect(response.status()).toBe(422);

        const  body = await response.json();

        // Validate error message for blank password
        expect(body).toHaveProperty('errors');
        expect(body.errors).toHaveProperty('password');
        expect(body.errors['password']).toEqual(['can\'t be blank']);

    })

})