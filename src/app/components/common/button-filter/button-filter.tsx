import Button from '@mui/material/Button';
import { useEffect, useRef } from 'react';

import { FadersIcon } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { ALL_LABEL, ALL_VALUE } from 'src/constants';
import { useAppSelector } from 'src/redux/hooks';
import { selectSelectedBrands } from 'src/redux/slices/market-intelligence/market-intelligence.slice';
import { IDropdownItem } from '../dropdown/dropdown';
import styles from './button.filter.module.scss';
import SearchFilter from './search-filter/search-filter';

interface IButtonFilterProps {
  title: string;
  brands: string[];
}

const ButtonFilter: React.FC<IButtonFilterProps> = ({ title, brands }) => {
  const [initialOptions, setInitialOptions] = useState<IDropdownItem<string>[]>(
    []
  );
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const selectedBrands = useAppSelector(selectSelectedBrands);

  const filterRef = useRef<HTMLDivElement | null>(null);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  useEffect(() => {
    const options = brands.map<IDropdownItem<string>>((brand) => ({
      label: brand,
      value: brand,
      selected: selectedBrands.includes(brand),
    }));
    setInitialOptions([
      { label: ALL_LABEL, value: ALL_VALUE, selected: false },
      ...options,
    ]);
  }, [brands, selectedBrands]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node) &&
        event.target !== document.body
      ) {
        setFilterOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className={styles.buttonFilterContainer} ref={filterRef}>
      <Button
        disableRipple
        startIcon={<FadersIcon size={15} color="#464646" />}
        variant="contained"
        className={styles.optionFilterButton}
        onClick={toggleFilter}
      >
        {title}
      </Button>

      <div className={styles.optionFilter} data-test="option-filter">
        {filterOpen && (
          <SearchFilter
            initialOptions={initialOptions}
            setFilterOpen={setFilterOpen}
          />
        )}
      </div>
    </div>
  );
};

export default ButtonFilter;
