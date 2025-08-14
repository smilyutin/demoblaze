import { test, expect } from '@playwright/test';
import { readCreds } from '@utils/credentials';
import { HomePage } from '../src/fixtures/pages/HomePage';
import { Navbar } from '../src/fixtures/pages/components/Navbar';
import { LoginModal } from '@pages/modals/LoginModal';

test.describe('Auth | Logout', () => {
  test('logs out the current user', async ({ page }) => {
    const creds = await readCreds();
    test.skip(!creds, 'No saved credentials found — run the signup test first.');

    const home = new HomePage(page);
    const navbar = new Navbar(page);
    const loginModal = new LoginModal(page);

    await home.goto();
    await navbar.openLogin();
    await loginModal.login(creds!.username, creds!.password);
    await navbar.expectLoggedIn(creds!.username);

    await navbar.logout.click();
    await expect(navbar.userGreeting()).toBeHidden(); // welcome label disappears
  });
});