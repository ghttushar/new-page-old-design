import { WALMART_REVIEW_BASE_URL } from '@/constants';
import { IWalmartReviewCancelPayload } from '@/interfaces/advertising/walmart/walmart-review.interface';
import { IAPIResponse } from '@/interfaces/service.interface';
import { axiosInstance } from '@/redux/store';

export const walmartAdvertisingReviewServices = {
  putCancelReview: (body: IWalmartReviewCancelPayload) => {
    return axiosInstance.put<IAPIResponse<null>>(
      `${WALMART_REVIEW_BASE_URL}/cancel`,
      body
    );
  },
};
