import SyncCampaignManagerFilters from '@/app/components/hoc/sync-cm-filters';
import PrivateRoute from '@/app/components/private-route/private-route';
import { IAdvertisingCampLevelSubWrapperProps } from '@/interfaces/advertising/advertising.interface';
import { ICampaign } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdvertisingTabRoutes } from 'src/enums/advertising.enums';
import AdvertisingAdGroupLevel from '../adgroup-level/amz-sp-adgroup-level';
import AdvertisingCampLevelAdgroup from './camp-level-tabs/camp-level-adgroup/amz-sp-camp-level-adgroup';
import AdvertisingCampLevelAutoTargeting from './camp-level-tabs/camp-level-auto/amz-sp-camp-level-auto';
import AdvertisingCampLevelAutomationRules from './camp-level-tabs/camp-level-automation-rules/amz-sp-camp-level-automation-rules';
import AdvertisingCampLevelKT from './camp-level-tabs/camp-level-kt/amz-sp-camp-level-kt';
import AdvertisingCampLevelNegKT from './camp-level-tabs/camp-level-neg-kt/amz-sp-camp-level-neg-kt';
import AdvertisingCampLevelNegPT from './camp-level-tabs/camp-level-neg-pt/amz-sp-camp-level-neg-pt';
import AdvertisingCampLevelPlacement from './camp-level-tabs/camp-level-placement/amz-sp-camp-level-placement';
import AdvertisingCampLevelProductAds from './camp-level-tabs/camp-level-product-ads/amz-sp-camp-level-product-ads';
import AdvertisingCampLevelPT from './camp-level-tabs/camp-level-pt/amz-sp-camp-level-pt';
import AdvertisingCampLevelSearchTerm from './camp-level-tabs/camp-level-search-term/amz-sp-camp-level-search-term';

export default function AdvertisingCampLevelSubWrapper<
  T extends ICampaign | null
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
              <AdvertisingAdGroupLevel
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
            <AdvertisingCampLevelAdgroup
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
        path={`/${AdvertisingTabRoutes.AUTO_TARGETING}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingCampLevelAutoTargeting
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
            <AdvertisingCampLevelKT
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
        path={`/${AdvertisingTabRoutes.NEG_TARGETING_KEYWORD}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingCampLevelNegKT
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
        path={`/${AdvertisingTabRoutes.NEG_TARGETING_PRODUCT}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingCampLevelNegPT
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
        path={`/${AdvertisingTabRoutes.PLACEMENT}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingCampLevelPlacement
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
            <AdvertisingCampLevelProductAds
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
        path={`/${AdvertisingTabRoutes.PRODUCT_TARGETING}`}
        element={
          <SyncCampaignManagerFilters>
            <AdvertisingCampLevelPT
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
            <AdvertisingCampLevelSearchTerm
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
            <AdvertisingCampLevelAutomationRules
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
