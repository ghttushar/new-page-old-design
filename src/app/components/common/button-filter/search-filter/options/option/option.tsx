import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import sxStyles from '../../styles';

export interface IOptionProps {
  option: IDropdownItem<string>;
  handleOptionChange: (value: IDropdownItem<string>) => void;
}

export function Option(props: IOptionProps) {
  const { option, handleOptionChange } = props;
  return (
    <FormControlLabel
      label={option.label}
      sx={sxStyles.optionWrapperStyles}
      control={
        <Checkbox
          disableRipple
          value={option.value}
          checked={option.selected}
          onChange={() => handleOptionChange(option)}
          sx={{
            marginLeft: '5px',
            color: '#77469B',
            '&.Mui-checked': {
              color: '#77469B',
            },
          }}
        />
      }
    />
  );
}

export default Option;
