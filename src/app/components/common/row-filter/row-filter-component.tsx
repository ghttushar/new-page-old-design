import {
  FilterDropdownValue,
  FilterOptions,
  Filters,
  FilterValueType,
} from '@/enums/filter.enums';
import { IMultiSelectDropdownItem } from '@/interfaces/dropdown.interfaces';
import { IFilterRange } from '@/interfaces/index.interface';
import { useAppSelector } from '@/redux/hooks';
import { selectIsChatbotOpen } from '@/redux/slices/auth/auth.slice';
import { IFilterValue } from '@/redux/slices/filters/filter.slice';
import { TextField } from '@mui/material';
import { TrashIcon } from '@phosphor-icons/react';
import React from 'react';
import { textFieldStyles } from '../../page-components/day-parting-components/day-parting-form/day-parting-form-styles';
import { CustomNumberFieldComponent } from '../custom-text-field/custom-text-field';
import { defaultNumericFieldProps } from '../custom-text-field/custom-text-field.constants';
import CategorySearchableDropdown from '../dropdown/category-searchable-dropdown';
import Dropdown, { IDropdownItem } from '../dropdown/dropdown';
import MultiSelectDropdown from '../dropdown/multi-select-dropdown';
import MultiSelectSearchableDropdown from '../dropdown/multi-select-searchable-dropdown';
import SearchableDropdown from '../dropdown/searchable-dropdown';
import MultiselectOptionBox from '../multiselect-option-box/multiselect-option-box';
import styles from './row-filter.module.scss';
import { textboxNewStyles } from './row-filter.styles';

interface IRowFilterCompProps {
  filterId: number;
  inputValue: IFilterValue;
  filters: IDropdownItem<Filters>[];
  selectedFilterCategory: IDropdownItem<Filters>;
  isDisabledFilter: boolean;
  filterOptions: IDropdownItem<FilterOptions>[];
  selectedFilterOption: IDropdownItem<FilterOptions>;
  filterInputType: FilterValueType;
  multiSelectFilterOptions: IMultiSelectDropdownItem[];
  filterDropdownOptions: IDropdownItem<FilterDropdownValue>[];
  selectedFilterDropdown: IDropdownItem<FilterDropdownValue>;
  customDatePicker: JSX.Element;
  isInputDisabled: boolean;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeFilter: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleInputValueChange: (
    value: number | string | null | Array<string> | IFilterRange,
    rangeType?: 'from' | 'to'
  ) => void;
  handleSelectedFilter: (value: IDropdownItem<Filters>) => void;
  handleSelectedFilterOption: (value: IDropdownItem<FilterOptions>) => void;
  handleMultipleSelectDropdown: (
    selectedOptions: IMultiSelectDropdownItem[]
  ) => void;
  handleSelectedFilterDropdown: (
    value: IDropdownItem<FilterDropdownValue>
  ) => void;
  minValue?: string | number;
  trashIconStyles?: {
    color: string;
    cursor: string;
  };
  selectedAdvertisingNavTitle?: string;
}

