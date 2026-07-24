import { defineConfig } from "@playwright/test";

const tag = process.env.TEST_TAG;

export default defineConfig({
  testDir: "./tests",
  timeout: 120_000,
  retries: 1,
  workers: 5,
  reporter: [
    ["list"],
    ["html", { outputFolder: "reports", open: "never" }],
  ],
  use: {
    headless: false,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  // If TEST_TAG is set, only tests whose title contains @<tag> run.
  grep: tag ? new RegExp(`@${tag}\\b`) : undefined,
});
