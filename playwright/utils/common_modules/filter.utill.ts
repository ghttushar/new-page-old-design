import { expect } from "@playwright/test";
import { FilterPage } from "../../pages/filter.page";

export class FilterUtil  {
  constructor(private filterPage: FilterPage) {}
 

  //open 
  async openFilter(): Promise<void> {
    await this.filterPage.filterButton.waitFor({ state: 'visible' });
    console.log("[FilterUtil] Opening filter panel");
    await this.filterPage.filterButton.click();
    console.log("[FilterUtil] Waiting for filter panel to be visible...");
    await expect(this.filterPage.filterApplyButton).toBeVisible();
    console.log("[FilterUtil] Filter panel opened");
  }

  async cancelFilter(): Promise<void> {
    await this.filterPage.cancelFilterButton.click();
    await expect(this.filterPage.filterApplyButton).not.toBeVisible();
    console.log("[FilterUtil] Filter panel cancelled");
  }

  async applyFilter(): Promise<void> {
    await this.filterPage.filterApplyButton.click();
    await this.filterPage.clearFilter.waitFor({ state: 'visible' });
    await expect(this.filterPage.filterApplyButton).not.toBeVisible();
    console.log("[FilterUtil] Filter applied");
  }







  async selectField(fieldName: string, rowIndex = 0): Promise<void> {

    // 1. Click the dropdown of that row
    await this.filterPage.fieldDropdownFirst.nth(rowIndex).click();

    // 2. Wait for MUI listbox (portal) to appear
    const listBox = this.filterPage.listBox;
    await expect(listBox).toBeVisible();

    // 3. Select option from listbox
    await listBox.locator('li[role="option"]', { hasText: fieldName }).click();

    console.log(`[FilterUtil] Row ${rowIndex} field → "${fieldName}"`);
  }


  async selectCondition(condition: string, rowIndex = 0): Promise<void> {

     await this.filterPage.conditionDropdownFirst.nth(rowIndex).click();
  
    // 2. Wait for MUI listbox (portal) to appear
    const listBox = this.filterPage.listBox;;
    await expect(listBox).toBeVisible();

    // 3. Select option from listbox
    await listBox.locator('li[role="option"]').filter({hasText: new RegExp(`^${condition}$`)}).click();


    console.log(`[FilterUtil] Row ${rowIndex} condition → "${condition}"`);
  }


  async setValue(value: string, field_Type = 'Dropdown', rowIndex = 0): Promise<void> {
    if (field_Type === 'Field') {
      const input = this.filterPage.valueInputField;

      await input.first().fill(value);
    }
    else {
       await this.filterPage.valueInputDropdownFirst.nth(rowIndex).click();
      const options = this.filterPage.options;
      await expect(options.first()).toBeVisible();
      await options.filter({hasText: new RegExp(`^${value}$`)}).click();

    }


    console.log(`[FilterUtil] Row ${rowIndex} value → "${value}"`);
  }



  async addRow(): Promise<void> {
    await this.filterPage.addFilterButton.click();
    console.log("[FilterUtil] New filter row added");
  }

  async deleteRow(rowIndex = 0): Promise<void> {
    const deleteButtons = this.filterPage.deleteFilterButton;
    
    await deleteButtons.nth(rowIndex).click();
    console.log(`[FilterUtil] Row ${rowIndex} deleted`);
  }
// async deleteRow(rowIndex: number): Promise<void> {
//   const row = this.page.locator(`//tr[@data-test="table-row"][@data-index="${rowIndex}"]`);
  
//   await row.waitFor({ state: 'visible' });

//   const deleteBtn = row.locator("//div[@class='_trashIcon_w8qbb_30']");
//   await deleteBtn.nth(rowIndex).click();

//   console.log(`[FilterUtil] Row ${rowIndex} deleted`);
// }


  async getAvailableFields(rowIndex = 0): Promise<string[]> {
    const fieldDropdowns = this.filterPage.fieldDropDown;
    await fieldDropdowns.nth(rowIndex).click();

    const options = this.filterPage.options;
    await expect(options.first()).toBeVisible();

    const count = await options.count();
    const fields: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).innerText();
      fields.push(text.trim());
    }
    await this.filterPage.listBox.press("Escape");
    console.log(`[FilterUtil] Available fields: ${JSON.stringify(fields)}`);
    return fields;
  }


  async applyFilterWith(field: string, condition: string, value: string, field_Type = 'Dropdown', rowIndex = 0): Promise<void> {
    await this.openFilter();
    await this.selectField(field, rowIndex);
    await this.selectCondition(condition, rowIndex);
    await this.setValue(value, field_Type, rowIndex);
    await this.applyFilter();
    console.log(`[FilterUtil] ✓ Filter applied → ${field} ${condition} ${value}`);
  }



 async applyTwoFilters(
  first: {field: string; condition: string; value: string; fieldType?: string;},
second: {field: string; condition: string; value: string; fieldType?: string;}
): Promise<void> {

  await this.openFilter();

  // First row
  await this.selectField(first.field, 0);

  await this.selectCondition(first.condition, 0);

  await this.setValue(
    first.value,
    first.fieldType || 'Dropdown',
    0
  );

  // Add second row
  await this.addRow();
  await expect(this.filterPage.filterApplyButton)
  .toBeVisible({ timeout:3000 });


  // Second row
  await this.selectField(second.field, 1);

  await this.selectCondition(second.condition, 1);

  await this.setValue(
    second.value,
    second.fieldType || 'Dropdown',
    1
  );

  // Wait until Apply enabled
  await expect(this.filterPage.filterApplyButton).toBeEnabled();

  await this.applyFilter();
  await expect(this.filterPage.appliedFilter).toHaveCount(2, { timeout: 10000 });


  console.log(`[FilterUtil] ✓ Two filters applied`
  );
}
  

}