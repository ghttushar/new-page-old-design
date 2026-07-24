import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import { IAdvertisingAdGroupLevelSubWrapperProps } from '@/interfaces/advertising/advertising.interface';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import {
  IWalmartAdGroup,
  IWalmartCampaign,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import AdvertisingWalmartSVAdGroupLevelKT from './adgroup-level-tabs/adgroup-level-kt/wmt-sv-adgroup-level-kt';
import AdvertisingWalmartSVAdGroupLevelProductAds from './adgroup-level-tabs/adgroup-level-products/wmt-sv-adgroup-level-products';

export default function AdvertisingWalmartSVAdGroupLevelSubWrapper<
  T extends IWalmartAdGroup,
  K extends IWalmartCampaign | null
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
            <AdvertisingWalmartSVAdGroupLevelProductAds
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
            <AdvertisingWalmartSVAdGroupLevelKT
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
