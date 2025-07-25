import { Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { HomePage } from "./HomePage";
import { ArticleForm } from "./ArticleForm";
import { HeaderMenu } from "./HeaderMenu";
import { ArticlePage } from "./ArticlePage";

export default class PageManager {

    readonly page: Page
    private readonly loginPage: LoginPage
    private readonly homePage: HomePage
    private readonly articleForm: ArticleForm
    private readonly articlePage: ArticlePage
    private readonly headerMenu: HeaderMenu

    constructor(page: Page) {
        this.page = page
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