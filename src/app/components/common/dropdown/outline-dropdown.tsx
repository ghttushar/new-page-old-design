import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import { getDateRangeText, hexToRGBA } from 'src/utils';
import InfoIcon from '../info-icon/info-icon';
import { IDropdownItem, IDropdownProps } from './dropdown';
import {
  formStyles,
  inputLabelStyles,
  listItemStyles,
  menuProps,
  noOutlineSelectStyles,
} from './dropdown-styles';

export interface IMenuItemProps {
  'data-index': number;
}

const OutLineDropdown = <T,>(props: IDropdownProps<T>) => {
  const {
    options,
    label,
    selected,
    onSelect,
    width,
    fontWeight,
    fontColor,
    customDateRange,
    disabled,
    isTooltipRequired,
    stopPropagation,
    dropdownHeight,
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
    const selectedValue = options[idx];

    setSelectedOption(selectedValue);
    onSelect(selectedValue);
  };

  useEffect(() => {
    setSelectedOption(selected);
  }, [selected]);

  useEffect(() => {
    if (
      customDateRange !== undefined &&
      customDateRange.startDate !== undefined &&
      customDateRange?.endDate !== undefined &&
      customDateRange.startDate !== '' &&
      customDateRange?.endDate !== ''
    ) {
      setCustomDateRangeText(
        getDateRangeText(customDateRange.startDate, customDateRange.endDate)
      );
    }
  }, [customDateRange]);

  const selectStyles = {
    ...noOutlineSelectStyles,
    width: width,
    marginRight: '0.5rem',
  };

  return (
    <div
      style={formStyles}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
    >
      {label && <InputLabel sx={inputLabelStyles}>{label}: </InputLabel>}
      <FormControl
        variant="standard"
        sx={{
          m: 1,
          marginTop: '0.2rem',
          margin: '0rem',
          '& .Mui-disabled': {
            cursor: 'not-allowed',
          },
        }}
      >
        <Select
          value={selectedOption}
          onChange={handleChange}
          disableUnderline
          disabled={disabled}
          renderValue={(selected) => (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.2rem',
                  fontWeight: fontWeight ? fontWeight : 400,
                  letterSpacing: 0,
                  color: fontColor ? fontColor : '#474747',
                  '&.Mui-disabled': {
                    cursor: 'not-allowed',
                  },
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
                title={
                  selectedOption.isCustom &&
                  customDateRangeText !== undefined &&
                  customDateRangeText !== ''
                    ? customDateRangeText
                    : selectedOption.label
                }
              >
                {selectedOption.isCustom &&
                customDateRangeText !== undefined &&
                customDateRangeText !== ''
                  ? customDateRangeText
                  : selectedOption.label}
              </Typography>
              {isTooltipRequired === true &&
                !selectedOption.isDisabled &&
                selectedOption.tooltipText && (
                  <InfoIcon
                    title={selectedOption.tooltipText as string}
                    position={'right' as TooltipPlacement}
                  />
                )}
            </div>
          )}
          inputProps={{ 'aria-label': 'Without label' }}
          sx={selectStyles}
          MenuProps={menuProps(dropdownHeight)}
        >
          {options.map((option, index) => (
            <MenuItem
              key={`${option.value}-${index}`}
              value={option.value as string}
              data-index={index}
              disabled={option.isDisabled}
              aria-disabled={option.isDisabled}
              autoFocus={selectedOption.value === option.value}
              className={
                selectedOption.value === option.value ? 'Mui-selected' : ''
              }
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',

                '.MuiListItemIcon-root': {
                  pointerEvents: 'all',
                },
                '&:hover .MuiTypography-body1': { color: '#77469B' },
                '&.Mui-selected': {
                  backgroundColor: hexToRGBA('#77469B', 0.2),
                  '&.Mui-focusVisible': {
                    backgroundColor: hexToRGBA('#77469B', 0.4),
                  },
                },
                cursor: option.isDisabled
                  ? 'not-allowed !important'
                  : 'pointer !important',
                '.Mui-disabled': {
                  color: (theme) => theme.palette.text.disabled,
                  '& .MuiTypography-body1': {
                    color: (theme) => theme.palette.text.disabled,
                  },
                  '&:hover': {
                    '& .MuiTypography-body1': {
                      color: (theme) => theme.palette.text.disabled,
                      cursor: 'not-allowed !important',
                    },
                  },
                },
              }}
            >
              <ListItemText
                primary={option.label}
                sx={{
                  ...listItemStyles,
                  cursor: option.isDisabled
                    ? 'not-allowed !important'
                    : 'pointer !important',
                }}
              />
              {isTooltipRequired === true && (
                <ListItemIcon
                  sx={{
                    display: 'inline-flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    cursor: option.isDisabled
                      ? 'not-allowed !important'
                      : 'pointer !important',
                    '&:hover .MuiTypography-body1': {
                      color: option.isDisabled
                        ? (theme) => theme.palette.text.disabled
                        : 'inherit',
                    },
                  }}
                  onClick={(e) => {
                    if (option.isDisabled) {
                      e.preventDefault();
                      e.stopPropagation();
                      return;
                    }
                  }}
                >
                  <InfoIcon
                    title={option.tooltipText as string}
                    position={'right' as TooltipPlacement}
                  />
                </ListItemIcon>
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default OutLineDropdown;
