import { expect, Page } from "@playwright/test";
import { DownloadPage } from "../../pages/download.page";
import { FilterPage } from "../../pages/filter.page";
import { FilterUtil } from './filter.utill';

export class DownloadUtil {

  page: Page;
  filterPage: FilterPage;
  filterUtil: FilterUtil;
  dowloadPage: DownloadPage;

  constructor(page: Page) {
    
    this.page = page;
    this.filterPage = new FilterPage(page);
    this.filterUtil = new FilterUtil(this.filterPage);
    this.dowloadPage =new DownloadPage(page);
  }
  // ── Open download dropdown ────────────────────────
  async downloadAllResult(): Promise<void> {
    await this.dowloadPage.downloadButton.click();
    await this.page.waitForTimeout(3000);

    // Try clicking the "disabled" option
    await this.dowloadPage.downloadWithFilters.click();

    // Assert that download did NOT start
    await expect(this.page.getByText("Download Started")).not.toBeVisible();
    await expect(this.dowloadPage.downloadAllResults).toBeVisible();
    await this.dowloadPage.downloadAllResults.click();
    await this.page.waitForTimeout(3000);
    await expect(this.page.getByText("Download Started")).toBeVisible();
  }

  async downloadFilterResult(field: string, condition: string, value: string): Promise<void> {
    await this.filterUtil.applyFilterWith(field, condition, value);
    await this.dowloadPage.downloadButton.click();
    await expect(this.dowloadPage.downloadWithFilters).toBeEnabled();
    await this.dowloadPage.downloadWithFilters.click();
    await this.page.waitForTimeout(3000);
    await expect(this.page.getByText("Download Started")).toBeVisible();
  }

  async openCloseDownloadActions(): Promise<void> {
    await this.dowloadPage.downloadButton.click();
    await expect(this.dowloadPage.downloadWithFilters).toBeVisible();
    await expect(this.dowloadPage.downloadAllResults).toBeVisible();
    await this.dowloadPage.downloadButton.click(); // Click again to close the dropdown
    await expect(this.dowloadPage.downloadWithFilters).not.toBeVisible();
    await expect(this.dowloadPage.downloadAllResults).not.toBeVisible();
  }

  async tooltipDownloadButton(): Promise<void> {
    await this.dowloadPage.downloadButton.hover();

    const tooltip = this.page.getByRole('tooltip');
    await expect(tooltip).toHaveText('Download CSV');
  }
}