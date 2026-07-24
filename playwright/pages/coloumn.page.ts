import { Locator, Page } from "@playwright/test";

export class ColoumnPage {

  readonly page: Page;

  // Buttons
  readonly columnButton: Locator;
  readonly columnBox: Locator;
  readonly cancelButton: Locator;
  readonly applyButton: Locator;
  readonly selectAllButton: Locator;
  readonly clearAllButton: Locator;
  readonly columnSearchInput: Locator;

  // Column Locators
  readonly allColumnLabels: Locator;
  readonly allColumnCheckboxes: Locator;

  constructor(page: Page) {

    this.page = page;

    this.columnButton = page.locator("//div[text()='Columns']").first();

    this.columnBox = page.locator("//div[contains(@class,'popover')]");

    this.cancelButton = page.locator('//button[text()="Cancel"]');

    this.applyButton = page.locator('//button[text()="Apply"]');

    this.selectAllButton = page.locator('//div[text()="Select All"]');

    this.clearAllButton = page.locator('//div[text()="Clear All"]');

    this.columnSearchInput =
      page.locator('//input[@placeholder="Search"]');

    // Dynamic locators
    this.allColumnLabels = page.locator(
      "//label//span[last()]"
    );

    this.allColumnCheckboxes = page.locator(
      "//input[@type='checkbox']"
    );
  }
 

  getColumnHeader(column: string): Locator {

    return this.page.locator(
      `//th[contains(normalize-space(),'${column}')]`
    );
  }
 
  selectCustomCheckBox(column:string): Locator{
    return this.page.locator(`//input[@type='checkbox' and @value='${column}']`);
 }
  

}