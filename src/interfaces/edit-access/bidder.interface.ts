import { BidderTypeEnum } from '@/enums/advertising.enums';

export interface IBidderUpdate {
  id: string;
  keywordId?: string;
  adGroupId: string;
  campaignId: string;
  entityName: string;
  troas: string | null;
  minBid: string | null;
  maxBid: string | null;
  status: string;
}

export interface IBidderWalmartProductUpdate {
  id: string;
  adItemId: string;
  itemId: string;
  adGroupId: string;
  campaignId: string;
  entityName: string;
  troas?: string | null;
  minBid?: string | null;
  maxBid?: string | null;
  status: string;
}
export interface IBidderAutoTargetUpdate extends IBidderUpdate {
  targetId: string;
}

export interface ICreateBidderJob {
  _id: string;
  accountId: string;
  status: string;
  maxBid: null;
  minBid: null;
  troas: null;
  anarixId: string;
  advertiserId: string;
  bidderType: BidderTypeEnum;
  bidderTypeLockUntil: string;
  lastBidderTypeChange: string;
}

export interface ICreateBidderJobBody {
  status: string;
  bidderType: BidderTypeEnum;
}

export interface ICreateBidderHeaders {
  walmartAdvertiserId?: string;
  amazonProfileId?: string;
}
