// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { register } from 'tsconfig-paths';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Register TS path aliases explicitly to avoid CI confusion with --project=chromium.
try {
  const tsconfigPath = path.join(__dirname, 'tsconfig.json');
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  register({
    baseUrl: path.resolve(__dirname),
    paths: tsconfig.compilerOptions?.paths ?? {},
  });
} catch {
  // ignore if tsconfig is missing or invalid
}

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

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
    baseURL: process.env.BASE_URL || 'https://www.demoblaze.com',
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  outputDir: path.join(__dirname, 'test-results'),
});