const RowFilterComponent = ({
  filterId,
  inputValue,
  filters,
  selectedFilterCategory,
  isDisabledFilter,
  filterOptions,
  selectedFilterOption,
  filterInputType,
  multiSelectFilterOptions,
  filterDropdownOptions,
  selectedFilterDropdown,
  customDatePicker,
  isInputDisabled,
  handleKeyDown,
  removeFilter,
  handleInputValueChange,
  handleSelectedFilter,
  handleSelectedFilterOption,
  handleMultipleSelectDropdown,
  handleSelectedFilterDropdown,
  minValue,
  trashIconStyles,
  selectedAdvertisingNavTitle,
}: IRowFilterCompProps) => {
  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);
  return (
    <div className={styles.rowFilterContainer} id={String(filterId)}>
      <div className={styles.rowFilter}>
        <div className={styles.where}>
          {filterId === 0 ? (
            <h5>Where</h5>
          ) : (
            <h5
              style={{
                fontWeight: '300',
                fontSize: '1.2rem',
              }}
            >
              And
            </h5>
          )}
        </div>

        <CategorySearchableDropdown
          label={''}
          options={filters}
          selected={selectedFilterCategory}
          onSelect={handleSelectedFilter}
          width={isChatbotOpen ? '14rem' : '18rem'}
          stopPropagation={true}
          disabled={isDisabledFilter}
          selectedAdvertisingNavTitle={selectedAdvertisingNavTitle}
        />
        <Dropdown
          label={''}
          options={filterOptions}
          selected={selectedFilterOption}
          onSelect={handleSelectedFilterOption}
          width={isChatbotOpen ? '8rem' : '18rem'}
          stopPropagation={true}
        />

        <span className="flex gap-[1rem]">
          {filterInputType === FilterValueType.DROPDOWN ? (
            selectedFilterCategory.value === Filters.MATCH_TYPE_ADD ? (
              <MultiSelectDropdown
                options={multiSelectFilterOptions}
                label={''}
                onSelect={handleMultipleSelectDropdown}
                width={isChatbotOpen ? '14rem' : '18rem'}
                stopPropagation={true}
                customWrapperStyles={{ marginTop: '0.2rem' }}
              />
            ) : selectedFilterCategory.value === Filters.ACTION_TYPE ? (
              <MultiselectOptionBox
                options={multiSelectFilterOptions}
                isHorizontalScroll={false}
                top="5.5rem"
                width={isChatbotOpen ? '14rem' : '18rem'}
                onSelect={handleMultipleSelectDropdown}
                emptyOptionListMessage={'No Action Selected'}
                isFilter={true}
              />
            ) : (
              <SearchableDropdown
                label={''}
                options={filterDropdownOptions}
                selected={selectedFilterDropdown}
                onSelect={handleSelectedFilterDropdown}
                width={isChatbotOpen ? '14rem' : '18rem'}
              />
            )
          ) : filterInputType === FilterValueType.MULTI_SELECT_DROPDOWN ? (
            <MultiSelectSearchableDropdown
              options={multiSelectFilterOptions}
              width={isChatbotOpen ? '14rem' : '18rem'}
              onSelect={handleMultipleSelectDropdown}
              stopPropagation={true}
              customPaperCompStyle={{
                position: 'absolute',
                width: '40rem',
                right: 0,
              }}
            />
          ) : selectedFilterOption.value === FilterOptions.IN_BETWEEN ? (
            filterInputType === FilterValueType.NUMBER ||
            filterInputType === FilterValueType.NEGATIVE_NUMBER ? (
              <React.Fragment>
                <input
                  aria-label="row filter input from"
                  className={`${styles.input} ${styles.rangeInput}`}
                  placeholder="from"
                  type={filterInputType}
                  value={
                    inputValue !== null
                      ? (inputValue as IFilterRange)?.from ?? ''
                      : ''
                  }
                  onKeyDown={handleKeyDown}
                  onChange={(e) =>
                    handleInputValueChange(e.target.value, 'from')
                  }
                  min={minValue}
                />
                <input
                  aria-label="row filter input to"
                  className={`${styles.input} ${styles.rangeInput}
               ${isInputDisabled ? styles.disabled : ''} `}
                  placeholder="to"
                  type={filterInputType}
                  value={
                    inputValue !== null
                      ? (inputValue as IFilterRange)?.to ?? ''
                      : ''
                  }
                  disabled={isInputDisabled}
                  min={minValue}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => handleInputValueChange(e.target.value, 'to')}
                />
              </React.Fragment>
            ) : (
              customDatePicker
            )
          ) : filterInputType === FilterValueType.TEXT ||
            filterInputType === FilterValueType.JSONB ? (
            <TextField
              id="number-input"
              aria-label="row filter input"
              type={filterInputType}
              value={
                inputValue !== null
                  ? (inputValue as string | number | undefined)
                  : ''
              }
              sx={{
                ...textFieldStyles,
                '& > :not(style)': {
                  width: isChatbotOpen ? '14rem' : '18rem',
                  margin: 0,
                  height: '3rem',
                  marginTop: '0.2rem',
                  fontSize: '1.2rem',
                  fontWeight: '400',
                },
              }}
              onKeyDown={handleKeyDown}
              onChange={(e) => handleInputValueChange(e.target.value)}
            />
          ) : filterInputType === FilterValueType.NUMBER ||
            filterInputType === FilterValueType.NEGATIVE_NUMBER ? (
            <TextField
              value={inputValue}
              onChange={(e) => handleInputValueChange(e.target.value)}
              id="tacos-target-value-input"
              variant="outlined"
              sx={textboxNewStyles}
              inputProps={{
                ...defaultNumericFieldProps,
                allowNegative:
                  filterInputType === FilterValueType.NEGATIVE_NUMBER,
              }}
              InputProps={{
                inputComponent: CustomNumberFieldComponent as any,
              }}
            />
          ) : (
            customDatePicker
          )}
        </span>

        <div
          className={styles.trashIcon}
          onClick={removeFilter}
          style={trashIconStyles}
        >
          <TrashIcon size={20} weight="regular" />
        </div>
      </div>
    </div>
  );
};

RowFilterComponent.displayName = 'RowFilterComponent';

export default RowFilterComponent;
