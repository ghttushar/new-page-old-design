import {
  IAdGroupId,
  IAdGroupStatus,
  IAdGroupType,
  IAdId,
  IAmazonManualTargetingExpression,
  IAmazonManualTargetingResolvedExpression,
  IAmazonSBCreativeAdColumn,
  IAmazonSBGoal,
  IAmazonSBLandingPage,
  IAmazonSBProductAdsExtendedData,
  IBid,
  IBidAdjustmentsByPlacement,
  IBidOptimizationCheck,
  IBidOptimizationStrategy,
  IBsonId,
  IBudget,
  IBudgetColumn,
  IBudgetType,
  ICampaignId,
  ICampaignStatus,
  ICostType,
  ICreationDate,
  ICreativeName,
  ICreativeStatus,
  ICreativeType,
  IEditableAdGroupName,
  IEditableCampaignName,
  IEndDateColumn,
  IId,
  IKeywordId,
  IKeywordStatus,
  IKeywordText,
  ILastUpdatedDate,
  IListingPrice,
  IMatchType,
  IMultiAdGroupCheck,
  INudgeNotificationData,
  IProductName,
  IProfileId,
  IRuleAutomationStatus,
  ISBCreativeType,
  ISBProductAdsAsins,
  ISBProductAdsBrandLogoAssetID,
  ISBProductAdsBrandLogoCrop,
  ISBProductAdsBrandName,
  ISBProductAdsConsentToTranslate,
  ISBProductAdsCreativeVersion,
  ISBProductAdsHeadline,
  ISBProductAdsOriginalHeadline,
  ISBProductAdsOriginalVideoAssetIds,
  ISBProductAdsType,
  ISBProductAdsVideoAssetIds,
  ISearchTerm,
  ISmartDefault,
  IStartDate,
  IStatus,
  ITableStatus,
  ITagId,
  ITagName,
  ITargetId,
  ITargeting,
} from '../../column.interface';
import { IAdMetrics, IAutomationRules } from './sp-advertising.interface';

export interface ISBAssetById {
  assetId: string;
  mediaType: string;
  url: string;
  name: string;
  height: number;
  width: number;
}

export interface ISBAssetByIdBody {
  assetId: string;
}

export interface ISBCreativeAssetData {
  url: string;
  name: string;
  products: string[];
}

export interface ISBAssetVersions {
  label: string;
  value: string;
  assetId: string;
}

export interface ISBProductAdsCreative
  extends ISBProductAdsAsins,
    ISBProductAdsBrandLogoAssetID,
    ISBProductAdsBrandLogoCrop,
    ISBProductAdsBrandName,
    ISBProductAdsConsentToTranslate,
    ISBProductAdsCreativeVersion,
    ISBProductAdsHeadline,
    ISBProductAdsOriginalHeadline,
    ISBProductAdsOriginalVideoAssetIds,
    ISBProductAdsType,
    ISBProductAdsVideoAssetIds {}

export interface ISBProductAdsExtendedData {
  creationDate: number;
  lastUpdateDate: number;
  servingStatus: string;
  servingStatusDetails: string[];
}
export interface ISBLandingPage {
  pageType: string;
  url: string;
}

// --------------- Campaign --------------------
export interface ISBCampaign
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    ICampaignId,
    IEditableCampaignName,
    IStatus,
    IStartDate,
    IEndDateColumn,
    IBudget,
    IBudgetType,
    IBudgetColumn,
    IBidAdjustmentsByPlacement,
    IBidOptimizationCheck,
    IBidOptimizationStrategy,
    IMultiAdGroupCheck,
    IAmazonSBGoal,
    ISmartDefault,
    ITableStatus,
    INudgeNotificationData,
    ICostType,
    ICreativeType,
    IRuleAutomationStatus,
    ITagId,
    ITagName {}

