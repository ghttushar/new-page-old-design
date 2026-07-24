import TextButton from '@/app/components/common/text-button/text-button';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { RULES_TOOLTIPS, TooltipPlacement } from '@/enums/tooltip-texts.enums';
import {
  IRuleAdjustment,
  IRuleConstraints,
  IRuleConstraintsDropdownOptions,
  IRuleCriteriaDetails,
} from '@/interfaces/rules/rules.interfaces';
import { useAppSelector } from '@/redux/hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import {
  selectIsRuleArchived,
  selectSelectedRuleType,
} from '@/redux/slices/rules/rules.slice';
import { getNewAdjustment } from '@/utils/rules.utils';
import { PlusIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';
import styles from '../../rule-criteria-priority-card.module.scss';
import RuleCriteriaAdjustmentAction from './rule-criteria-adjustment-action';

interface IRuleCriteriaAdjustmentActionWrapperProps {
  currCriteria: IRuleCriteriaDetails;
  handleCriteriaChange: (value: IRuleCriteriaDetails) => void;
  constraints: IRuleConstraints;
  constraintsOptions: IRuleConstraintsDropdownOptions;
}

export default function RuleCriteriaAdjustmentWrapper({
  currCriteria,
  handleCriteriaChange,
  constraints,
  constraintsOptions,
}: IRuleCriteriaAdjustmentActionWrapperProps) {
  const selectedRuleType = useAppSelector(selectSelectedRuleType);
  const isRuleArchived = useAppSelector(selectIsRuleArchived);
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAdvertisingAccount.marketplace]
  );

  const adjustmentActions = useMemo(
    () => currCriteria.action.adjustments ?? [],
    [currCriteria.action.adjustments]
  );

  const formattedConstraintsOptions: IRuleConstraintsDropdownOptions =
    useMemo(() => {
      const selectedTargets = adjustmentActions
        .map((item) => item.target)
        .filter((item) => Boolean(item));

      return {
        ...constraintsOptions,
        adjustmentTargetOptions: constraintsOptions.adjustmentTargetOptions.map(
          (item) => ({
            ...item,
            isDisabled: selectedTargets.includes(item.value),
            tooltipText: selectedTargets.includes(item.value)
              ? 'Already selected'
              : '',
          })
        ),
      };
    }, [adjustmentActions, constraintsOptions]);

  const isAddAdjustmentActionDisabled = useMemo(
    () =>
      adjustmentActions.length >=
        formattedConstraintsOptions.adjustmentTargetOptions.length ||
      formattedConstraintsOptions.adjustmentTargetOptions.filter(
        (item) => !item.isDisabled
      ).length <= 0,
    [adjustmentActions, formattedConstraintsOptions.adjustmentTargetOptions]
  );

  const handleAdjustmentActionChange = (
    adjustmentId: string,
    value: IRuleAdjustment
  ) => {
    const adjustments = adjustmentActions.map((item) => {
      if (item.id === adjustmentId) return value;
      return item;
    });

    handleCriteriaChange({
      ...currCriteria,
      action: {
        ...currCriteria.action,
        adjustments,
      },
    });
  };

  const handleDeleteAdjustmentAction = (adjustmentId: string) => {
    const adjustments = adjustmentActions.filter(
      (item) => item.id !== adjustmentId
    );

    handleCriteriaChange({
      ...currCriteria,
      action: {
        ...currCriteria.action,
        adjustments,
      },
    });
  };

  const handleAddAdjustmentAction = () => {
    const newAdjustment: IRuleAdjustment | null = getNewAdjustment(
      formattedConstraintsOptions.adjustmentTargetOptions.find(
        (item) => !item.isDisabled
      )?.value,
      constraints,
      selectedRuleType,
      marketplace
    );

    if (!newAdjustment) return;

    handleCriteriaChange({
      ...currCriteria,
      action: {
        ...currCriteria.action,
        adjustments: [...adjustmentActions, newAdjustment],
      },
    });
  };

  return (
    <div
      className={styles.criteriaActionContainer}
      style={{ width: '100%', flexDirection: 'column' }}
    >
      {adjustmentActions.map((adjustmentAction, idx) => (
        <RuleCriteriaAdjustmentAction
          key={idx}
          constraintsOptions={formattedConstraintsOptions}
          currAdjustmentAction={adjustmentAction}
          isAdjustmentDeleteDisabled={adjustmentActions.length <= 1}
          handleAdjustmentActionChange={handleAdjustmentActionChange}
          handleDeleteAdjustmentAction={handleDeleteAdjustmentAction}
        />
      ))}

      <div className={styles.criteriaActionButton}>
        {/* TODO: might need to revert back the older button design */}
        {/* <AltPrimaryButton
          buttonText="Add Action"
          buttonFunction={handleAddAdjustmentAction}
          disabled={isAddAdjustmentActionDisabled}
          width="12rem"
          height="3.2rem"
          isNewDesign={true}
          isButtonIconRequired={true}
          buttonIcon={<PlusIcon size={'1.5rem'} color="#464646" />}
        /> */}

        <TextButton
          label="Add Action"
          handleClick={handleAddAdjustmentAction}
          isDisabled={isRuleArchived || isAddAdjustmentActionDisabled}
          disableReason={
            isRuleArchived
              ? RULES_TOOLTIPS.ARCHIVED
              : isAddAdjustmentActionDisabled
              ? 'All adjustments have been selected.'
              : ''
          }
          tooltipPosition={TooltipPlacement.Top}
          buttonStartIcon={
            <PlusIcon size={'1.3rem'} weight="bold" color="#464646" />
          }
          isNewDesign={true}
        />
      </div>
    </div>
  );
}
