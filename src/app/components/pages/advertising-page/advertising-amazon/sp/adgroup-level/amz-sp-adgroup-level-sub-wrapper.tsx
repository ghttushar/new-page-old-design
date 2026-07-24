import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import { IAdvertisingAdGroupLevelSubWrapperProps } from '@/interfaces/advertising/advertising.interface';
import {
  IAdGroup,
  ICampaign,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import AdvertisingAdgrpLevelAuto from './adgroup-level-tabs/adgroup-level-auto/amz-sp-adgroup-level-auto';
import AdvertisingAdgrpLevelKT from './adgroup-level-tabs/adgroup-level-kt/amz-sp-adgroup-level-kt';
import AdvertisingAdgrpLevelNegKT from './adgroup-level-tabs/adgroup-level-neg-kt/amz-sp-adgroup-level-neg-kt';
import AdvertisingAdgrpLevelNegPT from './adgroup-level-tabs/adgroup-level-neg-pt/amz-sp-adgroup-level-neg-pt';
import AdvertisingAdgrpLevelProductAds from './adgroup-level-tabs/adgroup-level-product-ads/amz-sp-adgroup-level-product-ads';
import AdvertisingAdgrpLevelPT from './adgroup-level-tabs/adgroup-level-pt/amz-sp-adgroup-level-pt';
import AdvertisingAdgrpLevelSearchTerm from './adgroup-level-tabs/adgroup-level-search-term/amz-sp-adgroup-level-search-term';

export default function AdvertisingAdGroupLevelSubWrapper<
  T extends IAdGroup | null,
  K extends ICampaign | null
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
            <AdvertisingAdgrpLevelProductAds
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
            <AdvertisingAdgrpLevelPT
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
        path={`/${AdvertisingTabRoutes.AUTO_TARGETING}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingAdgrpLevelAuto
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
            <AdvertisingAdgrpLevelKT
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
            <AdvertisingAdgrpLevelNegKT
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
            <AdvertisingAdgrpLevelNegPT
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
            <AdvertisingAdgrpLevelSearchTerm
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
