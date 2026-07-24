import { IOverallAdvertisingData } from '@/interfaces/advertising/amazon/overall-advertising.interface';
import { ISBAdvertisingData } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDAdvertisingData } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { ISPAdvertisingData } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IErrorMessageDetails } from '@/interfaces/edit-access/edit-access.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RowSelectionState } from '@tanstack/react-table';
import { ITabData } from 'src/app/components/common/tabs-select/tabs-select';
import { advEditAccessTabData } from 'src/constants/advertising-filter.constants';
import { IWalmartOverallAdvertisingData } from 'src/interfaces/advertising/walmart/walmart-overall-advertising.interface';
import { IWalmartSBAdvertisingData } from 'src/interfaces/advertising/walmart/walmart-sb-advertising.interface';
import { IWalmartSPAdvertisingData } from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IWalmartSVAdvertisingData } from 'src/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import {
  getAdvertisingTableFromMap,
  getAdvertisingTableMap,
  updateErrorList,
} from 'src/utils/advertising.utils';
import { IRootState } from '../../store';

interface IEditAccessFilterForm {
  editAccess: ITabData;
}

interface IEditAccessFilterOptions {
  editAccess: ITabData[];
}

export interface IRowErrorMessage {
  id: string | number;
  message: string;
}

interface IEditAccessFilterState {
  filters: IEditAccessFilterForm;
  options: IEditAccessFilterOptions;
  isOpenEndDateDialog: boolean;
  isOpenBiddingStrategyDialog: boolean;
  isOpenBudgetDialog: boolean;
  isOpenBidDialog: boolean;
  isOpenBidderDialog: boolean;
  isOpenTotalBudgetDialog: boolean;
  isOpenTagDialog: boolean;
  isAdGroupLevelApplied: boolean;
  initialState:
    | ISPAdvertisingData[]
    | ISBAdvertisingData[]
    | ISDAdvertisingData[]
    | IOverallAdvertisingData[]
    | IWalmartSPAdvertisingData[]
    | IWalmartSBAdvertisingData[]
    | IWalmartSVAdvertisingData[]
    | IWalmartOverallAdvertisingData[];
  editState:
    | ISPAdvertisingData[]
    | ISBAdvertisingData[]
    | ISDAdvertisingData[]
    | IOverallAdvertisingData[]
    | IWalmartSPAdvertisingData[]
    | IWalmartSBAdvertisingData[]
    | IWalmartSVAdvertisingData[]
    | IWalmartOverallAdvertisingData[];
  selectedRows: RowSelectionState;
  selectedRowIds: Array<string | number>;
  tableRowWarnMessage?: Record<string | number, IRowErrorMessage>;
  totalBudgetWarnMessage?: Record<string | number, IRowErrorMessage>;
  dailyBudgetWarnMessage?: Record<string | number, IRowErrorMessage>;
  minBidWarnMessage?: Record<string | number, IRowErrorMessage>;
  maxBidWarnMessage?: Record<string | number, IRowErrorMessage>;
  targetRoASWarnMessage?: Record<string | number, IRowErrorMessage>;
  tosPercentageWarnMessage?: Record<string | number, IRowErrorMessage>;
  ppPercentageWarnMessage?: Record<string | number, IRowErrorMessage>;
  rosPercentageWarnMessage?: Record<string | number, IRowErrorMessage>;
  keywordBidWarnMessage?: Record<string | number, IRowErrorMessage>;
  itemBidWarnMessage?: Record<string | number, IRowErrorMessage>;
  targetBidWarnMessage?: Record<string | number, IRowErrorMessage>;
  dailyBudgetLimitErr?: Record<string | number, IRowErrorMessage>;
  totalBudgetLimitErr?: Record<string | number, IRowErrorMessage>;
  bidLimitErr?: Record<string | number, IRowErrorMessage>;
  nameErr?: Record<string | number, IRowErrorMessage>;
  errors: IErrorMessageDetails | null;
}

