// tests/cart.place-order.spec.ts
import { test } from '../src/fixtures/test-fixtures';
import { ensureLoggedIn } from '@utils/auth';

test.describe('Cart | Place Order', () => {
  test('completes purchase from cart', async ({ home, product, cart, navbar, loginModal, signupModal }) => {
    await home.goto();

    // Logs in using saved creds from .auth/lastUser.json (preferred),
    // otherwise .env, otherwise (if provided) signs up a new user and saves it.
    await ensureLoggedIn(navbar, loginModal, signupModal);

    await home.openProductByName('Sony xperia z5');
    await product.addToCartAndAcceptAlert();

    await navbar.openCart();
    await cart.expectItemPresent('Sony xperia z5');

    await cart.placeOrder();
    await cart.fillOrderForm({
      name: 'Test User',
      country: 'USA',
      city: 'San Francisco',
      card: '4111111111111111',
      month: '12',
      year: '2027',
    });
    await cart.confirmPurchaseAndAssert();
  });
});