import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import PrivateRoute from '@/app/components/private-route/private-route';
import { IAdvertisingCampLevelSubWrapperProps } from '@/interfaces/advertising/advertising.interface';
import { ISBCampaign } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import AdvertisingSBAdGroupLevel from '../adgroup-level/amz-sb-adgroup-level';
import AdvertisingSBCampLevelAdGroup from './camp-level-tabs/camp-level-adgroup/amz-sb-camp-level-adgroup';
import AdvertisingSBCampLevelAutomationRules from './camp-level-tabs/camp-level-automation-rules/amz-sb-camp-level-automation-rules';
import AdvertisingSBCampLevelKT from './camp-level-tabs/camp-level-kt/amz-sb-camp-level-kt';
import AdvertisingSBCampLevelNegKT from './camp-level-tabs/camp-level-neg-kt/amz-sb-camp-level-neg-kt';
import AdvertisingSBCampLevelNegPT from './camp-level-tabs/camp-level-neg-pt/amz-sb-camp-level-neg-pt';
import AdvertisingSBCampLevelProductAds from './camp-level-tabs/camp-level-products/amz-sb-camp-level-products';
import AdvertisingSBCampLevelPT from './camp-level-tabs/camp-level-pt/amz-sb-camp-level-pt';
import AdvertisingSBCampLevelSearchTerm from './camp-level-tabs/camp-level-search-term/amz-sb-camp-level-search-term';

export default function AdvertisingSBCampLevelSubWrapper<
  T extends ISBCampaign | null
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
              <AdvertisingSBAdGroupLevel
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
            <AdvertisingSBCampLevelAdGroup
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
            <AdvertisingSBCampLevelProductAds
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
        path={`/${AdvertisingTabRoutes.KEYWORD_TARGETING}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSBCampLevelKT
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
        path={`/${AdvertisingTabRoutes.PRODUCT_TARGETING}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSBCampLevelPT
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
        path={`/${AdvertisingTabRoutes.SEARCH_TERM}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSBCampLevelSearchTerm
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
        path={`/${AdvertisingTabRoutes.NEG_TARGETING_KEYWORD}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSBCampLevelNegKT
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
        path={`/${AdvertisingTabRoutes.NEG_TARGETING_PRODUCT}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSBCampLevelNegPT
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
            <AdvertisingSBCampLevelAutomationRules
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
