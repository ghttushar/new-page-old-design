import { MetaTypeEnum } from '@/enums/monitoring.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { Params } from 'react-router-dom';
import { ISOVExportData } from 'src/app/components/common/table-header/table-header';
import {
  AmazonAdvertisingTableTypesEnum,
  SortOrderEnum,
  WalmartAdvertisingTableTypeEnum,
} from 'src/enums/advertising.enums';
import { BulkActionKeyEnum } from 'src/enums/bulk-action.enums';
import { IFinalFilters } from 'src/redux/slices/filters/filter.slice';
import {
  IExportAdGroupTableData,
  IExportCampaignTableData,
  IExportKeywordTableData,
  IExportProductTableData,
} from '../analysis.interface';
import { IBrandAnalyticsProductData } from '../brand-analytics.interfaces';
import { IPagination, Nullable } from '../index.interface';
import { IKeywordActionData } from '../keyword-actions.interface';
import { IKeywordSOVTable } from '../keyword-sov.interface';
import { IProductSOVTableData } from '../product-sov.interface';
import {
  IProfitabilityTotalResponse,
  ITotalProductData,
} from '../profitability/profitability.interface';
import { IExportKeyword, ISerpProductData, ISOV } from '../serp.interface';
import { IOverallAdvertisingData } from './amazon/overall-advertising.interface';
import { ISBAdvertisingData } from './amazon/sb-advertising.interface';
import { ISDAdvertisingData } from './amazon/sd-advertising.interface';
import {
  IAdvertisingFilter,
  IAdvertisingNavigationBarOption,
  ISPAdvertisingData,
} from './amazon/sp-advertising.interface';
import { IWalmartOverallAdvertisingData } from './walmart/walmart-overall-advertising.interface';
import { IWalmartSBAdvertisingData } from './walmart/walmart-sb-advertising.interface';
import { IWalmartSPAdvertisingData } from './walmart/walmart-sp-advertising.interface';
import { IWalmartSVAdvertisingData } from './walmart/walmart-sv-advertising.interface';

export interface IRadioSelect<T> {
  label: string;
  value: T;
  isDisabled?: boolean;
  selected?: boolean;
  tooltipText?: string;
  description?: string;
}

export interface IPaginatedResponse<T> {
  pagination: IPagination;
  data: T;
}

export interface IAdvertisingPayload {
  range: string;
  table?: string;
  startDate?: string;
  endDate?: string;
  campaignId?: string | number;
  adGroupId?: string | number;
}

export interface IAdvertisingBody {
  filters: IFinalFilters[];
  payload: IAdvertisingPayload;
}

export type IAllTableData =
  | IKeywordActionData[]
  | IExportKeyword[]
  | ISOV[]
  | ISOVExportData[]
  | IExportCampaignTableData[]
  | IExportAdGroupTableData[]
  | IExportProductTableData[]
  | ISerpProductData[]
  | IBrandAnalyticsProductData[]
  | IExportKeywordTableData[]
  | IKeywordSOVTable[]
  | IProductSOVTableData[];

export type IAdvertisingTableInterfaces =
  | IOverallAdvertisingData
  | ISPAdvertisingData
  | ISBAdvertisingData
  | ISDAdvertisingData
  | IWalmartSPAdvertisingData
  | IWalmartSBAdvertisingData
  | IWalmartSVAdvertisingData
  | IWalmartOverallAdvertisingData;

export type IAdvertisingInterfaces =
  | IAdvertisingTableInterfaces
  | IExportCampaignTableData
  | IExportAdGroupTableData
  | IExportProductTableData
  | IExportKeywordTableData;

export type IAdvertisingArrayData =
  | IOverallAdvertisingData[]
  | ISPAdvertisingData[]
  | ISBAdvertisingData[]
  | ISDAdvertisingData[]
  | IWalmartSPAdvertisingData[]
  | IWalmartSBAdvertisingData[]
  | IWalmartSVAdvertisingData[]
  | IWalmartOverallAdvertisingData[];

export type IExportTableData =
  | IExportCampaignTableData[]
  | IExportAdGroupTableData[]
  | IExportProductTableData[]
  | IExportKeywordTableData[];

export type IEditAccessArrayData = IAdvertisingArrayData;

export interface ISortCriteria {
  columnName: string;
  sortOrder: SortOrderEnum;
}

export interface IPerformancePayload extends IAdvertisingPayload {
  frequency?: string;
}

export interface IAdvertisingPerformanceRequestBody {
  filters: IFinalFilters[];
  payload: IPerformancePayload;
  searchText: string;
  searchColumns: Array<string>;
  tab?: AmazonAdvertisingTableTypesEnum | WalmartAdvertisingTableTypeEnum;
}

