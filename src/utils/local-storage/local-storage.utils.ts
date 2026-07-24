import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { PAGINATION_MODEL } from 'src/constants';
// import { IColumnConfig } from 'src/constants/column.constants';
import { MarketplaceEnum, Range } from '@/enums/serp.enums';
import { IDateRange, IDateRangeFilter } from '@/interfaces/serp.interface';
import { SELECTED_COLUMNS } from 'src/constants/keyword-action.constants';
import { initialMarketIntelligenceFilters } from 'src/constants/sov.filter.constants';
import {
  AdvertisingTitlesEnum,
  CountryCodeEnum,
} from 'src/enums/advertising.enums';
import { IAMCInstance } from 'src/interfaces/amc.interfaces';
import {
  IAccount,
  IBrandNameVariation,
  IUserAccountMapping,
} from 'src/interfaces/auth.interfaces';
import { IDataGridPaginationModel } from 'src/interfaces/index.interface';
import { IStoreMarketIntelligenceFilter } from 'src/interfaces/market-intelligence/serp.interfaces';
import {
  IDSPAdvertiserAccount,
  ISettingsAccount,
} from 'src/interfaces/settings.interface';
import { IFinalFilters } from 'src/redux/slices/filters/filter.slice';
import { ISovFilterForm } from 'src/redux/slices/market-intelligence/sov-filter.slice';
import {
  DEVICE_ID_KEY,
  LS_ACCOUNT_COUNTRY_CODE,
  LS_ACCOUNT_ID_KEY,
  LS_ACCOUNT_KEY,
  LS_AUTH_TOKEN_KEY,
  LS_AVAILABLE_ACCOUNTS,
  LS_AVAILABLE_DSP_ACCOUNTS,
  LS_BRAND_NAME_VARIATIONS_KEY,
  LS_COLUMN_FILTERS_KEY,
  LS_COLUMN_FILTERS_KEY_NEW_TABLE,
  LS_FILTERS_KEY,
  LS_HIDE_GRAPH,
  LS_INSTANCES_KEY,
  LS_LAST_SELECTED_AMZ_ACCOUNT,
  LS_LAST_SELECTED_MARKETPLACE,
  LS_LAST_SELECTED_WMT_ACCOUNT,
  LS_MAPPED_ACCOUNTS_KEY,
  LS_MARKET_INTELLIGENCE_FILTERS_KEY,
  LS_MI_ACCOUNT_COUNTRY_CODE,
  LS_PAGINATION_MODEL,
  LS_SELECTED_ADVERTISING_ACCOUNT,
  LS_SELECTED_CATALOG_ACCOUNT,
  LS_SELECTED_DATE_RANGE,
  LS_SELECTED_DSP_ACCOUNT,
  LS_SELECTED_FREQUENCY,
  LS_SELECTED_INSTANCE_KEY,
  LS_SELECTED_USER_ACCOUNT_MAPPING,
} from '../../constants/local-storage/local-storage.constants';

