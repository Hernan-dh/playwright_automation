import { test, expect } from '../../src/fixtures/test';
import users from '../../src/data/users.json';

test('@smoke AUTH-01 authenticates a valid user', async ({ login, inventory, standardUser }) => {
  await login.goto(); await login.login(standardUser.username, standardUser.password); await inventory.expectLoaded();
});

test('AUTH-02 rejects a locked user', async ({ login }) => {
  await login.goto(); await login.login(users.locked.username, users.locked.password); await login.expectError(/locked out/i);
});

test('@smoke CART-01 CHECK-01 completes checkout', async ({ page, login, inventory, standardUser }) => {
  await login.goto(); await login.login(standardUser.username, standardUser.password);
  await inventory.add('Sauce Labs Backpack'); await inventory.cart();
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByPlaceholder('First Name').fill('Hernan'); await page.getByPlaceholder('Last Name').fill('De Haro'); await page.getByPlaceholder('Zip/Postal Code').fill('1000');
  await page.getByRole('button', { name: 'Continue' }).click(); await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.getByText('Thank you for your order!')).toBeVisible();
});

test('CHECK-02 validates mandatory checkout fields', async ({ page, login, inventory, standardUser }) => {
  await login.goto(); await login.login(standardUser.username, standardUser.password); await inventory.add('Sauce Labs Backpack'); await inventory.cart();
  await page.getByRole('button', { name: 'Checkout' }).click(); await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
});
