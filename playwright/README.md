# Playwright Anarix Framework (Beginner-Friendly)

Simple Playwright + TypeScript automation framework for the Anarix UI.
Built for freshers — flat structure, minimal abstractions, one job per file.

---

## 1. Folder Structure

```
playwright-anarix-framework/
├── pages/                  # Page Object Model
│   ├── BasePage.ts         # parent class with shared helpers
│   ├── LoginPage.ts        # login screen page object
│   ├── TenantPage.ts       # tenant selection page (napqueen, etc.)
│   └── CatalogPage.ts      # catalog page (search/filter/sort/pagination)
│
├── tests/                  # Test specs (add new test files here)
│   └── catalog.spec.ts     # login → select napqueen → catalog scenarios
│
├── reports/                # Auto-generated HTML report (after run)
│
├── config.ts               # All URLs + credentials per environment
├── runner.ts               # CLI entrypoint: parses --env / --target / --tag
├── playwright.config.ts    # Playwright settings (retries, screenshots, tag filter)
├── package.json
├── tsconfig.json
└── README.md
```

### What each file does (one line each)

| File | What it does |
|---|---|
| `config.ts` | Holds DEV/TEST/PROD URLs + usernames + passwords. Has `getConfig()` and `getRuntimeConfig()`. |
| `runner.ts` | Reads `--env --target --tag` from command line, updates `env.orchestrator.ts`, starts local server (if local), runs Playwright. |
| `playwright.config.ts` | Sets retries=1, screenshot on failure, HTML report, and tag filter via `grep`. |
| `pages/BasePage.ts` | Parent class. Has `open()` and `getTitle()`. |
| `pages/LoginPage.ts` | Extends BasePage. Has `enterEmail`, `enterPassword`, `clickLogin`, `login`. |
| `tests/login.spec.ts` | Two example tests for login (@smoke and @sanity). |
| `tests/home.spec.ts` | Two example tests for home page (@smoke and @sanity). |

---

## 2. Setup (one-time)

```bash
cd playwright-anarix-framework
npm install
npm run install:browsers
```

That's it.

---

## 3. How to Run Tests

All test commands go through `npm test`. Pass flags after `--`.

```bash
# Run ALL tests on DEV (default)
npm test

# Run only @smoke tests
npm test -- --tag=smoke

# Run only @sanity tests
npm test -- --tag=sanity

# Run on TEST environment
npm test -- --env=TEST

# Run on PROD environment
npm test -- --env=PROD

# Run @smoke tests on TEST environment
npm test -- --env=TEST --tag=smoke

# Run against locally started anarix-ui (will run npm install + npm start in anarix-ui)
npm test -- --env=DEV --target=local

# View the HTML report after a run
npm run report
```

### What the flags do

| Flag | Values | Default | Effect |
|---|---|---|---|
| `--env` | `DEV` / `TEST` / `PROD` | `DEV` | Picks URL + credentials. Also rewrites `ACTIVE_ENV` line in `anarix-ui/src/constants/env/env.orchestrator.ts`. |
| `--target` | `local` / `actual` | `actual` | `local` → boots anarix-ui locally on `http://localhost:4201`. `actual` → uses public env URL. |
| `--tag` | `smoke` / `sanity` / etc. | _(none)_ | Runs only tests with `@<tag>` in the title. No tag → all tests. |

---

## 4. URLs Used

| env | target=actual | target=local |
|---|---|---|
| DEV  | https://dev.anarix.ai/user/login  | http://localhost:4201/user/login |
| TEST | https://test.anarix.ai/user/login | http://localhost:4201/user/login |
| PROD | https://app.anarix.ai/user/login  | http://localhost:4201/user/login |

---

## 5. How to Add a New Test Case

### Step 1 — Add a new spec file
Create `tests/myfeature.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { getRuntimeConfig } from "../config";

const config = getRuntimeConfig();

test("@smoke my new test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.openLoginPage(config.loginUrl);
  // your assertions here
  expect(page.url()).toContain("/user/login");
});
```

### Step 2 — Tag the test
Add `@smoke`, `@sanity`, or any tag you want directly in the test title.
That's how `--tag=` filters them.

### Step 3 — Run it
```bash
npm test -- --tag=smoke
```

### Step 4 — Add a new page (if needed)
Create `pages/MyFeaturePage.ts` extending `BasePage`:

```ts
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class MyFeaturePage extends BasePage {
  private myButton: Locator;

  constructor(page: Page) {
    super(page);
    this.myButton = page.locator("#my-button");
  }

  async clickMyButton() {
    await this.myButton.click();
  }
}
```

Then import and use it in your spec — same pattern as `LoginPage`.

---

## 6. Built-in Features

- **Retry on failure** — every failed test auto-retries once (configured in `playwright.config.ts`).
- **Screenshot on failure** — saved automatically into the HTML report.
- **Trace + video on failure** — for debugging.
- **HTML report** — generated in `reports/`. Open with `npm run report`.
- **Console logs** — `runner.ts` and `BasePage` log what they are doing for easy debugging.

---

## 7. Common Issues

| Problem | Fix |
|---|---|
| `anarix-ui not found` | Place `anarix-ui` folder next to or above the framework folder. |
| Browsers missing | Run `npm run install:browsers`. |
| Want to see the browser | Add `--headed`: `npm test -- --headed`. |
| HTML report not opening | Run `npm run report`. |
| Need to run only one file | `npm test -- tests/login.spec.ts`. |

---

## 8. Quick Recap

- **Add a test** → drop a file in `tests/` with `@tag` in the title.
- **Add a page** → drop a file in `pages/` extending `BasePage`.
- **Change credentials/URLs** → edit `config.ts`.
- **Change env behavior** → flags on `npm test`.

Done. Three folders, eight files, no magic.
