import { AdType, AdTypeShort } from '@/enums/advertising.enums';
import { FeaturesEnum } from '@/enums/auth.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { WalmartAdTypeEnum } from '@/enums/walmart.enums';

export const REVIEW_FEATURE_FLAGS: {
  [key: string]: {
    marketplace: MarketplaceEnum;
    campaignReviewEnabled: any;
  };
} = {
  [WalmartAdTypeEnum.SPONSORED_BRANDS]: {
    marketplace: MarketplaceEnum.WALMART,
    campaignReviewEnabled: false,
  },
  [WalmartAdTypeEnum.SPONSORED_VIDEO]: {
    marketplace: MarketplaceEnum.WALMART,
    campaignReviewEnabled: true,
  },
  [AdType.SPONSORED_BRANDS]: {
    marketplace: MarketplaceEnum.WALMART,
    campaignReviewEnabled: false,
  },
  [AdType.SPONSORED_VIDEO]: {
    marketplace: MarketplaceEnum.WALMART,
    campaignReviewEnabled: true,
  },
  [AdTypeShort.SPONSORED_BRANDS]: {
    marketplace: MarketplaceEnum.WALMART,
    campaignReviewEnabled: false,
  },
  [AdTypeShort.SPONSORED_VIDEO]: {
    marketplace: MarketplaceEnum.WALMART,
    campaignReviewEnabled: true,
  },
};

export const DISABLED_FEATURE_REASON: Record<string, string> = {
  [FeaturesEnum.JIVA_CHATBOT]:
    'Jiva is being improved for you and is temporarily unavailable',
};
