import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { CountryCodeEnum } from '@/enums/advertising.enums';
import {
  AmazonOnboardingEnum,
  OnboardingTypeEnum,
} from '@/enums/onboarding.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IAccountCardProps } from '@/interfaces/onboarding.interface';

import { imageUrls } from '@/constants/assets/images.constants';
import { handleOnboardingConnect } from '@/utils';
import { SellerCentralURLMap } from '..';
import { CountryCodeShortMap } from '../advertising-amazon-region.constants';
import {
  ONBOARDING_AMZ_ADS_EU_URL,
  ONBOARDING_AMZ_ADS_FE_URL,
  ONBOARDING_AMZ_ADS_NA_URL,
  ONBOARDING_AMZ_SP_ENDPOINT_URL,
} from '../urls.constants';

export const amazonCards: IAccountCardProps[] = [
  {
    marketplace: MarketplaceEnum.AMAZON,
    isDisabled: false,
    description: AmazonOnboardingEnum.DESCRIPTION_2,
    iconPath: imageUrls.amazonSellerImg,
    iconSize: '17rem',
    buttonFunction: handleOnboardingConnect,
    redirectLink: ONBOARDING_AMZ_SP_ENDPOINT_URL,
    buttonText: 'Connect',
    onboardingType: OnboardingTypeEnum.AMAZON_SP_SELLER,
  },
  {
    marketplace: MarketplaceEnum.AMAZON,
    isDisabled: false,
    description: AmazonOnboardingEnum.DESCRIPTION_1,
    iconPath: imageUrls.amazonAdsImg,
    iconSize: '20rem',
    buttonFunction: handleOnboardingConnect,
    redirectLink: ONBOARDING_AMZ_ADS_NA_URL,
    buttonText: 'Connect',
    onboardingType: OnboardingTypeEnum.AMAZON_ADS,
  },
  {
    marketplace: MarketplaceEnum.AMAZON,
    isDisabled: false,
    description: AmazonOnboardingEnum.DESCRIPTION_3,
    iconPath: imageUrls.amazonVendorCentralImg,
    iconSize: '22rem',
    buttonFunction: handleOnboardingConnect,
    redirectLink: ONBOARDING_AMZ_SP_ENDPOINT_URL,
    buttonText: 'Connect',
    onboardingType: OnboardingTypeEnum.AMAZON_SP_VENDOR,
  },
];

export const ADS_REGION_URL_MAPPINGS: { [key: string]: string } = {
  [CountryCodeEnum.Canada]: ONBOARDING_AMZ_ADS_NA_URL,
  [CountryCodeEnum.UnitedStates]: ONBOARDING_AMZ_ADS_NA_URL,
  [CountryCodeEnum.Mexico]: ONBOARDING_AMZ_ADS_NA_URL,
  [CountryCodeEnum.Brazil]: ONBOARDING_AMZ_ADS_NA_URL,
  [CountryCodeEnum.Spain]: ONBOARDING_AMZ_ADS_EU_URL,
  [CountryCodeEnum.UnitedKingdom]: ONBOARDING_AMZ_ADS_EU_URL,
  [CountryCodeEnum.France]: ONBOARDING_AMZ_ADS_EU_URL,
  [CountryCodeEnum.Belgium]: ONBOARDING_AMZ_ADS_EU_URL,
  [CountryCodeEnum.Netherlands]: ONBOARDING_AMZ_ADS_EU_URL,
  [CountryCodeEnum.Germany]: ONBOARDING_AMZ_ADS_EU_URL,
  [CountryCodeEnum.Italy]: ONBOARDING_AMZ_ADS_EU_URL,
  [CountryCodeEnum.Sweden]: ONBOARDING_AMZ_ADS_EU_URL,
  [CountryCodeEnum.SouthAfrica]: ONBOARDING_AMZ_ADS_EU_URL,
  [CountryCodeEnum.Poland]: ONBOARDING_AMZ_ADS_EU_URL,
  [CountryCodeEnum.Egypt]: ONBOARDING_AMZ_ADS_EU_URL,
  [CountryCodeEnum.SaudiArabia]: ONBOARDING_AMZ_ADS_EU_URL,
  [CountryCodeEnum.Turkey]: ONBOARDING_AMZ_ADS_EU_URL,
  [CountryCodeEnum.UnitedArabEmirates]: ONBOARDING_AMZ_ADS_EU_URL,
  [CountryCodeEnum.India]: ONBOARDING_AMZ_ADS_EU_URL,
  [CountryCodeEnum.Singapore]: ONBOARDING_AMZ_ADS_FE_URL,
  [CountryCodeEnum.Australia]: ONBOARDING_AMZ_ADS_FE_URL,
  [CountryCodeEnum.Japan]: ONBOARDING_AMZ_ADS_FE_URL,
};

