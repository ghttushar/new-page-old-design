import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class calanderPage extends BasePage {
    readonly dateRangeButton: Locator;
  
  // ── Left panel presets ───────────────────────────
  readonly today: Locator;
  readonly yesterday: Locator;
  readonly last7Days: Locator;
  readonly last14Days: Locator;
  readonly last30Days: Locator;
  readonly thisMonth: Locator;
  readonly lastMonth: Locator;
  readonly last3Months: Locator;
  readonly thisYear: Locator;
  readonly lastYear: Locator;
  readonly customRange: Locator;

  // ── Calendar header ──────────────────────────────
  readonly calendarTitle: Locator;       // "March 2026"
  readonly nextMonthArrow: Locator;      // ">" arrow
  readonly prevMonthArrow: Locator;      // "<" arrow

  // ── Date inputs at top ───────────────────────────
  readonly startDateInput: Locator;      // "Mar 29, 2026"
  readonly endDateInput: Locator;        // "Apr 27, 2026"

  // ── Action buttons ───────────────────────────────
  readonly applyButton: Locator;
  readonly cancelButton: Locator;

    constructor(page: Page) {
        super(page);
        this.dateRangeButton = page.locator(`//button[@role='combobox'][./span and .//*[local-name()='svg']]`);
        this.today = page.locator('//span[text()="Today"]');
        this.yesterday = page.locator('//span[text()="Yesterday"]');
        this.last7Days = page.locator('//span[text()="Last 7 Days"]');
        this.last14Days = page.locator('//span[text()="Last 14 Days"]');
        this.last30Days = page.locator('//span[text()="Last 30 Days"]');
        this.thisMonth = page.locator('//span[text()="This Month"]');
        this.lastMonth = page.locator('//span[text()="Last Month"]');
        this.last3Months = page.locator('//span[text()="Last 3 Months"]');
        this.thisYear = page.locator('//span[text()="This Year"]');
        this.lastYear = page.locator('//span[text()="Last Year"]');
        this.customRange = page.locator('//span[text()="Custom Range"]');
        this.calendarTitle = page.locator('.calendar-header .title');
        this.nextMonthArrow = page.locator('.calendar-header .next-arrow');
        this.prevMonthArrow = page.locator('.calendar-header .prev-arrow');
        this.startDateInput = page.locator("//div[contains(@class, 'pointer-events-none')]/span[contains(@class, 'ml-4')]").first();
        this.endDateInput   = page.locator("//div[contains(@class, 'pointer-events-none')]/span[contains(@class, 'mr-2')]").last();
        this.applyButton = page.locator('button:has-text("Apply")');
        this.cancelButton = page.locator('button:has-text("Cancel")');
    }

   
}               