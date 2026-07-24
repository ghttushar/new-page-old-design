import LoaderWrapper from '@/app/components/common/loader-wrapper/loader-wrapper';
import AdvertisingEmptyState from '@/app/components/page-components/advertising-empty-state/advertising-empty-state';
import { sbCampaignPerformanceOptions } from '@/constants/advertising-filter.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import { IAdvertisingParams } from '@/interfaces/advertising/advertising.interface';
import { ISBCampaign } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { IAdvertisingNavigationBarOption } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAppliedFilter } from '@/redux/slices/advertising/advertising-filter.slice';
import {
  getAmazonAdvertisingFilters,
  getInitializedNavOptions,
} from '@/utils/advertising.utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { setOpenCreativeDialog } from 'src/redux/slices/advertising/advertising-sb-filter.slice';
import { sbAdvertisingEntityServices } from 'src/services/advertising/amazon/sb-advertising.service';
import AdvertisingSBCampLevelSubWrapper from './amz-sb-camp-level-sub-wrapper';

export default function AdvertisingSBCampLevel() {
  const [campaignSubHeaderData, setCampaignSubHeaderData] =
    useState<ISBCampaign | null>(null);
  const [updatedPerformanceOptions, setUpdatedPerformanceOptions] = useState<
    IAdvertisingNavigationBarOption[]
  >([]);

  const params = useParams<IAdvertisingParams>();
  const dispatch = useAppDispatch();

  const campaignId = useMemo(
    () => params.campaignId as string,
    [params.campaignId]
  );

  const appliedAdvertisingFilters = useAppSelector(
    selectAdvertisingAppliedFilter
  );

  const handleCloseDialog = useCallback(
    () => dispatch(setOpenCreativeDialog(false)),
    [dispatch]
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
    queryKey: [QueryKeyEnums.AMZ_SB_CAMPAIGN_LVL_FETCH, campaignId],
    queryFn: () => sbAdvertisingEntityServices.getCampaignById(campaignId),
  });

  useEffect(() => {
    setCampaignSubHeaderData(null);
    setUpdatedPerformanceOptions(
      getInitializedNavOptions(sbCampaignPerformanceOptions)
    );
    handleCloseDialog();

    if (fetchSelectedCampaign.data) {
      const data = fetchSelectedCampaign.data.data.data;
      const dataKeys = data && Object.keys(data);

      if (!data || !dataKeys || !dataKeys.length) {
        setCampaignSubHeaderData(null);
        return;
      }
      setCampaignSubHeaderData(data as ISBCampaign);
      setUpdatedPerformanceOptions(sbCampaignPerformanceOptions);
    }
  }, [fetchSelectedCampaign.data, handleCloseDialog, campaignId]);

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
    <AdvertisingSBCampLevelSubWrapper
      campaignId={campaignId}
      campaignSubHeaderData={campaignSubHeaderData}
      getFilters={getFormattedFilters}
      isSubHeaderLoading={isSubHeaderLoading}
      updatedPerformanceOptions={updatedPerformanceOptions}
      advertisingFiltersWithNoDownload={formattedAdvFiltersNoDownload}
    />
  );
}
