import { IPerformanceMetricsPayload } from '@/interfaces/advertising/walmart/walmart-advertising.interface';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { walmartAdvertisingMetricsOptions } from 'src/constants/advertising-walmart.constants';
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

interface IWalmartAdvertisingSBFilterState {
  sbWalmartPerformanceMetricsOptions: IPerformanceMetricsOptions;
  sbWalmartPerformanceMetrics: IPerformanceMetricsFilters;
}

const initialState: IWalmartAdvertisingSBFilterState = {
  sbWalmartPerformanceMetricsOptions: {
    metrics1: walmartAdvertisingMetricsOptions,
    metrics2: walmartAdvertisingMetricsOptions,
    metrics3: walmartAdvertisingMetricsOptions,
    metrics4: walmartAdvertisingMetricsOptions,
  },
  sbWalmartPerformanceMetrics: {
    metrics1: walmartAdvertisingMetricsOptions[4],
    metrics2: walmartAdvertisingMetricsOptions[5],
    metrics3: walmartAdvertisingMetricsOptions[7],
    metrics4: walmartAdvertisingMetricsOptions[10],
  },
};

export const walmartSBAdvertisingFilterSlice = createSlice({
  name: 'walmartSBAdvertisingFilter',
  initialState,
  reducers: {
    resetWalmartSBAdvertisingFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setWalmartSBPerformanceMetrics: (
      state,
      action: PayloadAction<{
        value: IDropdownItem<string>;
        key: TPerformanceMetricsKey;
      }>
    ) => {
      const prevVal = state.sbWalmartPerformanceMetrics[action.payload.key];
      const newVal = action.payload.value;
      state.sbWalmartPerformanceMetrics[action.payload.key] = newVal;
      const selectedMetrics: string[] = Object.values(
        state.sbWalmartPerformanceMetrics
      ).map((item) => item.value);

      state.sbWalmartPerformanceMetricsOptions.metrics1 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.sbWalmartPerformanceMetricsOptions.metrics1,
          selectedMetrics[0],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[3]]
        );
      state.sbWalmartPerformanceMetricsOptions.metrics2 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.sbWalmartPerformanceMetricsOptions.metrics2,
          selectedMetrics[1],
          [selectedMetrics[0], selectedMetrics[2], selectedMetrics[3]]
        );
      state.sbWalmartPerformanceMetricsOptions.metrics3 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.sbWalmartPerformanceMetricsOptions.metrics3,
          selectedMetrics[2],
          [selectedMetrics[1], selectedMetrics[0], selectedMetrics[3]]
        );
      state.sbWalmartPerformanceMetricsOptions.metrics4 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.sbWalmartPerformanceMetricsOptions.metrics4,
          selectedMetrics[3],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[0]]
        );
    },
    setWalmartSBPerformanceMetricsOptions: (
      state,
      action: PayloadAction<IPerformanceMetricsPayload>
    ) => {
      if (action.payload) {
        const { payload } = action.payload;

        state.sbWalmartPerformanceMetricsOptions = {
          metrics1: updatePerformanceMetricsOptions(
            state.sbWalmartPerformanceMetricsOptions.metrics1,
            payload
          ),
          metrics2: updatePerformanceMetricsOptions(
            state.sbWalmartPerformanceMetricsOptions.metrics2,
            payload
          ),
          metrics3: updatePerformanceMetricsOptions(
            state.sbWalmartPerformanceMetricsOptions.metrics3,
            payload
          ),
          metrics4: updatePerformanceMetricsOptions(
            state.sbWalmartPerformanceMetricsOptions.metrics4,
            payload
          ),
        };
      }
    },
  },
});

export const {
  resetWalmartSBAdvertisingFilterStates,
  setWalmartSBPerformanceMetrics,
  setWalmartSBPerformanceMetricsOptions,
} = walmartSBAdvertisingFilterSlice.actions;

export const selectWalmartSbPerformanceMetrics = (state: IRootState) =>
  state.walmartSBAdvertisingFilter.sbWalmartPerformanceMetrics;
export const selectWalmartSbPerformanceMetricsOptions = (state: IRootState) =>
  state.walmartSBAdvertisingFilter.sbWalmartPerformanceMetricsOptions;

const walmartSBAdvertisingFilterReducer =
  walmartSBAdvertisingFilterSlice.reducer;
export default walmartSBAdvertisingFilterReducer;
