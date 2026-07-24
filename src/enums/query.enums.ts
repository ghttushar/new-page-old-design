import {
  OverallAccountLevelTitles,
  SbAccountLevelTitles,
  SbAdGroupLevelTitles,
  SbCampaignLevelTitles,
  SdAccountLevelTitles,
  SdAdGroupLevelTitles,
  SdCampaignLevelTitles,
  SpAccountLevelTitles,
  SpAdGroupLevelTitles,
  SpCampaignLevelTitles,
  WalmartOverallAccountLevelTitles,
  WalmartSBAccountLevelTitles,
  WalmartSBAdGroupLevelTitles,
  WalmartSBCampaignLevelTitles,
  WalmartSPAccountLevelTitles,
  WalmartSPAdGroupLevelTitles,
  WalmartSPCampaignLevelTitles,
  WalmartSVAccountLevelTitles,
  WalmartSVAdGroupLevelTitles,
  WalmartSVCampaignLevelTitles,
} from './advertising.enums';
import { CatalogTabTitlesEnum } from './catalog.enums';

export enum QueryKeyEnums {
  ALL = 'ALL',
  KEYWORD_TRACKER_FETCH = 'fetchKeywords',
  IMPACT_ANALYSIS_FETCH = 'fetchImpactAnalysis',

  FETCH_IMPACT_ANALYSIS_GRAPH = 'fetchImpactAnalysisGraph',
  FETCH_IMPACT_ANALYSIS_TABLE = 'fetchImpactAnalysisTableData',

  /* Advertising Metrics and Graph */
  ADVERTISING_METRICS_FETCH = 'fetchAdvertisingMetrics',
  ADVERTISING_GRAPH_FETCH = 'fetchAdvertisingGraph',

  /* Amazon SP */
  AMZ_SP_ACCOUNT_LVL_CAMPAIGNS_FETCH = SpAccountLevelTitles.CAMPAIGNS,
  AMZ_SP_ACCOUNT_LVL_ADGROUPS_FETCH = SpAccountLevelTitles.AD_GROUPS,
  AMZ_SP_ACCOUNT_LVL_PRODUCT_ADS_FETCH = SpAccountLevelTitles.PRODUCT_ADS,
  AMZ_SP_ACCOUNT_LVL_PT_FETCH = SpAccountLevelTitles.PRODUCT_TARGETING,
  AMZ_SP_ACCOUNT_LVL_KT_FETCH = SpAccountLevelTitles.KEYWORD_TARGETING,
  AMZ_SP_ACCOUNT_LVL_AUTO_FETCH = SpAccountLevelTitles.AUTO_TARGETING,
  AMZ_SP_ACCOUNT_LVL_SEARCH_TERM_FETCH = SpAccountLevelTitles.SEARCH_TERM,
  AMZ_SP_ACCOUNT_LVL_PLACEMENTS_FETCH = SpAccountLevelTitles.PLACEMENT,
  AMZ_SP_CAMPAIGN_LVL_FETCH = 'fetchAmazonSPSelectedCampaign',
  AMZ_SP_CAMPAIGN_LVL_ADGROUPS_FETCH = SpCampaignLevelTitles.AD_GROUPS,
  AMZ_SP_CAMPAIGN_LVL_PRODUCT_ADS_FETCH = SpCampaignLevelTitles.PRODUCT_ADS,
  AMZ_SP_CAMPAIGN_LVL_PT_FETCH = SpCampaignLevelTitles.PRODUCT_TARGETING,
  AMZ_SP_CAMPAIGN_LVL_KT_FETCH = SpCampaignLevelTitles.KEYWORD_TARGETING,
  AMZ_SP_CAMPAIGN_LVL_AUTO_FETCH = SpCampaignLevelTitles.AUTO_TARGETING,
  AMZ_SP_CAMPAIGN_LVL_SEARCH_TERM_FETCH = SpCampaignLevelTitles.SEARCH_TERM,
  AMZ_SP_CAMPAIGN_LVL_NEG_TARGETING_KEYWORD_FETCH = SpCampaignLevelTitles.NEG_TARGETING_KEYWORD,
  AMZ_SP_CAMPAIGN_LVL_NEG_TARGETING_PRODUCT_FETCH = SpCampaignLevelTitles.NEG_TARGETING_PRODUCT,
  AMZ_SP_CAMPAIGN_LVL_PLACEMENTS_FETCH = SpCampaignLevelTitles.PLACEMENT,
  AMZ_SP_CAMPAIGN_LVL_HISTORY_FETCH = SpCampaignLevelTitles.HISTORY,
  AMZ_SP_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH = SpCampaignLevelTitles.AUTOMATION_RULES,
  AMZ_SP_ADGROUP_LVL_FETCH = 'fetchAmazonSPSelectedAdGroup',
  AMZ_SP_ADGROUP_LVL_PRODUCT_ADS_FETCH = SpAdGroupLevelTitles.PRODUCT_ADS,
  AMZ_SP_ADGROUP_LVL_KT_FETCH = SpAdGroupLevelTitles.KEYWORD_TARGETING,
  AMZ_SP_ADGROUP_LVL_PT_FETCH = SpAdGroupLevelTitles.PRODUCT_TARGETING,
  AMZ_SP_ADGROUP_LVL_HISTORY_FETCH = SpAdGroupLevelTitles.HISTORY,
  AMZ_SP_ADGROUP_LVL_NEG_KT_FETCH = SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD,
  AMZ_SP_ADGROUP_LVL_NEG_PT_FETCH = SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT,
  AMZ_SP_ADGROUP_LVL_SEARCH_TERM_FETCH = SpAdGroupLevelTitles.SEARCH_TERM,
  AMZ_SP_ADGROUP_LVL_AUTO_FETCH = SpAdGroupLevelTitles.TARGETING,

