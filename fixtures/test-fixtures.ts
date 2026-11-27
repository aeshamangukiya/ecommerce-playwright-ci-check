import { test as base, expect } from '@playwright/test';

import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderHistoryPage } from '../pages/OrderHistoryPage';

/**
 * VIDEO 10 -> PART 5
 * Gives every test ready-made page objects (custom fixtures: Video 7 and Video 9)
 */
type PageFixtures = {
  registerPage: RegisterPage;
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  orderHistoryPage: OrderHistoryPage;
};

export const test = base.extend<PageFixtures>({
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  orderHistoryPage: async ({ page }, use) => {
    await use(new OrderHistoryPage(page));
  }
});

export { expect };
