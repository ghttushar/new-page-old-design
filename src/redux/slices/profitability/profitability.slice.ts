import {
  DateRangeOptions,
  emptyDateRange,
  ProfitabilityFrequency,
  profitabilityGraphMetricsOptions,
  profitabilityMetricsOptions,
} from '@/constants/profitability/profitability.constants';
import {
  ProfitabilityOrdersMetricsKeyEnums,
  ProfitabilityOrdersMetricsLabelEnums,
} from '@/enums/profitability.enums';
import { Frequency } from '@/enums/serp.enums';
import { IDateRange } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IMultiSelectDropdownItem,
  IMultiSelectProductSearchDropdownItem,
} from '@/interfaces/dropdown.interfaces';
import { IAmazonProfitabilityTableData } from '@/interfaces/profitability/amazon-profitability.interface';
import { IProfitabilityTableData } from '@/interfaces/profitability/profitability.interface';
import { formatDate } from '@/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { IRootState } from 'src/redux/store';

const getInitialMetricsState = (
  options: IMultiSelectDropdownItem[],
  startIndex: number,
  endIndex: number
): IMultiSelectDropdownItem[] => {
  return options.map((item, index) => {
    return {
      ...item,
      selected: index >= startIndex && index < endIndex,
    };
  });
};

export interface IProfitabilityFilterForm {
  frequency: IDropdownItem<Frequency>;
  graphFrequency: IDropdownItem<Frequency>;
  metrics: IMultiSelectDropdownItem[];
  customDateRange: IDateRange;
  customDateRanges: IDateRange[];
  range: IDropdownItem<string>;
  graphMetrics: IMultiSelectDropdownItem[];
  selectedProducts: IMultiSelectProductSearchDropdownItem[] | null;
}

export interface IProfitabilityFilterOptions {
  frequency: IDropdownItem<Frequency>[];
  graphFrequency: IDropdownItem<Frequency>[];
  range: IDropdownItem<string>[];
  metrics: IMultiSelectDropdownItem[];
  graphMetrics: IMultiSelectDropdownItem[];
}

export interface IProfitabilityFilterState {
  profitabilityFilters: IProfitabilityFilterForm;
  profitabilityFilterOptions: IProfitabilityFilterOptions;
  activePerformanceBox: number;
  isOrdersTable: boolean;
  selectedRowData:
    | IProfitabilityTableData
    | null
    | IAmazonProfitabilityTableData;
  selectRowIndex: string | null;
  selectedTrendsMetric: IDropdownItem<string>;
}

const initialState: IProfitabilityFilterState = {
  profitabilityFilters: {
    frequency: ProfitabilityFrequency[0],
    graphFrequency: ProfitabilityFrequency[0],
    metrics: getInitialMetricsState(profitabilityMetricsOptions, 0, 2),
    customDateRange: emptyDateRange,
    customDateRanges: DateRangeOptions[0].value
      .split('/')
      .map((r) => formatDate(r)),
    range: DateRangeOptions[0],
    graphMetrics: getInitialMetricsState(
      profitabilityGraphMetricsOptions,
      0,
      2
    ),
    selectedProducts: null,
  },
  profitabilityFilterOptions: {
    frequency: ProfitabilityFrequency,
    graphFrequency: ProfitabilityFrequency,
    range: DateRangeOptions,
    metrics: getInitialMetricsState(profitabilityMetricsOptions, 0, 2),
    graphMetrics: getInitialMetricsState(
      profitabilityGraphMetricsOptions,
      0,
      2
    ),
  },
  activePerformanceBox: 0,
  isOrdersTable: true,
  selectedRowData: null,
  selectRowIndex: null,
  selectedTrendsMetric: {
    label: ProfitabilityOrdersMetricsLabelEnums.TOTAL_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.TOTAL_SALES,
    selected: true,
    isDisabled: false,
  },
};

