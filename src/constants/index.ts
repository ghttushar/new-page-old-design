import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { CountryCodeEnum } from '@/enums/advertising.enums';
import { Range } from '@/enums/serp.enums';
import { ENV_VARIABLES } from './env.constants';

// Not export because we don't want this to be used directly
const AMC_BASE_URL = `${ENV_VARIABLES.AMC_BASE_URL}`;

export const DAYPARTING_BASE_URL = `${ENV_VARIABLES.DAYPARTING_BASE_URL}`;
export const ADVERTISING_BASE_URL = `${ENV_VARIABLES.ADVERTISING_BASE_URL}`;
export const TARGETING_ACTION_BASE_URL = `${ENV_VARIABLES.TARGETING_ACTION_BASE_URL}`;
export const AUTH_BASE_URL = `${ENV_VARIABLES.AUTH_BASE_URL}`;
export const MARKET_INTELLIGENCE_BASE_URL = `${ENV_VARIABLES.MARKET_INTELLIGENCE_BASE_URL}`;
export const AMAZON_ADS_BASE_URL = `${ENV_VARIABLES.AMAZON_ADS_BASE_URL}`;

export const WALMART_MARKETPLACE_REDIRECT_URL = `${ENV_VARIABLES.WALMART_MARKETPLACE_REDIRECT_URL}`;

export const WALMART_SUPPLIER_REDIRECT_URL = `${ENV_VARIABLES.WALMART_SUPPLIER_REDIRECT_URL}`;

export const AMAZON_ADS_REDIRECT_URL = `${ENV_VARIABLES.AMAZON_ADS_REDIRECT_URL}`;

export const AMAZON_ADS_CLIENT_ID = `${ENV_VARIABLES.AMZ_CLIENT_ID}`;

export const AMAZON_SP_REDIRECT_URL = `${ENV_VARIABLES.AMAZON_SP_REDIRECT_URL}`;

export const MONITORING_BASE_URL = `${ENV_VARIABLES.MONITORING_BASE_URL}`;

export const WALMART_ADS_BASE_URL = `${ENV_VARIABLES.WALMART_ADS_BASE_URL}`;

export const RULES_BASE_URL = `${ENV_VARIABLES.RULES_BASE_URL}`;

export const UNDER_MAINTENANCE =
  `${ENV_VARIABLES.UNDER_MAINTENANCE}` === 'true';

export const JIVA_LM_BASE_URL = `${ENV_VARIABLES.JIVA_LLM_BASE_URL}`;
const BIDDER_SERVICE_BASE_URL = `${ENV_VARIABLES.BIDDER_BASE_URL}`;
export const TOAST_AUTO_CLEAR_TIME = 5000;
export const ALL_LABEL = 'All';
export const ALL_VALUE = '';
export const SELECT_ALL = 'Select All';
export const PAGINATION_MODEL = { page: 0, pageSize: 50 };
export const DEFAULT_PAGINATION_MODEL = { page: 0, pageSize: 10 };
export const UPDATED_PAGINATION_MODEL = { pageIndex: 0, pageSize: 50 };
export const PAGE_SIZE_OPTIONS = [50, 100, 500, 1000];
export const sidebarIconFillColor = '#ffffff';
export const AMZ_SP_APP_ID = `amzn1.sp.solution.8bca3ff5-a0d2-4e4e-ac92-60af6ec35c2b`;
export const REVIEW_ANALYSIS_BASE_URL =
  'http://My-env-10-env.eba-czpnn5ik.us-west-2.elasticbeanstalk.com';

export const EMPTY_ACCOUNT: IDropdownItem<string> = {
  label: 'Select Account',
  value: '',
};

//OLD ADVERTISING BASE URLs
export const OLD_AMAZON_ADVERTISING_BASE_URL = `${ADVERTISING_BASE_URL}/api/advertising/amazon`;
export const OLD_WALMART_ADVERTISING_BASE_URL = `${ADVERTISING_BASE_URL}/api/advertising/walmart`;

//NEW ADVERTISING BASE URLs
export const ADVERTISING_BASE_URL_V2 = `${ADVERTISING_BASE_URL}/api/advertising/v2`;
export const NEW_AMAZON_ADVERTISING_BASE_URL = `${ADVERTISING_BASE_URL_V2}/amazon`;
export const NEW_WALMART_ADVERTISING_BASE_URL = `${ADVERTISING_BASE_URL_V2}/walmart`;

