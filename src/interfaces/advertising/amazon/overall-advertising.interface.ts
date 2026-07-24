import {
  IAdGroupId,
  IAdGroupName,
  IAdGroupStatus,
  IAdId,
  IAdType,
  IAmazonItemName,
  IAmazonOverallAdGroupStatus,
  IAmazonOverallItemNameColumn,
  IAmazonSBLandingPage,
  IAmazonSBProductAdsCreative,
  IAmazonSBProductAdsExtendedData,
  IAsin,
  IBid,
  IBidAdjustmentsByPlacement,
  IBidOptimization,
  IBidOptimizationCheck,
  IBidOptimizationStrategy,
  IBsonId,
  IBudgetColumn,
  ICampaignId,
  ICampaignName,
  ICampaignStatus,
  ICostType,
  ICreativeType,
  IDefaultBid,
  IDeliveryProfile,
  IEndDateColumn,
  IId,
  IKeyword,
  IKeywordId,
  IKeywordText,
  IMatchType,
  IOverallStrategyColumn,
  IPlacementBiddingColumn,
  IProfileId,
  IRuleAutomationStatus,
  ISearchTerm,
  IStartDate,
  IStatus,
  ITableStatus,
  ITactic,
  ITagId,
  ITagName,
  ITargetId,
  ITargeting,
  ITargetingType,
} from '../../column.interface';
import { IAdMetrics, IAutomationRules } from './sp-advertising.interface';

export interface IOverallCampaignDynamicBidding
  extends IPlacementBiddingColumn,
    IOverallStrategyColumn,
    IBidAdjustmentsByPlacement,
    IBidOptimizationCheck,
    IBidOptimizationStrategy {}

// -------------- Campaign ----------------
export interface IOverallCampaign
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    IAdType,
    ICampaignName,
    ICampaignId,
    IBudgetColumn,
    IStartDate,
    IEndDateColumn,
    IStatus,
    IPlacementBiddingColumn,
    IOverallStrategyColumn,
    ITargetingType,
    ICostType,
    ITactic,
    IDeliveryProfile,
    ITableStatus,
    IRuleAutomationStatus,
    ITagId,
    ITagName {}

// ----------------Ad Groups-------------
export interface IOverallAdGroup
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    IAdType,
    ICampaignName,
    ICampaignId,
    ICampaignStatus,
    ITargetingType,
    ITactic,
    IAdGroupName,
    IAmazonOverallAdGroupStatus,
    IAdGroupId,
    IDefaultBid,
    IBidOptimization,
    ICreativeType,
    ITableStatus {}

//------------- Product Ads ----------------------
export interface IOverallProductAds
  extends IAdMetrics,
    IAdType,
    IProfileId,
    IId,
    IBsonId,
    IAdId,
    IAdGroupName,
    IAdGroupStatus,
    IAdGroupId,
    ICampaignName,
    ICampaignId,
    ICampaignStatus,
    ITargetingType,
    IStatus,
    IAmazonItemName,
    IAsin,
    IAmazonSBProductAdsCreative,
    IAmazonSBProductAdsExtendedData,
    IAmazonSBLandingPage,
    IAmazonOverallItemNameColumn,
    ITableStatus {}

// ----------------Keyword Targeting-------------
export interface IOverallKeywordTargeting
  extends IAdMetrics,
    IProfileId,
    IAdType,
    IId,
    IBsonId,
    IKeywordText,
    IKeywordId,
    IMatchType,
    IAdGroupName,
    IAdGroupStatus,
    IAdGroupId,
    ICampaignName,
    ICampaignId,
    ICampaignStatus,
    ITargetingType,
    IStatus,
    IBid,
    ITableStatus {}

// ----------------Product Targeting-------------
export interface IOverallProductTargeting
  extends IAdMetrics,
    IProfileId,
    IAdType,
    IId,
    IBsonId,
    ITargeting,
    IAdGroupName,
    IAdGroupStatus,
    IAdGroupId,
    ICampaignName,
    ICampaignId,
    ICampaignStatus,
    ITargetId,
    IStatus,
    IBid,
    ITargetingType,
    ITableStatus {}

// ----------------Search Term-------------
export interface IOverallSearchTerm
  extends IAdMetrics,
    IProfileId,
    IAdType,
    IId,
    IBsonId,
    IAdGroupName,
    IAdGroupId,
    ICampaignId,
    ICampaignName,
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

// ---------------- Automation Rules -------------
export type IOverallAutomationRules = IAutomationRules;

export type IOverallAdvertisingData =
  | IOverallCampaign
  | IOverallAdGroup
  | IOverallProductAds
  | IOverallKeywordTargeting
  | IOverallProductTargeting
  | IOverallSearchTerm
  | IOverallAutomationRules;
