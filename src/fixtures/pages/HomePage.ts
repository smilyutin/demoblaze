import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly productCards: Locator;
  constructor(page: Page) {
    super(page);
    this.productCards = page.locator('.card');
  }

  async open() { await this.goto('/'); }

  productCardByName(name: string) {
    return this.page.locator('.card-title a', { hasText: name });
  }

  async openProduct(name: string) {
    await this.productCardByName(name).click();
  }

  async openProductByName(productName: string) {
    // Example implementation: find the product link by name and click it
    await this.page.locator(`a:has-text("${productName}")`).first().click();
  }
}