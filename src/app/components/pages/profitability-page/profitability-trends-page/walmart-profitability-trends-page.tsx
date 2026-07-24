import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import dateColumnUtils from '@/app/components/common/dynamic-date-columns/dynamic-date-columns';
import { customRangeFilterOption } from '@/constants';
import { trendsMetricOptions } from '@/constants/profitability/profitability.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IMultiSelectProductSearchDropdownItem } from '@/interfaces/dropdown.interfaces';
import {
  IProfitabilityOrdersData,
  ITrendsTotal,
} from '@/interfaces/profitability/profitability.interface';
import { IDateRange } from '@/interfaces/serp.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectSearchText } from '@/redux/slices/advertising/advertising-filter.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import {
  IProfitabilityFilterForm,
  selectProfitabilityHeaderFilterOptions,
  selectProfitabilityHeaderFilters,
  selectSelectedProducts,
  selectSelectedTrendsMetric,
  setProfitabilityFilterState,
  setSelectedProducts,
  setSelectedTrendsMetric,
} from '@/redux/slices/profitability/profitability.slice';
import { profitabilityHomeService } from '@/services/profitability/profitability-home.service';
import { checkIsEqual } from '@/utils/advertising.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ProfitabilityTrendsPageView from '../../profitability/profitability-trends-page-wrapper/profitability-trends-page-view';

function WalmartProfitabilityTrendsPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectProfitabilityHeaderFilters);
  const options = useAppSelector(selectProfitabilityHeaderFilterOptions);
  const selectedTrendsMetric = useAppSelector(selectSelectedTrendsMetric);
  const searchText = useAppSelector(selectSearchText);
  const selectedProducts = useAppSelector(selectSelectedProducts);

  const [trendsData, setTrendsData] = useState<
    IProfitabilityOrdersData[] | null
  >(null);
  const [trendsTotalData, setTrendsTotalData] = useState<ITrendsTotal[]>([]);
  const [headerFilters, setHeaderFilters] = useState(filters);
  const [selectedMetric, setSelectedMetric] = useState(selectedTrendsMetric);
  const [selectedFrequency, setSelectedFrequency] = useState(filters.frequency);

  const setFilters = useCallback(
    (filters: IProfitabilityFilterForm) =>
      dispatch(setProfitabilityFilterState(filters)),
    [dispatch]
  );

  useEffect(() => {
    setHeaderFilters(filters);
    setSelectedFrequency(filters.frequency);
  }, [filters.frequency]);
  const setCustomDateRange = (customDateRange: IDateRange) => {
    setHeaderFilters((prev) => {
      return {
        ...prev,
        range: customRangeFilterOption,
        customDateRange,
      };
    });
  };

  const onRangeSelect = (range: IDropdownItem<string>) => {
    setHeaderFilters((prev) => {
      return {
        ...prev,
        range,
      };
    });
  };

  const onTrendsMetricSelect = useCallback((value: IDropdownItem<string>) => {
    setSelectedMetric(value);
  }, []);

  const handleDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );
      const data = await profitabilityHomeService
        .getProductSearchPnLData(
          profitabilityUtils.getProductSearchPnLDataPayload(
            filters,
            [],
            0,
            true,
            false,
            searchText
          ),
          []
        )
        .then((res) => {
          dispatch(
            showSuccessToastMessage({
              title: 'Download Completed',
              description: 'Your file downloaded successfully.',
            })
          );

          return res.data.data as unknown as Record<string, unknown>[];
        });

      return data;
    },
    [dispatch, filters, searchText]
  );

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

  const fetchProductsData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_PRODUCT_SEARCH_TRENDS_DATA,
      filters.frequency,
      filters.range,
      filters.customDateRange,
      searchText,
      selectedProducts,
    ],
    queryFn: ({ signal }) => {
      return profitabilityHomeService.getProductSearchPnLData(
        profitabilityUtils.getProductSearchPnLDataPayload(
          filters,
          [],
          0,
          true,
          false,
          searchText
        ),
        profitabilityUtils.formatSelectedProductsForWalmart(selectedProducts),
        signal
      );
    },
    enabled:
      headerFilters.selectedProducts &&
      headerFilters.selectedProducts?.length > 0
        ? true
        : false,
  });

  const fetchProductsTotalData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_PRODUCT_SEARCH_TRENDS_TOTAL_DATA,
      filters,
      searchText,
    ],
    queryFn: ({ signal }) => {
      return profitabilityHomeService.getProductTrendsTotalData(
        profitabilityUtils.getProductTrendsTotalDataPayload(
          filters,
          searchText
        ),
        profitabilityUtils.formatSelectedProductsForWalmart(selectedProducts),
        signal
      );
    },
    enabled:
      headerFilters.selectedProducts &&
      headerFilters.selectedProducts?.length > 0
        ? true
        : false,
  });

  useEffect(() => {
    if (fetchProductsData.isSuccess)
      setTrendsData(fetchProductsData.data.data.data);
    if (fetchProductsData.error !== null) setTrendsData([]);
  }, [
    fetchProductsData.data?.data.data,
    fetchProductsData.error,
    fetchProductsData.isSuccess,
  ]);

  const isLoading = useMemo(
    () => fetchProductsData.isLoading || fetchProductsData.isRefetching,
    [fetchProductsData.isLoading, fetchProductsData.isRefetching]
  );

  useEffect(() => {
    if (fetchProductsTotalData.isSuccess)
      setTrendsTotalData(fetchProductsTotalData.data.data.data);
  }, [
    fetchProductsTotalData.data?.data.data,
    fetchProductsTotalData.isSuccess,
  ]);

  const uniqueDates = useMemo(() => {
    if (!trendsData || trendsData.length === 0) return [];

    return dateColumnUtils.extractUniqueDates(trendsData);
  }, [trendsData]);

  const formattedTrendsData = useMemo(
    () =>
      profitabilityUtils.transformTrendsDataToRows(
        trendsData,
        selectedTrendsMetric.value as keyof IProfitabilityOrdersData,
        uniqueDates
      ),
    [selectedTrendsMetric.value, trendsData, uniqueDates]
  );

  const transformedData = useMemo(() => {
    if (trendsData) {
      return profitabilityUtils.transformToScatterData(trendsData);
    }
  }, [trendsData]);

  const processedChartData = useMemo(() => {
    if (!transformedData || !formattedTrendsData) return null;

    return transformedData.map((item) => {
      const originalItem = formattedTrendsData.find((d) => d.sku === item.sku);
      const yValue = originalItem?.totalValue;

      return {
        x: item.profitMargin,
        y: yValue,
        productName: item.productName,
        asin: originalItem?.id,
        sku: item.sku,
        selectedMetricKey: selectedTrendsMetric.value,
        profitMargin: item.profitMargin,
        imgUrl: item.imgUrl,
        selectedMetricValue: yValue,
      };
    });
  }, [transformedData, formattedTrendsData, selectedTrendsMetric.value]);

  const handleApply = () => {
    dispatch(setSelectedTrendsMetric(selectedMetric));
    setFilters({
      ...headerFilters,
      frequency: profitabilityUtils.getFrequencyByRange(
        headerFilters.range,
        selectedFrequency
      ),
    });
  };
  const isApplyDisabled = useMemo(
    () =>
      profitabilityUtils.getIsApplyDisabled(filters, headerFilters) &&
      checkIsEqual(selectedFrequency, filters.frequency) &&
      checkIsEqual(selectedMetric, selectedTrendsMetric),

    [
      filters,
      headerFilters,
      selectedFrequency,
      selectedMetric,
      selectedTrendsMetric,
    ]
  );

  const onProductSelect = (value: IMultiSelectProductSearchDropdownItem[]) => {
    setHeaderFilters({
      ...headerFilters,
      selectedProducts: value,
    });
  };

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
    <ProfitabilityTrendsPageView
      setSelectedFrequency={setSelectedFrequency}
      selectedMetric={selectedMetric}
      trendsData={formattedTrendsData}
      processedChartData={processedChartData}
      trendsTotalData={trendsTotalData}
      uniqueDates={uniqueDates}
      isDataLoading={isLoading}
      isApplyDisabled={isApplyDisabled}
      metricOptions={trendsMetricOptions}
      rangeOptions={options.range}
      onRangeSelect={onRangeSelect}
      onCustomDateRangeChange={setCustomDateRange}
      onMetricSelect={onTrendsMetricSelect}
      onApply={handleApply}
      onDownload={handleDownload}
      metricKey={selectedTrendsMetric.value}
      onProductSelect={onProductSelect}
      marketplace={MarketplaceEnum.WALMART}
      productInfo={headerFilters.selectedProducts}
      isProductDataLoading={isProductDataLoading}
    />
  );
}

export default WalmartProfitabilityTrendsPage;
