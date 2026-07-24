import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import { IDropdownItem } from '../../../dropdown/dropdown';
import Option from './option/option';
import styles from './options.module.scss';

export interface IOptionsProps {
  options: IDropdownItem<string>[];
  handleOptionChange: (value: IDropdownItem<string>) => void;
}

export function Options(props: IOptionsProps) {
  const { options, handleOptionChange } = props;
  return (
    <FormControl className={styles.options} data-test="options">
      <FormGroup>
        {options.map((option, index) => (
          <Option
            key={`${option.value}-${index}`}
            option={option}
            handleOptionChange={handleOptionChange}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}

export default Options;
