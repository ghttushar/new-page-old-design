import {
  ProductNegationActionTypeOptions,
  TargetingActionDateRangeOptions,
  TargetingActionPriorityOptions,
} from '@/constants/keyword-action.constants';
import { IKeywordActionData } from '@/interfaces/keyword-actions.interface';
import { IRootState } from '@/redux/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IKeywordActionFilterOptions,
  IOpportunitiesFilterForm,
} from './keyword-action-negation.slice';

export interface IProductNegationFilterState {
  filters: IOpportunitiesFilterForm;
  appliedFilters: IOpportunitiesFilterForm;
  options: IKeywordActionFilterOptions;
  tableData: IKeywordActionData[];
  updatedTableData: IKeywordActionData[];
}

export const initialProductNegationFilters: IOpportunitiesFilterForm = {
  actionType: ProductNegationActionTypeOptions[0],
  dateRange: TargetingActionDateRangeOptions[3],
  priority: TargetingActionPriorityOptions[0],
};

const productNegationInitialState: IProductNegationFilterState = {
  filters: initialProductNegationFilters,
  appliedFilters: initialProductNegationFilters,
  options: {
    actionType: ProductNegationActionTypeOptions,
    dateRange: TargetingActionDateRangeOptions,
    priority: TargetingActionPriorityOptions,
  },
  tableData: [],
  updatedTableData: [],
};

export const productNegationSlice = createSlice({
  name: 'productNegation',
  initialState: productNegationInitialState,
  reducers: {
    resetProductNegation: (state, action: PayloadAction) => {
      Object.assign(state, productNegationInitialState);
    },
    resetProductNegationFilters: (state, action: PayloadAction) => {
      state.filters = { ...initialProductNegationFilters };
      state.appliedFilters = { ...initialProductNegationFilters };
    },
    setProductNegationFilters: (
      state,
      action: PayloadAction<IOpportunitiesFilterForm>
    ) => {
      state.filters = { ...action.payload };
    },
    setAppliedProductNegationFilters: (
      state,
      action: PayloadAction<IOpportunitiesFilterForm>
    ) => {
      state.appliedFilters = { ...action.payload };
    },
    setProductNegationOptions: (
      state,
      action: PayloadAction<IKeywordActionFilterOptions>
    ) => {
      state.options = { ...action.payload };
    },
    setProductNegationTableData: (
      state,
      action: PayloadAction<IKeywordActionData[]>
    ) => {
      state.tableData = [...action.payload];
    },
    setUpdatedProductNegationTableData: (
      state,
      action: PayloadAction<IKeywordActionData[]>
    ) => {
      state.updatedTableData = [...action.payload];
    },
  },
});

export const {
  resetProductNegation,
  resetProductNegationFilters,
  setProductNegationFilters,
  setAppliedProductNegationFilters,
  setProductNegationOptions,
  setProductNegationTableData,
  setUpdatedProductNegationTableData,
} = productNegationSlice.actions;

export const selectProductNegationFilters = (
  state: IRootState
): IOpportunitiesFilterForm => state.productNegationFilter.filters;

export const selectAppliedProductNegationFilters = (
  state: IRootState
): IOpportunitiesFilterForm => state.productNegationFilter.appliedFilters;

export const selectProductNegationOptions = (
  state: IRootState
): IKeywordActionFilterOptions => state.productNegationFilter.options;

export const selectProductNegationTableData = (
  state: IRootState
): IKeywordActionData[] => state.productNegationFilter.tableData;

export const selectUpdatedProductNegationTableData = (
  state: IRootState
): IKeywordActionData[] => state.productNegationFilter.updatedTableData;

const productNegationFilterReducer = productNegationSlice.reducer;
export default productNegationFilterReducer;
