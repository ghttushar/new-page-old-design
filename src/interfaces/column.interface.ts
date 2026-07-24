import {
  ProductAdsEligibilityEnum,
  RuleAutomationStatusEnum,
} from '@/enums/advertising.enums';
import { BackendServiceNameEnum } from '@/enums/index.enums';
import { MessageExecutionModeEnum } from '@/enums/pub-sub.enums';
import { RuleTypeEnum } from '@/enums/rules.enum';
import {
  MetaTypeEnum,
  MonitoringMetaDataTypeEnum,
  MonitoringStatusEnum,
  ScheduleTypeEnum,
} from 'src/enums/monitoring.enum';
import { WalmartCampaignStatusEnum } from 'src/enums/walmart.enums';
import { IRadioSelect } from './advertising/advertising.interface';
import {
  ISBLandingPage,
  ISBProductAdsCreative,
  ISBProductAdsExtendedData,
} from './advertising/amazon/sb-advertising.interface';
import {
  ICreativeBrandLogo,
  ICreativeVideo,
  ILogoCropCoordinates,
} from './advertising/amazon/sd-advertising.interface';
import {
  IBudgetValues,
  IDynamicBidding,
  IPlacementBidding,
} from './advertising/amazon/sp-advertising.interface';
import {
  ICampaignPageType,
  ICampaignPlatform,
} from './advertising/walmart/walmart-advertising.interface';
import { Nullable } from './index.interface';

export interface IId {
  id?: string | number;
}

export interface IBsonId {
  _id: string;
}

// ===== Monitoring =====
export interface IMonitoringTaskId {
  taskId: string;
}
export interface IMonitoringAccountId {
  accountId: string;
}
export interface IMonitoringMetaType {
  metaType: MetaTypeEnum;
}

export interface IMonitoringTaskType {
  taskType: string;
}

export interface IMonitoringTaskCreatedAt {
  taskCreatedAt: string;
}

export interface IMonitoringCorrelationId {
  correlationId: string;
}

export interface IMonitoringPayload {
  payload: JSON;
}
export interface IMonitoringMetaData {
  info: JSON;
  type: MonitoringMetaDataTypeEnum;
  history: Array<IMonitoringMetaData>;
}

export interface IMonitoringMetaDataPayload {
  metaData: IMonitoringMetaData;
}
export interface IMonitoringService {
  serviceOrigin: BackendServiceNameEnum;
}

export interface IMonitoringRetryCount {
  retryCount: number;
}

export interface IExecutionMode {
  executionMode: MessageExecutionModeEnum;
}

export interface IMonitoringMarketplace {
  marketplace: string;
}

export interface IMonitoringTaskStartedAt {
  taskProcessingStartedAt: string;
}

export interface IMonitoringTaskCompleted {
  taskProcessingCompletedAt: string;
}

export interface IMonitoringMetaId {
  metaId: string;
}
export interface IMonitoringLastTriggered {
  lastTriggeredAt: string;
}
export interface IMonitoringNextTriggered {
  nextTriggerAt: string;
}
export interface IMonitoringStatus {
  taskStatus: MonitoringStatusEnum;
}
export interface IMonitoringScheduleType {
  scheduleType: ScheduleTypeEnum;
}
export interface IMonitoringBrandName {
  brandName: string;
}
export interface IMonitoringTriggered {
  triggeredAt: string;
}

export interface IMonitoringTotalLifeTime {
  totalLifeTime: number;
}

export interface IMonitoringTimeToStart {
  timeTakenToStart: number;
}

export interface IMonitoringTimeToComplete {
  timeTakenToComplete: number;
}
export interface IMonitoringElapsedTime {
  elapsedTime: number;
}
export interface IMonitoringMessageGroupId {
  messageGroupId: string;
}
export interface IMonitoringDeduplicationId {
  deduplicationId: string;
}

