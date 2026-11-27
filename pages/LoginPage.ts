import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * VIDEO 10 -> PART 5
 * LoginPage -> login with an existing account
 */
export class LoginPage extends BasePage {
  async open() {
    await this.goto('account/login');
  }

  async login(email: string, password: string) {
    await this.page.getByPlaceholder('E-Mail Address').fill(email);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async verifyLoggedIn() {
    // After login, OpenCart opens the My Account page
    await expect(this.page).toHaveURL(/route=account\/account/);

    // The footer also has a "My Account" heading -> look only inside the page content
    await expect(
      this.page.locator('#content').getByRole('heading', { name: 'My Account' })
    ).toBeVisible();
  }

  async verifyLoginError() {
    await expect(this.page.locator('.alert-danger')).toContainText(
      'Warning: No match for E-Mail Address and/or Password.'
    );
  }
}
