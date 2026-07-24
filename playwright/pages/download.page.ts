import { Page, Locator } from "@playwright/test";


export class DownloadPage  {
  protected readonly page: Page;
    

  // ── Download button (top right) ───────────────────
  readonly downloadButton: Locator;

  // ── Download dropdown options ─────────────────────
  readonly downloadWithFilters: Locator;
  readonly downloadAllResults: Locator;
  

  constructor(page: Page) {
    this.page = page;

    this.downloadButton = page.locator("//button[@aria-label='Download CSV']").last();

    this.downloadWithFilters = page.locator("//div[contains(@class, '_optionsContainer')]//span[text()='Download with Filters']").first();

    this.downloadAllResults = page.locator(
      "//div[contains(@class, '_optionsContainer')]//span[text()='Download all Results']").first();
  }
}