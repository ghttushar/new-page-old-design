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

interface IWalmartAdvertisingSVFilterState {
  svWalmartPerformanceMetricsOptions: IPerformanceMetricsOptions;
  svWalmartPerformanceMetrics: IPerformanceMetricsFilters;
}

const initialState: IWalmartAdvertisingSVFilterState = {
  svWalmartPerformanceMetricsOptions: {
    metrics1: walmartAdvertisingVideoMetricsOptions,
    metrics2: walmartAdvertisingVideoMetricsOptions,
    metrics3: walmartAdvertisingVideoMetricsOptions,
    metrics4: walmartAdvertisingVideoMetricsOptions,
  },
  svWalmartPerformanceMetrics: {
    metrics1: walmartAdvertisingVideoMetricsOptions[4],
    metrics2: walmartAdvertisingVideoMetricsOptions[5],
    metrics3: walmartAdvertisingVideoMetricsOptions[7],
    metrics4: walmartAdvertisingVideoMetricsOptions[10],
  },
};

export const walmartSVAdvertisingFilterSlice = createSlice({
  name: 'walmartSVAdvertisingFilter',
  initialState,
  reducers: {
    resetWalmartSVAdvertisingFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setWalmartSVPerformanceMetrics: (
      state,
      action: PayloadAction<{
        value: IDropdownItem<string>;
        key: TPerformanceMetricsKey;
      }>
    ) => {
      const prevVal = state.svWalmartPerformanceMetrics[action.payload.key];
      const newVal = action.payload.value;
      state.svWalmartPerformanceMetrics[action.payload.key] = newVal;
      const selectedMetrics: string[] = Object.values(
        state.svWalmartPerformanceMetrics
      ).map((item) => item.value);

      state.svWalmartPerformanceMetricsOptions.metrics1 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.svWalmartPerformanceMetricsOptions.metrics1,
          selectedMetrics[0],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[3]]
        );
      state.svWalmartPerformanceMetricsOptions.metrics2 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.svWalmartPerformanceMetricsOptions.metrics2,
          selectedMetrics[1],
          [selectedMetrics[0], selectedMetrics[2], selectedMetrics[3]]
        );
      state.svWalmartPerformanceMetricsOptions.metrics3 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.svWalmartPerformanceMetricsOptions.metrics3,
          selectedMetrics[2],
          [selectedMetrics[1], selectedMetrics[0], selectedMetrics[3]]
        );
      state.svWalmartPerformanceMetricsOptions.metrics4 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.svWalmartPerformanceMetricsOptions.metrics4,
          selectedMetrics[3],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[0]]
        );
    },
    setWalmartSVPerformanceMetricsOptions: (
      state,
      action: PayloadAction<IPerformanceMetricsPayload>
    ) => {
      if (action.payload) {
        const { payload } = action.payload;

        state.svWalmartPerformanceMetricsOptions = {
          metrics1: updatePerformanceMetricsOptions(
            state.svWalmartPerformanceMetricsOptions.metrics1,
            payload
          ),
          metrics2: updatePerformanceMetricsOptions(
            state.svWalmartPerformanceMetricsOptions.metrics2,
            payload
          ),
          metrics3: updatePerformanceMetricsOptions(
            state.svWalmartPerformanceMetricsOptions.metrics3,
            payload
          ),
          metrics4: updatePerformanceMetricsOptions(
            state.svWalmartPerformanceMetricsOptions.metrics4,
            payload
          ),
        };
      }
    },
  },
});

export const {
  resetWalmartSVAdvertisingFilterStates,
  setWalmartSVPerformanceMetrics,
  setWalmartSVPerformanceMetricsOptions,
} = walmartSVAdvertisingFilterSlice.actions;

export const selectWalmartSvPerformanceMetrics = (state: IRootState) =>
  state.walmartSVAdvertisingFilter.svWalmartPerformanceMetrics;
export const selectWalmartSvPerformanceMetricsOptions = (state: IRootState) =>
  state.walmartSVAdvertisingFilter.svWalmartPerformanceMetricsOptions;

const walmartSVAdvertisingFilterReducer =
  walmartSVAdvertisingFilterSlice.reducer;
export default walmartSVAdvertisingFilterReducer;
