import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";
// Catalog page object — selectors mapped from the real Anarix DOM.
//
// Navigation flow:
//   1. Click the badge icon (MuiBadge-root)        → opens a submenu
//   2. Click submenu item "sub-menu-item-catalog-page" → catalog dashboard loads
//
// Once on the dashboard:
//   - Search field    : input[placeholder="Search Product Name/Product ID/SKU"]
//   - Page size       : select[data-test="page-size-dropdown"]
//   - Row count text  : [data-test="row-count"]   e.g. "1-50 of 73"
//   - Next page btn   : [data-test="next-page-button"]
//   - Prev page btn   : [data-test="previous-page-button"]
//   - Total card      : <b class="_productCount_..."> (hash may change)
//   - Product name    : a[data-test="product-name"]
export class CatalogPage extends BasePage {
  // navigation
  private catalogTopMenu: Locator;
  private catalogBadgeItem: Locator;

  // dashboard
  private searchInput: Locator;
  readonly pageSizeDropdown: Locator;
  private rowCountText: Locator;
  readonly nextPageButton: Locator;
  private prevPageButton: Locator;
  readonly totalProductsValue: Locator;
  readonly productNames: Locator;
  private pageTitle: Locator;
  private statusCells: Locator ;

  constructor(page: Page) {
    super(page);

    // Sidebar item: <div data-test="Top-menu-catalog">...Catalog...</div>
    this.catalogTopMenu = page.locator('[data-test="Top-menu-catalog"]');
    // Inner / dropdown catalog item: <span class="MuiBadge-root css-1j70ccx">Catalog<...>Beta</...></span>
    this.catalogBadgeItem = page.locator("//li[@data-test='sub-menu-item-catalog-page']").filter({ hasText: "Catalog" });

    this.searchInput = page.locator('//div[@data-test="search-wrapper"]');
    this.pageSizeDropdown = page.locator("//select[@data-test='page-size-dropdown']");
    this.rowCountText = page.locator('[data-test="row-count"]');
    this.nextPageButton = page.locator('[data-test="next-page-button"]');
    this.prevPageButton = page.locator('[data-test="previous-page-button"]');
    // Class hash (e.g. _productCount_1pyml_36) can change between builds → match by prefix
    this.totalProductsValue = page.locator('//b[@class="_productCount_1pyml_36"]');
    this.productNames = page.locator('a[data-test="product-name"]');
    this.pageTitle = page.locator('//div[@data-test="page-name"]').first();
    this.statusCells = page.locator('div[data-test="product-status"]');


  }

  // ---------- navigation ----------

  async goToCatalog() {
    // 1. Click the Catalog top-menu item in the sidebar (opens dropdown / navigates)
    console.log("[CatalogPage] Clicking Top-menu-catalog (sidebar)");
    await expect(this.catalogTopMenu).toBeVisible({ timeout: 30_000 });
    await this.catalogTopMenu.click();

    // 2. Click the inner Catalog badge item (in the dropdown that just opened)
    //    Using .last() in case both the sidebar item and the dropdown item match.
    console.log("[CatalogPage] Clicking inner Catalog badge item");
    await expect(this.catalogBadgeItem.last()).toBeVisible({ timeout: 10_000 });
    await this.catalogBadgeItem.last().click();

    await this.waitForCatalogToLoad();
     await this.page.waitForTimeout(3000);
  }

  async waitForCatalogToLoad() {
    await expect(this.searchInput).toBeVisible({ timeout: 30_000 });
    await this.page.waitForLoadState("networkidle");
  }

  // ---------- counts ----------

  // Reads "1-50 of 73" from the pagination row, returns 73.
  async getTotalFromPagination(): Promise<number> {
    await expect(this.rowCountText).toBeVisible({ timeout: 20_000 });
    const raw = (await this.rowCountText.textContent()) ?? "";
    // Replace non-breaking spaces with regular spaces, then match "of <number>"
    const text = raw.replace(/\u00A0/g, " ").trim();
    const match = text.match(/of\s+([\d,]+)/i);
    if (!match) {
      throw new Error(`Could not parse total from row-count text: "${text}"`);
    }
    return parseInt(match[1].replace(/,/g, ""), 10);
  }

