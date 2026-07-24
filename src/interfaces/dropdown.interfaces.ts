export interface IMultiSelectDropdownItem {
  label: string;
  value: string;
  isDisabled?: boolean;
  selected: boolean;
}

export interface IMultiSelectCustomDropdownItem
  extends IMultiSelectDropdownItem {
  isActive: boolean;
  isDayParting: boolean;
}

export interface IMultiSelectProductSearchDropdownItem
  extends IMultiSelectDropdownItem {
  itemId: string;
  price: number;
  imgURL: string;
}

export interface IFilterBasedCustomDropdownItem<T = unknown> {
  label: string;
  value: string | number;
  data: T | null;
  isDisabled?: boolean;
}

export interface ICustomDropdownFilterOption<T = unknown> {
  label: string;
  key: keyof T;
  value?: unknown;
  customLogic?: (item: T) => boolean;
}

export interface ICustomDropdownSearchConfig<T = unknown> {
  keys: (keyof T)[];
}

export interface ICustomDropdownItemOptionMetaDataConfig<T = unknown> {
  keys: (keyof T)[];
}

export interface ICustomDropdownFilterState {
  [label: string]: boolean;
}