//AMAZON ADVERTISING BASE URL BY ADTYPE
export const AMAZON_OVERALL_BASE_URL = `${NEW_AMAZON_ADVERTISING_BASE_URL}/overall`;
export const AMAZON_SP_ADVERTISING_BASE_URL = `${NEW_AMAZON_ADVERTISING_BASE_URL}/sp`;
export const AMAZON_SB_ADVERTISING_BASE_URL = `${NEW_AMAZON_ADVERTISING_BASE_URL}/sb`;
export const AMAZON_SD_ADVERTISING_BASE_URL = `${NEW_AMAZON_ADVERTISING_BASE_URL}/sd`;

//WALMART ADVERTISING BASE URL BY ADTYPE
export const WALMART_OVERALL_ADVERTISING_BASE_URL = `${NEW_WALMART_ADVERTISING_BASE_URL}/overall`;
export const WALMART_SP_ADVERTISING_BASE_URL = `${NEW_WALMART_ADVERTISING_BASE_URL}/sp`;
export const WALMART_SB_ADVERTISING_BASE_URL = `${NEW_WALMART_ADVERTISING_BASE_URL}/sb`;
export const WALMART_SV_ADVERTISING_BASE_URL = `${NEW_WALMART_ADVERTISING_BASE_URL}/sv`;

//WALMART ADVERTISING ENTITY BASE URL
export const WALMART_ENTITY_BASE_URL = `${NEW_WALMART_ADVERTISING_BASE_URL}/entity`;

//WALMART ADVERTISING REVIEW BASE URL
export const WALMART_REVIEW_BASE_URL = `${NEW_WALMART_ADVERTISING_BASE_URL}/review`;

//IMPACT ANALYSIS BASE URL
export const AMAZON_IMPACT_ANALYSIS_ADVERTISING_BASE_URL = `${ADVERTISING_BASE_URL_V2}/impact-analysis/amazon`;

//AMAZON IMPACT ANALYSIS BASE URL BY ADTYPE
export const AMAZON_IMPACT_ANALYSIS_OVERALL_ADVERTISING_BASE_URL = `${AMAZON_IMPACT_ANALYSIS_ADVERTISING_BASE_URL}/all`;
export const AMAZON_IMPACT_ANALYSIS_SP_ADVERTISING_BASE_URL = `${AMAZON_IMPACT_ANALYSIS_ADVERTISING_BASE_URL}/sp`;
export const AMAZON_IMPACT_ANALYSIS_SB_ADVERTISING_BASE_URL = `${AMAZON_IMPACT_ANALYSIS_ADVERTISING_BASE_URL}/sb`;
export const AMAZON_IMPACT_ANALYSIS_SD_ADVERTISING_BASE_URL = `${AMAZON_IMPACT_ANALYSIS_ADVERTISING_BASE_URL}/sd`;

//WALMART IMPACT ANALYSIS BASE URL
export const WALMART_IMPACT_ANALYSIS_ADVERTISING_BASE_URL = `${ADVERTISING_BASE_URL_V2}/impact-analysis/walmart`;

//WALMART IMPACT ANALYSIS BASE URL BY ADTYPE
export const WALMART_IMPACT_ANALYSIS_OVERALL_ADVERTISING_BASE_URL = `${WALMART_IMPACT_ANALYSIS_ADVERTISING_BASE_URL}/all`;
export const WALMART_IMPACT_ANALYSIS_SP_ADVERTISING_BASE_URL = `${WALMART_IMPACT_ANALYSIS_ADVERTISING_BASE_URL}/sp`;
export const WALMART_IMPACT_ANALYSIS_SB_ADVERTISING_BASE_URL = `${WALMART_IMPACT_ANALYSIS_ADVERTISING_BASE_URL}/sb`;
export const WALMART_IMPACT_ANALYSIS_SV_ADVERTISING_BASE_URL = `${WALMART_IMPACT_ANALYSIS_ADVERTISING_BASE_URL}/sv`;

//TARGETING-ACTIONS AMAZON BASE URLs
export const AMAZON_TARGETING_ACTIONS_BASE_URL = `${TARGETING_ACTION_BASE_URL}/api/targeting-action/amazon`;
export const AMAZON_KEYWORD_ACTIONS_BASE_URL = `${AMAZON_TARGETING_ACTIONS_BASE_URL}/keyword`;
export const AMAZON_PRODUCT_ACTIONS_BASE_URL = `${AMAZON_TARGETING_ACTIONS_BASE_URL}/product`;

//TARGETING-ACTIONS WALMART BASE URLs
export const WALMART_TARGETING_ACTIONS_BASE_URL = `${TARGETING_ACTION_BASE_URL}/api/targeting-action/walmart`;
export const WALMART_KEYWORD_ACTIONS_BASE_URL = `${WALMART_TARGETING_ACTIONS_BASE_URL}/keyword`;

