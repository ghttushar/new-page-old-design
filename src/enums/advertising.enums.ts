import {
  BidderDashboardTableTitlesEnum,
  BidderDashboardTitleEnum,
} from './bidder-dashboard.enum';
import { CatalogTabTitlesEnum } from './catalog.enums';
import { ConfigurationTableTitlesEnum } from './configurations.enum';
import { ImpactAnalysisTableTitles } from './impact-analysis.enums';
import { KeywordActionTabsEnum } from './keyword-action.enums';
import { LogsTitlesEnum } from './logs.enums';
import { MonitoringTableTitlesEnum } from './monitoring.enum';
import {
  ProfitabilityTableTitlesEnum,
  ProfitabilityTableTypeEnum,
} from './profitability.enums';

export enum AdType {
  SPONSORED_PRODUCTS = 'sponsored_products',
  SPONSORED_BRANDS = 'sponsored_brands',
  SPONSORED_DISPLAY = 'sponsored_display',
  SPONSORED_VIDEO = 'sponsored_video',
  All = 'all',
  NONE = '',
}

export enum AdTypeShort {
  SPONSORED_PRODUCTS = 'SP',
  SPONSORED_BRANDS = 'SB',
  SPONSORED_DISPLAY = 'SD',
  SPONSORED_VIDEO = 'SV',
  All = 'all',
  OVERALL = 'overall',
}

export enum AdTypeShortLowerCase {
  SPONSORED_PRODUCTS = 'sp',
  SPONSORED_BRANDS = 'sb',
  SPONSORED_DISPLAY = 'sd',
  SPONSORED_VIDEO = 'sv',
  All = 'all',
  OVERALL = 'overall',
}

export enum CreativeTopOfSearch {
  DESKTOP = 'desktop_top_of_search',
  MOBILE = 'mobile_top_of_search',
}

export enum MetricsOptions {
  IMPRESSIONS = 'Impressions',
  CLICKS = 'Clicks',
  CTR = 'CTR',
  CPC = 'CPC',
  AD_SPEND = 'Ad Spend',
  AD_SALES = 'Ad Sales',
  ORDERS = 'Orders',
  AD_UNITS = 'Ad Units',
  CVR = 'CVR',
  ROAS = 'ROAS',
  ACOS = 'ACOS',
  TOTAL_UNITS = 'Total Units',
  TOTAL_SALES = 'Total Sales',
  TACOS = 'TACOS',
  PERCENTAGE_ORDERS_NTB = '% of orders NTB',
  PERCENTAGE_SALES_NTB = '% of sales NTB',
  PERCENTAGE_UNITS_NTB = '% of units NTB',
  VCPM = 'VCPM',
  VIEWABLE_IMPRESSIONS = 'Viewable impressions',
  AD_ORDERS = 'Ad Orders',
  CVR_UNITS = 'CVR (Units Based)',
  CVR_ORDERS = 'CVR (Orders Based)',
  ADVERTISED_SKU_SALES = 'Advertised SKU Sales',
  OTHER_SKU_SALES = 'Other SKU Sales',
  ADVERTISED_SKU_UNITS = 'Advertised SKU Units',
  OTHER_SKU_UNITS = 'Other SKU Units',
  NTB_UNITS = 'NTB units',
  NTB_ORDERS = 'NTB orders',
  NTB_SALES = 'NTB sales',
  COMPLETE_VIEW_AD_ORDERS = 'Complete View Ad Orders',
  COMPLETE_VIEW_AD_UNITS = 'Complete View Ad Units',
  VIDEO_COMPLETE_VIEWS = 'Video Complete Views',
  VIDEO_FIRST_QUARTILE_VIEWS = 'Video First Quartile Views',
  VIDEO_IMPRESSIONS = 'Video Impressions',
  VIDEO_MIDPOINT_VIEWS = 'Video Midpoint Views',
  VIDEO_THIRD_QUARTILE_VIEWS = 'Video Third Quartile Views',
  VIDEO_UNMUTES = 'Video Unmutes',
  VIDEO_5_SECOND_VIEWS = 'Video 5 Second Views',
  VIEW_THROUGH_AD_ORDERS = 'View-Through Ad Orders',
  VIEW_THROUGH_AD_SALES = 'View-Through Ad Sales',
  VIEW_THROUGH_AD_UNITS = 'View-Through Ad Units',
  COMPLETE_VIEW_AD_SALES = 'Complete View Ad Sales',
  OTHER_COMPLETE_VIEW_AD_SALES = 'Other Complete View Ad Sales',
  VTR = 'VTR',
  VCTR = 'vCTR',
  VIDEO_5_SECOND_VIEW_RATE = 'Video 5 Second View Rate',
  GMV = 'GMV',
  UNITS_SOLD = 'Units Sold',
  IN_STORE_ATTRIBUTES_SALES = 'In-Store Attributes Sales',
  IN_STORE_ADVERTISED_SALES = 'In-Store Advertised Sales',
  IN_STORE_OTHER_SALES = 'In-Store Other Sales',
  IN_STORE_UNITS_SOLD = 'In-Store Units Sold',
  IN_STORE_ORDERS = 'In-Store Orders',
  OMNI_CHANNEL_SALES = 'Omnichannel Sales',
  OMNI_CHANNEL_ROAS = 'Omnichannel ROAS',
  INVENTORY_COUNT = 'Inventory Count',
}

