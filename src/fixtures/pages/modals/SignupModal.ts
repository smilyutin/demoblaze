import { Page, Locator, expect } from '@playwright/test';
import { argosScreenshot } from "@argos-ci/playwright";

export class SignupModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('#signInModal');
    this.username = page.locator('#sign-username');
    this.password = page.locator('#sign-password');
    this.submit = page.getByRole('button', { name: 'Sign up' });
  }

  async signup(username: string, password: string) {
    await expect(this.modal).toBeVisible();
    await argosScreenshot(this.page, "homepage");
    await this.username.fill(username);
    await this.password.fill(password);

    const [dialog] = await Promise.all([
      this.page.waitForEvent('dialog'),
      this.submit.click()
    ]);
    // Dialog shows success/failure text; accept it
    await dialog.accept();
  }
}