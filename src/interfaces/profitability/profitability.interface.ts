import { IScatterChartDataPoint } from '@/app/components/common/custom-scatter-plot/custom-scatter-plot.interface';
import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { IProfitabilityTrendsTableRow } from '@/app/components/page-components/profitability/profitability-trends-table/profitability-trends-table';
import { CountryCodeEnum, SortOrderEnum } from '@/enums/advertising.enums';
import {
  ProfitabilitySearchColumnsEnum,
  ProfitabilityTableTypeEnum,
} from '@/enums/profitability.enums';
import { Frequency, MarketplaceEnum, Range } from '@/enums/serp.enums';
import { IFinalFilters } from '@/redux/slices/filters/filter.slice';
import { IProfitabilityFilterForm } from '@/redux/slices/profitability/profitability.slice';
import {
  ColumnDef,
  ExpandedState,
  OnChangeFn,
  PaginationState,
  RowModel,
  SortingState,
} from '@tanstack/react-table';
import {
  CartesianScaleTypeRegistry,
  ChartData,
  Point,
  ScaleOptionsByType,
} from 'chart.js';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { ISortCriteria } from '../advertising/advertising.interface';
import {
  IMultiSelectDropdownItem,
  IMultiSelectProductSearchDropdownItem,
} from '../dropdown.interfaces';
import { Nullable } from '../index.interface';
import { IDownloadPayload } from '../keyword-actions.interface';
import { IDateRange } from '../serp.interface';
import { IAsinSkuMapping } from './amazon-profitability.interface';

export type { OnChangeFn } from '@tanstack/react-table';

export interface IProfitabilityGraphResponse {
  partnerId: Nullable<string>;
  totalSalesDateLabel: Nullable<string>;
  authOrders: Nullable<number>;
  authUnits: Nullable<number>;
  authSales: Nullable<number>;
  gmvSales: Nullable<number>;
  gmvUnits: Nullable<number>;
  totalUnitsReturned: Nullable<number>;
  totalReturnsValue: Nullable<number>;
  cancelledSales: Nullable<number>;
  cancelledUnits: Nullable<number>;
  walmartWfsUnits: Nullable<number>;
  walmartWfsSales: Nullable<number>;
  walmartSellerUnits: Nullable<number>;
  walmartSellerSales: Nullable<number>;
  walmart3plUnits: Nullable<number>;
  walmart3plSales: Nullable<number>;
  overallAdSpend: Nullable<number>;
  overallAdOrders: Nullable<number>;
  overallAdUnits: Nullable<number>;
  overallAdSales: Nullable<number>;
  spAdSpend: Nullable<number>;
  spAdOrders: Nullable<number>;
  spAdUnits: Nullable<number>;
  spAdSales: Nullable<number>;
  sbAdSpend: Nullable<number>;
  sbAdOrders: Nullable<number>;
  sbAdUnits: Nullable<number>;
  sbAdSales: Nullable<number>;
  svAdSpend: Nullable<number>;
  svAdOrders: Nullable<number>;
  svAdUnits: Nullable<number>;
  svAdSales: Nullable<number>;
  roas: Nullable<number>;
  tacos: Nullable<number>;
  netProfit: Nullable<number>;
}

export interface IProfitabilityGraphPayload extends Partial<IDownloadPayload> {
  range: Range;
  startDate?: string;
  endDate?: string;
  frequency?: Frequency;
  sortCriteria?: ISortCriteria[];
  filters?: IFinalFilters[];
  page?: number;
  pageSize?: number;
  searchText?: string;
  searchColumns?: ProfitabilitySearchColumnsEnum[];
  asinSkuMapping?: IAsinSkuMapping[];
  asinSkuGroupBy?: boolean;
  sortOrder?: SortOrderEnum;
}

export type IProfitabilityScales =
  | _DeepPartialObject<{
      [key: string]: ScaleOptionsByType<keyof CartesianScaleTypeRegistry>;
    }>
  | undefined;

export interface IProfitabilityMetricConfig<T> {
  key: keyof T;
  label: string;
}