  /* Amazon Overall */
  AMZ_OVERALL_ACCOUNT_LVL_CAMPAIGN_FETCH = OverallAccountLevelTitles.CAMPAIGNS,
  AMZ_OVERALL_ACCOUNT_LVL_AD_GROUP_FETCH = OverallAccountLevelTitles.AD_GROUPS,
  AMZ_OVERALL_ACCOUNT_LVL_PRODUCT_ADS_FETCH = OverallAccountLevelTitles.PRODUCT_ADS,
  AMZ_OVERALL_ACCOUNT_LVL_KT_FETCH = OverallAccountLevelTitles.KEYWORD_TARGETING,
  AMZ_OVERALL_ACCOUNT_LVL_PT_FETCH = OverallAccountLevelTitles.PRODUCT_TARGETING,
  AMZ_OVERALL_ACCOUNT_LVL_SEARCH_TERM_FETCH = OverallAccountLevelTitles.SEARCH_TERM,

  /* Amazon SD */
  AMZ_SD_ACCOUNT_LVL_CAMPAIGNS_FETCH = SdAccountLevelTitles.CAMPAIGN,
  AMZ_SD_ACCOUNT_LVL_ADGROUPS_FETCH = SdAccountLevelTitles.AD_GROUP,
  AMZ_SD_ACCOUNT_LVL_PRODUCT_ADS_FETCH = SdAccountLevelTitles.PRODUCT_ADS,
  AMZ_SD_ACCOUNT_LVL_CON_TARGETING_FETCH = SdAccountLevelTitles.CONTEXTUAL_TARGETING,
  AMZ_SD_ACCOUNT_LVL_AUDIENCE_FETCH = SdAccountLevelTitles.AUDIENCE,
  AMZ_SD_CAMPAIGN_LVL_FETCH = 'fetchAmazonSDSelectedCampaign',
  AMZ_SD_CAMPAIGN_LVL_ADGROUP_FETCH = SdCampaignLevelTitles.AD_GROUP,
  AMZ_SD_CAMPAIGN_LVL_PRODUCT_ADS_FETCH = SdCampaignLevelTitles.PRODUCT_ADS,
  AMZ_SD_CAMPAIGN_LVL_HISTORY_FETCH = SdCampaignLevelTitles.HISTORY,
  AMZ_SD_CAMPAIGN_LVL_TARGETING_FETCH = SdCampaignLevelTitles.TARGETING,
  AMZ_SD_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH = SdCampaignLevelTitles.AUTOMATION_RULES,
  AMZ_SD_ADGROUP_LVL_FETCH = 'fetchAmazonSDSelectedAdGroup',
  AMZ_SD_ADGROUP_LVL_CREATIVE_FETCH = SdAdGroupLevelTitles.CREATIVE,
  AMZ_SD_ADGROUP_LVL_PRODUCT_ADS_FETCH = SdAdGroupLevelTitles.PRODUCT_ADS,
  AMZ_SD_ADGROUP_LVL_HISTORY_FETCH = SdAdGroupLevelTitles.HISTORY,
  AMZ_SD_ADGROUP_LVL_TARGETING_FETCH = SdAdGroupLevelTitles.TARGETING,

