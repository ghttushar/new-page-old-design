import AdvertisingEmptyState from '@/app/components/page-components/advertising-empty-state/advertising-empty-state';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IAdvertisingAdGroupLevelProps,
  IAdvertisingParams,
} from '@/interfaces/advertising/advertising.interface';
import {
  IAdGroup,
  IAdvertisingNavigationBarOption,
  ICampaign,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import { spAdGroupPerformanceOptions } from 'src/constants/advertising-filter.constants';
import {
  AdGroupTypeEnum,
  SpAdGroupLevelTitles,
} from 'src/enums/advertising.enums';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAppliedFilter } from 'src/redux/slices/advertising/advertising-filter.slice';
import { spAdvertisingServices } from 'src/services/advertising/amazon/sp-advertising.service';
import {
  getAmazonAdvertisingFilters,
  getInitializedNavOptions,
} from 'src/utils/advertising.utils';
import AdvertisingAdGroupLevelSubWrapper from './amz-sp-adgroup-level-sub-wrapper';

export default function AdvertisingAdGroupLevel<T extends ICampaign | null>({
  selectedCampaign,
}: IAdvertisingAdGroupLevelProps<T>) {
  const [adGroupSubHeaderData, setAdGroupSubHeaderData] =
    useState<IAdGroup | null>(null);
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
    queryKey: [QueryKeyEnums.AMZ_SP_ADGROUP_LVL_FETCH, adGroupId],
    queryFn: () => spAdvertisingServices.getAdGroup(adGroupId),
  });

  useEffect(() => {
    setAdGroupSubHeaderData(null);
    setUpdatedPerformanceOptions(
      getInitializedNavOptions(spAdGroupPerformanceOptions)
    );

    if (fetchSelectedAdGroup.isError) {
      const _updatedOptions = spAdGroupPerformanceOptions.map((option) => {
        if (option.value === SpAdGroupLevelTitles.TARGETING) {
          return {
            ...option,
            isDisabled: true,
          };
        }
        return option;
      });

      setUpdatedPerformanceOptions(_updatedOptions);

      return;
    }

    if (fetchSelectedAdGroup.data) {
      const dataArray = fetchSelectedAdGroup.data.data.data.map((row) => {
        return {
          ...row,
        };
      });
      let updatedOptions: IAdvertisingNavigationBarOption[] =
        spAdGroupPerformanceOptions;

      if (Array.isArray(dataArray) && dataArray.length > 0) {
        const data = dataArray[0];
        setAdGroupSubHeaderData(data);

        if (data.adGroupType === AdGroupTypeEnum.KT) {
          updatedOptions = spAdGroupPerformanceOptions.map((option) => {
            if (option.value === SpAdGroupLevelTitles.TARGETING) {
              return {
                ...option,
                value: SpAdGroupLevelTitles.KEYWORD_TARGETING,
              };
            }
            return option;
          });
        }

        if (data.adGroupType === AdGroupTypeEnum.PT) {
          updatedOptions = spAdGroupPerformanceOptions.map((option) => {
            if (option.value === SpAdGroupLevelTitles.TARGETING) {
              return {
                ...option,
                value: SpAdGroupLevelTitles.PRODUCT_TARGETING,
              };
            }
            return option;
          });
        }
      } else {
        updatedOptions = spAdGroupPerformanceOptions.map((option) => {
          if (option.value === SpAdGroupLevelTitles.TARGETING) {
            return {
              ...option,
              isDisabled: true,
            };
          }
          return option;
        });
      }
      setUpdatedPerformanceOptions(updatedOptions);
    }
  }, [fetchSelectedAdGroup.data, fetchSelectedAdGroup.isError, adGroupId]);

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
    <AdvertisingAdGroupLevelSubWrapper
      campaignId={campaignId}
      adGroupId={adGroupId}
      adGroupSubHeaderData={adGroupSubHeaderData}
      isSubHeaderLoading={isSubHeaderLoading}
      updatedPerformanceOptions={updatedPerformanceOptions}
      getFilters={getFormattedFilters}
      advertisingFiltersWithNoDownload={formattedAdvFiltersNoDownload}
      selectedCampaign={selectedCampaign}
    />
  );
}
