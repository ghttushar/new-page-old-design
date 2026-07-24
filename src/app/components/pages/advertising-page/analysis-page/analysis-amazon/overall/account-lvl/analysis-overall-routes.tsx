import SyncFilters from '@/app/components/hoc/sync-filters';
import { ImpactAnalysisTableTitles } from '@/enums/impact-analysis.enums';
import { Navigate, Route, Routes } from 'react-router-dom';
import AnalysisAdGroupsPage from './ad-groups/amz-all-acct-lvl-adgroups-analysis';
import AnalysisCampaignsPage from './campaigns/amz-all-acct-lvl-campaigns-analysis';
import AnalysisKeywordsPage from './keywords/amz-all-acct-lvl-keywords-analysis';
import AnalysisProductsPage from './products/amz-all-acct-lvl-products-analysis';
import AnalysisSTRPage from './search-term/amz-all-acct-lvl-str-analysis';

export default function AnalysisOverallRoutes() {
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
        path={`/${ImpactAnalysisTableTitles.SEARCH_TERM}`}
        element={
          <SyncFilters selectedNavTitle={ImpactAnalysisTableTitles.SEARCH_TERM}>
            <AnalysisSTRPage />
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
