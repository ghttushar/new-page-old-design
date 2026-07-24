import { SortingState } from '@tanstack/react-table';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  KeywordActionActionType,
  KeywordActionDateRange,
  KeywordActionKeywordTagEnum,
  KeywordActionMatchType,
  KeywordActionPriority,
} from 'src/enums/keyword-action.enums';
import { KEYWORD_ACTIONS_TOOLTIPS } from 'src/enums/tooltip-texts.enums';

export const ProductActionsMatchTypeMap: Map<string, string> = new Map()
  .set(KeywordActionMatchType.ASIN_SAME_AS, 'EXACT')
  .set(KeywordActionMatchType.ASIN_EXPANDED_FROM, 'EXPANDED')
  .set(KeywordActionMatchType.NEGATIVE_ASIN_SAME_AS, 'NEGATIVE-EXACT');

export const KeywordActionAdditionActionTypeOptions: IDropdownItem<KeywordActionActionType>[] =
  [
    {
      label: 'Auto to Manual',
      value: KeywordActionActionType.AUTO_TO_MANUAL,
      isDisabled: false,
    },
    {
      label: 'Manual to Manual',
      value: KeywordActionActionType.MANUAL_TO_MANUAL,
      isDisabled: false,
    },
  ];

export const KeywordActionNegationActionTypeOptions: IDropdownItem<KeywordActionActionType>[] =
  [
    {
      label: 'Auto to Auto',
      value: KeywordActionActionType.AUTO_TO_AUTO,
      isDisabled: false,
    },
    {
      label: 'Manual to Manual',
      value: KeywordActionActionType.MANUAL_TO_MANUAL,
      isDisabled: false,
    },
  ];

export const ProductActionAdditionActionTypeOptions: IDropdownItem<KeywordActionActionType>[] =
  [
    {
      label: 'Auto to Manual',
      value: KeywordActionActionType.AUTO_TO_PCT,
      isDisabled: false,
    },
    {
      label: 'Manual to Manual',
      value: KeywordActionActionType.PCT_TO_PCT,
      isDisabled: false,
    },
  ];

export const ProductNegationActionTypeOptions: IDropdownItem<KeywordActionActionType>[] =
  [
    {
      label: 'Auto to Auto',
      value: KeywordActionActionType.AUTO_TO_AUTO,
      isDisabled: false,
    },
    {
      label: 'Manual to Manual',
      value: KeywordActionActionType.PCT_TO_PCT,
      isDisabled: false,
    },
  ];

export const KeywordActionAdditionMatchTypeOptions: IDropdownItem<KeywordActionMatchType>[] =
  [
    {
      label: 'Broad',
      value: KeywordActionMatchType.BROAD,
      isDisabled: false,
    },
    {
      label: 'Exact',
      value: KeywordActionMatchType.EXACT,
      isDisabled: false,
    },
    {
      label: 'Phrase',
      value: KeywordActionMatchType.PHRASE,
      isDisabled: false,
    },
  ];

export const KeywordActionNegationMatchTypeOptions: IDropdownItem<KeywordActionMatchType>[] =
  [
    {
      label: 'Negative Exact',
      value: KeywordActionMatchType.NEGATIVE_EXACT,
      isDisabled: false,
    },
    {
      label: 'Negative Phrase',
      value: KeywordActionMatchType.NEGATIVE_PHRASE,
      isDisabled: false,
    },
  ];

export const ProductActionAdditionMatchTypeOptions: IDropdownItem<KeywordActionMatchType>[] =
  [
    {
      label: 'Exact',
      value: KeywordActionMatchType.ASIN_SAME_AS,
      isDisabled: false,
    },
    {
      label: 'Expanded',
      value: KeywordActionMatchType.ASIN_EXPANDED_FROM,
      isDisabled: false,
    },
  ];