  /* Amazon SB */
  AMZ_SB_ACCOUNT_LVL_CAMPAIGNS_FETCH = SbAccountLevelTitles.CAMPAIGNS,
  AMZ_SB_ACCOUNT_LVL_ADGROUPS_FETCH = SbAccountLevelTitles.AD_GROUP,
  AMZ_SB_ACCOUNT_LVL_PRODUCT_ADS_FETCH = SbAccountLevelTitles.PRODUCT_ADS,
  AMZ_SB_ACCOUNT_LVL_PT_FETCH = SbAccountLevelTitles.PRODUCT_TARGETING,
  AMZ_SB_ACCOUNT_LVL_KT_FETCH = SbAccountLevelTitles.KEYWORD_TARGETING,
  AMZ_SB_ACCOUNT_LVL_SEARCH_TERM_FETCH = SbAccountLevelTitles.SEARCH_TERM,
  AMZ_SB_CAMPAIGN_LVL_FETCH = 'fetchAmazonSBSelectedCampaign',
  AMZ_SB_CAMPAIGN_LVL_ADGROUP_FETCH = SbCampaignLevelTitles.AD_GROUP,
  AMZ_SB_CAMPAIGN_LVL_PRODUCT_ADS_FETCH = SbCampaignLevelTitles.PRODUCT_ADS,
  AMZ_SB_CAMPAIGN_LVL_KT_FETCH = SbCampaignLevelTitles.KEYWORD_TARGETING,
  AMZ_SB_CAMPAIGN_LVL_PT_FETCH = SbCampaignLevelTitles.PRODUCT_TARGETING,
  AMZ_SB_CAMPAIGN_LVL_NEG_KT_FETCH = SbCampaignLevelTitles.NEG_TARGETING_KEYWORD,
  AMZ_SB_CAMPAIGN_LVL_NEG_PT_FETCH = SbCampaignLevelTitles.NEG_TARGETING_PRODUCT,
  AMZ_SB_CAMPAIGN_LVL_SEARCH_TERM_FETCH = SbCampaignLevelTitles.SEARCH_TERM_KEYWORD,
  AMZ_SB_CAMPAIGN_LVL_HISTORY_FETCH = SbCampaignLevelTitles.HISTORY,
  AMZ_SB_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH = SbCampaignLevelTitles.AUTOMATION_RULES,
  AMZ_SB_ADGROUP_LVL_FETCH = 'fetchAmazonSBSelectedAdGroup',
  AMZ_SB_ADGROUP_LVL_CREATIVE_FETCH = SbAdGroupLevelTitles.CREATIVE,
  AMZ_SB_ADGROUP_LVL_PRODUCT_ADS_FETCH = SbAdGroupLevelTitles.PRODUCT_ADS,
  AMZ_SB_ADGROUP_LVL_KT_FETCH = SbAdGroupLevelTitles.KEYWORD_TARGETING,
  AMZ_SB_ADGROUP_LVL_PT_FETCH = SbAdGroupLevelTitles.PRODUCT_TARGETING,
  AMZ_SB_ADGROUP_LVL_NEG_KT_FETCH = SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD,
  AMZ_SB_ADGROUP_LVL_NEG_PT_FETCH = SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT,
  AMZ_SB_ADGROUP_LVL_SEARCH_TERM_FETCH = SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD,

  /* Logs */
  LOGS_FETCH = 'fetchLogs',

  /* Walmart Overall */
  WMT_OVERALL_ACCOUNT_LVL_CAMPAIGN_FETCH = WalmartOverallAccountLevelTitles.CAMPAIGNS,
  WMT_OVERALL_ACCOUNT_LVL_ADGROUP_FETCH = WalmartOverallAccountLevelTitles.AD_GROUPS,
  WMT_OVERALL_ACCOUNT_LVL_PRODUCT_ADS_FETCH = WalmartOverallAccountLevelTitles.AD_ITEMS,
  WMT_OVERALL_ACCOUNT_LVL_KT_FETCH = WalmartOverallAccountLevelTitles.KEYWORD_TARGETING,
  WMT_OVERALL_ACCOUNT_LVL_SEARCH_TERM_FETCH = WalmartOverallAccountLevelTitles.SEARCH_TERM,
  WMT_OVERALL_ACCOUNT_LVL_PAGE_TYPE_FETCH = WalmartOverallAccountLevelTitles.PAGE_TYPE,
  WMT_OVERALL_ACCOUNT_LVL_PLATFORM_FETCH = WalmartOverallAccountLevelTitles.PLATFORM,

