import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import {
  KeywordActionAdditionActionTypeOptions,
  TargetingActionDateRangeOptions,
  TargetingActionPriorityOptions,
} from 'src/constants/keyword-action.constants';
import { KeywordActionTabsEnum } from 'src/enums/keyword-action.enums';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import {
  IKeywordActionData,
  IKeywordActionFilterForm,
  IKeywordActionFilterOptions,
  IKeywordActionFilterState,
  IKeywordBidPayload,
  IMultiSelectDropdownItemPayload,
} from 'src/interfaces/keyword-actions.interface';
import { IRootState } from '../../../store';

export const initialKeywordActionFilters: IKeywordActionFilterForm = {
  actionType: KeywordActionAdditionActionTypeOptions[0],
  dateRange: TargetingActionDateRangeOptions[3],
  priority: TargetingActionPriorityOptions[0],
};

export interface IInitPayload {
  targetCampaignOptions: IMultiSelectDropdownItem[][];
  targetAdGroupOptions: IMultiSelectDropdownItem[][];
  matchTypeToAdd: IMultiSelectDropdownItem[][];
  keywordBid: number[][];
}

const initialState: IKeywordActionFilterState = {
  actionTypeFilters: initialKeywordActionFilters,
  appliedFilters: initialKeywordActionFilters,
  options: {
    actionType: KeywordActionAdditionActionTypeOptions,
    dateRange: TargetingActionDateRangeOptions,
    priority: TargetingActionPriorityOptions,
  },
  tableData: [],
  updatedTableData: [],
  isApplyDisabled: false,
  targetCampaigns: [],
  targetAdGroups: [],
  matchTypeToAdd: [],
  selectedColumns: [],
  keywordBid: [],
  initialKeywordBid: [],
  selectedRowIds: {},
  trigger: false,
  isRowEdited: false,
  selectedTab: KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON,
  selectedTagId: null,
  bidErrorMessage: null,
};

export const keywordActionFilterSlice = createSlice({
  name: 'keywordActionFilter',
  initialState,
  reducers: {
    resetKeywordActionFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    resetKeywordActionFilters: (state, action: PayloadAction) => {
      state.actionTypeFilters = { ...initialKeywordActionFilters };
      state.appliedFilters = { ...initialKeywordActionFilters };
    },
    setKeywordActionFilters: (
      state,
      action: PayloadAction<IKeywordActionFilterForm>
    ) => {
      state.actionTypeFilters = { ...action.payload };
    },
    setAppliedKeywordActionFilters: (
      state,
      action: PayloadAction<IKeywordActionFilterForm>
    ) => {
      state.appliedFilters = { ...action.payload };
    },
    setKeywordActionOptions: (
      state,
      action: PayloadAction<IKeywordActionFilterOptions>
    ) => {
      state.options = { ...action.payload };
    },
    setKeywordActionsTableData: (
      state,
      action: PayloadAction<IKeywordActionData[]>
    ) => {
      state.tableData = [...action.payload];
    },
    setUpdatedAdditionTableData: (
      state,
      action: PayloadAction<IKeywordActionData[]>
    ) => {
      state.updatedTableData = [...action.payload];
    },
    setIsApplyBtnDisabled: (state, action: PayloadAction<boolean>) => {
      state.isApplyDisabled = action.payload;
    },
    setTargetCampaigns: (
      state,
      action: PayloadAction<IMultiSelectDropdownItemPayload>
    ) => {
      state.targetCampaigns[action.payload.rowId] = action.payload.options;
    },
    setKeywordBid: (state, action: PayloadAction<IKeywordBidPayload>) => {
      state.keywordBid[action.payload.rowId] = action.payload.bids;
    },
    setAllKeywordBids: (state, action: PayloadAction<number[][]>) => {
      state.keywordBid = action.payload;
    },
    setKeywordActionSelectedRowIds: (
      state,
      action: PayloadAction<RowSelectionState>
    ) => {
      state.selectedRowIds = action.payload;
    },
    initTargetCampaigns: (
      state,
      action: PayloadAction<IMultiSelectDropdownItem[][]>
    ) => {
      state.targetCampaigns = action.payload;
    },
    initTargetAdGroups: (
      state,
      action: PayloadAction<IMultiSelectDropdownItem[][]>
    ) => {
      state.targetAdGroups = action.payload;
    },
    initMatchTypeToAdd: (
      state,
      action: PayloadAction<IMultiSelectDropdownItem[][]>
    ) => {
      state.matchTypeToAdd = action.payload;
    },
    initKeywordBid: (state, action: PayloadAction<number[][]>) => {
      state.keywordBid = action.payload;
    },
    initialKeywordBid: (state, action: PayloadAction<number[][]>) => {
      state.initialKeywordBid = action.payload;
    },
    initKeywordActionData: (state, action: PayloadAction<IInitPayload>) => {
      const {
        targetCampaignOptions,
        targetAdGroupOptions,
        matchTypeToAdd,
        keywordBid,
      } = action.payload;
      state.targetCampaigns = targetCampaignOptions;
      state.targetAdGroups = targetAdGroupOptions;
      state.matchTypeToAdd = matchTypeToAdd;
      state.keywordBid = keywordBid;
    },
    setTargetAdGroups: (
      state,
      action: PayloadAction<IMultiSelectDropdownItemPayload>
    ) => {
      state.targetAdGroups[action.payload.rowId] = action.payload.options;
    },
    setMatchTypeToAdd: (
      state,
      action: PayloadAction<IMultiSelectDropdownItemPayload>
    ) => {
      state.matchTypeToAdd[action.payload.rowId] = action.payload.options;
    },
    setTrigger: (state, action: PayloadAction<boolean>) => {
      state.trigger = action.payload;
    },
    setIsRowEdited: (state, action: PayloadAction<boolean>) => {
      state.isRowEdited = action.payload;
    },
    setSelectedTab: (state, action: PayloadAction<KeywordActionTabsEnum>) => {
      state.selectedTab = action.payload;
    },
    setSelectedTagId: (state, action: PayloadAction<number | null>) => {
      state.selectedTagId = action.payload;
    },
    setSelectedColumns: (
      state,
      action: PayloadAction<ColumnDef<IKeywordActionData>[]>
    ) => {
      state.selectedColumns = action.payload;
    },
    setBidErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.bidErrorMessage = action.payload;
    },
  },
});

