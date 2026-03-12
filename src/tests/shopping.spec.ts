import { test as base } from '@playwright/test';
import { ProductsPage } from '@/pages/products.page';
import { CartPage } from '@/pages/cart.page';
import { CheckoutInformationPage } from '@/pages/checkout-information.page';
import { CheckoutOverviewPage } from '@/pages/checkout-overview.page';
import { CheckoutCompletePage } from '@/pages/checkout-complete.page';
import { faker } from '@faker-js/faker';
import * as allure from 'allure-js-commons';

const test = base.extend<{
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutInformationPage: CheckoutInformationPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
}>({
  productsPage: ({ page }, use) => use(new ProductsPage(page)),
  cartPage: ({ page }, use) => use(new CartPage(page)),
  checkoutInformationPage: ({ page }, use) => use(new CheckoutInformationPage(page)),
  checkoutOverviewPage: ({ page }, use) => use(new CheckoutOverviewPage(page)),
  checkoutCompletePage: ({ page }, use) => use(new CheckoutCompletePage(page)),
});

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const postalCode = faker.location.zipCode();

const subTotal = '63.96';
const totalAmount = '69.08';

test('Complete Shopping Process', async ({
  productsPage,
  cartPage,
  checkoutInformationPage,
  checkoutOverviewPage,
  checkoutCompletePage,
}) => {
  await allure.feature('Shopping Process');
  await allure.story('Complete Shopping Process');
  await allure.severity('Critical');

  await productsPage.navigate();
  await productsPage.addProductToCart('Sauce Labs Backpack');
  await productsPage.addProductToCart('Sauce Labs Bike Light');
  await productsPage.addProductToCart('Sauce Labs Bolt T-Shirt');
  await productsPage.addProductToCart('Sauce Labs Onesie');
  await productsPage.assertItemsInCart(4);
  await productsPage.goToCart();

  await cartPage.verifyProductInCart('Sauce Labs Backpack');
  await cartPage.verifyProductInCart('Sauce Labs Bike Light');
  await cartPage.verifyProductInCart('Sauce Labs Bolt T-Shirt');
  await cartPage.verifyProductInCart('Sauce Labs Onesie');
  await cartPage.proceedToCheckout();

  await checkoutInformationPage.fillCheckoutInformation(firstName, lastName, postalCode);
  await checkoutInformationPage.continueToOverview();

  await checkoutOverviewPage.verifyProductInOverview('Sauce Labs Backpack');
  await checkoutOverviewPage.verifyProductInOverview('Sauce Labs Bike Light');
  await checkoutOverviewPage.verifyProductInOverview('Sauce Labs Bolt T-Shirt');
  await checkoutOverviewPage.verifyProductInOverview('Sauce Labs Onesie');
  await checkoutOverviewPage.assertSubTotal(subTotal);
  await checkoutOverviewPage.assertTotal(totalAmount);
  await checkoutOverviewPage.clickFinishButton();

  await checkoutCompletePage.verifyOrderCompletion();
  await checkoutCompletePage.clickBackHomeButton();

  await productsPage.assertTitle('Products');
});

test('Cancel Checkout Process', async ({ productsPage, cartPage, checkoutInformationPage }) => {
  await allure.feature('Cancel Checkout Process');
  await allure.story('Cancel Checkout Process');
  await allure.severity('Normal');

  await productsPage.navigate();
  await productsPage.addProductToCart('Sauce Labs Backpack');
  await productsPage.goToCart();

  await cartPage.proceedToCheckout();
  await checkoutInformationPage.clickCancelButton();

  await cartPage.clickContinueShoppingButton();

  await productsPage.assertTitle('Products');
  await productsPage.assertItemsInCart(1);

  await productsPage.removeProductFromCart('Sauce Labs Backpack');
  await productsPage.assertItemsInCart(0);
});
