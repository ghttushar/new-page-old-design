import {
  ICreateKeyword,
  ICreateProductAds,
} from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import { IRootState } from '@/redux/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAdvertisingCreateEntityState {
  addedKeywords: ICreateKeyword[];
  addedProductAds: ICreateProductAds[];
}

const initialState: IAdvertisingCreateEntityState = {
  addedKeywords: [],
  addedProductAds: [],
};

export const advertisingCreateEntity = createSlice({
  name: 'advertisingCreateEntity',
  initialState,
  reducers: {
    resetAdvertisingCreateEntity: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setAddedKeywords: (state, action: PayloadAction<ICreateKeyword[]>) => {
      state.addedKeywords = action.payload;
    },
    updateAddedKeyword: (
      state,
      action: PayloadAction<{
        id: string;
        customBid?: number | typeof NaN;
        status?: string;
      }>
    ) => {
      const { id, customBid, status } = action.payload;
      const row = state.addedKeywords.find((keyword) => keyword.id === id);

      if (row) {
        if (customBid !== undefined) {
          row.customBid = customBid;
        }
        if (status !== undefined) {
          row.status = status;
        }
      }
    },
    removeAddedKeyword: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const idx = state.addedKeywords.findIndex(
        (keyword) => keyword.id?.toString() === id
      );

      if (idx !== -1) state.addedKeywords.splice(idx, 1);
    },
    setAddedProductAds: (state, action: PayloadAction<ICreateProductAds[]>) => {
      state.addedProductAds = action.payload;
    },
    updateAddedProductAds: (
      state,
      action: PayloadAction<{
        id: string;
        customBid?: number | typeof NaN;
        status?: string;
      }>
    ) => {
      const { id, customBid, status } = action.payload;
      const row = state.addedProductAds.find((product) => product.id === id);

      if (row) {
        if (customBid !== undefined) {
          row.customBid = customBid;
        }
        if (status !== undefined) {
          row.status = status;
        }
      }
    },
    removeAddedProductAds: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const idx = state.addedProductAds.findIndex(
        (product) => product.id?.toString() === id
      );

      if (idx !== -1) state.addedProductAds.splice(idx, 1);
    },
  },
});

export const {
  resetAdvertisingCreateEntity,
  setAddedKeywords,
  updateAddedKeyword,
  removeAddedKeyword,
  setAddedProductAds,
  updateAddedProductAds,
  removeAddedProductAds,
} = advertisingCreateEntity.actions;

export const selectAddedKeywords = (state: IRootState) =>
  state.advertisingCreateEntity.addedKeywords;
export const selectAddedProductAds = (state: IRootState) =>
  state.advertisingCreateEntity.addedProductAds;

const advertisingCreateEntityReducer = advertisingCreateEntity.reducer;
export default advertisingCreateEntityReducer;
