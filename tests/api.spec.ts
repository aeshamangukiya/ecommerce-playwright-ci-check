import { test, expect } from '../fixtures/test-fixtures';
import { testData } from '../test-data/test-data';

/**
 * VIDEO 10 -> PART 7
 * API tests (API testing basics: Video 8)
 *
 * OpenCart has no public product-list JSON API.
 * So we test two real URLs that the store itself uses:
 *  - GET  index.php?route=product/search      -> returns the search page (HTML)
 *  - POST index.php?route=checkout/cart/add   -> the "Add to Cart" button calls this (JSON)
 *
 * Run: npx playwright test tests/api.spec.ts --project=chromium
 */

test('search request returns the product @smoke', async ({ request }) => {
  // params -> Playwright builds the query string: ?route=product/search&search=HTC+Touch+HD
  const response = await request.get('index.php', {
    params: { route: 'product/search', search: testData.product.name }
  });

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/html');

  const html = await response.text();
  expect(html).toContain(testData.product.name);
});

test('add to cart API returns a success message @regression', async ({ request }) => {
  // form -> sends the data like an HTML form (the same way the website does)
  const response = await request.post('index.php?route=checkout/cart/add', {
    form: { product_id: testData.product.id, quantity: '1' }
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.success).toContain(testData.product.name);
  expect(body.total).toContain('1 item(s)');
});

test('add to cart API rejects an unknown product @regression', async ({ request }) => {
  const response = await request.post('index.php?route=checkout/cart/add', {
    form: { product_id: '999999', quantity: '1' }
  });

  // Status is still 200, so we must check the body: no "success" key
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.success).toBeUndefined();
});

test('product added by API is shown in the UI cart @regression', async ({ page, cartPage }) => {
  const { id, name, quantity } = testData.product;

  // page.request shares cookies with this browser page -> same session = same cart.
  // (The separate "request" fixture has its own cookies, so its cart is not this one.)
  const response = await page.request.post('index.php?route=checkout/cart/add', {
    form: { product_id: id, quantity: String(quantity) }
  });
  expect(response.ok()).toBeTruthy();

  // UI: open the cart and check what the API added
  await cartPage.open();
  await cartPage.verifyProductInCart(name);
  await cartPage.verifyQuantity(name, quantity);
});