export enum MetricsKeysEnum {
  ACOS = 'acos', //%
  CTR = 'ctr', //%
  CVR = 'cvr', //%
  TACOS = 'tacos', //%
  PERCENTAGE_ORDERS_NTB = 'percentNtbOrders', //%
  PERCENTAGE_SALES_NTB = 'percentNtbSales', //%
  PERCENTAGE_UNITS_NTB = 'percentNtbUnits', //%
  CVR_UNITS = 'cvrUnitsSoldBased', //%
  CVR_ORDERS = 'cvrOrdersSoldBased', //%
  VIDEO_5_SECOND_VIEW_RATE = 'video5SecondViewRate', //%
  PERCENT_NTB_UNITS = 'percentNtbUnits', //%
  PERCENT_NTB_ORDERS = 'percentNtbOrders', //%
  PERCENT_NTB_SALES = 'percentNtbSales', //%
  BID_MULTIPLIER = 'multiplier', //%
  VTR = 'vtr', //%
  VCTR = 'vctr', //%
  VIDEO_5_SEC_VIEW_RATE = 'video5SecondViewRate', //%
  LQS = 'lqs', //%
  PRODUCT_SOV = 'productSov', //%
  GROSS_MARGIN_PERCENTAGE = 'grossMarginPercentage', //%
  CVR_UNIT_SOLD_BASED = 'cvrUnitSoldBased', //%
  CVR_ORDER_BASED = 'cvrOrderBased', //%
  AD_SPEND = 'adSpend', //$
  AD_SALES = 'adSales', //$
  ROAS = 'roas', //$
  CPC = 'cpc', //$
  CUSTOM_BID = 'customBid', //$
  BID = 'bid', //$
  TOTAL_SALES = 'totalSales', //$
  ADVERTISED_SKU_SALES = 'advertisedSkuSales', //$
  OTHER_SKU_SALES = 'otherSkuSales', //$
  NTB_SALES = 'ntbSales', //$
  VCPM = 'vcpm', //$
  GMV = 'gmv', //$
  DEFAULT_BID = 'defaultBid', //$
  BUDGET = 'budget', //$
  ADVERTISED_SALES = 'advertisedSkuSales', //$
  OTHER_SALES = 'otherSkuSales', //$
  TOTAL_BUDGET = 'totalBudget', //$
  DAILY_BUDGET = 'dailyBudget', //$
  BID_WALMART = 'bid', //$
  MIN_BID = 'minBid', //$
  MAX_BID = 'maxBid', //$
  TROAS = 'troas', //$
  ASIN_PRICE = 'price', //$
  VIEW_THROUGH_AD_SALES = 'viewThroughAdSales', //$
  COMPLETE_VIEW_AD_SALES = 'completeViewAdSales', //$
  OTHER_COMPLETE_VIEW_AD_SALES = 'otherCompleteViewAdSales', //$
  REVENUE_COST = 'revenueCost', //$
  INVENTORY_VALUE = 'inventoryValue', //$
  INVENTORY_VALUE_COGS = 'inventoryValueCogs', //$
  INVENTORY_VALUE_RETAIL = 'inventoryValueRetail', //$
  PRICE = 'price', //$
  COGS = 'cogs', //$
  WALMART_FEE = 'commission', //$
  GROSS_MARGIN = 'grossMargin', //$
  CANCELLED_SALES_PRICE = 'cancelledSalesPrice', //$
  REFUND_SALES = 'refundSales', //$
  GROSS_SALES = 'grossSales', //$
  PROMO_SPEND = 'promoSpend', //$
  SUGGESTED_DAILY_BUDGET_COLUMN = 'suggestedLatestDailyBudget', //$
  SUGGESTED_TOTAL_BUDGET_COLUMN = 'suggestedLatestTotalBudget', //$
  IN_STORE_ATTRIBUTES_SALES = 'inStoreAttributedSales', //$
  IN_STORE_ADVERTISED_SALES = 'inStoreAdvertisedSales', //$
  IN_STORE_OTHER_SALES = 'inStoreOtherSales', //$
  OMNI_CHANNEL_SALES = 'omniChannelSales', //$
  OMNI_CHANNEL_ROAS = 'omniChannelRoas', //$
  LISTING_PRICE = 'listingPrice', //$
  GMV_COMMISSION = 'gmvCommission', //$
  IMPRESSIONS = 'impressions', //num
  CLICKS = 'clicks', //num
  AD_UNITS = 'unitsSold', //num
  TOTAL_UNITS = 'totalUnits', //num
  AD_ORDERS = 'adOrders', //num
  ADVERTISED_SKU_UNITS = 'advertisedSkuUnits', //num
  OTHER_SKU_UNITS = 'otherSkuUnits', //num
  NTB_UNITS = 'ntbUnits', //num
  NTB_ORDERS = 'ntbOrders', //num
  ORDERS = 'orders', //num
  VIEWABLE_IMPRESSIONS = 'viewableImpressions', //num
  COMPLETE_VIEW_AD_ORDERS = 'completeViewOrders', //num
  VIDEO_5_SECOND_VIEWS = 'video5SecondViews', //num
  UNITS_SOLD = 'unitsSold', //num
  ADVERTISED_UNITS = 'advertisedSkuUnits', //num
  OTHER_UNITS = 'otherSkuUnits', //num
  ADGROUP_COUNT = 'adGroupCount', //num
  RATINGS = 'ratings', //num dec
  REVIEWS = 'reviews', //num
  COMPLETE_VIEW_ORDERS = 'completeViewOrders', //num
  COMPLETE_VIEW_AD_UNITS = 'completeViewAdUnits', //num
  VIDEO_COMPLETE_VIEWS = 'videoCompleteViews', //num
  VIDEO_FIRST_QUARTILE_VIEWS = 'videoFirstQuartileViews', //num
  VIDEO_IMPRESSIONS = 'videoImpressions', //num
  VIDEO_MIDPOINT_VIEWS = 'videoMidpointViews', //num
  VIDEO_THIRD_QUARTILE_VIEWS = 'videoThirdQuartileViews', //num
  VIDEO_UNMUTES = 'videoUnmutes', //num
  VIDEO_5_SEC_VIEWS = 'video5SecondViews', //num
  VIEW_THROUGH_AD_ORDERS = 'viewThroughAdOrders', //num
  VIEW_THROUGH_AD_UNITS = 'viewThroughAdUnits', //num
  INVENTORY = 'inventory', //num
  AVAIL_TO_SELL_QUANTITY = 'availToSellQuantity', //num
  RETURNS = 'returns', //num
  CANCELLED_ORDERS = 'cancelledOrders', //num
  REFUND_ORDERS = 'refundOrders', //num
  GROSS_UNITS_SOLD = 'grossUnitsSold', //num
  AD_UNITS_SOLD = 'adUnitsSold', //num
  CAMPAIGNS = 'campaigns', //num
  IN_STORE_UNITS_SOLD = 'inStoreUnitsSold', //num
  IN_STORE_ORDERS = 'inStoreOrders', //num
  INPUT_QUANTITY = 'inputQuantity', //num

  // ------------- Required for Rules -----------------
  PRODUCT_AD = 'itemName',
  COST = 'cost',

  //Bidder Metrics
  BIDDER_MAX_BID = 'maxBid',
  BIDDER_MIN_BID = 'minBid',
  BIDDER_TROAS = 'troas',
  BIDDER_STATUS = 'bidderStatus',
  AVG_CLICKS = 'avgClicks',
  AVG_CVR = 'avgCvr',
  CVR_MEDIAN = 'cvrMedian',
  THIRTY_PERCENT_OF_TROAS = '30PercentOfTroas',
  THIRTY_FIVE_PERCENT_OF_ASP = '35PercentOfASP',

  //Inventory Metrics
  FBA_INVENTORY = 'fbaInventory',
  WFS_INVENTORY = 'wfsInventory',
  DAYS_OF_SUPPLY = 'daysOfSupply',
  WEEKS_OF_SUPPLY = 'weeksOfSupply',
  ESTIMATED_EXCESS_QUANTITY = 'estimatedExcessQuantity',
  TOTAL_ORDERS = 'totalOrders',
  TOTAL_ACOS = 'totalAcos',
  NET_PROFIT = 'netProfit',
  INV_AGE_0_90 = 'invAge0To90',
  INV_AGE_91_180 = 'invAge91To180',
  INV_AGE_181_270 = 'invAge181To270',
  INV_AGE_271_365 = 'invAge271To365',
  INV_AGE_365_PLUS = 'invAge365Plus',
  TOTAL_AGED_INVENTORY = 'totalAgedInventory',

  //Budget Rule Metrics
  CAMPAIGN_BUDGET = 'campaignBudget',
  OUT_OF_BUDGET = 'outOfBudget',
  DAYS_SINCE_CAMPAIGN_START = 'daysSinceCampaignStart',
  AVG_SPEND = 'avgSpend',
  CPA = 'cpa',
  TACOS_TARGET = 'tacosTarget',
  OOB_PERCENTAGE = 'oobPercentage',
  OUT_OF_BUDGET_HOUR = 'outOfBudgetHour',

  // Placement Metrics - Top of Search (TOS)
  TOS_IMPRESSIONS = 'tosImpressions',
  TOS_CLICKS = 'tosClicks',
  TOS_UNITS_SOLD = 'tosUnitsSold',
  TOS_CPC = 'tosCpc',
  TOS_CVR = 'tosCvr',
  TOS_CTR = 'tosCtr',
  TOS_SALES = 'tosSales',
  TOS_SPEND = 'tosSpend',
  TOS_ACOS = 'tosAcos',
  TOS_ROAS = 'tosRoas',

  // Placement Metrics - Rest of Search
  ROS_IMPRESSIONS = 'rosImpressions',
  ROS_CLICKS = 'rosClicks',
  ROS_UNITS_SOLD = 'rosUnitsSold',
  ROS_CPC = 'rosCpc',
  ROS_CVR = 'rosCvr',
  ROS_CTR = 'rosCtr',
  ROS_SALES = 'rosSales',
  ROS_SPEND = 'rosSpend',
  ROS_ACOS = 'rosAcos',
  ROS_ROAS = 'rosRoas',

  // Placement Metrics - Product Page
  PRODUCT_PAGE_IMPRESSIONS = 'productPageImpressions',
  PRODUCT_PAGE_CLICKS = 'productPageClicks',
  PRODUCT_PAGE_UNITS_SOLD = 'productPageUnitsSold',
  PRODUCT_PAGE_CPC = 'productPageCpc',
  PRODUCT_PAGE_CVR = 'productPageCvr',
  PRODUCT_PAGE_CTR = 'productPageCtr',
  PRODUCT_PAGE_SALES = 'productPageSales',
  PRODUCT_PAGE_SPEND = 'productPageSpend',
  PRODUCT_PAGE_ACOS = 'productPageAcos',
  PRODUCT_PAGE_ROAS = 'productPageRoas',

  // Walmart Placement Metrics - Buy Box
  BUY_BOX_IMPRESSIONS = 'buyBoxImpressions',
  BUY_BOX_CLICKS = 'buyBoxClicks',
  BUY_BOX_UNITS_SOLD = 'buyBoxUnitsSold',
  BUY_BOX_CPC = 'buyBoxCpc',
  BUY_BOX_CVR = 'buyBoxCvr',
  BUY_BOX_CTR = 'buyBoxCtr',
  BUY_BOX_SALES = 'buyBoxSales',
  BUY_BOX_SPEND = 'buyBoxSpend',
  BUY_BOX_ACOS = 'buyBoxAcos',
  BUY_BOX_ROAS = 'buyBoxRoas',

