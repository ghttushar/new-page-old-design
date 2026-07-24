import Dropdown, {
  IDropdownItem,
} from '@/app/components/common/dropdown/dropdown';
import { popupDropdownTitleStyles } from '@/app/components/pages/rules-page/rules-page-features/rules-page-agents/rules-page-form/rules-page-form-styles';
import { HOURS_OPTIONS, MINUTES_OPTIONS } from '@/constants/datetime.constants';
import { HoursEnum, MinutesEnum } from '@/enums/datetime.enums';
import { Frequency } from '@/enums/serp.enums';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectRuleBasicFilters,
  setRuleBasicFilters,
} from '@/redux/slices/rules/rules.slice';
import { getSelectedFilterFromValue, getTimeZoneByCountry } from '@/utils';
import { ClockIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';
import styles from '../rule-frequency.module.scss';

export default function RuleFrequencyTime() {
  const dispatch = useAppDispatch();
  const selectedRuleBasicFilters = useAppSelector(selectRuleBasicFilters);

  const selectedTime: string[] | undefined = useMemo(() => {
    if (selectedRuleBasicFilters.executionSchedule) {
      const time = selectedRuleBasicFilters.executionSchedule.time;

      if (!time) return undefined;
      return time.split(':');
    } else return undefined;
  }, [selectedRuleBasicFilters.executionSchedule]);

  const handleHourChange = (value: IDropdownItem<string>) => {
    dispatch(
      setRuleBasicFilters({
        ...selectedRuleBasicFilters,
        executionSchedule: {
          ...selectedRuleBasicFilters?.executionSchedule,
          time: `${value.value}:${
            selectedTime ? selectedTime[1] : MinutesEnum.MINUTE_0
          }`,
          frequency:
            selectedRuleBasicFilters?.executionSchedule?.frequency ??
            Frequency.DAILY,
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

  const handleMinuteChange = (value: IDropdownItem<string>) => {
    dispatch(
      setRuleBasicFilters({
        ...selectedRuleBasicFilters,
        executionSchedule: {
          ...selectedRuleBasicFilters?.executionSchedule,
          time: `${selectedTime ? selectedTime[0] : HoursEnum.HOUR_0}:${
            value.value
          }`,
          frequency:
            selectedRuleBasicFilters?.executionSchedule?.frequency ??
            Frequency.DAILY,
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
    <div className={styles.timeSelectionContainer}>
      <div className={styles.datetimeHeader}>
        <ClockIcon size={'1rem'} color="#666666" className={styles.timeIcon} />
        <p>Select Time</p>
      </div>

      <div className={styles.timeContainer}>
        <Dropdown
          label="Hours"
          options={HOURS_OPTIONS}
          selected={getSelectedFilterFromValue(
            HOURS_OPTIONS,
            selectedTime ? selectedTime[0] : HoursEnum.HOUR_0,
            HOURS_OPTIONS[0]
          )}
          onSelect={handleHourChange}
          width={'100%'}
          height="3rem"
          dropShadow={false}
          isNewDesign={true}
          labelStyles={popupDropdownTitleStyles}
        />

        <Dropdown
          label="Minutes"
          options={MINUTES_OPTIONS}
          selected={getSelectedFilterFromValue(
            MINUTES_OPTIONS,
            selectedTime ? selectedTime[1] : MinutesEnum.MINUTE_0,
            MINUTES_OPTIONS[0]
          )}
          onSelect={handleMinuteChange}
          width={'100%'}
          height="3rem"
          dropShadow={false}
          isNewDesign={true}
          labelStyles={popupDropdownTitleStyles}
          disabled={true}
        />
      </div>
    </div>
  );
}
