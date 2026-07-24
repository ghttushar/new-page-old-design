import LoaderWrapper from '@/app/components/common/loader-wrapper/loader-wrapper';
import AdvertisingEmptyState from '@/app/components/page-components/advertising-empty-state/advertising-empty-state';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IAdvertisingAdGroupLevelProps,
  IAdvertisingParams,
} from '@/interfaces/advertising/advertising.interface';
import { IAdvertisingNavigationBarOption } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { walmartSbAdGroupLevelPerformanceOptions } from 'src/constants/advertising-filter.constants';
import {
  IWalmartAdGroup,
  IWalmartCampaign,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAppliedFilter } from 'src/redux/slices/advertising/advertising-filter.slice';
import { walmartEntityServices } from 'src/services/advertising/walmart/walmart-sp-advertising.service';
import {
  getInitializedNavOptions,
  getWalmartAdvertisingFilters,
} from 'src/utils/advertising.utils';
import AdvertisingWalmartSBAdGroupLevelSubWrapper from './wmt-sb-adgroup-level-sub-wrapper';

export default function AdvertisingWalmartSBAdgroupLevel<
  T extends IWalmartCampaign | null
>({ selectedCampaign }: IAdvertisingAdGroupLevelProps<T>) {
  const [adGroupSubHeaderData, setAdGroupSubHeaderData] =
    useState<IWalmartAdGroup | null>(null);
  const [updatedPerformanceOptions, setUpdatedPerformanceOptions] = useState<
    IAdvertisingNavigationBarOption[]
  >([]);

  const params = useParams<IAdvertisingParams>();
  const appliedAdvertisingFilters = useAppSelector(
    selectAdvertisingAppliedFilter
  );

  const { campaignId, adGroupId } = useMemo(() => {
    return {
      campaignId: params.campaignId as string,
      adGroupId: params.adGroupId as string,
    };
  }, [params.campaignId, params.adGroupId]);

  const getFormattedFilters = useCallback(
    (isDownload: boolean, isAllDownload: boolean) => {
      return getWalmartAdvertisingFilters(
        appliedAdvertisingFilters,
        appliedAdvertisingFilters.customDateRange,
        isDownload,
        campaignId,
        adGroupId,
        isAllDownload
      );
    },
    [appliedAdvertisingFilters, adGroupId, campaignId]
  );

  const formattedAdvFiltersNoDownload = useMemo(() => {
    return getFormattedFilters(false, false);
  }, [getFormattedFilters]);

  const fetchSelectedAdGroup = useAppQuery({
    queryKey: [QueryKeyEnums.WMT_SB_ADGROUP_LVL_FETCH, adGroupId],
    queryFn: () => walmartEntityServices.getAdGroupEntity(adGroupId),
  });

  useEffect(() => {
    setAdGroupSubHeaderData(null);
    setUpdatedPerformanceOptions(
      getInitializedNavOptions(walmartSbAdGroupLevelPerformanceOptions)
    );

    if (fetchSelectedAdGroup.data) {
      const dataArray = fetchSelectedAdGroup.data.data.data.map((row) => {
        return {
          ...row,
        };
      });

      if (Array.isArray(dataArray) && dataArray.length > 0) {
        setAdGroupSubHeaderData(dataArray[0]);
        setUpdatedPerformanceOptions(walmartSbAdGroupLevelPerformanceOptions);
      }
    }
  }, [fetchSelectedAdGroup.data, adGroupId]);

  const isSubHeaderLoading = useMemo(() => {
    return (
      fetchSelectedAdGroup.isLoading ||
      fetchSelectedAdGroup.isRefetching ||
      fetchSelectedAdGroup.isPending ||
      !fetchSelectedAdGroup.data
    );
  }, [
    fetchSelectedAdGroup.isLoading,
    fetchSelectedAdGroup.isRefetching,
    fetchSelectedAdGroup.isPending,
    fetchSelectedAdGroup.data,
  ]);

  if (isSubHeaderLoading === true) return <LoaderWrapper />;

  if (!adGroupSubHeaderData) return <AdvertisingEmptyState />;

  return (
    <AdvertisingWalmartSBAdGroupLevelSubWrapper
      campaignId={campaignId}
      adGroupId={adGroupId}
      getFilters={getFormattedFilters}
      adGroupSubHeaderData={adGroupSubHeaderData}
      updatedPerformanceOptions={updatedPerformanceOptions}
      isSubHeaderLoading={isSubHeaderLoading}
      advertisingFiltersWithNoDownload={formattedAdvFiltersNoDownload}
      selectedCampaign={selectedCampaign}
    />
  );
}
