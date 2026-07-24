import { Navigate, Route, Routes } from 'react-router-dom';

import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import { IAdvertisingAdGroupLevelSubWrapperProps } from '@/interfaces/advertising/advertising.interface';
import {
  ISDAdGroup,
  ISDCampaign,
} from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import AdvertisingSDAdGroupLevelCreative from './adgroup-level-tabs/adgroup-level-creative/amz-sd-adgroup-level-creative';
import AdvertisingSDAdGroupLevelProductAds from './adgroup-level-tabs/adgroup-level-products/amz-sd-adgroup-level-products';

export default function AdvertisingSDAdgroupLevelSubWrapper<
  T extends ISDAdGroup | null,
  K extends ISDCampaign | null
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
            <AdvertisingSDAdGroupLevelProductAds
              campaignId={campaignId}
              adGroupId={adGroupId}
              adGroupSubHeaderData={adGroupSubHeaderData}
              getFilters={getFilters}
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
        path={`/${AdvertisingTabRoutes.CREATIVE}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingSDAdGroupLevelCreative
              campaignId={campaignId}
              adGroupId={adGroupId}
              adGroupSubHeaderData={adGroupSubHeaderData}
              getFilters={getFilters}
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
