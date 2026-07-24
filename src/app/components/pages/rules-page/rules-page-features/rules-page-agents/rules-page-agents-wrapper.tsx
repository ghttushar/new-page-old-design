import PrivateRoute from '@/app/components/private-route/private-route';
import { FeatureRoutes, FeaturesEnum } from '@/enums/auth.enums';
import { Navigate, Route, Routes } from 'react-router-dom';
import RulesPageAgents from './rules-page-agents-page/rules-page-agents';
import RulesPageFormWrapper from './rules-page-form/rules-page-form-wrapper';

export default function RulesPageAgentsWrapper() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute
            component={<RulesPageAgents />}
            feature={FeaturesEnum.RULES_AGENTS}
          />
        }
      />
      <Route
        path={`/${FeatureRoutes.RULE_CREATION}`}
        element={
          <PrivateRoute
            component={<RulesPageFormWrapper />}
            feature={FeaturesEnum.RULE_CREATION}
          />
        }
      />
      <Route
        path={`/${FeatureRoutes.RULE_CREATION}/:id`}
        element={
          <PrivateRoute
            component={<RulesPageFormWrapper />}
            feature={FeaturesEnum.RULE_CREATION}
          />
        }
      />

      <Route
        path="*"
        element={
          <PrivateRoute
            component={
              <Navigate
                to={`/${FeatureRoutes.RULES}/${FeatureRoutes.RULES_AGENTS}`}
                replace
              />
            }
          />
        }
      />
    </Routes>
  );
}
