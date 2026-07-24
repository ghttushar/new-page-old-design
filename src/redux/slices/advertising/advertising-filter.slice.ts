import { UPDATED_PAGINATION_MODEL } from '@/constants';
import { MarketplaceEnum, Range } from '@/enums/serp.enums';
import {
  IAdGroup,
  IAdvertisingNavigationBarOption,
  ICampaign,
  IDateRange,
  IKeywordTargeting,
  IProductAds,
  IProductTargeting,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  advertisingMetricsOptions,
  DEFAULT_ADVERTISING_SORT_CRITERIA,
  frequency,
  noneAdTypeOption,
  overallAccountPerformanceOptions,
  range,
  walmartOverallAccountPerformanceOptions,
} from 'src/constants/advertising-filter.constants';
import { customRangeFilterOption } from 'src/constants';
import {
  getAdTypeOptionsByMarketplace,
  getAdvertisingRangeOptionsByMarketplace,
  getPerformanceMetricsUpdatedOptions,
} from 'src/utils/advertising.utils';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import { IRootState } from '../../store';

const storedDateRange = localStorageUtils.getDateRangeFilter(
  range[2] as IDropdownItem<Range>
);

export type TPerformanceMetricsKey =
  | 'metrics1'
  | 'metrics2'
  | 'metrics3'
  | 'metrics4';

export interface IAdvertisingFilterForm {
  frequency: IDropdownItem<string>;
  range: IDropdownItem<string>;
  customDateRange: IDateRange;
}

export interface IPerformanceMetricsFilters {
  metrics1: IDropdownItem<string>;
  metrics2: IDropdownItem<string>;
  metrics3: IDropdownItem<string>;
  metrics4: IDropdownItem<string>;
}

export interface IAdvertisingFilterOptions {
  frequency: IDropdownItem<string>[];
  range: IDropdownItem<string>[];
}

export interface IPerformanceMetricsOptions {
  metrics1: IDropdownItem<string>[];
  metrics2: IDropdownItem<string>[];
  metrics3: IDropdownItem<string>[];
  metrics4: IDropdownItem<string>[];
}

export interface ITabData<T> {
  data:
    | ICampaign[]
    | IAdGroup[]
    | IKeywordTargeting[]
    | IProductAds[]
    | IProductTargeting[];
  selectedColumns: ColumnDef<T>[];
}

export interface IAdvertisingHeaderFilterForm {
  adType: IDropdownItem<string>;
}

export interface IAdvertisingHeaderFilterOptions {
  adType: IDropdownItem<string>[];
}

export interface IAdvertisingFilterState {
  filters: IAdvertisingFilterForm;
  appliedFilters: IAdvertisingFilterForm;
  options: IAdvertisingFilterOptions;
  performanceMetricsOptions: IPerformanceMetricsOptions;
  performanceMetrics: IPerformanceMetricsFilters;
  headerDropdownFilters: IAdvertisingHeaderFilterForm;
  headerDropdownOptions: IAdvertisingHeaderFilterOptions;
  isSPAccountLevel: boolean;
  selectedAdvertisingNavTitle: string;
  selectedAdvertisingNavTab: IAdvertisingNavigationBarOption;
  searchText: string;
  paginationModel: PaginationState;
  sortModel: SortingState;
}

export const initialAdvertisingFilters = {
  frequency: frequency[0],
  range:
    range.find((r) => r.value === storedDateRange.label) ??
    customRangeFilterOption,
  customDateRange: {
    startDate: storedDateRange.startDate ?? '',
    endDate: storedDateRange.endDate ?? '',
  },
};

const initialState: IAdvertisingFilterState = {
  filters: initialAdvertisingFilters,
  appliedFilters: initialAdvertisingFilters,
  options: {
    frequency: frequency,
    range: range,
  },
  performanceMetricsOptions: {
    metrics1: advertisingMetricsOptions,
    metrics2: advertisingMetricsOptions,
    metrics3: advertisingMetricsOptions,
    metrics4: advertisingMetricsOptions,
  },
  performanceMetrics: {
    metrics1: advertisingMetricsOptions[4],
    metrics2: advertisingMetricsOptions[5],
    metrics3: advertisingMetricsOptions[7],
    metrics4: advertisingMetricsOptions[9],
  },
  headerDropdownFilters: {
    adType: noneAdTypeOption,
  },
  headerDropdownOptions: {
    adType: getAdTypeOptionsByMarketplace(),
  },
  isSPAccountLevel: true,
  selectedAdvertisingNavTitle: '',
  selectedAdvertisingNavTab:
    localStorageUtils.getAdvertisingMarketplace() === MarketplaceEnum.AMAZON
      ? overallAccountPerformanceOptions[0]
      : walmartOverallAccountPerformanceOptions[0],
  searchText: '',
  paginationModel: UPDATED_PAGINATION_MODEL,
  sortModel: DEFAULT_ADVERTISING_SORT_CRITERIA,
};