export interface IProfitabilityGraphMetricsConfig<T>
  extends IProfitabilityMetricConfig<T> {
  yAxisID: string;
}

export interface IProfitabilityGraphProps<T> {
  chartData: Nullable<ChartData<'line'>>;
  selectedMetricsData: Nullable<Array<IProfitabilityGraphMetricsConfig<T>>>;
  formattedXAxisText: string;
  expandGraph: boolean;
  handleExpandClose: () => void;
  chartTitle: string;
  handleTableEmptyReset: () => void;
}

export interface IProfitabilityPerformanceMetrics {
  partnerId: string | null;
  totalAuthOrders: number | null;
  organicOrders: number | null;
  spAdOrders: number | null;
  sbAdOrders: number | null;
  svAdOrders: number | null;
  totalAuthSales: number | null;
  organicSales: number | null;
  spAdSales: number | null;
  sbAdSales: number | null;
  svAdSales: number | null;
  totalAuthUnits: number | null;
  organicUnits: number | null;
  spAdUnits: number | null;
  sbAdUnits: number | null;
  svAdUnits: number | null;
  unitsReturned: number | null;
  cancelledUnits: number | null;
  totalExpenses: number | null;
  totalAdSpend: number | null;
  spAdSpend: number | null;
  sbAdSpend: number | null;
  svAdSpend: number | null;
  totalWalmartAdjustment: number | null;
  commissionOnProduct: number | null;
  commissionOnShipping: number | null;
  wfsFulfillmentFee: number | null;
  extraDiscount: number | null;
  promoCode: number | null;
  otherTaxFees: number | null;
  productTax: number | null;
  productTaxWithheld: number | null;
  excessRefundAdjustment: number | null;
  walmartFundedSavings: number | null;
  disputeSettlementAmount: number | null;
  totalRefundCost: number | null;
  returnSales: number | null;
  cancelledSales: number | null;
  totalShippingCost: number | null;
  shipping: number | null;
  shippingTax: number | null;
  shippingTaxWithheld: number | null;
  wfsReturnShippingFee: number | null;
  walmartReturnShippingCharge: number | null;
  roas: number | null;
  tacos: number | null;
  netProfit: number | null;
  additionalFee: number | null;
  totalGMVSales: number | null;
  estimatedPayout: number | null;
  totalCogsForOrderedUnits: number | null;
  additionalFeeBreakdownCharge: Array<Record<string, number>> | null;
}

export interface ITransactionAmountItem {
  amountType: string;
  amountDescription: string;
  amount: number;
}

export interface IAccordionItem {
  label: string;
  value: string;
  percentage?: string;
  children?: IAccordionItem[];
  amount?: number | null;
}

export interface ProfitabilityAccordionProps {
  activeCardNumber: number;
  handleClose: () => void;
  expandedItems: Set<string>;
  setExpandedItems: (itemId: string, activeCardNumber: number) => void;
  isLoading: boolean;
  isTable?: boolean;
  totalExpandableItems: number;
  accordionData: IAccordionItem[];
  calculatedMetrics: IProfitabilityCardMetricDisplay[];
}

export interface IProfitabilityCardMetricDisplay {
  key: string;
  label: string;
  currValue: string | number;
  prevValue?: string | number;
}

export interface IProfitabilityCardProps {
  isSelected: boolean;
  index: number;
  title: string;
  dateRange: string;
  metrics: IProfitabilityCardMetricDisplay[];
  setSelectedCard: (val: number) => void;
  isExpanded: boolean;
  setIsExpanded: (val: boolean, index: number) => void;
  isLoading?: boolean;
  onCustomDateRangeChange: (range: IDateRange) => void;
  selectedCustomDateRange?: IDateRange;
}

