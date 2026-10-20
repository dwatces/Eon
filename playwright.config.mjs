import { defineConfig } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT || 7301);
const baseURL = `http://127.0.0.1:${PORT}`;

// End-to-end tests only ever run against a local production build.
if (new URL(baseURL).hostname !== "127.0.0.1") {
  throw new Error("E2E tests run against 127.0.0.1 only");
}

// Use a local Chrome when CHROME_PATH is set, otherwise Playwright's
// own Chromium (CI installs it with `npx playwright install chromium`).
const launchOptions = process.env.CHROME_PATH
  ? { executablePath: process.env.CHROME_PATH }
  : {};

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL,
    launchOptions,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: `npm run build && npm run start -- -H 127.0.0.1 -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 240_000,
    // Demo mode: no Stripe key, no live opt-in.
    env: { STRIPE_SECRET_KEY: "", EON_ALLOW_LIVE_PAYMENTS: "" },
  },
});
