import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { customRangeFilterOption, UPDATED_PAGINATION_MODEL } from '@/constants';
import {
  calculatedMetricsForAmazonTable,
  calculatedMetricsForPerformance,
  INITIAL_PERFORMANCE_STATE,
} from '@/constants/profitability/profitability.constants';
import { amazonProfitabilityColumns } from '@/constants/table-columns/profitability-table-columns.constant';
import { ProfitabilityTableTypeEnum } from '@/enums/profitability.enums';
import { Frequency, MarketplaceEnum, Range } from '@/enums/serp.enums';
import { useAmazonProfitabilityData } from '@/hooks/profitability/use-amazon-profitability-data.hook';
import { IMultiSelectDropdownItem } from '@/interfaces/dropdown.interfaces';
import {
  IAmazonPerformanceMetrics,
  IAmazonProfitabilityAggregatedData,
  IAmazonProfitabilityGraphResponse,
  IAmazonProfitabilityTableData,
} from '@/interfaces/profitability/amazon-profitability.interface';
import { IDateRange } from '@/interfaces/serp.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSearchText } from '@/redux/slices/advertising/advertising-filter.slice';
import {
  IProfitabilityFilterForm,
  selectActivePerformanceBox,
  selectIsOrdersTable,
  selectProfitabilityHeaderFilters,
  selectSelectedRowData,
  setActivePerformanceBox,
  setIsOrdersTable,
  setProfitabilityFilterState,
  setProfitabilityMetricsFilters,
  setSelectedRowData,
} from '@/redux/slices/profitability/profitability.slice';
import {
  formatDate,
  getFormattedRangeFreq,
  getUpdatedPagination,
  hasProperty,
  parseNum,
} from '@/utils';
import { getFormattedMetrics } from '@/utils/advertising.utils';
import columnFilterUtils from '@/utils/column-filter.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import {
  ColumnDef,
  ExpandedState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import ProfitabilityHomePageView from '../../profitability-home-page-wrapper/profitability-page-home-view';