  /* Walmart SP */
  WMT_SP_ACCOUNT_LVL_CAMPAIGN_FETCH = WalmartSPAccountLevelTitles.CAMPAIGNS,
  WMT_SP_ACCOUNT_LVL_ADGROUP_FETCH = WalmartSPAccountLevelTitles.AD_GROUPS,
  WMT_SP_ACCOUNT_LVL_PRODUCT_ADS_FETCH = WalmartSPAccountLevelTitles.AD_ITEMS,
  WMT_SP_ACCOUNT_LVL_KT_FETCH = WalmartSPAccountLevelTitles.KEYWORD_TARGETING,
  WMT_SP_ACCOUNT_LVL_SEARCH_TERM_FETCH = WalmartSPAccountLevelTitles.SEARCH_TERM,
  WMT_SP_ACCOUNT_LVL_PAGE_TYPE_FETCH = WalmartSPAccountLevelTitles.PAGE_TYPE,
  WMT_SP_ACCOUNT_LVL_PLATFORM_FETCH = WalmartSPAccountLevelTitles.PLATFORM,
  WMT_SP_CAMPAIGN_LVL_FETCH = 'fetchWalmartSPSelectedCampaign',
  WMT_SP_CAMPAIGN_LVL_ADGROUPS_FETCH = WalmartSPCampaignLevelTitles.AD_GROUPS,
  WMT_SP_CAMPAIGN_LVL_PRODUCT_ADS_FETCH = WalmartSPCampaignLevelTitles.AD_ITEMS,
  WMT_SP_CAMPAIGN_LVL_KT_FETCH = WalmartSPCampaignLevelTitles.KEYWORD_TARGETING,
  WMT_SP_CAMPAIGN_LVL_SEARCH_TERM_FETCH = WalmartSPCampaignLevelTitles.SEARCH_TERM,
  WMT_SP_CAMPAIGN_LVL_PAGE_TYPE_FETCH = WalmartSPCampaignLevelTitles.PAGE_TYPE,
  WMT_SP_CAMPAIGN_LVL_PLATFORM_FETCH = WalmartSPCampaignLevelTitles.PLATFORM,
  WMT_SP_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH = WalmartSPCampaignLevelTitles.AUTOMATION_RULES,
  WMT_SP_ADGROUP_LVL_FETCH = 'fetchWalmartSPSelectedAdGroup',
  WMT_SP_ADGROUP_LVL_PRODUCT_ADS_FETCH = WalmartSPAdGroupLevelTitles.AD_ITEMS,
  WMT_SP_ADGROUP_LVL_KT_FETCH = WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING,
  WMT_SP_ADGROUP_LVL_SEARCH_TERM_FETCH = WalmartSPAdGroupLevelTitles.SEARCH_TERM,

  /* Walmart SB */
  WMT_SB_ACCOUNT_LVL_CAMPAIGN_FETCH = WalmartSBAccountLevelTitles.CAMPAIGNS,
  WMT_SB_ACCOUNT_LVL_ADGROUP_FETCH = WalmartSBAccountLevelTitles.AD_GROUPS,
  WMT_SB_ACCOUNT_LVL_PRODUCT_ADS_FETCH = WalmartSBAccountLevelTitles.AD_ITEMS,
  WMT_SB_ACCOUNT_LVL_KT_FETCH = WalmartSBAccountLevelTitles.KEYWORD_TARGETING,
  WMT_SB_ACCOUNT_LVL_PAGE_TYPE_FETCH = WalmartSBAccountLevelTitles.PAGE_TYPE,
  WMT_SB_ACCOUNT_LVL_PLATFORM_FETCH = WalmartSBAccountLevelTitles.PLATFORM,
  WMT_SB_ACCOUNT_LVL_SEARCH_TERM_FETCH = WalmartSBAccountLevelTitles.SEARCH_TERM,
  WMT_SB_CAMPAIGN_LVL_FETCH = 'fetchWalmartSBSelectedCampaign',
  WMT_SB_CAMPAIGN_LVL_ADGROUPS_FETCH = WalmartSBCampaignLevelTitles.AD_GROUPS,
  WMT_SB_CAMPAIGN_LVL_PRODUCT_ADS_FETCH = WalmartSBCampaignLevelTitles.AD_ITEMS,
  WMT_SB_CAMPAIGN_LVL_KT_FETCH = WalmartSBCampaignLevelTitles.KEYWORD_TARGETING,
  WMT_SB_CAMPAIGN_LVL_SEARCH_TERM_FETCH = WalmartSBCampaignLevelTitles.SEARCH_TERM,
  WMT_SB_CAMPAIGN_LVL_PAGE_TYPE_FETCH = WalmartSBCampaignLevelTitles.PAGE_TYPE,
  WMT_SB_CAMPAIGN_LVL_PLATFORM_FETCH = WalmartSBCampaignLevelTitles.PLATFORM,
  WMT_SB_CAMPAIGN_LVL_BRANDS_FETCH = WalmartSBCampaignLevelTitles.BRANDS,
  WMT_SB_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH = WalmartSBCampaignLevelTitles.AUTOMATION_RULES,
  WMT_SB_ADGROUP_LVL_FETCH = 'fetchWalmartSBSelectedAdGroup',
  WMT_SB_ADGROUP_LVL_PRODUCT_ADS_FETCH = WalmartSBAdGroupLevelTitles.AD_ITEMS,
  WMT_SB_ADGROUP_LVL_KT_FETCH = WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING,
  WMT_SB_ADGROUP_LVL_SEARCH_TERM_FETCH = WalmartSBAdGroupLevelTitles.SEARCH_TERM,