  // Walmart Placement Metrics - Search Ingrid
  SEARCH_INGRID_IMPRESSIONS = 'searchIngridImpressions',
  SEARCH_INGRID_CLICKS = 'searchIngridClicks',
  SEARCH_INGRID_UNITS_SOLD = 'searchIngridUnitsSold',
  SEARCH_INGRID_CPC = 'searchIngridCpc',
  SEARCH_INGRID_CVR = 'searchIngridCvr',
  SEARCH_INGRID_CTR = 'searchIngridCtr',
  SEARCH_INGRID_SALES = 'searchIngridSales',
  SEARCH_INGRID_SPEND = 'searchIngridSpend',
  SEARCH_INGRID_ACOS = 'searchIngridAcos',
  SEARCH_INGRID_ROAS = 'searchIngridRoas',

  // Walmart Placement Metrics - Home Page
  HOME_PAGE_IMPRESSIONS = 'homePageImpressions',
  HOME_PAGE_CLICKS = 'homePageClicks',
  HOME_PAGE_UNITS_SOLD = 'homePageUnitsSold',
  HOME_PAGE_CPC = 'homePageCpc',
  HOME_PAGE_CVR = 'homePageCvr',
  HOME_PAGE_CTR = 'homePageCtr',
  HOME_PAGE_SALES = 'homePageSales',
  HOME_PAGE_SPEND = 'homePageSpend',
  HOME_PAGE_ACOS = 'homePageAcos',
  HOME_PAGE_ROAS = 'homePageRoas',

  // Walmart Placement Metrics - Stock Up
  STOCK_UP_IMPRESSIONS = 'stockUpImpressions',
  STOCK_UP_CLICKS = 'stockUpClicks',
  STOCK_UP_UNITS_SOLD = 'stockUpUnitsSold',
  STOCK_UP_CPC = 'stockUpCpc',
  STOCK_UP_CVR = 'stockUpCvr',
  STOCK_UP_CTR = 'stockUpCtr',
  STOCK_UP_SALES = 'stockUpSales',
  STOCK_UP_SPEND = 'stockUpSpend',
  STOCK_UP_ACOS = 'stockUpAcos',
  STOCK_UP_ROAS = 'stockUpRoas',

  // Confidence Metrics
  STATISTICALLY_SIGNIFICANT_CLICKS = 'statisticallySignificantClicks',
  SELLER_FULFILLED_INVENTORY = 'sellerFulfilledInventory',
}

export enum Adjustments {
  INCREASE_VALUE = 'Increase By Value',
  DECREASE_VALUE = 'Decrease By Value',
  INCREASE_PERCENTAGE = 'Increase By %',
  DECREASE_PERCENTAGE = 'Decrease By %',
  SET_TO_VALUE = 'Set to Value',
}

export enum BiddingStrategy {
  DOWN_ONLY = 'LEGACY_FOR_SALES',
  UP_DOWN = 'AUTO_FOR_SALES',
  FIXED_BIDS = 'MANUAL',
  RULE_BASED = 'RULE_BASED',
}

export enum ProductAdsEligibilityEnum {
  ELIGIBLE = 'ELIGIBLE',
  NOT_ELIGIBLE = 'INELIGIBLE',
  ELIGIBLE_WITH_WARNING = 'ELIGIBLE_WITH_WARNING',
}

export enum PlacementBids {
  TOP_OF_SEARCH = 'PLACEMENT_TOP',
  PRODUCT_PAGES = 'PLACEMENT_PRODUCT_PAGE',
  REST_OF_SEARCH = 'PLACEMENT_REST_OF_SEARCH',
}

export enum PlacementNames {
  TOP_OF_SEARCH = 'Top of search(first page)',
  PRODUCT_PAGES = 'Product pages',
  REST_OF_SEARCH = 'Rest of search',
}

export enum CampaignStateEnum {
  ENABLED = 'ENABLED',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
  ENABLING = 'ENABLING',
  USER_DELETED = 'USER_DELETED',
  OTHER = 'OTHER',
}

export enum OverallAccountLevelTitles {
  CAMPAIGNS = 'Campaigns_All_Account_Lvl',
  AD_GROUPS = 'Ad Groups_All_Account_Lvl',
  PRODUCT_ADS = 'Products_All_Account_Lvl',
  KEYWORD_TARGETING = 'Keywords Targeting_All_Account_Lvl',
  PRODUCT_TARGETING = 'Product Targeting_All_Account_Lvl',
  SEARCH_TERM = 'SearchTerm_All_Account_Lvl',
}

export enum SpAccountLevelTitles {
  CAMPAIGNS = 'Campaigns_SP_Account_Lvl',
  AD_GROUPS = 'Ad Groups_SP_Account_Lvl',
  PRODUCT_ADS = 'Products_SP_Account_Lvl',
  KEYWORD_TARGETING = 'Keywords Targeting_SP_Account_Lvl',
  PRODUCT_TARGETING = 'Product Targeting_SP_Account_Lvl',
  AUTO_TARGETING = 'Auto_Targeting_SP_Account_Lvl',
  SEARCH_TERM = 'SearchTerm_SP_Account_Lvl',
  PLACEMENT = 'Placement_SP_Account_Lvl',
}

export enum SpCampaignLevelTitles {
  AD_GROUPS = 'Ad Groups_SP_Camp_Lvl',
  PRODUCT_ADS = 'Products_SP_Camp_Lvl',
  AUTO_TARGETING = 'Auto_Targeting_SP_Camp_Lvl',
  MANUAL_TARGETING = 'Manual_Targeting_SP_Camp_Lvl',
  KEYWORD_TARGETING = 'KeywordTargeting_SP_Camp_Lvl',
  PRODUCT_TARGETING = 'ProductTargeting_SP_Camp_Lvl',
  SEARCH_TERM = 'SearchTerm_SP_Camp_Lvl',
  NEG_TARGETING = 'NegativeTargeting_SP_Camp_Lvl',
  NEG_TARGETING_KEYWORD = 'KeywordNegativeTargeting_SP_Camp_Lvl',
  NEG_TARGETING_PRODUCT = 'ProductNegativeTargeting_SP_Camp_Lvl',
  PLACEMENT = 'Placement_SP_Camp_Lvl',
  HISTORY = 'History_SP_Camp_Lvl',
  AUTOMATION = 'Automation_SP_Camp_Lvl',
  AUTOMATION_RULES = 'Automation_Rules_SP_Camp_Lvl',
  AUTOMATION_HISTORY = 'Automation_History_SP_Camp_Lvl',
}

export enum SpAdGroupLevelTitles {
  PRODUCT_ADS = 'Products_SP_AdGroup_Lvl',
  TARGETING = 'Targeting_SP_AdGroup_Lvl',
  KEYWORD_TARGETING = 'KeywordTargeting_SP_AdGroup_Lvl',
  PRODUCT_TARGETING = 'ProductTargeting_SP_AdGroup_Lvl',
  SEARCH_TERM = 'SearchTerm_SP_AdGroup_Lvl',
  NEG_TARGETING = 'NegativeTargeting_SP_AdGroup_Lvl',
  NEG_TARGETING_KEYWORD = 'KeywordNegativeTargeting_SP_AdGroup_Lvl',
  NEG_TARGETING_PRODUCT = 'ProductNegativeTargeting_SP_AdGroup_Lvl',
  HISTORY = 'History_SP_AdGroup_Lvl',
}

export enum SbAccountLevelTitles {
  CAMPAIGNS = 'Campaigns_SB_Account_Lvl',
  AD_GROUP = 'AdGroup_SB_Account_Lvl',
  PRODUCT_ADS = 'ProductAds_SB_Account_Lvl',
  KEYWORD_TARGETING = 'Keywords Targeting_SB_Account_Lvl',
  PRODUCT_TARGETING = 'Product Targeting_SB_Account_Lvl',
  SEARCH_TERM = 'SearchTerm_SB_Account_Lvl',
}

export enum SbCampaignLevelTitles {
  AD_GROUP = 'AdGroup_SB_Camp_Lvl',
  PRODUCT_ADS = 'ProductAds_SB_Camp_Lvl',
  TARGETING = 'Targeting_SB_Camp_Lvl',
  KEYWORD_TARGETING = 'KeywordTargeting_SB_Camp_Lvl',
  PRODUCT_TARGETING = 'ProductTargeting_SB_Camp_Lvl',
  SEARCH_TERM_KEYWORD = 'Search Term_SB_Camp_Lvl',
  NEG_TARGETING = 'Negative Targeting_SB_Camp_Lvl',
  NEG_TARGETING_KEYWORD = 'KeywordNegativeTargeting_SB_Camp_Lvl',
  NEG_TARGETING_PRODUCT = 'ProductNegativeTargeting_SB_Camp_Lvl',
  HISTORY = 'History_SB_Camp_Lvl',
  AUTOMATION = 'Automation_SB_Camp_Lvl',
  AUTOMATION_RULES = 'Automation_Rules_SB_Camp_Lvl',
  AUTOMATION_HISTORY = 'Automation_History_SB_Camp_Lvl',
}

