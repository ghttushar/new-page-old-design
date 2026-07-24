import { emptyDateRange } from '@/constants/profitability/profitability.constants';
import { Range } from '@/enums/serp.enums';
import { IAdvertisingNavigationBarOption } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IMultiSelectDropdownItem } from '@/interfaces/dropdown.interfaces';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { frequency, range } from 'src/constants/advertising-filter.constants';
import {
  analysisMetricsOptions,
  analysisPerformanceOptions,
} from 'src/constants/impact-analysis-filter.constants';
import {
  IDateRange,
  TImpactAnalysisDataList,
} from 'src/interfaces/analysis.interface';
import { IRootState } from '../../store';

export interface IAnalysisFilterForm {
  frequency: IDropdownItem<string>;
  range: IDropdownItem<string>;
  selectedAnalysisMetrics: IMultiSelectDropdownItem[];
  selectedMetric: IMultiSelectDropdownItem;
  customDateRange: IDateRange;
  impactRange: IDropdownItem<string>;
  impactCustomDateRange: IDateRange;
}

export interface IAnalysisFilterOptions {
  frequency: IDropdownItem<string>[];
  range: IDropdownItem<string>[];
}

export interface IAnalysisFilterState {
  isShowImpactOn: boolean;
  filters: IAnalysisFilterForm;
  options: IAnalysisFilterOptions;
  impactAnalysisData: {
    data: TImpactAnalysisDataList | null;
    table: string;
  } | null;
  selectedAnalysisNavTitle: string;
  selectedAnalysisNavTab: IAdvertisingNavigationBarOption;
}

const initialFilters: IAnalysisFilterForm = {
  frequency: frequency[0],
  range: range[3],
  customDateRange: {
    startDate: '',
    endDate: '',
  },
  selectedAnalysisMetrics: analysisMetricsOptions,
  selectedMetric: analysisMetricsOptions[0],
  impactCustomDateRange: emptyDateRange,
  impactRange: range[2],
};

const initialState: IAnalysisFilterState = {
  isShowImpactOn: false,
  filters: initialFilters,
  options: {
    frequency: frequency,
    range: range,
  },
  impactAnalysisData: null,
  selectedAnalysisNavTitle: '',
  selectedAnalysisNavTab: analysisPerformanceOptions[0],
};

export const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    resetAnalysis: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    resetAnalysisFilters: (state, action: PayloadAction) => {
      state.filters = initialFilters;
    },
    setIsShowImpactOn: (state, action: PayloadAction<boolean>) => {
      state.isShowImpactOn = action.payload;
    },
    setAnalysisFilters: (state, action: PayloadAction<IAnalysisFilterForm>) => {
      state.filters = { ...action.payload };
    },
    setAnalysisRangeOption: (
      state,
      action: PayloadAction<IDropdownItem<Range>>
    ) => {
      const _rangeOptions = JSON.parse(JSON.stringify(range));
      _rangeOptions.push(action.payload);
      state.options.range = _rangeOptions;
    },
    setImpactAnalysisData: (
      state,
      action: PayloadAction<{
        data: TImpactAnalysisDataList | null;
        table: string;
      } | null>
    ) => {
      state.impactAnalysisData = action.payload;
    },
    setSelectedAnalysisMetrics: (
      state,
      action: PayloadAction<IMultiSelectDropdownItem[]>
    ) => {
      state.filters.selectedAnalysisMetrics = action.payload;
    },
    setSelectedMetric: (
      state,
      action: PayloadAction<IMultiSelectDropdownItem>
    ) => {
      state.filters.selectedMetric = action.payload;
    },
    setSelectedAnalysisNavTitle: (state, action: PayloadAction<string>) => {
      state.selectedAnalysisNavTitle = action.payload;
    },
    setSelectedAnalysisNavTab: (
      state,
      action: PayloadAction<IAdvertisingNavigationBarOption>
    ) => {
      state.selectedAnalysisNavTab = action.payload;
    },
  },
});

export const {
  resetAnalysis,
  setAnalysisFilters,
  setAnalysisRangeOption,
  setIsShowImpactOn,
  setImpactAnalysisData,
  setSelectedAnalysisMetrics,
  setSelectedAnalysisNavTitle,
  setSelectedAnalysisNavTab,
  resetAnalysisFilters,
  setSelectedMetric,
} = analysisSlice.actions;

export const selectAnalysisFilter = (state: IRootState) =>
  state.analysis.filters;
export const selectAnalysisOptions = (state: IRootState) =>
  state.analysis.options;
export const selectIsShowImpactOn = (state: IRootState) =>
  state.analysis.isShowImpactOn;
export const selectImpactAnalysisData = (state: IRootState) =>
  state.analysis.impactAnalysisData;
export const selectAnalysisMetricsFilter = (state: IRootState) =>
  state.analysis.filters.selectedAnalysisMetrics;
export const selectSelectedAnalysisMetric = (state: IRootState) =>
  state.analysis.filters.selectedMetric;
export const selectSelectedAnalysisNavTitle = (state: IRootState) =>
  state.analysis.selectedAnalysisNavTitle;
export const selectSelectedAnalysisNavTab = (state: IRootState) =>
  state.analysis.selectedAnalysisNavTab;

const analysisReducer = analysisSlice.reducer;
export default analysisReducer;