export const ProfitabilitySlice = createSlice({
  name: 'profitability',
  initialState,
  reducers: {
    resetProfitabilityFilterState: (state) => {
      Object.assign(state, initialState);
    },
    setProfitabilityFilterState: (
      state,
      action: PayloadAction<IProfitabilityFilterForm>
    ) => {
      state.profitabilityFilters = { ...action.payload };
    },

    setActivePerformanceBox: (state, action: PayloadAction<number>) => {
      state.activePerformanceBox = action.payload;
    },

    setProfitabilityMetricsOptions: (
      state,
      action: PayloadAction<IMultiSelectDropdownItem[]>
    ) => {
      const payload = getInitialMetricsState(action.payload, 0, 2);
      state.profitabilityFilterOptions.metrics = payload;
      state.profitabilityFilters.metrics = payload;
    },

    setProfitabilityMetricsFilters: (
      state,
      action: PayloadAction<IMultiSelectDropdownItem[]>
    ) => {
      state.profitabilityFilterOptions.metrics = action.payload;
      const selectedMetrics = action.payload.filter(
        (option) => option.selected
      );

      state.profitabilityFilters.metrics = selectedMetrics;
    },

    setProfitabilityGraphMetricsOptions: (
      state,
      action: PayloadAction<IMultiSelectDropdownItem[]>
    ) => {
      const payload = getInitialMetricsState(action.payload, 0, 2);
      state.profitabilityFilterOptions.graphMetrics = payload;
      state.profitabilityFilters.graphMetrics = payload;
    },

    setProfitabilityGraphMetricsFilters: (
      state,
      action: PayloadAction<IMultiSelectDropdownItem[]>
    ) => {
      state.profitabilityFilterOptions.graphMetrics = action.payload;
      const selectedMetrics = action.payload.filter(
        (option) => option.selected
      );

      state.profitabilityFilters.graphMetrics = selectedMetrics;
    },

    setProfitabilityFilterRange: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      state.profitabilityFilters.range = action.payload;
    },

    setProfitabilityFiltersCustomRange: (
      state,
      action: PayloadAction<IDateRange>
    ) => {
      state.profitabilityFilters.customDateRange = action.payload;
    },

    setIsOrdersTable: (state, action: PayloadAction<boolean>) => {
      state.isOrdersTable = action.payload;
    },

    setProfitabilityRangeOptions: (
      state,
      action: PayloadAction<IDropdownItem<string>[]>
    ) => {
      state.profitabilityFilterOptions.range = action.payload;
    },

    setSelectedRowData: (
      state,
      action: PayloadAction<{
        rowData: IProfitabilityTableData | IAmazonProfitabilityTableData | null;
        index: string | null;
      }>
    ) => {
      state.selectedRowData = action.payload.rowData;
      state.selectRowIndex = action.payload.index;
    },

    setSelectedTrendsMetric: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      state.selectedTrendsMetric = action.payload;
    },

    setCardCustomDateRange: (
      state,
      action: PayloadAction<{ cardIndex: number; dateRange: IDateRange }>
    ) => {
      const { cardIndex, dateRange } = action.payload;

      state.profitabilityFilters.customDateRanges[cardIndex] = dateRange;

      if (cardIndex === 0) {
        state.profitabilityFilters.customDateRange = dateRange;
      }
    },

    setCardRange: (
      state,
      action: PayloadAction<{ cardIndex: number; range: string }>
    ) => {
      const { cardIndex, range } = action.payload;

      const rangeParts = state.profitabilityFilters.range.value.split('/');
      rangeParts[cardIndex] = range;
      state.profitabilityFilters.range.value = rangeParts.join('/');
    },
    setSelectedProducts: (
      state,
      action: PayloadAction<IMultiSelectProductSearchDropdownItem[] | null>
    ) => {
      state.profitabilityFilters.selectedProducts = action.payload;
    },
    setProfitabilityFiltersFrequency: (
      state,
      action: PayloadAction<IDropdownItem<Frequency>>
    ) => {
      state.profitabilityFilters.frequency = action.payload;
    },
  },
});

export const {
  resetProfitabilityFilterState,
  setProfitabilityFilterState,
  setProfitabilityFilterRange,
  setProfitabilityFiltersCustomRange,
  setProfitabilityMetricsFilters,
  setActivePerformanceBox,
  setProfitabilityRangeOptions,
  setIsOrdersTable,
  setSelectedRowData,
  setSelectedTrendsMetric,
  setProfitabilityGraphMetricsFilters,
  setCardCustomDateRange,
  setCardRange,
  setProfitabilityMetricsOptions,
  setProfitabilityGraphMetricsOptions,
  setSelectedProducts,
  setProfitabilityFiltersFrequency,
} = ProfitabilitySlice.actions;

export const selectProfitabilityHeaderFilters = (state: IRootState) => {
  return state.profitability.profitabilityFilters;
};

export const selectActivePerformanceBox = (state: IRootState) => {
  return state.profitability.activePerformanceBox;
};
export const selectProfitabilityHeaderFilterOptions = (state: IRootState) => {
  return state.profitability.profitabilityFilterOptions;
};

export const selectIsOrdersTable = (state: IRootState) => {
  return state.profitability.isOrdersTable;
};

export const selectSelectedRowData = (state: IRootState) => {
  return state.profitability.selectedRowData;
};

export const selectSelectedRowIndex = (state: IRootState) => {
  return state.profitability.selectRowIndex;
};

export const selectSelectedTrendsMetric = (state: IRootState) => {
  return state.profitability.selectedTrendsMetric;
};

export const selectSelectedProducts = (state: IRootState) => {
  return state.profitability.profitabilityFilters.selectedProducts;
};

const profitabilityReducer = ProfitabilitySlice.reducer;
export default profitabilityReducer;
