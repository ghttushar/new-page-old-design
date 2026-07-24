import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import PrivateRoute from '@/app/components/private-route/private-route';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import AdvertisingWalmartSVCampLevel from '../campaign-level/wmt-sv-camp-level';
import AdvertisingWalmartSVAccountLevelAdGroup from './account-level-tabs/account-level-adgroup/wmt-sv-account-level-adgroup';
import AdvertisingWalmartSVAccountLevelCampaign from './account-level-tabs/account-level-campaign/wmt-sv-account-level-campaign';
import AdvertisingWalmartSVAccountLevelKT from './account-level-tabs/account-level-kt/wmt-sv-account-level-kt';
import AdvertisingWalmartSVAccountLevelPageType from './account-level-tabs/account-level-page-type/wmt-sv-account-level-page-type';
import AdvertisingWalmartSVAccountLevelPlatform from './account-level-tabs/account-level-platform/wmt-sv-account-level-platform';
import AdvertisingWalmartSVAccountLevelProductAds from './account-level-tabs/account-level-products/wmt-sv-account-level-products';

export default function AdvertisingWalmartSVAccountLevel() {
  return (
    <Routes>
      <Route
        path="/campaign/:campaignId/*"
        element={<PrivateRoute component={<AdvertisingWalmartSVCampLevel />} />}
      />

      <Route
        path={`/${AdvertisingTabRoutes.CAMPAIGN}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <AdvertisingWalmartSVAccountLevelCampaign />
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
                <AdvertisingWalmartSVAccountLevelAdGroup />
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
                <AdvertisingWalmartSVAccountLevelProductAds />
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
                <AdvertisingWalmartSVAccountLevelKT />
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
                <AdvertisingWalmartSVAccountLevelPageType />
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
                <AdvertisingWalmartSVAccountLevelPlatform />
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
