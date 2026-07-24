import { IDateRange } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { range } from 'src/constants/advertising-filter.constants';
import { customRangeFilterOption } from 'src/constants';
import { IRootState } from 'src/redux/store';

export interface ILogHeaderFilterForm {
  range: IDropdownItem<string>;
  customDateRange: IDateRange;
}

export interface ILogHeaderFilterOptions {
  range: IDropdownItem<string>[];
}

export interface ILogFilterState {
  logHeaderFilters: ILogHeaderFilterForm;
  logHeaderFilterOptions: ILogHeaderFilterOptions;
}

const initialState: ILogFilterState = {
  logHeaderFilters: {
    range: range[0],
    customDateRange: {
      startDate: '',
      endDate: '',
    },
  },
  logHeaderFilterOptions: {
    range: [...range, customRangeFilterOption],
  },
};

export const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    resetLogFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setLogsHeaderFilters: (
      state,
      action: PayloadAction<ILogHeaderFilterForm>
    ) => {
      state.logHeaderFilters = { ...action.payload };
    },

    setCatalogHeaderFiltersRange: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      state.logHeaderFilters.range = action.payload;
    },

    setLogsHeaderFiltersCustomRange: (
      state,
      action: PayloadAction<IDateRange>
    ) => {
      state.logHeaderFilters.customDateRange = action.payload;
    },

    setLogsHeaderRangeOptions: (
      state,
      action: PayloadAction<IDropdownItem<string>[]>
    ) => {
      state.logHeaderFilterOptions.range = action.payload;
    },
  },
});

export const {
  resetLogFilterStates,
  setLogsHeaderFilters,
  setCatalogHeaderFiltersRange,
  setLogsHeaderFiltersCustomRange,
  setLogsHeaderRangeOptions,
} = logsSlice.actions;

export const selectLogsHeaderFilters = (state: IRootState) => {
  return state.logs.logHeaderFilters;
};
export const selectLogsHeaderFilterOptions = (state: IRootState) => {
  return state.logs.logHeaderFilterOptions;
};

const logsReducer = logsSlice.reducer;
export default logsReducer;
