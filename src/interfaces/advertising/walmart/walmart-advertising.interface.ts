import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import {
  WalmartAccountTypeEnum,
  WalmartSnapshotReportStatusEnum,
} from '@/enums/walmart.enums';
import { IPowerBIReport } from '@/interfaces/settings.interface';
import { IAdMetrics } from '../amazon/sp-advertising.interface';

export interface IWalmartAdMetrics extends IAdMetrics, IWalmartInStoreMetrics {
  adUnits: number | null;
  adOrders: number | null;
  advertisedSkuSales: number | null;
  otherSkuSales: number | null;
  advertisedSkuUnits: number | null;
  otherSkuUnits: number | null;
  ntbUnits: number | null;
  ntbOrders: number | null;
  ntbSales: number | null;
  cvrUnitsSoldBased: number | null;
  cvrOrdersSoldBased: number | null;
  percentNtbUnits: number | null;
  percentNtbOrders: number | null;
  percentNtbSales: number | null;
}

export interface IWalmartInStoreMetrics {
  inStoreAttributedSales: number | null;
  inStoreAdvertisedSales: number | null;
  inStoreOtherSales: number | null;
  inStoreUnitsSold: number | null;
  inStoreOrders: number | null;
  omniChannelSales: number | null;
  omniChannelRoas: number | null;
}

export interface ICampaignPageType {
  campaignId: string;
  pageType: string;
  pageTypeMultiplier: number | string;
}

export interface ICampaignPlatform {
  campaignId: string;
  platform: string;
  platformMultiplier: number | string;
}

export interface IWalmartAccount {
  accountId: string;
  walmartAdvertiserId: string;
  walmartAccountType: WalmartAccountTypeEnum;
  brandName: string;
  createdAt: string;
  updatedAt: string;
}

export interface IWalmartAdsAccount {
  advertiserId: string;
  advertiserName: string;
  advertiserType: string;
  sellerId: string;
  sellerName: string;
  accountSpendLimitReached: string;
  apiAccessType: string;
  accessGrantTimeStamp: string;
  reportDate: string;
}

export interface IWalmartOnboardingResponse {
  data: IWalmartAdsAccount;
  jobStatus: WalmartSnapshotReportStatusEnum;
}

export interface IWalmartCreateAccount {
  accountId: string;
  walmartAdvertiserId: string;
  walmartAccountType: WalmartAccountTypeEnum;
  anarixId: string;
  brandName: string;
  sellerId: string;
  report?: IPowerBIReport;
}

export interface IWalmartConnectForm {
  advertiserId: string;
  supplierId?: string;
  sellerId?: string;
}

export interface IWalmartMetricsExtended {
  completeViewOrders: number | null;
  completeViewAdUnits: number | null;
  videoCompleteViews: number | null;
  videoFirstQuartileViews: number | null;
  videoImpressions: number | null;
  videoMidpointViews: number | null;
  videoThirdQuartileViews: number | null;
  videoUnmutes: number | null;
  video5SecondViews: number | null;
  viewableImpressions: number | null;
  viewThroughAdOrders: number | null;
  viewThroughAdSales: number | null;
  viewThroughAdUnits: number | null;
  completeViewAdSales: number | null;
  otherCompleteViewAdSales: number | null;
  vtr: number | null;
  vctr: number | null;
  video5SecondViewRate: number | null;
}

export interface IWalmartReviewColumns {
  reviewDecisionStatus?: string | null;
  reviewId?: string | null;
  reviewProcessStatus?: string | null;
  reviewReason?: string | null;
}

export interface IWalmartReviewPopupDetails {
  heading: string;
  description: string;
}

export interface IWalmartCampaignOptions {
  campaignOptions: string[] | null;
}

export interface IPerformanceMetricsPayload {
  payload: IDropdownItem<string>[];
}
