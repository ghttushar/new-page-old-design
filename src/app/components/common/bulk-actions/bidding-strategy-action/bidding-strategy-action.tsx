import {
  ICampaign,
  ISPAdvertisingData,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IEditBulkActionProp } from '@/interfaces/edit-access/edit-access.interface';
import { Gavel } from '@phosphor-icons/react';
import { useState } from 'react';
import { biddingStrategyOptions } from 'src/constants/advertising-filter.constants';
import { BiddingStrategy } from 'src/enums/advertising.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  resetDialogs,
  selectEditState,
  selectIsOpenBiddingStrategyDialog,
  selectSelectedRowIds,
  setEditState,
  setIsOpenBiddingStrategyDialog,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import ActionConfirmationDialog from '../../action-confirmation-dialog/action-confirmation-dialog';
import Dropdown, { IDropdownItem } from '../../dropdown/dropdown';
import TextButton from '../../text-button/text-button';
import styles from '../bulk-actions.module.scss';

type IBiddingStrategyActionProps = IEditBulkActionProp;

export default function BiddingStrategyAction({
  setTableData,
}: IBiddingStrategyActionProps) {
  const [selectedBidding, setSelectedBidding] = useState<
    IDropdownItem<BiddingStrategy>
  >(biddingStrategyOptions[0]);

  const dispatch = useAppDispatch();
  const isOpenBiddingStrategyDialog = useAppSelector(
    selectIsOpenBiddingStrategyDialog
  );
  const editState = useAppSelector(selectEditState) as ICampaign[];
  const selectedRowIds = useAppSelector(selectSelectedRowIds);

  const handleBiddingClick = () => {
    dispatch(setIsOpenBiddingStrategyDialog());
  };

  const handleBiddingApply = () => {
    const updatedState = editState.map((row) => {
      if (selectedRowIds.includes(row.id as string | number)) {
        return {
          ...row,
          dynamicBidding: {
            placementBidding: row.dynamicBidding.placementBidding,
            strategy: selectedBidding.value,
          },
        };
      }

      return row;
    });

    dispatch(setEditState(updatedState as ISPAdvertisingData[]));
    setTableData(updatedState as ISPAdvertisingData[]);
    dispatch(resetDialogs());
  };

  const handleBiddingOptionChange = (value: IDropdownItem<BiddingStrategy>) => {
    setSelectedBidding(value);
  };

  return (
    <div className={styles.buttonDialogContainer}>
      <TextButton
        label="Bidding Strategy"
        handleClick={handleBiddingClick}
        isVisible={true}
        buttonStartIcon={<Gavel />}
        isDisabled={!selectedRowIds.length}
        disableReason="No row selected"
        isNewDesign={true}
        isSelected={isOpenBiddingStrategyDialog}
      />
      {isOpenBiddingStrategyDialog === true && (
        <ActionConfirmationDialog
          dialogMessage="Are you sure you want to apply this rule?"
          onApply={handleBiddingApply}
          onClose={() => dispatch(resetDialogs())}
          isApplyDisabled={selectedRowIds.length === 0}
          isErrorPopupOpen={false}
        >
          <Dropdown
            options={biddingStrategyOptions}
            selected={selectedBidding}
            label=""
            onSelect={handleBiddingOptionChange}
            stopPropagation={true}
            width="100%"
            fontColor="#77469B"
          />
        </ActionConfirmationDialog>
      )}
    </div>
  );
}
