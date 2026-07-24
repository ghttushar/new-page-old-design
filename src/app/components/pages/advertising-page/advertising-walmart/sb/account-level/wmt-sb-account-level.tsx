import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import PrivateRoute from '@/app/components/private-route/private-route';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import AdvertisingWalmartSBCampLevel from '../campaign-level/wmt-sb-camp-level';
import AdvertisingWalmartSBAccountLevelAdGroup from './account-level-tabs/account-level-adgroup/wmt-sb-account-level-adgroup';
import AdvertisingWalmartSBAccountLevelCampaign from './account-level-tabs/account-level-campaign/wmt-sb-account-level-campaign';
import AdvertisingWalmartSBAccountLevelKT from './account-level-tabs/account-level-kt/wmt-sb-account-level-kt';
import AdvertisingWalmartSBAccountLevelPageType from './account-level-tabs/account-level-page-type/wmt-sb-account-level-page-type';
import AdvertisingWalmartSBAccountLevelPlatform from './account-level-tabs/account-level-platform/wmt-sb-account-level-platform';
import AdvertisingWalmartSBAccountLevelProductAds from './account-level-tabs/account-level-products/wmt-sb-account-level-products';

export default function AdvertisingWalmartSBAccountLevel() {
  return (
    <Routes>
      <Route
        path="/campaign/:campaignId/*"
        element={<PrivateRoute component={<AdvertisingWalmartSBCampLevel />} />}
      />

      <Route
        path={`/${AdvertisingTabRoutes.CAMPAIGN}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <AdvertisingWalmartSBAccountLevelCampaign />
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
                <AdvertisingWalmartSBAccountLevelAdGroup />
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
                <AdvertisingWalmartSBAccountLevelProductAds />
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
                <AdvertisingWalmartSBAccountLevelKT />
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
                <AdvertisingWalmartSBAccountLevelPageType />
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
                <AdvertisingWalmartSBAccountLevelPlatform />
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
