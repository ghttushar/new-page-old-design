import { BidderAdTypeEnum } from '@/enums/advertising.enums';
import { IEditAccessAdGroupUpdateBody } from '@/interfaces/edit-access/edit-access.interface';
import { BIDDER_BASE_URL } from 'src/constants';
import {
  IBidderUpdate,
  IBidderWalmartProductUpdate,
} from 'src/interfaces/edit-access/bidder.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const BidderServices = {
  updateAmazonAdGroupBidder: (
    body: IEditAccessAdGroupUpdateBody,
    adType: BidderAdTypeEnum
  ) => {
    return axiosInstance.post<IAPIResponse<string>>(
      `${BIDDER_BASE_URL}/amazon/config/${adType}/ad-group`,
      body
    );
  },

  updateAmazonKeywordBidder: (
    body: IBidderUpdate[],
    adType: BidderAdTypeEnum
  ) => {
    return axiosInstance.post<IAPIResponse<string>>(
      `${BIDDER_BASE_URL}/amazon/config/${adType}/keyword`,
      {
        payload: body,
      }
    );
  },

  updateAmazonTargetBidder: (
    body: IBidderUpdate[],
    adType: BidderAdTypeEnum
  ) => {
    return axiosInstance.post<IAPIResponse<string>>(
      `${BIDDER_BASE_URL}/amazon/config/${adType}/target`,
      {
        payload: body,
      }
    );
  },

  updateWalmartAdGroupBidder: (body: IBidderUpdate[]) => {
    return axiosInstance.post<IAPIResponse<string>>(
      `${BIDDER_BASE_URL}/walmart/config/ad-group`,
      {
        payload: body,
      }
    );
  },

  updateWalmartKeywordBidder: (body: IBidderUpdate[]) => {
    return axiosInstance.post<IAPIResponse<string>>(
      `${BIDDER_BASE_URL}/walmart/config/keyword`,
      {
        payload: body,
      }
    );
  },

  updateWalmartProductBidder: (body: IBidderWalmartProductUpdate[]) => {
    return axiosInstance.post<IAPIResponse<string>>(
      `${BIDDER_BASE_URL}/walmart/config/product`,
      {
        payload: body,
      }
    );
  },
};
