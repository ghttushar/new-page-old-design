import { MarketplaceEnum, Range } from '@/enums/serp.enums';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { ITabData } from 'src/app/components/common/tabs-select/tabs-select';
import { MetricsKeysEnum } from 'src/enums/advertising.enums';
import {
  DaypartingBidChangeTypeEnum,
  DayPartingHistoryChangesTabsEnum,
  DaypartingPlacementsEnum,
  DaypartingRecurrenceDaysEnum,
  DaypartingRecurrenceTypeEnum,
  DaypartingTabsEnum,
  DaypartingTimeRangeTypeEnum,
  DaypartingTimeTypeEnum,
} from 'src/enums/day-parting.enums';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import { ALL_LABEL, ALL_VALUE, customRangeFilterOption } from '.';

export const dayPartingMetricOptions: IDropdownItem<string>[] = [
  {
    label: 'Impressions',
    value: MetricsKeysEnum.IMPRESSIONS,
  },
  {
    label: 'Clicks',
    value: MetricsKeysEnum.CLICKS,
  },
  {
    label: 'CTR',
    value: MetricsKeysEnum.CTR,
  },
  {
    label: 'CPC',
    value: MetricsKeysEnum.CPC,
  },
  {
    label: 'Ad Spend',
    value: MetricsKeysEnum.AD_SPEND,
  },
  {
    label: 'Ad Sales',
    value: MetricsKeysEnum.AD_SALES,
  },
  {
    label: 'Ad Units',
    value: MetricsKeysEnum.AD_UNITS,
  },
  {
    label: 'CVR',
    value: MetricsKeysEnum.CVR,
  },
  {
    label: 'ROAS',
    value: MetricsKeysEnum.ROAS,
  },
  {
    label: 'ACOS',
    value: MetricsKeysEnum.ACOS,
  },
  {
    label: 'Total Sales',
    value: MetricsKeysEnum.TOTAL_SALES,
  },
  {
    label: 'Total Units',
    value: MetricsKeysEnum.TOTAL_UNITS,
  },
  {
    label: 'TACOS',
    value: MetricsKeysEnum.TACOS,
  },
];

export const dayPartingRangeOptions: IDropdownItem<Range>[] = [
  {
    label: 'Last 7 days',
    value: Range.LAST_7_DAYS,
  },
  {
    label: 'Last 14 days',
    value: Range.LAST_14_DAYS,
  },
  {
    label: 'Last 21 days',
    value: Range.LAST_21_DAYS,
  },
  customRangeFilterOption,
];

export const dayPartingPlacementOptions: IMultiSelectDropdownItem[] = [
  {
    label: ALL_LABEL,
    value: ALL_VALUE,
    selected: true,
  },
  {
    label: DaypartingPlacementsEnum.TOP_OF_SEARCH_ON_AMAZON,
    value: DaypartingPlacementsEnum.TOP_OF_SEARCH_ON_AMAZON,
    selected: true,
  },
  {
    label: DaypartingPlacementsEnum.DETAIL_PAGE_ON_AMAZON,
    value: DaypartingPlacementsEnum.DETAIL_PAGE_ON_AMAZON,
    selected: true,
  },
  {
    label: DaypartingPlacementsEnum.OTHER_ON_AMAZON,
    value: DaypartingPlacementsEnum.OTHER_ON_AMAZON,
    selected: true,
  },
  {
    label: DaypartingPlacementsEnum.OFF_AMAZON,
    value: DaypartingPlacementsEnum.OFF_AMAZON,
    selected: true,
  },
];

export const dayPartingMarketplaceOptions: IDropdownItem<string>[] = [
  {
    value: MarketplaceEnum.AMAZON,
    label: 'Amazon',
    isDisabled: false,
  },
];

export const dayPartingTabData: ITabData[] = [
  {
    label: 'Hourly Trends',
    value: DaypartingTabsEnum.HOURLY_TRENDS,
  },
  {
    label: 'Day Parting Campaigns',
    value: DaypartingTabsEnum.DAYPARTING_CAMPAIGNS,
  },
];

export const dayPartingWalmartTabData: ITabData[] = [
  {
    label: 'Day Parting Setup',
    value: DaypartingTabsEnum.DAYPARTING_SETUP,
  },
  {
    label: 'Day Parting Campaigns',
    value: DaypartingTabsEnum.DAYPARTING_CAMPAIGNS.toLowerCase(),
  },
];

