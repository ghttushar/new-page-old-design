export enum DaypartingTabsEnum {
  HOURLY_TRENDS = 'home',
  DAYPARTING_CAMPAIGNS = 'home/campaigns',
  DAYPARTING_SETUP = 'home',
  EDIT_PAGE = 'edit',
}

export enum DayPartingHistoryChangesTabsEnum {
  KEYWORDS = 'keywords',
  TARGETS = 'targets',
  AD_ITEMS = 'adItems',
  WALMART_KEYWORD = 'walmart_keywords',
  WALMART_TARGETS = 'walmart_targets',
  WALMART_AD_ITEMS = 'walmart_adItems',
}

export enum DaypartingRecurrenceTypeEnum {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
}

export enum DaypartingRecurrenceDaysEnum {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}

export enum DaypartingTimeRangeTypeEnum {
  ALL_DAY = 'ALL_DAY',
  CUSTOM_TIME_RANGE = 'CUSTOM_TIME_RANGE',
}

export enum DaypartingJobStatusEnum {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ENABLED = 'ENABLED',
  ARCHIVED = 'ARCHIVED',
  PAUSED = 'PAUSED',
}

export enum DaypartingBidChangeTypeEnum {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}

export enum DaypartingTimeTypeEnum {
  HOUR_0 = '00:00',
  HOUR_1 = '01:00',
  HOUR_2 = '02:00',
  HOUR_3 = '03:00',
  HOUR_4 = '04:00',
  HOUR_5 = '05:00',
  HOUR_6 = '06:00',
  HOUR_7 = '07:00',
  HOUR_8 = '08:00',
  HOUR_9 = '09:00',
  HOUR_10 = '10:00',
  HOUR_11 = '11:00',
  HOUR_12 = '12:00',
  HOUR_13 = '13:00',
  HOUR_14 = '14:00',
  HOUR_15 = '15:00',
  HOUR_16 = '16:00',
  HOUR_17 = '17:00',
  HOUR_18 = '18:00',
  HOUR_19 = '19:00',
  HOUR_20 = '20:00',
  HOUR_21 = '21:00',
  HOUR_22 = '22:00',
  HOUR_23 = '23:00',
  HOUR_23_59 = '23:59',
}

export enum DaypartingPlacementsEnum {
  DETAIL_PAGE_ON_AMAZON = 'Detail Page on-Amazon',
  OFF_AMAZON = 'Off Amazon',
  OTHER_ON_AMAZON = 'Other on-Amazon',
  TOP_OF_SEARCH_ON_AMAZON = 'Top of Search on-Amazon',
}

export enum DaypartingTriggerStatusEnum {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum DaypartingHistoryEnum {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum DaypartingJobTypeEnum {
  CHANGE = 'CHANGE',
  REVERT = 'REVERT',
}

export enum DayPartingTitlesEnum {
  DAYPARTING_HOME = 'DAYPARTING_HOME',
  DAYPARTING_HISTORY = 'DAYPARTING_HISTORY',
  DAYPARTING_SCHEDULED_JOBS = 'DAYPARTING_SCHEDULED_JOBS',
}

export enum DayPartingTooltipEnum {
  NEXT_CHANGE_SCHEDULED = `The exact time when this campaign's bids will be automatically adjusted according to your dayparting schedule`,
  NEXT_REVERT_SCHEDULED = `The exact time when this campaign's bids will be automatically returned to their original values`,
  CURRENT_CHANGE_TRIGGER_STATUS = `Status of the current bid change cycle. Resets to Pending after completion for the next
  scheduled change.`,
  CURRENT_REVERT_TRIGGER_STATUS = `Status of the current bid revert cycle. Resets to Pending after completion for the next
  scheduled revert`,
}
