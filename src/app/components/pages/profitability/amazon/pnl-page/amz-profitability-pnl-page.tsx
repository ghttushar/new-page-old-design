import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import dateColumnUtils from '@/app/components/common/dynamic-date-columns/dynamic-date-columns';
import SyncFilters from '@/app/components/hoc/sync-filters';
import { GenericFlatRowData } from '@/app/components/page-components/profitability/profitability-pnl-table/profitability-pnl-table';
import { customRangeFilterOption, UPDATED_PAGINATION_MODEL } from '@/constants';
import {
  ACCORDION_ROOT_ID,
  calculatedMetricsForAmazonTable,
} from '@/constants/profitability/profitability.constants';
import {
  amazonProfitabilityColumns,
  PNL_PARAMETER,
  PNL_TOTAL,
} from '@/constants/table-columns/profitability-table-columns.constant';
import { ProfitabilityTableTypeEnum } from '@/enums/profitability.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { Frequency, MarketplaceEnum } from '@/enums/serp.enums';
import { useAmazonProfitabilityData } from '@/hooks/profitability/use-amazon-profitability-data.hook';
import { IMultiSelectProductSearchDropdownItem } from '@/interfaces/dropdown.interfaces';
import {
  IAmazonProfitabilityAggregatedData,
  IAmazonProfitabilityGraphResponse,
  IAmazonProfitabilityTableData,
} from '@/interfaces/profitability/amazon-profitability.interface';
import { IDateRange } from '@/interfaces/serp.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { setSearchText } from '@/redux/slices/advertising/advertising-filter.slice';
import {
  IProfitabilityFilterForm,
  selectIsOrdersTable,
  selectProfitabilityHeaderFilterOptions,
  selectProfitabilityHeaderFilters,
  selectSelectedRowData,
  setIsOrdersTable,
  setProfitabilityFilterState,
  setSelectedProducts,
} from '@/redux/slices/profitability/profitability.slice';
import { amazonProfitabilityService } from '@/services/profitability/amazon-profitability.service';
import { getUpdatedPagination, hasProperty, parseNum } from '@/utils';
import { getFormattedMetrics } from '@/utils/advertising.utils';
import columnFilterUtils from '@/utils/column-filter.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import {
  ColumnDef,
  ExpandedState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import TruePNLPageView from '../../../profitability-page/profitability-true-pnl/true-pnl-page-view';

