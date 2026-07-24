import { Range } from '@/enums/serp.enums';
import { TimezoneEnum } from '@/enums/timezone.enums';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { ITabData } from 'src/app/components/common/tabs-select/tabs-select';
import {
  AMCAccessTypes,
  AMCCampaignGroupTypes,
  AMCCampaignTypes,
  AMCExecutionCategory,
  AMCExecutionDays,
  AMCExecutionTime,
  AMCQueryExecutionType,
  AMCScheduleFrequency,
} from 'src/enums/amc.enums';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';

export const queriesTabOptions: ITabData[] = [
  {
    value: AMCAccessTypes.DEFAULT,
    label: 'Default Queries',
  },
  {
    value: AMCAccessTypes.CUSTOM,
    label: 'Custom Queries',
  },
];

export const audienceTabOptions: ITabData[] = [
  {
    value: AMCAccessTypes.DEFAULT,
    label: 'Default Audience',
  },
  {
    value: AMCAccessTypes.CUSTOM,
    label: 'Custom Audience',
  },
];

export const amcTagsFilterOptions: IMultiSelectDropdownItem[] = [
  {
    label: 'Sponsored Products (SP)',
    value: AMCCampaignTypes.SP,
    isDisabled: false,
    selected: false,
  },
  {
    label: 'Sponsored Brands(SB)',
    value: AMCCampaignTypes.SB,
    isDisabled: false,
    selected: false,
  },
  {
    label: 'Sponsored Display (SD)',
    value: AMCCampaignTypes.SD,
    isDisabled: false,
    selected: false,
  },
  {
    label: 'Demand Side Platform (DSP)',
    value: AMCCampaignTypes.DSP,
    isDisabled: false,
    selected: false,
  },
];

export const amcScheduleFrequency: IDropdownItem<AMCScheduleFrequency>[] = [
  {
    value: AMCScheduleFrequency.DAILY,
    label: 'Daily',
  },
  {
    value: AMCScheduleFrequency.WEEKLY,
    label: 'Weekly',
  },
];

export const amcRange: IDropdownItem<Range>[] = [
  {
    value: Range.TODAY,
    label: 'Today',
  },
  {
    value: Range.YESTERDAY,
    label: 'Yesterday',
  },
  {
    value: Range.LAST_7_DAYS,
    label: 'Last 7 days',
  },
  {
    value: Range.LAST_14_DAYS,
    label: 'Last 14 days',
  },
  {
    value: Range.LAST_30_DAYS,
    label: 'Last 30 days',
  },
  {
    value: Range.THIS_MONTH,
    label: 'This month',
  },
  {
    value: Range.LAST_MONTH,
    label: 'Last month',
  },
  {
    value: Range.LAST_3_MONTHS,
    label: 'Last 3 months',
  },
  {
    value: Range.THIS_YEAR,
    label: 'This year',
  },
  {
    value: Range.LAST_YEAR,
    label: 'Last year',
  },
];

export const amcTimezones: IDropdownItem<string>[] = [
  {
    value: TimezoneEnum.US_PACIFIC,
    label: 'PST',
  },
];

export const amcCampaignTypes: IDropdownItem<string>[] = [
  {
    value: AMCCampaignTypes.SP,
    label: 'SP',
  },
  {
    value: AMCCampaignTypes.SB,
    label: 'SB',
  },
  {
    value: AMCCampaignTypes.SD,
    label: 'SD',
  },
  {
    value: AMCCampaignTypes.DSP,
    label: 'DSP',
  },
];

export const spGroups: IDropdownItem<string>[] = [
  {
    value: AMCCampaignGroupTypes.SP,
    label: 'SP',
  },
];

export const sbGroups: IDropdownItem<string>[] = [
  {
    value: AMCCampaignGroupTypes.SB,
    label: 'SB',
  },
];

export const sdGroups: IDropdownItem<string>[] = [
  {
    value: AMCCampaignGroupTypes.SD,
    label: 'SD',
  },
];

export const dspGroups: IDropdownItem<string>[] = [
  {
    value: AMCCampaignGroupTypes.DSP,
    label: 'DSP',
  },
  {
    value: AMCCampaignGroupTypes.OLV,
    label: 'OLV',
  },
  {
    value: AMCCampaignGroupTypes.STV,
    label: 'STV',
  },
];

export const queryExecutionTypes: IDropdownItem<string>[] = [
  {
    value: AMCQueryExecutionType.ONCE,
    label: 'Once',
    isDisabled: false,
  },
  {
    value: AMCQueryExecutionType.SCHEDULE,
    label: 'Schedule',
    isDisabled: false,
  },
];

export const executionDaysOptions: IDropdownItem<AMCExecutionDays>[] = [
  {
    value: AMCExecutionDays.SUNDAY,
    label: 'Sunday',
    isDisabled: false,
  },
  {
    value: AMCExecutionDays.MONDAY,
    label: 'Monday',
    isDisabled: false,
  },
  {
    value: AMCExecutionDays.TUESDAY,
    label: 'Tuesday',
    isDisabled: false,
  },
  {
    value: AMCExecutionDays.WEDNESDAY,
    label: 'Wednesday',
    isDisabled: false,
  },
  {
    value: AMCExecutionDays.THURSDAY,
    label: 'Thursday',
    isDisabled: false,
  },
  {
    value: AMCExecutionDays.FRIDAY,
    label: 'Friday',
    isDisabled: false,
  },
  {
    value: AMCExecutionDays.SATURDAY,
    label: 'Saturday',
    isDisabled: false,
  },
];

export const executionTimeOptions: IDropdownItem<AMCExecutionTime>[] = [
  {
    value: AMCExecutionTime.HOUR_0,
    label: '00:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_1,
    label: '01:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_2,
    label: '02:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_3,
    label: '03:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_4,
    label: '04:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_5,
    label: '05:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_6,
    label: '06:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_7,
    label: '07:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_8,
    label: '08:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_9,
    label: '09:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_10,
    label: '10:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_11,
    label: '11:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_12,
    label: '12:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_13,
    label: '13:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_14,
    label: '14:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_15,
    label: '15:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_16,
    label: '16:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_17,
    label: '17:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_18,
    label: '18:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_19,
    label: '19:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_20,
    label: '20:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_21,
    label: '21:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_22,
    label: '22:00',
    isDisabled: false,
  },
  {
    value: AMCExecutionTime.HOUR_23,
    label: '23:00',
    isDisabled: false,
  },
];

export const CUSTOM_REQUEST_IMAGE =
  'https://anarix.s3.amazonaws.com/images/amc/amc-query-placeholder.svg';

export const audienceAutoAdjustDates: IDropdownItem<boolean>[] = [
  {
    value: true,
    label: 'Yes',
    isDisabled: false,
  },
  {
    value: false,
    label: 'No',
    isDisabled: false,
  },
];

export const ptcIdentifier = 'anarix_path_to_conversion';

export const executionCategoryOptions: IDropdownItem<AMCExecutionCategory>[] = [
  {
    value: AMCExecutionCategory.AD_HOC,
    label: 'Ad Hoc',
    tooltipText: 'Ad Hoc',
  },
  {
    value: AMCExecutionCategory.SCHEDULED,
    label: 'Scheduled',
    tooltipText: 'Scheduled',
  },
];

export const AMCExecutionCategoryValue = {
  AD_HOC: 'AD_HOC',
  SCHEDULED: 'SCHEDULED',
};
