import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { GlobalDataTestIds } from 'cypress/enums/global';
import { useMemo } from 'react';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';

import React from 'react';
import CustomCheckbox from '../custom-checkbox/custom-checkbox';
import {
  listItemTextStyles,
  menuItemStyles,
  menuPropsStyles,
  paperPropsNewStyles,
  paperPropsOldStyles,
  paperPropsStyles,
  selectNewStyles,
  selectOldStyles,
  selectStyles,
} from './dropdown-styles';
import styles from './dropdown.module.scss';
import { inputLabelStyles } from './searchable-dropdown-styles';

interface IMultiSelectSearchableDropdownProps {
  options: IMultiSelectDropdownItem[];
  label?: string;
  onSelect: (selectedOptions: IMultiSelectDropdownItem[]) => void;
  width?: string;
  height?: string;
  background?: string;
  fontWeight?: string;
  disabled?: boolean;
  customWrapperStyles?: React.CSSProperties;
  stopPropagation?: boolean;
  maxLimit?: number;
  minLimit?: number;
  isNewDesign?: boolean;
  horizontalDisplay?: boolean;
}

export default function MultiSelectDropdown<T>({
  options,
  label,
  onSelect,
  width,
  height,
  background,
  fontWeight,
  disabled,
  customWrapperStyles,
  stopPropagation,
  maxLimit = options.length,
  minLimit,
  isNewDesign,
  horizontalDisplay = false,
}: IMultiSelectSearchableDropdownProps) {
  const hasSingleOption = options.length === 1;

  const selectedCount = useMemo(
    () => options.filter((option) => option.selected).length,
    [options]
  );

  const handleSelect = (label: string) => {
    if (hasSingleOption) return;

    const targetOption = options.find((option) => option.label === label);

    if (
      minLimit !== undefined &&
      targetOption?.selected &&
      selectedCount - 1 < minLimit
    )
      return;

    if (!targetOption) return;

    if (targetOption.selected) {
      const updatedOptions = options.map((option) => ({
        ...option,
        selected: option.label === label ? false : option.selected,
      }));
      onSelect(updatedOptions);
      return;
    }

    if (selectedCount >= maxLimit) {
      const firstSelectedOption = options.find((option) => option.selected);
      const updatedOptions = options.map((option) => ({
        ...option,
        selected:
          option.label === label
            ? true
            : option.label === firstSelectedOption?.label
            ? false
            : option.selected,
      }));
      onSelect(updatedOptions);
      return;
    }

    // Normal selection when under maxLimit
    const updatedOptions = options.map((option) => ({
      ...option,
      selected: option.label === label ? true : option.selected,
    }));
    onSelect(updatedOptions);
  };

  return (
    <div
      data-test={GlobalDataTestIds.MULTI_SELECT_DROPDOWN}
      style={customWrapperStyles}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
    >
      <span className="flex">
        {label !== '' && <InputLabel sx={inputLabelStyles}>{label}</InputLabel>}
      </span>

      <FormControl
        sx={{
          m: 1,
          minWidth: 120,
          margin: '0rem',
          marginTop: label ? '0.2rem' : '0rem',
          '& .Mui-disabled': {
            cursor: 'not-allowed',
          },
        }}
      >
        <Select
          multiple
          displayEmpty
          disabled={disabled}
          value={options
            .filter((option) => option.selected)
            .map((option) => option.label)}
          renderValue={(selected) => {
            if (selected.length) {
              const commaSeparatedText = selected.join(', ');
              return (
                <HoverInfoTooltip title={commaSeparatedText}>
                  <span className={styles.selectStyles}>
                    {commaSeparatedText}
                  </span>
                </HoverInfoTooltip>
              );
            } else {
              return (
                <span
                  style={{
                    marginLeft: '-0.4rem',
                  }}
                >
                  {'Select an Option...'}
                </span>
              );
            }
          }}
          IconComponent={ExpandMoreIcon}
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{
            ...selectStyles,
            width: width ?? '20rem',
            height: height ?? '3rem',
            background: background ?? 'inherit',
            fontWeight: fontWeight ?? 600,
            whiteSpace: 'pre-wrap',
            border: '1px solid #dadeeb ',
            ...(isNewDesign ? selectNewStyles : selectOldStyles),
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                ...paperPropsStyles,
                ...(isNewDesign ? paperPropsNewStyles : paperPropsOldStyles),
                ...(horizontalDisplay && {
                  maxHeight: 'none',
                  width: 'auto',
                  minWidth: '20rem',
                }),
              },
            },
            sx: {
              ...menuPropsStyles,
              ...(horizontalDisplay && {
                '& .MuiList-root': {
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.ceil(
                    options.length / 4
                  )}, 1fr)`,
                  padding: '0.5rem',
                  gap: '0.4rem',
                },
              }),
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              onClick={() => handleSelect(option.label)}
              disabled={option.isDisabled}
              sx={{
                ...menuItemStyles,
                background: option.selected ? '#F1F2F3' : '',
                ...(horizontalDisplay && {
                  padding: '0.4rem 0.6rem',
                  minHeight: 'auto',
                  borderRadius: '4px',
                  '& .MuiCheckbox-root': {
                    padding: '0.2rem',
                  },
                }),
              }}
            >
              <CustomCheckbox
                checked={option.selected}
                disabled={option.isDisabled}
                checkboxColor="#77469b"
                debounceDelay={100}
              />
              <ListItemText
                primary={option.label}
                sx={{
                  ...listItemTextStyles,
                  ...(horizontalDisplay && {
                    '& .MuiTypography-body1': {
                      fontSize: '1rem',
                    },
                  }),
                }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
