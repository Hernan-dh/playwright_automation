import { expect, test } from '@playwright/test';

test('PUBLIC-EXERCISE-01 exposes its published automation cases', async ({ page }) => {
  await page.goto('https://automationexercise.com/test_cases');
  await expect(page.getByText('Below is the list of test Cases for you to practice the Automation.')).toBeVisible();
  await expect(page.getByText('Test Case 1: Register User')).toBeVisible();
});

test('PUBLIC-EXERCISE-02 searches the public product catalog', async ({ page }) => {
  await page.goto('https://automationexercise.com/products');
  await page.locator('#search_product').fill('Blue Top');
  await page.locator('#submit_search').click();
  await expect(page.getByText('Searched Products', { exact: false })).toBeVisible();
  await expect(page.getByText('Blue Top', { exact: true }).first()).toBeVisible();
});
