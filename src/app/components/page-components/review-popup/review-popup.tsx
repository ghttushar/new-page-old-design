import CustomizablePopup, {
  IPopupDescription,
} from '@/app/components/common/customizable-dialog/customizable-popup';
import { WalmartReviewProcessStatusEnum } from '@/enums/advertising-review.enums';
import React, { useState } from 'react';
import ReviewCancelPopup from './review-cancel-popup';

interface IReviewDetailPopupProps {
  openModal: boolean;
  handleClose: () => void;
  description: IPopupDescription[];
  reviewProcessStatus: string;
  reviewDecisionStatus: string | null;
  campaignId: string | number;
  campaignName: string;
  reviewId: string;
  isEditSettingsDisabled: boolean;
  editSettingsDisabledTooltip: string;
}

export default function ReviewPopup({
  openModal,
  handleClose,
  description,
  reviewProcessStatus,
  reviewDecisionStatus,
  campaignId,
  campaignName,
  reviewId,
  isEditSettingsDisabled,
  editSettingsDisabledTooltip,
}: IReviewDetailPopupProps) {
  const [cancelConfirmationOpen, setCancelConfirmation] =
    useState<boolean>(false);

  const handleCancelReviewPopupOpen = () => setCancelConfirmation(true);
  const handleCancelReviewPopupClose = () => setCancelConfirmation(false);

  return (
    <React.Fragment>
      {/* TODO: Keeping this dead code in case we need Re-submit button */}
      {/* {!(
        reviewProcessStatus === WalmartReviewProcessStatusEnum.CANCELLED ||
        (reviewDecisionStatus &&
          reviewDecisionStatus === WalmartReviewDecisionStatusEnum.REJECTED)
      ) ? ( */}
      <CustomizablePopup
        openModal={openModal}
        handleClose={handleClose}
        handleConfirmationAction={handleCancelReviewPopupOpen}
        confirmationButtonText="Cancel Review"
        title="Review Status"
        description={description}
        wantBodyDivider={false}
        wantGutters={true}
        minWidth="50rem"
        hideConfirmationButton={
          !(
            reviewProcessStatus === WalmartReviewProcessStatusEnum.PENDING ||
            reviewProcessStatus === WalmartReviewProcessStatusEnum.IN_PROGRESS
          )
        }
        disableConfirmationButton={isEditSettingsDisabled}
        disableConfirmationButtonTooltip={editSettingsDisabledTooltip}
      />
      {/* ) : (
        <ReviewReSubmitPopup
          openModal={openModal}
          handleClose={handleClose}
          campaignId={campaignId}
          campaignName={campaignName}
          description={description}
        />
      )} */}

      {cancelConfirmationOpen === true && (
        <ReviewCancelPopup
          openModal={cancelConfirmationOpen}
          handleClose={handleCancelReviewPopupClose}
          handleParentPopupClose={handleClose}
          campaignId={campaignId}
          reviewId={reviewId}
        />
      )}
    </React.Fragment>
  );
}