export enum SbAdGroupLevelTitles {
  CREATIVE = 'Creative_SB_AdGroup_Lvl',
  PRODUCT_ADS = 'ProductAds_SB_AdGroup_Lvl',
  TARGETING = 'Targeting_SB_AdGroup_Lvl',
  KEYWORD_TARGETING = 'KeywordTargeting_SB_AdGroup_Lvl',
  PRODUCT_TARGETING = 'ProductTargeting_SB_AdGroup_Lvl',
  SEARCH_TERM_KEYWORD = 'Search Term_SB_AdGroup_Lvl',
  NEG_TARGETING = 'Negative Targeting_SB_AdGroup_Lvl',
  NEG_TARGETING_KEYWORD = 'KeywordNegativeTargeting_SB_AdGroup_Lvl',
  NEG_TARGETING_PRODUCT = 'ProductNegativeTargeting_SB_AdGroup_Lvl',
}

export enum SdAccountLevelTitles {
  CAMPAIGN = 'Campaigns_SD_Account_Lvl',
  AD_GROUP = 'Ad Groups_SD_Account_Lvl',
  PRODUCT_ADS = 'Products_SD_Account_Lvl',
  CONTEXTUAL_TARGETING = 'Contextual Targeting_SD_Account_Lvl',
  AUDIENCE = 'Audience Targeting_SD_Account_Lvl',
}

export enum SdCampaignLevelTitles {
  AD_GROUP = 'Ad Groups_SD_Camp_Lvl',
  PRODUCT_ADS = 'Products_SD_Camp_Lvl',
  TARGETING = 'Targeting_SD_Camp_Lvl',
  HISTORY = 'History_SD_Camp_Lvl',
  AUTOMATION = 'Automation_SD_Camp_Lvl',
  AUTOMATION_RULES = 'Automation_Rules_SD_Camp_Lvl',
  AUTOMATION_HISTORY = 'Automation_History_SD_Camp_Lvl',
}

export enum SdAdGroupLevelTitles {
  PRODUCT_ADS = 'Products_SD_AdGroup_Lvl',
  CREATIVE = 'Creative_SD_AdGroup_Lvl',
  TARGETING = 'Targeting_SD_AdGroup_Lvl',
  HISTORY = 'History_SD_AdGroup_Lvl',
}

export enum WalmartSPAccountLevelTitles {
  CAMPAIGNS = 'Campaigns_SP_Walmart_Account_Lvl',
  AD_GROUPS = 'Ad_Groups_SP_Walmart_Account_Lvl',
  AD_ITEMS = 'Ad_Items_SP_Walmart_Account_Lvl',
  KEYWORD_TARGETING = 'Keywords_Targeting_SP_Walmart_Account_Lvl',
  SEARCH_TERM = 'Search_Term_SP_Walmart_Account_Lvl',
  PAGE_TYPE = 'Page_Type_SP_Walmart_Account_Lvl',
  PLATFORM = 'Platform_SP_Walmart_Account_Lvl',
}

export enum WalmartSPCampaignLevelTitles {
  AD_GROUPS = 'Ad_Groups_SP_Walmart_Camp_Lvl',
  AD_ITEMS = 'Ad_Items_SP_Walmart_Camp_Lvl',
  KEYWORD_TARGETING = 'Keywords_Targeting_SP_Walmart_Camp_Lvl',
  SEARCH_TERM = 'Search_Term_SP_Walmart_Camp_Lvl',
  PAGE_TYPE = 'Page_Type_SP_Walmart_Camp_Lvl',
  PLATFORM = 'Platform_SP_Walmart_Camp_Lvl',
  AUTOMATION = 'Automation_SP_Walmart_Camp_Lvl',
  AUTOMATION_RULES = 'Automation_Rules_SP_Walmart_Camp_Lvl',
  AUTOMATION_HISTORY = 'Automation_History_SP_Walmart_Camp_Lvl',
}

export enum WalmartSPAdGroupLevelTitles {
  AD_ITEMS = 'Ad_Items_SP_Walmart_AdGroup_Lvl',
  KEYWORD_TARGETING = 'Keywords_Targeting_SP_Walmart_AdGroup_Lvl',
  SEARCH_TERM = 'Search_Term_SP_Walmart_AdGroup_Lvl',
}

export enum WalmartSBAccountLevelTitles {
  CAMPAIGNS = 'Campaigns_SB_Walmart_Account_Lvl',
  AD_GROUPS = 'Ad_Groups_SB_Walmart_Account_Lvl',
  KEYWORD_TARGETING = 'Keywords_Targeting_SB_Walmart_Account_Lvl',
  AD_ITEMS = 'Ad_Items_SB_Walmart_Account_Lvl',
  SEARCH_TERM = 'Search_Term_SB_Walmart_Account_Lvl',
  PAGE_TYPE = 'Page_Type_SB_Walmart_Account_Lvl',
  PLATFORM = 'Platform_SB_Walmart_Account_Lvl',
}

export enum WalmartSBCampaignLevelTitles {
  AD_GROUPS = 'Ad_Groups_SB_Walmart_Camp_Lvl',
  BRANDS = 'Brands_SB_Walmart_Camp_Lvl',
  KEYWORD_TARGETING = 'Keywords_Targeting_SB_Walmart_Camp_Lvl',
  AD_ITEMS = 'Ad_Items_SB_Walmart_Camp_Lvl',
  SEARCH_TERM = 'Search_Term_SB_Walmart_Camp_Lvl',
  PAGE_TYPE = 'Page_Type_SB_Walmart_Camp_Lvl',
  PLATFORM = 'Platform_SB_Walmart_Camp_Lvl',
  AUTOMATION = 'Automation_SB_Walmart_Camp_Lvl',
  AUTOMATION_RULES = 'Automation_Rules_SB_Walmart_Camp_Lvl',
  AUTOMATION_HISTORY = 'Automation_History_SB_Walmart_Camp_Lvl',
}

export enum WalmartSBAdGroupLevelTitles {
  KEYWORD_TARGETING = 'Keywords_Targeting_SB_Walmart_AdGroup_Lvl',
  AD_ITEMS = 'Ad_Items_SB_Walmart_AdGroup_Lvl',
  SEARCH_TERM = 'Search_Term_SB_Walmart_AdGroup_Lvl',
}

export enum WalmartSVAccountLevelTitles {
  CAMPAIGNS = 'Campaigns_SV_Walmart_Account_Lvl',
  AD_GROUPS = 'Ad_Groups_SV_Walmart_Account_Lvl',
  KEYWORD_TARGETING = 'Keywords_Targeting_SV_Walmart_Account_Lvl',
  AD_ITEMS = 'Ad_Items_SV_Walmart_Account_Lvl',
  SEARCH_TERM = 'Search_Term_SV_Walmart_Account_Lvl',
  PAGE_TYPE = 'Page_Type_SV_Walmart_Account_Lvl',
  PLATFORM = 'Platform_SV_Walmart_Account_Lvl',
  VIDEO = 'Video_SV_Walmart_Account_Lvl',
}

export enum WalmartSVCampaignLevelTitles {
  AD_GROUPS = 'Ad_Groups_SV_Walmart_Camp_Lvl',
  KEYWORD_TARGETING = 'Keywords_Targeting_SV_Walmart_Camp_Lvl',
  AD_ITEMS = 'Ad_Items_SV_Walmart_Camp_Lvl',
  SEARCH_TERM = 'Search_Term_SV_Walmart_Camp_Lvl',
  PAGE_TYPE = 'Page_Type_SV_Walmart_Camp_Lvl',
  PLATFORM = 'Platform_SV_Walmart_Camp_Lvl',
  VIDEO = 'Video_SV_Walmart_Camp_Lvl',
  AUTOMATION = 'Automation_SV_Walmart_Camp_Lvl',
  AUTOMATION_RULES = 'Automation_Rules_SV_Walmart_Camp_Lvl',
  AUTOMATION_HISTORY = 'Automation_History_SV_Walmart_Camp_Lvl',
}

export enum WalmartSVAdGroupLevelTitles {
  KEYWORD_TARGETING = 'Keywords_Targeting_SV_Walmart_AdGroup_Lvl',
  AD_ITEMS = 'Ad_Items_SV_Walmart_AdGroup_Lvl',
  SEARCH_TERM = 'Search_Term_SV_Walmart_AdGroup_Lvl',
}

