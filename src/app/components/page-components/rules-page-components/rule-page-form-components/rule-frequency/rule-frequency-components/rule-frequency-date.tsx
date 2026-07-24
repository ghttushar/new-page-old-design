import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import GridSpacedContainer from '@/app/components/common/grid-spaced-selection-container/grid-spaced-selection-container';
import { MONTH_DATES_OPTIONS } from '@/constants/datetime.constants';
import { Frequency } from '@/enums/serp.enums';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectRuleBasicFilters,
  setRuleBasicFilters,
} from '@/redux/slices/rules/rules.slice';
import { getTimeZoneByCountry } from '@/utils';
import { useMemo } from 'react';
import styles from '../rule-frequency.module.scss';

export default function RuleFrequencyDate() {
  const dispatch = useAppDispatch();
  const selectedRuleBasicFilters = useAppSelector(selectRuleBasicFilters);

  const selectedDates: Set<number> | undefined = useMemo(() => {
    if (selectedRuleBasicFilters.executionSchedule)
      return new Set(selectedRuleBasicFilters.executionSchedule.daysOfMonth);
  }, [selectedRuleBasicFilters.executionSchedule]);

  const handleDateClick = (value: IDropdownItem<number>) => {
    if (value.isDisabled) return;

    const next = new Set(selectedDates);

    if (next.has(value.value)) {
      next.delete(value.value);
    } else {
      next.add(value.value);
    }

    const datesArr = Array.from(next);
    dispatch(
      setRuleBasicFilters({
        ...selectedRuleBasicFilters,
        executionSchedule: {
          ...selectedRuleBasicFilters?.executionSchedule,
          daysOfMonth: datesArr,
          time: selectedRuleBasicFilters?.executionSchedule?.time ?? '',
          frequency:
            selectedRuleBasicFilters?.executionSchedule?.frequency ??
            Frequency.MONTHLY,
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
    <div className={styles.dateContainer}>
      <GridSpacedContainer
        options={MONTH_DATES_OPTIONS}
        selectedItems={selectedDates}
        onItemClick={handleDateClick}
        noOfColumns={7}
        itemContainerRequired={false}
        itemBorderRadius="8px"
      />
    </div>
  );
}
