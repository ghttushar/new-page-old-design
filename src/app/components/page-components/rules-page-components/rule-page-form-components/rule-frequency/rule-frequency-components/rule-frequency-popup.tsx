import NewTabsSelect from '@/app/components/common/tabs-select/new-tabs-select';
import { RULES_FREQUENCY_TAB_OPTIONS } from '@/constants/rules/rules.constants';
import { Frequency, FrequencyTypesEnum } from '@/enums/serp.enums';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectRuleBasicFilters,
  setRuleBasicFilters,
} from '@/redux/slices/rules/rules.slice';
import { getTimeZoneByCountry } from '@/utils';
import { getRuleFrequencyResult } from '@/utils/rules.utils';
import { useMemo } from 'react';
import styles from '../rule-frequency.module.scss';
import RuleFrequencyDate from './rule-frequency-date';
import RuleFrequencyTime from './rule-frequency-time';
import RuleFrequencyWeekday from './rule-frequency-weekday';

interface IRuleFrequencyPopupProps {
  containerOpen: boolean;
}

export default function RuleFrequencyPopup({
  containerOpen,
}: IRuleFrequencyPopupProps) {
  const dispatch = useAppDispatch();
  const selectedRuleBasicFilters = useAppSelector(selectRuleBasicFilters);

  const selectedFreq = useMemo(
    () =>
      selectedRuleBasicFilters.executionSchedule?.frequency || Frequency.DAILY,
    [selectedRuleBasicFilters.executionSchedule?.frequency]
  );

  const handleFrequencyChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    dispatch(
      setRuleBasicFilters({
        ...selectedRuleBasicFilters,
        executionSchedule: {
          ...selectedRuleBasicFilters?.executionSchedule,
          frequency: value as FrequencyTypesEnum,
          time: selectedRuleBasicFilters?.executionSchedule?.time ?? '',
          timezone:
            selectedRuleBasicFilters?.executionSchedule?.timezone ??
            getTimeZoneByCountry(),
          startDate:
            selectedRuleBasicFilters?.executionSchedule?.startDate ?? '',
          endDate: selectedRuleBasicFilters?.executionSchedule?.endDate ?? '',
        },
      })
    );
  };

  return (
    <div
      className={styles.frequencyComponentContainer}
      style={{ opacity: containerOpen ? 1 : 0, zIndex: containerOpen ? 1 : -1 }}
    >
      <NewTabsSelect
        tabValue={selectedFreq}
        handleTabChange={handleFrequencyChange}
        tabData={RULES_FREQUENCY_TAB_OPTIONS}
      />

      {selectedFreq === Frequency.MONTHLY ? (
        <RuleFrequencyDate />
      ) : (
        <RuleFrequencyWeekday selectedFrequency={selectedFreq} />
      )}

      <div className={styles.timeFrequencyContainer}>
        <RuleFrequencyTime />

        <div className={styles.hr} />

        <div className={styles.runTextContainer}>
          <span className={styles.title}>Runs</span>
          <span className={styles.result}>
            {getRuleFrequencyResult(
              selectedRuleBasicFilters.executionSchedule?.frequency,
              selectedRuleBasicFilters.executionSchedule?.time,
              selectedRuleBasicFilters.executionSchedule?.timezone,
              selectedRuleBasicFilters.executionSchedule?.daysOfWeek,
              selectedRuleBasicFilters.executionSchedule?.daysOfMonth
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
