import {
  IAdGroupId,
  IAdGroupStatus,
  IAdGroupType,
  IAdId,
  IAmazonItemName,
  IAmazonManualTargetingExpression,
  IAmazonManualTargetingResolvedExpression,
  IAmazonPlacementBid,
  IAmazonSPBudgetColumn,
  IAmazonSPDynamicBidding,
  IAmazonSPProductName,
  IAsin,
  IAutoTargetingExpression,
  IBid,
  IBsonId,
  IBudget,
  IBudgetType,
  ICampaignId,
  ICampaignStatus,
  ICreationDateTime,
  IDefaultBid,
  IEditableAdGroupName,
  IEditableCampaignName,
  IEndDateColumn,
  IExpressionType,
  IId,
  IKeyword,
  IKeywordId,
  IKeywordText,
  IListingPrice,
  IMatchType,
  INextExecutionAt,
  INudgeNotificationData,
  IPercentage,
  IPlacementBiddingColumn,
  IPlacementName,
  IProfileId,
  IRuleAutomationStatus,
  IRuleEntityLinkStatus,
  IRuleId,
  IRuleName,
  IRuleType,
  ISearchTerm,
  IStartDate,
  IStatus,
  IStrategy,
  ITableStatus,
  ITagId,
  ITagName,
  ITargetId,
  ITargeting,
  ITargetingLevelType,
  ITargetingType,
} from '../../column.interface';
import {
  IWalmartAdMetrics,
  IWalmartMetricsExtended,
} from '../walmart/walmart-advertising.interface';

export interface IAdMetrics {
  impressions: number | null;
  clicks: number | null;
  adSpend: number | null;
  cpc: number | null;
  ctr: number | null;
  cvr: number | null;
  unitsSold: number | null;
  adSales: number | null;
  acos: number | null;
  roas: number | null;
}

export interface IPerformanceGraphData
  extends ICommonMetrics,
    IWalmartMetricsExtended {
  label: string;
  products: number | string;
  totalSales: number;
  totalUnits: number;
  tacos: number;
  gmv: number;
  grossUnits: number;
}

export interface IMinMaxDateRange {
  min_date: string;
  max_date: string;
}

export interface IPerformanceGraph {
  graphData: IPerformanceGraphData[];
  maxMinDate: IMinMaxDateRange[];
}

export interface ICommonMetrics extends IAdMetrics, IWalmartAdMetrics {}

export interface IPerformanceMetricsData
  extends ICommonMetrics,
    IWalmartMetricsExtended {
  totalSales: number | null;
  totalUnits: number | null;
  tacos: number | null;
  gmv: number | null;
  grossUnits: number | null;
  budget?: number | null;
  dailyBudget?: number | null;
  totalBudget?: number | null;
}

export interface IPerformanceMetrics {
  currPerformanceData: IPerformanceMetricsData | null;
  prevPerformanceData: {
    prevData: IPerformanceMetricsData | null;
    prevText: string;
  };
  changePercentageData: IPerformanceMetricsData | null;
}

export interface IPlacementBidding {
  percentage: number;
  placement: string;
}

export interface IDynamicBidding extends IPlacementBiddingColumn, IStrategy {}

export interface IBudgetValues extends IBudget, IBudgetType {}

// ----------------Filters-------------
export interface IDateRange {
  startDate: string;
  endDate?: string;
}

export interface IAdvertisingFilter {
  campaignId?: string | number;
  adGroupId?: string | number;
  range?: IDateRange;
  frequency?: string;
  rangeType?: string;
  isDownload?: boolean;
  downloadWithFilter?: boolean;
  targetingType?: string;
  tableType?: string;
}
export interface ISubNavItem {
  label: string;
  value: string;
}

export interface IAdvertisingNavigationBarOption {
  value: string;
  label: string;
  options: ISubNavItem[];
  isDisabled: boolean;
  isVisible?: boolean;
}

// ----------------Campaign-------------
export interface ICampaign
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    IEditableCampaignName,
    ICampaignId,
    IAmazonSPBudgetColumn,
    IStartDate,
    IEndDateColumn,
    IStatus,
    ITargetingType,
    IAmazonSPDynamicBidding,
    IPlacementBiddingColumn,
    IStrategy,
    ITableStatus,
    INudgeNotificationData,
    IRuleAutomationStatus,
    ITagId,
    ITagName {}

