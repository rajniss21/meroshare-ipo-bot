import { Locator, Page, expect } from '@playwright/test';

export class CheckoutCompletePage {
  readonly page: Page;
  readonly elements: {
    confirmationImage: Locator;
    confirmationMessage: Locator;
    backHomeButton: Locator;
  };
  constructor(page: Page) {
    this.page = page;
    this.elements = {
      confirmationImage: page.getByTestId('pony-express'),
      confirmationMessage: page.getByTestId('complete-header'),
      backHomeButton: page.getByTestId('back-to-products'),
    };
  }

  async verifyOrderCompletion() {
    await expect(this.elements.confirmationMessage).toBeVisible();
  }

  async clickBackHomeButton() {
    await this.elements.backHomeButton.click();
  }
}
