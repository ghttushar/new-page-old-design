import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import PrivateRoute from '@/app/components/private-route/private-route';
import { IAdvertisingCampLevelSubWrapperProps } from '@/interfaces/advertising/advertising.interface';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import { IWalmartCampaign } from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import AdvertisingWalmartSVAdGroupLevel from '../adgroup-level/wmt-sv-adgroup-level';
import AdvertisingWalmartSVCampLevelAdGroup from './camp-level-tabs/camp-level-adgroup/wmt-sv-camp-level-adgroup';
import AdvertisingWalmartSVCampLevelAutomationRules from './camp-level-tabs/camp-level-automation-rules/wmt-sv-camp-level-automation-rules';
import AdvertisingWalmartSVCampLevelKT from './camp-level-tabs/camp-level-kt/wmt-sv-camp-level-kt';
import AdvertisingWalmartSVCampLevelPageType from './camp-level-tabs/camp-level-page-type/wmt-sv-camp-level-page-type';
import AdvertisingWalmartSVCampLevelPlatform from './camp-level-tabs/camp-level-platform/wmt-sv-camp-level-platform';
import AdvertisingWalmartSVCampLevelProductAds from './camp-level-tabs/camp-level-products/wmt-sv-camp-level-products';

export default function AdvertisingWalmartSVCampLevelSubWrapper<
  T extends IWalmartCampaign | null
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
              <AdvertisingWalmartSVAdGroupLevel
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
            <AdvertisingWalmartSVCampLevelAdGroup
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
            <AdvertisingWalmartSVCampLevelProductAds
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
            <AdvertisingWalmartSVCampLevelKT
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
            <AdvertisingWalmartSVCampLevelPageType
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
            <AdvertisingWalmartSVCampLevelPlatform
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
            <AdvertisingWalmartSVCampLevelAutomationRules
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
