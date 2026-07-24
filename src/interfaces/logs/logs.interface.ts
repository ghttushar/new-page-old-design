export interface ILogsData {
  advertiserId?: string;
  profileId?: string;
  accountId: string;
  logId: string;
  editedLevel: string;
  actionType: IActionType;
  campaignName: string;
  campaignId: string;
  campaignType: string;
  ruleId?: string;
  adGroupId?: string;
  adGroupName?: string;
  targeting?: ITargeting;
  productAds?: IProductAds;
  adItems?: IAdItems;
  pageTypeMultiplier?: IPageTypeMultiplier;
  platformMultiplier?: IPlatformMultiplier;
  from: string;
  to: string;
  userName: string;
  timestamp: string;
}

export interface ITargeting {
  keyword?: IKeywordTargetingData;
  negativeKeyword?: INegativeKeywordTargetingData;
  product?: IProductAds;
}

export interface IPageTypeMultiplier {
  placementType?: string;
  multiplier?: number;
}

export interface IPlatformMultiplier {
  platformType?: string;
  multiplier?: number;
}
export interface IProductAds {
  adId?: string;
  asin?: string;
  id?: string;
  productName?: string;
}
interface IActionType {
  type: string;
  subType?: string;
}

export interface IAdItems {
  adItemId?: string;
  name?: string;
}
export interface IKeywordTargetingData {
  id?: number;
  name?: string;
  matchType?: string;
}
export interface INegativeKeywordTargetingData {
  id?: number;
  keywordText?: string;
  matchType?: string;
}