export const {
  resetKeywordActionFilterStates,
  resetKeywordActionFilters,
  setKeywordActionFilters,
  setAppliedKeywordActionFilters,
  setKeywordActionOptions,
  setKeywordActionsTableData,
  setUpdatedAdditionTableData,
  setIsApplyBtnDisabled,
  setTargetCampaigns,
  setTargetAdGroups,
  setMatchTypeToAdd,
  setKeywordBid,
  setAllKeywordBids,
  initTargetAdGroups,
  initTargetCampaigns,
  initMatchTypeToAdd,
  initKeywordBid,
  initialKeywordBid,
  initKeywordActionData,
  setKeywordActionSelectedRowIds,
  setTrigger,
  setIsRowEdited,
  setSelectedTab,
  setSelectedTagId,
  setSelectedColumns,
  setBidErrorMessage,
} = keywordActionFilterSlice.actions;

export const selectKeywordActionFilters = (state: IRootState) =>
  state.keywordActionFilter.actionTypeFilters;

export const selectAppliedKeywordActionFilters = (state: IRootState) =>
  state.keywordActionFilter.appliedFilters;

export const selectKeywordActionOptions = (state: IRootState) =>
  state.keywordActionFilter.options;

export const selectKeywordActionsTableData = (state: IRootState) =>
  state.keywordActionFilter.tableData;

export const selectUpdatedAdditionTableData = (state: IRootState) =>
  state.keywordActionFilter.updatedTableData;

export const selectIsApplyBtnDisabled = (state: IRootState) =>
  state.keywordActionFilter.isApplyDisabled;

export const selectTargetCampaigns = (state: IRootState, rowId: number) =>
  state.keywordActionFilter.targetCampaigns[rowId];

export const selectAllTargetCampaigns = (state: IRootState) =>
  state.keywordActionFilter.targetCampaigns;

export const selectTargetAdGroups = (state: IRootState, rowId: number) =>
  state.keywordActionFilter.targetAdGroups[rowId];

export const selectAllTargetAdGroups = (state: IRootState) =>
  state.keywordActionFilter.targetAdGroups;

export const selectMatchTypeToAdd = (state: IRootState, rowId: number) =>
  state.keywordActionFilter.matchTypeToAdd[rowId];

export const selectAllMatchTypeToAdd = (state: IRootState) =>
  state.keywordActionFilter.matchTypeToAdd;

export const selectInitTargetAdGroups = (state: IRootState) =>
  state.keywordActionFilter.targetAdGroups;

export const selectInitTargetCampaigns = (state: IRootState) =>
  state.keywordActionFilter.targetCampaigns;

export const selectInitMatchTypeToAdd = (state: IRootState) =>
  state.keywordActionFilter.matchTypeToAdd;

export const selectKeywordBid = (state: IRootState, rowId: number) =>
  state.keywordActionFilter.keywordBid[rowId];

export const selectInitialKeywordBid = (state: IRootState, rowId: number) =>
  state.keywordActionFilter.initialKeywordBid[rowId];

export const selectAllKeywordBid = (state: IRootState) =>
  state.keywordActionFilter.keywordBid;

export const selectKeywordActionSelectedRowIds = (state: IRootState) =>
  state.keywordActionFilter.selectedRowIds;

export const selectTrigger = (state: IRootState) =>
  state.keywordActionFilter.trigger;

export const selectIsRowEdited = (state: IRootState) =>
  state.keywordActionFilter.isRowEdited;

export const selectSelectedTab = (state: IRootState) =>
  state.keywordActionFilter.selectedTab;

export const selectSelectedTagId = (state: IRootState) =>
  state.keywordActionFilter.selectedTagId;

export const selectSelectedColumns = (state: IRootState) =>
  state.keywordActionFilter.selectedColumns;

export const selectBidErrorMessage = (state: IRootState) =>
  state.keywordActionFilter.bidErrorMessage;

const keywordActionFilterReducer = keywordActionFilterSlice.reducer;
export default keywordActionFilterReducer;
