import SyncFilters from '@/app/components/hoc/sync-filters';
import { ImpactAnalysisTableTitles } from '@/enums/impact-analysis.enums';
import { Navigate, Route, Routes } from 'react-router-dom';
import AnalysisAdGroupsPage from './ad-groups/amz-sd-acct-lvl-ad-groups-analysis';
import AnalysisCampaignsPage from './campaigns/amz-sd-acct-lvl-campaigns-analysis';
import AnalysisProductsPage from './products/amz-sd-acct-lvl-products-analysis';

export default function AnalysisSDRoutes() {
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
        path="*"
        element={<Navigate to={ImpactAnalysisTableTitles.CAMPAIGN} />}
      />
    </Routes>
  );
}
