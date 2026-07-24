import {
  AMAZON_ADS_CLIENT_ID,
  AMAZON_ADS_REDIRECT_URL,
  AMAZON_SP_REDIRECT_URL,
  AMZ_SP_APP_ID,
} from '.';
export const HOME_URL = '/';
export const SELECT_ACCOUNT_URL = '/user/select-account';
export const ACCEPT_INVITE_URL = '/user/accept-invite';
export const REGISTER_INVITE_URL = '/user/register-invite';
export const LOGIN_URL = '/user/login';
export const REGISTER_URL = '/user/register';
export const FORGOT_PASSWORD_URL = '/user/forgot-password';
export const MARKET_INTELLIGENCE_URL = '/market-intelligence';
export const BRAND_ANALYTICS_URL = `${MARKET_INTELLIGENCE_URL}/brand-sov/brand-analytics`;
export const PRODUCT_SOV_URL = `${MARKET_INTELLIGENCE_URL}/product-sov`;
export const KEYWORD_SOV_URL = `${MARKET_INTELLIGENCE_URL}/keyword-sov`;
export const BRAND_SOV_URL = `${MARKET_INTELLIGENCE_URL}/brand-sov`;
export const KEYWORD_TRACKER_URL = `${MARKET_INTELLIGENCE_URL}/keyword-tracker`;
export const INVITES_URL = '/settings/invites';
export const SETTINGS_HOME_PAGE_URL = '/settings';
export const ACCOUNTS_PAGE_URL = `${SETTINGS_HOME_PAGE_URL}/accounts`;
export const ADVERTISING_ACCOUNT_URL = '/advertising/campaign-manager';
export const DAY_PARTING_PAGE_URL = '/day-parting';
export const DAY_PARTING_HISTORY_URL = `${DAY_PARTING_PAGE_URL}/history`;
export const DAY_PARTING_SCHEDULED_JOBS_URL = `${DAY_PARTING_PAGE_URL}/scheduled-jobs`;
export const PROFITABILITY_PAGE_BASE_URL = '/profitability';
export const PROFITABILITY_DASHBOARD_URL = `${PROFITABILITY_PAGE_BASE_URL}/dashboard`;
export const PROFITABILITY_TRENDS_PAGE_URL = `${PROFITABILITY_PAGE_BASE_URL}/trends`;
export const PROFITABILITY_PNL_URL = `${PROFITABILITY_PAGE_BASE_URL}/profit&loss`;
export const CONFIGURATION_PAGE_URL = '/configuration';

export const IMPACT_ANALYSIS_URL = '/advertising/analysis';
export const KEYWORD_ACTION_URL = '/advertising/targeting-actions';
export const REPORTS_LIST_URL = '/reports/list';
export const AMC_URL = '/amc';
export const JIVA_PAGE_URL = '/jiva-page';
export const FEATURES_DISABLED = '/features-disabled'; // TODO: Create this page and tell for some reason all the features are disabled for the account please reach support
export const ONBOARDING_CONNECTING_PAGE = `${ACCOUNTS_PAGE_URL}/onboarding-page/connecting`;
export const BULK_UPLOAD_SAMPLE_FILE =
  'https://anarix.s3.amazonaws.com/sample-files/Keyword_BulkUpload_Sample.csv';

export const PRODUCT_IMG_URL =
  'https://anarix.s3.amazonaws.com/images/amazon-products';

export const PRIVACY_POLICY_URL = 'https://www.anarix.ai/privacy-policy';
export const TERMS_AND_CONDITIONS_URL =
  'https://www.anarix.ai/terms-and-conditions';
export const WMT_SELLER_CLIENT_ID = 'f58a5b54-0b85-4ee4-bd72-81f4d58b9205';
export const WMT_SUPPLIER_CLIENT_ID = '979c976c-082b-48da-899e-8e105ae41a02';
export const ONBOARDING_WMT_MARKETPLACE_URL = `https://login.account.wal-mart.com/authorize?redirectUri={redirectUri}&nonce={nonce}&clientType={client}&clientId={clientId}&state={state}&responseType=code`;
export const ONBOARDING_AMZ_SP_ENDPOINT_URL = `/apps/authorize/consent?application_id=${AMZ_SP_APP_ID}&redirect_uri=${AMAZON_SP_REDIRECT_URL}`;

export const AMAZON_ADS_NA_REDIRECT_URL = `${AMAZON_ADS_REDIRECT_URL}/NA`;
export const AMAZON_ADS_FE_REDIRECT_URL = `${AMAZON_ADS_REDIRECT_URL}/FE`;
export const AMAZON_ADS_EU_REDIRECT_URL = `${AMAZON_ADS_REDIRECT_URL}/EU`;

export const WALMART_CONNECT_AUTH_URL = `https://advertising.walmart.com/sp/view/admin`;
export const FIND_IDS_LINK = `https://docs.google.com/document/d/1QMD49a5NjCGURhgBDE2dVzQdHYYqfmvoKzWtjkGWKzA/edit?usp=sharing`;
export const WALMART_CONNECT_ONBOARDING_GUIDE_LINK = `https://docs.google.com/document/d/1ZNnfYU_JoiTHAAJ8RJvIl1POHYhO4ev9A__tIiW4gYw/edit?usp=sharing`;
export const ONBOARDING_AMZ_ADS_NA_URL = `https://www.amazon.com/ap/oa?client_id=${AMAZON_ADS_CLIENT_ID}&scope=advertising%3A%3Acampaign_management&response_type=code&redirect_uri=${AMAZON_ADS_NA_REDIRECT_URL}`;
export const ONBOARDING_AMZ_ADS_EU_URL = `https://eu.account.amazon.com/ap/oa?client_id=${AMAZON_ADS_CLIENT_ID}&scope=advertising%3A%3Acampaign_management&response_type=code&redirect_uri=${AMAZON_ADS_EU_REDIRECT_URL}`;
export const ONBOARDING_AMZ_ADS_FE_URL = `https://apac.account.amazon.com/ap/oa?client_id=${AMAZON_ADS_CLIENT_ID}&scope=advertising%3A%3Acampaign_management&response_type=code&redirect_uri=${AMAZON_ADS_FE_REDIRECT_URL}`;
export const ANARIX_UI_CDN_URL = 'https://cdn.anarix.ai/anarix-ui';

export const RULES_AGENTS_URL = `rules/agents`;
export const RULES_APPLIED_URL = `rules/applied-rules`;
