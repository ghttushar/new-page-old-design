import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import dateColumnUtils from '@/app/components/common/dynamic-date-columns/dynamic-date-columns';
import { GenericFlatRowData } from '@/app/components/page-components/profitability/profitability-pnl-table/profitability-pnl-table';
import { customRangeFilterOption, UPDATED_PAGINATION_MODEL } from '@/constants';
import {
  ACCORDION_ROOT_ID,
  calculatedMetricsForWalmartTable,
} from '@/constants/profitability/profitability.constants';
import {
  getAllProfitabilityColumns,
  PNL_PARAMETER,
  PNL_TOTAL,
} from '@/constants/table-columns/profitability-table-columns.constant';
import { ColumnNameEnum, SortOrderEnum } from '@/enums/advertising.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { Frequency, MarketplaceEnum } from '@/enums/serp.enums';
import { useProfitabilityData } from '@/hooks/profitability/use-profitability-data.hook';
import { IMultiSelectProductSearchDropdownItem } from '@/interfaces/dropdown.interfaces';
import {
  IProfitabilityCardMetricDisplay,
  IProfitabilityOrdersData,
  IProfitabilityTableData,
  IProfitabilityTotalResponse,
} from '@/interfaces/profitability/profitability.interface';
import { IDateRange } from '@/interfaces/serp.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { setSearchText } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import {
  IProfitabilityFilterForm,
  selectIsOrdersTable,
  selectProfitabilityHeaderFilterOptions,
  selectProfitabilityHeaderFilters,
  selectSelectedProducts,
  selectSelectedRowData,
  setIsOrdersTable,
  setProfitabilityFilterState,
  setSelectedProducts,
  setSelectedRowData,
} from '@/redux/slices/profitability/profitability.slice';
import { profitabilityHomeService } from '@/services/profitability/profitability-home.service';
import { getUpdatedPagination, hasProperty, parseNum } from '@/utils';
import { getFormattedMetrics } from '@/utils/advertising.utils';
import columnFilterUtils from '@/utils/column-filter.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import { ColumnDef, ExpandedState, SortingState } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TruePNLPageView } from './true-pnl-page-view';

function TruePNLPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectProfitabilityHeaderFilters);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const pnlDefaultFilters = useMemo(
    () => profitabilityUtils.getPnlDefaultFilters(filters),
    [filters]
  );

  const selectedRowData = useAppSelector(selectSelectedRowData);
  const isOrdersTable = useAppSelector(selectIsOrdersTable);
  const selectedProducts = useAppSelector(selectSelectedProducts);
  const options = useAppSelector(selectProfitabilityHeaderFilterOptions);

  const [tableAccordionExpandedItems, setTableAccordionExpandedItems] =
    useState<Set<string>>(profitabilityUtils.getInitialExpandedState());

  const [tableData, setTableData] = useState<IProfitabilityTableData[] | null>(
    null
  );
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [totalData, setTotalData] =
    useState<IProfitabilityTotalResponse | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<
    ColumnDef<IProfitabilityTableData>[]
  >([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: ColumnNameEnum.GMV_COLUMN,
      desc: true,
    },
  ]);
  const [pagination, setPagination] = useState(UPDATED_PAGINATION_MODEL);
  const [expandedState, setExpandedState] = useState<ExpandedState>({});
  const [headerFilters, setHeaderFilters] =
    useState<IProfitabilityFilterForm>(pnlDefaultFilters);

  const [searchedProductPnLData, setSearchedProductPnLData] = useState<
    IProfitabilityOrdersData[]
  >([]);

  const uniqueDates = useMemo(() => {
    if (!searchedProductPnLData || searchedProductPnLData.length === 0)
      return [];

    return searchedProductPnLData
      .map((item) => {
        return profitabilityUtils.getDateLabel(item);
      })
      .filter(
        (date, index, self): date is string =>
          date !== null && self.indexOf(date) === index
      );
  }, [searchedProductPnLData]);

  const fetchAvailableProductsInfo = useAppQuery({
    queryKey: [QueryKeyEnums.FETCH_AVAILABLE_PRODUCTS_DATA],
    queryFn: ({ signal }) => {
      return profitabilityHomeService.getAllProductData(signal);
    },
  });

  useEffect(() => {
    if (fetchAvailableProductsInfo.isSuccess) {
      const response = fetchAvailableProductsInfo.data.data.data;
      const selectedProducts =
        profitabilityUtils.formatAllProductsToMultiSelectItemsForWalmart(
          response
        );
      setHeaderFilters((prev) => ({
        ...prev,
        selectedProducts,
      }));
      dispatch(setSelectedProducts(selectedProducts));
    }
  }, [
    dispatch,
    fetchAvailableProductsInfo.data?.data.data,
    fetchAvailableProductsInfo.isSuccess,
  ]);

  const filteredProducts = useMemo(
    () => profitabilityUtils.formatSelectedProductsForWalmart(selectedProducts),
    [selectedProducts]
  );
  const pnlQueryFn = (signal: AbortSignal) => {
    const payload = profitabilityUtils.getAllSearchedProductPnLDataPayload(
      filters,
      appliedFilters,
      SortOrderEnum.DESC
    );

    if (filteredProducts.length > 0)
      return profitabilityHomeService.getAllSearchedProductPnLData(
        payload,
        signal,
        filteredProducts
      );
    return profitabilityHomeService.getPnLSummaryData(payload, signal);
  };
  const fetchAllSearchedProductPnLData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_PROFITABILITY_SEARCHED_PNL_TABLE_DATA,
      filteredProducts,
      filters.frequency,
      filters.range,
      filters.customDateRange,
    ],
    queryFn: ({ signal }) => {
      return pnlQueryFn(signal);
    },
  });

  useEffect(() => {
    if (fetchAllSearchedProductPnLData.isSuccess) {
      setSearchedProductPnLData(fetchAllSearchedProductPnLData.data.data.data);
    }
  }, [
    fetchAllSearchedProductPnLData.isSuccess,
    fetchAllSearchedProductPnLData.data,
  ]);

  const isPnLLoading = useMemo(
    () =>
      fetchAllSearchedProductPnLData.isLoading ||
      fetchAllSearchedProductPnLData.isRefetching,
    [
      fetchAllSearchedProductPnLData.isLoading,
      fetchAllSearchedProductPnLData.isRefetching,
    ]
  );

  const transformPnLDataToFlat = useCallback((): GenericFlatRowData[] => {
    const accordionData = profitabilityUtils
      .transformPnLDataToAccordion(searchedProductPnLData, uniqueDates)
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
  }, [searchedProductPnLData, uniqueDates]);

  const flatTableData = useMemo(
    () => transformPnLDataToFlat(),
    [transformPnLDataToFlat]
  );

  useEffect(() => {
    setExpandedState(
      profitabilityUtils.getPNLInitialExpandedState(flatTableData)
    );
  }, [flatTableData]);

  const tableColumns: ColumnDef<GenericFlatRowData>[] = useMemo(() => {
    const columns: ColumnDef<GenericFlatRowData>[] = [
      PNL_PARAMETER as ColumnDef<GenericFlatRowData>,
    ];

    const dateColumns = dateColumnUtils.createDateColumns<GenericFlatRowData>(
      uniqueDates,
      isPnLLoading,
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
  }, [isPnLLoading, uniqueDates, filters.frequency.value]);

  const setFilters = useCallback(
    (filters: IProfitabilityFilterForm) =>
      dispatch(setProfitabilityFilterState(filters)),
    [dispatch]
  );

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IProfitabilityTableData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(currentTable, selectedColumns);
    setSelectedColumns(selectedColumns);
  };

  const allTableColumns = useMemo(
    () => getAllProfitabilityColumns(isOrdersTable, false),
    [isOrdersTable]
  );

  const onRangeSelect = (range: IDropdownItem<string>) => {
    setHeaderFilters((prev) => {
      return {
        ...prev,
        range,
        frequency: profitabilityUtils.getFrequencyByRange(range),
      };
    });
  };
  const setCustomDateRange = (customDateRange: IDateRange) => {
    setHeaderFilters((prev) => {
      return {
        ...prev,
        range: customRangeFilterOption,
        customDateRange,
      };
    });
  };

  const setTableAccordionData = (payload: IProfitabilityTableData | null) => {
    dispatch(
      setSelectedRowData({
        index: null,
        rowData: payload,
      })
    );
  };

  const { isTableLoading, currentTable, handleDownload } = useProfitabilityData(
    {
      pagination,
      setExpandedState,
      allTableColumns,
      setSelectedColumns,
      setTableAccordionData,
      setTableData,
      setTotalData,
      sorting,
      setTotalRowCount,
      isPnL: true,
    }
  );

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

  const onFrequencySelect = (value: IDropdownItem<Frequency>) => {
    setHeaderFilters((prev) => {
      return {
        ...prev,
        frequency: profitabilityUtils.getFrequencyByRange(prev.range, value),
      };
    });
  };

  const handleTableTypeSwitch = () => {
    dispatch(setSearchText(''));
    setSelectedColumns([]);
    dispatch(setIsOrdersTable(!isOrdersTable));
    setTableAccordionData(null);
  };

  const handlePaginationReset = useCallback(
    () => setPagination(getUpdatedPagination),
    []
  );

  const handleApply = () => {
    setFilters(headerFilters);
    handlePaginationReset();
  };

  const handlePnlData = (isAllDownload: boolean) => {
    return handleDownload(false, isAllDownload);
  };

  const handleTableDownload = (isAllDownload: boolean) => {
    return handleDownload(true, isAllDownload);
  };

  const handleClearAllOptions = () => {
    dispatch(setSelectedProducts([]));
  };

  const onProductSelect = (value: IMultiSelectProductSearchDropdownItem[]) => {
    setHeaderFilters({
      ...headerFilters,
      selectedProducts: value,
    });
  };

  const tableCalculatedMetrics: IProfitabilityCardMetricDisplay[] =
    useMemo(() => {
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

  const isApplyDisabled = useMemo(
    () => profitabilityUtils.getIsApplyDisabled(filters, headerFilters),
    [filters, headerFilters]
  );

  const isProductDataLoading = useMemo(
    () =>
      fetchAvailableProductsInfo.isLoading ||
      fetchAvailableProductsInfo.isRefetching,
    [
      fetchAvailableProductsInfo.isLoading,
      fetchAvailableProductsInfo.isRefetching,
    ]
  );

  return (
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
      currentTable={currentTable}
      isTableLoading={isTableLoading}
      isOrdersTable={isOrdersTable}
      selectedColumns={selectedColumns}
      allTableColumns={allTableColumns}
      tableAccordionExpandedItems={tableAccordionExpandedItems}
      tableData={tableData}
      pagination={pagination}
      totalData={totalData}
      sorting={sorting}
      expandedState={expandedState}
      totalRowCount={totalRowCount}
      tableCalculatedMetrics={tableCalculatedMetrics}
      isProductDataLoading={isProductDataLoading}
      marketplace={MarketplaceEnum.WALMART}
      handleTableSwitch={handleTableTypeSwitch}
      handleSelectedColumns={setSelectedColumnsHandler}
      handleDownload={handlePnlData}
      handleTableDownload={handleTableDownload}
      onTableAccordionMetricsExpand={onTableAccordionMetricsExpand}
      setPagination={setPagination}
      setSorting={setSorting}
      setExpandedState={setExpandedState}
      flatTableData={flatTableData}
      tableColumns={tableColumns}
      pnlExpandedState={expandedState}
      setPnlExpandedState={setExpandedState}
      isLoading={isPnLLoading}
      uniqueDates={uniqueDates}
    />
  );
}

export default TruePNLPage;
