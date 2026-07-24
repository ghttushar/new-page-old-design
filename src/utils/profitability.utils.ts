import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import dateColumnUtils from '@/app/components/common/dynamic-date-columns/dynamic-date-columns';
import { IProfitabilityTrendsTableRow } from '@/app/components/page-components/profitability/profitability-trends-table/profitability-trends-table';
import {
  ALL_VALUE,
  customRangeFilterOption,
  performanceGraphColors,
  SELECT_ALL,
  SellerCentralURLMap,
} from '@/constants';
import { NEW_AMAZON_SP_PARTNER_ID } from '@/constants/auth.constants';
import {
  ACCORDION_ROOT_ID,
  amazonProfitabilityMetricsOptions,
  emptyDateRange,
  PRIORITY_ORDER,
  ProfitabilityFrequencyConstants,
  profitabilityGraphMetricsOptions,
  profitabilityMetricsOptions,
  ProfitabilityPnLFrequency,
  PURCHASE_STATUS_MAPPING,
  yAxisNames,
} from '@/constants/profitability/profitability.constants';
import {
  ColumnNameEnum,
  MetricsKeysEnum,
  SortOrderEnum,
} from '@/enums/advertising.enums';
import {
  ProfitabilityFallBackEnum,
  ProfitabilityMetricsKeyEnums,
  ProfitabilityMetricsLabelEnums,
  ProfitabilityOrdersMetricsKeyEnums,
  ProfitabilityOrderStatusEnum,
  ProfitabilitySearchColumnsEnum,
  ProfitabilityTableTitlesEnum,
  ProfitabilityTableTypeEnum,
  ProfitabilityTrendsMetricsKeyEnums,
} from '@/enums/profitability.enums';
import { Frequency, MarketplaceEnum, Range } from '@/enums/serp.enums';
import {
  ISortCriteria,
  IUploadCogsErrResponse,
} from '@/interfaces/advertising/advertising.interface';
import {
  IMultiSelectDropdownItem,
  IMultiSelectProductSearchDropdownItem,
} from '@/interfaces/dropdown.interfaces';
import { Nullable } from '@/interfaces/index.interface';
import {
  IAmazonPerformanceMetrics,
  IAmazonPnLProducts,
  IAmazonProfitabilityGraphResponse,
  IAmazonProfitabilityOrder,
  IAmazonProfitabilityProductData,
  IAmazonProfitabilityTableData,
  IAsinSkuMapping,
  ISettlementDetails,
} from '@/interfaces/profitability/amazon-profitability.interface';
import {
  GroupedDataItem,
  IAccordionItem,
  IExtendedAccordionItem,
  IFlatRowData,
  IProductDetails,
  IProfitabilityCardMetricDisplay,
  IProfitabilityGraphMetricsConfig,
  IProfitabilityGraphPayload,
  IProfitabilityOrdersData,
  IProfitabilityPerformanceMetrics,
  IProfitabilityProductsData,
  IProfitabilityTableData,
  IProfitMarginScatterData,
} from '@/interfaces/profitability/profitability.interface';
import { IDateRange } from '@/interfaces/serp.interface';
import { IFinalFilters } from '@/redux/slices/filters/filter.slice';
import { IProfitabilityFilterForm } from '@/redux/slices/profitability/profitability.slice';
import { ExpandedState, Row } from '@tanstack/react-table';
import { ChartData } from 'chart.js';
import {
  checkIsValidObject,
  convertGraphLabelByFrequency,
  convertToLowerCase,
  convertToUpperCase,
  displayValue,
  formatDate,
  formatDisplayRange,
  formatNum,
  formatStringToTitleCase,
  getCountryCode,
  getRatio,
  getTitleCaseString,
  hasProperty,
  parseNum,
} from '.';
import {
  checkIsEqual,
  checkIsNull,
  getFormattedMetrics,
} from './advertising.utils';
import { getCustomDateRange, getSortedDates } from './datetime.utils';

