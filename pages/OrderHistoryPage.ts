import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * VIDEO 10 -> PART 5
 * OrderHistoryPage -> My Account > Order History
 */
export class OrderHistoryPage extends BasePage {
  async open() {
    await this.goto('account/order');
  }

  // The newest order is the first row of the table
  async verifyLatestOrder(orderTotal: string) {
    await expect(
      this.page.getByRole('heading', { name: 'Order History' })
    ).toBeVisible();

    const latestOrder = this.page.locator('#content tbody tr').first();

    // Columns: Order ID | Customer | No. of Products | Status | Total | Date Added
    await expect(latestOrder.getByRole('cell').nth(0)).toHaveText(/^#\d+$/);
    await expect(latestOrder.getByRole('cell').nth(3)).toHaveText('Pending');
    await expect(latestOrder.getByRole('cell').nth(4)).toHaveText(orderTotal);
  }
}