  /* Walmart SV */
  WMT_SV_ACCOUNT_LVL_CAMPAIGN_FETCH = WalmartSVAccountLevelTitles.CAMPAIGNS,
  WMT_SV_ACCOUNT_LVL_ADGROUP_FETCH = WalmartSVAccountLevelTitles.AD_GROUPS,
  WMT_SV_ACCOUNT_LVL_PRODUCT_ADS_FETCH = WalmartSVAccountLevelTitles.AD_ITEMS,
  WMT_SV_ACCOUNT_LVL_KT_FETCH = WalmartSVAccountLevelTitles.KEYWORD_TARGETING,
  WMT_SV_ACCOUNT_LVL_PAGE_TYPE_FETCH = WalmartSVAccountLevelTitles.PAGE_TYPE,
  WMT_SV_ACCOUNT_LVL_PLATFORM_FETCH = WalmartSVAccountLevelTitles.PLATFORM,
  WMT_SV_ACCOUNT_LVL_SEARCH_TERM_FETCH = WalmartSVAccountLevelTitles.SEARCH_TERM,
  WMT_SV_ACCOUNT_LVL_VIDEO_FETCH = WalmartSVAccountLevelTitles.VIDEO,
  WMT_SV_CAMPAIGN_LVL_FETCH = 'fetchWalmartSVSelectedCampaign',
  WMT_SV_CAMPAIGN_LVL_ADGROUPS_FETCH = WalmartSVCampaignLevelTitles.AD_GROUPS,
  WMT_SV_CAMPAIGN_LVL_PRODUCT_ADS_FETCH = WalmartSVCampaignLevelTitles.AD_ITEMS,
  WMT_SV_CAMPAIGN_LVL_KT_FETCH = WalmartSVCampaignLevelTitles.KEYWORD_TARGETING,
  WMT_SV_CAMPAIGN_LVL_SEARCH_TERM_FETCH = WalmartSVCampaignLevelTitles.SEARCH_TERM,
  WMT_SV_CAMPAIGN_LVL_PAGE_TYPE_FETCH = WalmartSVCampaignLevelTitles.PAGE_TYPE,
  WMT_SV_CAMPAIGN_LVL_PLATFORM_FETCH = WalmartSVCampaignLevelTitles.PLATFORM,
  WMT_SV_CAMPAIGN_LVL_VIDEO_FETCH = WalmartSVCampaignLevelTitles.VIDEO,
  WMT_SV_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH = WalmartSVCampaignLevelTitles.AUTOMATION_RULES,
  WMT_SV_ADGROUP_LVL_FETCH = 'fetchWalmartSVSelectedAdGroup',
  WMT_SV_ADGROUP_LVL_PRODUCT_ADS_FETCH = WalmartSVAdGroupLevelTitles.AD_ITEMS,
  WMT_SV_ADGROUP_LVL_KT_FETCH = WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING,
  WMT_SV_ADGROUP_LVL_SEARCH_TERM_FETCH = WalmartSVAdGroupLevelTitles.SEARCH_TERM,

  /* Walmart SP Add Functionality Get Keywords */
  WMT_SP_ADD_FUNC_GET_KEYWORDS_FETCH = 'fetchWalmartSPKeywordsAddFunc',

  /* Walmart SB Add Functionality Get Keywords */
  WMT_SB_ADD_FUNC_GET_KEYWORDS_FETCH = 'fetchWalmartSBKeywordsAddFunc',

  /* Walmart SV Add Functionality Get Keywords */
  WMT_SV_ADD_FUNC_GET_KEYWORDS_FETCH = 'fetchWalmartSVKeywordsAddFunc',

