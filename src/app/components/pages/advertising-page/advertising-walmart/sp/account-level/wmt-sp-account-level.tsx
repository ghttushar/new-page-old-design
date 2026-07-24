import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import PrivateRoute from '@/app/components/private-route/private-route';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import AdvertisingWalmartSPCampLevel from '../campaign-level/wmt-sp-camp-level';
import AdvertisingWalmartSPAccountLevelAdGroup from './account-level-tabs/account-level-adgroup/wmt-sp-account-level-adgroup';
import AdvertisingWalmartSPAccountLevelCampaign from './account-level-tabs/account-level-campaign/wmt-sp-account-level-campaign';
import AdvertisingWalmartSPAccountLevelKT from './account-level-tabs/account-level-kt/wmt-sp-account-level-kt';
import AdvertisingWalmartSPAccountLevelPageType from './account-level-tabs/account-level-page-type/wmt-sp-account-level-page-type';
import AdvertisingWalmartSPAccountLevelPlatform from './account-level-tabs/account-level-platform/wmt-sp-account-level-platform';
import AdvertisingWalmartSPAccountLevelProductAds from './account-level-tabs/account-level-products/wmt-sp-account-level-products';
import AdvertisingWalmartSPAccountLevelSearchTerm from './account-level-tabs/account-level-search-term/wmt-sp-account-level-search-term';

export default function AdvertisingWalmartSPAccountLevel() {
  return (
    <Routes>
      <Route
        path="/campaign/:campaignId/*"
        element={<PrivateRoute component={<AdvertisingWalmartSPCampLevel />} />}
      />

      <Route
        path={`/${AdvertisingTabRoutes.CAMPAIGN}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <AdvertisingWalmartSPAccountLevelCampaign />
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
                <AdvertisingWalmartSPAccountLevelAdGroup />
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
                <AdvertisingWalmartSPAccountLevelProductAds />
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
                <AdvertisingWalmartSPAccountLevelKT />
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
                <AdvertisingWalmartSPAccountLevelSearchTerm />
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
                <AdvertisingWalmartSPAccountLevelPageType />
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
                <AdvertisingWalmartSPAccountLevelPlatform />
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