// WALMART CATALOG BASE URL
export const WALMART_CATALOG_BASE_URL = `${NEW_WALMART_ADVERTISING_BASE_URL}/catalog`;

// AMAZON CATALOG BASE URL
export const AMAZON_CATALOG_BASE_URL = `${AMAZON_ADS_BASE_URL}/api/amazon-ads/catalog`;

//POWERBI BASE URL
export const POWER_BI_URL = `${ADVERTISING_BASE_URL}/api/advertising/reports/embed/access-token`;

//CHATBOT BASE URL
export const CHATBOT_BASE_URL = `${JIVA_LM_BASE_URL}/api/jiva-llm`;

//DAY-PARTING BASE URLs
export const NEW_DAYPARTING_BASE_URL = `${DAYPARTING_BASE_URL}/api/day-parting/jobs`;
export const OLD_DAYPARTING_BASE_URL = `${DAYPARTING_BASE_URL}/api/day-parting/amazon`;
export const WALMART_DAYPARTING_BASE_URL = `${NEW_DAYPARTING_BASE_URL}/walmart`;
export const NEW_WALMART_DAYPARTING_BASE_URL = `${NEW_DAYPARTING_BASE_URL}/walmart`;
export const NEW_AMAZON_DAYPARTING_BASE_URL = `${NEW_DAYPARTING_BASE_URL}`;

//AMC BASE URL
export const AMAZON_AMC_URL = `${AMC_BASE_URL}/api/amc`;

//BIDDER BASE URL
export const BIDDER_BASE_URL = `${BIDDER_SERVICE_BASE_URL}/api/bidder`;
export const AMAZON_BIDDER_BASE_URL = `${BIDDER_BASE_URL}/amazon/job`;
export const WALMART_BIDDER_BASE_URL = `${BIDDER_BASE_URL}/walmart/job`;
export const BIDDER_CONFIG_BASE_URL = `${BIDDER_BASE_URL}/config`;

//SETTING BASE URL
export const SETTINGS_BASE_URL = `${ADVERTISING_BASE_URL}/api/advertising/settings`;

//LOGS BASE URL
export const LOGS_AMAZON_BASE_URL = `${NEW_AMAZON_ADVERTISING_BASE_URL}/edit-logs`;
export const LOGS_WALMART_BASE_URL = `${NEW_WALMART_ADVERTISING_BASE_URL}/edit-logs`;

//AMAZON ONBOARDING BASE URLs
export const AMAZON_ONBOARDING_BASE_URL = `${OLD_AMAZON_ADVERTISING_BASE_URL}/ads`;
export const AMAZON_SP_ONBOARDING_BASE_URL = `${OLD_AMAZON_ADVERTISING_BASE_URL}/sp`;

//WALMART ONBOARDING BASE URLs
export const WALMART_AUTH_BASE_URL = `${AUTH_BASE_URL}/api/auth/account/walmart`;
export const WALMART_CONNECT_BASE_URL = `${WALMART_ADS_BASE_URL}/api/walmart-ads/walmart-connect`;

//AMAZON EDIT-ACCESS URLs
export const AMAZON_EDIT_ACCESS_BASE_URL = `${NEW_AMAZON_ADVERTISING_BASE_URL}/edit`;
export const AMAZON_OVERALL_EDIT_BASE_URL = `${AMAZON_EDIT_ACCESS_BASE_URL}/overall`;
export const AMAZON_SP_EDIT_BASE_URL = `${AMAZON_EDIT_ACCESS_BASE_URL}/sp`;
export const AMAZON_SB_EDIT_BASE_URL = `${AMAZON_EDIT_ACCESS_BASE_URL}/sb`;
export const AMAZON_SD_EDIT_BASE_URL = `${AMAZON_EDIT_ACCESS_BASE_URL}/sd`;

//WALMART EDIT-ACCESS URLs
export const WALMART_EDIT_ACCESS_BASE_URL = `${NEW_WALMART_ADVERTISING_BASE_URL}/edit`;
export const WALMART_OVERALL_EDIT_BASE_URL = `${WALMART_EDIT_ACCESS_BASE_URL}/overall`;
export const WALMART_SP_EDIT_BASE_URL = `${WALMART_EDIT_ACCESS_BASE_URL}/sp`;
export const WALMART_SB_EDIT_BASE_URL = `${WALMART_EDIT_ACCESS_BASE_URL}/sb`;
export const WALMART_SV_EDIT_BASE_URL = `${WALMART_EDIT_ACCESS_BASE_URL}/sv`;

