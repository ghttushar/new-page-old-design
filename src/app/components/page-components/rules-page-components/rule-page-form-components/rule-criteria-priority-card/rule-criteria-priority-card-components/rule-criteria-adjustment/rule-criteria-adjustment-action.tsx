import Dropdown, {
  IDropdownItem,
} from '@/app/components/common/dropdown/dropdown';
import PrimaryIconButton from '@/app/components/common/primary-icon-button/primary-icon-button';
import {
  fieldTitleNewStyles,
  textboxNewStyles,
} from '@/app/components/pages/rules-page/rules-page-features/rules-page-agents/rules-page-form/rules-page-form-styles';
import {
  RuleActionTypeEnum,
  RuleAdjustmentTargetType,
} from '@/enums/rules.enum';
import { RULES_TOOLTIPS, TooltipPlacement } from '@/enums/tooltip-texts.enums';
import {
  IRuleAdjustment,
  IRuleConstraintsDropdownOptions,
  IRulesValidation,
} from '@/interfaces/rules/rules.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectIsRuleArchived,
  selectIsRuleFormLoading,
  selectRulesValidation,
  setRulesValidation,
} from '@/redux/slices/rules/rules.slice';
import { getSelectedFilterFromValue, getValidNumber } from '@/utils';
import {
  getActionValueSign,
  getCriteriaDefaultValues,
} from '@/utils/rules.utils';
import { numberFieldBasicValidation } from '@/utils/validations.utils';
import OutlinedInput from '@mui/material/OutlinedInput';
import { TrashIcon } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';
import styles from '../../rule-criteria-priority-card.module.scss';

interface IRuleCriteriaAdjustmentActionProps {
  currAdjustmentAction: IRuleAdjustment;
  isAdjustmentDeleteDisabled: boolean;
  constraintsOptions: IRuleConstraintsDropdownOptions;
  handleAdjustmentActionChange: (
    adjustmentId: string,
    value: IRuleAdjustment
  ) => void;
  handleDeleteAdjustmentAction: (adjustmentId: string) => void;
}

