import { UPDATED_PAGINATION_MODEL } from '@/constants';
import { analysisAmzOverallPerformanceOptions } from '@/constants/impact-analysis-filter.constants';
import { ImpactAnalysisTableTitles } from '@/enums/impact-analysis.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IAdvertisingNavigationBarOption,
  IMinMaxDateRange,
  IPerformanceGraphData,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectSearchText } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import { AnalysisOverallService } from '@/services/advertising/impact-analysis/amazon/overall/impact-analysis-overall.service';
import { getSelectedNavTab } from '@/utils/advertising.utils';
import columnFilterUtils from '@/utils/column-filter.utils';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import AnalysisRenderingComponents from 'src/app/components/page-components/analysis-rendering-components/analysis-rendering-components';
import {
  IAnalysisArrayData,
  IAnalysisColData,
  IAnalysisExportData,
  IImpactedCampaignData,
} from 'src/interfaces/analysis.interface';
import {
  selectAnalysisFilter,
  selectAnalysisMetricsFilter,
  selectSelectedAnalysisNavTab,
  selectSelectedAnalysisNavTitle,
  setSelectedAnalysisNavTab,
  setSelectedAnalysisNavTitle,
} from 'src/redux/slices/impact-analysis/impact-analysis.slice';
import { overallAdvertisingServices } from 'src/services/advertising/amazon/overall-advertising.service';
import { getFileNameDateTime } from 'src/utils';
import {
  getAdvTableFromAnalysisTableType,
  getAnalysisColumnsByTab,
  getAnalysisTableFilters,
  getCampaignExportData,
  getInitialImpactTableColumns,
  getInitialSortingByTitle,
  getTargetedColumnIndex,
  removeSelectedMetrics,
} from 'src/utils/analysis.utils';