export const walmartDayPartingHistoryChangesTabData: ITabData[] = [
  {
    label: 'Keywords',
    value: DayPartingHistoryChangesTabsEnum.KEYWORDS,
  },
  {
    label: 'Ad Items',
    value: DayPartingHistoryChangesTabsEnum.AD_ITEMS,
  },
];

export const dayPartingHistoryChangesTabData: ITabData[] = [
  {
    label: 'Keywords',
    value: DayPartingHistoryChangesTabsEnum.KEYWORDS,
  },
  {
    label: 'Targets',
    value: DayPartingHistoryChangesTabsEnum.TARGETS,
  },
];

export const dayPartingRecurrenceOptions: IDropdownItem<string>[] = [
  {
    value: DaypartingRecurrenceTypeEnum.DAILY,
    label: 'Daily',
    isDisabled: false,
  },
  {
    value: DaypartingRecurrenceTypeEnum.WEEKLY,
    label: 'Weekly',
    isDisabled: false,
  },
];

export const dayPartingRecurrenceDaysOptions: IDropdownItem<DaypartingRecurrenceDaysEnum>[] =
  [
    {
      value: DaypartingRecurrenceDaysEnum.SUNDAY,
      label: 'Sunday',
      selected: false,
    },
    {
      value: DaypartingRecurrenceDaysEnum.MONDAY,
      label: 'Monday',
      selected: false,
    },
    {
      value: DaypartingRecurrenceDaysEnum.TUESDAY,
      label: 'Tuesday',
      selected: false,
    },
    {
      value: DaypartingRecurrenceDaysEnum.WEDNESDAY,
      label: 'Wednesday',
      selected: false,
    },
    {
      value: DaypartingRecurrenceDaysEnum.THURSDAY,
      label: 'Thursday',
      selected: false,
    },
    {
      value: DaypartingRecurrenceDaysEnum.FRIDAY,
      label: 'Friday',
      selected: false,
    },
    {
      value: DaypartingRecurrenceDaysEnum.SATURDAY,
      label: 'Saturday',
      selected: false,
    },
  ];

export const dayPartingHourOfDayOptions: IDropdownItem<string>[] = [
  {
    value: DaypartingTimeRangeTypeEnum.ALL_DAY,
    label: 'All Day',
    isDisabled: false,
  },
  {
    value: DaypartingTimeRangeTypeEnum.CUSTOM_TIME_RANGE,
    label: 'Time Range',
    isDisabled: false,
  },
];

export const dayPartingBidAdjustmentOptions: IDropdownItem<DaypartingBidChangeTypeEnum>[] =
  [
    {
      value: DaypartingBidChangeTypeEnum.INCREASE,
      label: 'Increase by %',
      isDisabled: false,
    },
    {
      value: DaypartingBidChangeTypeEnum.DECREASE,
      label: 'Decrease by %',
      isDisabled: false,
    },
  ];

export const dayPartingTimeOptions: IDropdownItem<string>[] = [
  {
    value: DaypartingTimeTypeEnum.HOUR_0,
    label: '00:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_1,
    label: '01:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_2,
    label: '02:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_3,
    label: '03:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_4,
    label: '04:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_5,
    label: '05:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_6,
    label: '06:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_7,
    label: '07:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_8,
    label: '08:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_9,
    label: '09:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_10,
    label: '10:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_11,
    label: '11:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_12,
    label: '12:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_13,
    label: '13:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_14,
    label: '14:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_15,
    label: '15:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_16,
    label: '16:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_17,
    label: '17:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_18,
    label: '18:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_19,
    label: '19:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_20,
    label: '20:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_21,
    label: '21:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_22,
    label: '22:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_23,
    label: '23:00',
    isDisabled: false,
  },
  {
    value: DaypartingTimeTypeEnum.HOUR_23_59,
    label: '23:59',
    isDisabled: false,
  },
];

export const DAY_PARTING_WEEKLY_DAYS_MAPPING: {
  [key: string]: string;
} = {
  [DaypartingRecurrenceDaysEnum.MONDAY]: 'M',
  [DaypartingRecurrenceDaysEnum.TUESDAY]: 'T',
  [DaypartingRecurrenceDaysEnum.WEDNESDAY]: 'W',
  [DaypartingRecurrenceDaysEnum.THURSDAY]: 'Th',
  [DaypartingRecurrenceDaysEnum.FRIDAY]: 'F',
  [DaypartingRecurrenceDaysEnum.SATURDAY]: 'Sa',
  [DaypartingRecurrenceDaysEnum.SUNDAY]: 'Su',
};
