import { test } from '../fixtures/test-fixtures';
import { testData } from '../test-data/test-data';

/**
 * VIDEO 10 -> PART 6.3
 * CART -> add from search results, update quantity, check the total
 * Every test gets a fresh browser context = its own empty cart.
 *
 * Run: npx playwright test tests/cart.spec.ts --project=chromium --headed
 */

test('user can add a product to cart @regression', async ({ productPage, cartPage }) => {
  const { name } = testData.product;

  await productPage.openHome();
  await productPage.searchProduct(name);
  await productPage.addProductToCart(name);

  await cartPage.open();
  await cartPage.verifyProductInCart(name);
  await cartPage.verifyQuantity(name, 1);
});

test('user can update quantity in cart @regression', async ({ productPage, cartPage }) => {
  const { name, quantity } = testData.product;

  await productPage.openHome();
  await productPage.searchProduct(name);
  await productPage.addProductToCart(name);

  await cartPage.open();
  await cartPage.updateQuantity(name, quantity);
  await cartPage.verifyQuantity(name, quantity);
  await cartPage.verifyRowTotal(name, quantity);
});
