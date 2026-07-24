export interface IReviewAnalysisParams {
  asin: string;
}

export interface IReview {
  content?: string;
  count: number;
  keyword: string;
}

export interface IReviewDetails {
  negative_reviews: number;
  positive_reviews: number;
  total_reviews: number;
  neutral_reviews: number;
}

export interface IReviewAnalysisResponse {
  data: IReviewAnalysisData;
  message: string;
  description: string;
}

export interface IReviewAnalysisData {
  negativeKeywords: IReview[];
  positiveKeywords: IReview[];
  reviewsData: IReviewDetails;
}
