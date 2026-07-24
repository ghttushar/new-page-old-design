import { Navigate, Route, Routes } from 'react-router-dom';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import { IWalmartCampaign } from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';

import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import PrivateRoute from '@/app/components/private-route/private-route';
import { IAdvertisingCampLevelSubWrapperProps } from '@/interfaces/advertising/advertising.interface';
import AdvertisingWalmartAdGroupLevel from '../adgroup-level/wmt-sp-adgroup-level';
import AdvertisingWalmartSPCampLevelAdGroup from './camp-level-tabs/camp-level-adgroup/wmt-sp-camp-level-adgroup';
import AdvertisingWalmartSPCampLevelAutomationRules from './camp-level-tabs/camp-level-automation-rules/wmt-sp-camp-level-automation-rules';
import AdvertisingWalmartSPCampLevelKT from './camp-level-tabs/camp-level-kt/wmt-sp-camp-level-kt';
import AdvertisingWalmartSPCampLevelPageType from './camp-level-tabs/camp-level-page-type/wmt-sp-camp-level-page-type';
import AdvertisingWalmartSPCampLevelPlatform from './camp-level-tabs/camp-level-platform/wmt-sp-camp-level-platform';
import AdvertisingWalmartSPCampLevelProductAds from './camp-level-tabs/camp-level-products/wmt-sp-camp-level-products';
import AdvertisingWalmartSPCampLevelSearchTerm from './camp-level-tabs/camp-level-search-term/wmt-sp-camp-level-search-term';

export default function AdvertisingWalmartSPCampLevelSubWrapper<
  T extends IWalmartCampaign
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
              <AdvertisingWalmartAdGroupLevel
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
            <AdvertisingWalmartSPCampLevelAdGroup
              campaignId={campaignId}
              campaignSubHeaderData={campaignSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              getFilters={getFilters}
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
            <AdvertisingWalmartSPCampLevelProductAds
              campaignId={campaignId}
              campaignSubHeaderData={campaignSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              getFilters={getFilters}
              advertisingFiltersWithNoDownload={
                advertisingFiltersWithNoDownload
              }
            />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.KEYWORD_TARGETING}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingWalmartSPCampLevelKT
              campaignId={campaignId}
              campaignSubHeaderData={campaignSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              getFilters={getFilters}
              advertisingFiltersWithNoDownload={
                advertisingFiltersWithNoDownload
              }
            />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.SEARCH_TERM}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingWalmartSPCampLevelSearchTerm
              campaignId={campaignId}
              campaignSubHeaderData={campaignSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              getFilters={getFilters}
              advertisingFiltersWithNoDownload={
                advertisingFiltersWithNoDownload
              }
            />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.PAGE_TYPE}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingWalmartSPCampLevelPageType
              campaignId={campaignId}
              campaignSubHeaderData={campaignSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              getFilters={getFilters}
              advertisingFiltersWithNoDownload={
                advertisingFiltersWithNoDownload
              }
            />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.PLATFORM}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingWalmartSPCampLevelPlatform
              campaignId={campaignId}
              campaignSubHeaderData={campaignSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              getFilters={getFilters}
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
            <AdvertisingWalmartSPCampLevelAutomationRules
              campaignId={campaignId}
              campaignSubHeaderData={campaignSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              getFilters={getFilters}
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
