import { marketplaceOptions } from '@/constants/sov.filter.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import accountUtils from '@/utils/settings/accounts/account.utils';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  IAccount,
  IUpdateMappedAccountsPinning,
  IUser,
  IUserAccountMapping,
} from 'src/interfaces/auth.interfaces';
import {
  getLastSelectedMarketplace,
  getSelectedAdvertisingAccount,
  getSelectedCatalogAccount,
  getSelectedDSPAccount,
} from 'src/utils/advertising.utils';
import { getSortedAccountsByPinValue } from 'src/utils/auth.utils';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import { getAdvertisingAccountOptions } from 'src/utils/marketplace-logo.utils';
import { IRootState } from '../../store';

export interface IAuthSlice {
  isAuthenticated: boolean;
  user: IUser | null;
  account: IAccount | null;
  mappedAccounts: IUserAccountMapping[];
  isSidebarMenuOpen: boolean;
  isChatbotOpen: boolean;
  isChatbotExpanded: boolean;
  isNavigating: boolean;
  pendingNavigationPath: string | null;
  advertisingAccount: {
    selected: IDropdownItem<string>;
    options: IDropdownItem<string>[];
  };
  dspAccount: {
    selected: IDropdownItem<string>;
    options: IDropdownItem<string>[];
  };
  catalogAccount: {
    selected: IDropdownItem<string>;
    options: IDropdownItem<string>[];
  };
  marketplace: {
    selected: IDropdownItem<string>;
    options: IDropdownItem<string>[];
  };
}

const getInitialState = () => {
  const initialState: IAuthSlice = {
    isAuthenticated: false,
    user: null,
    account: null,
    mappedAccounts: [],
    isSidebarMenuOpen: true,
    isChatbotOpen: false,
    isChatbotExpanded: false,
    isNavigating: false,
    pendingNavigationPath: null,
    advertisingAccount: {
      selected: getSelectedAdvertisingAccount(),
      options: getAdvertisingAccountOptions(),
    },
    catalogAccount: {
      selected: getSelectedCatalogAccount(),
      options: accountUtils.getCatalogAccountOptions(),
    },
    dspAccount: {
      selected: getSelectedDSPAccount(),
      options: accountUtils.getDspAccountOptions(),
    },
    marketplace: {
      selected: {
        label: getLastSelectedMarketplace(MarketplaceEnum.AMAZON),
        value: getLastSelectedMarketplace(MarketplaceEnum.AMAZON),
      },
      options: marketplaceOptions,
    },
  };
  return initialState;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
    },
    setAccount: (state, action: PayloadAction<IAccount | null>) => {
      const account = action.payload;
      state.account = account;
      localStorageUtils.setAccountDetails(account);
      localStorageUtils.setAccountId(action.payload?._id);
      localStorageUtils.setBrandNameVariations(
        account?.brandNameVariations ?? []
      );
    },
    setMappedAccounts: (
      state,
      action: PayloadAction<IUserAccountMapping[]>
    ) => {
      const sortedData = getSortedAccountsByPinValue(action.payload);
      state.mappedAccounts = sortedData;
      localStorageUtils.setMappedAccounts(sortedData);
    },
    setUpdatedMappedAccountsPinning: (
      state,
      action: PayloadAction<IUpdateMappedAccountsPinning>
    ) => {
      const updatedMappedAccounts = state.mappedAccounts.map((account) => {
        if (account.accountId._id === action.payload.accountId) {
          return {
            ...account,
            isPinned: action.payload.updatedPinValue,
          };
        }

        return account;
      });

      const sortedData = getSortedAccountsByPinValue(updatedMappedAccounts);
      state.mappedAccounts = sortedData;
      localStorageUtils.setMappedAccounts(sortedData);
    },
    resetAuth: (state, action: PayloadAction) => {
      Object.assign(state, getInitialState());
    },
    setIsSidebarMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarMenuOpen = action.payload;
    },
    setIsChatbotOpen: (state, action: PayloadAction<boolean>) => {
      state.isChatbotOpen = action.payload;
    },
    setIsChatbotExpanded: (state, action: PayloadAction<boolean>) => {
      state.isChatbotExpanded = action.payload;
    },
    setSelectedAdvertisingAccount: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      state.advertisingAccount.selected = action.payload;
    },
    setSelectedDSPAccount: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      state.dspAccount.selected = action.payload;
    },
    setAdvertisingAccountOptions: (
      state,
      action: PayloadAction<IDropdownItem<string>[]>
    ) => {
      state.advertisingAccount.options = action.payload;
    },
    setSelectedCatalogAccount: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      state.catalogAccount.selected = action.payload;
    },
    setCatalogAccountOptions: (
      state,
      action: PayloadAction<IDropdownItem<string>[]>
    ) => {
      state.catalogAccount.options = action.payload;
    },
    setDSPAccountOptions: (
      state,
      action: PayloadAction<IDropdownItem<string>[]>
    ) => {
      state.dspAccount.options = action.payload;
    },
    setSelectedMarketplace: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      state.marketplace.selected = action.payload;
    },
    setMarketplaceOptions: (
      state,
      action: PayloadAction<IDropdownItem<string>[]>
    ) => {
      state.marketplace.options = action.payload;
    },
    setIsNavigating: (state, action: PayloadAction<boolean>) => {
      state.isNavigating = action.payload;
    },
    setPendingNavigationPath: (state, action: PayloadAction<string | null>) => {
      state.pendingNavigationPath = action.payload;
    },
  },
});

