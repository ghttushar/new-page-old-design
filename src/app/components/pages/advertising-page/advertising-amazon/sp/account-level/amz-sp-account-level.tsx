import PrivateRoute from '@/app/components/private-route/private-route';
import { AdvertisingTabRoutes } from '@/enums/advertising.enums';

import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdvertisingCampLevel from '../campaign-level/amz-sp-camp-level';
import AdvertisingAccountLevelAdgroup from './account-level-tabs/account-level-adgroup/amz-sp-account-level-adgroup';
import AdvertisingAccountLevelAuto from './account-level-tabs/account-level-auto/amz-sp-account-level-auto';
import AdvertisingAccountLevelCampaign from './account-level-tabs/account-level-campaign/amz-sp-account-level-campaign';
import AdvertisingAccountLevelKT from './account-level-tabs/account-level-kt/amz-sp-account-level-kt';
import AdvertisingAccountLevelPlacement from './account-level-tabs/account-level-placement/amz-sp-account-level-placement';
import AdvertisingAccountLevelProductAds from './account-level-tabs/account-level-product-ads/amz-sp-account-level-product-ads';
import AdvertisingAccountLevelPT from './account-level-tabs/account-level-pt/amz-sp-account-level-pt';
import AdvertisingAccountLevelSearchTerms from './account-level-tabs/account-level-search-term/amz-sp-account-level-search-term';

export default function AdvertisingAccountLevel() {
  return (
    <Routes>
      <Route
        path="/campaign/:campaignId/*"
        element={<PrivateRoute component={<AdvertisingCampLevel />} />}
      />

      <Route
        path={`/${AdvertisingTabRoutes.CAMPAIGN}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <AdvertisingAccountLevelCampaign />
              </SyncCampaignManagerFilters>
            }
          />
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.AD_GROUP}`}
        element={
          <SyncCampaignManagerFilters>
            <PrivateRoute component={<AdvertisingAccountLevelAdgroup />} />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.PRODUCT_ADS}`}
        element={
          <SyncCampaignManagerFilters>
            <PrivateRoute component={<AdvertisingAccountLevelProductAds />} />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.KEYWORD_TARGETING}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <AdvertisingAccountLevelKT />
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
                <AdvertisingAccountLevelPT />
              </SyncCampaignManagerFilters>
            }
          />
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.AUTO_TARGETING}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <AdvertisingAccountLevelAuto />
              </SyncCampaignManagerFilters>
            }
          />
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.SEARCH_TERM}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingAccountLevelSearchTerms />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.PLACEMENT}`}
        element={
          <PrivateRoute
            component={
              <SyncCampaignManagerFilters>
                <AdvertisingAccountLevelPlacement />
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
