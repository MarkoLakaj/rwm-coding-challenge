import { Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { HomePage } from "./HomePage";
import { ArticleForm } from "./ArticleForm";
import { HeaderMenu } from "./HeaderMenu";
import { ArticlePage } from "./ArticlePage";

// Centralized factory for all page objects — promotes reuse and consistency across tests
export default class PageManager {

    readonly page: Page
    private readonly loginPage: LoginPage
    private readonly homePage: HomePage
    private readonly articleForm: ArticleForm
    private readonly articlePage: ArticlePage
    private readonly headerMenu: HeaderMenu

    constructor(page: Page) {
        this.page = page
        // All page objects initialized with the same Page instance — avoids duplication in tests
        this.loginPage = new LoginPage(page)
        this.homePage = new HomePage(page)
        this.articleForm = new ArticleForm(page)
        this.headerMenu = new HeaderMenu(page)
        this.articlePage = new ArticlePage(page)
    }

    onLoginPage(): LoginPage {
        return this.loginPage
    }

    onHomePage(): HomePage {
        return this.homePage
    }

    onArticleForm(): ArticleForm {
        return this.articleForm
    }

    onHeaderMenu(): HeaderMenu {
        return this.headerMenu
    }

    onArticlePage(): ArticlePage {
        return this.articlePage
    }

}