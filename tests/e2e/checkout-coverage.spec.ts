import { test, expect } from '../../src/fixtures/test';

const product = 'Sauce Labs Backpack';

test.beforeEach(async ({ login, inventory, standardUser }) => {
  await login.goto();
  await login.login(standardUser.username, standardUser.password);
  await inventory.add(product);
  await inventory.cart();
});

test('CART-02 removes a product before checkout', async ({ page }) => {
  const productRow = page.locator('.cart_item').filter({ hasText: product });
  await productRow.getByRole('button', { name: 'Remove' }).click();

  await expect(productRow).toHaveCount(0);
  await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
});

const requiredFieldCases = [
  { field: 'first name', firstName: '', lastName: 'Tester', postalCode: '1000', error: 'First Name is required' },
  { field: 'last name', firstName: 'Portfolio', lastName: '', postalCode: '1000', error: 'Last Name is required' },
  { field: 'postal code', firstName: 'Portfolio', lastName: 'Tester', postalCode: '', error: 'Postal Code is required' },
];

for (const scenario of requiredFieldCases) {
  test(`CHECK-03 validates the required ${scenario.field}`, async ({ page }) => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByPlaceholder('First Name').fill(scenario.firstName);
    await page.getByPlaceholder('Last Name').fill(scenario.lastName);
    await page.getByPlaceholder('Zip/Postal Code').fill(scenario.postalCode);
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('[data-test="error"]')).toContainText(scenario.error);
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
  });
}

test('CHECK-04 preserves product and price in the order overview', async ({ page }) => {
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByPlaceholder('First Name').fill('Portfolio');
  await page.getByPlaceholder('Last Name').fill('Tester');
  await page.getByPlaceholder('Zip/Postal Code').fill('1000');
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByText(product, { exact: true })).toHaveCount(1);
  const itemPrice = Number((await page.locator('[data-test="inventory-item-price"]').innerText()).replace('$', ''));
  const subtotal = Number((await page.locator('[data-test="subtotal-label"]').innerText()).replace('Item total: $', ''));
  const total = Number((await page.locator('[data-test="total-label"]').innerText()).replace('Total: $', ''));

  expect(subtotal).toBe(itemPrice);
  expect(total).toBeGreaterThanOrEqual(subtotal);
});

test('CHECK-05 cancels checkout without creating an order', async ({ page }) => {
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();

  await expect(page).toHaveURL(/cart\.html$/);
  await expect(page.getByText(product, { exact: true })).toHaveCount(1);
  await expect(page.getByText('Thank you for your order!')).toHaveCount(0);
});
