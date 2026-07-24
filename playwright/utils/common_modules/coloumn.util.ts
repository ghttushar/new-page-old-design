import { expect } from '@playwright/test';
import { ColoumnPage } from '../../pages/coloumn.page';

export class ColoumnUtil {

  // =========================================
  // Get all dropdown column names
  // =========================================
  static async getAllDropdownColumnNames(
    columnpage: ColoumnPage
  ): Promise<string[]> {

    const labels =
      await columnpage.allColumnLabels.allTextContents();

    return labels
      .map(text => text.trim())
      .filter(text => text.length > 0);
  }

  // =========================================
  // Select all using button
  // =========================================
  static async selectAllColumnsUsingButton(
    columnpage: ColoumnPage
  ) {

    await columnpage.selectAllButton.click();


    await columnpage.applyButton.click();
  }

  // =========================================
  // Select all one by one
  // =========================================
  static async selectAllColumnsOneByOne(
    columnpage: ColoumnPage
  ) {

    const count =
      await columnpage.allColumnCheckboxes.count();

    for (let i = 0; i < count; i++) {

      const checkbox =
        columnpage.allColumnCheckboxes.nth(i);

      const checked =
        await checkbox.isChecked();

      if (!checked) {
        await checkbox.check();
      }
    }

    await columnpage.applyButton.click();
  }

  // =========================================
  // Verify columns visible
  // =========================================
  static async verifyAllColumnsVisible(
    columnpage: ColoumnPage,
    columns: string[]
  ) {

    for (const column of columns) {

      await expect(
        columnpage.getColumnHeader(column)
      ).toBeVisible();
    }
  }

  // =========================================
  // Deselect columns
  // =========================================
  static async deselectColumns(
    columnpage: ColoumnPage,
    columns: string[]
  ) {

    for (const column of columns) {

      const checkbox = columnpage.page.locator(
        `//span[contains(text(),'${column}')]
        /preceding::input[@type='checkbox'][1]`
      );

      const checked =
        await checkbox.isChecked();

      if (checked) {
        await checkbox.uncheck();
      }
    }

    await columnpage.applyButton.click();
  }

  // =========================================
  // Verify columns not visible
  // =========================================
  static async verifyColumnsVisibility(
    columnpage: ColoumnPage,
    allColumns: string[],
    visibleColumns: string[] = []
  ) {
    console.log(
      `Expected Visible Columns => ${visibleColumns.join(', ')}`
    );
    // VERIFY EXPECTED VISIBLE COLUMNS
    // =====================================
    for (const visibleColumn of visibleColumns) {
      const locator = columnpage.getColumnHeader(visibleColumn);
      const isVisible =
        await locator.first().isVisible().catch(() => false);

      console.log(
        `VISIBLE CHECK => ${visibleColumn} => ${isVisible}`
      );

      expect(
        isVisible,
        `Expected column "${visibleColumn}" to be visible`
      ).toBeTruthy();
    }

    // =====================================
    // VERIFY REMAINING COLUMNS NOT VISIBLE
    // =====================================
    const hiddenColumns = allColumns.filter(
      column => !visibleColumns.includes(column)
    );
    for (const hiddenColumn of hiddenColumns) {

      const locator = columnpage.getColumnHeader(hiddenColumn);

      const isVisible =
        await locator.first().isVisible().catch(() => false);

      console.log(
        `HIDDEN CHECK => ${hiddenColumn} => ${isVisible}`
      );

      expect(
        isVisible,
        `Expected column "${hiddenColumn}" to NOT be visible`
      ).toBeFalsy();
    }
  }

  // =========================================
  // Clear all columns
  // =========================================
  static async clearAllColumns(columnpage: ColoumnPage, columns: string[] = []) {
    await columnpage.clearAllButton.click();
    await expect(columnpage.applyButton).not.toBeEnabled();
    for (const column of columns) {
      await columnpage.selectCustomCheckBox(column).click();
    }
    await columnpage.applyButton.click();
  }
static async searchAndCheck(columnpage: ColoumnPage, columns: string[] = []){
  for (const column of columns) {
      await columnpage.columnSearchInput.fill(column);
     await expect(columnpage.selectCustomCheckBox(column)).toBeVisible();
     await columnpage.selectCustomCheckBox(column).click();     
    }

}

}
