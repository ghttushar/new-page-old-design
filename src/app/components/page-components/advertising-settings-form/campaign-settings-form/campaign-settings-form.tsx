import CustomizablePopup from '@/app/components/common/customizable-dialog/customizable-popup';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import CustomEditLoader from '@/app/components/shared/custom-edit-loader/custom-edit-loader';
import { WALMART_REVIEW_STATUS_SETTINGS_VIEW_MAPPINGS } from '@/constants/advertising-review.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { ISBCampaign } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDCampaign } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { ICampaign } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  ICampaignPageType,
  ICampaignPlatform,
} from '@/interfaces/advertising/walmart/walmart-advertising.interface';
import { IWalmartReviewStatusSettingsView } from '@/interfaces/advertising/walmart/walmart-review.interface';
import { IWalmartSVCampaign } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import {
  IEditAccessCampaign,
  IEditAccessCampaignUpdateBody,
  IEditAccessWalmartCampaign,
  IEditAccessWalmartPageType,
  IEditAccessWalmartPlatform,
} from '@/interfaces/edit-access/edit-access.interface';
import { useAppMutation } from '@/redux/react-query-hooks';
import { EditAccessSBServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sb/amazon-edit-access-sb.services';
import { EditAccessSDServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sd/amazon-edit-access-sd.services';
import { EditAccessSPServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sp/amazon-edit-access-sp.service';
import { walmartEditAccessSBServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sb/walmart-edit-access-sb.service';
import { walmartEditAccessSPServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sp/walmart-edit-access-sp.service';
import { walmartEditAccessSVServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sv/walmart-edit-access-sv.service';
import { hasTargetingType } from '@/utils/validations.utils';
import { FormHelperText } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Dropdown, {
  IDropdownItem,
} from 'src/app/components/common/dropdown/dropdown';
import {
  AMAZON_PLACEMENT_PERCENT_MAX_LIMIT,
  biddingStrategyFormOptions,
  statusOptions,
} from 'src/constants/advertising-filter.constants';
import {
  WALMART_CAMPAIGN_OPTIONS_MAP,
  WALMART_INDEFINITE_END_DATE,
} from 'src/constants/advertising-walmart.constants';
import {
  AdType,
  AdTypeShort,
  CampaignStateEnum,
  PlacementBids,
} from 'src/enums/advertising.enums';
import {
  TargetingTypeEnum,
  WalmartBudgetTypeEnum,
  WalmartCampaignOptionsEnums,
  WalmartCampaignStatusEnum,
} from 'src/enums/walmart.enums';
import { IWalmartCampaign } from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { useAppSelector } from 'src/redux/hooks';
import {
  IRowErrorMessage,
  selectBidLimitErr,
  selectDailyBudgetErrMessage,
  selectDailyBudgetLimitErr,
  selectNameErr,
  selectPPPercentageErrMessage,
  selectROSPercentageErrMessage,
  selectTOSPercentageErrMessage,
  selectTotalBudgetErrMessage,
  selectTotalBudgetLimitErr,
  setDailyBudgetErrMessage,
  setDailyBudgetLimitErr,
  setNameErr,
  setPPPercentageErrMessage,
  setROSPercentageErrMessage,
  setTOSPercentageErrMessage,
  setTotalBudgetErrMessage,
  setTotalBudgetLimitErr,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { selectAdvertisingHeaderFilters } from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';
import {
  getCurrencySymbolByCountry,
  getCurrentDateTime,
  getTitleCaseString,
  getUrlWithQuery,
  getValidNumber,
  getWholeNumber,
  parseNum,
} from 'src/utils';
import {
  checkAmazonBudgetLimit,
  checkDataDifferenceInCampaignData,
  checkDataDifferenceInPageTypeData,
  checkDataDifferenceInPlatformData,
  checkIsEditDisableByReviewStatus,
  checkIsEqual,
  checkIsObjectEmpty,
  checkNameError,
  checkReviewCampaignFlagEnabled,
  checkWalmartDailyBudgetLimit,
  checkWalmartTotalBudgetLimit,
  convertToUpperCase,
  getAdTypePath,
  getCampaignUrl,
  getMarketplacePath,
  getValidWalmartStatus,
  hasAmazonSPBudgetProp,
  hasBudgetProp,
  hasBudgetTypeProp,
  hasCampaignOptionsProp,
  hasDailyBudgetProp,
  hasDynamicBiddingProp,
  hasPageTypeProp,
  hasPlatformProp,
  hasReviewDecisionStatusProp,
  hasReviewIdProp,
  hasReviewProcessStatusProp,
  hasTotalProp,
} from 'src/utils/advertising.utils';
import { getDateFromTimestamp } from 'src/utils/datetime.utils';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import AltPrimaryButton from '../../../common/alt-primary-button/alt-primary-button';
import InfoIcon from '../../../common/info-icon/info-icon';
import SingleDatePicker from '../../../common/single-date-picker/single-date-picker';
import { PageTypeBidMultiplierSettings } from '../../bid-multiplier-settings/page-type-bid-multiplier-settings';
import { PlatformBidMultiplierSettings } from '../../bid-multiplier-settings/platform-bid-multiplier-settings';
import { formHelperTextStyles } from '../../edit-access-components/edit-access-bidder/edit-access-bidder-styles';
import { SettingsTitle } from '../advertising-settings-form';
import {
  inputLabelStyles,
  radioButtonStyle,
  SettingsDialog,
  staticValueStyles,
  textFieldStyles,
} from '../advertising-settings-form-styles';
import styles from '../advertising-settings-form.module.scss';

interface ICampaignSettingsFormProps {
  openDialog: boolean;
  handleCloseDialog: () => void;
  selectedCampaign:
    | IWalmartCampaign
    | ICampaign
    | ISBCampaign
    | ISDCampaign
    | IWalmartSVCampaign;
  isEditDisabledByReviewStatus: boolean;
}

export default function CampaignSettingsForm({
  openDialog,
  handleCloseDialog,
  selectedCampaign,
  isEditDisabledByReviewStatus,
}: ICampaignSettingsFormProps) {
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const dailyBudgetWarnMsgObj = useAppSelector(selectDailyBudgetErrMessage);
  const totalBudgetWarnMsgObj = useAppSelector(selectTotalBudgetErrMessage);
  const TOSWarnMsgObj = useAppSelector(selectTOSPercentageErrMessage);
  const ROSWarnMsgObj = useAppSelector(selectROSPercentageErrMessage);
  const PPWarnMsgObj = useAppSelector(selectPPPercentageErrMessage);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const nameErrMsg = useAppSelector(selectNameErr);
  const dailyBudgetLimitErr = useAppSelector(selectDailyBudgetLimitErr);
  const totalBudgetLimitErr = useAppSelector(selectTotalBudgetLimitErr);
  const bidMultiplierLimitErr = useAppSelector(selectBidLimitErr);

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as string,
    [advertisingAccount.marketplace]
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const initialTopOfSearchBid =
    (selectedCampaign &&
      hasDynamicBiddingProp(selectedCampaign) &&
      selectedCampaign.dynamicBidding &&
      selectedCampaign.dynamicBidding.placementBidding &&
      selectedCampaign.dynamicBidding.placementBidding.filter(
        (bid) => bid.placement === PlacementBids.TOP_OF_SEARCH
      )[0]?.percentage) ||
    0;

  const initialProductPagesBid =
    (selectedCampaign &&
      hasDynamicBiddingProp(selectedCampaign) &&
      selectedCampaign.dynamicBidding &&
      selectedCampaign.dynamicBidding.placementBidding &&
      selectedCampaign.dynamicBidding.placementBidding.filter(
        (bid) => bid.placement === PlacementBids.PRODUCT_PAGES
      )[0]?.percentage) ||
    0;

  const initialRestOfSearchBid =
    (selectedCampaign &&
      hasDynamicBiddingProp(selectedCampaign) &&
      selectedCampaign.dynamicBidding &&
      selectedCampaign.dynamicBidding.placementBidding &&
      selectedCampaign.dynamicBidding.placementBidding.filter(
        (bid) => bid.placement === PlacementBids.REST_OF_SEARCH
      )[0]?.percentage) ||
    0;

  const initialStatus = statusOptions.filter((status) => {
    if (
      selectedCampaign.status.toLowerCase() ===
        WalmartCampaignStatusEnum.LIVE.toLowerCase() ||
      selectedCampaign.status.toLowerCase() ===
        WalmartCampaignStatusEnum.SCHEDULED.toLowerCase() ||
      selectedCampaign.status.toLowerCase() ===
        WalmartCampaignStatusEnum.RESCHEDULED.toLowerCase()
    ) {
      return (
        status.value === WalmartCampaignStatusEnum.ENABLED &&
        status.marketplace === selectedMarketplace
      );
    }

    return (
      status.value.toLowerCase() === selectedCampaign.status.toLowerCase() &&
      status.marketplace === selectedMarketplace
    );
  })[0];

  const initialBudget = (() => {
    if (selectedCampaign) {
      if (hasAmazonSPBudgetProp(selectedCampaign)) {
        return Number(selectedCampaign.budget.budget);
      }
      if (hasBudgetProp(selectedCampaign)) {
        return Number(selectedCampaign.budget);
      }
      if (hasDailyBudgetProp(selectedCampaign)) {
        return Number(selectedCampaign.dailyBudget);
      }
    }
    return 0;
  })();

  const initialTotalBudget = (() => {
    if (selectedCampaign && hasTotalProp(selectedCampaign)) {
      return Number(selectedCampaign.totalBudget);
    }
    return 0;
  })();

  const initialBiddingStrategy = (() => {
    if (
      selectedCampaign &&
      hasDynamicBiddingProp(selectedCampaign) &&
      selectedCampaign.dynamicBidding.strategy !== null &&
      selectedCampaign.dynamicBidding.strategy !== undefined
    ) {
      return selectedCampaign.dynamicBidding.strategy;
    }
    return '';
  })();

  const budgetType: string | undefined = (() => {
    if (selectedCampaign) {
      if (hasBudgetTypeProp(selectedCampaign)) {
        return selectedCampaign.budgetType;
      }
      if (hasAmazonSPBudgetProp(selectedCampaign)) {
        return selectedCampaign.budget.budgetType;
      }
      return undefined;
    }
    return undefined;
  })();

  const reviewId: string | null | undefined = (() => {
    if (selectedCampaign) {
      if (hasReviewIdProp(selectedCampaign)) {
        return selectedCampaign.reviewId;
      }
      return undefined;
    }
    return undefined;
  })();

  const reviewProcessStatus: string | null | undefined = (() => {
    if (selectedCampaign) {
      if (hasReviewProcessStatusProp(selectedCampaign)) {
        return selectedCampaign.reviewProcessStatus;
      }
      return undefined;
    }
    return undefined;
  })();

  const reviewDecisionStatus: string | null | undefined = (() => {
    if (selectedCampaign) {
      if (hasReviewDecisionStatusProp(selectedCampaign)) {
        return selectedCampaign.reviewDecisionStatus;
      }
      return undefined;
    }
    return undefined;
  })();
  const initialCampaignOptions: string[] | null = (() => {
    if (selectedCampaign) {
      if (hasCampaignOptionsProp(selectedCampaign)) {
        return selectedCampaign.campaignOptions;
      }

      return null;
    }

    return null;
  })();

  const initialCampaignOptionsMap: Map<string, boolean> | null = useMemo(() => {
    if (initialCampaignOptions) {
      const initialOptions = new Map(WALMART_CAMPAIGN_OPTIONS_MAP);

      for (const element of initialCampaignOptions) {
        initialOptions.set(element, true);
      }

      return initialOptions;
    }

    return null;
  }, [initialCampaignOptions]);

  const [campaignName, setCampaignName] = useState<string>(
    selectedCampaign.campaignName
  );
  const [endDate, setEndDate] = useState<string>(
    selectedCampaign.endDate
      ? getDateFromTimestamp(selectedCampaign.endDate)
      : ''
  );
  const [status, setStatus] = useState<IDropdownItem<string>>(initialStatus);
  const [budget, setBudget] = useState<number>(initialBudget);
  const [totalBudget, setTotalBudget] = useState<number>(initialTotalBudget);
  const [biddingStrategy, setBiddingStrategy] = useState<string>(
    initialBiddingStrategy
  );
  const [pageTypeBidMultiplier, setPageTypeBidMultiplier] = useState<
    ICampaignPageType[]
  >(hasPageTypeProp(selectedCampaign) ? selectedCampaign.pageTypes : []);
  const [platformBidMultiplier, setPlatformBidMultiplier] = useState<
    ICampaignPlatform[]
  >(hasPlatformProp(selectedCampaign) ? selectedCampaign.platforms : []);
  const [topOfSearchBid, setTopOfSearchBid] = useState<number>(
    initialTopOfSearchBid as number
  );
  const [productPagesBid, setProductPagesBid] = useState<number>(
    initialProductPagesBid as number
  );
  const [restOfSearchBid, setRestOfSearchBid] = useState<number>(
    initialRestOfSearchBid as number
  );
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  const [isEndDateIndefiniteChecked, setIsEndDateIndefiniteChecked] =
    useState<boolean>(
      new Date(selectedCampaign.endDate ?? '').getTime() >=
        new Date(WALMART_INDEFINITE_END_DATE).getTime()
    );
  const [isReviewRequired, setIsReviewRequired] = useState<boolean>(false);
  const [walmartUpdatedCampaign, setWalmartUpdatedCampaign] =
    useState<IEditAccessWalmartCampaign | null>(null);

  const marketplace = localStorageUtils.getAdvertisingMarketplace();
  const selectedAdvertisingAccount =
    localStorageUtils.getSelectedAdvertisingAccount();
  const [campaignOptions, setCampaignOptions] = useState<Map<
    string,
    boolean
  > | null>(initialCampaignOptionsMap);

  const amazonSelectedAccountType = useMemo(() => {
    if (
      selectedAdvertisingAccount &&
      selectedAdvertisingAccount.marketplace === MarketplaceEnum.AMAZON
    ) {
      return selectedAdvertisingAccount.accountType;
    } else {
      return undefined;
    }
  }, [selectedAdvertisingAccount]);

  const selectedCampaignAdType = useMemo(() => {
    if (advHeaderFilters.adType.value === AdType.SPONSORED_PRODUCTS)
      return AdTypeShort.SPONSORED_PRODUCTS;

    if (advHeaderFilters.adType.value === AdType.SPONSORED_BRANDS)
      return AdTypeShort.SPONSORED_BRANDS;

    if (advHeaderFilters.adType.value === AdType.SPONSORED_DISPLAY)
      return AdTypeShort.SPONSORED_DISPLAY;

    if (advHeaderFilters.adType.value === AdType.SPONSORED_VIDEO)
      return AdTypeShort.SPONSORED_VIDEO;
  }, [advHeaderFilters.adType]);

  const reviewStatus: IWalmartReviewStatusSettingsView | null = useMemo(() => {
    if (reviewId && reviewDecisionStatus !== undefined && reviewProcessStatus) {
      if (reviewDecisionStatus) {
        return WALMART_REVIEW_STATUS_SETTINGS_VIEW_MAPPINGS[
          reviewDecisionStatus
        ];
      }

      return WALMART_REVIEW_STATUS_SETTINGS_VIEW_MAPPINGS[reviewProcessStatus];
    }

    return null;
  }, [reviewId, reviewDecisionStatus, reviewProcessStatus]);

  const isReviewFlagEnabled = useMemo(
    () =>
      checkReviewCampaignFlagEnabled(
        selectedCampaignAdType,
        selectedMarketplace
      ),
    [selectedCampaignAdType, selectedMarketplace]
  );

  const isStatusEditDisabled: boolean = useMemo(() => {
    return checkIsEditDisableByReviewStatus(selectedCampaign, true);
  }, [selectedCampaign]);

  const handleReviewPopupOpen = () => setIsReviewRequired(true);
  const handleReviewPopupClose = () => setIsReviewRequired(false);

  const handleCampaignNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCampaignName(event.target.value);

    const nameErr = checkNameError(
      advertisingAccount.marketplace,
      'campaign',
      event.target.value
    );

    if (nameErr) {
      dispatch(
        setNameErr({
          id: selectedCampaign.campaignId,
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
    if (isLoading === false) {
      handleCloseDialog();
      handleReviewPopupClose();
    }
    return;
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    return;
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleChangeEndDateIndefinite = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsEndDateIndefiniteChecked(event.target.checked);
  };

  const handleCampaignOptionsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (campaignOptions) {
      const updatedOptions = new Map(campaignOptions);
      updatedOptions.set(event.target.value, !event.target.checked);
      setCampaignOptions(updatedOptions);
    } else setCampaignOptions(campaignOptions);
  };

  const handleStatusChange = (value: IDropdownItem<string>) => {
    setStatus(value);
  };

  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.valueAsNumber;
    setBudget(getValidNumber(value) ?? value);

    if (advertisingAccount.marketplace === MarketplaceEnum.AMAZON) {
      const budgetLimitErr = checkAmazonBudgetLimit(
        value,
        advHeaderFilters.adType.value,
        amazonSelectedAccountType,
        budgetType,
        MarketplaceEnum.AMAZON
      );

      if (budgetLimitErr) {
        dispatch(
          setDailyBudgetLimitErr({
            id: selectedCampaign.campaignId,
            message: budgetLimitErr,
          })
        );
      } else if (isNaN(value)) {
        dispatch(
          setDailyBudgetLimitErr({
            id: selectedCampaign.campaignId,
            message: 'Budget cannot be empty',
          })
        );
      } else {
        dispatch(
          setDailyBudgetLimitErr({
            id: selectedCampaign.campaignId,
            message: '',
          })
        );
      }

      if (value >= 10000) {
        const errMsg: IRowErrorMessage = {
          id: selectedCampaign.campaignId,
          message: 'Budget is unusually high. Verify to avoid overspending.',
        };
        dispatch(setDailyBudgetErrMessage(errMsg));
      } else {
        const errMsg: IRowErrorMessage = {
          id: selectedCampaign.campaignId,
          message: '',
        };
        dispatch(setDailyBudgetErrMessage(errMsg));
      }
    }

    if (advertisingAccount.marketplace === MarketplaceEnum.WALMART) {
      const dailyBudgetLimitErr = checkWalmartDailyBudgetLimit(
        marketplace as MarketplaceEnum,
        selectedAdvertisingAccount?.accountType,
        parseFloat(event.target.value)
      );

      if (value >= 1000) {
        dispatch(
          setDailyBudgetErrMessage({
            id: selectedCampaign.campaignId,
            message:
              'Daily Budget is unusually high. Verify to avoid overspending.',
          })
        );
      } else {
        dispatch(
          setDailyBudgetErrMessage({
            id: '',
            message: '',
          })
        );
      }

      if (dailyBudgetLimitErr) {
        dispatch(
          setDailyBudgetLimitErr({
            id: selectedCampaign.campaignId,
            message: dailyBudgetLimitErr,
          })
        );
      } else if (isNaN(value)) {
        dispatch(
          setDailyBudgetLimitErr({
            id: selectedCampaign.campaignId,
            message: 'Daily Budget cannot be empty',
          })
        );
      } else if (
        (selectedCampaign as IWalmartCampaign).totalBudget !== null &&
        (selectedCampaign as IWalmartCampaign).totalBudget !== undefined &&
        value > parseFloat(`${totalBudget}`)
      ) {
        dispatch(
          setDailyBudgetLimitErr({
            id: selectedCampaign.campaignId,
            message: 'Daily Budget should be lower than Total Budget.',
          })
        );
      } else {
        dispatch(
          setDailyBudgetLimitErr({
            id: '',
            message: '',
          })
        );
        dispatch(
          setTotalBudgetLimitErr({
            id: '',
            message: '',
          })
        );
      }
    }
  };

  const handleTotalBudgetChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.valueAsNumber;
    setTotalBudget(getValidNumber(value) ?? value);

    if (advertisingAccount.marketplace === MarketplaceEnum.WALMART) {
      const totalBudgetLimitErr = checkWalmartTotalBudgetLimit(
        marketplace as MarketplaceEnum,
        selectedAdvertisingAccount?.accountType,
        value
      );

      if (value >= 10000) {
        dispatch(
          setTotalBudgetErrMessage({
            id: selectedCampaign.campaignId,
            message:
              'Total Budget is unusually high. Verify to avoid overspending.',
          })
        );
      } else {
        dispatch(
          setTotalBudgetErrMessage({
            id: '',
            message: '',
          })
        );
      }

      if (totalBudgetLimitErr) {
        dispatch(
          setTotalBudgetLimitErr({
            id: selectedCampaign.campaignId,
            message: totalBudgetLimitErr,
          })
        );
      } else if (isNaN(value)) {
        dispatch(
          setTotalBudgetLimitErr({
            id: selectedCampaign.campaignId,
            message: 'Total Budget cannot be empty',
          })
        );
      } else if (
        (selectedCampaign as IWalmartCampaign).dailyBudget !== null &&
        (selectedCampaign as IWalmartCampaign).dailyBudget !== undefined &&
        value < parseFloat(`${budget}`)
      ) {
        dispatch(
          setTotalBudgetLimitErr({
            id: selectedCampaign.campaignId,
            message: 'Total Budget should be higher than Daily Budget.',
          })
        );
      } else {
        dispatch(
          setTotalBudgetLimitErr({
            id: '',
            message: '',
          })
        );
        dispatch(
          setDailyBudgetLimitErr({
            id: '',
            message: '',
          })
        );
      }
    }
  };

  const handleStrategyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBiddingStrategy(event.target.value);
  };

  const handleTopOfSearchBidChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = getWholeNumber(event.target.valueAsNumber);
    setTopOfSearchBid(value);

    if (value >= 100) {
      dispatch(
        setTOSPercentageErrMessage({
          id: 'TOS',
          message: 'TOS % is unusually high. Verify to avoid overspending.',
        })
      );
    } else {
      dispatch(
        setTOSPercentageErrMessage({
          id: '',
          message: '',
        })
      );
    }

    if (value >= AMAZON_PLACEMENT_PERCENT_MAX_LIMIT) {
      dispatch(
        setTOSPercentageErrMessage({
          id: selectedCampaign.campaignId,
          message: `Maximum TOS % is ${AMAZON_PLACEMENT_PERCENT_MAX_LIMIT}.`,
        })
      );
    } else if (isNaN(value)) {
      dispatch(
        setTOSPercentageErrMessage({
          id: selectedCampaign.campaignId,
          message: 'TOS % cannot be empty.',
        })
      );
    } else {
      dispatch(
        setTOSPercentageErrMessage({
          id: '',
          message: '',
        })
      );
    }
  };

  const handleProductPagesBidChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = getWholeNumber(event.target.valueAsNumber);
    setProductPagesBid(value);

    if (value >= 100) {
      dispatch(
        setPPPercentageErrMessage({
          id: 'PP',
          message: 'PP % is unusually high. Verify to avoid overspending.',
        })
      );
    } else {
      dispatch(
        setPPPercentageErrMessage({
          id: '',
          message: '',
        })
      );
    }

    if (value >= AMAZON_PLACEMENT_PERCENT_MAX_LIMIT) {
      dispatch(
        setPPPercentageErrMessage({
          id: selectedCampaign.campaignId,
          message: `Maximum PP % is ${AMAZON_PLACEMENT_PERCENT_MAX_LIMIT}.`,
        })
      );
    } else if (isNaN(value)) {
      dispatch(
        setPPPercentageErrMessage({
          id: selectedCampaign.campaignId,
          message: 'PP % cannot be empty.',
        })
      );
    } else {
      dispatch(
        setPPPercentageErrMessage({
          id: '',
          message: '',
        })
      );
    }
  };

  const handleRestOfSearchBidChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = getWholeNumber(event.target.valueAsNumber);
    setRestOfSearchBid(value);

    if (value >= 100) {
      dispatch(
        setROSPercentageErrMessage({
          id: 'ROS',
          message: 'ROS % is unusually high. Verify to avoid overspending.',
        })
      );
    } else {
      dispatch(
        setROSPercentageErrMessage({
          id: '',
          message: '',
        })
      );
    }

    if (value >= AMAZON_PLACEMENT_PERCENT_MAX_LIMIT) {
      dispatch(
        setROSPercentageErrMessage({
          id: selectedCampaign.campaignId,
          message: `Maximum ROS % is ${AMAZON_PLACEMENT_PERCENT_MAX_LIMIT}.`,
        })
      );
    } else if (isNaN(value)) {
      dispatch(
        setROSPercentageErrMessage({
          id: selectedCampaign.campaignId,
          message: 'ROS % cannot be empty.',
        })
      );
    } else {
      dispatch(
        setROSPercentageErrMessage({
          id: '',
          message: '',
        })
      );
    }
  };

  const handlePageTypeBidMultiplierChange = (
    updatedPageTypeBidMultiplier: ICampaignPageType[]
  ) => {
    setPageTypeBidMultiplier(updatedPageTypeBidMultiplier);
  };

  const handlePlatformBidMultiplierChange = (
    updatedPlatformBidMultiplier: ICampaignPlatform[]
  ) => {
    setPlatformBidMultiplier(updatedPlatformBidMultiplier);
  };

  useEffect(() => {
    if (selectedMarketplace === MarketplaceEnum.WALMART) {
      let updatedEndDate: string | null = endDate;
      if (isEndDateIndefiniteChecked) {
        updatedEndDate = WALMART_INDEFINITE_END_DATE;
      } else {
        if (endDate) {
          updatedEndDate = endDate;
        } else {
          updatedEndDate = null;
        }
      }

      let updatedCampaignOptions: string[] | null = [];
      if (campaignOptions !== null) {
        for (const [key, value] of campaignOptions) {
          if (value) updatedCampaignOptions.push(key);
        }
      } else updatedCampaignOptions = null;

      const updatedCampaign: IEditAccessWalmartCampaign = {
        id: `${selectedCampaign.campaignId}`,
        campaignId: `${selectedCampaign.campaignId}`,
        entityName: campaignName.trim(),
        name: campaignName.trim(),
        endDate: updatedEndDate,
        dailyBudget: budget,
        totalBudget: totalBudget,
        campaignOptions: updatedCampaignOptions,
      };

      if (getValidWalmartStatus(status.value) !== null)
        updatedCampaign.status = status.value.toLowerCase();

      const selectedCampaignData: IEditAccessWalmartCampaign = {
        id: `${selectedCampaign.campaignId}`,
        campaignId: `${selectedCampaign.campaignId}`,
        entityName: selectedCampaign.campaignName.trim(),
        name: selectedCampaign.campaignName.trim(),
        endDate: getDateFromTimestamp(selectedCampaign.endDate),
        dailyBudget: initialBudget,
        totalBudget: initialTotalBudget,
        campaignOptions: initialCampaignOptions,
      };

      if (getValidWalmartStatus(initialStatus.value) !== null)
        selectedCampaignData.status = getValidWalmartStatus(
          initialStatus.value
        )?.toLowerCase();

      if (
        checkDataDifferenceInCampaignData(selectedCampaignData, updatedCampaign)
      ) {
        setIsSaveDisabled(false);
      } else if (
        checkDataDifferenceInPageTypeData(
          hasPageTypeProp(selectedCampaign) ? selectedCampaign.pageTypes : [],
          pageTypeBidMultiplier
        ) &&
        (advHeaderFilters.adType.value === AdType.SPONSORED_PRODUCTS ||
          advHeaderFilters.adType.value === AdTypeShort.SPONSORED_PRODUCTS)
      ) {
        setIsSaveDisabled(false);
      } else if (
        checkDataDifferenceInPlatformData(
          hasPlatformProp(selectedCampaign) ? selectedCampaign.platforms : [],
          platformBidMultiplier
        ) &&
        (advHeaderFilters.adType.value === AdType.SPONSORED_PRODUCTS ||
          advHeaderFilters.adType.value === AdTypeShort.SPONSORED_PRODUCTS)
      ) {
        setIsSaveDisabled(false);
      } else {
        setIsSaveDisabled(true);
      }
    }

    if (selectedMarketplace === MarketplaceEnum.AMAZON) {
      const updatedCampaign: IEditAccessCampaign = {
        id: `${selectedCampaign.campaignId}`,
        campaignId: `${selectedCampaign.campaignId}`,
        entityName: campaignName.trim(),
        name: campaignName.trim(),
        endDate: endDate,
        state: status.value?.toLowerCase(),
      };

      if (hasAmazonSPBudgetProp(selectedCampaign)) {
        updatedCampaign.budget = {
          budget: budget,
        };
      } else {
        updatedCampaign.budget = budget;
      }

      if (advHeaderFilters.adType.value === AdType.SPONSORED_PRODUCTS) {
        updatedCampaign.dynamicBidding = {
          placementBidding: [
            {
              percentage: topOfSearchBid,
              placement: PlacementBids.TOP_OF_SEARCH,
            },
            {
              percentage: productPagesBid,
              placement: PlacementBids.PRODUCT_PAGES,
            },
            {
              percentage: restOfSearchBid,
              placement: PlacementBids.REST_OF_SEARCH,
            },
          ],
          strategy: biddingStrategy,
        };
      }

      if (hasAmazonSPBudgetProp(selectedCampaign)) {
        updatedCampaign.budget = {
          budget: budget,
        };
      } else {
        updatedCampaign.budget = budget;
      }

      if (hasAmazonSPBudgetProp(selectedCampaign)) {
        updatedCampaign.budget = {
          budget: budget,
        };
      }

      const selectedCampaignData: IEditAccessCampaign = {
        id: `${selectedCampaign.campaignId}`,
        campaignId: `${selectedCampaign.campaignId}`,
        entityName: selectedCampaign.campaignName.trim(),
        name: selectedCampaign.campaignName.trim(),
        endDate: selectedCampaign.endDate,
        state: initialStatus.value.toLowerCase(),
      };

      if (hasAmazonSPBudgetProp(selectedCampaign)) {
        selectedCampaignData.budget = {
          budget: initialBudget,
        };
      } else {
        selectedCampaignData.budget = initialBudget;
      }

      if (advHeaderFilters.adType.value === AdType.SPONSORED_PRODUCTS) {
        selectedCampaignData.dynamicBidding = {
          placementBidding: [
            {
              percentage: initialTopOfSearchBid,
              placement: PlacementBids.TOP_OF_SEARCH,
            },
            {
              percentage: initialProductPagesBid,
              placement: PlacementBids.PRODUCT_PAGES,
            },
            {
              percentage: initialRestOfSearchBid,
              placement: PlacementBids.REST_OF_SEARCH,
            },
          ],
          strategy: initialBiddingStrategy,
        };
      }

      if (hasAmazonSPBudgetProp(selectedCampaign)) {
        selectedCampaignData.budget = {
          budget: initialBudget,
        };
      } else {
        selectedCampaignData.budget = initialBudget;
      }

      if (hasAmazonSPBudgetProp(selectedCampaign)) {
        selectedCampaignData.budget = {
          budget: initialBudget,
        };
      }

      if (
        checkDataDifferenceInCampaignData(selectedCampaignData, updatedCampaign)
      ) {
        setIsSaveDisabled(false);
      } else {
        setIsSaveDisabled(true);
      }
    }
  }, [
    campaignName,
    endDate,
    isEndDateIndefiniteChecked,
    status,
    budget,
    totalBudget,
    pageTypeBidMultiplier,
    platformBidMultiplier,
    initialBudget,
    selectedCampaign,
    selectedMarketplace,
    initialProductPagesBid,
    initialRestOfSearchBid,
    initialTopOfSearchBid,
    biddingStrategy,
    initialBiddingStrategy,
    productPagesBid,
    restOfSearchBid,
    topOfSearchBid,
    initialTotalBudget,
    initialStatus.value,
    advHeaderFilters.adType.value,
    campaignOptions,
    initialCampaignOptions,
  ]);

  const {
    mutateAsync: editAccessMutateAmazonSPCampaign,
    isPending: isAmazonSPCampaignPending,
    isIdle: isAmazonSPCampaignIdle,
  } = useAppMutation({
    mutationFn: (body: IEditAccessCampaignUpdateBody) =>
      EditAccessSPServices.updateSPCampaign(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SP_CAMPAIGN_LVL_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
          })
        );

        navigate(
          getUrlWithQuery(
            getCampaignUrl(
              selectedCampaign.campaignId,
              getAdTypePath(AdType.SPONSORED_PRODUCTS),
              getMarketplacePath(MarketplaceEnum.AMAZON)
            )
          )
        );
      },
    },
  });

  const {
    mutateAsync: editAccessMutateAmazonSBCampaign,
    isPending: isAmazonSBCampaignPending,
    isIdle: isAmazonSBCampaignIdle,
  } = useAppMutation({
    mutationFn: (body: IEditAccessCampaignUpdateBody) =>
      EditAccessSBServices.updateSBCampaign(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SB_CAMPAIGN_LVL_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
          })
        );

        navigate(
          getUrlWithQuery(
            getCampaignUrl(
              selectedCampaign.campaignId,
              getAdTypePath(AdType.SPONSORED_BRANDS),
              getMarketplacePath(MarketplaceEnum.AMAZON)
            )
          )
        );
      },
    },
  });

  const {
    mutateAsync: editAccessMutateAmazonSDCampaign,
    isPending: isAmazonSDCampaignPending,
    isIdle: isAmazonSDCampaignIdle,
  } = useAppMutation({
    mutationFn: (body: IEditAccessCampaignUpdateBody) =>
      EditAccessSDServices.updateSDCampaign(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SD_CAMPAIGN_LVL_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
          })
        );

        navigate(
          getUrlWithQuery(
            getCampaignUrl(
              selectedCampaign.campaignId,
              getAdTypePath(AdType.SPONSORED_DISPLAY),
              getMarketplacePath(MarketplaceEnum.AMAZON)
            )
          )
        );
      },
    },
  });

  const handleSaveAmazonCampaignChanges = async () => {
    const updatedCampaign: IEditAccessCampaign = {
      id: `${selectedCampaign.campaignId}`,
      campaignId: `${selectedCampaign.campaignId}`,
      entityName: `${selectedCampaign.campaignName.trim()}`,
    };

    if (
      !checkIsEqual(selectedCampaign.campaignName.trim(), campaignName.trim())
    ) {
      updatedCampaign.name = campaignName.trim();
    }

    if (!checkIsEqual(selectedCampaign.endDate, endDate))
      updatedCampaign.endDate = endDate ? endDate : null;

    if (initialStatus.value.toLowerCase() !== status.value?.toLowerCase()) {
      updatedCampaign.state = status.value;
    }

    if (!checkIsEqual(initialBudget, budget)) {
      if (hasAmazonSPBudgetProp(selectedCampaign)) {
        updatedCampaign.budget = {
          budget: budget,
        };
      } else {
        updatedCampaign.budget = budget;
      }
    }

    if (advHeaderFilters.adType.value === AdType.SPONSORED_PRODUCTS) {
      if (
        !checkIsEqual(initialTopOfSearchBid, topOfSearchBid) ||
        !checkIsEqual(initialProductPagesBid, productPagesBid) ||
        !checkIsEqual(initialRestOfSearchBid, restOfSearchBid) ||
        !checkIsEqual(initialBiddingStrategy, biddingStrategy)
      ) {
        updatedCampaign.dynamicBidding = {
          placementBidding: [
            {
              percentage: topOfSearchBid,
              placement: PlacementBids.TOP_OF_SEARCH,
            },
            {
              percentage: productPagesBid,
              placement: PlacementBids.PRODUCT_PAGES,
            },
            {
              percentage: restOfSearchBid,
              placement: PlacementBids.REST_OF_SEARCH,
            },
          ],
          strategy: biddingStrategy,
        };
      }
    }

    const body: IEditAccessCampaignUpdateBody = {
      campaigns: [updatedCampaign],
    };

    if (advHeaderFilters.adType.value === AdType.SPONSORED_PRODUCTS) {
      await editAccessMutateAmazonSPCampaign(body);
      handleCloseDialog();
      return;
    }

    if (advHeaderFilters.adType.value === AdType.SPONSORED_BRANDS) {
      await editAccessMutateAmazonSBCampaign(body);
      handleCloseDialog();
      return;
    }

    if (advHeaderFilters.adType.value === AdType.SPONSORED_DISPLAY) {
      await editAccessMutateAmazonSDCampaign(body);
      handleCloseDialog();
      return;
    }
  };

  const {
    mutateAsync: editAccessMutateWalmartSPCampaign,
    isPending: isWalmartSPCampaignPending,
    isIdle: isWalmartSPCampaignIdle,
  } = useAppMutation({
    mutationFn: ({
      pageTypeBody,
      platformBody,
      campaignBody,
    }: {
      pageTypeBody: IEditAccessWalmartPageType[];
      platformBody: IEditAccessWalmartPlatform[];
      campaignBody: IEditAccessWalmartCampaign[];
    }) => {
      // TODO: api will be changed. all will be merged to one api.
      // TODO: remove this if not needed. If we call any one api then updates are not going through.
      // All the apis must be called.

      // const promises: Promise<any>[] = [];

      // promises.push(
      //   walmartEditAccessSPServices.updateWalmartSPCampaign(campaignBody)
      // );

      // if (
      //   checkDataDifferenceInPageTypeData(
      //     hasPageTypeProp(selectedCampaign) ? selectedCampaign.pageTypes : [],
      //     pageTypeBidMultiplier
      //   )
      // ) {
      //   promises.push(
      //     walmartEditAccessSPServices.updateWalmartSPPageType(pageTypeBody)
      //   );
      // }

      // if (
      //   checkDataDifferenceInPlatformData(
      //     hasPlatformProp(selectedCampaign) ? selectedCampaign.platforms : [],
      //     platformBidMultiplier
      //   )
      // ) {
      //   promises.push(
      //     walmartEditAccessSPServices.updateWalmartSPPlatform(platformBody)
      //   );
      // }

      // return await Promise.allSettled(promises);

      return Promise.allSettled([
        walmartEditAccessSPServices.updateWalmartSPPageType(pageTypeBody),
        walmartEditAccessSPServices.updateWalmartSPPlatform(platformBody),
        walmartEditAccessSPServices.updateWalmartSPCampaign(campaignBody),
      ]);
    },
    options: {
      onSettled: (responses) => {
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
    mutationFn: (campaignBody: IEditAccessWalmartCampaign[]) =>
      walmartEditAccessSBServices.updateWalmartSBCampaign(campaignBody),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SB_CAMPAIGN_LVL_FETCH],
        });

        navigate(
          getUrlWithQuery(
            getCampaignUrl(
              selectedCampaign.campaignId,
              getAdTypePath(AdType.SPONSORED_BRANDS),
              getMarketplacePath(MarketplaceEnum.WALMART)
            )
          )
        );

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
            description: data.data.description,
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
    mutationFn: (campaignBody: IEditAccessWalmartCampaign[]) =>
      walmartEditAccessSVServices.updateWalmartSVCampaign(campaignBody),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SV_CAMPAIGN_LVL_FETCH],
        });

        navigate(
          getUrlWithQuery(
            getCampaignUrl(
              selectedCampaign.campaignId,
              getAdTypePath(AdType.SPONSORED_VIDEO),
              getMarketplacePath(MarketplaceEnum.WALMART)
            )
          )
        );

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
            description: data.data.description,
          })
        );
      },
    },
  });

  const handleReviewPopupConfirmClick = async (
    updatedCampaign: IEditAccessWalmartCampaign | null
  ) => {
    if (updatedCampaign) {
      if (advHeaderFilters.adType.value === AdType.SPONSORED_BRANDS) {
        await editAccessMutateWalmartSBCampaign([updatedCampaign]);
      }

      if (advHeaderFilters.adType.value === AdType.SPONSORED_VIDEO) {
        await editAccessMutateWalmartSVCampaign([updatedCampaign]);
      }
    }

    handleCloseDialog();
    handleReviewPopupClose();
  };

  const handleWalmartReviewTriggeringCalls = async (
    updatedCampaign: IEditAccessWalmartCampaign
  ) => {
    if (updatedCampaign) {
      if (
        updatedCampaign.status !== undefined &&
        checkIsEqual(
          updatedCampaign.status,
          WalmartCampaignStatusEnum.ENABLED.toLowerCase()
        )
      ) {
        handleReviewPopupOpen();
      } else {
        await handleReviewPopupConfirmClick(updatedCampaign);
      }
    }
  };

  const handleSaveWalmartCampaignChanges = async () => {
    const updatedCampaign: IEditAccessWalmartCampaign = {
      id: `${selectedCampaign.campaignId}`,
      campaignId: `${selectedCampaign.campaignId}`,
      entityName: `${selectedCampaign.campaignName.trim()}`,
    };

    if (
      budgetType !== undefined &&
      budgetType !== WalmartBudgetTypeEnum.TOTAL &&
      !checkIsEqual(initialBudget, budget)
    ) {
      updatedCampaign.dailyBudget = budget;
    }

    if (
      budgetType !== undefined &&
      budgetType !== WalmartBudgetTypeEnum.DAILY &&
      !checkIsEqual(initialTotalBudget, totalBudget)
    ) {
      updatedCampaign.totalBudget = totalBudget;
    }

    if (
      !checkIsEqual(selectedCampaign.campaignName.trim(), campaignName.trim())
    ) {
      updatedCampaign.name = campaignName.trim();
    }

    let updatedEndDate = endDate;
    if (isEndDateIndefiniteChecked) {
      updatedEndDate = WALMART_INDEFINITE_END_DATE;
    }

    if (!checkIsEqual(selectedCampaign.endDate, updatedEndDate)) {
      if (!updatedEndDate?.trim()) {
        dispatch(
          showErrorToastMessage({
            title: 'Error!!!',
            description: `End Date cannot be empty. Either set an end date or choose "Run indefinitely from start date".`,
          })
        );
        return;
      }

      updatedCampaign.endDate = updatedEndDate;
    }

    if (
      getValidWalmartStatus(status.value) !== null &&
      !checkIsEqual(
        initialStatus.value.toLowerCase(),
        status.value?.toLowerCase()
      )
    ) {
      updatedCampaign.status = status.value?.toLowerCase();
    }

    let updatedCampaignOptions: string[] | null = [];
    if (campaignOptions !== null) {
      for (const [key, value] of campaignOptions) {
        if (value) updatedCampaignOptions.push(key);
      }
    } else updatedCampaignOptions = null;

    if (!checkIsEqual(initialCampaignOptions, updatedCampaignOptions)) {
      updatedCampaign.campaignOptions = updatedCampaignOptions;
    }

    const campaignBody = [updatedCampaign];
    setWalmartUpdatedCampaign(updatedCampaign);

    if (advHeaderFilters.adType.value === AdType.SPONSORED_PRODUCTS) {
      const pageTypeBody: IEditAccessWalmartPageType[] =
        pageTypeBidMultiplier.map((pageType) => {
          return {
            id: `${pageType.pageType}-${pageType.campaignId}`,
            campaignId: `${pageType.campaignId}`,
            placementType: pageType.pageType,
            multiplier: parseNum(pageType.pageTypeMultiplier),
            entityName: `${selectedCampaign.campaignName.trim()} (${
              pageType.pageType
            })`,
          };
        }) ?? [];

      const platformBody: IEditAccessWalmartPlatform[] =
        platformBidMultiplier.map((platform) => {
          return {
            id: `${platform.platform}-${platform.campaignId}`,
            campaignId: `${platform.campaignId}`,
            platformType: platform.platform,
            multiplier: parseNum(platform.platformMultiplier),
            entityName: `${selectedCampaign.campaignName.trim()} (${
              platform.platform
            })`,
          };
        }) ?? [];

      if (
        pageTypeBody.length > 0 ||
        platformBody.length > 0 ||
        campaignBody.length > 0
      ) {
        await editAccessMutateWalmartSPCampaign({
          pageTypeBody,
          platformBody,
          campaignBody,
        });
      }

      handleCloseDialog();
    } else {
      await handleWalmartReviewTriggeringCalls(updatedCampaign);
    }
  };

  const getPopupContentText = useMemo(() => {
    if (marketplace === MarketplaceEnum.WALMART) {
      if (advHeaderFilters.adType.value === AdType.SPONSORED_BRANDS) {
        return `<strong>Please note:</strong> Resuming an SB campaign will trigger a review process by Walmart's team. This process may take 24-48 hours during which the campaign will stop serving ads.`;
      }

      if (advHeaderFilters.adType.value === AdType.SPONSORED_VIDEO) {
        return `<strong>Please note:</strong> Resuming an SV campaign will trigger a review process by Walmart's team. This process may take 24-48 hours during which the campaign will stop serving ads.`;
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
          getValidWalmartStatus(initialStatus.value)?.toLowerCase() !==
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
      !checkIsObjectEmpty(nameErrMsg) ||
      !checkIsObjectEmpty(dailyBudgetLimitErr) ||
      !checkIsObjectEmpty(totalBudgetLimitErr) ||
      (!checkIsObjectEmpty(TOSWarnMsgObj) &&
        TOSWarnMsgObj !== undefined &&
        TOSWarnMsgObj.hasOwnProperty(selectedCampaign.campaignId)) ||
      (!checkIsObjectEmpty(ROSWarnMsgObj) &&
        ROSWarnMsgObj !== undefined &&
        ROSWarnMsgObj.hasOwnProperty(selectedCampaign.campaignId)) ||
      (!checkIsObjectEmpty(PPWarnMsgObj) &&
        PPWarnMsgObj !== undefined &&
        PPWarnMsgObj.hasOwnProperty(selectedCampaign.campaignId)) ||
      !checkIsObjectEmpty(bidMultiplierLimitErr)
    );
  }, [
    PPWarnMsgObj,
    ROSWarnMsgObj,
    TOSWarnMsgObj,
    bidMultiplierLimitErr,
    dailyBudgetLimitErr,
    isSaveDisabled,
    nameErrMsg,
    selectedCampaign.campaignId,
    totalBudgetLimitErr,
  ]);

  const isLoading = useMemo(() => {
    return (
      (isAmazonSPCampaignPending === true &&
        isAmazonSPCampaignIdle === false) ||
      (isAmazonSBCampaignPending === true &&
        isAmazonSBCampaignIdle === false) ||
      (isAmazonSDCampaignPending === true &&
        isAmazonSDCampaignIdle === false) ||
      (isWalmartSPCampaignPending === true &&
        isWalmartSPCampaignIdle === false) ||
      (isWalmartSBCampaignPending === true &&
        isWalmartSBCampaignIdle === false) ||
      (isWalmartSVCampaignPending === true && isWalmartSVCampaignIdle === false)
    );
  }, [
    isAmazonSPCampaignPending,
    isAmazonSPCampaignIdle,
    isAmazonSBCampaignPending,
    isAmazonSBCampaignIdle,
    isAmazonSDCampaignPending,
    isAmazonSDCampaignIdle,
    isWalmartSPCampaignPending,
    isWalmartSPCampaignIdle,
    isWalmartSBCampaignPending,
    isWalmartSBCampaignIdle,
    isWalmartSVCampaignPending,
    isWalmartSVCampaignIdle,
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
          Campaign Settings
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
                ? handleSaveAmazonCampaignChanges
                : handleSaveWalmartCampaignChanges
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
          <InputLabel htmlFor="campaignName" sx={inputLabelStyles}>
            Campaign Name <InfoIcon title="Campaign Name" />
          </InputLabel>
          <TextField
            value={campaignName}
            id="campaignName"
            variant="outlined"
            type="text"
            placeholder="Enter Campaign Name"
            sx={textFieldStyles}
            onChange={handleCampaignNameChange}
            error={
              nameErrMsg !== undefined &&
              nameErrMsg.hasOwnProperty(selectedCampaign.campaignId)
            }
            helperText={
              nameErrMsg !== undefined &&
              nameErrMsg[selectedCampaign.campaignId] && (
                <FormHelperText
                  sx={{
                    ...formHelperTextStyles,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                >
                  {nameErrMsg[selectedCampaign.campaignId]?.message ?? ''}
                </FormHelperText>
              )
            }
            disabled={isEditDisabledByReviewStatus}
          />
        </div>

        <div className={`${styles.idContainer} ${styles.componentContainer}`}>
          <div className={styles.child}>
            <InputLabel htmlFor="campaignId" sx={inputLabelStyles}>
              Campaign ID <InfoIcon title="Campaign ID" />
            </InputLabel>
            <Typography id="campaignId" sx={staticValueStyles}>
              {selectedCampaign.campaignId}
            </Typography>
          </div>

          {reviewStatus !== null && (
            <div className={styles.child}>
              <InputLabel htmlFor="reviewStatus" sx={inputLabelStyles}>
                Campaign Review Status{' '}
                <InfoIcon title="Campaign Review Status" />
              </InputLabel>
              <div className={styles.reviewStatus}>
                {reviewStatus.icon}
                <Typography
                  id="reviewStatus"
                  sx={{
                    ...staticValueStyles,
                    marginTop: 0,
                    marginLeft: '0.3rem',
                  }}
                >
                  {reviewStatus.title}
                </Typography>
              </div>
            </div>
          )}

          <div className={styles.child}></div>
        </div>

        <div className={`${styles.tagsContainer} ${styles.componentContainer}`}>
          <div className={styles.child}>
            <InputLabel htmlFor="adType" sx={inputLabelStyles}>
              Type of Ad <InfoIcon title="Type of Ad" />
            </InputLabel>
            <div id="adType" className={styles.infoContainer}>
              {selectedCampaignAdType}
            </div>
          </div>

          {hasTargetingType(selectedCampaign) && (
            <div className={styles.child}>
              <InputLabel htmlFor="targetingType" sx={inputLabelStyles}>
                Type of Targeting <InfoIcon title="Type of Targeting" />
              </InputLabel>
              <div id="targetingType" className={styles.infoContainer}>
                {convertToUpperCase(selectedCampaign.targetingType)}
              </div>
            </div>
          )}

          <div className={styles.child}>
            <InputLabel htmlFor="status" sx={inputLabelStyles}>
              Status <InfoIcon title="Status" />
            </InputLabel>
            <Dropdown
              disabled={isStatusEditDisabled}
              options={
                marketplace === MarketplaceEnum.AMAZON
                  ? amazonStatusOptions
                  : walmartStatusOptions
              }
              selected={status}
              label=""
              onSelect={handleStatusChange}
              width="10rem"
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
        </div>

        {marketplace === MarketplaceEnum.WALMART &&
          hasTargetingType(selectedCampaign) &&
          selectedCampaign.targetingType === TargetingTypeEnum.AUTO &&
          campaignOptions !== null && (
            <div className={`${styles.componentContainer}`}>
              <InputLabel htmlFor="campaignOptions" sx={inputLabelStyles}>
                Expanded Targeting{' '}
                <InfoIcon title="Choose when customers see your ads. These settings will be turned on for new campaigns, but you can turn them off anytime." />
              </InputLabel>
              <div
                className={`${styles.campaignOptionContainer} ${styles.componentContainer}`}
              >
                <div className={styles.child}>
                  <FormControlLabel
                    label="Brand term"
                    sx={{
                      '& .MuiCheckbox-root': {
                        paddingTop: 0,
                        paddingRight: 0,
                        paddingBottom: 0,
                        marginRight: '0.5rem',

                        '&.Mui-checked': {
                          color: '#77469B',
                        },
                      },

                      '& .MuiTypography-root': {
                        fontSize: '1.2rem',
                        fontWeight: 500,
                      },
                    }}
                    control={
                      <Checkbox
                        checked={
                          campaignOptions.get(
                            WalmartCampaignOptionsEnums.BRAND_TERM_OPT_OUT
                          ) === false
                        }
                        onChange={handleCampaignOptionsChange}
                        value={WalmartCampaignOptionsEnums.BRAND_TERM_OPT_OUT}
                      />
                    }
                  />
                </div>

                <div className={styles.child}>
                  <FormControlLabel
                    label="Complementary"
                    sx={{
                      '& .MuiCheckbox-root': {
                        paddingTop: 0,
                        paddingRight: 0,
                        paddingBottom: 0,
                        marginRight: '0.5rem',

                        '&.Mui-checked': {
                          color: '#77469B',
                        },
                      },

                      '& .MuiTypography-root': {
                        fontSize: '1.2rem',
                        fontWeight: 500,
                      },
                    }}
                    control={
                      <Checkbox
                        checked={
                          campaignOptions.get(
                            WalmartCampaignOptionsEnums.COMPLEMENTARY_OPT_OUT
                          ) === false
                        }
                        onChange={handleCampaignOptionsChange}
                        value={
                          WalmartCampaignOptionsEnums.COMPLEMENTARY_OPT_OUT
                        }
                      />
                    }
                  />
                </div>

                <div className={styles.child}></div>
              </div>
            </div>
          )}

        <div className={`${styles.dateContainer} ${styles.componentContainer}`}>
          <div>
            <InputLabel htmlFor="startDate" sx={inputLabelStyles}>
              Start Date <InfoIcon title="Start Date" />
            </InputLabel>
            <SingleDatePicker
              label=""
              value={getDateFromTimestamp(selectedCampaign.startDate)}
              onChange={handleStartDateChange}
              isMaxDateRequired={false}
              isDisabled={true}
            />
          </div>

          <div>
            <InputLabel htmlFor="endDate" sx={inputLabelStyles}>
              End Date <InfoIcon title="End Date" />
            </InputLabel>
            <SingleDatePicker
              label=""
              value={getDateFromTimestamp(endDate)}
              onChange={handleEndDateChange}
              isMaxDateRequired={false}
              minDate={getCurrentDateTime().split('_')[0]}
              isDisabled={
                (marketplace === MarketplaceEnum.WALMART &&
                  isEndDateIndefiniteChecked) ||
                isEditDisabledByReviewStatus
              }
            />
          </div>
        </div>

        {marketplace === MarketplaceEnum.WALMART && (
          <div className={styles.componentContainer}>
            <FormControlLabel
              label="Run indefinitely from start date"
              sx={{
                '& .MuiCheckbox-root': {
                  paddingTop: 0,
                  paddingRight: 0,
                  paddingBottom: 0,
                  marginRight: '0.5rem',

                  '&.Mui-checked': {
                    color: '#77469B',
                  },
                },

                '& .MuiTypography-root': {
                  fontSize: '1.2rem',
                  fontWeight: 500,
                },

                '&.Mui-disabled': {
                  cursor: 'not-allowed',
                },
              }}
              control={
                <Checkbox
                  checked={isEndDateIndefiniteChecked}
                  onChange={handleChangeEndDateIndefinite}
                  disabled={isEditDisabledByReviewStatus}
                  sx={{
                    '&.Mui-disabled': {
                      cursor: 'not-allowed',
                    },
                  }}
                />
              }
            />
          </div>
        )}

        {marketplace === MarketplaceEnum.WALMART && (
          <React.Fragment>
            <div className={styles.componentContainer}>
              <InputLabel htmlFor="budget" sx={inputLabelStyles}>
                Daily Budget <InfoIcon title="Daily Budget" />
              </InputLabel>
              <TextField
                value={budget}
                type="number"
                id="budget"
                variant="outlined"
                placeholder="Enter Budget"
                sx={textFieldStyles}
                onChange={handleBudgetChange}
                InputProps={{
                  inputProps: {
                    inputMode: 'decimal',
                    min: 0,
                    step: 0.01,
                  },
                  startAdornment: getCurrencySymbolByCountry(),
                }}
                disabled={
                  (budgetType !== undefined &&
                    budgetType === WalmartBudgetTypeEnum.TOTAL) ||
                  isEditDisabledByReviewStatus
                }
                error={
                  dailyBudgetLimitErr !== undefined &&
                  dailyBudgetLimitErr.hasOwnProperty(
                    selectedCampaign.campaignId
                  )
                }
                helperText={
                  dailyBudgetLimitErr !== undefined &&
                  dailyBudgetLimitErr[selectedCampaign.campaignId] ? (
                    <FormHelperText
                      sx={{
                        ...formHelperTextStyles,
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      {dailyBudgetLimitErr[selectedCampaign.campaignId]
                        ?.message ?? ''}
                    </FormHelperText>
                  ) : dailyBudgetWarnMsgObj !== undefined &&
                    dailyBudgetWarnMsgObj[selectedCampaign.campaignId] ? (
                    <FormHelperText
                      sx={{
                        ...formHelperTextStyles,
                        color: 'orange',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      {dailyBudgetWarnMsgObj[selectedCampaign.campaignId]
                        ?.message ?? ''}
                    </FormHelperText>
                  ) : (
                    ''
                  )
                }
              />
            </div>

            <div className={styles.componentContainer}>
              <InputLabel htmlFor="budget" sx={inputLabelStyles}>
                Total Budget <InfoIcon title="Total Budget" />
              </InputLabel>
              <TextField
                value={totalBudget}
                type="number"
                id="budget"
                variant="outlined"
                placeholder="Enter Budget"
                sx={textFieldStyles}
                onChange={handleTotalBudgetChange}
                InputProps={{
                  inputProps: {
                    min: 0,
                    step: 0.01,
                    inputMode: 'decimal',
                  },
                  startAdornment: getCurrencySymbolByCountry(),
                }}
                disabled={
                  (budgetType !== undefined &&
                    budgetType === WalmartBudgetTypeEnum.DAILY) ||
                  isEditDisabledByReviewStatus
                }
                error={
                  totalBudgetLimitErr !== undefined &&
                  totalBudgetLimitErr.hasOwnProperty(
                    selectedCampaign.campaignId
                  )
                }
                helperText={
                  totalBudgetLimitErr !== undefined &&
                  totalBudgetLimitErr[selectedCampaign.campaignId] ? (
                    <FormHelperText
                      sx={{
                        ...formHelperTextStyles,
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      {totalBudgetLimitErr[selectedCampaign.campaignId]
                        ?.message ?? ''}
                    </FormHelperText>
                  ) : totalBudgetWarnMsgObj !== undefined &&
                    totalBudgetWarnMsgObj[selectedCampaign.campaignId] ? (
                    <FormHelperText
                      sx={{
                        ...formHelperTextStyles,
                        color: 'orange',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      {totalBudgetWarnMsgObj[selectedCampaign.campaignId]
                        ?.message ?? ''}
                    </FormHelperText>
                  ) : (
                    ''
                  )
                }
              />
            </div>

            {(advHeaderFilters.adType.value === AdType.SPONSORED_PRODUCTS ||
              advHeaderFilters.adType.value ===
                AdTypeShort.SPONSORED_PRODUCTS) &&
              pageTypeBidMultiplier.length > 0 &&
              hasTargetingType(selectedCampaign) && (
                <div className={styles.componentContainer}>
                  <InputLabel htmlFor="budget" sx={inputLabelStyles}>
                    Placement Bid Multiplier{' '}
                    <InfoIcon title="Placement Bid Multiplier" />
                  </InputLabel>
                  <PageTypeBidMultiplierSettings
                    pageTypeBidMultiplierItems={pageTypeBidMultiplier}
                    handlePageTypeBidMultiplierChange={
                      handlePageTypeBidMultiplierChange
                    }
                    targetingType={selectedCampaign?.targetingType}
                  />
                  {/* WMT PageType Bid Multiplier */}
                </div>
              )}

            {(advHeaderFilters.adType.value === AdType.SPONSORED_PRODUCTS ||
              advHeaderFilters.adType.value ===
                AdTypeShort.SPONSORED_PRODUCTS) &&
              platformBidMultiplier.length > 0 && (
                <div className={styles.componentContainer}>
                  <InputLabel htmlFor="budget" sx={inputLabelStyles}>
                    Platform Bid Multiplier{' '}
                    <InfoIcon title="Platform Bid Multiplier" />
                  </InputLabel>
                  <PlatformBidMultiplierSettings
                    platformBidMultiplierItems={platformBidMultiplier}
                    handlePlatformBidMultiplierChange={
                      handlePlatformBidMultiplierChange
                    }
                  />
                  {/* WMT Platform Bid Multiplier */}
                </div>
              )}
          </React.Fragment>
        )}

        {marketplace === MarketplaceEnum.AMAZON && (
          <React.Fragment>
            <div className={styles.componentContainer}>
              <InputLabel htmlFor="budget" sx={inputLabelStyles}>
                Budget <InfoIcon title="Budget" />
              </InputLabel>
              <TextField
                value={budget}
                type="number"
                id="budget"
                variant="outlined"
                placeholder="Enter Budget"
                sx={textFieldStyles}
                onChange={handleBudgetChange}
                InputProps={{
                  inputProps: {
                    min: 0,
                    step: 0.01,
                  },
                  startAdornment: getCurrencySymbolByCountry(),
                }}
                error={
                  dailyBudgetLimitErr !== undefined &&
                  dailyBudgetLimitErr.hasOwnProperty(
                    selectedCampaign.campaignId
                  )
                }
                helperText={
                  dailyBudgetLimitErr !== undefined &&
                  dailyBudgetLimitErr[selectedCampaign.campaignId] ? (
                    <FormHelperText
                      sx={{
                        ...formHelperTextStyles,
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      {dailyBudgetLimitErr[selectedCampaign.campaignId]
                        ?.message ?? ''}
                    </FormHelperText>
                  ) : dailyBudgetWarnMsgObj !== undefined &&
                    dailyBudgetWarnMsgObj[selectedCampaign.campaignId] ? (
                    <FormHelperText
                      sx={{
                        ...formHelperTextStyles,
                        color: 'orange',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      {dailyBudgetWarnMsgObj[selectedCampaign.campaignId]
                        ?.message ?? ''}
                    </FormHelperText>
                  ) : (
                    ''
                  )
                }
              />
            </div>

            {hasDynamicBiddingProp(selectedCampaign) && (
              <React.Fragment>
                <div className={styles.componentContainer}>
                  <InputLabel htmlFor="biddingStrategy" sx={inputLabelStyles}>
                    Campaign Bidding Strategy{' '}
                    <InfoIcon title="Campaign Bidding Strategy" />
                  </InputLabel>

                  <div id="biddingStrategy" className={styles.boxContainer}>
                    <RadioGroup
                      row
                      name="businessType"
                      className={styles.radioGroupContainer}
                      value={biddingStrategy}
                      onChange={handleStrategyChange}
                    >
                      {biddingStrategyFormOptions.map((strategy) => (
                        <FormControlLabel
                          key={strategy.value}
                          value={strategy.value}
                          control={
                            <Radio sx={radioButtonStyle} disableRipple />
                          }
                          label={
                            <div>
                              <Typography
                                variant="h4"
                                fontSize="1.2rem"
                                fontWeight={400}
                                lineHeight="14.52px"
                                sx={{
                                  mb: '3px',
                                  color:
                                    strategy.value === biddingStrategy
                                      ? '#77469b'
                                      : 'initial',
                                  fontWeight:
                                    strategy.value === biddingStrategy
                                      ? 700
                                      : 'initial',
                                }}
                              >
                                {strategy.label}
                              </Typography>
                              <Typography
                                variant="body1"
                                color="#474747"
                                fontSize="1rem"
                                fontWeight={400}
                                lineHeight="14.52px"
                              >
                                {strategy.description}
                              </Typography>
                            </div>
                          }
                        />
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                <div className={styles.componentContainer}>
                  <InputLabel htmlFor="placementBids" sx={inputLabelStyles}>
                    Placement Bids (replaced Bid+){' '}
                    <InfoIcon title="Placement Bids (replaced Bid+)" />
                  </InputLabel>

                  <div id="placementBids" className={styles.boxContainer}>
                    <Typography
                      variant="body1"
                      color="#474747"
                      fontSize="1rem"
                      fontWeight={400}
                      lineHeight="12.1px"
                    >
                      In addition to your bidding strategy, you can increase
                      bids by up to 900%.
                    </Typography>

                    <div className={styles.placementDropdownContainer}>
                      <div className={styles.dropdownComponent}>
                        <InputLabel htmlFor="topOfSearch" sx={inputLabelStyles}>
                          Top Of Search(First Page){' '}
                          <InfoIcon title="Top of search (first Page)" />
                        </InputLabel>
                        <TextField
                          value={topOfSearchBid}
                          type="number"
                          id="topOfSearch"
                          variant="outlined"
                          placeholder="Enter Top of search (first Page)"
                          sx={textFieldStyles}
                          onChange={handleTopOfSearchBidChange}
                          InputProps={{
                            inputProps: {
                              min: 0,
                              max: 900,
                              inputMode: 'decimal',
                              step: 0.01,
                            },
                            endAdornment: '%',
                          }}
                          error={
                            TOSWarnMsgObj !== undefined &&
                            TOSWarnMsgObj.hasOwnProperty(
                              selectedCampaign.campaignId
                            )
                          }
                          helperText={
                            TOSWarnMsgObj !== undefined ? (
                              TOSWarnMsgObj[selectedCampaign.campaignId] ? (
                                <FormHelperText
                                  sx={{
                                    ...formHelperTextStyles,
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                  }}
                                >
                                  {TOSWarnMsgObj[selectedCampaign.campaignId]
                                    ?.message ?? ''}
                                </FormHelperText>
                              ) : TOSWarnMsgObj['TOS'] ? (
                                <FormHelperText
                                  sx={{
                                    ...formHelperTextStyles,
                                    color: 'orange',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                  }}
                                >
                                  {TOSWarnMsgObj['TOS'].message ?? ''}
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

                      <div className={styles.dropdownComponent}>
                        <InputLabel
                          htmlFor="productPages"
                          sx={inputLabelStyles}
                        >
                          Product Pages <InfoIcon title="Product Pages" />
                        </InputLabel>
                        <TextField
                          value={productPagesBid}
                          type="number"
                          id="productPages"
                          variant="outlined"
                          placeholder="Enter Product Pages"
                          sx={textFieldStyles}
                          onChange={handleProductPagesBidChange}
                          InputProps={{
                            inputProps: {
                              min: 0,
                              max: 900,
                              inputMode: 'decimal',
                              step: 0.01,
                            },
                            endAdornment: '%',
                          }}
                          error={
                            PPWarnMsgObj !== undefined &&
                            PPWarnMsgObj.hasOwnProperty(
                              selectedCampaign.campaignId
                            )
                          }
                          helperText={
                            PPWarnMsgObj !== undefined ? (
                              PPWarnMsgObj[selectedCampaign.campaignId] ? (
                                <FormHelperText
                                  sx={{
                                    ...formHelperTextStyles,
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                  }}
                                >
                                  {PPWarnMsgObj[selectedCampaign.campaignId]
                                    ?.message ?? ''}
                                </FormHelperText>
                              ) : PPWarnMsgObj['PP'] ? (
                                <FormHelperText
                                  sx={{
                                    ...formHelperTextStyles,
                                    color: 'orange',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                  }}
                                >
                                  {PPWarnMsgObj['PP'].message ?? ''}
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

                      <div className={styles.dropdownComponent}>
                        <InputLabel
                          htmlFor="restOfSearch"
                          sx={inputLabelStyles}
                        >
                          Rest of the Search{' '}
                          <InfoIcon title="Rest of the Search" />
                        </InputLabel>
                        <TextField
                          value={restOfSearchBid}
                          type="number"
                          id="restOfSearch"
                          variant="outlined"
                          placeholder="Enter Rest of the Search"
                          sx={textFieldStyles}
                          onChange={handleRestOfSearchBidChange}
                          InputProps={{
                            inputProps: {
                              min: 0,
                              max: 900,
                              inputMode: 'decimal',
                              step: 0.01,
                            },
                            endAdornment: '%',
                          }}
                          error={
                            ROSWarnMsgObj !== undefined &&
                            ROSWarnMsgObj.hasOwnProperty(
                              selectedCampaign.campaignId
                            )
                          }
                          helperText={
                            ROSWarnMsgObj !== undefined ? (
                              ROSWarnMsgObj[selectedCampaign.campaignId] ? (
                                <FormHelperText
                                  sx={{
                                    ...formHelperTextStyles,
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                  }}
                                >
                                  {ROSWarnMsgObj[selectedCampaign.campaignId]
                                    ?.message ?? ''}
                                </FormHelperText>
                              ) : ROSWarnMsgObj['ROS'] ? (
                                <FormHelperText
                                  sx={{
                                    ...formHelperTextStyles,
                                    color: 'orange',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                  }}
                                >
                                  {ROSWarnMsgObj['ROS'].message ?? ''}
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
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </DialogContent>

      {isReviewRequired === true && getPopupContentText !== '' && (
        <CustomizablePopup
          openModal={isReviewRequired}
          handleClose={handleReviewPopupClose}
          handleConfirmationAction={() =>
            handleReviewPopupConfirmClick(walmartUpdatedCampaign)
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
