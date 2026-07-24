import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import { IAdvertisingAdGroupLevelSubWrapperProps } from '@/interfaces/advertising/advertising.interface';
import {
  ISBAdGroup,
  ISBCampaign,
} from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import AdvertisingSBAdGroupLevelKT from './adgroup-level-tabs/adgroup-level-kt/amz-sb-adgroup-level-kt';
import AdvertisingSBAdGroupLevelNegKT from './adgroup-level-tabs/adgroup-level-neg-kt/amz-sb-adgroup-level-neg-kt';
import AdvertisingSBAdGroupLevelNegPT from './adgroup-level-tabs/adgroup-level-neg-pt/amz-sb-adgroup-level-neg-pt';
import AdvertisingSBAdGroupLevelProductAds from './adgroup-level-tabs/adgroup-level-products/amz-sb-adgroup-level-products';
import AdvertisingSBAdGroupLevelPT from './adgroup-level-tabs/adgroup-level-pt/amz-sb-adgroup-level-pt';
import AdvertisingSBAdGroupLevelSearchTerm from './adgroup-level-tabs/adgroup-level-search-term/amz-sb-adgroup-level-search-term';

export default function AdvertisingSBAdgroupLevelSubWrapper<
  T extends ISBAdGroup | null,
  K extends ISBCampaign | null
>({
  campaignId,
  adGroupId,
  adGroupSubHeaderData,
  isSubHeaderLoading,
  updatedPerformanceOptions,
  getFilters,
  advertisingFiltersWithNoDownload,
  selectedCampaign,
}: IAdvertisingAdGroupLevelSubWrapperProps<T, K>) {
  return (
    <Routes>
      <Route
        path={`/${AdvertisingTabRoutes.PRODUCT_ADS}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSBAdGroupLevelProductAds
              campaignId={campaignId}
              adGroupId={adGroupId}
              adGroupSubHeaderData={adGroupSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              getFilters={getFilters}
              advertisingFiltersWithNoDownload={
                advertisingFiltersWithNoDownload
              }
              selectedCampaign={selectedCampaign}
            />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.KEYWORD_TARGETING}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSBAdGroupLevelKT
              campaignId={campaignId}
              adGroupId={adGroupId}
              adGroupSubHeaderData={adGroupSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              getFilters={getFilters}
              advertisingFiltersWithNoDownload={
                advertisingFiltersWithNoDownload
              }
              selectedCampaign={selectedCampaign}
            />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.PRODUCT_TARGETING}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSBAdGroupLevelPT
              campaignId={campaignId}
              adGroupId={adGroupId}
              adGroupSubHeaderData={adGroupSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              getFilters={getFilters}
              advertisingFiltersWithNoDownload={
                advertisingFiltersWithNoDownload
              }
              selectedCampaign={selectedCampaign}
            />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.SEARCH_TERM}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSBAdGroupLevelSearchTerm
              campaignId={campaignId}
              adGroupId={adGroupId}
              adGroupSubHeaderData={adGroupSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              getFilters={getFilters}
              advertisingFiltersWithNoDownload={
                advertisingFiltersWithNoDownload
              }
              selectedCampaign={selectedCampaign}
            />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.NEG_TARGETING_KEYWORD}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSBAdGroupLevelNegKT
              campaignId={campaignId}
              adGroupId={adGroupId}
              adGroupSubHeaderData={adGroupSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              getFilters={getFilters}
              advertisingFiltersWithNoDownload={
                advertisingFiltersWithNoDownload
              }
              selectedCampaign={selectedCampaign}
            />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path={`/${AdvertisingTabRoutes.NEG_TARGETING_PRODUCT}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSBAdGroupLevelNegPT
              campaignId={campaignId}
              adGroupId={adGroupId}
              adGroupSubHeaderData={adGroupSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
              getFilters={getFilters}
              advertisingFiltersWithNoDownload={
                advertisingFiltersWithNoDownload
              }
              selectedCampaign={selectedCampaign}
            />
          </SyncCampaignManagerFilters>
        }
      />

      <Route
        path="*"
        element={
          <Navigate to={`${AdvertisingTabRoutes.PRODUCT_ADS}`} replace />
        }
      />
    </Routes>
  );
}
