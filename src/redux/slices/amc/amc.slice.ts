import { genInstanceOptions } from '@/utils/amc.utils';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  IAMCGetInstanceRequestResponse,
  IAMCInstance,
  IThreadMessage,
} from 'src/interfaces/amc.interfaces';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import { IRootState } from '../../store';

interface IAMCFilterForm {
  selectedInstance: IDropdownItem<string> | null;
}

interface IAMCFilterOptions {
  instanceList: IDropdownItem<string>[];
}

interface IAMCInitialState {
  instanceRequest: IAMCGetInstanceRequestResponse | null | undefined;
  conversations: IThreadMessage[];
  isConversationLoading: boolean;
  filters: IAMCFilterForm;
  options: IAMCFilterOptions;
}

const initialState: IAMCInitialState = {
  instanceRequest: undefined,
  conversations: [],
  isConversationLoading: false,
  filters: {
    selectedInstance: null,
  },
  options: {
    instanceList: [],
  },
};

export const amcSlice = createSlice({
  name: 'amcSlice',
  initialState,
  reducers: {
    resetAmc: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setInstanceRequest: (
      state,
      action: PayloadAction<IAMCGetInstanceRequestResponse | null>
    ) => {
      state.instanceRequest = action.payload;
    },

    setAllInstances: (state, action: PayloadAction<IAMCInstance[]>) => {
      localStorageUtils.setAMCInstances(action.payload);
    },

    setInstanceOptions: (
      state,
      action: PayloadAction<IDropdownItem<string>[]>
    ) => {
      state.options.instanceList = action.payload;
    },

    setSelectedInstance: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      state.filters.selectedInstance = action.payload;
      localStorageUtils.setSelectedAMCInstance(action.payload);
    },

    setConversations: (state, action: PayloadAction<IThreadMessage[]>) => {
      state.conversations = action.payload;
    },

    setIsConversationLoading: (state, action: PayloadAction<boolean>) => {
      state.isConversationLoading = action.payload;
    },
    setAmcFilters: (state, action: PayloadAction<IAMCInstance[]>) => {
      const instanceOptions = genInstanceOptions(action.payload);
      state.options.instanceList = instanceOptions;
      const selectedInstance: IDropdownItem<string> = instanceOptions.length
        ? instanceOptions[0]
        : {
            label: 'Select',
            value: '',
          };
      state.filters.selectedInstance = selectedInstance;
      localStorageUtils.setSelectedAMCInstance(selectedInstance);
    },
  },
});

export const {
  resetAmc,
  setInstanceRequest,
  setAllInstances,
  setConversations,
  setIsConversationLoading,
  setInstanceOptions,
  setSelectedInstance,
  setAmcFilters,
} = amcSlice.actions;

export const selectInstanceRequest = (state: IRootState) =>
  state.amc.instanceRequest;

export const selectAMCOptions = (state: IRootState) => state.amc.options;

export const selectAMCFilters = (state: IRootState) => state.amc.filters;
export const selectSelectedInstance = (state: IRootState) =>
  state.amc.filters.selectedInstance;

export const selectConversations = (state: IRootState) =>
  state.amc.conversations;

export const selectIsConversationLoading = (state: IRootState) =>
  state.amc.isConversationLoading;

const amcReducer = amcSlice.reducer;
export default amcReducer;
