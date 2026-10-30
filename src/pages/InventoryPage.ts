import { expect, Page } from '@playwright/test';

export class InventoryPage {
  constructor(private readonly page: Page) {}
  async expectLoaded() { await expect(this.page.getByText('Products')).toBeVisible(); }
  async add(name: string) { await this.page.locator('.inventory_item').filter({ hasText: name }).getByRole('button', { name: 'Add to cart' }).click(); }
  async cart() { await this.page.locator('.shopping_cart_link').click(); }
}
