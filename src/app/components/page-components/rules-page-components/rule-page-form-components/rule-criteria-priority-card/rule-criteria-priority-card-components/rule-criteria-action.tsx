import Dropdown, {
  IDropdownItem,
} from '@/app/components/common/dropdown/dropdown';
import {
  fieldTitleNewStyles,
  textboxNewStyles,
} from '@/app/components/pages/rules-page/rules-page-features/rules-page-agents/rules-page-form/rules-page-form-styles';
import { ACTION_TYPE_NO_VALUE } from '@/constants/rules/rules.constants';
import { RuleActionTypeEnum } from '@/enums/rules.enum';
import { RULES_TOOLTIPS, TooltipPlacement } from '@/enums/tooltip-texts.enums';
import {
  IRuleConstraintsDropdownOptions,
  IRuleCriteriaDetails,
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
  getActionParams,
  getActionValueSign,
  getRuleActionValue,
} from '@/utils/rules.utils';
import { numberFieldBasicValidation } from '@/utils/validations.utils';
import OutlinedInput from '@mui/material/OutlinedInput';
import React, { useEffect, useMemo, useRef } from 'react';
import styles from '../rule-criteria-priority-card.module.scss';

interface IRuleCriteriaActionProps {
  currCriteria: IRuleCriteriaDetails;
  handleCriteriaChange: (value: IRuleCriteriaDetails) => void;
  constraintsOptions: IRuleConstraintsDropdownOptions;
}

export default function RuleCriteriaAction({
  currCriteria,
  handleCriteriaChange,
  constraintsOptions,
}: IRuleCriteriaActionProps) {
  const isMount = useRef(false);
  const ruleValidations = useAppSelector(selectRulesValidation);
  const isRuleFormLoading = useAppSelector(selectIsRuleFormLoading);
  const isRuleArchived = useAppSelector(selectIsRuleArchived);
  const dispatch = useAppDispatch();

  const actionValue = useMemo(
    () => getRuleActionValue(currCriteria.action),
    [currCriteria.action]
  );

  const isActionValueFieldRequired = useMemo(
    () =>
      !ACTION_TYPE_NO_VALUE.includes(
        currCriteria.action.actionType?.toUpperCase() as RuleActionTypeEnum
      ),
    [currCriteria.action.actionType]
  );

  useEffect(() => {
    if (!isMount.current) {
      isMount.current = true;
      return;
    }

    if (isRuleFormLoading) return;

    if (!isActionValueFieldRequired) {
      if (ruleValidations) {
        const nextValidations: IRulesValidation = {
          ...ruleValidations,
          criteriaActionValue: undefined,
        };

        const hasAnyError = Object.values(nextValidations).some((val) => {
          if (typeof val === 'string') return true;
          if (typeof val === 'object' && val !== null)
            return Object.keys(val).length > 0;
          return false;
        });

        dispatch(setRulesValidation(hasAnyError ? nextValidations : null));
      }
      return;
    }

    const criteriaId = currCriteria.id;
    const prevValidations = ruleValidations ?? {};
    const prevCriteriaActionErrors = prevValidations.criteriaActionValue ?? {};
    const nextCriteriaActionErrors = { ...prevCriteriaActionErrors };

    const errorMsg = numberFieldBasicValidation(actionValue, 'Action Value');

    if (errorMsg) {
      nextCriteriaActionErrors[criteriaId] = errorMsg;
    } else {
      delete nextCriteriaActionErrors[criteriaId];
    }

    const nextValidations: IRulesValidation = {
      ...prevValidations,
      criteriaActionValue:
        Object.keys(nextCriteriaActionErrors).length > 0
          ? nextCriteriaActionErrors
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
  }, [actionValue, dispatch, isActionValueFieldRequired]);

  const handleActionChange = (value: IDropdownItem<RuleActionTypeEnum>) => {
    const newCriteria: IRuleCriteriaDetails = {
      ...currCriteria,
      action: {
        ...currCriteria.action,
        actionType: value.value,
        params: getActionParams(value.value),
      },
    };

    Object.keys(newCriteria.action).forEach((key) => {
      if (
        newCriteria.action[key as keyof typeof newCriteria.action] === undefined
      ) {
        delete newCriteria.action[key as keyof typeof newCriteria.action];
      }
    });

    handleCriteriaChange(newCriteria);
  };

  const handleActionValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVal = getValidNumber(event.target.valueAsNumber);
    const actionType = currCriteria.action.actionType;

    handleCriteriaChange({
      ...currCriteria,
      action: {
        ...currCriteria.action,
        params: getActionParams(
          actionType,
          typeof newVal === 'number' && Number.isFinite(newVal) ? newVal : NaN
        ),
      },
    });
  };

  const handleActionValueBlur = () => {
    const actionType = currCriteria.action.actionType;

    handleCriteriaChange({
      ...currCriteria,
      action: {
        ...currCriteria.action,
        params: getActionParams(
          actionType,
          typeof actionValue === 'number' && Number.isFinite(actionValue)
            ? actionValue
            : undefined
        ),
      },
    });
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

  return (
    <div className={styles.criteriaActionContainer}>
      <div className={`${styles.criteriaActionRow} ${styles.actionSingleRow}`}>
        <Dropdown
          label="Action"
          options={constraintsOptions.actionOptions}
          selected={getSelectedFilterFromValue(
            constraintsOptions.actionOptions,
            currCriteria.action.actionType,
            constraintsOptions.actionOptions[0]
          )}
          onSelect={handleActionChange}
          width={'100%'}
          height="3.2rem"
          dropShadow={false}
          isNewDesign={true}
          labelStyles={fieldTitleNewStyles}
          labelTooltipTitle={RULES_TOOLTIPS.ACTION}
          labelTooltipPosition={TooltipPlacement.Right}
          disabled={isRuleArchived}
        />

        {isActionValueFieldRequired === true && (
          <div className={styles.actionValueContainer}>
            <p className={styles.noOpacityLabel}>Value</p>
            <OutlinedInput
              type="number"
              onChange={handleActionValueChange}
              onBlur={handleActionValueBlur}
              onKeyDown={handleInputKeyDown}
              value={Number.isFinite(actionValue) ? actionValue : ''}
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
                getActionValueSign(currCriteria.action.actionType) || undefined
              }
              error={
                isRuleArchived === false &&
                ruleValidations !== null &&
                ruleValidations?.criteriaActionValue !== undefined &&
                Boolean(
                  ruleValidations?.criteriaActionValue[currCriteria.id]
                ) === true
              }
              disabled={isRuleArchived}
            />

            {isRuleArchived === false &&
              ruleValidations !== null &&
              ruleValidations?.criteriaActionValue !== undefined &&
              Boolean(ruleValidations?.criteriaActionValue[currCriteria.id]) ===
                true && (
                <p className={styles.error}>
                  {ruleValidations?.criteriaActionValue[currCriteria.id] ?? ''}
                </p>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
