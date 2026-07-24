import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Frequency, Range } from '@/enums/serp.enums';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { frequency } from 'src/constants/advertising-filter.constants';
import {
  MultiSelectOptions,
  RangeOptions,
} from 'src/constants/sov.filter.constants';
import { IBrandNameVariation } from 'src/interfaces/auth.interfaces';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import { IDateRange } from 'src/interfaces/serp.interface';
import serpUtils from 'src/utils/serp.utils';
import { IRootState } from '../../store';

export interface IKeywordSovFilterForm {
  range: IDropdownItem<Range>;
  frequency: IDropdownItem<Frequency>;
  customDateRange: IDateRange;
  keywords: IDropdownItem<string>[];
  brandName: IDropdownItem<string>;
}

export interface IKeywordSovFilterOptions {
  keywords: IMultiSelectDropdownItem[];
  range: IDropdownItem<Range>[];
  frequency: IDropdownItem<Frequency>[];
  brandName: IDropdownItem<string>[];
}

export interface IKeywordSovFilterState {
  isKeywordListUpdated: boolean;
  filters: IKeywordSovFilterForm;
  appliedFilters: IKeywordSovFilterForm;
  options: IKeywordSovFilterOptions;
}

const initialKeywordSOVFilters: IKeywordSovFilterForm = {
  range: RangeOptions[0],
  frequency: frequency[0],
  customDateRange: {
    startDate: '',
    endDate: '',
  },
  keywords: [],
  brandName: {
    label: '',
    value: '',
  },
};

const initialState: IKeywordSovFilterState = {
  isKeywordListUpdated: false,
  filters: initialKeywordSOVFilters,
  appliedFilters: initialKeywordSOVFilters,
  options: {
    keywords: MultiSelectOptions,
    range: RangeOptions,
    frequency: frequency,
    brandName: [],
  },
};

export const keywordSovFilterSlice = createSlice({
  name: 'keywordSovFilter',
  initialState,
  reducers: {
    resetKeywordSovFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    resetKeywordSovFilters: (state, action: PayloadAction) => {
      state.filters = { ...initialKeywordSOVFilters };
      state.appliedFilters = { ...initialKeywordSOVFilters };
    },
    setKeywordSovFilters: (
      state,
      action: PayloadAction<IKeywordSovFilterForm>
    ) => {
      state.filters = { ...action.payload };
    },
    setAppliedKeywordSovFilters: (
      state,
      action: PayloadAction<IKeywordSovFilterForm>
    ) => {
      state.appliedFilters = { ...action.payload };
    },
    setKeywordSovKeywordOptions: (
      state,
      action: PayloadAction<IMultiSelectDropdownItem[]>
    ) => {
      state.isKeywordListUpdated = true;
      state.options.keywords = action.payload;
      state.filters.keywords = action.payload.filter(
        (item) => item.selected === true
      );
    },
    setKeywordSovBrandOptions: (
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
    setKeywordSovRangeOption: (
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
  resetKeywordSovFilterStates,
  setKeywordSovFilters,
  setKeywordSovKeywordOptions,
  setKeywordSovRangeOption,
  setAppliedKeywordSovFilters,
  resetKeywordSovFilters,
  setKeywordSovBrandOptions,
} = keywordSovFilterSlice.actions;

export const selectKeywordSovFilter = (state: IRootState) =>
  state.keywordSovFilter.filters;

export const selectAppliedKeywordSovFilter = (state: IRootState) =>
  state.keywordSovFilter.appliedFilters;
export const selectKeywordSovOptions = (state: IRootState) =>
  state.keywordSovFilter.options;
export const selectIsKeywordListUpdated = (state: IRootState) =>
  state.keywordSovFilter.isKeywordListUpdated;

const keywordSovFilterReducer = keywordSovFilterSlice.reducer;
export default keywordSovFilterReducer;
