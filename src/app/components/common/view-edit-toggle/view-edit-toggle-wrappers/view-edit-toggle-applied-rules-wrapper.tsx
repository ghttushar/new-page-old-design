import { DISABLE_TOOLTIP } from '@/enums/tooltip-texts.enums';
import accessControlUtils from '@/utils/access-control/access-control.utils';
import { useEffect } from 'react';
import { advEditAccessTabData } from 'src/constants/advertising-filter.constants';
import { APPLIED_RULES_BULK_ACTIONS } from 'src/constants/rules/rules.constants';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectEditAccessFilters,
  setEditAccess,
  setSelectedRows,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { ITabData } from '../../tabs-select/tabs-select';
import ViewEditToggle from '../view-edit-toggle';

interface IViewEditToggleAppliedRulesWrapperProps {
  totalItems: number | string;
}

export default function ViewEditToggleAppliedRulesWrapper({
  totalItems,
}: IViewEditToggleAppliedRulesWrapperProps) {
  const dispatch = useAppDispatch();
  const editAccessFilters = useAppSelector(selectEditAccessFilters);

  const hasAdminManagerAccess = accessControlUtils.hasAdminManagerAccess();

  useEffect(() => {
    dispatch(setEditAccess(advEditAccessTabData[0]));
    dispatch(setSelectedRows({}));
  }, [dispatch]);

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: ITabData
  ) => {
    dispatch(setEditAccess(value));
    dispatch(setSelectedRows({}));
  };

  return (
    <ViewEditToggle
      tabValue={editAccessFilters.editAccess}
      tabData={advEditAccessTabData}
      handleTabChange={handleTabChange}
      toggleDisabled={!hasAdminManagerAccess}
      disableReason={
        !hasAdminManagerAccess
          ? DISABLE_TOOLTIP.ADMIN_MANAGER_ACCESS
          : undefined
      }
      showEditControls={
        editAccessFilters.editAccess.value === EditAccessValues.Edit
      }
      isBulkActionsVisible={true}
      bulkActions={APPLIED_RULES_BULK_ACTIONS}
      hideSaveCancelButtons={true}
      hideClearAllButton={true}
      totalItems={totalItems}
    />
  );
}
