// tests/smoke.add-to-cart.spec.ts
import { test, expect } from '@playwright/test';
import { readCreds } from '@utils/credentials';
import { HomePage } from '@pages/HomePage';
import { Navbar } from '@pages/components/Navbar';
import { LoginModal } from '@pages/modals/LoginModal';
import { ProductPage } from '@pages/ProductPage';
import { CartPage } from '@pages/CartPage';
import { ensureLoggedIn } from '@utils/auth';

test.describe('Smoke | Add to Cart', () => {
  test('adds one product and verifies in cart', async ({ page }) => {
    const creds = await readCreds();
    test.skip(!creds, 'No saved credentials found — run the signup test first.');

    const home = new HomePage(page);
    const navbar = new Navbar(page);
    const loginModal = new LoginModal(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);

    await home.goto();

    // Either explicit login with saved creds...
    await navbar.openLogin();
    await loginModal.login(creds!.username, creds!.password);

    // ...or just this helper (it will skip if already logged in)
    await ensureLoggedIn(navbar, loginModal);

    await home.openProductByName('Samsung galaxy s6');
    await product.addToCartAndAcceptAlert();
    await navbar.openCart();

    await cart.expectItemPresent('Samsung galaxy s6');
  });
});