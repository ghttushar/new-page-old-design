import {
  AMAZON_AMC_URL,
  AMAZON_CATALOG_BASE_URL,
  AMAZON_EDIT_ACCESS_BASE_URL,
  AMAZON_IMPACT_ANALYSIS_ADVERTISING_BASE_URL,
  AMAZON_ONBOARDING_BASE_URL,
  AMAZON_SP_ONBOARDING_BASE_URL,
  AMAZON_TARGETING_ACTIONS_BASE_URL,
  AMZ_PROFITABILITY_BASE_URL,
  BIDDER_BASE_URL,
  CHATBOT_BASE_URL,
  LOGS_AMAZON_BASE_URL,
  LOGS_WALMART_BASE_URL,
  NEW_AMAZON_ADVERTISING_BASE_URL,
  NEW_AMAZON_DAYPARTING_BASE_URL,
  NEW_DAYPARTING_BASE_URL,
  NEW_WALMART_ADVERTISING_BASE_URL,
  NEW_WALMART_DAYPARTING_BASE_URL,
  OLD_AMAZON_ADVERTISING_BASE_URL,
  OLD_WALMART_ADVERTISING_BASE_URL,
  POWER_BI_URL,
  RULES_API_BASE_URL,
  SETTINGS_BASE_URL,
  TAGGING_API_BASE_URL,
  WALMART_AUTH_BASE_URL,
  WALMART_CATALOG_BASE_URL,
  WALMART_IMPACT_ANALYSIS_ADVERTISING_BASE_URL,
  WALMART_TARGETING_ACTIONS_BASE_URL,
  WMT_PROFITABILITY_BASE_URL,
} from '@/constants';

const requestUtils = {
  checkIsAmazonUrl: (url: string) => {
    return (
      url.startsWith(NEW_AMAZON_ADVERTISING_BASE_URL) ||
      url.startsWith(OLD_AMAZON_ADVERTISING_BASE_URL) ||
      url.startsWith(AMAZON_EDIT_ACCESS_BASE_URL) ||
      url.startsWith(AMAZON_IMPACT_ANALYSIS_ADVERTISING_BASE_URL) ||
      url.startsWith(AMAZON_AMC_URL) ||
      url.startsWith(BIDDER_BASE_URL) ||
      url.startsWith(SETTINGS_BASE_URL) ||
      url.startsWith(POWER_BI_URL) ||
      url.startsWith(AMAZON_ONBOARDING_BASE_URL) ||
      url.startsWith(AMAZON_SP_ONBOARDING_BASE_URL) ||
      url.startsWith(CHATBOT_BASE_URL) ||
      url.startsWith(LOGS_AMAZON_BASE_URL) ||
      url.startsWith(AMAZON_TARGETING_ACTIONS_BASE_URL) ||
      url.startsWith(TAGGING_API_BASE_URL)
    );
  },

  checkIsWalmartUrl: (url: string) => {
    return (
      url.startsWith(NEW_WALMART_ADVERTISING_BASE_URL) ||
      url.startsWith(OLD_WALMART_ADVERTISING_BASE_URL) ||
      url.startsWith(WALMART_IMPACT_ANALYSIS_ADVERTISING_BASE_URL) ||
      url.startsWith(BIDDER_BASE_URL) ||
      url.startsWith(SETTINGS_BASE_URL) ||
      url.startsWith(POWER_BI_URL) ||
      url.startsWith(CHATBOT_BASE_URL) ||
      url.startsWith(LOGS_WALMART_BASE_URL) ||
      url.startsWith(WALMART_AUTH_BASE_URL) ||
      url.startsWith(NEW_WALMART_DAYPARTING_BASE_URL) ||
      url.startsWith(WALMART_TARGETING_ACTIONS_BASE_URL) ||
      url.startsWith(TAGGING_API_BASE_URL)
    );
  },

  checkIsAmazonDaypartingUrl: (url: string) => {
    return (
      url.startsWith(NEW_AMAZON_DAYPARTING_BASE_URL) ||
      url.startsWith(NEW_DAYPARTING_BASE_URL)
    );
  },

  checkIsWalmartCatalogUrl: (url: string) => {
    return (
      url.startsWith(WALMART_CATALOG_BASE_URL) ||
      url.startsWith(WMT_PROFITABILITY_BASE_URL)
    );
  },

  checkIsAmcUrl: (url: string) => {
    return url.startsWith(AMAZON_AMC_URL);
  },
  checkIsAmazonCatalogUrl: (url: string) => {
    return (
      url.startsWith(AMAZON_CATALOG_BASE_URL) ||
      url.startsWith(AMZ_PROFITABILITY_BASE_URL)
    );
  },
  checkIsRulesUrl: (url: string) => {
    return url.startsWith(RULES_API_BASE_URL);
  },
  checkIsAmazonProfitability: (url: string) => {
    return url.startsWith(AMZ_PROFITABILITY_BASE_URL);
  },
};

export default requestUtils;