  /* Walmart SP Add Functionality Get Products */
  WMT_SP_ADD_FUNC_GET_ENTITY_PRODUCTS_FETCH = 'fetchWalmartSPEntityProductsAddFunc',
  WMT_SP_ADD_FUNC_GET_AD_ITEMS_FETCH = 'fetchWalmartSPAdGroupLevelAdItemsAddFunc',

  /* Walmart SB Add Functionality Get Products */
  WMT_SB_ADD_FUNC_GET_ENTITY_PRODUCTS_FETCH = 'fetchWalmartSBEntityProductsAddFunc',
  WMT_SB_ADD_FUNC_GET_AD_ITEMS_FETCH = 'fetchWalmartSBAdGroupLevelAdItemsAddFunc',

  /* Walmart SV Add Functionality Get Products */
  WMT_SV_ADD_FUNC_GET_ENTITY_PRODUCTS_FETCH = 'fetchWalmartSVEntityProductsAddFunc',
  WMT_SV_ADD_FUNC_GET_AD_ITEMS_FETCH = 'fetchWalmartSVAdGroupLevelAdItemsAddFunc',

  /* Amazon Add Functionality Get Products */
  AMZ_ADD_FUNC_GET_ACCOUNT_PRODUCTS_FETCH = 'fetchAmazonAccountProductsAddFunc',
  AMZ_SP_ADD_FUNC_GET_PRODUCT_ADS_FETCH = 'fetchAmazonSPAdGroupLevelProductAdsAddFunc',
  AMZ_SD_ADD_FUNC_GET_PRODUCT_ADS_FETCH = 'fetchAmazonSDAdGroupLevelProductAdsAddFunc',

  /* Amazon Add Functionality Get Product Targeting */
  AMZ_SP_ADD_FUNC_GET_PT_FETCH = 'fetchAmazonSPAdGroupLevelProductTargetingAddFunc',
  AMZ_SB_ADD_FUNC_GET_PT_FETCH = 'fetchAmazonSBAdGroupLevelProductTargetingAddFunc',

  /* Amazon Add Functionality Get Keyword Targeting */
  AMZ_SP_ADD_FUNC_GET_KT_FETCH = 'fetchAmazonSPAdGroupLevelKeywordTargetingAddFunc',
  AMZ_SB_ADD_FUNC_GET_KT_FETCH = 'fetchAmazonSBAdGroupLevelKeywordTargetingAddFunc',

  /* Amazon Add Functionality Get Negative Keyword Targeting */
  AMZ_SP_ADD_FUNC_GET_NEG_KT_FETCH = 'fetchAmazonSPAdGroupLevelNegKeywordTargetingAddFunc',
  AMZ_SB_ADD_FUNC_GET_NEG_KT_FETCH = 'fetchAmazonSBAdGroupLevelNegKeywordTargetingAddFunc',

  /* Amazon Add Functionality Get Negative Product Targeting */
  AMZ_SP_ADD_FUNC_GET_NEG_PT_FETCH = 'fetchAmazonSPAdGroupLevelNegProductTargetingAddFunc',
  AMZ_SB_ADD_FUNC_GET_NEG_PT_FETCH = 'fetchAmazonSBAdGroupLevelNegProductTargetingAddFunc',

  /* Onboarding */
  AMZ_SP_ONBOARDING_CREDENTIALS_FETCH = 'fetchAmazonSPOnboardingCredentials',
  SEND_SELECTED_PROFILES = 'sendSelectedProfiles',
  AMZ_ADS_ONBOARDING_PROFILES_FETCH = 'fetchAmazonAdsProfiles',
  WMT_ACCOUNT_ONBOARDING_CREATE_ACCOUNT = 'createWalmartAccountOnboardingAccount',
  WMT_CONNECT_ACCOUNT_ONBOARDING_CREATE_ACCOUNT = 'createWalmartConnectAccountOnboardingAccount',
  WMT_SUPPLIER_ACCOUNT_ONBOARDING_CREATE_ACCOUNT = 'createWalmartSupplierAccountOnboardingAccount',

  /* Catalog */
  CATALOG_TABLE_FETCH = CatalogTabTitlesEnum.WALMART_CATALOG,
  CATALOG_TOTAL_FETCH = 'fetchCatalogTotal',
  AMAZON_CATALOG_TABLE_FETCH = CatalogTabTitlesEnum.AMAZON_CATALOG,
  AMAZON_CATALOG_TOTAL_FETCH = 'fetchAmazonCatalogTotal',

