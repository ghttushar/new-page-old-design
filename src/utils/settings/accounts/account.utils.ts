import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { EMPTY_ACCOUNT } from '@/constants';
import { CATALOG_ACCOUNT_ORDER } from '@/constants/advertising-filter.constants';
import {
  marketplaceAllOption,
  marketplaceOptions,
} from '@/constants/market-intelligence.constants';
import { AmazonAccountType, CountryCodeEnum } from '@/enums/advertising.enums';
import { PageTitleEnum } from '@/enums/index.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { WalmartAccountTypeEnum } from '@/enums/walmart.enums';
import { getUniqueDropDownItems } from '@/utils';
import { sortDropdownOptions } from '@/utils/advertising.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import {
  parseAdvertisingAccount,
  parseCatalogAccount,
  parseDSPAccount,
} from '@/utils/marketplace-logo.utils';
import { ISettingsAccount } from 'src/interfaces/settings.interface';

const accountUtils = {
  getNamesToDisplay: (account: ISettingsAccount) => {
    if (account.catalog && account.advertising) {
      return [
        account.advertising.brandName,
        account.catalog.partnerDisplayName,
      ];
    } else if (account.advertising) {
      return [account.advertising.brandName, ''];
    } else if (account.catalog) {
      return [account.catalog.partnerDisplayName, ''];
    } else {
      return ['', ''];
    }
  },

  getCountryCode: (account: ISettingsAccount) => {
    return (
      account.advertising?.countryCode ??
      account.catalog?.countryCode ??
      CountryCodeEnum.UnitedStates
    );
  },

  getIdAndLabel: (account: ISettingsAccount) => {
    const label =
      account.marketplace === MarketplaceEnum.AMAZON
        ? 'Profile Id'
        : 'Advertiser Id';
    const value =
      account.marketplace === MarketplaceEnum.AMAZON
        ? account.advertising?.amazonProfileId
        : account.advertising?.walmartAdvertiserId;
    return { label, value };
  },
  getCatalogAccountOptions: () => {
    const availableAccounts = localStorageUtils.getAvailableAccounts();

    const options: IDropdownItem<string>[] = availableAccounts
      .filter((account) => account.catalog)
      .sort(
        (a, b) =>
          CATALOG_ACCOUNT_ORDER.indexOf(a.accountType) -
          CATALOG_ACCOUNT_ORDER.indexOf(b.accountType)
      )
      .map(parseCatalogAccount);

    return options;
  },

  getEligibleCatalogAccounts: () => {
    const availableAccounts = localStorageUtils.getAvailableAccounts();

    const eligibleAccounts = availableAccounts.filter(
      (account) => account.catalog !== undefined
    );

    return eligibleAccounts;
  },

  getEligibleProfitabilityAccounts: () => {
    const eligibleCatalogAccounts = accountUtils.getEligibleCatalogAccounts();

    return eligibleCatalogAccounts
      .filter(
        (account) =>
          account.advertising &&
          (account.accountType === AmazonAccountType.SELLER ||
            account.accountType === WalmartAccountTypeEnum.THIRD_PARTY)
      )
      .map(parseCatalogAccount);
  },
  getAdsAccountOptionsByPartnerId: (partnerId: string) => {
    const availableAccounts = localStorageUtils.getAvailableAccounts();

    const mappedAccounts = availableAccounts
      .filter(
        (acct) =>
          acct.catalog?.partnerId === partnerId.split('_')[0] &&
          acct.advertising
      )
      .map((acct) => parseAdvertisingAccount(acct));

    if (mappedAccounts.length === 0) return [EMPTY_ACCOUNT];
    return mappedAccounts;
  },
  getCatalogAccountOptionsByAdsAccount: (metaId: string) => {
    const availableAccounts = localStorageUtils.getAvailableAccounts();
    const mappedAccounts = availableAccounts
      .filter(
        (acct) =>
          acct.advertising &&
          (acct.advertising?.amazonProfileId === metaId ||
            acct.advertising?.walmartAdvertiserId === metaId)
      )
      .map((acct) => parseCatalogAccount(acct));

    if (mappedAccounts.length === 0) return [EMPTY_ACCOUNT];
    return mappedAccounts;
  },

  getAdsAccountOptionsByMarketplace: (
    marketplace: string,
    accountOptions: IDropdownItem<string>[],
    title: string,
    tooltipText = ''
  ) => {
    if (marketplace === MarketplaceEnum.All)
      return getUniqueDropDownItems(accountOptions);
    const options = accountOptions.map((option) => {
      return {
        ...option,
        isDisabled: option.marketplace && option.marketplace !== marketplace,
        tooltipText:
          tooltipText || `${title} is not yet configured for this account`,
      };
    });

    return getUniqueDropDownItems(options);
  },

  getAdsAccountOptionsByTitle: (
    title: string,
    accountOptions: IDropdownItem<string>[]
  ) => {
    switch (title) {
      case PageTitleEnum.QUERIES:
      case PageTitleEnum.SCHEDULES:
      case PageTitleEnum.EXECUTED_QUERIES:
      case PageTitleEnum.CREATED_AUDIENCES:
      case PageTitleEnum.AUDIENCES:
      case PageTitleEnum.AMC:
      case PageTitleEnum.INSTANCES:
        return sortDropdownOptions(
          accountUtils.getAdsAccountOptionsByMarketplace(
            MarketplaceEnum.AMAZON,
            accountOptions,
            title
          )
        );
      case PageTitleEnum.PROFITABILITY_DASHBOARD:
      case PageTitleEnum.PROFITABILITY_PROFIT_N_LOSS:
      case PageTitleEnum.PROFITABILITY_TRENDS:
        return sortDropdownOptions(
          accountUtils.getAdsAccountOptionsByMarketplace(
            MarketplaceEnum.All,
            accountUtils.getEligibleProfitabilityAccounts(),
            title
          )
        );

      case PageTitleEnum.KEYWORD_TRACKER:
      case PageTitleEnum.ACCOUNTS:
        return accountUtils.getAdsAccountOptionsByMarketplace(
          MarketplaceEnum.All,
          [marketplaceAllOption, ...marketplaceOptions],
          title
        );
      default:
        return accountUtils.getAdsAccountOptionsByMarketplace(
          MarketplaceEnum.All,
          accountOptions,
          title
        );
    }
  },
  getMarketplaceAndMetaId: (accountData: ISettingsAccount) => {
    if (
      accountData.advertising?.amazonProfileId &&
      accountData.marketplace === MarketplaceEnum.AMAZON
    )
      return {
        marketplace: MarketplaceEnum.AMAZON,
        metaId: accountData.advertising.amazonProfileId,
      };
    return {
      marketplace: MarketplaceEnum.WALMART,
      metaId: accountData.advertising?.walmartAdvertiserId,
    };
  },
  getDspAccountOptions: () => {
    const availableAccounts = localStorageUtils.getAvailableDSPAccounts();
    return availableAccounts.map(parseDSPAccount);
  },
};

export default accountUtils;