export const VendorCentralURLMap: { [key: string]: string } = {
  [CountryCodeEnum.Canada]: 'https://vendorcentral.amazon.ca',
  [CountryCodeEnum.UnitedStates]: 'https://vendorcentral.amazon.com',
  [CountryCodeEnum.Mexico]: 'https://vendorcentral.amazon.com.mx',
  [CountryCodeEnum.Brazil]: 'https://vendorcentral.amazon.com.br',
  [CountryCodeEnum.Spain]: 'https://vendorcentral.amazon.es',
  [CountryCodeEnum.UnitedKingdom]: 'https://vendorcentral.amazon.co.uk',
  [CountryCodeEnum.France]: 'https://vendorcentral.amazon.fr',
  [CountryCodeEnum.Belgium]: 'https://vendorcentral.amazon.com.be',
  [CountryCodeEnum.Netherlands]: 'https://vendorcentral.amazon.nl',
  [CountryCodeEnum.Germany]: 'https://vendorcentral.amazon.de',
  [CountryCodeEnum.Italy]: 'https://vendorcentral.amazon.it',
  [CountryCodeEnum.Sweden]: 'https://vendorcentral.amazon.se',
  [CountryCodeEnum.SouthAfrica]: 'https://vendorcentral.amazon.co.za',
  [CountryCodeEnum.Poland]: 'https://vendorcentral.amazon.pl',
  [CountryCodeEnum.Egypt]: 'https://vendorcentral.amazon.me',
  [CountryCodeEnum.SaudiArabia]: 'https://vendorcentral.amazon.me',
  [CountryCodeEnum.Turkey]: 'https://vendorcentral.amazon.com.tr',
  [CountryCodeEnum.UnitedArabEmirates]: 'https://vendorcentral.amazon.me',
  [CountryCodeEnum.India]: 'https://www.vendorcentral.in',
  [CountryCodeEnum.Singapore]: 'https://vendorcentral.amazon.com.sg',
  [CountryCodeEnum.Australia]: 'https://vendorcentral.amazon.com.au',
  [CountryCodeEnum.Japan]: 'https://vendorcentral.amazon.co.jp',
};

export const AmazonSPVendorAvailableRegions: IDropdownItem<string>[] = [
  {
    value: VendorCentralURLMap[CountryCodeEnum.UnitedStates],
    label: CountryCodeShortMap[CountryCodeEnum.UnitedStates],
    tooltipText: CountryCodeEnum.UnitedStates,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.Canada],
    label: CountryCodeShortMap[CountryCodeEnum.Canada],
    tooltipText: CountryCodeEnum.Canada,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.Mexico],
    label: CountryCodeShortMap[CountryCodeEnum.Mexico],
    tooltipText: CountryCodeEnum.Mexico,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.Brazil],
    label: CountryCodeShortMap[CountryCodeEnum.Brazil],
    tooltipText: CountryCodeEnum.Brazil,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.Spain],
    label: CountryCodeShortMap[CountryCodeEnum.Spain],
    tooltipText: CountryCodeEnum.Spain,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.UnitedKingdom],
    label: CountryCodeShortMap[CountryCodeEnum.UnitedKingdom],
    tooltipText: CountryCodeEnum.UnitedKingdom,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.France],
    label: CountryCodeShortMap[CountryCodeEnum.France],
    tooltipText: CountryCodeEnum.France,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.Belgium],
    label: CountryCodeShortMap[CountryCodeEnum.Belgium],
    tooltipText: CountryCodeEnum.Belgium,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.Netherlands],
    label: CountryCodeShortMap[CountryCodeEnum.Netherlands],
    tooltipText: CountryCodeEnum.Netherlands,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.Germany],
    label: CountryCodeShortMap[CountryCodeEnum.Germany],
    tooltipText: CountryCodeEnum.Germany,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.Italy],
    label: CountryCodeShortMap[CountryCodeEnum.Italy],
    tooltipText: CountryCodeEnum.Italy,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.Sweden],
    label: CountryCodeShortMap[CountryCodeEnum.Sweden],
    tooltipText: CountryCodeEnum.Sweden,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.SouthAfrica],
    label: CountryCodeShortMap[CountryCodeEnum.SouthAfrica],
    tooltipText: CountryCodeEnum.SouthAfrica,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.Poland],
    label: CountryCodeShortMap[CountryCodeEnum.Poland],
    tooltipText: CountryCodeEnum.Poland,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.Egypt],
    label: CountryCodeShortMap[CountryCodeEnum.Egypt],
    tooltipText: CountryCodeEnum.Egypt,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.SaudiArabia],
    label: CountryCodeShortMap[CountryCodeEnum.SaudiArabia],
    tooltipText: CountryCodeEnum.SaudiArabia,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.Turkey],
    label: CountryCodeShortMap[CountryCodeEnum.Turkey],
    tooltipText: CountryCodeEnum.Turkey,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.UnitedArabEmirates],
    label: CountryCodeShortMap[CountryCodeEnum.UnitedArabEmirates],
    tooltipText: CountryCodeEnum.UnitedArabEmirates,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.India],
    label: CountryCodeShortMap[CountryCodeEnum.India],
    tooltipText: CountryCodeEnum.India,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.Singapore],
    label: CountryCodeShortMap[CountryCodeEnum.Singapore],
    tooltipText: CountryCodeEnum.Singapore,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.Australia],
    label: CountryCodeShortMap[CountryCodeEnum.Australia],
    tooltipText: CountryCodeEnum.Australia,
  },
  {
    value: VendorCentralURLMap[CountryCodeEnum.Japan],
    label: CountryCodeShortMap[CountryCodeEnum.Japan],
    tooltipText: CountryCodeEnum.Japan,
  },
];

