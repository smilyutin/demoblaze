import { Page, Locator, expect } from '@playwright/test';

export class LoginModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('#logInModal');
    this.username = page.locator('#loginusername');
    this.password = page.locator('#loginpassword');
    this.submit = page.getByRole('button', { name: 'Log in' });
  }

  async login(username: string, password: string) {
    await expect(this.modal).toBeVisible();
    await this.username.fill(username);
    await this.password.fill(password);

    const [dialog] = await Promise.all([
      this.page.waitForEvent('dialog').catch(() => null),
      this.submit.click()
    ]);
    if (dialog) await dialog.accept();
  }
}