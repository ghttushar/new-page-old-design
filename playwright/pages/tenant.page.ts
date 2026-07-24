import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";

// Page object for the account / tenant selection screen shown after login.
//
// Real DOM:
//   - Search:   <input placeholder="Search by account name" ... role="combobox">
//   - Result:   <div class="_account_16mp4_7">
//                 <div class="_accountDetails_16mp4_89" data-test="account-id-...">
//                   <div class="MuiAvatar-root ...">NT</div>
//                   <h3>NapQueen Test</h3>
//                 </div>
//                 ...
//               </div>
export class TenantPage extends BasePage {
  private accountSearchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.accountSearchInput = page.locator('input[placeholder="Search by account name"]');
  }

  // Type tenant name → press Enter → click the matching result.
  async selectTenant(name: string) {
    console.log(`[TenantPage] Searching for tenant: ${name}`);

    await expect(this.accountSearchInput).toBeVisible({ timeout: 30_000 });
    await this.accountSearchInput.click();
    await this.accountSearchInput.fill(name);
    await this.accountSearchInput.press("Enter");

    // Click the account row that contains an <h3> matching the tenant name.
    // Using `:has(h3:has-text("..."))` so we target the whole clickable card.
    console.log(`[TenantPage] Clicking matching account: ${name}`);
    const accountCard = this.page
      .locator(`._account_16mp4_7:has(h3:has-text("${name}"))`)
      .first();

    // Fallback if the class hash changes — click the h3 directly.
    if (await accountCard.isVisible().catch(() => false)) {
      await accountCard.click();
    } else {
      const heading = this.page.locator(`h3:has-text("${name}")`).first();
      await expect(heading).toBeVisible({ timeout: 10_000 });
      await heading.click();
    }

    await this.page.waitForLoadState("networkidle");
  }
}
