import {
  inputLabelNewStyles,
  inputLabelStyles,
} from '@/app/components/common/dropdown/dropdown-styles';
import InfoIcon from '@/app/components/common/info-icon/info-icon';
import { useOutsideClick } from '@/hooks/use-outside-click.hook';
import { useAppSelector } from '@/redux/hooks';
import { selectRuleBasicFilters } from '@/redux/slices/rules/rules.slice';
import { getRuleFrequencyResult } from '@/utils/rules.utils';
import InputLabel from '@mui/material/InputLabel';
import { CaretDownIcon } from '@phosphor-icons/react';
import { useRef, useState } from 'react';
import RuleFrequencyPopup from './rule-frequency-components/rule-frequency-popup';
import styles from './rule-frequency.module.scss';

interface IRuleFrequencyComponentProps {
  label?: string;
  labelTooltipTitle?: string;
  isNewDesign?: boolean;
  isDisabled: boolean;
  width?: string;
  height?: string;
  labelStyles?: React.CSSProperties;
}

export default function RuleFrequency({
  label,
  labelTooltipTitle,
  isNewDesign = false,
  isDisabled,
  width,
  height,
  labelStyles,
}: IRuleFrequencyComponentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerOpen, setContainerOpen] = useState<boolean>(false);

  const selectedRuleBasicFilters = useAppSelector(selectRuleBasicFilters);

  const handleContainerOpen = () => {
    if (isDisabled) return;
    setContainerOpen(true);
  };
  const handleContainerClose = () => setContainerOpen(false);

  useOutsideClick({
    containerRef,
    handleClose: handleContainerClose,
  });

  return (
    <div className={styles.frequencyContainer} ref={containerRef}>
      <div className={styles.frequencyDropdownContainer}>
        {label !== '' && label !== undefined && (
          <InputLabel
            sx={{
              ...(isNewDesign ? inputLabelNewStyles : inputLabelStyles),
              color: isDisabled ? '#bbb' : '#acacac',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              ...labelStyles,
            }}
          >
            {label}
            {labelTooltipTitle && (
              <InfoIcon
                title={labelTooltipTitle as string}
                disabled={isDisabled}
              />
            )}
          </InputLabel>
        )}

        <div
          className={`${styles.frequencyDropdown} ${
            containerOpen ? styles.focusActiveStyles : ''
          }`}
          style={{
            width: width || 'auto',
            height: height || 'auto',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
          }}
          onClick={containerOpen ? handleContainerClose : handleContainerOpen}
        >
          <p
            className={`${styles.selectedFrequencyText} ${
              isDisabled ? styles.disabled : ''
            }`}
          >
            {getRuleFrequencyResult(
              selectedRuleBasicFilters.executionSchedule?.frequency,
              selectedRuleBasicFilters.executionSchedule?.time,
              selectedRuleBasicFilters.executionSchedule?.timezone,
              selectedRuleBasicFilters.executionSchedule?.daysOfWeek,
              selectedRuleBasicFilters.executionSchedule?.daysOfMonth
            )}
          </p>
          <CaretDownIcon
            className={`${styles.icon} ${containerOpen ? styles.expanded : ''}`}
            size={'1.1rem'}
            color={isDisabled ? '#C5C5C5' : '#808080'}
            weight="bold"
          />
        </div>
      </div>

      <RuleFrequencyPopup containerOpen={containerOpen} />
    </div>
  );
}
