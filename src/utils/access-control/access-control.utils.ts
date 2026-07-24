import { UserRolesEnum } from '@/enums/invites.enums';
import {
  AccessScopeEnum,
  FeaturesEnum,
  PermissionsEnum,
  UserTypeEnum,
} from 'src/enums/auth.enums';
import {
  IAccount,
  IHasAccess,
  IUserAccountMapping,
} from 'src/interfaces/auth.interfaces';
import localStorageUtils from '../local-storage/local-storage.utils';
import accountLevelAccessControlUtils from './account-level-access-control.utils';
import userLevelAccessControl from './user-level-access-control.utils';

const accessControlUtils = {
  getFeatureScope: (
    hasAccess: IHasAccess[] | undefined,
    feature?: FeaturesEnum
  ) => {
    if (!hasAccess || !feature) return false;
    const scope = hasAccess.find((item) => item.type === feature);
    return accessControlUtils.isFeatureScopeAll(scope);
  },
  isFeatureInHasAccess: (
    hasAccess: IHasAccess[] | undefined,
    feature?: FeaturesEnum
  ) => {
    if (!hasAccess || !feature) return false;
    const scope = hasAccess.find((item) => item.type === feature);
    return Boolean(scope);
  },
  isFeatureScopeAll: (access?: IHasAccess) => {
    if (!access) return false;
    return access.scope === AccessScopeEnum.ALL;
  },

  hasPermissionToAccessFeature: (
    accountDetails: IAccount | null,
    userAccountMapping: IUserAccountMapping | null,
    feature: FeaturesEnum
  ) => {
    return (
      accountLevelAccessControlUtils.hasAccess(accountDetails, feature) &&
      userLevelAccessControl.hasAccess(userAccountMapping, feature)
    );
  },

  accountHasAccessToAnyFeatures: (accountDetails: IAccount | null) => {
    return (
      accountDetails?.enabledFeatures?.length ||
      accountDetails?.enabledFeatures?.includes(FeaturesEnum.ALL)
    );
  },
  userHasAccessToAnyFeatures: (
    userAccountMapping: IUserAccountMapping | null
  ) => {
    return (
      userAccountMapping?.enabledFeatures?.length ||
      userAccountMapping?.enabledFeatures?.includes(FeaturesEnum.ALL)
    );
  },
  accountAndUserAccessHasOverlap: (
    accountDetails: IAccount | null,
    userAccountMapping: IUserAccountMapping | null
  ) => {
    if (
      accountDetails?.enabledFeatures?.includes(FeaturesEnum.ALL) &&
      userAccountMapping?.enabledFeatures?.length
    ) {
      return userAccountMapping.enabledFeatures[0];
    } else if (
      userAccountMapping?.enabledFeatures?.includes(FeaturesEnum.ALL) &&
      accountDetails?.enabledFeatures?.length
    ) {
      return accountDetails?.enabledFeatures[0];
    } else {
      userAccountMapping?.enabledFeatures?.forEach((feature) => {
        if (accountDetails?.enabledFeatures?.includes(feature)) return feature;
      });
    }
    return null;
  },

  hasAccessToAnyFeatures: (
    accountDetails: IAccount | null,
    userAccountMapping: IUserAccountMapping | null
  ) => {
    const isFeatureEnabled =
      accessControlUtils.accountHasAccessToAnyFeatures(accountDetails);
    const doesUserHaveAccess =
      accessControlUtils.userHasAccessToAnyFeatures(userAccountMapping);

    if (isFeatureEnabled && doesUserHaveAccess) {
      return accessControlUtils.accountAndUserAccessHasOverlap(
        accountDetails,
        userAccountMapping
      );
    }
    return null;
  },
  hasAccessToAnyMainFeatures: (
    accountDetails: IAccount | null,
    userAccountMapping: IUserAccountMapping | null
  ) => {
    const mainFeatures = [
      FeaturesEnum.ADVERTISING,
      FeaturesEnum.AMAZON_MARKETING_CLOUD,
      FeaturesEnum.MARKET_INTELLIGENCE,
      FeaturesEnum.DAYPARTING,
      FeaturesEnum.SETTINGS,
      FeaturesEnum.REPORTS,
    ];

    for (const feature of mainFeatures) {
      const hasAccess = accessControlUtils.hasPermissionToAccessFeature(
        accountDetails,
        userAccountMapping,
        feature
      );
      if (hasAccess) return feature;
    }
    return null;
  },

  hasBidderUpdateConfigAccess: () => {
    const selectedUserAccountMapping =
      localStorageUtils.getSelectedUserAccountMapping();

    return (
      selectedUserAccountMapping !== null &&
      selectedUserAccountMapping.permissions &&
      selectedUserAccountMapping.permissions?.length > 0 &&
      selectedUserAccountMapping.permissions?.includes(PermissionsEnum.ALL)
    );
  },
  isAllFeaturesDisabled: (accountDetails: IAccount) => {
    return accountDetails?.disabledFeatures?.includes(FeaturesEnum.ALL);
  },

  hasAdminManagerAccess: () => {
    return (
      accessControlUtils.hasAdminAccess() ||
      accessControlUtils.hasManagerAccess()
    );
  },
  hasManagerAccess: () => {
    const selectedUserAccountMapping =
      localStorageUtils.getSelectedUserAccountMapping();
    return (
      selectedUserAccountMapping !== null &&
      selectedUserAccountMapping.roles.includes(UserRolesEnum.MANAGER)
    );
  },
  hasAdminAccess: () => {
    const selectedUserAccountMapping =
      localStorageUtils.getSelectedUserAccountMapping();
    return (
      selectedUserAccountMapping !== null &&
      selectedUserAccountMapping.roles.includes(UserRolesEnum.ADMIN)
    );
  },
  checkIsFeatureUnderMaintenance: (
    selectedUserAccountMapping: IUserAccountMapping | null,
    feature: FeaturesEnum | undefined
  ) => {
    if (!feature || !selectedUserAccountMapping) return false;
    return selectedUserAccountMapping.featuresUnderMaintenance?.includes(
      feature
    );
  },
  checkIsInternalUser: (userType?: UserTypeEnum) => {
    return userType === UserTypeEnum.INTERNAL;
  },
};

export default accessControlUtils;
