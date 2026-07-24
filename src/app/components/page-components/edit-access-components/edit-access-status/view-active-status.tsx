import { ISPAdvertisingData } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useEffect, useState } from 'react';
import CustomAntSwitchTooltip from 'src/app/components/common/ant-switch/ant-switch';
import { CampaignStateEnum } from 'src/enums/advertising.enums';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import { WalmartCampaignStatusEnum } from 'src/enums/walmart.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectEditAccessFilters,
  selectEditState,
  setEditState,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';

interface IEditAccessStatusProps {
  id: string | number;
  status: string;
}

export default function ViewStatus({ id, status }: IEditAccessStatusProps) {
  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const editState = useAppSelector(selectEditState);
  const dispatch = useAppDispatch();

  const isChecked =
    status?.toUpperCase() === CampaignStateEnum.ENABLED ||
    status === WalmartCampaignStatusEnum.LIVE;
  const isDisabled = true;
  const isArchived = status?.toUpperCase() === CampaignStateEnum.ARCHIVED;

  const [isStatusChecked, setIsStatusChecked] = useState<boolean>(isChecked);

  const handleStatusChange = () => {
    setIsStatusChecked(!isStatusChecked);

    const updatedTable = editState.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          status: !isStatusChecked
            ? CampaignStateEnum.ENABLED
            : CampaignStateEnum.PAUSED,
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
      isSwitchDisabled={isDisabled || isArchived}
      isTooltipDisabled={!isDisabled}
      isChecked={isStatusChecked}
      onChange={handleStatusChange}
      className={
        status?.toUpperCase() === CampaignStateEnum.PAUSED ? 'paused' : ''
      }
      tooltipTitle={
        isStatusChecked
          ? CampaignStateEnum.ENABLED
          : isArchived
          ? CampaignStateEnum.ARCHIVED
          : CampaignStateEnum.PAUSED
      }
      tooltipPosition={'right' as TooltipPlacement}
    />
  );
}
