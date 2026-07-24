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
  selectedTab: KeywordActionTabsEnum.KEYWORD_ADDITION_WALMART,
  selectedTagId: null,
  bidErrorMessage: null,
};

export const walmartKeywordActionFilterSlice = createSlice({
  name: 'walmartKeywordActionFilter',
  initialState,
  reducers: {
    resetWalmartKeywordActionFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    resetWalmartKeywordActionFilters: (state, action: PayloadAction) => {
      state.actionTypeFilters = { ...initialKeywordActionFilters };
      state.appliedFilters = { ...initialKeywordActionFilters };
    },
    setWalmartKeywordActionFilters: (
      state,
      action: PayloadAction<IKeywordActionFilterForm>
    ) => {
      state.actionTypeFilters = { ...action.payload };
    },
    setWalmartAppliedKeywordActionFilters: (
      state,
      action: PayloadAction<IKeywordActionFilterForm>
    ) => {
      state.appliedFilters = { ...action.payload };
    },
    setWalmartKeywordActionOptions: (
      state,
      action: PayloadAction<IKeywordActionFilterOptions>
    ) => {
      state.options = { ...action.payload };
    },
    setWalmartKeywordActionsTableData: (
      state,
      action: PayloadAction<IKeywordActionData[]>
    ) => {
      state.tableData = [...action.payload];
    },

    setWalmartUpdatedAdditionTableData: (
      state,
      action: PayloadAction<IKeywordActionData[]>
    ) => {
      state.updatedTableData = [...action.payload];
    },
    setIsWmtApplyBtnDisabled: (state, action: PayloadAction<boolean>) => {
      state.isApplyDisabled = action.payload;
    },

    setWalmartTargetCampaigns: (
      state,
      action: PayloadAction<IMultiSelectDropdownItemPayload>
    ) => {
      state.targetCampaigns[action.payload.rowId] = action.payload.options;
    },
    setWalmartKeywordBid: (
      state,
      action: PayloadAction<IKeywordBidPayload>
    ) => {
      state.keywordBid[action.payload.rowId] = action.payload.bids;
    },
    setWalmartAllKeywordBids: (state, action: PayloadAction<number[][]>) => {
      state.keywordBid = action.payload;
    },
    setWalmartKeywordActionSelectedRowIds: (
      state,
      action: PayloadAction<RowSelectionState>
    ) => {
      state.selectedRowIds = action.payload;
    },
    setInitWalmartTargetCampaigns: (
      state,
      action: PayloadAction<IMultiSelectDropdownItem[][]>
    ) => {
      state.targetCampaigns = action.payload;
    },
    setInitWalmartTargetAdGroups: (
      state,
      action: PayloadAction<IMultiSelectDropdownItem[][]>
    ) => {
      state.targetAdGroups = action.payload;
    },
    setInitWalmartMatchTypeToAdd: (
      state,
      action: PayloadAction<IMultiSelectDropdownItem[][]>
    ) => {
      state.matchTypeToAdd = action.payload;
    },
    setInitWalmartKeywordBid: (state, action: PayloadAction<number[][]>) => {
      state.keywordBid = action.payload;
    },
    setInitialWalmartKeywordBid: (state, action: PayloadAction<number[][]>) => {
      state.initialKeywordBid = action.payload;
    },
    setInitWalmartKeywordActionData: (
      state,
      action: PayloadAction<IInitPayload>
    ) => {
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
    setWalmartTargetAdGroups: (
      state,
      action: PayloadAction<IMultiSelectDropdownItemPayload>
    ) => {
      state.targetAdGroups[action.payload.rowId] = action.payload.options;
    },
    setWalmartMatchTypeToAdd: (
      state,
      action: PayloadAction<IMultiSelectDropdownItemPayload>
    ) => {
      state.matchTypeToAdd[action.payload.rowId] = action.payload.options;
    },
    setWalmartTrigger: (state, action: PayloadAction<boolean>) => {
      state.trigger = action.payload;
    },
    setIsWalmartRowEdited: (state, action: PayloadAction<boolean>) => {
      state.isRowEdited = action.payload;
    },
    setWalmartSelectedTab: (
      state,
      action: PayloadAction<KeywordActionTabsEnum>
    ) => {
      state.selectedTab = action.payload;
    },
    setWalmartSelectedTagId: (state, action: PayloadAction<number | null>) => {
      state.selectedTagId = action.payload;
    },
    setWalmartSelectedColumns: (
      state,
      action: PayloadAction<ColumnDef<IKeywordActionData>[]>
    ) => {
      state.selectedColumns = action.payload;
    },
    setWalmartBidErrorMessage: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.bidErrorMessage = action.payload;
    },
  },
});

