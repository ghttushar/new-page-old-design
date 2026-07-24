import { AdType } from '@/enums/advertising.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { WalmartCampaignStatusEnum } from '@/enums/walmart.enums';
import { IEditAccessWalmartCampaign } from '@/interfaces/edit-access/edit-access.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppMutation } from '@/redux/react-query-hooks';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import { walmartEditAccessSBServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sb/walmart-edit-access-sb.service';
import { walmartEditAccessSVServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sv/walmart-edit-access-sv.service';
import { getUrlWithQuery } from '@/utils';
import {
  getAdTypePath,
  getCampaignUrl,
  getMarketplacePath,
} from '@/utils/advertising.utils';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizablePopup, {
  IPopupDescription,
} from '../../common/customizable-dialog/customizable-popup';

interface IReviewReSubmitPopupProps {
  openModal: boolean;
  handleClose: () => void;
  campaignId: string | number;
  campaignName: string;
  description: IPopupDescription[];
}

export default function ReviewReSubmitPopup({
  openModal,
  handleClose,
  campaignId,
  campaignName,
  description,
}: IReviewReSubmitPopupProps) {
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutateAsync: editAccessMutateWalmartSBReSubmitReview,
    isPending: isWalmartSBReSubmitReviewPending,
    isIdle: isWalmartSBReSubmitReviewIdle,
  } = useAppMutation({
    mutationFn: (body: IEditAccessWalmartCampaign[]) =>
      walmartEditAccessSBServices.updateWalmartSBCampaign(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SB_CAMPAIGN_LVL_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: 'Re-Submit for Review processed successfully!',
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
      },
    },
  });

  const {
    mutateAsync: editAccessMutateWalmartSVReSubmitReview,
    isPending: isWalmartSVReSubmitReviewPending,
    isIdle: isWalmartSVReSubmitReviewIdle,
  } = useAppMutation({
    mutationFn: (body: IEditAccessWalmartCampaign[]) =>
      walmartEditAccessSVServices.updateWalmartSVCampaign(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SV_CAMPAIGN_LVL_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: 'Re-Submit for Review processed successfully!',
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
      },
    },
  });

  const handleReSubmitReviewAction = async () => {
    const body: IEditAccessWalmartCampaign[] = [
      {
        id: `${campaignId}`,
        campaignId: `${campaignId}`,
        entityName: campaignName || `${campaignId}`,
        status: WalmartCampaignStatusEnum.ENABLED,
      },
    ];

    if (advHeaderFilters.adType.value === AdType.SPONSORED_BRANDS) {
      await editAccessMutateWalmartSBReSubmitReview(body);
    }

    if (advHeaderFilters.adType.value === AdType.SPONSORED_VIDEO) {
      await editAccessMutateWalmartSVReSubmitReview(body);
    }
  };

  const isReSubmitReviewLoading = useMemo(() => {
    return (
      (isWalmartSBReSubmitReviewPending === true &&
        isWalmartSBReSubmitReviewIdle === false) ||
      (isWalmartSVReSubmitReviewPending === true &&
        isWalmartSVReSubmitReviewIdle === false)
    );
  }, [
    isWalmartSBReSubmitReviewPending,
    isWalmartSBReSubmitReviewIdle,
    isWalmartSVReSubmitReviewPending,
    isWalmartSVReSubmitReviewIdle,
  ]);

  return (
    <CustomizablePopup
      openModal={openModal}
      handleClose={handleClose}
      handleConfirmationAction={handleReSubmitReviewAction}
      confirmationButtonText="Re-submit Review"
      title="Review Status"
      description={description}
      wantBodyDivider={false}
      wantGutters={true}
      minWidth="50rem"
      isLoading={isReSubmitReviewLoading}
    />
  );
}
