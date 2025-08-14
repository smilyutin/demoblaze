import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  async waitForReady() {
    await expect(this.page.locator('#navbarExample')).toBeVisible();
  }
}