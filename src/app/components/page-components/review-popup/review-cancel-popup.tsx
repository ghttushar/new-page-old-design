import { AdType } from '@/enums/advertising.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IWalmartReviewCancelPayload } from '@/interfaces/advertising/walmart/walmart-review.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppMutation } from '@/redux/react-query-hooks';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import { walmartAdvertisingReviewServices } from '@/services/advertising/walmart/walmart-review.service';
import { getUrlWithQuery } from '@/utils';
import {
  getAdTypePath,
  getCampaignUrl,
  getMarketplacePath,
} from '@/utils/advertising.utils';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizablePopup from '../../common/customizable-dialog/customizable-popup';

interface IReviewCancelPopupProps {
  openModal: boolean;
  handleClose: () => void;
  handleParentPopupClose: () => void;
  campaignId: string | number;
  reviewId: string;
}

export default function ReviewCancelPopup({
  openModal,
  handleClose,
  handleParentPopupClose,
  campaignId,
  reviewId,
}: IReviewCancelPopupProps) {
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutateAsync: editAccessMutateWalmartSBCancelReview,
    isPending: isWalmartSBCancelReviewPending,
    isIdle: isWalmartSBCancelReviewIdle,
  } = useAppMutation({
    mutationFn: (body: IWalmartReviewCancelPayload) =>
      walmartAdvertisingReviewServices.putCancelReview(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SB_CAMPAIGN_LVL_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: 'Review cancelled successfully!',
          })
        );

        navigate(
          getUrlWithQuery(
            getCampaignUrl(
              campaignId,
              getAdTypePath(AdType.SPONSORED_BRANDS),
              getMarketplacePath(MarketplaceEnum.WALMART)
            )
          )
        );
      },
      onSettled: (res) => {
        handleClose();
        handleParentPopupClose();
      },
    },
  });

  const {
    mutateAsync: editAccessMutateWalmartSVCancelReview,
    isPending: isWalmartSVCancelReviewPending,
    isIdle: isWalmartSVCancelReviewIdle,
  } = useAppMutation({
    mutationFn: (body: IWalmartReviewCancelPayload) =>
      walmartAdvertisingReviewServices.putCancelReview(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SV_CAMPAIGN_LVL_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: 'Review cancelled successfully!',
          })
        );

        navigate(
          getUrlWithQuery(
            getCampaignUrl(
              campaignId,
              getAdTypePath(AdType.SPONSORED_VIDEO),
              getMarketplacePath(MarketplaceEnum.WALMART)
            )
          )
        );
      },
      onSettled: (res) => {
        handleClose();
        handleParentPopupClose();
      },
    },
  });

  const handleCancelReviewAction = async () => {
    const body: IWalmartReviewCancelPayload = {
      campaignId: `${campaignId}`,
      reviewId: reviewId,
    };

    if (advHeaderFilters.adType.value === AdType.SPONSORED_BRANDS) {
      await editAccessMutateWalmartSBCancelReview(body);
    }

    if (advHeaderFilters.adType.value === AdType.SPONSORED_VIDEO) {
      await editAccessMutateWalmartSVCancelReview(body);
    }
  };

  const isCancelReviewLoading = useMemo(() => {
    return (
      (isWalmartSBCancelReviewPending === true &&
        isWalmartSBCancelReviewIdle === false) ||
      (isWalmartSVCancelReviewPending === true &&
        isWalmartSVCancelReviewIdle === false)
    );
  }, [
    isWalmartSBCancelReviewPending,
    isWalmartSBCancelReviewIdle,
    isWalmartSVCancelReviewPending,
    isWalmartSVCancelReviewIdle,
  ]);

  return (
    <CustomizablePopup
      openModal={openModal}
      handleClose={handleClose}
      handleConfirmationAction={handleCancelReviewAction}
      description={[
        {
          content: `<strong>Note:</strong> Cancelling the review process will abort Walmart's review and the campaign will continue to be in paused state.`,
          isHeading: false,
        },
        {
          content: `Are you sure you still want to cancel the review?`,
          isHeading: false,
        },
      ]}
      wantBodyDivider={false}
      wantGutters={true}
      maxWidth="xs"
      isLoading={isCancelReviewLoading}
      confirmationButtonText="Yes, Cancel"
      cancelButtonText="Go Back"
    />
  );
}
