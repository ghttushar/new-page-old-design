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

interface IWalmartAdvertisingSPFilterState {
  spWalmartPerformanceMetricsOptions: IPerformanceMetricsOptions;
  spWalmartPerformanceMetrics: IPerformanceMetricsFilters;
}

const initialState: IWalmartAdvertisingSPFilterState = {
  spWalmartPerformanceMetricsOptions: {
    metrics1: walmartAdvertisingMetricsOptions,
    metrics2: walmartAdvertisingMetricsOptions,
    metrics3: walmartAdvertisingMetricsOptions,
    metrics4: walmartAdvertisingMetricsOptions,
  },
  spWalmartPerformanceMetrics: {
    metrics1: walmartAdvertisingMetricsOptions[4],
    metrics2: walmartAdvertisingMetricsOptions[5],
    metrics3: walmartAdvertisingMetricsOptions[7],
    metrics4: walmartAdvertisingMetricsOptions[10],
  },
};

export const walmartSPAdvertisingFilterSlice = createSlice({
  name: 'walmartSPAdvertisingFilter',
  initialState,
  reducers: {
    resetWalmartSPAdvertisingFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setWalmartSPPerformanceMetrics: (
      state,
      action: PayloadAction<{
        value: IDropdownItem<string>;
        key: TPerformanceMetricsKey;
      }>
    ) => {
      const prevVal = state.spWalmartPerformanceMetrics[action.payload.key];
      const newVal = action.payload.value;
      state.spWalmartPerformanceMetrics[action.payload.key] = newVal;
      const selectedMetrics: string[] = Object.values(
        state.spWalmartPerformanceMetrics
      ).map((item) => item.value);

      state.spWalmartPerformanceMetricsOptions.metrics1 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.spWalmartPerformanceMetricsOptions.metrics1,
          selectedMetrics[0],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[3]]
        );
      state.spWalmartPerformanceMetricsOptions.metrics2 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.spWalmartPerformanceMetricsOptions.metrics2,
          selectedMetrics[1],
          [selectedMetrics[0], selectedMetrics[2], selectedMetrics[3]]
        );
      state.spWalmartPerformanceMetricsOptions.metrics3 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.spWalmartPerformanceMetricsOptions.metrics3,
          selectedMetrics[2],
          [selectedMetrics[1], selectedMetrics[0], selectedMetrics[3]]
        );
      state.spWalmartPerformanceMetricsOptions.metrics4 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.spWalmartPerformanceMetricsOptions.metrics4,
          selectedMetrics[3],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[0]]
        );
    },
    setWalmartSPPerformanceMetricsOptions: (
      state,
      action: PayloadAction<IPerformanceMetricsPayload>
    ) => {
      const { payload } = action.payload;

      state.spWalmartPerformanceMetricsOptions = {
        metrics1: updatePerformanceMetricsOptions(
          state.spWalmartPerformanceMetricsOptions.metrics1,
          payload
        ),
        metrics2: updatePerformanceMetricsOptions(
          state.spWalmartPerformanceMetricsOptions.metrics2,
          payload
        ),
        metrics3: updatePerformanceMetricsOptions(
          state.spWalmartPerformanceMetricsOptions.metrics3,
          payload
        ),
        metrics4: updatePerformanceMetricsOptions(
          state.spWalmartPerformanceMetricsOptions.metrics4,
          payload
        ),
      };
    },
  },
});

export const {
  resetWalmartSPAdvertisingFilterStates,
  setWalmartSPPerformanceMetrics,
  setWalmartSPPerformanceMetricsOptions,
} = walmartSPAdvertisingFilterSlice.actions;

export const selectWalmartSPPerformanceMetrics = (state: IRootState) =>
  state.walmartSPAdvertisingFilter.spWalmartPerformanceMetrics;
export const selectWalmartSPPerformanceMetricsOptions = (state: IRootState) =>
  state.walmartSPAdvertisingFilter.spWalmartPerformanceMetricsOptions;

const walmartSPAdvertisingFilterReducer =
  walmartSPAdvertisingFilterSlice.reducer;
export default walmartSPAdvertisingFilterReducer;
