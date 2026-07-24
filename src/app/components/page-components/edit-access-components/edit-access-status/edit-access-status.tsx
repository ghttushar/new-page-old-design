import { MarketplaceEnum } from '@/enums/serp.enums';
import { IOverallAdvertisingData } from '@/interfaces/advertising/amazon/overall-advertising.interface';
import { ISBAdvertisingData } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDAdvertisingData } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { ISPAdvertisingData } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IWalmartOverallAdGroup,
  IWalmartOverallAdvertisingData,
  IWalmartOverallCampaign,
  IWalmartOverallKeywords,
} from '@/interfaces/advertising/walmart/walmart-overall-advertising.interface';
import { IWalmartSBAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sb-advertising.interface';
import {
  IWalmartAdGroup,
  IWalmartAdItem,
  IWalmartCampaign,
  IWalmartKeywords,
  IWalmartSPAdvertisingData,
} from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import {
  IWalmartSVAdGroup,
  IWalmartSVAdvertisingData,
  IWalmartSVCampaign,
  IWalmartSVKeywords,
} from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { selectSelectedAdvertisingNavTitle } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { useEffect, useMemo, useState } from 'react';
import CustomAntSwitchTooltip from 'src/app/components/common/ant-switch/ant-switch';
import {
  CampaignStateEnum,
  SbAdGroupLevelTitles,
  SbCampaignLevelTitles,
} from 'src/enums/advertising.enums';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import { WalmartCampaignStatusEnum } from 'src/enums/walmart.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectEditAccessFilters,
  selectEditState,
  selectInitialState,
  setEditState,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import {
  checkIsCampaignActiveForEdit,
  checkIsEditDisableByReviewStatus,
  checkIsLOGOItem,
  checkReviewCampaignFlagEnabled,
  convertToTitleCase,
} from 'src/utils/advertising.utils';

interface IEditAccessStatusProps {
  id: string | number;
  status: string;
  endDate?: string;
  isCampaign?: boolean;
  isWalmartKT?: boolean;
  adType: string | undefined;
}

export default function EditAccessStatus({
  id,
  status,
  endDate,
  isCampaign = false,
  isWalmartKT = false,
  adType,
}: IEditAccessStatusProps) {
  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const editState = useAppSelector(selectEditState);
  const initialState = useAppSelector(selectInitialState);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as MarketplaceEnum,
    [advertisingAccount]
  );

  const dispatch = useAppDispatch();

  const currentRowData = useMemo(() => {
    let initialData:
      | ISPAdvertisingData
      | ISBAdvertisingData
      | ISDAdvertisingData
      | IOverallAdvertisingData
      | IWalmartSPAdvertisingData
      | IWalmartSBAdvertisingData
      | IWalmartSVAdvertisingData
      | IWalmartOverallAdvertisingData
      | null = null;
    for (const element of initialState) {
      if (element.id === id) {
        initialData = element;
        break;
      }
    }

    return initialData;
  }, [initialState, id]);

  const isReviewFlagEnabled = useMemo(
    () => checkReviewCampaignFlagEnabled(adType, selectedMarketplace),
    [adType, selectedMarketplace]
  );

  const isEditDisabledByReviewStatus: boolean = useMemo(() => {
    if (selectedMarketplace === MarketplaceEnum.WALMART && currentRowData) {
      return checkIsEditDisableByReviewStatus(currentRowData, isCampaign);
    }

    return false;
  }, [currentRowData, selectedMarketplace, isCampaign]);

  const isEditDisabledByNavTitle = useMemo(() => {
    return (
      selectedAdvertisingNavTitle ===
        SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD ||
      selectedAdvertisingNavTitle ===
        SbCampaignLevelTitles.NEG_TARGETING_KEYWORD
    );
  }, [selectedAdvertisingNavTitle]);

  const isChecked =
    status?.toUpperCase() === CampaignStateEnum.ENABLED ||
    convertToTitleCase(status) === WalmartCampaignStatusEnum.LIVE ||
    convertToTitleCase(status) === WalmartCampaignStatusEnum.SCHEDULED ||
    convertToTitleCase(status) === WalmartCampaignStatusEnum.RESCHEDULED;

  const isDisabled =
    checkIsLOGOItem(currentRowData) ||
    editAccessFilters.editAccess.value === EditAccessValues.View ||
    checkIsCampaignActiveForEdit(endDate) === false;

  const isArchived =
    status?.toUpperCase() === CampaignStateEnum.ARCHIVED ||
    convertToTitleCase(status) === WalmartCampaignStatusEnum.ENDED;

  const initialRowChecked = useMemo(() => {
    if (currentRowData === null) return false;

    const rowDataStatus = (
      currentRowData as
        | IWalmartCampaign
        | IWalmartAdGroup
        | IWalmartAdItem
        | IWalmartKeywords
        | IWalmartSVCampaign
        | IWalmartSVAdGroup
        | IWalmartSVKeywords
        | IWalmartOverallCampaign
        | IWalmartOverallAdGroup
        | IWalmartOverallKeywords
    ).status;

    return (
      rowDataStatus?.toUpperCase() === CampaignStateEnum.ENABLED ||
      convertToTitleCase(rowDataStatus) === WalmartCampaignStatusEnum.LIVE ||
      convertToTitleCase(rowDataStatus) ===
        WalmartCampaignStatusEnum.SCHEDULED ||
      convertToTitleCase(rowDataStatus) ===
        WalmartCampaignStatusEnum.RESCHEDULED
    );
  }, [currentRowData]);

  const [isStatusChecked, setIsStatusChecked] = useState<boolean>(isChecked);

  const getStatusByMarketplace = (statusChecked: boolean) => {
    if (selectedMarketplace === MarketplaceEnum.WALMART) {
      const formattedStatus = convertToTitleCase(status);

      if (statusChecked) {
        return formattedStatus === WalmartCampaignStatusEnum.LIVE
          ? WalmartCampaignStatusEnum.LIVE
          : WalmartCampaignStatusEnum.ENABLED.toLowerCase();
      } else {
        return isCampaign === true || isWalmartKT === true
          ? WalmartCampaignStatusEnum.PAUSED.toLowerCase()
          : WalmartCampaignStatusEnum.DISABLED.toLowerCase();
      }
    }

    return statusChecked ? CampaignStateEnum.ENABLED : CampaignStateEnum.PAUSED;
  };

  const handleStatusChange = () => {
    const updatedStatus = !isStatusChecked;
    setIsStatusChecked(updatedStatus);

    const updatedTable = editState.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          status: isCampaign
            ? convertToTitleCase(getStatusByMarketplace(updatedStatus))
            : getStatusByMarketplace(updatedStatus),
        };
      }
      return row;
    });

    dispatch(setEditState(updatedTable as ISPAdvertisingData[]));
  };

  useEffect(() => {
    setIsStatusChecked(isChecked);
  }, [isChecked, editAccessFilters.editAccess.value]);

  return (
    <CustomAntSwitchTooltip
      isSwitchDisabled={
        isDisabled ||
        isArchived ||
        isEditDisabledByReviewStatus ||
        (initialRowChecked === false && isReviewFlagEnabled === false) ||
        isEditDisabledByNavTitle
      }
      isTooltipDisabled={!isDisabled}
      isChecked={isStatusChecked}
      onChange={handleStatusChange}
      className={
        status?.toUpperCase() === CampaignStateEnum.PAUSED ||
        convertToTitleCase(status) === WalmartCampaignStatusEnum.PAUSED ||
        convertToTitleCase(status) === WalmartCampaignStatusEnum.DISABLED ||
        status?.toLowerCase() ===
          WalmartCampaignStatusEnum.PAUSED.toLowerCase() ||
        status?.toLowerCase() ===
          WalmartCampaignStatusEnum.DISABLED.toLowerCase()
          ? 'paused'
          : ''
      }
      tooltipTitle={status?.toUpperCase()}
      tooltipPosition={'right' as TooltipPlacement}
    />
  );
}
