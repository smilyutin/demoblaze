// src/fixtures/pages/CartPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { argosScreenshot } from "@argos-ci/playwright";

export class CartPage extends BasePage {
  readonly rows: Locator;
  readonly total: Locator;
  readonly placeOrderBtn: Locator;

  // Order modal
  readonly orderModal: Locator;
  readonly name: Locator;
  readonly country: Locator;
  readonly city: Locator;
  readonly card: Locator;
  readonly month: Locator;
  readonly year: Locator;
  readonly purchaseBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.locator('#tbodyid > tr');
    this.total = page.locator('#totalp');
    this.placeOrderBtn = page.getByRole('button', { name: 'Place Order' });

    this.orderModal = page.locator('#orderModal');
    this.name = page.locator('#name');
    this.country = page.locator('#country');
    this.city = page.locator('#city');
    this.card = page.locator('#card');
    this.month = page.locator('#month');
    this.year = page.locator('#year');
    this.purchaseBtn = page.getByRole('button', { name: 'Purchase' });
  }

  async open() { await this.goto('/cart.html'); }

  rowByProduct(name: string) {
    return this.page.locator('#tbodyid tr', { hasText: name });
  }

  async deleteItem(name: string) {
    const row = this.rowByProduct(name);
    
    await argosScreenshot(this.page, "cart page");
    await row.getByRole('link', { name: 'Delete' }).click();
    await expect(row).toHaveCount(0);
  }

  async getTotal(): Promise<number> {
    const text = await this.total.textContent();
    return Number(text || 0);
  }

  /** Step 1: open the order modal */
  async placeOrder() {
    console.log('[cart] Clicking "Place Order"…');
    await this.placeOrderBtn.click();
    await expect(this.orderModal).toBeVisible();
  }

  /** Step 2: fill the modal and click Purchase */
  async fillOrderForm(data: {
    name: string; country: string; city: string; card: string; month: string; year: string;
  }) {
    console.log('[cart] Filling order form…');
    await this.name.fill(data.name);
    await this.country.fill(data.country);
    await this.city.fill(data.city);
    await this.card.fill(data.card);
    await this.month.fill(data.month);
    await this.year.fill(data.year);

    await this.purchaseBtn.click();
  }

  /** Final: assert sweet-alert and close */
  async confirmPurchaseAndAssert() {
    const confirmation = this.page.locator('.sweet-alert');
    await expect(confirmation).toBeVisible();
    const detailsText = await confirmation.locator('p').textContent();
    console.log('[cart] Confirmation:', (detailsText || '').trim());
    const ok = this.page.getByRole('button', { name: 'OK' });
    await ok.click();
    return detailsText?.trim() || '';
  }

  async expectItemPresent(itemName: string, timeout = 15000): Promise<void> {
  await this.page.waitForSelector('#tbodyid', { state: 'visible', timeout });
  const row = this.page.locator('#tbodyid tr', { hasText: itemName });

  // Poll until at least one matching row exists
  await expect.poll(async () => await row.count(), { timeout, message: `Item "${itemName}" not in cart` })
    .toBeGreaterThan(0);

  await expect(row.first()).toBeVisible(); // final visibility check
}
}