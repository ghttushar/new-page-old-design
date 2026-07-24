import { Locator, Page } from "@playwright/test";
export class FilterPage {
  
    protected readonly page: Page;
    
    readonly filterButton: Locator ;
    readonly filterApplyButton: Locator ;
    readonly addFilterButton: Locator ;
    readonly cancelFilterButton: Locator ;
    readonly deleteFilterButton: Locator;
    readonly fieldDropdownFirst: Locator;
   readonly conditionDropdownFirst: Locator;
    readonly valueInputDropdownFirst: Locator;
    readonly valueInputField: Locator;
    readonly clearFilter:Locator;
    readonly appliedFilter:Locator;
    readonly inputField: Locator;
    readonly productListSeller:Locator;
    readonly statusFiltervalue: Locator;
    readonly listBox: Locator;
    readonly options:Locator;
    readonly fieldDropDown :Locator;
    constructor(page: Page) {
        this.page = page;

        this.filterButton = page.locator("//div[@data-test='catalog-filter']").first();

       this.filterApplyButton = page.locator("//div[@data-test='primary-button']").first();

    
        this.addFilterButton = page.locator("//div[@class='_addFilter_w8qbb_123']").first();
        this.cancelFilterButton = page.locator("//button[@type='button' and text()='Cancel']]").first();
        this.deleteFilterButton = page.locator("//div[@class='_trashIcon_w8qbb_30']");
        this.fieldDropdownFirst = page.locator("//div[@class='MuiFormControl-root css-1er63uj']");
        this.conditionDropdownFirst = page.locator("//div[@class='MuiFormControl-root css-psvgc8']");
        this.valueInputDropdownFirst = page.locator("//div[@class='MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-jd1xy9']");
        this.valueInputField= page.locator("//input[@class='MuiInputBase-input MuiOutlinedInput-input css-1x5jdmq']").first();
        this.clearFilter= page.locator("//div[@data-test='clear-button']");
        this.appliedFilter= page.locator("//div[@class='_singleFilterContainer_8l2p2_42']");
        this.inputField = page.locator("//input[@aria-autocomplete='list']");
        this.productListSeller= page.locator("//div[@class='_productMetaData_1pyml_99']//p[@class='_subText_1pyml_107'][2]");
        this.statusFiltervalue = page.locator("//div[contains(@class,'commonCell') and text()='UNPUBLISHED']")
        this.listBox = page.locator("ul[role='listbox']");
        this.options =page.locator("li[role='option']");
        this.fieldDropDown = page.locator("//div[contains(@class, 'MuiInputBase-root')][.//input[contains(@id,':r')]]");
    }

    

}


    