export const AmazonProfitabilityHomePage = () => {
  const dispatch = useAppDispatch();
  const isOrdersTable = useAppSelector(selectIsOrdersTable);
  const filters = useAppSelector(selectProfitabilityHeaderFilters);
  const activePerformanceBox = useAppSelector(selectActivePerformanceBox);
  const selectedRowData = useAppSelector(selectSelectedRowData);

  const setFilters = useCallback(
    (filters: IProfitabilityFilterForm) =>
      dispatch(setProfitabilityFilterState(filters)),
    [dispatch]
  );

  const [tableData, setTableData] = useState<
    IAmazonProfitabilityTableData[] | null
  >([]);
  const [columns, setColumns] = useState<
    ColumnDef<IAmazonProfitabilityTableData>[]
  >([]);
  const [headerFilters, setHeaderFilters] =
    useState<IProfitabilityFilterForm>(filters);
  const [expandedState, setExpandedState] = useState<ExpandedState>({});
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [pagination, setPagination] = useState<PaginationState>(
    UPDATED_PAGINATION_MODEL
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    profitabilityUtils.getInitialExpandedState()
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [tableAccordionExpandedItems, setTableAccordionExpandedItems] =
    useState<Set<string>>(profitabilityUtils.getInitialExpandedState());
  const [sorting, setSorting] = useState<SortingState>([]);
  const [performanceData, setPerformanceData] = useState<
    Array<IAmazonPerformanceMetrics | null>
  >(INITIAL_PERFORMANCE_STATE);
  const [aggregatedData, setAggregatedData] =
    useState<IAmazonProfitabilityAggregatedData | null>(null);
  const [chartData, setChartData] = useState<
    IAmazonProfitabilityGraphResponse[]
  >([]);

  const allTableColumns = amazonProfitabilityColumns(isOrdersTable, true);

  const handleTableTypeSwitch = () => {
    dispatch(setIsOrdersTable(!isOrdersTable));
    dispatch(setSearchText(''));
    setColumns([]);
    dispatch(
      setSelectedRowData({
        index: null,
        rowData: null,
      })
    );
  };

  const {
    handleDownload,
    isTableLoading,
    currentTable,
    isPerformanceLoading,
    isGraphLoading,
  } = useAmazonProfitabilityData({
    pagination,
    sorting,
    allTableColumns,
    setTableData,
    setSelectedColumns: setColumns,
    setTotalRowCount,
    setExpandedState,
    isOrdersTable,
    setPerformanceData,
    setAggregatedData,
    setChartData,
  });

  const customDateRange = useMemo(() => {
    return filters.range.value.split('/')[activePerformanceBox] ===
      Range.CUSTOM_RANGE
      ? filters.customDateRange
      : {
          startDate: formatDate(
            filters.range.value.split('/')[activePerformanceBox]
          ).startDate,
          endDate: formatDate(
            filters.range.value.split('/')[activePerformanceBox]
          ).endDate,
        };
  }, [activePerformanceBox, filters.customDateRange, filters.range.value]);

  const onRangeSelect = useCallback(
    (range: IDropdownItem<string>) => {
      const newFilters: IProfitabilityFilterForm = {
        ...filters,
        range,
        customDateRanges: range.value.split('/').map((r) => formatDate(r)),
      };
      setHeaderFilters(newFilters);
    },
    [filters]
  );

  const handlePaginationReset = useCallback(
    () => setPagination(getUpdatedPagination),
    []
  );

  const setCustomDateRange = useCallback(
    (customDateRange: IDateRange) => {
      const newFilters = {
        ...filters,
        range: customRangeFilterOption,
        customDateRange,
      };
      setHeaderFilters(newFilters);
    },
    [filters]
  );

  const handleApply = () => {
    setFilters(
      profitabilityUtils.getFormattedAppliedFilters(headerFilters, filters)
    );
    handlePaginationReset();
  };

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IAmazonProfitabilityTableData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(currentTable, selectedColumns);
    setColumns(selectedColumns);
  };

  const handleTableDownload = (isAllDownload: boolean) => {
    return handleDownload(isAllDownload, false);
  };

  const setSelectedBox = useCallback(
    (val: number) => {
      if (performanceData[val] === null) {
        setExpandedItems(new Set());
        setTableAccordionExpandedItems(new Set());
      }
      dispatch(setActivePerformanceBox(val));
    },
    [dispatch, performanceData]
  );

  const onFrequencySelect = useCallback(
    (value: IDropdownItem<Frequency>) => {
      setFilters({
        ...filters,
        frequency: value,
      });
    },
    [filters, setFilters]
  );
  const onMetricsSelect = useCallback(
    (options: IMultiSelectDropdownItem[]) => {
      dispatch(setProfitabilityMetricsFilters(options));
    },
    [dispatch]
  );
  const formattedRangeFreq = getFormattedRangeFreq(
    filters.frequency.value,
    filters.customDateRange,
    customDateRange.startDate,
    customDateRange.endDate
  );

  const transformedPerformanceData = useMemo(
    () =>
      performanceData.map((metric) =>
        profitabilityUtils.transformAmazonPerformanceMetricsForCard(metric)
      ),
    [performanceData]
  );

  const onTableAccordionMetricsExpand = (itemId: string, index: number) => {
    const updatedExpandedItems =
      profitabilityUtils.handleTableAccordionExpansion(
        itemId,
        index,
        tableAccordionExpandedItems,
        selectedRowData,
        MarketplaceEnum.AMAZON,
        currentTable
      );
    setTableAccordionExpandedItems(updatedExpandedItems);
  };

  const accordionData = useMemo(
    () =>
      profitabilityUtils.transformAmazonPerformanceDataToAccordion(
        performanceData[activePerformanceBox],
        filters.range.value.split('/')[activePerformanceBox],
        filters.customDateRange
      ),
    [
      activePerformanceBox,
      filters.customDateRange,
      filters.range.value,
      performanceData,
    ]
  );

  const totalExpandableItems = useMemo(() => {
    return profitabilityUtils.getTotalExpandableItems(
      accordionData[0]?.children || []
    );
  }, [accordionData]);

  const onAccordionMetricsExpand = (itemId: string, index: number) => {
    if (performanceData[index] === null) {
      setExpandedItems(new Set());
      return;
    }
    const updatedExpandedItems =
      profitabilityUtils.handleAccordionMetricsExpansion(
        expandedItems,
        totalExpandableItems,
        accordionData,
        index,
        itemId
      );
    setExpandedItems(updatedExpandedItems);
  };

  const onCardCustomDateRangeChange = useCallback(
    (index: number, customRange: IDateRange) => {
      profitabilityUtils.onCardCustomDateRangeChange(
        index,
        customRange,
        headerFilters,
        setFilters,
        setSelectedBox
      );
    },
    [headerFilters, setFilters, setSelectedBox]
  );

  const selectedMetricsData =
    profitabilityUtils.getProfitabilityMetricsGraphData<IAmazonProfitabilityGraphResponse>(
      filters.metrics
    );

  const performanceCalculatedMetrics = useMemo(() => {
    const metrics = performanceData[activePerformanceBox];
    if (!metrics) return [];

    return calculatedMetricsForPerformance.map((key) => ({
      key,
      label: profitabilityUtils.getLabelByKey(key),
      currValue: getFormattedMetrics(
        key,
        parseFloat(`${metrics[key as keyof typeof metrics]}`)
      ),
    }));
  }, [performanceData, activePerformanceBox]);
  const generatedChartData = useMemo(
    () =>
      profitabilityUtils.generateChartData(
        chartData,
        selectedMetricsData,
        filters.frequency.value
      ),
    [chartData, filters.frequency.value, selectedMetricsData]
  );

  const tableCalculatedMetrics = useMemo(() => {
    if (!selectedRowData) return [];
    const settlementDetails = profitabilityUtils.isSettlementDetails(
      selectedRowData
    )
      ? selectedRowData.settlementDetails
      : null;

    return calculatedMetricsForAmazonTable
      .filter(
        (key) =>
          (hasProperty(selectedRowData, key) &&
            parseNum(selectedRowData[key] !== 0)) ||
          (hasProperty(settlementDetails, key) &&
            parseNum(settlementDetails[key] !== 0))
      )
      .map((key) => {
        return {
          key,
          label: profitabilityUtils.getLabelByKey(key),
          currValue: getFormattedMetrics(
            key,
            hasProperty(selectedRowData, key)
              ? parseNum(selectedRowData[key])
              : hasProperty(settlementDetails, key)
              ? parseNum(settlementDetails[key])
              : 0
          ),
        };
      });
  }, [selectedRowData]);

  return (
    <ProfitabilityHomePageView
      marketplace={MarketplaceEnum.AMAZON}
      headerFilters={headerFilters}
      totalData={aggregatedData}
      chartData={generatedChartData}
      tableData={tableData}
      transformedPerformanceData={transformedPerformanceData}
      selectedMetricsData={selectedMetricsData}
      totalExpandableItems={totalExpandableItems}
      activePerformanceBox={activePerformanceBox}
      isOrdersTable={isOrdersTable}
      isExpanded={isExpanded}
      expandedItems={expandedItems}
      tableAccordionExpandedItems={tableAccordionExpandedItems}
      totalRowCount={totalRowCount}
      pagination={pagination}
      expandedState={expandedState}
      selectedColumns={columns}
      allTableColumns={allTableColumns}
      sorting={sorting}
      isGraphLoading={isGraphLoading}
      isPerformanceLoading={isPerformanceLoading}
      isTableLoading={isTableLoading}
      currentTable={currentTable as ProfitabilityTableTypeEnum}
      onRangeSelect={onRangeSelect}
      setCustomDateRange={setCustomDateRange}
      handleApply={handleApply}
      setSelectedBox={setSelectedBox}
      onMetricsSelect={onMetricsSelect}
      onFrequencySelect={onFrequencySelect}
      setSelectedColumnsHandler={setSelectedColumnsHandler}
      handleTableTypeSwitch={handleTableTypeSwitch}
      onAccordionMetricsExpand={onAccordionMetricsExpand}
      onTableAccordionMetricsExpand={onTableAccordionMetricsExpand}
      handleTableDownload={handleTableDownload}
      setPagination={setPagination}
      setSorting={setSorting}
      setExpandedState={setExpandedState}
      setIsExpanded={setIsExpanded}
      formattedRangeFreq={formattedRangeFreq}
      performanceCalculatedMetrics={performanceCalculatedMetrics}
      tableCalculatedMetrics={tableCalculatedMetrics}
      accordionData={accordionData}
      onCustomDateRangeChange={onCardCustomDateRangeChange}
    />
  );
};
