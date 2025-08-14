import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly title: Locator;
  readonly price: Locator;
  readonly addToCart: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.name');
    this.price = page.locator('#pricecontainer');
    this.addToCart = page.getByRole('link', { name: 'Add to cart' });
  }

  async addToCartAndAcceptAlert() {
    const [dialog] = await Promise.all([
      this.page.waitForEvent('dialog'),
      this.addToCart.click()
    ]);
    await dialog.accept();
  }

  async expectProductNameContains(text: string) {
    await expect(this.title).toContainText(text);
  }
}