import { APIRequestContext, APIResponse } from '@playwright/test';


// Performs user login via API; returns full API response for further inspection if needed
export async function loginUser(request: APIRequestContext, email: string, password: string): Promise<APIResponse> {
  return await request.post(`${process.env.BASE_API_URL}/users/login`, {
    data: {
        "user": {
            "email": email,
            "password": password
        }
    }
  })
}

// Retrieves auth token for given user credentials — throws if login fails or token missing
export async function getUserToken(request: APIRequestContext): Promise<string> {

    const response = await loginUser(request, process.env.LOGIN_EMAIL as string, process.env.LOGIN_PASSWORD as string)

    if (response.status() !== 200) {
        throw new Error(`Login failed with status ${response.status()}`);
    }

    const body = await response.json();

    if (!body.user?.token) {
        throw new Error('Token not found in login response');
    }

    return body.user.token;
}

// Creates a new article with auth token — payload expected to match API contract
export async function createNewArticle(request: APIRequestContext, token: string, payload: object) {

    return await request.post(`${process.env.BASE_API_URL}/articles/`, {
        data: payload,
        headers: {
            Authorization: `Token ${token}`
        }
    })
}

// Fetches all articles (unauthenticated)
export async function getAllArticles(request: APIRequestContext) {

    return await request.get(`${process.env.BASE_API_URL}/articles/`)
}

// Fetches article details by its slug ID (usually URL-friendly article identifier)
export async function getArticleBySlugID(request: APIRequestContext, slugID: string) {

    return await request.get(`${process.env.BASE_API_URL}/articles/${slugID}`)
}

// Updates an existing article by slug ID; requires authorization token and payload
export async function updateArticle(request: APIRequestContext, slugID: string, payload: object, token: string) {

    return await request.put(`${process.env.BASE_API_URL}/articles/${slugID}`, {
        data: payload,
        headers: {
            Authorization: `Token ${token}`
        }
    })
}

// Deletes an article identified by slug ID with proper authorization
export async function deleteArticle(request: APIRequestContext, token: string, slugID: string) {

    return await request.delete(`${process.env.BASE_API_URL}/articles/${slugID}`, {
        headers: {
            Authorization: `Token ${token}`
        }
    })
}

// Retrieves the slug of the latest article authored by a specific user; returns null if none found
export async function getLatestArticleSlug(request: APIRequestContext, username: string): Promise<string | null> {
    const response = await request.get(`${process.env.BASE_API_URL}/articles?author=${username}&limit=1`);
    const body = await response.json();
    const articles = body.articles;

    return articles.length > 0 ? articles[0].slug : null;
}