export interface ITableFooterData
  extends Partial<IProfitabilityTotalResponse>,
    Partial<ITotalProductData> {
  totalProducts?: number | null;
  impressions?: number | null;
  inputQuantity?: number | null;
  availToSellQuantity?: number | null;
  clicks?: number | null;
  totalSales?: number | null;
  adSpend?: number | null;
  adSales?: number | null;
  unitsSold?: number | null;
  adOrders?: number | null;
  cancelledOrders?: number | null;
  cancelledSalesPrice?: number | null;
  commission?: number | null;
  gmvCommission?: number | null;
  refundOrders?: number | null;
  refundSales?: number | null;
  grossSales?: number | null;
  grossUnitsSold?: number | null;
  ctr?: number | null;
  cpc?: number | null;
  cvrOrderBased?: number | null;
  cvrUnitSoldBased?: number | null;
  advertisedSkuSales?: number | null;
  advertisedSkuUnits?: number | null;
  advertiserId?: number | null;
  completeViewAdSales?: number | null;
  completeViewAdUnits?: number | null;
  completeViewOrders?: number | null;
  cvrOrdersSoldBased?: number | null;
  cvrUnitsSoldBased?: number | null;
  ntbOrders?: number | null;
  ntbSales?: number | null;
  ntbUnits?: number | null;
  otherCompleteViewAdSales?: number | null;
  otherSkuSales?: number | null;
  otherSkuUnits?: number | null;
  percentNtbOrders?: number | null;
  percentNtbSales?: number | null;
  percentNtbUnits?: number | null;
  roas?: number | null;
  acos?: number | null;
  vctr?: number | null;
  video5SecondViewRate?: number | null;
  video5SecondViews?: number | null;
  videoCompleteViews?: number | null;
  videoFirstQuartileViews?: number | null;
  videoImpressions?: number | null;
  videoMidpointViews?: number | null;
  videoThirdQuartileViews?: number | null;
  videoUnmutes?: number | null;
  viewableImpressions?: number | null;
  viewThroughAdOrders?: number | null;
  viewThroughAdSales?: number | null;
  viewThroughAdUnits?: number | null;
  vtr?: number | null;
  dailyBudget?: number | null;
  totalBudget?: number | null;
  budget?: number | null;
  inStoreAttributedSales?: number | null;
  inStoreAdvertisedSales?: number | null;
  inStoreOtherSales?: number | null;
  inStoreUnitsSold?: number | null;
  inStoreOrders?: number | null;
  omniChannelSales?: number | null;
  omniChannelRoas?: number | null;
}

export type IAdvertisingParams = {
  campaignId: string;
  adGroupId?: string;
} & Pick<Params<string>, never>;

export interface IAdvertisingCampLevelSubWrapperProps<T> {
  campaignId: string;
  campaignSubHeaderData: T;
  isSubHeaderLoading: boolean;
  updatedPerformanceOptions: IAdvertisingNavigationBarOption[];
  getFilters: (
    isDownload: boolean,
    downloadWithFilter: boolean
  ) => IAdvertisingFilter;
  advertisingFiltersWithNoDownload: IAdvertisingFilter;
}

export interface IAdvertisingAdGroupLevelSubWrapperProps<T, K> {
  campaignId: string;
  adGroupId: string;
  adGroupSubHeaderData: T;
  selectedCampaign: K;
  isSubHeaderLoading: boolean;
  updatedPerformanceOptions: IAdvertisingNavigationBarOption[];
  getFilters: (
    isDownload: boolean,
    downloadWithFilter: boolean
  ) => IAdvertisingFilter;
  advertisingFiltersWithNoDownload: IAdvertisingFilter;
}

export interface IAdvertisingAdGroupLevelProps<T> {
  selectedCampaign: T;
  // IWalmartCampaign
  //     | ICampaign
  //     | ISBCampaign
  //     | ISDCampaign
  //     | IWalmartSVCampaign
}

export interface IAccountPayloadDetails extends IAdvertisingPayloadDetails {
  accountId: string;
}

export interface IAdvertisingPayloadDetails {
  marketplace: MarketplaceEnum;
  metaId: string;
  metaType: MetaTypeEnum;
}

export interface IUploadCogsErrResponse {
  rowNumber: number;
  errorReason: string;
  name: string;
  itemId?: string;
  asin?: string;
  cogs: string;
  promo?: Nullable<string>;
  sku?: Nullable<string>;
}

export interface IUploadCogsResult {
  errors: IUploadCogsErrResponse[];
  successfulRecords: number;
  unsuccessfulRecords: number;
}

export interface IBulkActionContext {
  title: string;
  selectedTargetingType: string;
  selectedMarketplace: MarketplaceEnum;
  isWalmartCampaign: boolean;
  isWalmartKT: boolean;
}

export interface IBulkActionRule {
  key: BulkActionKeyEnum;
  isVisible: (context: IBulkActionContext) => boolean;
  render: (
    context: IBulkActionContext,
    setTableData: Dispatch<SetStateAction<IEditAccessArrayData>>
  ) => ReactNode;
}