// --------------- Ad Groups ------------
export interface ISBAdGroup
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    ICampaignId,
    IEditableCampaignName,
    IAdGroupId,
    IEditableAdGroupName,
    ICampaignStatus,
    IStatus,
    IAdGroupType,
    ITableStatus,
    ICostType,
    ICreativeType {}

// --------------- Product Ads ------------
export interface ISBProductAds
  extends IAdMetrics,
    ISBProductAdsCreative,
    IProfileId,
    IId,
    IBsonId,
    ICampaignId,
    IEditableCampaignName,
    IAdGroupId,
    IEditableAdGroupName,
    ICampaignStatus,
    IAdGroupStatus,
    IStatus,
    IAdId,
    IProductName,
    IListingPrice,
    IAmazonSBProductAdsExtendedData,
    IAmazonSBLandingPage,
    ICreativeType,
    ITableStatus {}

// --------------- Keyword Targeting ------------
export interface ISBKeywordTargeting
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    ICampaignId,
    IEditableCampaignName,
    IAdGroupId,
    IEditableAdGroupName,
    ICampaignStatus,
    IAdGroupStatus,
    IStatus,
    IKeywordId,
    IKeywordText,
    IBid,
    IMatchType,
    ITableStatus,
    ICostType,
    ICreativeType {}

// -------------- Product Targeting --------------
export interface ISBProductTargeting
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    ICampaignId,
    IEditableCampaignName,
    IAdGroupId,
    IEditableAdGroupName,
    ICampaignStatus,
    IAdGroupStatus,
    IStatus,
    ITargetId,
    ITargeting,
    IBid,
    ITableStatus,
    ICostType,
    ICreativeType,
    IAmazonManualTargetingExpression,
    IAmazonManualTargetingResolvedExpression {}

//----------- Negative Keyword Targeting ------------
export interface ISBNegativeTargetingKeyword
  extends IProfileId,
    IId,
    IBsonId,
    ICampaignId,
    IEditableCampaignName,
    IAdGroupId,
    IEditableAdGroupName,
    ICampaignStatus,
    IAdGroupStatus,
    IStatus,
    IKeywordId,
    IKeywordText,
    IMatchType,
    ITableStatus {}

//----------- Negative Product Targeting ------------
export interface ISBNegativeTargetingProduct
  extends IProfileId,
    IId,
    IBsonId,
    ICampaignId,
    IEditableCampaignName,
    IAdGroupId,
    IEditableAdGroupName,
    ICampaignStatus,
    IAdGroupStatus,
    IStatus,
    ITargetId,
    ITargeting,
    ITableStatus,
    IAmazonManualTargetingExpression,
    IAmazonManualTargetingResolvedExpression {}

// ---------------- Search Term -----------------
// TODO: cant find data
export interface ISBSearchTermKeyword
  extends IAdMetrics,
    IId,
    IProfileId,
    ISearchTerm,
    IKeywordId,
    IKeywordText,
    IKeywordStatus,
    IMatchType,
    ICampaignId,
    IEditableCampaignName,
    IAdGroupId,
    IEditableAdGroupName,
    ICampaignStatus,
    IAdGroupStatus {}

// ---------------- Creative -----------------
export interface ISBCreative
  extends IId,
    ISBCreativeType,
    IAdId,
    IAdGroupId,
    ISBProductAdsAsins,
    ISBProductAdsVideoAssetIds,
    ICreationDate,
    ILastUpdatedDate,
    ICreativeName,
    ICreativeStatus,
    IAmazonSBCreativeAdColumn {}

// ---------------- Automation Rules -------------
export type ISBAutomationRules = IAutomationRules;

export type ISBAdvertisingData =
  | ISBCampaign
  | ISBAdGroup
  | ISBProductAds
  | ISBKeywordTargeting
  | ISBProductTargeting
  | ISBCreative
  | ISBSearchTermKeyword
  | ISBNegativeTargetingKeyword
  | ISBNegativeTargetingProduct
  | ISBAutomationRules;
