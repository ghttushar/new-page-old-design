import LoaderWrapper from '@/app/components/common/loader-wrapper/loader-wrapper';
import AdvertisingEmptyState from '@/app/components/page-components/advertising-empty-state/advertising-empty-state';
import { walmartSvCampaignLevelPerformanceOptions } from '@/constants/advertising-filter.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import { IAdvertisingParams } from '@/interfaces/advertising/advertising.interface';
import { IAdvertisingNavigationBarOption } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IWalmartCampaign } from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAppliedFilter } from 'src/redux/slices/advertising/advertising-filter.slice';
import { walmartEntityServices } from 'src/services/advertising/walmart/walmart-sp-advertising.service';
import {
  getInitializedNavOptions,
  getWalmartAdvertisingFilters,
} from 'src/utils/advertising.utils';
import AdvertisingWalmartSVCampLevelSubWrapper from './wmt-sv-camp-level-sub-wrapper';

export default function AdvertisingWalmartSVCampLevel() {
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
    [appliedAdvertisingFilters, campaignId]
  );

  const formattedAdvFiltersNoDownload = useMemo(() => {
    return getFormattedFilters(false, false);
  }, [getFormattedFilters]);

  const fetchSelectedCampaign = useAppQuery({
    queryKey: [QueryKeyEnums.WMT_SV_CAMPAIGN_LVL_FETCH, campaignId],
    queryFn: () => walmartEntityServices.getCampaignEntity(campaignId),
  });

  useEffect(() => {
    setCampaignSubHeaderData(null);
    setUpdatedPerformanceOptions(
      getInitializedNavOptions(walmartSvCampaignLevelPerformanceOptions)
    );

    if (fetchSelectedCampaign.data) {
      const data = fetchSelectedCampaign.data.data.data;
      const dataKeys = data && Object.keys(data);

      if (!data || !dataKeys || !dataKeys.length) {
        setCampaignSubHeaderData(null);
        return;
      }

      setCampaignSubHeaderData(data);
      setUpdatedPerformanceOptions(walmartSvCampaignLevelPerformanceOptions);
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
    <AdvertisingWalmartSVCampLevelSubWrapper
      campaignId={campaignId}
      campaignSubHeaderData={campaignSubHeaderData}
      updatedPerformanceOptions={updatedPerformanceOptions}
      getFilters={getFormattedFilters}
      isSubHeaderLoading={isSubHeaderLoading}
      advertisingFiltersWithNoDownload={formattedAdvFiltersNoDownload}
    />
  );
}
