import TextField from '@mui/material/TextField';
import { useCallback, useMemo, useState } from 'react';
import { ALL_LABEL } from 'src/constants';
import { useAppDispatch } from 'src/redux/hooks';
import { setSelectedBrands } from 'src/redux/slices/market-intelligence/market-intelligence.slice';
import { IDropdownItem } from '../../dropdown/dropdown';
import Header from './header/header';
import Options from './options/options';
import styles from './search-filter.module.scss';
import sxStyles from './styles';

export interface ISearchFilterProps {
  initialOptions: IDropdownItem<string>[];
  setFilterOpen: (value: boolean) => void;
}

const SearchFilter: React.FC<ISearchFilterProps> = ({
  initialOptions,
  setFilterOpen,
}) => {
  const [searchText, setSearchText] = useState('');
  const [options, setOptions] =
    useState<IDropdownItem<string>[]>(initialOptions);
  const dispatch = useAppDispatch();

  const isAllSelected = (options: IDropdownItem<string>[]) =>
    options.every((option) => option.value === '' || option.selected);

  const filteredOptions = useMemo(() => {
    if (!searchText) {
      options[0].selected = isAllSelected(options);
      return options;
    }

    const matchingOptions = options
      .slice(1)
      .filter((option) =>
        option.value.toLowerCase().includes(searchText.toLowerCase())
      );

    options[0].selected = isAllSelected(matchingOptions);

    return [{ ...options[0] }, ...matchingOptions];
  }, [options, searchText]);

  const handleOptionChange = useCallback(
    (value: IDropdownItem<string>) => {
      setOptions((prevOptions) => {
        const newOptions = [...prevOptions];

        if (value.label === ALL_LABEL) {
          if (searchText) {
            const filteredValues = new Set(
              filteredOptions.slice(1).map((option) => option.value)
            );

            return newOptions.map((option) => ({
              ...option,
              selected: filteredValues.has(option.value)
                ? !value.selected
                : option.selected,
            }));
          }
          return newOptions.map((option) => ({
            ...option,
            selected: !value.selected,
          }));
        }

        const idx = newOptions.indexOf(value);
        if (idx !== -1) {
          newOptions[idx].selected = !newOptions[idx].selected;
          newOptions[0].selected = isAllSelected(
            searchText ? filteredOptions : newOptions
          );
        }
        return newOptions;
      });
    },
    [filteredOptions, searchText]
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleApplyClick = useCallback(() => {
    const selectedFilters = options
      .slice(1)
      .filter((option) => option.selected)
      .map((option) => option.value);

    dispatch(setSelectedBrands(selectedFilters));
    setFilterOpen(false);
  }, [dispatch, options, setFilterOpen]);

  const selectedCount = useMemo(
    () =>
      options.filter((option) => option.selected && option.value !== '').length,
    [options]
  );

  return (
    <div className={styles.optionFilterOptions} data-test="option-filter-popup">
      <Header
        handleApplyClick={handleApplyClick}
        selectedCount={selectedCount}
      />
      <TextField
        placeholder="Search"
        size="small"
        sx={sxStyles.searchFieldStyles}
        onChange={handleSearch}
        value={searchText}
        autoFocus
        data-test="search-field"
      />
      <Options
        options={filteredOptions}
        handleOptionChange={handleOptionChange}
      />
    </div>
  );
};

export default SearchFilter;
