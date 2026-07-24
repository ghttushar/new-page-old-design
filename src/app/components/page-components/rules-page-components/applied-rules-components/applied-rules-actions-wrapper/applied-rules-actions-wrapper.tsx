import ConfirmationBox from '@/app/components/common/confirmation-box/confirmation-box';
import HoverInfoTooltip from '@/app/components/common/hover-info-tooltip/hover-info-tooltip';
import { FeatureRoutes } from '@/enums/auth.enums';
import { EditAccessValues } from '@/enums/edit-access.enums';
import { RuleDetailsTypeEnum, RuleStatusEnum } from '@/enums/rules.enum';
import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { useOutsideClick } from '@/hooks/use-outside-click.hook';
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
import { DotsThreeVerticalIcon } from '@phosphor-icons/react';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './applied-rules-actions-wrapper.module.scss';

interface IAppliedRulesActionsWrapperProps {
  ruleId: string;
  ruleName: string;
}

interface IActionMenuOption {
  title: string;
  onClick: () => void;
  isDisabled?: boolean;
  disableReason?: string;
}

export default function AppliedRulesActionsWrapper({
  ruleId,
  ruleName,
}: IAppliedRulesActionsWrapperProps) {
  const appliedRulesById = useAppSelector(selectAppliedRulesById);
  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [openArchiveConfirmation, setOpenArchiveConfirmation] =
    useState<boolean>(false);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  const isArchived = useMemo(
    () =>
      appliedRulesById &&
      appliedRulesById[ruleId].status === RuleStatusEnum.ARCHIVED,
    [appliedRulesById, ruleId]
  );

  const isViewMode = useMemo(
    () => editAccessFilters.editAccess.value === EditAccessValues.View,
    [editAccessFilters.editAccess.value]
  );

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
    },
  });

  const handleArchiveStatusChange = async () => {
    try {
      const payload: IAppliedRulesUpdatePayload = {
        updates: [
          {
            ruleId: ruleId,
            status: RuleStatusEnum.ARCHIVED,
          },
        ],
      };

      await updateRule({
        payload: payload,
        nextStatus: RuleStatusEnum.ARCHIVED,
      });
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

  const isArchiveLoading = useMemo(
    () => isUpdateRuleIdle === false && isUpdateRulePending === true,
    [isUpdateRuleIdle, isUpdateRulePending]
  );

  const handleEdit = () => {
    navigate(
      `/${FeatureRoutes.RULES}/${FeatureRoutes.RULES_AGENTS}/${FeatureRoutes.RULE_CREATION}/${RuleDetailsTypeEnum.RULE}=${ruleId}`
    );
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleArchiveOptionClick = () => {
    handleCloseMenu();
    setOpenArchiveConfirmation(true);
  };

  const handleArchiveConfirmationClose = () => {
    setOpenArchiveConfirmation(false);
  };

  const handleEditOptionClick = () => {
    handleCloseMenu();
    handleEdit();
  };

  useOutsideClick({
    containerRef: menuContainerRef,
    handleClose: handleCloseMenu,
  });

  const menuOptions: IActionMenuOption[] = isArchived
    ? [{ title: 'View', onClick: handleEditOptionClick }]
    : [
        { title: 'Edit', onClick: handleEditOptionClick },
        {
          title: 'Archive',
          onClick: handleArchiveOptionClick,
          isDisabled: isViewMode,
          disableReason: isViewMode ? 'Disabled due to View mode' : undefined,
        },
      ];

  return (
    <div className={styles.actionsWrapper} ref={menuContainerRef}>
      <DotsThreeVerticalIcon
        className={styles.actionIcon}
        size={'2rem'}
        color="#000000"
        weight="bold"
        onClick={handleToggleMenu}
      />

      {isMenuOpen && (
        <div className={styles.optionsContainer}>
          {menuOptions.map((option) => (
            <HoverInfoTooltip
              key={option.title}
              title={option.disableReason ?? ''}
              disableTooltip={!option.isDisabled || !option.disableReason}
              position={TooltipPlacement.Left}
            >
              <div
                className={`${styles.option} ${
                  option.isDisabled ? styles['disabled-option'] : ''
                }`}
                onClick={!option.isDisabled ? option.onClick : undefined}
              >
                <span>{option.title}</span>
              </div>
            </HoverInfoTooltip>
          ))}
        </div>
      )}

      <ConfirmationBox
        title="Archive Rule?"
        description={
          <p className={styles.popupDescription}>
            Archived rules cannot be edited, restored, or reactivated. This
            action is permanent.
            <br />
            Are you sure you want to archive{' '}
            <span className={styles.ruleName}>'{ruleName}'</span> rule?
          </p>
        }
        openConfirmation={openArchiveConfirmation}
        handleConfirmationClose={handleArchiveConfirmationClose}
        isConfirmButtonRequired={true}
        handleConfirmClick={handleArchiveStatusChange}
        isLoading={isArchiveLoading}
        confirmButtonText="Move to Archive"
        loadingText="Please wait..."
        maxWidth="sm"
        isNewDesign={true}
        fullWidthActionButtons={true}
      />
    </div>
  );
}
