import { IEditBulkActionProp } from '@/interfaces/edit-access/edit-access.interface';
import { displayValue, getCurrencySymbolByCountry } from '@/utils';
import { Coins } from '@phosphor-icons/react';
import { useState } from 'react';
import { adjustmentOptions } from 'src/constants/advertising-filter.constants';
import {
  Adjustments,
  AdType,
  WalmartOverallAccountLevelTitles,
  WalmartSBAccountLevelTitles,
  WalmartSBAdGroupLevelTitles,
  WalmartSBCampaignLevelTitles,
  WalmartSPAccountLevelTitles,
  WalmartSPAdGroupLevelTitles,
  WalmartSPCampaignLevelTitles,
  WalmartSVAccountLevelTitles,
  WalmartSVAdGroupLevelTitles,
  WalmartSVCampaignLevelTitles,
} from 'src/enums/advertising.enums';
import { TargetingTypeEnum } from 'src/enums/walmart.enums';
import {
  IWalmartAdItem,
  IWalmartKeywords,
  IWalmartSPAdvertisingData,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  resetDialogs,
  selectEditState,
  selectIsOpenBidDialog,
  selectSelectedRowIds,
  setEditState,
  setIsOpenBidDialog,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import {
  selectAdvertisingHeaderFilters,
  selectSelectedAdvertisingNavTitle,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  checkBidValueMaxLimit,
  checkBidValueMinLimit,
  getCalculatedBudgetBid,
} from 'src/utils/advertising.utils';
import ActionConfirmationDialog from '../../action-confirmation-dialog/action-confirmation-dialog';
import ConfirmationBox from '../../confirmation-box/confirmation-box';
import { IDropdownItem } from '../../dropdown/dropdown';
import DropdownTextfield from '../../dropdown/dropdown-textfield';
import TextButton from '../../text-button/text-button';
import styles from '../bulk-actions.module.scss';

interface IBidActionProps extends IEditBulkActionProp {
  isWalmartAdItem?: boolean;
}

export default function WalmartBidAction({
  setTableData,
  isWalmartAdItem = false,
}: IBidActionProps) {
  const [selectedAdjustment, setSelectedAdjustment] = useState<
    IDropdownItem<Adjustments>
  >(adjustmentOptions[0]);
  const [newBid, setNewBid] = useState<number | typeof NaN>(0);
  const [openInvalidModal, setOpenInvalidModal] = useState<boolean>(false);
  const [errorDescription, setErrorDescription] = useState<string>('');

  const dispatch = useAppDispatch();
  const isOpenBidDialog = useAppSelector(selectIsOpenBidDialog);
  const editState = useAppSelector(selectEditState) as
    | IWalmartAdItem[]
    | IWalmartKeywords[];
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);

  const handleBidClick = () => {
    dispatch(setIsOpenBidDialog());
  };

  const handleBidBoxClose = () => {
    dispatch(resetDialogs());
  };

  const handleBidApply = () => {
    const _unwantedBids: Array<unknown> = [];
    setErrorDescription('');

    editState.forEach((row) => {
      if (selectedRowIds.includes(row.id as string | number)) {
        if (
          isWalmartAdItem === true &&
          row.targetingType === TargetingTypeEnum.MANUAL
        )
          return;

        const updatedBid = getCalculatedBudgetBid(
          Number(row.bid),
          newBid,
          selectedAdjustment.value
        );
        const rowAdType =
          advHeaderFilters.adType.value === AdType.All
            ? row.adType
            : advHeaderFilters.adType.value;

        const minLimitErrMsg = checkBidValueMinLimit(
          advertisingAccount.marketplace,
          rowAdType,
          row.targetingType,
          parseFloat(`${updatedBid}`)
        );

        const maxLimitErrMsg = checkBidValueMaxLimit(
          advertisingAccount.marketplace,
          rowAdType,
          row.targetingType,
          parseFloat(`${updatedBid}`)
        );

        if (minLimitErrMsg) {
          _unwantedBids.push(updatedBid);
          setErrorDescription(
            `Some bids are lower than ${displayValue(
              minLimitErrMsg.split(getCurrencySymbolByCountry())[1],
              false
            )}, which is not allowed.`
          );
        } else if (maxLimitErrMsg) {
          _unwantedBids.push(updatedBid);
          setErrorDescription(
            `Some bids are exceeding ${displayValue(
              maxLimitErrMsg.split(getCurrencySymbolByCountry())[1],
              false
            )}, which is not allowed.`
          );
        } else {
          setErrorDescription('');
        }
      }
    });

    if (_unwantedBids.length) {
      setOpenInvalidModal(true);
    }

    const updatedState = editState.map((row) => {
      if (selectedRowIds.includes(row.id as string | number)) {
        if (
          row.targetingType === TargetingTypeEnum.MANUAL &&
          (selectedAdvertisingNavTitle ===
            WalmartSPAccountLevelTitles.AD_ITEMS ||
            selectedAdvertisingNavTitle ===
              WalmartSPCampaignLevelTitles.AD_ITEMS ||
            selectedAdvertisingNavTitle ===
              WalmartSPAdGroupLevelTitles.AD_ITEMS ||
            selectedAdvertisingNavTitle ===
              WalmartSBAccountLevelTitles.AD_ITEMS ||
            selectedAdvertisingNavTitle ===
              WalmartSBCampaignLevelTitles.AD_ITEMS ||
            selectedAdvertisingNavTitle ===
              WalmartSBAdGroupLevelTitles.AD_ITEMS ||
            selectedAdvertisingNavTitle ===
              WalmartSVAccountLevelTitles.AD_ITEMS ||
            selectedAdvertisingNavTitle ===
              WalmartSVCampaignLevelTitles.AD_ITEMS ||
            selectedAdvertisingNavTitle ===
              WalmartSVAdGroupLevelTitles.AD_ITEMS ||
            selectedAdvertisingNavTitle ===
              WalmartOverallAccountLevelTitles.AD_ITEMS)
        )
          return row;

        return {
          ...row,
          bid: getCalculatedBudgetBid(
            Number(row.bid),
            newBid,
            selectedAdjustment.value
          ),
        };
      }

      return row;
    });

    dispatch(setEditState(updatedState as IWalmartSPAdvertisingData[]));
    setTableData(updatedState as IWalmartSPAdvertisingData[]);
    dispatch(resetDialogs());
  };

  const handleAdjustmentOptionChange = (value: IDropdownItem<Adjustments>) => {
    setSelectedAdjustment(value);
  };

  const handleBidChange = (value: number) => {
    setNewBid(value);
  };

  const cancelInvalidModalClick = () => {
    setOpenInvalidModal(false);
  };

  return (
    <div className={styles.buttonDialogContainer}>
      <TextButton
        label="Bid"
        handleClick={handleBidClick}
        isVisible={true}
        buttonStartIcon={<Coins />}
        isDisabled={!selectedRowIds.length}
        disableReason="No row selected"
        isNewDesign={true}
        isSelected={isOpenBidDialog}
      />

      {isOpenBidDialog === true && (
        <ActionConfirmationDialog
          dialogMessage="Are you sure you adjust bid? This action might affect the spends."
          onApply={handleBidApply}
          onClose={handleBidBoxClose}
          isApplyDisabled={selectedRowIds.length === 0}
          isErrorPopupOpen={openInvalidModal}
        >
          <DropdownTextfield
            label=""
            options={adjustmentOptions}
            selected={selectedAdjustment}
            onSelect={handleAdjustmentOptionChange}
            fieldValue={newBid}
            onValueChange={handleBidChange}
            stopPropagation={true}
          />
        </ActionConfirmationDialog>
      )}

      {openInvalidModal === true && (
        <ConfirmationBox
          title="Invalid Bid."
          description={errorDescription}
          openConfirmation={openInvalidModal}
          handleConfirmationClose={cancelInvalidModalClick}
          isConfirmButtonRequired={false}
        />
      )}
    </div>
  );
}
