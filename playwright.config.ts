import { defineConfig, devices } from '@playwright/test';

// In the cloud sandbox Chromium is pre-installed; CI installs its own.
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4329',
    launchOptions: { executablePath },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: { executablePath } } }],
  // Always a fresh server on its own port, so tests can never hit a stale
  // preview left running from another build.
  webServer: {
    command: 'npx astro preview --port 4329 --ignore-lock',
    url: 'http://localhost:4329',
    reuseExistingServer: false,
  },
});
