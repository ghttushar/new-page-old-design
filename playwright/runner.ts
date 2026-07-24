// Single CLI runner. Reads --env, --target, --tag and runs Playwright.

import { ChildProcess, spawn, spawnSync } from "child_process";
import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import { ANARIX_UI_PATH, EnvName, ORCHESTRATOR_RELATIVE_PATH, Target } from "./config";

// 1. Parse CLI flags
function getFlag(name: string): string | undefined {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split("=")[1] : undefined;
}

const env = (getFlag("env") || "DEV").toUpperCase() as EnvName;
const target = (getFlag("target") || "actual").toLowerCase() as Target;
const tag = getFlag("tag") || "";

if (!["DEV", "TEST", "PROD"].includes(env)) {
  console.error(`Invalid --env=${env}. Use DEV, TEST, or PROD.`);
  process.exit(1);
}
if (!["local", "actual"].includes(target)) {
  console.error(`Invalid --target=${target}. Use local or actual.`);
  process.exit(1);
}

console.log(`\n=== Anarix Test Run ===`);
console.log(`env    : ${env}`);
console.log(`target : ${target}`);
console.log(`tag    : ${tag || "ALL"}\n`);

// 2. Update env.orchestrator.ts at the configured ANARIX_UI_PATH.
function updateOrchestrator() {
  const projectDir = ANARIX_UI_PATH;

  if (!fs.existsSync(projectDir)) {
    console.log(`[runner] ANARIX_UI_PATH does not exist: ${projectDir}. Skipping ACTIVE_ENV update.`);
    return null;
  }

  const file = path.join(projectDir, ORCHESTRATOR_RELATIVE_PATH);
  if (!fs.existsSync(file)) {
    console.log(`[runner] ${file} not found. Check ANARIX_UI_PATH / ORCHESTRATOR_RELATIVE_PATH in config.ts.`);
    return projectDir;
  }

  const content = fs.readFileSync(file, "utf8");
  const newLine = `export const ACTIVE_ENV: EnvironmentEnum = EnvironmentEnum.${env};`;
  const pattern = /export\s+const\s+ACTIVE_ENV[^;]+;/;
  if (!pattern.test(content)) {
    console.log(`[runner] ACTIVE_ENV declaration not found in ${file}. Skipping update.`);
    return projectDir;
  }
  const updated = content.replace(pattern, newLine);
  if (updated === content) {
    console.log(`[runner] ACTIVE_ENV already set to ${env} in ${file}`);
    return projectDir;
  }
  fs.writeFileSync(file, updated, "utf8");
  console.log(`[runner] ACTIVE_ENV → ${env} in ${file}`);
  return projectDir;
}

const projectDir = updateOrchestrator();
// 3. If --target=local, run npm install + npm start in anarix-ui
let serverProcess: ChildProcess | null = null;

function checkUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve((res.statusCode || 500) < 500);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function startLocalServer() {
  if (!projectDir) {
    console.error("[runner] Cannot start local server: anarix-ui not found.");
    process.exit(1);
  }
  console.log(`[runner] Running npm install in ${projectDir} ...`);
  const install = spawnSync("npm", ["install"], { cwd: projectDir, stdio: "inherit", shell: true });
  if (install.status !== 0) {
    console.error("[runner] npm install failed.");
    process.exit(1);
  }
  console.log(`[runner] Running npm start in ${projectDir} ...`);
  serverProcess = spawn("npm", ["start"], { cwd: projectDir, stdio: "inherit", shell: true });

  console.log("[runner] Waiting for http://localhost:4201 ...");
  const deadline = Date.now() + 180_000;
  while (Date.now() < deadline) {
    if (await checkUrl("http://localhost:4201")) {
      console.log("[runner] Local server is up.");
      return;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  console.error("[runner] Local server did not start in time.");
  process.exit(1);
}

// 4. Run Playwright with the right env vars
async function runPlaywright(): Promise<number> {
  return await new Promise((resolve) => {
    const proc = spawn("npx", ["playwright", "test"], {
      stdio: "inherit",
      shell: true,
      env: { ...process.env, TEST_ENV: env, TEST_TARGET: target, TEST_TAG: tag },
    });
    proc.on("exit", (code) => resolve(code || 0));
  });
}

// Main
(async () => {
  try {
    if (target === "local") await startLocalServer();
    const code = await runPlaywright();
    if (serverProcess !== null) (serverProcess as ChildProcess).kill("SIGTERM");
    process.exit(code);
  } catch (err) {
    console.error("[runner] Error:", (err as Error).message);
    if (serverProcess !== null) (serverProcess as ChildProcess).kill("SIGTERM");
    process.exit(1);
  }
})();