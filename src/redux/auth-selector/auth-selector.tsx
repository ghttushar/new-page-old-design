import { CountryCodeEnum } from '@/enums/advertising.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import marketIntelligenceUtils from '@/utils/market-intelligence/market-intelligence.utils';
import accountUtils from '@/utils/settings/accounts/account.utils';
import { useNavigate } from 'react-router-dom';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  HOME_URL,
  LOGIN_URL,
  SELECT_ACCOUNT_URL,
} from 'src/constants/urls.constants';
import { IUser } from 'src/interfaces/auth.interfaces';
import { ISettingsAccount } from 'src/interfaces/settings.interface';
import {
  getSelectedAdvertisingAccount,
  getSelectedAdvertisingAccountByDropdownValue,
  getSelectedCatalogAccount,
  getSelectedCatalogAccountByDropdownValue,
  getSelectedDSPAccount,
  getSelectedDSPAccountByDropdownValue,
  setLastSelectedAccount,
} from 'src/utils/advertising.utils';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import { getAdvertisingAccountOptions } from 'src/utils/marketplace-logo.utils';
import { useAppDispatch, useAppSelector } from '../hooks';
import { resetAdvertisingCreateEntity } from '../slices/advertising/advertising-create-entity.slice';
import { resetAdvEditAccess } from '../slices/advertising/advertising-edit-access.slice';
import { resetAdvertisingFilterStates } from '../slices/advertising/advertising-filter.slice';
import { resetAdvertisingOverallFilterStates } from '../slices/advertising/advertising-overall-filter.slice';
import { resetAdvertisingSBFilterStates } from '../slices/advertising/advertising-sb-filter.slice';
import { resetAdvertisingSDFilterStates } from '../slices/advertising/advertising-sd-filter.slice';
import { resetSubHeaderOptions } from '../slices/advertising/sub-header.slice';
import { resetWalmartOverallAdvertisingFilterStates } from '../slices/advertising/walmart/advertising-walmart-overall.slice';
import { resetWalmartSBAdvertisingFilterStates } from '../slices/advertising/walmart/advertising-walmart-sb.slice';
import { resetWalmartSPAdvertisingFilterStates } from '../slices/advertising/walmart/advertising-walmart-sp.slice';
import { resetWalmartSVAdvertisingFilterStates } from '../slices/advertising/walmart/advertising-walmart-sv.slice';
import { resetWalmartAdvertisingStates } from '../slices/advertising/walmart/advertising-walmart.slice';
import { resetAmc } from '../slices/amc/amc.slice';
import {
  resetAuth,
  selectUser,
  setAccount,
  setAdvertisingAccountOptions,
  setCatalogAccountOptions,
  setDSPAccountOptions,
  setIsAuthenticated,
  setMappedAccounts,
  setSelectedAdvertisingAccount,
  setSelectedCatalogAccount,
  setSelectedDSPAccount,
  setSelectedMarketplace,
  setUser,
} from '../slices/auth/auth.slice';
import { resetCatalogFilterStates } from '../slices/catalog/catalog.slice';
import { resetDayPartingFilterStates } from '../slices/day-parting/day-parting.slice';
import { resetFilters } from '../slices/filters/filter.slice';
import { resetAnalysis } from '../slices/impact-analysis/impact-analysis.slice';
import { resetKeywordNegation } from '../slices/keyword-action/amazon/keyword-action-negation.slice';
import { resetKeywordActionFilterStates } from '../slices/keyword-action/amazon/keyword-action.slice';
import { resetLogFilterStates } from '../slices/logs/logs.slice';
import { resetKeywordSovFilterStates } from '../slices/market-intelligence/keyword-sov-filter.slice';
import { resetMarketIntelligence } from '../slices/market-intelligence/market-intelligence.slice';
import { resetProductSovFilterStates } from '../slices/market-intelligence/product-sov-filter.slice';
import { resetSovFilterStates } from '../slices/market-intelligence/sov-filter.slice';
import { resetToastMessage } from '../slices/notifications/toast-message.slice';
import { resetOnboarding } from '../slices/onboarding/onboarding.slice';

import SessionServices from 'src/services/session.service';
import { resetChatbotState } from '../chatbot/chatbot.slice';
import { resetProfitabilityFilterState } from '../slices/profitability/profitability.slice';
import { resetRuleState } from '../slices/rules/rules.slice';
import { resetTaggingState } from '../slices/tagging/tagging.slice';

