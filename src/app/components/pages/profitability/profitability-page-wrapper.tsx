import { profitabilityAccessDenied } from '@/constants/empty-state.constants';
import { FeatureRoutes, FeaturesEnum } from '@/enums/auth.enums';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import navigationUtils from '@/utils/navigation/navigation.utils';
import accountUtils from '@/utils/settings/accounts/account.utils';
import { Navigate, Route, Routes } from 'react-router-dom';
import EmptyState from '../../common/empty-state/empty-state';
import PrivateRoute from '../../private-route/private-route';
import ConnectAccountStaticPage from '../connect-account-static-page/connect-account-static-page';
import ProfitabilityHomePageWrapper from './profitability-home-page-wrapper/profitability-home-page-wrapper';
import { ProfitabilityPNLPageWrapper } from './profitability-pnl-page-wrapper/profitability-pnl-page-wrapper';
import ProfitabilityTrendsPageWrapper from './profitability-trends-page-wrapper/profitability-trends-page-wrapper';

export default function ProfitabilityPageWrapper() {
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();
  const accountDetails = localStorageUtils.getAccountDetails();

  if (
    !navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      FeaturesEnum.PROFITABILITY_AMAZON
    )
  )
    return (
      <div className="center-wrapper">
        <EmptyState {...profitabilityAccessDenied} />;
      </div>
    );

  const hasRequiredAccounts =
    !!accountUtils.getEligibleProfitabilityAccounts().length;

  if (!hasRequiredAccounts) {
    return (
      <ConnectAccountStaticPage customContent="Connect your Ads and Catalog accounts to get started." />
    );
  }

  return (
    <Routes>
      <Route
        path={`/${FeatureRoutes.PROFITABILITY_HOME}/*`}
        element={<PrivateRoute component={<ProfitabilityHomePageWrapper />} />}
      />
      <Route
        path={`/${FeatureRoutes.PROFITABILITY_TRENDS}/*`}
        element={
          <PrivateRoute component={<ProfitabilityTrendsPageWrapper />} />
        }
      />
      <Route
        path={`/${FeatureRoutes.PROFITABILITY_PnL}/*`}
        element={<PrivateRoute component={<ProfitabilityPNLPageWrapper />} />}
      />
      <Route
        path="*"
        element={<Navigate to={FeatureRoutes.PROFITABILITY_HOME} replace />}
      />
    </Routes>
  );
}