export interface IProfitabilityHomeTable {
  partnerId: Nullable<string>;
  purchaseOrderSku: Nullable<string>;
  purchaseOrderProductName: Nullable<string>;
  purchaseOrderItemId: Nullable<string>;
  purchaseOrderItemImage: Nullable<string>;
  purchaseOrderLineQuantity: Nullable<number>;
  purchaseStatus: Nullable<string>;
  productPrice: Nullable<number>;
  totalUnitsSold: Nullable<number>;
  orderUnits: Nullable<number>;
  refundUnits: Nullable<number>;
  cancelledUnits: Nullable<number>;
  totalSales: Nullable<number>;
  totalExpenses: Nullable<number>;
  totalWalmartAdjustment: Nullable<number>;
  orderSales: Nullable<number>;
  refundSales: Nullable<number>;
  cancelledSales: Nullable<number>;
  totalShippingCost: Nullable<number>;
  failedReturnDeliveryProcessingCharge: Nullable<number>;
  commissionOnProduct: Nullable<number>;
  customerReturnReversal: Nullable<number>;
  commissionOnShipping: Nullable<number>;
  excessRefundAdjustment: Nullable<number>;
  extraDiscount: Nullable<number>;
  otherTaxFees: Nullable<number>;
  productTax: Nullable<number>;
  productTaxWithheld: Nullable<number>;
  promoCode: Nullable<number>;
  walmartFundedSavings: Nullable<number>;
  wfsFulfillmentFee: Nullable<number>;
  shipping: Nullable<number>;
  shippingTax: Nullable<number>;
  shippingTaxWithheld: Nullable<number>;
  wfsReturnShippingFee: Nullable<number>;
  walmartReturnShippingCharge: Nullable<number>;
  netProfit: Nullable<number>;
  additionalFee: Nullable<number>;
  additionalFeeBreakdownCharge: Nullable<Array<Record<string, number>>>;
  cogs: Nullable<number>;
  cogsPerUnit: Nullable<number>;
  subRows: Nullable<IProfitabilityOrdersData[]>;
  overallAdSpend: Nullable<number>;
  overallAdOrders: Nullable<number>;
  overallAdUnits: Nullable<number>;
  overallAdSales: Nullable<number>;
  spAdSpend: Nullable<number>;
  spAdOrders: Nullable<number>;
  spAdUnits: Nullable<number>;
  spAdSales: Nullable<number>;
  sbAdSpend: Nullable<number>;
  sbAdOrders: Nullable<number>;
  sbAdUnits: Nullable<number>;
  sbAdSales: Nullable<number>;
  svAdSpend: Nullable<number>;
  svAdOrders: Nullable<number>;
  svAdUnits: Nullable<number>;
  svAdSales: Nullable<number>;
}

export interface IProfitabilityOrdersData extends IProfitabilityHomeTable {
  orderDateLabel: Nullable<string>;
  purchaseOrderId: Nullable<string>;
  purchaseOrderLine: Nullable<string>;
}

export interface IProfitabilityProductsData extends IProfitabilityHomeTable {
  totalExpenses: number;
  totalWalmartAdjustment: number;
  customerReturnReversal: number;
  totalShippingCost: number;
  failedReturnDeliveryProcessingCharge: number;
  itemInventory: Nullable<number>;
  orderCount: Nullable<number>;
}

export type IProfitabilityTableData =
  | IProfitabilityProductsData
  | IProfitabilityOrdersData;

