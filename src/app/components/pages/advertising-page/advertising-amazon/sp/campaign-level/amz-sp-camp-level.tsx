import AdvertisingEmptyState from '@/app/components/page-components/advertising-empty-state/advertising-empty-state';
import { QueryKeyEnums } from '@/enums/query.enums';
import { IAdvertisingParams } from '@/interfaces/advertising/advertising.interface';
import {
  IAdvertisingNavigationBarOption,
  ICampaign,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import { spCampaignPerformanceOptions } from 'src/constants/advertising-filter.constants';
import {
  SpCampaignLevelTitles,
  SpCampaignTargetingTypes,
} from 'src/enums/advertising.enums';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAppliedFilter } from 'src/redux/slices/advertising/advertising-filter.slice';
import { spAdvertisingServices } from 'src/services/advertising/amazon/sp-advertising.service';
import {
  getAmazonAdvertisingFilters,
  getInitializedNavOptions,
} from 'src/utils/advertising.utils';
import AdvertisingCampLevelSubWrapper from './amz-sp-camp-level-sub-wrapper';

export default function AdvertisingCampLevel() {
  const [campaignSubHeaderData, setCampaignSubHeaderData] =
    useState<ICampaign | null>(null);
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
    queryKey: [QueryKeyEnums.AMZ_SP_CAMPAIGN_LVL_FETCH, campaignId],
    queryFn: () => spAdvertisingServices.getCampaign(campaignId),
  });

  useEffect(() => {
    setCampaignSubHeaderData(null);
    setUpdatedPerformanceOptions(
      getInitializedNavOptions(spCampaignPerformanceOptions, [
        SpCampaignLevelTitles.MANUAL_TARGETING,
        SpCampaignLevelTitles.AUTO_TARGETING,
      ])
    );
    if (fetchSelectedCampaign?.data) {
      const dataArray = fetchSelectedCampaign.data.data?.data;

      if (Array.isArray(dataArray) && dataArray.length > 0) {
        const campaignData = dataArray[0];
        setCampaignSubHeaderData(campaignData);

        let updatedOptions = spCampaignPerformanceOptions;
        if (campaignData.targetingType === SpCampaignTargetingTypes.AUTO) {
          updatedOptions = spCampaignPerformanceOptions.map((option) => {
            if (option.value === SpCampaignLevelTitles.MANUAL_TARGETING) {
              return {
                ...option,
                isVisible: false,
              };
            }

            return option;
          });
        }

        if (campaignData.targetingType === SpCampaignTargetingTypes.MANUAL) {
          updatedOptions = spCampaignPerformanceOptions.map((option) => {
            if (option.value === SpCampaignLevelTitles.AUTO_TARGETING) {
              return {
                ...option,
                isVisible: false,
              };
            }

            return option;
          });
        }

        setUpdatedPerformanceOptions(updatedOptions);
      }
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
    <AdvertisingCampLevelSubWrapper
      campaignId={campaignId}
      campaignSubHeaderData={campaignSubHeaderData}
      isSubHeaderLoading={isSubHeaderLoading}
      updatedPerformanceOptions={updatedPerformanceOptions}
      getFilters={getFormattedFilters}
      advertisingFiltersWithNoDownload={formattedAdvFiltersNoDownload}
    />
  );
}
