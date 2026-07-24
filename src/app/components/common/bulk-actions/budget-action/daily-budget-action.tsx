import { IEditBulkActionProp } from '@/interfaces/edit-access/edit-access.interface';
import { displayValue } from '@/utils';
import { CurrencyDollar } from '@phosphor-icons/react';
import { useState } from 'react';
import { adjustmentOptions } from 'src/constants/advertising-filter.constants';
import {
  WALMART_1P_DAILY_BUDGET_MIN,
  WALMART_3P_DAILY_BUDGET_MIN,
  WALMART_BUDGET_MAX,
} from 'src/constants/advertising-walmart.constants';
import { Adjustments } from 'src/enums/advertising.enums';
import {
  WalmartAccountTypeEnum,
  WalmartBudgetTypeEnum,
} from 'src/enums/walmart.enums';
import {
  IWalmartCampaign,
  IWalmartSPAdvertisingData,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  resetDialogs,
  selectEditState,
  selectIsOpenBudgetDialog,
  selectSelectedRowIds,
  setEditState,
  setIsOpenBudgetDialog,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { getCalculatedBudgetBid } from 'src/utils/advertising.utils';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import ActionConfirmationDialog from '../../action-confirmation-dialog/action-confirmation-dialog';
import ConfirmationBox from '../../confirmation-box/confirmation-box';
import { IDropdownItem } from '../../dropdown/dropdown';
import DropdownTextfield from '../../dropdown/dropdown-textfield';
import TextButton from '../../text-button/text-button';
import styles from '../bulk-actions.module.scss';

type IBudgetActionProps = IEditBulkActionProp;

export default function DailyBudgetAction({
  setTableData,
}: IBudgetActionProps) {
  const [selectedAdjustment, setSelectedAdjustment] = useState<
    IDropdownItem<Adjustments>
  >(adjustmentOptions[0]);
  const [newBudget, setNewBudget] = useState<number | typeof NaN>(0);
  const [openInvalidModal, setOpenInvalidModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const dispatch = useAppDispatch();
  const isOpenBudgetDialog = useAppSelector(selectIsOpenBudgetDialog);
  const editState = useAppSelector(selectEditState) as IWalmartCampaign[];
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const walmartAccount = localStorageUtils.getSelectedAdvertisingAccount();

  const handleBudgetClick = () => {
    dispatch(setIsOpenBudgetDialog());
  };

  const handleBudgetApply = () => {
    const _unwantedBudgets: Array<unknown> = [];
    setErrorMsg('');

    editState.forEach((row) => {
      if (selectedRowIds.includes(row.id as string | number)) {
        if (row.budgetType === WalmartBudgetTypeEnum.TOTAL) return;

        const updatedBudget = getCalculatedBudgetBid(
          Number(row.dailyBudget),
          newBudget,
          selectedAdjustment.value
        );

        if (
          (walmartAccount?.accountType === WalmartAccountTypeEnum.THIRD_PARTY &&
            updatedBudget < WALMART_3P_DAILY_BUDGET_MIN) ||
          (walmartAccount?.accountType === WalmartAccountTypeEnum.FIRST_PARTY &&
            updatedBudget < WALMART_1P_DAILY_BUDGET_MIN) ||
          updatedBudget > WALMART_BUDGET_MAX
        ) {
          if (
            walmartAccount?.accountType ===
              WalmartAccountTypeEnum.THIRD_PARTY &&
            updatedBudget < WALMART_3P_DAILY_BUDGET_MIN
          ) {
            setErrorMsg(
              `Some daily budgets are lower than ${displayValue(
                WALMART_3P_DAILY_BUDGET_MIN,
                false
              )}, which is not allowed for 3P accounts.`
            );
          }

          if (
            walmartAccount?.accountType ===
              WalmartAccountTypeEnum.FIRST_PARTY &&
            updatedBudget < WALMART_1P_DAILY_BUDGET_MIN
          ) {
            setErrorMsg(
              `Some daily budgets are lower than ${displayValue(
                WALMART_1P_DAILY_BUDGET_MIN,
                false
              )}, which is not allowed for 1P accounts.`
            );
          }

          if (updatedBudget > WALMART_BUDGET_MAX) {
            setErrorMsg(
              `Daily budget cannot exceed ${displayValue(
                WALMART_BUDGET_MAX,
                false
              )}.`
            );
          }

          _unwantedBudgets.push(updatedBudget);
        } else {
          setErrorMsg('');
        }
      }
    });

    if (_unwantedBudgets.length) {
      setOpenInvalidModal(true);
    }

    const updatedState = editState.map((row) => {
      if (
        selectedRowIds.includes(row.id as string | number) &&
        row.budgetType !== WalmartBudgetTypeEnum.TOTAL
      ) {
        return {
          ...row,
          dailyBudget: getCalculatedBudgetBid(
            Number(row.dailyBudget),
            newBudget,
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

  const handleBudgetOptionChange = (value: IDropdownItem<Adjustments>) => {
    setSelectedAdjustment(value);
  };

  const handleBudgetChange = (value: number) => {
    setNewBudget(value);
  };

  const cancelInvalidModalClick = () => {
    setOpenInvalidModal(false);
  };

  return (
    <div className={styles.buttonDialogContainer}>
      <TextButton
        label="Daily Budget"
        handleClick={handleBudgetClick}
        isVisible={true}
        buttonStartIcon={<CurrencyDollar />}
        isDisabled={!selectedRowIds.length}
        disableReason="No row selected"
        isNewDesign={true}
        isSelected={isOpenBudgetDialog}
      />
      {isOpenBudgetDialog === true && (
        <ActionConfirmationDialog
          dialogMessage="Are you sure you adjust budget? This action might affect the spends."
          onApply={handleBudgetApply}
          onClose={() => dispatch(resetDialogs())}
          isApplyDisabled={selectedRowIds.length === 0}
          isErrorPopupOpen={openInvalidModal}
        >
          <DropdownTextfield
            label=""
            options={adjustmentOptions}
            selected={selectedAdjustment}
            onSelect={handleBudgetOptionChange}
            fieldValue={newBudget}
            onValueChange={handleBudgetChange}
            stopPropagation={true}
          />
        </ActionConfirmationDialog>
      )}

      {openInvalidModal === true && (
        <ConfirmationBox
          title="Invalid Daily Budget."
          description={errorMsg}
          openConfirmation={openInvalidModal}
          handleConfirmationClose={cancelInvalidModalClick}
          isConfirmButtonRequired={false}
        />
      )}
    </div>
  );
}