export interface IProfitabilityPnLResponse {
  partnerId: Nullable<string>;
  dateLabel: Nullable<string>;
  totalAuthOrders: Nullable<number>;
  organicOrders: Nullable<number>;
  spAdOrders: Nullable<number>;
  sbAdOrders: Nullable<number>;
  svAdOrders: Nullable<number>;
  totalAuthSales: Nullable<number>;
  organicSales: Nullable<number>;
  spAdSales: Nullable<number>;
  sbAdSales: Nullable<number>;
  svAdSales: Nullable<number>;
  totalAuthUnits: Nullable<number>;
  organicUnits: Nullable<number>;
  spAdUnits: Nullable<number>;
  sbAdUnits: Nullable<number>;
  svAdUnits: Nullable<number>;
  unitsReturned: Nullable<number>;
  cancelledUnits: Nullable<number>;
  totalExpenses: Nullable<number>;
  totalAdSpend: Nullable<number>;
  spAdSpend: Nullable<number>;
  sbAdSpend: Nullable<number>;
  svAdSpend: Nullable<number>;
  totalWalmartAdjustment: Nullable<number>;
  commissionOnProduct: Nullable<number>;
  commissionOnShipping: Nullable<number>;
  wfsFulfillmentFee: Nullable<number>;
  extraDiscount: Nullable<number>;
  promoCode: Nullable<number>;
  otherTaxFees: Nullable<number>;
  productTax: Nullable<number>;
  productTaxWithheld: Nullable<number>;
  excessRefundAdjustment: Nullable<number>;
  walmartFundedSavings: Nullable<number>;
  disputeSettlementAmount: Nullable<number>;
  totalRefundCost: Nullable<number>;
  returnSales: Nullable<number>;
  cancelledSales: Nullable<number>;
  totalShippingCost: Nullable<number>;
  shipping: Nullable<number>;
  shippingTax: Nullable<number>;
  shippingTaxWithheld: Nullable<number>;
  wfsReturnShippingFee: Nullable<number>;
  walmartReturnShippingCharge: Nullable<number>;
  roas: Nullable<number>;
  tacos: Nullable<number>;
  netProfit: Nullable<number>;
  additionalFee: Nullable<number>;
  additionalFeeBreakdownCharge: Nullable<Array<Record<string, number>>>;
}

export interface IProfitabilityTotalResponse {
  totalSales?: Nullable<number>;
  totalOrderSales?: Nullable<number>;
  totalOrdersCount?: Nullable<number>;
  totalRefundSales?: Nullable<number>;
  totalCancelledSales?: Nullable<number>;
  totalUnitsSold?: Nullable<number>;
  totalOrderUnits?: Nullable<number>;
  totalRefundUnits?: Nullable<number>;
  totalCancelledUnits?: Nullable<number>;
  totalCommissionOnProduct?: Nullable<number>;
  totalCommissionOnShipping?: Nullable<number>;
  totalWfsFulfillmentFee?: Nullable<number>;
  totalExtraDiscount?: Nullable<number>;
  totalPromoCode?: Nullable<number>;
  totalOtherTaxFees?: Nullable<number>;
  totalProductTax?: Nullable<number>;
  totalProductTaxWithheld?: Nullable<number>;
  totalExcessRefundAdjustment?: Nullable<number>;
  totalWalmartFundedSavings?: Nullable<number>;
  totalShipping?: Nullable<number>;
  totalShippingTax?: Nullable<number>;
  totalShippingTaxWithheld?: Nullable<number>;
  totalWfsReturnShippingFee?: Nullable<number>;
  totalWalmartReturnShippingCharge?: Nullable<number>;
  totalWalmartAdjustment?: Nullable<number>;
  totalShippingCost?: Nullable<number>;
  totalExpenses?: Nullable<number>;
  totalNetProfit?: Nullable<number>;
  totalCogsForOrderedUnits?: Nullable<number>;
  totalCogs?: Nullable<number>;
  totalAmazonFees?: Nullable<number>;
  totalOrdersFbaFulfillmentFees?: Nullable<number>;
  totalFbaFulfillmentFees?: Nullable<number>;
  totalRefundFbaCustomerReturnFees?: Nullable<number>;
}

export interface ITableColumn {
  id: string;
  label: string;
  width: number;
  type: 'parameter' | 'date' | 'total';
  dateLabel?: Nullable<string>;
}

export interface IExtendedAccordionItem extends IAccordionItem {
  dateValues?: Record<string, string>;
  children?: IExtendedAccordionItem[];
}

export interface IFlatRowData extends IExtendedAccordionItem {
  id: string;
  level: number;
  parentId: string;
  index: number;
  hasChildren: boolean;
}

export interface DateColumnConfig {
  dateHeaderClassName?: string;
  dateCellClassName?: string;
  noDataText?: string;
  skeletonWidth?: string;
  skeletonHeight?: string;
}

export interface DateRowData {
  dateValues?: Record<string, string>;
}

