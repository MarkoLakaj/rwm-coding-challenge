import { APIRequestContext, APIResponse } from '@playwright/test';


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

export async function createNewArticle(request: APIRequestContext, token: string, payload: object) {

    return await request.post(`${process.env.BASE_API_URL}/articles/`, {
        data: payload,
        headers: {
            Authorization: `Token ${token}`
        }
    })
}

export async function getAllArticles(request: APIRequestContext) {

    return await request.get(`${process.env.BASE_API_URL}/articles/`)
}

export async function getArticleBySlugID(request: APIRequestContext, slugID: string) {

    return await request.get(`${process.env.BASE_API_URL}/articles/${slugID}`)
}

export async function updateArticle(request: APIRequestContext, slugID: string, payload: object, token: string) {

    return await request.put(`${process.env.BASE_API_URL}/articles/${slugID}`, {
        data: payload,
        headers: {
            Authorization: `Token ${token}`
        }
    })
}

export async function deleteArticle(request: APIRequestContext, token: string, slugID: string) {

    return await request.delete(`${process.env.BASE_API_URL}/articles/${slugID}`, {
        headers: {
            Authorization: `Token ${token}`
        }
    })
}

export async function getLatestArticleSlug(request: APIRequestContext, username: string): Promise<string | null> {
    const response = await request.get(`${process.env.BASE_API_URL}/articles?author=${username}&limit=1`);
    const body = await response.json();
    const articles = body.articles;

    return articles.length > 0 ? articles[0].slug : null;
}