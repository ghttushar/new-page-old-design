import { MarketplaceEnum } from '@/enums/serp.enums';
import { ISPAdvertisingData } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IEditBulkActionProp } from '@/interfaces/edit-access/edit-access.interface';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { Calendar } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { IWalmartSPAdvertisingData } from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  resetDialogs,
  selectEditState,
  selectIsOpenEndDateDialog,
  selectSelectedRowIds,
  setEditState,
  setIsOpenEndDateDialog,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { getCurrentDateTime } from 'src/utils';
import ActionConfirmationDialog from '../../action-confirmation-dialog/action-confirmation-dialog';
import SingleDatePicker from '../../single-date-picker/single-date-picker';
import TextButton from '../../text-button/text-button';
import styles from '../bulk-actions.module.scss';

type IEndDateActionProps = IEditBulkActionProp;

export default function EndDateAction({ setTableData }: IEndDateActionProps) {
  const [endDate, setEndDate] = useState<string>('');

  const dispatch = useAppDispatch();
  const isOpenEndDateDialog = useAppSelector(selectIsOpenEndDateDialog);
  const editState = useAppSelector(selectEditState);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as string,
    [advertisingAccount.marketplace]
  );

  const handleEndDateClick = () => {
    dispatch(setIsOpenEndDateDialog());
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleEndDateApply = () => {
    const updatedState = editState.map((row) => {
      if (selectedRowIds.includes(row.id as string | number)) {
        return {
          ...row,
          endDate: endDate,
        };
      }

      return row;
    });

    dispatch(
      setEditState(
        updatedState as ISPAdvertisingData[] | IWalmartSPAdvertisingData[]
      )
    );
    setTableData(
      updatedState as ISPAdvertisingData[] | IWalmartSPAdvertisingData[]
    );
    dispatch(resetDialogs());
  };

  return (
    <div className={styles.buttonDialogContainer}>
      <TextButton
        label="End Date"
        handleClick={handleEndDateClick}
        isVisible={true}
        buttonStartIcon={<Calendar />}
        isDisabled={!selectedRowIds.length}
        disableReason="No row selected"
        isNewDesign={true}
        isSelected={isOpenEndDateDialog}
      />
      {isOpenEndDateDialog === true && (
        <ActionConfirmationDialog
          dialogMessage="Are you sure you want to apply this End Date?"
          onApply={handleEndDateApply}
          isApplyDisabled={
            (selectedMarketplace === MarketplaceEnum.WALMART &&
              endDate === '') ||
            selectedRowIds.length === 0
          }
          onClose={() => dispatch(resetDialogs())}
          isErrorPopupOpen={false}
        >
          <SingleDatePicker
            label=""
            value={endDate}
            onChange={handleEndDateChange}
            isMaxDateRequired={false}
            minDate={getCurrentDateTime().split('_')[0]}
            isDisabled={false}
          />
        </ActionConfirmationDialog>
      )}
    </div>
  );
}
