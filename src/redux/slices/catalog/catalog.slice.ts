import { IDateRange } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IAmazonCatalogItem } from '@/interfaces/catalog/amazon/amazon-catalog.interface';
import { ICatalogData } from '@/interfaces/catalog/walmart/walmart-catalog.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { range } from 'src/constants/advertising-filter.constants';
import { customRangeFilterOption } from 'src/constants';
import { IRootState } from 'src/redux/store';

export interface ICatalogHeaderFilterForm {
  range: IDropdownItem<string>;
  customDateRange: IDateRange;
}

export interface ICatalogHeaderFilterOptions {
  range: IDropdownItem<string>[];
}

export interface ICatalogFilterState {
  catalogHeaderFilters: ICatalogHeaderFilterForm;
  catalogHeaderFilterOptions: ICatalogHeaderFilterOptions;
  catalogTableData: Array<ICatalogData | IAmazonCatalogItem>;
  isCatalogTableDataLoading: boolean;
  isCatalogDataSyncing: boolean;
}

const initialState: ICatalogFilterState = {
  catalogHeaderFilters: {
    range: range[4],
    customDateRange: {
      startDate: '',
      endDate: '',
    },
  },
  catalogHeaderFilterOptions: {
    range: [...range, customRangeFilterOption],
  },
  catalogTableData: [],
  isCatalogTableDataLoading: false,
  isCatalogDataSyncing: false,
};

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    resetCatalogFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setCatalogHeaderFilters: (
      state,
      action: PayloadAction<ICatalogHeaderFilterForm>
    ) => {
      state.catalogHeaderFilters = { ...action.payload };
    },

    setCatalogHeaderFiltersRange: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      state.catalogHeaderFilters.range = action.payload;
    },

    setCatalogHeaderFiltersCustomRange: (
      state,
      action: PayloadAction<IDateRange>
    ) => {
      state.catalogHeaderFilters.customDateRange = action.payload;
    },

    setCatalogHeaderRangeOptions: (
      state,
      action: PayloadAction<IDropdownItem<string>[]>
    ) => {
      state.catalogHeaderFilterOptions.range = action.payload;
    },
    setCatalogTableData: (
      state,
      action: PayloadAction<Array<ICatalogData | IAmazonCatalogItem>>
    ) => {
      state.catalogTableData = action.payload;
    },
    setIsCatalogTableDataLoading: (state, action: PayloadAction<boolean>) => {
      state.isCatalogTableDataLoading = action.payload;
    },
    setIsCatalogDataSyncing: (state, action: PayloadAction<boolean>) => {
      state.isCatalogDataSyncing = action.payload;
    },
  },
});

export const {
  resetCatalogFilterStates,
  setCatalogHeaderFilters,
  setCatalogHeaderFiltersRange,
  setCatalogHeaderFiltersCustomRange,
  setCatalogHeaderRangeOptions,
  setCatalogTableData,
  setIsCatalogTableDataLoading,
  setIsCatalogDataSyncing,
} = catalogSlice.actions;

export const selectCatalogHeaderFilters = (state: IRootState) => {
  return state.catalog.catalogHeaderFilters;
};

export const selectCatalogHeaderFilterOptions = (state: IRootState) => {
  return state.catalog.catalogHeaderFilterOptions;
};

export const selectCatalogTableData = (state: IRootState) => {
  return state.catalog.catalogTableData;
};

export const selectIsCatalogTableDataLoading = (state: IRootState) => {
  return state.catalog.isCatalogTableDataLoading;
};

export const selectIsCatalogDataSyncing = (state: IRootState) => {
  return state.catalog.isCatalogDataSyncing;
};

const catalogReducer = catalogSlice.reducer;
export default catalogReducer;
