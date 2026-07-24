import { IWalmartCampaign } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IWalmartSVCampaign } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import styles from './advertising-page-sub-header.module.scss';
import AdvertisingSubHeaderReview from './advertising-sub-header-review';

interface IAdvertisingSubHeaderReviewWrapperProps {
  selectedCampaign: IWalmartCampaign | IWalmartSVCampaign;
  isEditSettingsDisabled: boolean;
  editSettingsDisabledTooltip: string;
}

export default function AdvertisingSubHeaderReviewWrapper({
  selectedCampaign,
  isEditSettingsDisabled,
  editSettingsDisabledTooltip,
}: IAdvertisingSubHeaderReviewWrapperProps) {
  const {
    campaignId,
    campaignName,
    reviewReason,
    reviewId,
    reviewDecisionStatus,
    reviewProcessStatus,
  } = selectedCampaign as IWalmartCampaign | IWalmartSVCampaign;

  return (
    <div
      className={`${styles.reviewContainer} ${
        reviewId && reviewDecisionStatus !== undefined && reviewProcessStatus
          ? styles.child
          : ''
      }`}
      style={{
        display:
          reviewId && reviewDecisionStatus !== undefined && reviewProcessStatus
            ? 'block'
            : 'none',
      }}
    >
      {reviewId &&
        reviewDecisionStatus !== undefined &&
        reviewProcessStatus && (
          <AdvertisingSubHeaderReview
            campaignId={campaignId}
            campaignName={campaignName}
            reviewReason={reviewReason}
            reviewId={reviewId}
            reviewDecisionStatus={reviewDecisionStatus}
            reviewProcessStatus={reviewProcessStatus}
            isEditSettingsDisabled={isEditSettingsDisabled}
            editSettingsDisabledTooltip={editSettingsDisabledTooltip}
          />
        )}
    </div>
  );
}
