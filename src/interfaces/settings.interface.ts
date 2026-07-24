import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  BidderStatusEnum,
  BidderTypeEnum,
  CountryCodeEnum,
} from 'src/enums/advertising.enums';

export interface IPowerBIReport {
  powerBiGroupId: string;
  powerBiReportId: string;
}
export interface IWalmartMarketplaceAccountBase {
  partnerId: string;
  partnerDisplayName: string;
  partnerStoreId: string;
  countryCode?: string;
}

export interface IAdvertisingAccount {
  accountId: string;
  brandName: string;
  marketplaceId: string;
  amazonProfileId: string;
  walmartAdvertiserId: string;
  bidderStatus: BidderStatusEnum;
  bidderJobId: string | null;
  bidderNextTriggerAt: string | null;
  bidderType: BidderTypeEnum;
  lastBidderTypeChange?: string;
  bidderTypeLockUntil?: string;
  lastSyncTimeAdvertising: string;
  accountType: string;
  countryCode?: CountryCodeEnum;
  currencyCode?: string;
}
export interface IDSPAdvertiserAccount {
  accountId: string;
  agencyProfileId: string;
  advertiserId: string;
  name: string;
  country: string;
  currency: string;
  timezone: string;
  isRegional: boolean;
  url?: string;
}
export interface ISettingsAccount {
  marketplace: MarketplaceEnum;
  accountType: string;
  advertising?: IAdvertisingAccount;
  catalog?: IWalmartMarketplaceAccountBase;
  dspAccount?: IDSPAdvertiserAccount;
}

export interface ISettingsAccountUpdateBody {
  status: string;
  bidderType: BidderTypeEnum;
}

export interface IAmazonSettingsAccountUpdateBody
  extends ISettingsAccountUpdateBody {
  amazonProfileId: string;
}

export interface IWalmartSettingsAccountUpdateBody
  extends ISettingsAccountUpdateBody {
  walmartAdvertiserId: string;
}

export interface ISettingsAccountUpdateResponse {
  id: string;
  accountId: string;
  status: string | null;
  maxBid: number;
  minBid: number;
  troas: number;
  anarixId: string;
  logic: number;
  lastRunTime: string;
  bidderType: BidderTypeEnum;
  bidderTypeLockUntil: string;
  lastBidderTypeChange: string;
}
