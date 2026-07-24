import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { QueryKeyEnums } from '@/enums/query.enums';
import { IAdvertisingCampLevelSubWrapperProps } from '@/interfaces/advertising/advertising.interface';
import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IWalmartCampaign } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IEditAccessWalmartBrandProfile } from '@/interfaces/edit-access/edit-access.interface';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { WALMART_BRAND_PROFILE_TEXT_REGEX } from 'src/constants/regex.constants';
import {
  WalmartAdvertisingTableTypeEnum,
  WalmartSBCampaignLevelTitles,
} from 'src/enums/advertising.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { resetEditAccessFilters } from 'src/redux/slices/advertising/advertising-edit-access.slice';
import {
  selectSearchText,
  selectSelectedAdvertisingNavTitle,
  setSelectedAdvertisingNavTab,
  setSelectedAdvertisingNavTitle,
  TPerformanceMetricsKey,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import {
  selectWalmartSbPerformanceMetrics,
  selectWalmartSbPerformanceMetricsOptions,
  setWalmartSBPerformanceMetrics,
} from 'src/redux/slices/advertising/walmart/advertising-walmart-sb.slice';
import {
  selectWalmartBrandProfileEditState,
  setWalmartBrandProfileEditState,
  setWalmartBrandProfileInitialState,
} from 'src/redux/slices/advertising/walmart/advertising-walmart.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { walmartSbAdvertisingServices } from 'src/services/advertising/walmart/walmart-sb-advertising.service';
import { walmartEditAccessSBServices } from 'src/services/edit-access/walmart-edit-access/walmart-edit-access-sb/walmart-edit-access-sb.service';
import { genExportFileName, getFileNameDateTime } from 'src/utils';
import {
  getSelectedNavTab,
  getWalmartAppliedFilters,
  removeFrequencyFromAdvFilters,
} from 'src/utils/advertising.utils';

export default function AdvertisingWalmartSBCampLevelBrands<
  T extends IWalmartCampaign | null
>({
  campaignId,
  campaignSubHeaderData,
  isSubHeaderLoading,
  updatedPerformanceOptions,
  getFilters,
  advertisingFiltersWithNoDownload,
}: IAdvertisingCampLevelSubWrapperProps<T>) {
  const [advertisingSBGraphData, setAdvertisingSBGraphData] = useState<
    IPerformanceGraphData[]
  >([]);
  const [advertisingSBMetricsData, setAdvertisingSBMetricsData] =
    useState<IPerformanceMetrics | null>(null);
  const [minMaxDates, setMinMaxDates] = useState<IMinMaxDateRange[]>([]);
  const [openInvalidModal, setOpenInvalidModal] = useState<boolean>(false);
  const [invalidTitle, setInvalidTitle] = useState<string>('');
  const [invalidDescription, setInvalidDescription] = useState<string>('');

  const walmartSBPerformanceMetrics = useAppSelector(
    selectWalmartSbPerformanceMetrics
  );
  const walmartSBPerformanceMetricsOptions = useAppSelector(
    selectWalmartSbPerformanceMetricsOptions
  );
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const searchText = useAppSelector(selectSearchText);
  const walmartBrandProfileEditState = useAppSelector(
    selectWalmartBrandProfileEditState
  );

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { mutateAsync: editAccessMutate } = useAppMutation({
    mutationFn: (body: IEditAccessWalmartBrandProfile) =>
      walmartEditAccessSBServices.updateWalmartSBBrandProfile(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SB_CAMPAIGN_LVL_BRANDS_FETCH],
        });

        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.ADVERTISING_METRICS_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
            description: data.data.description,
          })
        );
        dispatch(resetEditAccessFilters());
      },
    },
  });

  const confirmEditSaveClick = async () => {
    const updatedBrandName: string =
      walmartBrandProfileEditState?.searchAmpName as string;
    const updatedBrandHeadline: string =
      walmartBrandProfileEditState?.headlineText as string;
    const updatedBrandUrl: string =
      walmartBrandProfileEditState?.clickUrl as string;

    if (
      !WALMART_BRAND_PROFILE_TEXT_REGEX.test(updatedBrandName) ||
      updatedBrandName?.length <= 0 ||
      updatedBrandName?.length > 35
    ) {
      setInvalidTitle('Invalid Brand Name.');
      setInvalidDescription(
        `Brand Name can't be empty and must be 35 characters or less with no special characters.`
      );
      setOpenInvalidModal(true);
      return;
    }

    if (
      !WALMART_BRAND_PROFILE_TEXT_REGEX.test(updatedBrandHeadline) ||
      updatedBrandHeadline?.length <= 0 ||
      updatedBrandHeadline?.length > 45
    ) {
      setInvalidTitle('Invalid Brand Headline Text.');
      setInvalidDescription(
        `Brand Headline Text can't be empty and must be 45 characters or less with no special characters.`
      );
      setOpenInvalidModal(true);
      return;
    }

    // TODO: add validation for url
    const body: IEditAccessWalmartBrandProfile = {
      campaignId: walmartBrandProfileEditState?.campaignId as string,
      adGroupId: walmartBrandProfileEditState?.adGroupId as string,
      entityName: (walmartBrandProfileEditState?.campaignName ||
        walmartBrandProfileEditState?.campaignId) as string,
      clickUrl: updatedBrandUrl,
      headlineText: updatedBrandHeadline,
      searchAmpName: updatedBrandName,
      sbaProfileId: walmartBrandProfileEditState?.sbaProfileId as string,
    };

    await editAccessMutate(body);
  };

  const cancelInvalidModalClick = () => {
    setOpenInvalidModal(false);
    setInvalidTitle('');
    setInvalidDescription('');
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      updatedPerformanceOptions,
      WalmartSBCampaignLevelTitles.BRANDS
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(WalmartSBCampaignLevelTitles.BRANDS)
    );
  }, [dispatch, updatedPerformanceOptions]);

  const fetchBrandProfile = useAppQuery({
    queryKey: [QueryKeyEnums.WMT_SB_CAMPAIGN_LVL_BRANDS_FETCH, campaignId],
    queryFn: () =>
      walmartSbAdvertisingServices.getSBBrandAssets(campaignId as string),
    enabled:
      selectedAdvertisingNavTitle === WalmartSBCampaignLevelTitles.BRANDS,
  });

  const fetchPerformanceGraph = useAppQuery({
    queryKey: [
      QueryKeyEnums.ADVERTISING_GRAPH_FETCH,
      {
        appliedFilters,
        advertisingFiltersWithNoDownload,
        searchText,
      },
    ],
    queryFn: () =>
      walmartSbAdvertisingServices.getSBPerformanceGraph(
        getWalmartAppliedFilters(appliedFilters, false, false),
        advertisingFiltersWithNoDownload,
        searchText,
        WalmartAdvertisingTableTypeEnum.BRAND_PROFILE
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSBCampaignLevelTitles.BRANDS,
  });

  const fetchPerformanceMetrics = useAppQuery({
    queryKey: [
      QueryKeyEnums.ADVERTISING_METRICS_FETCH,
      {
        appliedFilters,
        advertisingFiltersWithNoDownload: removeFrequencyFromAdvFilters(
          advertisingFiltersWithNoDownload
        ),
        searchText,
      },
    ],
    queryFn: () =>
      walmartSbAdvertisingServices.getSBPerformanceMetrics(
        getWalmartAppliedFilters(appliedFilters, false, false),
        advertisingFiltersWithNoDownload,
        searchText,
        WalmartAdvertisingTableTypeEnum.BRAND_PROFILE
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSBCampaignLevelTitles.BRANDS,
  });

  useEffect(() => {
    dispatch(setWalmartBrandProfileInitialState(null));
    dispatch(setWalmartBrandProfileEditState(null));

    if (fetchBrandProfile.data) {
      const data = fetchBrandProfile.data.data.data.data;

      if (data.length > 0) {
        dispatch(setWalmartBrandProfileInitialState(data[0]));
        dispatch(setWalmartBrandProfileEditState(data[0]));
      }
    }
  }, [fetchBrandProfile.data, dispatch]);

  useEffect(() => {
    setAdvertisingSBGraphData([]);
    setMinMaxDates([]);

    if (fetchPerformanceGraph.data) {
      setAdvertisingSBGraphData(
        fetchPerformanceGraph.data.data.data?.graphData ?? []
      );
      setMinMaxDates(fetchPerformanceGraph.data.data.data?.maxMinDate);
    }
  }, [fetchPerformanceGraph.data]);

  useEffect(() => {
    setAdvertisingSBMetricsData(null);

    if (fetchPerformanceMetrics.data) {
      setAdvertisingSBMetricsData(fetchPerformanceMetrics.data.data.data);
    }
  }, [fetchPerformanceMetrics.data]);

  const handlePerformanceMetricsChange = (metricsValue: {
    value: IDropdownItem<string>;
    key: TPerformanceMetricsKey;
  }) => {
    dispatch(setWalmartSBPerformanceMetrics(metricsValue));
  };

  return (
    <AdvertisingRenderingComponents
      campaignId={campaignId}
      selectedLevelType="campaign-level"
      selectedCampaign={campaignSubHeaderData}
      isSubHeaderLoading={isSubHeaderLoading}
      advertisingMetricsData={advertisingSBMetricsData}
      performanceFilters={advertisingFiltersWithNoDownload}
      isMetricsLoading={
        fetchPerformanceMetrics.isLoading ||
        fetchPerformanceMetrics.isRefetching
      }
      performanceSelectedMetrics={walmartSBPerformanceMetrics}
      performanceMetricsOptions={walmartSBPerformanceMetricsOptions}
      handlePerformanceMetricsChange={handlePerformanceMetricsChange}
      performanceGraphData={advertisingSBGraphData}
      minMaxDates={minMaxDates ? minMaxDates[0] : null}
      isGraphLoading={
        fetchPerformanceGraph.isLoading || fetchPerformanceGraph.isRefetching
      }
      chartTitle={`advertising_SB_campaign_${
        campaignSubHeaderData?.campaignName ?? ''
      }_${getFileNameDateTime(advertisingFiltersWithNoDownload)}`}
      performanceNavigationTabOptions={updatedPerformanceOptions}
      isTableLoading={
        fetchBrandProfile.isLoading || fetchBrandProfile.isRefetching
      }
      exportFileTitle={genExportFileName('walmart-sb', 'Brand Profile')}
      handleEditSaveClick={confirmEditSaveClick}
      openInvalidModal={openInvalidModal}
      invalidTitle={invalidTitle}
      invalidDescription={invalidDescription}
      cancelInvalidModalClick={cancelInvalidModalClick}
    />
  );
}
