import { WalmartAdGroupStatusEnum } from '@/enums/walmart.enums';
import {
  ICustomDropdownItemOptionMetaDataConfig,
  IFilterBasedCustomDropdownItem,
} from '@/interfaces/dropdown.interfaces';
import { getTitleCaseString } from '@/utils';
import { CircleIcon } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';
import ColumnTags from '../../column-tags/column-tags';
import HoverInfoTooltip from '../../hover-info-tooltip/hover-info-tooltip';
import {
  dropdownOptionContainerStyles,
  optionLabelStyles,
  optionMetaDataContainerStyles,
} from './single-select-custom-filter-dropdown-styles';

interface ICustomDropdownOptionComponentProps<T> {
  option: IFilterBasedCustomDropdownItem<T>;
  optionMetaDataConfig?: ICustomDropdownItemOptionMetaDataConfig<T>;
  activeOptionStatusKey?: keyof T;
  selected: IFilterBasedCustomDropdownItem<T>;
  onSelect: (option: IFilterBasedCustomDropdownItem<T>) => void;
}

export default function CustomDropdownOptionComponent<T>({
  option,
  optionMetaDataConfig,
  activeOptionStatusKey,
  selected,
  onSelect,
}: ICustomDropdownOptionComponentProps<T>) {
  const optionRef = useRef<HTMLDivElement | null>(null);

  const renderStatusComponent = () => {
    if (!option || !option.data || !activeOptionStatusKey) return null;

    const statusValue = option.data?.[activeOptionStatusKey];

    if (
      statusValue &&
      typeof statusValue === 'string' &&
      statusValue?.toLowerCase() === WalmartAdGroupStatusEnum.ENABLED
    ) {
      return (
        <HoverInfoTooltip title={getTitleCaseString(statusValue)}>
          <CircleIcon color="#0AAE57" weight="fill" size={'1rem'} />
        </HoverInfoTooltip>
      );
    } else return null;
  };

  const handleMouseEnter = () => {
    if (optionRef.current) {
      optionRef.current.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
      optionRef.current.style.color = '#77469b';
    }
  };

  const handleMouseLeave = () => {
    if (optionRef.current) {
      if (selected.value === option.value) {
        optionRef.current.style.backgroundColor = '#F1F2F3';
      } else {
        optionRef.current.style.backgroundColor = '';
      }

      optionRef.current.style.color = '';
    }
  };

  useEffect(() => {
    if (optionRef.current && selected.value === option.value) {
      optionRef.current.style.backgroundColor = '#F1F2F3';
    }
  }, [selected.value, option.value]);

  return (
    <div
      style={dropdownOptionContainerStyles}
      ref={optionRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(option)}
    >
      <p style={optionLabelStyles} title={option.label}>
        {option.label}
      </p>
      <div style={optionMetaDataContainerStyles}>
        {renderStatusComponent()}
        {optionMetaDataConfig !== undefined &&
          optionMetaDataConfig.keys?.length > 0 &&
          option &&
          option.data !== null && (
            <ColumnTags
              tagArray={[
                ...optionMetaDataConfig.keys.map(
                  (key) =>
                    option.data?.[key] as string | number | null | undefined
                ),
              ]}
              horizontalAlign="end"
            />
          )}
      </div>
    </div>
  );
}
