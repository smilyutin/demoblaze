// src/utils/auth.ts
import { expect } from '@playwright/test';
import type { Navbar } from '@pages/components/Navbar';
import type { LoginModal } from '@pages/modals/LoginModal';
import type { SignupModal } from '@pages/modals/SignupModal';

import * as fs from 'fs';
import * as path from 'path';

type Creds = { username: string; password: string };

const AUTH_DIR = path.join(process.cwd(), '.auth');
const AUTH_FILE = path.join(AUTH_DIR, 'lastUser.json');

function readSavedCreds(): Creds | null {
  try {
    if (!fs.existsSync(AUTH_FILE)) return null;
    const json = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
    if (json?.username && json?.password) {
      return { username: String(json.username), password: String(json.password) };
    }
  } catch { /* ignore */ }
  return null;
}

function saveCreds(creds: Creds) {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  fs.writeFileSync(AUTH_FILE, JSON.stringify(creds, null, 2));
  console.log(`[auth] Saved creds to ${path.relative(process.cwd(), AUTH_FILE)}`);
}

function envCreds(): Creds | null {
  const u = (process.env.DEMOBLAZE_USER || '').trim();
  const p = (process.env.DEMOBLAZE_PASS || '').trim();
  return u && p ? { username: u, password: p } : null;
}

function randomCreds(): Creds {
  const stamp = Date.now().toString(36);
  return { username: `user_${stamp}`, password: `Pwd_${stamp}!` };
}

/**
 * Ensure the user is logged in.
 * Order: already logged? → .env → saved file → (optional) self-signup → login → assert.
 */
export async function ensureLoggedIn(
  navbar: Navbar,
  loginModal: LoginModal,
  signupModal?: SignupModal
) {
  if (await navbar.userGreeting().isVisible().catch(() => false)) {
    console.log('[auth] Already logged in, skipping.');
    return;
  }

  let creds = envCreds() ?? readSavedCreds();

  // If no creds but we can sign up, do it now and persist for later tests.
  if (!creds && signupModal) {
    creds = randomCreds();
    console.log(`[auth] No creds found; signing up ${creds.username}...`);
    await navbar.openSignup();
    await signupModal.signup(creds.username, creds.password);
    saveCreds(creds);
  }

  if (!creds) {
    throw new Error(
      'No credentials available. Set DEMOBLAZE_USER/DEMOBLAZE_PASS in .env, ' +
      'or pass SignupModal so the helper can create a user, or run the signup test first.'
    );
  }

  console.log(`[auth] Logging in as ${creds.username}...`);
  await navbar.openLogin();
  await loginModal.login(creds.username, creds.password);
  await expect(navbar.userGreeting()).toBeVisible();
  await expect(navbar.userGreeting()).toContainText(creds.username);
  console.log('[auth] Login successful.');
}

export async function ensureLoggedInUse(navbar: Navbar, loginModal: LoginModal) {
  const loggedIn = await navbar.userGreeting().isVisible().catch(() => false);
  if (loggedIn) {
    console.log('[auth] Already logged in, skipping.');
    return;
  }

  const username = process.env.username;
  const password = process.env.password;
  if (!username || !password) {
    throw new Error('Missing username / password in .env');
  }

  console.log(`[auth] Logging in as ${username}...`);
  await navbar.openLogin();
  await loginModal.login(username, password);

  await expect(navbar.userGreeting()).toBeVisible();
  await expect(navbar.userGreeting()).toContainText(username);
  console.log('[auth] Login successful.');
}

// optional alias so existing imports keep working
export const ensureLoggedInIfNeeded = ensureLoggedIn;