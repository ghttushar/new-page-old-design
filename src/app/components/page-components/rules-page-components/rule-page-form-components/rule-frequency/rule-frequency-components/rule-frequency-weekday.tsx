import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import GridSpacedContainer from '@/app/components/common/grid-spaced-selection-container/grid-spaced-selection-container';
import { WEEKDAYS_OPTIONS } from '@/constants/datetime.constants';
import { Frequency, FrequencyTypesEnum } from '@/enums/serp.enums';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectRuleBasicFilters,
  setRuleBasicFilters,
} from '@/redux/slices/rules/rules.slice';
import { getTimeZoneByCountry } from '@/utils';
import { CalendarIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';
import styles from '../rule-frequency.module.scss';

interface IRuleFrequencyWeekdayProps {
  selectedFrequency: FrequencyTypesEnum;
}

export default function RuleFrequencyWeekday({
  selectedFrequency,
}: IRuleFrequencyWeekdayProps) {
  const dispatch = useAppDispatch();
  const selectedRuleBasicFilters = useAppSelector(selectRuleBasicFilters);

  const selectedWeekDays: Set<number> | undefined = useMemo(() => {
    if (selectedRuleBasicFilters.executionSchedule)
      return new Set(selectedRuleBasicFilters.executionSchedule.daysOfWeek);
  }, [selectedRuleBasicFilters.executionSchedule]);

  const formattedWeekDayOptions = useMemo(() => {
    if (selectedFrequency === Frequency.WEEKLY) return WEEKDAYS_OPTIONS;
    else
      return WEEKDAYS_OPTIONS.map((day) => ({
        ...day,
        isDisabled: true,
      }));
  }, [selectedFrequency]);

  const handleWeekDayClick = (value: IDropdownItem<number>) => {
    if (value.isDisabled) return;

    const next = new Set(selectedWeekDays);

    if (next.has(value.value)) {
      next.delete(value.value);
    } else {
      next.add(value.value);
    }

    const weekDaysArr = Array.from(next);
    dispatch(
      setRuleBasicFilters({
        ...selectedRuleBasicFilters,
        executionSchedule: {
          ...selectedRuleBasicFilters?.executionSchedule,
          daysOfWeek: weekDaysArr,
          time: selectedRuleBasicFilters?.executionSchedule?.time ?? '',
          frequency:
            selectedRuleBasicFilters?.executionSchedule?.frequency ??
            Frequency.WEEKLY,
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
    <div className={styles.daySelectionContainer}>
      <div className={styles.datetimeHeader}>
        <CalendarIcon
          size={'1rem'}
          color="#666666"
          className={styles.timeIcon}
        />
        <p>Select Days</p>
      </div>

      <div className={styles.dayContainer}>
        <GridSpacedContainer
          options={formattedWeekDayOptions}
          selectedItems={selectedWeekDays}
          onItemClick={handleWeekDayClick}
          itemContainerRequired={true}
          itemBorderRadius="50%"
        />
      </div>
    </div>
  );
}