  // Reads the value from the "Total Products" card (the <b> element).
  async getTotalFromCard(): Promise<number> {
    await expect(this.totalProductsValue).toBeVisible({ timeout: 20_000 });
    const raw = (await this.totalProductsValue.textContent()) ?? "";
    return parseInt(raw.replace(/,/g, "").trim(), 10);
  }

  // ---------- products ----------

  async getFirstProductName(): Promise<string> {
    await expect(this.productNames.first()).toBeVisible({ timeout: 20_000 });
    // The `title` attribute holds the full untruncated name.
    const title = await this.productNames.first().getAttribute("title");
    if (title && title.trim().length > 0) return title.trim();
    return ((await this.productNames.first().textContent()) ?? "").trim();
  }

  async getVisibleProductCount(): Promise<number> {
    return await this.productNames.count();
  }

  async getAllVisibleProductNames(): Promise<string[]> {
    const count = await this.productNames.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = (await this.productNames.nth(i).getAttribute("title")) ?? "";
      names.push(t.trim());
    }
    return names;
  }
  async getTotalProductCount(): Promise<number> {
    await expect(this.totalProductsValue).toBeVisible({ timeout: 20_000 });
    const raw = (await this.totalProductsValue.textContent()) ?? "";
    const count = parseInt(raw.replace(/,/g, "").trim(), 10);
    console.log(`[CatalogPage] Total product count from card: ${count}`);
    return count;
  }
  async verifyAllRowsStatus(expectedStatus: string): Promise<void> {
  await this.statusCells.first().waitFor({ state: 'visible' });

  const count = await this.statusCells.count();

  for (let i = 0; i < count; i++) {
    const statusText = (await this.statusCells.nth(i).textContent())?.trim();

    if (statusText !== expectedStatus) {
      throw new Error(
        `Row ${i + 1} has status '${statusText}' instead of '${expectedStatus}'`
      );
    }
  }
}

  // ---------- search ----------

  async searchFor(query: string) {
    console.log(`[CatalogPage] Searching for: ${query}`);
    await expect(this.searchInput).toBeVisible({ timeout: 20_000 });
    await this.searchInput.click();
    await this.searchInput.fill(query);
    await this.searchInput.press("Enter");
    // Give the list time to refresh
    await this.page.waitForLoadState("networkidle");
  }

  async clearSearch() {
    await this.searchInput.fill("");
    await this.searchInput.press("Enter");
    await this.page.waitForLoadState("networkidle");
  }

  // ---------- pagination ----------

 async selectPaginationSize(size: number): Promise<void> {
  console.log(`[CatalogPage] Selecting pagination size: ${size}`);

  await this.pageSizeDropdown.selectOption({
    label: size.toString(),   // or value if present
  });

  await this.page.waitForLoadState("networkidle");
}

  async goToNextPage(): Promise<boolean> {
    if (await this.nextPageButton.isEnabled().catch(() => false)) {
      await this.nextPageButton.click();
      await this.page.waitForLoadState("networkidle");
      return true;
    }
    return false;
  }

  async goToPreviousPage(): Promise<boolean> {
    if (await this.prevPageButton.isEnabled().catch(() => false)) {
      await this.prevPageButton.click();
      await this.page.waitForLoadState("networkidle");
      return true;
    }
    return false;

  }
//    async getPageTitle(): Promise<string> {
//     const title : string = await this.pageTitle.textContent();
//     console.log(title);
//     return title;
// }
async getCatalogHeading(): Promise<string> {
  const heading = await this.pageTitle.textContent();
  return heading?.trim() ?? '';
}

}
