import { IEnvVariables } from './env.types';

export const DEVELOPMENT_ENV_VARIABLES: IEnvVariables = {
  AUTH_BASE_URL: 'http://localhost:5001',
  DAYPARTING_BASE_URL: 'http://localhost:5002',
  TARGET_SOV_BASE_URL: 'http://localhost:5003',
  AMC_BASE_URL: 'http://localhost:5004',
  BIDDER_BASE_URL: 'http://localhost:5005',
  PRICE_TRACKER_BASE_URL: 'http://localhost:5006',
  AMAZON_ADS_BASE_URL: 'http://localhost:5007',
  ADVERTISING_BASE_URL: 'http://localhost:5008',
  MONITORING_BASE_URL: 'http://localhost:5011',
  MARKET_INTELLIGENCE_BASE_URL: 'http://localhost:5009',
  TARGETING_ACTION_BASE_URL: 'http://localhost:5012',
  WALMART_ADS_BASE_URL: 'http://localhost:5010',
  JIVA_LLM_BASE_URL: 'http://localhost:5016',
  RULES_BASE_URL: 'http://localhost:5023',
  WALMART_MARKETPLACE_REDIRECT_URL:
    'https://api.test.anarix.ai/api/advertising/walmart/marketplace/connect',
  WALMART_SUPPLIER_REDIRECT_URL:
    'https://api.test.anarix.ai/api/advertising/walmart/supplier/connect',
  AMAZON_ADS_REDIRECT_URL:
    'https://api.dev.anarix.ai/api/advertising/amazon/ads/connect',
  AMZ_CLIENT_ID:
    'amzn1.application-oa2-client.cd4c097039ef48488f53f7bd3fc23d1d',
  AMAZON_SP_REDIRECT_URL:
    'https://api.dev.anarix.ai/api/advertising/amazon/sp/connect',
  ENV: 'dev',
  UNDER_MAINTENANCE: 'false',
};
