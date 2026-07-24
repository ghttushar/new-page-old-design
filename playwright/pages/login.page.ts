import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";

// Login page object for https://dev.anarix.ai/user/login
export class LoginPage extends BasePage {
  private emailInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;

  constructor(page: Page) {
    super(page);
    // NOTE: If selectors break, run `npx playwright codegen https://dev.anarix.ai/user/login`
    // and replace these with the recorded ones.
    this.emailInput = page.locator('input[type="email"], input[name="email"], input[name="username"]').first();
    this.passwordInput = page.locator('input[type="password"]').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")').first();
  }

  async openLoginPage(loginUrl: string) {
    await this.open(loginUrl);
    await expect(this.emailInput).toBeVisible({ timeout: 20_000 });
  }

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(email: string, password: string) {
    console.log(`[LoginPage] Logging in as ${email}`);
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLogin();
    // Wait until the URL no longer contains /user/login
    await this.page.waitForURL((url) => !url.toString().includes("/user/login"), {
      timeout: 30_000,
    });
  }
}
