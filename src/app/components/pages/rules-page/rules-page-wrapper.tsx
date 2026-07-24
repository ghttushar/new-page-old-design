import { FeatureRoutes, FeaturesEnum } from '@/enums/auth.enums';
import { RulesPageTitleEnum } from '@/enums/rules.enum';
import { Navigate, Route, Routes } from 'react-router-dom';
import SyncFilters from '../../hoc/sync-filters';
import PrivateRoute from '../../private-route/private-route';
import RulesPageAgentsWrapper from './rules-page-features/rules-page-agents/rules-page-agents-wrapper';
import RulesPageAppliedRulesWrapper from './rules-page-features/rules-page-applied-rules/rules-page-applied-rules-wrapper';
import styles from './rules-page.module.scss';

export default function RulesPageWrapper() {
  return (
    <div className={styles.container}>
      <Routes>
        <Route
          path={`/${FeatureRoutes.RULES_AGENTS}/*`}
          element={
            <PrivateRoute
              component={<RulesPageAgentsWrapper />}
              feature={FeaturesEnum.RULES_AGENTS}
            />
          }
        />
        <Route
          path={`/${FeatureRoutes.APPLIED_RULES}/*`}
          element={
            <PrivateRoute
              component={
                <SyncFilters
                  selectedNavTitle={RulesPageTitleEnum.APPLIED_RULES}
                >
                  <RulesPageAppliedRulesWrapper />
                </SyncFilters>
              }
              feature={FeaturesEnum.APPLIED_RULES}
            />
          }
        />
        <Route
          path="*"
          element={
            <PrivateRoute
              component={
                <Navigate to={`${FeatureRoutes.RULES_AGENTS}`} replace />
              }
            />
          }
        />
      </Routes>
    </div>
  );
}