// ===== Advertising =====
export interface IAdvertisedId {
  advertiserId: string | number;
}
export interface ICampaignId {
  campaignId: string | number;
}
export interface IAdType {
  adType: string;
}
export interface IDailyBudget extends ICampaignId, IBudgetType {
  dailyBudget: string | number;
}
export interface ITotalBudget extends ICampaignId, IBudgetType {
  totalBudget: string | number;
}
export interface IBudgetType {
  budgetType: string;
}
export interface ICampaignName {
  campaignName: string;
}
export interface IStartDate {
  startDate: string;
}
export interface IEndDate {
  endDate?: string;
}
export interface IEndDateColumn extends IEndDate, ICampaignId, IStatus {}
export interface IStatus {
  status: string;
}

export interface INudgeMessage {
  messageId: string;
  message: string[];
}

export interface INudgeNotificationData {
  message: INudgeMessage[];
}
export interface ITableStatus
  extends IStatus,
    IEndDate,
    IId,
    IAdType,
    IItemId {}
export interface IWalmartCampaignViewStatus {
  viewStatus: WalmartCampaignStatusEnum;
}
export interface ITargetingType {
  targetingType: string;
}
export interface IRollover {
  rollover: boolean;
}
export interface IWalmartSPBiddingStrategy {
  biddingStrategy: IStrategy;
}
export interface IWalmartChannel {
  channel: string;
}
export interface ICampaignPageTypes {
  pageTypes: ICampaignPageType[];
}
export interface ICampaignPlatforms {
  platforms: ICampaignPlatform[];
}
export interface ITotalRemainingBudget {
  totalRemainingBudget: number | null;
}
export interface IDailyRemainingBudget {
  dailyRemainingBudget: number | null;
}
export interface ISuggTotalBudget {
  suggestedLatestTotalBudget: number | null;
}
export interface ISuggDailyBudget {
  suggestedLatestDailyBudget: number | null;
}
export interface IAvgCapOutTime {
  dailyOutOfBudgetDatetime: string | null;
}
export interface IAdGroupId {
  adGroupId: string | number;
}
export interface IAdGroupName {
  adGroupName: string;
}
export interface ICampaignStatus {
  campaignStatus: string;
}
export interface IListingPrice {
  listingPrice: string | number | null;
}
export interface IAdItemId {
  adItemId: string;
}
export interface IProductName {
  name: string;
}
export interface IItemId {
  itemId: string;
}
export interface IBid extends IId, ITargetingType {
  bid: string | number;
}
export interface IItemImageUrl {
  itemImageUrl: string | null;
}
export interface IItemPageUrl {
  itemPageUrl: string;
}
export interface IReviewStatus {
  reviewStatus: string;
}
export interface IReviewReason {
  adItemReviewReason: string;
}
export interface ISku {
  sku: string | null;
}
export interface IWalmartItemName
  extends IItemId,
    IItemImageUrl,
    ISku,
    ITargetingType {
  itemName: string;
}
export interface IAdGroupStatus {
  adGroupStatus: string;
}
export interface IKeywordId {
  keywordId: string | number;
}
export interface IKeywordText {
  keywordText: string;
}
export interface IKeyword {
  keyword: string;
}
export interface IKeywordCategory {
  keywordCategory: string;
}
export interface IMatchType {
  matchType: string;
}
export interface IPageType {
  pageType: string;
}
export interface IPlatform {
  platform: string;
}
export interface IBidMultiplier
  extends IId,
    ITargetingType,
    IPageType,
    IAdType {
  multiplier: number | string;
}
export interface IWalmartBiddingStrategyName {
  biddingStrategy_strategy: string | null;
}
export interface IBiddedKeyword {
  biddedKeyword: string | null;
}
export interface IEditableCampaignName
  extends ICampaignName,
    ICampaignId,
    IAdType,
    IEndDate,
    INudgeNotificationData,
    ITargetingType,
    ITagId {}

