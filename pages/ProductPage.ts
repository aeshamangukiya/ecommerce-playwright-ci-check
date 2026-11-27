import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * VIDEO 10 -> PART 5
 * ProductPage -> search, filter, sort, product details, add to cart
 */
export class ProductPage extends BasePage {
  // Every product in the result list is a card with the class "product-thumb"
  private productCards = this.page.locator('.product-thumb');
  private productNames = this.page.locator('.product-thumb h4');

  async openHome() {
    await this.goto('common/home');
  }

  // Search box in the header: type the name and press Enter
  async searchProduct(productName: string) {
    const searchBox = this.page.getByPlaceholder('Search', { exact: true });
    await searchBox.fill(productName);
    await searchBox.press('Enter');
  }

  async verifyProduct(productName: string) {
    await expect(
      this.page.getByRole('heading', { name: productName, exact: true })
    ).toBeVisible();
  }

  async verifyNoSearchResults() {
    await expect(
      this.page.getByText('There is no product that matches the search criteria.')
    ).toBeVisible();
  }

  // Filter on the search page. The Category dropdown has no label -> use its name attribute.
  async filterByCategory(category: string) {
    await this.page.locator('select[name="category_id"]').selectOption({ label: category });
    await this.page.getByRole('button', { name: 'Search', exact: true }).click();
  }

  // Choosing a sort option reloads the page with the new order
  async sortBy(option: string) {
    await this.page.getByLabel('Sort By:').selectOption({ label: option });
  }

  // toHaveText with a list checks every name AND the order.
  // It keeps retrying, so it also waits for the reload after sorting.
  async verifyResults(productNames: string[]) {
    await expect(this.productNames).toHaveText(productNames);
  }

  async openProductDetails(productName: string) {
    await this.page
      .getByRole('heading', { name: productName, exact: true })
      .getByRole('link')
      .click();
  }

  async verifyProductDetails(productName: string) {
    await expect(
      this.page.getByRole('heading', { name: productName, level: 1 })
    ).toBeVisible();
    await expect(this.page.getByLabel('Qty')).toBeVisible();
    await expect(
      this.page.getByRole('button', { name: 'Add to Cart', exact: true })
    ).toBeVisible();
  }

  // Add to cart from the product details page
  async addToCart(quantity: number) {
    await this.page.getByLabel('Qty').fill(String(quantity));
    await this.page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
    await expect(this.page.locator('.alert-success')).toContainText('Success: You have added');
  }

  // Add to cart from the search results.
  // Every card has its own "Add to Cart" button, so first find the card of THIS product.
  async addProductToCart(productName: string) {
    const productCard = this.productCards.filter({
      has: this.page.getByRole('heading', { name: productName, exact: true })
    });

    await productCard.getByRole('button', { name: 'Add to Cart' }).click();

    await expect(this.page.locator('.alert-success')).toContainText(
      `Success: You have added ${productName} to your shopping cart!`
    );
  }
}
