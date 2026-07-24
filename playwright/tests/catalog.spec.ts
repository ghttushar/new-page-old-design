import { expect, Page, test } from "@playwright/test";
import { DEFAULT_TENANT, getRuntimeConfig } from "../config";
import { calanderPage } from '../pages/calander.page';
import { CatalogPage } from "../pages/catalog.page";
import { ColoumnPage } from '../pages/coloumn.page';
import { FilterPage } from '../pages/filter.page';
import { LoginPage } from "../pages/login.page";
import { MarketPlacePage } from '../pages/maccount.page';
import { TenantPage } from "../pages/tenant.page";
import { SUPPORTED_DATE_RANGES } from '../testData/date_ranges';
import { DateRangeUtil } from '../utils/common_modules/calader.util';
import { DateRangePickerUtil } from '../utils/common_modules/calendar.ranges.util';
import { ColoumnUtil } from '../utils/common_modules/coloumn.util';
import { DownloadUtil } from '../utils/common_modules/dowload.utill';
import { FilterUtil } from '../utils/common_modules/filter.utill';
import { MarketplaceUtil } from '../utils/common_modules/marketPlace_util';
import { CommonPaginationUtil } from '../utils/common_modules/pagination_util';
const config = getRuntimeConfig();
 
// `serial` = run all tests in this describe one after the other in the same
// browser. Combined with `beforeAll` + a shared `page`, login → tenant →
// catalog navigation happens ONCE for the whole suite.
test.describe.configure({ mode: 'parallel' });
test.describe("Catalog Page - NapQueen", () => {
  let page: Page;
  let catalogPage: CatalogPage;
  let dateRangeUtil: DateRangeUtil;
  let filterUtil: FilterUtil;
  let marketplaceUtil: MarketplaceUtil;
  let downloadUtil: DownloadUtil;
  let paginationUtil: CommonPaginationUtil;
  let calendar: calanderPage;
  let daterange: DateRangePickerUtil;
  let filterpage: FilterPage;
  let columnPage: ColoumnPage;
  let accountPage: MarketPlacePage;


  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    const loginPage = new LoginPage(page);
    const tenantPage = new TenantPage(page);
    filterpage = new  FilterPage(page);
    catalogPage = new CatalogPage(page);
    dateRangeUtil = new DateRangeUtil(page);
    filterUtil = new FilterUtil(filterpage);
    marketplaceUtil = new MarketplaceUtil(page);
    downloadUtil = new DownloadUtil(page);
    paginationUtil = new CommonPaginationUtil(page);
    calendar = new calanderPage(page);
    daterange = new DateRangePickerUtil(page);
    filterpage = new FilterPage(page);
    columnPage = new ColoumnPage(page);
    accountPage = new MarketPlacePage(page);

    console.log("[suite] login → select tenant → open catalog (one time)");
    await loginPage.openLoginPage(config.loginUrl);
    await page.setViewportSize({ width: 1440, height: 900 });

    await loginPage.login(config.username, config.password);
    await tenantPage.selectTenant(DEFAULT_TENANT);
    await catalogPage.goToCatalog();
    const clearVisible = await filterpage.clearFilter.isVisible().catch(() => false);
    if (clearVisible) {
      await filterpage.clearFilter.click();
    }
  });

  test.afterEach(async () => {
    await page.close();
  });


  test('@title TC001 - should display page title as Catalog', async () => {
    await expect(page.locator('input[placeholder="Search Product Name/Product ID/SKU"]')).toBeVisible();
    const title = await catalogPage.getCatalogHeading();
    console.log(`[TC001] Page title found: "${title}"`);
    // Instead of exact match, just check it CONTAINS "Catalog"
    expect(title).toContain('Catalog');
    //TC002b - page title should not be empty'
    expect(title.length).toBeGreaterThan(0);


  });

  //filter TC

  test('@Filter TC002 - check  single filter ', async () => {

    console.log("[TC002] Applying filter: with different condition");
    await filterUtil.applyFilterWith('Fulfillment Type', 'is', 'Seller Fulfilled');
    await expect(filterpage.appliedFilter).toContainText('Seller Fulfilled');

    const values = await filterpage.productListSeller.allTextContents();
    for (const value of values) {
      await expect(value.trim())
        .toBe('Seller Fulfilled');
    }
    await filterpage.clearFilter.click();
  });


  test('@multiFilter TC003 - check multifilter filter ', async () => {

    console.log("[TC003] Applying filter: with different condition");
    await filterUtil.applyTwoFilters(
      { field: 'Fulfillment Type', condition: 'is', value: 'Seller Fulfilled' },
      { field: 'Status', condition: 'is', value: 'Unpublished' }

    );
    await expect(filterpage.appliedFilter).toHaveCount(2);

    await expect(filterpage.appliedFilter.nth(0)).toContainText('Fulfillment Type');

    await expect(filterpage.appliedFilter.nth(1)).toContainText('Status');
    const values = await filterpage.statusFiltervalue.allTextContents();
    for (const value of values) {
      await expect(value.trim())
        .toBe('UNPUBLISHED');
    }


    await filterUtil.openFilter();
    await filterUtil.deleteRow(1);
     await page.waitForTimeout(3000);

    await filterpage.filterApplyButton.click();
   



    await expect(filterpage.appliedFilter).toHaveCount(1);

    await expect(filterpage.appliedFilter.nth(0)).toContainText('Fulfillment Type');

    await expect(filterpage.appliedFilter.nth(1)).toHaveCount(0);


  });



  //pegination test
  test('@totalProductCountRow TC004 - verify total product count by rows per page', async () => {
    await paginationUtil.verifyPagination({
      totalCountLocator: catalogPage.totalProductsValue,
      productsLocator: catalogPage.productNames,
      pageSizeDropdown: catalogPage.pageSizeDropdown,
      nextPageButton: catalogPage.nextPageButton,
      pageSizeValue: '50'
    });

  });

  test('@totalProductCountSingle TC005 - verify total product count in single page', async () => {
    await paginationUtil.verifyPagination({
      totalCountLocator: catalogPage.totalProductsValue,
      productsLocator: catalogPage.productNames,
      pageSizeDropdown: catalogPage.pageSizeDropdown,
      nextPageButton: catalogPage.nextPageButton,
      pageSizeValue: '100'
    });
  });
  // calender test
  test('@customDateRange TC006 - verify custom date range', async () => {
    await dateRangeUtil.selectYesterdayToToday({
      calendarInput: calendar.dateRangeButton,
      applyButton: calendar.applyButton,
      displayedDateRangeLocator: calendar.dateRangeButton
    });
    await expect(catalogPage.productNames.first()).toBeVisible();
  });

  test('@customDateRange2 TC007 - verify relative date range', async () => {
    for (const range of SUPPORTED_DATE_RANGES) {
      console.log(`Executing Validation For: ${range.label}`);
      await page.waitForTimeout(3000);
      await daterange.selectRelativeDateRange({
        calendarInput: calendar.dateRangeButton,
        rangeOptionLocator: page.locator(`//span[text()='${range.label}']`),
        applyButton: calendar.applyButton,
        displayedDateRangeLocator: calendar.dateRangeButton,
        range
      });
      await expect(catalogPage.productNames.first()).toBeVisible();

    }
  });

  //Column Test
  test("@column TC008 - Validate all columns", async () => {
    await columnPage.columnButton.click();
    const allColumns = await ColoumnUtil.getAllDropdownColumnNames(columnPage);
    // Select all using button
    await ColoumnUtil.selectAllColumnsUsingButton(columnPage);
    await page.waitForTimeout(3000);

    // Verify all visible
    await ColoumnUtil.verifyAllColumnsVisible(columnPage, allColumns);
    await page.waitForTimeout(3000);

    // Open dropdown again
    await columnPage.columnButton.click();
    //custom check done as per default column tobe select else apply not enabled covered.
    await ColoumnUtil.clearAllColumns(columnPage, ['Status', 'Product Name']);
    await page.waitForTimeout(3000);

    // Verify not visible
    await ColoumnUtil.verifyColumnsVisibility(columnPage, allColumns, ['Status', 'Product Details']);

  });

  test('@csa TC009 - verify column custom search', async () => {
    await columnPage.columnButton.click();
    const allColumns = await ColoumnUtil.getAllDropdownColumnNames(columnPage);
    await columnPage.clearAllButton.click();
    await ColoumnUtil.searchAndCheck(columnPage, ['Status', 'Product Name']);
    await columnPage.applyButton.click();
    await page.waitForTimeout(2000);
    await ColoumnUtil.verifyColumnsVisibility(columnPage, allColumns, ['Status', 'Product Details']);

  });
  //market place with search test 
  test('@market TC010- check marketplace ', async () => {
    console.log("[TC010] Checking marketplace options");
    await MarketplaceUtil.selectDropdownValue(accountPage, 'Account', 'NapQueen(3P)');

    await page.reload({ waitUntil: 'load' });
    const countID = await accountPage.searchWalmartOrAmazon('ID').count();
    for (let i = 0; i < countID; i++) {
      await expect(accountPage.searchWalmartOrAmazon('ID').nth(i)).toBeVisible();
    }
    await accountPage.searchField.fill('NapQueen ZETA Heavy Duty Easy Assembly Metal Platform Bed Frame, Queen Size');
    await accountPage.searchButton.click();
    await page.waitForTimeout(3000);
    const count = await catalogPage.totalProductsValue.textContent();
    const value = Number(count);
    console.log('The Count is :', value);
    expect(value).toBe(1);
    await expect(accountPage.productList).toHaveText('NapQueen ZETA Heavy Duty Easy Assembly Metal Platform Bed Frame, Queen Size');
    await accountPage.clearButton.click();
    await page.waitForTimeout(3000);
    const refreshcount = await catalogPage.totalProductsValue.textContent();
    const refreshValue = Number(refreshcount);
    console.log('The Count is :', refreshValue);

    expect(refreshValue).toBeGreaterThan(1);


  });

  //download test

  test("@download1 TC011 - Verify download dropdown options and tooltip", async () => {
    console.log("[TC011] Verifying download dropdown options and tooltip");
    await downloadUtil.tooltipDownloadButton();
    await downloadUtil.openCloseDownloadActions();
    await downloadUtil.downloadAllResult();

  });

  test("@download2 TC012 - Verify download with apply filter", async () => {
    console.log("[TC012] VVerify download with apply filter");
    await downloadUtil.downloadFilterResult('Fulfillment Type', 'is', 'Seller Fulfilled');

  });



});
