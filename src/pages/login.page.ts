import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly elements: {
        dpDropdown: Locator;
        dpSearchInput: Locator;
        dpOption: (dpName: string) => Locator;
        usernameInput: Locator;
        passwordInput: Locator;
        loginButton: Locator;
    };

    constructor(page: Page) {
        this.page = page;
        this.elements = {
            // Select2 dropdown — click the rendered selection span to open
            dpDropdown: page.locator('.select2-selection--single'),
            // The search input inside the Select2 dropdown overlay
            dpSearchInput: page.locator('.select2-search__field'),
            // Matching option in the Select2 results list
            dpOption: (dpName: string) =>
                page.locator('.select2-results__option').filter({ hasText: dpName }),
            usernameInput: page.locator('#username'),
            passwordInput: page.locator('#password'),
            loginButton: page.locator('button[type="submit"]'),
        };
    }

    async navigate() {
        await this.page.goto('/#/login');
        await this.page.waitForLoadState('networkidle');
    }

    async selectDP(dpName: string) {
        // Click the Select2 dropdown to open it
        await this.elements.dpDropdown.click();

        // Wait for the Select2 search input to appear
        await this.elements.dpSearchInput.waitFor({ state: 'visible' });

        // Type the DP name to search/filter
        await this.elements.dpSearchInput.fill(dpName);
        await this.page.waitForTimeout(500); // wait for filter results

        // Click the matching option
        await this.elements.dpOption(dpName).first().click();
    }

    async fillUsername(username: string) {
        await this.elements.usernameInput.fill(username);
    }

    async fillPassword(password: string) {
        await this.elements.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.elements.loginButton.click();
    }

    async login(dpName: string, username: string, password: string) {
        await this.navigate();
        await this.selectDP(dpName);
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLogin();
        // Wait for navigation after login
        await this.page.waitForLoadState('networkidle');
    }

    async assertLoginError(errorMessage: string) {
        await expect(this.page.locator('.toast-message')).toContainText(errorMessage);
    }
}