export default function AnalysisCampaignsPage() {
  const dispatch = useAppDispatch();

  const filters = useAppSelector(selectAnalysisFilter);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const metricsFilter = useAppSelector(selectAnalysisMetricsFilter);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const searchText = useAppSelector(selectSearchText);
  const selectedAnalysisNavTab = useAppSelector(selectSelectedAnalysisNavTab);

  const selectedAnalysisNavTitle = useAppSelector(
    selectSelectedAnalysisNavTitle
  );
  const [formattedColumns, setFormattedColumns] = useState<
    Array<ColumnDef<IAnalysisColData>>
  >(
    getInitialImpactTableColumns(
      selectedAnalysisNavTitle,
      filters.selectedMetric,
      advertisingAccount.marketplace
    )
  );
  const [formattedRows, setFormattedRows] = useState<IAnalysisArrayData>([]);
  const [initialFormattedRows, setInitialFormattedRows] =
    useState<IAnalysisArrayData>([]);
  const [analysisGraphData, setAnalysisGraphData] = useState<
    IPerformanceGraphData[]
  >([]);
  const [exportData, setExportData] = useState<IAnalysisExportData[]>([]);
  const [minMaxDates, setMinMaxDates] = useState<IMinMaxDateRange[]>([]);
  const [sorting, setSorting] = useState<SortingState>(
    getInitialSortingByTitle(selectedAnalysisNavTitle)
  );
  const [pagination, setPagination] = useState(UPDATED_PAGINATION_MODEL);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const selectedTab = getSelectedNavTab(
      analysisAmzOverallPerformanceOptions,
      ImpactAnalysisTableTitles.CAMPAIGN
    );

    dispatch(setSelectedAnalysisNavTab(selectedTab));
    dispatch(setSelectedAnalysisNavTitle(ImpactAnalysisTableTitles.CAMPAIGN));
  }, [dispatch]);

  const handleSetUpdatedRows = (data: any[]) => setFormattedRows(data);

  const fetchAnalysisGraphData = useAppQuery({
    queryFn: () => {
      return overallAdvertisingServices.getPerformanceGraph(
        appliedFilters,
        getAnalysisTableFilters(filters, MarketplaceEnum.AMAZON),
        searchText,
        getAdvTableFromAnalysisTableType(selectedAnalysisNavTitle)
      );
    },
    queryKey: [
      QueryKeyEnums.FETCH_IMPACT_ANALYSIS_GRAPH,

      {
        selectedAnalysisNavTitle,
        searchText,
        filters: removeSelectedMetrics(filters),
      },
    ],
    enabled: selectedAnalysisNavTitle === ImpactAnalysisTableTitles.CAMPAIGN,
  });

  useEffect(() => {
    setAnalysisGraphData([]);
    setMinMaxDates([]);
    if (fetchAnalysisGraphData.isSuccess) {
      const response = fetchAnalysisGraphData.data.data.data;
      setAnalysisGraphData(response?.graphData ?? []);
      setMinMaxDates(response?.maxMinDate ?? []);
    }
  }, [
    fetchAnalysisGraphData.data?.data.data,
    fetchAnalysisGraphData.isSuccess,
  ]);

  const isAnalysisGraphLoading = useMemo(
    () =>
      fetchAnalysisGraphData.isLoading || fetchAnalysisGraphData.isRefetching,
    [fetchAnalysisGraphData.isLoading, fetchAnalysisGraphData.isRefetching]
  );

  const fetchAnalysisTableData = useAppQuery({
    queryFn: ({ signal }) => {
      return AnalysisOverallService.getImpactAnalysisTable(
        appliedFilters,
        getAnalysisTableFilters(filters, MarketplaceEnum.AMAZON),
        getAdvTableFromAnalysisTableType(selectedAnalysisNavTitle),
        pagination.pageIndex + 1,
        pagination.pageSize,
        searchText,
        columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
          getInitialImpactTableColumns(
            selectedAnalysisNavTitle,
            filters.selectedMetric,
            advertisingAccount.marketplace
          ),
          sorting
        ),
        signal
      );
    },
    queryKey: [
      QueryKeyEnums.FETCH_IMPACT_ANALYSIS_TABLE,
      {
        selectedAnalysisNavTitle,
        advertisingAccount,
        searchText,
        filters: removeSelectedMetrics(filters),
        appliedFilters,
        pagination,
        sorting,
      },
    ],
    enabled: selectedAnalysisNavTitle === ImpactAnalysisTableTitles.CAMPAIGN,
  });

  useEffect(() => {
    setFormattedColumns([]);
    setFormattedRows([]);
    setInitialFormattedRows([]);
    setExportData([]);

    if (fetchAnalysisTableData.isSuccess) {
      const tableData = fetchAnalysisTableData.data.data.data.data;
      setTotalCount(
        Number(fetchAnalysisTableData.data.data.data.pagination.totalItems)
      );
      const initialColumns = getAnalysisColumnsByTab(
        selectedAnalysisNavTitle,
        tableData.startDate,
        tableData.endDate,
        tableData.impactStartDate,
        tableData.impactEndDate,
        filters.selectedMetric,
        advertisingAccount.marketplace
      );
      const targetedIdx = getTargetedColumnIndex(
        filters.selectedMetric,
        initialColumns as ColumnDef<IAnalysisColData>[]
      );

      const rearrangedColumns = [
        initialColumns[0],
        initialColumns[targetedIdx],
      ];
      initialColumns.splice(targetedIdx, 1);
      initialColumns.splice(0, 1);

      setFormattedColumns([
        ...(rearrangedColumns as ColumnDef<IAnalysisColData>[]),
        ...(initialColumns as ColumnDef<IAnalysisColData>[]),
      ]);
      setFormattedRows(tableData.data);
      setInitialFormattedRows(tableData.data);

      setExportData(
        getCampaignExportData(tableData.data as IImpactedCampaignData[])
      );
    }
  }, [
    advertisingAccount.marketplace,
    fetchAnalysisTableData.data?.data.data,
    fetchAnalysisTableData.isSuccess,
    filters.selectedMetric,
    selectedAnalysisNavTitle,
  ]);

  const handleSelectedOption = (option: IAdvertisingNavigationBarOption) => {
    dispatch(setSelectedAnalysisNavTab(option));
  };

  const isTableLoading = useMemo(
    () =>
      fetchAnalysisTableData.isLoading || fetchAnalysisTableData.isRefetching,
    [fetchAnalysisTableData.isLoading, fetchAnalysisTableData.isRefetching]
  );

  return (
    <AnalysisRenderingComponents
      analysisGraphData={analysisGraphData}
      metricsFilter={metricsFilter}
      analysisFilters={getAnalysisTableFilters(filters, MarketplaceEnum.AMAZON)}
      minMaxDates={minMaxDates[0]}
      isAnalysisGraphLoading={isAnalysisGraphLoading}
      chartLabel={`analysis_${getFileNameDateTime(
        getAnalysisTableFilters(filters, MarketplaceEnum.AMAZON)
      )}`}
      performanceNavigationTabOptions={analysisAmzOverallPerformanceOptions}
      selectedAnalysisNavTab={selectedAnalysisNavTab}
      handleSelectedOption={handleSelectedOption}
      isTableLoading={isTableLoading}
      selectedAnalysisNavTitle={selectedAnalysisNavTitle}
      exportData={exportData}
      initialFormattedRows={initialFormattedRows}
      formattedRows={formattedRows}
      handleSetUpdatedRows={handleSetUpdatedRows}
      formattedColumns={formattedColumns}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      totalCount={totalCount}
    />
  );
}
