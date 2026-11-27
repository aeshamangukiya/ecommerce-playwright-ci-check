import { test } from '../fixtures/test-fixtures';
import { testData, createUser } from '../test-data/test-data';

/**
 * VIDEO 10 -> PART 6.4
 * CHECKOUT -> full order flow, from register to order history
 *
 * Why a new user here (and not one saved login)?
 * Chromium, Firefox and WebKit run this test at the same time.
 * With one shared account they would also share ONE cart and change each other's order.
 *
 * Run: npx playwright test tests/checkout.spec.ts --project=chromium --headed
 */

test('user can place an order and see it in order history @regression', async ({
  registerPage,
  productPage,
  cartPage,
  checkoutPage,
  orderHistoryPage
}) => {
  const { name, quantity } = testData.product;

  // 1. Register -> OpenCart logs the new user in
  await registerPage.open();
  await registerPage.register(createUser());
  await registerPage.verifyAccountCreated();

  // 2. Search -> product details -> add to cart
  await productPage.searchProduct(name);
  await productPage.openProductDetails(name);
  await productPage.addToCart(1);

  // 3. Cart -> update quantity -> checkout
  await cartPage.open();
  await cartPage.updateQuantity(name, quantity);
  await cartPage.proceedToCheckout();

  // 4. Checkout steps 2 to 5
  await checkoutPage.fillBillingAddress(testData.address);
  await checkoutPage.continueWithSameDeliveryAddress();
  await checkoutPage.continueWithFlatShipping();
  await checkoutPage.continueWithCashOnDelivery();

  // 5. Step 6: check the order, keep the total, place the order
  await checkoutPage.verifyOrderDetails(name, quantity);
  const orderTotal = await checkoutPage.getOrderTotal();
  await checkoutPage.confirmOrder();
  await checkoutPage.verifyOrderPlaced();

  // 6. Order History must show the same total
  await orderHistoryPage.open();
  await orderHistoryPage.verifyLatestOrder(orderTotal);
});
