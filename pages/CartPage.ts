import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * VIDEO 10 -> PART 5
 * CartPage -> check products, update quantity, go to checkout
 */
export class CartPage extends BasePage {
  async open() {
    await this.goto('checkout/cart');
  }

  // The table row that has this product name
  private productRow(productName: string) {
    return this.page.getByRole('row', { name: productName });
  }

  async verifyProductInCart(productName: string) {
    await expect(this.productRow(productName)).toBeVisible();
  }

  async verifyQuantity(productName: string, quantity: number) {
    await expect(
      this.productRow(productName).getByRole('textbox')
    ).toHaveValue(String(quantity));
  }

  async updateQuantity(productName: string, quantity: number) {
    const row = this.productRow(productName);

    await row.getByRole('textbox').fill(String(quantity));

    // The Update button shows only an icon (no text), so getByRole + name cannot find it.
    // It is the only submit button in the row.
    await row.locator('button[type="submit"]').click();

    await expect(this.page.locator('.alert-success')).toContainText(
      'Success: You have modified your shopping cart!'
    );
  }

  // Row total must be: unit price x quantity
  async verifyRowTotal(productName: string, quantity: number) {
    const cells = this.productRow(productName).getByRole('cell');

    // Columns: Image | Product Name | Model | Quantity | Unit Price | Total
    const unitPrice = toNumber(await cells.nth(4).textContent());
    const rowTotal = toNumber(await cells.nth(5).textContent());

    expect(rowTotal).toBe(unitPrice * quantity);
  }

  async proceedToCheckout() {
    // The header also has a "Checkout" link, so look only inside the page content
    await this.page.locator('#content').getByRole('link', { name: 'Checkout' }).click();
  }
}

// "$1,202.00" -> 1202 (keep only digits and the dot)
function toNumber(price: string | null) {
  return Number((price ?? '').replace(/[^0-9.]/g, ''));
}
