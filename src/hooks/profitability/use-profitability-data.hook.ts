import { SortOrderEnum } from '@/enums/advertising.enums';
import { ProfitabilityTableTypeEnum } from '@/enums/profitability.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum, Range } from '@/enums/serp.enums';
import {
  IProfitabilityOrdersData,
  IProfitabilityPerformanceMetrics,
  IProfitabilityTableData,
  IProfitabilityTotalResponse,
  ITotalProductData,
} from '@/interfaces/profitability/profitability.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectSearchText } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import {
  selectActivePerformanceBox,
  selectIsOrdersTable,
  selectProfitabilityHeaderFilters,
  selectSelectedProducts,
  setActivePerformanceBox,
} from '@/redux/slices/profitability/profitability.slice';
import { profitabilityHomeService } from '@/services/profitability/profitability-home.service';
import { convertGraphLabelByFrequency } from '@/utils';
import columnFilterUtils from '@/utils/column-filter.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import {
  ColumnDef,
  ExpandedState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo } from 'react';

interface IProfitabilityDataProps {
  pagination: PaginationState;
  sorting: SortingState;
  allTableColumns: Array<ColumnDef<IProfitabilityTableData>>;
  setTableAccordionData: (payload: IProfitabilityTableData | null) => void;
  setTableData: (data: IProfitabilityTableData[] | null) => void;
  setSelectedColumns: (
    columns: Array<ColumnDef<IProfitabilityTableData>>
  ) => void;
  setExpandedState: (state: ExpandedState) => void;
  setTotalData: (
    data: IProfitabilityTotalResponse | ITotalProductData | null
  ) => void;
  setChartData?: (data: IProfitabilityOrdersData[]) => void;
  setPerformanceData?: (
    data: Array<IProfitabilityPerformanceMetrics | null>
  ) => void;
  setTotalRowCount: (count: number) => void;
  isPnL?: boolean;
}

interface IProfitabilityDataReturn {
  isGraphLoading: boolean;
  isPerformanceLoading: boolean;
  isTableLoading: boolean;
  currentTable: ProfitabilityTableTypeEnum;
  handleDownload: (
    isTable: boolean,
    isAllDownload: boolean
  ) => Promise<Array<Record<string, unknown>>>;
}

