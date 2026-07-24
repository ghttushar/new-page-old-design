import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  KeywordActionNegationActionTypeOptions,
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

export interface IOpportunitiesFilterForm {
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

export interface IKeywordActionFilterState {
  filters: IOpportunitiesFilterForm;
  appliedFilters: IOpportunitiesFilterForm;
  options: IKeywordActionFilterOptions;
  tableData: IKeywordActionData[];
  updatedTableData: IKeywordActionData[];
}

export const initialKeywordNegationFilters: IOpportunitiesFilterForm = {
  actionType: KeywordActionNegationActionTypeOptions[0],
  dateRange: TargetingActionDateRangeOptions[3],
  priority: TargetingActionPriorityOptions[0],
};

const negationInitialState: IKeywordActionFilterState = {
  filters: initialKeywordNegationFilters,
  appliedFilters: initialKeywordNegationFilters,
  options: {
    actionType: KeywordActionNegationActionTypeOptions,
    dateRange: TargetingActionDateRangeOptions,
    priority: TargetingActionPriorityOptions,
  },
  tableData: [],
  updatedTableData: [],
};

export const keywordNegationSlice = createSlice({
  name: 'keywordActionNegation',
  initialState: negationInitialState,
  reducers: {
    resetKeywordNegation: (state, action: PayloadAction) => {
      Object.assign(state, negationInitialState);
    },
    resetKeywordNegationFilters: (state, action: PayloadAction) => {
      state.filters = { ...initialKeywordNegationFilters };
      state.appliedFilters = { ...initialKeywordNegationFilters };
    },
    setKeywordNegationFilters: (
      state,
      action: PayloadAction<IOpportunitiesFilterForm>
    ) => {
      state.filters = { ...action.payload };
    },
    setAppliedKeywordNegationFilters: (
      state,
      action: PayloadAction<IOpportunitiesFilterForm>
    ) => {
      state.appliedFilters = { ...action.payload };
    },
    setKeywordNegationOptions: (
      state,
      action: PayloadAction<IKeywordActionFilterOptions>
    ) => {
      state.options = { ...action.payload };
    },
    setKeywordNegationTableData: (
      state,
      action: PayloadAction<IKeywordActionData[]>
    ) => {
      state.tableData = [...action.payload];
    },
    setUpdatedNegationTableData: (
      state,
      action: PayloadAction<IKeywordActionData[]>
    ) => {
      state.updatedTableData = [...action.payload];
    },
  },
});

export const {
  resetKeywordNegation,
  resetKeywordNegationFilters,
  setKeywordNegationFilters,
  setAppliedKeywordNegationFilters,
  setKeywordNegationOptions,
  setKeywordNegationTableData,
  setUpdatedNegationTableData,
} = keywordNegationSlice.actions;

export const selectKeywordNegationFilters = (
  state: IRootState
): IOpportunitiesFilterForm => state.keywordNegationFilter.filters;

export const selectAppliedKeywordNegationFilters = (
  state: IRootState
): IOpportunitiesFilterForm => state.keywordNegationFilter.appliedFilters;

export const selectKeywordNegationOptions = (
  state: IRootState
): IKeywordActionFilterOptions => state.keywordNegationFilter.options;

export const selectKeywordNegationTableData = (
  state: IRootState
): IKeywordActionData[] => state.keywordNegationFilter.tableData;

export const selectUpdatedKeywordNegationTableData = (
  state: IRootState
): IKeywordActionData[] => state.keywordNegationFilter.updatedTableData;

const keywordNegationFilterReducer = keywordNegationSlice.reducer;
export default keywordNegationFilterReducer;
