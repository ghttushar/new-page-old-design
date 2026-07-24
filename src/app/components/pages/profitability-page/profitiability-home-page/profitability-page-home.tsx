import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
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

import { UPDATED_PAGINATION_MODEL } from '@/constants';
import {
  calculatedMetricsForPerformance,
  calculatedMetricsForWalmartTable,
  INITIAL_PERFORMANCE_STATE,
} from '@/constants/profitability/profitability.constants';
import { getAllProfitabilityColumns } from '@/constants/table-columns/profitability-table-columns.constant';
import { ColumnNameEnum } from '@/enums/advertising.enums';
import { Frequency, MarketplaceEnum, Range } from '@/enums/serp.enums';
import { useProfitabilityData } from '@/hooks/profitability/use-profitability-data.hook';
import { IMultiSelectDropdownItem } from '@/interfaces/dropdown.interfaces';
import {
  IProfitabilityOrdersData,
  IProfitabilityPerformanceMetrics,
  IProfitabilityTableData,
  IProfitabilityTotalResponse,
  ITotalProductData,
} from '@/interfaces/profitability/profitability.interface';
import { setSearchText } from '@/redux/slices/advertising/advertising-filter.slice';

import { customRangeFilterOption } from '@/constants';
import { IDateRange } from '@/interfaces/serp.interface';
import { getFormattedMetrics } from '@/utils/advertising.utils';
import columnFilterUtils from '@/utils/column-filter.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import { ColumnDef, ExpandedState, SortingState } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import ProfitabilityHomePageView from '../../profitability/profitability-home-page-wrapper/profitability-page-home-view';

