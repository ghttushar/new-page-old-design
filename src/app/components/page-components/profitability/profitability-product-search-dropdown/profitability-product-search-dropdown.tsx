import {
  autocompleteStyles,
  customPaperStyle,
} from '@/app/components/common/dropdown/searchable-dropdown-styles';
import VirtualizedMultiSelectDropdown from '@/app/components/common/dropdown/virtualized-multi-select-dropdown';
import ProfitabilityProductDetails from '@/app/components/pages/profitability-page/product-details/profitability-product-details';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { generateNItems } from '@/utils';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { Checkbox } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { XIcon } from '@phosphor-icons/react';
import React, { useEffect, useMemo, useState } from 'react';
import { ALL_VALUE, SELECT_ALL } from 'src/constants';
import { IMultiSelectProductSearchDropdownItem } from 'src/interfaces/dropdown.interfaces';
import {
  checkboxStyles,
  inputLabelStyles,
} from '../../advertising-create-dialogs/advertising-create-dialogs-styles';
import styles from './profitability-product-search-dropdown.module.scss';

export interface IProfitabilityProductSearchDropdownProps {
  options: IMultiSelectProductSearchDropdownItem[];
  label?: string;
  placeholder?: string;
  onSelect: (selectedOptions: IMultiSelectProductSearchDropdownItem[]) => void;
  width?: string;
  height?: string;
  background?: string;
  disabled?: boolean;
  customFilterOptions?: (
    options: IMultiSelectProductSearchDropdownItem[],
    inputValue: string
  ) => IMultiSelectProductSearchDropdownItem[];
  handleClearAllOption: () => void;
  isLoading?: boolean;
  marketplace: MarketplaceEnum;
}

const ITEM_HEIGHT = 80;
const MAX_VISIBLE_ITEMS = 4;

