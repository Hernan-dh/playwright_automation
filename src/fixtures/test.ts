import { test as base, expect } from '@playwright/test';
import users from '../data/users.json';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

type PortfolioFixtures = { login: LoginPage; inventory: InventoryPage; standardUser: typeof users.standard };
export const test = base.extend<PortfolioFixtures>({
  login: async ({ page }, use) => use(new LoginPage(page)),
  inventory: async ({ page }, use) => use(new InventoryPage(page)),
  standardUser: async ({}, use) => use(users.standard),
});
export { expect };
