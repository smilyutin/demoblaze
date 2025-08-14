import { defineConfig, devices } from '@playwright/test';
import 'tsconfig-paths/register';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://www.demoblaze.com',
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
});