export interface IEditableAdGroupName
  extends ICampaignName,
    ICampaignId,
    IAdGroupId,
    IAdGroupName,
    IAdType,
    IAdGroupType {}

export interface IWalmartProductBid extends IAdItemId, IBid, ITargetingType {}

export interface IBudget {
  budget: number;
}
export interface IBudgetColumn
  extends IBudget,
    ICampaignId,
    IEndDate,
    IOverallBudgetSum,
    IBudgetType {}
export interface IPlacementBiddingColumn {
  placementBidding?: IPlacementBidding[];
}
export interface IStrategy {
  strategy?: string;
}

export interface IPercentage {
  percentage?: string;
}

export interface IOverallStrategyColumn
  extends IStrategy,
    ICampaignId,
    IEndDate {}
export interface IBidAdjustmentsByPlacement {
  bidAdjustmentsByPlacement?: IPlacementBidding[];
}
export interface IBidOptimizationCheck {
  bidOptimization?: boolean;
}
export interface IBidOptimizationStrategy {
  bidOptimizationStrategy?: string;
}
export interface ICostType {
  costType?: string;
}
export interface ITactic {
  tactic?: string;
}
export interface IDeliveryProfile {
  deliveryProfile?: string;
}

export interface IOverallBudgetSum {
  budget_sum?: number | null;
}
export interface IDefaultBid extends IId, ITargetingType {
  defaultBid: number;
}
export interface IBidOptimization {
  bidOptimization?: string;
}
export interface ICreativeType {
  creativeType?: string;
}
export interface IAdId {
  adId: string | number;
}
export interface IAmazonItemName {
  itemName: string;
}
export interface IAsin {
  asin?: string | null;
}

export interface IAdsEligibility {
  eligibility?: ProductAdsEligibilityEnum | null;
}
export interface IProductAdsImgUrl {
  imageUrl?: string | null;
}
export interface IProfileId {
  profileId: string | number;
}
export interface IAmazonSBProductAdsCreative {
  creative?: ISBProductAdsCreative;
}
export interface IAmazonSBProductAdsExtendedData {
  extendedData?: ISBProductAdsExtendedData;
}
export interface IAmazonSBLandingPage {
  landingPage?: ISBLandingPage;
}
export interface ITargeting {
  targeting: string;
}
export interface ITargetId {
  targetId: number | string;
}
export interface IAmazonSPBudgetColumn extends ICampaignId, IEndDate {
  budget: IBudgetValues;
}
export interface IAmazonSPDynamicBidding extends ICampaignId, IEndDate {
  dynamicBidding: IDynamicBidding;
}
export interface IAdGroupType {
  adGroupType: string;
}
export interface ITargetingLevelType {
  type: string;
}
export interface IAutoTargetingExpression {
  expression: [
    {
      type: string;
      _id: string;
    }
  ];
}
export interface IExpressionType {
  expressionType: string;
}
export interface ISearchTerm {
  searchTerm: string;
}
export interface ICreationDateTime {
  creationDateTime: string;
}
export interface IMultiAdGroupCheck {
  isMultiAdGroupsEnabled: boolean;
}
export interface IAmazonSBGoal {
  goal: string;
}
export interface ISmartDefault {
  smartDefault: string[];
}
export interface IProductAdsEligibility extends IAdsEligibility {
  asin: string | null;
}

