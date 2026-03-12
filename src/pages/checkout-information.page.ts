import { Locator, Page } from '@playwright/test';

export class CheckoutInformationPage {
  readonly page: Page;
  readonly elements: {
    firstName: Locator;
    lastName: Locator;
    postalCode: Locator;
    cancelButton: Locator;
    continueShoppingButton: Locator;
  };
  constructor(page: Page) {
    this.page = page;
    this.elements = {
      firstName: page.getByTestId('firstName'),
      lastName: page.getByTestId('lastName'),
      postalCode: page.getByTestId('postalCode'),
      cancelButton: page.getByTestId('cancel'),
      continueShoppingButton: page.getByTestId('continue'),
    };
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.elements.firstName.fill(firstName);
    await this.elements.lastName.fill(lastName);
    await this.elements.postalCode.fill(postalCode);
  }

  async continueToOverview() {
    await this.elements.continueShoppingButton.click();
  }

  async clickCancelButton() {
    await this.elements.cancelButton.click();
  }
}
