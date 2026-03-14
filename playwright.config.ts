import { defineConfig, devices } from '@playwright/test';
require('dotenv').config();

/**
 * Meroshare IPO Bot - Playwright Configuration
 *
 * Login is handled by a fixture (not auth setup),
 * so no storageState or setup project is needed.
 */
export default defineConfig({
  testDir: './src/tests',
  /* Run tests in files in parallel */
  fullyParallel: false, // sequential — login flow needs to complete before IPO actions
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Single worker to avoid race conditions on the same account */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. */
  use: {
    baseURL: process.env.BASE_URL,

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Slow down actions for visibility (optional, adjust as needed) */
    // actionTimeout: 10000,

    /* Increase navigation timeout for Meroshare (can be slow) */
    navigationTimeout: 30000,
  },

  /* Configure projects */
  projects: [
    {
      name: 'meroshare',
      testMatch: ['**/*.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
