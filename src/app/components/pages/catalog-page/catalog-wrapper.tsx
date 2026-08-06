import { Navigate, Route, Routes } from 'react-router-dom';
import { FeatureRoutes, FeaturesEnum } from 'src/enums/auth.enums';
import PrivateRoute from '../../private-route/private-route';
import CatalogHomeWrapper from './catalog-home/catalog-home-wrapper';

export default function CatalogPageRoutes() {
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
