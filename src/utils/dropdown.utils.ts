import {
  ICustomDropdownFilterOption,
  ICustomDropdownFilterState,
  ICustomDropdownSearchConfig,
  IFilterBasedCustomDropdownItem,
  IMultiSelectDropdownItem,
} from 'src/interfaces/dropdown.interfaces';

export const checkIsAllDropdownItemSelected = (
  options: IMultiSelectDropdownItem[]
) => options.slice(1).every((option) => option.selected);

export const filterBySearch = <T>(
  searchText: string,
  options: IFilterBasedCustomDropdownItem<T>[],
  searchConfig?: ICustomDropdownSearchConfig<T>
): IFilterBasedCustomDropdownItem<T>[] => {
  if (
    !searchText ||
    !searchText.trim() ||
    !searchConfig ||
    !searchConfig?.keys.length ||
    !options.length
  )
    return options;

  const formattedSearch = searchText.toLowerCase();

  return options.filter((option) => {
    if (!option.data) return false;

    return searchConfig.keys.some((key) => {
      const value = option.data?.[key];

      return String(value ?? '')
        ?.toLowerCase()
        .includes(formattedSearch);
    });
  });
};

export const filterByCheckbox = <T>(
  filterState: ICustomDropdownFilterState,
  options: IFilterBasedCustomDropdownItem<T>[],
  checkboxFilterConfig?: ICustomDropdownFilterOption<T>[]
): IFilterBasedCustomDropdownItem<T>[] => {
  if (!checkboxFilterConfig || !checkboxFilterConfig.length || !options.length)
    return options;

  const activeFilters = checkboxFilterConfig.filter(
    (config) => filterState[config.label]
  );

  if (!activeFilters.length) return options;

  return options.filter((option) => {
    const data = option.data;

    if (!data) return false;

    return activeFilters.every((filter) => {
      if (filter.customLogic) {
        return filter.customLogic(data);
      }

      if (filter.value) {
        if (
          typeof data[filter.key] === 'string' &&
          typeof filter.value === 'string'
        )
          return (
            String(data[filter.key]).toLowerCase() ===
            filter.value?.toLowerCase()
          );

        return data[filter.key] === filter.value;
      }

      return true;
    });
  });
};

export const getFilteredOptions = <T>(
  searchText: string,
  options: IFilterBasedCustomDropdownItem<T>[],
  filterState: ICustomDropdownFilterState,
  searchConfig?: ICustomDropdownSearchConfig<T>,
  checkboxFilterConfig?: ICustomDropdownFilterOption<T>[]
): IFilterBasedCustomDropdownItem<T>[] => {
  let filteredOptions = options;

  filteredOptions = filterBySearch(searchText, filteredOptions, searchConfig);
  filteredOptions = filterByCheckbox(
    filterState,
    filteredOptions,
    checkboxFilterConfig
  );

  return filteredOptions;
};
