import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import { walmartSvAccountPerformanceOptions } from 'src/constants/advertising-filter.constants';
import {
  WalmartAdvertisingTableTypeEnum,
  WalmartSVAccountLevelTitles,
} from 'src/enums/advertising.enums';
import { IEditAccessArrayData } from 'src/interfaces/advertising/advertising.interface';
import { IWalmartSVAdvertisingData } from 'src/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  resetEditAccessFilters,
  selectAdvertisingErrors,
  setAdvertisingErrorDetails,
  setEditState,
  setInitialState,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import {
  selectAdvertisingAppliedFilter,
  selectPaginationModel,
  selectSearchText,
  selectSelectedAdvertisingNavTitle,
  selectSortModel,
  setSelectedAdvertisingNavTab,
  setSelectedAdvertisingNavTitle,
  TPerformanceMetricsKey,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import {
  selectWalmartSvPerformanceMetrics,
  selectWalmartSvPerformanceMetricsOptions,
  setWalmartSVPerformanceMetrics,
} from 'src/redux/slices/advertising/walmart/advertising-walmart-sv.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { walmartSvAdvertisingServices } from 'src/services/advertising/walmart/walmart-sv-advertising.service';
import { genExportFileName, getFileNameDateTime } from 'src/utils';
import {
  getFormattedSortModel,
  getInitialColumnsByNavTitle,
} from 'src/utils/advertising-columns.utils';
import {
  getErrorEditState,
  getSelectedNavTab,
  getWalmartAdvertisingFilters,
  getWalmartAppliedFilters,
  removeFrequencyFromAdvFilters,
} from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';

export default function AdvertisingWalmartSVAccountLevelPageType() {
  const [initialColumns, setInitialColumns] = useState<
    Array<ColumnDef<IWalmartSVAdvertisingData>>
  >([]);
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<IWalmartSVAdvertisingData>>
  >([]);
  const [filteredState, setFilteredState] = useState<IEditAccessArrayData>([]);
  const [advertisingSVGraphData, setAdvertisingSVGraphData] = useState<
    IPerformanceGraphData[]
  >([]);
  const [advertisingSVMetricsData, setAdvertisingSVMetricsData] =
    useState<IPerformanceMetrics | null>(null);
  const [minMaxDates, setMinMaxDates] = useState<IMinMaxDateRange[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);

  const appliedAdvertisingFilters = useAppSelector(
    selectAdvertisingAppliedFilter
  );
  const SVPerformanceMetrics = useAppSelector(
    selectWalmartSvPerformanceMetrics
  );
  const SVPerformanceMetricsOptions = useAppSelector(
    selectWalmartSvPerformanceMetricsOptions
  );
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const searchText = useAppSelector(selectSearchText);
  const paginationModel = useAppSelector(selectPaginationModel);
  const sortModel = useAppSelector(selectSortModel);
  const advErrors = useAppSelector(selectAdvertisingErrors);

  const dispatch = useAppDispatch();

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IWalmartSVAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      WalmartSVAccountLevelTitles.PAGE_TYPE,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      walmartSvAccountPerformanceOptions,
      WalmartSVAccountLevelTitles.PAGE_TYPE
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(WalmartSVAccountLevelTitles.PAGE_TYPE)
    );
  }, [dispatch]);

  const getSVPageTypeDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = walmartSvAdvertisingServices
        .getSVPageType(
          getWalmartAppliedFilters(appliedFilters, isDownload, isAllDownload),
          getWalmartAdvertisingFilters(
            appliedAdvertisingFilters,
            appliedAdvertisingFilters.customDateRange,
            isDownload,
            '',
            '',
            isAllDownload
          ),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(
            WalmartSVAccountLevelTitles.PAGE_TYPE,
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
      appliedAdvertisingFilters,
      paginationModel,
      sortModel,
      searchText,
      dispatch,
    ]
  );

  const fetchPageType = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_SV_ACCOUNT_LVL_PAGE_TYPE_FETCH,
      {
        appliedFilters,
        appliedAdvertisingFilters: removeFrequencyFromAdvFilters(
          appliedAdvertisingFilters
        ),
        paginationModel,
        sortModel,
        searchText,
      },
    ],
    queryFn: () =>
      walmartSvAdvertisingServices.getSVPageType(
        getWalmartAppliedFilters(appliedFilters, false, false),
        getWalmartAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange,
          false,
          '',
          '',
          false
        ),
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(WalmartSVAccountLevelTitles.PAGE_TYPE, sortModel),
        searchText
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSVAccountLevelTitles.PAGE_TYPE,
  });

  const fetchPerformanceGraph = useAppQuery({
    queryKey: [
      QueryKeyEnums.ADVERTISING_GRAPH_FETCH,
      {
        appliedFilters,
        appliedAdvertisingFilters,
        searchText,
      },
    ],
    queryFn: () =>
      walmartSvAdvertisingServices.getSVPerformanceGraph(
        getWalmartAppliedFilters(appliedFilters, false, false),
        getWalmartAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        ),
        searchText,
        WalmartAdvertisingTableTypeEnum.PAGE_TYPE
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSVAccountLevelTitles.PAGE_TYPE,
  });

  const fetchPerformanceMetrics = useAppQuery({
    queryKey: [
      QueryKeyEnums.ADVERTISING_METRICS_FETCH,
      {
        appliedFilters,
        appliedAdvertisingFilters: removeFrequencyFromAdvFilters(
          appliedAdvertisingFilters
        ),
        searchText,
      },
    ],
    queryFn: () =>
      walmartSvAdvertisingServices.getSVPerformanceMetrics(
        getWalmartAppliedFilters(appliedFilters, false, false),
        getWalmartAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        ),
        searchText,
        WalmartAdvertisingTableTypeEnum.PAGE_TYPE
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSVAccountLevelTitles.PAGE_TYPE,
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
        WalmartSVAccountLevelTitles.PAGE_TYPE
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        WalmartSVAccountLevelTitles.PAGE_TYPE
      );
      setInitialColumns(
        _initialColumns as Array<ColumnDef<IWalmartSVAdvertisingData>>
      );
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<IWalmartSVAdvertisingData>>
      );

      dispatch(setInitialState(data as IWalmartSVAdvertisingData[]));
      const updatedData = getErrorEditState(
        data,
        advErrors
      ) as IWalmartSVAdvertisingData[];
      setFilteredState(updatedData);
      dispatch(setEditState(updatedData));
      dispatch(setAdvertisingErrorDetails(null));

      const totalRows = fetchPageType.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPageType.data, dispatch]);

  useEffect(() => {
    setAdvertisingSVGraphData([]);
    setMinMaxDates([]);

    if (fetchPerformanceGraph.data) {
      setAdvertisingSVGraphData(
        fetchPerformanceGraph.data.data.data?.graphData ?? []
      );
      setMinMaxDates(fetchPerformanceGraph.data.data.data?.maxMinDate);
    }
  }, [fetchPerformanceGraph.data]);

  useEffect(() => {
    setAdvertisingSVMetricsData(null);

    if (fetchPerformanceMetrics.data) {
      setAdvertisingSVMetricsData(fetchPerformanceMetrics.data.data.data);
    }
  }, [fetchPerformanceMetrics.data]);

  const handlePerformanceMetricsChange = (metricsValue: {
    value: IDropdownItem<string>;
    key: TPerformanceMetricsKey;
  }) => {
    dispatch(setWalmartSVPerformanceMetrics(metricsValue));
  };

  const handleDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const data: Record<string, unknown>[] = (await getSVPageTypeDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getSVPageTypeDownload]
  );

  return (
    <AdvertisingRenderingComponents
      advertisingMetricsData={advertisingSVMetricsData}
      performanceFilters={getWalmartAdvertisingFilters(
        appliedAdvertisingFilters,
        appliedAdvertisingFilters.customDateRange
      )}
      isMetricsLoading={
        fetchPerformanceMetrics.isLoading ||
        fetchPerformanceMetrics.isRefetching
      }
      performanceSelectedMetrics={SVPerformanceMetrics}
      performanceMetricsOptions={SVPerformanceMetricsOptions}
      handlePerformanceMetricsChange={handlePerformanceMetricsChange}
      performanceGraphData={advertisingSVGraphData}
      minMaxDates={minMaxDates ? minMaxDates[0] : null}
      isGraphLoading={
        fetchPerformanceGraph.isLoading || fetchPerformanceGraph.isRefetching
      }
      chartTitle={`advertising_SV_${getFileNameDateTime(
        getWalmartAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        )
      )}`}
      performanceNavigationTabOptions={walmartSvAccountPerformanceOptions}
      isTableLoading={fetchPageType.isLoading || fetchPageType.isRefetching}
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('walmart-sv', 'Page Type')}
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
