import { Locator, Page, expect } from '@playwright/test';

export class CommonPaginationUtil {

  constructor(private page: Page) {}

  /**
   * Generic Pagination Validation Method
   */
    async verifyPagination(params: {totalCountLocator: Locator; productsLocator: Locator; pageSizeDropdown: Locator; nextPageButton: Locator;pageSizeValue: string; }): Promise<void> {

    const {
      totalCountLocator,
      productsLocator,
      pageSizeDropdown,
      nextPageButton,
      pageSizeValue , 
    } = params;

    // Get total count text
    // Example: "Showing 1-20 of 161 products"
    const countText = await totalCountLocator.textContent();//PRODUCT IS  123

    const totalProducts = Number(
      countText?.match(/\d+/g)?.pop()
    );

    console.log(`Expected Total Count: ${totalProducts}`);

    // Select page size
    await pageSizeDropdown.selectOption(pageSizeValue);

    await this.page.waitForLoadState('networkidle');

    let totalCountedProducts = 0;
    let currentPage = 1;

    // Dynamic pagination loop
    while (totalCountedProducts < totalProducts) {
        await this.page.waitForTimeout(3000);

   const currentPageCount = await this.scrollAndCollectAllRows(productsLocator);
  console.log(`Page ${currentPage} Count: ${currentPageCount}`);


  // Remaining products
  const remainingProducts =
    totalProducts - totalCountedProducts;

  // Expected count for current page
  const expectedCount =
    remainingProducts >= Number(pageSizeValue)
      ? Number(pageSizeValue)
      : remainingProducts;

  console.log(`Expected Count For Current Page: ${expectedCount}`);

  // Validation
  expect(currentPageCount).toBe(expectedCount);

  totalCountedProducts += currentPageCount;

  console.log(`Running Count: ${totalCountedProducts}`);

  // Navigate next page if needed
  if (totalCountedProducts < totalProducts) {

    await nextPageButton.click();

    await this.page.waitForLoadState('networkidle');

    currentPage++;
  }
}


    // Final validation
    expect(totalCountedProducts).toBe(totalProducts);

    console.log(
      `Pagination validation completed successfully`
    );
  }

private async scrollAndCollectAllRows(productsLocator: Locator): Promise<number> {
  const seen = new Set<string>();
  let previousSize = 0;

  while (true) {
    const count = await productsLocator.count();

    for (let i = 0; i < count; i++) {
      const text = (await productsLocator.nth(i).textContent())?.trim();
      if (text) seen.add(text);
    }

    // Scroll the table (VERY IMPORTANT)
    await this.page.mouse.wheel(0, 2000);
    await this.page.waitForTimeout(800);

    if (seen.size === previousSize) break;
    previousSize = seen.size;
  }

  return seen.size;
}



  
}
