import { expect, Locator, Page } from '@playwright/test';
import { calanderPage } from '../../pages/calander.page';

export class DateRangeUtil   {
 
    page: Page;
    calendarpage: calanderPage ;
    
  
    constructor(page: Page) {
      
      this.page = page;
      this.calendarpage =new calanderPage(page);
    }

  async selectYesterdayToToday(params: {
    calendarInput: Locator;
    applyButton: Locator;
    displayedDateRangeLocator: Locator;
  }): Promise<void> {

    const {
      calendarInput,
      applyButton,
      displayedDateRangeLocator
    } = params;
    // Today's date
    const today = new Date();
    

    // Yesterday's date
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    const daybeforeyesterday = new Date();
    daybeforeyesterday.setDate(today.getDate() - 2);

    // Get day numbers
    const todayDay = today.getDate().toString();
    const yesterdayDay = yesterday.getDate().toString();
    const dayBeforeYesterdayDay = daybeforeyesterday.getDate().toString();

    console.log(`Day Before Yesterday Day: ${dayBeforeYesterdayDay}`);
    console.log(`Yesterday Day: ${yesterdayDay}`);
    console.log(`Today Day: ${todayDay}`);

    // Open calendar
    await calendarInput.click();
        await this.calendarpage.today.click();


    // Click yesterday date
    await this.page
      .locator(`//button[text()='${dayBeforeYesterdayDay}']`)
      .first()
      .click();

    // Click today date
    await this.page
      .locator(`//button[text()='${yesterdayDay}']`)
      .last()
      .click();

    // Apply
    await applyButton.click();

    await this.page.waitForLoadState('networkidle');

    // Expected format
    const formatDate = (date: Date): string => {

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      });
    };

    const expectedDateRange =
      `${formatDate(daybeforeyesterday)} - ${formatDate(yesterday)}`;

    // Verify
    await expect(
      displayedDateRangeLocator
    ).toHaveText(expectedDateRange);

    console.log(
      `Verified Date Range: ${expectedDateRange}`
    );
  }
}