export const ProductNegationMatchTypeOptions: IDropdownItem<KeywordActionMatchType>[] =
  [
    {
      label: 'Negative Exact',
      value: KeywordActionMatchType.NEGATIVE_ASIN_SAME_AS,
      isDisabled: false,
    },
  ];

export const TargetingActionDateRangeOptions: IDropdownItem<KeywordActionDateRange>[] =
  [
    {
      label: 'Last 3 days',
      value: KeywordActionDateRange.LAST_3_DAYS,
    },
    {
      label: 'Last 7 days',
      value: KeywordActionDateRange.LAST_7_DAYS,
    },
    {
      label: 'Last 14 days',
      value: KeywordActionDateRange.LAST_14_DAYS,
    },
    {
      label: 'Last 30 days',
      value: KeywordActionDateRange.LAST_30_DAYS,
    },
    {
      label: 'Last 60 days',
      value: KeywordActionDateRange.LAST_60_DAYS,
    },
  ];

export const TargetingActionPriorityOptions: IDropdownItem<KeywordActionPriority>[] =
  [
    {
      label: 'High Priority',
      value: KeywordActionPriority.HIGH,
      isDisabled: false,
      tooltipText: KEYWORD_ACTIONS_TOOLTIPS.HIGH_PRIORITY,
    },
    {
      label: 'Medium Priority',
      value: KeywordActionPriority.MEDIUM,
      isDisabled: false,
      tooltipText: KEYWORD_ACTIONS_TOOLTIPS.MEDIUM_PRIORITY,
    },
    {
      label: 'Low Priority',
      value: KeywordActionPriority.LOW,
      isDisabled: false,
      tooltipText: KEYWORD_ACTIONS_TOOLTIPS.LOW_PRIORITY,
    },
  ];

interface IKeywordActionTableFilterOption {
  label: string;
  labelValue: string;
  arithmeticSymbol: string;
  filterValue: number;
}
export const KeywordActionTableFilterOptions: IKeywordActionTableFilterOption[] =
  [
    {
      label: 'Units Sold',
      labelValue: 'unitsSold',
      arithmeticSymbol: '>=',
      filterValue: 2,
    },
    {
      label: 'ACOS',
      labelValue: 'acos',
      arithmeticSymbol: '=<',
      filterValue: 50,
    },
  ];

export const KeywordActionNegationTableFilterOptions: IKeywordActionTableFilterOption[] =
  [
    {
      label: 'Ad Spend',
      labelValue: 'adSpend',
      arithmeticSymbol: '>=',
      filterValue: 30,
    },
    {
      label: 'Clicks',
      labelValue: 'clicks',
      arithmeticSymbol: '>=',
      filterValue: 30,
    },
    {
      label: 'Ad Sales',
      labelValue: 'adSales',
      arithmeticSymbol: '=',
      filterValue: 0,
    },
  ];

export const SELECTED_COLUMNS = 'selectedColumns';

export const WALMART_MIN_BID = 0.3;
export const WALMART_MAX_BID = 3;

export const DEFAULT_KEYWORD_ACTION_SORT_CRITERIA: SortingState = [
  {
    id: 'Created At',
    desc: true,
  },
];

export const KeywordActionTaggingOptions: IDropdownItem<KeywordActionKeywordTagEnum>[] =
  [
    {
      label: 'Generic',
      value: KeywordActionKeywordTagEnum.GENERIC,
    },
    {
      label: 'Branded',
      value: KeywordActionKeywordTagEnum.BRANDED,
    },
    {
      label: 'Competitor',
      value: KeywordActionKeywordTagEnum.COMPETITOR,
    },
  ];

export const ProductActionTaggingOptions: IDropdownItem<KeywordActionKeywordTagEnum>[] =
  [
    {
      label: 'Branded',
      value: KeywordActionKeywordTagEnum.BRANDED,
    },
    {
      label: 'Competitor',
      value: KeywordActionKeywordTagEnum.COMPETITOR,
    },
  ];
