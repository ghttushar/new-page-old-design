import { BidderDashboardTitleEnum } from '@/enums/bidder-dashboard.enum';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/auth/auth.slice';
import accessControlUtils from '@/utils/access-control/access-control.utils';
import navigationUtils from '@/utils/navigation/navigation.utils';
import { Navigate, Route, Routes } from 'react-router-dom';
import { FeaturesEnum } from 'src/enums/auth.enums';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import { bidderDashboardAccessDenied } from '../../../../constants/empty-state.constants';
import EmptyState from '../../common/empty-state/empty-state';
import SyncFilters from '../../hoc/sync-filters';
import PrivateRoute from '../../private-route/private-route';
import BidderDashboardPage from './bidder-dashboard-page';
import styles from './bidder-dashboard-wrapper.module.scss';

export default function BidderDashboardWrapper() {
  const user = useAppSelector(selectUser);
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();
  const accountDetails = localStorageUtils.getAccountDetails();

  if (
    !navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      FeaturesEnum.MONITORING
    ) ||
    !accessControlUtils.isFeatureInHasAccess(
      user?.hasAccess,
      FeaturesEnum.MONITORING
    )
  )
    return (
      <div className="center-wrapper">
        <EmptyState {...bidderDashboardAccessDenied} />
      </div>
    );

  return (
    <div className={styles.wrapperContainer}>
      <Routes>
        <Route
          path="/"
          element={
            <SyncFilters
              selectedNavTitle={BidderDashboardTitleEnum.BidderDashboardHome}
            >
              <PrivateRoute
                component={<BidderDashboardPage />}
                checkIsSuperAdmin={false}
                checkIsAuthenticatedOnly={true}
                feature={FeaturesEnum.MONITORING}
                checkHasMonitoringAccess={true}
              />
            </SyncFilters>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