export const useAuthSelector = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);

  const resetStore = () => {
    dispatch(resetAuth());
    dispatch(resetAdvEditAccess());
    dispatch(resetAdvertisingOverallFilterStates());
    dispatch(resetAdvertisingFilterStates());
    dispatch(resetAdvertisingSBFilterStates());
    dispatch(resetAdvertisingSDFilterStates());
    dispatch(resetAmc());
    dispatch(resetFilters());
    dispatch(resetAnalysis());
    dispatch(resetKeywordNegation());
    dispatch(resetKeywordActionFilterStates());
    dispatch(resetKeywordSovFilterStates());
    dispatch(resetMarketIntelligence());
    dispatch(resetProductSovFilterStates());
    dispatch(resetSovFilterStates());
    dispatch(resetToastMessage());
    dispatch(resetOnboarding());
    dispatch(resetDayPartingFilterStates());
    dispatch(resetWalmartAdvertisingStates());
    dispatch(resetWalmartSPAdvertisingFilterStates());
    dispatch(resetWalmartSBAdvertisingFilterStates());
    dispatch(resetWalmartSVAdvertisingFilterStates());
    dispatch(resetWalmartOverallAdvertisingFilterStates());
    dispatch(resetAdvertisingCreateEntity());
    dispatch(resetCatalogFilterStates());
    dispatch(resetSubHeaderOptions());
    dispatch(resetLogFilterStates());
    dispatch(resetRuleState());
    dispatch(resetProfitabilityFilterState());
    dispatch(resetChatbotState());
    dispatch(resetTaggingState());
  };

  const login = (user: IUser, authToken: string, navigateToHome = true) => {
    const account = localStorageUtils.getAccountDetails();
    const mappedAccounts = localStorageUtils.getMappedAccounts();
    resetStore();
    dispatch(setIsAuthenticated(true));
    dispatch(setUser(user));
    dispatch(setAccount(account));
    localStorageUtils.setAuthToken(authToken);
    dispatch(setMappedAccounts(mappedAccounts));
    if (navigateToHome) navigate(HOME_URL);
  };

  const logout = async (navigateToLogin = true) => {
    if (navigateToLogin) {
      try {
        await SessionServices.logout();
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    resetStore();
    localStorageUtils.clearLocalStorage();
    if (navigateToLogin) navigate(LOGIN_URL);
  };
  const setAdvertisingAccount = (value: IDropdownItem<string>) => {
    const selectedAdvertisingAccount =
      getSelectedAdvertisingAccountByDropdownValue(value.value);
    localStorageUtils.setSelectedAdvertisingAccount(
      selectedAdvertisingAccount as ISettingsAccount
    );
    setLastSelectedAccount(
      selectedAdvertisingAccount as ISettingsAccount,
      value.marketplace as MarketplaceEnum
    );

    const countryCode =
      selectedAdvertisingAccount?.advertising?.countryCode ??
      selectedAdvertisingAccount?.catalog?.countryCode ??
      CountryCodeEnum.UnitedStates;

    localStorageUtils.setAccountCountryCode(countryCode);
    localStorageUtils.setMIAccountCountryCode(countryCode);
    dispatch(setSelectedAdvertisingAccount(value));
    dispatch(
      setSelectedMarketplace(
        marketIntelligenceUtils.getMarketplace(value.marketplace)
      )
    );
  };
  const setDSPAccount = (value: IDropdownItem<string>) => {
    const selectedDSPAccount = getSelectedDSPAccountByDropdownValue(
      value.value
    );
    localStorageUtils.setSelectedDSPAccount(selectedDSPAccount);

    dispatch(setSelectedDSPAccount(value));
  };

  const selectCatalogAccount = (value: IDropdownItem<string>) => {
    const selectedCatalogAccount = getSelectedCatalogAccountByDropdownValue(
      value.value
    );
    localStorageUtils.setSelectedCatalogAccount(
      selectedCatalogAccount as ISettingsAccount
    );

    dispatch(setSelectedCatalogAccount(value));
  };

  const setInitialAdvertisingAccount = () => {
    dispatch(setAdvertisingAccountOptions(getAdvertisingAccountOptions()));
    const selectedAccount = getSelectedAdvertisingAccount();
    setAdvertisingAccount(selectedAccount);
  };
  const setInitialDSPAccount = () => {
    dispatch(setDSPAccountOptions(accountUtils.getDspAccountOptions()));
    const selectedAccount = getSelectedDSPAccount();
    setDSPAccount(selectedAccount);
  };

  const setInitialCatalogAccount = () => {
    dispatch(setCatalogAccountOptions(accountUtils.getCatalogAccountOptions()));
    const selectedAccount = getSelectedCatalogAccount();

    selectCatalogAccount(selectedAccount);
  };

  const switchAccount = async (navigateToSelectAccount = true) => {
    if (!user) return;
    const authToken = localStorageUtils.getAuthToken();
    try {
      await SessionServices.leaveAccount();
    } catch (error) {
      console.error('Error during leave account:', error);
    }
    logout(false);
    login(user, authToken);
    if (navigateToSelectAccount) navigate(SELECT_ACCOUNT_URL);
  };

  return {
    login,
    logout,
    switchAccount,
    setAdvertisingAccount,
    selectCatalogAccount,
    setSelectedAdvertisingAccountUsingAccount: setInitialAdvertisingAccount,
    setInitialAdvertisingAccount,
    setInitialDSPAccount,
    setDSPAccount,
    setInitialCatalogAccount,
  };
};
