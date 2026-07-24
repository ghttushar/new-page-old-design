import { ISPAdvertisingData } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useEffect, useState } from 'react';
import CustomAntSwitchTooltip from 'src/app/components/common/ant-switch/ant-switch';
import { RuleAutomationStatusEnum } from 'src/enums/advertising.enums';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectEditAccessFilters,
  selectEditState,
  setEditState,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';

interface IEditAccessRuleAutomationStatusProps {
  id: string | number;
  status: RuleAutomationStatusEnum | null;
  campaignAutomationStatus?: RuleAutomationStatusEnum | null;
  automationStatusFieldName: string;
}

export default function EditAccessRuleAutomationStatus({
  id,
  status,
  campaignAutomationStatus,
  automationStatusFieldName,
}: IEditAccessRuleAutomationStatusProps) {
  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const editState = useAppSelector(selectEditState);
  const dispatch = useAppDispatch();

  const isChecked = status?.toUpperCase() === RuleAutomationStatusEnum.ENABLED;

  const isDisabled =
    editAccessFilters.editAccess.value === EditAccessValues.View ||
    !status ||
    (campaignAutomationStatus !== undefined &&
      (!campaignAutomationStatus ||
        campaignAutomationStatus === RuleAutomationStatusEnum.PAUSED));

  const [isStatusChecked, setIsStatusChecked] = useState<boolean>(isChecked);

  const handleStatusChange = () => {
    const updatedStatus = !isStatusChecked;
    setIsStatusChecked(updatedStatus);

    const updatedTable = editState.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          [automationStatusFieldName]: updatedStatus
            ? RuleAutomationStatusEnum.ENABLED
            : RuleAutomationStatusEnum.PAUSED,
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
      isSwitchDisabled={isDisabled}
      isTooltipDisabled={!isDisabled}
      isChecked={isStatusChecked}
      onChange={handleStatusChange}
      className={
        !status || status?.toUpperCase() === RuleAutomationStatusEnum.PAUSED
          ? 'paused'
          : ''
      }
      tooltipTitle={status ? status.toUpperCase() : ''}
      tooltipPosition={'right' as TooltipPlacement}
    />
  );
}
