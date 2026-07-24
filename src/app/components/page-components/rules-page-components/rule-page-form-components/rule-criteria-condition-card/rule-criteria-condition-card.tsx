import Dropdown, {
  IDropdownItem,
} from '@/app/components/common/dropdown/dropdown';
import PrimaryIconButton from '@/app/components/common/primary-icon-button/primary-icon-button';
import { fieldTitleNewStyles } from '@/app/components/pages/rules-page/rules-page-features/rules-page-agents/rules-page-form/rules-page-form-styles';
import {
  BUDGET_METRIC_DISPLAY,
  VALUE_TYPE_SYMBOL_MAPPING,
} from '@/constants/rules/rules.constants';
import { MetricsKeysEnum } from '@/enums/advertising.enums';
import { MetricInputTypeEnum } from '@/enums/index.enums';
import { AmazonRuleOperatorEnum, RuleValueTypeEnum } from '@/enums/rules.enum';
import { RULES_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import {
  IRuleCondition,
  IRuleConstraints,
  IRuleConstraintsDropdownOptions,
  IRulesValidation,
  TRuleValueType,
} from '@/interfaces/rules/rules.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectIsRuleArchived,
  selectIsRuleFormLoading,
  selectRulesValidation,
  setRulesValidation,
} from '@/redux/slices/rules/rules.slice';
import { getSelectedFilterFromValue, getValidNumber } from '@/utils';
import { getConditionAbsoluteValue } from '@/utils/rules.utils';
import { numberFieldBasicValidation } from '@/utils/validations.utils';
import { TrashIcon } from '@phosphor-icons/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import RuleCriteriaPriorityCardDuplicate from '../rule-criteria-priority-card/rule-criteria-priority-card-duplicate/rule-criteria-priority-card-duplicate';
import ValueInput from './rule-criteria-condition-card-value-input';
import styles from './rule-criteria-condition-card.module.scss';

interface IRuleCriteriaConditionCardProps {
  condition: IRuleCondition;
  handleConditionChange: (conditionId: string, value: IRuleCondition) => void;
  handleDeleteCondition: (conditionId: string) => void;
  constraints: IRuleConstraints;
  constraintsOptions: IRuleConstraintsDropdownOptions;
  isDuplicate: boolean;
  conditionsCount: number;
  conditionIndex: number;
}

