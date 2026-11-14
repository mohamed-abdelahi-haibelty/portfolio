import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-webkit", use: { ...devices["iPhone 13"] } },
  ],
  ...(process.env.BASE_URL
    ? {}
    : {
        webServer: {
          command: `pnpm build && pnpm start --port ${PORT}`,
          url: `${baseURL}/fr`,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
        },
      }),
});