export const {
  resetWalmartKeywordActionFilterStates,
  resetWalmartKeywordActionFilters,
  setWalmartKeywordActionFilters,
  setWalmartAppliedKeywordActionFilters,
  setWalmartKeywordActionOptions,
  setWalmartKeywordActionsTableData,
  setWalmartUpdatedAdditionTableData,
  setIsWmtApplyBtnDisabled,
  setWalmartTargetCampaigns,
  setWalmartTargetAdGroups,
  setWalmartMatchTypeToAdd,
  setWalmartKeywordBid,
  setWalmartAllKeywordBids,
  setInitWalmartTargetAdGroups,
  setInitWalmartTargetCampaigns,
  setInitWalmartMatchTypeToAdd,
  setInitWalmartKeywordBid,
  setInitialWalmartKeywordBid,
  setInitWalmartKeywordActionData,
  setWalmartKeywordActionSelectedRowIds,
  setWalmartTrigger,
  setIsWalmartRowEdited,
  setWalmartSelectedTab,
  setWalmartSelectedTagId,
  setWalmartSelectedColumns,
  setWalmartBidErrorMessage,
} = walmartKeywordActionFilterSlice.actions;

export const selectWalmartKeywordActionFilters = (state: IRootState) =>
  state.walmartKeywordActionFilter.actionTypeFilters;

export const selectWalmartAppliedKeywordActionFilters = (state: IRootState) =>
  state.walmartKeywordActionFilter.appliedFilters;

export const selectWalmartKeywordActionOptions = (state: IRootState) =>
  state.walmartKeywordActionFilter.options;

export const selectWalmartKeywordActionsTableData = (state: IRootState) =>
  state.walmartKeywordActionFilter.tableData;

export const selectWalmartUpdatedAdditionTableData = (state: IRootState) =>
  state.walmartKeywordActionFilter.updatedTableData;

export const selectIsWmtApplyBtnDisabled = (state: IRootState) =>
  state.walmartKeywordActionFilter.isApplyDisabled;

export const selectWalmartTargetCampaigns = (
  state: IRootState,
  rowId: number
) => state.walmartKeywordActionFilter.targetCampaigns[rowId];

export const selectAllWalmartTargetCampaigns = (state: IRootState) =>
  state.walmartKeywordActionFilter.targetCampaigns;

export const selectWalmartTargetAdGroups = (state: IRootState, rowId: number) =>
  state.walmartKeywordActionFilter.targetAdGroups[rowId];

export const selectAllWalmartTargetAdGroups = (state: IRootState) =>
  state.walmartKeywordActionFilter.targetAdGroups;

export const selectWalmartMatchTypeToAdd = (state: IRootState, rowId: number) =>
  state.walmartKeywordActionFilter.matchTypeToAdd[rowId];

export const selectAllWalmartMatchTypeToAdd = (state: IRootState) =>
  state.walmartKeywordActionFilter.matchTypeToAdd;

export const selectInitWalmartTargetAdGroups = (state: IRootState) =>
  state.walmartKeywordActionFilter.targetAdGroups;

export const selectInitWalmartTargetCampaigns = (state: IRootState) =>
  state.walmartKeywordActionFilter.targetCampaigns;

export const selectInitWalmartMatchTypeToAdd = (state: IRootState) =>
  state.walmartKeywordActionFilter.matchTypeToAdd;

export const selectWalmartKeywordBid = (state: IRootState, rowId: number) =>
  state.walmartKeywordActionFilter.keywordBid[rowId];

export const selectWalmartInitialKeywordBid = (
  state: IRootState,
  rowId: number
) => state.walmartKeywordActionFilter.initialKeywordBid[rowId];

export const selectAllWalmartKeywordBid = (state: IRootState) =>
  state.walmartKeywordActionFilter.keywordBid;

export const selectWalmartKeywordActionSelectedRowIds = (state: IRootState) =>
  state.walmartKeywordActionFilter.selectedRowIds;

export const selectWalmartTrigger = (state: IRootState) =>
  state.walmartKeywordActionFilter.trigger;

export const selectIsWalmartRowEdited = (state: IRootState) =>
  state.walmartKeywordActionFilter.isRowEdited;

export const selectWalmartSelectedTab = (state: IRootState) =>
  state.walmartKeywordActionFilter.selectedTab;

export const selectWalmartSelectedTagId = (state: IRootState) =>
  state.walmartKeywordActionFilter.selectedTagId;

export const selectWalmartSelectedColumns = (state: IRootState) =>
  state.walmartKeywordActionFilter.selectedColumns;

export const selectWalmartBidErrorMessage = (state: IRootState) =>
  state.walmartKeywordActionFilter.bidErrorMessage;

const walmartKeywordActionFilterReducer =
  walmartKeywordActionFilterSlice.reducer;
export default walmartKeywordActionFilterReducer;
