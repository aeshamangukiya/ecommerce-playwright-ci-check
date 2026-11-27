import { test } from '../fixtures/test-fixtures';
import { testData, createUser } from '../test-data/test-data';

/**
 * VIDEO 10 -> PART 6
 * AUTHENTICATION -> register, valid login, invalid login
 *
 * Run: npx playwright test tests/auth.spec.ts --project=chromium --headed
 */

test('new user can register @smoke', async ({ registerPage }) => {
  // New email on every run -> OpenCart does not allow the same email twice
  const user = createUser();

  await registerPage.open();
  await registerPage.register(user);
  await registerPage.verifyAccountCreated();
});

test('valid user can log in @smoke', async ({ loginPage }) => {
  const { email, password } = testData.validUser;

  if (!email || !password) {
    throw new Error('Set APP_EMAIL and APP_PASSWORD');
  }

  await loginPage.open();
  await loginPage.login(email, password);
  await loginPage.verifyLoggedIn();
});

test('invalid login shows a warning @regression', async ({ loginPage }) => {
  // An email that does not exist -> our real test account never gets locked
  await loginPage.open();
  await loginPage.login(`wrong.${Date.now()}@example.com`, 'WrongPassword1');
  await loginPage.verifyLoginError();
});