export default function ProfitabilityProductSearchDropdown({
  options,
  label,
  placeholder,
  onSelect,
  width,
  height,
  background,
  disabled,
  customFilterOptions,
  handleClearAllOption,
  isLoading = false,
  marketplace,
}: IProfitabilityProductSearchDropdownProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const isAllSelected = (
    selectedOptions: IMultiSelectProductSearchDropdownItem[]
  ) =>
    selectedOptions.every(
      (option) => option.value === ALL_VALUE || option.selected
    );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchTerm(event.target.value);

    if (!disabled) {
      setIsOpen(true);
    }
  };

  const selectedOptions = options.filter((option) => option.selected);

  const selectedProductsCount = selectedOptions.filter(
    (option) => option.value !== ALL_VALUE
  ).length;

  const filteredOptions = useMemo(() => {
    const selectAllOption = options.find(
      (option) => option.value === ALL_VALUE
    );
    const optionsWithoutSelectAll = options.filter(
      (option) => option.value !== ALL_VALUE
    );

    if (optionsWithoutSelectAll.length === 0) {
      return [];
    }

    if (customFilterOptions) {
      const customFilteredOptions = customFilterOptions(
        optionsWithoutSelectAll,
        searchTerm
      );

      return selectAllOption
        ? [
            selectAllOption,
            ...customFilteredOptions.filter(
              (option) => option.value !== ALL_VALUE
            ),
          ]
        : customFilteredOptions;
    }

    const searchTerLower = searchTerm?.toLowerCase();
    const filteredWithoutSelectAll = optionsWithoutSelectAll.filter(
      (option) =>
        option.label?.toLowerCase().includes(searchTerLower) ||
        option.itemId?.toLowerCase().includes(searchTerLower) ||
        option.value?.toLowerCase().includes(searchTerLower)
    );

    return selectAllOption
      ? [selectAllOption, ...filteredWithoutSelectAll]
      : filteredWithoutSelectAll;
  }, [customFilterOptions, options, searchTerm]);

  const visibleItemsCount = filteredOptions.filter(
    (option) => option.value !== ALL_VALUE
  ).length;

  const selectedVisibleItemsCount = filteredOptions.filter(
    (option) => option.value !== ALL_VALUE && option.selected
  ).length;

  const areAllVisibleItemsSelected =
    visibleItemsCount > 0 && selectedVisibleItemsCount === visibleItemsCount;

  const isVisibleSelectionIndeterminate =
    selectedVisibleItemsCount > 0 &&
    selectedVisibleItemsCount < visibleItemsCount;

  const handleSelect = (value: string) => {
    if (options.length === 0) {
      return;
    }

    const selectAllIndex = options.findIndex(
      (option) => option.value === ALL_VALUE
    );

    if (value === ALL_VALUE) {
      const visibleOptions = filteredOptions.filter(
        (option) => option.value !== ALL_VALUE
      );

      if (visibleOptions.length === 0) {
        return;
      }

      const visibleValueSet = new Set(
        visibleOptions.map((option) => option.value)
      );
      const allVisibleSelected = visibleOptions.every(
        (option) => option.selected
      );

      const updatedOptions = options.map((option) => {
        if (option.value === ALL_VALUE) {
          return { ...option };
        }

        if (visibleValueSet.has(option.value)) {
          return { ...option, selected: !allVisibleSelected };
        }

        return option;
      });

      if (selectAllIndex !== -1) {
        updatedOptions[selectAllIndex] = {
          ...updatedOptions[selectAllIndex],
          selected: isAllSelected(updatedOptions),
        };
      }

      onSelect(updatedOptions);
      return;
    }

    const updatedOptions = options.map((option) => ({
      ...option,
      selected: option.value === value ? !option.selected : option.selected,
    }));

    if (selectAllIndex !== -1) {
      updatedOptions[selectAllIndex] = {
        ...updatedOptions[selectAllIndex],
        selected: isAllSelected(updatedOptions),
      };
    }

    onSelect(updatedOptions);
  };

  const openDropdown = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClearAllOption();
    setSearchTerm('');
    const updatedOptions = options.map((option) => ({
      ...option,
      selected: false,
    }));
    onSelect(updatedOptions);
  };

  const loadingContent = (
    <div className={styles.loadingContent}>
      {generateNItems(3, 0).map((_, index) => (
        <span key={`loading-item-${index}`}>
          <ProfitabilityProductDetails
            isLoading={true}
            name={''}
            sku={''}
            imgUrl={''}
            itemId={''}
            productPrice={0}
            showPerformance={false}
          />
        </span>
      ))}
    </div>
  );

  const selectedCountAdornment =
    selectedProductsCount > 0 ? (
      <div className={styles.selectionCounterContainer} onClick={openDropdown}>
        <span className={styles.selectionCounterBadge}>
          {selectedProductsCount} Product(s) Selected
          <XIcon
            onClick={handleClearAll}
            className={styles.clearIcon}
            size={'1.2rem'}
          />
        </span>
      </div>
    ) : null;

  const renderOptionContent = (
    option: IMultiSelectProductSearchDropdownItem
  ) => (
    <div className={styles.optionWrapper}>
      <Checkbox
        checked={
          option.value === ALL_VALUE
            ? areAllVisibleItemsSelected
            : option.selected
        }
        indeterminate={
          option.value === ALL_VALUE && isVisibleSelectionIndeterminate
        }
        indeterminateIcon={
          <IndeterminateCheckBoxIcon
            style={{
              color: '#77469b',
            }}
          />
        }
        sx={checkboxStyles}
        disableRipple={true}
      />

      {option.label === SELECT_ALL ? (
        <div className={styles.selectAllContainer}>
          <span className={styles.selectAllText}>
            Select All ({visibleItemsCount} products)
          </span>
        </div>
      ) : (
        <span className="cursor-pointer">
          <ProfitabilityProductDetails
            isLoading={false}
            name={option.label || 'Unnamed Product'}
            sku={option.value || 'N/A'}
            imgUrl={option.imgURL || ''}
            itemId={option.itemId || 'N/A'}
            productPrice={option.price || 0}
            showPerformance={false}
            marketplace={marketplace}
          />
        </span>
      )}
    </div>
  );

  return (
    <div
      className={styles.containerWrapper}
      style={{
        width: width ? width : 'auto',
      }}
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
        <VirtualizedMultiSelectDropdown<IMultiSelectProductSearchDropdownItem>
          options={filteredOptions}
          inputValue={searchTerm}
          onInputChange={handleInputChange}
          open={isOpen}
          onOpen={openDropdown}
          onClose={closeDropdown}
          disabled={disabled}
          placeholder={selectedOptions.length > 0 ? '' : placeholder}
          width={width}
          height={height}
          background={background}
          itemHeight={ITEM_HEIGHT}
          maxVisibleItems={MAX_VISIBLE_ITEMS}
          loading={isLoading}
          loadingContent={loadingContent}
          endAdornment={selectedCountAdornment}
          textFieldSx={{
            ...autocompleteStyles,
            background: 'white',
            borderRadius: '0.4rem',
            '& .MuiOutlinedInput-input': {
              marginLeft: '1rem',
            },
          }}
          inputRootSx={{
            paddingRight:
              selectedProductsCount > 0 ? '8rem !important' : '4rem !important',
            margin: '0rem',
            boxShadow: 'none',
            borderRadius: '0.4rem',
            color: '#000000',
            fontSize: '1.2rem',
          }}
          paperStyle={customPaperStyle}
          containerClassName={styles.autocomplete}
          inputContainerClassName={styles.inputContainer}
          getOptionKey={(option) => `${option.itemId}-${option.value}`}
          isOptionSelected={(option) => option.selected}
          onOptionSelect={(option) => handleSelect(option.value)}
          renderOptionContent={renderOptionContent}
          optionBaseStyle={{
            justifyContent: 'center',
          }}
          optionSelectedStyle={{
            background: '#f4f5f6',
            color: '#77469b',
          }}
        />
      </FormControl>
    </div>
  );
}
