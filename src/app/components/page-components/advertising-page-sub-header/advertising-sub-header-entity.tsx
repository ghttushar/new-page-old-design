import { WALMART_INDEFINITE_END_DATE } from '@/constants/advertising-walmart.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  ICampaignPageType,
  ICampaignPlatform,
} from '@/interfaces/advertising/walmart/walmart-advertising.interface';
import {
  IEditAccessWalmartCampaign,
  IEditAccessWalmartPageType,
} from '@/interfaces/edit-access/edit-access.interface';
import { useAppMutation } from '@/redux/react-query-hooks';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from '@/redux/slices/notifications/toast-message.slice';
import { walmartEditAccessSBServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sb/walmart-edit-access-sb.service';
import { walmartEditAccessSPServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sp/walmart-edit-access-sp.service';
import { walmartEditAccessSVServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sv/walmart-edit-access-sv.service';
import { getTodayByTimeZone, getUSFormatDate } from '@/utils/datetime.utils';
import { ArrowsClockwiseIcon, SlidersIcon } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdType, AdTypeShort } from 'src/enums/advertising.enums';
import {
  DISABLE_TOOLTIP,
  TooltipPlacement,
} from 'src/enums/tooltip-texts.enums';
import {
  WalmartBudgetTypeEnum,
  WalmartCampaignStatusEnum,
} from 'src/enums/walmart.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { resetErrorMessages } from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { selectAdvertisingHeaderFilters } from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import { displayValue, formatNum, getUrlWithQuery, parseNum } from 'src/utils';
import {
  convertToUpperCase,
  getAdTypePath,
  getCampaignUrl,
  getMarketplacePath,
  getSPBiddingStrategy,
  hasBudgetTypeProp,
  hasPageTypeProp,
  hasPlatformProp,
} from 'src/utils/advertising.utils';
import ConfirmationBox from '../../common/confirmation-box/confirmation-box';
import PrimaryButton from '../../common/primary-button/primary-button';
import SkeletonComponent from '../../common/skeleton/skeleton';
import StatusBox from '../../common/status-box/status-box';
import AdvertisingSettingsForm from '../advertising-settings-form/advertising-settings-form';
import { IAdvertisingPageSubHeaderProps } from './advertising-page-sub-header';
import styles from './advertising-page-sub-header.module.scss';

export default function AdvertisingSubHeaderEntity(
  props: IAdvertisingPageSubHeaderProps
) {
  const {
    _selectedLevel,
    campaignName,
    status,
    budget,
    dailyBudget,
    totalBudget,
    startDate,
    endDate,
    info,
    adGroupName,
    defaultBid,
    maxBid,
    minBid,
    troas,
    biddingStrategy,
    selectedCampaign,
    selectedAdGroup,
    isLoading,
    isEditSettingsDisabled = false,
    editSettingsDisabledTooltip = '',
  } = props;

  const budgetType: string | undefined = (() => {
    if (selectedCampaign) {
      if (hasBudgetTypeProp(selectedCampaign)) {
        return selectedCampaign.budgetType;
      }
      return undefined;
    }
    return undefined;
  })();

  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as string,
    [advertisingAccount.marketplace]
  );

  const queryClient = useQueryClient();

  const pageTypeBidMultiplier: ICampaignPageType[] = useMemo(
    () =>
      selectedMarketplace === MarketplaceEnum.WALMART &&
      _selectedLevel === 'campaign-level' &&
      selectedCampaign &&
      hasPageTypeProp(selectedCampaign)
        ? selectedCampaign.pageTypes
        : [],
    [selectedCampaign, selectedMarketplace, _selectedLevel]
  );

  const platformBidMultiplier: ICampaignPlatform[] = useMemo(
    () =>
      selectedMarketplace === MarketplaceEnum.WALMART &&
      _selectedLevel === 'campaign-level' &&
      selectedCampaign &&
      hasPlatformProp(selectedCampaign)
        ? selectedCampaign.platforms
        : [],
    [selectedCampaign, selectedMarketplace, _selectedLevel]
  );

  const _startDate = startDate && getUSFormatDate(startDate);
  const _endDate =
    endDate !== '-' &&
    endDate !== null &&
    endDate !== undefined &&
    endDate !== ''
      ? selectedMarketplace === MarketplaceEnum.WALMART
        ? new Date(endDate) < new Date(WALMART_INDEFINITE_END_DATE)
          ? getUSFormatDate(endDate)
          : 'Not set'
        : getUSFormatDate(endDate)
      : 'Not set';

  const isEndDateReached =
    (endDate !== '-' &&
      endDate !== null &&
      endDate !== undefined &&
      endDate !== '' &&
      selectedMarketplace === MarketplaceEnum.WALMART &&
      new Date(endDate) < getTodayByTimeZone()) ||
    status?.toLowerCase() === WalmartCampaignStatusEnum.ENDED.toLowerCase()
      ? true
      : false;

  const [isSettingsModalOpen, setIsSettingsModalOpen] =
    useState<boolean>(false);

  const [isReactiveCampBoxOpen, setIsReactivateCampBoxOpen] = useState(false);

  const [typeOfAd, setTypeOfAd] = useState<string>(
    AdTypeShort.SPONSORED_PRODUCTS
  );
  const [isEditDisabled, setIsEditDisabled] = useState<boolean>(false);

  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true);
    return;
  };

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCloseSettingsModal = () => {
    dispatch(resetErrorMessages());
    setIsSettingsModalOpen(false);
    return;
  };

  const platformBody: IEditAccessWalmartPageType[] = useMemo(
    () =>
      platformBidMultiplier.map((platform) => {
        return {
          id: `${platform.platform}-${platform.campaignId}`,
          campaignId: `${platform.campaignId}`,
          platformType: platform.platform,
          multiplier: parseNum(platform.platformMultiplier),
          entityName: `${
            selectedCampaign?.campaignName || platform.campaignId
          } (${platform.platform})`,
        };
      }) ?? [],
    [platformBidMultiplier, selectedCampaign?.campaignName]
  );

  const pageTypeBody: IEditAccessWalmartPageType[] = useMemo(
    () =>
      pageTypeBidMultiplier.map((pageType) => {
        return {
          id: `${pageType.pageType}-${pageType.campaignId}`,
          campaignId: `${pageType.campaignId}`,
          placementType: pageType.pageType,
          multiplier: parseNum(pageType.pageTypeMultiplier),
          entityName: `${
            selectedCampaign?.campaignName || pageType.campaignId
          } (${pageType.pageType})`,
        };
      }) ?? [],
    [pageTypeBidMultiplier, selectedCampaign?.campaignName]
  );

  const reactivatePayload: IEditAccessWalmartCampaign[] = useMemo(
    () => [
      {
        id:
          selectedCampaign && Object.keys(selectedCampaign)
            ? `${selectedCampaign.campaignId}`
            : '',
        campaignId:
          selectedCampaign && Object.keys(selectedCampaign)
            ? `${selectedCampaign.campaignId}`
            : '',
        entityName:
          selectedCampaign && Object.keys(selectedCampaign)
            ? `${selectedCampaign.campaignName || selectedCampaign.campaignId}`
            : '',
        endDate: WALMART_INDEFINITE_END_DATE,
        status: WalmartCampaignStatusEnum.EXTEND.toLowerCase(),
      },
    ],
    [selectedCampaign]
  );

  const {
    mutateAsync: editAccessMutateWalmartSPCampaign,
    isPending: isWalmartSPCampaignPending,
    isIdle: isWalmartSPCampaignIdle,
  } = useAppMutation({
    // TODO: api will be changed. all will be merged to one api.
    // TODO: remove this if not needed. If we call any one api then updates are not going through.
    // All the apis must be called.
    mutationFn: () => {
      return Promise.allSettled([
        walmartEditAccessSPServices.updateWalmartSPPageType(pageTypeBody),
        walmartEditAccessSPServices.updateWalmartSPPlatform(platformBody),
        walmartEditAccessSPServices.updateWalmartSPCampaign(reactivatePayload),
      ]);
    },
    options: {
      onSettled: (responses) => {
        setIsReactivateCampBoxOpen(false);
        const rejected = responses?.filter(
          (response) => response.status === 'rejected'
        );

        if (responses) {
          if (
            responses[0].status === 'fulfilled' &&
            responses[1].status === 'fulfilled' &&
            responses[2].status === 'fulfilled'
          ) {
            queryClient.invalidateQueries({
              queryKey: [QueryKeyEnums.WMT_SP_CAMPAIGN_LVL_FETCH],
            });

            dispatch(
              showSuccessToastMessage({
                title: 'Campaign updated successfully!',
              })
            );

            selectedCampaign &&
              Object.keys(selectedCampaign) &&
              navigate(
                getUrlWithQuery(
                  getCampaignUrl(
                    selectedCampaign.campaignId,
                    getAdTypePath(AdType.SPONSORED_PRODUCTS),
                    getMarketplacePath(MarketplaceEnum.WALMART)
                  )
                )
              );
          }

          if (rejected && rejected?.length > 0) {
            if (rejected?.length !== responses?.length) {
              if (responses[0].status === 'rejected') {
                dispatch(
                  showErrorToastMessage({
                    title: 'Placement Bid Multiplier Update Failed',
                    description:
                      'There was an issue while updating placement bid multipliers. Please try again.',
                  })
                );
              }

              if (responses[1].status === 'rejected') {
                dispatch(
                  showErrorToastMessage({
                    title: 'Platform Bid Multiplier Update Failed',
                    description:
                      'There was an issue while updating platform bid multipliers. Please try again.',
                  })
                );
              }

              if (responses[2].status === 'rejected') {
                dispatch(
                  showErrorToastMessage({
                    title: 'Campaign data Update Failed',
                    description:
                      'There was an issue while updating campaign data. Please try again.',
                  })
                );
              }

              queryClient.invalidateQueries({
                queryKey: [QueryKeyEnums.WMT_SP_CAMPAIGN_LVL_FETCH],
              });
            } else {
              dispatch(
                showErrorToastMessage({
                  title: 'Campaign Update Failed',
                  description:
                    'There was an issue while updating the campaign. Please try again.',
                })
              );
            }
          }
        }
      },
    },
  });

  const {
    mutateAsync: editAccessMutateWalmartSBCampaign,
    isPending: isWalmartSBCampaignPending,
    isIdle: isWalmartSBCampaignIdle,
  } = useAppMutation({
    mutationFn: () =>
      walmartEditAccessSBServices.updateWalmartSBCampaign(reactivatePayload),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SB_CAMPAIGN_LVL_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: 'Campaign updated successfully!',
          })
        );
        selectedCampaign &&
          Object.keys(selectedCampaign) &&
          navigate(
            getUrlWithQuery(
              getCampaignUrl(
                selectedCampaign.campaignId,
                getAdTypePath(AdType.SPONSORED_BRANDS),
                getMarketplacePath(MarketplaceEnum.WALMART)
              )
            )
          );
      },
      onSettled: (res) => {
        setIsReactivateCampBoxOpen(false);
        if (res?.data.error === true) {
          dispatch(
            showErrorToastMessage({
              title: 'Campaign data Update Failed',
              description:
                'There was an issue while updating campaign data. Please try again.',
            })
          );
        }

        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SB_CAMPAIGN_LVL_FETCH],
        });
      },
      onError: (err) => {
        dispatch(
          showErrorToastMessage({
            title: 'Campaign Update Failed',
            description:
              'There was an issue while updating the campaign. Please try again.',
          })
        );
      },
    },
  });

  const {
    mutateAsync: editAccessMutateWalmartSVCampaign,
    isPending: isWalmartSVCampaignPending,
    isIdle: isWalmartSVCampaignIdle,
  } = useAppMutation({
    mutationFn: () =>
      walmartEditAccessSVServices.updateWalmartSVCampaign(reactivatePayload),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SV_CAMPAIGN_LVL_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: 'Campaign updated successfully!',
          })
        );
        selectedCampaign &&
          Object.keys(selectedCampaign) &&
          navigate(
            getUrlWithQuery(
              getCampaignUrl(
                selectedCampaign.campaignId,
                getAdTypePath(AdType.SPONSORED_VIDEO),
                getMarketplacePath(MarketplaceEnum.WALMART)
              )
            )
          );
      },
      onSettled: (res) => {
        setIsReactivateCampBoxOpen(false);
        if (res?.data.error === true) {
          dispatch(
            showErrorToastMessage({
              title: 'Campaign data Update Failed',
              description:
                'There was an issue while updating campaign data. Please try again.',
            })
          );
        }

        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SV_CAMPAIGN_LVL_FETCH],
        });
      },
      onError: (err) => {
        dispatch(
          showErrorToastMessage({
            title: 'Campaign Update Failed',
            description:
              'There was an issue while updating the campaign. Please try again.',
          })
        );
      },
    },
  });

  const handleReactivateCampaign = async () => {
    if (
      selectedMarketplace === MarketplaceEnum.WALMART &&
      _selectedLevel === 'campaign-level'
    ) {
      if (advHeaderFilters.adType.value === AdType.SPONSORED_PRODUCTS) {
        await editAccessMutateWalmartSPCampaign();
      } else if (advHeaderFilters.adType.value === AdType.SPONSORED_BRANDS) {
        editAccessMutateWalmartSBCampaign();
      } else {
        editAccessMutateWalmartSVCampaign();
      }
    }
  };

  useEffect(() => {
    const _adType =
      advHeaderFilters.adType.value === AdType.SPONSORED_PRODUCTS
        ? AdTypeShort.SPONSORED_PRODUCTS
        : advHeaderFilters.adType.value === AdType.SPONSORED_BRANDS
        ? AdTypeShort.SPONSORED_BRANDS
        : advHeaderFilters.adType.value === AdType.SPONSORED_DISPLAY
        ? AdTypeShort.SPONSORED_DISPLAY
        : advHeaderFilters.adType.value === AdType.SPONSORED_VIDEO
        ? AdTypeShort.SPONSORED_VIDEO
        : '';

    setTypeOfAd(_adType);
  }, [advHeaderFilters.adType]);

  useEffect(() => {
    const isDisabled =
      isLoading ||
      !selectedCampaign ||
      !Object.keys(selectedCampaign).length ||
      selectedCampaign.status?.toLowerCase() ===
        WalmartCampaignStatusEnum.COMPLETED.toLowerCase() ||
      selectedCampaign.status?.toLowerCase() ===
        WalmartCampaignStatusEnum.DISABLED.toLowerCase();

    setIsEditDisabled(isDisabled);
  }, [
    isLoading,
    selectedMarketplace,
    advHeaderFilters.adType.value,
    selectedCampaign,
  ]);

  const isReactivateLoading = useMemo(() => {
    return (
      (isWalmartSPCampaignPending === true &&
        isWalmartSPCampaignIdle === false) ||
      (isWalmartSBCampaignPending === true &&
        isWalmartSBCampaignIdle === false) ||
      (isWalmartSVCampaignPending === true && isWalmartSVCampaignIdle === false)
    );
  }, [
    isWalmartSPCampaignPending,
    isWalmartSPCampaignIdle,
    isWalmartSBCampaignPending,
    isWalmartSBCampaignIdle,
    isWalmartSVCampaignPending,
    isWalmartSVCampaignIdle,
  ]);

  return (
    <div className={`${styles.entityContainer} ${styles.child}`}>
      {isLoading ? (
        <SkeletonComponent
          animation="wave"
          variant="rounded"
          width={900}
          height={40}
        />
      ) : (
        <div className={styles.containerDetails}>
          <div className={styles.containerItem}>
            <div
              className={
                selectedMarketplace === MarketplaceEnum.AMAZON
                  ? styles.CampaignBox
                  : ''
              }
            >
              {_selectedLevel === 'campaign-level' ? (
                <h5>Campaign Name</h5>
              ) : (
                <h5>Ad Group Name</h5>
              )}
              <div className={styles.InnerItem}>
                <div>
                  {_selectedLevel === 'campaign-level' ? (
                    <h4 className={styles.title}>{campaignName}</h4>
                  ) : (
                    <h4 className={styles.title}>{adGroupName}</h4>
                  )}
                </div>
                {_selectedLevel === 'campaign-level' && info ? (
                  <div className={styles.InnerItemInfo}>
                    {typeOfAd !== '' && (
                      <div className={styles.InfoContainer}>{typeOfAd}</div>
                    )}
                    <div className={styles.InfoContainer}>
                      {convertToUpperCase(info)}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <span className={styles.vl}></span>
          <div className={styles.containerItem}>
            <div className={styles.IndividualItem}>
              <h5>Status</h5>
              <div className={styles.InnerItem}>
                {status !== '' && (
                  <StatusBox
                    status={status as string}
                    selectedLevel={_selectedLevel}
                  />
                )}
              </div>
            </div>
          </div>

          {_selectedLevel === 'campaign-level' ? (
            <div className={styles.CampaignContainer}>
              {selectedMarketplace === MarketplaceEnum.AMAZON && (
                <div className={styles.containerItem}>
                  <div className={styles.IndividualItem}>
                    <h5>Daily Budget</h5>
                    <div className={styles.InnerItem}>
                      <h3 className={styles.TextColor}>
                        {displayValue(formatNum(budget as number), false)}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {selectedMarketplace === MarketplaceEnum.WALMART &&
                budgetType !== undefined &&
                budgetType !== WalmartBudgetTypeEnum.TOTAL && (
                  <div className={styles.containerItem}>
                    <div className={styles.IndividualItem}>
                      <h5>Daily Budget</h5>
                      <div className={styles.InnerItem}>
                        <h3 className={styles.TextColor}>
                          {displayValue(
                            formatNum(dailyBudget as number),
                            false
                          )}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

              {selectedMarketplace === MarketplaceEnum.WALMART &&
                budgetType !== undefined &&
                budgetType !== WalmartBudgetTypeEnum.DAILY && (
                  <div className={styles.containerItem}>
                    <div className={styles.IndividualItem}>
                      <h5>Total Budget</h5>
                      <div className={styles.InnerItem}>
                        <h3 className={styles.TextColor}>
                          {displayValue(
                            formatNum(totalBudget as number),
                            false
                          )}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
              {advHeaderFilters.adType.value === AdType.SPONSORED_PRODUCTS &&
                selectedMarketplace === MarketplaceEnum.AMAZON && (
                  <div className={styles.containerItem}>
                    <div className={styles.IndividualItem}>
                      <h5>Bidding Strategy</h5>
                      <div className={styles.InnerItem}>
                        {biddingStrategy ? (
                          <h3 className={styles.TextColor}>
                            {getSPBiddingStrategy(biddingStrategy as string)
                              ?.label || biddingStrategy}
                          </h3>
                        ) : (
                          <p>-</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              <div className={styles.containerItem}>
                <div className={styles.IndividualItem}>
                  <h5>Schedule</h5>
                  <div className={styles.InnerItem}>
                    <h3>{`${_startDate} - ${_endDate}`}</h3>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <React.Fragment>
              {selectedMarketplace === MarketplaceEnum.AMAZON &&
                advHeaderFilters.adType.value !== AdType.SPONSORED_BRANDS && (
                  <div className={styles.containerItem}>
                    <div className={styles.IndividualItem}>
                      <h5>Default Bid</h5>
                      <div className={styles.InnerItem}>
                        <h3 className={styles.TextColor}>
                          {displayValue(formatNum(defaultBid as number), false)}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
              <span className={styles.vl}></span>
              <div className={styles.containerItem}>
                <div className={styles.IndividualItem}>
                  <h5 style={{ marginBottom: '0.8rem' }}>Keyword Targeting</h5>

                  <h5>Bidded Value</h5>
                </div>
              </div>
              <div className={styles.containerItem}>
                <div className={styles.IndividualItem}>
                  <h5>Min. Bid</h5>

                  <div className={styles.InnerItem}>
                    <h3 className={styles.TextColor}>
                      {displayValue(formatNum(minBid as number), false)}
                    </h3>
                  </div>
                </div>
              </div>
              <div className={styles.containerItem}>
                <div className={styles.IndividualItem}>
                  <h5>Max. Bid</h5>

                  <div className={styles.InnerItem}>
                    <h3 className={styles.TextColor}>
                      {displayValue(formatNum(maxBid as number), false)}
                    </h3>
                  </div>
                </div>
              </div>
              <div className={styles.containerItem}>
                <div className={styles.IndividualItem}>
                  <h5>TRoAS</h5>

                  <div className={styles.InnerItem}>
                    <h3 className={styles.TextColor}>
                      {displayValue(formatNum(troas as number), false)}
                    </h3>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      )}

      {isEndDateReached === true ? (
        <PrimaryButton
          buttonText="Re-Activate"
          width="10rem"
          height="2.7rem"
          fontSize="1.1rem"
          buttonFunction={() => setIsReactivateCampBoxOpen(true)}
          isButtonIconRequired={true}
          buttonIcon={<ArrowsClockwiseIcon size={'1.4rem'} color="#ffffff" />}
          disabled={isEditSettingsDisabled}
          isHoverTooltipEnabled={isEditSettingsDisabled}
          tooltipText={editSettingsDisabledTooltip}
          bgColor="#f26e77"
        />
      ) : (
        <PrimaryButton
          buttonText="Edit"
          width="7rem"
          height="2.7rem"
          fontSize="1.1rem"
          buttonFunction={handleSettingsClick}
          isButtonIconRequired={true}
          buttonIcon={<SlidersIcon size={16} color="#ffffff" />}
          disabled={isEditDisabled || isEditSettingsDisabled}
          isHoverTooltipEnabled={isEditDisabled || isEditSettingsDisabled}
          tooltipText={
            isEditDisabled
              ? DISABLE_TOOLTIP.EDIT_NOT_AVAILABLE
              : isEditSettingsDisabled
              ? editSettingsDisabledTooltip
              : ''
          }
          tooltipPosition={TooltipPlacement.TopEnd}
        />
      )}

      {isSettingsModalOpen === true && (
        <AdvertisingSettingsForm
          openDialog={isSettingsModalOpen}
          handleCloseDialog={handleCloseSettingsModal}
          selectedLevel={_selectedLevel}
          selectedCampaign={selectedCampaign}
          selectedAdGroup={selectedAdGroup}
        />
      )}

      {isReactiveCampBoxOpen === true && (
        <ConfirmationBox
          title={'Reactivate this campaign?'}
          description={`Please note if you have any remaining budget, your campaign will start serving ads again when you reactivate this campaign. You'll also be able to change your budget, end date and more.`}
          openConfirmation={isReactiveCampBoxOpen}
          handleConfirmationClose={() => setIsReactivateCampBoxOpen(false)}
          isConfirmButtonRequired={true}
          confirmButtonText="Confirm"
          handleConfirmClick={handleReactivateCampaign}
          isLoading={isReactivateLoading}
        />
      )}
    </div>
  );
}
