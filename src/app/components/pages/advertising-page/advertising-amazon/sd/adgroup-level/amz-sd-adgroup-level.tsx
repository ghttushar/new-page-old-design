import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import LoaderWrapper from '@/app/components/common/loader-wrapper/loader-wrapper';
import AdvertisingEmptyState from '@/app/components/page-components/advertising-empty-state/advertising-empty-state';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IAdvertisingAdGroupLevelProps,
  IAdvertisingParams,
} from '@/interfaces/advertising/advertising.interface';
import {
  ISDAdGroup,
  ISDCampaign,
} from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { IAdvertisingNavigationBarOption } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAppliedFilter } from '@/redux/slices/advertising/advertising-filter.slice';
import {
  getAmazonAdvertisingFilters,
  getInitializedNavOptions,
} from '@/utils/advertising.utils';
import { sdAdGroupPerformanceOptions } from 'src/constants/advertising-filter.constants';
import { sdAdvertisingEntityServices } from 'src/services/advertising/amazon/sd-advertising.service';
import AdvertisingSDAdgroupLevelSubWrapper from './amz-sd-adgroup-level-sub-wrapper';

export default function AdvertisingSDAdgroupLevel<
  T extends ISDCampaign | null
>({ selectedCampaign }: IAdvertisingAdGroupLevelProps<T>) {
  const [adGroupSubHeaderData, setAdGroupSubHeaderData] =
    useState<ISDAdGroup | null>(null);
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
    (isDownload: boolean, downloadWithFilter: boolean) => {
      return getAmazonAdvertisingFilters(
        appliedAdvertisingFilters,
        appliedAdvertisingFilters.customDateRange,
        isDownload,
        downloadWithFilter,
        campaignId,
        adGroupId
      );
    },
    [campaignId, adGroupId, appliedAdvertisingFilters]
  );

  const formattedAdvFiltersNoDownload = useMemo(() => {
    return getFormattedFilters(false, false);
  }, [getFormattedFilters]);

  const fetchSelectedAdGroup = useAppQuery({
    queryKey: [QueryKeyEnums.AMZ_SD_ADGROUP_LVL_FETCH, adGroupId],
    queryFn: () => sdAdvertisingEntityServices.getSDAdGroupById(adGroupId),
  });

  useEffect(() => {
    setAdGroupSubHeaderData(null);
    setUpdatedPerformanceOptions(
      getInitializedNavOptions(sdAdGroupPerformanceOptions)
    );

    if (fetchSelectedAdGroup.data) {
      const row = fetchSelectedAdGroup.data?.data?.data;
      const dataKeys = row && Object.keys(row);

      if (!row || !dataKeys || !dataKeys.length) {
        setAdGroupSubHeaderData(null);
        return;
      }

      const data = {
        ...row,
      };

      setAdGroupSubHeaderData(data as ISDAdGroup);
      setUpdatedPerformanceOptions(sdAdGroupPerformanceOptions);
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
    <AdvertisingSDAdgroupLevelSubWrapper
      campaignId={campaignId}
      adGroupId={adGroupId}
      adGroupSubHeaderData={adGroupSubHeaderData}
      getFilters={getFormattedFilters}
      isSubHeaderLoading={isSubHeaderLoading}
      updatedPerformanceOptions={updatedPerformanceOptions}
      advertisingFiltersWithNoDownload={formattedAdvFiltersNoDownload}
      selectedCampaign={selectedCampaign}
    />
  );
}
