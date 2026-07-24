import Dropdown, {
  IDropdownItem,
} from '@/app/components/common/dropdown/dropdown';
import {
  fieldTitleNewStyles,
  textboxNewStyles,
} from '@/app/components/pages/rules-page/rules-page-features/rules-page-agents/rules-page-form/rules-page-form-styles';
import { MetricInputTypeEnum } from '@/enums/index.enums';
import {
  IBudgetMetricDisplay,
  IRuleCondition,
  IRulesValidation,
} from '@/interfaces/rules/rules.interfaces';
import { getSelectedFilterFromValue } from '@/utils';
import { getUnitPosition } from '@/utils/rules.utils';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import styles from './rule-criteria-condition-card.module.scss';

export interface IValueInputProps {
  metricDisplay: IBudgetMetricDisplay | undefined;
  condition: IRuleCondition;
  ruleValidations: IRulesValidation | null;
  onAbsoluteValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAbsoluteValueBlur: () => void;
  onInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onValueDropdownChange: (value: IDropdownItem<string>) => void;
  isRuleArchived: boolean;
}

const ValueInput = ({
  metricDisplay,
  condition,
  ruleValidations,
  onAbsoluteValueChange,
  onAbsoluteValueBlur,
  onInputKeyDown,
  onValueDropdownChange,
  isRuleArchived,
}: IValueInputProps) => {
  if (
    !metricDisplay ||
    metricDisplay.inputType === MetricInputTypeEnum.NUMBER
  ) {
    const slotPropsMin = metricDisplay?.min ?? 0;
    const slotPropsStep = metricDisplay?.step ?? 0.01;

    return (
      <div style={{ width: '100%' }}>
        <p className={styles.noOpacityLabel}>Value</p>
        <OutlinedInput
          type="number"
          onChange={onAbsoluteValueChange}
          onBlur={onAbsoluteValueBlur}
          onKeyDown={onInputKeyDown}
          value={
            Number.isFinite(condition.value.absoluteValue)
              ? condition.value.absoluteValue
              : ''
          }
          placeholder="Enter value"
          startAdornment={
            metricDisplay?.unit &&
            getUnitPosition(metricDisplay.unit) === 'start' ? (
              <InputAdornment position="start">
                {metricDisplay.unit}
              </InputAdornment>
            ) : undefined
          }
          endAdornment={
            metricDisplay?.unit &&
            getUnitPosition(metricDisplay.unit) === 'end' ? (
              <InputAdornment position="end">
                {metricDisplay.unit}
              </InputAdornment>
            ) : undefined
          }
          sx={{
            ...textboxNewStyles,
            height: '3.2rem',
            display: 'flex',
          }}
          slotProps={{
            input: {
              min: slotPropsMin,
              step: slotPropsStep,
              inputMode: 'decimal',
            },
          }}
          error={
            isRuleArchived === false &&
            ruleValidations !== null &&
            ruleValidations?.conditionAbsoluteValue !== undefined &&
            Boolean(ruleValidations?.conditionAbsoluteValue[condition.id]) ===
              true
          }
          disabled={isRuleArchived}
        />
        {isRuleArchived === false &&
          ruleValidations !== null &&
          ruleValidations?.conditionAbsoluteValue !== undefined &&
          Boolean(ruleValidations?.conditionAbsoluteValue[condition.id]) ===
            true && (
            <p className={styles.error}>
              {ruleValidations?.conditionAbsoluteValue[condition.id] ?? ''}
            </p>
          )}
      </div>
    );
  }

  if (metricDisplay.inputType === MetricInputTypeEnum.DROPDOWN) {
    const firstOptionValue = metricDisplay.dropdownOptions?.[0]?.value ?? '';
    const padLength = firstOptionValue.length;
    const matchValue = Number.isFinite(condition.value.absoluteValue)
      ? String(condition.value.absoluteValue).padStart(padLength, '0')
      : '0'.padStart(padLength, '0');

    return (
      <div style={{ width: '100%' }}>
        <p className={styles.noOpacityLabel}>Value</p>
        <Dropdown
          options={metricDisplay.dropdownOptions ?? []}
          selected={getSelectedFilterFromValue(
            metricDisplay.dropdownOptions ?? [],
            matchValue,
            (metricDisplay.dropdownOptions ?? [])[0]
          )}
          onSelect={onValueDropdownChange}
          width={'100%'}
          height="3.2rem"
          dropShadow={false}
          isNewDesign={true}
          labelStyles={fieldTitleNewStyles}
          disabled={isRuleArchived}
        />
      </div>
    );
  }

  return null;
};

export default ValueInput;