const initialState: IEditAccessFilterState = {
  filters: {
    editAccess: advEditAccessTabData[0],
  },
  options: {
    editAccess: advEditAccessTabData,
  },
  isOpenEndDateDialog: false,
  isOpenBiddingStrategyDialog: false,
  isOpenBudgetDialog: false,
  isOpenBidDialog: false,
  isOpenTotalBudgetDialog: false,
  isOpenBidderDialog: false,
  isOpenTagDialog: false,
  isAdGroupLevelApplied: false,
  initialState: [],
  editState: [],
  selectedRows: {},
  selectedRowIds: [],
  tableRowWarnMessage: {},
  totalBudgetWarnMessage: {},
  dailyBudgetWarnMessage: {},
  minBidWarnMessage: {},
  maxBidWarnMessage: {},
  targetRoASWarnMessage: {},
  tosPercentageWarnMessage: {},
  ppPercentageWarnMessage: {},
  rosPercentageWarnMessage: {},
  keywordBidWarnMessage: {},
  itemBidWarnMessage: {},
  targetBidWarnMessage: {},
  dailyBudgetLimitErr: {},
  totalBudgetLimitErr: {},
  bidLimitErr: {},
  nameErr: {},
  errors: null,
};
export const advEditAccess = createSlice({
  name: 'advEditAccess',
  initialState,
  reducers: {
    resetAdvEditAccess: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setEditAccess: (state, action: PayloadAction<ITabData>) => {
      state.filters.editAccess = action.payload;
    },
    resetEditAccessFilters: (state, action: PayloadAction) => {
      state.filters = {
        editAccess: advEditAccessTabData[0],
      };
      state.selectedRows = {};
      state.selectedRowIds = [];
      state.isOpenEndDateDialog = false;
      state.isOpenBiddingStrategyDialog = false;
      state.isOpenBudgetDialog = false;
      state.isOpenTotalBudgetDialog = false;
      state.isOpenBidDialog = false;
      state.isOpenTagDialog = false;
      state.isOpenBidderDialog = false;
      state.isAdGroupLevelApplied = false;
      state.errors = null;
    },
    resetDialogs: (state, action: PayloadAction) => {
      state.isOpenEndDateDialog = false;
      state.isOpenBiddingStrategyDialog = false;
      state.isOpenBudgetDialog = false;
      state.isOpenTotalBudgetDialog = false;
      state.isOpenBidDialog = false;
      state.isOpenBidderDialog = false;
      state.isOpenTagDialog = false;
    },
    setIsOpenEndDateDialog: (state, action: PayloadAction) => {
      state.isOpenEndDateDialog = !state.isOpenEndDateDialog;
      state.isOpenBiddingStrategyDialog = false;
      state.isOpenBudgetDialog = false;
      state.isOpenTotalBudgetDialog = false;
      state.isOpenBidDialog = false;
      state.isOpenBidderDialog = false;
      state.isOpenTagDialog = false;
    },
    setIsOpenBiddingStrategyDialog: (state, action: PayloadAction) => {
      state.isOpenEndDateDialog = false;
      state.isOpenBiddingStrategyDialog = !state.isOpenBiddingStrategyDialog;
      state.isOpenBudgetDialog = false;
      state.isOpenTotalBudgetDialog = false;
      state.isOpenBidDialog = false;
      state.isOpenBidderDialog = false;
      state.isOpenTagDialog = false;
    },
    setIsOpenBudgetDialog: (state, action: PayloadAction) => {
      state.isOpenEndDateDialog = false;
      state.isOpenBiddingStrategyDialog = false;
      state.isOpenBudgetDialog = !state.isOpenBudgetDialog;
      state.isOpenTotalBudgetDialog = false;
      state.isOpenBidDialog = false;
      state.isOpenBidderDialog = false;
      state.isOpenTagDialog = false;
    },
    setIsOpenTotalBudgetDialog: (state, action: PayloadAction) => {
      state.isOpenEndDateDialog = false;
      state.isOpenBiddingStrategyDialog = false;
      state.isOpenBudgetDialog = false;
      state.isOpenTotalBudgetDialog = !state.isOpenTotalBudgetDialog;
      state.isOpenBidDialog = false;
      state.isOpenBidderDialog = false;
      state.isOpenTagDialog = false;
    },
    setIsOpenBidDialog: (state, action: PayloadAction) => {
      state.isOpenEndDateDialog = false;
      state.isOpenBiddingStrategyDialog = false;
      state.isOpenBudgetDialog = false;
      state.isOpenTotalBudgetDialog = false;
      state.isOpenBidDialog = !state.isOpenBidDialog;
      state.isOpenBidderDialog = false;
      state.isOpenTagDialog = false;
    },
    setIsOpenBidderDialog: (state, action: PayloadAction) => {
      state.isOpenEndDateDialog = false;
      state.isOpenBiddingStrategyDialog = false;
      state.isOpenBudgetDialog = false;
      state.isOpenTotalBudgetDialog = false;
      state.isOpenBidDialog = false;
      state.isOpenBidderDialog = !state.isOpenBidderDialog;
      state.isOpenTagDialog = false;
    },
    setIsOpenTagDialog: (state, action: PayloadAction<boolean>) => {
      state.isOpenEndDateDialog = false;
      state.isOpenBiddingStrategyDialog = false;
      state.isOpenBudgetDialog = false;
      state.isOpenTotalBudgetDialog = false;
      state.isOpenBidDialog = false;
      state.isOpenBidderDialog = false;
      // state.isOpenTagDialog = !state.isOpenTagDialog;
      state.isOpenTagDialog = action.payload;
    },
    setInitialState: (
      state,
      action: PayloadAction<
        | ISPAdvertisingData[]
        | ISBAdvertisingData[]
        | ISDAdvertisingData[]
        | IOverallAdvertisingData[]
        | IWalmartSPAdvertisingData[]
        | IWalmartSBAdvertisingData[]
        | IWalmartSVAdvertisingData[]
        | IWalmartOverallAdvertisingData[]
      >
    ) => {
      state.initialState = action.payload;
    },
    setEditState: (
      state,
      action: PayloadAction<
        | ISPAdvertisingData[]
        | ISBAdvertisingData[]
        | ISDAdvertisingData[]
        | IOverallAdvertisingData[]
        | IWalmartSPAdvertisingData[]
        | IWalmartSBAdvertisingData[]
        | IWalmartSVAdvertisingData[]
        | IWalmartOverallAdvertisingData[]
      >
    ) => {
      state.editState = action.payload;
    },
    setEditStateRow: (
      state,
      action: PayloadAction<{
        id: string;
        row:
          | ISPAdvertisingData
          | ISBAdvertisingData
          | ISDAdvertisingData
          | IOverallAdvertisingData
          | IWalmartSPAdvertisingData
          | IWalmartSBAdvertisingData
          | IWalmartSVAdvertisingData
          | IWalmartOverallAdvertisingData;
      }>
    ) => {
      const editStateMap = getAdvertisingTableMap(state.editState);
      editStateMap.set(`${action.payload.id}`, action.payload.row);
      state.editState = getAdvertisingTableFromMap(editStateMap) as
        | ISPAdvertisingData[]
        | ISBAdvertisingData[]
        | ISDAdvertisingData[]
        | IOverallAdvertisingData[]
        | IWalmartSPAdvertisingData[]
        | IWalmartSBAdvertisingData[]
        | IWalmartSVAdvertisingData[]
        | IWalmartOverallAdvertisingData[];
    },
    setSelectedRows: (state, action: PayloadAction<RowSelectionState>) => {
      state.selectedRows = action.payload;

      const _selectedRows = action.payload;
      state.selectedRowIds =
        Object.entries(_selectedRows)
          .filter(([key, value]) => value === true)
          .map(([key, value]) => key) ?? [];
    },
    setTableRowErrMessage: (state, action: PayloadAction<IRowErrorMessage>) => {
      const list = state.tableRowWarnMessage
        ? { ...state.tableRowWarnMessage }
        : {};
      state.tableRowWarnMessage = updateErrorList(list, action.payload);
    },
    setTotalBudgetErrMessage: (
      state,
      action: PayloadAction<IRowErrorMessage>
    ) => {
      const list = state.totalBudgetWarnMessage
        ? { ...state.totalBudgetWarnMessage }
        : {};
      state.totalBudgetWarnMessage = updateErrorList(list, action.payload);
    },
    setDailyBudgetErrMessage: (
      state,
      action: PayloadAction<IRowErrorMessage>
    ) => {
      const list = state.dailyBudgetWarnMessage
        ? { ...state.dailyBudgetWarnMessage }
        : {};
      state.dailyBudgetWarnMessage = updateErrorList(list, action.payload);
    },
    setMinBidErrMessage: (state, action: PayloadAction<IRowErrorMessage>) => {
      const list = state.minBidWarnMessage
        ? { ...state.minBidWarnMessage }
        : {};
      state.minBidWarnMessage = updateErrorList(list, action.payload);
    },
    setMaxBidErrMessage: (state, action: PayloadAction<IRowErrorMessage>) => {
      const list = state.maxBidWarnMessage
        ? { ...state.maxBidWarnMessage }
        : {};
      state.maxBidWarnMessage = updateErrorList(list, action.payload);
    },
    setTargetRoASErrMessage: (
      state,
      action: PayloadAction<IRowErrorMessage>
    ) => {
      const list = state.targetRoASWarnMessage
        ? { ...state.targetRoASWarnMessage }
        : {};
      state.targetRoASWarnMessage = updateErrorList(list, action.payload);
    },
    setTOSPercentageErrMessage: (
      state,
      action: PayloadAction<IRowErrorMessage>
    ) => {
      const list = state.tosPercentageWarnMessage
        ? { ...state.tosPercentageWarnMessage }
        : {};
      state.tosPercentageWarnMessage = updateErrorList(list, action.payload);
    },
    setPPPercentageErrMessage: (
      state,
      action: PayloadAction<IRowErrorMessage>
    ) => {
      const list = state.ppPercentageWarnMessage
        ? { ...state.ppPercentageWarnMessage }
        : {};
      state.ppPercentageWarnMessage = updateErrorList(list, action.payload);
    },
    setROSPercentageErrMessage: (
      state,
      action: PayloadAction<IRowErrorMessage>
    ) => {
      const list = state.rosPercentageWarnMessage
        ? { ...state.rosPercentageWarnMessage }
        : {};
      state.rosPercentageWarnMessage = updateErrorList(list, action.payload);
    },
    setDailyBudgetLimitErr: (
      state,
      action: PayloadAction<IRowErrorMessage>
    ) => {
      const list = state.dailyBudgetLimitErr
        ? { ...state.dailyBudgetLimitErr }
        : {};
      state.dailyBudgetLimitErr = updateErrorList(list, action.payload);
    },
    setTotalBudgetLimitErr: (
      state,
      action: PayloadAction<IRowErrorMessage>
    ) => {
      const list = state.totalBudgetLimitErr
        ? { ...state.totalBudgetLimitErr }
        : {};
      state.totalBudgetLimitErr = updateErrorList(list, action.payload);
    },
    setBidLimitErr: (state, action: PayloadAction<IRowErrorMessage>) => {
      const list = state.bidLimitErr ? { ...state.bidLimitErr } : {};
      state.bidLimitErr = updateErrorList(list, action.payload);
    },
    setNameErr: (state, action: PayloadAction<IRowErrorMessage>) => {
      const list = state.nameErr ? { ...state.nameErr } : {};
      state.nameErr = updateErrorList(list, action.payload);
    },
    resetErrorMessages: (state, action: PayloadAction) => {
      state.tableRowWarnMessage = {};
      state.totalBudgetWarnMessage = {};
      state.dailyBudgetWarnMessage = {};
      state.minBidWarnMessage = {};
      state.maxBidWarnMessage = {};
      state.targetRoASWarnMessage = {};
      state.tosPercentageWarnMessage = {};
      state.ppPercentageWarnMessage = {};
      state.rosPercentageWarnMessage = {};
      state.keywordBidWarnMessage = {};
      state.itemBidWarnMessage = {};
      state.targetBidWarnMessage = {};
      state.dailyBudgetLimitErr = {};
      state.totalBudgetLimitErr = {};
      state.bidLimitErr = {};
      state.nameErr = {};
    },
    setIsAdGroupLevelApplied: (state, action: PayloadAction<boolean>) => {
      state.isAdGroupLevelApplied = action.payload;
    },
    setAdvertisingErrorDetails: (
      state,
      action: PayloadAction<IErrorMessageDetails | null>
    ) => {
      state.errors = action.payload;
    },
  },
});

