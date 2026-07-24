import {
  AD_GROUP_LEVEL,
  adGroupLevelOptions,
  CAMPAIGN_LEVEL,
  TARGETING_LEVEL,
  targetingLevelOptions,
} from '@/constants/filter.constants';
import { FilterDropdownValue } from '@/enums/filter.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { ListSubheader } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { CaretUpIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import { checkIsAllDropdownItemSelected } from 'src/utils/dropdown.utils';
import { listSubHeaderStyles } from '../dropdown/dropdown-styles';
import { textButtonOldStyles } from '../text-button/text-button-styles';
import {
  checkboxStyles,
  formControlLabelStyles,
  textFieldStyles,
} from './multiselect-option-box-styles';
import styles from './multiselect-option-box.module.scss';

interface MultiselectOptionBoxProps {
  options: IMultiSelectDropdownItem[];
  label?: string;
  onSelect: (selectedOptions: IMultiSelectDropdownItem[]) => void;
  width?: string;
  height?: string;
  isHorizontalScroll?: boolean;
  emptyOptionListMessage: string;
  disabled?: boolean;
  top?: string;
  isFilter?: boolean;
}

export default function MultiselectOptionBox({
  options,
  label = '',
  onSelect,
  width,
  height,
  isHorizontalScroll = true,
  emptyOptionListMessage,
  disabled,
  top,
  isFilter = false,
}: MultiselectOptionBoxProps) {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [searchedOptions, setSearchedOptions] =
    useState<IMultiSelectDropdownItem[]>(options);
  const [searchText, setSearchText] = useState<string>('');
  const isMounted = useRef(false);
  const optionBoxRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (disabled) {
      return;
    }
    setOpenDropdown(!openDropdown);
  };
  const getLevelName = (value: string) => {
    if (value === FilterDropdownValue.NAME) return CAMPAIGN_LEVEL;
    else if (value === targetingLevelOptions[0]) return TARGETING_LEVEL;
    else if (value === adGroupLevelOptions[0]) return AD_GROUP_LEVEL;
  };
  const handleSearchTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);

    if (event.target.value !== '') {
      const newOptionsList = options.filter((option) =>
        option.label?.toLowerCase().includes(event.target.value?.toLowerCase())
      );
      setSearchedOptions(newOptionsList);
    } else {
      setSearchedOptions(options);
    }
  };

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === '' || event.target.name === MarketplaceEnum.All) {
      const currentValue = options[0];
      const updatedOptions = options.map((option) => ({
        ...option,
        selected: !currentValue.selected,
      }));

      const updatedSearchedOptions = searchedOptions.map((option) => ({
        ...option,
        selected: !currentValue.selected,
      }));

      setSearchedOptions(updatedSearchedOptions);
      onSelect(updatedOptions);
    } else {
      const updatedOptions = options.map((option) => ({
        ...option,
        selected:
          option.value === event.target.name
            ? !option.selected
            : option.selected,
      }));

      updatedOptions[0].selected = isFilter
        ? updatedOptions[0].selected
        : checkIsAllDropdownItemSelected(updatedOptions);

      const updatedSearchedOptions = searchedOptions.map((option) => {
        return {
          ...option,
          selected:
            option.value === event.target.name
              ? !option.selected
              : option.selected,
        };
      });

      setSearchedOptions(updatedSearchedOptions);
      onSelect(updatedOptions);
    }
  };

  const handleClear = () => {
    const updatedOptions = options.map((option) => ({
      ...option,
      selected: false,
    }));

    setSearchedOptions(
      searchedOptions.map((option) => {
        return {
          ...option,
          selected: false,
        };
      })
    );
    onSelect(updatedOptions);
  };

  useEffect(() => {
    if (!isMounted.current && options.length > 1) {
      setSearchedOptions(options);
      isMounted.current = true;
    }
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionBoxRef.current &&
        !optionBoxRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.optionBoxContainer} ref={optionBoxRef}>
      <div
        className={styles.optionBoxDropdownContainer}
        onClick={toggleDropdown}
      >
        <Typography fontSize="1.2rem" fontWeight={400}>
          {label}
        </Typography>
        <div
          className={`${styles.optionBoxDropdown} ${
            disabled ? styles.optionBoxDropdownDisabled : ''
          }`}
          style={{
            width: width ? width : '100%',
            height: height ? height : '3rem',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <Typography
            fontSize="1.2rem"
            fontWeight={600}
            color={disabled ? '#a3a3a3' : ''}
          >
            {checkIsAllDropdownItemSelected(options) ? (
              'All'
            ) : (
              <span className={styles.optionBoxDropdownLabel}>
                {options.filter((option) => option.selected).length}
              </span>
            )}{' '}
            Selected
          </Typography>

          <CaretUpIcon
            size={10}
            color="#757575"
            weight="bold"
            style={{
              transform: `rotate(${openDropdown ? '0deg' : '180deg'})`,
            }}
          />
        </div>
      </div>

      {openDropdown === true && (
        <div
          className={styles.optionBox}
          style={{
            top: top ? top : '',
          }}
        >
          {isFilter ? null : (
            <div className={styles.searchContainer}>
              <TextField
                value={searchText}
                id="search"
                variant="outlined"
                type="text"
                placeholder="Search..."
                sx={textFieldStyles}
                onChange={handleSearchTextChange}
              />
            </div>
          )}
          <div
            className={styles.optionBoxButtonContainer}
            style={{
              width: width ? width : '60rem',
              justifyContent: isFilter ? 'end' : '',
              marginTop: isFilter ? '0' : '',
            }}
          >
            {isFilter ? null : (
              <Typography fontSize="1.2rem" fontWeight={600}>
                {checkIsAllDropdownItemSelected(options) ? (
                  'All'
                ) : (
                  <span className={styles.optionBoxDropdownLabel}>
                    {options.filter((option) => option.selected).length}
                  </span>
                )}{' '}
                Selected
              </Typography>
            )}

            <div
              style={{
                ...textButtonOldStyles,
                cursor:
                  options.filter((option) => option.selected).length > 0
                    ? 'pointer'
                    : 'not-allowed',
                color:
                  options.filter((option) => option.selected).length > 0
                    ? '#77469b'
                    : '#bfbfbf',
                transition: 'color 0.2s ease',
              }}
              onClick={handleClear}
            >
              Clear All
            </div>
          </div>

          <FormGroup
            className={
              isHorizontalScroll
                ? styles.optionBoxOptionsContainerHorizontal
                : styles.optionBoxOptionsContainerVertical
            }
            sx={
              isHorizontalScroll
                ? {}
                : {
                    flexWrap: 'nowrap',
                  }
            }
          >
            {searchedOptions.length > 0 ? (
              searchedOptions.map((option, index) => (
                <div key={`${option.value}-${index}`}>
                  {getLevelName(option.value) && (
                    <ListSubheader
                      sx={{
                        ...listSubHeaderStyles,
                        marginLeft: '-0.5rem',
                      }}
                    >
                      {getLevelName(option.value)}
                    </ListSubheader>
                  )}
                  <FormControlLabel
                    key={`${option.value}-${index}`}
                    control={
                      <Checkbox
                        checked={option.selected}
                        onChange={handleSelect}
                        name={option.value}
                        sx={{
                          ...checkboxStyles,
                          marginLeft: isFilter ? '1rem' : '0',
                        }}
                      />
                    }
                    label={option.label}
                    className={styles.optionBoxOption}
                    sx={formControlLabelStyles(isFilter)}
                  />
                </div>
              ))
            ) : (
              <Typography fontSize="1.2rem" fontWeight={600} color="#171717">
                {emptyOptionListMessage}
              </Typography>
            )}
          </FormGroup>
        </div>
      )}
    </div>
  );
}
