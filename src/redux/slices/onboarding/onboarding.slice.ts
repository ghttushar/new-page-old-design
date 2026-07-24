import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IIsAdvertisingConnected } from 'src/interfaces/onboarding.interface';
import { IRootState } from 'src/redux/store';

export interface IOnboardingStep {
  id: OnboardingStep;
  title: string;
}
export interface IOnboardingState {
  stepsData: IOnboardingStep[];
  fillIndex: number;
  activeStep: string;
  integrateAmazon: boolean;
  integrateWalmart: boolean;
  isAmazonAdvertisingConnected: {
    isAdvertisingConnected: boolean;
    isSPDataConnected: boolean;
  };
  isWmtConnectFormOpen: boolean;

  isWalmartAdvertisingConnected: {
    isAdvertisingConnected: boolean;
    isSPDataConnected: boolean;
  };
}

export enum OnboardingStep {
  AMAZON_ADS = 'amazon-ads',
  AMAZON_SELLER = 'amazon-seller',
  COMPLETED = 'completed',
}

export const initialState: IOnboardingState = {
  stepsData: [
    {
      id: OnboardingStep.AMAZON_ADS,
      title: 'Connect Amazon Ads Account',
    },
    {
      id: OnboardingStep.AMAZON_SELLER,
      title: 'Connect SP Account',
    },
    {
      id: OnboardingStep.COMPLETED,
      title: 'Completed',
    },
  ],
  isWmtConnectFormOpen: false,
  fillIndex: 0,
  integrateAmazon: false,
  integrateWalmart: false,
  activeStep: OnboardingStep.AMAZON_ADS,
  isAmazonAdvertisingConnected: {
    isAdvertisingConnected: false,
    isSPDataConnected: false,
  },

  isWalmartAdvertisingConnected: {
    isAdvertisingConnected: false,
    isSPDataConnected: false,
  },
};

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    resetOnboarding: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setFillIndex: (state, action: PayloadAction<number>) => {
      state.fillIndex = action.payload;
    },
    setActiveStep: (state, action: PayloadAction<OnboardingStep>) => {
      state.activeStep = action.payload;
    },
    setIsAmazonAdvertisingConnected: (
      state,
      action: PayloadAction<IIsAdvertisingConnected>
    ) => {
      state.isAmazonAdvertisingConnected = action.payload;
    },
    setIsWalmartAdvertisingConnected: (
      state,
      action: PayloadAction<IIsAdvertisingConnected>
    ) => {
      state.isWalmartAdvertisingConnected = action.payload;
    },

    setIsIntegrateAmazon: (state, action: PayloadAction<boolean>) => {
      state.integrateAmazon = action.payload;
    },
    setIsIntegrateWalmart: (state, action: PayloadAction<boolean>) => {
      state.integrateWalmart = action.payload;
    },

    setIsWmtConnectFormOpen: (state, action: PayloadAction<boolean>) => {
      state.isWmtConnectFormOpen = action.payload;
    },
  },
});

export const {
  resetOnboarding,
  setFillIndex,
  setActiveStep,
  setIsAmazonAdvertisingConnected,
  setIsIntegrateAmazon,
  setIsIntegrateWalmart,
  setIsWalmartAdvertisingConnected,
  setIsWmtConnectFormOpen,
} = onboardingSlice.actions;

export const selectFillIndex = (state: IRootState) =>
  state.onboarding.fillIndex;

export const selectActiveStep = (state: IRootState) =>
  state.onboarding.activeStep;

export const selectIsWmtConnectFormOpen = (state: IRootState) =>
  state.onboarding.isWmtConnectFormOpen;

export const selectIsAmazonAdvertisingConnected = (state: IRootState) =>
  state.onboarding.isAmazonAdvertisingConnected;
export const selectIsWalmartAdvertisingConnected = (state: IRootState) =>
  state.onboarding.isWalmartAdvertisingConnected;
export const selectStepsData = (state: IRootState) =>
  state.onboarding.stepsData;

export const selectIsIntegrateAmazon = (state: IRootState) =>
  state.onboarding.integrateAmazon;
export const selectIsIntegrateWalmart = (state: IRootState) =>
  state.onboarding.integrateWalmart;

const onboardingReducer = onboardingSlice.reducer;
export default onboardingReducer;
