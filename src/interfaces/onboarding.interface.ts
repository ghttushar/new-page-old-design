import { AmazonAccountType } from '@/enums/advertising.enums';
import { OnboardingTypeEnum } from '@/enums/onboarding.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';

export interface IAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface IAccountInfo {
  marketplaceStringId: string;
  id: string;
  type: string;
  name: string;
  validPaymentMethod?: boolean;
}
export interface IAdvertisingProfiles {
  accountId: string;
  profileId: string;
  countryCode: string;
  currencyCode: string;
  dailyBudget?: number;
  timezone: string;
  accountInfo: IAccountInfo;
  refreshToken?: string;
}

export interface IAmazonSPOnboardingTaskPayload {
  region: string;
  state: string;
  accountType: AmazonAccountType;
}
export interface IIsAdvertisingConnected {
  isAdvertisingConnected: boolean;
  isSPDataConnected: boolean;
}

export interface IWalmartMarketplacePayLoad {
  code: string;
  partnerId: string;
}

export interface IAccountCardProps {
  isDisabled: boolean;
  redirectLink: string;
  description: string;
  buttonFunction: (redirect_link: string) => void;
  marketplace: MarketplaceEnum;
  iconPath: string;
  onboardingType: OnboardingTypeEnum;
  iconSize?: string;
  customLogoStyles?: React.CSSProperties;
  buttonText?: string;
}

export interface IOnboardingPage {
  title: string;
  subtitle: string;
  accountCards: IAccountCardProps[];
}
