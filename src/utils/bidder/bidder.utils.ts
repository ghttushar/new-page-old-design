import { BidderStatusEnum } from 'src/enums/advertising.enums';
import { convertToTitleCase } from '../advertising.utils';

const bidderUtils = {
  bidderStatusToBoolean: (bidderStatus?: BidderStatusEnum) => {
    switch (bidderStatus) {
      case BidderStatusEnum.ACTIVE:
        return true;
      case BidderStatusEnum.PAUSED:
        return false;
      default:
        return false;
    }
  },
  booleanToBidderStatus: (bidderStatusBoolean: boolean) => {
    const bidderStatus = bidderStatusBoolean
      ? BidderStatusEnum.ACTIVE
      : BidderStatusEnum.PAUSED;
    return convertToTitleCase(bidderStatus);
  },
};

export default bidderUtils;
