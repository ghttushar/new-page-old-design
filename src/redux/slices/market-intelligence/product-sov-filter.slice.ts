import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Frequency, Range } from '@/enums/serp.enums';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { frequency } from 'src/constants/advertising-filter.constants';
import { RangeOptions } from 'src/constants/sov.filter.constants';
import { IBrandNameVariation } from 'src/interfaces/auth.interfaces';
import { IDateRange } from 'src/interfaces/serp.interface';
import serpUtils from 'src/utils/serp.utils';
import { IRootState } from '../../store';

export interface IProductSovFilterForm {
  range: IDropdownItem<Range>;
  frequency: IDropdownItem<Frequency>;
  customDateRange: IDateRange;
  product: IDropdownItem<string>;
  brandName: IDropdownItem<string> | null;
}

export interface IProductSovFilterOptions {
  product: Array<IDropdownItem<string>>;
  range: IDropdownItem<Range>[];
  frequency: IDropdownItem<Frequency>[];
  brandName: IDropdownItem<string>[];
}

export interface IProductSovFilterState {
  filters: IProductSovFilterForm;
  appliedFilters: IProductSovFilterForm;
  options: IProductSovFilterOptions;
}

const initialProductSOVFilters: IProductSovFilterForm = {
  range: RangeOptions[0],
  frequency: frequency[0],
  customDateRange: {
    startDate: '',
    endDate: '',
  },
  product: {
    label: '',
    value: '',
  },
  brandName: null,
};

const initialState: IProductSovFilterState = {
  filters: initialProductSOVFilters,
  appliedFilters: initialProductSOVFilters,
  options: {
    product: [],
    range: RangeOptions,
    frequency: frequency,
    brandName: [],
  },
};

export const productSovFilterSlice = createSlice({
  name: 'productSovFilter',
  initialState,
  reducers: {
    resetProductSovFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    resetProductSovFilters: (state, action: PayloadAction) => {
      state.filters = { ...initialProductSOVFilters };
      state.appliedFilters = { ...initialProductSOVFilters };
    },
    setProductSovFilters: (
      state,
      action: PayloadAction<IProductSovFilterForm>
    ) => {
      state.filters = { ...action.payload };
    },
    setAppliedProductSovFilters: (
      state,
      action: PayloadAction<IProductSovFilterForm>
    ) => {
      state.appliedFilters = { ...action.payload };
    },
    setProductSovProduct: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      state.filters.product = action.payload;
    },

    setAppliedFiltersProductSovProduct: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      state.appliedFilters.product = action.payload;
    },

    setProductSovProductOptions: (
      state,
      action: PayloadAction<IDropdownItem<string>[]>
    ) => {
      state.options.product = action.payload;
    },
    setProductSovBrandOptions: (
      state,
      action: PayloadAction<IBrandNameVariation[]>
    ) => {
      const brandNameVariations = action.payload;
      if (!brandNameVariations.length) return;
      const brandOptions = serpUtils.getBrandOptions(brandNameVariations);
      const selectedBrand = serpUtils.getSelectedBrand(
        brandNameVariations,
        brandOptions
      );
      state.options.brandName = brandOptions;
      state.filters.brandName = selectedBrand;
      state.appliedFilters.brandName = selectedBrand;
    },
    setProductSovRangeOption: (
      state,
      action: PayloadAction<IDropdownItem<Range>>
    ) => {
      const _rangeOptions = JSON.parse(JSON.stringify(RangeOptions));
      _rangeOptions.push(action.payload);
      state.options.range = _rangeOptions;
    },
  },
});

export const {
  resetProductSovFilterStates,
  setProductSovFilters,
  setProductSovProduct,
  setProductSovRangeOption,
  setAppliedProductSovFilters,
  resetProductSovFilters,
  setProductSovBrandOptions,
  setProductSovProductOptions,
  setAppliedFiltersProductSovProduct,
} = productSovFilterSlice.actions;

export const selectProductSovFilter = (state: IRootState) =>
  state.productSovFilter.filters;
export const selectAppliedProductSovFilter = (state: IRootState) =>
  state.productSovFilter.appliedFilters;
export const selectProductSovOptions = (state: IRootState) =>
  state.productSovFilter.options;

const productSovFilterReducer = productSovFilterSlice.reducer;
export default productSovFilterReducer;