  /* Targeting Actions */
  WMT_KEYWORD_ADDITION_FETCH = 'fetchWalmartKeywordAction',
  WMT_TARGET_ACTION_HISTORY_FETCH = 'fetchWalmartTargetingActionHistory',
  WMT_TARGET_ACTION_ARCHIVE_FETCH = 'fetchWalmartTargetingActionArchive',
  AMZ_KEYWORD_ADDITION_FETCH = 'fetchAmazonKeywordAction',
  AMZ_PRODUCT_ADDITION_FETCH = 'fetchAmazonProductAction',
  AMZ_KEYWORD_NEGATION_FETCH = 'fetchAmazonKeywordNegation',
  AMZ_PRODUCT_NEGATION_FETCH = 'fetchAmazonProductNegation',
  AMZ_TARGET_ACTION_HISTORY_FETCH = 'fetchAmazonTargetingActionHistory',
  AMZ_TARGET_ACTION_ARCHIVE_FETCH = 'fetchAmazonTargetingActionArchive',
  WMT_ADS_ACCOUNT_FETCH_ADVERTISER_ID = 'fetchWalmartAdsAccountByAdvertiserId',
  WMT_CONNECT_CREATE_REPORT_SNAPSHOT = 'createWalmartConnectReportSnapshot',
  WMT_CONNECT_FETCH_REPORT_SNAPSHOT = 'fetchWalmartConnectReportSnapshot',

  // Marketing Intelligence
  MI_FETCH_BRAND_METRICS = 'fetchBrandMetrics',
  CREATE_SP_ONBOARDING_TASK = 'createSPOnboardingTask',

  // Master Sync
  IS_MASTER_SYNC_ALLOWED = 'isMasterSyncAllowed',
  MASTER_SYNC_TRIGGER = 'masterSyncTrigger',
  FETCH_SYNC_PROGRESS = 'fetchSyncProgress',

  // Chatbot
  HISTORY_METADATA_FETCH = 'fetchChatbotHistoryMetadata',
  HISTORY_CHAT_DATA_FETCH = 'fetchHistoryChatData',
  INSIGHTS_FETCH = 'fetchInsights',

  //AMZ-DAYPARTING
  FETCH_AMZ_DAYPARTING_JOBS = 'fetchAmzDayPartingJobs',
  DAYPARTING_CAMPAIGNS_LIST = 'daypartingCampaignsList',
  FETCH_AMAZON_HISTORY_DATA = 'fetchAmazonHistoryData',
  FETCH_HISTORY_CHANGES_DATA = 'fetchHistoryChangesData',
  FETCH_AMZ_DAYPARTING_JOB_BY_ID = 'fetchAmazonDayPartingJobByJobId',
  FETCH_AMZ_CAMPAIGNS_ALREADY_IN_DAYPARTING = 'fetchAmzCampaignsAlreadyInDayParting',
  FETCH_AMZ_METRICS_DATA = 'fetchAmazonMetricsData',

  //WMT-DAYPARTING
  FETCH_WMT_DAYPARTING_JOB_BY_ID = 'fetchWalmartDayPartingJobByJobId',
  FETCH_WALMART_DAYPARTING_CAMPAIGNS = 'fetchWalmartDayPartingCampaigns',
  FETCH_WALMART_CAMPAIGNS_ALREADY_IN_DAYPARTING = 'fetchWmtCampaignsAlreadyInDayParting',
  FETCH_WALMART_DAYPARTING_JOBS = 'fetchWalmartDayPartingJobs',
  FETCH_WALMART_HISTORY_DATA = 'fetchWalmartHistoryData',
  FETCH_WALMART_HISTORY_CHANGES_DATA = 'fetchWalmartHistoryChangesData',
  FETCH_WALMART_SCHEDULED_JOBS = 'fetchWalmartScheduledJob',

  /* Dummy */
  FETCH_DUMMY_TOAST_SUCCESS = 'fetchDummyToastSuccess',
  FETCH_DUMMY_TOAST_PARTIAL_SUCCESS = 'fetchDummyToastPartialSuccess',
  FETCH_DUMMY_TOAST_ERROR = 'fetchDummyToastError',

  // Monitoring
  FETCH_MONITORING_DROPDOWN_FILTERS = 'fetchMonitoringDropdownFilters',
  FETCH_MONITORING_HISTORY = 'fetchMonitoringHistoryData',
  FETCH_MONITORING_DATA = 'fetchMonitoringData',