export const useProfitabilityData = ({
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
  isPnL = false,
}: IProfitabilityDataProps): IProfitabilityDataReturn => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectProfitabilityHeaderFilters);
  const activePerformanceBox = useAppSelector(selectActivePerformanceBox);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const searchText = useAppSelector(selectSearchText);
  const isOrdersTable = useAppSelector(selectIsOrdersTable);
  const selectedProducts = useAppSelector(selectSelectedProducts);

  const currentTable = profitabilityUtils.getCurrentTableByMarketplace(
    isPnL,
    isOrdersTable,
    MarketplaceEnum.WALMART
  );

  const fetchProfitabilityGraphData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_PROFITABILITY_GRAPH_DATA,
      filters.frequency,
      filters.range,
      filters.customDateRange,
      filters.customDateRanges,
      {
        activePerformanceBox,
      },
    ],
    queryFn: ({ signal }) => {
      setTableAccordionData(null);

      return profitabilityHomeService.getAllSearchedProductPnLData(
        {
          ...profitabilityUtils.getGraphDataPayload(
            filters,
            activePerformanceBox
          ),
          sortOrder: SortOrderEnum.ASC,
        },
        signal
      );
    },
    enabled: !isPnL && setChartData !== undefined,
  });

  const fetchProfitabilityPerformanceData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_PROFITABILITY_PERFORMANCE_DATA,
      filters.range,
      filters.customDateRange,
      filters.customDateRanges,
    ],
    queryFn: ({ signal }) => {
      if (profitabilityUtils.checkIsCustomRange(filters.range)) {
        const customRangeCount = filters.range.value
          .split('/')
          .filter((r) => r === Range.CUSTOM_RANGE).length;

        if (
          customRangeCount === 1 &&
          filters.range.value.split('/')[0] === Range.CUSTOM_RANGE
        ) {
          dispatch(setActivePerformanceBox(0));
        }
      }

      return profitabilityHomeService.getPerformanceData(
        profitabilityUtils.getPerformanceDataPayload(
          filters,
          activePerformanceBox
        ),
        signal
      );
    },
    enabled: !isPnL && setPerformanceData !== undefined,
  });

  const fetchProfitabilityOrdersTableData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_PROFITABILITY_ORDERS_TABLE_DATA,
      filters.range,
      filters.customDateRange,
      {
        sorting,
        activePerformanceBox,
        appliedFilters,
        pagination,
        searchText,
        isOrdersTable,
      },
    ],
    queryFn: ({ signal }) => {
      setTableAccordionData(null);
      setExpandedState({});

      const filteredColumns =
        columnFilterUtils.getStoredColumnFilters(currentTable);
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<IProfitabilityTableData>>
      );

      return profitabilityHomeService.getOrdersTableData(
        profitabilityUtils.getWalmartProfitabilityTableDataPayload(
          filters,
          appliedFilters,
          pagination.pageIndex + 1,
          pagination.pageSize,
          activePerformanceBox,
          columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
            allTableColumns,
            sorting
          ),
          searchText,
          ProfitabilityTableTypeEnum.ORDERS
        ),
        false,
        false,
        signal
      );
    },
    enabled: isOrdersTable === true,
  });

  const fetchProfitabilityProductsData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_PROFITABILITY_PRODUCTS_TABLE_DATA,
      filters.range,
      filters.customDateRange,
      {
        sorting,
        activePerformanceBox,
        appliedFilters,
        pagination,
        searchText,
        isOrdersTable,
      },
    ],
    queryFn: ({ signal }) => {
      setTableAccordionData(null);
      const filteredColumns =
        columnFilterUtils.getStoredColumnFilters(currentTable);
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<IProfitabilityTableData>>
      );

      return profitabilityHomeService.getProductsData(
        profitabilityUtils.getWalmartProfitabilityTableDataPayload(
          filters,
          appliedFilters,
          pagination.pageIndex + 1,
          pagination.pageSize,
          activePerformanceBox,
          columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
            allTableColumns,
            sorting
          ),
          searchText,
          ProfitabilityTableTypeEnum.PRODUCTS
        ),
        false,
        false,
        signal
      );
    },
    enabled: isOrdersTable === false,
  });

  const getOrdersTableData = useCallback(
    async (isDownload = false, isAllDownload = false, signal?: AbortSignal) => {
      const res = profitabilityHomeService
        .getOrdersTableData(
          profitabilityUtils.getWalmartProfitabilityTableDataPayload(
            filters,
            appliedFilters,
            pagination.pageIndex + 1,
            pagination.pageSize,
            activePerformanceBox,
            columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
              allTableColumns,
              sorting
            ),
            searchText,
            ProfitabilityTableTypeEnum.ORDERS
          ),
          isDownload,
          !isAllDownload,
          signal
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row) => {
            const id = `${row.purchaseOrderId}`;
            return {
              id,
              ...row,
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Campaigns downloaded successfully.',
            })
          );
          return data;
        });

      return res;
    },
    [
      activePerformanceBox,
      allTableColumns,
      appliedFilters,
      dispatch,
      filters,
      pagination.pageIndex,
      pagination.pageSize,
      searchText,
      sorting,
    ]
  );

  const getProductsTableData = useCallback(
    async (isDownload = false, isAllDownload = false, signal?: AbortSignal) => {
      const res = profitabilityHomeService
        .getProductsData(
          profitabilityUtils.getWalmartProfitabilityTableDataPayload(
            filters,
            appliedFilters,
            pagination.pageIndex + 1,
            pagination.pageSize,
            activePerformanceBox,
            columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
              allTableColumns,
              sorting
            ),
            searchText,
            ProfitabilityTableTypeEnum.PRODUCTS
          ),
          isDownload,
          !isAllDownload,
          signal
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row) => {
            const id = `${row.purchaseOrderItemId}`;
            return {
              id,
              ...row,
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Campaigns downloaded successfully.',
            })
          );
          return data;
        });

      return res;
    },
    [
      activePerformanceBox,
      allTableColumns,
      appliedFilters,
      dispatch,
      filters,
      pagination.pageIndex,
      pagination.pageSize,
      searchText,
      sorting,
    ]
  );

  const getPnLSummaryData = useCallback(
    async (isDownload = false, isAllDownload = false, signal?: AbortSignal) => {
      const res = profitabilityHomeService
        .getPnLSummaryData(
          profitabilityUtils.getPnLSummaryDataPayload(filters, []),
          signal
        )
        .then((res) => {
          let data = res.data?.data;
          data = data.map((row) => {
            const id = `${row.orderDateLabel}`;
            return {
              id,
              ...row,
              dateLabel: convertGraphLabelByFrequency(
                row.orderDateLabel,
                filters.frequency.value
              ),
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Campaigns downloaded successfully.',
            })
          );
          return data;
        });

      return res;
    },
    [dispatch, filters]
  );

  const getPnLSearchedData = useCallback(
    async (isDownload = false, isAllDownload = false, signal?: AbortSignal) => {
      const res = profitabilityHomeService
        .getAllSearchedProductPnLData(
          profitabilityUtils.getAllSearchedProductPnLDataPayload(
            filters,
            appliedFilters
          ),
          signal,
          profitabilityUtils.formatSelectedProductsForWalmart(selectedProducts)
        )
        .then((res) => {
          let data = res.data?.data;
          data = data.map((row) => {
            const id = `${row.orderDateLabel}`;
            return {
              id,
              ...row,
              orderDateLabel: convertGraphLabelByFrequency(
                row.orderDateLabel,
                filters.frequency.value
              ),
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Campaigns downloaded successfully.',
            })
          );
          return data;
        });

      return res;
    },
    [appliedFilters, dispatch, filters, selectedProducts]
  );

  const getDownloadData = useCallback(
    (isTable: boolean, isDownload: boolean, isAllDownload: boolean) => {
      const filteredProducts =
        profitabilityUtils.formatSelectedProductsForWalmart(selectedProducts);
      return isTable === false
        ? filteredProducts?.length > 0
          ? getPnLSearchedData(isDownload, isAllDownload)
          : getPnLSummaryData(isDownload, isAllDownload)
        : isOrdersTable === true
        ? getOrdersTableData(isDownload, isAllDownload)
        : getProductsTableData(isDownload, isAllDownload);
    },
    [
      getOrdersTableData,
      getPnLSearchedData,
      getPnLSummaryData,
      getProductsTableData,
      isOrdersTable,
      selectedProducts,
    ]
  );

  const handleDownload = useCallback(
    async (isTable: boolean, isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const data: Record<string, unknown>[] = (await getDownloadData(
        isTable,
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getDownloadData]
  );

  const fetchProfitabilityTotalOrdersTableData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_PROFITABILITY_TOTAL_TABLE_DATA,
      filters.range,
      filters.customDateRange,
      {
        activePerformanceBox,
        appliedFilters,
        searchText,
        isOrdersTable,
      },
    ],
    queryFn: ({ signal }) => {
      setTotalData(null);
      return profitabilityHomeService.getTotalOrderData(
        profitabilityUtils.getWalmartProfitabilityTableDataPayload(
          filters,
          appliedFilters,
          pagination.pageIndex + 1,
          pagination.pageSize,
          activePerformanceBox,
          columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
            allTableColumns,
            sorting
          ),
          searchText,
          ProfitabilityTableTypeEnum.ORDERS
        ),
        signal
      );
    },
    enabled: isOrdersTable === true,
  });

  const fetchProfitabilityTotalProductsData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_PROFITABILITY_TOTAL_PRODUCTS_DATA,
      filters.range,
      filters.customDateRange,
      {
        activePerformanceBox,
        appliedFilters,
        searchText,
        isOrdersTable,
      },
    ],
    queryFn: ({ signal }) => {
      setTotalData(null);
      return profitabilityHomeService.getTotalProductData(
        profitabilityUtils.getWalmartProfitabilityTableDataPayload(
          filters,
          appliedFilters,
          pagination.pageIndex + 1,
          pagination.pageSize,
          activePerformanceBox,
          columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
            allTableColumns,
            sorting
          ),
          searchText,
          ProfitabilityTableTypeEnum.ORDERS
        ),
        signal
      );
    },
    enabled: isOrdersTable === false,
  });

  const isGraphLoading = useMemo(
    () =>
      fetchProfitabilityGraphData.isLoading ||
      fetchProfitabilityGraphData.isRefetching,
    [
      fetchProfitabilityGraphData.isLoading,
      fetchProfitabilityGraphData.isRefetching,
    ]
  );

  const isPerformanceLoading = useMemo(
    () =>
      fetchProfitabilityPerformanceData.isLoading ||
      fetchProfitabilityPerformanceData.isRefetching,
    [
      fetchProfitabilityPerformanceData.isLoading,
      fetchProfitabilityPerformanceData.isRefetching,
    ]
  );

  const isTableLoading = useMemo(
    () =>
      fetchProfitabilityOrdersTableData.isLoading ||
      fetchProfitabilityOrdersTableData.isRefetching ||
      fetchProfitabilityProductsData.isLoading ||
      fetchProfitabilityProductsData.isRefetching,
    [
      fetchProfitabilityOrdersTableData.isLoading,
      fetchProfitabilityOrdersTableData.isRefetching,
      fetchProfitabilityProductsData.isLoading,
      fetchProfitabilityProductsData.isRefetching,
    ]
  );

  useEffect(() => {
    if (setChartData === undefined) return;
    setChartData([]);
    if (fetchProfitabilityGraphData.isSuccess) {
      setChartData(fetchProfitabilityGraphData.data.data.data);
    }
  }, [
    fetchProfitabilityGraphData.data?.data.data,
    fetchProfitabilityGraphData.isSuccess,
    setChartData,
  ]);

  useEffect(() => {
    if (fetchProfitabilityPerformanceData.isSuccess && setPerformanceData) {
      setPerformanceData(fetchProfitabilityPerformanceData.data.data.data);
    }
  }, [fetchProfitabilityPerformanceData.data]);

  useEffect(() => {
    if (fetchProfitabilityOrdersTableData.isSuccess) {
      const response = fetchProfitabilityOrdersTableData.data.data.data;
      const data = response.data;
      setTableData(profitabilityUtils.groupProfitabilityOrdersTableData(data));
    }
  }, [fetchProfitabilityOrdersTableData.data]);

  useEffect(() => {
    if (fetchProfitabilityProductsData.isSuccess) {
      const response = fetchProfitabilityProductsData.data.data.data;
      const data = response.data;
      setTableData(data);
      setTotalRowCount(Number(response.pagination.totalItems) || 0);
    }
  }, [fetchProfitabilityProductsData.data]);

  useEffect(() => {
    if (fetchProfitabilityTotalOrdersTableData.isSuccess) {
      const response = fetchProfitabilityTotalOrdersTableData.data.data.data;
      setTotalData(response.data);
      if (isOrdersTable)
        setTotalRowCount(Number(response.pagination.totalItems));
    }
  }, [fetchProfitabilityTotalOrdersTableData.data]);

  useEffect(() => {
    if (fetchProfitabilityTotalProductsData.isSuccess) {
      const response = fetchProfitabilityTotalProductsData.data.data.data;
      setTotalData(response.data);
      setTotalRowCount(Number(response.pagination.totalItems));
    }
  }, [fetchProfitabilityTotalProductsData.data]);

  return {
    isGraphLoading,
    isPerformanceLoading,
    isTableLoading,
    currentTable,
    handleDownload,
  };
};
