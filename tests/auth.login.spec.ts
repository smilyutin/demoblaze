import { test, expect } from '@playwright/test';
import { readCreds } from '@utils/credentials';
import { HomePage } from '@pages/HomePage';
import { Navbar } from '@pages/components/Navbar';
import { LoginModal } from '@pages/modals/LoginModal';

test.describe('Auth | Login using saved credentials', () => {
  test('logs in with last signed-up user', async ({ page }) => {
    const creds = await readCreds();
    test.skip(!creds, 'No saved credentials found — run the signup test first.');

    const home = new HomePage(page);
    const navbar = new Navbar(page);
    const loginModal = new LoginModal(page);

    await home.goto();
    await navbar.openLogin();
    await loginModal.login(creds!.username, creds!.password);

    await expect(navbar.userGreeting()).toContainText(creds!.username);
    console.log('User logged in successfully', creds!.username );
  });
});