export default function RuleCriteriaConditionCard({
  condition,
  handleConditionChange,
  handleDeleteCondition,
  constraints,
  constraintsOptions,
  isDuplicate,
  conditionsCount,
  conditionIndex,
}: IRuleCriteriaConditionCardProps) {
  const isMount = useRef(false);
  const ruleValidations = useAppSelector(selectRulesValidation);
  const isRuleFormLoading = useAppSelector(selectIsRuleFormLoading);
  const isRuleArchived = useAppSelector(selectIsRuleArchived);
  const dispatch = useAppDispatch();
  const [conditionDropdownOptions, setConditionDropdownOptions] =
    useState<IRuleConstraintsDropdownOptions>(constraintsOptions);
  const metricDisplay = BUDGET_METRIC_DISPLAY[condition.metric];
  const hasMultipleConditions = useMemo(
    () => conditionsCount > 1,
    [conditionsCount]
  );
  const isLastCondition = useMemo(
    () => conditionIndex >= conditionsCount - 1,
    [conditionIndex, conditionsCount]
  );
  // TODO: temporarily disabled. Will look into it to find the actual pain point.
  // useEffect(() => {
  //   setConditionDropdownOptions((prev) => {
  //     const options: IRuleConstraintsDropdownOptions = {
  //       ...prev,
  //       metricsOptions: prev.metricsOptions.map((option) => {
  //         if (
  //           option.value === condition.value.calculatedMetric ||
  //           option.value === condition.value.derivedMetric
  //         ) {
  //           return {
  //             ...option,
  //             isDisabled: true,
  //             tooltipText: 'Selected as Value type',
  //           };
  //         }
  //         return {
  //           ...option,
  //           isDisabled: false,
  //           tooltipText: undefined,
  //         };
  //       }),
  //       valueOptions: prev.valueOptions.map((option) => {
  //         if (option.value === condition.metric) {
  //           return {
  //             ...option,
  //             isDisabled: true,
  //             tooltipText: 'Selected as Metric type',
  //           };
  //         }
  //         return {
  //           ...option,
  //           isDisabled: false,
  //           tooltipText: undefined,
  //         };
  //       }),
  //     };
  //     return options;
  //   });
  // }, [condition]);

  useEffect(() => {
    const allowedOperators = metricDisplay?.allowedOperators;
    const options: IRuleConstraintsDropdownOptions = {
      ...constraintsOptions,
      metricsOptions: constraintsOptions.metricsOptions.map((option) => {
        if (
          option.value === condition.value.calculatedMetric ||
          option.value === condition.value.derivedMetric
        ) {
          return {
            ...option,
            isDisabled: true,
            tooltipText: 'Selected as Value type',
          };
        }
        return {
          ...option,
          isDisabled: false,
          tooltipText: undefined,
        };
      }),
      operatorsOptions: constraintsOptions.operatorsOptions.map((option) => {
        if (allowedOperators && !allowedOperators.includes(option.value)) {
          return {
            ...option,
            isDisabled: true,
            tooltipText: 'Not applicable for this metric',
          };
        }
        return {
          ...option,
          isDisabled: false,
          tooltipText: undefined,
        };
      }),
      valueOptions: constraintsOptions.valueOptions.map((option) => {
        const isMetricSelected = option.value === condition.metric;
        const isNonAbsolute = option.value !== RuleValueTypeEnum.ABSOLUTE;
        const restrictNonAbsolute =
          metricDisplay?.inputType === MetricInputTypeEnum.DROPDOWN ||
          metricDisplay?.forceAbsolute === true;
        if (isMetricSelected || (restrictNonAbsolute && isNonAbsolute)) {
          return {
            ...option,
            isDisabled: true,
            tooltipText: isMetricSelected
              ? 'Selected as Metric type'
              : 'Not applicable for this metric',
          };
        }
        return {
          ...option,
          isDisabled: false,
          tooltipText: undefined,
        };
      }),
    };
    setConditionDropdownOptions(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition, constraintsOptions, metricDisplay]);

  const handleMetricChange = (value: IDropdownItem<MetricsKeysEnum>) => {
    const newMetricDisplay = BUDGET_METRIC_DISPLAY[value.value];
    const restrictNonAbsolute =
      newMetricDisplay?.inputType === MetricInputTypeEnum.DROPDOWN ||
      newMetricDisplay?.forceAbsolute === true;
    const allowedOperators = newMetricDisplay?.allowedOperators;
    handleConditionChange(condition.id, {
      ...condition,
      metric: value.value,
      operator: allowedOperators ? allowedOperators[0] : condition.operator,
      value: restrictNonAbsolute
        ? {
            valueType: RuleValueTypeEnum.ABSOLUTE,
            absoluteValue: 0,
          }
        : condition.value,
    });
  };

  const handleOperatorChange = (
    value: IDropdownItem<AmazonRuleOperatorEnum>
  ) => {
    handleConditionChange(condition.id, {
      ...condition,
      operator: value.value,
    });
  };

  const handleValueChange = (
    value: IDropdownItem<MetricsKeysEnum | RuleValueTypeEnum>
  ) => {
    let valueType: TRuleValueType;
    if (value.value === RuleValueTypeEnum.ABSOLUTE) {
      valueType = RuleValueTypeEnum.ABSOLUTE;
    } else {
      const metricWithValueType = constraints.metricsWithValueTypes.find(
        (item) => item.metric === value.value
      );
      if (metricWithValueType) valueType = metricWithValueType.valueType;
      else valueType = RuleValueTypeEnum.ABSOLUTE;
    }
    const newCondition: IRuleCondition = {
      ...condition,
      value: {
        ...condition.value,
        valueType: valueType,
        absoluteValue: getConditionAbsoluteValue(
          condition.value.absoluteValue,
          valueType
        ),
        calculatedMetric:
          valueType === RuleValueTypeEnum.CALCULATED
            ? (value.value as MetricsKeysEnum)
            : undefined,
        derivedMetric:
          valueType === RuleValueTypeEnum.DERIVED
            ? (value.value as MetricsKeysEnum)
            : undefined,
      },
    };
    Object.keys(newCondition.value).forEach((key) => {
      if (
        newCondition.value[key as keyof typeof newCondition.value] === undefined
      ) {
        delete newCondition.value[key as keyof typeof newCondition.value];
      }
    });
    handleConditionChange(condition.id, newCondition);
  };

  const handleAbsoluteValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVal = getValidNumber(event.target.valueAsNumber);
    handleConditionChange(condition.id, {
      ...condition,
      value: {
        ...condition.value,
        absoluteValue:
          typeof newVal === 'number' && Number.isFinite(newVal) ? newVal : NaN,
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

  const handleAbsoluteValueBlur = () => {
    const value = condition.value.absoluteValue;
    handleConditionChange(condition.id, {
      ...condition,
      value: {
        ...condition.value,
        absoluteValue: Number.isFinite(value)
          ? value
          : getConditionAbsoluteValue(value, condition.value.valueType),
      },
    });
  };

  const handleValueDropdownChange = (value: IDropdownItem<string>) => {
    const num = parseInt(value.value, 10);
    handleConditionChange(condition.id, {
      ...condition,
      value: {
        ...condition.value,
        absoluteValue: Number.isFinite(num) ? num : 0,
      },
    });
  };

  useEffect(() => {
    if (!isMount.current) {
      isMount.current = true;
      return;
    }

    if (isRuleFormLoading) return;

    if (
      metricDisplay &&
      metricDisplay.inputType !== MetricInputTypeEnum.NUMBER
    ) {
      return;
    }
    const conditionId = condition.id;
    const { absoluteValue } = condition.value;
    const prevValidations = ruleValidations ?? {};
    const prevConditionAbsValErrors =
      prevValidations.conditionAbsoluteValue ?? {};
    const nextConditionAbsValErrors = { ...prevConditionAbsValErrors };
    const errorMsg = numberFieldBasicValidation(absoluteValue, 'Value');
    if (errorMsg) {
      nextConditionAbsValErrors[conditionId] = errorMsg;
    } else {
      delete nextConditionAbsValErrors[conditionId];
    }
    const nextValidations: IRulesValidation = {
      ...prevValidations,
      conditionAbsoluteValue:
        Object.keys(nextConditionAbsValErrors).length > 0
          ? nextConditionAbsValErrors
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
  }, [condition.value.absoluteValue, dispatch]);

  return (
    <div className={styles.conditionCardContainer}>
      {isDuplicate === true && (
        <RuleCriteriaPriorityCardDuplicate isCriteria={false} />
      )}
      <div
        className={`${styles.conditionOptions} ${
          hasMultipleConditions === true ? styles.multiRow : styles.singleRow
        }`}
      >
        <Dropdown
          label="Metric"
          options={conditionDropdownOptions.metricsOptions}
          selected={getSelectedFilterFromValue(
            conditionDropdownOptions.metricsOptions,
            condition.metric,
            conditionDropdownOptions.metricsOptions.find(
              (option) => option.isDisabled === false
            ) ?? conditionDropdownOptions.metricsOptions[0]
          )}
          onSelect={handleMetricChange}
          width={'100%'}
          height="3.2rem"
          dropShadow={false}
          isNewDesign={true}
          labelStyles={fieldTitleNewStyles}
          disabled={isRuleArchived}
        />
        <Dropdown
          label="Operator"
          options={conditionDropdownOptions.operatorsOptions}
          selected={getSelectedFilterFromValue(
            conditionDropdownOptions.operatorsOptions,
            condition.operator,
            conditionDropdownOptions.operatorsOptions[0]
          )}
          onSelect={handleOperatorChange}
          width={'100%'}
          height="3.2rem"
          dropShadow={false}
          isNewDesign={true}
          labelStyles={fieldTitleNewStyles}
          disabled={isRuleArchived}
        />
        <Dropdown
          label="Value"
          options={conditionDropdownOptions.valueOptions}
          selected={getSelectedFilterFromValue(
            conditionDropdownOptions.valueOptions,
            condition.value.calculatedMetric
              ? condition.value.calculatedMetric
              : condition.value.derivedMetric
              ? condition.value.derivedMetric
              : RuleValueTypeEnum.ABSOLUTE,
            conditionDropdownOptions.valueOptions.find(
              (option) => option.isDisabled === false
            ) ?? conditionDropdownOptions.valueOptions[0]
          )}
          onSelect={handleValueChange}
          width={'100%'}
          height="3.2rem"
          dropShadow={false}
          isNewDesign={true}
          labelStyles={fieldTitleNewStyles}
          disabled={isRuleArchived}
        />
        <div className={styles.valueSymbolContainer}>
          <span className={styles.noOpacityLabel}>S</span>
          <span
            className={`${styles.valueSymbol} ${
              isRuleArchived ? styles.disabledValueSymbol : ''
            }`}
          >
            {VALUE_TYPE_SYMBOL_MAPPING[condition.value.valueType]}
          </span>
        </div>

        <ValueInput
          metricDisplay={metricDisplay}
          condition={condition}
          ruleValidations={ruleValidations}
          onAbsoluteValueChange={handleAbsoluteValueChange}
          onAbsoluteValueBlur={handleAbsoluteValueBlur}
          onInputKeyDown={handleInputKeyDown}
          onValueDropdownChange={handleValueDropdownChange}
          isRuleArchived={isRuleArchived}
        />

        <div className={styles.valueSymbolContainer}>
          <span className={styles.noOpacityLabel}>I</span>
          <PrimaryIconButton
            width="3.2rem"
            height="3.2rem"
            buttonFunction={() => handleDeleteCondition(condition.id)}
            disabled={!hasMultipleConditions || isRuleArchived}
            isHoverTooltipEnabled={isRuleArchived}
            tooltipText={RULES_TOOLTIPS.ARCHIVED}
            buttonIcon={<TrashIcon size={'1.5rem'} color="#464646" />}
            IsNewDesign={true}
          />
        </div>
        {hasMultipleConditions === true && !isLastCondition && (
          <div className={styles.valueSymbolContainer}>
            <span className={styles.noOpacityLabel}>Op</span>
            <span className={styles.valueSymbol}>AND</span>
          </div>
        )}
      </div>
    </div>
  );
}