export const {
  setIsAuthenticated,
  setUser,
  setAccount,
  setMappedAccounts,
  setUpdatedMappedAccountsPinning,
  resetAuth,
  setIsSidebarMenuOpen,
  setIsChatbotOpen,
  setIsChatbotExpanded,
  setSelectedAdvertisingAccount,
  setAdvertisingAccountOptions,
  setCatalogAccountOptions,
  setSelectedCatalogAccount,
  setSelectedMarketplace,
  setDSPAccountOptions,
  setMarketplaceOptions,
  setIsNavigating,
  setPendingNavigationPath,
  setSelectedDSPAccount,
} = authSlice.actions;
export const selectIsAuthenticated = (state: IRootState) =>
  state.auth.isAuthenticated;
export const selectUser = (state: IRootState) => state.auth.user;
export const selectAccount = (state: IRootState) => state.auth.account;
export const selectAccountId = (state: IRootState) => state.auth.account?._id;
export const selectMappedAccounts = (state: IRootState) =>
  state.auth.mappedAccounts;
export const selectIsDemoAccount = (state: IRootState) =>
  state.auth.account?.isDemoAccount || false;
export const selectIsSidebarMenuOpen = (state: IRootState) =>
  state.auth.isSidebarMenuOpen;
export const selectIsChatbotOpen = (state: IRootState) =>
  state.auth.isChatbotOpen;
export const selectIsChatbotExpanded = (state: IRootState) =>
  state.auth.isChatbotExpanded;
export const selectAdvertisingAccount = (state: IRootState) =>
  state.auth.advertisingAccount.selected;
export const selectDSPAccount = (state: IRootState) =>
  state.auth.dspAccount.selected;
export const selectAdvertisingAccountOptions = (state: IRootState) =>
  state.auth.advertisingAccount.options;
export const selectDspAccountOptions = (state: IRootState) =>
  state.auth.dspAccount.options;
export const selectCatalogAccount = (state: IRootState) =>
  state.auth.catalogAccount.selected;
export const selectCatalogAccountOptions = (state: IRootState) =>
  state.auth.catalogAccount.options;
export const selectMarketplace = (state: IRootState) =>
  state.auth.marketplace.selected;
export const selectMarketplaceOptions = (state: IRootState) =>
  state.auth.marketplace.options;
export const selectIsNavigating = (state: IRootState) =>
  state.auth.isNavigating;
export const selectPendingNavigationPath = (state: IRootState) =>
  state.auth.pendingNavigationPath;

const authReducer = authSlice.reducer;
export default authReducer;
