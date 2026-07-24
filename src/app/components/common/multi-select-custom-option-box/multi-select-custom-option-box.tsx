import {
  IDaypartingCampaignList,
  IDaypartingJob,
  IWalmartDaypartingJob,
} from '@/interfaces/day-parting.interfaces';
import Typography from '@mui/material/Typography';
import { CaretUpIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IMultiSelectCustomDropdownItem } from 'src/interfaces/dropdown.interfaces';
import MultiselectDropdownContent from './multi-select-custom-option-dropdown';
import styles from './multiselect-custom-option-box.module.scss';

interface MultiselectOptionBoxProps {
  options: IMultiSelectCustomDropdownItem[];
  label?: string;
  onSelect: (selectedOptions: IMultiSelectCustomDropdownItem[]) => void;
  width?: string;
  height?: string;
  isHorizontalScroll?: boolean;
  emptyOptionListMessage: string;
  disabled?: boolean;
  top?: string;
  isFilter?: boolean;
  campaigns?: IDaypartingCampaignList[];
  dropShadow?: boolean;
  handleEditRuleClick: (job: IWalmartDaypartingJob | IDaypartingJob) => void;
}

export default function MultiselectCustomOptionBox({
  options,
  label = '',
  onSelect,
  width,
  height,
  isHorizontalScroll = true,
  emptyOptionListMessage,
  disabled = false,
  top,
  isFilter = false,
  campaigns,
  dropShadow = false,
  handleEditRuleClick,
}: MultiselectOptionBoxProps) {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const optionBoxRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => {
    if (disabled) {
      return;
    }
    setOpenDropdown((prev) => !prev);
  }, [disabled]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      optionBoxRef.current &&
      !optionBoxRef.current.contains(event.target as Node)
    ) {
      setOpenDropdown(false);
    }
  }, []);

  useEffect(() => {
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdown, handleClickOutside]);

  const selected = useMemo(
    () => options.slice(1).filter((option) => option.selected).length,
    [options]
  );

  const selectedCount = useMemo(
    () => (selected > 9 || selected === 0 ? selected : `0${selected}`),
    [selected]
  );

  const isAllSelected = useMemo(
    () => options.length - 1 !== 0 && selected === options.length - 1,
    [options.length, selected]
  );

  const selectedLabels = useMemo(
    () =>
      options
        .slice(1)
        .filter((item) => item.selected)
        .map((item) => item.label)
        .join(', '),
    [options]
  );

  return (
    <div
      className={styles.optionBoxContainer}
      ref={optionBoxRef}
      style={{
        width: width ?? '100%',
      }}
    >
      <div
        className={styles.optionBoxDropdownContainer}
        onClick={toggleDropdown}
      >
        <Typography
          fontSize="1.2rem"
          fontWeight={400}
          color={disabled ? '#bbb' : 'initial'}
        >
          {label}
        </Typography>

        <div
          className={`${styles.optionBoxDropdown} ${
            openDropdown ? styles.active : ''
          } ${disabled ? styles.optionBoxDropdownDisabled : ''}`}
          style={{
            width: width || '100%',
            height: height || '3rem',
            cursor: disabled ? 'not-allowed' : 'pointer',
            boxShadow:
              dropShadow === false
                ? ''
                : '0rem 0.2rem 0.4rem 0rem rgba(0, 0, 0, 0.1)',
            border:
              dropShadow === false ? '1px solid #dadeeb' : '1px solid white',
          }}
        >
          {isAllSelected ? (
            <Typography
              textOverflow={'ellipsis'}
              fontSize="1.2rem"
              overflow={'hidden'}
              whiteSpace={'nowrap'}
              fontWeight={500}
              color={disabled ? '#a3a3a3' : ''}
            >
              All Campaigns Selected
            </Typography>
          ) : (
            <span className={styles.dropdownLabel}>
              <span className={styles.subLabel}>{selectedCount}</span>

              {selected === 0 ? (
                label
              ) : (
                <Typography
                  textOverflow={'ellipsis'}
                  fontSize="1.2rem"
                  overflow={'hidden'}
                  whiteSpace={'nowrap'}
                  fontWeight={500}
                  color={disabled ? '#a3a3a3' : ''}
                >
                  {selectedLabels}
                </Typography>
              )}
            </span>
          )}

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

      {openDropdown && (
        <MultiselectDropdownContent
          options={options}
          onSelect={onSelect}
          width={width}
          isHorizontalScroll={isHorizontalScroll}
          emptyOptionListMessage={emptyOptionListMessage}
          campaigns={campaigns}
          handleEditRuleClick={handleEditRuleClick}
        />
      )}
    </div>
  );
}