export const AmzProfitabilityPnLPage = () => {
  const dispatch = useAppDispatch();
  const isOrdersTable = useAppSelector(selectIsOrdersTable);
  const filters = useAppSelector(selectProfitabilityHeaderFilters);
  const options = useAppSelector(selectProfitabilityHeaderFilterOptions);
  const selectedRowData = useAppSelector(selectSelectedRowData);

  const setFilters = useCallback(
    (filters: IProfitabilityFilterForm) =>
      dispatch(setProfitabilityFilterState(filters)),
    [dispatch]
  );
  useEffect(() => setHeaderFilters(filters), [filters.range]);

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

  const [tableAccordionExpandedItems, setTableAccordionExpandedItems] =
    useState<Set<string>>(profitabilityUtils.getInitialExpandedState());
  const [sorting, setSorting] = useState<SortingState>([]);

  const [aggregatedData, setAggregatedData] =
    useState<IAmazonProfitabilityAggregatedData | null>(null);
  const [pnlData, setPnlData] = useState<
    IAmazonProfitabilityGraphResponse[] | null
  >(null);

  const [pnlExpandedState, setPnlExpandedState] = useState<ExpandedState>({});
  const allTableColumns = amazonProfitabilityColumns(isOrdersTable, false);

  const uniqueDates = useMemo(() => {
    if (!pnlData || pnlData.length === 0) return [];

    return dateColumnUtils.extractUniqueDates(pnlData);
  }, [pnlData]);

  const transformPnlDataToFlat = useCallback((): GenericFlatRowData[] => {
    const accordionData = profitabilityUtils
      .transformAmazonPnLDataToAccordion(pnlData, uniqueDates)
      .filter((data) => Boolean(data.label.trim()));

    if (!accordionData[0]?.children) return [];

    return accordionData[0].children
      .map((item, index) => {
        const itemId = profitabilityUtils.getItemIdFromLabel(
          ACCORDION_ROOT_ID,
          item.label,
          index
        );

        return {
          ...item,
          id: itemId,
          level: 0,
          parentId: ACCORDION_ROOT_ID,
          index,
          hasChildren: !!(item.children && item.children.length > 0),
        } as GenericFlatRowData;
      })
      .filter((item) => item.label !== '');
  }, [pnlData, uniqueDates]);

  const flatTableData = useMemo(
    () => transformPnlDataToFlat(),
    [transformPnlDataToFlat]
  );

  useEffect(() => {
    setPnlExpandedState(
      profitabilityUtils.getPNLInitialExpandedState(flatTableData)
    );
  }, [flatTableData]);

  const handleTableTypeSwitch = () => {
    dispatch(setIsOrdersTable(!isOrdersTable));
    dispatch(setSearchText(''));
    setColumns([]);
  };

  const { handleDownload, isTableLoading, currentTable, isGraphLoading } =
    useAmazonProfitabilityData({
      pagination,
      sorting,
      allTableColumns,
      setTableData,
      setSelectedColumns: setColumns,
      setTotalRowCount,
      setExpandedState,
      isOrdersTable,
      setAggregatedData,
      isPnL: true,
      setChartData: setPnlData,
      disablePerformance: true,
    });

  const handlePnlDownload = (isAllDownload: boolean) => {
    return handleDownload(isAllDownload, true);
  };

  const handleTableDownload = (isAllDownload: boolean) => {
    return handleDownload(isAllDownload, false);
  };

  const tableColumns: ColumnDef<GenericFlatRowData>[] = useMemo(() => {
    const columns: ColumnDef<GenericFlatRowData>[] = [
      PNL_PARAMETER as ColumnDef<GenericFlatRowData>,
    ];

    const dateColumns = dateColumnUtils.createDateColumns<GenericFlatRowData>(
      uniqueDates,
      isGraphLoading,
      {
        dateHeaderClassName: 'dateHeaderContent',
        dateCellClassName: 'dateCellContent',
        noDataText: '-',
        skeletonWidth: '6rem',
      },
      '',
      filters.frequency.value
    );

    columns.push(...dateColumns);

    columns.push(PNL_TOTAL as ColumnDef<GenericFlatRowData>);

    return columns;
  }, [isGraphLoading, uniqueDates, filters.frequency.value]);

  const onRangeSelect = (range: IDropdownItem<string>) => {
    setHeaderFilters((prev) => {
      return {
        ...prev,
        range,
        frequency: profitabilityUtils.getFrequencyByRange(range),
      };
    });
  };

  const handlePaginationReset = useCallback(
    () => setPagination(getUpdatedPagination),
    []
  );

  const setCustomDateRange = (customDateRange: IDateRange) => {
    setHeaderFilters((prev) => {
      return {
        ...prev,
        range: customRangeFilterOption,
        customDateRange,
      };
    });
  };

  const handleApply = () => {
    setFilters(headerFilters);
    handlePaginationReset();
  };

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IAmazonProfitabilityTableData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(currentTable, selectedColumns);
    setColumns(selectedColumns);
  };

  const onFrequencySelect = (value: IDropdownItem<Frequency>) => {
    setHeaderFilters((prev) => {
      return {
        ...prev,
        frequency: profitabilityUtils.getFrequencyByRange(prev.range, value),
      };
    });
  };

  const onProductSelect = (value: IMultiSelectProductSearchDropdownItem[]) => {
    setHeaderFilters({
      ...headerFilters,
      selectedProducts: value,
    });
  };

  const fetchAllProductsInfo = useAppQuery({
    queryFn: ({ signal }) =>
      amazonProfitabilityService.getPnlProductData(signal),
    queryKey: [QueryKeyEnums.FETCH_AMAZON_PROFITABILITY_ALL_PRODUCTS_LIST],
  });

  useEffect(() => {
    if (fetchAllProductsInfo.isSuccess) {
      const productsData = fetchAllProductsInfo.data.data.data;
      const selectedProducts =
        profitabilityUtils.formatAllProductsToMultiSelectItems(productsData);
      setHeaderFilters((prev) => ({
        ...prev,
        selectedProducts,
      }));
      dispatch(setSelectedProducts(selectedProducts));
    }
  }, [
    dispatch,
    fetchAllProductsInfo.data?.data.data,
    fetchAllProductsInfo.isSuccess,
  ]);

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

  const handleClearAllOptions = () => {
    dispatch(setSelectedProducts([]));
  };

  const isProductDataLoading = useMemo(
    () => fetchAllProductsInfo.isLoading || fetchAllProductsInfo.isRefetching,
    [fetchAllProductsInfo.isLoading, fetchAllProductsInfo.isRefetching]
  );

  const isApplyDisabled = useMemo(
    () => profitabilityUtils.getIsApplyDisabled(filters, headerFilters),
    [filters, headerFilters]
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
    <SyncFilters
      selectedNavTitle={profitabilityUtils.getPnlTable(
        isOrdersTable,
        MarketplaceEnum.AMAZON
      )}
    >
      <TruePNLPageView
        headerFilters={headerFilters}
        rangeOptions={options.range}
        isApplyDisabled={isApplyDisabled}
        onRangeSelect={onRangeSelect}
        setCustomDateRange={setCustomDateRange}
        setFrequency={onFrequencySelect}
        onProductSelect={onProductSelect}
        handleClearAllOptions={handleClearAllOptions}
        handleApply={handleApply}
        currentTable={currentTable as ProfitabilityTableTypeEnum}
        isTableLoading={isTableLoading}
        isOrdersTable={isOrdersTable}
        selectedColumns={columns}
        allTableColumns={allTableColumns}
        tableAccordionExpandedItems={tableAccordionExpandedItems}
        tableData={tableData}
        pagination={pagination}
        totalData={aggregatedData}
        sorting={sorting}
        expandedState={expandedState}
        totalRowCount={totalRowCount}
        tableCalculatedMetrics={tableCalculatedMetrics}
        isProductDataLoading={isProductDataLoading}
        marketplace={MarketplaceEnum.AMAZON}
        handleTableSwitch={handleTableTypeSwitch}
        handleSelectedColumns={setSelectedColumnsHandler}
        handleDownload={handlePnlDownload}
        handleTableDownload={handleTableDownload}
        onTableAccordionMetricsExpand={onTableAccordionMetricsExpand}
        setPagination={setPagination}
        setSorting={setSorting}
        setExpandedState={setExpandedState}
        flatTableData={flatTableData}
        tableColumns={tableColumns}
        pnlExpandedState={pnlExpandedState}
        setPnlExpandedState={setPnlExpandedState}
        isLoading={isGraphLoading}
        uniqueDates={uniqueDates}
      />
    </SyncFilters>
  );
};