export interface ITotalProductData {
  totalSales: Nullable<number>;
  totalOrderSales: Nullable<number>;
  totalRefundSales: Nullable<number>;
  totalCancelledSales: Nullable<number>;
  totalUnitsSold: Nullable<number>;
  totalOrderUnits: Nullable<number>;
  totalRefundUnits: Nullable<number>;
  totalCancelledUnits: Nullable<number>;
  totalProductsCount: Nullable<number>;
  totalOverallAdSpend: Nullable<number>;
  totalOverallAdOrders: Nullable<number>;
  totalOverallAdUnits: Nullable<number>;
  totalOverallAdSales: Nullable<number>;
  totalSpAdSpend: Nullable<number>;
  totalSpAdOrders: Nullable<number>;
  totalSpAdUnits: Nullable<number>;
  totalSpAdSales: Nullable<number>;
  totalSbAdSpend: Nullable<number>;
  totalSbAdOrders: Nullable<number>;
  totalSbAdUnits: Nullable<number>;
  totalSbAdSales: Nullable<number>;
  totalSvAdSpend: Nullable<number>;
  totalSvAdOrders: Nullable<number>;
  totalSvAdUnits: Nullable<number>;
  totalSvAdSales: Nullable<number>;
  totalCommissionOnProduct: Nullable<number>;
  totalCommissionOnShipping: Nullable<number>;
  totalWfsFulfillmentFee: Nullable<number>;
  totalExtraDiscount: Nullable<number>;
  totalPromoCode: Nullable<number>;
  totalOtherTaxFees: Nullable<number>;
  totalProductTax: Nullable<number>;
  totalProductTaxWithheld: Nullable<number>;
  totalExcessRefundAdjustment: Nullable<number>;
  totalWalmartFundedSavings: Nullable<number>;
  totalCustomerReturnReversal: Nullable<number>;
  totalShipping: Nullable<number>;
  totalShippingTax: Nullable<number>;
  totalShippingTaxWithheld: Nullable<number>;
  totalWfsReturnShippingFee: Nullable<number>;
  totalWalmartReturnShippingCharge: Nullable<number>;
  totalFailedReturnDeliveryProcessingCharge: Nullable<number>;
  totalAdditionalFee: Nullable<number>;
  totalWalmartAdjustment: Nullable<number>;
  totalShippingCost: Nullable<number>;
  totalExpenses: Nullable<number>;
  totalNetProfit: Nullable<number>;
}

export interface ITrendsTotal {
  orderDateLabel: Nullable<string>;
  totalSales: Nullable<number>;
  orderSales: Nullable<number>;
  refundSales: Nullable<number>;
  cancelledSales: Nullable<number>;
  totalUnitsSold: Nullable<number>;
  orderUnits: Nullable<number>;
  refundUnits: Nullable<number>;
  cancelledUnits: Nullable<number>;
  totalExpenses: Nullable<number>;
  totalWalmartAdjustment: Nullable<number>;
  commissionOnProduct: Nullable<number>;
  commissionOnShipping: Nullable<number>;
  wfsFulfillmentFee: Nullable<number>;
  extraDiscount: Nullable<number>;
  promoCode: Nullable<number>;
  otherTaxFees: Nullable<number>;
  productTax: Nullable<number>;
  productTaxWithheld: Nullable<number>;
  excessRefundAdjustment: Nullable<number>;
  walmartFundedSavings: Nullable<number>;
  customerReturnReversal: Nullable<number>;
  totalShippingCost: Nullable<number>;
  shipping: Nullable<number>;
  shippingTax: Nullable<number>;
  shippingTaxWithheld: Nullable<number>;
  wfsReturnShippingFee: Nullable<number>;
  walmartReturnShippingCharge: Nullable<number>;
  failedReturnDeliveryProcessingCharge: Nullable<number>;
  netProfit: Nullable<number>;
  additionalFee: Nullable<number>;
  productCount: Nullable<number>;
  totalRecords: Nullable<number>;
}

