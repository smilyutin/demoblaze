import { defineConfig, devices } from '@playwright/test';
import 'tsconfig-paths/register';
import * as path from 'path';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,

  reporter: [
    process.env.CI ? ['dot'] : ['list'],
    [
      '@argos-ci/playwright/reporter',
      {
        uploadToArgos: !!process.env.CI,
        token: process.env.ARGOS_TOKEN,
      },
    ],
    ['html', { outputFolder: path.join(__dirname, 'playwright-report'), open: 'never' }],
    ['github'],
  ],

  use: {
    baseURL: 'https://www.demoblaze.com',
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: 'on-first-retry',
    screenshot: "only-on-failure",
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});