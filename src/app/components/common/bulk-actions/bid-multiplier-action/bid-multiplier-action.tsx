import { IEditBulkActionProp } from '@/interfaces/edit-access/edit-access.interface';
import { getRoundedNumber } from '@/utils';
import { Coins } from '@phosphor-icons/react';
import { useState } from 'react';
import {
  adjustmentOptions,
  WALMART_BID_MULTIPLIER_MAX_LIMIT,
} from 'src/constants/advertising-filter.constants';
import { Adjustments } from 'src/enums/advertising.enums';
import {
  IWalmartPageType,
  IWalmartPlatform,
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
import { getCalculatedBudgetBid } from 'src/utils/advertising.utils';
import ActionConfirmationDialog from '../../action-confirmation-dialog/action-confirmation-dialog';
import ConfirmationBox from '../../confirmation-box/confirmation-box';
import { IDropdownItem } from '../../dropdown/dropdown';
import DropdownTextfield from '../../dropdown/dropdown-textfield';
import TextButton from '../../text-button/text-button';
import styles from '../bulk-actions.module.scss';

interface IBidActionProps extends IEditBulkActionProp {
  isPageType: boolean;
}

export default function BidMultiplierAction({
  setTableData,
  isPageType,
}: IBidActionProps) {
  const [selectedAdjustment, setSelectedAdjustment] = useState<
    IDropdownItem<Adjustments>
  >(adjustmentOptions[0]);
  const [newBid, setNewBid] = useState<number | typeof NaN>(0);
  const [openInvalidModal, setOpenInvalidModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const dispatch = useAppDispatch();
  const isOpenBidDialog = useAppSelector(selectIsOpenBidDialog);
  const editState = useAppSelector(selectEditState) as
    | IWalmartPageType[]
    | IWalmartPlatform[];
  const selectedRowIds = useAppSelector(selectSelectedRowIds);

  const handleBidClick = () => {
    dispatch(setIsOpenBidDialog());
  };

  const handleBidBoxClose = () => {
    dispatch(resetDialogs());
  };

  const handleBidApply = () => {
    const _unwantedBids: Array<unknown> = [];
    setErrorMsg('');

    editState.forEach((row) => {
      if (selectedRowIds.includes(row.id as string | number)) {
        const updatedBid = getRoundedNumber(
          getCalculatedBudgetBid(
            Number(row.multiplier),
            newBid,
            selectedAdjustment.value
          )
        );

        if (parseFloat(`${updatedBid}`) > WALMART_BID_MULTIPLIER_MAX_LIMIT) {
          _unwantedBids.push(updatedBid);
          setErrorMsg(
            `Some ${isPageType ? 'placement' : 'platform'} bid% out of range.`
          );
        } else {
          setErrorMsg('');
        }
      }
    });

    if (_unwantedBids.length > 0) {
      setOpenInvalidModal(true);
    }

    const updatedState = editState.map((row) => {
      if (selectedRowIds.includes(row.id as string | number)) {
        const updatedMultiplier = getRoundedNumber(
          getCalculatedBudgetBid(
            Number(row.multiplier),
            newBid,
            selectedAdjustment.value
          )
        );

        return {
          ...row,
          multiplier: updatedMultiplier < 0 ? 0 : updatedMultiplier,
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
        label="Bid Multiplier"
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
          dialogMessage="Are you sure you adjust bid multiplier?"
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
          title="Invalid Bid Multiplier."
          description={errorMsg}
          openConfirmation={openInvalidModal}
          handleConfirmationClose={cancelInvalidModalClick}
          isConfirmButtonRequired={false}
        />
      )}
    </div>
  );
}