const localStorageUtils = {
  getAuthToken: (): string => {
    return localStorage.getItem(LS_AUTH_TOKEN_KEY) || '';
  },
  setAuthToken: (authToken: string) => {
    localStorage.setItem(LS_AUTH_TOKEN_KEY, authToken);
  },
  getAccountDetails: (): IAccount | null => {
    const accountString = localStorage.getItem(LS_ACCOUNT_KEY);
    if (accountString) {
      return JSON.parse(accountString) as IAccount;
    }
    return null;
  },
  setAccountDetails: (account: IAccount | null) => {
    localStorage.setItem(LS_ACCOUNT_KEY, JSON.stringify(account));
  },
  getAccountId: (): string => {
    return localStorage.getItem(LS_ACCOUNT_ID_KEY) || '';
  },
  setAccountId: (accountId: string | undefined) => {
    localStorage.setItem(LS_ACCOUNT_ID_KEY, accountId || '');
  },
  getMappedAccounts: (): IUserAccountMapping[] => {
    const mappedAccounts = localStorage.getItem(LS_MAPPED_ACCOUNTS_KEY);
    if (mappedAccounts) {
      return JSON.parse(mappedAccounts);
    }
    return [];
  },
  setMappedAccounts: (mappedAccounts: IUserAccountMapping[]) => {
    localStorage.setItem(
      LS_MAPPED_ACCOUNTS_KEY,
      JSON.stringify(mappedAccounts)
    );
  },
  setDateRangeFilter: (
    preset: IDropdownItem<Range>,
    dateRange?: IDateRange
  ) => {
    const filter: IDateRangeFilter = {
      label: preset.value,
      startDate: null,
      endDate: null,
    };

    if (preset.value === Range.CUSTOM_RANGE && dateRange) {
      filter.startDate = dateRange.startDate;
      filter.endDate = dateRange.endDate || null;
    }

    localStorage.setItem(LS_SELECTED_DATE_RANGE, JSON.stringify(filter));
  },

  getDateRangeFilter: (
    defaultPreset: IDropdownItem<Range>
  ): IDateRangeFilter => {
    const saved = localStorage.getItem(LS_SELECTED_DATE_RANGE);
    if (saved) {
      return JSON.parse(saved);
    }

    return {
      label: defaultPreset.value,
      startDate: null,
      endDate: null,
    };
  },
  setFrequencyFilter: (filters: IDropdownItem<string>) => {
    localStorage.setItem(LS_SELECTED_FREQUENCY, JSON.stringify(filters));
  },
  getFrequencyFilter: (
    defaultFilter: IDropdownItem<string>
  ): IDropdownItem<string> => {
    const frequency = localStorage.getItem(LS_SELECTED_FREQUENCY);
    if (frequency) {
      return JSON.parse(frequency) as IDropdownItem<string>;
    }
    return defaultFilter;
  },

  clearLocalStorage: () => {
    localStorage.clear();
  },

  getAllInstances: (): IAMCInstance[] | null => {
    const instanceList = localStorage.getItem(LS_INSTANCES_KEY);
    if (instanceList) {
      return JSON.parse(instanceList) as IAMCInstance[];
    }
    return null;
  },

  getApplicableInstances: (): IAMCInstance[] | null => {
    const instanceList = localStorageUtils.getAllInstances();
    if (instanceList) {
      const selectedAdvertisingAccount =
        localStorageUtils.getSelectedAdvertisingAccount();
      if (!selectedAdvertisingAccount) return null;
      return instanceList.filter(
        (option) =>
          option.profileId ===
          selectedAdvertisingAccount.advertising?.amazonProfileId
      );
    }
    return null;
  },
  setAMCInstances: (instanceList: IAMCInstance[]) => {
    localStorage.setItem(LS_INSTANCES_KEY, JSON.stringify(instanceList));
  },
  getSelectedAMCInstance: (): IDropdownItem<string> | null => {
    const selectedInstance = localStorage.getItem(LS_SELECTED_INSTANCE_KEY);
    if (selectedInstance && selectedInstance !== 'undefined') {
      return JSON.parse(selectedInstance) as IDropdownItem<string>;
    }
    return null;
  },
  setSelectedAMCInstance: (instance: IDropdownItem<string> | null) => {
    localStorage.setItem(LS_SELECTED_INSTANCE_KEY, JSON.stringify(instance));
  },
  clearAMCDetails: () => {
    localStorage.removeItem(LS_INSTANCES_KEY);
    localStorage.removeItem(LS_SELECTED_INSTANCE_KEY);
  },
  setSelectedColumns: (columns: string[]) => {
    localStorage.setItem(SELECTED_COLUMNS, JSON.stringify(columns));
  },
  setBrandNameVariations: (brandNameVariations: IBrandNameVariation[]) => {
    localStorage.setItem(
      LS_BRAND_NAME_VARIATIONS_KEY,
      JSON.stringify(brandNameVariations)
    );
  },
  getBrandNameVariations: (): IBrandNameVariation[] => {
    const brandNameVariations = localStorage.getItem(
      LS_BRAND_NAME_VARIATIONS_KEY
    );
    if (brandNameVariations) {
      return JSON.parse(brandNameVariations) as IBrandNameVariation[];
    }
    return [];
  },
  getSelectedProfileId: (): string | null => {
    return localStorage.getItem('selectedProfileId') || null;
  },
  setSelectedProfileId: (profileId: string) => {
    localStorage.setItem('selectedProfileId', profileId);
  },
  getSelectedUserAccountMapping: (): IUserAccountMapping | null => {
    const accountString = localStorage.getItem(
      LS_SELECTED_USER_ACCOUNT_MAPPING
    );
    if (accountString) {
      return JSON.parse(accountString) as IUserAccountMapping;
    }
    return null;
  },
  setSelectedUserAccountMapping: (
    userAccountMapping: IUserAccountMapping | null
  ) => {
    localStorage.setItem(
      LS_SELECTED_USER_ACCOUNT_MAPPING,
      JSON.stringify(userAccountMapping)
    );
  },

  // NOTE: Old Column Filters
  getColumnFiltersByNavTitle: (
    navTitle: AdvertisingTitlesEnum
  ): string[] | null => {
    const columnFiltersString = localStorage.getItem(LS_COLUMN_FILTERS_KEY);
    if (!columnFiltersString) return null;
    const columnFilters = JSON.parse(columnFiltersString);
    const selectedColumnFilters = columnFilters[navTitle] || null;

    return selectedColumnFilters;
  },

  getSelectedColumnsByNavTab: (
    navTitle: AdvertisingTitlesEnum
  ): Array<string> | null => {
    const storedColumnConfig = localStorage.getItem(
      LS_COLUMN_FILTERS_KEY_NEW_TABLE
    );
    if (!storedColumnConfig) return null;
    const parsedColConfig = JSON.parse(storedColumnConfig);
    const selectedColumnConfig = parsedColConfig[navTitle] || null;

    return selectedColumnConfig;
  },

  // NOTE: Old Column Filters
  getColumnFilters: () => {
    const columnFiltersString = localStorage.getItem(LS_COLUMN_FILTERS_KEY);
    if (!columnFiltersString) return {};
    return JSON.parse(columnFiltersString);
  },

  getStoredColumns: () => {
    const columnFiltersString = localStorage.getItem(
      LS_COLUMN_FILTERS_KEY_NEW_TABLE
    );
    if (!columnFiltersString) return {};
    return JSON.parse(columnFiltersString);
  },

  // NOTE: Old Column Filters
  setColumnFiltersByNavTitle: (
    navTitle: AdvertisingTitlesEnum,
    selectedColumns: Array<string>
  ) => {
    const columnFilters = localStorageUtils.getColumnFilters();
    columnFilters[navTitle] = selectedColumns;

    localStorage.setItem(LS_COLUMN_FILTERS_KEY, JSON.stringify(columnFilters));
  },

  setSelectedColumnsByNavTab: (
    navTitle: AdvertisingTitlesEnum,
    selectedColumns: Array<string>
  ) => {
    const columnFilters = localStorageUtils.getStoredColumns();
    columnFilters[navTitle] = selectedColumns;

    localStorage.setItem(
      LS_COLUMN_FILTERS_KEY_NEW_TABLE,
      JSON.stringify(columnFilters)
    );
  },

  getSelectedAdvertisingAccount: (): ISettingsAccount | null => {
    const selectedAccount = localStorage.getItem(
      LS_SELECTED_ADVERTISING_ACCOUNT
    );
    if (!selectedAccount || selectedAccount === 'undefined') return null;

    return JSON.parse(selectedAccount) as ISettingsAccount;
  },

  setSelectedAdvertisingAccount: (account: ISettingsAccount) => {
    if (!account) return;
    localStorageUtils.setLastSelectedMarketplace(account);
    localStorage.setItem(
      LS_SELECTED_ADVERTISING_ACCOUNT,
      JSON.stringify(account)
    );
  },
  getSelectedDSPAccount: (): IDSPAdvertiserAccount | null => {
    const selectedDSPAccount = localStorage.getItem(LS_SELECTED_DSP_ACCOUNT);
    if (!selectedDSPAccount || selectedDSPAccount === 'undefined') return null;

    return JSON.parse(selectedDSPAccount);
  },

  setSelectedDSPAccount: (account: IDSPAdvertiserAccount | null) => {
    if (!account) return;
    localStorage.setItem(LS_SELECTED_DSP_ACCOUNT, JSON.stringify(account));
  },

  getSelectedCatalogAccount: (): ISettingsAccount | null => {
    const selectedAccount = localStorage.getItem(LS_SELECTED_CATALOG_ACCOUNT);
    if (!selectedAccount || selectedAccount === 'undefined') return null;

    return JSON.parse(selectedAccount) as ISettingsAccount;
  },

  setSelectedCatalogAccount: (account: ISettingsAccount | null) => {
    localStorage.setItem(LS_SELECTED_CATALOG_ACCOUNT, JSON.stringify(account));
  },

  getAdvertisingMarketplace: (): MarketplaceEnum => {
    const selectedAccount = localStorageUtils.getSelectedAdvertisingAccount();
    if (!selectedAccount) return MarketplaceEnum.WALMART;
    const marketplace = selectedAccount?.marketplace;
    return marketplace || MarketplaceEnum.WALMART;
  },

  getPaginationModel: (): IDataGridPaginationModel => {
    const paginationModel = localStorage.getItem(LS_PAGINATION_MODEL);
    if (paginationModel) {
      return JSON.parse(paginationModel);
    }
    return PAGINATION_MODEL;
  },

  setPaginationModel: (paginationModel: IDataGridPaginationModel) => {
    localStorage.setItem(LS_PAGINATION_MODEL, JSON.stringify(paginationModel));
  },

  getLsFiltersByNavTitle: (navTitle: string): IFinalFilters[] | null => {
    const filtersString = localStorage.getItem(LS_FILTERS_KEY);
    if (!filtersString) return null;
    const filters = JSON.parse(filtersString);
    const selectedFilters = filters[navTitle] || null;

    return selectedFilters;
  },

  getLsFilters: () => {
    const filtersString = localStorage.getItem(LS_FILTERS_KEY);
    if (!filtersString) return {};
    return JSON.parse(filtersString);
  },

  setLsFiltersByNavTitle: (
    navTitle: string,
    selectedFilters: Array<IFinalFilters>
  ) => {
    const filters = localStorageUtils.getLsFilters();
    filters[navTitle] = selectedFilters;

    localStorage.setItem(LS_FILTERS_KEY, JSON.stringify(filters));
  },

  getMarketIntelligenceFilters: (): IStoreMarketIntelligenceFilter => {
    const filtersString = localStorage.getItem(
      LS_MARKET_INTELLIGENCE_FILTERS_KEY
    );
    if (!filtersString) {
      localStorageUtils.setMarketIntelligenceFilters(
        initialMarketIntelligenceFilters,
        true
      );
      return {
        filters: initialMarketIntelligenceFilters,
        isInitialFilters: true,
      };
    }
    return JSON.parse(filtersString) as IStoreMarketIntelligenceFilter;
  },

  setMarketIntelligenceFilters: (
    selectedFilters: ISovFilterForm,
    isInitialFilters = false
  ) => {
    const miFilters: IStoreMarketIntelligenceFilter = {
      filters: selectedFilters,
      isInitialFilters,
    };
    localStorage.setItem(
      LS_MARKET_INTELLIGENCE_FILTERS_KEY,
      JSON.stringify(miFilters)
    );
  },
  setMarketIntelligenceKeywordFilters: (keyword: IDropdownItem<string>) => {
    const miFilters = localStorageUtils.getMarketIntelligenceFilters();
    miFilters.filters.keyword = keyword;
    localStorageUtils.setMarketIntelligenceFilters(miFilters.filters);
  },

  setAvailableAccounts: (availableAccounts: ISettingsAccount[]) => {
    localStorage.setItem(
      LS_AVAILABLE_ACCOUNTS,
      JSON.stringify(availableAccounts)
    );
  },
  setAvailableDSPAccounts: (availableAccounts: IDSPAdvertiserAccount[]) => {
    localStorage.setItem(
      LS_AVAILABLE_DSP_ACCOUNTS,
      JSON.stringify(availableAccounts)
    );
  },

  setLastSelectedMarketplace: (account: ISettingsAccount) => {
    localStorage.setItem(LS_LAST_SELECTED_MARKETPLACE, account.marketplace);
  },

  setLastSelectedAmazonAccount: (account: ISettingsAccount) => {
    localStorage.setItem(LS_LAST_SELECTED_AMZ_ACCOUNT, JSON.stringify(account));
  },

  getLastSelectedAmazonAccount: (): ISettingsAccount | null => {
    const amazonAccount = localStorage.getItem(LS_LAST_SELECTED_AMZ_ACCOUNT);
    if (!amazonAccount) return null;
    return JSON.parse(amazonAccount) as ISettingsAccount;
  },

  setLastSelectedWalmartAccount: (account: ISettingsAccount) => {
    localStorage.setItem(LS_LAST_SELECTED_WMT_ACCOUNT, JSON.stringify(account));
  },

  getLastSelectedWalmartAccount: (): ISettingsAccount | null => {
    const walmartAccount = localStorage.getItem(LS_LAST_SELECTED_WMT_ACCOUNT);
    if (!walmartAccount) return null;
    return JSON.parse(walmartAccount) as ISettingsAccount;
  },

  getLastSelectedMarketplace: (): string => {
    const marketplace = localStorage.getItem(LS_LAST_SELECTED_MARKETPLACE);
    if (!marketplace) return MarketplaceEnum.AMAZON;
    return marketplace;
  },

  getAvailableAccounts: (): ISettingsAccount[] => {
    const availableAccounts = localStorage.getItem(LS_AVAILABLE_ACCOUNTS);
    if (availableAccounts) {
      return JSON.parse(availableAccounts) as ISettingsAccount[];
    }
    return [];
  },
  getAvailableDSPAccounts: (): IDSPAdvertiserAccount[] => {
    const availableAccounts = localStorage.getItem(LS_AVAILABLE_DSP_ACCOUNTS);
    if (availableAccounts) {
      return JSON.parse(availableAccounts);
    }
    return [];
  },

  setHideGraph: (isGraphHidden: boolean) => {
    localStorage.setItem(LS_HIDE_GRAPH, JSON.stringify(isGraphHidden));
  },

  getHideGraph: (): boolean => {
    const isGraphHidden = localStorage.getItem(LS_HIDE_GRAPH);

    if (isGraphHidden !== null) {
      return JSON.parse(isGraphHidden) as boolean;
    }

    return false;
  },

  getAccountCountryCode: () => {
    const countryCode = localStorage.getItem(LS_ACCOUNT_COUNTRY_CODE);
    if (countryCode) return countryCode;
    return CountryCodeEnum.UnitedStates;
  },

  setAccountCountryCode: (countryCode: string) => {
    localStorage.setItem(LS_ACCOUNT_COUNTRY_CODE, countryCode);
  },

  getMIAccountCountryCode: () => {
    const countryCode = localStorage.getItem(LS_MI_ACCOUNT_COUNTRY_CODE);
    if (countryCode) return countryCode;
  },

  setMIAccountCountryCode: (countryCode: string) => {
    localStorage.setItem(LS_MI_ACCOUNT_COUNTRY_CODE, countryCode);
  },

  removeAccountDetailsFromLocalStorage: () => {
    localStorage.removeItem(LS_SELECTED_ADVERTISING_ACCOUNT);
    localStorage.removeItem(LS_SELECTED_CATALOG_ACCOUNT);
    localStorage.removeItem(LS_LAST_SELECTED_AMZ_ACCOUNT);
    localStorage.removeItem(LS_LAST_SELECTED_WMT_ACCOUNT);
  },

  getDeviceId: (): string => {
    return localStorage.getItem(DEVICE_ID_KEY) || '';
  },

  setDeviceId: (deviceId: string) => {
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  },
};

export default localStorageUtils;
