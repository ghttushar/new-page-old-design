import {
  IKeywordTargeting,
  IProductTargeting,
  ISPAdvertisingData,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IEditBulkActionProp } from '@/interfaces/edit-access/edit-access.interface';
import { Coins } from '@phosphor-icons/react';
import { useState } from 'react';
import { adjustmentOptions } from 'src/constants/advertising-filter.constants';
import { Adjustments, AdType } from 'src/enums/advertising.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  resetDialogs,
  selectEditState,
  selectIsOpenBidDialog,
  selectSelectedRowIds,
  setEditState,
  setIsOpenBidDialog,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { selectAdvertisingHeaderFilters } from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import { displayValue, getCurrencySymbolByCountry, parseNum } from 'src/utils';
import {
  checkBidValueMaxLimit,
  checkBidValueMinLimit,
  getCalculatedBudgetBid,
  hasCostTypeProp,
  hasCreativeTypeProp,
} from 'src/utils/advertising.utils';
import ActionConfirmationDialog from '../../action-confirmation-dialog/action-confirmation-dialog';
import ConfirmationBox from '../../confirmation-box/confirmation-box';
import { IDropdownItem } from '../../dropdown/dropdown';
import DropdownTextfield from '../../dropdown/dropdown-textfield';
import TextButton from '../../text-button/text-button';
import styles from '../bulk-actions.module.scss';

type IBidActionProps = IEditBulkActionProp;

export default function BidAction({ setTableData }: IBidActionProps) {
  const [selectedAdjustment, setSelectedAdjustment] = useState<
    IDropdownItem<Adjustments>
  >(adjustmentOptions[0]);
  const [newBid, setNewBid] = useState<number | typeof NaN>(0);
  const [openInvalidModal, setOpenInvalidModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const dispatch = useAppDispatch();
  const isOpenBidDialog = useAppSelector(selectIsOpenBidDialog);
  const editState = useAppSelector(selectEditState) as
    | IKeywordTargeting[]
    | IProductTargeting[];
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);

  const handleBidClick = () => {
    dispatch(setIsOpenBidDialog());
  };

  const handleBidClose = () => {
    dispatch(resetDialogs());
  };

  const handleBidApply = () => {
    const _unwantedBids: Array<unknown> = [];
    setErrorMsg('');

    editState.forEach((row) => {
      if (selectedRowIds.includes(row.id as string | number)) {
        const updatedBid = getCalculatedBudgetBid(
          parseNum(row.bid),
          newBid,
          selectedAdjustment.value
        );
        const rowAdType =
          advHeaderFilters.adType.value === AdType.All
            ? row.adType
            : advHeaderFilters.adType.value;

        const costType = row && hasCostTypeProp(row) ? row.costType : undefined;

        const creativeType =
          row && hasCreativeTypeProp(row) ? row.creativeType : undefined;

        const minLimitErrMsg = checkBidValueMinLimit(
          advertisingAccount.marketplace,
          rowAdType,
          row.targetingType,
          parseFloat(`${updatedBid}`),
          costType,
          creativeType
        );

        const maxLimitErrMsg = checkBidValueMaxLimit(
          advertisingAccount.marketplace,
          rowAdType,
          row.targetingType,
          parseFloat(`${updatedBid}`),
          costType,
          creativeType
        );

        if (minLimitErrMsg) {
          _unwantedBids.push(updatedBid);
          setErrorMsg(
            `Some bids are lower than ${displayValue(
              minLimitErrMsg.split(getCurrencySymbolByCountry())[1],
              false
            )}, which is not allowed.`
          );
        } else if (maxLimitErrMsg) {
          _unwantedBids.push(updatedBid);
          setErrorMsg(
            `Some bids are exceeding ${displayValue(
              maxLimitErrMsg.split(getCurrencySymbolByCountry())[1],
              false
            )}, which is not allowed.`
          );
        } else {
          setErrorMsg('');
        }
      }
    });

    if (_unwantedBids.length) {
      setOpenInvalidModal(true);
    }

    const updatedState = editState.map((row) => {
      if (selectedRowIds.includes(row.id as string | number)) {
        return {
          ...row,
          bid: getCalculatedBudgetBid(
            parseNum(row.bid),
            newBid,
            selectedAdjustment.value
          ),
        };
      }

      return row;
    });

    dispatch(setEditState(updatedState as ISPAdvertisingData[]));
    setTableData(updatedState as ISPAdvertisingData[]);
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
          onClose={handleBidClose}
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
          description={errorMsg}
          openConfirmation={openInvalidModal}
          handleConfirmationClose={cancelInvalidModalClick}
          isConfirmButtonRequired={false}
        />
      )}
    </div>
  );
}
