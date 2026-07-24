import { IDateRange } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { range } from 'src/constants/advertising-filter.constants';
import { IRootState } from 'src/redux/store';

export interface IBidderDashboardHeaderFilterForm {
  range: IDropdownItem<string>;
  customDateRange: IDateRange;
  accountId?: string;
  marketplace?: string;
  status?: string;
  brandName?: string;
}

export interface IBidderDashboardFilterState {
  bidderDashboardHeaderFilters: IBidderDashboardHeaderFilterForm;
}

const initialState: IBidderDashboardFilterState = {
  bidderDashboardHeaderFilters: {
    range: range[0],
    customDateRange: {
      startDate: '',
      endDate: '',
    },
    accountId: '',
    marketplace: '',
    status: '',
    brandName: '',
  },
};

export const bidderDashboardSlice = createSlice({
  name: 'bidderDashboard',
  initialState,
  reducers: {
    resetBidderDashboardFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setBidderDashboardHeaderFilters: (
      state,
      action: PayloadAction<IBidderDashboardHeaderFilterForm>
    ) => {
      state.bidderDashboardHeaderFilters = { ...action.payload };
    },
    setBidderDashboardHeaderFiltersRange: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      state.bidderDashboardHeaderFilters.range = action.payload;
    },
    setBidderDashboardHeaderFiltersCustomRange: (
      state,
      action: PayloadAction<IDateRange>
    ) => {
      state.bidderDashboardHeaderFilters.customDateRange = action.payload;
    },
    setBidderDashboardAccountFilter: (state, action: PayloadAction<string>) => {
      state.bidderDashboardHeaderFilters.accountId = action.payload;
    },
    setBidderDashboardMarketplaceFilter: (
      state,
      action: PayloadAction<string>
    ) => {
      state.bidderDashboardHeaderFilters.marketplace = action.payload;
    },
    setBidderDashboardStatusFilter: (state, action: PayloadAction<string>) => {
      state.bidderDashboardHeaderFilters.status = action.payload;
    },
    setBidderDashboardBrandNameFilter: (
      state,
      action: PayloadAction<string>
    ) => {
      state.bidderDashboardHeaderFilters.brandName = action.payload;
    },
  },
});

export const {
  resetBidderDashboardFilterStates,
  setBidderDashboardHeaderFilters,
  setBidderDashboardHeaderFiltersCustomRange,
  setBidderDashboardHeaderFiltersRange,
  setBidderDashboardAccountFilter,
  setBidderDashboardMarketplaceFilter,
  setBidderDashboardStatusFilter,
  setBidderDashboardBrandNameFilter,
} = bidderDashboardSlice.actions;

export const selectBidderDashboardHeaderFilters = (state: IRootState) => {
  return state.bidderDashboard?.bidderDashboardHeaderFilters;
};

const bidderDashboardReducer = bidderDashboardSlice.reducer;
export default bidderDashboardReducer;
