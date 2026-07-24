import { MarketplaceEnum } from '@/enums/serp.enums';
import { IOverallCampaign } from '@/interfaces/advertising/amazon/overall-advertising.interface';
import { ISBCampaign } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDCampaign } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import {
  ICampaign,
  ISPAdvertisingData,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IEditBulkActionProp } from '@/interfaces/edit-access/edit-access.interface';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { CurrencyDollar } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { adjustmentOptions } from 'src/constants/advertising-filter.constants';
import { Adjustments } from 'src/enums/advertising.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  resetDialogs,
  selectEditState,
  selectIsOpenBudgetDialog,
  selectSelectedRowIds,
  setEditState,
  setIsOpenBudgetDialog,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { selectAdvertisingHeaderFilters } from 'src/redux/slices/advertising/advertising-filter.slice';
import {
  checkAmazonBudgetLimit,
  getCalculatedBudgetBid,
  hasAmazonSPBudgetProp,
} from 'src/utils/advertising.utils';
import ActionConfirmationDialog from '../../action-confirmation-dialog/action-confirmation-dialog';
import ConfirmationBox from '../../confirmation-box/confirmation-box';
import { IDropdownItem } from '../../dropdown/dropdown';
import DropdownTextfield from '../../dropdown/dropdown-textfield';
import TextButton from '../../text-button/text-button';
import styles from '../bulk-actions.module.scss';

type IBudgetActionProps = IEditBulkActionProp;

export default function BudgetAction({ setTableData }: IBudgetActionProps) {
  const [selectedAdjustment, setSelectedAdjustment] = useState<
    IDropdownItem<Adjustments>
  >(adjustmentOptions[0]);
  const [newBudget, setNewBudget] = useState<number | typeof NaN>(0);
  const [openInvalidModal, setOpenInvalidModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const dispatch = useAppDispatch();
  const isOpenBudgetDialog = useAppSelector(selectIsOpenBudgetDialog);
  const editState = useAppSelector(selectEditState) as
    | ICampaign[]
    | ISBCampaign[]
    | ISDCampaign[]
    | IOverallCampaign[];
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);

  const selectedAdvertisingAccount =
    localStorageUtils.getSelectedAdvertisingAccount();
  const selectedAccountType = useMemo(() => {
    if (
      selectedAdvertisingAccount &&
      selectedAdvertisingAccount.marketplace === MarketplaceEnum.AMAZON
    ) {
      return selectedAdvertisingAccount.accountType;
    } else {
      return undefined;
    }
  }, [selectedAdvertisingAccount]);

  const handleBudgetClick = () => {
    dispatch(setIsOpenBudgetDialog());
  };

  const handleBudgetApply = () => {
    const _unwantedBudgets: Array<unknown> = [];
    setErrorMsg('');

    editState.forEach((row) => {
      const editRowBudget = hasAmazonSPBudgetProp(row)
        ? row.budget.budget
        : row.budget;

      const budgetType = hasAmazonSPBudgetProp(row)
        ? row.budget.budgetType
        : row.budgetType;

      if (selectedRowIds.includes(row.id as string | number)) {
        const updatedBudget = getCalculatedBudgetBid(
          editRowBudget,
          newBudget,
          selectedAdjustment.value
        );

        const budgetLimitErr = checkAmazonBudgetLimit(
          parseFloat(`${updatedBudget}`),
          advHeaderFilters.adType.value,
          selectedAccountType,
          budgetType,
          MarketplaceEnum.AMAZON
        );

        if (budgetLimitErr) {
          _unwantedBudgets.push(updatedBudget);
          setErrorMsg(`${budgetLimitErr}`);
        }
      }
    });

    if (_unwantedBudgets.length) {
      setOpenInvalidModal(true);
    }

    const updatedState = editState.map((row) => {
      if (selectedRowIds.includes(row.id as string | number)) {
        return {
          ...row,
          budget: hasAmazonSPBudgetProp(row)
            ? {
                budgetType: row.budget.budgetType,
                budget: getCalculatedBudgetBid(
                  row.budget.budget,
                  newBudget,
                  selectedAdjustment.value
                ),
              }
            : getCalculatedBudgetBid(
                row.budget,
                newBudget,
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
        label="Budget"
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
          title="Invalid Budget."
          description={errorMsg}
          openConfirmation={openInvalidModal}
          handleConfirmationClose={cancelInvalidModalClick}
          isConfirmButtonRequired={false}
        />
      )}
    </div>
  );
}
