import { IPerformanceMetricsPayload } from '@/interfaces/advertising/walmart/walmart-advertising.interface';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { walmartAdvertisingVideoMetricsOptions } from 'src/constants/advertising-walmart.constants';
import { IRootState } from 'src/redux/store';
import {
  getPerformanceMetricsUpdatedOptions,
  updatePerformanceMetricsOptions,
} from 'src/utils/advertising.utils';
import {
  IPerformanceMetricsFilters,
  IPerformanceMetricsOptions,
  TPerformanceMetricsKey,
} from '../advertising-filter.slice';

interface IWalmartAdvertisingOverallFilterState {
  overallWalmartPerformanceMetricsOptions: IPerformanceMetricsOptions;
  overallWalmartPerformanceMetrics: IPerformanceMetricsFilters;
}

const initialState: IWalmartAdvertisingOverallFilterState = {
  overallWalmartPerformanceMetricsOptions: {
    metrics1: walmartAdvertisingVideoMetricsOptions,
    metrics2: walmartAdvertisingVideoMetricsOptions,
    metrics3: walmartAdvertisingVideoMetricsOptions,
    metrics4: walmartAdvertisingVideoMetricsOptions,
  },
  overallWalmartPerformanceMetrics: {
    metrics1: walmartAdvertisingVideoMetricsOptions[4],
    metrics2: walmartAdvertisingVideoMetricsOptions[5],
    metrics3: walmartAdvertisingVideoMetricsOptions[7],
    metrics4: walmartAdvertisingVideoMetricsOptions[10],
  },
};

export const walmartOverallAdvertisingFilterSlice = createSlice({
  name: 'walmartOverallAdvertisingFilter',
  initialState,
  reducers: {
    resetWalmartOverallAdvertisingFilterStates: (
      state,
      action: PayloadAction
    ) => {
      Object.assign(state, initialState);
    },
    setWalmartOverallPerformanceMetrics: (
      state,
      action: PayloadAction<{
        value: IDropdownItem<string>;
        key: TPerformanceMetricsKey;
      }>
    ) => {
      const prevVal =
        state.overallWalmartPerformanceMetrics[action.payload.key];
      const newVal = action.payload.value;
      state.overallWalmartPerformanceMetrics[action.payload.key] = newVal;
      const selectedMetrics: string[] = Object.values(
        state.overallWalmartPerformanceMetrics
      ).map((item) => item.value);

      state.overallWalmartPerformanceMetricsOptions.metrics1 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.overallWalmartPerformanceMetricsOptions.metrics1,
          selectedMetrics[0],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[3]]
        );
      state.overallWalmartPerformanceMetricsOptions.metrics2 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.overallWalmartPerformanceMetricsOptions.metrics2,
          selectedMetrics[1],
          [selectedMetrics[0], selectedMetrics[2], selectedMetrics[3]]
        );
      state.overallWalmartPerformanceMetricsOptions.metrics3 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.overallWalmartPerformanceMetricsOptions.metrics3,
          selectedMetrics[2],
          [selectedMetrics[1], selectedMetrics[0], selectedMetrics[3]]
        );
      state.overallWalmartPerformanceMetricsOptions.metrics4 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.overallWalmartPerformanceMetricsOptions.metrics4,
          selectedMetrics[3],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[0]]
        );
    },
    removeFromWmtOverallPerformanceMetricsOption: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      const optionToRemove = action.payload;
      state.overallWalmartPerformanceMetricsOptions = {
        metrics1: state.overallWalmartPerformanceMetricsOptions.metrics1.filter(
          (option) => option.value !== optionToRemove.value
        ),
        metrics2: state.overallWalmartPerformanceMetricsOptions.metrics2.filter(
          (option) => option.value !== optionToRemove.value
        ),
        metrics3: state.overallWalmartPerformanceMetricsOptions.metrics3.filter(
          (option) => option.value !== optionToRemove.value
        ),
        metrics4: state.overallWalmartPerformanceMetricsOptions.metrics4.filter(
          (option) => option.value !== optionToRemove.value
        ),
      };
    },
    setWalmartOverallPerformanceMetricsOptions: (
      state,
      action: PayloadAction<IPerformanceMetricsPayload>
    ) => {
      const { payload } = action.payload;

      state.overallWalmartPerformanceMetricsOptions = {
        metrics1: updatePerformanceMetricsOptions(
          state.overallWalmartPerformanceMetricsOptions.metrics1,
          payload
        ),
        metrics2: updatePerformanceMetricsOptions(
          state.overallWalmartPerformanceMetricsOptions.metrics2,
          payload
        ),
        metrics3: updatePerformanceMetricsOptions(
          state.overallWalmartPerformanceMetricsOptions.metrics3,
          payload
        ),
        metrics4: updatePerformanceMetricsOptions(
          state.overallWalmartPerformanceMetricsOptions.metrics4,
          payload
        ),
      };
    },
  },
});

export const {
  resetWalmartOverallAdvertisingFilterStates,
  setWalmartOverallPerformanceMetrics,
  setWalmartOverallPerformanceMetricsOptions,
  removeFromWmtOverallPerformanceMetricsOption,
} = walmartOverallAdvertisingFilterSlice.actions;

export const selectWalmartOverallPerformanceMetrics = (state: IRootState) =>
  state.walmartOverallAdvertisingFilter.overallWalmartPerformanceMetrics;
export const selectWalmartOverallPerformanceMetricsOptions = (
  state: IRootState
) =>
  state.walmartOverallAdvertisingFilter.overallWalmartPerformanceMetricsOptions;

const walmartOverallAdvertisingFilterReducer =
  walmartOverallAdvertisingFilterSlice.reducer;
export default walmartOverallAdvertisingFilterReducer;
