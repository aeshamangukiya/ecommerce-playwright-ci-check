import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Address } from '../test-data/test-data';

/**
 * VIDEO 10 -> PART 5
 * CheckoutPage -> the 6 checkout steps for a logged-in customer
 * Each step is a panel with its own id, and every step has a "Continue" button.
 * So we always look for "Continue" INSIDE the right panel.
 */
export class CheckoutPage extends BasePage {
  // Every step loads the next panel with background (jQuery AJAX) requests.
  // If we click "Continue" while one is still running, it can overwrite the checkout
  // session and OpenCart says "Payment method required!" (seen on GitHub Actions).
  // jQuery.active = number of running requests -> wait until it is 0 before clicking.
  private async waitForBackgroundRequests() {
    await this.page.waitForFunction(() => (window as any).jQuery.active === 0);
  }

  // Step 2: Billing Details (a new customer has no saved address yet)
  async fillBillingAddress(address: Address) {
    const billing = this.page.locator('#collapse-payment-address');

    await billing.getByPlaceholder('First Name').fill(address.firstName);
    await billing.getByPlaceholder('Last Name').fill(address.lastName);
    await billing.getByPlaceholder('Address 1').fill(address.address1);
    await billing.getByPlaceholder('City').fill(address.city);
    await billing.getByPlaceholder('Post Code').fill(address.postCode);

    // Region list loads after the country is chosen.
    // selectOption waits until the option is there.
    await billing.getByLabel('Country').selectOption({ label: address.country });
    await billing.getByLabel('Region / State').selectOption({ label: address.region });

    await this.waitForBackgroundRequests();
    await billing.getByRole('button', { name: 'Continue' }).click();
  }

  // Step 3: Delivery Details -> "I want to use an existing address" is already selected
  async continueWithSameDeliveryAddress() {
    await this.waitForBackgroundRequests();
    await this.page
      .locator('#collapse-shipping-address')
      .getByRole('button', { name: 'Continue' })
      .click();
  }

  // Step 4: Delivery Method -> "Flat Shipping Rate" is already selected
  async continueWithFlatShipping() {
    const delivery = this.page.locator('#collapse-shipping-method');

    await expect(delivery.getByText('Flat Shipping Rate')).toBeVisible();
    await this.waitForBackgroundRequests();
    await delivery.getByRole('button', { name: 'Continue' }).click();
  }

  // Step 5: Payment Method -> "Cash On Delivery" + accept Terms & Conditions
  async continueWithCashOnDelivery() {
    const payment = this.page.locator('#collapse-payment-method');

    await expect(payment.getByText('Cash On Delivery')).toBeVisible();
    await payment.getByRole('checkbox').check();
    await this.waitForBackgroundRequests();
    await payment.getByRole('button', { name: 'Continue' }).click();
  }

  // Step 6: Confirm Order -> check product name and quantity
  async verifyOrderDetails(productName: string, quantity: number) {
    const productRow = this.page
      .locator('#collapse-checkout-confirm')
      .getByRole('row', { name: productName });

    // Columns: Product Name | Model | Quantity | Unit Price | Total
    await expect(productRow.getByRole('cell').nth(2)).toHaveText(String(quantity));
  }

  // Read the "Total:" row, e.g. "$205.00"
  // /^Total:/ -> starts with "Total:", so the "Sub-Total:" row is not picked
  async getOrderTotal() {
    const totalCell = this.page
      .locator('#collapse-checkout-confirm')
      .getByRole('row', { name: /^Total:/ })
      .getByRole('cell')
      .last();

    // Reading text does NOT auto-wait, so first wait until a price is shown.
    // textContent() -> in WebKit, innerText() gave "" while the panel was still opening.
    await expect(totalCell).toHaveText(/\$\d/);
    const total = await totalCell.textContent();

    return (total ?? '').trim();
  }

  async confirmOrder() {
    await this.waitForBackgroundRequests();
    await this.page.getByRole('button', { name: 'Confirm Order' }).click();
  }

  async verifyOrderPlaced() {
    await expect(this.page).toHaveURL(/route=checkout\/success/);
    await expect(
      this.page.getByRole('heading', { name: 'Your order has been placed!' })
    ).toBeVisible();
  }
}
