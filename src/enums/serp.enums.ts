export enum MarketplaceEnum {
  AMAZON = 'amazon',
  WALMART = 'walmart',
  All = 'all',
}

export enum Frequency {
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export enum Range {
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_14_DAYS = 'LAST_14_DAYS',
  LAST_21_DAYS = 'LAST_21_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  THIS_MONTH = 'THIS_MONTH',
  LAST_MONTH = 'LAST_MONTH',
  LAST_3_MONTHS = 'LAST_3_MONTHS',
  THIS_YEAR = 'THIS_YEAR',
  THIS_WEEK = 'THIS_WEEK',
  LAST_WEEK = 'LAST_WEEK',
  LAST_YEAR = 'LAST_YEAR',
  TWO_MONTHS_AGO = 'TWO_MONTHS_AGO',
  THREE_MONTHS_AGO = 'THREE_MONTHS_AGO',
  TWO_DAYS_AGO = 'TWO_DAYS_AGO',
  THREE_DAYS_AGO = 'THREE_DAYS_AGO',
  SEVEN_DAYS_AGO = 'SEVEN_DAYS_AGO',
  EIGHT_DAYS_AGO = 'EIGHT_DAYS_AGO',
  THIRTY_DAYS_AGO = 'THIRTY_DAYS_AGO',
  TWO_WEEKS_AGO = 'TWO_WEEKS_AGO',
  THREE_WEEKS_AGO = 'THREE_WEEKS_AGO',
  LAST_3_DAYS = 'LAST_3_DAYS',
  LAST_28_DAYS = 'LAST_28_DAYS',
  LAST_31_DAYS = 'LAST_31_DAYS',
  THIS_QUARTER = 'THIS_QUARTER',
  LAST_QUARTER = 'LAST_QUARTER',
  TWO_QUARTERS_AGO = 'TWO_QUARTERS_AGO',
  THREE_QUARTERS_AGO = 'THREE_QUARTERS_AGO',
  LAST_3_DAYS_FROM_TODAY = 'LAST_3_DAYS_FROM_TODAY',
  LAST_7_DAYS_FROM_TODAY = 'LAST_7_DAYS_FROM_TODAY',
  LAST_30_DAYS_FROM_TODAY = 'LAST_30_DAYS_FROM_TODAY',
  LAST_180_DAYS_FROM_TODAY = 'LAST_180_DAYS_FROM_TODAY',
  LAST_6_MONTHS = 'LAST_6_MONTHS',
  LIFE_TIME = 'LIFE_TIME',
  CUSTOM_RANGE = 'CUSTOM_RANGE',
}

export enum Placements {
  TOP = 1,
  MID = 2,
  BOTTOM = 3,
}

export enum Positions {
  ALL = '',
  ORGANIC = 'organic',
  PAID = 'sp',
  SP_TOP = `sp,${Placements.TOP}`,
  SP_MIDDLE = `sp,${Placements.MID}`,
  SP_BOTTOM = `sp,${Placements.BOTTOM}`,
  SB_SPONSOR_HEADLINE = 'sb,Sponsor Headline',
  SB_VIDEO = 'sb,Video',
}

export enum KeywordTrackerTabs {
  ACTIVE = 'active',
  IN_ACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export type FrequencyTypesEnum =
  | Frequency.DAILY
  | Frequency.WEEKLY
  | Frequency.MONTHLY;

export enum MetricsTimeWindowUnitEnum {
  DAYS = 'DAYS',
  WEEKS = 'WEEKS',
  MONTHS = 'MONTHS',
}
