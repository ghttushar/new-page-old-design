// Amazon Profitability Interfaces

import {
  AdvertisingTitlesEnum,
  CountryCodeEnum,
} from '@/enums/advertising.enums';
import { IFinalFilters } from '@/redux/slices/filters/filter.slice';
import {
  ColumnDef,
  ExpandedState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { ISortCriteria } from '../advertising/advertising.interface';
import { Nullable } from '../index.interface';

export interface IAmazonProfitabilityCommonFields {
  asin: string | null;
  sku: string | null;
  cogs: number | null;
  referralFees: number | null;
  promotion: number | null;
  netProfit: number | null;
  margin: number | null;
  estimatedPayout: number | null;
  roi: number | null;
  totalRefundFees: number | null;
  totalAmazonFees: number | null;
  totalSales: number | null;
  totalUnitsSold: number | null;
  totalOrders: number | null;
  totalReturns: number | null;
  totalReturnSales: number | null;
  fbaFees: number | null;
  fbaReturnFees: number | null;
  valueOfReturnedItems: number | null;
  refundPercentage: number | null;
  settlementAmount: number | null;
}

export interface IAmazonProfitabilityOrderItem
  extends IAmazonProfitabilityCommonFields {
  sku: string;
  asin: string;
  hasOrder: boolean;
  hasReturn: boolean;
  itemImgUrl: string;
  itemStatus: string;
  orderUnits: number;
  orderItemId: string;
  productName: string;
  referralFee: number;
  returnUnits: number;
  commissionFees: number;
  principalAmount: number;
  refundReferralFee: number;
  returnPrincipalAmount: number;
  cogs: number;
  amazonFees: number;
  fbaFulfillmentFees: number;
  promotion: number;
}

export interface IAmazonProfitabilityOrder
  extends IAmazonProfitabilityOrderItem,
    ISettlementDetails {
  orderId: string;
  orderStatus: string;
  orderDate: string;
  sellingPartnerId: string;
  totalOrderUnits: number;
  totalPrincipalAmount: number;
  totalOrdersReferralFee: number;
  totalReturnUnits: number;
  totalReturnPrincipalAmount: number;
  totalRefundReferralFee: number;
  totalRefundCommissionFees: number;
  totalCogs: number;
  totalOrdersFbaFulfillmentFees: number;
  totalAmazonFees: number;
  margin: number;
  totalRefundFbaCustomerReturnFees: number;
  countryCode: Nullable<CountryCodeEnum>;
  items: IAmazonProfitabilityOrderItem[] | null;
  bothOrderAndReturn: number | null;
}

export interface IAmazonProfitabilityPagination {
  page: number;
  pageSize: number;
  totalItems: number;
}

export type IAmazonProfitabilityTableData =
  | IAmazonProfitabilityOrder
  | IAmazonProfitabilityProductData;

export interface IAmazonProfitabilityPayload {
  range: string;
  startDate?: string;
  endDate?: string;
  frequency?: string;
  sortCriteria?: ISortCriteria[];
  filters: IFinalFilters[];
  page?: number;
  pageSize?: number;
  searchText?: string;
  searchColumns?: string[];
}

export interface IAmazonProfitabilityDataProps {
  pagination: PaginationState;
  sorting: SortingState;
  allTableColumns: Array<ColumnDef<IAmazonProfitabilityTableData>>;
  setTableData: (data: IAmazonProfitabilityTableData[] | null) => void;
  setSelectedColumns: (
    columns: Array<ColumnDef<IAmazonProfitabilityTableData>>
  ) => void;
  setTotalRowCount: (count: number) => void;
  setExpandedState: (state: ExpandedState) => void;
  isOrdersTable: boolean;
  setPerformanceData?: (data: Array<IAmazonPerformanceMetrics | null>) => void;
  setAggregatedData: (data: IAmazonProfitabilityAggregatedData) => void;
  setChartData: (data: IAmazonProfitabilityGraphResponse[]) => void;
  isPnL?: boolean;
  disablePerformance?: boolean;
}

export interface IAmazonProfitabilityDataReturn {
  isTableLoading: boolean;
  currentTable: AdvertisingTitlesEnum;
  isPerformanceLoading: boolean;
  isGraphLoading: boolean;
  handleDownload: (
    isAllDownload: boolean,
    isPnL: boolean
  ) => Promise<Array<Record<string, unknown>>>;
}
export interface IAmazonProfitabilityProductData
  extends IAmazonProfitabilityCommonFields,
    ISettlementDetails {
  itemName: Nullable<string>;
  imageUrl: Nullable<string>;
  itemPrice: Nullable<number>;
  totalReturns: Nullable<number>;
  totalReturnSales: Nullable<number>;
  overallAdSpend: Nullable<number>;
  overallSpAdSpend: Nullable<number>;
  overallSbAdSpend: Nullable<number>;
  overallSdAdSpend: Nullable<number>;
  overallAdSales: Nullable<number>;
  overallOrganicSales: Nullable<number>;
  overallSpAdSales: Nullable<number>;
  overallSbAdSales: Nullable<number>;
  overallSdAdSales: Nullable<number>;
  tacos: Nullable<number>;
  roas: Nullable<number>;
  acos: Nullable<number>;
  childItemsCount: Nullable<number>;
  childItems: Omit<
    IAmazonProfitabilityProductData,
    'childItems' | 'childItemsCount'
  >;
}

export interface IAmazonProfitabilityAggregatedData {
  overallAdSpend: number | null;
  overallSpAdSpend: number | null;
  overallSbAdSpend: number | null;
  overallSdAdSpend: number | null;
  totalOrders: number | null;
  totalSales: number | null;
  totalUnitsSold: number | null;
  totalReturns: number | null;
  totalReturnSales: number | null;
  overallAdSales: number | null;
  overallSpAdSales: number | null;
  overallSbAdSales: number | null;
  overallSdAdSales: number | null;
  tacos: number | null;
  roas: number | null;
  acos: number | null;
  netProfit: number | null;
  totalAmazonFees: number | null;
  totalRefundFees: number | null;
  estimatedPayout: number | null;
  margin: number | null;
  roi: number | null;
  promotion: number | null;
  totalCogs: number | null;
}

export interface IAmazonPerformanceMetrics extends ISettlementDetails {
  totalSales: number | null;
  totalUnits: number | null;
  cancelledOrdersCount: number | null;
  totalOrders: number | null;
  totalReturns: number | null;
  totalReturnedUnits: number | null;
  totalReturnAmount: number | null;
  totalReturnCommissionAmount: number | null;
  totalReturnReferralAmount: number | null;
  totalAdSpend: number | null;
  spAdSpend: number | null;
  sbAdSpend: number | null;
  sdAdSpend: number | null;
  estimatedPayout: number | null;
  margin: number | null;
  roi: number | null;
  totalRefundFees: number | null;
  totalAmazonFees: number | null;
  netProfit: number | null;
  organicSales: number | null;
  spAdSales: number | null;
  sbAdSales: number | null;
  sdAdSales: number | null;
  organicAdUnits: number | null;
  spAdUnits: number | null;
  sbAdUnits: number | null;
  sdAdUnits: number | null;
  cogs: number | null;
  promotion: number | null;
  grossProfit: number | null;
  totalReferralFees: number | null;
  fbaTotalFees: number | null;
  valueOfReturnedItems: number | null;
  operationalExpenses: number | null;
  deferredReturnAmount: number | null;
  deferredReturnCommissionAmount: number | null;
  deferredReturnReferralAmount: number | null;
  deferredReturnUnits: number | null;
}

export interface IAmazonProfitabilityGraphResponse
  extends IAmazonPerformanceMetrics {
  label: string;
  sku: string | null;
  asin: string;
  itemName: string | null;
  imageUrl: string | null;
  listPrice: number | null;
}

export interface IAsinSkuMapping {
  asin: string;
  sku: string;
}

export interface IAmazonPnLProducts {
  asin: string;
  productName: string | null;
  imageUrl: string | null;
  sku: string | null;
  price: number | null;
}

export interface ISettlementDetails {
  settlementDetails: {
    refundFees: Record<string, Nullable<string | number>>;
    amazonFees: Record<string, Nullable<string | number>>;
    totalRefundFees: Nullable<string | number>;
    totalAmazonFees: Nullable<string | number>;
    netProfit: Nullable<string | number>;
    estimatedPayout: Nullable<string | number>;
    margin: Nullable<string | number>;
    roi: Nullable<string | number>;
  } | null;
}
