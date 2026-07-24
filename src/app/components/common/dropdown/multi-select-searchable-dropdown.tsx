import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import Autocomplete, {
  AutocompleteInputChangeReason,
} from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { XIcon } from '@phosphor-icons/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALL_VALUE } from 'src/constants';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import {
  checkboxStyles,
  listItemTextStyles,
  menuItemStyles,
} from './dropdown-styles';
import styles from './multi-select-searchable-dropdown.module.scss';
import {
  autocompleteStyles,
  customPaperStyle,
  inputLabelStyles,
} from './searchable-dropdown-styles';

interface IMultiSelectSearchableDropdownProps {
  options: IMultiSelectDropdownItem[];
  label?: string;
  placeholder?: string;
  onSelect: (selectedOptions: IMultiSelectDropdownItem[]) => void;
  width?: string;
  height?: string;
  background?: string;
  disabled?: boolean;
  customPaperCompStyle?: React.CSSProperties;
  customFilterOptions?: (
    options: IMultiSelectDropdownItem[],
    inputValue: string
  ) => IMultiSelectDropdownItem[];
  stopPropagation?: boolean;
}

export default function MultiSelectSearchableDropdown<T>({
  options,
  label,
  placeholder,
  onSelect,
  width,
  height,
  background,
  disabled,
  customFilterOptions,
  stopPropagation,
  customPaperCompStyle,
}: IMultiSelectSearchableDropdownProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isMounted = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isAllSelected = (options: IMultiSelectDropdownItem[]) =>
    options.every((option) => option.value === ALL_VALUE || option.selected);

  const selectedOptions = useMemo(
    () => options.filter((option) => option.selected && option.value !== ''),
    [options]
  );

  const handleSelect = (value: string) => {
    if (value === ALL_VALUE) {
      const visibleOptions = handleCustomFilterOptions(options, searchTerm);

      const visibleValueSet = new Set(
        visibleOptions
          .map((option) => option.value)
          .filter((value) => value !== ALL_VALUE)
      );

      const allVisibleSelected = visibleOptions
        .filter((option) => option.value !== ALL_VALUE)
        .every((option) => option.selected);

      const updatedOptions = options.map((option) => {
        if (option.value === ALL_VALUE) return option;

        if (visibleValueSet.has(option.value)) {
          return { ...option, selected: !allVisibleSelected };
        }

        return option;
      });

      updatedOptions[0].selected = isAllSelected(updatedOptions);

      onSelect(updatedOptions);
    } else {
      const updatedOptions = options.map((option) => ({
        ...option,
        selected: option.value === value ? !option.selected : option.selected,
      }));
      updatedOptions[0].selected = isAllSelected(updatedOptions);
      onSelect(updatedOptions);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<object>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    if (reason === 'input') {
      setSearchTerm(value);
    }
  };

  const handleCustomFilterOptions = (
    options: IMultiSelectDropdownItem[],
    inputValue: string
  ) => {
    if (customFilterOptions) {
      return customFilterOptions(options, inputValue);
    }

    return options.filter((option) => {
      if (option.value === ALL_VALUE) return true;
      return (
        option.label?.toLowerCase().includes(inputValue?.toLowerCase()) ||
        option.value.toLowerCase().includes(inputValue?.toLowerCase())
      );
    });
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        event.target !== document.body
      ) {
        handleClose();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div
      style={{
        width: width ? width : 'auto',
      }}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
    >
      <InputLabel sx={inputLabelStyles}>{label}</InputLabel>
      <FormControl
        sx={{
          m: 1,
          minWidth: 120,
          width: width ? width : 'auto',
          margin: '0rem',
          marginTop: '0.2rem',
          '& .Mui-disabled': {
            cursor: 'not-allowed',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: '1px solid #dadeeb !important',
            },
          },
        }}
      >
        <Autocomplete
          ref={containerRef}
          multiple
          disabled={disabled}
          options={options}
          value={options.filter((option) => option.selected)}
          inputValue={searchTerm}
          onInputChange={handleInputChange}
          filterOptions={(options, { inputValue }) =>
            handleCustomFilterOptions(options, inputValue)
          }
          open={isOpen}
          onOpen={handleOpen}
          disableCloseOnSelect
          disableClearable
          getOptionLabel={(option) => option.label}
          renderOption={(props, option, { selected }) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={menuItemStyles}
              style={{
                padding: '0.6rem 0.2rem',
              }}
              onClick={() => handleSelect(option.value)}
              title={option.label}
            >
              <Checkbox
                checked={
                  option.value === ALL_VALUE
                    ? isAllSelected(options)
                    : option.selected
                }
                sx={checkboxStyles}
                indeterminate={
                  option.value === ALL_VALUE && selectedOptions.length !== 0
                    ? !isAllSelected(options)
                    : false
                }
                indeterminateIcon={
                  <IndeterminateCheckBoxIcon
                    style={{
                      color: '#77469b',
                    }}
                  />
                }
              />
              <ListItemText primary={option.label} sx={listItemTextStyles} />
            </MenuItem>
          )}
          sx={{
            ...autocompleteStyles,
            '& .MuiAutocomplete-inputRoot': {
              width: width ? width : 'auto',
              height: height ? height : '3rem',
              background: background ? background : 'inherit',
              padding: '0rem',
              margin: '0rem',
              boxShadow: 'none',
              borderRadius: '0.4rem',
              flex: '1 1 auto',
              color: '#000000',
              fontSize: '1.2rem',
            },
          }}
          renderInput={({ InputProps, ...restParams }) => {
            return (
              <TextField
                {...restParams}
                placeholder={placeholder}
                InputProps={{
                  ...InputProps,
                  startAdornment: undefined,
                }}
              />
            );
          }}
          PaperComponent={({ children }) => {
            return (
              <div
                style={{
                  ...customPaperStyle,
                  ...customPaperCompStyle,
                }}
              >
                {selectedOptions.length > 0 && (
                  <span className={styles.paperComponent}>
                    {selectedOptions.map((option) => (
                      <React.Fragment key={option.value}>
                        <span
                          key={option.value}
                          className={styles.chipComponent}
                        >
                          {option.label}
                          <XIcon
                            onClick={() => handleSelect(option.value)}
                            size={'1.1rem'}
                            className="cursor-pointer"
                          />
                        </span>
                      </React.Fragment>
                    ))}
                  </span>
                )}
                {children}
              </div>
            );
          }}
        />
      </FormControl>
    </div>
  );
}
