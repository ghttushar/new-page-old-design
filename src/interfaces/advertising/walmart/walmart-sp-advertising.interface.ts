import {
  IAdGroupId,
  IAdGroupName,
  IAdGroupStatus,
  IAdItemId,
  IAdType,
  IAdvertisedId,
  IAvgCapOutTime,
  IBid,
  IBidMultiplier,
  IBudgetType,
  ICampaignId,
  ICampaignName,
  ICampaignPageTypes,
  ICampaignPlatforms,
  ICampaignStatus,
  IDailyBudget,
  IDailyRemainingBudget,
  IEditableAdGroupName,
  IEditableCampaignName,
  IEndDateColumn,
  IId,
  IItemId,
  IItemImageUrl,
  IItemPageUrl,
  IKeywordCategory,
  IKeywordId,
  IKeywordText,
  IMatchType,
  INudgeNotificationData,
  IPageType,
  IPlatform,
  IProductName,
  IReviewReason,
  IReviewStatus,
  IRollover,
  IRuleAutomationStatus,
  ISearchTerm,
  ISku,
  IStartDate,
  IStatus,
  ISuggDailyBudget,
  ISuggTotalBudget,
  ITableStatus,
  ITagId,
  ITagName,
  ITargetingType,
  ITotalBudget,
  ITotalRemainingBudget,
  IWalmartCampaignViewStatus,
  IWalmartChannel,
  IWalmartItemName,
  IWalmartProductBid,
  IWalmartSPBiddingStrategy,
} from 'src/interfaces/column.interface';
import { IAutomationRules } from '../amazon/sp-advertising.interface';
import {
  IWalmartAdMetrics,
  IWalmartCampaignOptions,
  IWalmartReviewColumns,
} from './walmart-advertising.interface';

export interface IWalmartCampaign
  extends IId,
    IAdvertisedId,
    ICampaignId,
    IAdType,
    IDailyBudget,
    ITotalBudget,
    IBudgetType,
    ICampaignName,
    IStartDate,
    IEndDateColumn,
    ITableStatus,
    IWalmartCampaignViewStatus,
    ITargetingType,
    IRollover,
    IWalmartSPBiddingStrategy,
    IWalmartChannel,
    ICampaignPageTypes,
    ICampaignPlatforms,
    ITotalRemainingBudget,
    IDailyRemainingBudget,
    ISuggTotalBudget,
    ISuggDailyBudget,
    IAvgCapOutTime,
    IWalmartAdMetrics,
    IEditableCampaignName,
    IWalmartReviewColumns,
    INudgeNotificationData,
    IWalmartCampaignOptions,
    IRuleAutomationStatus,
    ITagId,
    ITagName {}

export interface IWalmartAdGroup
  extends IId,
    IStatus,
    IAdGroupId,
    ICampaignId,
    IAdvertisedId,
    IAdGroupName,
    ICampaignName,
    ICampaignStatus,
    IAdType,
    ITargetingType,
    IWalmartAdMetrics,
    IEditableAdGroupName,
    IWalmartReviewColumns {}

export interface IWalmartAdItem
  extends IId,
    IAdvertisedId,
    IAdGroupId,
    ICampaignId,
    IAdItemId,
    IProductName,
    IStatus,
    IItemId,
    IBid,
    IItemImageUrl,
    IItemPageUrl,
    IReviewStatus,
    IReviewReason,
    IWalmartItemName,
    ISku,
    IAdGroupName,
    IAdGroupStatus,
    ICampaignName,
    ICampaignStatus,
    IAdType,
    ITargetingType,
    IWalmartAdMetrics,
    IWalmartProductBid,
    IWalmartReviewColumns {}

export interface IWalmartKeywords
  extends IId,
    IAdvertisedId,
    IStatus,
    IAdGroupId,
    ICampaignId,
    IKeywordId,
    IKeywordText,
    IKeywordCategory,
    IBid,
    IMatchType,
    IAdGroupName,
    IAdGroupStatus,
    ICampaignName,
    ICampaignStatus,
    IAdType,
    ITargetingType,
    IWalmartAdMetrics,
    IWalmartReviewColumns {}

export interface IWalmartSearchTerms
  extends IId,
    IAdGroupId,
    ICampaignId,
    IKeywordId,
    ISearchTerm,
    IAdGroupName,
    IAdGroupStatus,
    ICampaignName,
    ICampaignStatus,
    IAdType,
    ITargetingType,
    IWalmartAdMetrics {}

export interface IWalmartPageType
  extends IId,
    ICampaignName,
    IPageType,
    ICampaignId,
    IBidMultiplier,
    IWalmartAdMetrics {}

export interface IWalmartPlatform
  extends IId,
    ICampaignName,
    IPlatform,
    ICampaignId,
    IBidMultiplier,
    IWalmartAdMetrics {}

// ---------------- Automation Rules -------------
export type IWalmartSPAutomationRules = IAutomationRules;

export type IWalmartSPAdvertisingData =
  | IWalmartCampaign
  | IWalmartAdGroup
  | IWalmartAdItem
  | IWalmartKeywords
  | IWalmartSearchTerms
  | IWalmartPageType
  | IWalmartPlatform
  | IWalmartSPAutomationRules;
