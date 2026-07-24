import SyncFilters from '@/app/components/hoc/sync-filters';
import { ImpactAnalysisTableTitles } from '@/enums/impact-analysis.enums';
import { Navigate, Route, Routes } from 'react-router-dom';
import AnalysisAdGroupsPage from './ad-groups/wmt-sv-acct-lvl-ad-groups-analysis';
import AnalysisCampaignsPage from './campaigns/wmt-sv-acct-lvl-campaigns-analysis';
import AnalysisKeywordsPage from './keywords/wmt-sv-acct-lvl-keywords-analysis';
import AnalysisProductsPage from './products/wmt-sv-acct-lvl-products-analysis';

export default function AnalysisSVRoutes() {
  return (
    <Routes>w
      <Route
        path={`/${ImpactAnalysisTableTitles.CAMPAIGN}`}
        element={
          <SyncFilters selectedNavTitle={ImpactAnalysisTableTitles.CAMPAIGN}>
            <AnalysisCampaignsPage />
          </SyncFilters>
        }
      />
      <Route
        path={`/${ImpactAnalysisTableTitles.AD_GROUP}`}
        element={
          <SyncFilters selectedNavTitle={ImpactAnalysisTableTitles.AD_GROUP}>
            <AnalysisAdGroupsPage />
          </SyncFilters>
        }
      />
      <Route
        path={`/${ImpactAnalysisTableTitles.PRODUCT_ADS}`}
        element={
          <SyncFilters selectedNavTitle={ImpactAnalysisTableTitles.PRODUCT_ADS}>
            <AnalysisProductsPage />
          </SyncFilters>
        }
      />
      <Route
        path={`/${ImpactAnalysisTableTitles.KEYWORDS}`}
        element={
          <SyncFilters selectedNavTitle={ImpactAnalysisTableTitles.KEYWORDS}>
            <AnalysisKeywordsPage />
          </SyncFilters>
        }
      />
      <Route
        path="*"
        element={<Navigate to={ImpactAnalysisTableTitles.CAMPAIGN} />}
      />
    </Routes>
  );
}
