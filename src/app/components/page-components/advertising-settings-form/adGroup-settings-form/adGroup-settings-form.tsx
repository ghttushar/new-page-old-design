import CustomizablePopup from '@/app/components/common/customizable-dialog/customizable-popup';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import CustomEditLoader from '@/app/components/shared/custom-edit-loader/custom-edit-loader';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { ISBAdGroup } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDAdGroup } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { IAdGroup } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IWalmartSVAdGroup } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import {
  IEditAccessAdGroup,
  IEditAccessAdGroupUpdateBody,
  IEditAccessWalmartAdGroup,
} from '@/interfaces/edit-access/edit-access.interface';
import { useAppSelector } from '@/redux/hooks';
import { useAppMutation } from '@/redux/react-query-hooks';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { EditAccessSBServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sb/amazon-edit-access-sb.services';
import { EditAccessSDServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sd/amazon-edit-access-sd.services';
import { EditAccessSPServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sp/amazon-edit-access-sp.service';
import { walmartEditAccessSBServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sb/walmart-edit-access-sb.service';
import { walmartEditAccessSVServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sv/walmart-edit-access-sv.service';
import { hasTargetingType } from '@/utils/validations.utils';
import { FormHelperText } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Dropdown, {
  IDropdownItem,
} from 'src/app/components/common/dropdown/dropdown';
import { statusOptions } from 'src/constants/advertising-filter.constants';
import { AdType, CampaignStateEnum } from 'src/enums/advertising.enums';
import { WalmartCampaignStatusEnum } from 'src/enums/walmart.enums';
import { IWalmartAdGroup } from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import {
  selectBidLimitErr,
  selectNameErr,
  setBidLimitErr,
  setNameErr,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { walmartEditAccessSPServices } from 'src/services/edit-access/walmart-edit-access/walmart-edit-access-sp/walmart-edit-access-sp.service';
import {
  getCurrencySymbolByCountry,
  getTitleCaseString,
  getUrlWithQuery,
  getValidNumber,
} from 'src/utils';
import {
  checkBidValueMaxLimit,
  checkBidValueMinLimit,
  checkDataDifferenceInAdGroupData,
  checkIsEqual,
  checkIsObjectEmpty,
  checkNameError,
  checkReviewCampaignFlagEnabled,
  convertToTitleCase,
  getAdGroupUrl,
  getAdTypePath,
  getMarketplacePath,
  getStatusBoxStatusByLevel,
  getWalmartStatus,
  hasCostTypeProp,
  hasCreativeTypeProp,
  hasDefaultBidProp,
} from 'src/utils/advertising.utils';
import AltPrimaryButton from '../../../common/alt-primary-button/alt-primary-button';
import InfoIcon from '../../../common/info-icon/info-icon';
import { formHelperTextStyles } from '../../edit-access-components/edit-access-bidder/edit-access-bidder-styles';
import { SettingsTitle } from '../advertising-settings-form';
import {
  SettingsDialog,
  inputLabelStyles,
  staticValueStyles,
  textFieldStyles,
} from '../advertising-settings-form-styles';
import styles from '../advertising-settings-form.module.scss';

interface IAdGroupSettingsFormProps {
  openDialog: boolean;
  handleCloseDialog: () => void;
  selectedAdGroup:
    | IWalmartAdGroup
    | IWalmartSVAdGroup
    | IAdGroup
    | ISBAdGroup
    | ISDAdGroup;
  isEditDisabledByReviewStatus: boolean;
}

export default function AdGroupSettingsForm({
  openDialog,
  handleCloseDialog,
  selectedAdGroup,
  isEditDisabledByReviewStatus,
}: IAdGroupSettingsFormProps) {
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const nameErrMsg = useAppSelector(selectNameErr);
  const bidLimitErr = useAppSelector(selectBidLimitErr);

  const marketplace = useMemo(
    () => advertisingAccount.marketplace,
    [advertisingAccount]
  );

  const initialStatus = statusOptions.filter(
    (status) =>
      status.value.toLowerCase() ===
      getStatusBoxStatusByLevel(
        selectedAdGroup.status,
        'adgroup-level',
        marketplace ?? ''
      ).toLowerCase()
  )[0];

  const initialDefaultBid = (() => {
    if (selectedAdGroup && hasDefaultBidProp(selectedAdGroup)) {
      return selectedAdGroup.defaultBid;
    }

    return 0;
  })();

  const costType = useMemo(
    () =>
      selectedAdGroup && hasCostTypeProp(selectedAdGroup)
        ? selectedAdGroup.costType
        : undefined,
    [selectedAdGroup]
  );

  const creativeType = useMemo(
    () =>
      selectedAdGroup && hasCreativeTypeProp(selectedAdGroup)
        ? selectedAdGroup.creativeType
        : undefined,
    [selectedAdGroup]
  );

  const [adGroupName, setAdGroupName] = useState<string>(
    selectedAdGroup.adGroupName
  );
  const [status, setStatus] = useState<IDropdownItem<string>>(initialStatus);
  const [defaultBid, setDefaultBid] = useState<number>(initialDefaultBid);
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  const [isReviewRequired, setIsReviewRequired] = useState<boolean>(false);
  const [walmartUpdatedAdGroup, setWalmartUpdatedAdGroup] =
    useState<IEditAccessWalmartAdGroup | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isReviewFlagEnabled = useMemo(
    () =>
      checkReviewCampaignFlagEnabled(
        advHeaderFilters.adType.value,
        marketplace as string
      ),
    [advHeaderFilters.adType.value, marketplace]
  );

  const handleReviewPopupOpen = () => setIsReviewRequired(true);
  const handleReviewPopupClose = () => setIsReviewRequired(false);

  const handleAdGroupNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAdGroupName(event.target.value);

    const nameErr = checkNameError(marketplace, 'adGroup', event.target.value);

    if (nameErr) {
      dispatch(
        setNameErr({
          id: selectedAdGroup.adGroupId,
          message: nameErr,
        })
      );
    } else {
      dispatch(
        setNameErr({
          id: '',
          message: '',
        })
      );
    }
  };

  const handleSettingsModalClose = (isLoading: boolean) => {
    if (isLoading === false) handleCloseDialog();
    return;
  };

  const handleStatusChange = (value: IDropdownItem<string>) => {
    setStatus(value);
  };

  const handleDefaultBidChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.valueAsNumber;
    setDefaultBid(getValidNumber(value) ?? value);

    const minLimitErrMsg = checkBidValueMinLimit(
      marketplace,
      advHeaderFilters.adType.value,
      hasTargetingType(selectedAdGroup) ? selectedAdGroup.targetingType : '',
      value,
      costType,
      creativeType
    );

    const maxLimitErrMsg = checkBidValueMaxLimit(
      marketplace,
      advHeaderFilters.adType.value,
      hasTargetingType(selectedAdGroup) ? selectedAdGroup.targetingType : '',
      value,
      costType,
      creativeType
    );

    if (minLimitErrMsg) {
      dispatch(
        setBidLimitErr({
          id: selectedAdGroup.adGroupId,
          message: minLimitErrMsg,
        })
      );
    } else if (maxLimitErrMsg) {
      dispatch(
        setBidLimitErr({
          id: selectedAdGroup.adGroupId,
          message: maxLimitErrMsg,
        })
      );
    } else if (isNaN(value)) {
      dispatch(
        setBidLimitErr({
          id: selectedAdGroup.adGroupId,
          message: 'Bid cannot be empty.',
        })
      );
    } else {
      dispatch(
        setBidLimitErr({
          id: selectedAdGroup.adGroupId,
          message: '',
        })
      );
    }

    if (value >= 2) {
      dispatch(
        setBidLimitErr({
          id: 'defaultBid',
          message: 'Bid is unusually high. Verify to avoid overspending.',
        })
      );
    } else {
      dispatch(
        setBidLimitErr({
          id: 'defaultBid',
          message: '',
        })
      );
    }
  };

  useEffect(() => {
    if (marketplace && marketplace === MarketplaceEnum.WALMART) {
      const updatedAdGroup: IEditAccessWalmartAdGroup = {
        id: `${selectedAdGroup.adGroupId}`,
        adGroupId: `${selectedAdGroup.adGroupId}`,
        entityName: adGroupName.trim(),
        status: getWalmartStatus(
          status.value.toUpperCase() as CampaignStateEnum
        ),
        name: adGroupName.trim(),
      };
      const selectedAdGroupData: IEditAccessWalmartAdGroup = {
        id: `${selectedAdGroup.adGroupId}`,
        adGroupId: `${selectedAdGroup.adGroupId}`,
        entityName: selectedAdGroup.adGroupName.trim(),
        status: getWalmartStatus(initialStatus.value as CampaignStateEnum),
        name: selectedAdGroup.adGroupName.trim(),
      };

      if (
        checkDataDifferenceInAdGroupData(selectedAdGroupData, updatedAdGroup)
      ) {
        setIsSaveDisabled(false);
      } else {
        setIsSaveDisabled(true);
      }
    }

    if (marketplace && marketplace === MarketplaceEnum.AMAZON) {
      const updatedAdGroup: IEditAccessAdGroup = {
        id: `${selectedAdGroup.adGroupId}`,
        campaignId: `${selectedAdGroup.campaignId}`,
        adGroupId: `${selectedAdGroup.adGroupId}`,
        entityName: adGroupName.trim(),
        state: status.value,
        name: adGroupName.trim(),
      };

      if (advHeaderFilters.adType.value !== AdType.SPONSORED_BRANDS) {
        updatedAdGroup.defaultBid = defaultBid;
      }

      const selectedAdGroupData: IEditAccessAdGroup = {
        id: `${selectedAdGroup.adGroupId}`,
        campaignId: `${selectedAdGroup.campaignId}`,
        adGroupId: `${selectedAdGroup.adGroupId}`,
        entityName: selectedAdGroup.adGroupName.trim(),
        state: initialStatus.value,
        name: selectedAdGroup.adGroupName.trim(),
      };

      if (advHeaderFilters.adType.value !== AdType.SPONSORED_BRANDS) {
        selectedAdGroupData.defaultBid = initialDefaultBid;
      }

      if (
        checkDataDifferenceInAdGroupData(selectedAdGroupData, updatedAdGroup)
      ) {
        setIsSaveDisabled(false);
      } else {
        setIsSaveDisabled(true);
      }
    }
  }, [
    selectedAdGroup,
    adGroupName,
    status.value,
    defaultBid,
    initialDefaultBid,
    initialStatus,
    marketplace,
    advHeaderFilters.adType.value,
  ]);

  const {
    mutateAsync: editAccessMutateAmazonSPAdGroup,
    isPending: isAmazonSPAdGroupPending,
    isIdle: isAmazonSPAdGroupIdle,
  } = useAppMutation({
    mutationFn: (body: IEditAccessAdGroupUpdateBody) =>
      EditAccessSPServices.updateSPAdGroup(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SP_ADGROUP_LVL_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
          })
        );

        navigate(
          getUrlWithQuery(
            getAdGroupUrl(
              selectedAdGroup.campaignId,
              selectedAdGroup.adGroupId,
              getAdTypePath(AdType.SPONSORED_PRODUCTS),
              getMarketplacePath(MarketplaceEnum.AMAZON)
            )
          )
        );
      },
    },
  });

  const {
    mutateAsync: editAccessMutateAmazonSBAdGroup,
    isPending: isAmazonSBAdGroupPending,
    isIdle: isAmazonSBAdGroupIdle,
  } = useAppMutation({
    mutationFn: (body: IEditAccessAdGroupUpdateBody) =>
      EditAccessSBServices.updateSBAdGroup(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SB_ADGROUP_LVL_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
          })
        );

        navigate(
          getUrlWithQuery(
            getAdGroupUrl(
              selectedAdGroup.campaignId,
              selectedAdGroup.adGroupId,
              getAdTypePath(AdType.SPONSORED_BRANDS),
              getMarketplacePath(MarketplaceEnum.AMAZON)
            )
          )
        );
      },
    },
  });

  const {
    mutateAsync: editAccessMutateAmazonSDAdGroup,
    isPending: isAmazonSDAdGroupPending,
    isIdle: isAmazonSDAdGroupIdle,
  } = useAppMutation({
    mutationFn: (body: IEditAccessAdGroupUpdateBody) =>
      EditAccessSDServices.updateSDAdGroup(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SD_ADGROUP_LVL_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
          })
        );

        navigate(
          getUrlWithQuery(
            getAdGroupUrl(
              selectedAdGroup.campaignId,
              selectedAdGroup.adGroupId,
              getAdTypePath(AdType.SPONSORED_DISPLAY),
              getMarketplacePath(MarketplaceEnum.AMAZON)
            )
          )
        );
      },
    },
  });

  const handleSaveAmazonAdGroupChanges = async () => {
    const updatedAdGroup: IEditAccessAdGroup = {
      id: `${selectedAdGroup.adGroupId}`,
      campaignId: `${selectedAdGroup.campaignId}`,
      adGroupId: `${selectedAdGroup.adGroupId}`,
      entityName: selectedAdGroup.adGroupName.trim(),
    };

    if (!checkIsEqual(selectedAdGroup.adGroupName.trim(), adGroupName.trim())) {
      updatedAdGroup.name = adGroupName.trim();
    }

    if (!checkIsEqual(initialStatus.value, status.value)) {
      updatedAdGroup.state = status.value;
    }

    if (
      advHeaderFilters.adType.value !== AdType.SPONSORED_BRANDS &&
      !checkIsEqual(initialDefaultBid, defaultBid)
    ) {
      updatedAdGroup.defaultBid = defaultBid;
    }

    const body: IEditAccessAdGroupUpdateBody = {
      adGroups: [updatedAdGroup],
    };

    if (advHeaderFilters.adType.value === AdType.SPONSORED_PRODUCTS) {
      await editAccessMutateAmazonSPAdGroup(body);
      handleCloseDialog();
      return;
    }

    if (advHeaderFilters.adType.value === AdType.SPONSORED_BRANDS) {
      await editAccessMutateAmazonSBAdGroup(body);
      handleCloseDialog();
      return;
    }

    if (advHeaderFilters.adType.value === AdType.SPONSORED_DISPLAY) {
      await editAccessMutateAmazonSDAdGroup(body);
      handleCloseDialog();
      return;
    }
  };

  const {
    mutateAsync: editAccessMutateWalmartSPAdGroup,
    isPending: isWalmartSPAdGroupPending,
    isIdle: isWalmartSPAdGroupIdle,
  } = useAppMutation({
    mutationFn: (body: IEditAccessWalmartAdGroup[]) =>
      walmartEditAccessSPServices.updateWalmartSPAdGroup(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SP_ADGROUP_LVL_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
          })
        );

        navigate(
          getUrlWithQuery(
            getAdGroupUrl(
              selectedAdGroup.campaignId,
              selectedAdGroup.adGroupId,
              getAdTypePath(AdType.SPONSORED_PRODUCTS),
              getMarketplacePath(MarketplaceEnum.WALMART)
            )
          )
        );
      },
    },
  });

  const {
    mutateAsync: editAccessMutateWalmartSBAdGroup,
    isPending: isWalmartSBAdGroupPending,
    isIdle: isWalmartSBAdGroupIdle,
  } = useAppMutation({
    mutationFn: ({
      body,
      isReview,
    }: {
      body: IEditAccessWalmartAdGroup[];
      isReview: boolean;
    }) => walmartEditAccessSBServices.updateWalmartSBAdGroup(body),
    options: {
      onSuccess: (data, variables) => {
        if (variables.isReview === true) {
          queryClient.invalidateQueries({
            queryKey: [QueryKeyEnums.WMT_SB_CAMPAIGN_LVL_FETCH],
          });
        }

        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SB_ADGROUP_LVL_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
          })
        );

        navigate(
          getUrlWithQuery(
            getAdGroupUrl(
              selectedAdGroup.campaignId,
              selectedAdGroup.adGroupId,
              getAdTypePath(AdType.SPONSORED_BRANDS),
              getMarketplacePath(MarketplaceEnum.WALMART)
            )
          )
        );
      },
    },
  });

  const {
    mutateAsync: editAccessMutateWalmartSVAdGroup,
    isPending: isWalmartSVAdGroupPending,
    isIdle: isWalmartSVAdGroupIdle,
  } = useAppMutation({
    mutationFn: ({
      body,
      isReview,
    }: {
      body: IEditAccessWalmartAdGroup[];
      isReview: boolean;
    }) => walmartEditAccessSVServices.updateWalmartSVAdGroup(body),
    options: {
      onSuccess: (data, variables) => {
        if (variables.isReview) {
          queryClient.invalidateQueries({
            queryKey: [QueryKeyEnums.WMT_SV_CAMPAIGN_LVL_FETCH],
          });
        }

        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SV_ADGROUP_LVL_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
          })
        );

        navigate(
          getUrlWithQuery(
            getAdGroupUrl(
              selectedAdGroup.campaignId,
              selectedAdGroup.adGroupId,
              getAdTypePath(AdType.SPONSORED_VIDEO),
              getMarketplacePath(MarketplaceEnum.WALMART)
            )
          )
        );
      },
    },
  });

  const handleReviewPopupConfirmClick = async (
    updatedAdGroup: IEditAccessWalmartAdGroup | null,
    isReview: boolean
  ) => {
    if (updatedAdGroup) {
      if (advHeaderFilters.adType.value === AdType.SPONSORED_BRANDS) {
        await editAccessMutateWalmartSBAdGroup({
          body: [updatedAdGroup],
          isReview,
        });
      }

      if (advHeaderFilters.adType.value === AdType.SPONSORED_VIDEO) {
        await editAccessMutateWalmartSVAdGroup({
          body: [updatedAdGroup],
          isReview,
        });
      }
    }

    handleCloseDialog();
    handleReviewPopupClose();
  };

  const handleWalmartReviewTriggeringCalls = async (
    updatedAdGroup: IEditAccessWalmartAdGroup
  ) => {
    if (updatedAdGroup) {
      if (
        updatedAdGroup.status !== undefined &&
        checkIsEqual(
          updatedAdGroup.status,
          CampaignStateEnum.ENABLED.toLowerCase()
        )
      ) {
        handleReviewPopupOpen();
      } else {
        await handleReviewPopupConfirmClick(updatedAdGroup, false);
      }
    }
  };

  const handleSaveWalmartAdGroupChanges = async () => {
    const body: IEditAccessWalmartAdGroup = {
      id: `${selectedAdGroup.adGroupId}`,
      adGroupId: `${selectedAdGroup.adGroupId}`,
      entityName: selectedAdGroup.adGroupName.trim(),
    };

    if (!checkIsEqual(selectedAdGroup.adGroupName.trim(), adGroupName.trim())) {
      body.name = adGroupName.trim();
    }

    if (
      !checkIsEqual(
        getWalmartStatus(
          initialStatus.value.toUpperCase() as CampaignStateEnum
        ),
        getWalmartStatus(status.value.toUpperCase() as CampaignStateEnum)
      )
    ) {
      body.status = convertToTitleCase(
        getWalmartStatus(status.value.toUpperCase() as CampaignStateEnum)
      );
    }

    setWalmartUpdatedAdGroup(body);

    if (advHeaderFilters.adType.value === AdType.SPONSORED_PRODUCTS) {
      await editAccessMutateWalmartSPAdGroup([body]);

      handleCloseDialog();
    } else {
      await handleWalmartReviewTriggeringCalls(body);
    }
  };

  const getPopupContentText = useMemo(() => {
    if (marketplace === MarketplaceEnum.WALMART) {
      if (advHeaderFilters.adType.value === AdType.SPONSORED_BRANDS) {
        return `<strong>Please note:</strong> Resuming an SB ad group will trigger a review process by Walmart's team. This process may take 24-48 hours during which the campaign will stop serving ads.`;
      }

      if (advHeaderFilters.adType.value === AdType.SPONSORED_VIDEO) {
        return `<strong>Please note:</strong> Resuming an SV ad group will trigger a review process by Walmart's team. This process may take 24-48 hours during which the campaign will stop serving ads.`;
      }

      return '';
    }

    return '';
  }, [advHeaderFilters.adType.value, marketplace]);

  const amazonStatusOptions = statusOptions.filter(
    (status) => status.marketplace === MarketplaceEnum.AMAZON
  );
  const walmartStatusOptions = statusOptions
    .filter(
      (option) =>
        (option.value === WalmartCampaignStatusEnum.ENABLED ||
          option.value === WalmartCampaignStatusEnum.PAUSED) &&
        option.marketplace === MarketplaceEnum.WALMART
    )
    .map((option) => {
      if (
        option.value === WalmartCampaignStatusEnum.ENABLED &&
        isReviewFlagEnabled === false
      ) {
        if (
          getWalmartStatus(initialStatus.value as CampaignStateEnum) !==
          WalmartCampaignStatusEnum.ENABLED.toLowerCase()
        ) {
          return {
            ...option,
            isDisabled: true,
          };
        }

        return option;
      }

      return option;
    });

  const isSaveButtonDisabled = useMemo(() => {
    return (
      isSaveDisabled ||
      (!checkIsObjectEmpty(bidLimitErr) &&
        bidLimitErr !== undefined &&
        bidLimitErr.hasOwnProperty(selectedAdGroup.adGroupId)) ||
      !checkIsObjectEmpty(nameErrMsg)
    );
  }, [bidLimitErr, isSaveDisabled, nameErrMsg, selectedAdGroup.adGroupId]);

  const isLoading = useMemo(() => {
    return (
      (isAmazonSPAdGroupPending === true && isAmazonSPAdGroupIdle === false) ||
      (isAmazonSBAdGroupPending === true && isAmazonSBAdGroupIdle === false) ||
      (isAmazonSDAdGroupPending === true && isAmazonSDAdGroupIdle === false) ||
      (isWalmartSPAdGroupPending === true &&
        isWalmartSPAdGroupIdle === false) ||
      (isWalmartSBAdGroupPending === true &&
        isWalmartSBAdGroupIdle === false) ||
      (isWalmartSVAdGroupPending === true && isWalmartSVAdGroupIdle === false)
    );
  }, [
    isAmazonSPAdGroupPending,
    isAmazonSPAdGroupIdle,
    isAmazonSBAdGroupPending,
    isAmazonSBAdGroupIdle,
    isAmazonSDAdGroupPending,
    isAmazonSDAdGroupIdle,
    isWalmartSPAdGroupPending,
    isWalmartSPAdGroupIdle,
    isWalmartSBAdGroupPending,
    isWalmartSBAdGroupIdle,
    isWalmartSVAdGroupPending,
    isWalmartSVAdGroupIdle,
  ]);

  return (
    <SettingsDialog
      onClose={() => handleSettingsModalClose(isLoading)}
      aria-labelledby="settings"
      aria-describedby="settings-description"
      open={openDialog}
      className={styles.settingsContainer}
    >
      {isLoading === true && <CustomEditLoader />}

      <SettingsTitle id="settings">
        <Typography
          fontSize="2.3rem"
          fontWeight={700}
          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        >
          Ad Group Settings
        </Typography>

        <div className={styles.titleButtonContainer}>
          <AltPrimaryButton
            buttonText="Cancel"
            height="3rem"
            buttonFunction={handleCloseDialog}
            isButtonIconRequired={false}
            disabled={false}
          />

          <PrimaryButton
            buttonText={'Save'}
            buttonFunction={
              marketplace === MarketplaceEnum.AMAZON
                ? handleSaveAmazonAdGroupChanges
                : handleSaveWalmartAdGroupChanges
            }
            disabled={isSaveButtonDisabled}
            height="3rem"
          />
        </div>
      </SettingsTitle>

      <Divider />

      <DialogContent
        id="settings-description"
        className={styles.descriptionContainer}
      >
        <div className={styles.componentContainer}>
          <InputLabel htmlFor="adGroupName" sx={inputLabelStyles}>
            AdGroup Name <InfoIcon title="AdGroup Name" />
          </InputLabel>
          <TextField
            value={adGroupName}
            id="adGroupName"
            variant="outlined"
            type="text"
            placeholder="Enter AdGroup Name"
            sx={textFieldStyles}
            onChange={handleAdGroupNameChange}
            error={
              nameErrMsg !== undefined &&
              nameErrMsg.hasOwnProperty(selectedAdGroup.adGroupId)
            }
            helperText={
              nameErrMsg !== undefined &&
              nameErrMsg[selectedAdGroup.adGroupId] && (
                <FormHelperText
                  sx={{
                    ...formHelperTextStyles,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                >
                  {nameErrMsg[selectedAdGroup.adGroupId]?.message ?? ''}
                </FormHelperText>
              )
            }
            disabled={isEditDisabledByReviewStatus}
          />
        </div>

        <div className={styles.componentContainer}>
          <InputLabel htmlFor="campaignId" sx={inputLabelStyles}>
            AdGroup ID <InfoIcon title="Campaign ID" />
          </InputLabel>
          <Typography id="campaignId" sx={staticValueStyles}>
            {selectedAdGroup.adGroupId}
          </Typography>
        </div>

        <div>
          <InputLabel htmlFor="status" sx={inputLabelStyles}>
            Status <InfoIcon title="Status" />
          </InputLabel>
          <Dropdown
            disabled={isEditDisabledByReviewStatus}
            options={
              marketplace === MarketplaceEnum.AMAZON
                ? amazonStatusOptions
                : walmartStatusOptions
            }
            selected={status}
            label=""
            onSelect={handleStatusChange}
            width="100%"
            fontColor={
              status.value.toUpperCase() === CampaignStateEnum.ENABLED ||
              getTitleCaseString(status.value) ===
                WalmartCampaignStatusEnum.LIVE
                ? '#ffffff'
                : status.value.toUpperCase() === CampaignStateEnum.PAUSED ||
                  getTitleCaseString(status.value) ===
                    WalmartCampaignStatusEnum.SCHEDULED ||
                  getTitleCaseString(status.value) ===
                    WalmartCampaignStatusEnum.RESCHEDULED ||
                  getTitleCaseString(status.value) ===
                    WalmartCampaignStatusEnum.PROPOSAL
                ? '#ffffff'
                : '#7D7D7D'
            }
            background={
              status.value.toUpperCase() === CampaignStateEnum.ENABLED ||
              getTitleCaseString(status.value) ===
                WalmartCampaignStatusEnum.LIVE
                ? '#77469B'
                : status.value.toUpperCase() === CampaignStateEnum.PAUSED ||
                  getTitleCaseString(status.value) ===
                    WalmartCampaignStatusEnum.SCHEDULED ||
                  getTitleCaseString(status.value) ===
                    WalmartCampaignStatusEnum.RESCHEDULED ||
                  getTitleCaseString(status.value) ===
                    WalmartCampaignStatusEnum.PROPOSAL
                ? 'rgb(242, 110, 119)'
                : '#F3F3F3'
            }
          />
        </div>

        {marketplace === MarketplaceEnum.AMAZON &&
          advHeaderFilters.adType.value !== AdType.SPONSORED_BRANDS && (
            <div className={styles.componentContainer}>
              <InputLabel htmlFor="defaultBid" sx={inputLabelStyles}>
                Default Bid <InfoIcon title="Default Bid" />
              </InputLabel>
              <TextField
                value={defaultBid}
                type="number"
                id="defaultBid"
                variant="outlined"
                placeholder="Enter Default Bid"
                sx={textFieldStyles}
                onChange={handleDefaultBidChange}
                InputProps={{
                  inputProps: {
                    min: 0,
                    inputMode: 'decimal',
                  },
                  startAdornment: getCurrencySymbolByCountry(),
                }}
                error={
                  bidLimitErr !== undefined &&
                  bidLimitErr.hasOwnProperty(selectedAdGroup.adGroupId)
                }
                helperText={
                  bidLimitErr !== undefined ? (
                    bidLimitErr[selectedAdGroup.adGroupId] ? (
                      <FormHelperText
                        sx={{
                          ...formHelperTextStyles,
                          fontSize: '0.9rem',
                          fontWeight: 500,
                        }}
                      >
                        {bidLimitErr[selectedAdGroup.adGroupId]?.message ?? ''}
                      </FormHelperText>
                    ) : bidLimitErr['defaultBid'] ? (
                      <FormHelperText
                        sx={{
                          ...formHelperTextStyles,
                          color: 'orange',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                        }}
                      >
                        {bidLimitErr['defaultBid'].message ?? ''}
                      </FormHelperText>
                    ) : (
                      ''
                    )
                  ) : (
                    ''
                  )
                }
              />
            </div>
          )}
      </DialogContent>

      {isReviewRequired === true && getPopupContentText !== '' && (
        <CustomizablePopup
          openModal={isReviewRequired}
          handleClose={handleReviewPopupClose}
          handleConfirmationAction={() =>
            handleReviewPopupConfirmClick(walmartUpdatedAdGroup, true)
          }
          description={[
            {
              content: getPopupContentText,
              isHeading: false,
            },
            {
              content: `Do you want to continue?`,
              isHeading: false,
            },
          ]}
          wantBodyDivider={false}
          wantGutters={true}
          maxWidth="xs"
          isLoading={isLoading}
        />
      )}
    </SettingsDialog>
  );
}
