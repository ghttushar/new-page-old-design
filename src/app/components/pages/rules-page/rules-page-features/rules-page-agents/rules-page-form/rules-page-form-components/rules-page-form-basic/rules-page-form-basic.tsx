import CustomAntSwitchTooltip from '@/app/components/common/ant-switch/ant-switch';
import Dropdown, {
  IDropdownItem,
} from '@/app/components/common/dropdown/dropdown';
import RuleFrequency from '@/app/components/page-components/rules-page-components/rule-page-form-components/rule-frequency/rule-frequency';
import CustomDateRangePickerWrapper from '@/app/components/shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import { customRangeFilterOption } from '@/constants';
import { NAME_STRING_SPECIAL_CHARACTER_REGEX } from '@/constants/regex.constants';
import { RULE_CREATION_LOOKBACK_OPTIONS } from '@/constants/rules/rules.constants';
import { RuleCreationLookbackEnum, RuleStatusEnum } from '@/enums/rules.enum';
import {
  Frequency,
  MetricsTimeWindowUnitEnum,
  Range,
} from '@/enums/serp.enums';
import { RULES_TOOLTIPS, TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { IDateRange } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IRulesValidation } from '@/interfaces/rules/rules.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectIsRuleArchived,
  selectIsRuleFormLoading,
  selectRuleBasicFilters,
  selectRulesValidation,
  setRuleBasicFilters,
  setRulesValidation,
} from '@/redux/slices/rules/rules.slice';
import {
  formatDate,
  getSelectedFilterFromValue,
  getTimeZoneByCountry,
} from '@/utils';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useEffect, useMemo, useRef } from 'react';
import {
  fieldTitleNewStyles,
  textboxNewStyles,
} from '../../rules-page-form-styles';
import RulesPageFormAdvanced from '../rules-page-form-advanced/rules-page-form-advanced';
import styles from './rules-page-form-basic.module.scss';