//WALMART PROFITABILITY BASE URLS
export const WMT_PROFITABILITY_BASE_URL = `${NEW_WALMART_ADVERTISING_BASE_URL}/profitability`;

//AMAZON PROFITABILITY BASE URLS
export const AMZ_PROFITABILITY_BASE_URL = `${NEW_AMAZON_ADVERTISING_BASE_URL}/profitability`;

//MONITORING BASE URL
export const MONITORING_API_BASE_URL = `${MONITORING_BASE_URL}/api/monitoring`;

// BIDDER DASHBOARD URL
export const BIDDER_DASHBOARD_API_BASE_URL = `${BIDDER_SERVICE_BASE_URL}/api/bidder/dashboard`;

//RULES
export const RULES_API_BASE_URL = `${RULES_BASE_URL}/api/rules`;

// Configuration Base URLs
export const AMAZON_CONFIGURATION_BASE_URL = `${ADVERTISING_BASE_URL_V2}/amazon/configuration`;
export const WALMART_CONFIGURATION_BASE_URL = `${ADVERTISING_BASE_URL_V2}/walmart/configuration`;

export const LOGO_ITEM_ID = '1001';
export const LOGO_ITEM_NAME = 'Logo Click';

export const WMT_MARKETPLACE_AUTH_BASE_URL = `${AUTH_BASE_URL}/api/auth/account/walmart-marketplace`;
export const WMT_SUPPLIER_AUTH_BASE_URL = `${AUTH_BASE_URL}/api/auth/account/walmart-supplier`;

export const CRON_BASE_URL = `${MONITORING_API_BASE_URL}/cron`;

export const SellerCentralURLMap: { [key: string]: string } = {
  [CountryCodeEnum.Canada]: 'https://sellercentral.amazon.ca',
  [CountryCodeEnum.UnitedStates]: 'https://sellercentral.amazon.com',
  [CountryCodeEnum.Mexico]: 'https://sellercentral.amazon.com.mx',
  [CountryCodeEnum.Brazil]: 'https://sellercentral.amazon.com.br',
  [CountryCodeEnum.Ireland]: 'https://sellercentral.amazon.ie',
  [CountryCodeEnum.Spain]: 'https://sellercentral-europe.amazon.com',
  [CountryCodeEnum.UnitedKingdom]: 'https://sellercentral-europe.amazon.com',
  [CountryCodeEnum.France]: 'https://sellercentral-europe.amazon.com',
  [CountryCodeEnum.Belgium]: 'https://sellercentral.amazon.com.be',
  [CountryCodeEnum.Netherlands]: 'https://sellercentral.amazon.nl',
  [CountryCodeEnum.Germany]: 'https://sellercentral-europe.amazon.com',
  [CountryCodeEnum.Italy]: 'https://sellercentral-europe.amazon.com',
  [CountryCodeEnum.Sweden]: 'https://sellercentral.amazon.se',
  [CountryCodeEnum.SouthAfrica]: 'https://sellercentral.amazon.co.za',
  [CountryCodeEnum.Poland]: 'https://sellercentral.amazon.pl',
  [CountryCodeEnum.Egypt]: 'https://sellercentral.amazon.eg',
  [CountryCodeEnum.Turkey]: 'https://sellercentral.amazon.com.tr',
  [CountryCodeEnum.SaudiArabia]: 'https://sellercentral.amazon.sa',
  [CountryCodeEnum.UnitedArabEmirates]: 'https://sellercentral.amazon.ae',
  [CountryCodeEnum.India]: 'https://sellercentral.amazon.in',
  [CountryCodeEnum.Singapore]: 'https://sellercentral.amazon.sg',
  [CountryCodeEnum.Australia]: 'https://sellercentral.amazon.com.au',
  [CountryCodeEnum.Japan]: 'https://sellercentral.amazon.co.jp',
};

// TAGGING
export const TAGGING_API_BASE_URL = `${ADVERTISING_BASE_URL_V2}/tags`;
export const COGS_DOWNLOAD_TEMPLATE = 'COGS_DOWNLOAD_TEMPLATE';

// Kept here (rather than in advertising-filter.constants.ts) so files like
// profitability.constants.tsx can depend on it without a circular import.
export const customRangeFilterOption: IDropdownItem<Range> = {
  label: 'Custom Range',
  value: Range.CUSTOM_RANGE,
  isCustom: true,
};

export const performanceGraphColors = [
  '#77469b',
  '#0085ff',
  '#14c9c9',
  '#ff9c06',
  '#ff0000',
  '#ff66b2',
  '#009688',
];

export const sortedMonthsShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
export const sortedMonthsLong = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
