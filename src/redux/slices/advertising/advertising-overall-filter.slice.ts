import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { overallAdvertisingMetricsOptions } from 'src/constants/advertising-filter.constants';
import { getPerformanceMetricsUpdatedOptions } from 'src/utils/advertising.utils';
import { IRootState } from '../../store';
import {
  IPerformanceMetricsFilters,
  IPerformanceMetricsOptions,
  TPerformanceMetricsKey,
} from './advertising-filter.slice';

export interface IAdvertisingFilterState {
  overallPerformanceMetricsOptions: IPerformanceMetricsOptions;
  overallPerformanceMetrics: IPerformanceMetricsFilters;
}

const initialState: IAdvertisingFilterState = {
  overallPerformanceMetricsOptions: {
    metrics1: overallAdvertisingMetricsOptions,
    metrics2: overallAdvertisingMetricsOptions,
    metrics3: overallAdvertisingMetricsOptions,
    metrics4: overallAdvertisingMetricsOptions,
  },
  overallPerformanceMetrics: {
    metrics1: overallAdvertisingMetricsOptions[4],
    metrics2: overallAdvertisingMetricsOptions[5],
    metrics3: overallAdvertisingMetricsOptions[7],
    metrics4: overallAdvertisingMetricsOptions[9],
  },
};

export const advertisingOverallFilterSlice = createSlice({
  name: 'advertisingOverallFilter',
  initialState,
  reducers: {
    resetAdvertisingOverallFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setOverallPerformanceMetrics: (
      state,
      action: PayloadAction<{
        value: IDropdownItem<string>;
        key: TPerformanceMetricsKey;
      }>
    ) => {
      const prevVal = state.overallPerformanceMetrics[action.payload.key];
      const newVal = action.payload.value;
      state.overallPerformanceMetrics[action.payload.key] = newVal;
      const selectedMetrics: string[] = Object.values(
        state.overallPerformanceMetrics
      ).map((item) => item.value);

      state.overallPerformanceMetricsOptions.metrics1 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.overallPerformanceMetricsOptions.metrics1,
          selectedMetrics[0],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[3]]
        );
      state.overallPerformanceMetricsOptions.metrics2 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.overallPerformanceMetricsOptions.metrics2,
          selectedMetrics[1],
          [selectedMetrics[0], selectedMetrics[2], selectedMetrics[3]]
        );
      state.overallPerformanceMetricsOptions.metrics3 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.overallPerformanceMetricsOptions.metrics3,
          selectedMetrics[2],
          [selectedMetrics[1], selectedMetrics[0], selectedMetrics[3]]
        );
      state.overallPerformanceMetricsOptions.metrics4 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.overallPerformanceMetricsOptions.metrics4,
          selectedMetrics[3],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[0]]
        );
    },
  },
});

export const {
  resetAdvertisingOverallFilterStates,
  setOverallPerformanceMetrics,
} = advertisingOverallFilterSlice.actions;

export const selectOverallPerformanceMetrics = (state: IRootState) =>
  state.advertisingOverallFilter.overallPerformanceMetrics;
export const selectOverallPerformanceMetricsOptions = (state: IRootState) =>
  state.advertisingOverallFilter.overallPerformanceMetricsOptions;

const advertisingOverallFilterReducer = advertisingOverallFilterSlice.reducer;
export default advertisingOverallFilterReducer;
