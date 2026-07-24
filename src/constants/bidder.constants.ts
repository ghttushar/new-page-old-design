import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { BidderTypeEnum } from 'src/enums/advertising.enums';

export interface IBidderTypeConfig {
  type: BidderTypeEnum;
  label: string;
  key: string;
}

export const BIDDER_TYPE_CONFIGS: IDropdownItem<BidderTypeEnum>[] = [
  {
    value: BidderTypeEnum.AI_BIDDER,
    label: 'AI',
    selected: false,
    isDisabled: false,
  },

  {
    value: BidderTypeEnum.OFF,
    label: 'Off',
    selected: true,
    isDisabled: false,
  },
  {
    value: BidderTypeEnum.BIDDER,
    label: 'Rule',
    selected: false,
    isDisabled: false,
  },
];
