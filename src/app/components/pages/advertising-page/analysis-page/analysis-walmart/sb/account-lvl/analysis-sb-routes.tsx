import SyncFilters from '@/app/components/hoc/sync-filters';
import { ImpactAnalysisTableTitles } from '@/enums/impact-analysis.enums';
import { Navigate, Route, Routes } from 'react-router-dom';
import AnalysisAdGroupsPage from './ad-groups/wmt-sb-acct-lvl-ad-groups-analysis';
import AnalysisCampaignsPage from './campaigns/wmt-sb-acct-lvl-campaigns-analysis';
import AnalysisKeywordsPage from './keywords/wmt-sb-acct-lvl-keywords-analysis';
import AnalysisProductsPage from './products/wmt-sb-acct-lvl-products-analysis';

export default function AnalysisSBRoutes() {
  return (
    <Routes>
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
