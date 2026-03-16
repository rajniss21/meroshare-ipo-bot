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
      dpDropdown: page.locator('.select2-selection--single'),
      dpSearchInput: page.locator('.select2-search__field'),
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
    await this.elements.dpDropdown.click();
    await this.elements.dpSearchInput.waitFor({ state: 'visible' });
    await this.elements.dpSearchInput.fill(dpName);
    await this.page.waitForTimeout(500);
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
    await this.page.waitForLoadState('networkidle');
  }

  async assertLoginError(errorMessage: string) {
    await expect(this.page.locator('.toast-message')).toContainText(errorMessage);
  }
}