// ----------------Ad Groups-------------
export interface IAdGroup
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    IEditableAdGroupName,
    IAdGroupId,
    ICampaignId,
    IEditableCampaignName,
    ICampaignStatus,
    IStatus,
    IDefaultBid,
    ITargetingType,
    IAdGroupType,
    ITableStatus {}

// ----------------Keyword Targeting-------------
export interface IKeywordTargeting
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    IEditableAdGroupName,
    IAdGroupId,
    ICampaignId,
    IEditableCampaignName,
    ICampaignStatus,
    IAdGroupStatus,
    IStatus,
    IKeywordText,
    IKeywordId,
    IMatchType,
    IBid,
    ITargetingType,
    ITableStatus,
    ITargetingLevelType {}

// ----------------Product Targeting-------------
export interface IProductTargeting
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    IEditableAdGroupName,
    IAdGroupId,
    ICampaignId,
    IEditableCampaignName,
    ICampaignStatus,
    IAdGroupStatus,
    IStatus,
    ITargeting,
    ITargetId,
    IBid,
    ITargetingType,
    ITableStatus,
    IAmazonManualTargetingExpression,
    IAmazonManualTargetingResolvedExpression {}

// -------------- Auto Targeting ------------------
export interface IAutoTargeting
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    IEditableAdGroupName,
    IAdGroupId,
    ICampaignId,
    IEditableCampaignName,
    ICampaignStatus,
    IAdGroupStatus,
    IStatus,
    ITargeting,
    ITargetId,
    IBid,
    ITargetingType,
    IAutoTargetingExpression,
    IExpressionType,
    ITableStatus {}

//------------- Product Ads ----------------------
export interface IProductAds
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    IEditableAdGroupName,
    IAdGroupId,
    ICampaignId,
    IEditableCampaignName,
    ICampaignStatus,
    IAdGroupStatus,
    IStatus,
    IAdId,
    IAmazonItemName,
    IAsin,
    IListingPrice,
    ITargetingType,
    ITableStatus,
    IAmazonSPProductName {}

// ------------------ Search Term Keyword -----------------
export interface ISearchTermKeyword
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    IEditableAdGroupName,
    IAdGroupId,
    ICampaignId,
    IEditableCampaignName,
    ICampaignStatus,
    IAdGroupStatus,
    IStatus,
    ISearchTerm,
    IKeywordId,
    IKeyword,
    ITargeting,
    ITableStatus,
    IMatchType,
    ITargetingType {}

// --------------- Negative Keyword Targeting ---------------
export interface INegativeKeywordTargeting
  extends IProfileId,
    IId,
    IBsonId,
    IEditableAdGroupName,
    IAdGroupId,
    ICampaignId,
    IEditableCampaignName,
    ICampaignStatus,
    IAdGroupStatus,
    IStatus,
    IKeywordId,
    IKeywordText,
    IMatchType,
    ITargetingType,
    ICreationDateTime,
    ITableStatus {}

// -------------- Negative Product Targeting ----------------
export interface INegativeProductTargeting
  extends IProfileId,
    IId,
    IBsonId,
    IEditableAdGroupName,
    IAdGroupId,
    ICampaignId,
    IEditableCampaignName,
    ICampaignStatus,
    IAdGroupStatus,
    IStatus,
    ITargetId,
    ITargeting,
    ITargetingType,
    IAsin,
    ICreationDateTime,
    ITableStatus,
    IAmazonManualTargetingExpression,
    IAmazonManualTargetingResolvedExpression {}

// ----------------Placement Percentage-------------
export interface IPlacement
  extends IAdMetrics,
    IProfileId,
    IId,
    IPlacementName,
    IAmazonPlacementBid,
    IEditableCampaignName,
    ICampaignId,
    IAmazonSPBudgetColumn,
    IStartDate,
    IEndDateColumn,
    IStatus,
    ITargetingType,
    ICampaignStatus,
    IPercentage,
    IStrategy,
    ITableStatus {}

// ----------------Automation Rules-------------
export interface IAutomationRules
  extends IRuleId,
    IRuleName,
    IRuleType,
    IRuleEntityLinkStatus,
    INextExecutionAt {}

export type ISPAdvertisingData =
  | ICampaign
  | IAdGroup
  | IKeywordTargeting
  | IProductTargeting
  | IAutoTargeting
  | IProductAds
  | ISearchTermKeyword
  | INegativeKeywordTargeting
  | INegativeProductTargeting
  | IPlacement
  | IAutomationRules;