export enum WalmartOverallAccountLevelTitles {
  CAMPAIGNS = 'Campaigns_All_Walmart_Account_Lvl',
  AD_GROUPS = 'Ad_Groups_All_Walmart_Account_Lvl',
  AD_ITEMS = 'Ad_Items_All_Walmart_Account_Lvl',
  KEYWORD_TARGETING = 'Keywords_Targeting_All_Walmart_Account_Lvl',
  SEARCH_TERM = 'Search_Term_All_Walmart_Account_Lvl',
  PAGE_TYPE = 'Page_Type_All_Walmart_Account_Lvl',
  PLATFORM = 'Platform_All_Walmart_Account_Lvl',
}

export type AdvertisingTitlesEnum =
  | OverallAccountLevelTitles
  | SpAccountLevelTitles
  | SpCampaignLevelTitles
  | SpAdGroupLevelTitles
  | SbAccountLevelTitles
  | SbCampaignLevelTitles
  | SbAdGroupLevelTitles
  | SdAccountLevelTitles
  | SdCampaignLevelTitles
  | SdAdGroupLevelTitles
  | WalmartSPAccountLevelTitles
  | WalmartSPCampaignLevelTitles
  | WalmartSPAdGroupLevelTitles
  | WalmartSBAccountLevelTitles
  | WalmartSBCampaignLevelTitles
  | WalmartSBAdGroupLevelTitles
  | WalmartSVAccountLevelTitles
  | WalmartSVCampaignLevelTitles
  | WalmartSVAdGroupLevelTitles
  | WalmartOverallAccountLevelTitles
  | KeywordActionTabsEnum
  | CatalogTabTitlesEnum
  | LogsTitlesEnum
  | MonitoringTableTitlesEnum
  | ProfitabilityTableTitlesEnum
  | ProfitabilityTableTypeEnum
  | MonitoringTableTitlesEnum
  | BidderDashboardTitleEnum
  | BidderDashboardTableTitlesEnum
  | ImpactAnalysisTableTitles
  | ConfigurationTableTitlesEnum;
export enum SpNegTargetingKeywordMatchTypes {
  NEG_EXACT = 'NEGATIVE_EXACT',
  NEG_PHRASE = 'NEGATIVE_PHRASE',
}

export enum SpTargetingKeywordMatchTypes {
  EXACT = 'EXACT',
  PHRASE = 'PHRASE',
  BROAD = 'BROAD',
}

export enum SpTargetingProductMatchTypes {
  EXACT = 'ASIN_SAME_AS',
  EXPANDED = 'ASIN_EXPANDED_FROM',
  TARGETING_EXPRESSION = 'TARGETING_EXPRESSION',
}

export enum SpAutoTargetingMatchTypesEnum {
  PREDEFINED = 'TARGETING_EXPRESSION_PREDEFINED',
}

export enum SpNegativeTargetingProductMatchTypesEnum {
  EXACT = 'ASIN_SAME_AS',
  BRAND_EXACT = 'ASIN_BRAND_SAME_AS',
}

export enum SpCampaignTargetingTypes {
  MANUAL = 'MANUAL',
  AUTO = 'AUTO',
}

export enum AdGroupTypeEnum {
  AUTO = 'AUTO',
  KT = 'KT',
  PT = 'PT',
}

export enum SpCampaignTableTypes {
  AUTO = 'AUTO',
  KEYWORD = 'KEYWORD',
  PRODUCT = 'PRODUCT',
  OTHERS = 'OTHERS',
}

export enum AmazonAdvertisingTableTypesEnum {
  CAMPAIGN = 'campaign',
  AD_GROUP = 'adgroup',
  PRODUCT_ADS = 'product-ads',
  KEYWORD_TARGETING = 'keyword-targeting',
  PRODUCT_TARGETING = 'product-targeting',
  NEGATIVE_TARGETING_KEYWORD = 'negative-targeting-keyword',
  NEGATIVE_TARGETING_PRODUCT = 'negative-targeting-product',
  SEARCH_TERM = 'search-term',
  CREATIVE_PRODUCT = 'creative-product',
  CREATIVE = 'creative',
  KEYWORD_TARGETS = 'keyword-targets',
  NEW_KEYWORD_TARGETS = 'new-keyword-targets',
  PRODUCT_TARGETS = 'product-targets',
  AUTO_TARGETING = 'auto-targeting',
  PRODUCT = 'product',
  KEYWORD = 'keyword',
  PLACEMENT = 'placements',
  PAGE_TYPE = 'page-type',
  CAMPAIGN_RULES = 'campaign-rules',
}

export enum WalmartAdvertisingTableTypeEnum {
  CAMPAIGN = 'campaign',
  AD_GROUP = 'adGroup',
  KEYWORD = 'keyword',
  AD_ITEM = 'adItem',
  AUTO_SEARCH_TERM = 'auto-searchTerm',
  MANUAL_SEARCH_TERM = 'manual-searchTerm',
  SEARCH_TERM = 'searchTerm',
  PAGE_TYPE = 'pageType',
  PLATFORM = 'platform',
  BRAND_PROFILE = 'brandProfiles',
  CAMPAIGN_RULES = 'campaign-rules',
}

export enum SbKeywordTargetingMatchTypes {
  BROAD = 'broad',
  EXACT = 'exact',
  PHRASE = 'phrase',
}

export enum SbNegativeTargetingKeywordMatchTypes {
  NEG_EXACT = 'negativeExact',
  NEG_PHRASE = 'negativePhrase',
}

export enum SbTargetingProductMatchTypesEnum {
  EXACT = 'asinSameAs',
}

export enum SbNegativeTargetingProductMatchTypesEnum {
  EXACT = 'asinSameAs',
  BRAND_EXACT = 'asinBrandSameAs',
}

export enum AmazonSDTacticsEnum {
  CONTEXTUAL_TARGETING = 'T00020',
  AUDIENCES_TARGETING = 'T00030',
}

export enum AmazonSDBidOptimizationEnum {
  REACH = 'reach',
  CLICKS = 'clicks',
  CONVERSIONS = 'conversions',
}

export enum AmazonSBCreativeTypeEnum {
  PRODUCT_COLLECTION = 'PRODUCT_COLLECTION',
  STORE_SPOTLIGHT = 'STORE_SPOTLIGHT',
  VIDEO = 'VIDEO',
  BRAND_VIDEO = 'BRAND_VIDEO',
}

export enum SortOrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export enum AmazonSearchColumnsEnum {
  CAMPAIGN_ID = 'campaignId',
  CAMPAIGN_NAME = 'campaignName',
  ADGROUP_ID = 'adGroupId',
  ADGROUP_NAME = 'adGroupName',
  SB_PRODUCT_NAME = 'name',
  PRODUCT_ID = 'adId',
  SB_PRODUCT_ASINS = 'asins',
  SD_PRODUCT_NAME = 'adName',
  SD_PRODUCT_ASIN = 'asin',
  KT_ID = 'keywordId',
  KT_NAME = 'keywordText',
  PT_ID = 'targetId',
  PT_NAME = 'targeting',
  EXPRESSION = 'expression',
  SEARCH_TERM = 'searchTerm',
  SEARCH_TERM_KEYWORD = 'keywordText',
  SP_SEARCH_KEYWORD = 'keyword',
  CREATIVE_ID = 'adId',
  CREATIVE_NAME = 'name',
  CREATIVE_ASINS = 'asins',
  ITEM_NAME = 'itemName',
  ASIN = 'asin',
  ANALYSIS_PRODUCT_ID = 'productId',
  ANALYSIS_PRODUCT_NAME = 'productName',
  ANALYSIS_KEYWORD_NAME = 'keywordName',
  PLACEMENT = 'placement',
  RULE_ID = 'ruleId',
  RULE_NAME = 'ruleName',
}

export enum PageTypeActualEnum {
  ITEM = 'Buy-Box',
  SEARCH = 'Search Ingrid',
  HOMEPAGE = 'Home Page',
  STOCK_UP = 'Stock Up',
  OTHERS = 'Others',
  CATEGORY = 'Category',
  TOPIC = 'Topic',
  BROWSE = 'Browse',
}

export enum PageTypeTableEnum {
  ITEM = 'item',
  SEARCH = 'search',
  HOMEPAGE = 'homepage',
  STOCK_UP = 'stockup',
  OTHERS = 'others',
  CATEGORY = 'category',
  TOPIC = 'topic',
  BROWSE = 'browse',
}

export enum BidderStatusEnum {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
}

