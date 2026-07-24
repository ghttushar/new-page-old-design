import { MultiSelectSingleCalendarWrapper } from '@/app/components/shared/custom-daterange-picker/custom-multi-select-single-calendar';
import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import useContainerCollapseAnimation from '@/hooks/use-container-collapse-animation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectRuleBasicFilters,
  setRuleBasicFilters,
} from '@/redux/slices/rules/rules.slice';
import { CaretDownIcon } from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import styles from './rules-page-form-advanced.module.scss';

const WIDTH = '23rem';

interface IRulesPageFormAdvancedProps {
  isRuleArchived: boolean;
}

export default function RulesPageFormAdvanced({
  isRuleArchived,
}: IRulesPageFormAdvancedProps) {
  const [containerOpen, setContainerOpen] = useState<boolean>(false);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [minMaxDates, setMinMaxDates] = useState<{
    minDate: string;
    maxDate: string;
  }>({ minDate: '', maxDate: '' });

  const { containerRef, containerCollapseAnimationStyles } =
    useContainerCollapseAnimation(containerOpen);
  const selectedRuleBasicFilters = useAppSelector(selectRuleBasicFilters);
  const dispatch = useAppDispatch();

  const handleContainerOpen = () => setContainerOpen(true);
  const handleContainerClose = () => setContainerOpen(false);
  const handleCalendarOpenChange = (open: boolean) => setCalendarOpen(open);

  const initialExcludeOnDates = useMemo(
    () => selectedRuleBasicFilters.advancedSettings?.excludeOn ?? null,
    [selectedRuleBasicFilters.advancedSettings?.excludeOn]
  );

  useEffect(() => {
    setMinMaxDates({
      minDate: selectedRuleBasicFilters.executionSchedule?.startDate ?? '',
      maxDate: selectedRuleBasicFilters.executionSchedule?.endDate ?? '',
    });
  }, [
    selectedRuleBasicFilters.executionSchedule?.startDate,
    selectedRuleBasicFilters.executionSchedule?.endDate,
  ]);

  const handleExcludeRuleDates = (dates: Array<string>) => {
    dispatch(
      setRuleBasicFilters({
        ...selectedRuleBasicFilters,
        advancedSettings: {
          ...selectedRuleBasicFilters.advancedSettings,
          excludeOn: dates && dates.length ? dates : undefined,
        },
      })
    );
  };

  return (
    <div className={styles.advanceSettings}>
      <div
        className={styles.infoContainer}
        onClick={containerOpen ? handleContainerClose : handleContainerOpen}
      >
        <p className={styles.infoContainerTitle}>Advanced Settings</p>

        <CaretDownIcon
          className={`${styles.icon} ${containerOpen ? styles.expanded : ''}`}
          size={'1.5rem'}
          color="#77469B"
          weight="bold"
        />
      </div>

      <div
        className={`${styles.optionsAction} ${
          !containerOpen ? styles.noMargin : ''
        }`}
        ref={containerRef}
        style={{
          ...containerCollapseAnimationStyles,
          width: containerOpen ? WIDTH : 'auto',
        }}
      >
        <MultiSelectSingleCalendarWrapper
          value={initialExcludeOnDates}
          isOpen={calendarOpen}
          onOpenChange={handleCalendarOpenChange}
          onDateSelect={handleExcludeRuleDates}
          minDate={new Date(minMaxDates.minDate)}
          maxDate={new Date(minMaxDates.maxDate)}
          width={WIDTH}
          height="3.2rem"
          label="Exclude Rule on"
          labelTooltipTitle={`You can select “exclude rule” dates only within the date range above. Other dates won’t be selectable.`}
          tooltipPosition={TooltipPlacement.Right}
          fontSize="1.2rem"
          isNewDesign={true}
          labelStyles={{ color: '#acacac', fontWeight: 500 }}
          disabled={isRuleArchived}
        />
      </div>
    </div>
  );
}
