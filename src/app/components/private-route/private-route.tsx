import { featureUnderMaintanence } from '@/constants/empty-state.constants';
import accessControlUtils from '@/utils/access-control/access-control.utils';
import navigationUtils from '@/utils/navigation/navigation.utils';
import React from 'react';
import { Navigate, useLocation } from 'react-router';
import {
  FEATURES_DISABLED,
  LOGIN_URL,
  SELECT_ACCOUNT_URL,
} from 'src/constants/urls.constants';
import { FeaturesEnum } from 'src/enums/auth.enums';
import { ILocation } from 'src/interfaces/auth.interfaces';
import { useAppSelector } from 'src/redux/hooks';
import {
  selectAccountId,
  selectIsAuthenticated,
  selectUser,
} from 'src/redux/slices/auth/auth.slice';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import EmptyState from '../common/empty-state/empty-state';

interface IPrivateRouteProps {
  component: React.ReactNode; // Accepts a JSX element
  checkIsAuthenticatedOnly?: boolean;
  feature?: FeaturesEnum;
  checkIsSuperAdmin?: boolean;
  renderComponent?: boolean;
  checkHasMonitoringAccess?: boolean;
}

const PrivateRoute: React.FC<IPrivateRouteProps> = ({
  component,
  checkIsAuthenticatedOnly,
  checkIsSuperAdmin,
  feature,
  renderComponent,
  checkHasMonitoringAccess,
}) => {
  const user = useAppSelector(selectUser);
  const location = useLocation() as ILocation;
  const accountDetails = localStorageUtils.getAccountDetails();
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accountId = useAppSelector(selectAccountId);
  const isFeatureInHasAccess = accessControlUtils.isFeatureInHasAccess(
    user?.hasAccess,
    FeaturesEnum.MONITORING
  );
  const isFeatureUnderMaintanence =
    accessControlUtils.checkIsFeatureUnderMaintenance(
      selectedUserAccountMapping,
      feature
    );

  const safeCallbackUrl = navigationUtils.getSafeCallbackUrl(
    location.state?.callbackUrl
  );

  if (isFeatureUnderMaintanence === true && feature)
    return <EmptyState {...featureUnderMaintanence(feature)} />;

  // If user is logged in and has selected the account
  if (accountId && isAuthenticated && accountDetails) {
    if (
      accessControlUtils.isAllFeaturesDisabled(accountDetails) ||
      !accessControlUtils.accountHasAccessToAnyFeatures(accountDetails)
    ) {
      return <Navigate to={`${FEATURES_DISABLED}`} />;
    }

    const featurePermission = feature
      ? navigationUtils.canAccessFeature(
          accountDetails,
          selectedUserAccountMapping,
          feature
        )
      : true;
    const superAdminPermission = checkIsSuperAdmin ? user?.isSuperAdmin : true;
    const authPermission = checkIsAuthenticatedOnly ? isAuthenticated : true;
    const monitoringPermission = checkHasMonitoringAccess
      ? isFeatureInHasAccess
      : true;
    if (
      featurePermission &&
      authPermission &&
      superAdminPermission &&
      monitoringPermission
    ) {
      return <React.Fragment>{component}</React.Fragment>; // Render the passed JSX element
    } else return <Navigate to={safeCallbackUrl} replace />;
  }
  // If User is logged in but hasn't selected the account yet
  else if (!accountId && isAuthenticated) {
    if (renderComponent) {
      return <React.Fragment>{component}</React.Fragment>; // Render the passed JSX element
    } else
      return (
        <Navigate
          to={`${SELECT_ACCOUNT_URL}`}
          state={{
            callbackUrl: location.pathname,
          }}
        />
      );
  }
  // If user hasn't logged in yet
  else {
    return (
      <Navigate
        to={`${LOGIN_URL}`}
        state={{
          callbackUrl: location.pathname,
        }}
      />
    );
  }
};

export default PrivateRoute;
