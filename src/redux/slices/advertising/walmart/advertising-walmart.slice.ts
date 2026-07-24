import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IWalmartBrandProfile } from 'src/interfaces/advertising/walmart/walmart-sb-advertising.interface';
import { IRootState } from 'src/redux/store';

interface IWalmartAdvertisingFilterState {
  walmartBrandProfileInitialState: IWalmartBrandProfile | null;
  walmartBrandProfileEditState: IWalmartBrandProfile | null;
}

const initialState: IWalmartAdvertisingFilterState = {
  walmartBrandProfileInitialState: null,
  walmartBrandProfileEditState: null,
};

export const walmartAdvertising = createSlice({
  name: 'walmartAdvertising',
  initialState,
  reducers: {
    resetWalmartAdvertisingStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setWalmartBrandProfileInitialState: (
      state,
      action: PayloadAction<IWalmartBrandProfile | null>
    ) => {
      state.walmartBrandProfileInitialState = action.payload;
    },
    setWalmartBrandProfileEditState: (
      state,
      action: PayloadAction<IWalmartBrandProfile | null>
    ) => {
      state.walmartBrandProfileEditState = action.payload;
    },
  },
});

export const {
  resetWalmartAdvertisingStates,
  setWalmartBrandProfileInitialState,
  setWalmartBrandProfileEditState,
} = walmartAdvertising.actions;

export const selectWalmartBrandProfileInitialState = (state: IRootState) =>
  state.walmartAdvertising.walmartBrandProfileInitialState;
export const selectWalmartBrandProfileEditState = (state: IRootState) =>
  state.walmartAdvertising.walmartBrandProfileEditState;

const walmartAdvertisingReducer = walmartAdvertising.reducer;
export default walmartAdvertisingReducer;
