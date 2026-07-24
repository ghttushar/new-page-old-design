import ConfirmationBox from '@/app/components/common/confirmation-box/confirmation-box';
import { RuleStatusEnum } from '@/enums/rules.enum';
import { IAppliedRulesUpdatePayload } from '@/interfaces/rules/rules.interfaces';
import { useAppDispatch } from '@/redux/hooks';
import { useAppMutation } from '@/redux/react-query-hooks';
import { setSelectedRows } from '@/redux/slices/advertising/advertising-edit-access.slice';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from '@/redux/slices/notifications/toast-message.slice';
import { setBulkUpdateAppliedRules } from '@/redux/slices/rules/rules.slice';
import rulesServices from '@/services/rules/rules.services';
import { useMemo } from 'react';

interface IRulesBulkActionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  ruleIds: string[];
  status: RuleStatusEnum;
  title: string;
  description: string | JSX.Element;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export default function RulesBulkActionConfirmation({
  isOpen,
  onClose,
  ruleIds,
  status,
  title,
  description,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
}: IRulesBulkActionConfirmationProps) {
  const dispatch = useAppDispatch();

  const {
    mutateAsync: updateRules,
    isIdle: isUpdateRulesIdle,
    isPending: isUpdateRulesPending,
  } = useAppMutation({
    mutationFn: async (payload: IAppliedRulesUpdatePayload) => {
      const response = await rulesServices.patchUpdateAppliedRule(payload);

      return response;
    },
    options: {
      onSuccess: (response) => {
        dispatch(
          setBulkUpdateAppliedRules({
            ruleIdKeys: ruleIds,
            changes: { status },
          })
        );

        dispatch(setSelectedRows({}));

        dispatch(
          showSuccessToastMessage({
            title: response.data.message,
            description: response.data.description,
          })
        );

        onClose();
      },
    },
  });

  const handleConfirmClick = async () => {
    try {
      const payload: IAppliedRulesUpdatePayload = {
        updates: ruleIds.map((ruleId) => ({ ruleId, status })),
      };

      await updateRules(payload);
    } catch (error) {
      dispatch(
        showErrorToastMessage({
          title: 'Update Failed!',
          description:
            'Rule status update failed due to unknown reason. Please try again.',
        })
      );
    }
  };

  const isLoading: boolean = useMemo(
    () => isUpdateRulesIdle === false && isUpdateRulesPending === true,
    [isUpdateRulesIdle, isUpdateRulesPending]
  );

  return (
    <ConfirmationBox
      title={title}
      description={description}
      openConfirmation={isOpen}
      handleConfirmationClose={onClose}
      isConfirmButtonRequired={true}
      handleConfirmClick={handleConfirmClick}
      isLoading={isLoading}
      confirmButtonText={confirmButtonText}
      cancelButtonText={cancelButtonText}
      loadingText="Please wait..."
      maxWidth="sm"
      isNewDesign={true}
      fullWidthActionButtons={true}
    />
  );
}
