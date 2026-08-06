import { reportsAccessDenied } from '@/constants/empty-state.constants';
import { FeatureRoutes, FeaturesEnum } from '@/enums/auth.enums';
import navigationUtils from '@/utils/navigation/navigation.utils';
import { Navigate, Route, Routes } from 'react-router-dom';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import EmptyState from '../../common/empty-state/empty-state';
import ReportsHomePage from './reports-home-page';
import ReportsViewPage from './reports-view-page';

/* eslint-disable-next-line */
export interface ReportsWrapperProps {}

export function ReportsWrapper(props: ReportsWrapperProps) {
  const accountDetails = localStorageUtils.getAccountDetails();
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();

  if (
    !navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      FeaturesEnum.REPORTS
    )
  )
    return (
      <div className="center-wrapper">
        <EmptyState {...reportsAccessDenied} />;
      </div>
    );

  return (
    <Routes>
      <Route
        path={`/${FeatureRoutes.REPORTS_LIST}`}
        element={<ReportsHomePage />}
      />
      <Route
        path={`/${FeatureRoutes.REPORTS_LIST}/:marketplace`}
        element={<ReportsHomePage />}
      />
      <Route
        path="/:marketplace/view/:reportConfigId"
        element={<ReportsViewPage />}
      />
      <Route
        path="*"
        element={<Navigate to={FeatureRoutes.REPORTS_LIST} replace />}
      />
    </Routes>
  );
}

export default ReportsWrapper;