export interface ISBProductAdsAsins {
  asinEligibility: IProductAdsEligibility[];
}
export interface ISBProductAdsBrandLogoAssetID {
  brandLogoAssetID: string | null;
}
export interface ISBProductAdsBrandLogoCrop {
  brandLogoCrop: ILogoCropCoordinates | null;
}
export interface ISBProductAdsBrandName {
  brandName: string | null;
}
export interface ISBProductAdsConsentToTranslate {
  consentToTranslate: boolean | null;
}
export interface ISBProductAdsCreativeVersion {
  creativeVersion: string | number | null;
}
export interface ISBProductAdsHeadline {
  headline: string | null;
}
export interface ISBProductAdsOriginalHeadline {
  originalHeadline: string | null;
}
export interface ISBProductAdsOriginalVideoAssetIds {
  originalVideoAssetIds: string[] | null;
}
export interface ISBProductAdsType {
  type: string | null;
}
export interface ISBProductAdsVideoAssetIds {
  videoAssetIds: string[] | null;
}
export interface IKeywordStatus {
  keywordStatus: string;
}
export interface ISBCreativeType {
  type: string;
}
export interface ICreationDate {
  creationDate: string;
}
export interface ILastUpdatedDate {
  lastUpdatedDate: string;
}
export interface ICreativeName {
  name: string | null;
}
export interface ICreativeStatus {
  status: string | null;
}
export interface IAdName {
  adName?: string | null;
}
export interface ISDProductLandingPageType {
  landingPageType: string | null;
}
export interface ISDProductLandingPageUrl {
  landingPageURL: string | null;
}
export interface ISDCreativeId {
  creativeId: string | number;
}
export interface ISDCreativeProperties {
  properties: {
    headline: string;
    brandLogo: ICreativeBrandLogo;
    video: ICreativeVideo;
  };
}
export interface IOutOfBudgetTime {
  outOfBudgetTime?: string | null;
}
export interface IPlacementName {
  placement: string | null;
}

export interface IAmazonPlacementBid
  extends ICampaignId,
    IPlacementName,
    IEndDate {
  dynamicBidding: IDynamicBidding;
}

export interface IAmazonOverallAdGroupStatus
  extends IAdGroupStatus,
    IEndDate,
    IId,
    IAdType {}

export interface IAmazonOverallItemNameColumn
  extends IAmazonItemName,
    IAsin,
    IAmazonSBLandingPage,
    IAdType,
    IProductAdsImgUrl,
    IAdsEligibility {}

export interface IAmazonSPProductName
  extends IAmazonItemName,
    IAsin,
    IProductAdsImgUrl,
    IAdsEligibility {}

export interface IAmazonSBCreativeAdColumn
  extends ICreativeType,
    ISBProductAdsAsins,
    ISBProductAdsVideoAssetIds,
    ICreativeName {}

export interface IAmazonSDProductNameColumn
  extends IAdName,
    IAsin,
    IAmazonItemName,
    ISDProductLandingPageUrl,
    IProductAdsImgUrl,
    IAdsEligibility {}

export interface ICustomBid extends IId {
  customBid?: number;
}

export interface IAddedDataMatchType {
  matchType?: IRadioSelect<string>;
}

export interface IEntityName {
  entityName: string;
}

export interface INormalizedKeyword {
  normalizedKeyword?: string;
}

export interface ISuggestedBid {
  suggestedBid?: number | string;
}

export interface IAmazonManualTargetingExpression {
  expression?: [
    {
      type: string;
      value: string;
    }
  ];
}

export interface IAmazonManualTargetingResolvedExpression {
  resolvedExpression?: [
    {
      type: string;
      value: string;
    }
  ];
}

export interface IItemName {
  itemName: string | null;
}

export interface ICreateItemId {
  item: string;
}

export interface ICreateProductName
  extends IItemName,
    ISku,
    ICreateItemId,
    IItemImageUrl {}

export interface IRuleAutomationStatus extends IId {
  automationStatus: RuleAutomationStatusEnum | null;
}

export interface IRuleId {
  ruleId: string;
}

export interface IRuleName extends IRuleId {
  ruleName: string;
}

export interface IRuleEntityLinkStatus extends IId {
  ruleEntityLinkStatus: RuleAutomationStatusEnum;
}

export interface IRuleType {
  ruleType: RuleTypeEnum;
}

export interface INextExecutionAt {
  nextExecutionAt: string;
}

export interface ITagId {
  tagId: Nullable<string>;
}

export interface ITagName {
  tagName: Nullable<string>;
}
