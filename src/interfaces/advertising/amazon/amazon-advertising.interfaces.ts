import {
  AmazonWebsiteUrlEnum,
  CountryCodeEnum,
} from '@/enums/advertising.enums';

export interface IAmazonAccount {
  accountId: string;
  profileId: string;
  brandName: string;
  anarixId: string;
  marketplaceId: string;
  advertiserId: string;
  dspAdvertiserId: string;
  amcAccountId: string;
}

export interface IAmazonSPAccount {
  accountId: string;
  sellingPartnerId: string;
  sellingPartnerAppClientId: string;
  sellingPartnerAppClientSecret: string;
  sellingPartnerAppRefreshToken: string;
}
export interface IRegionAccountConfig {
  TIMEZONE: string;
  COUNTRY_CODE: CountryCodeEnum;
  CURRENCY_SYMBOL: string;
  SP_BUDGET_1P_MIN_LIMIT: number;
  SP_BUDGET_1P_MAX_LIMIT: number;
  SP_BUDGET_3P_MIN_LIMIT: number;
  SP_BUDGET_3P_MAX_LIMIT: number;
  SP_BID_MIN_LIMIT: number;
  SP_BID_MAX_LIMIT: number;
  SD_CPC_BID_MIN_LIMIT: number;
  SD_CPC_BID_MAX_LIMIT: number;
  SD_VCPM_BID_MIN_LIMIT: number;
  SD_VCPM_BID_MAX_LIMIT: number;
  SB_CPC_IMAGE_BID_MIN_LIMIT: number;
  SB_CPC_IMAGE_BID_MAX_LIMIT: number;
  SBV_CPC_VIDEO_BID_MIN_LIMIT: number;
  SBV_CPC_VIDEO_BID_MAX_LIMIT: number;
  SB_VCPM_IMAGE_BIS_BID_MIN_LIMIT: number;
  SB_VCPM_IMAGE_BIS_BID_MAX_LIMIT: number;
  SBV_VCPM_VIDEO_BIS_BID_MIN_LIMIT: number;
  SBV_VCPM_VIDEO_BIS_BID_MAX_LIMIT: number;
  SBV_VCPM_VIDEO_NTB_BID_MAX_LIMIT: number;
  SBV_VCPM_VIDEO_NTB_BID_MIN_LIMIT: number;
  SB_VCPM_IMAGE_NTB_BID_MAX_LIMIT: number;
  SB_VCPM_IMAGE_NTB_BID_MIN_LIMIT: number;
  SB_BUDGET_DAILY_1P_MIN_LIMIT: number;
  SB_BUDGET_DAILY_1P_MAX_LIMIT: number;
  SB_BUDGET_DAILY_3P_MIN_LIMIT: number;
  SB_BUDGET_DAILY_3P_MAX_LIMIT: number;
  SB_BUDGET_LIFETIME_1P_MIN_LIMIT: number;
  SB_BUDGET_LIFETIME_1P_MAX_LIMIT: number;
  SB_BUDGET_LIFETIME_3P_MIN_LIMIT: number;
  SB_BUDGET_LIFETIME_3P_MAX_LIMIT: number;
  SD_BUDGET_1P_MIN_LIMIT: number;
  SD_BUDGET_1P_MAX_LIMIT: number;
  SD_BUDGET_3P_MIN_LIMIT: number;
  SD_BUDGET_3P_MAX_LIMIT: number;
  SITE_URL: AmazonWebsiteUrlEnum;
  PRODUCT_URL?: string;
}
