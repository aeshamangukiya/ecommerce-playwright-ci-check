import { Page } from '@playwright/test';

/**
 * VIDEO 10 -> PART 5
 * BasePage -> code that every page class shares (POM: Video 9)
 */
export class BasePage {
  constructor(protected page: Page) {}

  // Every OpenCart page is "index.php?route=...", e.g. route 'account/login'.
  // No slash at the start -> the path is added after the baseURL (.../ui/).
  async goto(route: string) {
    await this.page.goto(`index.php?route=${route}`);
  }
}
