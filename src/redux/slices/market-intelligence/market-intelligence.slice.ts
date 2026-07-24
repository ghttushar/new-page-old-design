import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IRootState } from '../../store';

export interface ISOVTableFilters {
  selectedBrands: string[];
}

export interface ISOVTable {
  filters: ISOVTableFilters;
}

export interface IDashboard {
  clickedApplyFilters: boolean;
  sovTable: ISOVTable;
}

export interface IMarketIntelligenceState {
  dashboard: IDashboard;
}

const initialState: IMarketIntelligenceState = {
  dashboard: {
    clickedApplyFilters: false,
    sovTable: {
      filters: {
        selectedBrands: [],
      },
    },
  },
};

const marketIntelligenceSlice = createSlice({
  name: 'marketIntelligence',
  initialState: initialState,
  reducers: {
    resetMarketIntelligence: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setSelectedBrands: (state, action: PayloadAction<string[]>) => {
      state.dashboard.sovTable.filters.selectedBrands = action.payload;
    },
    setClickedApplyFilters: (state, action: PayloadAction<boolean>) => {
      state.dashboard.clickedApplyFilters = action.payload;
    },
  },
});

export const {
  resetMarketIntelligence,
  setSelectedBrands,
  setClickedApplyFilters,
} = marketIntelligenceSlice.actions;
export const selectSelectedBrands = (state: IRootState) =>
  state.marketIntelligence.dashboard.sovTable.filters.selectedBrands;

export const selectClickedApplyFilters = (state: IRootState) =>
  state.marketIntelligence.dashboard.clickedApplyFilters;

const marketIntelligenceReducer = marketIntelligenceSlice.reducer;
export default marketIntelligenceReducer;
