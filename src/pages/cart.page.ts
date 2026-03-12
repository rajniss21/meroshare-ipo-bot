import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly elements: {
    quantity: Locator;
    productName: Locator;
    productDescription: Locator;
    productPrice: Locator;
    removeButton: (product: string) => Locator;
    continueShoppingButton: Locator;
    checkoutButton: Locator;
  };
  constructor(page: Page) {
    this.page = page;
    this.elements = {
      quantity: page.getByTestId('inventory-item-quantity'),
      productName: page.getByTestId('inventory-item-name'),
      productDescription: page.getByTestId('inventory-item-description'),
      productPrice: page.getByTestId('inventory-item-price'),
      removeButton: (product: string) =>
        page.getByTestId(`remove-${product.toLowerCase().replace(/\s/g, '-')}`),
      continueShoppingButton: page.getByTestId('continue-shopping'),
      checkoutButton: page.getByTestId('checkout'),
    };
  }

  async navigate() {
    await this.page.goto('/cart.html');
  }

  async verifyProductInCart(productName: string) {
    await this.elements.productName
      .filter({ hasText: productName })
      .first()
      .waitFor({ state: 'visible' });
  }

  async removeProduct(productName: any) {
    await this.elements.removeButton(productName).click();
  }

  async proceedToCheckout() {
    await this.elements.checkoutButton.click();
  }

  async clickContinueShoppingButton() {
    await this.elements.continueShoppingButton.click();
  }
}
