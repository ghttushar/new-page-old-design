import {
  Frequency,
  MarketplaceEnum,
  Positions,
  Range,
} from '@/enums/serp.enums';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  IMultiSelectCustomDropdownItem,
  IMultiSelectDropdownItem,
} from 'src/interfaces/dropdown.interfaces';
import { ISovFilterForm } from 'src/redux/slices/market-intelligence/sov-filter.slice';
import { ALL_LABEL, ALL_VALUE, SELECT_ALL } from '.';

export const OTHER_BRANDS_LABEL = 'other brands';

export const RangeOptions: IDropdownItem<Range>[] = [
  {
    label: 'Today',
    value: Range.TODAY,
  },
  {
    label: 'Yesterday',
    value: Range.YESTERDAY,
  },
  {
    label: 'Last 7 days',
    value: Range.LAST_7_DAYS,
  },
  {
    value: Range.LAST_14_DAYS,
    label: 'Last 14 days',
  },
  {
    label: 'Last 30 days',
    value: Range.LAST_30_DAYS,
  },
  {
    label: 'This month',
    value: Range.THIS_MONTH,
  },
  {
    label: 'Last month',
    value: Range.LAST_MONTH,
  },
  {
    label: 'Last 3 months',
    value: Range.LAST_3_MONTHS,
  },
  {
    label: 'This year',
    value: Range.THIS_YEAR,
  },
  {
    label: 'Last year',
    value: Range.LAST_YEAR,
  },
];
export const KeywordOptions: IDropdownItem<string>[] = [
  {
    label: ALL_LABEL,
    value: ALL_VALUE,
  },
];

export const MultiSelectOptions: IMultiSelectCustomDropdownItem[] = [
  {
    label: ALL_LABEL,
    value: ALL_VALUE,
    selected: false,
    isActive: false,
    isDayParting: false,
  },
];

export const MultiSelectCustomOptions: IMultiSelectCustomDropdownItem[] = [
  {
    label: SELECT_ALL,
    value: ALL_VALUE,
    selected: false,
    isActive: false,
    isDayParting: false,
  },
];

export const FrequencyOptions: IDropdownItem<Frequency>[] = [
  {
    label: 'Hourly',
    value: Frequency.HOURLY,
  },
  {
    label: 'Daily',
    value: Frequency.DAILY,
  },
  {
    label: 'Weekly',
    value: Frequency.WEEKLY,
  },
];

export const MIFrequencyOptions: IDropdownItem<Frequency>[] = [
  {
    label: 'Daily',
    value: Frequency.DAILY,
  },
  {
    label: 'Weekly',
    value: Frequency.WEEKLY,
  },
];

export const PositionOptionsAmazon: IDropdownItem<Positions>[] = [
  {
    label: 'All',
    value: Positions.ALL,
    isDisabled: false,
  },
  {
    label: 'Sponsored Top',
    value: Positions.SP_TOP,
    isDisabled: false,
  },
  {
    label: 'Sponsored Middle',
    value: Positions.SP_MIDDLE,
    isDisabled: false,
  },
  {
    label: 'Sponsored Bottom',
    value: Positions.SP_BOTTOM,
    isDisabled: false,
  },
];

export const PositionOptionsWalmart: IDropdownItem<Positions>[] = [
  {
    label: 'All',
    value: Positions.ALL,
    isDisabled: false,
  },
  {
    label: 'Sponsored Top',
    value: Positions.SP_TOP,
    isDisabled: true,
  },
  {
    label: 'Sponsored Middle',
    value: Positions.SP_MIDDLE,
    isDisabled: true,
  },
  {
    label: 'Sponsored Bottom',
    value: Positions.SP_BOTTOM,
    isDisabled: true,
  },
  {
    label: 'Sponsored Headline',
    value: Positions.SB_SPONSOR_HEADLINE,
    isDisabled: true,
  },
  {
    label: 'Sponsored Video',
    value: Positions.SB_VIDEO,
    isDisabled: true,
  },
];

export const marketplaceOptions: IMultiSelectDropdownItem[] = [
  {
    label: 'Amazon',
    value: MarketplaceEnum.AMAZON,
    isDisabled: false,
    selected: true,
  },
  {
    label: 'Walmart',
    value: MarketplaceEnum.WALMART,
    isDisabled: false,
    selected: false,
  },
];

export const settingsMarketplaceOptions: IMultiSelectDropdownItem[] = [
  {
    label: 'All',
    value: MarketplaceEnum.All,
    isDisabled: false,
    selected: true,
  },
  {
    label: 'Amazon',
    value: MarketplaceEnum.AMAZON,
    isDisabled: false,
    selected: false,
  },
  {
    label: 'Walmart',
    value: MarketplaceEnum.WALMART,
    isDisabled: false,
    selected: false,
  },
];

export const initialMarketIntelligenceFilters: ISovFilterForm = {
  keyword: KeywordOptions[0],
  position: PositionOptionsAmazon[0],
  range: RangeOptions[2],
  frequency: MIFrequencyOptions[0],
  customDateRange: {
    startDate: '',
    endDate: '',
  },
  brandName: {
    value: '',
    label: '',
  },
};
