import { expect, Locator, Page } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly elements: {
        profileName: Locator;
        sidebarMenu: Locator;
        myAshaLink: Locator;
        portfolioLink: Locator;
    };

    constructor(page: Page) {
        this.page = page;
        this.elements = {
            profileName: page.locator('.user-name'),
            sidebarMenu: page.locator('app-sidebar'),
            myAshaLink: page.locator('a[href="#/asba"]'),
            portfolioLink: page.locator('a[href="#/portfolio"]'),
        };
    }

    async assertLoggedIn() {
        await expect(this.page).toHaveURL(/.*#\/dashboard/);
    }

    async navigateToMyASBA() {
        await this.elements.myAshaLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToPortfolio() {
        await this.elements.portfolioLink.click();
        await this.page.waitForLoadState('networkidle');
    }
}
