# Examples

Small end-to-end example showing key pieces working together.

Scenario: Add product to cart and go to checkout overview.

Page methods (contract):

- `ProductsPage.addProductToCartByName(name: string)`
- `CartPage.open()`
- `CheckoutInformationPage.fillAndContinue(info)`

Test example:

```ts
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../src/pages/products.page';
import { CartPage } from '../src/pages/cart.page';
import { CheckoutInformationPage } from '../src/pages/checkout-information.page';

test('complete checkout happy path', async ({ page }) => {
  const products = new ProductsPage(page);
  await page.goto('/');

  await products.addProductToCartByName('Sauce Labs Backpack');

  const cart = new CartPage(page);
  await cart.open();

  const checkoutInfo = new CheckoutInformationPage(page);
  await checkoutInfo.fillAndContinue({ firstName: 'Jane', lastName: 'Doe', postalCode: '12345' });

  // assertions on overview
  await expect(page).toHaveURL(/checkout-step-two/);
});
```

Tips

- Keep example methods small; tests read like stories when pages provide descriptive actions.
