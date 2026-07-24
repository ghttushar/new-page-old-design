import { FeaturesEnum } from '@/enums/auth.enums';
import { IUserAccountMapping } from '@/interfaces/auth.interfaces';

const userLevelAccessControl = {
  isFeatureDisabled: (
    userAccountMapping: IUserAccountMapping | null,
    feature: FeaturesEnum
  ) => {
    return (
      userAccountMapping?.disabledFeatures?.includes(feature) ||
      userAccountMapping?.disabledFeatures?.includes(FeaturesEnum.ALL)
    );
  },

  isFeatureEnabled: (
    userAccountMapping: IUserAccountMapping | null,
    feature: FeaturesEnum
  ) => {
    return (
      userAccountMapping?.enabledFeatures?.includes(feature) ||
      userAccountMapping?.enabledFeatures?.includes(FeaturesEnum.ALL)
    );
  },

  hasAccess: (
    userAccountMapping: IUserAccountMapping | null,
    feature: FeaturesEnum
  ) => {
    return (
      !userLevelAccessControl.isFeatureDisabled(userAccountMapping, feature) &&
      userLevelAccessControl.isFeatureEnabled(userAccountMapping, feature)
    );
  },
};

export default userLevelAccessControl;
