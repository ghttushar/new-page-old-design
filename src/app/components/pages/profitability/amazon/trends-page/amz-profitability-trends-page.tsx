import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import dateColumnUtils from '@/app/components/common/dynamic-date-columns/dynamic-date-columns';
import { IProfitabilityTrendsTableRow } from '@/app/components/page-components/profitability/profitability-trends-table/profitability-trends-table';
import { customRangeFilterOption } from '@/constants';
import { AMAZON_TRENDS_METRIC_OPTIONS } from '@/constants/profitability/profitability.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IMultiSelectProductSearchDropdownItem } from '@/interfaces/dropdown.interfaces';
import { IAmazonProfitabilityGraphResponse } from '@/interfaces/profitability/amazon-profitability.interface';
import { IDateRange } from '@/interfaces/serp.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectSearchText } from '@/redux/slices/advertising/advertising-filter.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import {
  IProfitabilityFilterForm,
  selectProfitabilityHeaderFilterOptions,
  selectProfitabilityHeaderFilters,
  selectSelectedTrendsMetric,
  setProfitabilityFilterState,
  setSelectedProducts,
  setSelectedTrendsMetric,
} from '@/redux/slices/profitability/profitability.slice';
import { amazonProfitabilityService } from '@/services/profitability/amazon-profitability.service';
import { checkIsEqual } from '@/utils/advertising.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ProfitabilityTrendsPageView from '../../profitability-trends-page-wrapper/profitability-trends-page-view';

export const AmzProfitabilityTrendsPage = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectProfitabilityHeaderFilters);
  const options = useAppSelector(selectProfitabilityHeaderFilterOptions);
  const selectedTrendsMetric = useAppSelector(selectSelectedTrendsMetric);
  const searchText = useAppSelector(selectSearchText);

  const [trendsData, setTrendsData] = useState<
    IAmazonProfitabilityGraphResponse[] | null
  >(null);
  const [trendsTotalData, setTrendsTotalData] = useState<
    IAmazonProfitabilityGraphResponse[]
  >([]);
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
        customDateRanges: [],
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
      const data = await amazonProfitabilityService
        .getGraphData({
          ...profitabilityUtils.getGraphDataPayload(filters, 0, false),
          asinSkuGroupBy: true,
          isDownload: true,
          downloadWithFilter: !isAllDownload,
        })
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
    [dispatch, filters]
  );

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

  const fetchTrendsData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_AMAZON_PROFITABILITY_TRENDS_DATA,
      filters.frequency,
      filters.range,
      filters.customDateRange,
      filters.selectedProducts,
      searchText,
    ],
    queryFn: ({ signal }) => {
      return amazonProfitabilityService.getGraphData(
        {
          ...profitabilityUtils.getGraphDataPayload(filters, 0, false),
          asinSkuGroupBy: true,
          asinSkuMapping:
            profitabilityUtils.formatSelectedProductsToAsinSKUMap(
              filters.selectedProducts
            ) ?? [],
        },

        signal
      );
    },
  });

  useEffect(() => {
    if (fetchTrendsData.isSuccess)
      setTrendsData(fetchTrendsData.data.data.data);
    if (fetchTrendsData.error !== null) setTrendsData([]);
  }, [
    fetchTrendsData.data?.data.data,
    fetchTrendsData.error,
    fetchTrendsData.isSuccess,
  ]);

  const isLoading = useMemo(
    () => fetchTrendsData.isLoading || fetchTrendsData.isRefetching,
    [fetchTrendsData.isLoading, fetchTrendsData.isRefetching]
  );

  const uniqueDates = useMemo(() => {
    if (!trendsData || trendsData.length === 0) return [];

    return dateColumnUtils.extractUniqueDates(trendsData);
  }, [trendsData]);

  const formattedTrendsData = useMemo(
    () =>
      profitabilityUtils.transformTrendsDataToRows(
        trendsData,
        selectedTrendsMetric.value as keyof IAmazonProfitabilityGraphResponse,
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
        selectedMetricKey:
          selectedTrendsMetric.value as keyof IAmazonProfitabilityGraphResponse,
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

  const fetchTrendsTotalData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_AMAZON_PROFITABILITY_TRENDS_TOTAL_DATA,
      filters.frequency,
      filters.range,
      filters.customDateRange,
      filters.selectedProducts,
      searchText,
    ],
    queryFn: ({ signal }) => {
      return amazonProfitabilityService.getGraphData(
        {
          ...profitabilityUtils.getGraphDataPayload(filters, 0, false),
          asinSkuGroupBy: false,
          asinSkuMapping:
            profitabilityUtils.formatSelectedProductsToAsinSKUMap(
              filters.selectedProducts
            ) ?? [],
        },
        signal
      );
    },
    enabled: trendsData ? trendsData?.length > 0 : false,
    options: { staleTime: Infinity },
  });

  useEffect(() => {
    if (fetchTrendsTotalData.isSuccess)
      setTrendsTotalData(fetchTrendsTotalData.data.data.data);
  }, [fetchTrendsTotalData.data?.data.data, fetchTrendsTotalData.isSuccess]);
  const onProductSelect = (value: IMultiSelectProductSearchDropdownItem[]) => {
    setHeaderFilters({
      ...filters,
      selectedProducts: value,
    });
  };

  const isProductDataLoading = useMemo(
    () => fetchAllProductsInfo.isLoading || fetchAllProductsInfo.isRefetching,
    [fetchAllProductsInfo.isLoading, fetchAllProductsInfo.isRefetching]
  );

  return (
    <ProfitabilityTrendsPageView<
      IProfitabilityTrendsTableRow,
      IAmazonProfitabilityGraphResponse,
      IAmazonProfitabilityGraphResponse
    >
      setSelectedFrequency={setSelectedFrequency}
      selectedMetric={selectedMetric}
      trendsData={formattedTrendsData}
      processedChartData={processedChartData}
      trendsTotalData={trendsTotalData}
      uniqueDates={uniqueDates}
      isDataLoading={isLoading}
      isApplyDisabled={isApplyDisabled}
      metricOptions={AMAZON_TRENDS_METRIC_OPTIONS}
      rangeOptions={options.range}
      onRangeSelect={onRangeSelect}
      onCustomDateRangeChange={setCustomDateRange}
      onMetricSelect={onTrendsMetricSelect}
      onApply={handleApply}
      onDownload={handleDownload}
      metricKey={selectedTrendsMetric.value}
      onProductSelect={onProductSelect}
      marketplace={MarketplaceEnum.AMAZON}
      productInfo={headerFilters.selectedProducts}
      isProductDataLoading={isProductDataLoading}
    />
  );
};
