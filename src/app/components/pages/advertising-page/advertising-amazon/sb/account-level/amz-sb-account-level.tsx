import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import PrivateRoute from '@/app/components/private-route/private-route';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import AdvertisingSBCampLevel from '../campaign-level/amz-sb-camp-level';
import AdvertisingSBAccountLevelAdGroup from './account-level-tabs/account-level-adgroup/amz-sb-account-level-adgroup';
import AdvertisingSBAccountLevelCampaign from './account-level-tabs/account-level-campaign/amz-sb-account-level-campaign';
import AdvertisingSBAccountLevelKT from './account-level-tabs/account-level-kt/amz-sb-account-level-kt';
import AdvertisingSBAccountLevelProductAds from './account-level-tabs/account-level-products/amz-sb-account-level-products';
import AdvertisingSBAccountLevelPT from './account-level-tabs/account-level-pt/amz-sb-account-level-pt';
import AdvertisingSBAccountLevelSearchTerm from './account-level-tabs/account-level-search-term/amz-sb-account-level-search-term';

export default function AdvertisingSBAccountLevel() {
  return (
    <Routes>
      <Route
        path="/campaign/:campaignId/*"
        element={<PrivateRoute component={<AdvertisingSBCampLevel />} />}
      />

      <Route
        path={`/${AdvertisingTabRoutes.CAMPAIGN}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <AdvertisingSBAccountLevelCampaign />
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
                <AdvertisingSBAccountLevelAdGroup />
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
                <AdvertisingSBAccountLevelProductAds />
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
                <AdvertisingSBAccountLevelKT />
              </SyncCampaignManagerFilters>
            }
          />
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.PRODUCT_TARGETING}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <AdvertisingSBAccountLevelPT />
              </SyncCampaignManagerFilters>
            }
          />
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.SEARCH_TERM}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSBAccountLevelSearchTerm />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path="*"
        element={<Navigate to={`${AdvertisingTabRoutes.CAMPAIGN}`} replace />}
      />
    </Routes>
  );
}
