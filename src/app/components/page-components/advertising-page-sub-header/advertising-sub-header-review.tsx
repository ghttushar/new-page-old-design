import { WALMART_REVIEW_POPUP_MAPPINGS } from '@/constants/advertising-review.constants';
import { WalmartReviewDecisionStatusEnum } from '@/enums/advertising-review.enums';
import { FileTextIcon } from '@phosphor-icons/react';
import React, { useMemo, useState } from 'react';
import SecondaryButton from '../../common/secondary-button/secondary-button';
import ReviewPopup from '../review-popup/review-popup';
import styles from './advertising-page-sub-header.module.scss';

interface IAdvertisingSubHeaderReviewProps {
  campaignId: string | number;
  campaignName: string;
  reviewReason: string | null | undefined;
  reviewId: string;
  reviewDecisionStatus: string | null;
  reviewProcessStatus: string;
  isEditSettingsDisabled: boolean;
  editSettingsDisabledTooltip: string;
}

export default function AdvertisingSubHeaderReview({
  campaignId,
  campaignName,
  reviewReason,
  reviewId,
  reviewDecisionStatus,
  reviewProcessStatus,
  isEditSettingsDisabled,
  editSettingsDisabledTooltip,
}: IAdvertisingSubHeaderReviewProps) {
  const [openViewPopup, setOpenViewPopup] = useState<boolean>(false);

  const handleViewReviewOpen = () => setOpenViewPopup(true);
  const handleViewReviewClose = () => setOpenViewPopup(false);

  const getReviewDetails = useMemo(() => {
    if (
      reviewDecisionStatus &&
      (reviewDecisionStatus === WalmartReviewDecisionStatusEnum.APPROVED ||
        reviewDecisionStatus === WalmartReviewDecisionStatusEnum.REJECTED)
    ) {
      return WALMART_REVIEW_POPUP_MAPPINGS[reviewDecisionStatus];
    }

    return WALMART_REVIEW_POPUP_MAPPINGS[reviewProcessStatus];
  }, [reviewDecisionStatus, reviewProcessStatus]);

  return (
    <React.Fragment>
      <div className={styles.subContainer}>
        <div className={styles.headingContainer}>
          <FileTextIcon size={18} color="#464646" />
          <p className={styles.heading}>Review Status</p>
        </div>
        <div className={styles.contentContainer}>
          <p className={styles.content}>{getReviewDetails.heading}!</p>
          <SecondaryButton
            buttonText="View"
            buttonFunction={handleViewReviewOpen}
            disabled={false}
            height="3rem"
            fontSize="1rem"
            fontWeight="500"
            width="5rem"
          />
        </div>
      </div>

      {openViewPopup === true && (
        <ReviewPopup
          openModal={openViewPopup}
          handleClose={handleViewReviewClose}
          description={[
            {
              content: getReviewDetails.heading,
              isHeading: true,
              headingStartIcon: (
                <FileTextIcon size={18} color="#464646" weight="bold" />
              ),
            },
            {
              content:
                reviewDecisionStatus &&
                reviewDecisionStatus ===
                  WalmartReviewDecisionStatusEnum.REJECTED &&
                reviewReason
                  ? reviewReason
                  : getReviewDetails.description,
              isHeading: false,
            },
          ]}
          reviewProcessStatus={reviewProcessStatus}
          reviewDecisionStatus={reviewDecisionStatus}
          campaignId={campaignId}
          campaignName={campaignName}
          reviewId={reviewId}
          isEditSettingsDisabled={isEditSettingsDisabled}
          editSettingsDisabledTooltip={editSettingsDisabledTooltip}
        />
      )}
    </React.Fragment>
  );
}
