import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import { IAdvertisingAdGroupLevelSubWrapperProps } from '@/interfaces/advertising/advertising.interface';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import {
  IWalmartAdGroup,
  IWalmartCampaign,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import AdvertisingWalmartSPAdGroupLevelKT from './adgroup-level-tabs/adgroup-level-kt/wmt-sp-adgroup-level-kt';
import AdvertisingWalmartSPAdGroupLevelProductAds from './adgroup-level-tabs/adgroup-level-products/wmt-sp-adgroup-level-products';
import AdvertisingWalmartSPAdGroupLevelSearchTerm from './adgroup-level-tabs/adgroup-level-search-term/wmt-sp-adgroup-level-search-term';

export default function AdvertisingWalmartSPAdGroupLevelSubWrapper<
  T extends IWalmartAdGroup,
  K extends IWalmartCampaign | undefined
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
            <AdvertisingWalmartSPAdGroupLevelProductAds
              campaignId={campaignId}
              adGroupId={adGroupId}
              getFilters={getFilters}
              adGroupSubHeaderData={adGroupSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
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
            <AdvertisingWalmartSPAdGroupLevelKT
              campaignId={campaignId}
              adGroupId={adGroupId}
              getFilters={getFilters}
              adGroupSubHeaderData={adGroupSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
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
            <AdvertisingWalmartSPAdGroupLevelSearchTerm
              campaignId={campaignId}
              adGroupId={adGroupId}
              getFilters={getFilters}
              adGroupSubHeaderData={adGroupSubHeaderData}
              isSubHeaderLoading={isSubHeaderLoading}
              updatedPerformanceOptions={updatedPerformanceOptions}
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
