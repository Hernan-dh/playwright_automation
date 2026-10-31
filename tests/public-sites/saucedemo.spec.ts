import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => { await page.goto('https://www.saucedemo.com/'); });

async function login(page: import('@playwright/test').Page, username = 'standard_user', password = 'secret_sauce') {
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test('@quick PUBLIC-SAUCE-01 authenticates with the published demo account', async ({ page }) => {
  await login(page);
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});

test('@quick PUBLIC-SAUCE-02 adds a product to the session cart', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

test('PUBLIC-SAUCE-03 rejects invalid credentials', async ({ page }) => {
  await login(page, 'standard_user', 'invalid-password');
  await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
});

test('PUBLIC-SAUCE-04 explains a locked account', async ({ page }) => {
  await login(page, 'locked_out_user');
  await expect(page.locator('[data-test="error"]')).toContainText('locked out');
});

test('PUBLIC-SAUCE-05 sorts inventory by price', async ({ page }) => {
  await login(page);
  await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
  const prices = await page.locator('.inventory_item_price').allTextContents();
  const values = prices.map(value => Number(value.replace('$', '')));
  expect(values).toEqual([...values].sort((a, b) => a - b));
});

test('PUBLIC-SAUCE-06 opens a product detail', async ({ page }) => {
  await login(page);
  await page.getByText('Sauce Labs Backpack', { exact: true }).first().click();
  await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
});

test('PUBLIC-SAUCE-07 removes an item from the cart', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.locator('.shopping_cart_link').click();
  await page.getByRole('button', { name: 'Remove' }).click();
  await expect(page.locator('.cart_item')).toHaveCount(0);
});

test('PUBLIC-SAUCE-08 validates required checkout data', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.locator('.shopping_cart_link').click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
});
