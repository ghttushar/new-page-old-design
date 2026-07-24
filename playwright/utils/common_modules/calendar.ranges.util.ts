// utils/date_range_util.ts

import { expect, Locator, Page } from '@playwright/test';

export type DateRange = {
    label: string;
    daysBack?: number;
    type?: string;
};

export class DateRangePickerUtil {

    constructor(private page: Page) { }

    /**
     * Select and verify relative date ranges
     *
     * Supported:
     * - Yesterday
     * - Last 7 days
     * - Last 14 days
     * - Last 30 days
     * - This month
     * - Last month
     * - Last 3 months
     * - This year
     * - Last year
     */
    async selectRelativeDateRange(params: {
        calendarInput: Locator;
        rangeOptionLocator: Locator;
        applyButton: Locator;
        displayedDateRangeLocator: Locator;
        range: DateRange;
    }): Promise<void> {

        const {
            calendarInput,
            rangeOptionLocator,
            applyButton,
            displayedDateRangeLocator,
            range
        } = params;

        const today = new Date();

        let fromDate: Date;
        let toDate: Date = new Date(today);

        let expectedDateRange: string;

        // Common formatter
        const formatDate = (date: Date): string => {

            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            });
        };
        // Dynamic date calculation
        switch (range.type) {

            case 'yesterday':

                fromDate = new Date(today);

                fromDate.setDate(today.getDate() - 1);

                toDate = new Date(fromDate);

                expectedDateRange =
                    formatDate(fromDate);

                break;

            case 'thisMonth':

                fromDate = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                );

                // Exclude today
                toDate = new Date(today);

                toDate.setDate(today.getDate() - 1);

                expectedDateRange =
                    `${formatDate(fromDate)} - ${formatDate(toDate)}`;

                break;
            case 'last7days':

                fromDate = new Date(
                    today.getFullYear(),
                    today.getMonth() - 8,
                    1
                );

            case 'lastMonth':

                fromDate = new Date(
                    today.getFullYear(),
                    today.getMonth() - 1,
                    1
                );

                toDate = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    0
                );

                expectedDateRange =
                    `${formatDate(fromDate)} - ${formatDate(toDate)}`;

                break;

            case 'last3Months':

                fromDate = new Date(
                    today.getFullYear(),
                    today.getMonth() - 3,
                    1
                );

                toDate = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    0
                );

                expectedDateRange =
                    `${formatDate(fromDate)} - ${formatDate(toDate)}`;

                break;

            case 'thisYear':

                fromDate = new Date(
                    today.getFullYear(),
                    0,
                    1
                );

                // Exclude current day
                toDate = new Date(today);

                toDate.setDate(today.getDate() - 1);

                expectedDateRange =
                    `${formatDate(fromDate)} - ${formatDate(toDate)}`;

                break;

            case 'lastYear':

                fromDate = new Date(
                    today.getFullYear() - 1,
                    0,
                    1
                );

                toDate = new Date(
                    today.getFullYear() - 1,
                    11,
                    31
                );

                expectedDateRange =
                    `${formatDate(fromDate)} - ${formatDate(toDate)}`;

                break;

            default:

                // Last X completed days excluding today

                toDate = new Date(today);

                // Exclude current day
                toDate.setDate(today.getDate() - 1);

                fromDate = new Date(toDate);

                fromDate.setDate(
                    toDate.getDate() - ((range.daysBack || 0) - 1)
                );

                expectedDateRange =
                    `${formatDate(fromDate)} - ${formatDate(toDate)}`;

                break;
        }



        console.log(
            `Validating Range: ${range.label}`
        );

        console.log(
            `Expected Range: ${expectedDateRange}`
        );

        // Open date picker
        await calendarInput.click();

        // Select range
        await rangeOptionLocator.click();

        // Click Apply
        await applyButton.click();

        // Wait for refresh/API completion
        await this.page.waitForLoadState('networkidle');

        // Verify displayed range
        await expect(
            displayedDateRangeLocator
        ).toHaveText(expectedDateRange);

        console.log(
            `Verified Successfully: ${expectedDateRange}`
        );
    }
}