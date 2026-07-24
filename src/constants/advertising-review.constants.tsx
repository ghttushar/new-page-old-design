import {
  WalmartMappedReviewStatusEnum,
  WalmartReviewDecisionStatusEnum,
  WalmartReviewProcessStatusEnum,
} from '@/enums/advertising-review.enums';
import {
  IWalmartReviewPopupDetails,
  IWalmartReviewStatusSettingsView,
} from '@/interfaces/advertising/walmart/walmart-review.interface';
import {
  CheckCircleIcon,
  SpinnerIcon,
  WarningIcon,
  XCircleIcon,
} from '@phosphor-icons/react';

export const WALMART_REVIEW_POPUP_MAPPINGS: {
  [key: string]: IWalmartReviewPopupDetails;
} = {
  [WalmartReviewProcessStatusEnum.PENDING]: {
    heading: 'Campaign Review is In-progress',
    description:
      'Your campaign is currently being reviewed by Walmart’s team. This process typically takes up to 24-48 hours. No action is needed on your end. If you wish, you can cancel the review.',
  },
  [WalmartReviewProcessStatusEnum.IN_PROGRESS]: {
    heading: 'Campaign Review is In-progress',
    description:
      'Your campaign is currently being reviewed by Walmart’s team. This process typically takes up to 24-48 hours. No action is needed on your end. If you wish, you can cancel the review.',
  },
  [WalmartReviewDecisionStatusEnum.APPROVED]: {
    heading: 'Campaign is Approved',
    description:
      'Your campaign has been successfully reviewed by Walmart and is currently live.',
  },
  [WalmartReviewDecisionStatusEnum.REJECTED]: {
    heading: 'Campaign is Rejected',
    description: '',
  },
  [WalmartReviewProcessStatusEnum.CANCELLED]: {
    heading: 'Campaign Review is Cancelled',
    description:
      'This campaign is no longer under review. You can make changes and re-submit it at anytime.',
  },
};

export const WALMART_REVIEW_STATUS_SETTINGS_VIEW_MAPPINGS: {
  [key: string]: IWalmartReviewStatusSettingsView;
} = {
  [WalmartReviewProcessStatusEnum.PENDING]: {
    title: WalmartMappedReviewStatusEnum.PENDING,
    icon: <WarningIcon size={'1.8rem'} color="#FFAF38" />,
  },
  [WalmartReviewProcessStatusEnum.IN_PROGRESS]: {
    title: WalmartMappedReviewStatusEnum.IN_PROGRESS,
    icon: <SpinnerIcon size={'1.8rem'} color="#FFAF38" />,
  },
  [WalmartReviewDecisionStatusEnum.APPROVED]: {
    title: WalmartMappedReviewStatusEnum.APPROVED,
    icon: <CheckCircleIcon size={'1.8rem'} color="#0AAE57" />,
  },
  [WalmartReviewDecisionStatusEnum.REJECTED]: {
    title: WalmartMappedReviewStatusEnum.REJECTED,
    icon: <XCircleIcon size={'1.8rem'} color="#FF0000" />,
  },
  [WalmartReviewProcessStatusEnum.CANCELLED]: {
    title: WalmartMappedReviewStatusEnum.CANCELLED,
    icon: <XCircleIcon size={'1.8rem'} color="#FF0000" />,
  },
};
