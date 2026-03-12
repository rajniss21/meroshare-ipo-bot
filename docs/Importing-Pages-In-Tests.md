# Importing pages in tests

Typical pattern inside `tests/*`:

1. Import the page class from `src/pages`.
2. Instantiate it using the `page` fixture in `test.beforeEach` or inside a test.

Example (tests/shopping.spec.ts):

```ts
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../src/pages/products.page';

test.describe('Shopping flow', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    await page.goto('/');
  });

  test('add to cart', async ({ page }) => {
    await productsPage.addProductToCartByName('Sauce Labs Backpack');
    // assertions...
  });
});
```

Notes

- Keep imports relative to the `tests` directory (use `../src/pages/...`).
- Avoid instantiating page objects globally across parallel tests. Use fixtures or `beforeEach`.
