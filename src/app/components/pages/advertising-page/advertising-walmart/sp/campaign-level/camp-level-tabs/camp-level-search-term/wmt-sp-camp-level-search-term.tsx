import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import {
  ColumnNameEnum,
  WalmartSPCampaignLevelTitles,
} from 'src/enums/advertising.enums';
import { TargetingTypeEnum } from 'src/enums/walmart.enums';
import {
  IAdvertisingCampLevelSubWrapperProps,
  IEditAccessArrayData,
} from 'src/interfaces/advertising/advertising.interface';
import {
  IWalmartCampaign,
  IWalmartSPAdvertisingData,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  resetEditAccessFilters,
  selectAdvertisingErrors,
  setAdvertisingErrorDetails,
  setEditState,
  setInitialState,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import {
  selectPaginationModel,
  selectSearchText,
  selectSelectedAdvertisingNavTitle,
  selectSortModel,
  setSelectedAdvertisingNavTab,
  setSelectedAdvertisingNavTitle,
  TPerformanceMetricsKey,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import {
  selectWalmartSPPerformanceMetrics,
  selectWalmartSPPerformanceMetricsOptions,
  setWalmartSPPerformanceMetrics,
} from 'src/redux/slices/advertising/walmart/advertising-walmart-sp.slice';

import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { QueryKeyEnums } from '@/enums/query.enums';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { walmartSpAdvertisingServices } from 'src/services/advertising/walmart/walmart-sp-advertising.service';
import { genExportFileName, getFileNameDateTime } from 'src/utils';
import {
  getFormattedSortModel,
  getInitialColumnsByNavTitle,
} from 'src/utils/advertising-columns.utils';
import {
  getErrorEditState,
  getSelectedNavTab,
  getWalmartAppliedFilters,
  getWalmartSearchTermType,
  removeFrequencyFromAdvFilters,
} from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';

export default function AdvertisingWalmartSPCampLevelSearchTerm<
  T extends IWalmartCampaign
>({
  campaignId,
  campaignSubHeaderData,
  isSubHeaderLoading,
  updatedPerformanceOptions,
  getFilters,
  advertisingFiltersWithNoDownload,
}: IAdvertisingCampLevelSubWrapperProps<T>) {
  const [initialColumns, setInitialColumns] = useState<
    Array<ColumnDef<IWalmartSPAdvertisingData>>
  >([]);
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<IWalmartSPAdvertisingData>>
  >([]);
  const [filteredState, setFilteredState] = useState<IEditAccessArrayData>([]);

  const [advertisingGraphData, setAdvertisingGraphData] = useState<
    IPerformanceGraphData[]
  >([]);
  const [advertisingMetricsData, setAdvertisingMetricsData] =
    useState<IPerformanceMetrics | null>(null);
  const [minMaxDates, setMinMaxDates] = useState<IMinMaxDateRange[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);

  const performanceMetrics = useAppSelector(selectWalmartSPPerformanceMetrics);
  const performanceMetricsOptions = useAppSelector(
    selectWalmartSPPerformanceMetricsOptions
  );
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const searchText = useAppSelector(selectSearchText);
  const paginationModel = useAppSelector(selectPaginationModel);
  const sortModel = useAppSelector(selectSortModel);
  const advErrors = useAppSelector(selectAdvertisingErrors);

  const dispatch = useAppDispatch();

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IWalmartSPAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      WalmartSPCampaignLevelTitles.SEARCH_TERM,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      updatedPerformanceOptions,
      WalmartSPCampaignLevelTitles.SEARCH_TERM
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(WalmartSPCampaignLevelTitles.SEARCH_TERM)
    );
  }, [dispatch, updatedPerformanceOptions]);

  const getCampLevelSearchTermDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = walmartSpAdvertisingServices
        .getSearchTerms(
          getWalmartAppliedFilters(appliedFilters, isDownload, isAllDownload),
          {
            ...getFilters(isDownload, isAllDownload),
            targetingType: campaignSubHeaderData.targetingType,
          },
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(
            WalmartSPCampaignLevelTitles.SEARCH_TERM,
            sortModel
          ),
          searchText
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row) => {
            const id = `${row.searchTerm}-${row.campaignId}`;
            return {
              id,
              ...row,
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Search Terms downloaded successfully.',
            })
          );
          return data;
        });

      return res;
    },
    [
      appliedFilters,
      getFilters,
      paginationModel,
      sortModel,
      searchText,
      campaignSubHeaderData.targetingType,
      dispatch,
    ]
  );

  const fetchSearchTerm = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_SP_CAMPAIGN_LVL_SEARCH_TERM_FETCH,
      {
        appliedFilters,
        advertisingFiltersWithNoDownload: removeFrequencyFromAdvFilters(
          advertisingFiltersWithNoDownload
        ),
        paginationModel,
        sortModel,
        searchText,
        campaignSubHeaderData,
      },
    ],
    queryFn: () =>
      walmartSpAdvertisingServices.getSearchTerms(
        getWalmartAppliedFilters(appliedFilters, false, false),
        {
          ...advertisingFiltersWithNoDownload,
          targetingType: campaignSubHeaderData.targetingType,
        },
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(
          WalmartSPCampaignLevelTitles.SEARCH_TERM,
          sortModel
        ),
        searchText
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSPCampaignLevelTitles.SEARCH_TERM,
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
      walmartSpAdvertisingServices.getPerformanceGraph(
        getWalmartAppliedFilters(appliedFilters, false, false),
        advertisingFiltersWithNoDownload,
        searchText,
        getWalmartSearchTermType(campaignSubHeaderData?.targetingType)
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSPCampaignLevelTitles.SEARCH_TERM,
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
      walmartSpAdvertisingServices.getPerformanceMetrics(
        getWalmartAppliedFilters(appliedFilters, false, false),
        advertisingFiltersWithNoDownload,
        searchText,
        getWalmartSearchTermType(campaignSubHeaderData?.targetingType)
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSPCampaignLevelTitles.SEARCH_TERM,
  });

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchSearchTerm.data) {
      let data = fetchSearchTerm.data.data.data.data;
      data = data.map((row) => {
        const id = `${row.searchTerm}-${row.campaignId}`;
        return {
          id,
          ...row,
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        WalmartSPCampaignLevelTitles.SEARCH_TERM
      );
      const tempInitialColumns = [..._initialColumns];
      if (campaignSubHeaderData.targetingType === TargetingTypeEnum.MANUAL) {
        const idx = tempInitialColumns.findIndex(
          (column) => column.id === ColumnNameEnum.PRODUCT_AD
        );
        tempInitialColumns.splice(idx, 1);
      }
      if (campaignSubHeaderData.targetingType === TargetingTypeEnum.AUTO) {
        [ColumnNameEnum.KEYWORD, ColumnNameEnum.MATCH_TYPE].forEach((id) => {
          const idx = tempInitialColumns.findIndex(
            (column) => column.id === id
          );
          if (idx !== -1) {
            tempInitialColumns.splice(idx, 1);
          }
        });
      }
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        WalmartSPCampaignLevelTitles.SEARCH_TERM,
        tempInitialColumns as Array<ColumnDef<IWalmartSPAdvertisingData>>
      );
      setInitialColumns(
        tempInitialColumns as Array<ColumnDef<IWalmartSPAdvertisingData>>
      );
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<IWalmartSPAdvertisingData>>
      );

      dispatch(setInitialState(data as IWalmartSPAdvertisingData[]));
      const updatedData = getErrorEditState(
        data,
        advErrors
      ) as IWalmartSPAdvertisingData[];
      setFilteredState(updatedData);
      dispatch(setEditState(updatedData));
      dispatch(setAdvertisingErrorDetails(null));

      const totalRows = fetchSearchTerm.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSearchTerm.data, dispatch, campaignSubHeaderData.targetingType]);

  useEffect(() => {
    setAdvertisingGraphData([]);
    setMinMaxDates([]);

    if (fetchPerformanceGraph.data) {
      setAdvertisingGraphData(
        fetchPerformanceGraph.data.data.data?.graphData ?? []
      );
      setMinMaxDates(fetchPerformanceGraph.data.data.data?.maxMinDate);
    }
  }, [fetchPerformanceGraph.data]);

  useEffect(() => {
    setAdvertisingMetricsData(null);

    if (fetchPerformanceMetrics.data) {
      setAdvertisingMetricsData(fetchPerformanceMetrics.data.data.data);
    }
  }, [fetchPerformanceMetrics.data]);

  const handlePerformanceMetricsChange = (metricsValue: {
    value: IDropdownItem<string>;
    key: TPerformanceMetricsKey;
  }) => {
    dispatch(setWalmartSPPerformanceMetrics(metricsValue));
  };

  const handleDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const data: Record<string, unknown>[] =
        (await getCampLevelSearchTermDownload(
          true,
          isAllDownload
        )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getCampLevelSearchTermDownload]
  );

  return (
    <AdvertisingRenderingComponents
      campaignId={campaignId}
      selectedLevelType="campaign-level"
      selectedCampaign={campaignSubHeaderData}
      isSubHeaderLoading={isSubHeaderLoading}
      advertisingMetricsData={advertisingMetricsData}
      performanceFilters={advertisingFiltersWithNoDownload}
      isMetricsLoading={
        fetchPerformanceMetrics.isLoading ||
        fetchPerformanceMetrics.isRefetching
      }
      performanceSelectedMetrics={performanceMetrics}
      performanceMetricsOptions={performanceMetricsOptions}
      handlePerformanceMetricsChange={handlePerformanceMetricsChange}
      performanceGraphData={advertisingGraphData}
      minMaxDates={minMaxDates ? minMaxDates[0] : null}
      isGraphLoading={
        fetchPerformanceGraph.isLoading || fetchPerformanceGraph.isRefetching
      }
      chartTitle={`walmart_advertising_SP_campaign_${
        campaignSubHeaderData?.campaignName ?? ''
      }_${getFileNameDateTime(advertisingFiltersWithNoDownload)}`}
      performanceNavigationTabOptions={updatedPerformanceOptions}
      isTableLoading={fetchSearchTerm.isLoading || fetchSearchTerm.isRefetching}
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('walmart-sp', 'Search Terms')}
      filteredTableData={filteredState}
      totalRowCount={totalRowCount}
      setTotalRowCount={setTotalRowCount}
      setFilteredTableData={setFilteredState}
      handleDownload={handleDownload}
      handleEditSaveClick={() => {
        return;
      }}
    />
  );
}
