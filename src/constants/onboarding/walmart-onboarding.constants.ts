import { imageUrls } from '@/constants/assets/images.constants';
import {
  OnboardingTypeEnum,
  WalmartOnboardingEnum,
} from '@/enums/onboarding.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { WalmartClientTypeEnum } from '@/enums/walmart.enums';
import { IAccountCardProps } from '@/interfaces/onboarding.interface';
import {
  getRedirectURLByWMTClientType,
  handleOnboardingConnect,
} from '@/utils';

export const walmartCards: IAccountCardProps[] = [
  {
    marketplace: MarketplaceEnum.WALMART,
    isDisabled: false,
    description: WalmartOnboardingEnum.WALMART_CONNECT_DESCRIPTION,
    iconPath: imageUrls.walmartConnectImg,
    buttonText: 'Connect',
    buttonFunction: handleOnboardingConnect,
    redirectLink: getRedirectURLByWMTClientType(WalmartClientTypeEnum.SELLER),
    onboardingType: OnboardingTypeEnum.WALMART_CONNECT,
  },
  {
    marketplace: MarketplaceEnum.WALMART,
    isDisabled: false,
    description: WalmartOnboardingEnum.WALMART_ADS_DESCRIPTION,
    iconPath: imageUrls.walmartMarketplaceImg,
    iconSize: '18rem',
    buttonText: 'Connect',
    buttonFunction: handleOnboardingConnect,
    redirectLink: getRedirectURLByWMTClientType(WalmartClientTypeEnum.SELLER),
    onboardingType: OnboardingTypeEnum.WALMART_ADS,
  },
  {
    marketplace: MarketplaceEnum.WALMART,
    isDisabled: false,
    description: WalmartOnboardingEnum.WALMART_SUPPLIER_DESCRIPTION,
    iconPath: imageUrls.walmartSupplierImg,
    iconSize: '22rem',
    buttonText: 'Connect',
    buttonFunction: handleOnboardingConnect,
    redirectLink: getRedirectURLByWMTClientType(WalmartClientTypeEnum.SUPPLIER),
    onboardingType: OnboardingTypeEnum.WALMART_ADS,
  },
];
