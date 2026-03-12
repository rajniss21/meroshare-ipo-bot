import { expect, Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly elements: {
    title: Locator;
    productCard: Locator;
    productName: Locator;
    productDescription: Locator;
    productPrice: Locator;
    addToCardButton: (product: string) => Locator;
    removeFromCartButton: (product: string) => Locator;
    shoppingCartLink: Locator;
    cartBadge: Locator;
  };
  constructor(page: Page) {
    this.page = page;
    this.elements = {
      title: page.getByTestId('title'),
      productCard: page.getByTestId('inventory-item'),
      productName: page.getByTestId('product-name'),
      productDescription: page.getByTestId('product-description'),
      productPrice: page.getByTestId('product-price'),
      addToCardButton: (product: string) =>
        page.getByTestId(`add-to-cart-${product.toLowerCase().replace(/\s/g, '-')}`),
      removeFromCartButton: (product: string) =>
        page.getByTestId(`remove-${product.toLowerCase().replace(/\s/g, '-')}`),
      shoppingCartLink: page.getByTestId('shopping-cart-link'),
      cartBadge: page.getByTestId('shopping-cart-badge'),
    };
  }

  async navigate() {
    await this.page.goto('/inventory.html');
  }

  async assertTitle(title: string) {
    await expect(this.elements.title).toHaveText(title);
  }

  async addProductToCart(productName: any) {
    await this.elements.addToCardButton(productName).click();
  }

  async removeProductFromCart(productName: any) {
    await this.elements.removeFromCartButton(productName).click();
  }

  async goToCart() {
    await this.elements.shoppingCartLink.click();
  }

  async getCartItemCount() {
    const badge = await this.elements.cartBadge;
    if (await badge.isVisible()) {
      const countText = await badge.textContent();
      return parseInt(countText || '0', 10);
    }
    return 0;
  }

  async assertItemsInCart(count: number) {
    const itemCount = await this.getCartItemCount();
    expect(itemCount).toBe(count);
  }
}
