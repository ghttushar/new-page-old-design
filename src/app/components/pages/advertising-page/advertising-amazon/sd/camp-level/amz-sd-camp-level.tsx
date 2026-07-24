import LoaderWrapper from '@/app/components/common/loader-wrapper/loader-wrapper';
import AdvertisingEmptyState from '@/app/components/page-components/advertising-empty-state/advertising-empty-state';
import { QueryKeyEnums } from '@/enums/query.enums';
import { IAdvertisingParams } from '@/interfaces/advertising/advertising.interface';
import { ISDCampaign } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { IAdvertisingNavigationBarOption } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAppliedFilter } from '@/redux/slices/advertising/advertising-filter.slice';
import {
  getAmazonAdvertisingFilters,
  getInitializedNavOptions,
} from '@/utils/advertising.utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sdCampaignPerformanceOptions } from 'src/constants/advertising-filter.constants';
import { sdAdvertisingEntityServices } from 'src/services/advertising/amazon/sd-advertising.service';
import AdvertisingSDCampLevelSubWrapper from './amz-sd-camp-level-sub-wrapper';

export default function AdvertisingSDCampLevel() {
  const [campaignSubHeaderData, setCampaignSubHeaderData] =
    useState<ISDCampaign | null>(null);
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
    (isDownload: boolean, downloadWithFilter: boolean) => {
      return getAmazonAdvertisingFilters(
        appliedAdvertisingFilters,
        appliedAdvertisingFilters.customDateRange,
        isDownload,
        downloadWithFilter,
        campaignId
      );
    },
    [campaignId, appliedAdvertisingFilters]
  );

  const formattedAdvFiltersNoDownload = useMemo(() => {
    return getFormattedFilters(false, false);
  }, [getFormattedFilters]);

  const fetchSelectedCampaign = useAppQuery({
    queryKey: [QueryKeyEnums.AMZ_SD_CAMPAIGN_LVL_FETCH, campaignId],
    queryFn: () => sdAdvertisingEntityServices.getSDCampaignById(campaignId),
  });

  useEffect(() => {
    setCampaignSubHeaderData(null);
    setUpdatedPerformanceOptions(
      getInitializedNavOptions(sdCampaignPerformanceOptions)
    );

    if (fetchSelectedCampaign.data) {
      const data = fetchSelectedCampaign.data.data.data;
      const dataKeys = data && Object.keys(data);

      if (!data || !dataKeys || !dataKeys.length) {
        setCampaignSubHeaderData(null);
        return;
      }

      setCampaignSubHeaderData(data as ISDCampaign);
      setUpdatedPerformanceOptions(sdCampaignPerformanceOptions);
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
    <AdvertisingSDCampLevelSubWrapper
      campaignId={campaignId}
      campaignSubHeaderData={campaignSubHeaderData}
      getFilters={getFormattedFilters}
      isSubHeaderLoading={isSubHeaderLoading}
      updatedPerformanceOptions={updatedPerformanceOptions}
      advertisingFiltersWithNoDownload={formattedAdvFiltersNoDownload}
    />
  );
}
