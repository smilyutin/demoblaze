// src/fixtures/test-fixtures.ts
import { test as base } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { LoginModal } from './pages/modals/LoginModal';
import { SignupModal } from './pages/modals/SignupModal';
import { Navbar } from './pages/components/Navbar';

type POM = {
  home: HomePage;
  product: ProductPage;
  cart: CartPage;
  loginModal: LoginModal;
  signupModal: SignupModal;
  navbar: Navbar;
};

export const test = base.extend<POM>({
  home: async ({ page }, use) => use(new HomePage(page)),
  product: async ({ page }, use) => use(new ProductPage(page)),
  cart: async ({ page }, use) => use(new CartPage(page)),
  loginModal: async ({ page }, use) => use(new LoginModal(page)),
  signupModal: async ({ page }, use) => use(new SignupModal(page)),
  navbar: async ({ page }, use) => use(new Navbar(page)),
});

export const expect = test.expect;