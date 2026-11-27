import { test } from '../fixtures/test-fixtures';
import { testData } from '../test-data/test-data';

/**
 * VIDEO 10 -> PART 6.1 and 6.2
 * PRODUCTS -> search, filter + sort, no results, product details
 *
 * Run: npx playwright test tests/product.spec.ts --project=chromium --headed
 */

test('user can search for a product @smoke', async ({ productPage }) => {
  await productPage.openHome();
  await productPage.searchProduct(testData.product.name);
  await productPage.verifyProduct(testData.product.name);
});

test('user can filter and sort search results @regression', async ({ productPage }) => {
  const { keyword, category, resultsInCategory, sortBy, resultsSorted } = testData.search;

  await productPage.openHome();
  await productPage.searchProduct(keyword);

  await productPage.filterByCategory(category);
  await productPage.verifyResults(resultsInCategory);

  await productPage.sortBy(sortBy);
  await productPage.verifyResults(resultsSorted);
});

test('unavailable product shows no results @regression', async ({ productPage }) => {
  await productPage.openHome();
  await productPage.searchProduct('Product-Does-Not-Exist');
  await productPage.verifyNoSearchResults();
});

test('user can open product details @regression', async ({ productPage }) => {
  await productPage.openHome();
  await productPage.searchProduct(testData.product.name);
  await productPage.openProductDetails(testData.product.name);
  await productPage.verifyProductDetails(testData.product.name);
});
