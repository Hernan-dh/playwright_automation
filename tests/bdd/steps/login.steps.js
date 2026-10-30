const { Given, When, Then, After, Before } = require('@cucumber/cucumber');
const { chromium, expect } = require('@playwright/test');
Before(async function () { this.browser = await chromium.launch(); this.page = await this.browser.newPage(); });
After(async function () { await this.browser?.close(); });
Given('the SauceDemo login page is open', async function () { await this.page.goto(process.env.UI_BASE_URL || 'https://www.saucedemo.com'); });
When('I sign in with the standard demo user', async function () { await this.page.getByPlaceholder('Username').fill('standard_user'); await this.page.getByPlaceholder('Password').fill('secret_sauce'); await this.page.getByRole('button', { name: 'Login' }).click(); });
Then('the product inventory is displayed', async function () { await expect(this.page.getByText('Products')).toBeVisible(); });
When('I sign in with username {string} and password {string}', async function (username, password) { await this.page.getByPlaceholder('Username').fill(username); await this.page.getByPlaceholder('Password').fill(password); await this.page.getByRole('button', { name: 'Login' }).click(); });
Then('the login error contains {string}', async function (message) { await expect(this.page.locator('[data-test="error"]')).toContainText(message); });
