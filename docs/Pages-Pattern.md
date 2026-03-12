# Pages pattern

This project follows a Page Object Model (POM) implemented with Playwright and TypeScript.

Key ideas

- Each page is a class under `src/pages/` that accepts a Playwright `page` in the constructor.
- Locators are exposed as `readonly` getters or private fields and methods expose interactions.
- Tests import page classes and instantiate them with the Playwright `page` fixture.

Minimal example (in `src/pages/products.page.ts`):

```ts
import { Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  // locator as getter
  get productCards() {
    return this.page.locator('.product-card');
  }

  async addProductToCartByName(name: string) {
    await this.page.locator(`text=${name}`).locator('button:add-to-cart').click();
  }
}
```

Tips

- Prefer stable attributes like `data-testid` for locators.
- Keep page methods small and descriptive (e.g., `fillAddress()`, `submitOrder()`).