export const {
  resetAdvEditAccess,
  setEditAccess,
  resetEditAccessFilters,
  resetDialogs,
  setIsOpenEndDateDialog,
  setIsOpenBiddingStrategyDialog,
  setIsOpenBudgetDialog,
  setIsOpenTotalBudgetDialog,
  setIsOpenBidDialog,
  setIsOpenBidderDialog,
  setIsOpenTagDialog,
  setInitialState,
  setEditState,
  setEditStateRow,
  setSelectedRows,
  setTableRowErrMessage,
  setTotalBudgetErrMessage,
  setDailyBudgetErrMessage,
  setMinBidErrMessage,
  setMaxBidErrMessage,
  setTargetRoASErrMessage,
  setTOSPercentageErrMessage,
  setPPPercentageErrMessage,
  setROSPercentageErrMessage,
  setDailyBudgetLimitErr,
  setTotalBudgetLimitErr,
  setBidLimitErr,
  setNameErr,
  resetErrorMessages,
  setIsAdGroupLevelApplied,
  setAdvertisingErrorDetails,
} = advEditAccess.actions;

export const selectEditAccessFilters = (state: IRootState) =>
  state.advEditAccess.filters;
export const selectEditAccessOptions = (state: IRootState) =>
  state.advEditAccess.options;
