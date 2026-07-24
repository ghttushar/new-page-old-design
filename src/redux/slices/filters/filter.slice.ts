import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  FilterDropdownValue,
  FilterOptions,
  Filters,
} from 'src/enums/filter.enums';
import { IFilterRange } from 'src/interfaces/index.interface';
import { IRootState } from 'src/redux/store';
export interface IFinalFilters {
  filterLabel: string;
  filterKey: Filters;
  filterType: FilterOptions;
  filterValue: IFilterValue;
  filterDropdownValue?: IFilterDropDownValue;
  filterName?: IFilterDropDownValue | number;
}

export type IFilterValue =
  | boolean
  | string
  | number
  | null
  | Array<string>
  | IFilterRange;

export type IFilterDropDownValue =
  | FilterDropdownValue
  | string
  | null
  | Array<FilterDropdownValue | string>;

export interface IRowFilterState {
  filters: IFinalFilters[];
  appliedFilters: IFinalFilters[];
  showFilter: boolean;
  clickedFilterId: string;
  dynamicFilterValuesByFilterKey: Record<string, Array<string>>;
}

const initialState: IRowFilterState = {
  filters: [],
  appliedFilters: [],
  showFilter: false,
  clickedFilterId: '',
  dynamicFilterValuesByFilterKey: {},
};

export const rowFilterSlice = createSlice({
  name: 'rowFilter',
  initialState,
  reducers: {
    resetFilters: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setFilters: (state, action: PayloadAction<IFinalFilters[]>) => {
      state.filters = action.payload;
    },
    setAppliedFilters: (state, action: PayloadAction<IFinalFilters[]>) => {
      state.appliedFilters = action.payload;
    },
    setShowFilterModal: (state, action: PayloadAction<boolean>) => {
      state.showFilter = action.payload;
    },
    setClickedFilterId: (state, action: PayloadAction<string>) => {
      state.clickedFilterId = action.payload;
    },
    setDynamicFilterValuesByFilterKey: (
      state,
      action: PayloadAction<Record<string, Array<string>>>
    ) => {
      state.dynamicFilterValuesByFilterKey = {
        ...state.dynamicFilterValuesByFilterKey,
        ...action.payload,
      };
    },
  },
});

export const {
  resetFilters,
  setFilters,
  setAppliedFilters,
  setShowFilterModal,
  setClickedFilterId,
  setDynamicFilterValuesByFilterKey,
} = rowFilterSlice.actions;

export const selectFilters = (state: IRootState) => {
  return state.rowFilter.filters;
};
export const selectAppliedFilters = (state: IRootState) =>
  state.rowFilter.appliedFilters;
export const selectShowFilterModal = (state: IRootState) =>
  state.rowFilter.showFilter;
export const selectClickedFilterId = (state: IRootState) =>
  state.rowFilter.clickedFilterId;
export const selectDynamicFilterValuesByFilterKey = (state: IRootState) =>
  state.rowFilter.dynamicFilterValuesByFilterKey;

const rowFilterReducer = rowFilterSlice.reducer;
export default rowFilterReducer;
