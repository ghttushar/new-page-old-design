import { Range } from '@/enums/serp.enums';
import { ListSubheader } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import {
  nonPerformanceMetricsOptions,
  performanceOptions,
} from 'src/constants/filter.constants';
import { Filters } from 'src/enums/filter.enums';
import { IDateRange } from 'src/interfaces/serp.interface';
import { getDateRangeText } from 'src/utils';
import { getCategoryWiseFilters } from 'src/utils/row-filter.utils';
import InfoIcon from '../info-icon/info-icon';
import {
  formControlStyles,
  inputLabelStyles,
  listItemTextStyles,
  listSubHeaderStyles,
  menuPropsStyles,
  paperPropsNewStyles,
  paperPropsOldStyles,
  paperPropsStyles,
  selectNewStyles,
  selectOldStyles,
  selectStyles,
} from './dropdown-styles';
import styles from './dropdown.module.scss';

export interface IDropdownItem<T> {
  label: string;
  value: T;
  isCustom?: boolean;
  isDisabled?: boolean;
  selected?: boolean;
  tooltipText?: string;
}

export interface IDropdownProps<T> {
  options: IDropdownItem<T>[];
  label?: string;
  labelStyles?: React.CSSProperties;
  labelTooltipTitle?: string;
  selected: IDropdownItem<T>;
  onSelect: (option: IDropdownItem<T>) => void;
  fieldValue?: number;
  onValueChange?: (value: number) => void;
  width?: string;
  height?: string;
  variant?: string;
  fontColor?: string;
  background?: string;
  fontWeight?: string;
  customDateRange?: IDateRange;
  disabled?: boolean;
  stopPropagation?: boolean;
  onMouseDown?: () => void;
  isTooltipRequired?: boolean;
  isNewDesign?: boolean;
}

export interface IMenuItemProps {
  'data-index': number;
}

const CategoryDropdown = <T,>(props: IDropdownProps<T>) => {
  const {
    options,
    label,
    labelStyles,
    labelTooltipTitle,
    selected,
    onSelect,
    customDateRange,
    width,
    height,
    background,
    fontWeight,
    onMouseDown,
    fontColor,
    variant,
    stopPropagation,
    disabled,
    isNewDesign,
  } = props;
  const [selectedOption, setSelectedOption] =
    useState<IDropdownItem<T>>(selected);
  const [customDateRangeText, setCustomDateRangeText] = useState<string>('');

  const handleChange = (
    event: SelectChangeEvent<IDropdownItem<T>>,
    element: React.ReactNode
  ) => {
    const el = element as React.ReactElement;

    const idx = el.props['data-index'];
    const selectedValue = options.find(
      (option) => option.value === idx
    ) as IDropdownItem<T>;

    setSelectedOption(selectedValue);
    onSelect(selectedValue);
  };

  useEffect(() => {
    setCustomDateRangeText('');
    if (
      selected.value === Range.CUSTOM_RANGE &&
      customDateRange !== undefined &&
      customDateRange.startDate !== undefined &&
      customDateRange.endDate !== undefined &&
      customDateRange.startDate !== '' &&
      customDateRange.endDate !== ''
    ) {
      setCustomDateRangeText(
        getDateRangeText(customDateRange.startDate, customDateRange.endDate)
      );
    }
    setSelectedOption(selected);
  }, [customDateRange, selected]);

  return (
    <div
      className={variant === 'sideBySide' ? styles.sideBySide : styles.default}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
    >
      {label !== '' && (
        <InputLabel sx={inputLabelStyles} style={labelStyles}>
          {label}
          {labelTooltipTitle && (
            <InfoIcon title={labelTooltipTitle as string} />
          )}
        </InputLabel>
      )}

      <FormControl
        sx={{ ...formControlStyles, width: width ? width : 'auto' }}
        disabled={disabled}
      >
        <Select
          value={selectedOption}
          onChange={handleChange}
          onMouseDown={onMouseDown}
          renderValue={(selected) => (
            <Typography
              sx={{
                fontSize: '1.2rem',
                fontWeight: fontWeight ? fontWeight : 400,
                color: fontColor ? fontColor : 'inherit',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
              title={
                customDateRangeText !== undefined && customDateRangeText !== ''
                  ? customDateRangeText
                  : selectedOption.label
              }
            >
              {customDateRangeText !== undefined && customDateRangeText !== ''
                ? customDateRangeText
                : selectedOption.label}
            </Typography>
          )}
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{
            ...selectStyles,
            width: width,
            textAlign: 'start',
            height: height ? height : '3rem',
            background: background ? background : 'inherit',
            border: '1px solid #dadeeb !important',
            ...(isNewDesign ? selectNewStyles : selectOldStyles),
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                ...paperPropsStyles,
                ...(isNewDesign ? paperPropsNewStyles : paperPropsOldStyles),
              },
            },
            sx: menuPropsStyles,
          }}
        >
          {getCategoryWiseFilters(options).detailsFilters.length > 0 && (
            <ListSubheader sx={listSubHeaderStyles}>Details</ListSubheader>
          )}
          {options.map(
            (option, index) =>
              nonPerformanceMetricsOptions.includes(
                option.value as Filters
              ) && (
                <MenuItem
                  key={`${option.value}-${index}`}
                  value={option.value as string}
                  data-index={option.value}
                  disabled={option.isDisabled}
                  autoFocus={selectedOption.value === option.value}
                  className={
                    selectedOption.value === option.value ? 'Mui-selected' : ''
                  }
                >
                  <ListItemText
                    primary={option.label}
                    sx={listItemTextStyles}
                  />
                </MenuItem>
              )
          )}

          {getCategoryWiseFilters(options).performanceFilters.length > 0 && (
            <ListSubheader sx={listSubHeaderStyles}>Performance</ListSubheader>
          )}
          {options.map(
            (option, index) =>
              performanceOptions.includes(option.value as Filters) && (
                <MenuItem
                  key={`${option.value}-${index}`}
                  data-index={option.value}
                  disabled={option.isDisabled}
                >
                  <ListItemText
                    primary={option.label}
                    sx={listItemTextStyles}
                  />
                </MenuItem>
              )
          )}
        </Select>
      </FormControl>
    </div>
  );
};

export default CategoryDropdown;
