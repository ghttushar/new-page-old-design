import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  ProductActionAdditionActionTypeOptions,
  TargetingActionDateRangeOptions,
  TargetingActionPriorityOptions,
} from 'src/constants/keyword-action.constants';
import {
  KeywordActionActionType,
  KeywordActionDateRange,
  KeywordActionPriority,
} from 'src/enums/keyword-action.enums';
import { IKeywordActionData } from 'src/interfaces/keyword-actions.interface';
import { IRootState } from '../../../store';

export interface IKeywordActionFilterForm {
  actionType: IDropdownItem<KeywordActionActionType>;
  dateRange: IDropdownItem<KeywordActionDateRange>;
  priority: IDropdownItem<KeywordActionPriority>;
}

export interface IKeywordActionTableFilter {
  label: string;
  labelValue: string;
  arithmeticSymbol: string;
  filterValue: string;
}

export interface IKeywordActionFilterTableForm {
  [key: string]: IKeywordActionTableFilter;
}

export interface IKeywordActionFilterOptions {
  actionType: IDropdownItem<KeywordActionActionType>[];
  dateRange: IDropdownItem<KeywordActionDateRange>[];
  priority: IDropdownItem<KeywordActionPriority>[];
}

export interface IProductActionFilterState {
  filters: IKeywordActionFilterForm;
  appliedFilters: IKeywordActionFilterForm;
  options: IKeywordActionFilterOptions;
  tableData: IKeywordActionData[];
  updatedTableData: IKeywordActionData[];
}

export const initialProductActionFilters: IKeywordActionFilterForm = {
  actionType: ProductActionAdditionActionTypeOptions[0],
  dateRange: TargetingActionDateRangeOptions[3],
  priority: TargetingActionPriorityOptions[0],
};

const productActionInitialState: IProductActionFilterState = {
  filters: initialProductActionFilters,
  appliedFilters: initialProductActionFilters,
  options: {
    actionType: ProductActionAdditionActionTypeOptions,
    dateRange: TargetingActionDateRangeOptions,
    priority: TargetingActionPriorityOptions,
  },
  tableData: [],
  updatedTableData: [],
};

export const productActionSlice = createSlice({
  name: 'productAction',
  initialState: productActionInitialState,
  reducers: {
    resetProductAction: (state, action: PayloadAction) => {
      Object.assign(state, productActionInitialState);
    },
    resetProductActionFilters: (state, action: PayloadAction) => {
      state.filters = { ...initialProductActionFilters };
      state.appliedFilters = { ...initialProductActionFilters };
    },
    setProductActionFilters: (
      state,
      action: PayloadAction<IKeywordActionFilterForm>
    ) => {
      state.filters = { ...action.payload };
    },
    setAppliedProductActionFilters: (
      state,
      action: PayloadAction<IKeywordActionFilterForm>
    ) => {
      state.appliedFilters = { ...action.payload };
    },
    setProductActionOptions: (
      state,
      action: PayloadAction<IKeywordActionFilterOptions>
    ) => {
      state.options = { ...action.payload };
    },
    setProductActionTableData: (
      state,
      action: PayloadAction<IKeywordActionData[]>
    ) => {
      state.tableData = [...action.payload];
    },
    setUpdatedProductActionTableData: (
      state,
      action: PayloadAction<IKeywordActionData[]>
    ) => {
      state.updatedTableData = [...action.payload];
    },
  },
});

export const {
  resetProductAction,
  resetProductActionFilters,
  setProductActionFilters,
  setAppliedProductActionFilters,
  setProductActionOptions,
  setProductActionTableData,
  setUpdatedProductActionTableData,
} = productActionSlice.actions;

export const selectProductActionFilters = (
  state: IRootState
): IKeywordActionFilterForm => state.productActionFilter.filters;

export const selectAppliedProductActionFilters = (
  state: IRootState
): IKeywordActionFilterForm => state.productActionFilter.appliedFilters;

export const selectProductActionOptions = (
  state: IRootState
): IKeywordActionFilterOptions => state.productActionFilter.options;

export const selectProductActionTableData = (
  state: IRootState
): IKeywordActionData[] => state.productActionFilter.tableData;

export const selectUpdatedProductActionTableData = (
  state: IRootState
): IKeywordActionData[] => state.productActionFilter.updatedTableData;

const productActionFilterReducer = productActionSlice.reducer;
export default productActionFilterReducer;
