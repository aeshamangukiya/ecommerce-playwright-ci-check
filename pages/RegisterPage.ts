import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { NewUser } from '../test-data/test-data';

/**
 * VIDEO 10 -> PART 5
 * RegisterPage -> create a new customer account
 */
export class RegisterPage extends BasePage {
  async open() {
    await this.goto('account/register');
  }

  async register(user: NewUser) {
    await this.page.getByPlaceholder('First Name').fill(user.firstName);
    await this.page.getByPlaceholder('Last Name').fill(user.lastName);
    await this.page.getByPlaceholder('E-Mail').fill(user.email);
    await this.page.getByPlaceholder('Telephone').fill(user.telephone);

    // exact: true -> otherwise 'Password' also matches 'Password Confirm'
    await this.page.getByPlaceholder('Password', { exact: true }).fill(user.password);
    await this.page.getByPlaceholder('Password Confirm').fill(user.password);

    // The Privacy Policy checkbox has no label, so we use its name attribute
    await this.page.locator('input[name="agree"]').check();

    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async verifyAccountCreated() {
    await expect(
      this.page.getByRole('heading', { name: 'Your Account Has Been Created!' })
    ).toBeVisible();
  }
}