export const selectIsOpenEndDateDialog = (state: IRootState) =>
  state.advEditAccess.isOpenEndDateDialog;
export const selectIsOpenBiddingStrategyDialog = (state: IRootState) =>
  state.advEditAccess.isOpenBiddingStrategyDialog;
export const selectIsOpenBudgetDialog = (state: IRootState) =>
  state.advEditAccess.isOpenBudgetDialog;
export const selectIsOpenTotalBudgetDialog = (state: IRootState) =>
  state.advEditAccess.isOpenTotalBudgetDialog;
export const selectIsOpenBidDialog = (state: IRootState) =>
  state.advEditAccess.isOpenBidDialog;
export const selectIsOpenBidderDialog = (state: IRootState) =>
  state.advEditAccess.isOpenBidderDialog;
export const selectIsOpenTagDialog = (state: IRootState) =>
  state.advEditAccess.isOpenTagDialog;
export const selectInitialState = (state: IRootState) =>
  state.advEditAccess.initialState;
export const selectEditState = (state: IRootState) =>
  state.advEditAccess.editState;
export const selectSelectedRows = (state: IRootState) =>
  state.advEditAccess.selectedRows;
export const selectSelectedRowIds = (state: IRootState) =>
  state.advEditAccess.selectedRowIds;
export const selectTableRowErrMessage = (state: IRootState) =>
  state.advEditAccess.tableRowWarnMessage;
