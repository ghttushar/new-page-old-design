import {
  ICustomDropdownFilterOption,
  ICustomDropdownItemOptionMetaDataConfig,
  ICustomDropdownSearchConfig,
  IFilterBasedCustomDropdownItem,
} from '@/interfaces/dropdown.interfaces';
import InputLabel from '@mui/material/InputLabel';
import { CaretDownIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import InfoIcon from '../../info-icon/info-icon';
import { inputLabelNewStyles } from '../dropdown-styles';
import CustomFilterDropdownContainer from './custom-filter-dropdown-container';
import styles from './single-select-custom-filter-dropdown.module.scss';

interface ISingleSelectCustomOptionsDropdownProps<T> {
  selected: IFilterBasedCustomDropdownItem<T>;
  options: IFilterBasedCustomDropdownItem<T>[];
  onSelect: (option: IFilterBasedCustomDropdownItem<T>) => void;
  searchConfig?: ICustomDropdownSearchConfig<T>;
  checkboxFilterConfig?: ICustomDropdownFilterOption<T>[];
  optionMetaDataConfig?: ICustomDropdownItemOptionMetaDataConfig<T>;
  activeOptionStatusKey?: keyof T;
  label?: string;
  labelTooltipTitle?: string;
  isDisabled: boolean;
  width: string;
  height: string;
}

export default function SingleSelectCustomOptionsDropdown<T>({
  selected,
  options,
  onSelect,
  searchConfig,
  checkboxFilterConfig,
  optionMetaDataConfig,
  activeOptionStatusKey,
  label,
  labelTooltipTitle,
  isDisabled,
  width,
  height,
}: ISingleSelectCustomOptionsDropdownProps<T>) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [containerOpen, setContainerOpen] = useState<boolean>(false);

  const handleContainerOpen = () => setContainerOpen(true);
  const handleContainerClose = () => setContainerOpen(false);

  const handleSelectOption = (option: IFilterBasedCustomDropdownItem<T>) => {
    onSelect(option);
    handleContainerClose();
  };

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event?.target as Node;

      if (dropdownRef.current?.contains(target)) {
        return;
      }

      handleContainerClose();
    };

    window.addEventListener('scroll', handleScroll, true);

    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  return (
    <div className={styles.dropdownWrapper}>
      <div className={styles.dropdownDetailsContainer}>
        {label !== '' && label !== undefined && (
          <InputLabel
            sx={{
              ...inputLabelNewStyles,
              color: isDisabled ? '#bbb' : 'initial',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              marginBottom: '4px',
            }}
          >
            {label}
            {labelTooltipTitle && (
              <InfoIcon
                title={labelTooltipTitle as string}
                disabled={isDisabled}
              />
            )}
          </InputLabel>
        )}

        <div
          className={`${styles.dropdownContainer} ${
            containerOpen ? styles.focusActiveStyles : ''
          }`}
          style={{
            width: width || 'auto',
            height: height || 'auto',
          }}
          onClick={containerOpen ? handleContainerClose : handleContainerOpen}
          ref={anchorRef}
        >
          <p className={styles.selectedDropdownValue} title={selected.label}>
            {selected.label}
          </p>
          <CaretDownIcon
            className={`${styles.icon} ${containerOpen ? styles.expanded : ''}`}
            size={'1.1rem'}
            color="#808080"
            weight="bold"
          />
        </div>
      </div>

      <CustomFilterDropdownContainer
        containerOpen={containerOpen}
        anchorElement={anchorRef.current}
        dropdownRef={dropdownRef}
        width={width}
        selected={selected}
        options={options}
        onSelect={handleSelectOption}
        searchConfig={searchConfig}
        checkboxFilterConfig={checkboxFilterConfig}
        optionMetaDataConfig={optionMetaDataConfig}
        activeOptionStatusKey={activeOptionStatusKey}
        onDropdownClose={handleContainerClose}
      />
    </div>
  );
}
