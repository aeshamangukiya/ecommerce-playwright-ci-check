import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * VIDEO 10 -> PART 4
 * Final project config (config basics: Video 3)
 */

// Read APP_EMAIL and APP_PASSWORD from the .env file (same idea as Video 7).
// On GitHub Actions there is no .env file -> the values come from GitHub secrets.
const envFile = path.resolve(__dirname, '.env');
if (fs.existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

export default defineConfig({
  testDir: './tests',

  // The full order test opens many pages and takes 35-50 seconds.
  // The default (30 seconds) is too short -> give each test 90 seconds.
  timeout: 90 * 1000,

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  use: {
    // The slash at the end matters: page.goto('index.php?route=...') is added after /ui/
    baseURL: 'https://awesomeqa.com/ui/',

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
});
