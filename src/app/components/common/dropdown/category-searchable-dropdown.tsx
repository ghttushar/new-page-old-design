import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ListSubheader, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import React, { useEffect, useMemo, useState } from 'react';

import { RulesPageTitleEnum } from '@/enums/rules.enum';
import { Range } from '@/enums/serp.enums';
import { performanceOptions } from 'src/constants/filter.constants';
import { ConfigurationTableTitlesEnum } from 'src/enums/configurations.enum';
import { Filters } from 'src/enums/filter.enums';
import { IDateRange } from 'src/interfaces/serp.interface';
import { getDateRangeText } from 'src/utils';
import InfoIcon from '../info-icon/info-icon';
import { formControlStyles, listSubHeaderStyles } from './dropdown-styles';
import {
  autoCompleteMenuStyles,
  customPaperStyle,
  inputLabelStyles,
  selectStyles,
} from './searchable-dropdown-styles';

export interface ICategorySearchableDropdownItem<T> {
  label: string;
  value: T;
  isCustom?: boolean;
  isDisabled?: boolean;
  selected?: boolean;
  tooltipText?: string;
  group?: string;
}

export interface ICategorySearchableDropdownProps<T> {
  options: ICategorySearchableDropdownItem<T>[];
  label?: string;
  labelStyles?: React.CSSProperties;
  labelTooltipTitle?: string;
  selected: ICategorySearchableDropdownItem<T>;
  onSelect: (option: ICategorySearchableDropdownItem<T>) => void;
  fieldValue?: number;
  onValueChange?: (value: number) => void;
  width?: string;
  height?: string;
  fontColor?: string;
  background?: string;
  fontWeight?: string;
  customDateRange?: IDateRange;
  disabled?: boolean;
  stopPropagation?: boolean;
  onMouseDown?: () => void;
  isTooltipRequired?: boolean;
  selectedAdvertisingNavTitle?: string;
}

export interface IMenuItemProps {
  'data-index': number;
}

const CategorySearchableDropdown = <T,>(
  props: ICategorySearchableDropdownProps<T>
) => {
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
    stopPropagation,
    disabled,
    selectedAdvertisingNavTitle,
  } = props;
  const [selectedOption, setSelectedOption] =
    useState<ICategorySearchableDropdownItem<T>>(selected);
  const [customDateRangeText, setCustomDateRangeText] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isDropdownOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isDropdownOpen]);

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: ICategorySearchableDropdownItem<T> | null
  ) => {
    if (!value) return;

    const matchedOption = options.find((op) => op.value === value.value);
    if (matchedOption) {
      setSelectedOption(matchedOption);
      onSelect(matchedOption);
      setInputValue('');
    }
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

    const matchedOption = options.find((op) => op.value === selected.value);
    if (matchedOption) {
      setSelectedOption(matchedOption);
    }
  }, [customDateRange, selected, options]);

  const groupedOptions = useMemo(
    () =>
      selectedAdvertisingNavTitle ===
        ConfigurationTableTitlesEnum.SOURCE_TARGET_MAPPING ||
      selectedAdvertisingNavTitle === RulesPageTitleEnum.APPLIED_RULES
        ? options
        : options
            .map((option) => ({
              ...option,
              group: performanceOptions.includes(option.value as Filters)
                ? 'Performance'
                : 'Details',
            }))
            .sort((a, b) => a.group.localeCompare(b.group)),
    [options, selectedAdvertisingNavTitle]
  );

  return (
    <div
      style={{ width: width ? width : '100%' }}
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
        <Autocomplete
          onOpen={() => setIsDropdownOpen(true)}
          onClose={() => setIsDropdownOpen(false)}
          value={selectedOption}
          title={
            customDateRangeText !== undefined && customDateRangeText !== ''
              ? customDateRangeText
              : selectedOption.label
          }
          disabled={disabled}
          groupBy={(option) => option.group ?? ''}
          options={groupedOptions}
          getOptionDisabled={(option) => option.isDisabled ?? false}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          inputValue={inputValue}
          onInputChange={(_, newInput) => setInputValue(newInput)}
          onChange={handleChange}
          onMouseDown={onMouseDown}
          popupIcon={<ExpandMoreIcon />}
          sx={{
            ...selectStyles,
            '& .MuiAutocomplete-inputRoot': {
              padding: '0rem',
              margin: '0rem',
              borderRadius: '0.4rem',
              boxShadow: 'none',
              height: height ? height : '3rem',
              width: width || '100%',
              background: background ? background : 'inherit',
              textAlign: 'start',
              fontSize: '1.2rem',
            },
            '& .MuiAutocomplete-input': {
              color: fontColor ? fontColor : 'inherit',
              fontWeight: fontWeight ? fontWeight : 400,
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{
                background: 'white',
                borderRadius: '0.4rem',
                '& .MuiOutlinedInput-input': {
                  marginLeft: 'initial',
                },
              }}
            />
          )}
          renderOption={(props, option) => <li {...props}>{option.label}</li>}
          renderGroup={(params) => [
            <ListSubheader
              key={params.key}
              sx={{
                ...listSubHeaderStyles,
                marginLeft: '-0.5rem',
                position: 'relative',
              }}
            >
              {params.group}
            </ListSubheader>,
            params.children,
          ]}
          slotProps={{
            paper: {
              sx: {
                ...customPaperStyle,
                position: 'absolute',
                minWidth: '100%',
                overflowY: 'auto',
              },
            },
            popper: {
              sx: {
                ...autoCompleteMenuStyles,
                overflow: 'visible',
                height: 0,
              },
            },
          }}
        />
      </FormControl>
    </div>
  );
};

export default CategorySearchableDropdown;
