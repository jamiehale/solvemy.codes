import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '*.spec.ts',
  fullyParallel: true,
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://localhost:5173',
    viewport: { width: 1024, height: 800 },
  },
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      // The default (0.2) treats Tailwind's gray-200 background as white
      threshold: 0.05,
      maxDiffPixelRatio: 0.01,
    },
  },
  projects: [{ name: 'chromium' }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
