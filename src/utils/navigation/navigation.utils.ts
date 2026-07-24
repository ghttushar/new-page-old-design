import {
  FeaturesRequiringAdsAccount,
  FeaturesRequiringCatalogAccount,
} from '@/constants/navigation/navigation.constants';
import { FeaturesEnum } from '@/enums/auth.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IAccount, IUserAccountMapping } from '@/interfaces/auth.interfaces';
import accessControlUtils from '../access-control/access-control.utils';
import localStorageUtils from '../local-storage/local-storage.utils';
import accountUtils from '../settings/accounts/account.utils';

const navigationUtils = {
  isDisabledForMarketplace: (feature: FeaturesEnum) => {
    const marketplace =
      localStorageUtils.getSelectedAdvertisingAccount()?.marketplace;
    if (marketplace === MarketplaceEnum.WALMART) {
      switch (feature) {
        case FeaturesEnum.AMAZON_MARKETING_CLOUD:
        case FeaturesEnum.MARKET_INTELLIGENCE_PRODUCT_SOV:
        case FeaturesEnum.PROFITABILITY_GEO:
          return true;
        default:
          return false;
      }
    } else {
      switch (feature) {
        case FeaturesEnum.PROFITABILITY_GEO:
          return true;
        default:
          return false;
      }
    }
  },

  isDisabledDueToAdsAccountRequirement: (feature: FeaturesEnum) => {
    const hasAccounts = !!localStorageUtils.getAvailableAccounts().length;

    if (FeaturesRequiringAdsAccount.includes(feature)) {
      return !hasAccounts;
    }
    return false;
  },

  isDisabledDueToCatalogAccountRequirement: (feature: FeaturesEnum) => {
    const hasAccounts = !!accountUtils.getCatalogAccountOptions().length;

    if (FeaturesRequiringCatalogAccount.includes(feature)) {
      return !hasAccounts;
    }

    const catalogMarketplace =
      localStorageUtils.getSelectedCatalogAccount()?.marketplace;

    return false;
  },

  canAccessFeature: (
    accountDetails: IAccount | null,
    userAccountMapping: IUserAccountMapping | null,
    feature: FeaturesEnum
  ) => {
    const hasAccounts = !!localStorageUtils.getAvailableAccounts().length;
    if (!hasAccounts && feature !== FeaturesEnum.JIVA_CHATBOT) return true;

    const result =
      accessControlUtils.hasPermissionToAccessFeature(
        accountDetails,
        userAccountMapping,
        feature
      ) &&
      !navigationUtils.isDisabledForMarketplace(feature) &&
      !navigationUtils.isDisabledDueToAdsAccountRequirement(feature) &&
      !navigationUtils.isDisabledDueToCatalogAccountRequirement(feature);

    return result;
  },

  getSafeCallbackUrl: (
    callbackUrl: string | undefined,
    fallbackUrl = '/'
  ): string => {
    return callbackUrl ?? fallbackUrl;
  },
};

export default navigationUtils;
