import { Locator, Page, expect } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly page: Page;
  readonly elements: {
    productName: Locator;
    subTotalLabel: Locator;
    taxLabel: Locator;
    totalLabel: Locator;
    cancelButton: Locator;
    finishButton: Locator;
  };
  constructor(page: Page) {
    this.page = page;
    this.elements = {
      productName: page.getByTestId('inventory-item-name'),
      subTotalLabel: page.getByTestId('subtotal-label'),
      taxLabel: page.getByTestId('tax-label'),
      totalLabel: page.getByTestId('total-label'),
      cancelButton: page.getByTestId('cancel'),
      finishButton: page.getByTestId('finish'),
    };
  }

  async verifyProductInOverview(productName: string) {
    await expect(this.elements.productName.filter({ hasText: productName })).toBeVisible();
  }

  async assertSubTotal(amount?: string) {
    await expect(this.elements.subTotalLabel).toBeVisible();
  }

  async assertTotal(amount?: string) {
    await expect(this.elements.totalLabel).toBeVisible();
  }

  async clickFinishButton() {
    await this.elements.finishButton.click();
  }

  async clickCancelButton() {
    await this.elements.cancelButton.click();
  }
}