export interface IProductDetails {
  sku: string;
  itemId: string;
  productName: string;
  price: number;
  wpid?: string;
  gtin?: string;
  upc?: string;
  primaryImageUrl: Nullable<string>;
  cogs?: Nullable<number>;
}

export interface IUploadCOGSDialogProps {
  open: boolean;
  onClose: () => void;
  imgUrl: string;
  name: string;
  sku: string;
  itemId: string;
  cogs?: Nullable<number>;
  marketplace: MarketplaceEnum;
}
export interface amazonProductInterface {
  partnerId: string;
  purchaseOrderSku: string;
  purchaseOrderProductName: string;
  productPrice: number;
  purchaseOrderItemId: string;
  purchaseOrderItemImage: string;
  itemInventory: number;
  cogs: number;
  totalSales: number;
  orderSales: number;
  refundSales: number;
  cancelledSales: number;
  totalUnitsSold: number;
  orderUnits: number;
  refundUnits: number;
  cancelledUnits: number;
  overallAdSpend: number;
  overallAdOrders: number;
  overallAdUnits: number;
  overallAdSales: number;
  spAdSpend: number;
  spAdOrders: number;
  spAdUnits: number;
  spAdSales: number;
  sbAdSpend: number;
  sbAdOrders: number;
  sbAdUnits: number;
  sbAdSales: number;
  svAdSpend: number;
  svAdOrders: number;
  svAdUnits: number;
  svAdSales: number;
  totalExpenses: number;
  totalWalmartAdjustment: number;
  commissionOnProduct: number;
  commissionOnShipping: number;
  wfsFulfillmentFee: number;
  extraDiscount: number;
  promoCode: number;
  otherTaxFees: number;
  productTax: number;
  productTaxWithheld: number;
  excessRefundAdjustment: number;
  walmartFundedSavings: number;
  customerReturnReversal: number;
  totalShippingCost: number;
  shipping: number;
  shippingTax: number;
  shippingTaxWithheld: number;
  wfsReturnShippingFee: number;
  walmartReturnShippingCharge: number;
  failedReturnDeliveryProcessingCharge: number;
  netProfit: number;
  additionalFee: number;
  additionalFeeBreakdownCharge: AdditionalFeeBreakdownCharge[];
}

export interface AdditionalFeeBreakdownCharge {
  'California Mattress Haul Away Fees': number;
}

export interface IScatterPlotDataPoint<T> extends IScatterChartDataPoint {
  productName: string;
  asin?: string;
  sku: string;
  selectedMetricKey: keyof T;
  profitMargin: number;
  imgUrl: string;
  selectedMetricValue: string | number | undefined;
}

export interface IProfitMarginScatterPlotProps<T> {
  processedChartData: IScatterPlotDataPoint<T>[] | null;
  isLoading: boolean;
  height?: number;
  metricLabel: string;
}

export interface IProfitMarginScatterData {
  productName: string;
  imgUrl: string;
  sku: string;
  profitMargin: number;
  adSales: number;
  x: number;
  y: number;
}

export interface GroupedDataItem<T> {
  productName: string;
  imageUrl: Nullable<string>;
  items: T[];
  productPrice: number;
  sku: string;
  itemId: string;
}

export interface ProfitabilityTrendsTableProps<
  T = IProfitabilityTrendsTableRow,
  P = ITrendsTotal
> {
  data: Nullable<T[]>;
  isLoading: boolean;
  metricKey?: string;
  trendsTotalData: P[];
  uniqueDates: string[];
  marketplace: MarketplaceEnum;
  getTrendsData: (data: RowModel<T>) => void;
}

