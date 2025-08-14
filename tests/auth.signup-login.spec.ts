import { test } from '../src/fixtures/test-fixtures';
import { saveCreds } from '@utils/credentials';

test.describe('Auth | Signup then Login', () => {
  test('creates a new user, logs in, and saves creds', async ({ home, signupModal, loginModal, navbar }) => {
    const stamp = Date.now().toString(36);
    const username = `user_${stamp}`;
    const password = `Pwd_${stamp}!`;

    await home.goto();

    await navbar.openSignup();
    await signupModal.signup(username, password); // handles alert

    await navbar.openLogin();
    await loginModal.login(username, password);   // waits until logged in

    await navbar.expectLoggedIn(username);

    // Persist the creds for later specs
    await saveCreds({ username, password });
  });
});