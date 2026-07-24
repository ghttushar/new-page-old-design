import { MarketplaceEnum } from '@/enums/serp.enums';
import { getPrefixElementByMarketplace } from '@/utils/marketplace-logo.utils';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';

export const marketplaceAllOption: IDropdownItem<string> = {
  value: MarketplaceEnum.All,
  label: 'All',
  isDisabled: false,
  selected: false,
  prefixElement: getPrefixElementByMarketplace(MarketplaceEnum.All),
};

export const marketplaceOptions: IDropdownItem<string>[] = [
  {
    value: MarketplaceEnum.AMAZON,
    label: 'Amazon',
    isDisabled: false,
    selected: false,
    prefixElement: getPrefixElementByMarketplace(MarketplaceEnum.AMAZON),
  },
  {
    value: MarketplaceEnum.WALMART,
    label: 'Walmart',
    isDisabled: false,
    selected: false,
    prefixElement: getPrefixElementByMarketplace(MarketplaceEnum.WALMART),
  },
];

export const MI_CLEAR_KEYWORD_SEARCH_EVENT = 'clearKeywordSearch';
