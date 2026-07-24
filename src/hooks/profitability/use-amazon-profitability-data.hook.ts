import { ProfitabilityTableTypeEnum } from '@/enums/profitability.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum, Range } from '@/enums/serp.enums';
import {
  IAmazonPerformanceMetrics,
  IAmazonProfitabilityDataProps,
  IAmazonProfitabilityDataReturn,
  IAmazonProfitabilityOrder,
  IAmazonProfitabilityProductData,
  IAmazonProfitabilityTableData,
} from '@/interfaces/profitability/amazon-profitability.interface';
import { IAPIResponse } from '@/interfaces/service.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectSearchText } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import {
  selectActivePerformanceBox,
  selectProfitabilityHeaderFilters,
  selectSelectedProducts,
  setActivePerformanceBox,
} from '@/redux/slices/profitability/profitability.slice';
import { amazonProfitabilityService } from '@/services/profitability/amazon-profitability.service';
import { flattenData, generateNItems } from '@/utils';
import columnFilterUtils from '@/utils/column-filter.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import { ColumnDef } from '@tanstack/react-table';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useMemo } from 'react';

export const useAmazonProfitabilityData = ({
  pagination,
  sorting,
  allTableColumns,
  setTableData,
  setSelectedColumns,
  setTotalRowCount,
  setExpandedState,
  isOrdersTable,
  setPerformanceData,
  setAggregatedData,
  setChartData,
  isPnL = false,
  disablePerformance = false,
}: IAmazonProfitabilityDataProps): IAmazonProfitabilityDataReturn => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectProfitabilityHeaderFilters);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const searchText = useAppSelector(selectSearchText);
  const activePerformanceBox = useAppSelector(selectActivePerformanceBox);
  const selectedProducts = useAppSelector(selectSelectedProducts);

  const currentTable = profitabilityUtils.getCurrentTableByMarketplace(
    isPnL,
    isOrdersTable,
    MarketplaceEnum.AMAZON
  );

  const fetchAmazonOrdersTableData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_AMAZON_PROFITABILITY_ORDERS_TABLE_DATA,
      filters.range,
      filters.customDateRange,
      {
        activePerformanceBox,
        sorting,
        appliedFilters,
        pagination,
        searchText,
        isOrdersTable,
      },
    ],
    queryFn: ({ signal }) => {
      setExpandedState({});
      setTableData(null);
      const filteredColumns =
        columnFilterUtils.getStoredColumnFilters(currentTable);
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<IAmazonProfitabilityTableData>>
      );

      return amazonProfitabilityService.getOrdersTableData(
        profitabilityUtils.getAmazonProfitabilityTableDataPayload(
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
          currentTable
        ),
        signal
      );
    },
    enabled: isOrdersTable,
  });
  const fetchAmazonOrdersAggregatedData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_AMAZON_PROFITABILITY_ORDERS_AGGREGATED_DATA,
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
      return amazonProfitabilityService.getOrdersAggregatedData(
        profitabilityUtils.getAmazonProfitabilityTableDataPayload(
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
          currentTable
        ),
        signal
      );
    },
    enabled: isOrdersTable,
  });

  const getOrdersTableData = useCallback(
    async (isDownload = false, isAllDownload = false, signal?: AbortSignal) => {
      const res = amazonProfitabilityService
        .getOrdersTableData(
          profitabilityUtils.getAmazonProfitabilityTableDataPayload(
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
            currentTable,
            isDownload,
            isAllDownload
          ),
          signal
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row: IAmazonProfitabilityOrder) => {
            const id = `${row.orderId}`;
            return {
              id,
              ...row,
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Orders downloaded successfully.',
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
  const fetchAmazonProductsTableData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_AMAZON_PROFITABILITY_PRODUCTS_TABLE_DATA,
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
      setExpandedState({});
      setTableData(null);

      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        ProfitabilityTableTypeEnum.AMAZON_PRODUCTS
      );
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<IAmazonProfitabilityTableData>>
      );

      return amazonProfitabilityService.getProductsTableData(
        profitabilityUtils.getAmazonProfitabilityTableDataPayload(
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
          ProfitabilityTableTypeEnum.AMAZON_PRODUCTS
        ),
        signal
      );
    },
    enabled: isOrdersTable === false,
  });
  const fetchAmazonProductsAggregatedData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_AMAZON_PROFITABILITY_PRODUCTS_AGGREGATED_DATA,
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
      return amazonProfitabilityService.getProductsAggregatedTableData(
        profitabilityUtils.getAmazonProfitabilityTableDataPayload(
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
          ProfitabilityTableTypeEnum.AMAZON_PRODUCTS
        ),
        signal
      );
    },
    enabled: isOrdersTable === false,
  });

  const getProductsTableData = useCallback(
    async (isDownload = false, isAllDownload = false, signal?: AbortSignal) => {
      const res = amazonProfitabilityService
        .getProductsTableData(
          profitabilityUtils.getAmazonProfitabilityTableDataPayload(
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
            ProfitabilityTableTypeEnum.AMAZON_PRODUCTS,
            isDownload,
            isAllDownload
          ),
          signal
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row: IAmazonProfitabilityProductData) => {
            const id = `${row.asin}`;
            return {
              id,
              ...row,
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Orders downloaded successfully.',
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
      pagination,
      searchText,
      sorting,
    ]
  );

  const fetchProfitabilityPerformanceData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_AMAZON_PROFITABILITY_PERFORMANCE_DATA,
      filters.range,
      filters.customDateRange,
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

      return amazonProfitabilityService.getPerformanceData(
        profitabilityUtils.getPerformanceDataPayload(
          filters,
          activePerformanceBox
        ),
        signal
      );
    },
    enabled: setPerformanceData !== undefined && disablePerformance === false,
    options: {
      select(
        data: AxiosResponse<IAPIResponse<IAmazonPerformanceMetrics[]>, any>
      ) {
        const response = data.data.data;
        const formattedResponse = generateNItems(4, null).map(
          (value, index) => response[index] ?? value
        );
        return {
          ...data,
          data: {
            ...data.data,
            data: formattedResponse,
          },
        };
      },
    },
  });

  useEffect(() => {
    if (
      fetchProfitabilityPerformanceData.data?.data.data &&
      setPerformanceData
    ) {
      setPerformanceData(fetchProfitabilityPerformanceData.data.data.data);
    }
  }, [fetchProfitabilityPerformanceData.data?.data.data, setPerformanceData]);

  const isPerformanceLoading = useMemo(
    () =>
      fetchProfitabilityPerformanceData.isLoading ||
      fetchProfitabilityPerformanceData.isRefetching,
    [
      fetchProfitabilityPerformanceData.isLoading,
      fetchProfitabilityPerformanceData.isRefetching,
    ]
  );

  const fetchProfitabilityGraphData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_AMAZON_PROFITABILITY_GRAPH_DATA,
      filters.range,
      filters.customDateRange,
      activePerformanceBox,
      filters.frequency,
      selectedProducts,
      isPnL,
    ],
    queryFn: ({ signal }) => {
      return amazonProfitabilityService.getGraphData(
        profitabilityUtils.getGraphDataPayload(
          filters,
          activePerformanceBox,
          isPnL,
          selectedProducts
        ),
        signal
      );
    },
    // enabled: isPnL ? selectedProducts?.length !== 0 : true,
  });

  useEffect(() => {
    if (setChartData === undefined) return;
    setChartData([]);
    if (
      fetchProfitabilityGraphData.isSuccess &&
      fetchProfitabilityGraphData.data?.data.data
    ) {
      setChartData(fetchProfitabilityGraphData.data.data.data);
    }
  }, [
    fetchProfitabilityGraphData.data?.data.data,
    fetchProfitabilityGraphData.isSuccess,
    setChartData,
  ]);

  const isGraphLoading = useMemo(
    () =>
      fetchProfitabilityGraphData.isLoading ||
      fetchProfitabilityGraphData.isRefetching,
    [
      fetchProfitabilityGraphData.isLoading,
      fetchProfitabilityGraphData.isRefetching,
    ]
  );

  const getPnLData = useCallback(async () => {
    const res = amazonProfitabilityService
      .getGraphData(
        profitabilityUtils.getGraphDataPayload(
          filters,
          activePerformanceBox,
          isPnL,
          selectedProducts
        )
      )
      .then((res) => {
        dispatch(
          showSuccessToastMessage({
            title: 'Downloaded Successfully',
            description: 'PnL Data downloaded successfully.',
          })
        );
        return res.data.data;
      });

    return res;
  }, [activePerformanceBox, dispatch, filters, isPnL, selectedProducts]);

  const handleDownload = useCallback(
    async (isAllDownload: boolean, isPnL: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );
      if (isPnL)
        return (await getPnLData()) as unknown as Record<string, unknown>[];
      const ordersData = getOrdersTableData(true, isAllDownload);
      const productsData = getProductsTableData(true, isAllDownload);

      const data = (await (isOrdersTable
        ? ordersData
        : productsData)) as Record<string, any>;

      const flatData = flattenData(data);

      return flatData;
    },
    [
      dispatch,
      getOrdersTableData,
      getPnLData,
      getProductsTableData,
      isOrdersTable,
    ]
  );

  const isTableLoading = useMemo(
    () =>
      fetchAmazonOrdersTableData.isLoading ||
      fetchAmazonOrdersTableData.isRefetching ||
      fetchAmazonProductsTableData.isLoading ||
      fetchAmazonProductsTableData.isRefetching,
    [
      fetchAmazonOrdersTableData.isLoading,
      fetchAmazonOrdersTableData.isRefetching,
      fetchAmazonProductsTableData.isLoading,
      fetchAmazonProductsTableData.isRefetching,
    ]
  );

  useEffect(() => {
    if (
      fetchAmazonOrdersTableData.isSuccess &&
      fetchAmazonOrdersTableData.data
    ) {
      const response = fetchAmazonOrdersTableData.data.data.data;
      const data = response.data;
      setTableData(data);
      setTotalRowCount(Number(response.pagination.totalItems) || 0);
    }
  }, [fetchAmazonOrdersTableData.data]);

  useEffect(() => {
    if (fetchAmazonProductsTableData.isSuccess) {
      const response = fetchAmazonProductsTableData.data.data.data;
      const data = response.data;
      setTableData(data);
      setTotalRowCount(Number(response.pagination.totalItems) || 0);
    }
  }, [fetchAmazonProductsTableData.data]);

  useEffect(() => {
    if (fetchAmazonProductsAggregatedData.isSuccess) {
      const response = fetchAmazonProductsAggregatedData.data.data;
      const data = response.data[0];
      setAggregatedData(data);
    }
  }, [fetchAmazonProductsAggregatedData.data]);
  useEffect(() => {
    if (fetchAmazonOrdersAggregatedData.isSuccess) {
      const response = fetchAmazonOrdersAggregatedData.data.data;
      const data = response.data[0];
      setAggregatedData(data);
    }
  }, [fetchAmazonOrdersAggregatedData.data]);

  return {
    isTableLoading,
    handleDownload,
    currentTable,
    isPerformanceLoading,
    isGraphLoading,
  };
};
