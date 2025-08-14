// tests/smoke.add-to-cart.spec.ts
import { test } from '../src/fixtures/test-fixtures';
import { ensureLoggedIn } from '@utils/auth';

test.describe('Smoke | Add to Cart', () => {
  test('adds one product and verifies in cart', async ({ home, product, cart, navbar, loginModal }) => {
    await home.goto();
    await ensureLoggedIn(navbar, loginModal);

    await home.openProductByName('Samsung galaxy s6');
    await product.addToCartAndAcceptAlert();
    await navbar.openCart();

    await cart.expectItemPresent('Samsung galaxy s6');
  });
})