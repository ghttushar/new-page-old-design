import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  BRAND_ANALYTICS_URL,
  BRAND_SOV_URL,
  KEYWORD_SOV_URL,
  KEYWORD_TRACKER_URL,
  PRODUCT_SOV_URL,
} from 'src/constants/urls.constants';

const marketIntelligenceUtils = {
  getBrandAnalyticsUrl: (brand: string, marketplace: string) => {
    return `${BRAND_ANALYTICS_URL}/${brand}/${marketplace?.toLowerCase()}`;
  },
  getProductSovUrl: (marketplace: string) => {
    return `${PRODUCT_SOV_URL}/${marketplace?.toLowerCase()}`;
  },
  getKeywordSovUrl: (marketplace: string) => {
    return `${KEYWORD_SOV_URL}/${marketplace?.toLowerCase()}`;
  },
  getKeywordTrackerUrl: (marketplace: string) => {
    return `${KEYWORD_TRACKER_URL}/${marketplace?.toLowerCase()}`;
  },
  getBrandSovUrl: (marketplace: string) => {
    return `${BRAND_SOV_URL}/${marketplace?.toLowerCase()}`;
  },
  getMarketplace: (marketplace?: MarketplaceEnum): IDropdownItem<string> => {
    if (!marketplace) marketplace = MarketplaceEnum.AMAZON;
    return {
      value: marketplace,
      label: marketplace,
    };
  },
};

export default marketIntelligenceUtils;
