import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { QueryKeyEnums } from '@/enums/query.enums';
import { IOverallAdvertisingData } from '@/interfaces/advertising/amazon/overall-advertising.interface';
import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import { overallAccountPerformanceOptions } from 'src/constants/advertising-filter.constants';
import {
  AmazonAdvertisingTableTypesEnum,
  OverallAccountLevelTitles,
} from 'src/enums/advertising.enums';
import { IEditAccessArrayData } from 'src/interfaces/advertising/advertising.interface';
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
  selectOverallPerformanceMetrics,
  selectOverallPerformanceMetricsOptions,
  setOverallPerformanceMetrics,
} from 'src/redux/slices/advertising/advertising-overall-filter.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import {
  overallAdvertisingAccountLevelServices,
  overallAdvertisingServices,
} from 'src/services/advertising/amazon/overall-advertising.service';
import { genExportFileName, getFileNameDateTime } from 'src/utils';
import {
  getFormattedSortModel,
  getInitialColumnsByNavTitle,
} from 'src/utils/advertising-columns.utils';
import {
  getAmazonAdvertisingFilters,
  getErrorEditState,
  getSelectedNavTab,
  removeFrequencyFromAdvFilters,
} from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';

export default function AdvertisingOverallAccountLevelPT() {
  const [initialColumns, setInitialColumns] = useState<
    Array<ColumnDef<IOverallAdvertisingData>>
  >([]);
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<IOverallAdvertisingData>>
  >([]);
  const [filteredState, setFilteredState] = useState<IEditAccessArrayData>([]);
  const [advertisingGraphData, setAdvertisingGraphData] = useState<
    IPerformanceGraphData[]
  >([]);
  const [advertisingMetricsData, setAdvertisingMetricsData] =
    useState<IPerformanceMetrics | null>(null);
  const [minMaxDates, setMinMaxDates] = useState<IMinMaxDateRange[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);

  const appliedAdvertisingFilters = useAppSelector(
    selectAdvertisingAppliedFilter
  );
  const overallPerformanceMetrics = useAppSelector(
    selectOverallPerformanceMetrics
  );
  const overallPerformanceMetricsOptions = useAppSelector(
    selectOverallPerformanceMetricsOptions
  );
  const searchText = useAppSelector(selectSearchText);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const paginationModel = useAppSelector(selectPaginationModel);
  const sortModel = useAppSelector(selectSortModel);
  const advErrors = useAppSelector(selectAdvertisingErrors);

  const dispatch = useAppDispatch();

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IOverallAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      OverallAccountLevelTitles.PRODUCT_TARGETING,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      overallAccountPerformanceOptions,
      OverallAccountLevelTitles.PRODUCT_TARGETING
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(
        OverallAccountLevelTitles.PRODUCT_TARGETING
      )
    );
  }, [dispatch]);

  const getProductTargetingDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = overallAdvertisingAccountLevelServices
        .getProductTargetingData(
          appliedFilters,
          getAmazonAdvertisingFilters(
            appliedAdvertisingFilters,
            appliedAdvertisingFilters.customDateRange,
            isDownload,
            !isAllDownload
          ),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(
            OverallAccountLevelTitles.PRODUCT_TARGETING,
            sortModel
          ),
          searchText
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row) => {
            const id = `${row.targetId}`;
            return {
              id,
              ...row,
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Product Targeting downloaded successfully.',
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
      searchText,
      sortModel,
      dispatch,
    ]
  );

  const fetchProductTargeting = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_OVERALL_ACCOUNT_LVL_PT_FETCH,
      {
        appliedFilters,
        appliedAdvertisingFilters: removeFrequencyFromAdvFilters(
          appliedAdvertisingFilters
        ),
        paginationModel,
        searchText,
        sortModel,
      },
    ],
    queryFn: () =>
      overallAdvertisingAccountLevelServices.getProductTargetingData(
        appliedFilters,
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange,
          false,
          false
        ),
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(
          OverallAccountLevelTitles.PRODUCT_TARGETING,
          sortModel
        ),
        searchText
      ),
    enabled:
      selectedAdvertisingNavTitle ===
      OverallAccountLevelTitles.PRODUCT_TARGETING,
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
      overallAdvertisingServices.getPerformanceGraph(
        appliedFilters,
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        ),
        searchText,
        AmazonAdvertisingTableTypesEnum.PRODUCT_TARGETS
      ),
    enabled:
      selectedAdvertisingNavTitle ===
      OverallAccountLevelTitles.PRODUCT_TARGETING,
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
      overallAdvertisingServices.getPerformanceMetrics(
        appliedFilters,
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        ),
        searchText,
        AmazonAdvertisingTableTypesEnum.PRODUCT_TARGETS
      ),
    enabled:
      selectedAdvertisingNavTitle ===
      OverallAccountLevelTitles.PRODUCT_TARGETING,
  });

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchProductTargeting.data) {
      let data = fetchProductTargeting.data.data.data.data;
      data = data.map((row) => {
        const id = `${row.targetId}`;
        return {
          id,
          ...row,
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        OverallAccountLevelTitles.PRODUCT_TARGETING
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        OverallAccountLevelTitles.PRODUCT_TARGETING
      );
      setInitialColumns(
        _initialColumns as Array<ColumnDef<IOverallAdvertisingData>>
      );
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<IOverallAdvertisingData>>
      );

      dispatch(setInitialState(data as IOverallAdvertisingData[]));
      const updatedData = getErrorEditState(
        data,
        advErrors
      ) as IOverallAdvertisingData[];
      setFilteredState(updatedData);
      dispatch(setEditState(updatedData));
      dispatch(setAdvertisingErrorDetails(null));

      const totalRows =
        fetchProductTargeting.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProductTargeting.data, dispatch]);

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
    dispatch(setOverallPerformanceMetrics(metricsValue));
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
        (await getProductTargetingDownload(
          true,
          isAllDownload
        )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getProductTargetingDownload]
  );

  return (
    <AdvertisingRenderingComponents
      advertisingMetricsData={advertisingMetricsData}
      performanceFilters={getAmazonAdvertisingFilters(
        appliedAdvertisingFilters,
        appliedAdvertisingFilters.customDateRange
      )}
      isMetricsLoading={
        fetchPerformanceMetrics.isLoading ||
        fetchPerformanceMetrics.isRefetching
      }
      performanceSelectedMetrics={overallPerformanceMetrics}
      performanceMetricsOptions={overallPerformanceMetricsOptions}
      handlePerformanceMetricsChange={handlePerformanceMetricsChange}
      performanceGraphData={advertisingGraphData}
      minMaxDates={minMaxDates ? minMaxDates[0] : null}
      isGraphLoading={
        fetchPerformanceGraph.isLoading || fetchPerformanceGraph.isRefetching
      }
      chartTitle={`advertising_overall_${getFileNameDateTime(
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        )
      )}`}
      performanceNavigationTabOptions={overallAccountPerformanceOptions}
      isTableLoading={
        fetchProductTargeting.isLoading || fetchProductTargeting.isRefetching
      }
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('amazon-overall', 'Product Targeting')}
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
