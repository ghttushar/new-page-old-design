import { FeaturesEnum } from '@/enums/auth.enums';
import { IAccount } from '@/interfaces/auth.interfaces';

const accountLevelAccessControlUtils = {
  isFeatureDisabled: (
    accountDetails: IAccount | null,
    feature: FeaturesEnum
  ) => {
    return (
      accountDetails?.disabledFeatures?.includes(feature) ||
      accountDetails?.disabledFeatures?.includes(FeaturesEnum.ALL)
    );
  },

  isFeatureEnabled: (
    accountDetails: IAccount | null,
    feature: FeaturesEnum
  ) => {
    return (
      accountDetails?.enabledFeatures?.includes(feature) ||
      accountDetails?.enabledFeatures?.includes(FeaturesEnum.ALL)
    );
  },

  hasAccess: (accountDetails: IAccount | null, feature: FeaturesEnum) => {
    return (
      !accountLevelAccessControlUtils.isFeatureDisabled(
        accountDetails,
        feature
      ) &&
      accountLevelAccessControlUtils.isFeatureEnabled(accountDetails, feature)
    );
  },
};

export default accountLevelAccessControlUtils;
