import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import PrivateRoute from '@/app/components/private-route/private-route';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import WalmartOverallAccountLevelAdGroup from './account-level-tabs/account-level-adgroup/wmt-overall-account-level-adgroup';
import WalmartOverallAccountLevelCampaign from './account-level-tabs/account-level-campaign/wmt-overall-account-level-campaign';
import WalmartOverallAccountLevelKT from './account-level-tabs/account-level-kt/wmt-overall-account-level-kt';
import WalmartOverallAccountLevelPageType from './account-level-tabs/account-level-page-type/wmt-overall-account-level-page-type';
import WalmartOverallAccountLevelPlatform from './account-level-tabs/account-level-platform/wmt-overall-account-level-platform';
import WalmartOverallAccountLevelProductAds from './account-level-tabs/account-level-products/wmt-overall-account-level-products';
import WalmartOverallAccountLevelSearchTerm from './account-level-tabs/account-level-search-term/wmt-overall-account-level-search-term';

export default function AdvertisingWalmartOverall() {
  return (
    <Routes>
      <Route
        path={`/${AdvertisingTabRoutes.CAMPAIGN}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <WalmartOverallAccountLevelCampaign />
              </SyncCampaignManagerFilters>
            }
          />
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.AD_GROUP}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <WalmartOverallAccountLevelAdGroup />
              </SyncCampaignManagerFilters>
            }
          />
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.PRODUCT_ADS}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <WalmartOverallAccountLevelProductAds />
              </SyncCampaignManagerFilters>
            }
          />
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.KEYWORD_TARGETING}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <WalmartOverallAccountLevelKT />
              </SyncCampaignManagerFilters>
            }
          />
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.SEARCH_TERM}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <WalmartOverallAccountLevelSearchTerm />
              </SyncCampaignManagerFilters>
            }
          />
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.PAGE_TYPE}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <WalmartOverallAccountLevelPageType />
              </SyncCampaignManagerFilters>
            }
          />
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.PLATFORM}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <WalmartOverallAccountLevelPlatform />
              </SyncCampaignManagerFilters>
            }
          />
        }
      />

      <Route
        path="*"
        element={<Navigate to={`${AdvertisingTabRoutes.CAMPAIGN}`} replace />}
      />
    </Routes>
  );
}
