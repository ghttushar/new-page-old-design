import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { advertisingMetricsOptions } from 'src/constants/advertising-filter.constants';
import { getPerformanceMetricsUpdatedOptions } from 'src/utils/advertising.utils';
import { IRootState } from '../../store';
import {
  IPerformanceMetricsFilters,
  IPerformanceMetricsOptions,
  TPerformanceMetricsKey,
} from './advertising-filter.slice';

export interface ISDAdvertisingFilterState {
  sdPerformanceMetricsOptions: IPerformanceMetricsOptions;
  sdPerformanceMetrics: IPerformanceMetricsFilters;
}

const initialState: ISDAdvertisingFilterState = {
  sdPerformanceMetricsOptions: {
    metrics1: advertisingMetricsOptions,
    metrics2: advertisingMetricsOptions,
    metrics3: advertisingMetricsOptions,
    metrics4: advertisingMetricsOptions,
  },
  sdPerformanceMetrics: {
    metrics1: advertisingMetricsOptions[4],
    metrics2: advertisingMetricsOptions[5],
    metrics3: advertisingMetricsOptions[7],
    metrics4: advertisingMetricsOptions[9],
  },
};

export const advertisingSDFilterSlice = createSlice({
  name: 'advertisingSDFilter',
  initialState,
  reducers: {
    resetAdvertisingSDFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setSDPerformanceMetrics: (
      state,
      action: PayloadAction<{
        value: IDropdownItem<string>;
        key: TPerformanceMetricsKey;
      }>
    ) => {
      const prevVal = state.sdPerformanceMetrics[action.payload.key];
      const newVal = action.payload.value;
      state.sdPerformanceMetrics[action.payload.key] = newVal;
      const selectedMetrics: string[] = Object.values(
        state.sdPerformanceMetrics
      ).map((item) => item.value);

      state.sdPerformanceMetricsOptions.metrics1 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.sdPerformanceMetricsOptions.metrics1,
          selectedMetrics[0],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[3]]
        );
      state.sdPerformanceMetricsOptions.metrics2 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.sdPerformanceMetricsOptions.metrics2,
          selectedMetrics[1],
          [selectedMetrics[0], selectedMetrics[2], selectedMetrics[3]]
        );
      state.sdPerformanceMetricsOptions.metrics3 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.sdPerformanceMetricsOptions.metrics3,
          selectedMetrics[2],
          [selectedMetrics[1], selectedMetrics[0], selectedMetrics[3]]
        );
      state.sdPerformanceMetricsOptions.metrics4 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.sdPerformanceMetricsOptions.metrics4,
          selectedMetrics[3],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[0]]
        );
    },
  },
});

export const { resetAdvertisingSDFilterStates, setSDPerformanceMetrics } =
  advertisingSDFilterSlice.actions;

export const selectSDPerformanceMetrics = (state: IRootState) =>
  state.advertisingSDFilter.sdPerformanceMetrics;
export const selectSDPerformanceMetricsOptions = (state: IRootState) =>
  state.advertisingSDFilter.sdPerformanceMetricsOptions;

const advertisingSDFilterReducer = advertisingSDFilterSlice.reducer;
export default advertisingSDFilterReducer;
