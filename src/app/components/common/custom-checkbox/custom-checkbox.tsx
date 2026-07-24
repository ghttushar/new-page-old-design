import { debounce } from '@/utils';
import { Checkbox, CheckboxProps } from '@mui/material';
import { useMemo } from 'react';

interface ICustomCheckboxProps extends Omit<CheckboxProps, 'sx'> {
  checkboxColor?: string;
  checkedColor?: string;
  indeterminateColor?: string;
  debounceDelay?: number;
}

export default function CustomCheckbox({
  checkboxColor = 'white',
  checkedColor,
  indeterminateColor,
  debounceDelay,
  ...checkboxProps
}: ICustomCheckboxProps) {
  const finalCheckedColor = checkedColor || checkboxColor;
  const finalIndeterminateColor = indeterminateColor || checkboxColor;

  const debouncedOnChange = useMemo(() => {
    if (checkboxProps.onChange && debounceDelay) {
      return debounce(checkboxProps.onChange, debounceDelay);
    }
    return checkboxProps.onChange;
  }, [checkboxProps.onChange, debounceDelay]);

  return (
    <Checkbox
      {...checkboxProps}
      sx={{
        color: checkboxColor,
        '&.Mui-checked': {
          color: finalCheckedColor,
        },
        '&.MuiCheckbox-indeterminate': {
          color: finalIndeterminateColor,
        },
      }}
      onChange={debouncedOnChange}
    />
  );
}
