import { MARKET_INTELLIGENCE_BASE_URL } from 'src/constants';
import {
  IReviewAnalysisData,
  IReviewAnalysisParams,
} from 'src/interfaces/review-analysis.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

const ReviewAnalysisService = {
  getReviewAnalysisData: (body: IReviewAnalysisParams) => {
    return axiosInstance.post<IAPIResponse<IReviewAnalysisData>>(
      `${MARKET_INTELLIGENCE_BASE_URL}/api/market-intelligence/review-analysis/reviews`,
      body,
      {
        timeout: 10 * 60 * 1000, // 10 minutes
      }
    );
  },
};

export default ReviewAnalysisService;
