import { Page } from "@playwright/test";

// Parent class for all pages. Holds shared helpers.
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(url: string) {
    console.log(`[BasePage] Opening: ${url}`);
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }
}
