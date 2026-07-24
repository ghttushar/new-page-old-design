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

export interface ICreativeAssetIds {
  videoAssetIds: string[];
  products: string[];
}
export interface ISBAdvertisingFilterState {
  sbPerformanceMetricsOptions: IPerformanceMetricsOptions;
  sbPerformanceMetrics: IPerformanceMetricsFilters;
  openCreativeDialog: boolean;
  creativeAssetIds: ICreativeAssetIds;
}

const initialState: ISBAdvertisingFilterState = {
  sbPerformanceMetricsOptions: {
    metrics1: advertisingMetricsOptions,
    metrics2: advertisingMetricsOptions,
    metrics3: advertisingMetricsOptions,
    metrics4: advertisingMetricsOptions,
  },
  sbPerformanceMetrics: {
    metrics1: advertisingMetricsOptions[4],
    metrics2: advertisingMetricsOptions[5],
    metrics3: advertisingMetricsOptions[7],
    metrics4: advertisingMetricsOptions[9],
  },
  openCreativeDialog: false,
  creativeAssetIds: {
    videoAssetIds: [],
    products: [],
  },
};

export const advertisingSBFilterSlice = createSlice({
  name: 'advertisingSBFilter',
  initialState,
  reducers: {
    resetAdvertisingSBFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setSBPerformanceMetrics: (
      state,
      action: PayloadAction<{
        value: IDropdownItem<string>;
        key: TPerformanceMetricsKey;
      }>
    ) => {
      const prevVal = state.sbPerformanceMetrics[action.payload.key];
      const newVal = action.payload.value;
      state.sbPerformanceMetrics[action.payload.key] = newVal;
      const selectedMetrics: string[] = Object.values(
        state.sbPerformanceMetrics
      ).map((item) => item.value);

      state.sbPerformanceMetricsOptions.metrics1 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.sbPerformanceMetricsOptions.metrics1,
          selectedMetrics[0],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[3]]
        );
      state.sbPerformanceMetricsOptions.metrics2 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.sbPerformanceMetricsOptions.metrics2,
          selectedMetrics[1],
          [selectedMetrics[0], selectedMetrics[2], selectedMetrics[3]]
        );
      state.sbPerformanceMetricsOptions.metrics3 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.sbPerformanceMetricsOptions.metrics3,
          selectedMetrics[2],
          [selectedMetrics[1], selectedMetrics[0], selectedMetrics[3]]
        );
      state.sbPerformanceMetricsOptions.metrics4 =
        getPerformanceMetricsUpdatedOptions(
          newVal,
          prevVal,
          state.sbPerformanceMetricsOptions.metrics4,
          selectedMetrics[3],
          [selectedMetrics[1], selectedMetrics[2], selectedMetrics[0]]
        );
    },

    setOpenCreativeDialog: (state, action: PayloadAction<boolean>) => {
      state.openCreativeDialog = action.payload;
    },

    setCreativeAssetIds: (state, action: PayloadAction<ICreativeAssetIds>) => {
      state.creativeAssetIds.videoAssetIds = [...action.payload.videoAssetIds];
      state.creativeAssetIds.products = [...action.payload.products];
    },
  },
});

export const {
  resetAdvertisingSBFilterStates,
  setSBPerformanceMetrics,
  setOpenCreativeDialog,
  setCreativeAssetIds,
} = advertisingSBFilterSlice.actions;

export const selectSBPerformanceMetrics = (state: IRootState) =>
  state.advertisingSBFilter.sbPerformanceMetrics;
export const selectSBPerformanceMetricsOptions = (state: IRootState) =>
  state.advertisingSBFilter.sbPerformanceMetricsOptions;
export const selectOpenCreativeDialog = (state: IRootState) =>
  state.advertisingSBFilter.openCreativeDialog;
export const selectCreativeAssetIds = (state: IRootState) =>
  state.advertisingSBFilter.creativeAssetIds;

const advertisingSBFilterReducer = advertisingSBFilterSlice.reducer;
export default advertisingSBFilterReducer;