  // Walmart Profitability
  FETCH_PROFITABILITY_GRAPH_DATA = 'fetchProfitabilityGraphData',
  FETCH_PROFITABILITY_PERFORMANCE_DATA = 'fetchProfitabilityPerformanceData',
  FETCH_PROFITABILITY_ORDERS_TABLE_DATA = 'fetchProfitabilityOrdersTableData',
  FETCH_PROFITABILITY_PRODUCTS_TABLE_DATA = 'fetchProfitabilityProductsTableData',
  FETCH_PROFITABILITY_TOTAL_TABLE_DATA = 'fetchProfitabilityTotalTableData',
  FETCH_PROFITABILITY_PNL_TABLE_DATA = 'fetchProfitabilityPNLTableData',
  FETCH_PROFITABILITY_SEARCHED_PNL_TABLE_DATA = 'fetchProfitabilitySearchedPNLTableData',
  FETCH_PRODUCT_SEARCH_GRAPH_DATA = 'fetchProductSearchGraphData',
  FETCH_PRODUCT_SEARCH_TRENDS_DATA = 'fetchProductSearchTrendsData',
  FETCH_PRODUCT_SEARCH_TRENDS_TOTAL_DATA = 'fetchProductSearchTrendsTotalData',
  FETCH_AVAILABLE_PRODUCTS_DATA = 'fetchAvailableProductsData',
  FETCH_PROFITABILITY_TOTAL_PRODUCTS_DATA = 'fetchProfitabilityTotalProductsTableData',

  //Amazon Profitability
  FETCH_AMAZON_PROFITABILITY_ORDERS_TABLE_DATA = 'fetchAmazonProfitabilityOrdersTableData',
  FETCH_AMAZON_PROFITABILITY_ORDERS_AGGREGATED_DATA = 'fetchAmazonProfitabilityOrdersAggregatedData',
  FETCH_AMAZON_PROFITABILITY_PRODUCTS_TABLE_DATA = 'fetchAmazonProfitabilityProductsTableData',
  FETCH_AMAZON_PROFITABILITY_PRODUCTS_AGGREGATED_DATA = 'fetchAmazonProfitabilityProductsAggregatedData',
  FETCH_AMAZON_PROFITABILITY_PERFORMANCE_DATA = 'fetchAmazonProfitabilityPerformanceData',
  FETCH_AMAZON_PROFITABILITY_GRAPH_DATA = 'fetchAmazonProfitabilityGraphData',
  FETCH_AMAZON_PROFITABILITY_ALL_PRODUCTS_LIST = 'fetchAmazonProfitabilityAllProductsList',
  FETCH_AMAZON_PROFITABILITY_TRENDS_DATA = 'fetchAmazonProfitabilityTrendsData',
  FETCH_AMAZON_PROFITABILITY_TRENDS_TOTAL_DATA = 'fetchAmazonProfitabilityTrendsTotalData',
  FETCH_AMAZON_PROFITABILITY_TRENDS_PRODUCT_LEVEL_DATA = 'fetchAmazonProfitabilityTrendsProductLevelData',

  // Bidder Dashboard
  FETCH_BIDDER_DASHBOARD_DATA = 'fetchBidderDashboardData',
  FETCH_BIDDER_DASHBOARD_FILTER_OPTIONS = 'fetchBidderDashboardFilterOptions',

  // Rules
  FETCH_TEMPLATE_FROM_PROMPT = 'fetchTemplateFromPrompt',
  FETCH_RULE_TYPES = 'fetchRuleTypes',
  FETCH_RULE_TEMPLATES_BY_RULE_TYPE = 'fetchRuleTemplatesByRuleType',
  FETCH_TEMPLATE_BY_TEMPLATE_ID = 'fetchTemplateByTemplateId',
  FETCH_RULE_BY_RULE_ID = 'fetchRuleByRuleId',
  FETCH_LINKABLE_TABLE_DATA = 'fetchLinkableTableData',
  FETCH_RULE_CONSTRAINTS_BY_RULE_TYPE = 'fetchRuleConstraintsByRuleType',
  FETCH_APPLIED_RULES = 'fetchAppliedRules',
  FETCH_APPLIED_RULES_ENTITY_LIST = 'fetchAppliedRulesEntityList',

  // Configuration
  FETCH_CONFIGURATION_DATA = 'fetchConfigurationData',
  FETCH_SOURCE_TARGET_MAPPING = 'fetchSourceTargetMapping',
  GENERATE_SOURCE_TARGET_MAPPING = 'generateSourceTargetMapping',
  FETCH_METRICS_CONFIGURATION = 'fetchMetricsConfiguration',
  FETCH_CRON_DEFINITIONS = 'fetchCronDefinitions',
  FETCH_SQS_QUEUES = 'fetchSQSQueues',
  FETCH_HERO_ITEMS = 'fetchHeroItems',

  // TAGGING
  FETCH_TAGS_LIST = 'fetchTagsList',
}
