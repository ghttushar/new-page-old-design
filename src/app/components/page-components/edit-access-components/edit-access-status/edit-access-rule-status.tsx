import CustomAntSwitchTooltip from '@/app/components/common/ant-switch/ant-switch';
import LoaderWrapper from '@/app/components/common/loader-wrapper/loader-wrapper';
import { RULES_STATUS_MAPPING } from '@/constants/rules/rules.constants';
import { EditAccessValues } from '@/enums/edit-access.enums';
import { RuleStatusEnum } from '@/enums/rules.enum';
import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { IAppliedRulesUpdatePayload } from '@/interfaces/rules/rules.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppMutation } from '@/redux/react-query-hooks';
import { selectEditAccessFilters } from '@/redux/slices/advertising/advertising-edit-access.slice';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from '@/redux/slices/notifications/toast-message.slice';
import {
  selectAppliedRulesById,
  setUpdateAppliedRules,
} from '@/redux/slices/rules/rules.slice';
import rulesServices from '@/services/rules/rules.services';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface IEditAccessRuleStatusProps {
  ruleId: string;
  status: RuleStatusEnum;
  isDraft: boolean;
}

export default function EditAccessRuleStatus({
  status,
  ruleId,
  isDraft,
}: IEditAccessRuleStatusProps) {
  const normalizedStatus = status?.toUpperCase() as RuleStatusEnum;

  const isDraftStatus =
    isDraft === true && normalizedStatus === RuleStatusEnum.DRAFT;
  const isEndedStatus = normalizedStatus === RuleStatusEnum.ENDED;
  const isArchivedStatus = normalizedStatus === RuleStatusEnum.ARCHIVED;
  const isNonInteractiveStatus =
    isDraftStatus || isEndedStatus || isArchivedStatus;

  const isInitialChecked =
    normalizedStatus === RuleStatusEnum.ENABLED && isDraft === false;

  const [isStatusChecked, setIsStatusChecked] =
    useState<boolean>(isInitialChecked);

  const statusRollbackRef = useRef<boolean>(isInitialChecked);
  const appliedRulesById = useAppSelector(selectAppliedRulesById);
  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const dispatch = useAppDispatch();

  const isViewMode = useMemo(
    () => editAccessFilters.editAccess.value === EditAccessValues.View,
    [editAccessFilters.editAccess.value]
  );

  const isSwitchDisabled = isNonInteractiveStatus || isViewMode;

  const {
    mutateAsync: updateRule,
    isIdle: isUpdateRuleIdle,
    isPending: isUpdateRulePending,
  } = useAppMutation({
    mutationFn: async ({
      payload,
      nextStatus,
    }: {
      payload: IAppliedRulesUpdatePayload;
      nextStatus: RuleStatusEnum;
    }) => {
      const response = await rulesServices.patchUpdateAppliedRule(payload);

      return {
        response,
        nextStatus,
      };
    },
    options: {
      onSuccess: ({ response, nextStatus }) => {
        if (appliedRulesById) {
          const selectedAppliedRule = appliedRulesById[ruleId];

          dispatch(
            setUpdateAppliedRules({
              ruleIdKey: ruleId,
              value: {
                ...selectedAppliedRule,
                status: nextStatus,
              },
            })
          );
        }

        dispatch(
          showSuccessToastMessage({
            title: response.data.message,
            description: response.data.description,
          })
        );
      },
      onError: () => {
        setIsStatusChecked(statusRollbackRef.current);
      },
    },
  });

  const handleStatusChange = async () => {
    const prevStatus = isStatusChecked;
    const updatedStatus = !prevStatus;
    statusRollbackRef.current = prevStatus;

    setIsStatusChecked(updatedStatus);
    const statusValue = updatedStatus
      ? RuleStatusEnum.ENABLED
      : RuleStatusEnum.PAUSED;

    try {
      const payload: IAppliedRulesUpdatePayload = {
        updates: [
          {
            ruleId: ruleId,
            status: statusValue,
          },
        ],
      };

      await updateRule({
        payload: payload,
        nextStatus: statusValue,
      });
    } catch (error) {
      setIsStatusChecked(prevStatus);
      dispatch(
        showErrorToastMessage({
          title: 'Update Failed!',
          description:
            'Rule status update failed due to unknown reason. Please try again.',
        })
      );
    }
  };

  const isEditLoading = useMemo(
    () => isUpdateRuleIdle === false && isUpdateRulePending === true,
    [isUpdateRuleIdle, isUpdateRulePending]
  );

  useEffect(() => {
    setIsStatusChecked(
      normalizedStatus === RuleStatusEnum.ENABLED && isDraft === false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedStatus, isDraft]);

  const tooltipTitle = useMemo(() => {
    if (isViewMode) return 'Disabled due to View mode';

    return RULES_STATUS_MAPPING[normalizedStatus] ?? '';
  }, [isViewMode, normalizedStatus]);

  return (
    <React.Fragment>
      {isEditLoading === true && <LoaderWrapper />}
      <CustomAntSwitchTooltip
        isSwitchDisabled={isSwitchDisabled}
        isTooltipDisabled={!isSwitchDisabled}
        isChecked={isStatusChecked}
        onChange={handleStatusChange}
        className={normalizedStatus !== RuleStatusEnum.ENABLED ? 'paused' : ''}
        tooltipTitle={tooltipTitle}
        tooltipPosition={TooltipPlacement.Right}
      />
    </React.Fragment>
  );
}
