import { IErrorResultDetails } from '@/interfaces/service.interface';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TOAST_AUTO_CLEAR_TIME } from 'src/constants';
import { TOAST_MESSAGE_TYPES } from 'src/enums/toast.enums';
import { IRootState } from '../../store';

export interface IToastMessageState {
  title: string;
  description: string;
  errData?: IErrorResultDetails | null;
  type: TOAST_MESSAGE_TYPES;
  autoClear?: boolean;
  autoClearTime?: number; // in milliseconds
}

export interface IToastMessageSlice {
  toastMessages: IToastMessageState[];
}

const initialState: IToastMessageSlice = {
  toastMessages: [],
};

export const toastMessageSlice = createSlice({
  name: 'toastMessage',
  initialState,
  reducers: {
    resetToastMessage: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    resetToastMessageWithAutoClear: (state, action: PayloadAction) => {
      state.toastMessages = state.toastMessages.filter(
        (toast) => toast.autoClear === false
      );
    },
    resetToastMessageAutoClearTimer: (
      state,
      action: PayloadAction<{ index: number }>
    ) => {
      if (action.payload.index !== -1) {
        state.toastMessages[action.payload.index] = {
          ...state.toastMessages[action.payload.index],
          autoClear: true,
          autoClearTime: TOAST_AUTO_CLEAR_TIME,
        };
      }
    },
    showToastMessage: (state, action: PayloadAction<IToastMessageState>) => {
      state.toastMessages.push(action.payload);
    },
    clearToastMessage: (state, action: PayloadAction<number>) => {
      state.toastMessages.splice(action.payload, 1);
    },
    showErrorToastMessage: (
      state,
      action: PayloadAction<{
        title: string;
        description?: string;
        errData?: IErrorResultDetails | null;
      }>
    ) => {
      const errorMessage: IToastMessageState = {
        title: action.payload.title,
        description: action.payload.description || '',
        errData: action.payload.errData,
        autoClear: true,
        autoClearTime: TOAST_AUTO_CLEAR_TIME,
        type: TOAST_MESSAGE_TYPES.ERROR,
      };
      state.toastMessages.push(errorMessage);
    },
    showWarningToastMessage: (
      state,
      action: PayloadAction<{ title: string; description?: string }>
    ) => {
      const warningMessage: IToastMessageState = {
        title: action.payload.title,
        description: action.payload.description || '',
        autoClear: true,
        autoClearTime: TOAST_AUTO_CLEAR_TIME,
        type: TOAST_MESSAGE_TYPES.WARNING,
      };
      state.toastMessages.push(warningMessage);
    },
    showInfoToastMessage: (
      state,
      action: PayloadAction<{ title: string; description?: string }>
    ) => {
      const showInfoToastMessage: IToastMessageState = {
        title: action.payload.title,
        description: action.payload.description || '',
        autoClear: true,
        autoClearTime: TOAST_AUTO_CLEAR_TIME,
        type: TOAST_MESSAGE_TYPES.INFO,
      };
      state.toastMessages.push(showInfoToastMessage);
    },
    showSuccessToastMessage: (
      state,
      action: PayloadAction<{ title: string; description?: string }>
    ) => {
      const successMessage: IToastMessageState = {
        title: action.payload.title,
        description: action.payload.description || '',
        autoClear: true,
        autoClearTime: TOAST_AUTO_CLEAR_TIME,
        type: TOAST_MESSAGE_TYPES.SUCCESS,
      };
      state.toastMessages.push(successMessage);
    },
  },
});

export const {
  resetToastMessage,
  resetToastMessageWithAutoClear,
  resetToastMessageAutoClearTimer,
  showToastMessage,
  clearToastMessage,
  showErrorToastMessage,
  showSuccessToastMessage,
  showInfoToastMessage,
  showWarningToastMessage,
} = toastMessageSlice.actions;
export const selectToastMessages = (state: IRootState) =>
  state.toastMessage.toastMessages;

const toastMessageReducer = toastMessageSlice.reducer;
export default toastMessageReducer;