export enum AmazonAccountType {
  SELLER = 'seller',
  VENDOR = 'vendor',
}

export enum BidderTypeEnum {
  OFF = 'OFF',
  BIDDER = 'BIDDER',
  AI_BIDDER = 'AI_BIDDER',
}

export enum PerformanceTypeEnum {
  GRAPH = 'graph',
  METRICS = 'metrics',
}

export enum ColumnNameEnum {
  ACCOUNT_ID = 'Account Id',
  ACOS = 'ACOS',
  ACTIVE = 'Active',
  ADGROUP = 'Ad Group',
  ADGROUP_STATUS = 'AdGroup Status',
  AD_ID = 'Ad Id',
  AD_NAME = 'Product Ad',
  ADD = 'Add',
  AD_ORDERS = 'Ad Orders',
  AD_SALES = 'Ad Sales',
  AD_SPEND = 'Ad Spend',
  AD_TYPE = 'Ad Type',
  AD_UNITS = 'Ad Units',
  ADVERTISED_SKU_SALES = 'Advertised SKU Sales',
  ADVERTISED_SKU_UNITS = 'Advertised SKU Units',
  ASINS = 'Asins',
  AVG_CAP_OUT_TIME = 'Avg. Cap-out Time',
  BID = 'Bid',
  CUSTOM_BID = 'Custom Bid',
  BID_ADJUSTMENT = 'Bid Adjustment',
  BID_AUTOMATION = 'Bid Automation',
  KEYWORD_AUTOMATION = 'Keyword Automation',
  PRODUCT_AUTOMATION = 'Product Automation',
  BIDDING_STRATEGY = 'Bidding Strategy',
  BID_MULTIPLIER = 'Bid Multiplier',
  BIDED_KEYWORD = 'Keyword',
  BRAND_NAME = 'brandName',
  BUDGET = 'Budget',
  CAMPAIGN = 'Campaign',
  CAMPAIGN_STATUS = 'Campaign Status',
  CLICKS = 'Clicks',
  COMPLETE_VIEW_AD_ORDERS = 'Complete View Ad Orders',
  COMPLETE_VIEW_AD_SALES = 'Complete View Ad Sales',
  COMPLETE_VIEW_AD_UNITS = 'Complete View Ad Units',
  COST_TYPE = 'Cost Type',
  BID_OPTIMIZATION = 'Bid Optimization',
  CREATION_DATE = 'Creation Date',
  CREATION_DATE_TIME = 'Creation Date',
  CREATIVE_ASINS = 'Creative Asins',
  CREATIVE_TYPE = 'Creative Type',
  CTR = 'CTR',
  CPC = 'CPC',
  CVR = 'CVR',
  CVR_ORDERS_BASED = 'CVR (Orders Based)',
  CVR_UNITS_BASED = 'CVR (Units Based)',
  DAILY_BUDGET = 'Daily Budget',
  DAILY_REMAINING_BUDGET = 'Daily Remaining Budget',
  DEFAULT_BID = 'Default Bid',
  END_DATE = 'End Date',
  IMPRESSIONS = 'Impressions',
  JOB_ID = 'jobId',
  KEYWORD = 'Keyword',
  KEYWORDS = 'Keywords',
  KEYWORD_STATUS = 'Status',
  KEYWORD_TEXT = 'Keyword',
  LANDING_PAGE_TYPE = 'Landing Page Type',
  LAST_TRIGGERED_AT = 'lastTriggeredAt',
  LAST_UPDATED_DATE = 'Last Updated Date',
  LISTING_PRICE = 'Listing Price',
  MATCH_TYPE = 'Match Type',
  MAX_BID = 'Max. Bid',
  META_ID = 'Meta Id',
  META_TYPE = 'Meta Type',
  MIN_BID = 'Min. Bid',
  NEXT_TRIGGER_AT = 'nextTriggerAt',
  NORMALIZED_KEYWORD = 'Normalized Keyword',
  NTB_ORDERS = 'NTB Orders',
  NTB_SALES = 'NTB Sales',
  NTB_UNITS = 'NTB Units',
  OTHER_COMPLETE_VIEW_AD_SALES = 'Other Complete View Ad Sales',
  OTHER_SKU_SALES = 'Other SKU Sales',
  OTHER_SKU_UNITS = 'Other SKU Units',
  OUT_OF_BUDGET_TIME = 'Out of Budget Time',
  PAGE_TYPE = 'Page Type',
  PERCENT_NTB_ORDERS = 'Percent NTB Orders',
  PERCENT_NTB_SALES = 'Percent NTB Sales',
  PERCENT_NTB_UNITS = 'Percent NTB Units',
  PLACEMENT = 'Placement',
  PLATFORM = 'Platform',
  PRODUCT_AD = 'Product Ad',
  PRODUCT_BID = 'Product Bid',
  CREATE_PRODUCT_NAME = 'Product Name',
  REMOVE = 'Remove',
  ROAS = 'ROAS',
  SCHEDULE_TYPE = 'Schedule Type',
  SEARCH_TERM = 'Search Term',
  SERVING_STATUS = 'Serving Status',
  START_DATE = 'Start Date',
  STATUS = 'Status',
  SUGGESTED_BID = 'Suggested Bid',
  SUGGESTED_DAILY_BUDGET = 'Sugg. Daily Budget',
  SUGGESTED_TOTAL_BUDGET = 'Sugg. Total Budget',
  TACTIC = 'Tactic',
  TARGET_ROAS = 'Target ROAS',
  TARGETING = 'Targeting',
  TARGETING_TYPE = 'Targeting Type',
  TOTAL_BUDGET = 'Total Budget',
  AUTH_ORDERS = 'Auth Orders',
  TOTAL_REMAINING_BUDGET = 'Total Remaining Budget',
  TRIGGERED_AT = 'triggeredAt',
  UNITS_SOLD = 'Ad Units',
  VCTR = 'vCTR',
  VIDEO_5_SECOND_VIEW_RATE = 'Video 5 Second View Rate',
  VIDEO_5_SECOND_VIEWS = 'Video 5 Second Views',
  VIDEO_COMPLETE_VIEWS = 'Video Complete Views',
  VIDEO_FIRST_QUARTILE_VIEWS = 'Video First Quartile Views',
  VIDEO_IMPRESSIONS = 'Video Impressions',
  VIDEO_MIDPOINT_VIEWS = 'Video Midpoint Views',
  VIDEO_THIRD_QUARTILE_VIEWS = 'Video Third Quartile Views',
  VIDEO_UNMUTES = 'Video Unmutes',
  VIEWABLE_IMPRESSIONS = 'Viewable Impressions',
  VIEW_STATUS = 'Status',
  VIEW_THROUGH_AD_ORDERS = 'View-Through Ad Orders',
  VIEW_THROUGH_AD_SALES = 'View-Through Ad Sales',
  VIEW_THROUGH_AD_UNITS = 'View-Through Ad Units',
  VTR = 'VTR',
  IN_STORE_ATTRIBUTES_SALES = 'In-Store Attributes Sales',
  IN_STORE_ADVERTISED_SALES = 'In-Store Advertised Sales',
  IN_STORE_OTHER_SALES = 'In-Store Other Sales',
  IN_STORE_UNITS_SOLD = 'In-Store Units Sold',
  IN_STORE_ORDERS = 'In-Store Orders',
  OMNI_CHANNEL_SALES = 'Omnichannel Sales',
  OMNI_CHANNEL_ROAS = 'Omnichannel ROAS',
  BUDGET_TYPE = 'Budget Type',
  TASK_TYPE = 'Task Type',
  TASK_COMPLETED_AT = 'Task Completed At',
  TASK_STARTED_AT = 'Task Started At',
  TASK_CREATED_AT = 'Task Created At',
  MARKETPLACE = 'Marketplace',
  TIME_TO_START = 'Time taken to start',
  TOTAL_LIFE_TIME = 'Total Life Time',
  TIME_TAKEN_TO_COMPLETE = 'Time taken to complete',
  TASK_ID = 'Task Id',
  MONITORING_PAYLOAD = 'Payload',
  AUTH_UNITS = 'authUnits',
  TOTAL_SALES = 'authSales',
  GMV_SALES = 'gmvSales',
  GMV_UNITS = 'gmvUnits',
  TACOS = 'tacos',
  TOTAL_SALES_DATE_LABEL = 'totalSalesDateLabel',
  TOTAL_UNITS_RETURNED = 'totalUnitsReturned',
  TOTAL_RETURNS_VALUE = 'totalReturnsValue',
  CANCELLED_SALES = 'cancelledSales',
  CANCELLED_UNITS = 'cancelledUnits',
  WALMART_WFS_UNITS = 'walmartWfsUnits',
  WALMART_WFS_SALES = 'walmartWfsSales',
  WALMART_SELLER_UNITS = 'walmartSellerUnits',
  WALMART_SELLER_SALES = 'walmartSellerSales',
  WALMART_3PL_UNITS = 'walmart3plUnits',
  WALMART_3PL_SALES = 'walmart3plSales',
  SP_AD_SPEND = 'spAdSpend',
  SP_AD_ORDERS = 'spAdOrders',
  SP_AD_UNITS = 'spAdUnits',
  SP_AD_SALES = 'spAdSales',
  SB_AD_SPEND = 'sbAdSpend',
  SB_AD_ORDERS = 'sbAdOrders',
  SB_AD_UNITS = 'sbAdUnits',
  SB_AD_SALES = 'sbAdSales',
  SV_AD_SPEND = 'svAdSpend',
  SV_AD_ORDERS = 'svAdOrders',
  SV_AD_UNITS = 'svAdUnits',
  SV_AD_SALES = 'svAdSales',
  PARTNER_ID = 'Partner ID',
  ORDER_DATE_LABEL = 'Order Date',
  PURCHASE_ORDER_ID = 'Purchase Order ID',
  PURCHASE_ORDER_LINE = 'Purchase Order Line',
  PURCHASE_ORDER_SKU = 'Purchase Order SKU',
  PURCHASE_ORDER_PRODUCT_NAME = 'Product Name',
  PURCHASE_ORDER_LINE_QUANTITY = 'Line Quantity',
  PURCHASE_STATUS = 'Purchase Status',
  PRODUCT_PRICE = 'Product Price',
  TOTAL_UNITS_SOLD = 'Units',
  ORDER_UNITS = 'Units',
  REFUND_UNITS = 'Refund Units',
  ORDER_COUNT = 'Orders',
  CANCELLED_UNITS_TABLE = 'Cancelled Units',
  GMV_COLUMN = 'GMV',
  TOTAL_AD_SPEND = 'Total Ad Spend',
  AUTH_SALES = 'Auth Sales',
  REFUND_SALES = 'Refund Sales',
  CANCELLED_SALES_TABLE = 'Cancelled Sales',
  COMMISSION_ON_PRODUCT_TABLE = 'Commission on Product',
  COMMISSION_ON_SHIPPING_TABLE = 'Commission on Shipping',
  EXCESS_REFUND_ADJUSTMENT_TABLE = 'Excess Refund Adjustment',
  EXTRA_DISCOUNT_TABLE = 'Extra Discount',
  OTHER_TAX_FEES_TABLE = 'Other Tax Fees',
  PRODUCT_TAX_TABLE = 'Product Tax',
  PRODUCT_TAX_WITHHELD_TABLE = 'Product Tax Withheld',
  PROMO_CODE_TABLE = 'Promo Code',
  WALMART_FUNDED_SAVINGS_TABLE = 'Walmart Funded Savings',
  WFS_FULFILLMENT_FEE_TABLE = 'WFS Fulfillment Fee',
  SHIPPING_TABLE = 'Shipping Fees',
  SHIPPING_TAX_TABLE = 'Shipping Tax',
  SHIPPING_TAX_WITHHELD_TABLE = 'Shipping Tax Withheld',
  WFS_RETURN_SHIPPING_FEE_TABLE = 'WFS Return Shipping Fee',
  WALMART_RETURN_SHIPPING_CHARGE_TABLE = 'Walmart Return Shipping Charge',
  NET_PROFIT = 'Net Profit',
  ADDITIONAL_FEES = 'Additional Fee',
  MORE_INFO = 'More Info',
  CORRELATION_ID = 'Correlation Id',
  PNL_PARAMETER = 'parameter',
  PNL_TOTAL = 'total',
  TRENDS_TOTAL = 'trendsTotal',
  TRENDS_PRODUCT = 'purchaseOrderProductName',
  MONITORING_METADATA = 'Metadata Details',
  RETRIGGER_ACTION = 'Re-Trigger Action',
  REDIRECT_URL = 'logs URL',
  COGS = 'Cogs',
  SERVICE_ORIGIN = 'Service Origin',
  RETRY_COUNT = 'Retry Count',
  PROFITABILITY_PRODUCT_DETAILS = 'Product Details',
  PROFITABILITY_ORDER_DETAILS = 'Order Details',
  AUTOMATION_STATUS = 'Automation Status',
  RULE_NAME = 'Rule Name',
  RULE_TYPE = 'Rule Type',
  NEXT_EXECUTION = 'Next Execution',
  EXECUTION_MODE = 'Execution Mode',
  ELAPSED_TIME = 'Elapsed Time',
  MESSAGE_GROUP_ID = 'Message Group Id',
  DEDUPLICATION_ID = 'Deduplication Id',
}

