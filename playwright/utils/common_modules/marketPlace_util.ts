// utils/common_modules/marketplace_util.ts

import { Page, expect } from '@playwright/test';
import { MarketPlacePage } from "../../pages/maccount.page";

export class MarketplaceUtil {
constructor(private page: Page) {}
  // =========================================
  // Select value from marketplace dropdown
  // =========================================
  static async selectDropdownValue(marketplacePage: MarketPlacePage, dropdownName: string, value: string) {
    // Open dropdown
    const dropdown = marketplacePage.marketDropDown(dropdownName);
    await expect(dropdown).toBeVisible();
    console.log(`Opening Dropdown => ${dropdownName}`);
    await dropdown.click();
    // Select option
    const optionLocator = marketplacePage.marketValue(value);
    await expect(optionLocator).toBeVisible();
    console.log(`Selecting Value => ${value}`);
    await optionLocator.click();
    // Validation log
    console.log(`Selected "${value}" from "${dropdownName}" dropdown`);
    await expect(dropdown).toContainText(value);
  }
}