export default function RuleCriteriaAdjustmentAction({
  constraintsOptions,
  currAdjustmentAction,
  isAdjustmentDeleteDisabled,
  handleAdjustmentActionChange,
  handleDeleteAdjustmentAction,
}: IRuleCriteriaAdjustmentActionProps) {
  const isMount = useRef(false);
  const ruleValidations = useAppSelector(selectRulesValidation);
  const isRuleFormLoading = useAppSelector(selectIsRuleFormLoading);
  const isRuleArchived = useAppSelector(selectIsRuleArchived);
  const dispatch = useAppDispatch();

  const handleActionValueBlur = () => {
    const adjustment: IRuleAdjustment = {
      ...currAdjustmentAction,
      value:
        typeof currAdjustmentAction.value === 'number' &&
        Number.isFinite(currAdjustmentAction.value)
          ? currAdjustmentAction.value
          : getCriteriaDefaultValues(currAdjustmentAction.valueType) ?? 0,
    };

    handleAdjustmentActionChange(currAdjustmentAction.id, adjustment);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === '-' ||
      event.key === 'Minus' ||
      event.key === 'e' ||
      event.key === 'E'
    ) {
      event.preventDefault();
    }
  };

  const handleAdjustmentTargetChange = (
    option: IDropdownItem<RuleAdjustmentTargetType>
  ) => {
    const adjustment: IRuleAdjustment = {
      ...currAdjustmentAction,
      target: option.value,
    };

    handleAdjustmentActionChange(currAdjustmentAction.id, adjustment);
  };

  const handleAdjustmentValueTypeChange = (
    option: IDropdownItem<RuleActionTypeEnum>
  ) => {
    const adjustment: IRuleAdjustment = {
      ...currAdjustmentAction,
      valueType: option.value,
      value: getCriteriaDefaultValues(option.value) ?? 0,
    };

    handleAdjustmentActionChange(currAdjustmentAction.id, adjustment);
  };

  const handleAdjustmentValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVal = getValidNumber(event.target.valueAsNumber);

    const adjustment: IRuleAdjustment = {
      ...currAdjustmentAction,
      value:
        typeof newVal === 'number' && Number.isFinite(newVal) ? newVal : NaN,
    };

    handleAdjustmentActionChange(currAdjustmentAction.id, adjustment);
  };

  useEffect(() => {
    if (!isMount.current) {
      isMount.current = true;
      return;
    }

    if (isRuleFormLoading) return;

    const adjustmentId = currAdjustmentAction.id;
    const value = currAdjustmentAction.value;

    const prevValidations = ruleValidations ?? {};
    const prevAdjustmentActionValErrors =
      prevValidations.adjustmentActionValue ?? {};
    const nextAdjustmentActionValErrors = { ...prevAdjustmentActionValErrors };

    const errorMsg = numberFieldBasicValidation(value, 'Action Value');

    if (errorMsg) {
      nextAdjustmentActionValErrors[adjustmentId] = errorMsg;
    } else {
      delete nextAdjustmentActionValErrors[adjustmentId];
    }

    const nextValidations: IRulesValidation = {
      ...prevValidations,
      adjustmentActionValue:
        Object.keys(nextAdjustmentActionValErrors).length > 0
          ? nextAdjustmentActionValErrors
          : undefined,
    };

    const hasAnyError = Object.values(nextValidations).some((val) => {
      if (typeof val === 'string') return true;
      if (typeof val === 'object' && val !== null)
        return Object.keys(val).length > 0;
      return false;
    });

    dispatch(setRulesValidation(hasAnyError ? nextValidations : null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currAdjustmentAction.value, dispatch]);

  return (
    <div
      className={`${styles.criteriaActionRow} ${styles.adjustmentSingleRow}`}
    >
      <Dropdown
        label="Adjustment"
        options={constraintsOptions.adjustmentTargetOptions.map((item) => {
          if (item.value === currAdjustmentAction.target)
            return {
              ...item,
              isDisabled: false,
            };

          return item;
        })}
        selected={getSelectedFilterFromValue(
          constraintsOptions.adjustmentTargetOptions,
          currAdjustmentAction.target,
          constraintsOptions.adjustmentTargetOptions[0]
        )}
        onSelect={handleAdjustmentTargetChange}
        width={'100%'}
        height="3.2rem"
        dropShadow={false}
        isNewDesign={true}
        labelStyles={fieldTitleNewStyles}
        labelTooltipTitle={RULES_TOOLTIPS.ADJUSTMENT}
        labelTooltipPosition={TooltipPlacement.Right}
        disabled={isRuleArchived}
      />

      <Dropdown
        label="Action"
        options={constraintsOptions.actionOptions}
        selected={getSelectedFilterFromValue(
          constraintsOptions.actionOptions,
          currAdjustmentAction.valueType,
          constraintsOptions.actionOptions[0]
        )}
        onSelect={handleAdjustmentValueTypeChange}
        width={'100%'}
        height="3.2rem"
        dropShadow={false}
        isNewDesign={true}
        labelStyles={fieldTitleNewStyles}
        labelTooltipTitle={RULES_TOOLTIPS.ACTION}
        labelTooltipPosition={TooltipPlacement.Right}
        disabled={isRuleArchived}
      />

      <div className={styles.actionValueContainer}>
        <p className={styles.noOpacityLabel}>Value</p>
        <OutlinedInput
          type="number"
          onChange={handleAdjustmentValueChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleActionValueBlur}
          value={
            Number.isFinite(currAdjustmentAction.value)
              ? currAdjustmentAction.value
              : ''
          }
          placeholder="Enter value"
          sx={{
            ...textboxNewStyles,
            height: '3.2rem',
            display: 'flex',
          }}
          slotProps={{
            input: {
              min: 0,
              step: 0.01,
              inputMode: 'decimal',
            },
          }}
          endAdornment={
            getActionValueSign(currAdjustmentAction.valueType) || undefined
          }
          error={
            isRuleArchived === false &&
            ruleValidations !== null &&
            ruleValidations?.adjustmentActionValue !== undefined &&
            Boolean(
              ruleValidations?.adjustmentActionValue[currAdjustmentAction.id]
            ) === true
          }
          disabled={isRuleArchived}
        />

        {isRuleArchived === false &&
          ruleValidations !== null &&
          ruleValidations?.adjustmentActionValue !== undefined &&
          Boolean(
            ruleValidations?.adjustmentActionValue[currAdjustmentAction.id]
          ) === true && (
            <p className={styles.error}>
              {ruleValidations?.adjustmentActionValue[
                currAdjustmentAction.id
              ] ?? ''}
            </p>
          )}
      </div>

      <div className={styles.actionDeleteButton}>
        <p className={styles.noOpacityLabel}>I</p>
        <PrimaryIconButton
          width="3.2rem"
          height="3.2rem"
          buttonFunction={() =>
            handleDeleteAdjustmentAction(currAdjustmentAction.id)
          }
          disabled={isAdjustmentDeleteDisabled || isRuleArchived}
          isHoverTooltipEnabled={isRuleArchived}
          tooltipText={RULES_TOOLTIPS.ARCHIVED}
          buttonIcon={<TrashIcon size={'1.5rem'} color="#464646" />}
          IsNewDesign={true}
        />
      </div>
    </div>
  );
}
