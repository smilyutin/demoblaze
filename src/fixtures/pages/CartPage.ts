// src/fixtures/pages/CartPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { argosScreenshot } from '@argos-ci/playwright';

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

  // --- NEW: guard to prevent multiple clicks ---
  private purchaseClicks = 0; // NEW

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
    await argosScreenshot(this.page, 'cart-before-delete');
    await row.getByRole('link', { name: 'Delete' }).click();
    await expect(row).toHaveCount(0);
    await argosScreenshot(this.page, 'cart-after-delete');
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
    await argosScreenshot(this.page, 'order-modal-open');

    // NEW: reset guard for each fresh order flow
    this.purchaseClicks = 0; // NEW
  }

  /** Step 2: fill the modal (does not assert confirmation) */
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
    await argosScreenshot(this.page, 'order-form-filled');

    // First attempt to purchase; confirm step will retry if needed.
    if (this.purchaseClicks === 0) {           // NEW (guard)
      await this.purchaseBtn.click();
      this.purchaseClicks++;                   // NEW (record click)
      await argosScreenshot(this.page, 'purchase-click-1');
    }
  }

  /**
   * Final: assert SweetAlert and close.
   * If the alert closes but the modal is still present, we click Purchase again
   * (and OK again) up to `maxAttempts` times.
   */
  async confirmPurchaseAndAssert(maxAttempts = 2): Promise<string> {
    let lastDetails = '';
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const confirmation = this.page.locator('.sweet-alert');

      // If confirmation is not visible yet (e.g., first click didn’t trigger), try again.
      if (!(await confirmation.isVisible())) {
        if (await this.orderModal.isVisible()) {
          // NEW: prevent a second submission if we've already clicked once
         // if (this.purchaseClicks === 0) {     // NEW
            await this.purchaseBtn.click();
            //this.purchaseClicks++;             // NEW
            await argosScreenshot(this.page, `purchase-click-${attempt}`);
         // }
        }
      }

      await expect(
        confirmation,
        `Waiting for purchase confirmation (attempt ${attempt})`
      ).toBeVisible({ timeout: 5_000 });

      lastDetails = (await confirmation.locator('p').textContent())?.trim() || '';
      console.log(`[cart] Confirmation (attempt ${attempt}): ${lastDetails}`);
      await argosScreenshot(this.page, `purchase-confirmation-${attempt}`);

      // Dismiss SweetAlert
      await this.page.getByRole('button', { name: 'OK' }).click();
      await expect(confirmation).toBeHidden({ timeout: 5_000 }).catch(() => {});

//  Click the *footer* Close (has visible text "Close"), not the header "×"
const footerClose = this.orderModal
  .getByRole('button', { name: 'Close' })
  .filter({ hasText: 'Close' });

if (await footerClose.isVisible()) {
  await footerClose.click();
}
      return lastDetails;
    }
return lastDetails;
    
  }

  async expectItemPresent(itemName: string, timeout = 15_000): Promise<void> {
    await this.page.waitForSelector('#tbodyid', { state: 'visible', timeout });
    const row = this.page.locator('#tbodyid tr', { hasText: itemName });
    await expect
      .poll(async () => row.count(), { timeout, message: `Item "${itemName}" not in cart` })
      .toBeGreaterThan(0);
    await expect(row.first()).toBeVisible();
  }
}