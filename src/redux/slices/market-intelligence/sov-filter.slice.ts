import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  Frequency,
  MarketplaceEnum,
  Positions,
  Range,
} from '@/enums/serp.enums';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  KeywordOptions,
  MIFrequencyOptions,
  PositionOptionsAmazon,
  PositionOptionsWalmart,
  RangeOptions,
} from 'src/constants/sov.filter.constants';
import { IBrandNameVariation } from 'src/interfaces/auth.interfaces';
import { IDateRange, ISovFilter } from 'src/interfaces/serp.interface';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import serpUtils from 'src/utils/serp.utils';
import { IRootState } from '../../store';

export interface ISovFilterForm {
  keyword: IDropdownItem<string>;
  position: IDropdownItem<Positions>;
  range: IDropdownItem<Range>;
  frequency: IDropdownItem<Frequency>;
  customDateRange: IDateRange;
  brandName: IDropdownItem<string>;
}

export interface ISovFilterOptions {
  keyword: IDropdownItem<string>[];
  position: IDropdownItem<Positions>[];
  range: IDropdownItem<Range>[];
  frequency: IDropdownItem<Frequency>[];
  brandName: IDropdownItem<string>[];
}

export interface ISovFilterState {
  isKeywordListUpdated: boolean;
  filters: ISovFilterForm;
  options: ISovFilterOptions;
  appliedFilters: ISovFilter;
}

const marketIntelligenceFilters =
  localStorageUtils.getMarketIntelligenceFilters();
const initialState: ISovFilterState = {
  isKeywordListUpdated: false,
  filters: marketIntelligenceFilters.filters,
  options: {
    keyword: KeywordOptions,
    position: PositionOptionsAmazon,
    range: RangeOptions,
    frequency: MIFrequencyOptions,
    brandName: [],
  },
  appliedFilters: serpUtils.getFilters(
    marketIntelligenceFilters.filters,
    marketIntelligenceFilters.isInitialFilters
  ),
};

export const sovFilterSlice = createSlice({
  name: 'sovFilter',
  initialState,
  reducers: {
    resetSovFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setSovFilters: (state, action: PayloadAction<ISovFilterForm>) => {
      state.filters = { ...action.payload };
    },
    setKeywordFilter: (state, action: PayloadAction<IDropdownItem<string>>) => {
      state.filters.keyword = { ...action.payload };
      state.appliedFilters.keyword = action.payload.value;
    },
    setKeywordOptions: (
      state,
      action: PayloadAction<IDropdownItem<string>[]>
    ) => {
      state.isKeywordListUpdated = true;
      state.options.keyword = [...KeywordOptions, ...action.payload];
    },
    setRangeOption: (state, action: PayloadAction<IDropdownItem<Range>>) => {
      const _rangeOptions = JSON.parse(JSON.stringify(RangeOptions));
      _rangeOptions.push(action.payload);
      state.options.range = _rangeOptions;
    },
    setBrandOptions: (state, action: PayloadAction<IBrandNameVariation[]>) => {
      const brandNameVariations = action.payload;
      if (!brandNameVariations.length) return;
      const brandOptions = serpUtils.getBrandOptions(brandNameVariations);
      const selectedBrand = serpUtils.getSelectedBrand(
        brandNameVariations,
        brandOptions
      );
      state.options.brandName = brandOptions;
      state.filters.brandName = selectedBrand;
      state.appliedFilters.brandName = selectedBrand.value;
    },

    setAppliedSovFilters: (state, action: PayloadAction<ISovFilter>) => {
      state.appliedFilters = action.payload;
    },
    setPositionOption: (state, action: PayloadAction<string>) => {
      if (action.payload === MarketplaceEnum.AMAZON) {
        state.options.position = PositionOptionsAmazon;
        state.filters.position = PositionOptionsAmazon[0];
      } else if (action.payload === MarketplaceEnum.WALMART) {
        state.options.position = PositionOptionsWalmart;
        state.filters.position = PositionOptionsWalmart[0];
      }
    },
  },
});

export const {
  resetSovFilterStates,
  setSovFilters,
  setKeywordOptions,
  setRangeOption,
  setAppliedSovFilters,
  setPositionOption,
  setBrandOptions,
  setKeywordFilter,
} = sovFilterSlice.actions;

export const selectSovFilter = (state: IRootState) => state.sovFilter.filters;
export const selectSovOptions = (state: IRootState) => state.sovFilter.options;
export const selectIsKeywordListUpdated = (state: IRootState) =>
  state.sovFilter.isKeywordListUpdated;
export const selectAppliedSovFilters = (state: IRootState) =>
  state.sovFilter.appliedFilters;

const sovFilterReducer = sovFilterSlice.reducer;
export default sovFilterReducer;
