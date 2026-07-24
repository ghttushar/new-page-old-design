import { IDateRange } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { range } from 'src/constants/advertising-filter.constants';
import { IRootState } from 'src/redux/store';

export interface IMonitoringHeaderFilterForm {
  range: IDropdownItem<string>;
  customDateRange: IDateRange;
}

export interface IMonitoringState {
  monitoringHeaderFilters: IMonitoringHeaderFilterForm;
}

const initialState: IMonitoringState = {
  monitoringHeaderFilters: {
    range: range[0],
    customDateRange: {
      startDate: '',
      endDate: '',
    },
  },
};

export const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    resetMonitoringFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setMonitoringHeaderFilters: (
      state,
      action: PayloadAction<IMonitoringHeaderFilterForm>
    ) => {
      state.monitoringHeaderFilters = { ...action.payload };
    },
    setMonitoringHeaderFiltersRange: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      state.monitoringHeaderFilters.range = action.payload;
    },

    setMonitoringHeaderFiltersCustomRange: (
      state,
      action: PayloadAction<IDateRange>
    ) => {
      state.monitoringHeaderFilters.customDateRange = action.payload;
    },
  },
});

export const {
  resetMonitoringFilterStates,
  setMonitoringHeaderFilters,
  setMonitoringHeaderFiltersCustomRange,
  setMonitoringHeaderFiltersRange,
} = monitoringSlice.actions;

export const selectMonitoringHeaderFilters = (state: IRootState) => {
  return state.monitoring.monitoringHeaderFilters;
};

const monitoringReducer = monitoringSlice.reducer;
export default monitoringReducer;
