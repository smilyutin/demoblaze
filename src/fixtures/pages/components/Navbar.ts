// src/fixtures/pages/Navbar.ts
import { Locator, Page, expect } from '@playwright/test';

/**
 * Navbar
 * -------
 * A Page Object that encapsulates the top navigation bar of demoblaze.com.
 * Why it matters:
 *  - Centralizes all nav-related selectors and actions (open login, open cart, etc.).
 *  - Keeps tests readable and DRY: specs say `navbar.openLogin()` instead of hunting selectors.
 *  - If the site HTML changes, you fix locators here once, not in every test.
 */
export class Navbar {
  // Readonly Locators keep tests safe from accidental reassignment
  readonly home: Locator;
  readonly cart: Locator;
  readonly login: Locator;
  readonly signup: Locator;
  readonly logout: Locator;
  readonly usernameLabel: Locator;
  readonly categories: Locator;

  /**
   * Accept a Playwright Page so this object can operate on the current browser tab.
   * We mark `page` as `private readonly` to discourage direct access from tests
   * and to encourage using the methods below for higher-level actions.
   */
  constructor(private readonly page: Page) {
    // Core navigation links
    this.home = this.page.getByRole('link', { name: 'Home ' });
    this.cart = this.page.locator('#cartur');
    this.login = this.page.locator('#login2');
    this.signup = this.page.locator('#signin2');
    this.logout = this.page.locator('#logout2');

    // Appears after successful login: "Welcome <username>"
    this.usernameLabel = this.page.locator('#nameofuser');

    // Category items in the left sidebar (Phones / Laptops / Monitors)
    // Multiple elements share id="itemc" on this site, hence a locator collection.
    this.categories = this.page.locator('#itemc');
  }

  /** Open the Cart page from the navbar. */
  async openCart() {
    await this.cart.click();
  }

  /** Open the Login modal from the navbar. */
  async openLogin() {
    await this.login.click();
  }

  /** Open the Signup modal from the navbar. */
  async openSignup() {
    await this.signup.click();
  }

  /**
   * Click a product category by visible text.
   * Using `{ hasText: name }` is more resilient than relying on position.
   */
  async selectCategory(name: 'Phones' | 'Laptops' | 'Monitors') {
    await this.page.locator('#itemc', { hasText: name }).first().click();
  }

  /**
   * Expose the "Welcome <username>" element as a Locator so tests can
   * assert on it, wait for it, or read its text when needed.
   */
  userGreeting(): Locator {
    return this.usernameLabel; // maps to '#nameofuser'
  }

  /**
   * High-level assertion: verify a user is logged in.
   * Keeping assertions inside the Page Object helps tests read like a script:
   *   await navbar.expectLoggedIn('alice');
   */
  async expectLoggedIn(username: string) {
    await expect(this.userGreeting()).toBeVisible();
    await expect(this.userGreeting()).toContainText(username);
  }
}