import { ISDCampaign } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { Navigate, Route, Routes } from 'react-router-dom';

import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import PrivateRoute from '@/app/components/private-route/private-route';
import { IAdvertisingCampLevelSubWrapperProps } from '@/interfaces/advertising/advertising.interface';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import AdvertisingSDAdgroupLevel from '../adgroup-level/amz-sd-adgroup-level';
import AdvertisingSDCampLevelAdGroup from './camp-level-tabs/camp-level-adgroup/amz-sd-camp-level-adgroup';
import AdvertisingSDCampLevelAutomationRules from './camp-level-tabs/camp-level-automation-rules/amz-sd-camp-level-automation-rules';
import AdvertisingSDCampLevelProductAds from './camp-level-tabs/camp-level-products/amz-sd-camp-level-products';

export default function AdvertisingSDCampLevelSubWrapper<
  T extends ISDCampaign | null
>({
  campaignId,
  campaignSubHeaderData,
  isSubHeaderLoading,
  updatedPerformanceOptions,
  getFilters,
  advertisingFiltersWithNoDownload,
}: IAdvertisingCampLevelSubWrapperProps<T>) {
  return (
    <Routes>
      <Route
        path="/ad-group/:adGroupId/*"
        element={
          <PrivateRoute
            component={
              <AdvertisingSDAdgroupLevel
                selectedCampaign={campaignSubHeaderData}
              />
            }
          />
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.AD_GROUP}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSDCampLevelAdGroup
              campaignId={campaignId}
              campaignSubHeaderData={campaignSubHeaderData}
              getFilters={getFilters}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              advertisingFiltersWithNoDownload={
                advertisingFiltersWithNoDownload
              }
            />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.PRODUCT_ADS}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSDCampLevelProductAds
              campaignId={campaignId}
              campaignSubHeaderData={campaignSubHeaderData}
              getFilters={getFilters}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              advertisingFiltersWithNoDownload={
                advertisingFiltersWithNoDownload
              }
            />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.AUTOMATION_RULES}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSDCampLevelAutomationRules
              campaignId={campaignId}
              campaignSubHeaderData={campaignSubHeaderData}
              getFilters={getFilters}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              advertisingFiltersWithNoDownload={
                advertisingFiltersWithNoDownload
              }
            />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path="*"
        element={<Navigate to={`${AdvertisingTabRoutes.AD_GROUP}`} replace />}
      />
    </Routes>
  );
}