export default function RulesPageFormBasic() {
  const isMount = useRef(false);
  const dispatch = useAppDispatch();
  const selectedRuleBasicFilters = useAppSelector(selectRuleBasicFilters);
  const ruleValidations = useAppSelector(selectRulesValidation);
  const isRuleFormLoading = useAppSelector(selectIsRuleFormLoading);
  const isRuleArchived = useAppSelector(selectIsRuleArchived);

  const initialDateRange: IDateRange | undefined = useMemo(() => {
    const today = formatDate(Range.TODAY);

    if (selectedRuleBasicFilters.executionSchedule) {
      return {
        startDate:
          selectedRuleBasicFilters.executionSchedule.startDate ||
          today.startDate,
        endDate: selectedRuleBasicFilters.executionSchedule.endDate,
      };
    } else return today;
  }, [selectedRuleBasicFilters.executionSchedule]);

  const handleRuleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value || '';

    dispatch(
      setRuleBasicFilters({
        ...selectedRuleBasicFilters,
        ruleName: newValue,
      })
    );
  };

  const handleStatusChange = () => {
    const status =
      selectedRuleBasicFilters.status === RuleStatusEnum.ENABLED
        ? RuleStatusEnum.PAUSED
        : RuleStatusEnum.ENABLED;
    dispatch(
      setRuleBasicFilters({
        ...selectedRuleBasicFilters,
        status,
      })
    );
  };

  const handleLookbackChange = (value: IDropdownItem<number>) => {
    dispatch(
      setRuleBasicFilters({
        ...selectedRuleBasicFilters,
        metricsTimeWindow: {
          value: value.value,
          unit: MetricsTimeWindowUnitEnum.DAYS,
        },
      })
    );
  };

  const handleSetCustomDateRangeForModal = (dateRange: IDateRange) => {
    dispatch(
      setRuleBasicFilters({
        ...selectedRuleBasicFilters,
        executionSchedule: {
          ...selectedRuleBasicFilters?.executionSchedule,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate ?? '',
          frequency:
            selectedRuleBasicFilters?.executionSchedule?.frequency ??
            Frequency.DAILY,
          time: selectedRuleBasicFilters?.executionSchedule?.time ?? '',
          timezone:
            selectedRuleBasicFilters?.executionSchedule?.timezone ??
            getTimeZoneByCountry(),
        },
      })
    );
  };

  useEffect(() => {
    if (!isMount.current) {
      dispatch(
        setRuleBasicFilters({
          ...selectedRuleBasicFilters,
          executionSchedule: {
            ...selectedRuleBasicFilters?.executionSchedule,
            startDate: initialDateRange.startDate,
            endDate: initialDateRange.endDate ?? '',
            frequency:
              selectedRuleBasicFilters?.executionSchedule?.frequency ??
              Frequency.DAILY,
            time: selectedRuleBasicFilters?.executionSchedule?.time ?? '',
            timezone:
              selectedRuleBasicFilters?.executionSchedule?.timezone ??
              getTimeZoneByCountry(),
          },
        })
      );

      isMount.current = true;
      return;
    }

    if (isRuleFormLoading) return;

    const ruleName = selectedRuleBasicFilters.ruleName;

    const ruleNameErrors: Pick<IRulesValidation, 'ruleName'> = {};

    if (!ruleName || !ruleName.length) {
      ruleNameErrors.ruleName = 'Rule Name is required.';
    } else if (ruleName.length < 2) {
      ruleNameErrors.ruleName = 'Rule Name must have at least 2 characters.';
    } else if (ruleName.length > 255) {
      ruleNameErrors.ruleName = 'Rule Name must be less than 255 characters.';
    } else if (!NAME_STRING_SPECIAL_CHARACTER_REGEX.test(ruleName)) {
      ruleNameErrors.ruleName = `Only letters, numbers, single spaces, commas (,), ., -, _, &, :, (, ), /, %, #, ', + are allowed. Rule Name must start with a letter or a number.`;
    } else {
      ruleNameErrors.ruleName = undefined;
    }

    if (ruleNameErrors.ruleName === undefined) {
      if (ruleValidations) {
        const nextValidations: IRulesValidation = {
          ...ruleValidations,
          ruleName: undefined,
        };

        const hasAnyError = Object.values(nextValidations).some(
          (val) => typeof val === 'string'
        );

        dispatch(setRulesValidation(hasAnyError ? nextValidations : null));
      }
    } else {
      const nextValidations: IRulesValidation = {
        ...ruleValidations,
        ruleName: undefined,
        ...ruleNameErrors,
      };

      const hasAnyError = Object.values(nextValidations).some(
        (val) => typeof val === 'string'
      );

      dispatch(setRulesValidation(hasAnyError ? nextValidations : null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRuleBasicFilters.ruleName, dispatch]);

  return (
    <div className={styles.basicInformationContainer}>
      <div className={styles.basicInformationStatusContainer}>
        <p className={styles.infoContainerTitle}>Basic Information</p>

        <div className={styles.statusAction}>
          <span
            className={`${styles.statusTitle} ${styles.verticalAlignMiddle}`}
            style={{ margin: 0 }}
          >
            Status of Rule
          </span>

          <CustomAntSwitchTooltip
            isSwitchDisabled={isRuleArchived}
            isTooltipDisabled={!isRuleArchived}
            switchHeight={17}
            switchWidth={30}
            isChecked={
              !isRuleArchived &&
              selectedRuleBasicFilters.status === RuleStatusEnum.ENABLED
            }
            onChange={handleStatusChange}
            className={
              !selectedRuleBasicFilters.status ||
              selectedRuleBasicFilters.status === RuleStatusEnum.PAUSED
                ? 'paused'
                : ''
            }
            tooltipTitle={RULES_TOOLTIPS.ARCHIVED}
            tooltipPosition={TooltipPlacement.Top}
            isNewDesign={true}
          />
        </div>
      </div>

      <div className={styles.basicAction}>
        <div className={styles.ruleName}>
          <p className={styles.fieldTitle}>Rule Name</p>
          <OutlinedInput
            type="text"
            onChange={handleRuleNameChange}
            value={selectedRuleBasicFilters.ruleName}
            placeholder="Type Rule Name here"
            sx={textboxNewStyles}
            error={
              ruleValidations !== null &&
              Boolean(ruleValidations?.ruleName) === true
            }
            disabled={isRuleArchived}
          />
          {isRuleArchived === false &&
            ruleValidations !== null &&
            Boolean(ruleValidations?.ruleName) === true && (
              <p className={styles.error}>{ruleValidations?.ruleName ?? ''}</p>
            )}
        </div>

        <div className={styles.optionsAction}>
          <Dropdown
            label="Lookback Window"
            options={RULE_CREATION_LOOKBACK_OPTIONS}
            selected={getSelectedFilterFromValue(
              RULE_CREATION_LOOKBACK_OPTIONS,
              selectedRuleBasicFilters.metricsTimeWindow?.value ??
                RuleCreationLookbackEnum.DAYS_7,
              RULE_CREATION_LOOKBACK_OPTIONS[0]
            )}
            onSelect={handleLookbackChange}
            width={'10rem'}
            height="3.4rem"
            dropShadow={false}
            isNewDesign={true}
            labelStyles={{ ...fieldTitleNewStyles, marginBottom: '0.3rem' }}
            disabled={isRuleArchived}
          />
          <CustomDateRangePickerWrapper
            title={'Run Between'}
            handleDateChange={() => {
              return;
            }}
            setCustomDateRange={handleSetCustomDateRangeForModal}
            rangeOptions={[]}
            dropShadow={false}
            height="3.4rem"
            width="22.5rem"
            selectedCustomDateRange={initialDateRange}
            defaultPreset={customRangeFilterOption}
            labelStyles={{ ...fieldTitleNewStyles, marginBottom: '0.3rem' }}
            isNewDesign={true}
            disableMatcher={[
              {
                before: new Date(formatDate(Range.TODAY).startDate),
              },
            ]}
            isFutureNavRequired={true}
            isNoEndDateOptionRequired={true}
            disabled={isRuleArchived}
          />
          <RuleFrequency
            label="Frequency"
            isNewDesign={true}
            isDisabled={isRuleArchived}
            width="25rem"
            height="3.4rem"
          />
        </div>
      </div>

      {/* Advanced settings */}
      <RulesPageFormAdvanced isRuleArchived={isRuleArchived} />
    </div>
  );
}
