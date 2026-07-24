import {
  ICustomDropdownFilterOption,
  ICustomDropdownFilterState,
  ICustomDropdownItemOptionMetaDataConfig,
  ICustomDropdownSearchConfig,
  IFilterBasedCustomDropdownItem,
} from '@/interfaces/dropdown.interfaces';
import { getFilteredOptions } from '@/utils/dropdown.utils';
import Checkbox from '@mui/material/Checkbox';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import FormControlLabel from '@mui/material/FormControlLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popper from '@mui/material/Popper';
import { useMemo, useState } from 'react';
import CustomDropdownOptionComponent from './custom-dropdown-option-component';
import {
  dropdownCheckboxFilterContainerStyles,
  dropdownComponentContainerStyles,
  dropdownFilterCheckboxFormControlLabelStyles,
  dropdownFilterCheckboxStyles,
  dropdownFilterContainerStyles,
  dropdownOptionListContainerStyles,
  dropdownSearchFilterStyles,
  noOptionTextStyles,
} from './single-select-custom-filter-dropdown-styles';

interface ICustomFilterDropdownContainerProps<T> {
  containerOpen: boolean;
  anchorElement: HTMLElement | null;
  dropdownRef: React.MutableRefObject<HTMLDivElement | null>;
  width: string;
  selected: IFilterBasedCustomDropdownItem<T>;
  options: IFilterBasedCustomDropdownItem<T>[];
  onSelect: (option: IFilterBasedCustomDropdownItem<T>) => void;
  searchConfig?: ICustomDropdownSearchConfig<T>;
  checkboxFilterConfig?: ICustomDropdownFilterOption<T>[];
  optionMetaDataConfig?: ICustomDropdownItemOptionMetaDataConfig<T>;
  activeOptionStatusKey?: keyof T;
  onDropdownClose: () => void;
}

export default function CustomFilterDropdownContainer<T>({
  containerOpen,
  anchorElement,
  dropdownRef,
  width,
  selected,
  options,
  onSelect,
  searchConfig,
  checkboxFilterConfig,
  optionMetaDataConfig,
  activeOptionStatusKey,
  onDropdownClose,
}: ICustomFilterDropdownContainerProps<T>) {
  const [filterState, setFilterState] = useState<ICustomDropdownFilterState>(
    {}
  );
  const [search, setSearch] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value || '';
    setSearch(newValue);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;

    setFilterState((prev) => ({
      ...prev,
      [target.value]: target.checked,
    }));
  };

  const isFilterAvailable = useMemo(
    () =>
      (searchConfig && searchConfig?.keys.length > 0) ||
      (checkboxFilterConfig && checkboxFilterConfig.length > 0),
    [searchConfig, checkboxFilterConfig]
  );

  const filteredOptions = useMemo(
    () =>
      getFilteredOptions(
        search,
        options,
        filterState,
        searchConfig,
        checkboxFilterConfig
      ),
    [search, options, filterState, searchConfig, checkboxFilterConfig]
  );

  return (
    <Popper
      open={containerOpen}
      anchorEl={anchorElement}
      ref={dropdownRef}
      placement="bottom-start"
      style={{ zIndex: 1500 }}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ]}
    >
      <ClickAwayListener onClickAway={onDropdownClose}>
        <div
          style={{
            width: anchorElement?.clientWidth ?? width,
            ...dropdownComponentContainerStyles,
          }}
        >
          {isFilterAvailable === true && (
            <div style={dropdownFilterContainerStyles}>
              {searchConfig !== undefined && searchConfig.keys.length > 0 && (
                <OutlinedInput
                  type="text"
                  onChange={handleSearchChange}
                  value={search}
                  placeholder="Search..."
                  sx={dropdownSearchFilterStyles}
                />
              )}

              {checkboxFilterConfig !== undefined &&
                checkboxFilterConfig.length > 0 && (
                  <div style={dropdownCheckboxFilterContainerStyles}>
                    {checkboxFilterConfig.map((filter) => (
                      <FormControlLabel
                        key={filter.label}
                        control={
                          <Checkbox
                            sx={dropdownFilterCheckboxStyles}
                            checked={filterState[filter.label] ?? false}
                            onChange={handleFilterChange}
                            value={filter.label}
                          />
                        }
                        label={filter.label}
                        sx={dropdownFilterCheckboxFormControlLabelStyles}
                      />
                    ))}
                  </div>
                )}
            </div>
          )}

          <div
            style={{
              ...dropdownOptionListContainerStyles,
              maxHeight: isFilterAvailable ? '30rem' : '35rem',
            }}
          >
            {filteredOptions && filteredOptions.length > 0 ? (
              filteredOptions.map((op) => (
                <CustomDropdownOptionComponent
                  key={op.value}
                  option={op}
                  optionMetaDataConfig={optionMetaDataConfig}
                  activeOptionStatusKey={activeOptionStatusKey}
                  selected={selected}
                  onSelect={onSelect}
                />
              ))
            ) : (
              <p style={noOptionTextStyles}>No options to select</p>
            )}
          </div>
        </div>
      </ClickAwayListener>
    </Popper>
  );
}
