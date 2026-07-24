import AdvertisingEmptyState from '@/app/components/page-components/advertising-empty-state/advertising-empty-state';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IAdvertisingAdGroupLevelProps,
  IAdvertisingParams,
} from '@/interfaces/advertising/advertising.interface';
import { IAdvertisingNavigationBarOption } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAppliedFilter } from '@/redux/slices/advertising/advertising-filter.slice';
import {
  getInitializedNavOptions,
  getWalmartAdvertisingFilters,
} from '@/utils/advertising.utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import { walmartSpAdGroupPerformanceOptions } from 'src/constants/advertising-filter.constants';
import { WalmartSPAdGroupLevelTitles } from 'src/enums/advertising.enums';
import { TargetingTypeEnum } from 'src/enums/walmart.enums';
import {
  IWalmartAdGroup,
  IWalmartCampaign,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { walmartEntityServices } from 'src/services/advertising/walmart/walmart-sp-advertising.service';
import AdvertisingWalmartSPAdGroupLevelSubWrapper from './wmt-sp-adgroup-level-sub-wrapper';

export default function AdvertisingWalmartAdGroupLevel<
  T extends IWalmartCampaign
>({ selectedCampaign }: IAdvertisingAdGroupLevelProps<T>) {
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

  const [adGroupSubHeaderData, setAdGroupSubHeaderData] =
    useState<IWalmartAdGroup | null>(null);
  const [
    updatedWalmartAdGroupPerformanceOptions,
    setUpdatedWalmartAdGroupPerformanceOptions,
  ] = useState<IAdvertisingNavigationBarOption[]>([]);

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
    [appliedAdvertisingFilters, campaignId, adGroupId]
  );

  const formattedAdvFiltersNoDownload = useMemo(() => {
    return getFormattedFilters(false, false);
  }, [getFormattedFilters]);

  const fetchSelectedAdGroup = useAppQuery({
    queryKey: [QueryKeyEnums.WMT_SP_ADGROUP_LVL_FETCH, adGroupId],
    queryFn: () => walmartEntityServices.getAdGroupEntity(adGroupId),
  });

  useEffect(() => {
    setAdGroupSubHeaderData(null);
    setUpdatedWalmartAdGroupPerformanceOptions(
      getInitializedNavOptions(walmartSpAdGroupPerformanceOptions)
    );

    if (fetchSelectedAdGroup.data) {
      let updatedOptions = [...walmartSpAdGroupPerformanceOptions];

      const dataArray = fetchSelectedAdGroup.data.data.data.map((row) => {
        return {
          ...row,
        };
      });
      if (Array.isArray(dataArray) && dataArray.length > 0) {
        const data = dataArray[0];
        setAdGroupSubHeaderData(data);

        if (data.targetingType === TargetingTypeEnum.AUTO) {
          updatedOptions = updatedOptions.filter(
            (option) =>
              option.value !== WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING
          );
        }
        setUpdatedWalmartAdGroupPerformanceOptions(updatedOptions);
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
    <AdvertisingWalmartSPAdGroupLevelSubWrapper
      campaignId={campaignId}
      adGroupId={adGroupId}
      getFilters={getFormattedFilters}
      adGroupSubHeaderData={adGroupSubHeaderData}
      updatedPerformanceOptions={updatedWalmartAdGroupPerformanceOptions}
      isSubHeaderLoading={isSubHeaderLoading}
      advertisingFiltersWithNoDownload={formattedAdvFiltersNoDownload}
      selectedCampaign={selectedCampaign}
    />
  );
}