export const profitabilityUtils = {
  getProfitabilityMetricsGraphData: <T extends object>(
    metricsData: IMultiSelectDropdownItem[]
  ): IProfitabilityGraphMetricsConfig<T>[] => {
    return metricsData
      .filter((metric) => metric.selected)
      .map((metric, index) => {
        return {
          key: metric.value as keyof T,
          label: metric.label,
          yAxisID: yAxisNames[index],
        };
      });
  },

  getGraphDataPayload: (
    filterData: IProfitabilityFilterForm,
    activePerformanceBox: number,
    isPnL = false,
    selectedProducts?: IMultiSelectProductSearchDropdownItem[] | null
  ): IProfitabilityGraphPayload => {
    const cardRange = filterData.range.value.split('/')[activePerformanceBox];

    const cardCustomDateRange =
      filterData.customDateRanges?.[activePerformanceBox] ??
      filterData.customDateRange;

    const dateRange = isPnL
      ? getCustomDateRange(
          filterData.range.value,
          filterData.customDateRange,
          filterData.customDateRange
        )
      : getCustomDateRange(cardRange, cardCustomDateRange, cardCustomDateRange);

    const payload: IProfitabilityGraphPayload = {
      frequency: isPnL
        ? profitabilityUtils.getFrequencyByRange(
            filterData.range,
            filterData.frequency
          ).value
        : filterData.frequency.value,
      endDate: dateRange?.endDate,
      startDate: dateRange?.startDate,
      filters: [],
      searchText: '',
      range:
        filterData.range.value !== Range.CUSTOM_RANGE
          ? (cardRange as Range)
          : filterData.range.value,
      sortCriteria: [],
    };

    const asinSkuMapping =
      profitabilityUtils.formatSelectedProductsToAsinSKUMap(selectedProducts);
    if (asinSkuMapping && isPnL) payload.asinSkuMapping = asinSkuMapping;

    return payload;
  },
  formatSelectedProductsToAsinSKUMap: (
    selectedProducts?: IMultiSelectProductSearchDropdownItem[] | null
  ): IAsinSkuMapping[] | null => {
    if (!selectedProducts) return null;
    if (selectedProducts.length === 0) return [];
    const selectAllItemIndex = selectedProducts.findIndex(
      (product) => product.value === ALL_VALUE
    );
    if (
      selectAllItemIndex > 0 &&
      selectedProducts[selectAllItemIndex].selected === true
    )
      return [];

    const result = selectedProducts
      .filter((option) => option.value !== '' && option.selected === true)
      .map((item) => {
        return {
          asin: item.itemId,
          sku: item.value,
        };
      });
    return result;
  },
  formatSelectedProductsForWalmart: (
    selectedProducts?: IMultiSelectProductSearchDropdownItem[] | null
  ) => {
    if (!selectedProducts) return [];
    if (selectedProducts.length === 0) return [];
    const selectAllItemIndex = selectedProducts.findIndex(
      (product) => product.value === ALL_VALUE
    );
    if (
      selectAllItemIndex > 0 &&
      selectedProducts[selectAllItemIndex].selected === true
    )
      return [];

    const result = selectedProducts
      .filter(
        (option) => option.value !== ALL_VALUE && option.selected === true
      )
      .map((item) => item.value);

    return result;
  },

  formatAllProductsToMultiSelectItems: (
    productsInfo: IAmazonPnLProducts[]
  ): IMultiSelectProductSearchDropdownItem[] => {
    if (productsInfo.length === 0) return [];

    const selectAllItem = [
      {
        label: SELECT_ALL,
        value: ALL_VALUE,
        selected: false,
        itemId: '',
        price: 0,
        imgURL: '',
      },
    ];
    const formattedProductsInfo = productsInfo.map((product) => {
      return {
        imgURL: product.imageUrl ?? '',
        itemId: product.asin,
        label: product.productName ?? product.asin,
        price: product.price ?? 0,
        selected: false,
        isDisabled: false,
        value: product.sku ?? '',
      };
    });

    return [...selectAllItem, ...formattedProductsInfo];
  },

  formatAllProductsToMultiSelectItemsForWalmart: (
    productsInfo: IProductDetails[]
  ): IMultiSelectProductSearchDropdownItem[] => {
    if (productsInfo.length === 0) return [];

    const selectAllItem = [
      {
        label: SELECT_ALL,
        value: ALL_VALUE,
        selected: false,
        itemId: '',
        price: 0,
        imgURL: '',
      },
    ];
    const formattedProductsInfo = productsInfo.map((product) => {
      return {
        imgURL: product.primaryImageUrl ?? '',
        itemId: product.itemId,
        label: product.productName ?? product.itemId,
        price: product.price ?? 0,
        selected: false,
        isDisabled: false,
        value: product.sku ?? '',
      };
    });

    return [...selectAllItem, ...formattedProductsInfo];
  },
  getPerformanceDataPayload: (
    filterData: IProfitabilityFilterForm,
    activePerformanceBox: number
  ): IProfitabilityGraphPayload => {
    const searchColumns =
      profitabilityUtils.getProfitabilitySearchColumnsByTable(
        ProfitabilityTableTypeEnum.ORDERS
      );

    const rangeParts = filterData.range.value.split('/');
    const isCustomDateRange = rangeParts.some(
      (range) => range === Range.CUSTOM_RANGE
    );

    const cardCustomDateRange =
      filterData.customDateRanges?.[
        isCustomDateRange ? 0 : activePerformanceBox
      ] ?? filterData.customDateRange;

    const dateRange = getCustomDateRange(
      isCustomDateRange ? Range.CUSTOM_RANGE : rangeParts[activePerformanceBox],
      cardCustomDateRange,
      cardCustomDateRange
    );

    return {
      frequency: filterData.frequency.value,
      endDate: dateRange?.endDate,
      startDate: dateRange?.startDate,
      filters: [],
      page: 0,
      pageSize: 0,
      searchText: '',
      searchColumns,
      range: filterData.range.value as Range,
      sortCriteria: [],
    };
  },

  getTableDataPayload: (
    filterData: IProfitabilityFilterForm,
    appliedFilters: IFinalFilters[],
    page: number,
    pageSize: number,
    activePerformanceBox: number,
    sortCriteria: ISortCriteria[],
    searchText: string,
    table: ProfitabilityTableTypeEnum,
    marketplace: MarketplaceEnum
  ): IProfitabilityGraphPayload => {
    const searchColumns =
      profitabilityUtils.getProfitabilitySearchColumnsByTable(table);
    const dateRange = getCustomDateRange(
      filterData.range.value.split('/')[0] === Range.CUSTOM_RANGE
        ? Range.CUSTOM_RANGE
        : filterData.range.value.split('/')[activePerformanceBox],
      filterData.customDateRange,
      formatDate(filterData.range.value, marketplace)
    );

    return {
      endDate: dateRange?.endDate,
      startDate: dateRange?.startDate,
      filters: appliedFilters,
      page,
      pageSize,
      searchText,
      searchColumns,
      range:
        filterData.range.value !== Range.CUSTOM_RANGE
          ? (filterData.range.value.split('/')[activePerformanceBox] as Range)
          : filterData.range.value,
      sortCriteria,
    };
  },
  getAmazonProfitabilityTableDataPayload: (
    filterData: IProfitabilityFilterForm,
    appliedFilters: IFinalFilters[],
    page: number,
    pageSize: number,
    activePerformanceBox: number,
    sortCriteria: ISortCriteria[],
    searchText: string,
    table: ProfitabilityTableTypeEnum,
    isDownload = false,
    isAllDownload = false
  ): IProfitabilityGraphPayload => {
    const searchColumns =
      profitabilityUtils.getProfitabilitySearchColumnsByTable(table);
    const dateRange = getCustomDateRange(
      filterData.range.value.split('/')[0] === Range.CUSTOM_RANGE
        ? Range.CUSTOM_RANGE
        : filterData.range.value.split('/')[activePerformanceBox],
      filterData.customDateRange,
      formatDate(filterData.range.value, MarketplaceEnum.AMAZON)
    );

    return {
      endDate: dateRange?.endDate,
      startDate: dateRange?.startDate,
      filters: appliedFilters,
      page,
      pageSize,
      searchText,
      searchColumns,
      range:
        filterData.range.value !== Range.CUSTOM_RANGE
          ? (filterData.range.value.split('/')[activePerformanceBox] as Range)
          : filterData.range.value,
      sortCriteria,
      isDownload,
      downloadWithFilter: !isAllDownload,
    };
  },
  getWalmartProfitabilityTableDataPayload: (
    filterData: IProfitabilityFilterForm,
    appliedFilters: IFinalFilters[],
    page: number,
    pageSize: number,
    activePerformanceBox: number,
    sortCriteria: ISortCriteria[],
    searchText: string,
    table: ProfitabilityTableTypeEnum
  ): IProfitabilityGraphPayload => {
    const searchColumns =
      profitabilityUtils.getProfitabilitySearchColumnsByTable(table);
    const dateRange = getCustomDateRange(
      filterData.range.value.split('/')[0] === Range.CUSTOM_RANGE
        ? Range.CUSTOM_RANGE
        : filterData.range.value.split('/')[activePerformanceBox],
      filterData.customDateRange,
      formatDate(filterData.range.value, MarketplaceEnum.WALMART)
    );

    return {
      endDate: dateRange?.endDate,
      startDate: dateRange?.startDate,
      filters: appliedFilters,
      page,
      pageSize,
      searchText,
      searchColumns,
      range:
        filterData.range.value !== Range.CUSTOM_RANGE
          ? (filterData.range.value.split('/')[activePerformanceBox] as Range)
          : filterData.range.value,
      sortCriteria,
    };
  },

  getProductSearchPnLDataPayload: (
    filterData: IProfitabilityFilterForm,
    appliedFilters: IFinalFilters[],
    activePerformanceBox: number,
    isTrends = false,
    isTrendsGraph = false,
    searchText = '',
    isDownload = false,
    isAllDownload = false
  ): IProfitabilityGraphPayload => {
    const searchColumns =
      profitabilityUtils.getProfitabilitySearchColumnsByTable(
        ProfitabilityTableTypeEnum.PRODUCTS
      );
    if (!isTrends) {
      searchColumns.push(
        ProfitabilitySearchColumnsEnum.PURCHASE_ORDER_ITEM_ID,
        ProfitabilitySearchColumnsEnum.PURCHASE_ORDER_PRODUCT_NAME
      );
    }

    const dateRange = getCustomDateRange(
      filterData.range.value.split('/')[0] === Range.CUSTOM_RANGE
        ? Range.CUSTOM_RANGE
        : filterData.range.value.split('/')[activePerformanceBox],
      filterData.customDateRange,
      filterData.customDateRange
    );

    return {
      frequency:
        isTrendsGraph === true
          ? filterData.graphFrequency.value
          : filterData.frequency.value,
      endDate: dateRange?.endDate,
      startDate: dateRange?.startDate,
      filters: appliedFilters,
      page: 0,
      pageSize: 0,
      searchText,
      searchColumns,
      range:
        filterData.range.value !== Range.CUSTOM_RANGE
          ? (filterData.range.value.split('/')[activePerformanceBox] as Range)
          : filterData.range.value,
      sortCriteria: [],
      isDownload,
      downloadWithFilter: !isAllDownload,
    };
  },

  getProductTrendsTotalDataPayload: (
    filterData: IProfitabilityFilterForm,
    searchText: string
  ): IProfitabilityGraphPayload => {
    const searchColumns =
      profitabilityUtils.getProfitabilitySearchColumnsByTable(
        ProfitabilityTableTypeEnum.PRODUCTS
      );
    const dateRange = getCustomDateRange(
      filterData.range.value,
      filterData.customDateRange,
      filterData.customDateRange
    );

    return {
      frequency: filterData.frequency.value,
      endDate: dateRange?.endDate,
      startDate: dateRange?.startDate,
      filters: [],
      page: 0,
      pageSize: 0,
      searchText,
      searchColumns,
      range: filterData.range.value as Range,
      sortCriteria: [],
    };
  },

  getPnLSummaryDataPayload: (
    filterData: IProfitabilityFilterForm,
    appliedFilters: IFinalFilters[]
  ): IProfitabilityGraphPayload => {
    const searchColumns =
      profitabilityUtils.getProfitabilitySearchColumnsByTable(
        ProfitabilityTableTypeEnum.PRODUCTS
      );
    const dateRange = getCustomDateRange(
      filterData.range.value,
      filterData.customDateRange,
      filterData.customDateRange
    );

    return {
      frequency: filterData.frequency.value,
      endDate: dateRange?.endDate,
      startDate: dateRange?.startDate,
      filters: appliedFilters,
      page: 0,
      pageSize: 0,
      searchText: '',
      searchColumns,
      range: filterData.range.value as Range,
      sortCriteria: [],
    };
  },

  getAllSearchedProductPnLDataPayload: (
    filterData: IProfitabilityFilterForm,
    appliedFilters: IFinalFilters[],
    graphSortOrder = SortOrderEnum.ASC
  ) => {
    const searchColumns =
      profitabilityUtils.getProfitabilitySearchColumnsByTable(
        ProfitabilityTableTypeEnum.PRODUCTS
      );
    const dateRange = getCustomDateRange(
      filterData.range.value,
      filterData.customDateRange,
      filterData.customDateRange
    );

    return {
      frequency: filterData.frequency.value,
      endDate: dateRange?.endDate,
      startDate: dateRange?.startDate,
      filters: appliedFilters,
      page: 0,
      pageSize: 0,
      searchColumns,
      searchText: '',
      range: filterData.range.value as Range,
      sortOrder: graphSortOrder,
    };
  },

  getLabelByKey: (key: string) => {
    switch (key) {
      case ProfitabilityMetricsKeyEnums.TOTAL_AUTH_SALES:
        return ProfitabilityMetricsLabelEnums.TOTAL_AUTH_SALES;
      case ProfitabilityMetricsKeyEnums.TOTAL_RETURN_CANCELLED_SALES:
        return ProfitabilityMetricsLabelEnums.TOTAL_REFUND_COST;
      case ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND:
        return ProfitabilityMetricsLabelEnums.TOTAL_AD_SPEND;
      case ProfitabilityMetricsKeyEnums.TOTAL_EXPENSES:
        return ProfitabilityMetricsLabelEnums.TOTAL_EXPENSES;
      case ProfitabilityMetricsKeyEnums.EST_PAYOUT:
        return ProfitabilityMetricsLabelEnums.EST_PAYOUT;
      case ProfitabilityMetricsKeyEnums.NET_PROFIT:
        return ProfitabilityMetricsLabelEnums.NET_PROFIT;
      case ProfitabilityMetricsKeyEnums.TOTAL_AUTH_ORDERS_UNITS:
        return ProfitabilityMetricsLabelEnums.TOTAL_AUTH_ORDERS_UNITS;
      case ProfitabilityMetricsKeyEnums.ADDITIONAL_FEE:
        return ProfitabilityMetricsLabelEnums.ADDITIONAL_FEE;
      case ProfitabilityMetricsKeyEnums.OPERATIONAL_EXPENSES:
        return ProfitabilityMetricsLabelEnums.OPERATIONAL_EXPENSES;
      case ProfitabilityMetricsKeyEnums.TACOS:
        return ProfitabilityMetricsLabelEnums.TACOS;
      case ProfitabilityMetricsKeyEnums.ROAS:
        return ProfitabilityMetricsLabelEnums.ROAS;
      case ProfitabilityMetricsKeyEnums.TOTAL_GMV_AUTH_SALES:
        return ProfitabilityMetricsLabelEnums.TOTAL_GMV_AUTH_LABEL;
      case ProfitabilityMetricsKeyEnums.TOTAL_REFUND_FEES:
        return ProfitabilityMetricsLabelEnums.TOTAL_REFUND_FEES;
      case ProfitabilityMetricsKeyEnums.TOTAL_AMAZON_FEES:
        return ProfitabilityMetricsLabelEnums.TOTAL_AMAZON_FEES;
      case ProfitabilityMetricsKeyEnums.ROI:
        return convertToUpperCase(ProfitabilityMetricsKeyEnums.ROI);
      default:
        return formatStringToTitleCase(key);
    }
  },

  formatCurrency: (value: Nullable<number | string>) => {
    return displayValue(formatNum(value), false);
  },

  formatNumber: (value: Nullable<number | string>) => {
    return `${formatNum(value, false)}`;
  },

  calculatePercentage: (
    value: Nullable<number | string>,
    total: Nullable<number | string>
  ): string => {
    const numValue = parseNum(value);
    const numTotal = parseNum(total);

    if (numValue === 0) return '';
    if (numTotal === 0)
      return displayValue(formatNum(Math.abs(numValue) * 100));

    return displayValue(
      formatNum((Math.abs(numValue) / Math.abs(numTotal)) * 100)
    );
  },

  getItemIdFromLabel: (parentId: string, label: string, index: number) => {
    return `${parentId}-${index}-${label.replace(/\s+/g, '-').toLowerCase()}`;
  },

  getTotalExpandableItems: (
    items: IAccordionItem[] | undefined,
    parentId = '',
    level = 0
  ): number => {
    let count = 0;
    items?.forEach((item, index) => {
      const hasChildren = item.children && item.children.length > 0;
      if (hasChildren) {
        count += 1;
        count += profitabilityUtils.getTotalExpandableItems(
          item.children,
          profitabilityUtils.getItemIdFromLabel(parentId, item.label, index),
          level + 1
        );
      }
    });
    return count;
  },

  transformTableRowToAccordion: (
    tableRowData: IProfitabilityTableData
  ): IAccordionItem[] => {
    const totalSales = tableRowData?.totalSales ?? '-';
    const totalUnits = tableRowData?.totalUnitsSold ?? '-';

    const itemInventory =
      (tableRowData as IProfitabilityProductsData).itemInventory ?? '-';

    const totalMiscCharges = tableRowData.additionalFee ?? '-';

    const totalSalesFromChildren = profitabilityUtils.calculateMetricsSum(
      tableRowData,
      [
        ProfitabilityOrdersMetricsKeyEnums.ORDER_SALES,
        ProfitabilityOrdersMetricsKeyEnums.CANCELLED_SALES,
        ProfitabilityOrdersMetricsKeyEnums.REFUND_SALES,
      ],
      {
        useAbsoluteValues: true,
      }
    );

    const totalShippingCostFromChildren =
      profitabilityUtils.calculateMetricsSum(
        tableRowData,

        [
          ProfitabilityMetricsKeyEnums.SHIPPING_TAX,
          ProfitabilityMetricsKeyEnums.SHIPPING_TAX_WITHHELD,
          ProfitabilityMetricsKeyEnums.WFS_RETURN_SHIPPING_FEE,
          ProfitabilityMetricsKeyEnums.WALMART_RETURN_SHIPPING_CHARGE,
        ],

        { useAbsoluteValues: true }
      );

    const totalWalmartAdjustmentFromChildren =
      profitabilityUtils.calculateMetricsSum(
        tableRowData,

        [
          ProfitabilityMetricsKeyEnums.COMMISSION_ON_PRODUCT,
          ProfitabilityMetricsKeyEnums.COMMISSION_ON_SHIPPING,
          ProfitabilityMetricsKeyEnums.WFS_FULFILLMENT_FEE,
          ProfitabilityMetricsKeyEnums.EXTRA_DISCOUNT,
          ProfitabilityMetricsKeyEnums.PROMO_CODE,
          ProfitabilityMetricsKeyEnums.OTHER_TAX_FEES,
          ProfitabilityMetricsKeyEnums.PRODUCT_TAX,
          ProfitabilityMetricsKeyEnums.PRODUCT_TAX_WITHHELD,
          ProfitabilityMetricsKeyEnums.EXCESS_REFUND_ADJUSTMENT,
          ProfitabilityMetricsKeyEnums.WALMART_FUNDED_SAVINGS,
        ],
        { useAbsoluteValues: true }
      );

    const totalUnitsFromChildren = profitabilityUtils.calculateMetricsSum(
      tableRowData,
      [
        ProfitabilityOrdersMetricsKeyEnums.REFUND_UNITS,
        ProfitabilityOrdersMetricsKeyEnums.CANCELLED_UNITS,
        ProfitabilityOrdersMetricsKeyEnums.ORDER_UNITS,
      ],
      {
        useAbsoluteValues: true,
      }
    );

    const absAdditionalFeeFromChildren =
      profitabilityUtils.getAdditionalFeesChildrenAbsSum(
        tableRowData.additionalFeeBreakdownCharge
      );

    const miscChildren = profitabilityUtils.getAdditionalFeesChildren(
      tableRowData?.additionalFeeBreakdownCharge,
      totalSalesFromChildren
    );

    const totalAdSpendFromChildren = profitabilityUtils.calculateMetricsSum(
      tableRowData,
      [
        ProfitabilityMetricsKeyEnums.SP_AD_SPEND,
        ProfitabilityMetricsKeyEnums.SB_AD_SPEND,
        ProfitabilityMetricsKeyEnums.SV_AD_SPEND,
      ],
      {
        useAbsoluteValues: true,
      }
    );

    const miscCharges =
      miscChildren.length > 0
        ? {
            label: 'Additional Fee',
            value: totalMiscCharges
              ? profitabilityUtils.formatCurrency(totalMiscCharges)
              : '-',
            percentage: profitabilityUtils.calculatePercentage(
              absAdditionalFeeFromChildren,
              totalSalesFromChildren
            ),
            children: miscChildren,
          }
        : { label: '', value: '' };

    return [
      {
        label: profitabilityUtils.getAccordionTitle(tableRowData),
        value: '',
        children: [
          {
            label: 'Sales',
            value: profitabilityUtils.formatCurrency(totalSales),
            children: [
              {
                label: 'Order Sales',
                value: profitabilityUtils.formatCurrency(
                  tableRowData?.orderSales ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  tableRowData?.orderSales ?? 0,
                  totalSalesFromChildren
                ),
              },
              {
                label: 'Refund Sales',
                value: profitabilityUtils.formatCurrency(
                  tableRowData?.refundSales ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  tableRowData?.refundSales ?? 0,
                  totalSalesFromChildren
                ),
              },
              {
                label: 'Cancelled Sales',
                value: profitabilityUtils.formatCurrency(
                  tableRowData?.cancelledSales ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  tableRowData?.cancelledSales ?? 0,
                  totalSalesFromChildren
                ),
              },
            ],
          },
          {
            label: 'COGS',
            value: profitabilityUtils.formatCurrency(tableRowData?.cogs ?? 0),
            percentage: profitabilityUtils.calculatePercentage(
              tableRowData?.cogs ?? 0,
              totalSalesFromChildren
            ),
          },
          {
            label: 'Total Expenses',
            value: profitabilityUtils.formatCurrency(
              tableRowData.totalExpenses ?? 0
            ),
            children: [
              {
                label: 'Advertising cost',
                value: profitabilityUtils.formatCurrency(
                  tableRowData.overallAdSpend ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  totalAdSpendFromChildren,
                  totalSalesFromChildren
                ),
                children: [
                  {
                    label: 'Sponsored Products',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.spAdSpend ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.spAdSpend ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Sponsored Brands',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.sbAdSpend ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.sbAdSpend ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Sponsored Videos',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.svAdSpend ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.svAdSpend ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                ],
              },
              {
                label: 'Walmart Fees',
                value: profitabilityUtils.formatCurrency(
                  tableRowData.totalWalmartAdjustment ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  totalWalmartAdjustmentFromChildren,
                  totalSalesFromChildren
                ),
                children: [
                  {
                    label: 'Commission on Product',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.commissionOnProduct ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.commissionOnProduct ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Commission on Shipping',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.commissionOnShipping ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.commissionOnShipping ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'WFS Fulfillment Fee',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.wfsFulfillmentFee ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.wfsFulfillmentFee ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Extra Discount',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.extraDiscount ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.extraDiscount ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Promo Code',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.promoCode ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.promoCode ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Other Tax Fees',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.otherTaxFees ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.otherTaxFees ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Product Tax',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.productTax ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.productTax ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Product Tax Withheld',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.productTaxWithheld ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.productTaxWithheld ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Excess Refund Adjustment',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.excessRefundAdjustment ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.excessRefundAdjustment ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Walmart Funded Savings',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.walmartFundedSavings ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.walmartFundedSavings ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                ],
              },
              {
                label: 'Shipping Costs',
                value: profitabilityUtils.formatCurrency(
                  tableRowData.totalShippingCost ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  totalShippingCostFromChildren,
                  totalSalesFromChildren
                ),
                children: [
                  {
                    label: 'Shipping',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.shipping ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.shipping ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Shipping Tax',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.shippingTax ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.shippingTax ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Shipping Tax Withheld',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.shippingTaxWithheld ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.shippingTaxWithheld ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'WFS Return Shipping Fee',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.wfsReturnShippingFee ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.wfsReturnShippingFee ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Walmart Return Shipping Charge',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.walmartReturnShippingCharge ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.walmartReturnShippingCharge ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Failed Return Delivery Processing Charge',
                    value: profitabilityUtils.formatCurrency(
                      tableRowData?.failedReturnDeliveryProcessingCharge ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      tableRowData?.failedReturnDeliveryProcessingCharge ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                ],
              },
              {
                ...miscCharges,
              },
            ],
          },
          {
            label: 'Total Units',
            value: profitabilityUtils.formatNumber(totalUnits),
            children: [
              {
                label: 'Units',
                value: profitabilityUtils.formatNumber(
                  tableRowData?.orderUnits ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  tableRowData?.orderUnits ?? 0,
                  totalUnitsFromChildren
                ),
              },
              {
                label: 'Refund Units',
                value: profitabilityUtils.formatNumber(
                  tableRowData?.refundUnits ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  tableRowData?.refundUnits ?? 0,
                  totalUnitsFromChildren
                ),
              },
              {
                label: 'Cancelled Units',
                value: profitabilityUtils.formatNumber(
                  tableRowData?.cancelledUnits ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  tableRowData?.cancelledUnits ?? 0,
                  totalUnitsFromChildren
                ),
              },
            ],
          },
          {
            label: 'Inventory',
            value: `${formatNum(itemInventory, false)}`,
          },
        ],
      },
    ];
  },

  transformAmazonProductsTableRowToAccordion: <T extends object>(
    tableRowData: T
  ): IAccordionItem[] => {
    if (checkIsNull(tableRowData)) return [];

    const overallAdSpend = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.OVERALL_AD_SPEND
    );
    const overallSpAdSpend = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.OVERALL_SP_AD_SPEND
    );
    const overallSbAdSpend = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.OVERALL_SB_AD_SPEND
    );
    const overallSdAdSpend = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.OVERALL_SD_AD_SPEND
    );

    const settlementAccordion =
      profitabilityUtils.transformAmazonSettlementToAccordion(
        tableRowData as ISettlementDetails
      ) ?? [];

    const totalExpensesFromChildren = profitabilityUtils.calculateMetricsSum(
      tableRowData,
      [
        ProfitabilityMetricsKeyEnums.OVERALL_SP_AD_SPEND,
        ProfitabilityMetricsKeyEnums.OVERALL_SB_AD_SPEND,
        ProfitabilityMetricsKeyEnums.OVERALL_SD_AD_SPEND,
      ]
    );

    const totalSales = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.AMZ_TOTAL_SALES
    );

    const totalUnits = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityTrendsMetricsKeyEnums.TOTAL_UNITS_SOLD
    );
    const totalReturnUnits = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURNS
    );
    const totalCogs = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.TOTAL_COGS
    );
    const totalPromotion = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.PROMOTION
    );

    const organicSales = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.OVERALL_ORGANIC_SALES
    );
    const spAdSales = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.OVERALL_SP_AD_SALES
    );
    const sbAdSales = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.OVERALL_SB_AD_SALES
    );
    const sdAdSales = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.OVERALL_SD_AD_SALES
    );
    const organicUnits = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.OVERALL_ORGANIC_UNITS
    );
    const spAdUnits = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.OVERALL_SP_AD_UNITS
    );
    const sbAdUnits = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.OVERALL_SB_AD_UNITS
    );
    const sdAdUnits = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.OVERALL_SD_AD_UNITS
    );

    return [
      {
        label: profitabilityUtils.getAccordionTitle(tableRowData),
        value: '',
        children: [
          {
            label: 'Sales',
            value: profitabilityUtils.formatCurrency(totalSales),
            children: [
              {
                label: 'Organic Sales',
                value: profitabilityUtils.formatNumber(organicSales),
                percentage: profitabilityUtils.calculatePercentage(
                  organicSales,
                  totalSales
                ),
              },
              {
                label: 'SP Ad Sales',
                value: profitabilityUtils.formatNumber(spAdSales),
                percentage: profitabilityUtils.calculatePercentage(
                  spAdSales,
                  totalSales
                ),
              },
              {
                label: 'SB Ad Sales',
                value: profitabilityUtils.formatNumber(sbAdSales),
                percentage: profitabilityUtils.calculatePercentage(
                  sbAdSales,
                  totalSales
                ),
              },
              {
                label: 'SD Ad Sales',
                value: profitabilityUtils.formatNumber(sdAdSales),
                percentage: profitabilityUtils.calculatePercentage(
                  sdAdSales,
                  totalSales
                ),
              },
            ],
          },
          {
            label: 'Units',
            value: profitabilityUtils.formatNumber(totalUnits),
            children: [
              {
                label: 'Organic Ad Units',
                value: profitabilityUtils.formatNumber(organicUnits),
                percentage: profitabilityUtils.calculatePercentage(
                  organicUnits,
                  totalUnits
                ),
              },
              {
                label: 'SP Ad Units',
                value: profitabilityUtils.formatNumber(spAdUnits),
                percentage: profitabilityUtils.calculatePercentage(
                  spAdUnits,
                  totalUnits
                ),
              },
              {
                label: 'SB Ad Units',
                value: profitabilityUtils.formatNumber(sbAdUnits),
                percentage: profitabilityUtils.calculatePercentage(
                  sbAdUnits,
                  totalUnits
                ),
              },
              {
                label: 'SD Ad Units',
                value: profitabilityUtils.formatNumber(sdAdUnits),
                percentage: profitabilityUtils.calculatePercentage(
                  sdAdUnits,
                  totalUnits
                ),
              },
            ],
          },
          {
            label: 'Return Units',
            value: profitabilityUtils.formatNumber(totalReturnUnits),
          },
          {
            label: 'Advertising cost',
            value: profitabilityUtils.formatCurrency(overallAdSpend || 0),
            percentage: profitabilityUtils.calculatePercentage(
              overallAdSpend,
              totalSales
            ),
            children: [
              {
                label: 'Sponsored Products',
                value: profitabilityUtils.formatCurrency(overallSpAdSpend || 0),
                percentage: profitabilityUtils.calculatePercentage(
                  overallSpAdSpend || 0,
                  totalExpensesFromChildren
                ),
              },
              {
                label: 'Sponsored Brands',
                value: profitabilityUtils.formatCurrency(overallSbAdSpend || 0),
                percentage: profitabilityUtils.calculatePercentage(
                  overallSbAdSpend || 0,
                  totalExpensesFromChildren
                ),
              },
              {
                label: 'Sponsored Display',
                value: profitabilityUtils.formatCurrency(overallSdAdSpend || 0),
                percentage: profitabilityUtils.calculatePercentage(
                  overallSdAdSpend || 0,
                  totalExpensesFromChildren
                ),
              },
            ],
          },
          {
            label: 'COGS',
            value: profitabilityUtils.formatCurrency(totalCogs),
          },
          {
            label: 'Promotion',
            value: profitabilityUtils.formatCurrency(totalPromotion),
          },
          ...settlementAccordion.result,
        ],
      },
    ];
  },
  transformAmazonOrdersTableRowToAccordion: <T extends object>(
    tableRowData: T
  ): IAccordionItem[] => {
    if (checkIsNull(tableRowData)) return [];

    const settlementAccordion =
      profitabilityUtils.transformAmazonSettlementToAccordion(
        tableRowData as ISettlementDetails
      ) ?? [];

    const totalSales = hasProperty(tableRowData, NEW_AMAZON_SP_PARTNER_ID)
      ? profitabilityUtils.getMetricValueFromKey(
          tableRowData,
          ProfitabilityMetricsKeyEnums.TOTAL_PRINCIPAL_AMOUNT
        )
      : profitabilityUtils.getMetricValueFromKey(
          tableRowData,
          ProfitabilityMetricsKeyEnums.PRINCIPAL_AMOUNT
        );

    const totalUnits = hasProperty(tableRowData, NEW_AMAZON_SP_PARTNER_ID)
      ? profitabilityUtils.getMetricValueFromKey(
          tableRowData,
          ProfitabilityMetricsKeyEnums.TOTAL_ORDER_UNITS
        )
      : profitabilityUtils.getMetricValueFromKey(
          tableRowData,
          ProfitabilityTrendsMetricsKeyEnums.ORDER_UNITS
        );

    const totalReturnUnits = hasProperty(tableRowData, NEW_AMAZON_SP_PARTNER_ID)
      ? profitabilityUtils.getMetricValueFromKey(
          tableRowData,
          ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURN_UNITS
        )
      : profitabilityUtils.getMetricValueFromKey(
          tableRowData,
          ProfitabilityMetricsKeyEnums.AMZ_RETURN_UNITS
        );

    const totalCogs = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.TOTAL_COGS
    );
    const totalPromotion = profitabilityUtils.getMetricValueFromKey(
      tableRowData,
      ProfitabilityMetricsKeyEnums.PROMOTION
    );

    return [
      {
        label: profitabilityUtils.getAccordionTitle(tableRowData),
        value: '',
        children: [
          {
            label: 'Sales',
            value: profitabilityUtils.formatCurrency(totalSales),
          },
          {
            label: 'Units',
            value: profitabilityUtils.formatNumber(totalUnits),
          },
          {
            label: 'Return Units',
            value: profitabilityUtils.formatNumber(totalReturnUnits),
          },
          {
            label: 'COGS',
            value: profitabilityUtils.formatCurrency(totalCogs),
          },
          {
            label: 'Promotion',
            value: profitabilityUtils.formatCurrency(totalPromotion),
          },
          ...settlementAccordion.result,
        ],
      },
    ];
  },

  getAdditionalFeesChildren: (
    additionalFeeBreakdownCharge: Record<string, number>[] | null | undefined,
    totalExpenses: number | string
  ) => {
    const additionalFeeKeys =
      additionalFeeBreakdownCharge?.map((item) => {
        const [label, value] = Object.entries(item)[0];
        return { label, value };
      }) || [];

    const miscChildren = additionalFeeKeys.filter(
      (item) => item.label.trim() !== ''
    );

    const totalMiscChargesFromChildren = profitabilityUtils.getAbsSumOfIntArray(
      miscChildren.map((item) => item.value)
    );

    const result = miscChildren.map((item) => ({
      label: item.label,
      value: profitabilityUtils.formatCurrency(item.value),
      percentage: profitabilityUtils.calculatePercentage(
        parseNum(item.value),
        totalExpenses
      ),
    }));
    return result;
  },

  getAdditionalFeesChildrenAbsSum: (
    additionalFeeBreakdownCharge: Record<string, number>[] | null | undefined
  ) => {
    const additionalFeeKeys =
      additionalFeeBreakdownCharge?.map((item) => {
        const [label, value] = Object.entries(item)[0];
        return { label, value };
      }) || [];

    const miscChildren = additionalFeeKeys.filter(
      (item) => item.label.trim() !== ''
    );

    const totalMiscChargesFromChildren = profitabilityUtils.getAbsSumOfIntArray(
      miscChildren.map((item) => item.value)
    );

    return totalMiscChargesFromChildren;
  },

  transformDataToAccordion: (
    metrics: IProfitabilityPerformanceMetrics | null,
    label: string,
    customDateRange?: IDateRange
  ): IAccordionItem[] => {
    if (checkIsNull(metrics)) return [];

    const totalSales = metrics?.totalAuthSales ?? '-';
    const totalUnits = metrics?.totalAuthUnits ?? '-';
    const totalAdSpend = metrics?.totalAdSpend ?? '-';
    const totalOrders = metrics?.totalAuthOrders ?? '-';
    const totalMiscCharges = metrics?.additionalFee ?? '-';
    const totalExpenses = metrics?.totalExpenses ?? '-';

    const totalSalesFromChildren = profitabilityUtils.calculateMetricsSum(
      metrics,
      [
        ProfitabilityMetricsKeyEnums.ORGANIC_SALES,
        ProfitabilityMetricsKeyEnums.SP_AD_SALES,
        ProfitabilityMetricsKeyEnums.SB_AD_SALES,
        ProfitabilityMetricsKeyEnums.SV_AD_SALES,
      ]
    );

    const absAdditionalFeeFromChildren =
      profitabilityUtils.getAdditionalFeesChildrenAbsSum(
        metrics?.additionalFeeBreakdownCharge
      );

    const totalUnitsFromChildren = profitabilityUtils.calculateMetricsSum(
      metrics,
      [
        ProfitabilityMetricsKeyEnums.ORGANIC_UNITS,
        ProfitabilityMetricsKeyEnums.SP_AD_UNITS,
        ProfitabilityMetricsKeyEnums.SB_AD_UNITS,
        ProfitabilityMetricsKeyEnums.SV_AD_UNITS,
        ProfitabilityMetricsKeyEnums.CANCELLED_UNITS,
        ProfitabilityMetricsKeyEnums.UNITS_RETURNED,
      ],
      {
        useAbsoluteValues: true,
      }
    );
    const totalAdSpendFromChildren = profitabilityUtils.calculateMetricsSum(
      metrics,
      [
        ProfitabilityMetricsKeyEnums.SP_AD_SPEND,
        ProfitabilityMetricsKeyEnums.SB_AD_SPEND,
        ProfitabilityMetricsKeyEnums.SV_AD_SPEND,
      ],
      {
        useAbsoluteValues: true,
      }
    );

    const totalShippingCostFromChildren =
      profitabilityUtils.calculateMetricsSum(
        metrics,

        [
          ProfitabilityMetricsKeyEnums.SHIPPING_TAX,
          ProfitabilityMetricsKeyEnums.SHIPPING_TAX_WITHHELD,
          ProfitabilityMetricsKeyEnums.WFS_RETURN_SHIPPING_FEE,
          ProfitabilityMetricsKeyEnums.WALMART_RETURN_SHIPPING_CHARGE,
        ],

        { useAbsoluteValues: true }
      );

    const totalWalmartAdjustmentFromChildren =
      profitabilityUtils.calculateMetricsSum(
        metrics,

        [
          ProfitabilityMetricsKeyEnums.COMMISSION_ON_PRODUCT,
          ProfitabilityMetricsKeyEnums.COMMISSION_ON_SHIPPING,
          ProfitabilityMetricsKeyEnums.WFS_FULFILLMENT_FEE,
          ProfitabilityMetricsKeyEnums.EXTRA_DISCOUNT,
          ProfitabilityMetricsKeyEnums.PROMO_CODE,
          ProfitabilityMetricsKeyEnums.OTHER_TAX_FEES,
          ProfitabilityMetricsKeyEnums.PRODUCT_TAX,
          ProfitabilityMetricsKeyEnums.PRODUCT_TAX_WITHHELD,
          ProfitabilityMetricsKeyEnums.EXCESS_REFUND_ADJUSTMENT,
          ProfitabilityMetricsKeyEnums.WALMART_FUNDED_SAVINGS,
          ProfitabilityMetricsKeyEnums.DISPUTE_SETTLEMENT_AMOUNT,
        ],
        {
          useAbsoluteValues: true,
        }
      );

    const totalRefundFromChildren = profitabilityUtils.calculateMetricsSum(
      metrics,
      [
        ProfitabilityMetricsKeyEnums.RETURN_SALES,
        ProfitabilityMetricsKeyEnums.CANCELLED_SALES,
      ],
      { useAbsoluteValues: true }
    );

    const miscChildren = profitabilityUtils.getAdditionalFeesChildren(
      metrics?.additionalFeeBreakdownCharge,
      totalSalesFromChildren
    );

    const miscCharges =
      miscChildren.length > 0
        ? {
            label: 'Additional Fee',
            value: totalMiscCharges
              ? profitabilityUtils.formatCurrency(totalMiscCharges)
              : '-',
            percentage: profitabilityUtils.calculatePercentage(
              absAdditionalFeeFromChildren,
              totalSalesFromChildren
            ),
            children: miscChildren,
          }
        : { label: '', value: '' };

    return [
      {
        label: profitabilityUtils.getPerformanceAccordionTitle(
          label,
          MarketplaceEnum.WALMART,
          customDateRange
        ),
        value: '',
        children: [
          {
            label: 'Sales',
            value: displayValue(formatNum(totalSales), false) ?? '',
            children: [
              {
                label: 'Organic',
                value: profitabilityUtils.formatCurrency(
                  metrics?.organicSales ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.organicSales ?? 0,
                  totalSales
                ),
              },
              {
                label: 'Sponsored Products',
                value: profitabilityUtils.formatCurrency(
                  metrics?.spAdSales ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.spAdSales ?? 0,
                  totalSales
                ),
              },
              {
                label: 'Sponsored Brands',
                value: profitabilityUtils.formatCurrency(
                  metrics?.sbAdSales ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.sbAdSales ?? 0,
                  totalSales
                ),
              },
              {
                label: 'Sponsored Video',
                value: profitabilityUtils.formatCurrency(
                  metrics?.svAdSales ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.svAdSales ?? 0,
                  totalSales
                ),
              },
            ],
          },
          {
            label: 'Orders',
            value: profitabilityUtils.formatNumber(totalOrders),
            children: [
              {
                label: 'Organic',
                value: profitabilityUtils.formatNumber(
                  metrics?.organicOrders ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.organicOrders ?? 0,
                  totalOrders
                ),
              },
              {
                label: 'Sponsored Products',
                value: profitabilityUtils.formatNumber(
                  metrics?.spAdOrders ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.spAdOrders ?? 0,
                  totalOrders
                ),
              },
              {
                label: 'Sponsored Brands',
                value: profitabilityUtils.formatNumber(
                  metrics?.sbAdOrders ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.sbAdOrders ?? 0,
                  totalOrders
                ),
              },
              {
                label: 'Sponsored Video',
                value: profitabilityUtils.formatNumber(
                  metrics?.svAdOrders ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.svAdOrders ?? 0,
                  totalOrders
                ),
              },
            ],
          },

          {
            label: 'Total Units',
            value: profitabilityUtils.formatNumber(totalUnits),
            children: [
              {
                label: 'Organic',
                value: profitabilityUtils.formatNumber(
                  metrics?.organicUnits ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.organicUnits ?? 0,
                  totalUnitsFromChildren
                ),
              },
              {
                label: 'Sponsored Products',
                value: profitabilityUtils.formatNumber(metrics?.spAdUnits ?? 0),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.spAdUnits ?? 0,
                  totalUnitsFromChildren
                ),
              },
              {
                label: 'Sponsored Brands',
                value: profitabilityUtils.formatNumber(metrics?.sbAdUnits ?? 0),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.sbAdUnits ?? 0,
                  totalUnitsFromChildren
                ),
              },
              {
                label: 'Sponsored Video',
                value: profitabilityUtils.formatNumber(metrics?.svAdUnits ?? 0),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.svAdUnits ?? 0,
                  totalUnitsFromChildren
                ),
              },
              {
                label: 'Refund Units',
                value: profitabilityUtils.formatNumber(
                  metrics?.unitsReturned ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.unitsReturned ?? 0,
                  totalUnitsFromChildren
                ),
              },
              {
                label: 'Cancelled Units',
                value: profitabilityUtils.formatNumber(
                  metrics?.cancelledUnits ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.cancelledUnits ?? 0,
                  totalUnitsFromChildren
                ),
              },
            ],
          },
          {
            label: 'COGS',
            value: profitabilityUtils.formatCurrency(
              metrics?.totalCogsForOrderedUnits ?? 0
            ),
            percentage: profitabilityUtils.calculatePercentage(
              metrics?.totalCogsForOrderedUnits ?? 0,
              totalSalesFromChildren
            ),
          },
          {
            label: 'Total Expenses',
            value: profitabilityUtils.formatCurrency(totalExpenses),
            children: [
              {
                label: 'Advertising cost',
                value: profitabilityUtils.formatCurrency(totalAdSpend),
                percentage: profitabilityUtils.calculatePercentage(
                  totalAdSpendFromChildren,
                  totalSalesFromChildren
                ),
                children: [
                  {
                    label: 'Sponsored Products',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.spAdSpend ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.spAdSpend ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Sponsored Brands',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.sbAdSpend ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.sbAdSpend ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Sponsored Videos',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.svAdSpend ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.svAdSpend ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                ],
              },
              {
                label: 'Shipping cost',
                value: profitabilityUtils.formatCurrency(
                  metrics?.totalShippingCost ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  totalShippingCostFromChildren,
                  totalSalesFromChildren
                ),
                children: [
                  {
                    label: 'Shipping',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.shipping ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.shipping ?? 0,
                      totalSalesFromChildren
                    ),
                  },

                  {
                    label: 'Shipping Tax',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.shippingTax ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.shippingTax ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Shipping Tax Withheld',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.shippingTaxWithheld ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.shippingTaxWithheld ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'WFS Return Shipping Fee',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.wfsReturnShippingFee ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.wfsReturnShippingFee ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Walmart Return Shipping Charge',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.walmartReturnShippingCharge ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.walmartReturnShippingCharge ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                ],
              },
              {
                label: 'Walmart fees',
                value: profitabilityUtils.formatCurrency(
                  metrics?.totalWalmartAdjustment ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  totalWalmartAdjustmentFromChildren,
                  totalSalesFromChildren
                ),
                children: [
                  {
                    label: 'Commission on Product',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.commissionOnProduct ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.commissionOnProduct ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Commission on Shipping',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.commissionOnShipping ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.commissionOnShipping ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'WFS Fulfillment Fee',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.wfsFulfillmentFee ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.wfsFulfillmentFee ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Extra Discount',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.extraDiscount ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.extraDiscount ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Promo Code',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.promoCode ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.promoCode ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Other Tax Fees',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.otherTaxFees ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.otherTaxFees ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Product Tax',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.productTax ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.productTax ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Product Tax Withheld',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.productTaxWithheld ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.productTaxWithheld ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Excess Refund Adjustment',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.excessRefundAdjustment ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.excessRefundAdjustment ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Walmart Funded Savings',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.walmartFundedSavings ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.walmartFundedSavings ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Dispute Settlement Amt.',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.disputeSettlementAmount ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.disputeSettlementAmount ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                ],
              },
              {
                label: 'Refunds',
                value: profitabilityUtils.formatCurrency(
                  metrics?.totalRefundCost ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  totalRefundFromChildren,
                  totalSalesFromChildren
                ),
                children: [
                  {
                    label: 'Return Sales',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.returnSales ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.returnSales ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Cancelled Sales',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.cancelledSales ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.cancelledSales ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                ],
              },
              {
                ...miscCharges,
              },
            ],
          },
        ],
      },
    ];
  },
  groupProfitabilityOrdersTableData: (
    tableData: Array<IProfitabilityOrdersData>
  ) => {
    const ordersMap: Map<string, IProfitabilityOrdersData[]> = new Map();

    tableData.forEach((order) => {
      if (!order.purchaseOrderId) return;

      const groupKey = order.purchaseOrderId;
      if (!ordersMap.has(groupKey)) {
        ordersMap.set(groupKey, []);
      }
      ordersMap.get(groupKey)?.push(order);
    });

    const result: IProfitabilityOrdersData[] = [];

    ordersMap.forEach((orders, purchaseOrderId) => {
      if (orders.length === 0) return;

      const baseOrder =
        orders.find((order) => order.purchaseOrderLine === '1') || orders[0];

      const aggregatedMetrics = orders.reduce(
        (acc, order) => ({
          totalUnitsSold:
            (acc.totalUnitsSold || 0) + (order.totalUnitsSold || 0),
          orderUnits: (acc.orderUnits || 0) + (order.orderUnits || 0),
          refundUnits: (acc.refundUnits || 0) + (order.refundUnits || 0),
          cancelledUnits:
            (acc.cancelledUnits || 0) + (order.cancelledUnits || 0),
          totalSales: (acc.totalSales || 0) + (order.totalSales || 0),
          orderSales: (acc.orderSales || 0) + (order.orderSales || 0),
          refundSales: (acc.refundSales || 0) + (order.refundSales || 0),
          cancelledSales:
            (acc.cancelledSales || 0) + (order.cancelledSales || 0),
          commissionOnProduct:
            (acc.commissionOnProduct || 0) + (order.commissionOnProduct || 0),
          commissionOnShipping:
            (acc.commissionOnShipping || 0) + (order.commissionOnShipping || 0),
          excessRefundAdjustment:
            (acc.excessRefundAdjustment || 0) +
            (order.excessRefundAdjustment || 0),
          extraDiscount: (acc.extraDiscount || 0) + (order.extraDiscount || 0),
          otherTaxFees: (acc.otherTaxFees || 0) + (order.otherTaxFees || 0),
          productTax: (acc.productTax || 0) + (order.productTax || 0),
          productTaxWithheld:
            (acc.productTaxWithheld || 0) + (order.productTaxWithheld || 0),
          promoCode: (acc.promoCode || 0) + (order.promoCode || 0),
          walmartFundedSavings:
            (acc.walmartFundedSavings || 0) + (order.walmartFundedSavings || 0),
          wfsFulfillmentFee:
            (acc.wfsFulfillmentFee || 0) + (order.wfsFulfillmentFee || 0),
          shipping: (acc.shipping || 0) + (order.shipping || 0),
          shippingTax: (acc.shippingTax || 0) + (order.shippingTax || 0),
          shippingTaxWithheld:
            (acc.shippingTaxWithheld || 0) + (order.shippingTaxWithheld || 0),
          wfsReturnShippingFee:
            (acc.wfsReturnShippingFee || 0) + (order.wfsReturnShippingFee || 0),
          walmartReturnShippingCharge:
            (acc.walmartReturnShippingCharge || 0) +
            (order.walmartReturnShippingCharge || 0),
          purchaseOrderLineQuantity:
            (acc.purchaseOrderLineQuantity || 0) +
            (order.purchaseOrderLineQuantity || 0),
          productPrice:
            parseNum(acc.productPrice) + parseNum(order.productPrice),
          netProfit: (acc.netProfit || 0) + (order.netProfit || 0),
          additionalFee: (acc.additionalFee || 0) + (order.additionalFee || 0),
          cogs: (acc.cogs || 0) + (order.cogs || 0),
        }),
        {} as Partial<IProfitabilityOrdersData>
      );

      const parentOrder: IProfitabilityOrdersData = {
        ...baseOrder,
        ...aggregatedMetrics,
        purchaseOrderProductName: null,
        subRows: orders,
      };

      result.push(parentOrder);
    });

    return result;
  },
  getOrderStatus: (status: string) => {
    switch (status) {
      case ProfitabilityOrderStatusEnum.REFUND_COMPLETED:
        return ProfitabilityOrderStatusEnum.REFUND_MAPPED;
      default:
        return getTitleCaseString(status);
    }
  },

  getMappedPurchaseOrder: (status: string) => {
    return PURCHASE_STATUS_MAPPING[status] ?? status;
  },

  getCardTitle: (filters: IProfitabilityFilterForm, index: number) => {
    return filters.range.value.split('/')[index];
  },
  getDateRange: (
    filters: IProfitabilityFilterForm,
    index: number,
    marketPlace: MarketplaceEnum
  ) => {
    const rangePart = filters.range.value.split('/')[index];

    if (rangePart === Range.CUSTOM_RANGE) {
      const customRange =
        filters.customDateRanges?.[index] ?? filters.customDateRange;
      return formatDisplayRange(customRange);
    }

    return formatDisplayRange(formatDate(rangePart, marketPlace));
  },

  getFormattedAppliedFilters: (
    headerFilters: IProfitabilityFilterForm,
    prevFilter: IProfitabilityFilterForm
  ): IProfitabilityFilterForm => {
    if (headerFilters.range.value !== Range.CUSTOM_RANGE) {
      return headerFilters;
    }

    const prevRangeParts = prevFilter.range.value.split('/');
    const newRangeValue = [
      customRangeFilterOption.value,
      ...prevRangeParts.slice(1),
    ].join('/');

    const customDateRanges = [
      headerFilters.customDateRange,
      ...headerFilters.customDateRanges.slice(1),
    ];
    const updatedCustomDateRanges = [...customDateRanges];
    updatedCustomDateRanges[0] = headerFilters.customDateRange;

    return {
      ...headerFilters,
      range: {
        ...headerFilters.range,
        value: newRangeValue,
      },
      customDateRanges: updatedCustomDateRanges,
    };
  },
  isOrdersData: (data: unknown): data is IProfitabilityOrdersData => {
    return (
      checkIsValidObject(data) &&
      hasProperty(data, ProfitabilityOrdersMetricsKeyEnums.PURCHASE_ORDER_ID) &&
      checkIsNull(data.purchaseOrderId) === false
    );
  },

  isProductsData: (data: unknown): data is IProfitabilityProductsData => {
    return (
      checkIsValidObject(data) &&
      hasProperty(
        data,
        ProfitabilityOrdersMetricsKeyEnums.PURCHASE_ORDER_PRODUCT_NAME
      ) &&
      checkIsNull(data.purchaseOrderProductName) === false
    );
  },

  getCustomRangeOption: (range: IDropdownItem<string>) => {
    if (profitabilityUtils.checkIsCustomRange(range))
      return customRangeFilterOption;
    return range;
  },
  checkIsCustomRange: (range: IDropdownItem<string>) => {
    return range.value.split('/').includes(Range.CUSTOM_RANGE);
  },
  getFrequencyByRange: (
    range: IDropdownItem<string>,
    customFrequency?: IDropdownItem<Frequency>
  ) => {
    switch (range.value) {
      case Range.THIS_WEEK:
      case Range.LAST_WEEK:
      case Range.LAST_30_DAYS:
      case Range.LAST_MONTH:
      case Range.LAST_7_DAYS:
        return ProfitabilityPnLFrequency[0];
      case Range.THIS_MONTH:
        return ProfitabilityPnLFrequency[0];
      case Range.THIS_QUARTER:
      case Range.THIS_YEAR:
        return ProfitabilityPnLFrequency[1];
      case Range.CUSTOM_RANGE:
        return customFrequency ?? ProfitabilityPnLFrequency[0];
      default:
        return ProfitabilityPnLFrequency[0];
    }
  },
  getPnlDefaultFilters: (filters: IProfitabilityFilterForm) => {
    const pnlDefaultFilters: IProfitabilityFilterForm = {
      ...filters,
      range: ProfitabilityFrequencyConstants[0],
      frequency: profitabilityUtils.getFrequencyByRange(
        ProfitabilityFrequencyConstants[0]
      ),
    };
    return pnlDefaultFilters;
  },

  transformPnLDataToAccordion: <T extends object>(
    primaryData: T[] | null,
    uniqueDates: string[]
  ): IExtendedAccordionItem[] => {
    const miscCharges = {
      label: 'Additional Fee',
      value: profitabilityUtils.formatValue(
        profitabilityUtils.getTotalForMetric(
          ProfitabilityMetricsKeyEnums.ADDITIONAL_FEE,
          primaryData
        ),
        ProfitabilityMetricsKeyEnums.ADDITIONAL_FEE
      ),
      dateValues: profitabilityUtils.createDateValues(
        ProfitabilityMetricsKeyEnums.ADDITIONAL_FEE,
        uniqueDates,
        primaryData
      ),
      children: profitabilityUtils.processAdditionalFeeBreakdown(
        primaryData || [],
        uniqueDates
      ),
    };
    return [
      {
        label: 'PnL Analysis',
        value: '',
        children: [
          {
            label: 'Sales',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityTrendsMetricsKeyEnums.TOTAL_SALES,
                primaryData
              ),
              ProfitabilityTrendsMetricsKeyEnums.TOTAL_SALES
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityTrendsMetricsKeyEnums.TOTAL_SALES,
              uniqueDates,
              primaryData
            ),
            children: [
              {
                label: 'Organic Sales',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.ORGANIC_SALES,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.ORGANIC_SALES
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.ORGANIC_SALES,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'SP Sales',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SP_AD_SALES,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SP_AD_SALES
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SP_AD_SALES,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'SB Sales',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SB_AD_SALES,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SB_AD_SALES
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SB_AD_SALES,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'SV Sales',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SV_AD_SALES,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SV_AD_SALES
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SV_AD_SALES,
                  uniqueDates,
                  primaryData
                ),
              },
            ],
          },
          {
            label: 'COGS',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.COGS,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.COGS
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.COGS,
              uniqueDates,
              primaryData
            ),
          },
          {
            label: 'Expenses',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.TOTAL_EXPENSES,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.TOTAL_EXPENSES
            ),

            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.TOTAL_EXPENSES,
              uniqueDates,
              primaryData
            ),
            children: [
              {
                label: 'Total Ad Spend',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.OVERALL_AD_SPEND,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.OVERALL_AD_SPEND
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.OVERALL_AD_SPEND,
                  uniqueDates,
                  primaryData
                ),
                children: [
                  {
                    label: 'SP Ad Spend',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.SP_AD_SPEND,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.SP_AD_SPEND
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.SP_AD_SPEND,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'SB Ad Spend',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.SB_AD_SPEND,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.SB_AD_SPEND
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.SB_AD_SPEND,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'SV Ad Spend',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.SV_AD_SPEND,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.SV_AD_SPEND
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.SV_AD_SPEND,
                      uniqueDates,
                      primaryData
                    ),
                  },
                ],
              },
              {
                label: 'Walmart Adjustment',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.TOTAL_WALMART_ADJUSTMENT,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.TOTAL_WALMART_ADJUSTMENT
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.TOTAL_WALMART_ADJUSTMENT,
                  uniqueDates,
                  primaryData
                ),
                children: [
                  {
                    label: 'Commission on Product',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.COMMISSION_ON_PRODUCT,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.COMMISSION_ON_PRODUCT
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.COMMISSION_ON_PRODUCT,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Commission on Shipping',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.COMMISSION_ON_SHIPPING,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.COMMISSION_ON_SHIPPING
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.COMMISSION_ON_SHIPPING,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'WFS Fulfillment Fee',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.WFS_FULFILLMENT_FEE,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.WFS_FULFILLMENT_FEE
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.WFS_FULFILLMENT_FEE,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Extra Discount',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.EXTRA_DISCOUNT,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.EXTRA_DISCOUNT
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.EXTRA_DISCOUNT,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Promo Code',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.PROMO_CODE,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.PROMO_CODE
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.PROMO_CODE,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Other Tax Fees',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.OTHER_TAX_FEES,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.OTHER_TAX_FEES
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.OTHER_TAX_FEES,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Product Tax',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.PRODUCT_TAX,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.PRODUCT_TAX
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.PRODUCT_TAX,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Product Tax Withheld',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.PRODUCT_TAX_WITHHELD,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.PRODUCT_TAX_WITHHELD
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.PRODUCT_TAX_WITHHELD,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Excess Refund Adjustment',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.EXCESS_REFUND_ADJUSTMENT,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.EXCESS_REFUND_ADJUSTMENT
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.EXCESS_REFUND_ADJUSTMENT,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Walmart Funded Savings',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.WALMART_FUNDED_SAVINGS,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.WALMART_FUNDED_SAVINGS
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.WALMART_FUNDED_SAVINGS,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Dispute Settlement Amount',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.DISPUTE_SETTLEMENT_AMOUNT,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.DISPUTE_SETTLEMENT_AMOUNT
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.DISPUTE_SETTLEMENT_AMOUNT,
                      uniqueDates,
                      primaryData
                    ),
                  },
                ],
              },
              {
                label: 'Refund Cost',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.TOTAL_REFUND_COST,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.TOTAL_REFUND_COST
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.TOTAL_REFUND_COST,
                  uniqueDates,
                  primaryData
                ),
                children: [
                  {
                    label: 'Return Sales',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityTrendsMetricsKeyEnums.REFUND_SALES,
                        primaryData
                      ),
                      ProfitabilityTrendsMetricsKeyEnums.REFUND_SALES
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityTrendsMetricsKeyEnums.REFUND_SALES,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Cancelled Sales',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.CANCELLED_SALES,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.CANCELLED_SALES
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.CANCELLED_SALES,
                      uniqueDates,
                      primaryData
                    ),
                  },
                ],
              },
              {
                label: 'Shipping Cost',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.TOTAL_SHIPPING_COST,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.TOTAL_SHIPPING_COST
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.TOTAL_SHIPPING_COST,
                  uniqueDates,
                  primaryData
                ),
                children: [
                  {
                    label: 'Shipping',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.SHIPPING,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.SHIPPING
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.SHIPPING,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Shipping Tax',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.SHIPPING_TAX,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.SHIPPING_TAX
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.SHIPPING_TAX,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Shipping Tax Withheld',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.SHIPPING_TAX_WITHHELD,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.SHIPPING_TAX_WITHHELD
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.SHIPPING_TAX_WITHHELD,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'WFS Return Shipping Fee',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.WFS_RETURN_SHIPPING_FEE,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.WFS_RETURN_SHIPPING_FEE
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.WFS_RETURN_SHIPPING_FEE,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Walmart Return Shipping Charge',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.WALMART_RETURN_SHIPPING_CHARGE,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.WALMART_RETURN_SHIPPING_CHARGE
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.WALMART_RETURN_SHIPPING_CHARGE,
                      uniqueDates,
                      primaryData
                    ),
                  },
                ],
              },
              miscCharges,
            ],
          },
          {
            label: 'Orders',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.TOTAL_AUTH_ORDERS,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.TOTAL_AUTH_ORDERS
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.TOTAL_AUTH_ORDERS,
              uniqueDates,
              primaryData
            ),
            children: [
              {
                label: 'Organic Orders',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.ORGANIC_ORDERS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.ORGANIC_ORDERS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.ORGANIC_ORDERS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'SP Orders',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SP_AD_ORDERS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SP_AD_ORDERS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SP_AD_ORDERS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'SB Orders',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SB_AD_ORDERS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SB_AD_ORDERS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SB_AD_ORDERS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'SV Orders',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SV_AD_ORDERS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SV_AD_ORDERS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SV_AD_ORDERS,
                  uniqueDates,
                  primaryData
                ),
              },
            ],
          },
          {
            label: 'Units',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityTrendsMetricsKeyEnums.ORDER_UNITS,
                primaryData
              ),
              ProfitabilityTrendsMetricsKeyEnums.ORDER_UNITS
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityTrendsMetricsKeyEnums.ORDER_UNITS,
              uniqueDates,
              primaryData
            ),

            children: [
              {
                label: 'Organic Units',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.ORGANIC_UNITS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.ORGANIC_UNITS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.ORGANIC_UNITS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'SP Units',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SP_AD_UNITS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SP_AD_UNITS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SP_AD_UNITS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'SB Units',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SB_AD_UNITS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SB_AD_UNITS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SB_AD_UNITS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'SV Units',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SV_AD_UNITS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SV_AD_UNITS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SV_AD_UNITS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'Units Returned',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.UNITS_RETURNED,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.UNITS_RETURNED
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.UNITS_RETURNED,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'Cancelled Units',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.CANCELLED_UNITS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.CANCELLED_UNITS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.CANCELLED_UNITS,
                  uniqueDates,
                  primaryData
                ),
              },
            ],
          },
          {
            label: 'Net Profit',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.NET_PROFIT,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.NET_PROFIT
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.NET_PROFIT,
              uniqueDates,
              primaryData
            ),
          },
          {
            label: 'ROAS',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.ROAS,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.ROAS
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.ROAS,
              uniqueDates,
              primaryData
            ),
          },
          {
            label: 'TACOS',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.TACOS,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.TACOS
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.TACOS,
              uniqueDates,
              primaryData
            ),
          },
        ],
      },
    ];
  },

  transformOrdersDataToAccordion: <T extends object>(
    primaryData: T[] | null,
    uniqueDates: string[]
  ): IExtendedAccordionItem[] => {
    const miscCharges = {
      label: 'Additional Fee',
      value: profitabilityUtils.formatValue(
        profitabilityUtils.getTotalForMetric(
          ProfitabilityMetricsKeyEnums.ADDITIONAL_FEE,
          primaryData
        ),
        ProfitabilityMetricsKeyEnums.ADDITIONAL_FEE
      ),
      dateValues: profitabilityUtils.createDateValues(
        ProfitabilityMetricsKeyEnums.ADDITIONAL_FEE,
        uniqueDates,
        primaryData
      ),
      children: profitabilityUtils.processAdditionalFeeBreakdown(
        primaryData || [],
        uniqueDates
      ),
    };
    return [
      {
        label: 'Orders Analysis',
        value: '',
        children: [
          {
            label: 'Sales',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityOrdersMetricsKeyEnums.TOTAL_SALES,
                primaryData
              ),
              ProfitabilityOrdersMetricsKeyEnums.TOTAL_SALES
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityOrdersMetricsKeyEnums.TOTAL_SALES,
              uniqueDates,
              primaryData
            ),
            children: [
              {
                label: 'Order Sales',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityOrdersMetricsKeyEnums.ORDER_SALES,
                    primaryData
                  ),
                  ProfitabilityOrdersMetricsKeyEnums.ORDER_SALES
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityOrdersMetricsKeyEnums.ORDER_SALES,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'Refund Sales',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityOrdersMetricsKeyEnums.REFUND_SALES,
                    primaryData
                  ),
                  ProfitabilityOrdersMetricsKeyEnums.REFUND_SALES
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityOrdersMetricsKeyEnums.REFUND_SALES,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'Cancelled Sales',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.CANCELLED_SALES,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.CANCELLED_SALES
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.CANCELLED_SALES,
                  uniqueDates,
                  primaryData
                ),
              },
            ],
          },
          {
            label: 'COGS',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.COGS,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.COGS
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.COGS,
              uniqueDates,
              primaryData
            ),
          },
          {
            label: 'Total Expenses',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.TOTAL_EXPENSES,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.TOTAL_EXPENSES
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.TOTAL_EXPENSES,
              uniqueDates,
              primaryData
            ),
            children: [
              {
                label: 'Total Ad Spend',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.OVERALL_AD_SPEND,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.OVERALL_AD_SPEND
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.OVERALL_AD_SPEND,
                  uniqueDates,
                  primaryData
                ),
                children: [
                  {
                    label: 'SP Ad Spend',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.SP_AD_SPEND,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.SP_AD_SPEND
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.SP_AD_SPEND,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'SB Ad Spend',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.SB_AD_SPEND,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.SB_AD_SPEND
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.SB_AD_SPEND,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'SV Ad Spend',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.SV_AD_SPEND,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.SV_AD_SPEND
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.SV_AD_SPEND,
                      uniqueDates,
                      primaryData
                    ),
                  },
                ],
              },
              {
                label: 'Total Walmart Adjustment Fee',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.TOTAL_WALMART_ADJUSTMENT,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.TOTAL_WALMART_ADJUSTMENT
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.TOTAL_WALMART_ADJUSTMENT,
                  uniqueDates,
                  primaryData
                ),
                children: [
                  {
                    label: 'Commission on Product',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.COMMISSION_ON_PRODUCT,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.COMMISSION_ON_PRODUCT
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.COMMISSION_ON_PRODUCT,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Commission on Shipping',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.COMMISSION_ON_SHIPPING,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.COMMISSION_ON_SHIPPING
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.COMMISSION_ON_SHIPPING,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'WFS Fulfillment Fee',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.WFS_FULFILLMENT_FEE,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.WFS_FULFILLMENT_FEE
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.WFS_FULFILLMENT_FEE,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Extra Discount',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.EXTRA_DISCOUNT,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.EXTRA_DISCOUNT
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.EXTRA_DISCOUNT,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Promo Code',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.PROMO_CODE,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.PROMO_CODE
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.PROMO_CODE,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Other Tax Fees',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.OTHER_TAX_FEES,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.OTHER_TAX_FEES
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.OTHER_TAX_FEES,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Product Tax',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.PRODUCT_TAX,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.PRODUCT_TAX
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.PRODUCT_TAX,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Product Tax Withheld',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.PRODUCT_TAX_WITHHELD,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.PRODUCT_TAX_WITHHELD
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.PRODUCT_TAX_WITHHELD,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Excess Refund Adjustment',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.EXCESS_REFUND_ADJUSTMENT,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.EXCESS_REFUND_ADJUSTMENT
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.EXCESS_REFUND_ADJUSTMENT,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Walmart Funded Savings',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.WALMART_FUNDED_SAVINGS,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.WALMART_FUNDED_SAVINGS
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.WALMART_FUNDED_SAVINGS,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Customer Return Reversal',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.CUSTOMER_RETURN_REVERSAL,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.CUSTOMER_RETURN_REVERSAL
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.CUSTOMER_RETURN_REVERSAL,
                      uniqueDates,
                      primaryData
                    ),
                  },
                ],
              },
              {
                label: 'Total Shipping Cost',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.TOTAL_SHIPPING_COST,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.TOTAL_SHIPPING_COST
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.TOTAL_SHIPPING_COST,
                  uniqueDates,
                  primaryData
                ),
                children: [
                  {
                    label: 'Shipping',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.SHIPPING,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.SHIPPING
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.SHIPPING,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Shipping Tax',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.SHIPPING_TAX,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.SHIPPING_TAX
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.SHIPPING_TAX,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Shipping Tax Withheld',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.SHIPPING_TAX_WITHHELD,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.SHIPPING_TAX_WITHHELD
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.SHIPPING_TAX_WITHHELD,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Walmart Return Shipping Charge',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.WALMART_RETURN_SHIPPING_CHARGE,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.WALMART_RETURN_SHIPPING_CHARGE
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.WALMART_RETURN_SHIPPING_CHARGE,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'Failed Return Delivery Charge',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.FAILED_RETURN_DELIVERY_PROCESSING_CHARGE,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.FAILED_RETURN_DELIVERY_PROCESSING_CHARGE
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.FAILED_RETURN_DELIVERY_PROCESSING_CHARGE,
                      uniqueDates,
                      primaryData
                    ),
                  },
                ],
              },

              miscCharges,
            ],
          },
          {
            label: 'Total Ad Orders',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.OVERALL_AD_ORDERS,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.OVERALL_AD_ORDERS
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.OVERALL_AD_ORDERS,
              uniqueDates,
              primaryData
            ),
            children: [
              {
                label: 'Sponsored Products',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SP_AD_ORDERS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SP_AD_ORDERS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SP_AD_ORDERS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'Sponsored Brands',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SB_AD_ORDERS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SB_AD_ORDERS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SB_AD_ORDERS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'Sponsored Video',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SV_AD_ORDERS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SV_AD_ORDERS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SV_AD_ORDERS,
                  uniqueDates,
                  primaryData
                ),
              },
            ],
          },
          {
            label: 'Units',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityOrdersMetricsKeyEnums.TOTAL_UNITS_SOLD,
                primaryData
              ),
              ProfitabilityOrdersMetricsKeyEnums.TOTAL_UNITS_SOLD
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityOrdersMetricsKeyEnums.TOTAL_UNITS_SOLD,
              uniqueDates,
              primaryData
            ),
            children: [
              {
                label: 'Order Units',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityOrdersMetricsKeyEnums.ORDER_UNITS,
                    primaryData
                  ),
                  ProfitabilityOrdersMetricsKeyEnums.ORDER_UNITS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityOrdersMetricsKeyEnums.ORDER_UNITS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'Refund Units',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityOrdersMetricsKeyEnums.REFUND_UNITS,
                    primaryData
                  ),
                  ProfitabilityOrdersMetricsKeyEnums.REFUND_UNITS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityOrdersMetricsKeyEnums.REFUND_UNITS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'Cancelled Units',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.CANCELLED_UNITS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.CANCELLED_UNITS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.CANCELLED_UNITS,
                  uniqueDates,
                  primaryData
                ),
              },
            ],
          },
          {
            label: 'Net Profit',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.NET_PROFIT,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.NET_PROFIT
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.NET_PROFIT,
              uniqueDates,
              primaryData
            ),
          },
        ],
      },
    ];
  },
  getTotalForMetric: <T extends object>(
    key: string,
    primaryData: T[] | null
  ): number => {
    if (!primaryData) return 0;

    const isAmazon = primaryData.some((item) =>
      hasProperty(item, ProfitabilityMetricsKeyEnums.SETTLEMENT_DETAILS)
    );

    if (key === ProfitabilityMetricsKeyEnums.ROAS) {
      const totalAdSpend =
        profitabilityUtils.getTotalForMetric(
          isAmazon
            ? ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND
            : ProfitabilityMetricsKeyEnums.OVERALL_AD_SPEND,
          primaryData
        ) ?? 0;
      const totalAdSales =
        (profitabilityUtils.getTotalForMetric(
          ProfitabilityMetricsKeyEnums.SB_AD_SALES,
          primaryData
        ) ?? 0) +
        (profitabilityUtils.getTotalForMetric(
          ProfitabilityMetricsKeyEnums.SV_AD_SALES,
          primaryData
        ) ?? 0) +
        (profitabilityUtils.getTotalForMetric(
          ProfitabilityMetricsKeyEnums.SP_AD_SALES,
          primaryData
        ) ?? 0);
      return Math.abs(getRatio(totalAdSales, totalAdSpend));
    }
    if (key === ProfitabilityMetricsKeyEnums.TOTAL_REFUND_COST) {
      const refundSales =
        profitabilityUtils.getTotalForMetric(
          ProfitabilityTrendsMetricsKeyEnums.REFUND_SALES,
          primaryData
        ) ?? 0;
      const cancelledSales =
        profitabilityUtils.getTotalForMetric(
          ProfitabilityMetricsKeyEnums.CANCELLED_SALES,
          primaryData
        ) ?? 0;
      return refundSales + cancelledSales;
    }

    if (key === ProfitabilityMetricsKeyEnums.TACOS) {
      const totalAdSpend =
        profitabilityUtils.getTotalForMetric(
          isAmazon
            ? ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND
            : ProfitabilityMetricsKeyEnums.OVERALL_AD_SPEND,
          primaryData
        ) ?? 0;
      const totalSales =
        profitabilityUtils.getTotalForMetric(
          ProfitabilityTrendsMetricsKeyEnums.TOTAL_SALES,
          primaryData
        ) ?? 0;
      return Math.abs(getRatio(totalAdSpend, totalSales) * 100);
    }

    if (!isAmazon) {
      const values = primaryData.map((item) =>
        hasProperty(item, key) ? parseNum(item[key]) : 0
      );

      return values.length > 0
        ? values.reduce((sum, value) => sum + value, 0)
        : 0;
    }

    if (key === ProfitabilityMetricsKeyEnums.TOTAL_EXPENSES) {
      const totalAdSpend =
        profitabilityUtils.getTotalForMetric(
          ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND,
          primaryData
        ) ?? 0;
      const totalAmazonFees = primaryData.reduce((sum, item: any) => {
        return sum + (parseNum(item?.settlementDetails?.totalAmazonFees) ?? 0);
      }, 0);
      const totalRefundFees = primaryData.reduce((sum, item: any) => {
        return sum + (parseNum(item?.settlementDetails?.totalRefundFees) ?? 0);
      }, 0);
      const totalOperationalExpenses = primaryData.reduce((sum, item: any) => {
        return (
          sum +
          (parseNum(
            item?.[ProfitabilityMetricsKeyEnums.OPERATIONAL_EXPENSES]
          ) ?? 0)
        );
      }, 0);
      return (
        totalAdSpend +
        totalAmazonFees +
        totalRefundFees +
        totalOperationalExpenses
      );
    }

    if (key === ProfitabilityMetricsKeyEnums.TOTAL_REFUND_FEES) {
      return primaryData.reduce((sum, item: any) => {
        return sum + (parseNum(item?.settlementDetails?.totalRefundFees) ?? 0);
      }, 0);
    }

    if (key === ProfitabilityMetricsKeyEnums.TOTAL_REFUND_COST) {
      return primaryData.reduce((sum, item: any) => {
        return sum + (parseNum(item?.settlementDetails?.totalRefundFees) ?? 0);
      }, 0);
    }

    if (key === ProfitabilityMetricsKeyEnums.TOTAL_AMAZON_FEES) {
      return primaryData.reduce((sum, item: any) => {
        return sum + (parseNum(item?.settlementDetails?.totalAmazonFees) ?? 0);
      }, 0);
    }

    const values = primaryData.map((item) =>
      hasProperty(item, key) ? parseNum(item[key]) : 0
    );

    return values.length > 0
      ? values.reduce((sum, value) => sum + value, 0)
      : 0;
  },
  createDateValues: <T extends object>(
    metricKey: PropertyKey,
    uniqueDates: string[],
    primaryData: T[] | null
  ) => {
    const formattedUniqueDates = getSortedDates(uniqueDates).reduce(
      (acc, date) => {
        const value = profitabilityUtils.getValueForDate(
          metricKey,
          date,
          primaryData
        );
        acc[date || 'unknown'] = profitabilityUtils.formatValue(
          value,
          metricKey
        );
        return acc;
      },
      {} as Record<string, string>
    );

    return formattedUniqueDates;
  },

  getValueForDate: <T extends object>(
    key: PropertyKey,
    dateValue: string | null,
    primaryData: T[] | null
  ) => {
    if (!primaryData) return 0;

    const item = primaryData.find((data) => {
      const itemDate = profitabilityUtils.getDateLabel(data);
      return itemDate === dateValue;
    });

    const isAmazon = hasProperty(
      item,
      ProfitabilityMetricsKeyEnums.SETTLEMENT_DETAILS
    );

    if (key === ProfitabilityMetricsKeyEnums.TOTAL_REFUND_COST) {
      const refundSales = parseNum(
        hasProperty(item, ProfitabilityTrendsMetricsKeyEnums.REFUND_SALES)
          ? item[ProfitabilityTrendsMetricsKeyEnums.REFUND_SALES]
          : 0
      );
      const cancelledSales = parseNum(
        hasProperty(item, ProfitabilityTrendsMetricsKeyEnums.CANCELLED_SALES)
          ? item[ProfitabilityTrendsMetricsKeyEnums.CANCELLED_SALES]
          : 0
      );
      return refundSales + cancelledSales;
    }

    if (!isAmazon) {
      if (key === ProfitabilityMetricsKeyEnums.ROAS) {
        const totalAdSpend = hasProperty(
          item,
          ProfitabilityMetricsKeyEnums.OVERALL_AD_SPEND
        )
          ? item[ProfitabilityMetricsKeyEnums.OVERALL_AD_SPEND]
          : 0;
        const totalAdSales =
          (hasProperty(item, ProfitabilityMetricsKeyEnums.SB_AD_SALES)
            ? item[ProfitabilityMetricsKeyEnums.SB_AD_SALES]
            : 0) +
          (hasProperty(item, ProfitabilityMetricsKeyEnums.SV_AD_SALES)
            ? item[ProfitabilityMetricsKeyEnums.SV_AD_SALES]
            : 0) +
          (hasProperty(item, ProfitabilityMetricsKeyEnums.SP_AD_SALES)
            ? item[ProfitabilityMetricsKeyEnums.SP_AD_SALES]
            : 0);
        return Math.abs(getRatio(totalAdSales, totalAdSpend));
      }
      if (key === ProfitabilityMetricsKeyEnums.TACOS) {
        const totalAdSpend = hasProperty(
          item,
          ProfitabilityMetricsKeyEnums.OVERALL_AD_SPEND
        )
          ? item[ProfitabilityMetricsKeyEnums.OVERALL_AD_SPEND]
          : 0;
        const totalSales = hasProperty(
          item,
          ProfitabilityTrendsMetricsKeyEnums.TOTAL_SALES
        )
          ? item[ProfitabilityTrendsMetricsKeyEnums.TOTAL_SALES]
          : 0;
        return Math.abs(getRatio(totalAdSpend, totalSales) * 100);
      }
      return hasProperty(item, key) ? parseNum(item[key]) : 0;
    }

    if (key === ProfitabilityMetricsKeyEnums.TOTAL_EXPENSES && item) {
      const totalAdSpend = parseNum(
        item[ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND as keyof T]
      );
      const totalAmazonFees = parseNum(
        item?.settlementDetails?.totalAmazonFees
      );
      const totalRefundFees = parseNum(
        item?.settlementDetails?.totalRefundFees
      );
      const totalOperationalExpenses = parseNum(
        item[ProfitabilityMetricsKeyEnums.OPERATIONAL_EXPENSES as keyof T]
      );
      return (
        totalAdSpend +
        totalAmazonFees +
        totalRefundFees +
        totalOperationalExpenses
      );
    }

    if (key === ProfitabilityMetricsKeyEnums.TOTAL_REFUND_FEES && item) {
      return parseNum(item?.settlementDetails?.totalRefundFees);
    }

    if (key === ProfitabilityMetricsKeyEnums.TOTAL_REFUND_COST && item) {
      return parseNum(item?.settlementDetails?.totalRefundFees);
    }

    if (key === ProfitabilityMetricsKeyEnums.TOTAL_AMAZON_FEES && item) {
      return parseNum(item?.settlementDetails?.totalAmazonFees);
    }

    const value = hasProperty(item, key) ? parseNum(item[key]) : 0;

    return value;
  },
  formatValue: (value: number | null | undefined, key: PropertyKey): string => {
    if (value === null || value === undefined) return '-';
    const formattedValue = getFormattedMetrics(key.toString(), value);
    return String(formattedValue);
  },

  processAdditionalFeeBreakdown: <T extends object>(
    data: T[] | null,
    uniqueDates: (string | null)[]
  ): IExtendedAccordionItem[] => {
    if (!data?.length) return [];

    const feeTypeTotals = new Map<string, number>();
    const feeTypesByDate = new Map<string, Map<string, number>>();

    data.forEach((item) => {
      if (
        hasProperty(
          item,
          ProfitabilityMetricsKeyEnums.ADDITIONAL_FEE_BREAKDOWN_CHARGE
        ) &&
        item.additionalFeeBreakdownCharge &&
        Array.isArray(item.additionalFeeBreakdownCharge)
      ) {
        item.additionalFeeBreakdownCharge.forEach((feeItem: any) => {
          Object.entries(feeItem).forEach(
            ([feeType, amount]: [string, any]) => {
              const numAmount = amount || 0;
              const dateLabel = profitabilityUtils.getDateLabel(item);

              feeTypeTotals.set(
                feeType,
                (feeTypeTotals.get(feeType) || 0) + numAmount
              );

              if (!feeTypesByDate.has(feeType)) {
                feeTypesByDate.set(feeType, new Map());
              }
              const dateMap = feeTypesByDate.get(feeType);
              dateMap?.set(
                dateLabel,
                (dateMap?.get(dateLabel) || 0) + numAmount
              );
            }
          );
        });
      }
    });

    return Array.from(feeTypeTotals.keys())
      .sort()
      .map((feeType) => {
        const totalValue = feeTypeTotals.get(feeType) || 0;
        const dateMap = feeTypesByDate.get(feeType) || new Map();

        const dateValues = Object.fromEntries(
          uniqueDates.map((date) => [
            date,
            displayValue(formatNum(dateMap.get(date || '') || 0), false),
          ])
        );

        return {
          label: feeType,
          value: displayValue(formatNum(totalValue), false),
          dateValues,
        };
      });
  },

  getInitialExpandedState: () => {
    return new Set([
      profitabilityUtils.getItemIdFromLabel(ACCORDION_ROOT_ID, 'sales', 0),
    ]);
  },
  getPNLInitialExpandedState: (
    flatTableData: IFlatRowData[]
  ): ExpandedState => {
    const level0Rows = flatTableData.filter((item) => item.level === 0);
    const expandedStateForLevel0: ExpandedState = {};

    level0Rows.forEach((row) => {
      expandedStateForLevel0[row.id] = true;
    });

    return expandedStateForLevel0;
  },

  getIsPNLOrdersQueryEnabled: (
    isOrdersTable: boolean,
    isProductsDataPopulated: boolean,
    isPnL: boolean
  ) => {
    if (isPnL === false) return isOrdersTable === true;
    return isProductsDataPopulated;
  },

  getIsPNLProductsQueryEnabled: (
    isOrdersTable: boolean,
    isProductsDataPopulated: boolean,
    isPnL: boolean
  ) => {
    if (isPnL === false) return isOrdersTable === false;
    return isProductsDataPopulated;
  },

  getSymbolByMetric: (metricKey: string, label: string) => {
    if (metricKey === '' || label === '') return '';

    const symbol = `${getFormattedMetrics(metricKey, 0)}`.charAt(0);
    if (symbol === '0' || symbol === '') return label;
    return `${label} (${symbol})`;
  },

  transformToScatterData: <T extends object>(
    data: T[]
  ): IProfitMarginScatterData[] => {
    const validData = data.filter(
      (item) =>
        profitabilityUtils.getProductNameFromData(item) &&
        profitabilityUtils.getSkuFromData(item) &&
        hasProperty(item, ProfitabilityMetricsKeyEnums.NET_PROFIT) &&
        item.netProfit !== null &&
        hasProperty(item, ProfitabilityMetricsKeyEnums.AMZ_TOTAL_SALES) &&
        item.totalSales !== null
    );

    const groupedData = new Map<
      string,
      {
        items: T[];
        totalSales: number;
        totalProfit: number;
        productName: string;
        imgUrl: string;
        sku: string;
      }
    >();

    validData.forEach((item) => {
      const groupKey = `${profitabilityUtils.getSkuFromData(item) || 'N/A'}-${
        profitabilityUtils.getItemIdFromData(item) || 'N/A'
      }`;

      if (!groupedData.has(groupKey)) {
        groupedData.set(groupKey, {
          items: [],
          totalSales: 0,
          totalProfit: 0,
          productName:
            profitabilityUtils.getProductNameFromData(item) ||
            'Unknown Product',
          imgUrl: profitabilityUtils.getImageUrlFromData(item) ?? '',
          sku: profitabilityUtils.getSkuFromData(item) || 'N/A',
        });
      }

      const group = groupedData.get(groupKey)!;
      group.items.push(item);
      group.totalSales += profitabilityUtils.getMetricValueFromKey(
        item,
        ProfitabilityMetricsKeyEnums.AMZ_TOTAL_SALES
      );

      group.totalProfit += profitabilityUtils.getMetricValueFromKey(
        item,
        ProfitabilityMetricsKeyEnums.NET_PROFIT
      );
    });

    return Array.from(groupedData.values()).map((group) => {
      const profitMargin =
        group.totalSales > 0
          ? getRatio(group.totalProfit, group.totalSales) * 100
          : 0;

      return {
        productName: group.productName,
        sku: group.sku,
        imgUrl: group.imgUrl,
        profitMargin,
        adSales: group.totalSales,
        x: profitMargin,
        y: group.totalSales,
      };
    });
  },

  transformTrendsDataToRows: <T extends object>(
    data: T[] | null,
    metricKey: keyof T,
    uniqueDates: string[]
  ): IProfitabilityTrendsTableRow[] => {
    if (!data || data.length === 0) return [];

    const groupedData = data.reduce((acc, item) => {
      const key = `${profitabilityUtils.getSkuFromData(
        item
      )}-${profitabilityUtils.getItemIdFromData(item)}`;
      if (!acc[key]) {
        acc[key] = {
          productName: profitabilityUtils.getProductNameFromData(item) ?? '',
          imageUrl: profitabilityUtils.getImageUrlFromData(item),
          items: [],
          productPrice: profitabilityUtils.getProductPriceFromData(item),
          sku: profitabilityUtils.getSkuFromData(item) ?? '',
          itemId: profitabilityUtils.getItemIdFromData(item) ?? '',
        };
      }
      acc[key].items.push(item);
      return acc;
    }, {} as Record<string, GroupedDataItem<T>>);

    return Object.entries(groupedData).map(([key, group]) => {
      const dateValues = dateColumnUtils.createDateValues(
        group.items,
        profitabilityUtils.getDateLabelFieldName(data[0]),
        metricKey,
        uniqueDates,
        profitabilityUtils.formatValue
      );

      const totalValue = group.items.reduce((sum, item) => {
        const value = profitabilityUtils.getMetricValueFromKey(item, metricKey);
        return sum + value;
      }, 0);

      return {
        id: group.itemId,
        productName: group.productName,
        sku: group.sku,
        imageUrl: group.imageUrl,
        dateValues,
        totalValue: `${totalValue}`,
        level: 0,
        productPrice: group.productPrice,
        hasChildren: false,
        metricKey: metricKey.toString(),
      };
    });
  },
  getAbsSumOfIntArray: (arr: number[]): number => {
    if (!arr?.length) return 0;
    return arr.reduce((sum, value) => sum + Math.abs(parseNum(value)), 0);
  },

  calculateMetricsSum: <T extends object>(
    metrics: T,
    fieldNames: Array<string>,
    options: {
      useAbsoluteValues?: boolean;
      additionalValue?: number | string;
    } = {}
  ): number => {
    if (!metrics) return 0;

    const { useAbsoluteValues = false, additionalValue = 0 } = options;

    const sum = fieldNames.reduce((total, fieldName) => {
      const value = hasProperty(metrics, fieldName)
        ? parseNum(metrics[fieldName])
        : 0;

      const numValue = parseNum(value);
      return total + (useAbsoluteValues ? Math.abs(numValue) : numValue);
    }, 0);

    const additionalNum = parseNum(additionalValue);
    const finalAdditional = useAbsoluteValues
      ? Math.abs(additionalNum)
      : additionalNum;

    return sum + finalAdditional;
  },
  formatPipedMetric: (
    value1: number | undefined | null,
    value2: number | undefined | null,
    isCurrency: boolean
  ) => {
    if (isCurrency)
      return `${
        checkIsNull(value1) ? '--' : displayValue(formatNum(value1), false)
      } | ${
        checkIsNull(value2) ? '--' : displayValue(formatNum(value2), false)
      }`;
    return `${formatNum(value1, false)} | ${formatNum(value2, false)}`;
  },
  getStatusColor: (status: string) => {
    switch (status) {
      case ProfitabilityOrderStatusEnum.CANCELLED:
      case ProfitabilityOrderStatusEnum.REFUND_MAPPED:
        return '#ff7878';
      default:
        return '';
    }
  },
  generateChartData: <T extends object>(
    chartData: T[] | null,
    selectedMetricsData: IProfitabilityGraphMetricsConfig<T>[],
    frequency: Frequency
  ): ChartData<'line'> | null => {
    if (checkIsNull(chartData) || checkIsNull(selectedMetricsData)) return null;

    const labels = chartData.map((item) =>
      convertGraphLabelByFrequency(
        profitabilityUtils.getDateLabel(item),
        frequency
      )
    );

    const datasets = selectedMetricsData.map((metric, index) => ({
      label: metric.label,
      data: chartData.map((item) =>
        profitabilityUtils.getGraphMetricByKey(item, metric.key)
      ),
      borderColor: performanceGraphColors[index],
      backgroundColor: performanceGraphColors[index],
      yAxisID: metric.yAxisID,
      tension: 0.1,
    }));

    return {
      labels,
      datasets,
    };
  },
  getGraphMetricByKey: <T>(item: T, key: PropertyKey) => {
    if (!hasProperty(item, key) || typeof key !== 'string') return 0;

    if (key.toLowerCase().includes(MetricsKeysEnum.AD_SPEND.toLowerCase()))
      return Math.abs(parseNum(item[key]));

    return parseNum(item[key]);
  },
  getAccordionTitle: <T extends object>(selectedRowData: T | null) => {
    if (!selectedRowData) return ProfitabilityFallBackEnum.ACCORDION_TITLE;
    if (profitabilityUtils.isOrdersData(selectedRowData))
      return (
        selectedRowData.purchaseOrderId ??
        ProfitabilityFallBackEnum.ACCORDION_TITLE
      );

    if (profitabilityUtils.isAmazonOrdersData(selectedRowData))
      return (
        selectedRowData.orderId ?? ProfitabilityFallBackEnum.ACCORDION_TITLE
      );
    if (
      profitabilityUtils.isAmazonProductsData(selectedRowData) ||
      profitabilityUtils.isProductsData(selectedRowData)
    )
      return (
        profitabilityUtils.getProductNameFromData(selectedRowData) ??
        ProfitabilityFallBackEnum.ACCORDION_TITLE
      );
    return ProfitabilityFallBackEnum.ACCORDION_TITLE;
  },

  isAmazonOrdersData: (data: unknown): data is IAmazonProfitabilityOrder => {
    return (
      hasProperty(data, ProfitabilitySearchColumnsEnum.AMAZON_ORDER_ID) &&
      checkIsNull(data.orderId) === false
    );
  },
  isAmazonProductsData: (
    data: unknown
  ): data is IAmazonProfitabilityProductData => {
    return (
      hasProperty(data, ProfitabilitySearchColumnsEnum.ASIN) &&
      checkIsNull(data.asin) === false
    );
  },
  getProfitabilitySearchColumnsByTable: (
    table: string
  ): ProfitabilitySearchColumnsEnum[] => {
    switch (table) {
      case ProfitabilityTableTypeEnum.AMAZON_ORDERS:
      case ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_ORDERS:
        return [
          ProfitabilitySearchColumnsEnum.AMAZON_ORDER_ID,
          ProfitabilitySearchColumnsEnum.AMAZON__ORDER_CHILD_ASIN,
          ProfitabilitySearchColumnsEnum.ASIN,
          ProfitabilitySearchColumnsEnum.SKU,
        ];
      case ProfitabilityTableTypeEnum.AMAZON_PRODUCTS:
      case ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_PRODUCTS:
        return [
          ProfitabilitySearchColumnsEnum.ASIN,
          ProfitabilitySearchColumnsEnum.AMAZON_ITEM_NAME,
          ProfitabilitySearchColumnsEnum.AMAZON__PRODUCT_CHILD_ASIN,
          ProfitabilitySearchColumnsEnum.AMAZON__PRODUCT_CHILD_SKU,
        ];
      case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL_ORDERS:
      case ProfitabilityTableTypeEnum.ORDERS:
        return [
          ProfitabilitySearchColumnsEnum.PURCHASE_ORDER_SKU,
          ProfitabilitySearchColumnsEnum.PURCHASE_ORDER_ID,
          ProfitabilitySearchColumnsEnum.PURCHASE_ORDER_ITEM_ID,
          ProfitabilitySearchColumnsEnum.PURCHASE_ORDER_PRODUCT_NAME,
        ];
      case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL_PRODUCTS:
      case ProfitabilityTableTypeEnum.PRODUCTS:
        return [
          ProfitabilitySearchColumnsEnum.PURCHASE_ORDER_SKU,
          ProfitabilitySearchColumnsEnum.PURCHASE_ORDER_ITEM_ID,
          ProfitabilitySearchColumnsEnum.PURCHASE_ORDER_PRODUCT_NAME,
        ];
      default:
        return [];
    }
  },
  transformPerformanceMetricsForCard: (
    metrics: IProfitabilityPerformanceMetrics | null
  ): IProfitabilityCardMetricDisplay[] => {
    const metricsToDisplay: IProfitabilityCardMetricDisplay[] = [
      {
        key: ProfitabilityMetricsKeyEnums.TOTAL_GMV_AUTH_SALES,
        label: profitabilityUtils.getLabelByKey(
          ProfitabilityMetricsKeyEnums.TOTAL_GMV_AUTH_SALES
        ),
        currValue: profitabilityUtils.formatPipedMetric(
          metrics?.totalGMVSales,
          metrics?.totalAuthSales,
          true
        ),
      },
      {
        key: ProfitabilityMetricsKeyEnums.TOTAL_AUTH_ORDERS_UNITS,
        label: profitabilityUtils.getLabelByKey(
          ProfitabilityMetricsKeyEnums.TOTAL_AUTH_ORDERS_UNITS
        ),
        currValue: profitabilityUtils.formatPipedMetric(
          metrics?.totalAuthOrders,
          metrics?.totalAuthUnits,
          false
        ),
      },
      {
        key: ProfitabilityMetricsKeyEnums.TOTAL_RETURN_CANCELLED_SALES,
        label: profitabilityUtils.getLabelByKey(
          ProfitabilityMetricsKeyEnums.TOTAL_RETURN_CANCELLED_SALES
        ),
        currValue: profitabilityUtils.formatPipedMetric(
          metrics?.unitsReturned,
          metrics?.cancelledUnits,
          false
        ),
      },
      {
        key: ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND,
        label: profitabilityUtils.getLabelByKey(
          ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND
        ),
        currValue:
          getFormattedMetrics(
            ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND,
            metrics?.totalAdSpend ?? 0
          ) ?? '-',
      },
      {
        key: ProfitabilityMetricsKeyEnums.EST_PAYOUT,
        label: profitabilityUtils.getLabelByKey(
          ProfitabilityMetricsKeyEnums.EST_PAYOUT
        ),
        currValue:
          getFormattedMetrics(
            ProfitabilityMetricsKeyEnums.EST_PAYOUT,
            metrics?.estimatedPayout ?? 0
          ) ?? '-',
      },

      {
        key: ProfitabilityMetricsKeyEnums.NET_PROFIT,
        label: profitabilityUtils.getLabelByKey(
          ProfitabilityMetricsKeyEnums.NET_PROFIT
        ),
        currValue:
          getFormattedMetrics(
            ProfitabilityMetricsKeyEnums.NET_PROFIT,
            metrics?.netProfit ?? 0
          ) ?? '-',
      },
    ];

    return metricsToDisplay;
  },
  transformAmazonPerformanceMetricsForCard: (
    metrics: IAmazonPerformanceMetrics | null
  ): IProfitabilityCardMetricDisplay[] => {
    const metricsToDisplay: IProfitabilityCardMetricDisplay[] = [
      {
        key: 'totalSales',
        label: formatStringToTitleCase('totalSales'),
        currValue: profitabilityUtils.formatCurrency(metrics?.totalSales ?? 0),
      },
      {
        key: ProfitabilityMetricsKeyEnums.TOTAL_AUTH_ORDERS_UNITS,
        label: profitabilityUtils.getLabelByKey(
          ProfitabilityMetricsKeyEnums.TOTAL_AUTH_ORDERS_UNITS
        ),
        currValue: profitabilityUtils.formatPipedMetric(
          metrics?.totalOrders,
          metrics?.totalUnits,
          false
        ),
      },
      {
        key: ProfitabilityMetricsKeyEnums.TOTAL_RETURN_CANCELLED_SALES,
        label: profitabilityUtils.getLabelByKey(
          ProfitabilityMetricsKeyEnums.TOTAL_RETURN_CANCELLED_SALES
        ),
        currValue: profitabilityUtils.formatPipedMetric(
          metrics?.totalReturnedUnits,
          metrics?.cancelledOrdersCount,
          false
        ),
      },
      {
        key: ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND,
        label: profitabilityUtils.getLabelByKey(
          ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND
        ),
        currValue:
          getFormattedMetrics(
            ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND,
            metrics?.totalAdSpend ?? 0
          ) ?? '-',
      },
      {
        key: ProfitabilityMetricsKeyEnums.EST_PAYOUT,
        label: profitabilityUtils.getLabelByKey(
          ProfitabilityMetricsKeyEnums.EST_PAYOUT
        ),
        currValue:
          getFormattedMetrics(
            ProfitabilityMetricsKeyEnums.EST_PAYOUT,
            metrics?.estimatedPayout ?? 0
          ) ?? '-',
      },

      {
        key: ProfitabilityMetricsKeyEnums.NET_PROFIT,
        label: profitabilityUtils.getLabelByKey(
          ProfitabilityMetricsKeyEnums.NET_PROFIT
        ),
        currValue:
          getFormattedMetrics(
            ProfitabilityMetricsKeyEnums.NET_PROFIT,
            metrics?.netProfit ?? 0
          ) ?? '-',
      },
    ];

    return metricsToDisplay;
  },

  handleTableAccordionExpansion: (
    itemId: string,
    index: number,
    currentExpandedItems: Set<string>,
    rawData: IProfitabilityTableData | IAmazonProfitabilityTableData | null,
    marketplace: MarketplaceEnum,
    currentTable: string
  ): Set<string> => {
    if (rawData === null) {
      return new Set();
    }
    const tableAccordionData = profitabilityUtils.getTableAccordionData(
      rawData,
      currentTable
    );

    if (index === -1) {
      if (currentExpandedItems.size > 0) {
        return new Set();
      }

      const allItemIds = new Set<string>();

      const addAllItemIds = (
        items: IAccordionItem[],
        parentId = ACCORDION_ROOT_ID
      ) => {
        items.forEach((item, itemIndex) => {
          const currentItemId = profitabilityUtils.getItemIdFromLabel(
            parentId,
            item.label,
            itemIndex
          );
          if (item.children && item.children.length > 0) {
            allItemIds.add(currentItemId);
            addAllItemIds(item.children, currentItemId);
          }
        });
      };

      if (tableAccordionData[0]?.children) {
        addAllItemIds(tableAccordionData[0].children);
      }

      return allItemIds;
    }

    const newExpanded = new Set(currentExpandedItems);

    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);

      const removeChildItems = (items: IAccordionItem[], parentId: string) => {
        items.forEach((item, itemIndex) => {
          const childItemId = profitabilityUtils.getItemIdFromLabel(
            parentId,
            item.label,
            itemIndex
          );
          newExpanded.delete(childItemId);
          if (item.children && item.children.length > 0) {
            removeChildItems(item.children, childItemId);
          }
        });
      };

      const findAndRemoveChildren = (
        items: IAccordionItem[],
        targetParentId: string
      ) => {
        items.forEach((item, itemIndex) => {
          const currentItemId = profitabilityUtils.getItemIdFromLabel(
            targetParentId,
            item.label,
            itemIndex
          );
          if (currentItemId === itemId && item.children) {
            removeChildItems(item.children, itemId);
          } else if (item.children) {
            findAndRemoveChildren(item.children, currentItemId);
          }
        });
      };

      if (tableAccordionData[0]?.children) {
        findAndRemoveChildren(
          tableAccordionData[0].children,
          ACCORDION_ROOT_ID
        );
      }
    } else {
      newExpanded.add(itemId);
    }

    return newExpanded;
  },
  transformAmazonPerformanceDataToAccordion: (
    metrics: IAmazonPerformanceMetrics | null,
    label: string,
    customDateRange?: IDateRange
  ): IAccordionItem[] => {
    if (checkIsNull(metrics)) return [];

    const totalSales = metrics?.totalSales ?? '-';
    const totalUnits = metrics?.totalUnits ?? '-';
    const totalAdSpend = metrics?.totalAdSpend ?? '-';
    const totalOrders = metrics?.totalOrders ?? '-';
    const operationalExpenses = metrics?.operationalExpenses ?? 0;

    const totalSalesFromChildren = profitabilityUtils.calculateMetricsSum(
      metrics,
      [ProfitabilityMetricsKeyEnums.AMZ_TOTAL_SALES]
    );
    const settlementAccordion =
      profitabilityUtils.transformAmazonSettlementToAccordion(
        metrics,
        totalSalesFromChildren
      ) ?? [];
    const operationalExpensesAccordionItem =
      operationalExpenses !== 0
        ? [
            {
              label: 'Operational Expenses',
              value: profitabilityUtils.formatCurrency(operationalExpenses),
              percentage: profitabilityUtils.calculatePercentage(
                operationalExpenses,
                totalSalesFromChildren
              ),
            },
          ]
        : [];
    const totalExpenses =
      profitabilityUtils.calculateMetricsSum(metrics, [
        ProfitabilityMetricsKeyEnums.SP_AD_SPEND,
        ProfitabilityMetricsKeyEnums.SB_AD_SPEND,
        ProfitabilityMetricsKeyEnums.SD_AD_SPEND,
      ]) +
      settlementAccordion.totalAdditionalFees +
      operationalExpenses;

    const totalAdSpendFromChildren = profitabilityUtils.calculateMetricsSum(
      metrics,
      [
        ProfitabilityMetricsKeyEnums.SP_AD_SPEND,
        ProfitabilityMetricsKeyEnums.SB_AD_SPEND,
        ProfitabilityMetricsKeyEnums.SD_AD_SPEND,
      ],
      {
        useAbsoluteValues: true,
      }
    );

    const totalDeferredExpenses = profitabilityUtils.calculateMetricsSum(
      metrics,
      [
        ProfitabilityMetricsKeyEnums.DEFERRED_RETURN_AMOUNT,
        ProfitabilityMetricsKeyEnums.DEFERRED_RETURN_COMMISSION_AMOUNT,
        ProfitabilityMetricsKeyEnums.DEFERRED_RETURN_REFERRAL_AMOUNT,
      ]
    );

    return [
      {
        label: profitabilityUtils.getPerformanceAccordionTitle(
          label,
          MarketplaceEnum.AMAZON,
          customDateRange
        ),
        value: '',
        children: [
          {
            label: 'Sales',
            value: displayValue(formatNum(totalSales), false) ?? '',
            children: [
              {
                label: 'Organic',
                value: profitabilityUtils.formatCurrency(
                  metrics?.organicSales ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.organicSales ?? 0,
                  totalSalesFromChildren
                ),
              },
              {
                label: 'Sponsored Products',
                value: profitabilityUtils.formatCurrency(
                  metrics.spAdSales ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics.spAdSales ?? 0,
                  totalSalesFromChildren
                ),
              },
              {
                label: 'Sponsored Brands',
                value: profitabilityUtils.formatCurrency(
                  metrics.sbAdSales ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics.sbAdSales ?? 0,
                  totalSalesFromChildren
                ),
              },
              {
                label: 'Sponsored Display',
                value: profitabilityUtils.formatCurrency(
                  metrics.sdAdSales ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics.sdAdSales ?? 0,
                  totalSalesFromChildren
                ),
              },
            ],
          },
          {
            label: 'Orders',
            value: profitabilityUtils.formatNumber(totalOrders),
          },

          {
            label: 'Total Units',
            value: profitabilityUtils.formatNumber(totalUnits),
            children: [
              {
                label: 'Organic',
                value: profitabilityUtils.formatNumber(
                  metrics.organicAdUnits ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics.organicAdUnits ?? 0,
                  totalUnits
                ),
              },
              {
                label: 'Sponsored Products',
                value: profitabilityUtils.formatNumber(metrics.spAdUnits ?? 0),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics.spAdUnits ?? 0,
                  totalUnits
                ),
              },
              {
                label: 'Sponsored Brands',
                value: profitabilityUtils.formatNumber(metrics.sbAdUnits ?? 0),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics.sbAdUnits ?? 0,
                  totalUnits
                ),
              },
              {
                label: 'Sponsored Display',
                value: profitabilityUtils.formatNumber(metrics.sdAdUnits ?? 0),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics.sdAdUnits ?? 0,
                  totalUnits
                ),
              },
              {
                label: 'Refund Units',
                value: profitabilityUtils.formatNumber(
                  metrics?.totalReturnedUnits ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.totalReturnedUnits ?? 0,
                  totalUnits
                ),
              },
              {
                label: 'Cancelled Orders',
                value: profitabilityUtils.formatNumber(
                  metrics?.cancelledOrdersCount ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.cancelledOrdersCount ?? 0,
                  totalUnits
                ),
              },
              {
                label: 'Deferred Units',
                value: profitabilityUtils.formatNumber(
                  metrics?.deferredReturnUnits ?? 0
                ),
              },
            ],
          },
          {
            label: 'COGS',
            value: profitabilityUtils.formatCurrency(metrics?.cogs ?? 0),
            percentage: profitabilityUtils.calculatePercentage(
              metrics?.cogs ?? 0,
              totalSalesFromChildren
            ),
          },
          {
            label: 'Promotion',
            value: profitabilityUtils.formatCurrency(metrics?.promotion ?? 0),
            percentage: profitabilityUtils.calculatePercentage(
              metrics?.promotion ?? 0,
              totalSalesFromChildren
            ),
          },
          {
            label: 'Total Expenses',
            value: profitabilityUtils.formatCurrency(totalExpenses),
            percentage: profitabilityUtils.calculatePercentage(
              totalExpenses,
              totalSalesFromChildren
            ),
            children: [
              {
                label: 'Advertising cost',
                value: profitabilityUtils.formatCurrency(totalAdSpend),
                percentage: profitabilityUtils.calculatePercentage(
                  totalAdSpendFromChildren,
                  totalSalesFromChildren
                ),
                children: [
                  {
                    label: 'Sponsored Products',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.spAdSpend ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.spAdSpend ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Sponsored Brands',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.sbAdSpend ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.sbAdSpend ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                  {
                    label: 'Sponsored Display',
                    value: profitabilityUtils.formatCurrency(
                      metrics?.sdAdSpend ?? 0
                    ),
                    percentage: profitabilityUtils.calculatePercentage(
                      metrics?.sdAdSpend ?? 0,
                      totalSalesFromChildren
                    ),
                  },
                ],
              },

              ...settlementAccordion.result,
              ...operationalExpensesAccordionItem,
            ],
          },
          {
            label: 'Deferred Returns',
            value: profitabilityUtils.formatCurrency(totalDeferredExpenses),
            percentage: profitabilityUtils.calculatePercentage(
              metrics?.deferredReturnAmount ?? 0,
              totalSalesFromChildren
            ),
            children: [
              {
                label: 'Return Amount',
                value: profitabilityUtils.formatCurrency(
                  metrics?.deferredReturnAmount ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.deferredReturnAmount ?? 0,
                  totalDeferredExpenses
                ),
              },
              {
                label: 'Return Commission',
                value: profitabilityUtils.formatCurrency(
                  metrics?.deferredReturnCommissionAmount ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.deferredReturnCommissionAmount ?? 0,
                  totalDeferredExpenses
                ),
              },
              {
                label: 'Return Referral Amount',
                value: profitabilityUtils.formatCurrency(
                  metrics?.deferredReturnReferralAmount ?? 0
                ),
                percentage: profitabilityUtils.calculatePercentage(
                  metrics?.deferredReturnReferralAmount ?? 0,
                  totalDeferredExpenses
                ),
              },
            ],
          },
        ],
      },
    ];
  },
  transformAmazonSettlementToAccordion: (
    metrics: ISettlementDetails,
    total?: number
  ) => {
    if (checkIsNull(metrics.settlementDetails))
      return { result: [], totalAdditionalFees: 0 };

    const result: IAccordionItem[] = [];

    const refundChildren: IAccordionItem[] = [];
    if (metrics.settlementDetails.refundFees) {
      const refundFeesEntries = Object.entries(
        metrics.settlementDetails.refundFees
      );

      const sortedEntries = refundFeesEntries.sort((a, b) => {
        const aIndex = PRIORITY_ORDER.indexOf(a[0]);
        const bIndex = PRIORITY_ORDER.indexOf(b[0]);

        return bIndex - aIndex;
      });

      sortedEntries.forEach(([key, amount]) => {
        if (parseNum(amount) !== 0) {
          refundChildren.push({
            label: profitabilityUtils.getSettlementDisplayName(key, true),
            value: profitabilityUtils.formatCurrency(amount),
            percentage: profitabilityUtils.calculatePercentage(
              amount,
              metrics.settlementDetails?.totalRefundFees ?? 0
            ),
            amount: parseNum(amount),
          });
        }
      });

      refundChildren.sort((a, b) => parseNum(a.amount) - parseNum(b.amount));
    }

    if (refundChildren.length > 0) {
      result.push({
        label: 'Refund',
        value: profitabilityUtils.formatCurrency(
          metrics.settlementDetails.totalRefundFees
        ),
        percentage: total
          ? profitabilityUtils.calculatePercentage(
              metrics.settlementDetails.totalRefundFees,
              total
            )
          : undefined,
        children: refundChildren,
      });
    }

    const amazonFeesChildren: IAccordionItem[] = [];
    if (metrics.settlementDetails?.amazonFees) {
      Object.entries(metrics.settlementDetails.amazonFees).forEach(
        ([key, amount]) => {
          if (parseNum(amount) !== 0) {
            amazonFeesChildren.push({
              label: profitabilityUtils.getSettlementDisplayName(key),
              value: profitabilityUtils.formatCurrency(amount),
              percentage: profitabilityUtils.calculatePercentage(
                amount,
                metrics.settlementDetails?.totalAmazonFees ?? 0
              ),
              amount: parseNum(amount),
            });
          }
        }
      );

      amazonFeesChildren.sort(
        (a, b) => parseNum(a.amount) - parseNum(b.amount)
      );
    }

    if (amazonFeesChildren.length > 0) {
      result.push({
        label: 'Amazon Fees',
        value: profitabilityUtils.formatCurrency(
          metrics.settlementDetails?.totalAmazonFees ?? 0
        ),
        percentage: total
          ? profitabilityUtils.calculatePercentage(
              metrics.settlementDetails.totalAmazonFees ?? 0,
              total
            )
          : undefined,
        children: amazonFeesChildren,
      });
    }

    const totalAdditionalFees = result.reduce((sum, item) => {
      return (
        sum +
        (item.children
          ? item.children.reduce((childSum, child) => {
              const amountStr = child.value.replace(/[$,]/g, '');
              return childSum + (parseNum(amountStr) || 0);
            }, 0)
          : 0)
      );
    }, 0);

    return {
      totalAdditionalFees,
      result,
    };
  },

  onCardCustomDateRangeChange: (
    index: number,
    customRange: IDateRange,
    headerFilters: IProfitabilityFilterForm,
    setFilters: (filter: IProfitabilityFilterForm) => void,
    setSelectedBox: (index: number) => void
  ) => {
    const rangeParts = headerFilters.range.value.split('/');
    rangeParts[index] = Range.CUSTOM_RANGE;

    const customDateRanges = headerFilters.customDateRanges ?? [
      headerFilters.customDateRange,
      emptyDateRange,
      emptyDateRange,
      emptyDateRange,
    ];
    const newCustomDateRanges = [...customDateRanges];

    if (checkIsEqual(newCustomDateRanges[index], customRange)) return;
    newCustomDateRanges[index] = customRange;

    const newFilters = {
      ...headerFilters,
      range: {
        ...headerFilters.range,
        value: rangeParts.join('/'),
      },

      customDateRanges: newCustomDateRanges,
      customDateRange: customRange,
      ...(index === 0 && { customDateRange: customRange }),
    };
    setFilters(newFilters);
    setSelectedBox(index);
  },
  handleAccordionMetricsExpansion: (
    expandedItems: Set<string>,
    totalExpandableItems: number,
    accordionData: IAccordionItem[],
    index: number,
    itemId: string
  ): Set<string> => {
    if (index === -1) {
      if (expandedItems.size === totalExpandableItems) {
        return profitabilityUtils.getInitialExpandedState();
      } else {
        const allItemIds = new Set<string>();

        const addAllItemIds = (
          items: IAccordionItem[],
          parentId = ACCORDION_ROOT_ID
        ) => {
          items.forEach((item, itemIndex) => {
            const itemId = profitabilityUtils.getItemIdFromLabel(
              parentId,
              item.label,
              itemIndex
            );
            if (item.children && item.children.length > 0) {
              allItemIds.add(itemId);
              addAllItemIds(item.children, itemId);
            }
          });
        };

        if (accordionData[0]?.children) {
          addAllItemIds(accordionData[0].children);
        }

        return allItemIds;
      }
    }

    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);

      const removeChildItems = (items: IAccordionItem[], parentId: string) => {
        items.forEach((item, itemIndex) => {
          const childItemId = profitabilityUtils.getItemIdFromLabel(
            parentId,
            item.label,
            itemIndex
          );
          newExpanded.delete(childItemId);
          if (item.children && item.children.length > 0) {
            removeChildItems(item.children, childItemId);
          }
        });
      };

      const findAndRemoveChildren = (
        items: IAccordionItem[],
        targetParentId: string
      ) => {
        items.forEach((item, itemIndex) => {
          const currentItemId = profitabilityUtils.getItemIdFromLabel(
            targetParentId,
            item.label,
            itemIndex
          );
          if (currentItemId === itemId && item.children) {
            removeChildItems(item.children, itemId);
          } else if (item.children) {
            findAndRemoveChildren(item.children, currentItemId);
          }
        });
      };

      if (accordionData[0]?.children) {
        findAndRemoveChildren(accordionData[0].children, ACCORDION_ROOT_ID);
      }
    } else {
      newExpanded.add(itemId);
    }
    return newExpanded;
  },
  getMetricOptionsByMarketplace: (
    marketplace: MarketplaceEnum | undefined,
    isGraph = false
  ) => {
    if (isGraph) {
      return marketplace === MarketplaceEnum.WALMART
        ? profitabilityGraphMetricsOptions
        : amazonProfitabilityMetricsOptions;
    }
    return marketplace === MarketplaceEnum.WALMART
      ? profitabilityMetricsOptions
      : amazonProfitabilityMetricsOptions;
  },
  getTableTitleByMarketplace: (
    isOrdersTable: boolean,
    marketplace: MarketplaceEnum
  ) => {
    if (marketplace === MarketplaceEnum.AMAZON)
      return isOrdersTable
        ? ProfitabilityTableTypeEnum.AMAZON_ORDERS
        : ProfitabilityTableTypeEnum.AMAZON_PRODUCTS;
    return isOrdersTable
      ? ProfitabilityTableTypeEnum.ORDERS
      : ProfitabilityTableTypeEnum.PRODUCTS;
  },
  getTableAccordionData: (
    selectedRowData:
      | IProfitabilityTableData
      | IAmazonProfitabilityTableData
      | null,
    selectedTable: string
  ) => {
    if (selectedRowData === null) return [];
    else if (
      selectedTable ===
        ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_ORDERS ||
      selectedTable === ProfitabilityTableTypeEnum.AMAZON_ORDERS
    )
      return profitabilityUtils.transformAmazonOrdersTableRowToAccordion(
        selectedRowData
      );
    else if (
      selectedTable ===
        ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_PRODUCTS ||
      selectedTable === ProfitabilityTableTypeEnum.AMAZON_PRODUCTS
    )
      return profitabilityUtils.transformAmazonProductsTableRowToAccordion(
        selectedRowData
      );
    else
      return profitabilityUtils.isOrdersData(selectedRowData) ||
        profitabilityUtils.isProductsData(selectedRowData)
        ? profitabilityUtils.transformTableRowToAccordion(selectedRowData)
        : [];
  },
  getSubRows: <T>(row: T) => {
    if (hasProperty(row, 'items')) return row.items as T[];
    if (hasProperty(row, 'childItems')) return row.childItems as T[];
    if (hasProperty(row, 'subRows')) return row.subRows as T[];
    return [];
  },
  transformAmazonPnLDataToAccordion: (
    primaryData: IAmazonProfitabilityGraphResponse[] | null,
    uniqueDates: string[]
  ): IExtendedAccordionItem[] => {
    return [
      {
        label: 'PnL Analysis',
        value: '',
        children: [
          {
            label: 'Sales',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.AMZ_TOTAL_SALES,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.AMZ_TOTAL_SALES
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.AMZ_TOTAL_SALES,
              uniqueDates,
              primaryData
            ),
            children: [
              {
                label: 'Organic Sales',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.ORGANIC_AD_SALES,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.ORGANIC_AD_SALES
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.ORGANIC_AD_SALES,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'SP Sales',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SP_AD_SALES,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SP_AD_SALES
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SP_AD_SALES,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'SB Sales',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SB_AD_SALES,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SB_AD_SALES
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SB_AD_SALES,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'SD Sales',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SD_AD_SALES,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SD_AD_SALES
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SD_AD_SALES,
                  uniqueDates,
                  primaryData
                ),
              },
            ],
          },
          {
            label: 'Expenses',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.TOTAL_EXPENSES,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.TOTAL_EXPENSES
            ),

            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.TOTAL_EXPENSES,
              uniqueDates,
              primaryData
            ),
            children: [
              {
                label: 'Total Ad Spend',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND,
                  uniqueDates,
                  primaryData
                ),
                children: [
                  {
                    label: 'SP Ad Spend',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.SP_AD_SPEND,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.SP_AD_SPEND
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.SP_AD_SPEND,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'SB Ad Spend',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.SB_AD_SPEND,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.SB_AD_SPEND
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.SB_AD_SPEND,
                      uniqueDates,
                      primaryData
                    ),
                  },
                  {
                    label: 'SD Ad Spend',
                    value: profitabilityUtils.formatValue(
                      profitabilityUtils.getTotalForMetric(
                        ProfitabilityMetricsKeyEnums.SD_AD_SPEND,
                        primaryData
                      ),
                      ProfitabilityMetricsKeyEnums.SD_AD_SPEND
                    ),
                    dateValues: profitabilityUtils.createDateValues(
                      ProfitabilityMetricsKeyEnums.SD_AD_SPEND,
                      uniqueDates,
                      primaryData
                    ),
                  },
                ],
              },
              {
                label: 'Refund Fees',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.TOTAL_REFUND_FEES,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.TOTAL_REFUND_FEES
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.TOTAL_REFUND_FEES,
                  uniqueDates,
                  primaryData
                ),
                children: profitabilityUtils.getSettlementFees(
                  primaryData,
                  'refundFees'
                ),
              },
              {
                label: 'Amazon Fees',
                value: profitabilityUtils.formatValue(
                  primaryData?.reduce(
                    (sum, item: any) =>
                      sum +
                      (parseNum(item?.settlementDetails?.totalAmazonFees) ?? 0),
                    0
                  ) ?? 0,
                  ProfitabilityMetricsKeyEnums.TOTAL_AMAZON_FEES
                ),
                dateValues: uniqueDates.reduce((acc, date) => {
                  const item = primaryData?.find((d) => d.label === date);
                  acc[date] = profitabilityUtils.formatValue(
                    parseNum(item?.settlementDetails?.totalAmazonFees) ?? 0,
                    ProfitabilityMetricsKeyEnums.TOTAL_AMAZON_FEES
                  );
                  return acc;
                }, {} as Record<string, string>),
                children: profitabilityUtils.getSettlementFees(
                  primaryData,
                  'amazonFees'
                ),
              },
            ],
          },
          {
            label: 'Orders',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.AMZ_TOTAL_ORDERS,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.AMZ_TOTAL_ORDERS
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.AMZ_TOTAL_ORDERS,
              uniqueDates,
              primaryData
            ),
            children: [
              {
                label: 'Returned Orders',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURNS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURNS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURNS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'Cancelled Orders',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.AMZ_CANCELLED_ORDERS_COUNT,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.AMZ_CANCELLED_ORDERS_COUNT
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.AMZ_CANCELLED_ORDERS_COUNT,
                  uniqueDates,
                  primaryData
                ),
              },
            ],
          },
          {
            label: 'Units',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.AMZ_TOTAL_UNITS,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.AMZ_TOTAL_UNITS
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.AMZ_TOTAL_UNITS,
              uniqueDates,
              primaryData
            ),

            children: [
              {
                label: 'Organic Units',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.ORGANIC_AD_UNITS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.ORGANIC_AD_UNITS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.ORGANIC_AD_UNITS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'SP Units',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SP_AD_UNITS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SP_AD_UNITS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SP_AD_UNITS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'SB Units',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SB_AD_UNITS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SB_AD_UNITS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SB_AD_UNITS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'SD Units',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.SD_AD_UNITS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.SD_AD_UNITS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.SD_AD_UNITS,
                  uniqueDates,
                  primaryData
                ),
              },
              {
                label: 'Return Units',
                value: profitabilityUtils.formatValue(
                  profitabilityUtils.getTotalForMetric(
                    ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURNED_UNITS,
                    primaryData
                  ),
                  ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURNED_UNITS
                ),
                dateValues: profitabilityUtils.createDateValues(
                  ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURNED_UNITS,
                  uniqueDates,
                  primaryData
                ),
              },
            ],
          },
          {
            label: 'Net Profit',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.NET_PROFIT,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.NET_PROFIT
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.NET_PROFIT,
              uniqueDates,
              primaryData
            ),
          },
          {
            label: 'Promotion',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.PROMOTION,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.PROMOTION
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.PROMOTION,
              uniqueDates,
              primaryData
            ),
          },
          {
            label: 'ROAS',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.ROAS,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.ROAS
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.ROAS,
              uniqueDates,
              primaryData
            ),
          },
          {
            label: 'TACOS',
            value: profitabilityUtils.formatValue(
              profitabilityUtils.getTotalForMetric(
                ProfitabilityMetricsKeyEnums.TACOS,
                primaryData
              ),
              ProfitabilityMetricsKeyEnums.TACOS
            ),
            dateValues: profitabilityUtils.createDateValues(
              ProfitabilityMetricsKeyEnums.TACOS,
              uniqueDates,
              primaryData
            ),
          },
        ],
      },
    ];
  },

  isAmazonPnLData: (obj: unknown): obj is IAmazonProfitabilityGraphResponse => {
    return (
      hasProperty(obj, ProfitabilityMetricsKeyEnums.LABEL) &&
      hasProperty(obj, ProfitabilityMetricsKeyEnums.SETTLEMENT_DETAILS) &&
      hasProperty(obj, ProfitabilityTrendsMetricsKeyEnums.LIST_PRICE) === false
    );
  },
  getDateLabel: (obj: unknown) => {
    if (
      hasProperty(obj, ProfitabilityMetricsKeyEnums.ORDER_DATE_LABEL) &&
      typeof obj.orderDateLabel === 'string'
    )
      return obj.orderDateLabel;
    if (
      hasProperty(obj, ColumnNameEnum.TOTAL_SALES_DATE_LABEL) &&
      typeof obj.totalSalesDateLabel === 'string'
    )
      return obj.totalSalesDateLabel;
    if (
      hasProperty(obj, ProfitabilityMetricsKeyEnums.DATE_LABEL) &&
      typeof obj.dateLabel === 'string'
    )
      return obj.dateLabel;
    if (
      hasProperty(obj, ProfitabilityMetricsKeyEnums.LABEL) &&
      typeof obj.label === 'string'
    )
      return obj.label;

    return '';
  },

  getDateLabelFieldName: <T extends object>(obj: T): keyof T => {
    if (checkIsValidObject(obj)) {
      if (hasProperty(obj, ProfitabilityMetricsKeyEnums.ORDER_DATE_LABEL))
        return ProfitabilityMetricsKeyEnums.ORDER_DATE_LABEL as keyof T;
      if (hasProperty(obj, ProfitabilityMetricsKeyEnums.DATE_LABEL))
        return ProfitabilityMetricsKeyEnums.DATE_LABEL as keyof T;
      if (hasProperty(obj, ProfitabilityMetricsKeyEnums.LABEL))
        return ProfitabilityMetricsKeyEnums.LABEL as keyof T;
      if (hasProperty(obj, ColumnNameEnum.TOTAL_SALES_DATE_LABEL))
        return ColumnNameEnum.TOTAL_SALES_DATE_LABEL as keyof T;
    }
    return '' as keyof T;
  },

  getProductNameFromData: (obj: unknown): string => {
    if (checkIsValidObject(obj)) {
      if (
        hasProperty(obj, 'purchaseOrderProductName') &&
        typeof obj.purchaseOrderProductName === 'string'
      )
        return obj.purchaseOrderProductName;
      if (hasProperty(obj, 'itemName') && typeof obj.itemName === 'string')
        return obj.itemName;
      if (
        hasProperty(obj, 'productName') &&
        typeof obj.productName === 'string'
      )
        return obj.productName;
    }
    return '';
  },

  getSkuFromData: (obj: unknown): string => {
    if (
      hasProperty(obj, 'purchaseOrderSku') &&
      typeof obj.purchaseOrderSku === 'string'
    )
      return obj.purchaseOrderSku;
    if (hasProperty(obj, 'sku') && typeof obj.sku === 'string') return obj.sku;

    return '';
  },

  getItemIdFromData: (obj: unknown): string => {
    if (
      hasProperty(
        obj,
        ProfitabilityOrdersMetricsKeyEnums.PURCHASE_ORDER_ITEM_ID
      ) &&
      typeof obj.purchaseOrderItemId === 'string'
    )
      return obj.purchaseOrderItemId;
    if (
      hasProperty(obj, ProfitabilitySearchColumnsEnum.ASIN) &&
      typeof obj.asin === 'string'
    )
      return obj.asin;
    if (hasProperty(obj, 'id') && typeof obj.id === 'string') return obj.id;

    return '';
  },

  getImageUrlFromData: (obj: unknown): string => {
    if (
      hasProperty(
        obj,
        ProfitabilityOrdersMetricsKeyEnums.PURCHASE_ORDER_IMAGE_URL
      ) &&
      (typeof obj.purchaseOrderItemImage === 'string' ||
        obj.purchaseOrderItemImage === null)
    )
      return obj.purchaseOrderItemImage;
    if (
      hasProperty(obj, ProfitabilityTrendsMetricsKeyEnums.IMG_URL) &&
      (typeof obj.imageUrl === 'string' || obj.imageUrl === null)
    )
      return obj.imageUrl;
    if (
      hasProperty(obj, ProfitabilityOrdersMetricsKeyEnums.ITEM_IMG_URL) &&
      (typeof obj.itemImgUrl === 'string' || obj.itemImgUrl === null)
    )
      return obj.itemImgUrl;

    return '';
  },

  getProductPriceFromData: (obj: unknown): number => {
    if (hasProperty(obj, ProfitabilityTrendsMetricsKeyEnums.PRODUCT_PRICE))
      return parseNum(obj.productPrice);
    if (hasProperty(obj, ProfitabilityTrendsMetricsKeyEnums.LIST_PRICE))
      return parseNum(obj.listPrice);
    if (hasProperty(obj, ProfitabilityTrendsMetricsKeyEnums.ITEM_PRICE))
      return parseNum(obj.itemPrice);
    return 0;
  },

  getIsApplyDisabled: (
    filters: IProfitabilityFilterForm,
    headerFilters: IProfitabilityFilterForm
  ) => {
    const headerSelectedCount =
      headerFilters.selectedProducts?.filter(
        (option) => option.selected && option.value !== ALL_VALUE
      ).length ?? 0;

    const filtersSelectedCount =
      filters.selectedProducts?.filter(
        (option) => option.selected && option.value !== ALL_VALUE
      ).length ?? 0;
    return (
      checkIsEqual(headerFilters.customDateRange, filters.customDateRange) &&
      checkIsEqual(headerFilters.range, filters.range) &&
      checkIsEqual(headerFilters.frequency, filters.frequency) &&
      headerSelectedCount === filtersSelectedCount
    );
  },
  getCurrentTableByMarketplace: (
    isPnL: boolean,
    isOrdersTable: boolean,
    marketplace: MarketplaceEnum
  ) => {
    return (
      isPnL
        ? profitabilityUtils.getPnlTable(isOrdersTable, marketplace)
        : profitabilityUtils.getDashboardTable(isOrdersTable, marketplace)
    ) as ProfitabilityTableTypeEnum;
  },
  getPnlTable: (isOrdersTable: boolean, marketplace: MarketplaceEnum) => {
    if (marketplace === MarketplaceEnum.AMAZON)
      return isOrdersTable
        ? ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_ORDERS
        : ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_PRODUCTS;
    return isOrdersTable
      ? ProfitabilityTableTitlesEnum.PROFITABILITY_PNL_ORDERS
      : ProfitabilityTableTitlesEnum.PROFITABILITY_PNL_PRODUCTS;
  },
  getDashboardTable: (isOrdersTable: boolean, marketplace: MarketplaceEnum) => {
    if (marketplace === MarketplaceEnum.AMAZON)
      return isOrdersTable
        ? ProfitabilityTableTypeEnum.AMAZON_ORDERS
        : ProfitabilityTableTypeEnum.AMAZON_PRODUCTS;
    return isOrdersTable
      ? ProfitabilityTableTypeEnum.ORDERS
      : ProfitabilityTableTypeEnum.PRODUCTS;
  },
  getMetricValueFromKey: (obj: any, key: PropertyKey) => {
    if (
      checkIsNull(obj) ||
      checkIsValidObject(obj) === false ||
      hasProperty(obj, key) === false
    )
      return 0;

    if (key === ProfitabilityMetricsKeyEnums.TACOS)
      return parseNum(obj[key]) * 100;
    return parseNum(obj[key]);
  },
  getCogsValue: (rowData: Row<unknown>) => {
    if (
      (hasProperty(rowData, 'childItems') || hasProperty(rowData, 'items')) &&
      hasProperty(rowData, 'totalCogs')
    )
      return parseNum(rowData.totalCogs);
    if (hasProperty(rowData, 'cogs')) return parseNum(rowData.cogs);
    return 0;
  },
  getPerformanceAccordionTitle: (
    label: string,
    marketPlace: MarketplaceEnum,
    customDateRange?: IDateRange
  ) => {
    const dateRange =
      getTitleCaseString(label) === getTitleCaseString(Range.CUSTOM_RANGE)
        ? customDateRange ?? emptyDateRange
        : formatDate(label, marketPlace);

    return `${getTitleCaseString(label)} - ${formatDisplayRange(dateRange)}`;
  },
  getSettlementDisplayName: (key: string, isReturns = false): string => {
    const parts = key.split('/');
    if (parts.length === 1)
      return profitabilityUtils.getDisplayNameMapping([key]);

    const returnText = profitabilityUtils.getDisplayNameMapping(parts);
    const secondText =
      parts[0] === parts[parts.length]
        ? ''
        : `(${formatStringToTitleCase(parts[0])})`;
    return `${returnText} ${isReturns ? '' : secondText}`;
  },
  getDisplayNameMapping: (keyParts: string[]) => {
    const firstPart = keyParts[0];
    const lastPart = keyParts[keyParts.length - 1];
    if (
      convertToLowerCase(firstPart) === 'liquidations' &&
      convertToLowerCase(lastPart) === 'principal'
    )
      return 'Liquidations Principal';
    if (firstPart === 'fbafullfilment') return 'FBA Fullfilment';
    if (firstPart === 'amazonfees') return 'Amazon Fees';
    if (keyParts.length > 2) {
      const productParts = keyParts.slice(2);
      return productParts
        .map((part) => formatStringToTitleCase(part))
        .join('/');
    }
    return formatStringToTitleCase(lastPart);
  },
  isSettlementDetails: (obj: unknown): obj is ISettlementDetails => {
    if (checkIsNull(obj) || checkIsValidObject(obj) === false) return false;
    return hasProperty(obj, 'settlementDetails');
  },
  getSettlementFees: (
    primaryData: IAmazonProfitabilityGraphResponse[] | null,
    feesKey: string
  ) => {
    const feeTotals: Record<string, number> = {};
    const feeByDate: Record<string, Record<string, string>> = {};

    primaryData?.forEach((item: any) => {
      const fees = hasProperty(item?.settlementDetails, feesKey)
        ? item?.settlementDetails?.[feesKey]
        : null;
      if (fees) {
        Object.entries(fees).forEach(([key, amount]) => {
          const numAmount = parseNum(amount) ?? 0;

          feeTotals[key] = (feeTotals[key] ?? 0) + numAmount;
          if (!feeByDate[key]) feeByDate[key] = {};
          feeByDate[key][item.label] =
            profitabilityUtils.formatCurrency(numAmount);
        });
      }
    });

    return Object.entries(feeTotals)
      .sort((a, b) => a[1] - b[1])
      .map(([key, amount]) => ({
        label: profitabilityUtils.getSettlementDisplayName(key),
        value: profitabilityUtils.formatCurrency(amount),
        dateValues: feeByDate[key] || {},
      }));
  },
  getCogsByTable: (
    isOrdersTable: boolean,
    rowData: Row<IAmazonProfitabilityOrder>
  ) => {
    if (!isOrdersTable) return rowData.original.totalCogs;
    return rowData.original.sellingPartnerId
      ? rowData.original.totalCogs
      : rowData.original.cogs;
  },
  getSettlementDetailsForExport: (data: object) => {
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (key.startsWith('settlementDetails.')) {
        const parsedKey = key.split('.').pop();

        if (parsedKey && !(parsedKey in acc) && parseNum(value) !== 0) {
          acc[parsedKey] = isNaN(value)
            ? value
            : parsedKey === ProfitabilityMetricsKeyEnums.MARGIN
            ? displayValue(formatNum(value))
            : displayValue(formatNum(value), false);
        }

        return acc;
      }

      return acc;
    }, {} as Record<string, any>);
  },
  getOrderDetailsUrlByMarketplace: (
    orderId: string,
    marketplace: MarketplaceEnum
  ) => {
    if (marketplace === MarketplaceEnum.AMAZON)
      return `${
        SellerCentralURLMap[getCountryCode()]
      }/orders-v3/order/${orderId}`;
    return `https://seller.walmart.com/orders/manage-orders?orderGroups=All&poNumber=${orderId}`;
  },
  getFormattedCogsErrResponse: (
    errors: IUploadCogsErrResponse[],
    marketplace: MarketplaceEnum
  ) => {
    return errors.map((err) => {
      return {
        rowNo: `${err.rowNumber}`,
        productName: err.name,
        [marketplace === MarketplaceEnum.AMAZON ? 'ASIN' : 'Item Id']:
          err.asin ?? err.itemId,
        sku: err.sku,
        cogs: err.cogs,
        reasonOfConflict: err.errorReason,
      };
    });
  },
};
