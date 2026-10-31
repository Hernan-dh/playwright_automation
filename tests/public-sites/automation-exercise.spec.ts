import { expect, test } from '@playwright/test';

async function acceptConsentWhenPresented(page: import('@playwright/test').Page) {
  const consent = page.getByRole('button', { name: 'Consent', exact: true });
  await consent.waitFor({ state: 'visible', timeout: 3_000 }).catch(() => {});
  if (await consent.isVisible()) await consent.click();
}

test('@quick PUBLIC-EXERCISE-01 exposes its published automation cases', async ({ page }) => {
  await page.goto('https://automationexercise.com/test_cases');
  await expect(page.getByText('Below is the list of test Cases for you to practice the Automation.')).toBeVisible();
  await expect(page.getByText('Test Case 1: Register User')).toBeVisible();
});

test('@quick PUBLIC-EXERCISE-02 searches the public product catalog', async ({ page }) => {
  await page.goto('https://automationexercise.com/products');
  await acceptConsentWhenPresented(page);
  await page.locator('#search_product').fill('Blue Top');
  await page.locator('#submit_search').click();
  await expect(page.getByText('Searched Products', { exact: false })).toBeVisible();
  await expect(page.getByText('Blue Top', { exact: true }).first()).toBeVisible();
});

test('PUBLIC-EXERCISE-03 lists the product catalog', async ({ page }) => {
  await page.goto('https://automationexercise.com/products'); await acceptConsentWhenPresented(page);
  await expect(page.getByText('All Products', { exact: false })).toBeVisible();
  await expect(page.locator('.features_items .product-image-wrapper')).not.toHaveCount(0);
});

test('PUBLIC-EXERCISE-04 opens product details', async ({ page }) => {
  await page.goto('https://automationexercise.com/product_details/1'); await acceptConsentWhenPresented(page);
  await expect(page.getByText('Blue Top', { exact: true })).toBeVisible();
  await expect(page.getByText('Category:', { exact: false })).toBeVisible();
});

test('PUBLIC-EXERCISE-05 exposes the API catalog', async ({ page }) => {
  await page.goto('https://automationexercise.com/api_list');
  await expect(page.getByText('APIs List for practice', { exact: false })).toBeVisible();
});

test('PUBLIC-EXERCISE-06 shows an empty session cart', async ({ page }) => {
  await page.goto('https://automationexercise.com/view_cart'); await acceptConsentWhenPresented(page);
  await expect(page.getByText('Cart is empty!', { exact: false })).toBeVisible();
});

test('PUBLIC-EXERCISE-07 returns no product for an impossible search', async ({ page }) => {
  await page.goto('https://automationexercise.com/products'); await acceptConsentWhenPresented(page);
  await page.locator('#search_product').fill('portfolio-product-that-does-not-exist');
  await page.locator('#submit_search').click(); await expect(page.locator('.product-image-wrapper')).toHaveCount(0);
});

test('PUBLIC-EXERCISE-08 exposes the login and signup entry point', async ({ page }) => {
  await page.goto('https://automationexercise.com/login');
  await expect(page.getByText('Login to your account')).toBeVisible();
  await expect(page.getByText('New User Signup!')).toBeVisible();
});