export const AmazonSPSellerAvailableRegions: IDropdownItem<string>[] = [
  {
    value: SellerCentralURLMap[CountryCodeEnum.UnitedStates],
    label: CountryCodeShortMap[CountryCodeEnum.UnitedStates],
    tooltipText: CountryCodeEnum.UnitedStates,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.Canada],
    label: CountryCodeShortMap[CountryCodeEnum.Canada],
    tooltipText: CountryCodeEnum.Canada,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.Mexico],
    label: CountryCodeShortMap[CountryCodeEnum.Mexico],
    tooltipText: CountryCodeEnum.Mexico,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.Brazil],
    label: CountryCodeShortMap[CountryCodeEnum.Brazil],
    tooltipText: CountryCodeEnum.Brazil,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.Spain],
    label: CountryCodeShortMap[CountryCodeEnum.Spain],
    tooltipText: CountryCodeEnum.Spain,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.UnitedKingdom],
    label: CountryCodeShortMap[CountryCodeEnum.UnitedKingdom],
    tooltipText: CountryCodeEnum.UnitedKingdom,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.France],
    label: CountryCodeShortMap[CountryCodeEnum.France],
    tooltipText: CountryCodeEnum.France,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.Belgium],
    label: CountryCodeShortMap[CountryCodeEnum.Belgium],
    tooltipText: CountryCodeEnum.Belgium,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.Netherlands],
    label: CountryCodeShortMap[CountryCodeEnum.Netherlands],
    tooltipText: CountryCodeEnum.Netherlands,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.Germany],
    label: CountryCodeShortMap[CountryCodeEnum.Germany],
    tooltipText: CountryCodeEnum.Germany,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.Italy],
    label: CountryCodeShortMap[CountryCodeEnum.Italy],
    tooltipText: CountryCodeEnum.Italy,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.Sweden],
    label: CountryCodeShortMap[CountryCodeEnum.Sweden],
    tooltipText: CountryCodeEnum.Sweden,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.SouthAfrica],
    label: CountryCodeShortMap[CountryCodeEnum.SouthAfrica],
    tooltipText: CountryCodeEnum.SouthAfrica,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.Poland],
    label: CountryCodeShortMap[CountryCodeEnum.Poland],
    tooltipText: CountryCodeEnum.Poland,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.Egypt],
    label: CountryCodeShortMap[CountryCodeEnum.Egypt],
    tooltipText: CountryCodeEnum.Egypt,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.Turkey],
    label: CountryCodeShortMap[CountryCodeEnum.Turkey],
    tooltipText: CountryCodeEnum.Turkey,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.SaudiArabia],
    label: CountryCodeShortMap[CountryCodeEnum.SaudiArabia],
    tooltipText: CountryCodeEnum.SaudiArabia,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.UnitedArabEmirates],
    label: CountryCodeShortMap[CountryCodeEnum.UnitedArabEmirates],
    tooltipText: CountryCodeEnum.UnitedArabEmirates,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.India],
    label: CountryCodeShortMap[CountryCodeEnum.India],
    tooltipText: CountryCodeEnum.India,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.Singapore],
    label: CountryCodeShortMap[CountryCodeEnum.Singapore],
    tooltipText: CountryCodeEnum.Singapore,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.Australia],
    label: CountryCodeShortMap[CountryCodeEnum.Australia],
    tooltipText: CountryCodeEnum.Australia,
  },
  {
    value: SellerCentralURLMap[CountryCodeEnum.Japan],
    label: CountryCodeShortMap[CountryCodeEnum.Japan],
    tooltipText: CountryCodeEnum.Japan,
  },
];
