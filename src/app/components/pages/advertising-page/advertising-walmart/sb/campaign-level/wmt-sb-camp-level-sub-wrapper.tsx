import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import PrivateRoute from '@/app/components/private-route/private-route';
import { IAdvertisingCampLevelSubWrapperProps } from '@/interfaces/advertising/advertising.interface';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import { IWalmartCampaign } from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import AdvertisingWalmartSBAdgroupLevel from '../adgroup-level/wmt-sb-adgroup-level';
import AdvertisingWalmartSBCampLevelAdGroup from './camp-level-tabs/camp-level-adgroup/wmt-sb-camp-level-adgroup';
import AdvertisingWalmartSBCampLevelAutomationRules from './camp-level-tabs/camp-level-automation-rules/wmt-sb-camp-level-automation-rules';
import AdvertisingWalmartSBCampLevelBrands from './camp-level-tabs/camp-level-brands/wmt-sb-camp-level-brands';
import AdvertisingWalmartSBCampLevelKT from './camp-level-tabs/camp-level-kt/wmt-sb-camp-level-kt';
import AdvertisingWalmartSBCampLevelPageType from './camp-level-tabs/camp-level-page-type/wmt-sb-camp-level-page-type';
import AdvertisingWalmartSBCampLevelPlatform from './camp-level-tabs/camp-level-platform/wmt-sb-camp-level-platform';
import AdvertisingWalmartSBCampLevelProductAds from './camp-level-tabs/camp-level-products/wmt-sb-camp-level-products';

export default function AdvertisingWalmartSBCampLevelSubWrapper<
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
              <AdvertisingWalmartSBAdgroupLevel
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
            <AdvertisingWalmartSBCampLevelAdGroup
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
            <AdvertisingWalmartSBCampLevelProductAds
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
            <AdvertisingWalmartSBCampLevelKT
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
            <AdvertisingWalmartSBCampLevelPageType
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
            <AdvertisingWalmartSBCampLevelPlatform
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
        path={`/${AdvertisingTabRoutes.BRANDS}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingWalmartSBCampLevelBrands
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
            <AdvertisingWalmartSBCampLevelAutomationRules
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
