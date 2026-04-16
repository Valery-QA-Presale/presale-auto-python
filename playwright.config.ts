import { defineConfig, devices } from '@playwright/test';
// @ts-ignore
import dotenv from 'dotenv';
// @ts-ignore
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });



export default defineConfig({
  testDir: './tests',

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  preserveOutput: 'never',
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  reporter: [['html'], ['json', { outputFile: 'test-results.json' }]],


  use: {
    baseURL: process.env.B2C_BASE_URL || 'https://staging.presale.ru',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },

  projects: [
    {
      name: 'api-tests',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  timeout: 30000,
  expect: { timeout: 10000 },
});