export const selectTotalBudgetErrMessage = (state: IRootState) =>
  state.advEditAccess.totalBudgetWarnMessage;
export const selectDailyBudgetErrMessage = (state: IRootState) =>
  state.advEditAccess.dailyBudgetWarnMessage;

export const selectKeywordBidErrMessage = (state: IRootState) =>
  state.advEditAccess.keywordBidWarnMessage;

export const selectItemBidErrMessage = (state: IRootState) =>
  state.advEditAccess.itemBidWarnMessage;

export const selectMinBidErrMessage = (state: IRootState) =>
  state.advEditAccess.minBidWarnMessage;

export const selectMaxBidErrMessage = (state: IRootState) =>
  state.advEditAccess.maxBidWarnMessage;

export const selectTargetRoASErrMessage = (state: IRootState) =>
  state.advEditAccess.targetRoASWarnMessage;

export const selectTOSPercentageErrMessage = (state: IRootState) =>
  state.advEditAccess.tosPercentageWarnMessage;

export const selectPPPercentageErrMessage = (state: IRootState) =>
  state.advEditAccess.ppPercentageWarnMessage;

export const selectROSPercentageErrMessage = (state: IRootState) =>
  state.advEditAccess.rosPercentageWarnMessage;

export const selectDailyBudgetLimitErr = (state: IRootState) =>
  state.advEditAccess.dailyBudgetLimitErr;
export const selectTotalBudgetLimitErr = (state: IRootState) =>
  state.advEditAccess.totalBudgetLimitErr;
export const selectBidLimitErr = (state: IRootState) =>
  state.advEditAccess.bidLimitErr;
export const selectNameErr = (state: IRootState) => state.advEditAccess.nameErr;
export const selectIsAdGroupLevelApplied = (state: IRootState) =>
  state.advEditAccess.isAdGroupLevelApplied;
export const selectAdvertisingErrors = (state: IRootState) =>
  state.advEditAccess.errors;

const advEditAccessReducer = advEditAccess.reducer;
export default advEditAccessReducer;