export enum AdvertisingTabRoutes {
  CAMPAIGN = 'campaign-tab',
  AD_GROUP = 'ad-group-tab',
  PRODUCT_ADS = 'product-ads-tab',
  KEYWORD_TARGETING = 'keyword-targeting-tab',
  PRODUCT_TARGETING = 'product-targeting-tab',
  AUTO_TARGETING = 'auto-targeting-tab',
  PLACEMENT = 'placement-tab',
  TARGETING = 'targeting-tab',
  SEARCH_TERM = 'search-term-tab',
  NEG_TARGETING = 'negative-targeting-tab',
  NEG_TARGETING_KEYWORD = 'keyword-negative-targeting-tab',
  NEG_TARGETING_PRODUCT = 'product-negative-targeting-tab',
  HISTORY = 'history-tab',
  CREATIVE = 'creative-tab',
  CONTEXTUAL_TARGETING = 'contextual-targeting-tab',
  AUDIENCE = 'audience-targeting-tab',
  PAGE_TYPE = 'page-type-tab',
  PLATFORM = 'platform-tab',
  BRANDS = 'brand-asset-tab',
  AUTOMATION_RULES = 'automation-rules-tab',
  AUTOMATION_HISTORY = 'automation-history-tab',
}

export enum CountryCodeEnum {
  ALL = 'ALL',
  Afghanistan = 'AF',
  AlandIslands = 'AX',
  Albania = 'AL',
  Algeria = 'DZ',
  AmericanSamoa = 'AS',
  Andorra = 'AD',
  Angola = 'AO',
  Anguilla = 'AI',
  Antarctica = 'AQ',
  AntiguaAndBarbuda = 'AG',
  Argentina = 'AR',
  Armenia = 'AM',
  Aruba = 'AW',
  Australia = 'AU',
  Austria = 'AT',
  Azerbaijan = 'AZ',
  Bahamas = 'BS',
  Bahrain = 'BH',
  Bangladesh = 'BD',
  Barbados = 'BB',
  Belarus = 'BY',
  Belgium = 'BE',
  Belize = 'BZ',
  Benin = 'BJ',
  Bermuda = 'BM',
  Bhutan = 'BT',
  Bolivia = 'BO',
  Bonaire = 'BQ',
  BosniaAndHerzegovina = 'BA',
  Botswana = 'BW',
  BouvetIsland = 'BV',
  Brazil = 'BR',
  BritishIndianOceanTerritory = 'IO',
  BruneiDarussalam = 'BN',
  Bulgaria = 'BG',
  BurkinaFaso = 'BF',
  Burundi = 'BI',
  CaboVerde = 'CV',
  Cambodia = 'KH',
  Cameroon = 'CM',
  Canada = 'CA',
  CaymanIslands = 'KY',
  CentralAfricanRepublic = 'CF',
  Chad = 'TD',
  Chile = 'CL',
  China = 'CN',
  ChristmasIsland = 'CX',
  CocosIslands = 'CC',
  Colombia = 'CO',
  Comoros = 'KM',
  Congo = 'CG',
  DemocraticRepublicOfTheCongo = 'CD',
  CookIslands = 'CK',
  CostaRica = 'CR',
  CoteDIvoire = 'CI',
  Croatia = 'HR',
  Cuba = 'CU',
  Curacao = 'CW',
  Cyprus = 'CY',
  Czechia = 'CZ',
  Denmark = 'DK',
  Djibouti = 'DJ',
  Dominica = 'DM',
  DominicanRepublic = 'DO',
  Ecuador = 'EC',
  Egypt = 'EG',
  ElSalvador = 'SV',
  EquatorialGuinea = 'GQ',
  Eritrea = 'ER',
  Estonia = 'EE',
  Eswatini = 'SZ',
  Ethiopia = 'ET',
  FalklandIslands = 'FK',
  FaroeIslands = 'FO',
  Fiji = 'FJ',
  Finland = 'FI',
  France = 'FR',
  FrenchGuiana = 'GF',
  FrenchPolynesia = 'PF',
  FrenchSouthernTerritories = 'TF',
  Gabon = 'GA',
  Gambia = 'GM',
  Georgia = 'GE',
  Germany = 'DE',
  Ghana = 'GH',
  Gibraltar = 'GI',
  Greece = 'GR',
  Greenland = 'GL',
  Grenada = 'GD',
  Guadeloupe = 'GP',
  Guam = 'GU',
  Guatemala = 'GT',
  Guernsey = 'GG',
  Guinea = 'GN',
  GuineaBissau = 'GW',
  Guyana = 'GY',
  Haiti = 'HT',
  HeardIslandAndMcDonaldIslands = 'HM',
  HolySee = 'VA',
  Honduras = 'HN',
  HongKong = 'HK',
  Hungary = 'HU',
  Iceland = 'IS',
  India = 'IN',
  Indonesia = 'ID',
  Iran = 'IR',
  Iraq = 'IQ',
  Ireland = 'IE',
  IsleOfMan = 'IM',
  Israel = 'IL',
  Italy = 'IT',
  Jamaica = 'JM',
  Japan = 'JP',
  Jersey = 'JE',
  Jordan = 'JO',
  Kazakhstan = 'KZ',
  Kenya = 'KE',
  Kiribati = 'KI',
  NorthKorea = 'KP',
  SouthKorea = 'KR',
  Kuwait = 'KW',
  Kyrgyzstan = 'KG',
  Laos = 'LA',
  Latvia = 'LV',
  Lebanon = 'LB',
  Lesotho = 'LS',
  Liberia = 'LR',
  Libya = 'LY',
  Liechtenstein = 'LI',
  Lithuania = 'LT',
  Luxembourg = 'LU',
  Macao = 'MO',
  Madagascar = 'MG',
  Malawi = 'MW',
  Malaysia = 'MY',
  Maldives = 'MV',
  Mali = 'ML',
  Malta = 'MT',
  MarshallIslands = 'MH',
  Martinique = 'MQ',
  Mauritania = 'MR',
  Mauritius = 'MU',
  Mayotte = 'YT',
  Mexico = 'MX',
  Micronesia = 'FM',
  Moldova = 'MD',
  Monaco = 'MC',
  Mongolia = 'MN',
  Montenegro = 'ME',
  Montserrat = 'MS',
  Morocco = 'MA',
  Mozambique = 'MZ',
  Myanmar = 'MM',
  Namibia = 'NA',
  Nauru = 'NR',
  Nepal = 'NP',
  Netherlands = 'NL',
  NewCaledonia = 'NC',
  NewZealand = 'NZ',
  Nicaragua = 'NI',
  Niger = 'NE',
  Nigeria = 'NG',
  Niue = 'NU',
  NorfolkIsland = 'NF',
  NorthMacedonia = 'MK',
  NorthernMarianaIslands = 'MP',
  Norway = 'NO',
  Oman = 'OM',
  Pakistan = 'PK',
  Palau = 'PW',
  Palestine = 'PS',
  Panama = 'PA',
  PapuaNewGuinea = 'PG',
  Paraguay = 'PY',
  Peru = 'PE',
  Philippines = 'PH',
  Pitcairn = 'PN',
  Poland = 'PL',
  Portugal = 'PT',
  PuertoRico = 'PR',
  Qatar = 'QA',
  Reunion = 'RE',
  Romania = 'RO',
  Russia = 'RU',
  Rwanda = 'RW',
  SaintBarthelemy = 'BL',
  SaintHelena = 'SH',
  SaintKittsAndNevis = 'KN',
  SaintLucia = 'LC',
  SaintMartin = 'MF',
  SaintPierreAndMiquelon = 'PM',
  SaintVincentAndTheGrenadines = 'VC',
  Samoa = 'WS',
  SanMarino = 'SM',
  SaoTomeAndPrincipe = 'ST',
  SaudiArabia = 'SA',
  Senegal = 'SN',
  Serbia = 'RS',
  Seychelles = 'SC',
  SierraLeone = 'SL',
  Singapore = 'SG',
  SintMaarten = 'SX',
  Slovakia = 'SK',
  Slovenia = 'SI',
  SolomonIslands = 'SB',
  Somalia = 'SO',
  SouthAfrica = 'ZA',
  SouthSudan = 'SS',
  Spain = 'ES',
  SriLanka = 'LK',
  Sudan = 'SD',
  Suriname = 'SR',
  Sweden = 'SE',
  Switzerland = 'CH',
  Syria = 'SY',
  Taiwan = 'TW',
  Tajikistan = 'TJ',
  Tanzania = 'TZ',
  Thailand = 'TH',
  TimorLeste = 'TL',
  Togo = 'TG',
  Tokelau = 'TK',
  Tonga = 'TO',
  TrinidadAndTobago = 'TT',
  Tunisia = 'TN',
  Turkey = 'TR',
  Turkmenistan = 'TM',
  Tuvalu = 'TV',
  Uganda = 'UG',
  Ukraine = 'UA',
  UnitedArabEmirates = 'AE',
  UnitedKingdom = 'UK',
  UnitedStates = 'US',
  Uruguay = 'UY',
  Uzbekistan = 'UZ',
  Vanuatu = 'VU',
  Venezuela = 'VE',
  Vietnam = 'VN',
  Yemen = 'YE',
  Zambia = 'ZM',
  Zimbabwe = 'ZW',
}

