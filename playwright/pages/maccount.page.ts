import { Locator, Page } from "@playwright/test";

export class MarketPlacePage {

  readonly page: Page;

  // Buttons
  readonly searchField: Locator;
  readonly searchButton: Locator;
  readonly clearButton : Locator;
  readonly productList : Locator;


  constructor(page: Page) {

    this.page = page;
    this.searchField = page.locator("//input[@type='text']");
    this.searchButton= page.locator("//div//h6[text()='Search']");
    this.clearButton = page.locator("//div//h6[text()='Clear']");
    this.productList = page.locator("//a[@class='_productName_1pyml_85']");
  }

  marketDropDown(option: string): Locator {
    return this.page.locator(`//label[contains(text(),'${option}')] /following-sibling::div//div[@role='button']`);
  }

  marketValue(value: string): Locator {
    return this.page.locator(`//li[normalize-space()='${value}']`);
  }
  searchWalmartOrAmazon(value: string): Locator {
    return this.page.locator(`//div[@data-test='product-meta-data']//p[contains(.,${value})]`);
  }

}