export const advertisingFilterSlice = createSlice({
  name: 'advertisingFilter',
  initialState,
  reducers: {
    resetAdvertisingFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setAdvertisingHeaderFilters: (
      state,
      action: PayloadAction<IAdvertisingHeaderFilterForm>
    ) => {
      state.headerDropdownFilters = { ...action.payload };
    },

    resetAdvertisingHeaderOptions: (state) => {
      state.headerDropdownOptions = {
        adType: getAdTypeOptionsByMarketplace(),
      };
    },

    setAdvertisingFilters: (
      state,
      action: PayloadAction<IAdvertisingFilterForm>
    ) => {
      state.filters = { ...action.payload };
    },
    setAdvertisingAppliedFilters: (
      state,
      action: PayloadAction<IAdvertisingFilterForm>
    ) => {
      state.appliedFilters = action.payload;
    },
    resetAdvertisingFilters: (state, action: PayloadAction) => {
      state.filters = initialAdvertisingFilters;
      state.appliedFilters = initialAdvertisingFilters;
    },
    setAdvertisingRangeCustomOption: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      const data = getAdvertisingRangeOptionsByMarketplace();
      const _rangeOptions = JSON.parse(JSON.stringify(data));
      _rangeOptions.push(action.payload);
      state.options.range = _rangeOptions;
    },
    setAdvertisingRangeOptions: (
      state,
      action: PayloadAction<IDropdownItem<string>[]>
    ) => {
      state.options.range = action.payload;
    },
    setAdvertisingFrequencyOptions: (
      state,
      action: PayloadAction<IDropdownItem<string>[]>
    ) => {
      state.options.frequency = action.payload;
    },

    setSPPerformanceMetrics: (
      state,
      action: PayloadAction<{
        value: IDropdownItem<string>;
        key: TPerformanceMetricsKey;
      }>
    ) => {
      const prevVal = state.performanceMetrics[action.payload.key];
      const newVal = action.payload.value;
      state.performanceMetrics[action.payload.key] = newVal;
      const selectedMetrics: string[] = Object.values(
        state.performanceMetrics
      ).map((item) => item.value);

      state.performanceMetricsOptions.metrics1 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.performanceMetricsOptions.metrics1,
          selectedMetrics[0],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[3]]
        );
      state.performanceMetricsOptions.metrics2 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.performanceMetricsOptions.metrics2,
          selectedMetrics[1],
          [selectedMetrics[0], selectedMetrics[2], selectedMetrics[3]]
        );
      state.performanceMetricsOptions.metrics3 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.performanceMetricsOptions.metrics3,
          selectedMetrics[2],
          [selectedMetrics[1], selectedMetrics[0], selectedMetrics[3]]
        );
      state.performanceMetricsOptions.metrics4 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.performanceMetricsOptions.metrics4,
          selectedMetrics[3],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[0]]
        );
    },
    setSelectedAdvertisingNavTitle: (state, action: PayloadAction<string>) => {
      state.selectedAdvertisingNavTitle = action.payload;
    },
    setSelectedAdvertisingNavTab: (
      state,
      action: PayloadAction<IAdvertisingNavigationBarOption>
    ) => {
      state.selectedAdvertisingNavTab = action.payload;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setPaginationModel: (state, action: PayloadAction<PaginationState>) => {
      state.paginationModel = action.payload;
    },
    resetPaginationModel: (state) => {
      state.paginationModel = UPDATED_PAGINATION_MODEL;
    },

    setSortModel: (state, action: PayloadAction<SortingState>) => {
      state.sortModel = action.payload;
    },
  },
});

export const {
  resetAdvertisingFilterStates,
  setAdvertisingHeaderFilters,
  resetAdvertisingHeaderOptions,
  setAdvertisingFilters,
  setAdvertisingAppliedFilters,
  resetAdvertisingFilters,
  setAdvertisingRangeCustomOption,
  setAdvertisingRangeOptions,
  setAdvertisingFrequencyOptions,
  setSPPerformanceMetrics,
  setSelectedAdvertisingNavTitle,
  setSelectedAdvertisingNavTab,
  setSearchText,
  setPaginationModel,
  resetPaginationModel,
  setSortModel,
} = advertisingFilterSlice.actions;

export const selectAdvertisingHeaderFilters = (state: IRootState) => {
  return state.advertisingFilter.headerDropdownFilters;
};
export const selectAdvertisingHeaderFilterOptions = (state: IRootState) =>
  state.advertisingFilter.headerDropdownOptions;
export const selectAdvertisingFilter = (state: IRootState) =>
  state.advertisingFilter.filters;
export const selectAdvertisingAppliedFilter = (state: IRootState) =>
  state.advertisingFilter.appliedFilters;
export const selectAdvertisingOptions = (state: IRootState) =>
  state.advertisingFilter.options;
export const selectPerformanceMetrics = (state: IRootState) =>
  state.advertisingFilter.performanceMetrics;
export const selectPerformanceMetricsOptions = (state: IRootState) =>
  state.advertisingFilter.performanceMetricsOptions;
export const selectSelectedAdvertisingNavTitle = (state: IRootState) =>
  state.advertisingFilter.selectedAdvertisingNavTitle;
export const selectSelectedAdvertisingNavTab = (state: IRootState) =>
  state.advertisingFilter.selectedAdvertisingNavTab;
export const selectSearchText = (state: IRootState) =>
  state.advertisingFilter.searchText;
export const selectPaginationModel = (state: IRootState) =>
  state.advertisingFilter.paginationModel;
export const selectSortModel = (state: IRootState) =>
  state.advertisingFilter.sortModel;

const advertisingFilterReducer = advertisingFilterSlice.reducer;
export default advertisingFilterReducer;