export enum MailIDEnum {
  TECH = 'tech@anarix.ai',
  BHARATH = 'bharath@anarix.ai',
  SUNIL = 'sunil@anarix.ai',
}

export enum NudgeNotificationTitleEnum {
  MAX_BID_KEYWORDS = 'Campaign Underutilization Alert:',
  LESS_THAN_50_BUDGET_SPENT = 'Spending Below 50% of Budget',
  LESS_THAN_20_BUDGET_SPENT = 'Spending Below 20% of Budget',
  ENABLE_BID_AUTOMATION = 'Enable Bid Automation!',
  OUT_OF_BUDGET = 'Out of Budget!',
  BID_AUTOMATION_NOT_ACTIVE = 'Enable Bid Automation!',
}

export enum NudgeNotificationHeaderEnum {
  MAX_BID_KEYWORDS = 'maxBidKeywords',
  LESS_THAN_20_BUDGET_SPENT = 'lowBudget20',
  LESS_THAN_50_BUDGET_SPENT = 'lowBudget50',
  OUT_OF_BUDGET = 'outOfBudget',
  BID_AUTOMATION_NOT_ACTIVE = 'bidAutomationNotActive',
}

export enum BidderAdTypeEnum {
  SP = 'sp',
  SB = 'sb',
  SD = 'sd',
  SV = 'sv',
}

export enum AmazonCostTypeEnum {
  CPC = 'CPC',
  VCPM = 'VCPM',
}

export enum AmazonSBBudgetTypeEnum {
  DAILY = 'DAILY',
  LIFETIME = 'LIFETIME',
}

export enum RuleAutomationStatusEnum {
  ENABLED = 'ENABLED',
  PAUSED = 'PAUSED',
}

export enum AmazonWebsiteUrlEnum {
  UNITED_STATES = 'https://www.amazon.com',
  CANADA = 'https://www.amazon.ca',
  MEXICO = 'https://www.amazon.com.mx',
  BRAZIL = 'https://www.amazon.com.br',
  JAPAN = 'https://www.amazon.co.jp',
  AUSTRALIA = 'https://www.amazon.com.au',
  SINGAPORE = 'https://www.amazon.sg',
  UNITED_KINGDOM = 'https://www.amazon.co.uk',
  FRANCE = 'https://www.amazon.fr',
  ITALY = 'https://www.amazon.it',
  SPAIN = 'https://www.amazon.es',
  GERMANY = 'https://www.amazon.de',
  NETHERLANDS = 'https://www.amazon.nl',
  UNITED_ARAB_EMIRATES = 'https://www.amazon.ae',
  POLAND = 'https://www.amazon.pl',
  TURKEY = 'https://www.amazon.com.tr',
  EGYPT = 'https://www.amazon.eg',
  SOUTH_AFRICA = 'https://www.amazon.co.za',
  SAUDI_ARABIA = 'https://www.amazon.sa',
  SWEDEN = 'https://www.amazon.se',
  INDIA = 'https://www.amazon.in',
  BELGIUM = 'https://www.amazon.com.be',
}
