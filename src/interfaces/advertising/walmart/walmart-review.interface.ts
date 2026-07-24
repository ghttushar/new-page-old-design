export interface IWalmartReviewColumns {
  reviewDecisionStatus?: string | null;
  reviewId?: string | null;
  reviewProcessStatus?: string | null;
  reviewReason?: string | null;
}

export interface IWalmartReviewPopupDetails {
  heading: string;
  description: string;
}

export interface IWalmartReviewCancelPayload {
  campaignId: string;
  reviewId: string;
}

export interface IWalmartReviewStatusSettingsView {
  title: string;
  icon: JSX.Element;
}
