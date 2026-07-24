import { ISPAdvertisingData } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IEditBulkActionProp } from '@/interfaces/edit-access/edit-access.interface';
import { ArchiveIcon } from '@phosphor-icons/react';
import { CampaignStateEnum } from 'src/enums/advertising.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectEditState,
  selectSelectedRowIds,
  setEditState,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import TextButton from '../../text-button/text-button';

type IAdvertisingArchiveActionProps = IEditBulkActionProp;

export default function AdvertisingArchiveAction({
  setTableData,
}: IAdvertisingArchiveActionProps) {
  const dispatch = useAppDispatch();
  const editState = useAppSelector(selectEditState);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);

  const handleArchiveClick = () => {
    const updatedState = editState.map((row) => {
      if (selectedRowIds.includes(row.id as string | number)) {
        return {
          ...row,
          status: CampaignStateEnum.ARCHIVED,
        };
      }

      return row;
    });

    dispatch(setEditState(updatedState as ISPAdvertisingData[]));
    setTableData(updatedState as ISPAdvertisingData[]);
  };

  return (
    <TextButton
      label="Archive"
      handleClick={handleArchiveClick}
      isVisible={true}
      buttonStartIcon={<ArchiveIcon size={16} color="#77469B" weight="bold" />}
      customStyles={{ fontSize: '1rem' }}
      isDisabled={true}
      isNewDesign={true}
    />
  );
}