export interface IProfitabilityTrendsPageViewProps<T, G, P> {
  selectedMetric: IDropdownItem<string>;
  trendsData: T[] | null;
  processedChartData: IScatterPlotDataPoint<G>[] | null;
  trendsTotalData: P[];
  uniqueDates: string[];
  isDataLoading: boolean;
  isApplyDisabled: boolean;
  metricOptions: IDropdownItem<string>[];
  rangeOptions: IDropdownItem<string>[];
  onRangeSelect: (range: IDropdownItem<string>) => void;
  onCustomDateRangeChange: (dateRange: IDateRange) => void;
  onMetricSelect: (metric: IDropdownItem<string>) => void;
  onApply: () => void;
  onDownload: (isAllDownload: boolean) => Promise<Record<string, unknown>[]>;
  setSelectedFrequency: (freq: IDropdownItem<Frequency>) => void;
  metricKey?: string;
  onProductSelect: (
    selectedOptions: IMultiSelectProductSearchDropdownItem[]
  ) => void;
  marketplace: MarketplaceEnum;
  productInfo: IMultiSelectProductSearchDropdownItem[] | null;
  isProductDataLoading: boolean;
}

export interface ProfitabilityHomePageViewProps<T, G> {
  headerFilters: IProfitabilityFilterForm;
  totalData: Nullable<IProfitabilityTotalResponse | ITotalProductData>;
  chartData: Nullable<ChartData<'line', Nullable<number | Point>[], unknown>>;
  tableData: Nullable<T[]>;
  transformedPerformanceData: Array<
    Nullable<IProfitabilityCardMetricDisplay[]>
  >;
  selectedMetricsData: IProfitabilityGraphMetricsConfig<G>[];
  totalExpandableItems: number;
  activePerformanceBox: number;
  isOrdersTable: boolean;
  isExpanded: boolean;
  expandedItems: Set<string>;
  tableAccordionExpandedItems: Set<string>;
  totalRowCount: number;
  pagination: PaginationState;
  expandedState: ExpandedState;
  selectedColumns: ColumnDef<T>[];
  allTableColumns: ColumnDef<T>[];
  sorting: SortingState;
  isGraphLoading: boolean;
  isPerformanceLoading: boolean;
  isTableLoading: boolean;
  currentTable: ProfitabilityTableTypeEnum;
  onRangeSelect: (range: IDropdownItem<string>) => void;
  setCustomDateRange: (customDateRange: IDateRange) => void;
  handleApply: () => void;
  setSelectedBox: (val: number) => void;
  onMetricsSelect: (options: IMultiSelectDropdownItem[]) => void;
  onFrequencySelect: (value: IDropdownItem<Frequency>) => void;
  setSelectedColumnsHandler: (selectedColumns: Array<ColumnDef<T>>) => void;
  handleTableTypeSwitch: () => void;
  onAccordionMetricsExpand: (itemId: string, index: number) => void;
  onTableAccordionMetricsExpand: (itemId: string, index: number) => void;
  handleTableDownload: (
    isAllDownload: boolean
  ) => Promise<{ [key: string]: unknown }[]>;
  setPagination: OnChangeFn<PaginationState>;
  setSorting: OnChangeFn<SortingState>;
  setExpandedState: OnChangeFn<ExpandedState>;
  setIsExpanded: (isExpanded: boolean) => void;
  formattedRangeFreq: string;
  performanceCalculatedMetrics: IProfitabilityCardMetricDisplay[];
  tableCalculatedMetrics: IProfitabilityCardMetricDisplay[];
  accordionData: IAccordionItem[];
  onCustomDateRangeChange: (index: number, range: IDateRange) => void;
  marketplace: MarketplaceEnum;
}

export interface IOrderDetails {
  orderId: Nullable<string>;
  isLoading: boolean;
  isHome?: boolean;
  productName: Nullable<string>;
  sku: Nullable<string>;
  orderDate: Nullable<string>;
  imgUrl: Nullable<string>;
  productId: Nullable<string>;
  purchaseStatus: Nullable<string>;
  productPrice: Nullable<number>;
  cogs: Nullable<number>;
  canExpand: boolean;
  isExpanded: boolean;
  getToggleExpandedHandler: () => () => void;
  countryCode?: Nullable<CountryCodeEnum>;
  marketplace?: MarketplaceEnum;
}

export interface IProfitScatterTooltipData {
  productName: string;
  asin?: string;
  sku?: string;
  profitMargin: number;
  imgUrl: string;
  selectedMetricKey: string;
  selectedMetricValue: string | number | undefined;
}
