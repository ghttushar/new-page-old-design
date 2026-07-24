import { customRangeFilterOption } from '@/constants';
import { Frequency, MarketplaceEnum, Range } from '@/enums/serp.enums';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import { IDateRange } from 'src/interfaces/serp.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  IProductSovFilterForm,
  selectProductSovFilter,
  selectProductSovOptions,
  setAppliedFiltersProductSovProduct,
  setAppliedProductSovFilters,
  setProductSovBrandOptions,
  setProductSovFilters,
  setProductSovProduct,
  setProductSovProductOptions,
  setProductSovRangeOption,
} from 'src/redux/slices/market-intelligence/product-sov-filter.slice';
import ProductSovService from 'src/services/market-intelligence/product-sov.service';
import { filterBrandVariationsByMarketplace } from 'src/utils/auth.utils';
import { isCustomDateRangeSet } from 'src/utils/datetime.utils';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import CustomDateRangePickerWrapper from '../../shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import Dropdown, { IDropdownItem } from '../dropdown/dropdown';
import SearchableDropdown from '../dropdown/searchable-dropdown';
import styles from './filter.module.scss';

export default function ProductSOVFilter({
  marketplace,
  countryCode,
  setIsLoading,
}: {
  marketplace: MarketplaceEnum;
  setIsLoading: (val: boolean) => void;
  countryCode?: string;
}) {
  const filters = useAppSelector(selectProductSovFilter);
  const options = useAppSelector(selectProductSovOptions);
  const [showDateRangeModal, setShowDateRangeModal] = useState<boolean>(false);
  const [prevRange, setPrevRange] = useState<IDropdownItem<Range> | null>(null);
  const [isRunDisabled, setIsRunDisabled] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const setFilters = (productSovFilters: IProductSovFilterForm) =>
    dispatch(setProductSovFilters(productSovFilters));

  useEffect(() => {
    const brandNameVariations = localStorageUtils.getBrandNameVariations();

    dispatch(
      setProductSovBrandOptions(
        filterBrandVariationsByMarketplace(brandNameVariations, marketplace)
      )
    );
  }, [dispatch, marketplace]);

  useEffect(() => {
    if (!filters.brandName) return;
    setIsLoading(true);
    ProductSovService.getProducts(marketplace, filters.brandName.value)
      .then((res) => {
        const products: IDropdownItem<string>[] = res.data.data.map(
          (product) => {
            const key = `[${product.productId}] ${product.title}`;
            return {
              label: key,
              value: product.productId,
              selected: true,
            };
          }
        );
        if (!products.length) return;
        dispatch(setProductSovProduct(products[0]));
        dispatch(setAppliedFiltersProductSovProduct(products[0]));
        dispatch(setProductSovProductOptions(products));
      })
      .finally(() => setIsLoading(false));
  }, [dispatch, filters.brandName, marketplace]);

  const onProductSelect = (value: IDropdownItem<string>) => {
    dispatch(setProductSovProduct(value));
    setIsRunDisabled(false);
  };

  const onRangeSelect = (value: IDropdownItem<Range>) => {
    setPrevRange(filters.range);

    setFilters({
      ...filters,
      range: value,
    });

    if (value.value !== Range.CUSTOM_RANGE) {
      setIsRunDisabled(false);
    } else {
      setIsRunDisabled(true);
    }
  };

  const onFrequencyChange = (value: IDropdownItem<Frequency>) => {
    setFilters({
      ...filters,
      frequency: value,
    });
    setIsRunDisabled(false);
  };

  const setCustomDateRange = (value: IDateRange) => {
    setFilters({
      ...filters,
      customDateRange: value,
    });
  };

  const onBrandChange = (value: IDropdownItem<string>) => {
    setFilters({
      ...filters,
      brandName: value,
    });
    setIsRunDisabled(false);
  };

  const handleRun = () => {
    dispatch(setAppliedProductSovFilters(filters));
    setIsRunDisabled(true);
  };

  const handleSetCustomDateRangeForModal = (dateRange: IDateRange) => {
    setCustomDateRange(dateRange);
    setFilters({
      ...filters,
      customDateRange: dateRange,
      range: customRangeFilterOption,
    });
    if (isCustomDateRangeSet(dateRange)) {
      setIsRunDisabled(false);
    }
  };

  useEffect(() => {
    dispatch(setProductSovRangeOption(customRangeFilterOption));
  }, [dispatch]);

  return (
    <div className={styles.filterContent}>
      {filters.brandName !== null && (
        <React.Fragment>
          <SearchableDropdown
            label={'Products'}
            selected={filters.product}
            options={options.product}
            onSelect={onProductSelect}
            width="100%"
          />
          <CustomDateRangePickerWrapper
            title={'Range'}
            handleDateChange={onRangeSelect}
            setCustomDateRange={handleSetCustomDateRangeForModal}
            rangeOptions={options.range}
            defaultPreset={filters.range}
            selectedCustomDateRange={filters.customDateRange}
          />

          <Dropdown
            options={options.frequency}
            label={'Frequency'}
            onSelect={onFrequencyChange}
            selected={filters.frequency}
            width="100%"
          />
          <SearchableDropdown
            options={options.brandName}
            selected={filters.brandName}
            label={'Brand'}
            onSelect={onBrandChange}
            width="100%"
          />
          <Button
            variant="contained"
            onClick={handleRun}
            disabled={isRunDisabled}
            sx={{
              backgroundColor: '#77469b',
              borderRadius: '0rem',
              height: '3rem',
              width: '8rem',
              textTransform: 'none',
              marginTop: '1.6rem',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#77469b',
                boxShadow: 'none',
              },
              fontSize: '1.2rem',
            }}
          >
            Run
          </Button>
        </React.Fragment>
      )}
    </div>
  );
}
