import accountUtils from '@/utils/settings/accounts/account.utils';
import { Navigate, Route, Routes } from 'react-router-dom';
import { FeatureRoutes, FeaturesEnum } from 'src/enums/auth.enums';
import PrivateRoute from '../../private-route/private-route';
import ConnectAccountStaticPage from '../connect-account-static-page/connect-account-static-page';
import CatalogHomeWrapper from './catalog-home/catalog-home-wrapper';

export default function CatalogPageRoutes() {
  const hasRequiredAccounts =
    !!accountUtils.getEligibleCatalogAccounts().length;

  if (!hasRequiredAccounts)
    return <ConnectAccountStaticPage isCatalogRequired={true} />;

  return (
    <Routes>
      <Route
        path={`/${FeatureRoutes.CATALOG_PAGE}/*`}
        element={
          <PrivateRoute
            component={<CatalogHomeWrapper />}
            feature={FeaturesEnum.CATALOG}
          />
        }
      />

      <Route
        path="*"
        element={<Navigate to={FeatureRoutes.CATALOG_PAGE} replace />}
      />
    </Routes>
  );
}
