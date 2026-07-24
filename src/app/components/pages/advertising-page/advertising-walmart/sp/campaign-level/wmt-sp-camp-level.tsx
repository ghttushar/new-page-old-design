import AdvertisingEmptyState from '@/app/components/page-components/advertising-empty-state/advertising-empty-state';
import { QueryKeyEnums } from '@/enums/query.enums';
import { IAdvertisingParams } from '@/interfaces/advertising/advertising.interface';
import { IAdvertisingNavigationBarOption } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import { walmartSpCampaignPerformanceOptions } from 'src/constants/advertising-filter.constants';
import { WalmartSPCampaignLevelTitles } from 'src/enums/advertising.enums';
import { TargetingTypeEnum } from 'src/enums/walmart.enums';
import { IWalmartCampaign } from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAppliedFilter } from 'src/redux/slices/advertising/advertising-filter.slice';
import { walmartEntityServices } from 'src/services/advertising/walmart/walmart-sp-advertising.service';
import {
  getCampaignPageTypeData,
  getCampaignPlatformData,
  getInitializedNavOptions,
  getWalmartAdvertisingFilters,
} from 'src/utils/advertising.utils';
import AdvertisingWalmartSPCampLevelSubWrapper from './wmt-sp-camp-level-sub-wrapper';

export default function AdvertisingWalmartSPCampLevel() {
  const [campaignSubHeaderData, setCampaignSubHeaderData] =
    useState<IWalmartCampaign | null>(null);
  const [updatedPerformanceOptions, setUpdatedPerformanceOptions] = useState<
    IAdvertisingNavigationBarOption[]
  >([]);

  const params = useParams<IAdvertisingParams>();
  const appliedAdvertisingFilters = useAppSelector(
    selectAdvertisingAppliedFilter
  );

  const campaignId = useMemo(
    () => params.campaignId as string,
    [params.campaignId]
  );

  const getFormattedFilters = useCallback(
    (isDownload: boolean, isAllDownload: boolean) => {
      return getWalmartAdvertisingFilters(
        appliedAdvertisingFilters,
        appliedAdvertisingFilters.customDateRange,
        isDownload,
        campaignId,
        '',
        isAllDownload
      );
    },
    [campaignId, appliedAdvertisingFilters]
  );

  const formattedAdvFiltersNoDownload = useMemo(() => {
    return getFormattedFilters(false, false);
  }, [getFormattedFilters]);

  const fetchSelectedCampaign = useAppQuery({
    queryKey: [QueryKeyEnums.WMT_SP_CAMPAIGN_LVL_FETCH, campaignId],
    queryFn: () => walmartEntityServices.getCampaignEntity(campaignId),
  });

  useEffect(() => {
    setCampaignSubHeaderData(null);
    setUpdatedPerformanceOptions(
      getInitializedNavOptions(walmartSpCampaignPerformanceOptions)
    );
    if (fetchSelectedCampaign.data) {
      const data = fetchSelectedCampaign.data.data.data;
      const dataKeys = data && Object.keys(data);
      let updatedOptions = [...walmartSpCampaignPerformanceOptions];

      if (!data || !dataKeys || !dataKeys.length) {
        setCampaignSubHeaderData(null);
        return;
      }

      const pageTypes = getCampaignPageTypeData(
        `${data.campaignId}`,
        data.targetingType,
        data.pageTypes
      );

      const platforms = getCampaignPlatformData(
        `${data.campaignId}`,
        data.platforms
      );

      if (pageTypes.length > 0) data.pageTypes = pageTypes;
      if (platforms.length > 0) data.platforms = platforms;

      setCampaignSubHeaderData(data);

      if (data && data.targetingType === TargetingTypeEnum.AUTO) {
        updatedOptions = updatedOptions.filter(
          (option) =>
            option.value !== WalmartSPCampaignLevelTitles.KEYWORD_TARGETING
        );
      }

      setUpdatedPerformanceOptions(updatedOptions);
    }
  }, [fetchSelectedCampaign.data, campaignId]);

  const isSubHeaderLoading = useMemo(() => {
    return (
      fetchSelectedCampaign.isLoading ||
      fetchSelectedCampaign.isRefetching ||
      fetchSelectedCampaign.isPending ||
      !fetchSelectedCampaign.data
    );
  }, [
    fetchSelectedCampaign.isLoading,
    fetchSelectedCampaign.isRefetching,
    fetchSelectedCampaign.isPending,
    fetchSelectedCampaign.data,
  ]);

  if (isSubHeaderLoading === true) return <LoaderWrapper />;

  if (!campaignSubHeaderData) return <AdvertisingEmptyState />;

  return (
    <AdvertisingWalmartSPCampLevelSubWrapper
      campaignId={campaignId}
      campaignSubHeaderData={campaignSubHeaderData}
      updatedPerformanceOptions={updatedPerformanceOptions}
      getFilters={getFormattedFilters}
      isSubHeaderLoading={isSubHeaderLoading}
      advertisingFiltersWithNoDownload={formattedAdvFiltersNoDownload}
    />
  );
}
