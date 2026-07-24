export enum TargetingTypeEnum {
  AUTO = 'auto',
  MANUAL = 'manual',
}

export enum WalmartAdTypeEnum {
  SPONSORED_PRODUCTS = 'sponsoredProducts',
  SPONSORED_BRANDS = 'sba',
  SPONSORED_VIDEO = 'video',
}

export enum WalmartCampaignStatusEnum {
  ENABLED = 'Enabled',
  SCHEDULED = 'Scheduled',
  RESCHEDULED = 'Rescheduled',
  LIVE = 'Live',
  PAUSED = 'Paused',
  COMPLETED = 'Completed',
  PROPOSAL = 'Proposal',
  DISABLED = 'Disabled',
  ENDED = 'Ended',
  EXTEND = 'Extend',
}

export enum WalmartReviewStatusEnum {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum WalmartBudgetTypeEnum {
  DAILY = 'daily',
  TOTAL = 'total',
  BOTH = 'both',
}

export enum WalmartAdGroupStatusEnum {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  PAUSED = 'paused',
}

export enum WalmartSearchColumnsEnum {
  CAMPAIGN_ID = 'campaignId',
  CAMPAIGN_NAME = 'campaignName',
  ADGROUP_ID = 'adGroupId',
  ADGROUP_NAME = 'adGroupName',
  AD_ID = 'adItemId',
  ITEM_ID = 'itemId',
  ITEM_NAME = 'itemName',
  KT_ID = 'keywordId',
  KT_NAME = 'keywordText',
  SEARCH_TERM = 'searchTerm',
  SEARCH_TERM_KEYWORD = 'keywordText',
  PAGE_TYPE = 'pageType',
  PLATFORM = 'platform',
  SV_KT_NAME = 'biddedKeyword',
  SKU = 'sku',
  RULE_ID = 'ruleId',
  RULE_NAME = 'ruleName',
}

export enum WalmartAccountTypeEnum {
  THIRD_PARTY = '3P',
  FIRST_PARTY = '1P',
}
export enum WalmartClientTypeEnum {
  SUPPLIER = 'supplier',
  SELLER = 'seller',
}

export enum WalmartReportTypeEnum {
  INSIGHT = 'insight',
  ADVERTISER_ATTRIBUTES = 'advertiserAttributes',
}

export enum WalmartAdAccountAPIAccessTypeEnum {
  READ = 'read',
  WRITE = 'write',
}

export enum WalmartSnapshotReportStatusEnum {
  PENDING = 'pending',
  DONE = 'done',
}

export enum WalmartCampaignOptionsEnums {
  BRAND_TERM_OPT_OUT = 'BRAND_TERM_OPT_OUT',
  COMPLEMENTARY_OPT_OUT = 'COMPLEMENTARY_OPT_OUT',
}

export enum WalmartAccountReconnectEnum {
  CONTINUE = 'continue',
  BY_PASS = 'by-pass',
  BLOCK = 'block',
}