function WmtProfitabilityHomePage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectProfitabilityHeaderFilters);
  const activePerformanceBox = useAppSelector(selectActivePerformanceBox);
  const selectedRowData = useAppSelector(selectSelectedRowData);
  const isOrdersTable = useAppSelector(selectIsOrdersTable);

  const [totalData, setTotalData] = useState<
    IProfitabilityTotalResponse | ITotalProductData | null
  >(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    profitabilityUtils.getInitialExpandedState()
  );
  const [headerFilters, setHeaderFilters] =
    useState<IProfitabilityFilterForm>(filters);
  const [tableAccordionExpandedItems, setTableAccordionExpandedItems] =
    useState<Set<string>>(profitabilityUtils.getInitialExpandedState());
  const [chartData, setChartData] = useState<IProfitabilityOrdersData[]>([]);
  const [tableData, setTableData] = useState<IProfitabilityTableData[] | null>(
    null
  );
  const [totalRowCount, setTotalRowCount] = useState(0);

  const [performanceData, setPerformanceData] = useState<
    Array<IProfitabilityPerformanceMetrics | null>
  >(INITIAL_PERFORMANCE_STATE);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pagination, setPagination] = useState(UPDATED_PAGINATION_MODEL);
  const [expandedState, setExpandedState] = useState<ExpandedState>({});

  const [selectedColumns, setSelectedColumns] = useState<
    ColumnDef<IProfitabilityTableData>[]
  >([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: ColumnNameEnum.GMV_COLUMN,
      desc: true,
    },
  ]);

  const allTableColumns = useMemo(
    () => getAllProfitabilityColumns(isOrdersTable, true),
    [isOrdersTable]
  );

  const setFilters = useCallback(
    (filters: IProfitabilityFilterForm) =>
      dispatch(setProfitabilityFilterState(filters)),
    [dispatch]
  );

  const setTableAccordionData = (payload: IProfitabilityTableData | null) => {
    dispatch(
      setSelectedRowData({
        index: null,
        rowData: payload,
      })
    );
  };

  const handlePaginationReset = useCallback(
    () => setPagination(getUpdatedPagination),
    []
  );

  const onRangeSelect = useCallback(
    (range: IDropdownItem<string>) => {
      const newFilters: IProfitabilityFilterForm = {
        ...filters,
        range,
        customDateRanges: range.value
          .split('/')
          .map((r) => formatDate(r, MarketplaceEnum.WALMART)),
      };
      setHeaderFilters(newFilters);
    },
    [filters]
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

  const {
    isGraphLoading,
    isPerformanceLoading,
    isTableLoading,
    currentTable,
    handleDownload,
  } = useProfitabilityData({
    pagination,
    sorting,
    allTableColumns,
    setTableAccordionData,
    setTableData,
    setSelectedColumns,
    setExpandedState,
    setTotalData,
    setChartData,
    setPerformanceData,
    setTotalRowCount,
  });

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

  const onMetricsSelect = useCallback(
    (options: IMultiSelectDropdownItem[]) => {
      dispatch(setProfitabilityMetricsFilters(options));
    },
    [dispatch]
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

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IProfitabilityTableData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(currentTable, selectedColumns);
    setSelectedColumns(selectedColumns);
  };

  const handleTableTypeSwitch = () => {
    dispatch(setSearchText(''));
    setSelectedColumns([]);
    dispatch(setIsOrdersTable(!isOrdersTable));
    setTableAccordionData(null);
  };

  const accordionData = useMemo(
    () =>
      profitabilityUtils.transformDataToAccordion(
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

  const selectedMetricsData =
    profitabilityUtils.getProfitabilityMetricsGraphData<IProfitabilityOrdersData>(
      filters.metrics
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

  const onTableAccordionMetricsExpand = (itemId: string, index: number) => {
    const updatedExpandedItems =
      profitabilityUtils.handleTableAccordionExpansion(
        itemId,
        index,
        tableAccordionExpandedItems,
        selectedRowData,
        MarketplaceEnum.WALMART,
        currentTable
      );
    setTableAccordionExpandedItems(updatedExpandedItems);
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

  const handleTableDownload = (isAllDownload: boolean) => {
    return handleDownload(true, isAllDownload);
  };

  const customDateRange = useMemo(() => {
    return filters.range.value.split('/')[activePerformanceBox] ===
      Range.CUSTOM_RANGE
      ? filters.customDateRange
      : {
          startDate: formatDate(
            filters.range.value.split('/')[activePerformanceBox],
            MarketplaceEnum.WALMART
          ).startDate,
          endDate: formatDate(
            filters.range.value.split('/')[activePerformanceBox],
            MarketplaceEnum.WALMART
          ).endDate,
        };
  }, [activePerformanceBox, filters.customDateRange, filters.range.value]);

  const formattedRangeFreq = getFormattedRangeFreq(
    filters.frequency.value,
    filters.customDateRange,
    customDateRange.startDate,
    customDateRange.endDate
  );

  const generatedChartData = useMemo(
    () =>
      profitabilityUtils.generateChartData(
        chartData,
        selectedMetricsData,
        filters.frequency.value
      ),
    [chartData, filters.frequency.value, selectedMetricsData]
  );

  const transformedPerformanceData = useMemo(
    () =>
      performanceData.map((metric) =>
        profitabilityUtils.transformPerformanceMetricsForCard(metric)
      ),
    [performanceData]
  );

  const performanceCalculatedMetrics = useMemo(() => {
    const metrics = performanceData[activePerformanceBox];
    if (!metrics) return [];

    return calculatedMetricsForPerformance.map((key) => ({
      key,
      label: profitabilityUtils.getLabelByKey(key),
      currValue: getFormattedMetrics(
        key,
        hasProperty(metrics, key) ? parseNum(metrics[key]) : 0
      ),
    }));
  }, [performanceData, activePerformanceBox]);

  const tableCalculatedMetrics = useMemo(() => {
    if (!selectedRowData) return [];

    return calculatedMetricsForWalmartTable.map((key) => ({
      key,
      label: profitabilityUtils.getLabelByKey(key),
      currValue: getFormattedMetrics(
        key,
        hasProperty(selectedRowData, key) ? parseNum(selectedRowData[key]) : 0
      ),
    }));
  }, [selectedRowData]);

  return (
    <ProfitabilityHomePageView
      marketplace={MarketplaceEnum.WALMART}
      headerFilters={headerFilters}
      totalData={totalData}
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
      selectedColumns={selectedColumns}
      allTableColumns={allTableColumns}
      sorting={sorting}
      isGraphLoading={isGraphLoading}
      isPerformanceLoading={isPerformanceLoading}
      isTableLoading={isTableLoading}
      currentTable={currentTable}
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
}

export default WmtProfitabilityHomePage;
