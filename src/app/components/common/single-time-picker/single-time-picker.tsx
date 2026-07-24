import InputLabel from '@mui/material/InputLabel';
import React from 'react';
import InfoIcon from '../info-icon/info-icon';
import styles from './single-time-picker.module.scss';

interface ISingleTimePickerProps {
  label: string;
  value: string;
  required?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  minTime?: string;
  maxTime?: string;
  customStyles?: React.CSSProperties;
  labelStyles?: React.CSSProperties;
  labelTooltipTitle?: string;
}

export default function SingleTimePicker({
  label,
  value,
  required,
  onChange,
  minTime,
  maxTime,
  customStyles,
  labelStyles,
  labelTooltipTitle,
}: ISingleTimePickerProps) {
  return (
    <div className={styles.timePickerContainer}>
      {label !== '' && (
        <InputLabel
          className={styles.timePickerLabel}
          htmlFor="single-time-picker"
          style={labelStyles}
        >
          {label}
          {labelTooltipTitle && (
            <InfoIcon title={labelTooltipTitle as string} />
          )}
        </InputLabel>
      )}

      <input
        className={styles.timePicker}
        id="single-time-picker"
        type="time"
        name="singleTimePicker"
        placeholder="Select a time"
        required={required}
        value={value}
        onChange={onChange}
        max={maxTime ? maxTime : undefined}
        min={minTime ? minTime : undefined}
        style={customStyles}
      />
    </div>
  );
}
