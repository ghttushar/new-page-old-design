import InputLabel from '@mui/material/InputLabel';
import { getCurrentDateTime } from 'src/utils';
import styles from './single-date-picker.module.scss';

interface ISingleDatePickerProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isMaxDateRequired: boolean;
  minDate?: string;
  customStyles?: React.CSSProperties;
  isDisabled: boolean;
}

export default function SingleDatePicker({
  label,
  value,
  onChange,
  isMaxDateRequired,
  minDate,
  customStyles,
  isDisabled,
}: ISingleDatePickerProps) {
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  return (
    <div className={styles.datePickerContainer}>
      {label !== '' && (
        <InputLabel
          className={styles.datePickerLabel}
          htmlFor="single-date-picker"
        >
          {label}
        </InputLabel>
      )}

      <input
        className={styles.datePicker}
        id="single-date-picker"
        type="date"
        name="impactDate"
        placeholder="dd/mm/yyyy"
        value={value}
        onChange={onChange}
        max={
          isMaxDateRequired
            ? `${getCurrentDateTime().split('_')[0]}`
            : undefined
        }
        min={minDate ? minDate : undefined}
        style={{
          ...customStyles,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        }}
        onKeyDown={handleInputKeyDown}
        disabled={isDisabled}
      />
    </div>
  );
}
