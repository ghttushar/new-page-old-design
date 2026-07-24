// Single config file. All URLs, credentials, env settings live here.
import { defineConfig } from '@playwright/test';
import path from "path";

export type EnvName = "DEV" | "TEST" | "PROD";
export type Target = "local" | "actual";

export const LOCAL_URL = "http://localhost:4201";

export const ENVIRONMENTS = {
  DEV: {
    url: "https://dev.anarix.ai",
  },
  TEST: {
    url: "https://test.anarix.ai",
  },
  PROD: {
    url: "https://app.anarix.ai",
  },
};

export const DEFAULT_TENANT = "NapQueen Test";

// ────────────────────────────────────────────────────────────────────────────
// Path to your local anarix-ui repo. Used for:
//   1. Rewriting ACTIVE_ENV in env.orchestrator.ts whenever you pass --env
//   2. Running `npm install` + `npm start` when you pass --target=local
//
// Set ANARIX_UI_PATH env var to override per machine (e.g. on Jenkins/CI),
// otherwise the absolute path below is used as-is.
// ────────────────────────────────────────────────────────────────────────────
// Resolves to the anarix-ui root: one level up from this playwright folder.
export const ANARIX_UI_PATH = process.env.ANARIX_UI_PATH || path.resolve(__dirname, "..");

// Relative path (from ANARIX_UI_PATH) to env.orchestrator.ts
export const ORCHESTRATOR_RELATIVE_PATH = "src/constants/env/env.orchestrator.ts";

// Returns base URL + login URL for the chosen env + target.
// Username and password are required parameters
export function getConfig(env: EnvName, target: Target, username: string, password: string) {
  const baseUrl = target === "local" ? LOCAL_URL : ENVIRONMENTS[env].url;
  return {
    env,
    target,
    baseUrl,
    loginUrl: `${baseUrl}/user/login`,
    username,
    password,
  };
}

export default defineConfig({
 
  use: {
    // Option 1 - Full HD
    viewport: { width: 1920, height: 1080 },



    // Launch browser maximized
    launchOptions: {
      args: ['--start-maximized'],  // works for Chromium
    },
  },
});

// Reads runtime values from env vars set by runner.ts
// Supports dynamic username and password via TEST_USERNAME and TEST_PASSWORD env vars
export function getRuntimeConfig() {
  const env = (process.env.TEST_ENV || "DEV") as EnvName;
  const target = (process.env.TEST_TARGET || "actual") as Target;
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "TEST_USERNAME and TEST_PASSWORD environment variables are required. " +
      "Pass them using: cross-env TEST_USERNAME=user TEST_PASSWORD=pass"
    );
  }

  return getConfig(env, target, username, password);
}
