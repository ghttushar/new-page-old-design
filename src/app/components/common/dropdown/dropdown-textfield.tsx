import { MarketplaceEnum } from '@/enums/serp.enums';
import { getValidNumber } from '@/utils';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import { IDropdownProps } from './dropdown';
import { inputLabelStyles } from './dropdown-styles';
import { textfieldStyles } from './dropdown-textfield-styles';
import styles from './dropdown-textfield.module.scss';
import OutLineDropdown from './outline-dropdown';

export default function DropdownTextfield<T>(props: IDropdownProps<T>) {
  const {
    options,
    label,
    selected,
    onSelect,
    fieldValue,
    onValueChange,
    width,
    height,
    fontColor,
    background,
    fontWeight,
    customDateRange,
    disabled,
    onMouseDown,
    isTooltipRequired,
    stopPropagation,
    error = false,
  } = props;

  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = advertisingAccount.marketplace;
  const stepSize = marketplace === MarketplaceEnum.AMAZON ? 0.02 : 0.01;

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.valueAsNumber;
    onValueChange && onValueChange(getValidNumber(value) ?? value);
  };

  return (
    <div
      className={styles.container}
      style={{
        width: width ? width : '100%',
        height: height ? height : 'auto',
        border: error ? '0.1rem solid #f00' : '0.1rem solid #dadeeb',
      }}
    >
      {label && <InputLabel sx={inputLabelStyles}>{label}: </InputLabel>}

      <OutLineDropdown
        label={''}
        options={options}
        selected={selected}
        onSelect={onSelect}
        width="14rem"
        fontWeight={fontWeight ? fontWeight : '600'}
        fontColor={fontColor ? fontColor : '#77469B'}
        stopPropagation={stopPropagation}
      />

      <span className={styles.vl}></span>

      <TextField
        type="number"
        value={fieldValue}
        sx={{
          ...textfieldStyles,
          '& .MuiOutlinedInput-root': {
            fontSize: '1.2rem',
            borderRadius: 0,
            fontWeight: fontWeight ? fontWeight : '500',
          },
        }}
        variant="outlined"
        onChange={handleValueChange}
        InputProps={{
          inputProps: {
            min: 0,
            step: stepSize,
            inputMode: 'decimal',
          },
        }}
      />
    </div>
  );
}
