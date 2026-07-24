import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { overallAccountPerformanceOptions } from '@/constants/advertising-filter.constants';
import {
  AmazonAdvertisingTableTypesEnum,
  OverallAccountLevelTitles,
} from '@/enums/advertising.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { IEditAccessArrayData } from '@/interfaces/advertising/advertising.interface';
import { IOverallAdvertisingData } from '@/interfaces/advertising/amazon/overall-advertising.interface';
import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import {
  resetEditAccessFilters,
  selectAdvertisingErrors,
  setAdvertisingErrorDetails,
  setEditState,
  setInitialState,
} from '@/redux/slices/advertising/advertising-edit-access.slice';
import {
  selectAdvertisingAppliedFilter,
  selectPaginationModel,
  selectSearchText,
  selectSelectedAdvertisingNavTitle,
  selectSortModel,
  setSelectedAdvertisingNavTab,
  setSelectedAdvertisingNavTitle,
  TPerformanceMetricsKey,
} from '@/redux/slices/advertising/advertising-filter.slice';
import {
  selectOverallPerformanceMetrics,
  selectOverallPerformanceMetricsOptions,
  setOverallPerformanceMetrics,
} from '@/redux/slices/advertising/advertising-overall-filter.slice';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import {
  selectIsShowImpactOn,
  setImpactAnalysisData,
} from '@/redux/slices/impact-analysis/impact-analysis.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import {
  overallAdvertisingAccountLevelServices,
  overallAdvertisingServices,
} from '@/services/advertising/amazon/overall-advertising.service';
import { AnalysisOverallService } from '@/services/advertising/impact-analysis/amazon/overall/impact-analysis-overall.service';
import { genExportFileName, getFileNameDateTime } from '@/utils';
import {
  getFormattedSortModel,
  getInitialColumnsByNavTitle,
} from '@/utils/advertising-columns.utils';
import {
  getAmazonAdvertisingFilters,
  getErrorEditState,
  getSelectedNavTab,
  removeFrequencyFromAdvFilters,
} from '@/utils/advertising.utils';
import columnFilterUtils from '@/utils/column-filter.utils';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';

export default function AdvertisingOverallAccountLevelSearchTerm() {
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
  const isShowImpactOn = useAppSelector(selectIsShowImpactOn);
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
      OverallAccountLevelTitles.SEARCH_TERM,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      overallAccountPerformanceOptions,
      OverallAccountLevelTitles.SEARCH_TERM
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(OverallAccountLevelTitles.SEARCH_TERM)
    );
  }, [dispatch]);

  const getSearchTermDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = overallAdvertisingAccountLevelServices
        .getSearchTermData(
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
            OverallAccountLevelTitles.SEARCH_TERM,
            sortModel
          ),
          searchText
        )
        .then((res) => {
          let data = res.data?.data.data;
          let id = 0;
          data = data.map((row) => {
            id += 1;
            return {
              id,
              ...row,
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Search Term Keywords downloaded successfully.',
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

  const fetchSearchTerms = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_OVERALL_ACCOUNT_LVL_SEARCH_TERM_FETCH,
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
      overallAdvertisingAccountLevelServices.getSearchTermData(
        appliedFilters,
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange,
          false,
          false
        ),
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(OverallAccountLevelTitles.SEARCH_TERM, sortModel),
        searchText
      ),
    enabled:
      selectedAdvertisingNavTitle === OverallAccountLevelTitles.SEARCH_TERM,
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
        AmazonAdvertisingTableTypesEnum.SEARCH_TERM
      ),
    enabled:
      selectedAdvertisingNavTitle === OverallAccountLevelTitles.SEARCH_TERM,
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
        AmazonAdvertisingTableTypesEnum.SEARCH_TERM
      ),
    enabled:
      selectedAdvertisingNavTitle === OverallAccountLevelTitles.SEARCH_TERM,
  });

  const fetchImpactAnalysis = useAppQuery({
    queryKey: [
      QueryKeyEnums.IMPACT_ANALYSIS_FETCH,

      {
        appliedAdvertisingFilters,
      },
    ],

    queryFn: () =>
      AnalysisOverallService.getImpactAnalysis(
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,

          appliedAdvertisingFilters.customDateRange
        ),

        AmazonAdvertisingTableTypesEnum.SEARCH_TERM
      ),
  });

  useEffect(() => {
    if (fetchImpactAnalysis.data) {
      dispatch(
        setImpactAnalysisData({
          data: fetchImpactAnalysis.data.data.data,

          table: AmazonAdvertisingTableTypesEnum.SEARCH_TERM,
        })
      );
    } else {
      dispatch(setImpactAnalysisData(null));
    }
  }, [fetchImpactAnalysis.data, dispatch]);

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchSearchTerms.data) {
      let data = fetchSearchTerms.data.data.data.data;
      let id = 0;
      data = data.map((row) => {
        id += 1;
        return {
          id,
          ...row,
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        OverallAccountLevelTitles.SEARCH_TERM
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        OverallAccountLevelTitles.SEARCH_TERM
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

      const totalRows = fetchSearchTerms.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSearchTerms.data, dispatch]);

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

      const data: Record<string, unknown>[] = (await getSearchTermDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getSearchTermDownload]
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
      isImpactLoading={
        fetchImpactAnalysis.isLoading || fetchImpactAnalysis.isRefetching
      }
      chartTitle={`advertising_overall_${getFileNameDateTime(
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        )
      )}`}
      performanceNavigationTabOptions={overallAccountPerformanceOptions}
      isTableLoading={
        fetchSearchTerms.isLoading || fetchSearchTerms.isRefetching
      }
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('amazon-overall', 'Search Terms')}
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
