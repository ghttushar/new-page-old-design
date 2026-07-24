import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IWalmartCampaign } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import {
  WalmartAdvertisingTableTypeEnum,
  WalmartSBCampaignLevelTitles,
} from 'src/enums/advertising.enums';
import {
  IAdvertisingCampLevelSubWrapperProps,
  IEditAccessArrayData,
} from 'src/interfaces/advertising/advertising.interface';
import { IWalmartSBAdvertisingData } from 'src/interfaces/advertising/walmart/walmart-sb-advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  resetEditAccessFilters,
  selectAdvertisingErrors,
  selectEditState,
  selectInitialState,
  selectSelectedRowIds,
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
  selectWalmartSbPerformanceMetrics,
  selectWalmartSbPerformanceMetricsOptions,
  setWalmartSBPerformanceMetrics,
} from 'src/redux/slices/advertising/walmart/advertising-walmart-sb.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { walmartSbAdvertisingServices } from 'src/services/advertising/walmart/walmart-sb-advertising.service';
import { genExportFileName, getFileNameDateTime } from 'src/utils';
import {
  getFormattedSortModel,
  getInitialColumnsByNavTitle,
} from 'src/utils/advertising-columns.utils';
import {
  getComparisonDetails,
  getErrorEditState,
  getSelectedNavTab,
  getWalmartAppliedFilters,
  removeFrequencyFromAdvFilters,
} from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';

export default function AdvertisingWalmartSBCampLevelPageType<
  T extends IWalmartCampaign | null
>({
  campaignId,
  campaignSubHeaderData,
  isSubHeaderLoading,
  updatedPerformanceOptions,
  getFilters,
  advertisingFiltersWithNoDownload,
}: IAdvertisingCampLevelSubWrapperProps<T>) {
  const [initialColumns, setInitialColumns] = useState<
    Array<ColumnDef<IWalmartSBAdvertisingData>>
  >([]);
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<IWalmartSBAdvertisingData>>
  >([]);
  const [filteredState, setFilteredState] = useState<IEditAccessArrayData>([]);
  const [advertisingSBGraphData, setAdvertisingSBGraphData] = useState<
    IPerformanceGraphData[]
  >([]);
  const [advertisingSBMetricsData, setAdvertisingSBMetricsData] =
    useState<IPerformanceMetrics | null>(null);
  const [minMaxDates, setMinMaxDates] = useState<IMinMaxDateRange[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);

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
  const initialState = useAppSelector(selectInitialState);
  const editState = useAppSelector(selectEditState);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const paginationModel = useAppSelector(selectPaginationModel);
  const sortModel = useAppSelector(selectSortModel);
  const advErrors = useAppSelector(selectAdvertisingErrors);

  const dispatch = useAppDispatch();

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IWalmartSBAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      WalmartSBCampaignLevelTitles.PAGE_TYPE,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const confirmEditSaveClick = () => {
    const updatedValues = new Map();
    const comparedValues = getComparisonDetails(initialState, editState);
    const updatedRowIds = selectedRowIds.filter((rowId) =>
      comparedValues.has(rowId)
    );

    updatedRowIds.forEach((rowId) => {
      updatedValues.set(rowId, comparedValues.get(rowId));
    });

    // TODO: Enable these conditions when we have edit-access for page type and platform

    //   const body: IEditAccessWalmartPageType[] = [];
    //   for (const [key, value] of updatedValues) {
    //     const id = key.match(/\d+/)[0];
    //     const data: IEditAccessWalmartPageType = {
    //       campaignId: Number(id),
    //       placementType: getMappedPageType(
    //         key.substring(0, key.indexOf(id)).replace(/-+$/, '')
    //       ),
    //     };

    //     if (value.multiplier !== null || value.multiplier !== undefined) {
    //       data.multiplier = Number(value.multiplier);
    //     }

    //     body.push(data);
    //   }

    //   setIsLoading(true);
    //   walmartEditAccessSBServices
    //     .updateWalmartSBPageType(body)
    //     .then((res) => {
    //       dispatch(
    //         showSuccessToastMessage({
    //           title: res.data.message,
    //         })
    //       );
    //     })
    //     .finally(() => {
    //       setIsLoading(false);
    //       dispatch(resetEditAccessFilters());
    //       getSBPageTypeData();
    //     });
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      updatedPerformanceOptions,
      WalmartSBCampaignLevelTitles.PAGE_TYPE
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(WalmartSBCampaignLevelTitles.PAGE_TYPE)
    );
  }, [dispatch, updatedPerformanceOptions]);

  const getSBPageTypeDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = walmartSbAdvertisingServices
        .getSBPageType(
          getWalmartAppliedFilters(appliedFilters, isDownload, isAllDownload),
          getFilters(isDownload, isAllDownload),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(
            WalmartSBCampaignLevelTitles.PAGE_TYPE,
            sortModel
          ),
          searchText
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row) => {
            const id = `${row.pageType}-${row.campaignId}`;
            return {
              id,
              ...row,
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Page Types downloaded successfully.',
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
      dispatch,
    ]
  );

  const fetchPageType = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_SB_CAMPAIGN_LVL_PAGE_TYPE_FETCH,
      {
        appliedFilters,
        advertisingFiltersWithNoDownload: removeFrequencyFromAdvFilters(
          advertisingFiltersWithNoDownload
        ),
        paginationModel,
        sortModel,
        searchText,
      },
    ],
    queryFn: () =>
      walmartSbAdvertisingServices.getSBPageType(
        getWalmartAppliedFilters(appliedFilters, false, false),
        advertisingFiltersWithNoDownload,
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(
          WalmartSBCampaignLevelTitles.PAGE_TYPE,
          sortModel
        ),
        searchText
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSBCampaignLevelTitles.PAGE_TYPE,
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
        WalmartAdvertisingTableTypeEnum.PAGE_TYPE
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSBCampaignLevelTitles.PAGE_TYPE,
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
        WalmartAdvertisingTableTypeEnum.PAGE_TYPE
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSBCampaignLevelTitles.PAGE_TYPE,
  });

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchPageType.data) {
      let data = fetchPageType.data.data.data.data;
      data = data.map((row) => {
        const id = `${row.pageType}-${row.campaignId}`;
        return {
          id,
          ...row,
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        WalmartSBCampaignLevelTitles.PAGE_TYPE
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        WalmartSBCampaignLevelTitles.PAGE_TYPE
      );
      setInitialColumns(
        _initialColumns as Array<ColumnDef<IWalmartSBAdvertisingData>>
      );
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<IWalmartSBAdvertisingData>>
      );

      dispatch(setInitialState(data as IWalmartSBAdvertisingData[]));
      const updatedData = getErrorEditState(
        data,
        advErrors
      ) as IWalmartSBAdvertisingData[];
      setFilteredState(updatedData);
      dispatch(setEditState(updatedData));
      dispatch(setAdvertisingErrorDetails(null));

      const totalRows = fetchPageType.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPageType.data, dispatch]);

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

  const handleDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const data: Record<string, unknown>[] = (await getSBPageTypeDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getSBPageTypeDownload]
  );

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
      isTableLoading={fetchPageType.isLoading || fetchPageType.isRefetching}
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('walmart-sb', 'Page Type')}
      filteredTableData={filteredState}
      totalRowCount={totalRowCount}
      setTotalRowCount={setTotalRowCount}
      setFilteredTableData={setFilteredState}
      handleDownload={handleDownload}
      handleEditSaveClick={confirmEditSaveClick}
    />
  );
}
