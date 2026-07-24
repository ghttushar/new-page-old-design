import AdvertisingEmptyState from '@/app/components/page-components/advertising-empty-state/advertising-empty-state';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IAdvertisingAdGroupLevelProps,
  IAdvertisingParams,
} from '@/interfaces/advertising/advertising.interface';
import {
  ISBAdGroup,
  ISBCampaign,
} from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { IAdvertisingNavigationBarOption } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import { sbAdGroupPerformanceOptions } from 'src/constants/advertising-filter.constants';
import {
  AdGroupTypeEnum,
  SbAdGroupLevelTitles,
} from 'src/enums/advertising.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAppliedFilter } from 'src/redux/slices/advertising/advertising-filter.slice';
import { setOpenCreativeDialog } from 'src/redux/slices/advertising/advertising-sb-filter.slice';
import { sbAdvertisingEntityServices } from 'src/services/advertising/amazon/sb-advertising.service';
import {
  getAmazonAdvertisingFilters,
  getInitializedNavOptions,
} from 'src/utils/advertising.utils';
import AdvertisingSBAdgroupLevelSubWrapper from './amz-sb-adgroup-level-sub-wrapper';

export default function AdvertisingSBAdGroupLevel<
  T extends ISBCampaign | null
>({ selectedCampaign }: IAdvertisingAdGroupLevelProps<T>) {
  const [subHeaderData, setSubHeaderData] = useState<ISBAdGroup | null>(null);
  const [updatedPerformanceOptions, setUpdatedPerformanceOptions] = useState<
    IAdvertisingNavigationBarOption[]
  >([]);

  const dispatch = useAppDispatch();
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

  const handleCloseDialog = useCallback(() => {
    dispatch(setOpenCreativeDialog(false));
  }, [dispatch]);

  const fetchSelectedAdGroup = useAppQuery({
    queryKey: [QueryKeyEnums.AMZ_SB_ADGROUP_LVL_FETCH, adGroupId],
    queryFn: () => sbAdvertisingEntityServices.getAdGroupById(adGroupId),
  });

  useEffect(() => {
    setSubHeaderData(null);
    setUpdatedPerformanceOptions(
      getInitializedNavOptions(sbAdGroupPerformanceOptions)
    );
    handleCloseDialog();

    if (fetchSelectedAdGroup.isError) {
      const updatedOptions = sbAdGroupPerformanceOptions.map((option) => {
        if (option.value === SbAdGroupLevelTitles.TARGETING) {
          return {
            ...option,
            isDisabled: true,
          };
        }
        return option;
      });

      setUpdatedPerformanceOptions(updatedOptions);

      return;
    }

    if (fetchSelectedAdGroup.data) {
      const row = fetchSelectedAdGroup.data?.data?.data;
      const dataKeys = row && Object.keys(row);

      if (!row || !dataKeys || !dataKeys.length) {
        setSubHeaderData(null);
        return;
      }

      const data = {
        ...row,
      };
      setSubHeaderData(data as ISBAdGroup);

      let updatedOptions: IAdvertisingNavigationBarOption[] =
        sbAdGroupPerformanceOptions;

      if (data.adGroupType === AdGroupTypeEnum.KT) {
        updatedOptions = sbAdGroupPerformanceOptions.map((option) => {
          if (option.value === SbAdGroupLevelTitles.TARGETING) {
            return {
              ...option,
              value: SbAdGroupLevelTitles.KEYWORD_TARGETING,
            };
          }
          return option;
        });
      } else if (data.adGroupType === AdGroupTypeEnum.PT) {
        updatedOptions = sbAdGroupPerformanceOptions.map((option) => {
          if (option.value === SbAdGroupLevelTitles.TARGETING) {
            return {
              ...option,
              value: SbAdGroupLevelTitles.PRODUCT_TARGETING,
            };
          }
          return option;
        });
      } else {
        updatedOptions = sbAdGroupPerformanceOptions.map((option) => {
          if (option.value === SbAdGroupLevelTitles.TARGETING) {
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
  }, [
    fetchSelectedAdGroup.data,
    fetchSelectedAdGroup.isError,
    handleCloseDialog,
    adGroupId,
  ]);

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

  if (!subHeaderData) return <AdvertisingEmptyState />;

  return (
    <AdvertisingSBAdgroupLevelSubWrapper
      campaignId={campaignId}
      adGroupId={adGroupId}
      adGroupSubHeaderData={subHeaderData}
      isSubHeaderLoading={isSubHeaderLoading}
      updatedPerformanceOptions={updatedPerformanceOptions}
      getFilters={getFormattedFilters}
      advertisingFiltersWithNoDownload={formattedAdvFiltersNoDownload}
      selectedCampaign={selectedCampaign}
    />
  );
}
